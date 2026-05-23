import { NextRequest } from "next/server";
import { anthropic, buildSystemPrompt } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, language = "en", difficulty = "intermediate" } = body;

  const systemPrompt = buildSystemPrompt(language, difficulty);

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
