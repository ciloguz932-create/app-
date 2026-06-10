"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { sounds } from "@/lib/sounds";

const CONFETTI_COLORS = ["#A51C30", "#C5A028", "#E8C84A", "#2E6B4F", "#1E5A8A"];

export default function CheckoutSuccessPage() {
  const { refreshMe } = useTheme();

  useEffect(() => {
    refreshMe();
    sounds.levelUp();
  }, [refreshMe]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      {/* Confetti burst */}
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 600,
            y: Math.random() * -500 - 100,
            scale: 0,
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 1.8 + Math.random(), ease: "easeOut" }}
          className="absolute left-1/2 top-2/3 w-3 h-3 rounded-sm"
          style={{ backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 bg-gold/15 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Crown className="w-12 h-12 text-gold" />
        </motion.div>

        <h1 className="font-serif text-3xl font-bold text-charcoal mb-3">
          Hoş geldin, Pro üye! 👑
        </h1>
        <p className="text-muted leading-relaxed mb-9">
          Artık sınırsız AI konuşması, Gemini seçeneği ve sınırsız sesli telaffuz
          seninle. Öğrenmeye devam!
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-cream font-bold px-8 py-4 rounded-2xl transition-colors"
        >
          Dashboard&apos;a dön <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
}
