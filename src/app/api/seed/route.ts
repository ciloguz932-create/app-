import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ENGLISH_WORDS, ARABIC_WORDS, FRENCH_WORDS, READING_PASSAGES } from "@/lib/seed-data";

// POST /api/seed?secret=YOUR_SEED_SECRET
// One-time endpoint to create tables + seed data in production (Turso).
// Set SEED_SECRET env var in Vercel, then call once and remove or leave it.

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.SEED_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "SEED_SECRET env var not set — seeding disabled" },
      { status: 403 }
    );
  }
  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const results = { cards: 0, passages: 0, errors: [] as string[] };

  try {
    // Ensure AppState row exists
    await prisma.appState.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, streak: 0, dailyGoal: 10 },
    });

    // Seed vocabulary cards
    const allWords = [...ENGLISH_WORDS, ...ARABIC_WORDS, ...FRENCH_WORDS];
    for (const word of allWords) {
      try {
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
          results.cards++;
        }
      } catch (e) {
        results.errors.push(`card "${word.word}": ${e}`);
      }
    }

    // Seed reading passages
    for (const passage of READING_PASSAGES) {
      try {
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
          results.passages++;
        }
      } catch (e) {
        results.errors.push(`passage "${passage.title}": ${e}`);
      }
    }

    return NextResponse.json({
      success: true,
      seeded: { cards: results.cards, passages: results.passages },
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Seed failed", detail: String(err) },
      { status: 500 }
    );
  }
}
