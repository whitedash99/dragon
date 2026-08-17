"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface DragonLogoProps {
  className?: string;
  iconClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textVariant?: "gaming" | "studios" | "os";
  subtitle?: string;
  animated?: boolean;
}

export function DragonLogoIcon({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    xs: "size-6",
    sm: "size-9",
    md: "size-11",
    lg: "size-14",
    xl: "size-20",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-gradient-to-b from-[#0a1838] via-[#050e24] to-[#02050f] border border-cyan-400/50 p-1.5 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] group-hover:scale-105",
        sizeMap[size],
        className
      )}
    >
      {/* Background Subtle Radial Core Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-cyan-500/15 to-transparent rounded-2xl pointer-events-none" />

      {/* God-Tier Apex Dragon Crest SVG */}
      <svg
        viewBox="0 0 128 128"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_10px_rgba(0,240,255,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Primary Electric Cyan Gradient */}
          <linearGradient id="dlApexCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#00f0ff" />
            <stop offset="80%" stopColor="#0088ff" />
            <stop offset="100%" stopColor="#0044cc" />
          </linearGradient>

          {/* Deep Royal Armor Gradient */}
          <linearGradient id="dlApexDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Core Electric Chrome */}
          <linearGradient id="dlApexChrome" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="dlApexGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══ 1. OUTER DRACONIC MANTLE WINGS / SHIELD ═══ */}
        {/* Left Wing Flange */}
        <path
          d="M 20 42 L 10 68 L 26 88 L 38 78 L 28 56 Z"
          fill="url(#dlApexDark)"
          stroke="#00f0ff"
          strokeWidth="1.5"
        />
        <path
          d="M 28 56 L 10 68 L 26 88 Z"
          fill="url(#dlApexCyan)"
          opacity="0.35"
        />

        {/* Right Wing Flange */}
        <path
          d="M 108 42 L 118 68 L 102 88 L 90 78 L 100 56 Z"
          fill="url(#dlApexDark)"
          stroke="#00f0ff"
          strokeWidth="1.5"
        />
        <path
          d="M 100 56 L 118 68 L 102 88 Z"
          fill="url(#dlApexCyan)"
          opacity="0.35"
        />

        {/* ═══ 2. SWEEPING APEX HORNS ═══ */}
        {/* Left Horn */}
        <path
          d="M 52 44 L 20 12 L 36 38 L 46 54 Z"
          fill="url(#dlApexChrome)"
          stroke="#00f0ff"
          strokeWidth="1.5"
        />
        {/* Left Sub-Horn */}
        <path
          d="M 36 38 L 14 30 L 28 48 Z"
          fill="url(#dlApexCyan)"
        />

        {/* Right Horn */}
        <path
          d="M 76 44 L 108 12 L 92 38 L 82 54 Z"
          fill="url(#dlApexChrome)"
          stroke="#00f0ff"
          strokeWidth="1.5"
        />
        {/* Right Sub-Horn */}
        <path
          d="M 92 38 L 114 30 L 100 48 Z"
          fill="url(#dlApexCyan)"
        />

        {/* ═══ 3. DRAGON CROWN SPIKES ═══ */}
        {/* Center Crown Blade */}
        <polygon
          points="64,14 71,36 64,46 57,36"
          fill="url(#dlApexChrome)"
          stroke="#00f0ff"
          strokeWidth="1.5"
        />
        {/* Left Crown Spike */}
        <polygon points="52,24 57,38 48,42" fill="url(#dlApexCyan)" />
        {/* Right Crown Spike */}
        <polygon points="76,24 71,38 80,42" fill="url(#dlApexCyan)" />

        {/* ═══ 4. FOREHEAD & BROW ARMOR ═══ */}
        <polygon
          points="64,44 76,56 64,70 52,56"
          fill="url(#dlApexDark)"
          stroke="#00f0ff"
          strokeWidth="1.8"
        />
        <polygon
          points="64,48 72,56 64,66 56,56"
          fill="url(#dlApexCyan)"
          opacity="0.8"
        />

        {/* ═══ 5. PIERCING GLOWING EYES ═══ */}
        <g filter="url(#dlApexGlow)">
          {/* Left Eye */}
          <polygon points="40,58 52,61 48,67 38,63" fill="#00f0ff" />
          <polygon points="43,60 49,62 47,65 41,63" fill="#ffffff" />

          {/* Right Eye */}
          <polygon points="88,58 76,61 80,67 90,63" fill="#00f0ff" />
          <polygon points="85,60 79,62 81,65 87,63" fill="#ffffff" />
        </g>

        {/* ═══ 6. DRAGON SNOUT & NOSE BRIDGE ═══ */}
        <polygon
          points="56,66 72,66 76,82 64,90 52,82"
          fill="url(#dlApexChrome)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        {/* Nostrils */}
        <polygon points="58,80 62,82 60,84" fill="#020617" />
        <polygon points="70,80 66,82 68,84" fill="#020617" />

        {/* ═══ 7. DEADLY SERRATED FANGS ═══ */}
        <polygon points="53,82 56,94 60,84" fill="#ffffff" />
        <polygon points="68,84 72,94 75,82" fill="#ffffff" />
        <polygon points="61,84 64,91 67,84" fill="#ffffff" />

        {/* ═══ 8. CHISELED LOWER MANDIBLE & CHIN SPIKES ═══ */}
        <polygon
          points="50,92 64,116 78,92 64,100"
          fill="url(#dlApexDark)"
          stroke="#00f0ff"
          strokeWidth="1.8"
        />
        {/* Mandible Left Wing Spike */}
        <polygon points="38,88 48,104 52,94" fill="url(#dlApexCyan)" />
        {/* Mandible Right Wing Spike */}
        <polygon points="90,88 80,104 76,94" fill="url(#dlApexCyan)" />

        {/* ═══ 9. CENTRAL ENERGY SPARK ═══ */}
        <circle cx="64" cy="56" r="3.5" fill="#ffffff" filter="url(#dlApexGlow)" />
      </svg>
    </div>
  );
}

export function DragonLogo({
  className,
  iconClassName,
  size = "md",
  showText = true,
  textVariant = "gaming",
  subtitle,
}: DragonLogoProps) {
  return (
    <div className={cn("flex items-center gap-3.5 group shrink-0 select-none", className)}>
      <DragonLogoIcon size={size} className={iconClassName} />

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-heading text-xl font-black tracking-[0.08em] text-white uppercase sm:text-2xl transition-colors group-hover:text-cyan-100 flex items-center gap-1.5">
            DRAGON
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#2563eb] group-hover:from-white group-hover:to-cyan-300 transition-all font-black">
              {textVariant === "gaming" ? "GAMING" : textVariant === "studios" ? "STUDIOS" : "OS"}
            </span>
          </span>
          {subtitle && (
            <span className="text-[9px] font-mono font-bold tracking-[0.24em] text-cyan-400/90 uppercase mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default DragonLogo;
