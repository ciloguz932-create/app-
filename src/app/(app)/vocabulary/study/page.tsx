"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudySession from "@/components/cards/StudySession";
import { cn } from "@/lib/utils";

export default function StudyPage() {
  const [language, setLanguage] = useState("all");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/vocabulary"
          className="p-2 rounded-xl hover:bg-cream-dark text-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Study Session</h1>
          <p className="text-muted text-sm">Spaced repetition review</p>
        </div>
      </div>

      {/* Language filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "en", "ar", "fr"].map((l) => (
          <button
            key={l}
            onClick={() => setLanguage(l)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-colors",
              language === l ? "bg-charcoal text-cream" : "bg-cream border border-cream-darker text-muted hover:text-charcoal"
            )}
          >
            {l === "all" ? "All languages" : l === "en" ? "🇬🇧 English" : l === "ar" ? "🇸🇦 Arabic" : "🇫🇷 Français"}
          </button>
        ))}
      </div>

      <StudySession language={language} />
    </div>
  );
}
