"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface GlassStatProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function GlassStat({
  label,
  value,
  subtext,
  trend,
  trendPositive = true,
  icon: Icon,
  iconColor = "text-cyan-300",
  iconBg = "bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,229,255,0.3)]",
  className,
}: GlassStatProps) {
  return (
    <div
      className={cn(
        "relative p-4 sm:p-5 rounded-2xl bg-[#03091D]/90 backdrop-blur-xl border border-cyan-500/25 shadow-[0_4px_25px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden group hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all duration-300 font-mono select-none",
        className
      )}
    >
      {/* Top Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-cyan-500/20 transition-all duration-500" />
      
      {/* Header with Label & Holographic Icon */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/80 group-hover:text-cyan-300 transition-colors truncate">
          {label}
        </span>
        <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300", iconBg, iconColor)}>
          <Icon className="size-4.5" />
        </div>
      </div>

      {/* Main Value & Trend Badge */}
      <div className="mt-3.5 flex items-baseline gap-2.5 flex-wrap relative z-10">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider backdrop-blur-md",
              trendPositive
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                : "bg-rose-500/15 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
            )}
          >
            {trend}
          </span>
        )}
      </div>

      {/* Subtext description */}
      {subtext && (
        <p className="mt-2 text-[11px] text-slate-400 font-mono relative z-10 truncate">
          {subtext}
        </p>
      )}

      {/* Bottom active edge line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
