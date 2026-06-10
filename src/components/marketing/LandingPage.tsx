"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  MessageCircle,
  Brain,
  Headphones,
  Trophy,
  BarChart3,
  ArrowRight,
  Star,
} from "lucide-react";
import { PricingSection } from "./PricingSection";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Aralıklı Tekrar (SM-2)",
    desc: "Bilimsel SuperMemo algoritması her kartı tam unutmak üzereyken karşına çıkarır.",
  },
  {
    icon: MessageCircle,
    title: "AI Konuşma Partneri",
    desc: "Claude ve Gemini destekli eğitmenlerle restoranda, havalimanında, iş görüşmesinde pratik yap.",
  },
  {
    icon: Brain,
    title: "Feynman Tekniği",
    desc: "Kelimeyi bir çocuğa anlatır gibi açıkla — AI netlik, doğruluk ve sadelik puanı versin.",
  },
  {
    icon: Headphones,
    title: "Dinleme Egzersizleri",
    desc: "ElevenLabs ile doğal seslendirme: duy, yaz, karşılaştır.",
  },
  {
    icon: Trophy,
    title: "XP, Rozetler, Seriler",
    desc: "13 rozet, seviye sistemi ve günlük seri takibiyle motivasyonun hiç düşmesin.",
  },
  {
    icon: BarChart3,
    title: "İlerleme Grafikleri",
    desc: "Günlük kart sayısı, doğruluk oranı ve GitHub tarzı aktivite haritası.",
  },
];

const TESTIMONIALS = [
  {
    name: "Zeynep K.",
    role: "Tıp öğrencisi",
    quote: "Tıbbi İngilizce kursuyla 3 haftada 60 terim öğrendim. Aralıklı tekrar gerçekten işe yarıyor.",
  },
  {
    name: "Mehmet A.",
    role: "Yazılım geliştirici",
    quote: "AI ile iş görüşmesi senaryosu çalıştım, gerçek mülakatta kendimi çok rahat hissettim.",
  },
  {
    name: "Elif T.",
    role: "Lise öğretmeni",
    quote: "Sınıfımdaki 30 öğrenci kurumsal planla kullanıyor. Admin panelinden herkesin ilerlemesini görüyorum.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-crimson rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-cream" />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold leading-none text-charcoal">Lumina</p>
            <p className="text-xs font-medium tracking-wider text-gold">LINGUA</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="hidden sm:block text-sm font-medium text-muted hover:text-charcoal transition-colors px-3 py-2"
          >
            Liderlik
          </Link>
          <Link
            href="/pricing"
            className="hidden sm:block text-sm font-medium text-muted hover:text-charcoal transition-colors px-3 py-2"
          >
            Fiyatlar
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-charcoal hover:text-crimson transition-colors px-3 py-2"
          >
            Giriş
          </Link>
          <Link
            href="/register"
            className="bg-crimson hover:bg-crimson-light text-cream text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            Ücretsiz başla
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-crimson bg-crimson/10 border border-crimson/20 px-3 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-crimson" />
            İngilizce · Arapça · Fransızca
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-charcoal leading-tight mb-6">
            Dil öğrenmenin{" "}
            <span className="text-crimson">akademik</span> yolu
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-9 leading-relaxed">
            Aralıklı tekrar, yapay zekâ konuşma partneri ve Feynman tekniği —
            hepsi Harvard estetiğinde tek bir uygulamada.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="bg-crimson hover:bg-crimson-light text-cream font-bold px-8 py-4 rounded-2xl transition-colors flex items-center gap-2 text-lg"
            >
              Hemen başla <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="text-charcoal font-semibold px-6 py-4 hover:text-crimson transition-colors"
            >
              Demo hesapla dene →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-white border-y border-cream-darker">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-charcoal text-center mb-12">
            Her şey bilimsel, her şey bir arada
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-cream border-2 border-cream-darker rounded-2xl p-6 hover:border-crimson/30 transition-colors"
              >
                <div className="w-11 h-11 bg-crimson/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-crimson" />
                </div>
                <h3 className="font-serif font-bold text-charcoal mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-charcoal text-center mb-12">
            Öğrenenler ne diyor?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border-2 border-cream-darker rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-charcoal leading-relaxed mb-4">"{t.quote}"</p>
                <p className="text-sm font-bold text-charcoal">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 bg-white border-y border-cream-darker">
        <h2 className="font-serif text-3xl font-bold text-charcoal text-center mb-3">
          Basit, şeffaf fiyatlandırma
        </h2>
        <p className="text-muted text-center mb-12">İstediğin zaman iptal et.</p>
        <PricingSection />
      </section>

      {/* CTA + Footer */}
      <section className="px-6 py-20 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-6">
          İlk kartını 60 saniye içinde çevir
        </h2>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-cream font-bold px-8 py-4 rounded-2xl transition-colors text-lg"
        >
          Ücretsiz hesap oluştur <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="px-6 py-8 border-t border-cream-darker text-center">
        <p className="text-xs text-muted">
          © 2026 Lumina Lingua · <span className="font-serif italic">"العلم نور"</span> — Bilgi ışıktır
        </p>
      </footer>
    </div>
  );
}
