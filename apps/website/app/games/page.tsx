import React from "react";
import Link from "next/link";
import { Sparkles, Gamepad2, ArrowRight, ShieldCheck, Layers, Cpu } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";

export const revalidate = 0;

export default async function GamesPage() {
  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative">
      <Navbar />
      <DragonAtmosphere world="cyber_vault" />

      <main className="relative z-10 pt-28 sm:pt-36 pb-24 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Cinematic Header */}
        <div className="relative space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050D24]/90 border border-cyan-500/35 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(0,229,255,0.25)]">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span>DRAGON GAME ARSENAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white uppercase leading-[0.95]">
            NEXT-GEN GAME SUITE
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Our studio game lineup is currently in active staging. Custom titles and AAA experiences will deploy directly to your Dragon Command Center.
          </p>
        </div>

        {/* Staging Status Card */}
        <div className="rounded-3xl bg-[#03091D]/90 border-2 border-purple-500/40 p-8 sm:p-12 backdrop-blur-2xl text-center space-y-6 shadow-[0_0_60px_rgba(124,60,255,0.2)]">
          <div className="inline-flex p-4 rounded-2xl bg-purple-500/20 border border-purple-400/50 shadow-[0_0_25px_rgba(124,60,255,0.4)]">
            <Gamepad2 className="size-10 text-purple-300" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-heading tracking-tight">
              SECOND PORTAL ONLINE
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Play arcade, physics, and strategy titles immediately through the second Dragon Web Games companion portal authenticated with your Dragon ID.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="/api/auth/sso/launch"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,43,214,0.4)] border border-pink-400/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Gamepad2 className="size-5 text-pink-300" />
              <span>LAUNCH DRAGON WEB GAMES →</span>
            </a>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#020512] hover:bg-cyan-950/60 text-cyan-300 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer"
            >
              <span>ENTER COMMAND CENTER</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
