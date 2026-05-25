"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, PenTool, RefreshCw, Send, Sparkles } from "lucide-react";
import { LANGUAGE_CONFIG, type Language } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

interface Card {
  id: string;
  word: string;
  translation: string;
  language: string;
  example?: string | null;
}

type Grade = "good" | "ok" | "needs-work";

interface SentenceResult {
  text: string;
  grade: Grade;
  correction?: string | null;
  note: string;
}

interface WritingResult {
  sentences: SentenceResult[];
  overallFeedback: string;
}

const LANGUAGES: Language[] = ["en", "ar", "fr"];

const gradeStyles: Record<Grade, { label: string; container: string; chip: string }> = {
  good: {
    label: "Good",
    container: "bg-emerald-50 border-emerald-200",
    chip: "bg-emerald-500 text-white",
  },
  ok: {
    label: "OK",
    container: "bg-amber-50 border-amber-200",
    chip: "bg-amber-500 text-white",
  },
  "needs-work": {
    label: "Needs work",
    container: "bg-red-50 border-red-200",
    chip: "bg-red-500 text-white",
  },
};

const EMPTY: [string, string, string] = ["", "", ""];

export default function WritingPage() {
  const { aiProvider } = useTheme();
  const [language, setLanguage] = useState<Language>("en");
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [sentences, setSentences] = useState<[string, string, string]>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<WritingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCards(true);
    setActiveCardId(null);
    setSentences(EMPTY);
    setResult(null);
    setError(null);
    fetch(`/api/cards?language=${language}`)
      .then((r) => r.json() as Promise<Card[]>)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCards(list);
        if (list.length > 0) setActiveCardId(list[0].id);
      })
      .catch(() => setCards([]))
      .finally(() => setLoadingCards(false));
  }, [language]);

  const activeCard = useMemo(
    () => cards.find((c) => c.id === activeCardId) ?? null,
    [cards, activeCardId]
  );

  const canSubmit = sentences.some((s) => s.trim().length > 0) && !!activeCard;

  const handleSubmit = async () => {
    if (!activeCard || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: activeCard.word,
          sentences: sentences.map((s) => s.trim()),
          language,
          provider: aiProvider,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to evaluate");
      setResult(data as WritingResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (cards.length === 0) return;
    const idx = cards.findIndex((c) => c.id === activeCardId);
    const nextIdx = (idx + 1) % cards.length;
    setActiveCardId(cards[nextIdx].id);
    setSentences(EMPTY);
    setResult(null);
    setError(null);
  };

  const updateSentence = (i: number, value: string) => {
    setSentences((prev) => {
      const next: [string, string, string] = [prev[0], prev[1], prev[2]];
      next[i] = value;
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal flex items-center gap-2">
          <PenTool className="w-6 h-6 text-crimson" /> Spaced Writing
        </h1>
        <p className="text-muted text-sm mt-1">
          Write three sentences using a target word. The AI checks grammar and natural usage.
        </p>
      </div>

      {/* Language picker */}
      <div className="flex gap-2 flex-wrap">
        {LANGUAGES.map((l) => {
          const { flag, label } = LANGUAGE_CONFIG[l];
          return (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
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

      {/* Card picker */}
      <div className="bg-cream border-2 border-cream-darker rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Target word</p>
          {loadingCards && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
        </div>
        {cards.length === 0 && !loadingCards ? (
          <p className="text-sm text-muted">No cards in this language yet. Add some in Vocabulary first.</p>
        ) : (
          <select
            value={activeCardId ?? ""}
            onChange={(e) => {
              setActiveCardId(e.target.value);
              setSentences(EMPTY);
              setResult(null);
              setError(null);
            }}
            className="w-full bg-white border border-cream-darker rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-crimson"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.word} — {c.translation}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Active word display */}
      {activeCard && (
        <motion.div
          key={activeCard.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal text-cream rounded-3xl p-6 text-center space-y-1"
        >
          <p className="text-xs text-cream/50 uppercase tracking-wider">Write 3 sentences using</p>
          <p
            className={cn(
              "text-3xl font-serif font-bold",
              language === "ar" ? "font-arabic" : ""
            )}
            dir={LANGUAGE_CONFIG[language].dir}
          >
            {activeCard.word}
          </p>
          <p className="text-sm text-gold">{activeCard.translation}</p>
        </motion.div>
      )}

      {/* Sentence inputs */}
      {activeCard && (
        <div className="space-y-3">
          {sentences.map((s, i) => (
            <div key={i} className="space-y-1">
              <label className="text-xs font-medium text-muted uppercase tracking-wider">
                Sentence {i + 1}
              </label>
              <input
                type="text"
                value={s}
                onChange={(e) => updateSentence(i, e.target.value)}
                placeholder={`Use "${activeCard.word}" in a sentence…`}
                dir={LANGUAGE_CONFIG[language].dir}
                className={cn(
                  "w-full bg-cream border-2 border-cream-darker rounded-xl px-4 py-3 text-base text-charcoal placeholder:text-muted/60 focus:outline-none focus:border-crimson",
                  language === "ar" ? "font-arabic" : ""
                )}
              />
            </div>
          ))}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={handleSubmit}
              disabled={submitting || !canSubmit}
              className="bg-crimson hover:bg-crimson-light text-cream px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Evaluating…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Check sentences
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" /> Feedback
              </h3>
              <button
                onClick={handleNext}
                className="text-sm font-semibold text-charcoal bg-cream-dark border border-cream-darker hover:bg-cream-darker px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Next word
              </button>
            </div>

            <div className="space-y-3">
              {result.sentences.map((s, i) => {
                const style = gradeStyles[s.grade] ?? gradeStyles.ok;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn("border-2 rounded-2xl p-4 space-y-2", style.container)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={cn(
                          "text-sm text-charcoal flex-1",
                          language === "ar" ? "font-arabic text-base text-right" : ""
                        )}
                        dir={LANGUAGE_CONFIG[language].dir}
                      >
                        {s.text}
                      </p>
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0",
                          style.chip
                        )}
                      >
                        {style.label}
                      </span>
                    </div>
                    {s.correction && s.correction !== s.text && (
                      <div className="bg-white/60 border border-cream-darker rounded-lg px-3 py-2">
                        <p className="text-[10px] font-medium text-muted uppercase tracking-wider mb-1">
                          Suggested
                        </p>
                        <p
                          className={cn(
                            "text-sm text-charcoal",
                            language === "ar" ? "font-arabic text-base text-right" : ""
                          )}
                          dir={LANGUAGE_CONFIG[language].dir}
                        >
                          {s.correction}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-charcoal/70 leading-relaxed">{s.note}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-cream border-2 border-cream-darker rounded-2xl p-5 space-y-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Overall</p>
              <p className="text-sm text-charcoal leading-relaxed">{result.overallFeedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
