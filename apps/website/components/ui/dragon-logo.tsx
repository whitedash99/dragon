"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface DragonLogoProps {
  className?: string;
  iconClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showIcon?: boolean;
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
  animated?: boolean;
}) {
  const sizeMap = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-gradient-to-b from-[#0a1838] via-[#050e24] to-[#02050f] border border-cyan-400/50 p-1 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] group-hover:scale-105 overflow-hidden",
        sizeMap[size] || sizeMap.md,
        className
      )}
    >
      <img
        src="/images/dragon-logo.jpg"
        alt="Dragon Gaming Studio Logo"
        className="w-full h-full object-cover rounded-xl relative z-10"
      />
    </div>
  );
}

export function DragonLogo({
  className,
  iconClassName,
  size = "md",
  showText = true,
  showIcon = true,
  textVariant = "gaming",
  subtitle,
}: DragonLogoProps) {
  return (
    <div className={cn("flex items-center gap-3.5 group shrink-0 select-none", className)}>
      {showIcon && <DragonLogoIcon size={size} className={iconClassName} />}

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
