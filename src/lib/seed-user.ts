import type { PrismaClient } from "@/generated/prisma/client";
import { ENGLISH_WORDS, ARABIC_WORDS, FRENCH_WORDS } from "@/lib/seed-data";

// Creates the AppState row and starter vocabulary for a newly registered user.
// Shared by /api/auth/register and prisma/seed.ts.
export async function seedUserData(prisma: PrismaClient, userId: string) {
  await prisma.appState.upsert({
    where: { userId },
    update: {},
    create: { userId, streak: 0, dailyGoal: 10 },
  });

  const existing = await prisma.card.count({ where: { userId } });
  if (existing > 0) return 0;

  const allWords = [...ENGLISH_WORDS, ...ARABIC_WORDS, ...FRENCH_WORDS];
  const result = await prisma.card.createMany({
    data: allWords.map((w) => ({
      userId,
      word: w.word,
      translation: w.translation,
      language: w.language,
      topic: "core",
      example: w.example ?? null,
    })),
  });
  return result.count;
}
