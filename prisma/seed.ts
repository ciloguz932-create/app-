import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import { READING_PASSAGES } from "../src/lib/seed-data";
import { seedUserData } from "../src/lib/seed-user";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const DEMO_PASSWORD = "Lumina2026!";

function daysAgo(n: number, hour = 12): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function upsertUser(opts: {
  email: string;
  name: string;
  role: string;
  plan: string;
  avatarEmoji: string;
  avatarColor: string;
}) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email: opts.email },
    update: {},
    create: { ...opts, passwordHash },
  });
}

async function main() {
  console.log("Seeding database...");

  // Global reading passages
  let passageCount = 0;
  for (const passage of READING_PASSAGES) {
    const existing = await prisma.readingPassage.findFirst({ where: { title: passage.title } });
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

  // Demo accounts
  const admin = await upsertUser({
    email: "admin@lumina.app",
    name: "Admin",
    role: "admin",
    plan: "institution",
    avatarEmoji: "👑",
    avatarColor: "#C5A028",
  });
  const demo = await upsertUser({
    email: "demo@lumina.app",
    name: "Demo Öğrenci",
    role: "user",
    plan: "free",
    avatarEmoji: "🎓",
    avatarColor: "#A51C30",
  });

  const adminCards = await seedUserData(prisma, admin.id);
  const demoCards = await seedUserData(prisma, demo.id);

  // Believable history for the demo user (idempotent: skip if XpEvents exist)
  const hasHistory = await prisma.xpEvent.count({ where: { userId: demo.id } });
  if (hasHistory === 0) {
    const demoCardRows = await prisma.card.findMany({
      where: { userId: demo.id },
      take: 40,
      select: { id: true },
    });

    for (let day = 20; day >= 1; day--) {
      if (day % 4 === 0) continue; // a few rest days
      const reviewsToday = 2 + ((day * 7) % 4);
      for (let i = 0; i < reviewsToday && demoCardRows.length > 0; i++) {
        const card = demoCardRows[(day * 3 + i) % demoCardRows.length];
        await prisma.review.create({
          data: {
            cardId: card.id,
            userId: demo.id,
            quality: 3 + ((day + i) % 3),
            reviewedAt: daysAgo(day, 9 + i),
          },
        });
      }
      await prisma.progressEntry.upsert({
        where: { userId_date: { userId: demo.id, date: daysAgo(day, 0) } },
        update: {},
        create: {
          userId: demo.id,
          date: daysAgo(day, 0),
          cardsStudied: reviewsToday,
          accuracy: 70 + ((day * 13) % 28),
        },
      });
      await prisma.xpEvent.create({
        data: {
          userId: demo.id,
          amount: reviewsToday * 15,
          reason: "review",
          createdAt: daysAgo(day, 10),
        },
      });
    }

    await prisma.appState.update({
      where: { userId: demo.id },
      data: { streak: 5, xp: 1200, level: 5, lastStudied: daysAgo(1) },
    });

    for (const key of ["first_card", "cards_10", "streak_3", "level_5"]) {
      await prisma.badge.upsert({
        where: { userId_key: { userId: demo.id, key } },
        update: {},
        create: { userId: demo.id, key, unlockedAt: daysAgo(10) },
      });
    }
  }

  console.log(`✅ Seeded: ${passageCount} passages`);
  console.log(`   admin@lumina.app (admin/institution) — ${adminCards} cards`);
  console.log(`   demo@lumina.app  (user/free)         — ${demoCards} cards + history`);
  console.log(`   Password for both: ${DEMO_PASSWORD}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
