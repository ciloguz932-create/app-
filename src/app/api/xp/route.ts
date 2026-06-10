import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getLevel } from "@/lib/badges";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const amount = typeof body?.amount === "number" ? Math.floor(body.amount) : 0;
  const reason = typeof body?.reason === "string" ? body.reason.slice(0, 50) : "activity";

  if (amount <= 0 || amount > 500) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const state = await prisma.appState.upsert({
    where: { userId: session.userId },
    update: { xp: { increment: amount } },
    create: { userId: session.userId, xp: amount },
  });

  const level = getLevel(state.xp);
  if (level !== state.level) {
    await prisma.appState.update({
      where: { userId: session.userId },
      data: { level },
    });
  }

  await prisma.xpEvent.create({
    data: { userId: session.userId, amount, reason },
  });

  return NextResponse.json({ xp: state.xp, level });
}
