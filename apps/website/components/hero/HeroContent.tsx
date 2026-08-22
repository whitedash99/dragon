"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { 
  Gamepad2, 
  ArrowRight, 
  Radio, 
  Sparkles,
  Layers,
  Download
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

interface CmsHeroData {
  eyebrow: string;
  announcement: string;
  title: string;
  subheadline: string;
  primaryCta: string;
}

function cleanAaaText(str: string | undefined, fallback: string): string {
  if (str === undefined || str === null || str.trim() === "") return fallback;
  return str.trim();
}

export function HeroContent() {
  const [cmsData, setCmsData] = useState<CmsHeroData>({
    eyebrow: "✦ INDEPENDENT 3D & 2D GAME DEVELOPMENT STUDIO",
    announcement: "DRAGON SLAYER 3D & NEON DRIFT — BUILDS READY FOR PC & MOBILE",
    title: "FORGING WORLDS BEYOND REALITY",
    subheadline: "Dragon Studios crafts original 3D & 2D games for PC and Mobile with high-performance graphics, ultra-low latency netcode, and immersive storytelling.",
    primaryCta: "EXPLORE ORIGINAL GAMES",
  });

  // Load from DB on mount & subscribe to real-time CMS sync
  useEffect(() => {
    // 1. Initial Fetch from CMS Blocks
    fetch("/api/cms/blocks")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blocks)) {
          const map: Record<string, string> = {};
          data.blocks.forEach((b: any) => { map[b.key] = b.content; });

          setCmsData((prev) => ({
            eyebrow: cleanAaaText(map["hero.eyebrow"], prev.eyebrow),
            announcement: cleanAaaText(map["hero.announcement"], prev.announcement),
            title: cleanAaaText(map["hero.title"] || map["hero_headline"], prev.title),
            subheadline: cleanAaaText(map["hero.subheadline"] || map["hero_subheadline"], prev.subheadline),
            primaryCta: cleanAaaText(map["hero.cta_primary"], prev.primaryCta),
          }));
        }
      })
      .catch(() => {});

    // 2. Real-time postMessage and BroadcastChannel Listener
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
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center text-center max-w-5xl mx-auto py-8 sm:py-16 px-4 sm:px-6 relative z-20 select-none"
    >
      {/* ═══ 1. Studio Eyebrow Pill ═══ */}
      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-cyan-500/30 backdrop-blur-xl mb-6 shadow-[0_0_25px_rgba(0,240,255,0.25)] hover:border-cyan-400 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <span
          data-cms-key="hero.eyebrow"
          className="font-mono text-xs font-bold tracking-widest text-cyan-300 uppercase"
        >
          {cmsData.eyebrow}
        </span>
      </motion.div>

      {/* ═══ 2. Title with Cyan & Electric Blue Gradient Accent ═══ */}
      <motion.h1
        variants={fadeUp}
        data-cms-key="hero.title"
        className="font-heading text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black uppercase tracking-tight leading-[0.98] sm:leading-[0.92] text-white max-w-4xl break-words"
      >
        {cmsData.title.toUpperCase().includes("BEYOND REALITY") ? (
          <>
            <span>{cmsData.title.toUpperCase().replace("BEYOND REALITY", "").trim()} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">
              BEYOND REALITY
            </span>
          </>
        ) : (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
            {cmsData.title}
          </span>
        )}
      </motion.h1>

      {/* ═══ 3. Subtitle / Mission Statement ═══ */}
      <motion.p
        variants={fadeUp}
        data-cms-key="hero.subheadline"
        className="mt-6 sm:mt-8 text-sm sm:text-lg text-slate-300 max-w-2xl font-sans font-normal leading-relaxed text-balance px-2"
      >
        {cmsData.subheadline}
      </motion.p>

      {/* ═══ 4. Live Transmission Ribbon ═══ */}
      <motion.div
        variants={fadeUp}
        className="mt-8 sm:mt-10 w-full max-w-2xl rounded-2xl bg-[#07111F]/90 border border-cyan-500/30 p-3 sm:p-4 backdrop-blur-xl shadow-2xl shadow-blue-950/40 flex items-center justify-between gap-3 overflow-hidden relative group hover:border-cyan-400/60 transition-all"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="size-3.5 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 truncate text-xs font-mono">
            <span className="font-bold text-cyan-300 shrink-0 uppercase tracking-wider">
              [ LIVE INTEL ]
            </span>
            <span data-cms-key="hero.announcement" className="text-slate-300 truncate font-medium">
              {cmsData.announcement}
            </span>
          </div>
        </div>

        <Link
          href="/games"
          onClick={() => soundFx.playClick()}
          className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 hover:text-white shrink-0 uppercase"
        >
          <span>Intel</span>
          <ArrowRight className="size-3" />
        </Link>
      </motion.div>

      {/* ═══ 5. Dual Prominent Action CTAs (Explore Games & Download Client) ═══ */}
      <motion.div
        variants={fadeUp}
        className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 w-full"
      >
        <Link
          href="/games"
          onClick={() => soundFx.playClick()}
          className="relative group overflow-hidden px-8 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-heading font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:shadow-[0_0_55px_rgba(0,240,255,0.75)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Gamepad2 className="size-4 sm:size-5 text-black" />
          <span data-cms-key="hero.cta_primary">{cmsData.primaryCta}</span>
          <ArrowRight className="size-4 sm:size-5 group-hover:translate-x-1 transition-transform text-black" />
        </Link>

        <Link
          href="/downloads"
          onClick={() => soundFx.playClick()}
          className="px-8 py-4 sm:py-4.5 rounded-2xl bg-[#040D24]/90 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 hover:text-white font-heading font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:bg-cyan-500/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Download className="size-4 sm:size-5 text-cyan-400" />
          <span>DOWNLOAD CLIENT</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
