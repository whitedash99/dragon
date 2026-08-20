"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Download,
  Play,
  Monitor,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

export interface FranchiseGame {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  genre: string;
  engine: string;
  version: string;
  status: string;
  dimension: "3D" | "2D";
  backdropUrl: string;
  bannerGradient: string;
  accentColor: string;
  glowColor: string;
  pcExeUrl: string;
  apkUrl: string;
  features: string[];
  capabilities: {
    platforms: string;
    renderEngine: string;
    netcode: string;
    graphics: string;
  };
}

const FRANCHISE_GAMES: FranchiseGame[] = [
  {
    id: "dragon-slayer-3d",
    slug: "dragon-slayer-3d",
    title: "DRAGON SLAYER 3D",
    subtitle: "Open-World Dark Fantasy Action RPG",
    tagline: "Wield primordial dragon blades in open mythical realms with fluid melee combat, dynamic dragon flight, and real-time world events.",
    genre: "Action RPG • Open World",
    engine: "Dragon 3D Engine (Vulkan)",
    version: "v1.4.0 Alpha",
    status: "ACTIVE DEVELOPMENT",
    dimension: "3D",
    backdropUrl: "/images/dragon_slayer_card.jpg",
    bannerGradient: "from-blue-950/95 via-[#08183a]/90 to-[#02050e]",
    accentColor: "#00f0ff",
    glowColor: "rgba(0, 240, 255, 0.6)",
    pcExeUrl: "https://github.com/whitedash99/dragon/releases/download/v1.0.0/DragonSlayer3D-Setup.exe",
    apkUrl: "https://github.com/whitedash99/dragon/releases/download/v1.0.0/DragonSlayer3D-Mobile.apk",
    features: ["Real-Time Ray Tracing", "Multi-Branch Combat", "Full Cross-Play", "Ultra-Low Latency Netcode"],
    capabilities: {
      platforms: "PC (.exe) & Mobile (.apk)",
      renderEngine: "Vulkan 3D Core",
      netcode: "Edge Sync Deterministic",
      graphics: "Ray Tracing Accelerated",
    },
  },
  {
    id: "cyber-drift-3d",
    slug: "cyber-drift-3d",
    title: "CYBER DRIFT: OVERDRIVE",
    subtitle: "Cyberpunk Anti-Gravity Tactical Racing",
    tagline: "Defy gravity on vertical neon highways of Neo-Tokyo. High-octane plasma weapons, hyper-drift mechanics, and synthwave reactive sound.",
    genre: "Anti-Gravity Racing",
    engine: "Dragon Speed Engine 3D",
    version: "v2.0.1 Beta",
    status: "ALPHA PLAYTEST",
    dimension: "3D",
    backdropUrl: "/images/cyber_drift_card.jpg",
    bannerGradient: "from-cyan-950/95 via-[#061e38]/90 to-[#02050e]",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.6)",
    pcExeUrl: "https://github.com/whitedash99/dragon/releases/download/v1.0.0/CyberDrift-Setup.exe",
    apkUrl: "https://github.com/whitedash99/dragon/releases/download/v1.0.0/CyberDrift-Mobile.apk",
    features: ["Plasma Combat Boosters", "Track Editor Suite", "Global Leaderboards", "Anti-Gravity Physics"],
    capabilities: {
      platforms: "PC (.exe) & Mobile (.apk)",
      renderEngine: "DirectX 12 / Vulkan",
      netcode: "Real-Time Ghost Sync",
      graphics: "Volumetric Plasma Lightning",
    },
  },
  {
    id: "shadow-ninja-2d",
    slug: "shadow-ninja-2d",
    title: "SHADOW NINJA: DYNASTY",
    subtitle: "Fluid Stealth Action Platformer",
    tagline: "Execute pixel-perfect stealth assassinations across hand-crafted feudal cyberpunk castles with katana combos and shadow teleportation.",
    genre: "Stealth Action • Metroidvania",
    engine: "Dragon 2D Pixel Core",
    version: "v1.2.0 Release",
    status: "EARLY ACCESS",
    dimension: "2D",
    backdropUrl: "/images/shadow_ninja_card.jpg",
    bannerGradient: "from-purple-950/95 via-[#0b1028]/90 to-[#02050e]",
    accentColor: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.6)",
    pcExeUrl: "https://github.com/whitedash99/dragon/releases/download/v1.0.0/ShadowNinja-Setup.exe",
    apkUrl: "https://github.com/whitedash99/dragon/releases/download/v1.0.0/ShadowNinja-Mobile.apk",
    features: ["Hand-Drawn Sprites", "Zero-Lag Input Buffer", "Speedrun Telemetry", "Boss Rush Trials"],
    capabilities: {
      platforms: "PC (.exe) & Mobile (.apk)",
      renderEngine: "High-DPI 2D Vector",
      netcode: "Cloud Save Sync",
      graphics: "Sub-Pixel Motion Smoothing",
    },
  },
];

