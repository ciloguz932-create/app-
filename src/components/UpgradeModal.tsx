"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Check } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-3xl p-8 max-w-sm w-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted hover:text-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-gold/15 border-2 border-gold rounded-2xl flex items-center justify-center mb-5">
              <Crown className="w-7 h-7 text-gold" />
            </div>

            <h2 className="font-serif text-xl font-bold text-charcoal mb-2">
              Günlük AI limitine ulaştın
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-5">
              Ücretsiz planda günde 10 AI mesajı var. Pro ile sınırsız konuşma,
              Gemini seçeneği ve sınırsız telaffuz aç.
            </p>

            <ul className="space-y-2 mb-6">
              {["Sınırsız AI konuşma ve yazma", "Gemini + Claude seçimi", "Sınırsız sesli telaffuz"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-charcoal">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <Link
              href="/checkout?plan=pro"
              className="block w-full bg-crimson hover:bg-crimson-light text-cream text-center py-3 rounded-xl font-bold transition-colors"
            >
              Pro&apos;ya geç — ₺99/ay
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center text-sm text-muted hover:text-charcoal py-3 transition-colors"
            >
              Yarın tekrar denerim
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
