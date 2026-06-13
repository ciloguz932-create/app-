import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { AuthBackground } from "@/components/auth/AuthBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-cream flex flex-col overflow-hidden">
      <AuthBackground />
      <header className="relative z-10 px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-9 h-9 bg-crimson rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-cream" />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold leading-none text-charcoal">Lumina</p>
            <p className="text-xs font-medium tracking-wider text-gold">LINGUA</p>
          </div>
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">{children}</main>
    </div>
  );
}
