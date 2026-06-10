import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.progressEntry.findMany({
    where: { userId: session.userId },
    orderBy: { date: "asc" },
    take: 90,
  });

  const sessions = await prisma.studySession.findMany({
    where: { userId: session.userId },
    orderBy: { startedAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ entries, sessions });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { cardsStudied, accuracy, type, duration } = body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.progressEntry.findUnique({
    where: { userId_date: { userId: session.userId, date: today } },
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
      data: {
        userId: session.userId,
        date: today,
        cardsStudied: cardsStudied || 0,
        accuracy: accuracy || 0,
      },
    });
  }

  if (type) {
    await prisma.studySession.create({
      data: {
        userId: session.userId,
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
