"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Sparkles,
  Zap,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame,
  Layers,
  Monitor,
  Smartphone
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

export interface StudioGame {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  dimension: string;
  genre: string;
  status: string;
  platforms: string;
  description: string;
  coverUrl: string;
  accentColor: string;
  neonBorder: string;
  glowColor: string;
  tag: string;
  icon: any;
  pcExeUrl?: string;
  mobileApkUrl?: string;
}

interface DragonGameArsenalProps {
  games: StudioGame[];
}

export function DragonGameArsenal({ games }: DragonGameArsenalProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
            <Gamepad2 className="size-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white font-heading tracking-tight">
              DRAGON GAME ARSENAL
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Official Dragon Gaming Studios Game Titles & Verified Builds
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-mono font-bold text-cyan-300 uppercase">
          <span>{games.length} ACTIVE STUDIO TITLES</span>
        </div>
      </div>

      {/* Real Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const GameIcon = game.icon || Gamepad2;
          return (
            <motion.div
              key={game.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`rounded-3xl bg-gradient-to-b from-[#061230]/95 via-[#03091D]/98 to-[#02040A] border-2 ${game.neonBorder} p-6 backdrop-blur-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-xl`}
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{ backgroundColor: game.accentColor }}
              />

              <div className="space-y-4">
                {/* Cover Image */}
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/15 group-hover:border-white/30 transition-colors shadow-lg">
                  <Image
                    src={game.coverUrl}
                    alt={game.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-[9px] font-mono font-black uppercase text-cyan-300 backdrop-blur-md">
                      {game.dimension}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-200">
                      {game.genre}
                    </span>
                    <GameIcon className="size-4" style={{ color: game.accentColor }} />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase" style={{ color: game.accentColor }}>
                    <Sparkles className="size-3" />
                    <span>{game.tag}</span>
                  </div>

                  <h3 className="text-xl font-black uppercase text-white font-heading tracking-tight">
                    {game.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </div>

              {/* Action Area */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500">PLATFORMS: </span>
                  <span className="text-slate-200 font-bold">{game.platforms}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/games`}
                    onClick={() => soundFx.playClick()}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>EXPLORE INTEL</span>
                    <ChevronRight className="size-3.5" />
                  </Link>

                  <Link
                    href={`/downloads`}
                    onClick={() => soundFx.playClick()}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white transition-all"
                    title="Download Game"
                  >
                    <Download className="size-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Guaranteed High-Fidelity Empty Slot for Future Studio Games */}
        <div className="rounded-3xl bg-[#020512]/60 border-2 border-dashed border-cyan-500/25 p-6 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[340px] relative overflow-hidden group">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 group-hover:scale-110 transition-transform">
            <Layers className="size-8 text-cyan-400 animate-pulse" />
          </div>

          <div className="space-y-1 max-w-xs">
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
              STUDIO PIPELINE
            </span>
            <h3 className="text-lg font-black uppercase text-white font-heading">
              MORE DRAGON EXPERIENCES IN DEVELOPMENT
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Dragon Gaming Studios is actively architecting next-generation hybrid titles for PC, console, and mobile platforms.
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 uppercase">
            STATUS: ACTIVE PRODUCTION
          </div>
        </div>
      </div>
    </div>
  );
}
