"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface DragonSectionProps extends React.HTMLAttributes<HTMLElement> {
  atmosphere?: "cyan-violet" | "electric-magenta" | "amber-orange" | "violet-pink" | "cyan-emerald" | "neutral";
  children: React.ReactNode;
}

export function DragonSection({
  atmosphere = "neutral",
  className,
  children,
  ...props
}: DragonSectionProps) {
  const atmosphereGlows = {
    "cyan-violet": "bg-cyan-500/10",
    "electric-magenta": "bg-blue-600/10",
    "amber-orange": "bg-amber-500/10",
    "violet-pink": "bg-violet-600/10",
    "cyan-emerald": "bg-emerald-500/10",
    "neutral": "bg-slate-800/5",
  };

  return (
    <section
      className={cn("relative z-10 py-16 sm:py-24 overflow-hidden select-none", className)}
      {...props}
    >
      {/* Ambient Atmosphere Glow */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full blur-[180px] opacity-25",
          atmosphereGlows[atmosphere]
        )}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {children}
      </div>
    </section>
  );
}
