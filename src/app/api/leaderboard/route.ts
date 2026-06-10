import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function startOfWeek(): Date {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1; // Monday start
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  const session = await getSession(); // optional — used to highlight current user

  const weekly = await prisma.xpEvent.groupBy({
    by: ["userId"],
    where: { createdAt: { gte: startOfWeek() } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 50,
  });

  const allTime = await prisma.appState.findMany({
    where: { xp: { gt: 0 } },
    orderBy: { xp: "desc" },
    take: 50,
    select: { userId: true, xp: true, level: true },
  });

  const userIds = [...new Set([...weekly.map((w) => w.userId), ...allTime.map((a) => a.userId)])];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, avatarEmoji: true, avatarColor: true, plan: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return NextResponse.json({
    weekly: weekly
      .filter((w) => userMap.has(w.userId))
      .map((w) => ({
        ...userMap.get(w.userId)!,
        xp: w._sum.amount ?? 0,
      })),
    allTime: allTime
      .filter((a) => userMap.has(a.userId))
      .map((a) => ({
        ...userMap.get(a.userId)!,
        xp: a.xp,
        level: a.level,
      })),
    currentUserId: session?.userId ?? null,
  });
}
