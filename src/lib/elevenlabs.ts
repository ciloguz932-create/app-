import type { Language } from "@/lib/types";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const VOICE_IDS: Record<Language, string> = {
  en: "EXAVITQu4vr4xnSDxMaL", // Sarah - English
  ar: "onwK4e9ZLuTAKqWW03F9", // Daniel - Arabic
  fr: "cgSgspJ2msm6clMCkdW9", // Jessica - French accent
};

export async function synthesizeSpeech(
  text: string,
  language: Language
): Promise<ArrayBuffer> {
  const voiceId = VOICE_IDS[language];

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs error: ${response.status} ${response.statusText}`);
  }

  return response.arrayBuffer();
}
