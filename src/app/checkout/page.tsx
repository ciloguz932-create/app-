"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, ExternalLink, Loader2, Lock, Crown, Building2 } from "lucide-react";

const PLAN_INFO: Record<string, { name: string; price: string; icon: typeof Crown }> = {
  pro: { name: "Pro", price: "₺99 / ay", icon: Crown },
  institution: { name: "Kurumsal", price: "₺999 / ay", icon: Building2 },
};

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "pro";
  const info = PLAN_INFO[plan] ?? PLAN_INFO.pro;
  const Icon = info.icon;

  const [hasStripe, setHasStripe] = useState<boolean | null>(null);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/29");
  const [cvc, setCvc] = useState("424");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setHasStripe(!!d.hasStripeKey))
      .catch(() => setHasStripe(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = hasStripe ? "/api/stripe/checkout" : "/api/checkout";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ödeme başarısız");
      router.push(data.url);
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
      <div className="bg-charcoal text-cream rounded-2xl p-5 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-gold" />
          <div>
            <p className="font-serif font-bold">Lumina {info.name}</p>
            <p className="text-xs text-cream/60">İstediğin zaman iptal et</p>
          </div>
        </div>
        <p className="text-lg font-bold text-gold">{info.price}</p>
      </div>

      <div className="bg-white border-2 border-cream-darker rounded-3xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-crimson" />
          <h1 className="font-serif text-xl font-bold text-charcoal">Ödeme</h1>
        </div>

        {hasStripe === null ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-crimson" />
          </div>
        ) : hasStripe ? (
          /* Real Stripe — redirect to hosted checkout */
          <div className="text-center space-y-4">
            <p className="text-sm text-muted">
              Güvenli Stripe ödeme sayfasına yönlendirileceksiniz.
            </p>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
            )}
            <button
              onClick={(e) => submit(e as unknown as React.FormEvent)}
              disabled={loading}
              className="w-full bg-crimson hover:bg-crimson-light text-cream py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              {loading ? "Yönlendiriliyor…" : `Stripe ile öde — ${info.price}`}
            </button>
            <p className="text-[11px] text-muted flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> 256-bit SSL şifreli ödeme
            </p>
          </div>
        ) : (
          /* Demo mode */
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wider">Kart numarası</label>
              <input
                type="text"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="mt-1 w-full bg-cream border-2 border-cream-darker rounded-xl px-4 py-3 text-charcoal font-mono focus:outline-none focus:border-crimson"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wider">Son kullanma</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="mt-1 w-full bg-cream border-2 border-cream-darker rounded-xl px-4 py-3 text-charcoal font-mono focus:outline-none focus:border-crimson"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wider">CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="mt-1 w-full bg-cream border-2 border-cream-darker rounded-xl px-4 py-3 text-charcoal font-mono focus:outline-none focus:border-crimson"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-crimson hover:bg-crimson-light text-cream py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? "İşleniyor…" : `${info.price} öde`}
            </button>

            <p className="text-[11px] text-muted text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Demo ödeme — gerçek kart bilgisi girmeyin
            </p>
          </form>
        )}
      </div>

      <p className="text-center text-sm text-muted mt-5">
        <Link href="/pricing" className="text-crimson font-semibold hover:underline">
          ← Planlara dön
        </Link>
      </p>
    </motion.div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <Suspense>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
