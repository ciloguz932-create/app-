import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { prisma } from "@/lib/prisma";
import { ENGLISH_WORDS, ARABIC_WORDS, FRENCH_WORDS, READING_PASSAGES } from "@/lib/seed-data";

const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "example" TEXT,
    "notes" TEXT,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "dueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFavorite" INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "quality" INTEGER NOT NULL,
    "reviewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "StudySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "cardsStudied" INTEGER NOT NULL DEFAULT 0,
    "accuracy" REAL NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME
  )`,
  `CREATE TABLE IF NOT EXISTS "ProgressEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL UNIQUE,
    "cardsStudied" INTEGER NOT NULL,
    "accuracy" REAL NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "AppState" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastStudied" DATETIME,
    "dailyGoal" INTEGER NOT NULL DEFAULT 10,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "aiProvider" TEXT NOT NULL DEFAULT 'claude'
  )`,
  `CREATE TABLE IF NOT EXISTS "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "ReadingPassage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "questions" TEXT NOT NULL
  )`,
];

async function applySchema() {
  const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const client = createClient({ url, authToken });
  try {
    for (const sql of SCHEMA_SQL) {
      await client.execute(sql);
    }
  } finally {
    client.close();
  }
}

async function runSeed() {
  const results = { cards: 0, passages: 0, errors: [] as string[] };

  await prisma.appState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, streak: 0, dailyGoal: 10 },
  });

  for (const word of [...ENGLISH_WORDS, ...ARABIC_WORDS, ...FRENCH_WORDS]) {
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
      results.errors.push(`card "${word.word}": ${String(e)}`);
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
      results.errors.push(`passage "${passage.title}": ${String(e)}`);
    }
  }

  return results;
}

function checkSecret(req: NextRequest): string | null {
  const secret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.SEED_SECRET;
  if (!expected) return "SEED_SECRET env var not set";
  if (secret !== expected) return "Invalid secret";
  return null;
}

export async function GET(req: NextRequest) {
  const err = checkSecret(req);
  if (err) {
    return NextResponse.json(
      { error: err },
      { status: err.includes("Invalid") ? 401 : 403 }
    );
  }

  try {
    await applySchema();
    const results = await runSeed();
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

export async function POST(req: NextRequest) {
  return GET(req);
}
