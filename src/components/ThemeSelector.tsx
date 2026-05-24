"use client";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex gap-1.5 flex-wrap">
      {THEMES.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          title={t.label}
          className={cn(
            "w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all",
            theme === t.name ? "ring-2 ring-[var(--sidebar-text)] scale-110" : "opacity-60 hover:opacity-100"
          )}
        >
          {t.emoji}
        </button>
      ))}
    </div>
  );
}
