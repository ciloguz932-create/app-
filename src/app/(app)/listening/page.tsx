"use client";

import { useState } from "react";
import ListeningPlayer from "@/components/listening/ListeningPlayer";
import { cn } from "@/lib/utils";
import { LANGUAGE_CONFIG, type Language } from "@/lib/types";

const languages: Language[] = ["en", "ar", "fr"];

export default function ListeningPage() {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">Listening Practice</h1>
        <p className="text-muted text-sm mt-1">Listen and type what you hear</p>
      </div>

      <div className="flex gap-2">
        {languages.map((l) => {
          const { flag, label } = LANGUAGE_CONFIG[l];
          return (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={cn(
                "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all",
                language === l ? "bg-charcoal text-cream" : "bg-cream border border-cream-darker text-muted hover:text-charcoal"
              )}
            >
              {flag} {label}
            </button>
          );
        })}
      </div>

      <ListeningPlayer language={language} />
    </div>
  );
}
