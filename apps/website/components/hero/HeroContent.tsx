"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { 
  Zap, 
  Gamepad2, 
  MessagesSquare, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  Cpu, 
  Users, 
  Trophy, 
  Layers 
} from "lucide-react";
import { cn } from "@/lib/cn";

interface CmsHeroData {
  eyebrow: string;
  announcement: string;
  title: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
}

export function HeroContent() {
  const [cmsData, setCmsData] = useState<CmsHeroData>({
    eyebrow: "✦ NEXT-GEN AAA GAME DEVELOPMENT STUDIO",
    announcement: "EMBERS OF VALYRIA — GLOBAL PRE-ALPHA RECRUITMENT ONLINE",
    title: "FORGING WORLDS BEYOND REALITY",
    subheadline: "Dragon Studios crafts blockbuster AAA experiences, proprietary simulation engines, and cinematic virtual universes that redefine interactive entertainment.",
    primaryCta: "EXPLORE AAA TITLES",
    secondaryCta: "JOIN LIVE COMMUNITY",
    tertiaryCta: "CAREERS & WORKFORCE",
  });

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blocks)) {
          const map: Record<string, string> = {};
          data.blocks.forEach((b: any) => { map[b.key] = b.content; });
          setCmsData((prev) => ({
            eyebrow: map["hero.eyebrow"] || prev.eyebrow,
            announcement: map["hero.announcement"] || prev.announcement,
            title: map["hero.title"] || map["hero_headline"] || prev.title,
            subheadline: map["hero.subheadline"] || map["hero_subheadline"] || prev.subheadline,
            primaryCta: map["hero.cta_primary"] || prev.primaryCta,
            secondaryCta: map["hero.cta_secondary"] || prev.secondaryCta,
            tertiaryCta: map["hero.cta_tertiary"] || prev.tertiaryCta,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center text-center max-w-5xl mx-auto py-8 relative z-20 select-none"
    >
      {/* ═══ 1. High-Tech Studio Eyebrow Pill ═══ */}
      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(37,99,235,0.25)] group hover:border-cyan-400 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <span className="font-mono text-xs font-bold tracking-widest text-cyan-300 uppercase">
          {cmsData.eyebrow}
        </span>
      </motion.div>

      {/* ═══ 2. Billion-Dollar AAA Cinematic Title ═══ */}
      <motion.h1
        variants={fadeUp}
        className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black uppercase tracking-tight leading-[0.92] text-white max-w-4xl"
      >
        <span>FORGING WORLDS </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.6)]">
          BEYOND REALITY
        </span>
      </motion.h1>

      {/* ═══ 3. Subtitle / Mission Statement ═══ */}
      <motion.p
        variants={fadeUp}
        className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl font-sans font-normal leading-relaxed text-balance"
      >
        {cmsData.subheadline}
      </motion.p>

      {/* ═══ 4. Cyber HUD Live Transmission Ribbon ═══ */}
      <motion.div
        variants={fadeUp}
        className="mt-8 w-full max-w-2xl rounded-2xl bg-[#07111F]/90 border border-blue-500/30 p-3.5 backdrop-blur-xl shadow-2xl shadow-blue-950/40 flex items-center justify-between gap-3 overflow-hidden relative group hover:border-cyan-400/60 transition-all"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="size-3.5 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 truncate text-xs font-mono">
            <span className="font-bold text-cyan-300 shrink-0 uppercase tracking-wider">
              [ LIVE TRANSMISSION ]
            </span>
            <span className="text-slate-300 truncate font-medium">
              {cmsData.announcement}
            </span>
          </div>
        </div>

        <Link
          href="/games/embers-of-valyria"
          className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 hover:text-white shrink-0 uppercase"
        >
          <span>Intel</span>
          <ArrowRight className="size-3" />
        </Link>
      </motion.div>

      {/* ═══ 5. Billion-Dollar CTA Action Buttons ═══ */}
      <motion.div
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full"
      >
        {/* Button 1: Solid Glowing Electric Blue */}
        <Link
          href="/games"
          className="relative group overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-heading font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_45px_rgba(6,182,212,0.7)] hover:scale-105 transition-all flex items-center gap-2.5"
        >
          <Gamepad2 className="size-4 text-cyan-200" />
          <span>{cmsData.primaryCta}</span>
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Link>

        {/* Button 2: Obsidian Glass with Electric Blue Glow */}
        <Link
          href="/community"
          className="px-8 py-4 rounded-2xl bg-[#07111F]/90 border border-blue-500/40 text-cyan-300 font-heading font-black text-xs uppercase tracking-widest hover:bg-blue-600/20 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:scale-105 transition-all flex items-center gap-2.5 backdrop-blur-xl"
        >
          <MessagesSquare className="size-4 text-cyan-400" />
          <span>{cmsData.secondaryCta}</span>
        </Link>
      </motion.div>

      {/* ═══ 6. Studio Authority Metric Badges ═══ */}
      <motion.div
        variants={fadeUp}
        className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
      >
        {[
          { label: "ENGINE ARCHITECTURE", val: "Dragon Engine v5.5", icon: Cpu },
          { label: "ACTIVE PLAYERS", val: "15.2M+ Registered", icon: Users },
          { label: "VISUAL FIDELITY", val: "4K • 120 FPS Ray-Tracing", icon: Layers },
          { label: "ESPORTS CIRCUIT", val: "$250,000 GTD Annual", icon: Trophy },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#07111F]/70 border border-blue-500/20 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-1 hover:border-cyan-400/40 transition-colors shadow-lg shadow-black/40"
          >
            <item.icon className="size-4 text-cyan-400 mb-1" />
            <div className="text-xs font-mono font-bold text-white uppercase tracking-tight">{item.val}</div>
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{item.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
