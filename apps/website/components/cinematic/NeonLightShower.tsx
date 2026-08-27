"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface NeonLightShowerProps {
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
}

export function NeonLightShower({
  primaryColor = "#00E5FF",
  secondaryColor = "#7C3AED",
  className,
}: NeonLightShowerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden select-none z-0", className)}
    >
      {/* Primary Angled Volumetric Light Beam */}
      <div
        className="absolute -top-[30%] -left-[10%] w-[60%] h-[160%] -rotate-12 opacity-20 blur-[100px] transition-all duration-1000"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, transparent 75%)`,
        }}
      />

      {/* Secondary Counter Beam */}
      <div
        className="absolute -top-[20%] -right-[15%] w-[55%] h-[150%] rotate-12 opacity-15 blur-[120px] transition-all duration-1000"
        style={{
          background: `linear-gradient(225deg, ${secondaryColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
