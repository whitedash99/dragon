"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Monitor, 
  Pause, 
  Play, 
  X, 
  HardDrive, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Settings,
  Terminal,
  RefreshCw,
  Sliders,
  Bot,
  Flame
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
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
      <DashboardNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12 font-mono text-xs">
        {/* AAA Dragon Launcher Desktop Client Hero */}
        <section className="container-site relative z-10 mb-12">
          <div className="rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 overflow-hidden relative">
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#ff1e4b] via-purple-600 to-sky-400" 
            />

            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ff1e4b]/30 bg-[#ff1e4b]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#ff1e4b] mb-4">
                  <Monitor className="size-3.5" />
                  <span>DRAGON LAUNCHER v4.2 DESKTOP CLIENT</span>
                </div>

                <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl lg:text-6xl leading-[0.9] font-heading">
                  ONE LAUNCHER. <br />
                  <span className="text-[#ff1e4b]">ALL DRAGON UNIVERSES.</span>
                </h1>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed sm:text-base max-w-xl font-sans">
                  The official AAA desktop launcher for Dragon Studios. High-velocity delta patching, low-latency netcode sync, and 120 FPS high-refresh rate game updates.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button variant="solidRed" size="xl" className="rounded-xl gap-3 px-8 text-xs font-bold uppercase" asChild>
                    <a href="/downloads/DragonLauncher-Setup-v4.2.exe" download>
                      <Download className="size-5" />
                      <span>DOWNLOAD FOR WINDOWS 11/10 (124 MB)</span>
                    </a>
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span>SHA-256 Code Signed • Windows, Mac, Linux</span>
                  </div>
                </div>
              </div>

              {/* Launcher Client Configuration Card */}
              <div className="lg:col-span-5 rounded-3xl glass-heavy p-6 border border-white/15 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase text-white flex items-center gap-2 font-heading">
                    <Settings className="size-4 text-[#ff1e4b]" />
                    <span>LAUNCHER CLIENT CONFIG</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    VULKAN & DX12 READY
                  </span>
                </div>

                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between py-1">
                    <span>Release Channel:</span>
                    <select
                      value={releaseChannel}
                      onChange={(e: any) => setReleaseChannel(e.target.value)}
                      className="rounded-lg bg-black/60 px-3 py-1 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                    >
                      <option value="STABLE">STABLE (Production)</option>
                      <option value="BETA">BETA (Playtest Builds)</option>
                      <option value="EXPERIMENTAL">EXPERIMENTAL (Dev Engine)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span>Download Bandwidth Limit:</span>
                    <select
                      value={downloadLimit}
                      onChange={(e) => setDownloadLimit(e.target.value)}
                      className="rounded-lg bg-black/60 px-3 py-1 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
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
                        "px-3 py-1 rounded-lg font-bold text-[10px] uppercase border transition-colors",
                        autoStart ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-white/5 text-muted-foreground"
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
        <section className="container-site relative z-10 mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                HIGH-SPEED DELTA DOWNLOADER
              </span>
              <h2 className="mt-0.5 text-2xl font-black uppercase text-white font-heading">
                ACTIVE DOWNLOAD STREAM & QUEUE
              </h2>
            </div>
          </div>

          <div className="rounded-3xl glass-heavy p-8 border border-white/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-black/60 p-3.5 border border-white/10 shrink-0">
                  <Activity className="size-6 text-[#ff1e4b] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase font-heading">{activeDownload.title}</h3>
                  <span className="text-xs text-muted-foreground">{activeDownload.genre} • {activeDownload.installSize}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-lg font-black font-mono text-[#ff1e4b]">
                    {downloading ? "124.5 MB/s" : "PAUSED"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">NVMe DirectStorage Write</span>
                </div>

                <button
                  onClick={() => setDownloading(!downloading)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff1e4b] text-white hover:bg-[#ff1e4b]/80 transition-colors shadow-lg shadow-[#ff1e4b]/30"
                  title={downloading ? "Pause Download" : "Resume Download"}
                >
                  {downloading ? <Pause className="size-5" /> : <Play className="size-5 fill-current" />}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Downloading high-resolution textures & Vulkan pipeline shaders...</span>
                <span className="text-white font-bold">{progress}% (ETA: 2m 14s)</span>
              </div>

              <div className="h-3 w-full rounded-full bg-black/60 p-0.5 border border-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff1e4b] via-purple-600 to-sky-400 shadow-[0_0_12px_#ff1e4b]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Installed Storage Allocation Matrix */}
        <section className="container-site relative z-10 mb-16">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
              STORAGE ALLOCATION
            </span>
            <h2 className="mt-0.5 text-2xl font-black uppercase text-white font-heading">
              INSTALLED GAMES ON DRIVE C:\
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {userLibrary.map((game) => (
              <div key={game.id} className="rounded-3xl glass-heavy p-6 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <HardDrive className="size-5 text-[#ff1e4b]" />
                  <span className="text-xs font-mono text-white font-bold">{game.installSize}</span>
                </div>
                <h3 className="text-base font-black text-white uppercase font-heading">{game.title}</h3>
                <span className="text-xs text-emerald-400 font-bold block">{game.status}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
