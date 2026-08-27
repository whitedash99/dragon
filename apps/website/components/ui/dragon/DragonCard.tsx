"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface DragonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "cyan" | "purple" | "magenta" | "green" | "glass";
  glow?: boolean;
}

export function DragonCard({
  children,
  className,
  variant = "cyan",
  glow = false,
  ...props
}: DragonCardProps) {
  const borderVariants = {
    cyan: "border-cyan-500/25 hover:border-cyan-400/60",
    purple: "border-purple-500/25 hover:border-purple-400/60",
    magenta: "border-pink-500/25 hover:border-pink-400/60",
    green: "border-emerald-500/25 hover:border-emerald-400/60",
    glass: "border-white/10 hover:border-white/20",
  };

  const glowVariants = {
    cyan: "shadow-[0_0_30px_rgba(0,229,255,0.15)]",
    purple: "shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    magenta: "shadow-[0_0_30px_rgba(255,43,214,0.15)]",
    green: "shadow-[0_0_30px_rgba(0,255,198,0.15)]",
    glass: "shadow-2xl",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-[#060D22]/80 backdrop-blur-xl border p-6 transition-all duration-300",
        borderVariants[variant],
        glow && glowVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
