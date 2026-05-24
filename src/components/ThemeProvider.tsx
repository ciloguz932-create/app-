"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { THEMES, applyTheme, getStoredTheme, type ThemeName } from "@/lib/themes";
import { getLevel, xpToNextLevel, XP_REWARDS, checkBadges, BADGE_DEFS, type BadgeDef } from "@/lib/badges";

interface ThemeCtx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  xp: number;
  level: number;
  xpProgress: { current: number; needed: number };
  addXP: (amount: number) => void;
  earnedBadges: string[];
  newBadge: BadgeDef | null;
  dismissBadge: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("harvard");
  const [xp, setXp] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [newBadge, setNewBadge] = useState<BadgeDef | null>(null);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    const themeConfig = THEMES.find((t) => t.name === storedTheme) ?? THEMES[0];
    applyTheme(themeConfig);
    setThemeState(storedTheme);

    const storedXP = parseInt(localStorage.getItem("xp") ?? "0", 10);
    setXp(storedXP);

    fetch("/api/badges").then((r) => r.json()).then((data: { key: string }[]) => {
      setEarnedBadges(data.map((b) => b.key));
    }).catch(() => {});
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    const themeConfig = THEMES.find((c) => c.name === t) ?? THEMES[0];
    applyTheme(themeConfig);
    setThemeState(t);
  }, []);

  const addXP = useCallback((amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      localStorage.setItem("xp", String(next));
      return next;
    });
  }, []);

  const level = getLevel(xp);
  const xpData = xpToNextLevel(xp);

  const dismissBadge = useCallback(() => setNewBadge(null), []);

  // Check badges whenever xp or earnedBadges changes
  useEffect(() => {
    if (earnedBadges.length === 0 && xp === 0) return;
    const totalCards = Math.floor(xp / XP_REWARDS.cardReviewed);
    const hour = new Date().getHours();
    const newKeys = checkBadges({ totalCards, streak: 0, level, accuracy: 0, hour, earnedKeys: earnedBadges });
    if (newKeys.length > 0) {
      const key = newKeys[0];
      fetch("/api/badges", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }) })
        .then(() => {
          setEarnedBadges((prev) => [...prev, key]);
          const def = BADGE_DEFS.find((b) => b.key === key);
          if (def) setNewBadge(def);
        }).catch(() => {});
    }
  }, [xp, level, earnedBadges]);

  return (
    <Ctx.Provider value={{ theme, setTheme, xp, level, xpProgress: { current: xpData.current, needed: xpData.needed }, addXP, earnedBadges, newBadge, dismissBadge }}>
      {children}
    </Ctx.Provider>
  );
}
