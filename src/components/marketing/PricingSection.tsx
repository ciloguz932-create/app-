"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    id: "free",
    name: "Ücretsiz",
    price: "₺0",
    period: "sonsuza dek",
    icon: Sparkles,
    cta: "Ücretsiz başla",
    highlight: false,
    features: [
      "230+ başlangıç kartı (EN/AR/FR)",
      "Sınırsız aralıklı tekrar (SM-2)",
      "Günde 10 AI mesajı",
      "Claude AI eğitmen",
      "Rozetler, XP ve seri takibi",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₺99",
    period: "aylık",
    icon: Crown,
    cta: "Pro'ya geç",
    highlight: true,
    features: [
      "Ücretsiz plandaki her şey",
      "Sınırsız AI konuşma ve yazma",
      "Gemini + Claude seçimi",
      "Sınırsız sesli telaffuz (TTS)",
      "Feynman değerlendirmeleri sınırsız",
      "Öncelikli yeni özellikler",
    ],
  },
  {
    id: "institution",
    name: "Kurumsal",
    price: "₺999",
    period: "aylık",
    icon: Building2,
    cta: "İletişime geç",
    highlight: false,
    features: [
      "Pro'daki her şey",
      "Sınırsız öğrenci hesabı",
      "Yönetici paneli ve raporlar",
      "Kurum logosu (white-label)",
      "Öncelikli destek",
    ],
  },
];

export function PricingSection({ loggedIn = false }: { loggedIn?: boolean }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {TIERS.map((tier, i) => {
        const Icon = tier.icon;
        const href = loggedIn
          ? tier.id === "free"
            ? "/dashboard"
            : `/checkout?plan=${tier.id}`
          : "/register";
        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "rounded-3xl p-7 border-2 flex flex-col",
              tier.highlight
                ? "bg-charcoal text-cream border-gold shadow-xl scale-[1.03]"
                : "bg-white text-charcoal border-cream-darker"
            )}
          >
            {tier.highlight && (
              <span className="self-start text-[10px] font-bold uppercase tracking-wider bg-gold text-charcoal px-2.5 py-1 rounded-full mb-3">
                En popüler
              </span>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn("w-5 h-5", tier.highlight ? "text-gold" : "text-crimson")} />
              <h3 className="font-serif text-xl font-bold">{tier.name}</h3>
            </div>
            <div className="mb-5">
              <span className="text-4xl font-bold">{tier.price}</span>
              <span className={cn("text-sm ml-1", tier.highlight ? "text-cream/60" : "text-muted")}>
                / {tier.period}
              </span>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={cn("w-4 h-4 mt-0.5 flex-shrink-0", tier.highlight ? "text-gold" : "text-emerald-600")} />
                  <span className={tier.highlight ? "text-cream/90" : "text-charcoal/90"}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={href}
              className={cn(
                "block text-center py-3 rounded-xl font-bold text-sm transition-colors",
                tier.highlight
                  ? "bg-gold hover:bg-gold-light text-charcoal"
                  : "bg-crimson hover:bg-crimson-light text-cream"
              )}
            >
              {tier.cta}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
