"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATARS = ["🎓", "📚", "🦉", "🌟", "🚀", "🧠", "🌍", "✨"];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("🎓");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, avatarEmoji: avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Kayıt başarısız");
      router.push("/dashboard");
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
        <h1 className="font-serif text-2xl font-bold text-charcoal mb-1">Hesap oluştur</h1>
        <p className="text-sm text-muted mb-6">
          230+ başlangıç kartı seni bekliyor — İngilizce, Arapça, Fransızca.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Avatar</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {AVATARS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all",
                    avatar === a
                      ? "border-crimson bg-crimson/10 scale-110"
                      : "border-cream-darker bg-cream hover:border-crimson/40"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">İsim</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              autoComplete="name"
              className="mt-1 w-full bg-cream border-2 border-cream-darker rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-crimson"
              placeholder="Adın"
            />
          </div>
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
            <label className="text-xs font-medium text-muted uppercase tracking-wider">
              Şifre <span className="normal-case">(en az 8 karakter)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? "Kartların hazırlanıyor…" : "Ücretsiz başla"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-muted mt-5">
        Zaten hesabın var mı?{" "}
        <Link href="/login" className="text-crimson font-semibold hover:underline">
          Giriş yap
        </Link>
      </p>
    </motion.div>
  );
}
