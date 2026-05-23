import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const state = await prisma.appState.findUnique({ where: { id: 1 } });
  return NextResponse.json(state ?? { streak: 0, dailyGoal: 10, lastStudied: null });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { dailyGoal } = body;

  const state = await prisma.appState.findUnique({ where: { id: 1 } });
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
      // Consecutive day
      newStreak += 1;
    } else {
      // Missed day(s) — reset
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const updated = await prisma.appState.upsert({
    where: { id: 1 },
    update: {
      streak: newStreak,
      lastStudied: now,
      ...(dailyGoal ? { dailyGoal } : {}),
    },
    create: {
      id: 1,
      streak: newStreak,
      lastStudied: now,
      dailyGoal: dailyGoal ?? 10,
    },
  });

  return NextResponse.json(updated);
}
