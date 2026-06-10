import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getSession } from "@/lib/auth";
import { PricingSection } from "@/components/marketing/PricingSection";

export default async function PricingPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3">
          <div className="w-9 h-9 bg-crimson rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-cream" />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold leading-none text-charcoal">Lumina</p>
            <p className="text-xs font-medium tracking-wider text-gold">LINGUA</p>
          </div>
        </Link>
        {session ? (
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-charcoal hover:text-crimson transition-colors"
          >
            ← Uygulamaya dön
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-sm font-semibold text-charcoal hover:text-crimson transition-colors"
          >
            Giriş yap
          </Link>
        )}
      </nav>

      <div className="px-6 py-12">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal text-center mb-3">
          Planını seç
        </h1>
        <p className="text-muted text-center mb-12">
          Ücretsiz başla, hazır olduğunda yükselt. İstediğin zaman iptal et.
        </p>
        <PricingSection loggedIn={!!session} />
      </div>
    </div>
  );
}
