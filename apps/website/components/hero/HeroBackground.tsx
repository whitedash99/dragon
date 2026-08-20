"use client";

import React from "react";
import { DragonTridentCanvas } from "@/components/cinematic/DragonTridentCanvas";
import { Vignette } from "@/components/background/Vignette";
import { NoiseLayer } from "@/components/background/NoiseLayer";
import { isEditorEnvironment } from "@/lib/cms/editorSafety";

export function HeroBackground() {
  const inEditor = isEditorEnvironment();

  if (inEditor) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#01040D] via-[#040D26] to-[#01040D]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.12)_0%,transparent_70%)]" />
        <Vignette intensity={0.8} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#01040D]" aria-hidden="true">
      {/* ═══ 1. Deep Midnight Cosmic Glows & Volumetric Auroras ═══ */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-blue-600/25 via-cyan-400/20 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-[35%] left-[20%] size-[500px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] size-[550px] rounded-full bg-blue-600/15 blur-[150px] pointer-events-none" />
      
      {/* ═══ 2. High-Voltage Multi-Branch Dragon Lightning Canvas ═══ */}
      <DragonTridentCanvas />

      {/* ═══ 3. Bottom Atmospheric Blend to Next Sections ═══ */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#01040D] via-[#01040D]/80 to-transparent" />

      {/* ═══ 4. Film Grain & Cinematic Vignette ═══ */}
      <NoiseLayer opacity={0.035} />
      <Vignette intensity={0.85} />
    </div>
  );
}
