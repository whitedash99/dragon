"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Download,
  Play,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  Smartphone,
  Monitor
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";
import { getGameVisualTheme } from "@/lib/theme/game-theme";
import { GameBadge } from "@/components/games/GameBadge";
import { MobileGameCard } from "@/components/mobile/MobileGameCard";
import { getClientGamesList } from "@/lib/client-cms-cache";

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
  accentColor: string;
  secondaryAccent: string;
  glowColor: string;
  pcExeUrl?: string;
  apkUrl?: string;
  webPlayUrl?: string;
  features: string[];
  capabilities: {
    platforms: string;
    renderEngine: string;
    netcode: string;
    graphics: string;
  };
}

const CANONICAL_GAMES: FranchiseGame[] = [
  {
    id: "uncharted-drive-beyond",
    slug: "uncharted-drive-beyond",
    title: "UNCHARTED DRIVE: BEYOND",
    subtitle: "Next-Gen Open Road Driving Simulation",
    tagline: "Experience high-speed highway journeys across majestic mountain horizons, golden sunsets, and uncharted asphalt curves with ultra-responsive vehicle dynamics and volumetric lighting.",
    genre: "Open Road Simulation",
    engine: "Dragon Driving 3D Engine",
    version: "v1.0.0 Official Release",
    status: "OFFICIAL FLAGSHIP",
    dimension: "3D",
    backdropUrl: "/images/uncharted-drive-banner.png",
    accentColor: "#f59e0b", // Amber
    secondaryAccent: "#ef4444", // Crimson
    glowColor: "rgba(245, 158, 11, 0.45)",
    pcExeUrl: "/api/games/uncharted-drive-beyond/download?platform=windows",
    apkUrl: "/api/games/uncharted-drive-beyond/download?platform=android",
    features: ["Next-Gen Vehicle Physics", "Sunset & Mountain Environments", "Dynamic Highway Traffic", "Cross-Platform Support"],
    capabilities: {
      platforms: "PC (.exe) & Android (.apk)",
      renderEngine: "Dragon 3D Vulkan",
      netcode: "Edge Low-Latency Sync",
      graphics: "Volumetric Atmospheric Sunsets",
    },
  },
];

