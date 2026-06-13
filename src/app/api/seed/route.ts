import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { seedUserData } from "@/lib/seed-user";
import { READING_PASSAGES } from "@/lib/seed-data";

const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarEmoji" TEXT NOT NULL DEFAULT '🎓',
    "avatarColor" TEXT NOT NULL DEFAULT '#A51C30',
    "role" TEXT NOT NULL DEFAULT 'user',
    "plan" TEXT NOT NULL DEFAULT 'free',
    "planUpdatedAt" DATETIME,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "XpEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'review',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "XpEvent_userId_createdAt_idx" ON "XpEvent"("userId", "createdAt")`,
  `CREATE TABLE IF NOT EXISTS "UsageCounter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "aiMessages" INTEGER NOT NULL DEFAULT 0,
    "ttsRequests" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "UsageCounter_userId_date_key" ON "UsageCounter"("userId", "date")`,
  `CREATE TABLE IF NOT EXISTS "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "topic" TEXT,
    "example" TEXT,
    "notes" TEXT,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "dueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFavorite" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "Card_userId_idx" ON "Card"("userId")`,
  `CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quality" INTEGER NOT NULL,
    "reviewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId")`,
  `CREATE TABLE IF NOT EXISTS "StudySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cardsStudied" INTEGER NOT NULL DEFAULT 0,
    "accuracy" REAL NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "StudySession_userId_idx" ON "StudySession"("userId")`,
  `CREATE TABLE IF NOT EXISTS "ProgressEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "cardsStudied" INTEGER NOT NULL,
    "accuracy" REAL NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ProgressEntry_userId_date_key" ON "ProgressEntry"("userId", "date")`,
  `CREATE TABLE IF NOT EXISTS "AppState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastStudied" DATETIME,
    "dailyGoal" INTEGER NOT NULL DEFAULT 10,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "aiProvider" TEXT NOT NULL DEFAULT 'claude',
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Badge_userId_key_key" ON "Badge"("userId", "key")`,
  `CREATE TABLE IF NOT EXISTS "ReadingPassage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "questions" TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "ContentInstall" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "installedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ContentInstall_userId_kind_contentId_key" ON "ContentInstall"("userId", "kind", "contentId")`,
  `CREATE INDEX IF NOT EXISTS "ContentInstall_userId_idx" ON "ContentInstall"("userId")`,
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

async function upsertDemoUser(opts: {
  email: string;
  name: string;
  role: string;
  plan: string;
  avatarEmoji: string;
  avatarColor: string;
}) {
  const passwordHash = await bcrypt.hash("Lumina2026!", 10);
  return prisma.user.upsert({
    where: { email: opts.email },
    update: {},
    create: { ...opts, passwordHash },
  });
}

async function runSeed() {
  const results = { users: 0, cards: 0, passages: 0 };

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
      results.passages++;
    }
  }

  const admin = await upsertDemoUser({
    email: "admin@lumina.app",
    name: "Admin",
    role: "admin",
    plan: "institution",
    avatarEmoji: "👑",
    avatarColor: "#C5A028",
  });
  const demo = await upsertDemoUser({
    email: "demo@lumina.app",
    name: "Demo Öğrenci",
    role: "user",
    plan: "free",
    avatarEmoji: "🎓",
    avatarColor: "#A51C30",
  });
  results.users = 2;

  results.cards += await seedUserData(prisma, admin.id);
  results.cards += await seedUserData(prisma, demo.id);

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
      seeded: results,
      demoAccounts: ["admin@lumina.app", "demo@lumina.app"],
      password: "Lumina2026!",
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
