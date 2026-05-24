"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashCard from "./FlashCard";
import QualityButtons from "./QualityButtons";
import { CheckCircle, BookOpen } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { useTheme } from "@/components/ThemeProvider";
import { XP_REWARDS } from "@/lib/badges";

interface Card {
  id: string;
  word: string;
  translation: string;
  language: string;
  example?: string | null;
}

interface StudySessionProps {
  language?: string;
}

export default function StudySession({ language = "all" }: StudySessionProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const startTime = useRef(Date.now());
  const submittingRef = useRef(false);
  const { addXP } = useTheme();

  useEffect(() => {
    fetch(`/api/cards/due?language=${language}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        setCards(Array.isArray(data) ? data : []);
        setLoading(false);
        startTime.current = Date.now();
      })
      .catch(() => {
        setCards([]);
        setLoading(false);
      });
  }, [language]);

  const handleFlip = (f: boolean) => {
    setFlipped(f);
    if (f) sounds.flip();
  };

  const handleQuality = async (quality: number) => {
    if (submittingRef.current) return;
    const card = cards[currentIndex];
    if (!card) return;
    submittingRef.current = true;
    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: card.id, quality }),
    });

    const isCorrect = quality >= 4;
    if (isCorrect) sounds.correct(); else sounds.wrong();

    addXP(XP_REWARDS.cardReviewed + (isCorrect ? XP_REWARDS.correctAnswer : 0));

    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newReviewed = reviewed + 1;
    setCorrect(newCorrect);
    setReviewed(newReviewed);
    setFlipped(false);

    if (currentIndex + 1 >= cards.length) {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      const accuracy = cards.length > 0 ? newCorrect / cards.length : 0;
      const isPerfect = accuracy === 1;

      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardsStudied: newReviewed, accuracy: Math.round(accuracy * 100), type: "vocabulary", duration }),
      });
      await fetch("/api/streak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });

      addXP(XP_REWARDS.sessionComplete + (isPerfect ? XP_REWARDS.perfectSession : 0));
      if (isPerfect) sounds.levelUp(); else sounds.streak();

      setFinished(true);
      submittingRef.current = false;
    } else {
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        submittingRef.current = false;
      }, 150);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-gold" />
        </div>
        <h3 className="text-xl font-serif font-semibold text-charcoal mb-2">All caught up!</h3>
        <p className="text-muted">No cards due for review right now. Come back later!</p>
      </div>
    );
  }

  if (finished) {
    const accuracy = Math.round((correct / cards.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-gold" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">Session Complete!</h3>
        <p className="text-muted mb-8">Great work on today&apos;s review.</p>
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-crimson">{cards.length}</div>
            <div className="text-sm text-muted">Cards</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">{accuracy}%</div>
            <div className="text-sm text-muted">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">{correct}</div>
            <div className="text-sm text-muted">Correct</div>
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="bg-crimson hover:bg-crimson-light text-cream px-8 py-3 rounded-xl font-semibold transition-colors">
          Study Again
        </button>
      </motion.div>
    );
  }

  const card = cards[currentIndex];
  const progressPct = (currentIndex / cards.length) * 100;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted">
          <span>{currentIndex + 1} / {cards.length}</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="w-full bg-cream-darker rounded-full h-2">
          <motion.div className="bg-crimson h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={card.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.2 }}>
          <FlashCard card={card} onFlip={handleFlip} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {flipped && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <p className="text-center text-sm text-muted mb-4">How well did you know this?</p>
            <QualityButtons onSelect={handleQuality} />
          </motion.div>
        )}
      </AnimatePresence>

      {!flipped && <p className="text-center text-sm text-muted/60">Click the card to reveal the answer</p>}
    </div>
  );
}
