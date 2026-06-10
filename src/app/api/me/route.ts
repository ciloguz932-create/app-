import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      appState: true,
      badges: { select: { key: true } },
    },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarEmoji: user.avatarEmoji,
      avatarColor: user.avatarColor,
      role: user.role,
      plan: user.plan,
    },
    xp: user.appState?.xp ?? 0,
    level: user.appState?.level ?? 1,
    streak: user.appState?.streak ?? 0,
    dailyGoal: user.appState?.dailyGoal ?? 10,
    aiProvider: user.appState?.aiProvider ?? "claude",
    badges: user.badges.map((b) => b.key),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const userData: Record<string, string> = {};
  if (typeof body.name === "string" && body.name.trim().length >= 2) {
    userData.name = body.name.trim();
  }
  if (typeof body.avatarEmoji === "string" && body.avatarEmoji.length <= 8) {
    userData.avatarEmoji = body.avatarEmoji;
  }
  if (typeof body.avatarColor === "string" && /^#[0-9A-Fa-f]{6}$/.test(body.avatarColor)) {
    userData.avatarColor = body.avatarColor;
  }

  if (Object.keys(userData).length > 0) {
    await prisma.user.update({ where: { id: session.userId }, data: userData });
  }

  if (typeof body.dailyGoal === "number" && body.dailyGoal > 0 && body.dailyGoal <= 200) {
    await prisma.appState.upsert({
      where: { userId: session.userId },
      update: { dailyGoal: body.dailyGoal },
      create: { userId: session.userId, dailyGoal: body.dailyGoal },
    });
  }

  return NextResponse.json({ success: true });
}
