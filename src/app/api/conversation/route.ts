import { NextRequest } from "next/server";
import { anthropic, buildSystemPrompt, buildScenarioPrompt } from "@/lib/claude";
import { streamGeminiConversation, isGeminiAvailable } from "@/lib/gemini";
import { SCENARIOS, type Language } from "@/lib/types";

function resolveProvider(requested: string): "claude" | "gemini" {
  if (requested === "gemini" && isGeminiAvailable()) return "gemini";
  if (requested === "auto") {
    return isGeminiAvailable() ? "gemini" : "claude";
  }
  return "claude";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    messages,
    language = "en",
    difficulty = "intermediate",
    scenarioId,
    provider: requestedProvider = "claude",
  } = body as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    language: Language;
    difficulty: string;
    scenarioId?: string;
    provider?: string;
  };

  let systemPrompt: string;
  if (scenarioId) {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    systemPrompt = scenario
      ? buildScenarioPrompt(scenario, language)
      : buildSystemPrompt(language, difficulty);
  } else {
    systemPrompt = buildSystemPrompt(language, difficulty);
  }

  const provider = resolveProvider(requestedProvider);

  if (provider === "gemini") {
    const stream = await streamGeminiConversation(messages, systemPrompt);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
        "X-AI-Provider": "gemini",
      },
    });
  }

  const stream = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: systemPrompt,
    messages,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
      "X-AI-Provider": "claude",
    },
  });
}
