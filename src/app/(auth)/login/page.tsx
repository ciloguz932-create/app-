"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, LogIn, Sparkles, Crown } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent, demoEmail?: string) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demoEmail ?? email,
          password: demoEmail ? "Lumina2026!" : password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Giriş başarısız");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white border-2 border-cream-darker rounded-3xl p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-charcoal mb-1">Tekrar hoş geldin</h1>
        <p className="text-sm text-muted mb-6">Öğrenmeye kaldığın yerden devam et.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full bg-cream border-2 border-cream-darker rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-crimson"
              placeholder="sen@ornek.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 w-full bg-cream border-2 border-cream-darker rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-crimson"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-crimson hover:bg-crimson-light text-cream py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            Giriş yap
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-cream-darker">
          <p className="text-[10px] uppercase tracking-wider text-muted mb-2 text-center">Demo hesaplar</p>
          <div className="flex gap-2">
            <button
              onClick={() => submit(undefined, "demo@lumina.app")}
              disabled={loading}
              className="flex-1 bg-cream border border-cream-darker hover:border-crimson/40 text-charcoal text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-crimson" /> Öğrenci
            </button>
            <button
              onClick={() => submit(undefined, "admin@lumina.app")}
              disabled={loading}
              className="flex-1 bg-cream border border-cream-darker hover:border-gold text-charcoal text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-gold" /> Admin
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-muted mt-5">
        Hesabın yok mu?{" "}
        <Link href="/register" className="text-crimson font-semibold hover:underline">
          Ücretsiz kayıt ol
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
