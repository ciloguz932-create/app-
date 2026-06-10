"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Download,
  FileText,
  Loader2,
  MessageSquareQuote,
  Package,
  Sparkles,
} from "lucide-react";
import { CONTENT_PACKAGES, type ContentPackage } from "@/lib/packages-data";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const levelColors: Record<string, string> = {
  beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
  intermediate: "text-amber-600 bg-amber-50 border-amber-200",
  advanced: "text-red-600 bg-red-50 border-red-200",
};

const levelLabels: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  advanced: "İleri",
};

const langFlags: Record<string, string> = { en: "🇬🇧", ar: "🇸🇦", fr: "🇫🇷" };

export default function PackagesPage() {
  const router = useRouter();
  const { refreshMe } = useTheme();
  const [installed, setInstalled] = useState<string[]>([]);
  const [selected, setSelected] = useState<ContentPackage | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; subtitle?: string } | null>(null);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data: { packages?: { id: string; installed: boolean }[] }) => {
        setInstalled((data.packages ?? []).filter((p) => p.installed).map((p) => p.id));
      })
      .catch(() => {});
  }, []);

  const showToast = (title: string, subtitle?: string) => {
    setToast({ title, subtitle });
    window.setTimeout(() => setToast(null), 2800);
  };

  const handleInstall = async (pkg: ContentPackage) => {
    setLoadingId(pkg.id);
    try {
      const res = await fetch("/api/packages/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });
      const data = (await res.json()) as {
        cardsAdded?: number;
        xpAwarded?: number;
        alreadyInstalled?: boolean;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Paket yüklenemedi");

      setInstalled((prev) => (prev.includes(pkg.id) ? prev : [...prev, pkg.id]));
      if (data.alreadyInstalled) {
        showToast("Bu paket zaten yüklü");
      } else {
        showToast(
          `${pkg.title} yüklendi! 🎉`,
          `${data.cardsAdded ?? 0} yeni kart eklendi · +${data.xpAwarded ?? 0} XP`
        );
        refreshMe();
      }
    } catch (err) {
      showToast("Yükleme başarısız", err instanceof Error ? err.message : "Tekrar dene");
    } finally {
      setLoadingId(null);
    }
  };

  if (selected) {
    const isInstalled = installed.includes(selected.id);
    return (
      <div className="max-w-3xl mx-auto space-y-6 pt-2">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Tüm paketler
        </button>

        <div className="text-center space-y-2">
          <span className="text-5xl">{selected.emoji}</span>
          <h2 className="text-2xl font-serif font-bold text-charcoal">{selected.title}</h2>
          <p className="text-muted text-sm max-w-xl mx-auto">{selected.description}</p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-lg">{langFlags[selected.language]}</span>
            <span
              className={cn(
                "inline-block text-xs px-3 py-1 rounded-full border font-medium",
                levelColors[selected.level]
              )}
            >
              {levelLabels[selected.level]}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => handleInstall(selected)}
            disabled={isInstalled || loadingId === selected.id}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
              isInstalled
                ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 cursor-default"
                : "bg-crimson text-cream hover:opacity-90"
            )}
          >
            {loadingId === selected.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isInstalled ? (
              <Check className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isInstalled ? "Yüklendi" : "Paketi indir"}
          </button>
        </div>

        {/* Vocabulary preview */}
        <div className="bg-white border-2 border-cream-darker rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-serif font-bold text-charcoal mb-4">
            <BookOpen className="w-4 h-4 text-crimson" /> Kelimeler ({selected.vocabulary.length})
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {selected.vocabulary.map((v) => (
              <div key={v.word} className="flex items-baseline gap-2 text-sm">
                <span
                  className={cn(
                    "font-semibold text-charcoal",
                    selected.language === "ar" && "font-arabic text-base"
                  )}
                  dir={selected.language === "ar" ? "rtl" : "ltr"}
                >
                  {v.word}
                </span>
                <span className="text-muted text-xs">— {v.translation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patterns */}
        <div className="bg-white border-2 border-cream-darker rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-serif font-bold text-charcoal mb-4">
            <MessageSquareQuote className="w-4 h-4 text-crimson" /> Cümle Kalıpları ({selected.patterns.length})
          </h3>
          <div className="space-y-3">
            {selected.patterns.map((p) => (
              <div key={p.pattern} className="border-l-2 border-gold pl-3">
                <p
                  className={cn(
                    "text-sm font-semibold text-charcoal",
                    selected.language === "ar" && "font-arabic text-base"
                  )}
                  dir={selected.language === "ar" ? "rtl" : "ltr"}
                >
                  {p.pattern}
                </p>
                <p className="text-xs text-muted">{p.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Readings */}
        <div className="bg-white border-2 border-cream-darker rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-serif font-bold text-charcoal mb-4">
            <FileText className="w-4 h-4 text-crimson" /> Okuma Metinleri ({selected.readings.length})
          </h3>
          <div className="space-y-2">
            {selected.readings.map((r) => (
              <div key={r.title} className="flex items-center justify-between text-sm">
                <span
                  className={cn(
                    "font-semibold text-charcoal",
                    selected.language === "ar" && "font-arabic text-base"
                  )}
                  dir={selected.language === "ar" ? "rtl" : "ltr"}
                >
                  {r.title}
                </span>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium",
                    levelColors[r.difficulty]
                  )}
                >
                  {levelLabels[r.difficulty]}
                </span>
              </div>
            ))}
          </div>
          {isInstalled && (
            <button
              onClick={() => router.push("/reading")}
              className="mt-4 text-xs font-bold text-crimson hover:underline"
            >
              Okuma sayfasına git →
            </button>
          )}
        </div>

        <Toast toast={toast} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-2">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-serif font-bold text-charcoal">
            <Package className="w-6 h-6 text-crimson" /> Paketler
          </h1>
          <p className="text-sm text-muted mt-1">
            Kelime, cümle kalıbı ve okuma metinlerinden oluşan hazır içerik paketleri — tek tıkla destene ekle.
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-gold">
          <Sparkles className="w-3.5 h-3.5" /> {installed.length} paket yüklü
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CONTENT_PACKAGES.map((pkg, i) => {
          const isInstalled = installed.includes(pkg.id);
          const isLoading = loadingId === pkg.id;
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border-2 border-cream-darker rounded-2xl p-5 flex flex-col hover:shadow-md transition-shadow"
            >
              <button onClick={() => setSelected(pkg)} className="text-left flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${pkg.color}1A` }}
                  >
                    {pkg.emoji}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{langFlags[pkg.language]}</span>
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border font-medium",
                        levelColors[pkg.level]
                      )}
                    >
                      {levelLabels[pkg.level]}
                    </span>
                  </div>
                </div>
                <h3 className="font-serif font-bold text-charcoal mb-1">{pkg.title}</h3>
                <p className="text-xs text-muted leading-relaxed mb-3">{pkg.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted font-medium">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {pkg.vocabulary.length} kelime
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquareQuote className="w-3 h-3" /> {pkg.patterns.length} kalıp
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {pkg.readings.length} okuma
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleInstall(pkg)}
                disabled={isInstalled || isLoading}
                className={cn(
                  "mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all",
                  isInstalled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                    : "bg-charcoal text-cream hover:bg-crimson"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isInstalled ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isInstalled ? "Yüklendi" : "İndir"}
              </button>
            </motion.div>
          );
        })}
      </div>

      <Toast toast={toast} />
    </div>
  );
}

function Toast({ toast }: { toast: { title: string; subtitle?: string } | null }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-charcoal text-cream px-5 py-3 rounded-xl shadow-lg z-50 text-center"
        >
          <p className="text-sm font-bold">{toast.title}</p>
          {toast.subtitle && <p className="text-xs opacity-70 mt-0.5">{toast.subtitle}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
