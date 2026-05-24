"use client";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export function XPBar() {
  const { xp, level, xpProgress } = useTheme();
  const pct = xpProgress.needed > 0 ? Math.min(1, xpProgress.current / xpProgress.needed) : 1;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-[var(--sidebar-text)] opacity-80">Level {level}</span>
        <span className="text-[10px] text-[var(--sidebar-text)] opacity-50">{xp} XP</span>
      </div>
      <div className="h-1.5 bg-[var(--sidebar-text)]/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--color-gold)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <p className="text-[10px] text-[var(--sidebar-text)] opacity-40">{xpProgress.current}/{xpProgress.needed} to level {level + 1}</p>
    </div>
  );
}
