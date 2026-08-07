"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface FogProps {
  className?: string;
  opacity?: number;
}

export function Fog({ className, opacity = 0.15 }: FogProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen", className)}
      style={{ opacity }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-dragon-950 via-transparent to-transparent z-10" />

      {/* Drifting Volumetric Cloud Layers */}
      <div className="absolute -inset-[100%] opacity-30 animate-[orb-float-1_30s_linear_infinite] bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_60%)] blur-3xl" />
      <div className="absolute -inset-[100%] opacity-20 animate-[orb-float-2_40s_linear_infinite_reverse] bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.25),transparent_50%)] blur-3xl" />
    </div>
  );
}
