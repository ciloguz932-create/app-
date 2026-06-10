import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const state = await prisma.appState.findUnique({ where: { userId: session.userId } });
  return NextResponse.json(state ?? { streak: 0, dailyGoal: 10, lastStudied: null });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { dailyGoal } = body;

  const state = await prisma.appState.findUnique({ where: { userId: session.userId } });
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let newStreak = state?.streak ?? 0;

  if (state?.lastStudied) {
    const lastDate = new Date(state.lastStudied);
    lastDate.setHours(0, 0, 0, 0);
    const dayDiff = Math.floor((today.getTime() - lastDate.getTime()) / 86400000);

    if (dayDiff === 0) {
      // Already studied today — no change
    } else if (dayDiff === 1) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const updated = await prisma.appState.upsert({
    where: { userId: session.userId },
    update: {
      streak: newStreak,
      lastStudied: now,
      ...(dailyGoal ? { dailyGoal } : {}),
    },
    create: {
      userId: session.userId,
      streak: newStreak,
      lastStudied: now,
      dailyGoal: dailyGoal ?? 10,
    },
  });

  return NextResponse.json(updated);
}
