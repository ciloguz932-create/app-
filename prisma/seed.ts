import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { ENGLISH_WORDS, ARABIC_WORDS, FRENCH_WORDS, READING_PASSAGES } from "../src/lib/seed-data";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Seeding database...");

  await prisma.appState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, streak: 0, dailyGoal: 10 },
  });

  const allWords = [...ENGLISH_WORDS, ...ARABIC_WORDS, ...FRENCH_WORDS];
  let cardCount = 0;

  for (const word of allWords) {
    const existing = await prisma.card.findFirst({
      where: { word: word.word, language: word.language },
    });
    if (!existing) {
      await prisma.card.create({
        data: {
          word: word.word,
          translation: word.translation,
          language: word.language,
          example: word.example ?? null,
        },
      });
      cardCount++;
    }
  }

  let passageCount = 0;
  for (const passage of READING_PASSAGES) {
    const existing = await prisma.readingPassage.findFirst({
      where: { title: passage.title },
    });
    if (!existing) {
      await prisma.readingPassage.create({
        data: {
          title: passage.title,
          content: passage.content,
          language: passage.language,
          difficulty: passage.difficulty,
          questions: JSON.stringify(passage.questions),
        },
      });
      passageCount++;
    }
  }

  console.log(`✅ Seeded ${cardCount} cards, ${passageCount} reading passages`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
