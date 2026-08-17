import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "Dragon Admin Portal | Enterprise Operating System",
  description: "Official internal administration dashboard for Dragon Studios.",
};

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('dragon-admin-theme');
      var resolved = 'light';
      if (saved === 'dark') {
        resolved = 'dark';
      } else if (saved === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = 'light';
      }
      var root = document.documentElement;
      if (resolved === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans antialiased transition-colors duration-200 relative overflow-x-hidden">
        {/* DRAGON OS VISUAL ENHANCEMENT LAYER: Subtle Ambient Light Orbs */}
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
