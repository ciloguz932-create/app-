"use client";

import { useTheme } from "@/components/ThemeProvider";
import { BADGE_DEFS, LEVELS, getLevel } from "@/lib/badges";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function BadgesPage() {
  const { earnedBadges, xp, level, xpProgress } = useTheme();
  const pct = xpProgress.needed > 0 ? Math.min(1, xpProgress.current / xpProgress.needed) : 1;
  const nextLevel = level + 1;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">Badges & Progress</h1>
        <p className="text-muted text-sm mt-1">{earnedBadges.length} / {BADGE_DEFS.length} badges earned</p>
      </div>

      {/* XP Card */}
      <div className="bg-cream border-2 border-cream-darker rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Level</p>
            <p className="text-4xl font-bold text-charcoal">{level}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted uppercase tracking-wider">Total XP</p>
            <p className="text-2xl font-bold text-crimson">{xp}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted">
            <span>{xpProgress.current} XP</span>
            <span>{xpProgress.needed} XP to level {nextLevel}</span>
          </div>
          <div className="h-3 bg-cream-darker rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Level milestones */}
        <div className="flex gap-2 flex-wrap mt-2">
          {LEVELS.slice(0, 10).map((xpNeeded, i) => {
            const lvl = i + 1;
            const reached = level >= lvl;
            return (
              <div key={lvl} className={cn("text-xs px-2 py-1 rounded-lg font-medium", reached ? "bg-gold/20 text-gold-dark" : "bg-cream-dark text-muted")}>
                Lv.{lvl}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge grid */}
      <div>
        <h2 className="text-lg font-serif font-semibold text-charcoal mb-4">All Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BADGE_DEFS.map((badge, i) => {
            const earned = earnedBadges.includes(badge.key);
            return (
              <motion.div
                key={badge.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "bg-cream border-2 rounded-2xl p-5 text-center transition-all",
                  earned
                    ? "border-gold/40 bg-gold/5 shadow-sm"
                    : "border-cream-darker opacity-50 grayscale"
                )}
              >
                <div className="text-4xl mb-2">{badge.emoji}</div>
                <p className="font-semibold text-charcoal text-sm">{badge.title}</p>
                <p className="text-xs text-muted mt-1 leading-snug">{badge.description}</p>
                {earned && (
                  <p className="text-xs text-gold-dark mt-2 font-semibold">✓ Earned</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* XP guide */}
      <div className="bg-cream border border-cream-darker rounded-2xl p-5">
        <h3 className="font-semibold text-charcoal text-sm mb-3">How to earn XP</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted">
          <div>📖 Card reviewed → <strong>+10 XP</strong></div>
          <div>✅ Correct answer → <strong>+5 XP</strong></div>
          <div>🏁 Session complete → <strong>+20 XP</strong></div>
          <div>💯 Perfect session → <strong>+50 XP</strong></div>
        </div>
      </div>
    </div>
  );
}
