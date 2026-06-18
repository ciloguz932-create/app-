"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Medal, Loader2, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Entry {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  plan: string;
  xp: number;
  level?: number;
}

interface LeaderboardData {
  weekly: Entry[];
  allTime: Entry[];
  currentUserId: string | null;
}

const PODIUM_STYLES = [
  { ring: "border-gold", bg: "bg-gold/15", label: "🥇", height: "h-28" },
  { ring: "border-slate-300", bg: "bg-slate-100", label: "🥈", height: "h-20" },
  { ring: "border-amber-600", bg: "bg-amber-50", label: "🥉", height: "h-16" },
];

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [tab, setTab] = useState<"weekly" | "allTime">("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const entries = data ? data[tab] : [];
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-crimson rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-cream" />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold leading-none text-charcoal">Lumina</p>
            <p className="text-xs font-medium tracking-wider text-gold">LINGUA</p>
          </div>
        </Link>
        <Link
          href={data?.currentUserId ? "/dashboard" : "/login"}
          className="text-sm font-semibold text-charcoal hover:text-crimson transition-colors"
        >
          {data?.currentUserId ? "← Uygulamaya dön" : "Giriş yap"}
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold/15 border-2 border-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Medal className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Liderlik Tablosu</h1>
          <p className="text-muted text-sm mt-1">En çok XP toplayan öğrenciler</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8">
          {(["weekly", "allTime"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                tab === t
                  ? "bg-charcoal text-cream"
                  : "bg-cream border border-cream-darker text-muted hover:text-charcoal"
              )}
            >
              {t === "weekly" ? "Bu hafta" : "Tüm zamanlar"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-crimson" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-muted py-16">
            Henüz veri yok — ilk XP&apos;yi sen topla! 🚀
          </p>
        ) : (
          <>
            {/* Podium */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-2 sm:gap-4 mb-10">
                {[1, 0, 2].map((idx) => {
                  const entry = top3[idx];
                  if (!entry) return null;
                  const style = PODIUM_STYLES[idx];
                  const isMe = entry.id === data?.currentUserId;
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="flex flex-col items-center flex-1 max-w-[100px] sm:max-w-[140px]"
                    >
                      <span className="text-2xl mb-1">{style.label}</span>
                      <div
                        className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center text-2xl border-4 mb-2",
                          style.ring
                        )}
                        style={{ backgroundColor: entry.avatarColor }}
                      >
                        {entry.avatarEmoji}
                      </div>
                      <p className={cn("text-sm font-bold text-center truncate w-full", isMe ? "text-crimson" : "text-charcoal")}>
                        {entry.name} {isMe && "(sen)"}
                      </p>
                      <p className="text-xs text-gold font-bold mb-2">{entry.xp.toLocaleString("tr-TR")} XP</p>
                      <div className={cn("w-full rounded-t-2xl border-2 border-b-0", style.bg, style.ring, style.height)} />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Rest of the list */}
            <div className="space-y-2">
              {rest.map((entry, i) => {
                const isMe = entry.id === data?.currentUserId;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.04 }}
                    className={cn(
                      "flex items-center gap-4 bg-surface border-2 rounded-2xl px-5 py-3",
                      isMe ? "border-crimson" : "border-cream-darker"
                    )}
                  >
                    <span className="text-sm font-bold text-muted w-6 text-center">{i + 4}</span>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: entry.avatarColor }}
                    >
                      {entry.avatarEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-semibold truncate", isMe ? "text-crimson" : "text-charcoal")}>
                        {entry.name} {isMe && "(sen)"}
                      </p>
                    </div>
                    {entry.plan !== "free" && <Crown className="w-4 h-4 text-gold flex-shrink-0" />}
                    <p className="text-sm font-bold text-gold">{entry.xp.toLocaleString("tr-TR")} XP</p>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
