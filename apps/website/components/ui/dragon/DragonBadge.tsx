"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface DragonBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "cyan" | "purple" | "magenta" | "green" | "amber" | "red";
  pulse?: boolean;
}

export function DragonBadge({
  children,
  className,
  variant = "cyan",
  pulse = false,
  ...props
}: DragonBadgeProps) {
  const badgeStyles = {
    cyan: "bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)]",
    purple: "bg-purple-500/15 border-purple-400/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
    magenta: "bg-pink-500/15 border-pink-400/40 text-pink-300 shadow-[0_0_10px_rgba(255,43,214,0.2)]",
    green: "bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_10px_rgba(0,255,198,0.2)]",
    amber: "bg-amber-500/15 border-amber-400/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    red: "bg-red-500/15 border-red-400/40 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider border select-none",
        badgeStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="size-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}
