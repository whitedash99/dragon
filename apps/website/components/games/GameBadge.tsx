"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { GameVisualTheme } from "@/lib/theme/game-theme";

export interface GameBadgeProps {
  text: string;
  theme?: GameVisualTheme;
  variant?: "primary" | "secondary" | "neutral";
  className?: string;
}

export function GameBadge({ text, theme, variant = "primary", className }: GameBadgeProps) {
  if (theme && variant === "primary") {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border shadow-2xs",
        theme.badgeBg,
        theme.badgeBorder,
        theme.badgeText,
        className
      )}>
        {text}
      </span>
    );
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md",
      className
    )}>
      {text}
    </span>
  );
}
