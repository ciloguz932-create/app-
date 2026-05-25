"use client";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { THEMES, applyTheme, getStoredTheme, type ThemeName } from "@/lib/themes";
import { getLevel, xpToNextLevel, XP_REWARDS, checkBadges, BADGE_DEFS, type BadgeDef } from "@/lib/badges";

export type AIProvider = "claude" | "gemini" | "auto";

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
  aiProvider: AIProvider;
  setAIProvider: (p: AIProvider) => void;
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
  const [badgeQueue, setBadgeQueue] = useState<BadgeDef[]>([]);
  const [badgesLoaded, setBadgesLoaded] = useState(false);
  const [aiProvider, setAIProviderState] = useState<AIProvider>("claude");
  const badgeAwardInFlight = useRef(false);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    const themeConfig = THEMES.find((t) => t.name === storedTheme) ?? THEMES[0];
    applyTheme(themeConfig);
    setThemeState(storedTheme);

    const storedXP = parseInt(localStorage.getItem("xp") ?? "0", 10);
    setXp(storedXP);

    const storedProvider = (localStorage.getItem("aiProvider") ?? "claude") as AIProvider;
    setAIProviderState(storedProvider);

    fetch("/api/badges")
      .then((r) => r.json())
      .then((data: { key: string }[]) => {
        setEarnedBadges(Array.isArray(data) ? data.map((b) => b.key) : []);
      })
      .catch(() => {})
      .finally(() => setBadgesLoaded(true));
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    const themeConfig = THEMES.find((c) => c.name === t) ?? THEMES[0];
    applyTheme(themeConfig);
    setThemeState(t);
  }, []);

  const setAIProvider = useCallback((p: AIProvider) => {
    localStorage.setItem("aiProvider", p);
    setAIProviderState(p);
    fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiProvider: p }),
    }).catch(() => {});
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

  const newBadge = badgeQueue[0] ?? null;
  const dismissBadge = useCallback(() => {
    setBadgeQueue((q) => q.slice(1));
  }, []);

  useEffect(() => {
    if (!badgesLoaded) return;
    if (badgeAwardInFlight.current) return;
    const totalCards = Math.floor(xp / XP_REWARDS.cardReviewed);
    const hour = new Date().getHours();
    const newKeys = checkBadges({ totalCards, streak: 0, level, accuracy: 0, hour, earnedKeys: earnedBadges });
    if (newKeys.length === 0) return;

    badgeAwardInFlight.current = true;
    (async () => {
      const awardedDefs: BadgeDef[] = [];
      for (const key of newKeys) {
        try {
          await fetch("/api/badges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          });
          const def = BADGE_DEFS.find((b) => b.key === key);
          if (def) awardedDefs.push(def);
        } catch {
          // skip on failure
        }
      }
      if (awardedDefs.length > 0) {
        setEarnedBadges((prev) => [...prev, ...awardedDefs.map((d) => d.key)]);
        setBadgeQueue((q) => [...q, ...awardedDefs]);
      }
      badgeAwardInFlight.current = false;
    })();
  }, [xp, level, earnedBadges, badgesLoaded]);

  return (
    <Ctx.Provider value={{
      theme, setTheme,
      xp, level,
      xpProgress: { current: xpData.current, needed: xpData.needed },
      addXP,
      earnedBadges, newBadge, dismissBadge,
      aiProvider, setAIProvider,
    }}>
      {children}
    </Ctx.Provider>
  );
}
