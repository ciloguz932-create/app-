"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Card {
  id: string;
  word: string;
  translation: string;
  language: string;
  example?: string | null;
}

interface FlashCardProps {
  card: Card;
  onFlip?: (flipped: boolean) => void;
}

export default function FlashCard({ card, onFlip }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip?.(next);
  };

  const isArabic = card.language === "ar";

  return (
    <div
      className="perspective-1000 w-full max-w-lg mx-auto cursor-pointer select-none"
      style={{ height: "280px" }}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-cream border-2 border-cream-darker rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 gap-4">
            <div className="text-xs font-medium tracking-widest text-muted uppercase">
              {card.language === "en" ? "English" : "Arabic"}
            </div>
            <p
              className={cn(
                "text-center font-bold text-charcoal leading-tight",
                isArabic ? "font-arabic text-4xl" : "text-3xl font-serif"
              )}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {card.word}
            </p>
            <div className="mt-2 text-xs text-muted/70 font-medium">tap to reveal →</div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-charcoal border-2 border-charcoal rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 gap-4">
            <div className="text-xs font-medium tracking-widest text-cream/40 uppercase">
              Translation
            </div>
            <p className="text-2xl font-semibold text-cream text-center leading-snug">
              {card.translation}
            </p>
            {card.example && (
              <p
                className={cn(
                  "text-sm text-cream/60 text-center italic mt-2 leading-relaxed max-w-sm",
                  isArabic ? "font-arabic text-base" : ""
                )}
                dir={isArabic ? "rtl" : "ltr"}
              >
                {card.example}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
