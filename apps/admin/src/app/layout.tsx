import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { CyberAtmosphere } from "@/components/cinematic/CyberAtmosphere";

export const metadata: Metadata = {
  title: "Dragon Control | Studio Executive Command Center",
  description: "Official internal administration operating system for Dragon Gaming Studios.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <body className="bg-[#02040A] text-slate-100 min-h-screen font-sans antialiased relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* 3D Radiant Mesh & Particle Atmosphere */}
        <CyberAtmosphere />

        <ThemeProvider>
          <SessionProvider>
            <ToastProvider>
              <div className="relative z-10">{children}</div>
            </ToastProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
