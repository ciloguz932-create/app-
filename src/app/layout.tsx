import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BadgeToast } from "@/components/BadgeToast";

export const metadata: Metadata = {
  title: "Lumina Lingua",
  description: "Learn English and Arabic with spaced repetition and AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <BadgeToast />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
