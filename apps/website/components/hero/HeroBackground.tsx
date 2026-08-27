"use client";

import React from "react";
import { AtmosphericAurora } from "@/components/cinematic/AtmosphericAurora";
import { DragonUniverse3DCanvas } from "@/components/cinematic/DragonUniverse3DCanvas";
import { SubtleLightStreaks } from "@/components/cinematic/SubtleLightStreaks";
import { Vignette } from "@/components/background/Vignette";
import { NoiseLayer } from "@/components/background/NoiseLayer";
import { isEditorEnvironment } from "@/lib/cms/editorSafety";

export function HeroBackground() {
  const inEditor = isEditorEnvironment();

  if (inEditor) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#020512]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.22)_0%,transparent_70%)]" />
        <Vignette intensity={0.6} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#020512]" aria-hidden="true">
      {/* ═══ DEPTH 01: Luminous Royal Blue/Midnight Base (#020512 / #061138) ═══ */}
      <div className="absolute inset-0 bg-[#020512]" />

      {/* ═══ DEPTH 01: Multi-Gradient Spatial Haze & Volumetric Light Corridors (Full-Bleed to All Borders) ═══ */}
      <AtmosphericAurora />

      {/* ═══ DEPTH 02-05: 3D Universe Engine (Perimeter Shards, Energy Trails, Medium-to-Fast 5-Class Particles, Dragon Lightning) ═══ */}
      <DragonUniverse3DCanvas />

      {/* ═══ Sparse Vertical Ambient Light Streaks ═══ */}
      <SubtleLightStreaks />

      {/* ═══ Film Noise & Soft Depth Vignette (Borderless) ═══ */}
      <NoiseLayer opacity={0.02} />
      <Vignette intensity={0.5} />
    </div>
  );
}
