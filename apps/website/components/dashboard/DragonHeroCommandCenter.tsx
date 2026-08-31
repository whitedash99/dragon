"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Crown,
  Sparkles,
  Zap,
  ShieldCheck,
  Headphones,
  User,
  ArrowUpRight,
  Key,
  Copy,
  Check,
  Gamepad2,
  Lock,
  Shield,
  Activity,
  Cpu
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { soundFx } from "@/lib/sound-effects";

interface DragonHeroCommandCenterProps {
  displayName: string;
  gamerTag: string;
  primaryTitle: string;
  avatarSrc: string;
  bannerTag: string;
  dragonId?: string;
  dragonKey?: string;
  userRole?: string;
  securityScore?: number;
  onNavigate: (tab: "dashboard" | "identity" | "support" | "community") => void;
  onOpenIdentityModal: () => void;
}

export function DragonHeroCommandCenter({
  displayName,
  gamerTag,
  primaryTitle,
  avatarSrc,
  bannerTag,
  dragonId = "DRG-ZDF-9415",
  dragonKey = "DRG-KEY-8942-XF92",
  userRole = "OWNER",
  securityScore = 98,
  onNavigate,
  onOpenIdentityModal,
}: DragonHeroCommandCenterProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(dragonId);
      setCopiedId(true);
      soundFx.playClick();
      setTimeout(() => setCopiedId(false), 2500);
    } catch {}
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(dragonKey);
      setCopiedKey(true);
      soundFx.playClick();
      setTimeout(() => setCopiedKey(false), 2500);
    } catch {}
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#030c27]/95 via-[#061235]/90 to-[#020512]/95 border-2 border-amber-400/60 p-6 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden">
      {/* Background Volumetric Auras */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Dragon Crest Watermark */}
      <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none">
        <DragonLogoIcon size="xl" className="w-64 h-64 text-amber-400" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Player Command Greeting & Dragon Credentials */}
        <div className="lg:col-span-8 space-y-5">
          {/* Top Status Indicators */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-[11px] font-mono font-black text-emerald-300 tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>ISOLATED PERSONAL VAULT</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-[11px] font-mono font-bold text-amber-300 uppercase">
              <Crown className="size-3.5 text-amber-400" />
              <span>{primaryTitle}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/40 text-[11px] font-mono font-bold text-purple-300 uppercase">
              <span>ROLE: {userRole}</span>
            </div>
          </div>

          {/* Welcome Title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white font-heading tracking-tight drop-shadow-md">
              WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">{displayName}</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 flex items-center gap-2">
              <span className="text-cyan-300 font-bold">@{gamerTag}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">HARDENED SECURITY COMMAND & PERSONAL CIPHER VAULT</span>
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PROMINENT PERSONAL DRAGON ID & PASS KEY VAULT DECK              */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* 1. Personal Dragon ID Display Box */}
            <div className="p-4 rounded-2xl bg-[#020512]/90 border-2 border-amber-400/70 shadow-[0_0_25px_rgba(245,158,11,0.3)] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 uppercase">
                <span className="flex items-center gap-1.5 font-bold">
                  <Key className="size-3 text-amber-400" />
                  PERSONAL DRAGON ID
                </span>
                <span className="text-emerald-400 font-bold">● ACTIVE</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg sm:text-xl font-mono font-black text-amber-200 tracking-wider">
                  {dragonId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 transition-all cursor-pointer"
                  title="Copy Personal Dragon ID"
                >
                  {copiedId ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                </button>
              </div>
            </div>

            {/* 2. Personal Dragon Secret Pass Key Box */}
            <div className="p-4 rounded-2xl bg-[#020512]/90 border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(0,229,255,0.25)] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 uppercase">
                <span className="flex items-center gap-1.5 font-bold">
                  <Lock className="size-3 text-cyan-400" />
                  CRYPTOGRAPHIC PASS KEY
                </span>
                <span className="text-cyan-400 font-bold">● PROTECTED</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg sm:text-xl font-mono font-black text-cyan-200 tracking-wider">
                  {dragonKey}
                </span>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-cyan-300 transition-all cursor-pointer"
                  title="Copy Pass Key"
                >
                  {copiedKey ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/api/auth/sso/launch"
              onClick={() => soundFx.playClick()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_25px_rgba(255,43,214,0.4)] border border-pink-400/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Gamepad2 className="size-4" />
              <span>LAUNCH SECOND DRAGON PORTAL →</span>
            </a>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onOpenIdentityModal();
              }}
              className="px-4 py-3 rounded-2xl bg-[#03091D]/90 hover:bg-amber-950/60 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider border border-amber-400/50 hover:border-amber-400 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User className="size-4 text-amber-400" />
              <span>CUSTOMIZE CIPHER IDENTITY</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onNavigate("support");
              }}
              className="px-4 py-3 rounded-2xl bg-[#03091D]/90 hover:bg-cyan-950/60 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-500/40 hover:border-cyan-400 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Headphones className="size-4 text-cyan-400" />
              <span>PLAYER SIGNALS</span>
            </button>
          </div>
        </div>

        {/* Right: Holographic Battle Avatar Badge */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div
            onClick={onOpenIdentityModal}
            className="group relative p-5 rounded-3xl bg-[#020512]/95 border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.3)] hover:border-amber-300 transition-all cursor-pointer flex flex-col items-center text-center space-y-3 w-full max-w-[280px]"
          >
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] shrink-0 group-hover:scale-105 transition-transform">
              <Image src={avatarSrc} alt={displayName} fill className="object-cover" />
            </div>

            <div className="space-y-1 w-full overflow-hidden">
              <div className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                ✦ {bannerTag}
              </div>
              <div className="text-base font-black uppercase text-white font-heading truncate">
                {displayName}
              </div>
              <div className="text-xs font-mono font-bold text-cyan-200 truncate">
                @{gamerTag}
              </div>
            </div>

            <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>SECURITY: {securityScore}/100</span>
              <span className="text-emerald-400">HARDENED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
