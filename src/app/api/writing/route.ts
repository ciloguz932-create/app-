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

  const { word, sentences, language, provider: requestedProvider = "claude" } =
    (await req.json()) as {
      word: string;
      sentences: string[];
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

  if (!word || !Array.isArray(sentences) || sentences.length === 0) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { label: langName } = LANGUAGE_CONFIG[language];
  const numbered = sentences.map((s, i) => `${i + 1}. ${s ?? ""}`).join("\n");

  const prompt = `You are an encouraging ${langName} writing tutor. The student wrote sentences using the target word "${word}". Evaluate each sentence for:
- Grammar correctness
- Natural use of the word "${word}"
- Overall clarity

Their sentences:
${numbered}

Respond in JSON only, no other text:
{
  "sentences": [
    {
      "text": "<original sentence>",
      "grade": "good" | "ok" | "needs-work",
      "correction": "<corrected version if needed, otherwise omit or null>",
      "note": "<brief Turkish note about strengths or issues, 1 sentence>"
    }
  ],
  "overallFeedback": "<one warm, encouraging paragraph in Turkish summarising the overall performance>"
}

Make sure the "sentences" array has exactly ${sentences.length} entries, one per input sentence, in the same order.`;

  let text: string;
  if (provider === "gemini") {
    text = await callGemini(prompt, 900);
  } else {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 900,
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
