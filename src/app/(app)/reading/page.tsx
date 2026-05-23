"use client";

import { useEffect, useState } from "react";
import PassageViewer from "@/components/reading/PassageViewer";
import { cn } from "@/lib/utils";
import { FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGE_CONFIG, type Language } from "@/lib/types";

interface PassageMeta {
  id: string;
  title: string;
  language: string;
  difficulty: string;
}

interface Passage extends PassageMeta {
  content: string;
  questions: Array<{ question: string; options: string[]; answer: number }>;
}

const difficultyColors: Record<string, string> = {
  beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
  intermediate: "text-amber-600 bg-amber-50 border-amber-200",
  advanced: "text-red-600 bg-red-50 border-red-200",
};

const languages: Language[] = ["en", "ar", "fr"];

export default function ReadingPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [passages, setPassages] = useState<PassageMeta[]>([]);
  const [selected, setSelected] = useState<Passage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/reading?language=${language}`)
      .then((r) => r.json())
      .then(setPassages);
    setSelected(null);
  }, [language]);

  const selectPassage = async (id: string) => {
    setLoading(true);
    const passage = await fetch(`/api/reading?id=${id}`).then((r) => r.json());
    setSelected(passage);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!selected ? (
        <>
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal">Reading & Comprehension</h1>
            <p className="text-muted text-sm mt-1">Read passages and test your understanding</p>
          </div>

          <div className="flex gap-2 flex-wrap">
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

          <AnimatePresence mode="wait">
            <motion.div
              key={language}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {passages.map((p, i) => {
                const { dir, fontClass } = LANGUAGE_CONFIG[p.language as Language] ?? { dir: "ltr", fontClass: "" };
                return (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => selectPassage(p.id)}
                    className="w-full text-left bg-cream border-2 border-cream-darker hover:border-crimson/30 rounded-2xl p-5 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cream-dark flex items-center justify-center">
                        <FileText className="w-5 h-5 text-crimson/60" />
                      </div>
                      <div className="text-left">
                        <p className={cn("font-semibold text-charcoal", fontClass)} dir={dir}>
                          {p.title}
                        </p>
                        <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded-full border mt-1 capitalize", difficultyColors[p.difficulty] ?? "text-muted bg-cream-dark border-cream-darker")}>
                          {p.difficulty}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted group-hover:text-crimson transition-colors" />
                  </motion.button>
                );
              })}
              {passages.length === 0 && (
                <div className="text-center py-12 text-muted text-sm">No passages available yet.</div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <div>
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-muted hover:text-charcoal mb-6 transition-colors">
            ← Back to passages
          </button>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-cream border-2 border-cream-darker rounded-3xl p-6 lg:p-8">
              <PassageViewer
                passage={selected}
                onComplete={async (score, total) => {
                  await fetch("/api/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "reading", cardsStudied: total, accuracy: Math.round((score / total) * 100) }),
                  });
                  await fetch("/api/streak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
