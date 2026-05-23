"use client";

import { useState } from "react";
import ListeningPlayer from "@/components/listening/ListeningPlayer";
import { cn } from "@/lib/utils";

export default function ListeningPage() {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">Listening Practice</h1>
        <p className="text-muted text-sm mt-1">Listen and type what you hear</p>
      </div>

      {/* Language tabs */}
      <div className="flex gap-2">
        {(["en", "ar"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLanguage(l)}
            className={cn(
              "px-5 py-2.5 rounded-xl font-semibold text-sm transition-all",
              language === l ? "bg-charcoal text-cream" : "bg-cream border border-cream-darker text-muted hover:text-charcoal"
            )}
          >
            {l === "en" ? "🇬🇧 English" : "🇸🇦 Arabic"}
          </button>
        ))}
      </div>

      <ListeningPlayer language={language} />
    </div>
  );
}
