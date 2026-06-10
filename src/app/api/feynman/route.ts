import { NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";
import { callGemini, isGeminiAvailable } from "@/lib/gemini";
import { getSession } from "@/lib/auth";
import { checkAndIncrementUsage } from "@/lib/usage";
import type { Language } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";

function resolveProvider(requested: string, plan: string): "claude" | "gemini" {
  if (plan === "free") return "claude";
  if (requested === "gemini" && isGeminiAvailable()) return "gemini";
  if (requested === "auto") return isGeminiAvailable() ? "gemini" : "claude";
  return "claude";
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limited = await checkAndIncrementUsage(session.userId, session.plan, "aiMessages");
  if (limited) return NextResponse.json(limited, { status: 429 });

  const { word, translation, explanation, language, provider: requestedProvider = "claude" } =
    (await req.json()) as {
      word: string;
      translation: string;
      explanation: string;
      language: Language;
      provider?: string;
    };

  const provider = resolveProvider(requestedProvider, session.plan);

  if (provider === "claude" && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI not configured. Add ANTHROPIC_API_KEY." },
      { status: 503 }
    );
  }
  if (provider === "gemini" && !process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini not configured. Add GEMINI_API_KEY." },
      { status: 503 }
    );
  }

  if (!word || !explanation || !language) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { label: langName } = LANGUAGE_CONFIG[language];
  const prompt = `You are evaluating a student's Feynman-technique explanation. The student was asked to explain the ${langName} word "${word}" (which means "${translation}" in Turkish) in simple ${langName} as if teaching a child.

Their explanation:
"""
${explanation}
"""

Respond in JSON only, no other text:
{
  "clarity": <1-10>,
  "accuracy": <1-10>,
  "simplicity": <1-10>,
  "feedback": "<one short paragraph of warm, specific feedback in Turkish>",
  "improvedVersion": "<a model explanation in simple ${langName}, 1-2 sentences>"
}`;

  let text: string;
  if (provider === "gemini") {
    text = await callGemini(prompt, 600);
  } else {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });
    text = msg.content[0].type === "text" ? msg.content[0].text : "";
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: text },
      { status: 500 }
    );
  }
}
