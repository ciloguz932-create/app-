import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.progressEntry.findMany({
    orderBy: { date: "asc" },
    take: 90,
  });

  const sessions = await prisma.studySession.findMany({
    orderBy: { startedAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ entries, sessions });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cardsStudied, accuracy, type, duration } = body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Upsert progress entry for today
  const existing = await prisma.progressEntry.findFirst({
    where: { date: today },
  });

  if (existing) {
    await prisma.progressEntry.update({
      where: { id: existing.id },
      data: {
        cardsStudied: existing.cardsStudied + (cardsStudied || 0),
        accuracy: accuracy !== undefined ? (existing.accuracy + accuracy) / 2 : existing.accuracy,
      },
    });
  } else {
    await prisma.progressEntry.create({
      data: { date: today, cardsStudied: cardsStudied || 0, accuracy: accuracy || 0 },
    });
  }

  // Create session record
  if (type) {
    await prisma.studySession.create({
      data: {
        type,
        cardsStudied: cardsStudied || 0,
        accuracy: accuracy || 0,
        duration: duration || 0,
        endedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
}
