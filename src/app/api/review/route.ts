import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateSM2 } from "@/lib/sm2";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cardId, quality, sessionId } = body;

  if (cardId === undefined || quality === undefined) {
    return NextResponse.json({ error: "Missing cardId or quality" }, { status: 400 });
  }

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const result = calculateSM2(
    { interval: card.interval, easeFactor: card.easeFactor, repetitions: card.repetitions },
    quality
  );

  const [updatedCard] = await prisma.$transaction([
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
      data: { cardId, quality },
    }),
  ]);

  return NextResponse.json(updatedCard);
}
