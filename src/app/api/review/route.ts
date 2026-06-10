import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateSM2 } from "@/lib/sm2";
import { getLevel, XP_REWARDS } from "@/lib/badges";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { cardId, quality } = body;

  if (cardId === undefined || quality === undefined) {
    return NextResponse.json({ error: "Missing cardId or quality" }, { status: 400 });
  }

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.userId },
  });
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const result = calculateSM2(
    { interval: card.interval, easeFactor: card.easeFactor, repetitions: card.repetitions },
    quality
  );

  const xpGain = XP_REWARDS.cardReviewed + (quality >= 4 ? XP_REWARDS.correctAnswer : 0);

  const [updatedCard, , state] = await prisma.$transaction([
    prisma.card.update({
      where: { id: cardId },
      data: {
        interval: result.interval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
        dueDate: result.dueDate,
      },
    }),
    prisma.review.create({
      data: { cardId, userId: session.userId, quality },
    }),
    prisma.appState.upsert({
      where: { userId: session.userId },
      update: { xp: { increment: xpGain } },
      create: { userId: session.userId, xp: xpGain },
    }),
    prisma.xpEvent.create({
      data: { userId: session.userId, amount: xpGain, reason: "review" },
    }),
  ]);

  const level = getLevel(state.xp);
  if (level !== state.level) {
    await prisma.appState.update({
      where: { userId: session.userId },
      data: { level },
    });
  }

  return NextResponse.json({ ...updatedCard, xp: state.xp, level });
}
