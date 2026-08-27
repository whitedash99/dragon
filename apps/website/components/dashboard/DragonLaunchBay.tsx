"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Monitor,
  Smartphone,
  ShieldCheck,
  Zap,
  HardDrive,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

export function DragonLaunchBay() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
            <Download className="size-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white font-heading tracking-tight">
              DRAGON LAUNCH BAY
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Direct Game Builds & Client Packages via Secure Edge Streams
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-[10px] font-mono font-bold text-emerald-300 uppercase">
          <ShieldCheck className="size-3.5" />
          <span>BACKBLAZE B2 VERIFIED PIPELINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PC Standalone Client */}
        <div className="rounded-3xl bg-[#03091D]/90 border-2 border-cyan-500/30 p-6 sm:p-8 backdrop-blur-2xl space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                WINDOWS PC (.EXE)
              </span>
              <Monitor className="size-5 text-cyan-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading tracking-tight">
                DRAGON GAME PC INSTALLER
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Direct standalone installer optimized for high framerates, Vulkan/DirectX 12 acceleration, and spatial audio.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-left">
                <div className="text-[9px] font-mono text-cyan-300 uppercase">PACKAGE SIZE</div>
                <div className="text-xs font-mono font-bold text-white">~650 MB</div>
              </div>
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-left">
                <div className="text-[9px] font-mono text-cyan-300 uppercase">SIGNATURE</div>
                <div className="text-xs font-mono font-bold text-white">SHA-256 Verified</div>
              </div>
            </div>
          </div>

          <Link
            href="/downloads"
            onClick={() => soundFx.playClick()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#1685FF] text-[#020617] text-xs font-mono font-black uppercase tracking-widest shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="size-4" />
            <span>DOWNLOAD PC INSTALLER (.EXE)</span>
          </Link>
        </div>

        {/* Mobile APK Package */}
        <div className="rounded-3xl bg-[#03091D]/90 border-2 border-purple-500/30 p-6 sm:p-8 backdrop-blur-2xl space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold uppercase">
                ANDROID MOBILE (.APK)
              </span>
              <Smartphone className="size-5 text-purple-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading tracking-tight">
                DRAGON MOBILE PACKAGE
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Direct mobile package for Android devices with multi-touch haptics, low battery consumption, and responsive scaling.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-left">
                <div className="text-[9px] font-mono text-purple-300 uppercase">PACKAGE SIZE</div>
                <div className="text-xs font-mono font-bold text-white">~120 MB</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-left">
                <div className="text-[9px] font-mono text-purple-300 uppercase">OS COMPATIBILITY</div>
                <div className="text-xs font-mono font-bold text-white">Android 9.0+</div>
              </div>
            </div>
          </div>

          <Link
            href="/downloads"
            onClick={() => soundFx.playClick()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#FF2BD6] text-white text-xs font-mono font-black uppercase tracking-widest shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="size-4" />
            <span>DOWNLOAD MOBILE APK (.APK)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
