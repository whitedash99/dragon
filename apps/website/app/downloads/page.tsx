"use client";

import React from "react";
import Link from "next/link";
import { Download, Gamepad2, ArrowRight, ShieldCheck, Sparkles, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative">
      <Navbar />
      <DragonAtmosphere world="launch_bay" />

      <main className="relative z-10 pt-28 sm:pt-36 pb-24 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050D24]/90 border border-emerald-500/35 text-emerald-300 font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(16,217,139,0.25)]">
            <Download className="size-3.5 text-emerald-400" />
            <span>LAUNCH BAY & RELEASES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white uppercase leading-[0.95]">
            STANDALONE CLIENTS & PORTALS
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Direct access to Dragon Gaming Studios client software, companion portals, and real-time game runtimes.
          </p>
        </div>

        <div className="rounded-3xl bg-[#03091D]/90 border-2 border-cyan-500/40 p-8 sm:p-12 backdrop-blur-2xl text-center space-y-6 shadow-[0_0_60px_rgba(0,229,255,0.2)]">
          <div className="inline-flex p-4 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,229,255,0.4)]">
            <Gamepad2 className="size-10 text-cyan-300" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-heading tracking-tight">
              DRAGON WEB GAMES PORTAL
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Launch and play web-native titles instantly with your Dragon ID Single Sign-On credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="/api/auth/sso/launch"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-400 text-[#020617] font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Gamepad2 className="size-5 text-[#020617]" />
              <span>LAUNCH WEB GAMES →</span>
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
