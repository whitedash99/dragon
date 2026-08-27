"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Gamepad2, Download, Layers } from "lucide-react";
import { cn } from "@/lib/cn";
import { getGameVisualTheme, GameVisualTheme } from "@/lib/theme/game-theme";
import { PlatformBadge } from "./PlatformBadge";
import { GameBadge } from "./GameBadge";

export interface GameCardProps {
  game: {
    id: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    genre: string;
    status: string;
    description: string;
    dimension?: "3D" | "2D" | string;
    engineVersion?: string;
    bannerUrl?: string | null;
    effectiveDesktopPosition?: string;
    platforms?: string;
    pcExeUrl?: string;
    mobileApkUrl?: string;
  };
  priority?: boolean;
}

export function GameCard({ game, priority = false }: GameCardProps) {
  const theme = getGameVisualTheme(game.genre, game.title);

  return (
    <div className={cn(
      "group relative rounded-3xl bg-[#090D16]/90 border border-white/10 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]",
      theme.cardBorderHover,
      theme.cardGlowHover
    )}>
      
      {/* Artwork Layer with Dynamic Responsive Crop */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/60">
        {game.bannerUrl ? (
          <Image
            src={game.bannerUrl}
            alt={game.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ objectPosition: game.effectiveDesktopPosition || "50% 50%" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-700">
            <Gamepad2 className="size-12" />
          </div>
        )}

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <GameBadge text={game.dimension || "3D"} theme={theme} />
          <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-slate-200 text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
            {game.status}
          </span>
        </div>
      </div>

      {/* Content & Metadata Body */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between relative z-10">
        <div className="space-y-2">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("text-[11px] font-mono font-bold uppercase tracking-wider", theme.badgeText)}>
              {game.genre}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-heading font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {game.description}
          </p>
        </div>

        {/* Card Footer: Platforms & Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PlatformBadge platform={game.platforms || "PC (.exe)"} />
          </div>

          <Link
            href={`/games/${game.slug}`}
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-white group-hover:text-cyan-400 transition-colors shrink-0"
          >
            <span>EXPLORE</span>
            <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
