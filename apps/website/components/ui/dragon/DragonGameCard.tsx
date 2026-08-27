"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Download, ArrowUpRight, Play, Gamepad2 } from "lucide-react";
import { soundFx } from "@/lib/sound-effects";
import { DragonBadge } from "./DragonBadge";

export interface DragonGameCardProps {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  dimension: "3D" | "2D";
  status: string;
  version: string;
  platforms: string;
  coverUrl?: string;
  features?: string;
  downloadUrl?: string;
  accentColor?: string;
  className?: string;
}

export function DragonGameCard({
  slug,
  title,
  subtitle,
  dimension,
  status,
  version,
  platforms,
  coverUrl = "/images/uncharted-drive-banner.png",
  features,
  downloadUrl = "/downloads",
  accentColor = "#00E5FF",
  className,
}: DragonGameCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-3xl bg-[#060D22]/80 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/60 p-5 space-y-4 hover:shadow-[0_0_35px_rgba(0,229,255,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden",
        className
      )}
    >
      <div className="space-y-4">
        {/* Card Artwork */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#020617] border border-white/10">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D22] via-transparent to-black/40" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <DragonBadge variant={dimension === "3D" ? "cyan" : "purple"}>
              {dimension}
            </DragonBadge>
            <DragonBadge variant="green" pulse>
              {status}
            </DragonBadge>
          </div>

          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
            {version}
          </div>
        </div>

        {/* Title & Features */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-heading font-black text-white uppercase group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          {features && (
            <p className="text-xs font-mono text-slate-400 line-clamp-2 leading-relaxed">
              {features}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono text-slate-400 truncate">
          {platforms}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={downloadUrl}
            onClick={() => soundFx.playClick()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#1677FF] text-[#020617] text-xs font-mono font-black uppercase flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Play / DL</span>
          </Link>

          <Link
            href={`/games/${slug}`}
            onClick={() => soundFx.playClick()}
            className="p-2 rounded-xl bg-[#03091D] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer"
            title="View Details"
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
