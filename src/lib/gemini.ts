import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Language, Scenario } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { buildSystemPrompt, buildScenarioPrompt } from "@/lib/claude";

function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return new GoogleGenerativeAI(key);
}

export { buildSystemPrompt, buildScenarioPrompt };

export async function streamGeminiConversation(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string
): Promise<ReadableStream<Uint8Array>> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage?.content ?? "");

  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });
}

export async function callGemini(prompt: string, maxTokens = 900): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens },
  });
  return result.response.text();
}

export function isGeminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export { Language, Scenario, LANGUAGE_CONFIG };
