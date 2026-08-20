"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Monitor, 
  Smartphone,
  Pause, 
  Play, 
  HardDrive, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Settings,
  Gamepad2,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { userLibrary } from "@/data/userData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function DownloadsPage() {
  const [downloading, setDownloading] = useState(true);
  const [progress, setProgress] = useState(74);
  const [releaseChannel, setReleaseChannel] = useState<"STABLE" | "BETA" | "EXPERIMENTAL">("STABLE");
  const [autoStart, setAutoStart] = useState(true);
  const [downloadLimit, setDownloadLimit] = useState("UNLIMITED");

  const activeDownload = userLibrary.find((g) => g.status === "Downloading") || userLibrary[0];

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-28 pt-20 sm:pt-24 font-mono text-xs">
        {/* Dragon Launcher Desktop & Mobile Client Hero */}
        <section className="container-site relative z-10 mb-8 sm:mb-12 px-4 sm:px-6">
          <div className="rounded-3xl bg-[#060D22]/90 backdrop-blur-xl p-5 sm:p-8 lg:p-12 border border-cyan-500/30 overflow-hidden relative shadow-2xl">
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-sky-300" 
            />

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-blue-600/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400">
                  <Monitor className="size-3.5" />
                  <span>DRAGON CLIENT v4.2 DOWNLOADS</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-[0.95] font-heading">
                  ONE CLIENT. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">ALL 3D & 2D UNIVERSES.</span>
                </h1>

                <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl">
                  The official high-performance client for Dragon Studios games. Fast delta updates, low-latency netcode sync, and 120 FPS game builds for PC and Mobile.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button variant="glow" size="lg" className="w-full sm:w-auto rounded-2xl gap-2.5 px-6 sm:px-8 text-xs font-mono font-black uppercase shadow-lg shadow-cyan-500/25" asChild>
                    <a href="https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D_Setup.exe" download>
                      <Monitor className="size-4" />
                      <span>DOWNLOAD PC (.EXE)</span>
                    </a>
                  </Button>

                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl gap-2.5 px-6 sm:px-8 text-xs font-mono font-bold uppercase border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/20" asChild>
                    <a href="https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D.apk" download>
                      <Smartphone className="size-4" />
                      <span>DOWNLOAD MOBILE (.APK)</span>
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 pt-1">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>SHA-256 Code Signed • Windows 11/10 (.exe) & Android 10+ (.apk)</span>
                </div>
              </div>

              {/* Launcher Client Configuration Card */}
              <div className="lg:col-span-5 rounded-3xl bg-[#040816] p-4 sm:p-6 border border-cyan-500/20 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase text-white flex items-center gap-2 font-heading">
                    <Settings className="size-4 text-cyan-400" />
                    <span>LAUNCHER CONFIG</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    DRAGON NETCODE READY
                  </span>
                </div>

                <div className="space-y-2.5 sm:space-y-3 text-xs text-slate-400">
                  <div className="flex items-center justify-between py-1">
                    <span>Release Channel:</span>
                    <select
                      value={releaseChannel}
                      onChange={(e: any) => setReleaseChannel(e.target.value)}
                      className="rounded-xl bg-[#07132B] px-3 py-1.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="STABLE">STABLE (Production)</option>
                      <option value="BETA">BETA (Playtest Builds)</option>
                      <option value="EXPERIMENTAL">EXPERIMENTAL (Dev Engine)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span>Bandwidth Limit:</span>
                    <select
                      value={downloadLimit}
                      onChange={(e) => setDownloadLimit(e.target.value)}
                      className="rounded-xl bg-[#07132B] px-3 py-1.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="UNLIMITED">UNLIMITED (Full Fiber)</option>
                      <option value="50MB">50 MB/s Cap</option>
                      <option value="20MB">20 MB/s Cap</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span>Auto-Launch on Boot:</span>
                    <button
                      onClick={() => setAutoStart(!autoStart)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase border transition-colors cursor-pointer",
                        autoStart ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-white/5 text-slate-400"
                      )}
                    >
                      {autoStart ? "ENABLED" : "DISABLED"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Game Download Stream Monitor */}
        <section className="container-site relative z-10 mb-8 sm:mb-12 px-4 sm:px-6">
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                HIGH-SPEED DELTA DOWNLOADER
              </span>
              <h2 className="mt-0.5 text-xl sm:text-2xl font-black uppercase text-white font-heading">
                ACTIVE DOWNLOAD STREAM
              </h2>
            </div>
          </div>

          <div className="rounded-3xl bg-[#060D22]/80 backdrop-blur-xl p-5 sm:p-8 border border-blue-500/20 space-y-4 sm:space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="rounded-2xl bg-blue-600/20 p-3 sm:p-3.5 border border-blue-500/30 shrink-0">
                  <Activity className="size-5 sm:size-6 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase font-heading">{activeDownload.title}</h3>
                  <span className="text-[11px] sm:text-xs text-slate-400">{activeDownload.genre} • {activeDownload.installSize}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <span className="block text-base sm:text-lg font-black font-mono text-cyan-400">
                    {downloading ? "124.5 MB/s" : "PAUSED"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">NVMe DirectStorage Write</span>
                </div>

                <button
                  onClick={() => setDownloading(!downloading)}
                  className="flex size-10 sm:size-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
                  title={downloading ? "Pause Download" : "Resume Download"}
                >
                  {downloading ? <Pause className="size-4 sm:size-5 stroke-[2.5]" /> : <Play className="size-4 sm:size-5 fill-current" />}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-slate-400">
                <span className="truncate pr-2">Downloading textures & game files...</span>
                <span className="text-white font-bold shrink-0">{progress}% (ETA: 2m 14s)</span>
              </div>

              <div className="h-2.5 sm:h-3 w-full rounded-full bg-black/60 p-0.5 border border-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_12px_#00f0ff]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Installed Storage Allocation Matrix */}
        <section className="container-site relative z-10 mb-12 sm:mb-16 px-4 sm:px-6">
          <div className="mb-4 sm:mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              STORAGE ALLOCATION
            </span>
            <h2 className="mt-0.5 text-xl sm:text-2xl font-black uppercase text-white font-heading">
              INSTALLED GAMES LIBRARY
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-3">
            {userLibrary.map((game) => (
              <div key={game.id} className="rounded-3xl bg-[#060D22]/80 backdrop-blur-xl p-4 sm:p-6 border border-blue-500/20 space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <HardDrive className="size-4 sm:size-5 text-cyan-400" />
                  <span className="text-xs font-mono text-white font-bold">{game.installSize}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase font-heading">{game.title}</h3>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-bold block">{game.status}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
