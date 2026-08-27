import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Rajdhani } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import { AiProvider } from "@/providers/ai-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { AiAssistant } from "@/components/ai/AiAssistant";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { CMSLiveSync } from "@/components/shared/CMSLiveSync";
import { WebsiteAnalyticsTracker } from "@/components/shared/WebsiteAnalyticsTracker";
import { MobileShell } from "@/components/mobile/MobileShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Dragon Studios | 3D & 2D Game Development Studio",
    template: "%s | Dragon Studios",
  },
  description:
    "Dragon Studios - Independent Game Development Studio creating immersive 3D & 2D games for PC and Mobile.",
  keywords: [
    "Dragon Studios",
    "Game Studio",
    "Dragon Games",
    "3D Games",
    "2D Games",
    "PC Games",
    "Android Games",
    "Uncharted Drive",
    "Reflex Rush",
    "Game Development",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dragongamingstudios.vercel.app",
    siteName: "Dragon Studios",
    title: "Dragon Studios | 3D & 2D Game Development Studio",
    description: "Creating immersive 3D & 2D games for PC and Mobile.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Studios",
    description: "Creating immersive worlds powered by Dragon Engine.",
    site: OFFICIAL_SOCIALS.x.handle,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} antialiased bg-[#01040D] text-foreground selection:bg-cyan-500/30 selection:text-white`}
      >
        <SessionProvider>
          <AiProvider>
            <SmoothScrollProvider>
              <ScrollProgress />
              <CommandPalette />
              <AiAssistant />
              <CMSLiveSync />
              <WebsiteAnalyticsTracker />
              <MobileShell>{children}</MobileShell>
            </SmoothScrollProvider>
          </AiProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
