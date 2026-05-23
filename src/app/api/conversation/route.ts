import { NextRequest } from "next/server";
import { anthropic, buildSystemPrompt, buildScenarioPrompt } from "@/lib/claude";
import { SCENARIOS, type Language } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, language = "en", difficulty = "intermediate", scenarioId } = body as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    language: Language;
    difficulty: string;
    scenarioId?: string;
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
    },
  });
}
