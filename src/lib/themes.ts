export type ThemeName = "harvard" | "dark" | "ocean" | "forest" | "minimal";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  emoji: string;
  vars: Record<string, string>;
}

export const THEMES: ThemeConfig[] = [
  {
    name: "harvard",
    label: "Harvard",
    emoji: "🏛️",
    vars: {
      "--color-crimson": "#A51C30",
      "--color-crimson-light": "#C41E3A",
      "--color-crimson-dark": "#7D1425",
      "--color-cream": "#FEF9F0",
      "--color-cream-dark": "#F0E8D8",
      "--color-cream-darker": "#E5D9C5",
      "--color-gold": "#C5A028",
      "--color-gold-light": "#E8C84A",
      "--color-gold-dark": "#9B7E1E",
      "--color-charcoal": "#2C2C2C",
      "--color-muted": "#7A6B55",
      "--background": "#FEF9F0",
      "--foreground": "#2C2C2C",
      "--sidebar-bg": "#2C2C2C",
      "--sidebar-text": "#FEF9F0",
    },
  },
  {
    name: "dark",
    label: "Dark",
    emoji: "🌙",
    vars: {
      "--color-crimson": "#E05878",
      "--color-crimson-light": "#F06888",
      "--color-crimson-dark": "#C03858",
      "--color-cream": "#1E1E2E",
      "--color-cream-dark": "#181825",
      "--color-cream-darker": "#313244",
      "--color-gold": "#F9E2AF",
      "--color-gold-light": "#FFD866",
      "--color-gold-dark": "#D4A028",
      "--color-charcoal": "#CDD6F4",
      "--color-muted": "#9090B0",
      "--background": "#1E1E2E",
      "--foreground": "#CDD6F4",
      "--sidebar-bg": "#11111B",
      "--sidebar-text": "#CDD6F4",
    },
  },
  {
    name: "ocean",
    label: "Ocean",
    emoji: "🌊",
    vars: {
      "--color-crimson": "#0077B6",
      "--color-crimson-light": "#0096C7",
      "--color-crimson-dark": "#005A8C",
      "--color-cream": "#F0F8FF",
      "--color-cream-dark": "#E0F0FA",
      "--color-cream-darker": "#C8DFF0",
      "--color-gold": "#00B4D8",
      "--color-gold-light": "#48CAE4",
      "--color-gold-dark": "#0096C7",
      "--color-charcoal": "#03045E",
      "--color-muted": "#4A7FA0",
      "--background": "#F0F8FF",
      "--foreground": "#03045E",
      "--sidebar-bg": "#03045E",
      "--sidebar-text": "#F0F8FF",
    },
  },
  {
    name: "forest",
    label: "Forest",
    emoji: "🌿",
    vars: {
      "--color-crimson": "#2D6A4F",
      "--color-crimson-light": "#40916C",
      "--color-crimson-dark": "#1B4332",
      "--color-cream": "#F5F0E8",
      "--color-cream-dark": "#EBE3D0",
      "--color-cream-darker": "#D4C9B0",
      "--color-gold": "#D4A017",
      "--color-gold-light": "#E8C44A",
      "--color-gold-dark": "#A87D12",
      "--color-charcoal": "#1B4332",
      "--color-muted": "#52796F",
      "--background": "#F5F0E8",
      "--foreground": "#1B4332",
      "--sidebar-bg": "#1B4332",
      "--sidebar-text": "#F5F0E8",
    },
  },
  {
    name: "minimal",
    label: "Minimal",
    emoji: "⬜",
    vars: {
      "--color-crimson": "#111111",
      "--color-crimson-light": "#333333",
      "--color-crimson-dark": "#000000",
      "--color-cream": "#FFFFFF",
      "--color-cream-dark": "#F5F5F5",
      "--color-cream-darker": "#E8E8E8",
      "--color-gold": "#555555",
      "--color-gold-light": "#777777",
      "--color-gold-dark": "#333333",
      "--color-charcoal": "#111111",
      "--color-muted": "#666666",
      "--background": "#FFFFFF",
      "--foreground": "#111111",
      "--sidebar-bg": "#111111",
      "--sidebar-text": "#FFFFFF",
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

export function getStoredTheme(): ThemeName {
  if (typeof window === "undefined") return "harvard";
  return (localStorage.getItem("theme") as ThemeName) ?? "harvard";
}
