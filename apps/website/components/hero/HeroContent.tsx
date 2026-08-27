"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Gamepad2, 
  ArrowRight, 
  Radio, 
  Download
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";
import { ConfigurableTextRotator } from "@/components/motion/ConfigurableTextRotator";

interface CmsHeroData {
  eyebrow: string;
  announcement: string;
  title: string;
  subheadline: string;
  primaryCta: string;
}

import { getClientCmsBlocks } from "@/lib/client-cms-cache";

function cleanAaaText(str: string | undefined, fallback: string): string {
  if (str === undefined || str === null || str.trim() === "") return fallback;
  return str.trim();
}

export function HeroContent() {
  const [cmsData, setCmsData] = useState<CmsHeroData>({
    eyebrow: "DRAGON GAMING STUDIOS",
    announcement: "UNCHARTED DRIVE: BEYOND & REFLEX RUSH — PRODUCTION BUILDS AVAILABLE FOR PC & MOBILE",
    title: "FORGING WORLDS BEYOND REALITY",
    subheadline: "Original games built for PC and mobile, crafted with technology, imagination and immersive gameplay.",
    primaryCta: "EXPLORE GAMES",
  });

  // Load from DB on mount & subscribe to real-time CMS sync
  useEffect(() => {
    getClientCmsBlocks().then((map) => {
      if (Object.keys(map).length > 0) {
        setCmsData((prev) => ({
          eyebrow: cleanAaaText(map["hero.eyebrow"], prev.eyebrow),
          announcement: cleanAaaText(map["hero.announcement"], prev.announcement),
          title: cleanAaaText(map["hero.title"] || map["hero_headline"], prev.title),
          subheadline: cleanAaaText(map["hero.subheadline"] || map["hero_subheadline"], prev.subheadline),
          primaryCta: cleanAaaText(map["hero.cta_primary"], prev.primaryCta),
        }));
      }
    });

    const handleSync = (event: MessageEvent) => {
      const { type, key, content } = event.data || {};
      if (
        (type === "DRAGON_CMS_TEXT_UPDATE" ||
         type === "DRAGON_CMS_REALTIME_SYNC" ||
         type === "DRAGON_CMS_TEXT_TYPING") &&
        key && content !== undefined
      ) {
        const cleanContent = cleanAaaText(content, content);
        setCmsData((prev) => {
          if (key === "hero.eyebrow") return { ...prev, eyebrow: cleanContent };
          if (key === "hero.announcement") return { ...prev, announcement: cleanContent };
          if (key === "hero.title" || key === "hero_headline") return { ...prev, title: cleanContent };
          if (key === "hero.subheadline" || key === "hero_subheadline") return { ...prev, subheadline: cleanContent };
          if (key === "hero.cta_primary") return { ...prev, primaryCta: cleanContent };
          return prev;
        });
      }
    };

    window.addEventListener("message", handleSync);
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("dragon_cms_live_sync");
      bc.addEventListener("message", handleSync);
    } catch {}

    return () => {
      window.removeEventListener("message", handleSync);
      if (bc) {
        bc.removeEventListener("message", handleSync);
        bc.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-center max-w-5xl mx-auto py-2 sm:py-6 px-2 sm:px-6 relative z-20 select-none w-full">
      {/* ═══ 1. Identity Badge (Reveals at 300ms) ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#050D24]/90 border border-cyan-500/30 backdrop-blur-xl mb-3 sm:mb-5 shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:border-cyan-400 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <span
          data-cms-key="hero.eyebrow"
          className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.16em] sm:tracking-[0.2em] text-cyan-300 uppercase"
        >
          {cmsData.eyebrow}
        </span>
      </motion.div>

      {/* ═══ 2. Refined Display Typography with Layered Dimensional Lighting ═══ */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        data-cms-key="hero.title"
        className="font-heading text-[2.15rem] xs:text-4xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black uppercase tracking-tight leading-[1.04] sm:leading-[0.86] max-w-5xl break-words px-1"
      >
        {(cmsData?.title || "FORGING WORLDS BEYOND REALITY").toUpperCase().includes("BEYOND REALITY") ? (
          <>
            <span className="text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] block sm:inline">
              FORGING WORLDS{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 via-blue-400 to-purple-400 drop-shadow-[0_0_35px_rgba(0,229,255,0.45)] block sm:inline">
              BEYOND REALITY
            </span>
          </>
        ) : (cmsData?.title || "").toUpperCase().includes("WORTH ENTERING") ? (
          <>
            <span className="text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] block sm:inline">
              BUILDING WORLDS{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 via-blue-400 to-purple-400 drop-shadow-[0_0_35px_rgba(0,229,255,0.45)] block sm:inline">
              WORTH ENTERING.
            </span>
          </>
        ) : (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 via-blue-400 to-purple-400 drop-shadow-[0_0_35px_rgba(0,229,255,0.45)]">
            {cmsData.title}
          </span>
        )}
      </motion.h1>

      {/* ═══ 3. Subheadline / Positioning (Reveals at 650ms) ═══ */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        data-cms-key="hero.subheadline"
        className="mt-3 sm:mt-5 text-xs sm:text-lg text-slate-300 max-w-2xl font-sans font-normal leading-relaxed text-balance px-2"
      >
        {cmsData.subheadline}
      </motion.p>

      {/* ═══ 4. Live Transmission Ribbon (Reveals at 720ms) ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3.5 sm:mt-6 w-full max-w-2xl rounded-2xl bg-[#050D24]/90 border border-cyan-500/30 p-2.5 sm:p-3 backdrop-blur-xl shadow-xl flex items-center justify-between gap-2 sm:gap-3 overflow-hidden relative group hover:border-cyan-400/60 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="size-6 sm:size-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="size-3 sm:size-3.5 animate-pulse text-cyan-400" />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 truncate text-xs font-mono min-w-0 flex-1">
            <span className="font-bold text-cyan-400 shrink-0 uppercase tracking-wider text-[10px] sm:text-[11px]">
              [ DISPATCH ]
            </span>
            <ConfigurableTextRotator
              messages={[
                cmsData.announcement,
                "UNCHARTED DRIVE: BEYOND — PC (.EXE) & ANDROID (.APK) OFFICIAL BUILDS READY",
                "REFLEX RUSH — HIGH-SPEED ADRENALINE RUNNER PLAYABLE LIVE IN BROWSER",
                "DRAGON 3D & 2D ENGINE — 120 FPS TARGET AND DETERMINISTIC PHYSICS NETCODE",
              ]}
              animationType="crossfade"
              displayDurationMs={7000}
              transitionDurationSec={0.7}
              textClassName="text-slate-300 font-medium truncate text-[11px] sm:text-xs"
            />
          </div>
        </div>

        <Link
          href="/games"
          onClick={() => soundFx.playClick()}
          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-cyan-400 hover:text-white shrink-0 uppercase transition-colors p-1"
        >
          <span>Catalog</span>
          <ArrowRight className="size-3" />
        </Link>
      </motion.div>

      {/* ═══ 5. CTA Actions (Dominant at 800ms, Secondary at 950ms) ═══ */}
      <div className="mt-4 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-5 w-full max-w-xs sm:max-w-none relative">
        {/* Soft Volumetric Cyan-Blue Glow Behind Primary Button */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-24 bg-cyan-500/20 blur-2xl rounded-full" 
        />

        {/* DOMINANT PRIMARY CTA (Reveals at 800ms) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full sm:w-auto"
        >
          <Link
            href="/games"
            onClick={() => soundFx.playClick()}
            className="relative group overflow-hidden w-full min-h-[48px] px-8 py-3.5 sm:px-9 sm:py-4.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#338BFF] to-[#8B5CF6] text-white font-heading font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_30px_rgba(0,229,255,0.45)] hover:shadow-[0_0_45px_rgba(0,229,255,0.7)] hover:-translate-y-0.5 active:scale-95 active:translate-y-0.5 transition-all duration-300"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[280%] transition-transform duration-700 pointer-events-none"
            />
            <Gamepad2 className="size-4 sm:size-5 text-white" />
            <span data-cms-key="hero.cta_primary">{cmsData.primaryCta}</span>
            <ArrowRight className="size-4 sm:size-5 group-hover:translate-x-1 transition-transform text-white" />
          </Link>
        </motion.div>

        {/* QUIETER SECONDARY CTA (Reveals at 950ms) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="w-full sm:w-auto"
        >
          <Link
            href="/downloads"
            onClick={() => soundFx.playClick()}
            className="relative group overflow-hidden w-full min-h-[48px] px-7 py-3.5 sm:px-8 sm:py-4.5 rounded-2xl bg-[#050D24]/80 border border-cyan-500/35 hover:border-cyan-400 text-slate-200 hover:text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg hover:bg-[#0B1A3A] transition-all flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-xl active:scale-95"
          >
            <Download className="size-4 sm:size-5 text-cyan-400 transition-colors" />
            <span>VIEW RELEASES</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
