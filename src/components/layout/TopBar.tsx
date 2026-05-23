"use client";

import { useState, useEffect } from "react";
import { Menu, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

interface AppState {
  streak: number;
  dailyGoal: number;
  lastStudied: string | null;
}

export default function TopBar({ onMenuClick, title }: TopBarProps) {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [todayCards, setTodayCards] = useState(0);

  useEffect(() => {
    fetch("/api/streak")
      .then((r) => r.json())
      .then(setAppState)
      .catch(() => {});

    fetch("/api/progress")
      .then((r) => r.json())
      .then((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEntry = data.entries?.find((e: { date: string; cardsStudied: number }) => {
          const d = new Date(e.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        });
        setTodayCards(todayEntry?.cardsStudied ?? 0);
      })
      .catch(() => {});
  }, []);

  const goal = appState?.dailyGoal ?? 10;
  const progress = Math.min(1, todayCards / goal);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <header className="h-16 bg-cream border-b border-cream-dark flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-cream-dark transition-colors"
      >
        <Menu className="w-5 h-5 text-charcoal" />
      </button>

      {title && (
        <h1 className="font-serif text-xl font-semibold text-charcoal">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-4">
        {/* Daily goal ring */}
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
              <circle cx="20" cy="20" r={radius} fill="none" stroke="#E5D9C5" strokeWidth="3" />
              <motion.circle
                cx="20"
                cy="20"
                r={radius}
                fill="none"
                stroke="#C5A028"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-charcoal">
              {todayCards}/{goal}
            </span>
          </div>
          <span className="text-xs text-muted hidden sm:block">today</span>
        </div>

        {/* Streak */}
        <AnimatePresence>
          {appState && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 bg-charcoal text-cream px-3 py-1.5 rounded-full"
            >
              <Flame
                className={`w-4 h-4 ${appState.streak > 0 ? "text-gold fill-gold" : "text-cream/40"}`}
              />
              <span className="text-sm font-bold">{appState.streak}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
