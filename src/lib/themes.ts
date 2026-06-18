export type ThemeName = "light" | "dark";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  emoji: string;
  vars: Record<string, string>;
}

export const THEMES: ThemeConfig[] = [
  {
    name: "light",
    label: "Aydınlık",
    emoji: "☀️",
    vars: {
      "--color-crimson": "#A51C30",
      "--color-crimson-light": "#C41E3A",
      "--color-crimson-dark": "#7D1425",
      "--color-cream": "#FFFFFF",
      "--color-cream-dark": "#F5F5F5",
      "--color-cream-darker": "#E8E8E8",
      "--color-surface": "#FFFFFF",
      "--color-gold": "#C5A028",
      "--color-gold-light": "#E8C84A",
      "--color-gold-dark": "#9B7E1E",
      "--color-charcoal": "#111111",
      "--color-muted": "#666666",
      "--background": "#FFFFFF",
      "--foreground": "#111111",
      "--sidebar-bg": "#FFFFFF",
      "--sidebar-text": "#111111",
      "--sidebar-border": "rgba(0, 0, 0, 0.08)",
    },
  },
  {
    name: "dark",
    label: "Karanlık",
    emoji: "🌙",
    vars: {
      "--color-crimson": "#E03050",
      "--color-crimson-light": "#F04060",
      "--color-crimson-dark": "#C01840",
      "--color-cream": "#0A0A0A",
      "--color-cream-dark": "#141414",
      "--color-cream-darker": "#1E1E1E",
      "--color-surface": "#161616",
      "--color-gold": "#FFFFFF",
      "--color-gold-light": "#EEEEEE",
      "--color-gold-dark": "#CCCCCC",
      "--color-charcoal": "#FFFFFF",
      "--color-muted": "#AAAAAA",
      "--background": "#0A0A0A",
      "--foreground": "#FFFFFF",
      "--sidebar-bg": "#0D0D0D",
      "--sidebar-text": "#FFFFFF",
      "--sidebar-border": "rgba(255, 255, 255, 0.08)",
    },
  },
];

export function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.setAttribute("data-theme", theme.name);
  localStorage.setItem("theme", theme.name);
}

const VALID_THEMES = new Set<ThemeName>(["light", "dark"]);

export function getStoredTheme(): ThemeName {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as ThemeName;
  return VALID_THEMES.has(stored) ? stored : "light";
}
