"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, ArrowRight, Radio, Download } from "lucide-react";
import { soundFx } from "@/lib/sound-effects";
import { ConfigurableTextRotator } from "@/components/motion/ConfigurableTextRotator";

interface MobileHeroProps {
  cmsData?: {
    eyebrow?: string;
    announcement?: string;
    title?: string;
    subheadline?: string;
    primaryCta?: string;
  };
}

import { getClientCmsBlocks } from "@/lib/client-cms-cache";

export function MobileHero({ cmsData }: MobileHeroProps) {
  const [data, setData] = useState({
    eyebrow: cmsData?.eyebrow || "DRAGON GAMING STUDIOS",
    announcement: cmsData?.announcement || "UNCHARTED DRIVE: BEYOND & REFLEX RUSH — PRODUCTION BUILDS AVAILABLE FOR PC & MOBILE",
    title: cmsData?.title || "FORGING WORLDS BEYOND REALITY",
    subheadline: cmsData?.subheadline || "Original games built for PC and mobile, crafted with technology, imagination and immersive gameplay.",
    primaryCta: cmsData?.primaryCta || "EXPLORE GAMES",
  });

  useEffect(() => {
    getClientCmsBlocks().then((map) => {
      if (Object.keys(map).length > 0) {
        setData((prev) => ({
          eyebrow: map["hero.eyebrow"] || prev.eyebrow,
          announcement: map["hero.announcement"] || prev.announcement,
          title: map["hero.title"] || map["hero_headline"] || prev.title,
          subheadline: map["hero.subheadline"] || map["hero_subheadline"] || prev.subheadline,
          primaryCta: map["hero.cta_primary"] || prev.primaryCta,
        }));
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center text-center w-full px-3 py-4 select-none">
      {/* 1. Small Identity Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050D24]/90 border border-cyan-500/30 backdrop-blur-xl mb-3 shadow-[0_0_20px_rgba(0,229,255,0.25)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-cyan-300 uppercase">
          {data.eyebrow}
        </span>
      </div>

      {/* 2. Hero Headline Crafted for Phone Screens */}
      <h1 className="font-heading text-[2.2rem] xs:text-[2.6rem] font-black uppercase tracking-tight leading-[1.04] text-white px-1">
        {data.title.includes("BEYOND REALITY") ? (
          <>
            <span className="text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] block">
              FORGING WORLDS
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 via-blue-400 to-purple-400 drop-shadow-[0_0_30px_rgba(0,229,255,0.45)] block">
              BEYOND REALITY
            </span>
          </>
        ) : (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 via-blue-400 to-purple-400">
            {data.title}
          </span>
        )}
      </h1>

      {/* 3. Short Real Description */}
      <p className="mt-3 text-xs text-slate-300 font-sans leading-relaxed max-w-sm px-2 text-balance">
        {data.subheadline}
      </p>

      {/* 4. Live Transmission Ribbon */}
      <div className="mt-4 w-full max-w-xs rounded-2xl bg-[#050D24]/90 border border-cyan-500/30 p-2.5 backdrop-blur-xl shadow-xl flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="size-6 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="size-3 animate-pulse text-cyan-400" />
          </div>
          <div className="flex items-center gap-1.5 truncate text-[11px] font-mono min-w-0 flex-1">
            <span className="font-bold text-cyan-400 shrink-0 uppercase tracking-wider text-[10px]">
              [ DISPATCH ]
            </span>
            <ConfigurableTextRotator
              messages={[
                data.announcement,
                "UNCHARTED DRIVE: BEYOND — PC (.EXE) & ANDROID (.APK) OFFICIAL BUILDS READY",
                "REFLEX RUSH — HIGH-SPEED ADRENALINE RUNNER PLAYABLE LIVE IN BROWSER",
                "DRAGON 3D & 2D ENGINE — 120 FPS TARGET AND DETERMINISTIC PHYSICS NETCODE",
              ]}
              animationType="crossfade"
              displayDurationMs={7000}
              transitionDurationSec={0.7}
              textClassName="text-slate-300 font-medium truncate text-[10px]"
            />
          </div>
        </div>

        <Link
          href="/games"
          onClick={() => soundFx.playClick()}
          className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 hover:text-white shrink-0 uppercase p-1"
        >
          <span>Catalog</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* 5. Mobile Thumb-Friendly CTA Stack */}
      <div className="mt-5 flex flex-col items-stretch justify-center gap-3 w-full max-w-xs relative">
        {/* Ambient Glow */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-cyan-500/20 blur-2xl rounded-full" 
        />

        {/* Primary CTA */}
        <Link
          href="/games"
          onClick={() => soundFx.playClick()}
          className="relative group overflow-hidden w-full min-h-[48px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#338BFF] to-[#8B5CF6] text-white font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(0,229,255,0.45)] active:scale-95 transition-all"
        >
          <Gamepad2 className="size-4 text-white" />
          <span>{data.primaryCta}</span>
          <ArrowRight className="size-4 text-white" />
        </Link>

        {/* Secondary CTA */}
        <Link
          href="/downloads"
          onClick={() => soundFx.playClick()}
          className="relative group overflow-hidden w-full min-h-[48px] px-6 py-3.5 rounded-2xl bg-[#050D24]/80 border border-cyan-500/35 text-slate-200 hover:text-white font-heading font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-xl active:scale-95"
        >
          <Download className="size-4 text-cyan-400" />
          <span>VIEW RELEASES</span>
        </Link>
      </div>
    </div>
  );
}
