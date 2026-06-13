"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Package, Sparkles, Layers } from "lucide-react";
import StudySession from "@/components/cards/StudySession";
import { cn } from "@/lib/utils";

type LangCode = "en" | "ar" | "fr";

const LANGS: { code: LangCode; label: string; flag: string }[] = [
  { code: "en", label: "İngilizce", flag: "🇬🇧" },
  { code: "ar", label: "Arapça", flag: "🇸🇦" },
  { code: "fr", label: "Fransızca", flag: "🇫🇷" },
];

interface Topic {
  topicId: string;
  label: string;
  emoji: string;
  color: string;
  total: number;
  due: number;
}

export default function StudyPage() {
  const [lang, setLang] = useState<LangCode>("en");
  const [dir, setDir] = useState(1);
  const [byLanguage, setByLanguage] = useState<Record<string, Topic[]>>({});
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ language: LangCode; topic: string; label: string } | null>(null);

  useEffect(() => {
    fetch("/api/cards/topics")
      .then((r) => r.json())
      .then((data) => {
        setByLanguage(data.byLanguage ?? {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const switchLang = (next: LangCode) => {
    const order: LangCode[] = ["en", "ar", "fr"];
    setDir(order.indexOf(next) > order.indexOf(lang) ? 1 : -1);
    setLang(next);
  };

  // ---- Active study session view ----
  if (session) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSession(null)}
            className="p-2 rounded-xl hover:bg-cream-dark text-muted hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal">{session.label}</h1>
            <p className="text-muted text-sm">
              {LANGS.find((l) => l.code === session.language)?.flag} Aralıklı tekrar
            </p>
          </div>
        </div>
        <StudySession language={session.language} topic={session.topic} />
      </div>
    );
  }

  const topics = byLanguage[lang] ?? [];
  const totalDue = topics.reduce((s, t) => s + t.due, 0);

  // ---- Topic browser view ----
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/vocabulary"
          className="p-2 rounded-xl hover:bg-cream-dark text-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Çalışma</h1>
          <p className="text-muted text-sm">Dil seç, konuya özel kartlarla pratik yap</p>
        </div>
      </div>

      {/* Language tabs */}
      <div className="relative flex gap-1 bg-cream-dark rounded-2xl p-1.5">
        {LANGS.map((l) => {
          const active = lang === l.code;
          return (
            <button
              key={l.code}
              onClick={() => switchLang(l.code)}
              className="relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors z-10"
              style={{ color: active ? "var(--sidebar-text)" : "var(--color-muted)" }}
            >
              {active && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-xl bg-charcoal"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 text-base">{l.flag}</span>
              <span className="relative z-10">{l.label}</span>
            </button>
          );
        })}
      </div>

      {/* Animated window per language */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={lang}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-charcoal mb-2">
                  Bu dilde henüz kart yok
                </h3>
                <p className="text-muted text-sm mb-5">
                  Konuya özel bir paket indirerek başla.
                </p>
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-cream px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Package className="w-4 h-4" /> Paketleri keşfet
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Study-all card */}
                <button
                  onClick={() =>
                    setSession({ language: lang, topic: "all", label: "Tüm konular" })
                  }
                  disabled={totalDue === 0}
                  className={cn(
                    "w-full flex items-center gap-4 rounded-2xl p-5 text-left transition-all",
                    "bg-charcoal text-cream hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <div className="w-12 h-12 rounded-xl bg-cream/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold">Tüm konular</p>
                    <p className="text-xs text-cream/60">Bu dildeki tüm kartları karışık çalış</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-gold">{totalDue}</p>
                    <p className="text-[10px] text-cream/50 uppercase tracking-wider">tekrar</p>
                  </div>
                </button>

                {/* Topic cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topics.map((t, i) => (
                    <motion.button
                      key={t.topicId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() =>
                        setSession({ language: lang, topic: t.topicId, label: t.label })
                      }
                      disabled={t.due === 0}
                      className={cn(
                        "relative flex items-center gap-3 rounded-2xl p-4 text-left border-2 transition-all",
                        "bg-surface border-cream-darker hover:border-crimson/40 hover:shadow-md",
                        "disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:border-cream-darker disabled:hover:shadow-none"
                      )}
                    >
                      <span
                        className="w-1.5 self-stretch rounded-full flex-shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-3xl flex-shrink-0">{t.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal text-sm truncate">{t.label}</p>
                        <p className="text-xs text-muted">{t.total} kart</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {t.due > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-crimson/10 text-crimson text-xs font-bold px-2 py-1 rounded-full">
                            <Sparkles className="w-3 h-3" /> {t.due}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted/70 uppercase tracking-wider">
                            tamam
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
