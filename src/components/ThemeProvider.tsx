"use client";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { THEMES, applyTheme, getStoredTheme, type ThemeName } from "@/lib/themes";
import { getLevel, xpToNextLevel, XP_REWARDS, checkBadges, BADGE_DEFS, type BadgeDef } from "@/lib/badges";

export type AIProvider = "claude" | "gemini" | "auto";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  role: string;
  plan: string;
}

interface ThemeCtx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  user: SessionUser | null;
  loading: boolean;
  xp: number;
  level: number;
  xpProgress: { current: number; needed: number };
  addXP: (amount: number) => void;
  streak: number;
  earnedBadges: string[];
  newBadge: BadgeDef | null;
  dismissBadge: () => void;
  aiProvider: AIProvider;
  setAIProvider: (p: AIProvider) => Promise<boolean>;
  refreshMe: () => Promise<void>;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [badgeQueue, setBadgeQueue] = useState<BadgeDef[]>([]);
  const [aiProvider, setAIProviderState] = useState<AIProvider>("claude");
  const badgeAwardInFlight = useRef(false);

  const refreshMe = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setXp(data.xp ?? 0);
      setStreak(data.streak ?? 0);
      setAIProviderState((data.aiProvider as AIProvider) ?? "claude");
      setEarnedBadges(Array.isArray(data.badges) ? data.badges : []);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    const themeConfig = THEMES.find((t) => t.name === storedTheme) ?? THEMES[0];
    applyTheme(themeConfig);
    setThemeState(storedTheme);

    refreshMe().finally(() => setLoading(false));
  }, [refreshMe]);

  const setTheme = useCallback((t: ThemeName) => {
    const themeConfig = THEMES.find((c) => c.name === t) ?? THEMES[0];
    applyTheme(themeConfig);
    setThemeState(t);
  }, []);

  const setAIProvider = useCallback(async (p: AIProvider): Promise<boolean> => {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiProvider: p }),
    }).catch(() => null);
    if (res?.ok) {
      setAIProviderState(p);
      return true;
    }
    return false;
  }, []);

  const addXP = useCallback((amount: number) => {
    setXp((prev) => prev + amount); // optimistic
    fetch("/api/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.xp === "number") setXp(data.xp);
      })
      .catch(() => {});
  }, []);

  const level = getLevel(xp);
  const xpData = xpToNextLevel(xp);

  const newBadge = badgeQueue[0] ?? null;
  const dismissBadge = useCallback(() => {
    setBadgeQueue((q) => q.slice(1));
  }, []);

  useEffect(() => {
    if (loading || !user) return;
    if (badgeAwardInFlight.current) return;
    const totalCards = Math.floor(xp / XP_REWARDS.cardReviewed);
    const hour = new Date().getHours();
    const newKeys = checkBadges({ totalCards, streak, level, accuracy: 0, hour, earnedKeys: earnedBadges });
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
  }, [xp, level, streak, earnedBadges, loading, user]);

  return (
    <Ctx.Provider value={{
      theme, setTheme,
      user, loading,
      xp, level,
      xpProgress: { current: xpData.current, needed: xpData.needed },
      addXP,
      streak,
      earnedBadges, newBadge, dismissBadge,
      aiProvider, setAIProvider,
      refreshMe,
    }}>
      {children}
    </Ctx.Provider>
  );
}
