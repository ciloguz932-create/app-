import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BadgeToast } from "@/components/BadgeToast";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Lumina Lingua",
  description: "Learn English, Arabic & French with AI-powered spaced repetition",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lumina",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#A51C30",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <BadgeToast />
          {children}
        </ThemeProvider>
        <PWARegister />
      </body>
    </html>
  );
}
