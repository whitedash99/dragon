"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Download, 
  Monitor, 
  Smartphone,
  HardDrive, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Settings,
  Gamepad2,
  Zap,
  Globe,
  ExternalLink
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/cn";
import { DownloadButton } from "@/components/games/DownloadButton";
import { GAME_PALETTES } from "@/lib/theme/game-theme";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative">
      <Navbar />

      {/* ═══ WORLD 4: DRAGON LAUNCH BAY 3D ATMOSPHERE ═══ */}
      <DragonAtmosphere world="launch_bay" />

      <main className="relative z-10 pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* ═══ HEADER HERO ═══ */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050D24]/90 border border-emerald-500/35 text-emerald-300 font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(16,217,139,0.25)]">
            <Download className="size-3.5 text-emerald-400" />
            <span>OFFICIAL DRAGON CLIENT & BUILDS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white uppercase leading-[0.95]">
            DIRECT GAME BUILDS & CLIENT
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            High-performance standalone PC installers (.exe) and mobile packages (.apk) delivered directly via Backblaze B2 secure edge streams.
          </p>
        </div>

        {/* ═══ FLAGSHIP DOWNLOAD SHOWCASE (UNCHARTED DRIVE: BEYOND) ═══ */}
        <div className="max-w-3xl mx-auto">
          {/* Flagship: Uncharted Drive: Beyond */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#03091D]/95 border border-cyan-500/35 backdrop-blur-2xl space-y-6 shadow-[0_0_50px_rgba(0,229,255,0.2)] flex flex-col justify-between hover:border-cyan-400 transition-all duration-300 font-mono">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                  3D HIGHWAY DRIVING SIMULATION
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,217,139,0.8)]" />
                  <span>v1.0.0 Live Official</span>
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wide">
                  UNCHARTED DRIVE: BEYOND
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  Experience next-gen open highway journeys across majestic mountain horizons, golden sunsets, and uncharted asphalt curves with ultra-responsive vehicle dynamics.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#02050E] border border-cyan-500/20 space-y-2.5 text-xs font-mono text-slate-300 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Windows PC Release Package:</span>
                  <span className="text-cyan-300 font-bold">650 MB (.exe) • Direct Installer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Android Mobile Release Package:</span>
                  <span className="text-emerald-300 font-bold">120 MB (.apk) • Direct Package</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <DownloadButton
                slug="uncharted-drive-beyond"
                platform="WINDOWS"
                label="Download PC (.exe)"
                fileSize="650 MB"
                theme={GAME_PALETTES["orange"]}
              />

              <DownloadButton
                slug="uncharted-drive-beyond"
                platform="ANDROID"
                label="Download Android (.apk)"
                fileSize="120 MB"
                theme={GAME_PALETTES["orange"]}
              />
            </div>
          </div>
        </div>

        {/* ═══ SECURITY & CHECKSUM GUARANTEE ═══ */}
        <div className="p-8 rounded-3xl bg-[#050D24]/80 border border-cyan-500/30 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,217,139,0.3)]">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h4 className="text-sm font-mono font-bold text-white uppercase">
                INTEGRITY & SECURITY GUARANTEE
              </h4>
              <p className="text-xs text-slate-300 font-sans">
                Every release binary is validated against cryptographic SHA-256 signatures before CDN distribution.
              </p>
            </div>
          </div>

          <Link
            href="/games"
            className="px-6 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all whitespace-nowrap shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            Explore All Franchises →
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
