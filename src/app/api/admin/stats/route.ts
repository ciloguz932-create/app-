import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, totalReviews, totalCards, planGroups] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatarEmoji: true,
        avatarColor: true,
        plan: true,
        role: true,
        createdAt: true,
        appState: { select: { xp: true, streak: true, level: true } },
        _count: { select: { cards: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.review.count(),
    prisma.card.count(),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
  ]);

  // Signups per day over last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);
  const signupsByDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    signupsByDay[d.toISOString().slice(0, 10)] = 0;
  }
  for (const u of users) {
    const key = u.createdAt.toISOString().slice(0, 10);
    if (key in signupsByDay) signupsByDay[key]++;
  }

  return NextResponse.json({
    totals: {
      users: users.length,
      reviews: totalReviews,
      cards: totalCards,
    },
    planDistribution: planGroups.map((g) => ({ plan: g.plan, count: g._count })),
    signups: Object.entries(signupsByDay).map(([date, count]) => ({ date, count })),
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      avatarEmoji: u.avatarEmoji,
      avatarColor: u.avatarColor,
      plan: u.plan,
      role: u.role,
      createdAt: u.createdAt,
      xp: u.appState?.xp ?? 0,
      streak: u.appState?.streak ?? 0,
      level: u.appState?.level ?? 1,
      cards: u._count.cards,
      reviews: u._count.reviews,
    })),
  });
}
