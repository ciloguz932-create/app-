"use client";

import { useState } from "react";
import ConversationChat from "@/components/conversation/ConversationChat";
import { cn } from "@/lib/utils";
import { LANGUAGE_CONFIG, type Language } from "@/lib/types";

const difficulties = ["beginner", "intermediate", "advanced"];
const languages: Language[] = ["en", "ar", "fr"];

export default function ConversationPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="max-w-xl mx-auto space-y-8 pt-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-charcoal">AI Conversation</h1>
          <p className="text-muted mt-2">Practice with your personal language tutor</p>
        </div>

        <div className="bg-cream border-2 border-cream-darker rounded-3xl p-8 space-y-6">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Language</p>
            <div className="flex gap-3">
              {languages.map((l) => {
                const { flag, label } = LANGUAGE_CONFIG[l];
                return (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-semibold text-sm transition-all",
                      language === l
                        ? "bg-charcoal text-cream"
                        : "bg-cream-dark border border-cream-darker text-muted hover:text-charcoal"
                    )}
                  >
                    {flag} {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Difficulty</p>
            <div className="flex gap-3">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize",
                    difficulty === d
                      ? "bg-crimson text-cream"
                      : "bg-cream-dark border border-cream-darker text-muted hover:text-charcoal"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-crimson hover:bg-crimson-light text-cream py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Start Conversation →
          </button>
        </div>

        <div className="text-center text-xs text-muted space-y-1">
          <p>Your AI tutor will gently correct mistakes in [brackets]</p>
          <p>Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    );
  }

  const { flag, label } = LANGUAGE_CONFIG[language];

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-charcoal">Conversation</h1>
          <p className="text-xs text-muted capitalize">
            {flag} {label} · {difficulty}
          </p>
        </div>
        <button
          onClick={() => setStarted(false)}
          className="text-sm text-muted hover:text-charcoal transition-colors px-3 py-1.5 rounded-lg hover:bg-cream-dark"
        >
          Change settings
        </button>
      </div>

      <div className="flex-1 bg-cream border-2 border-cream-darker rounded-3xl overflow-hidden">
        <ConversationChat language={language} difficulty={difficulty} />
      </div>
    </div>
  );
}
