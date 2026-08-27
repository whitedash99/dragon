"use client";

import React from "react";
import { Monitor, Smartphone, Globe } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PlatformBadgeProps {
  platform: string;
  className?: string;
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  const p = platform.toLowerCase();
  
  if (p.includes("windows") || p.includes("pc") || p.includes("exe")) {
    return (
      <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono font-semibold text-slate-300 backdrop-blur-md shadow-2xs", className)}>
        <Monitor className="size-3 text-cyan-400" />
        <span>PC (.EXE)</span>
      </span>
    );
  }
  
  if (p.includes("android") || p.includes("mobile") || p.includes("apk")) {
    return (
      <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono font-semibold text-slate-300 backdrop-blur-md shadow-2xs", className)}>
        <Smartphone className="size-3 text-emerald-400" />
        <span>ANDROID (.APK)</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono font-semibold text-slate-300 backdrop-blur-md shadow-2xs", className)}>
      <Globe className="size-3 text-violet-400" />
      <span>WEB PLAY</span>
    </span>
  );
}
