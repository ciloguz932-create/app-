"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  Headphones,
  FileText,
  BarChart3,
  GraduationCap,
  Theater,
  Trophy,
  Library,
  Brain,
  PenTool,
  Settings,
  Medal,
  Package,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { XPBar } from "@/components/XPBar";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vocabulary", label: "Vocabulary", icon: BookOpen },
  { href: "/courses", label: "Courses", icon: Library },
  { href: "/packages", label: "Packages", icon: Package },
  { href: "/conversation", label: "Conversation", icon: MessageCircle },
  { href: "/scenarios", label: "Scenarios", icon: Theater },
  { href: "/feynman", label: "Feynman", icon: Brain },
  { href: "/writing", label: "Writing", icon: PenTool },
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/reading", label: "Reading", icon: FileText },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/leaderboard", label: "Leaderboard", icon: Medal },
  { href: "/badges", label: "Badges", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useTheme();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    // Full reload clears the in-memory session/theme context cleanly.
    window.location.assign("/");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--sidebar-text)" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--color-crimson)] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5" style={{ color: "var(--sidebar-text)" }} />
            </div>
            <div>
              <p className="font-serif text-lg font-semibold leading-none" style={{ color: "var(--sidebar-text)" }}>Lumina</p>
              <p className="text-xs font-medium tracking-wider" style={{ color: "var(--color-gold)" }}>LINGUA</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden" style={{ color: "var(--sidebar-text)", opacity: 0.6 }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                )}
                style={{
                  backgroundColor: active ? "var(--color-crimson)" : "transparent",
                  color: active ? "var(--sidebar-text)" : `color-mix(in srgb, var(--sidebar-text) 70%, transparent)`,
                }}
              >
                <Icon className="w-5 h-5" style={{ opacity: active ? 1 : 0.5 }} />
                {label}
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: pathname.startsWith("/admin") ? "var(--color-gold)" : "transparent",
                color: pathname.startsWith("/admin")
                  ? "#2C2C2C"
                  : `color-mix(in srgb, var(--color-gold) 85%, transparent)`,
              }}
            >
              <ShieldCheck className="w-5 h-5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 space-y-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {user && (
            <div className="flex items-center gap-3 px-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: user.avatarColor }}
              >
                {user.avatarEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--sidebar-text)" }}>
                    {user.name}
                  </p>
                  {user.plan !== "free" && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[var(--color-gold)] text-charcoal px-1.5 py-0.5 rounded-full">
                      {user.plan === "pro" ? "PRO" : "KURUM"}
                    </span>
                  )}
                </div>
                <p className="text-[10px] truncate" style={{ color: "var(--sidebar-text)", opacity: 0.5 }}>
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Çıkış yap"
                className="p-1.5 rounded-lg transition-opacity hover:opacity-100"
                style={{ color: "var(--sidebar-text)", opacity: 0.5 }}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          <XPBar />
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--sidebar-text)", opacity: 0.4 }}>Theme</p>
            <ThemeSelector />
          </div>
          <div className="text-center">
            <p className="text-xs font-serif italic" style={{ color: "var(--sidebar-text)", opacity: 0.3 }}>"العلم نور"</p>
          </div>
        </div>
      </aside>
    </>
  );
}
