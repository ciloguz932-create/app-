import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const state = await prisma.appState.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId },
    update: {},
  });

  return NextResponse.json({
    dailyGoal: state.dailyGoal,
    aiProvider: state.aiProvider,
    plan: session.plan,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasElevenLabsKey: !!process.env.ELEVENLABS_API_KEY,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof body.dailyGoal === "number" && body.dailyGoal > 0) {
    data.dailyGoal = body.dailyGoal;
  }
  if (
    typeof body.aiProvider === "string" &&
    ["claude", "gemini", "auto"].includes(body.aiProvider)
  ) {
    if (body.aiProvider !== "claude" && session.plan === "free") {
      return NextResponse.json(
        { error: "limit", message: "Gemini Pro planda kullanılabilir", upgradeUrl: "/pricing" },
        { status: 403 }
      );
    }
    data.aiProvider = body.aiProvider;
  }

  const state = await prisma.appState.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId, ...data },
    update: data,
  });

  return NextResponse.json({
    dailyGoal: state.dailyGoal,
    aiProvider: state.aiProvider,
  });
}
