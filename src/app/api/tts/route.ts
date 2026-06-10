import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/elevenlabs";
import { getSession } from "@/lib/auth";
import { checkAndIncrementUsage } from "@/lib/usage";
import type { Language } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { text, language = "en" } = body as { text: string; language: Language };

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: "ElevenLabs not configured" }, { status: 503 });
  }

  const limited = await checkAndIncrementUsage(session.userId, session.plan, "ttsRequests");
  if (limited) return NextResponse.json(limited, { status: 429 });

  const audioBuffer = await synthesizeSpeech(text, language);

  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
