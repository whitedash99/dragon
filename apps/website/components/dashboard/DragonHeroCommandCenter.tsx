"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Crown,
  Sparkles,
  Zap,
  Download,
  ShieldCheck,
  Headphones,
  User,
  ArrowUpRight
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { soundFx } from "@/lib/sound-effects";

interface DragonHeroCommandCenterProps {
  displayName: string;
  gamerTag: string;
  primaryTitle: string;
  avatarSrc: string;
  bannerTag: string;
  onNavigate: (tab: "dashboard" | "games" | "identity" | "downloads" | "support") => void;
  onOpenIdentityModal: () => void;
}

export function DragonHeroCommandCenter({
  displayName,
  gamerTag,
  primaryTitle,
  avatarSrc,
  bannerTag,
  onNavigate,
  onOpenIdentityModal,
}: DragonHeroCommandCenterProps) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#030c27]/95 via-[#061235]/90 to-[#020512]/95 border-2 border-cyan-500/35 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,229,255,0.18)] overflow-hidden">
      {/* Background Volumetric Auras */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00E5FF]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#7C3CFF]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Dragon Crest Watermark */}
      <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none">
        <DragonLogoIcon size="xl" className="w-56 h-56 text-cyan-400" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Player Command Greeting */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-[11px] font-mono font-black text-cyan-300 tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <ShieldCheck className="size-3.5 text-cyan-400" />
              <span>DRAGON ID VERIFIED OPERATIVE</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/40 text-[11px] font-mono font-bold text-purple-300 uppercase">
              <Crown className="size-3.5 text-amber-400" />
              <span>{primaryTitle}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white font-heading tracking-tight drop-shadow-md">
              WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7C3CFF] to-[#FF2BD6]">{displayName}</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 flex items-center gap-2">
              <span className="text-cyan-300 font-bold">@{gamerTag}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">YOUR DRAGON UNIVERSE COMMAND CENTER</span>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
            Access verified studio game builds, manage your universal Dragon ID profile, track security status, and dispatch direct player support signals.
          </p>

          {/* Quick Action Matrix */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onNavigate("games");
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#1685FF] text-[#020617] text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Gamepad2 className="size-4" />
              <span>EXPLORE GAMES</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onOpenIdentityModal();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#03091D]/90 hover:bg-cyan-950/60 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-500/40 hover:border-cyan-400 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User className="size-4" />
              <span>MY DRAGON ID</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onNavigate("support");
              }}
              className="px-4 py-2.5 rounded-xl bg-[#03091D]/90 hover:bg-purple-950/60 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider border border-purple-500/40 hover:border-purple-400 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Headphones className="size-4" />
              <span>PLAYER SUPPORT</span>
            </button>
          </div>
        </div>

        {/* Right: Holographic Avatar Badge */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div
            onClick={onOpenIdentityModal}
            className="group relative p-4 rounded-3xl bg-[#020512]/90 border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,229,255,0.25)] hover:border-cyan-300 transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_#00E5FF] shrink-0 group-hover:scale-105 transition-transform">
              <Image src={avatarSrc} alt={displayName} fill className="object-cover" />
            </div>

            <div className="space-y-1 overflow-hidden pr-2">
              <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase">
                ✦ {bannerTag}
              </div>
              <div className="text-sm font-black uppercase text-white font-heading truncate">
                {displayName}
              </div>
              <div className="text-xs font-mono text-cyan-200 truncate">
                @{gamerTag}
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
                <span>EDIT DRAGON ID</span>
                <ArrowUpRight className="size-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
