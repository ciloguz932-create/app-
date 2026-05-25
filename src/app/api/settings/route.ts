import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const state = await prisma.appState.upsert({
    where: { id: 1 },
    create: {},
    update: {},
  });

  return NextResponse.json({
    dailyGoal: state.dailyGoal,
    aiProvider: state.aiProvider,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasElevenLabsKey: !!process.env.ELEVENLABS_API_KEY,
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof body.dailyGoal === "number" && body.dailyGoal > 0) {
    data.dailyGoal = body.dailyGoal;
  }
  if (
    typeof body.aiProvider === "string" &&
    ["claude", "gemini", "auto"].includes(body.aiProvider)
  ) {
    data.aiProvider = body.aiProvider;
  }

  const state = await prisma.appState.upsert({
    where: { id: 1 },
    create: data,
    update: data,
  });

  return NextResponse.json({
    dailyGoal: state.dailyGoal,
    aiProvider: state.aiProvider,
  });
}
