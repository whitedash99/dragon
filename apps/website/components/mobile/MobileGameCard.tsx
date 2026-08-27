"use client";

import React from "react";
import Link from "next/link";
import { Gamepad2, Download, ArrowUpRight, Smartphone, Monitor } from "lucide-react";
import { soundFx } from "@/lib/sound-effects";
import Image from "next/image";

export interface MobileGameCardProps {
  game: {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    tagline?: string;
    genre: string;
    status: string;
    dimension: "3D" | "2D";
    backdropUrl: string;
    accentColor: string;
    secondaryAccent?: string;
    capabilities?: {
      platforms: string;
      renderEngine: string;
    };
    webPlayUrl?: string;
  };
}

export function MobileGameCard({ game }: MobileGameCardProps) {
  return (
    <div className="relative rounded-3xl bg-[#03091D]/95 border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all select-none group active:scale-[0.99]">
      {/* Top Dynamic Color Glow Edge */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 via-cyan-400 to-transparent"
      />

      {/* 1. Cinematic Artwork Dominant on Top (16:9) */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <Image
          src={game.backdropUrl}
          alt={game.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-transparent to-transparent opacity-85" />
        
        {/* Dimension & Status Overlay Pills */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase">
            {game.dimension} ENGINE
          </span>
        </div>
      </div>

      {/* 2. Details & Interactive Actions */}
      <div className="p-5 space-y-3.5 font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border bg-amber-500/15 border-amber-400/40 text-amber-300"
          >
            {game.status}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
            {game.genre}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-heading font-black text-white tracking-tight uppercase leading-tight font-heading">
            {game.title}
          </h3>
          {game.tagline && (
            <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
              {game.tagline}
            </p>
          )}
        </div>

        {/* Real Engine & Platform Badges */}
        {game.capabilities && (
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#02050E] border border-cyan-500/20 text-[11px] font-mono text-slate-300 backdrop-blur-md">
            <div>
              <span className="text-cyan-400 font-bold block text-[9px] uppercase">ENGINE</span>
              <span className="font-bold text-white truncate block">{game.capabilities.renderEngine}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold block text-[9px] uppercase">PLATFORMS</span>
              <span className="font-bold text-white truncate block">{game.capabilities.platforms}</span>
            </div>
          </div>
        )}

        {/* Touch-Friendly Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <Link
            href={`/games/${game.slug}`}
            onClick={() => soundFx.playClick()}
            className="min-h-[46px] w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-heading font-black uppercase tracking-widest text-black transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 active:scale-95 cursor-pointer"
          >
            <Gamepad2 className="size-4 text-black" />
            <span>EXPLORE GAME</span>
            <ArrowUpRight className="size-4 text-black" />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/games/${game.slug}/download?platform=windows`}
              onClick={() => soundFx.playClick()}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-mono font-bold text-cyan-300 bg-[#02050E] border border-cyan-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Monitor className="size-3.5 text-cyan-400" />
              <span>PC (.exe)</span>
            </Link>

            <Link
              href={`/games/${game.slug}/download?platform=android`}
              onClick={() => soundFx.playClick()}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-mono font-bold text-emerald-300 bg-[#02050E] border border-emerald-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Smartphone className="size-3.5 text-emerald-400" />
              <span>Android (.apk)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
