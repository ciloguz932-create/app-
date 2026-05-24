"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export function BadgeToast() {
  const { newBadge, dismissBadge } = useTheme();

  useEffect(() => {
    if (!newBadge) return;
    const t = setTimeout(dismissBadge, 4000);
    return () => clearTimeout(t);
  }, [newBadge, dismissBadge]);

  return (
    <div className="fixed top-4 right-4 z-[100] pointer-events-none">
      <AnimatePresence>
        {newBadge && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 pointer-events-auto"
          >
            <span className="text-3xl">{newBadge.emoji}</span>
            <div>
              <p className="text-xs opacity-60 uppercase tracking-wider mb-0.5">Badge Unlocked!</p>
              <p className="font-bold">{newBadge.title}</p>
              <p className="text-xs opacity-70">{newBadge.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