export default function FeaturedGames() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);

  const currentGame = FRANCHISE_GAMES[currentIndex];

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % FRANCHISE_GAMES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const triggerLightningAirLift = () => {
    setLightningFlash(true);
    try {
      soundFx.playLightningSpark();
    } catch {}
    setTimeout(() => {
      setLightningFlash(false);
    }, 450);
  };

  const slideNext = () => {
    soundFx.playSlideWhoosh();
    triggerLightningAirLift();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % FRANCHISE_GAMES.length);
  };

  const slidePrev = () => {
    soundFx.playSlideWhoosh();
    triggerLightningAirLift();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + FRANCHISE_GAMES.length) % FRANCHISE_GAMES.length);
  };

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    soundFx.playSlideWhoosh();
    triggerLightningAirLift();
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  return (
    <section
      id="games"
      aria-labelledby="dragon-games-showcase"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-[#020614] select-none [perspective:1400px]"
    >
      {/* Dynamic Background Plasma Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[1000px] rounded-full bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent blur-[180px]"
      />

      {/* Top Electric Cyan Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
        {/* ═══ Top Section Header ═══ */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-cyan-500/20 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
              <span>ORIGINAL 3D & 2D FRANCHISES</span>
            </div>
            <h2
              id="dragon-games-showcase"
              className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white font-heading tracking-tight"
            >
              ORIGINAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300">FRANCHISES</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">
              TITLES 0{currentIndex + 1} / 0{FRANCHISE_GAMES.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={slidePrev}
                className="size-11 rounded-2xl bg-[#040D24] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-black/40"
                aria-label="Previous Game"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={slideNext}
                className="size-11 rounded-2xl bg-[#040D24] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-black/40"
                aria-label="Next Game"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ 3D Dragon Lightning Air-Lifting Banner Showcase ═══ */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
            lightningFlash
              ? "border-cyan-300 shadow-[0_0_80px_rgba(0,240,255,0.9)] scale-[1.01]"
              : "border-cyan-500/35 shadow-[0_15px_60px_rgba(0,10,35,0.9)]"
          } bg-[#03091D] min-h-[540px] sm:min-h-[580px] flex flex-col justify-end transform-gpu`}
        >
          {/* Lightning Flash Overlay on Banner Attachment */}
          {lightningFlash && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-white/30 to-blue-500/20 pointer-events-none z-30 animate-pulse" />
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentGame.id}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction > 0 ? 120 : -120,
                y: -35,
                rotateX: 6,
                rotateY: direction > 0 ? 6 : -6,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: direction > 0 ? -120 : 120,
                y: -25,
                rotateX: -4,
                rotateY: direction > 0 ? -6 : 6,
                scale: 0.94,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                mass: 0.9,
              }}
              className="absolute inset-0 size-full transform-gpu will-change-transform"
            >
              {/* Game Backdrop Artwork */}
              <div className="absolute inset-0 size-full">
                <Image
                  src={currentGame.backdropUrl}
                  alt={currentGame.title}
                  fill
                  priority
                  className="object-cover object-center scale-105 filter brightness-90 hover:scale-108 transition-transform duration-700"
                />
                {/* Cinematic Vignette & Deep Blue Shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050E] via-[#02050E]/80 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#02050E] via-transparent to-[#02050E]/60" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Foreground Game Content & Live Controls */}
          <div className="relative z-20 p-6 sm:p-10 lg:p-14 space-y-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
                <Zap className="size-3 text-cyan-400 animate-pulse" />
                <span>{currentGame.dimension} MASTERPIECE</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-slate-300 font-mono text-[11px] font-bold">
                {currentGame.engine}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold">
                {currentGame.status}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase font-heading tracking-tight text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                {currentGame.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-200 font-sans max-w-2xl leading-relaxed drop-shadow-md">
                {currentGame.tagline}
              </p>
            </div>

            {/* High-Tech Architectural Capability Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-black/65 border border-cyan-500/25 backdrop-blur-xl space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">PLATFORMS</span>
                <span className="text-xs font-mono font-black text-cyan-300 flex items-center gap-1.5 truncate">
                  <Monitor className="size-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{currentGame.capabilities.platforms}</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/65 border border-cyan-500/25 backdrop-blur-xl space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">RENDER CORE</span>
                <span className="text-xs font-mono font-black text-white flex items-center gap-1.5 truncate">
                  <Layers className="size-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{currentGame.capabilities.renderEngine}</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/65 border border-cyan-500/25 backdrop-blur-xl space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">NETCODE</span>
                <span className="text-xs font-mono font-black text-emerald-400 flex items-center gap-1.5 truncate">
                  <Activity className="size-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{currentGame.capabilities.netcode}</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/65 border border-cyan-500/25 backdrop-blur-xl space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">LIGHTING PIPELINE</span>
                <span className="text-xs font-mono font-black text-sky-300 truncate">
                  {currentGame.capabilities.graphics}
                </span>
              </div>
            </div>

            {/* Launch & Download CTA Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <a
                href={currentGame.pcExeUrl}
                download
                onClick={() => soundFx.playClick()}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Monitor className="size-4" />
                <span>DOWNLOAD PC (.EXE)</span>
              </a>

              <a
                href={currentGame.apkUrl}
                download
                onClick={() => soundFx.playClick()}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#05112E] border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-500/20 font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Smartphone className="size-4" />
                <span>MOBILE (.APK)</span>
              </a>

              <Link
                href={`/games/${currentGame.slug}`}
                className="px-5 py-3.5 rounded-2xl bg-black/60 border border-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:border-cyan-400 transition-all cursor-pointer"
              >
                <span>EXPLORE DETAILS</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-6 right-6 sm:right-10 z-20 flex items-center gap-2">
            {FRANCHISE_GAMES.map((g, idx) => (
              <button
                key={g.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? "w-8 bg-cyan-400 shadow-[0_0_12px_#00f0ff]" : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Slide to ${g.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
