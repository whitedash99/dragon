import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dragon Admin Portal | Enterprise Operating System",
  description: "Official internal administration dashboard for Dragon Studios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050508] text-slate-100 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
