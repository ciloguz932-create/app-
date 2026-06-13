"use client";

import { motion } from "framer-motion";

// Decorative, non-interactive backdrop for the auth screens.
// Floating glyphs from the three supported languages (English / Arabic /
// French) drift gently upward over soft brand-colored light blooms.
const GLYPHS = [
  { ch: "Hello", lang: "en", x: "8%", delay: 0, dur: 17, size: "text-2xl" },
  { ch: "مرحبا", lang: "ar", x: "82%", delay: 2.5, dur: 19, size: "text-3xl" },
  { ch: "Bonjour", lang: "fr", x: "68%", delay: 5, dur: 21, size: "text-xl" },
  { ch: "A", lang: "en", x: "20%", delay: 7, dur: 15, size: "text-5xl" },
  { ch: "ب", lang: "ar", x: "90%", delay: 1.2, dur: 18, size: "text-5xl" },
  { ch: "é", lang: "fr", x: "40%", delay: 9, dur: 16, size: "text-4xl" },
  { ch: "Welcome", lang: "en", x: "55%", delay: 11, dur: 22, size: "text-lg" },
  { ch: "أهلا", lang: "ar", x: "14%", delay: 4, dur: 20, size: "text-2xl" },
  { ch: "à", lang: "fr", x: "76%", delay: 13, dur: 17, size: "text-5xl" },
];

export function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Soft light blooms */}
      <motion.div
        className="absolute -top-32 -left-24 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-crimson) 0%, transparent 70%)", opacity: 0.12 }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)", opacity: 0.1 }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.18, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-crimson-light) 0%, transparent 70%)", opacity: 0.1 }}
        animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating multilingual glyphs */}
      {GLYPHS.map((g, i) => (
        <motion.span
          key={i}
          className={`absolute font-serif font-semibold select-none ${g.size} ${g.lang === "ar" ? "font-arabic" : ""}`}
          style={{ left: g.x, bottom: "-10%", color: "var(--color-crimson)", opacity: 0 }}
          animate={{
            y: ["0%", "-120vh"],
            opacity: [0, 0.16, 0.16, 0],
            rotate: [0, g.lang === "ar" ? -8 : 8, 0],
          }}
          transition={{
            duration: g.dur,
            delay: g.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.85, 1],
          }}
        >
          {g.ch}
        </motion.span>
      ))}
    </div>
  );
}
