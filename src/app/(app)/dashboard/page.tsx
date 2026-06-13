"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  MessageCircle,
  Headphones,
  FileText,
  Flame,
  Target,
  TrendingUp,
  ChevronRight,
  Library,
  Brain,
  PenTool,
} from "lucide-react";

interface AppState {
  streak: number;
  dailyGoal: number;
  lastStudied: string | null;
}

interface ProgressData {
  entries: Array<{ date: string; cardsStudied: number; accuracy: number }>;
  sessions: Array<{ type: string; cardsStudied: number; startedAt: string }>;
}

const quickActions = [
  {
    href: "/vocabulary/study",
    label: "Study Cards",
    description: "Review due flashcards",
    icon: BookOpen,
    color: "bg-crimson",
    textColor: "text-cream",
  },
  {
    href: "/conversation",
    label: "Conversation",
    description: "Practice with AI tutor",
    icon: MessageCircle,
    color: "bg-charcoal",
    textColor: "text-cream",
  },
  {
    href: "/listening",
    label: "Listening",
    description: "Train your ear",
    icon: Headphones,
    color: "bg-gold",
    textColor: "text-charcoal",
  },
  {
    href: "/reading",
    label: "Reading",
    description: "Comprehension tests",
    icon: FileText,
    color: "bg-cream-dark border border-cream-darker",
    textColor: "text-charcoal",
  },
];

const learningTechniques = [
  {
    href: "/courses",
    label: "Courses",
    description: "Topic-based vocabulary packs",
    icon: Library,
    color: "bg-cream border-2 border-cream-darker",
    textColor: "text-charcoal",
    iconColor: "text-crimson",
  },
  {
    href: "/feynman",
    label: "Feynman",
    description: "Teach to learn deeply",
    icon: Brain,
    color: "bg-cream border-2 border-cream-darker",
    textColor: "text-charcoal",
    iconColor: "text-gold-dark",
  },
  {
    href: "/writing",
    label: "Writing",
    description: "Sentence practice with AI feedback",
    icon: PenTool,
    color: "bg-cream border-2 border-cream-darker",
    textColor: "text-charcoal",
    iconColor: "text-charcoal",
  },
];

export default function DashboardPage() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [dueCount, setDueCount] = useState<number>(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/streak").then((r) => r.json()),
      fetch("/api/progress").then((r) => r.json()),
      fetch("/api/cards/due?limit=100").then((r) => r.json()),
    ]).then(([streak, progress, due]) => {
      setAppState(streak);
      setProgressData(progress);
      setDueCount(Array.isArray(due) ? due.length : 0);
    });
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntry = progressData?.entries?.find((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  const todayCards = todayEntry?.cardsStudied ?? 0;
  const todayAccuracy = todayEntry?.accuracy ?? 0;

  const goal = appState?.dailyGoal ?? 10;
  const goalProgress = Math.min(1, todayCards / goal);
  const radius = 42;
  const circ = 2 * Math.PI * radius;

  const totalCards = progressData?.entries?.reduce((s, e) => s + e.cardsStudied, 0) ?? 0;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"} 🌟
        </h1>
        <p className="text-muted mt-1">Ready to learn something new today?</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal rounded-2xl p-5 text-cream"
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame className={`w-5 h-5 ${(appState?.streak ?? 0) > 0 ? "text-gold fill-gold" : "text-cream/40"}`} />
            <span className="text-xs text-cream/60 uppercase tracking-wider">Streak</span>
          </div>
          <div className="text-3xl font-bold">{appState?.streak ?? 0}</div>
          <div className="text-xs text-cream/40 mt-1">days in a row</div>
        </motion.div>

        {/* Daily goal ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-cream border border-cream-darker rounded-2xl p-5 flex items-center gap-4"
        >
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
              <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--color-cream-darker)" strokeWidth="6" />
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - goalProgress)}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ * (1 - goalProgress) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-charcoal">{todayCards}</span>
              <span className="text-[10px] text-muted">/{goal}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs text-muted uppercase tracking-wider mb-1">
              <Target className="w-3 h-3" /> Goal
            </div>
            <div className="text-sm font-semibold text-charcoal">
              {goalProgress >= 1 ? "Goal reached! 🎉" : `${Math.round(goalProgress * 100)}%`}
            </div>
          </div>
        </motion.div>

        {/* Today accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-crimson rounded-2xl p-5 text-cream"
        >
          <div className="text-xs text-cream/60 uppercase tracking-wider mb-3">Accuracy</div>
          <div className="text-3xl font-bold">{todayCards > 0 ? Math.round(todayAccuracy) : "—"}
            {todayCards > 0 && <span className="text-lg">%</span>}
          </div>
          <div className="text-xs text-cream/50 mt-1">today</div>
        </motion.div>

        {/* Total cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-cream border border-cream-darker rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-wider mb-3">
            <TrendingUp className="w-3 h-3" /> Total
          </div>
          <div className="text-3xl font-bold text-charcoal">{totalCards}</div>
          <div className="text-xs text-muted mt-1">cards reviewed</div>
        </motion.div>
      </div>

      {/* Due cards banner */}
      {dueCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gold/10 border border-gold/30 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-gold-dark" />
            </div>
            <div>
              <p className="font-semibold text-charcoal">{dueCount} cards due for review</p>
              <p className="text-sm text-muted">Keep your streak alive!</p>
            </div>
          </div>
          <Link
            href="/vocabulary/study"
            className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1"
          >
            Study now <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-serif font-semibold text-charcoal mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ href, label, description, icon: Icon, color, textColor }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
            >
              <Link
                href={href}
                className={`block ${color} rounded-2xl p-5 hover:scale-[1.02] transition-transform group`}
              >
                <Icon className={`w-6 h-6 ${textColor} mb-3 group-hover:scale-110 transition-transform`} />
                <p className={`font-semibold ${textColor} text-sm`}>{label}</p>
                <p className={`text-xs mt-0.5 ${textColor} opacity-70`}>{description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Techniques */}
      <div>
        <h2 className="text-lg font-serif font-semibold text-charcoal mb-4">Learning Techniques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {learningTechniques.map(({ href, label, description, icon: Icon, color, textColor, iconColor }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.3 }}
            >
              <Link
                href={href}
                className={`block ${color} rounded-2xl p-5 hover:scale-[1.02] hover:border-crimson/30 transition-all group`}
              >
                <Icon className={`w-6 h-6 ${iconColor} mb-3 group-hover:scale-110 transition-transform`} />
                <p className={`font-semibold ${textColor} text-sm`}>{label}</p>
                <p className={`text-xs mt-0.5 ${textColor} opacity-70`}>{description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      {(progressData?.sessions?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-lg font-serif font-semibold text-charcoal mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {progressData!.sessions.slice(0, 5).map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-cream border border-cream-darker rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cream-dark flex items-center justify-center">
                    {s.type === "vocabulary" && <BookOpen className="w-4 h-4 text-crimson" />}
                    {s.type === "conversation" && <MessageCircle className="w-4 h-4 text-charcoal" />}
                    {s.type === "listening" && <Headphones className="w-4 h-4 text-gold" />}
                    {s.type === "reading" && <FileText className="w-4 h-4 text-muted" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal capitalize">{s.type}</p>
                    <p className="text-xs text-muted">{s.cardsStudied} cards</p>
                  </div>
                </div>
                <span className="text-xs text-muted">
                  {new Date(s.startedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
