import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "Dragon Control OS | Executive Command Center",
  description: "Official internal administration dashboard for Dragon Studios.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
  },
};

const themeScript = `
  (function() {
    try {
      var root = document.documentElement;
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-[#040812] text-slate-100 min-h-screen font-sans antialiased relative overflow-x-hidden">
        {/* DRAGON OS VISUAL ENHANCEMENT LAYER: Subtle Ambient Cyber Orbs */}
        <div className="ambient-light-mesh" aria-hidden="true">
          <div className="ambient-orb-violet" />
          <div className="ambient-orb-cyan" />
          <div className="ambient-orb-emerald" />
        </div>

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
