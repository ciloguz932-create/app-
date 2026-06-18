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
      <head>
        {/* Apply stored theme before first paint to avoid a flash of the
            wrong theme (especially dark → white). Mirrors src/lib/themes.ts. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='light';}if(t==='dark'){var v={'--color-crimson':'#E03050','--color-crimson-light':'#F04060','--color-crimson-dark':'#C01840','--color-cream':'#0A0A0A','--color-cream-dark':'#141414','--color-cream-darker':'#1E1E1E','--color-surface':'#161616','--color-gold':'#FFFFFF','--color-gold-light':'#EEEEEE','--color-gold-dark':'#CCCCCC','--color-charcoal':'#FFFFFF','--color-muted':'#AAAAAA','--background':'#0A0A0A','--foreground':'#FFFFFF','--sidebar-bg':'#0D0D0D','--sidebar-text':'#FFFFFF','--sidebar-border':'rgba(255,255,255,0.08)'};var r=document.documentElement;for(var k in v){r.style.setProperty(k,v[k]);}r.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
      </head>
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
