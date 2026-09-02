import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { WorkspaceProvider } from "@/providers/workspace-context";

export const metadata: Metadata = {
  title: "Dragon Command | Universal Enterprise Command Center",
  description: "Official internal administration operating system for Dragon Gaming Studio & Dragon Web Games.",
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
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen font-sans antialiased relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
        <ThemeProvider>
          <SessionProvider>
            <WorkspaceProvider>
              <ToastProvider>
                <div className="relative z-10 min-h-screen flex flex-col">{children}</div>
              </ToastProvider>
            </WorkspaceProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