export default function FeaturedGames() {
  const [gamesList, setGamesList] = useState<FranchiseGame[]>(CANONICAL_GAMES);

  useEffect(() => {
    getClientGamesList().then((games) => {
      if (Array.isArray(games) && games.length > 0) {
        const mapped = games.map((g: any) => {
          const theme = getGameVisualTheme(g.genre, g.name || g.title);
          return {
            id: g.id,
            slug: g.slug,
            title: (typeof g.name === "string" ? g.name : typeof g.title === "string" ? g.title : "UNCHARTED DRIVE: BEYOND").toUpperCase(),
            subtitle: g.subtitle || "Next-Gen Open Road Driving Simulation",
            tagline: g.description || "Experience high-speed highway journeys across majestic mountain horizons and golden sunsets with ultra-responsive vehicle dynamics.",
            genre: g.genre || "Open Road Simulation",
            engine: g.engineVersion || g.engine || "Dragon Driving 3D Engine",
            version: g.latestVersion ? `v${g.latestVersion} Ready` : "v1.0.0 Official",
            status: "OFFICIAL FLAGSHIP",
            dimension: (g.dimension as "3D" | "2D") || "3D",
            backdropUrl: g.bannerUrl || "/images/uncharted-drive-banner.png",
            accentColor: "#f59e0b",
            secondaryAccent: "#ef4444",
            glowColor: "rgba(245, 158, 11, 0.45)",
            pcExeUrl: `/api/games/${g.slug}/download?platform=windows`,
            apkUrl: `/api/games/${g.slug}/download?platform=android`,
            webPlayUrl: g.webPlayUrl,
            features: ["Next-Gen Vehicle Physics", "Sunset & Mountain Environments", "Dynamic Highway Traffic", "Cross-Platform Architecture"],
            capabilities: {
              platforms: g.platforms || "PC (.exe) & Android (.apk)",
              renderEngine: "Dragon 3D Vulkan",
              netcode: "Edge Low-Latency Sync",
              graphics: "Volumetric Atmospheric Sunsets",
            },
          };
        });
        setGamesList(mapped);
      }
    }).catch(() => {});
  }, []);

  const currentGame = gamesList[0] || CANONICAL_GAMES[0];
  const currentTheme = getGameVisualTheme(currentGame.genre, currentGame.title);

  return (
    <section 
      id="games" 
      className="relative z-10 pt-2 pb-12 sm:pt-4 sm:pb-16 bg-transparent text-slate-100 font-sans overflow-hidden select-none"
    >
      {/* Dynamic Game-Specific Ambient Lighting Core */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[160px] opacity-25"
        style={{ backgroundColor: currentGame.accentColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 sm:pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03091D] border border-cyan-500/30 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Sparkles className="size-3 text-cyan-400" />
              <span>ORIGINAL FLAGSHIP RELEASE</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-heading font-black text-white uppercase tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              FEATURED SHOWCASE
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#03091D] border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
              <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-pulse" />
              <span>PRODUCTION BUILDS READY</span>
            </div>
          </div>
        </div>

        {/* ═══ MOBILE GAME SHOWCASE CARD ═══ */}
        <div className="block lg:hidden">
          <MobileGameCard game={currentGame} />
        </div>

        {/* ═══ DESKTOP CINEMATIC SHOWCASE CARD (100% UNIFIED 3D DARK GLASS) ═══ */}
        <div className="hidden lg:block relative rounded-3xl bg-[#03091D]/90 border border-cyan-500/30 overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.15)] transition-all duration-500 group">
          
          {/* Top Dynamic Color Edge */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-[2px] transition-colors duration-700 bg-gradient-to-r from-transparent via-amber-400 via-cyan-400 to-transparent"
          />

          <div className="grid grid-cols-12 gap-8 items-center p-8 lg:p-10">
            
            {/* Left Col: Details & CTAs */}
            <div className="col-span-7 space-y-5">
              
              <div className="flex items-center gap-2.5 flex-wrap">
                <GameBadge text={currentGame.dimension} theme={currentTheme} />
                <span 
                  className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border bg-amber-500/15 border-amber-400/40 text-amber-300"
                >
                  {currentGame.status}
                </span>
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                  {currentGame.genre}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl lg:text-4xl font-heading font-black text-white tracking-tight uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {currentGame.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {currentGame.tagline}
                </p>
              </div>

              {/* Real Capabilities Strip */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#02050E] border border-cyan-500/20 text-xs font-mono text-slate-300 backdrop-blur-md">
                <div>
                  <span className="text-cyan-400 font-bold block text-[10px] uppercase">ENGINE ARCHITECTURE</span>
                  <span className="font-bold text-white">{currentGame.capabilities.renderEngine}</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold block text-[10px] uppercase">SUPPORTED PLATFORMS</span>
                  <span className="font-bold text-white">{currentGame.capabilities.platforms}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3.5 pt-1">
                <Link
                  href={`/games/${currentGame.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-xs font-heading font-black uppercase tracking-widest text-black transition-all duration-300 shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                >
                  <Gamepad2 className="size-4 text-black" />
                  <span>EXPLORE GAME</span>
                  <ArrowUpRight className="size-4 text-black" />
                </Link>

                <Link
                  href={`/games/${currentGame.slug}/download?platform=windows`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-mono font-bold text-cyan-300 hover:text-white bg-[#02050E] border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer shadow-md"
                >
                  <Monitor className="size-3.5 text-cyan-400" />
                  <span>PC (.exe)</span>
                </Link>

                <Link
                  href={`/games/${currentGame.slug}/download?platform=android`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-mono font-bold text-emerald-300 hover:text-white bg-[#02050E] border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer shadow-md"
                >
                  <Smartphone className="size-3.5 text-emerald-400" />
                  <span>Android (.apk)</span>
                </Link>
              </div>
            </div>

            {/* Right Col: Dominated Artwork Visual */}
            <div className="col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-black group-hover:border-cyan-400/60 transition-colors">
              <Image
                src={currentGame.backdropUrl}
                alt={currentGame.title}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase z-10">
                {currentGame.dimension} ENGINE
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
