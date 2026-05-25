import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ENGLISH_WORDS, ARABIC_WORDS, FRENCH_WORDS, READING_PASSAGES } from "@/lib/seed-data";

async function runSeed() {
  const results = { cards: 0, passages: 0, errors: [] as string[] };

  await prisma.appState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, streak: 0, dailyGoal: 10 },
  });

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

  return results;
}

function checkSecret(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.SEED_SECRET;
  if (!expected) return "SEED_SECRET env var not set";
  if (secret !== expected) return "Invalid secret";
  return null;
}

export async function GET(req: NextRequest) {
  const err = checkSecret(req);
  if (err) return NextResponse.json({ error: err }, { status: err.includes("Invalid") ? 401 : 403 });

  try {
    const results = await runSeed();
    return NextResponse.json({
      success: true,
      seeded: { cards: results.cards, passages: results.passages },
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: "Seed failed", detail: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
