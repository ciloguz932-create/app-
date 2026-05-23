"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface Passage {
  id: string;
  title: string;
  content: string;
  language: string;
  difficulty: string;
  questions: Question[];
}

interface PassageViewerProps {
  passage: Passage;
  onComplete?: (score: number, total: number) => void;
}

export default function PassageViewer({ passage, onComplete }: PassageViewerProps) {
  const [phase, setPhase] = useState<"reading" | "quiz" | "results">("reading");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const isArabic = passage.language === "ar";
  const questions = passage.questions;

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);

    const correct = optIdx === questions[qIndex].answer;
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex + 1 < questions.length) {
        setQIndex((i) => i + 1);
        setSelected(null);
      } else {
        const score = newAnswers.filter(Boolean).length;
        onComplete?.(score, questions.length);
        setPhase("results");
      }
    }, 1200);
  };

  const restart = () => {
    setPhase("reading");
    setQIndex(0);
    setSelected(null);
    setAnswers([]);
  };

  const score = answers.filter(Boolean).length;

  if (phase === "results") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-6"
      >
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mx-auto text-3xl font-bold",
          pct >= 75 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        )}>
          {pct}%
        </div>
        <div>
          <h3 className="text-2xl font-serif font-bold text-charcoal">
            {pct >= 75 ? "Excellent!" : pct >= 50 ? "Good effort!" : "Keep practicing!"}
          </h3>
          <p className="text-muted mt-2">{score} / {questions.length} questions correct</p>
        </div>
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={i} className={cn(
              "flex items-start gap-2 text-left p-3 rounded-lg text-sm",
              answers[i] ? "bg-emerald-50" : "bg-red-50"
            )}>
              {answers[i]
                ? <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              }
              <div className={isArabic ? "font-arabic" : ""} dir={isArabic ? "rtl" : "ltr"}>
                <p className="font-medium text-charcoal">{q.question}</p>
                {!answers[i] && (
                  <p className="text-muted text-xs mt-0.5">
                    Correct: {q.options[q.answer]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 mx-auto bg-crimson text-cream px-6 py-3 rounded-xl font-semibold hover:bg-crimson-light transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </motion.div>
    );
  }

  if (phase === "reading") {
    return (
      <div className="space-y-6">
        <div className={cn(
          "flex items-center gap-2 text-xs font-medium",
          passage.difficulty === "beginner" ? "text-emerald-600" :
          passage.difficulty === "intermediate" ? "text-amber-600" : "text-red-600"
        )}>
          <span className="w-2 h-2 rounded-full bg-current" />
          {passage.difficulty.charAt(0).toUpperCase() + passage.difficulty.slice(1)}
          <span className="text-muted ml-2">· {passage.language === "en" ? "English" : "Arabic"}</span>
        </div>

        <h2 className={cn(
          "text-2xl font-serif font-bold text-charcoal",
          isArabic ? "font-arabic" : ""
        )} dir={isArabic ? "rtl" : "ltr"}>
          {passage.title}
        </h2>

        <div
          className={cn(
            "prose prose-sm max-w-none text-charcoal leading-relaxed whitespace-pre-line",
            isArabic ? "font-arabic text-lg text-right" : "text-base"
          )}
          dir={isArabic ? "rtl" : "ltr"}
        >
          {passage.content}
        </div>

        <button
          onClick={() => setPhase("quiz")}
          className="flex items-center gap-2 bg-crimson text-cream px-8 py-3 rounded-xl font-semibold hover:bg-crimson-light transition-colors"
        >
          Take Quiz <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const q = questions[qIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-muted">
        <span>Question {qIndex + 1} / {questions.length}</span>
        <span>{answers.filter(Boolean).length} correct</span>
      </div>

      <div className="w-full bg-cream-darker rounded-full h-1.5">
        <motion.div
          className="bg-crimson h-1.5 rounded-full"
          animate={{ width: `${(qIndex / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <p className={cn(
            "text-lg font-semibold text-charcoal",
            isArabic ? "font-arabic text-right" : ""
          )} dir={isArabic ? "rtl" : "ltr"}>
            {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.answer;
              const showFeedback = selected !== null;

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium",
                    isArabic ? "font-arabic text-right text-base" : "",
                    showFeedback && isCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : showFeedback && isSelected && !isCorrect
                      ? "border-red-400 bg-red-50 text-red-600"
                      : "border-cream-darker bg-cream hover:border-crimson/40 hover:bg-cream-dark text-charcoal"
                  )}
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <span className="mr-2 font-bold text-xs">
                    {["A", "B", "C", "D"][i]}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
