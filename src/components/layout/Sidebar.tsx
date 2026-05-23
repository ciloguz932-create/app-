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
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vocabulary", label: "Vocabulary", icon: BookOpen },
  { href: "/conversation", label: "Conversation", icon: MessageCircle },
  { href: "/scenarios", label: "Scenarios", icon: Theater },
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/reading", label: "Reading", icon: FileText },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-charcoal text-cream z-50 flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-cream/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-crimson rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-cream" />
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-cream leading-none">Lumina</p>
              <p className="text-xs text-gold font-medium tracking-wider">LINGUA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-cream/60 hover:text-cream"
          >
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-crimson text-cream shadow-lg"
                    : "text-cream/70 hover:text-cream hover:bg-cream/10"
                )}
              >
                <Icon className={cn("w-5 h-5", active ? "text-cream" : "text-cream/50")} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-6 py-4 border-t border-cream/10">
          <p className="text-xs text-cream/30 text-center font-serif italic">
            "العلم نور"
          </p>
          <p className="text-xs text-cream/20 text-center mt-1">Knowledge is light</p>
        </div>
      </aside>
    </>
  );
}
