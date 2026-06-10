"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, RefreshCw, Send, Sparkles } from "lucide-react";
import { LANGUAGE_CONFIG, type Language } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { UpgradeModal } from "@/components/UpgradeModal";

interface Card {
  id: string;
  word: string;
  translation: string;
  language: string;
  example?: string | null;
  notes?: string | null;
  isFavorite?: boolean;
}

interface FeynmanResult {
  clarity: number;
  accuracy: number;
  simplicity: number;
  feedback: string;
  improvedVersion: string;
}

const LANGUAGES: Language[] = ["en", "ar", "fr"];

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(10, value)) * 10;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-charcoal">{value}/10</span>
      </div>
      <div className="h-2.5 bg-cream-dark rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-crimson to-gold rounded-full"
        />
      </div>
    </div>
  );
}

export default function FeynmanPage() {
  const { aiProvider } = useTheme();
  const [language, setLanguage] = useState<Language>("en");
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<FeynmanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    setLoadingCards(true);
    setActiveCardId(null);
    setExplanation("");
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

  const handleSubmit = async () => {
    if (!activeCard || !explanation.trim()) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/feynman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: activeCard.word,
          translation: activeCard.translation,
          explanation: explanation.trim(),
          language,
          provider: aiProvider,
        }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        return;
      }
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to evaluate");
      }
      setResult(data as FeynmanResult);
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
    setExplanation("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal flex items-center gap-2">
          <Brain className="w-6 h-6 text-crimson" /> Feynman Technique
        </h1>
        <p className="text-muted text-sm mt-1">
          Teach the word to a child in simple language. The AI grades your clarity, accuracy, and simplicity.
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
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Pick a card</p>
          {loadingCards && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
        </div>
        {cards.length === 0 && !loadingCards ? (
          <p className="text-sm text-muted">No cards in this language yet. Add some in Vocabulary first.</p>
        ) : (
          <select
            value={activeCardId ?? ""}
            onChange={(e) => {
              setActiveCardId(e.target.value);
              setExplanation("");
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

      {/* Active card display */}
      {activeCard && (
        <motion.div
          key={activeCard.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal text-cream rounded-3xl p-8 text-center space-y-3"
        >
          <p className="text-xs text-cream/50 uppercase tracking-wider">
            {LANGUAGE_CONFIG[language].label} word
          </p>
          <p
            className={cn(
              "text-4xl font-serif font-bold",
              language === "ar" ? "font-arabic" : ""
            )}
            dir={LANGUAGE_CONFIG[language].dir}
          >
            {activeCard.word}
          </p>
          <p className="text-sm text-gold">{activeCard.translation}</p>
          {activeCard.example && (
            <p
              className="text-sm text-cream/70 italic max-w-md mx-auto"
              dir={LANGUAGE_CONFIG[language].dir}
            >
              "{activeCard.example}"
            </p>
          )}
        </motion.div>
      )}

      {/* Explanation textarea */}
      {activeCard && (
        <div className="space-y-3">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">
            Explain in simple {LANGUAGE_CONFIG[language].label} as if teaching a child
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder={`Imagine you're explaining "${activeCard.word}" to an 8-year-old…`}
            rows={5}
            dir={LANGUAGE_CONFIG[language].dir}
            className={cn(
              "w-full bg-cream border-2 border-cream-darker rounded-2xl px-5 py-4 text-base text-charcoal placeholder:text-muted/60 focus:outline-none focus:border-crimson resize-none",
              language === "ar" ? "font-arabic" : ""
            )}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted">{explanation.trim().split(/\s+/).filter(Boolean).length} words</p>
            <button
              onClick={handleSubmit}
              disabled={submitting || !explanation.trim()}
              className="bg-crimson hover:bg-crimson-light text-cream px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Evaluating…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Loading brain animation */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-6"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-crimson/10 border-2 border-crimson/30 rounded-2xl flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-crimson" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="bg-cream border-2 border-cream-darker rounded-3xl p-7 space-y-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" /> Evaluation
              </h3>
              <button
                onClick={handleNext}
                className="text-sm font-semibold text-charcoal bg-cream-dark border border-cream-darker hover:bg-cream-darker px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Next card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <ScoreBar label="Clarity" value={result.clarity} />
              <ScoreBar label="Accuracy" value={result.accuracy} />
              <ScoreBar label="Simplicity" value={result.simplicity} />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Feedback</p>
              <p className="text-sm text-charcoal leading-relaxed">{result.feedback}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Model explanation</p>
              <div className="bg-white border border-cream-darker rounded-xl px-4 py-3">
                <p
                  className={cn(
                    "text-sm text-charcoal italic",
                    language === "ar" ? "font-arabic text-base text-right" : ""
                  )}
                  dir={LANGUAGE_CONFIG[language].dir}
                >
                  "{result.improvedVersion}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
