"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, CheckCircle, XCircle, RefreshCw, SkipForward } from "lucide-react";
import { checkAnswer } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { LANGUAGE_CONFIG, type Language } from "@/lib/types";

interface Card {
  id: string;
  word: string;
  translation: string;
  language: string;
  example?: string | null;
}

interface ListeningPlayerProps {
  language: Language;
}

export default function ListeningPlayer({ language }: ListeningPlayerProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`/api/cards?language=${language}`)
      .then((r) => r.json())
      .then((data) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setCards(shuffled.slice(0, 15));
      });
  }, [language]);

  const loadAudio = async (card: Card) => {
    setAudioLoading(true);
    setAudioUrl(null);
    try {
      const resp = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: card.word, language }),
      });
      if (!resp.ok) throw new Error("TTS failed");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch {
      // If TTS fails, we'll show manual mode
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    if (cards.length > 0) {
      setInput("");
      setResult(null);
      setRevealed(false);
      setPlaying(false);
      setAudioUrl(null);
      loadAudio(cards[currentIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, cards.length]);

  const playAudio = () => {
    if (!audioRef.current || !audioUrl) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleCheck = () => {
    if (!input.trim()) return;
    const card = cards[currentIndex];
    const correct = checkAnswer(input, card.word, language);
    setResult(correct ? "correct" : "wrong");
    setRevealed(true);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
      setScore({ correct: 0, total: 0 });
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  const card = cards[currentIndex];
  const isArabic = language === "ar";
  const langConfig = LANGUAGE_CONFIG[language];

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Score */}
      <div className="flex justify-between text-sm text-muted">
        <span>Card {currentIndex + 1} / {cards.length}</span>
        <span className="font-medium text-charcoal">{score.correct} / {score.total} correct</span>
      </div>

      {/* Audio card */}
      <div className="bg-cream border-2 border-cream-darker rounded-3xl p-8 text-center space-y-6">
        <Volume2 className="w-10 h-10 text-crimson/40 mx-auto" />
        <p className="text-muted text-sm">Listen and type what you hear</p>

        {/* Play button */}
        <button
          onClick={playAudio}
          disabled={!audioUrl || audioLoading}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg",
            audioUrl
              ? "bg-crimson hover:bg-crimson-light text-cream"
              : "bg-cream-darker text-muted cursor-not-allowed"
          )}
        >
          {audioLoading ? (
            <RefreshCw className="w-7 h-7 animate-spin" />
          ) : playing ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </button>

        {!audioUrl && !audioLoading && (
          <p className="text-xs text-muted/60">ElevenLabs not configured — answer below to reveal</p>
        )}

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setPlaying(false)}
          />
        )}
      </div>

      {/* Input */}
      <div className="space-y-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !revealed && handleCheck()}
          placeholder={isArabic ? "اكتب ما سمعته..." : language === "fr" ? "Écrivez ce que vous avez entendu..." : "Type what you heard..."}
          dir={langConfig.dir}
          className={cn(
            "w-full bg-cream border-2 border-cream-darker rounded-xl px-4 py-3 text-charcoal placeholder:text-muted/40 focus:outline-none focus:border-crimson transition-colors text-center text-lg",
            langConfig.fontClass,
            result === "correct" ? "border-emerald-500" : result === "wrong" ? "border-red-400" : ""
          )}
          disabled={revealed}
        />

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={cn(
                "rounded-xl p-4 flex items-center gap-3",
                result === "correct" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
              )}
            >
              {result === "correct" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <div>
                <p className={cn("font-semibold", result === "correct" ? "text-emerald-700" : "text-red-600")}>
                  {result === "correct" ? "Correct!" : "Not quite"}
                </p>
                {result === "wrong" && (
                  <p className={cn("text-sm text-charcoal mt-0.5", langConfig.fontClass)}>
                    Answer: <strong>{card.word}</strong>
                  </p>
                )}
                <p className="text-xs text-muted mt-0.5">{card.translation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          {!revealed ? (
            <button
              onClick={handleCheck}
              disabled={!input.trim()}
              className="flex-1 bg-crimson hover:bg-crimson-light text-cream py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-charcoal hover:bg-charcoal/80 text-cream py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <SkipForward className="w-4 h-4" /> Next
            </button>
          )}

          {!revealed && (
            <button
              onClick={() => { setRevealed(true); setResult("wrong"); setScore((s) => ({ ...s, total: s.total + 1 })); }}
              className="px-4 py-3 rounded-xl border border-cream-darker text-muted hover:text-charcoal hover:bg-cream-dark transition-colors text-sm"
            >
              Reveal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
