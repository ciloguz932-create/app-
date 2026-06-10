import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPackage } from "@/lib/packages-data";
import { getLevel } from "@/lib/badges";

const INSTALL_XP = 25;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { packageId } = (await req.json()) as { packageId?: string };
  if (!packageId) {
    return NextResponse.json({ error: "Missing packageId" }, { status: 400 });
  }

  const pkg = getPackage(packageId);
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const already = await prisma.contentInstall.findUnique({
    where: {
      userId_kind_contentId: {
        userId: session.userId,
        kind: "package",
        contentId: pkg.id,
      },
    },
  });
  if (already) {
    return NextResponse.json({ alreadyInstalled: true, cardsAdded: 0, readingsAdded: 0 });
  }

  // Vocabulary and sentence patterns both become study cards;
  // patterns are tagged so they're recognizable in the deck.
  const existingWords = await prisma.card.findMany({
    where: { userId: session.userId, language: pkg.language },
    select: { word: true },
  });
  const owned = new Set(existingWords.map((c) => c.word));

  const newCards = [
    ...pkg.vocabulary
      .filter((v) => !owned.has(v.word))
      .map((v) => ({
        userId: session.userId,
        word: v.word,
        translation: v.translation,
        language: pkg.language,
        example: v.example,
        notes: `[Paket: ${pkg.title}]`,
      })),
    ...pkg.patterns
      .filter((p) => !owned.has(p.pattern))
      .map((p) => ({
        userId: session.userId,
        word: p.pattern,
        translation: p.meaning,
        language: pkg.language,
        example: p.example,
        notes: `[Paket: ${pkg.title}] · Kalıp`,
      })),
  ];

  if (newCards.length > 0) {
    await prisma.card.createMany({ data: newCards });
  }

  // Readings live in the shared library — publish once, on first install.
  let readingsAdded = 0;
  for (const r of pkg.readings) {
    const existing = await prisma.readingPassage.findFirst({ where: { title: r.title } });
    if (!existing) {
      await prisma.readingPassage.create({
        data: {
          title: r.title,
          content: r.content,
          language: pkg.language,
          difficulty: r.difficulty,
          questions: JSON.stringify(r.questions),
        },
      });
      readingsAdded++;
    }
  }

  await prisma.contentInstall.create({
    data: { userId: session.userId, kind: "package", contentId: pkg.id },
  });

  const state = await prisma.appState.update({
    where: { userId: session.userId },
    data: { xp: { increment: INSTALL_XP } },
  });
  const level = getLevel(state.xp);
  if (level !== state.level) {
    await prisma.appState.update({ where: { userId: session.userId }, data: { level } });
  }
  await prisma.xpEvent.create({
    data: { userId: session.userId, amount: INSTALL_XP, reason: "package" },
  });

  return NextResponse.json({
    cardsAdded: newCards.length,
    readingsAdded,
    xpAwarded: INSTALL_XP,
    xp: state.xp,
    level,
  });
}
