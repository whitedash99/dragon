"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface DragonGlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3 | 4;
  glowColor?: string;
  borderColor?: string;
  children: React.ReactNode;
}

export function DragonGlassPanel({
  level = 2,
  glowColor,
  borderColor,
  className,
  children,
  ...props
}: DragonGlassPanelProps) {
  const levelClasses = {
    1: "bg-[#060B18]/70 border-white/10 backdrop-blur-md",
    2: "bg-[#090D16]/85 border-white/15 backdrop-blur-xl shadow-xl",
    3: "bg-[#04091A]/95 border-cyan-500/25 backdrop-blur-2xl shadow-2xl",
    4: "bg-[#02050E]/98 border-cyan-400/40 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,240,255,0.2)]",
  };

  return (
    <div
      className={cn(
        "rounded-3xl border transition-all duration-300",
        levelClasses[level],
        className
      )}
      style={{
        boxShadow: glowColor ? `0 10px 40px -10px ${glowColor}` : undefined,
        borderColor: borderColor || undefined,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
