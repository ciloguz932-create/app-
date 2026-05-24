import { NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";
import type { Language } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";

export async function POST(req: Request) {
  const { word, sentences, language } = (await req.json()) as {
    word: string;
    sentences: string[];
    language: Language;
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI not configured. Add ANTHROPIC_API_KEY." },
      { status: 503 }
    );
  }

  if (!word || !Array.isArray(sentences) || sentences.length === 0) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { label: langName } = LANGUAGE_CONFIG[language];
  const numbered = sentences
    .map((s, i) => `${i + 1}. ${s ?? ""}`)
    .join("\n");

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

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 900,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
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
