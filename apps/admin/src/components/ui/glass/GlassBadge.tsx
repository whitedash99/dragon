"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "published" | "draft" | "neutral" | "warning" | "critical" | "info" | "cyan" | "purple";
  pulse?: boolean;
}

export const GlassBadge = React.forwardRef<HTMLSpanElement, GlassBadgeProps>(
  ({ className, variant = "neutral", pulse = false, children, ...props }, ref) => {
    const variantClasses = {
      published: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
      draft: "bg-amber-500/15 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
      neutral: "bg-[#02050E] text-slate-400 border-white/10",
      warning: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      critical: "bg-rose-500/15 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
      info: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]",
      cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(0,229,255,0.25)]",
      purple: "bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-[0_0_12px_rgba(124,60,255,0.25)]",
    };

    const dotColors = {
      published: "bg-emerald-400 shadow-[0_0_6px_#10B981]",
      draft: "bg-amber-400",
      neutral: "bg-slate-400",
      warning: "bg-amber-400",
      critical: "bg-rose-400 shadow-[0_0_6px_#F43F5E]",
      info: "bg-cyan-400 shadow-[0_0_6px_#00E5FF]",
      cyan: "bg-cyan-400 shadow-[0_0_6px_#00E5FF]",
      purple: "bg-purple-400 shadow-[0_0_6px_#7C3CFF]",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold border backdrop-blur-md select-none uppercase tracking-wider",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "size-1.5 rounded-full shrink-0",
            dotColors[variant],
            pulse && "animate-pulse"
          )}
        />
        <span>{children}</span>
      </span>
    );
  }
);

GlassBadge.displayName = "GlassBadge";
