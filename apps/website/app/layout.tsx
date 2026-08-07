import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Rajdhani } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/providers/audio-provider";
import { AiProvider } from "@/providers/ai-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { Preloader } from "@/components/motion/Preloader";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { AiAssistant } from "@/components/ai/AiAssistant";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { CMSLiveSync } from "@/components/shared/CMSLiveSync";

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
    default: "Dragon Studios | AAA Game Development Studio",
    template: "%s | Dragon Studios",
  },
  description:
    "Dragon Studios - Premier AAA Game Development Studio creating immersive worlds powered by Dragon Engine.",
  keywords: [
    "Dragon Studios",
    "Game Studio",
    "AAA Games",
    "Dragon Engine",
    "Embers of Valyria",
    "Neon Drift",
    "Blacksite Zero",
    "Game Development",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dragonstudios.com",
    siteName: "Dragon Studios",
    title: "Dragon Studios | AAA Game Development Studio",
    description: "Creating immersive worlds powered by Dragon Engine.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Studios",
    description: "Creating immersive worlds powered by Dragon Engine.",
    site: OFFICIAL_SOCIALS.x.handle,
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
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} antialiased bg-background text-foreground selection:bg-dragon-500/30 selection:text-white`}
      >
        <AudioProvider>
          <AiProvider>
            <SmoothScrollProvider>
              <Preloader />
              <CustomCursor />
              <ScrollProgress />
              <CommandPalette />
              <AiAssistant />
              <CMSLiveSync />
              {children}
            </SmoothScrollProvider>
          </AiProvider>
        </AudioProvider>
      </body>
    </html>
  );
}