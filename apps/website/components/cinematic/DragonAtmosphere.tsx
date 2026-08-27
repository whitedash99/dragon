"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { AtmosphericAurora } from "./AtmosphericAurora";
import { NoiseLayer } from "@/components/background/NoiseLayer";
import { Vignette } from "@/components/background/Vignette";

// Dynamically import 3D canvases to split code and prevent blocking initial hydration
const DragonUniverse3DCanvas = dynamic(
  () => import("./DragonUniverse3DCanvas").then((m) => m.DragonUniverse3DCanvas),
  { ssr: false }
);
const CyberVault3DCanvas = dynamic(
  () => import("./CyberVault3DCanvas").then((m) => m.CyberVault3DCanvas),
  { ssr: false }
);
const LaunchBay3DCanvas = dynamic(
  () => import("./LaunchBay3DCanvas").then((m) => m.LaunchBay3DCanvas),
  { ssr: false }
);
const CreativeNebula3DCanvas = dynamic(
  () => import("./CreativeNebula3DCanvas").then((m) => m.CreativeNebula3DCanvas),
  { ssr: false }
);
const NeuralNetwork3DCanvas = dynamic(
  () => import("./NeuralNetwork3DCanvas").then((m) => m.NeuralNetwork3DCanvas),
  { ssr: false }
);
const QuantumSignal3DCanvas = dynamic(
  () => import("./QuantumSignal3DCanvas").then((m) => m.QuantumSignal3DCanvas),
  { ssr: false }
);
const GlobalDimensionCanvas3D = dynamic(
  () => import("./GlobalDimensionCanvas3D").then((m) => m.GlobalDimensionCanvas3D),
  { ssr: false }
);

export type DragonAtmosphereWorld =
  | "core"
  | "cyber_vault"
  | "launch_bay"
  | "creative_nebula"
  | "neural_network"
  | "quantum_signal"
  | "dimension_global";

export interface DragonAtmosphereProps {
  world?: DragonAtmosphereWorld;
  intensity?: "adaptive" | "high" | "medium" | "low";
  aurora?: boolean;
  noise?: boolean;
  vignette?: boolean;
}

export function DragonAtmosphere({
  world = "core",
  intensity = "adaptive",
  aurora = true,
  noise = true,
  vignette = true,
}: DragonAtmosphereProps) {
  const { tier, prefersReducedMotion } = useDeviceTier();
  const [canMountCanvas, setCanMountCanvas] = useState(false);

  const isLowPower = tier === "E_LOW_POWER" || prefersReducedMotion;

  // ═══ STAGED LOADING PIPELINE: Defer 3D Canvas Mounting to Idle Time ═══
  useEffect(() => {
    if (isLowPower) return;

    let handle: number;
    let timer: NodeJS.Timeout;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      handle = (window as any).requestIdleCallback(
        () => setCanMountCanvas(true),
        { timeout: 350 }
      );
    } else {
      timer = setTimeout(() => setCanMountCanvas(true), 150);
    }

    return () => {
      if (handle && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(handle);
      }
      if (timer) clearTimeout(timer);
    };
  }, [isLowPower]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none w-full h-full overflow-hidden select-none z-0 bg-[#020512]"
    >
      {/* 1. Volumetric Ambient Aurora Light Core (Hardware Accelerated) */}
      {aurora && <AtmosphericAurora isLowPower={isLowPower} />}

      {/* 2. Adaptive 3D World Canvas Engine (Lazy Idle Initialized) */}
      {canMountCanvas && !prefersReducedMotion && (
        <div className="absolute inset-0 transition-opacity duration-700 opacity-100">
          {world === "core" && <DragonUniverse3DCanvas />}
          {world === "cyber_vault" && <CyberVault3DCanvas />}
          {world === "launch_bay" && <LaunchBay3DCanvas />}
          {world === "creative_nebula" && <CreativeNebula3DCanvas />}
          {world === "neural_network" && <NeuralNetwork3DCanvas />}
          {world === "quantum_signal" && <QuantumSignal3DCanvas />}
          {world === "dimension_global" && <GlobalDimensionCanvas3D />}
        </div>
      )}

      {/* 3. Subtle Film Grain & Vignette Depth */}
      {noise && !isLowPower && <NoiseLayer opacity={0.015} />}
      {vignette && <Vignette intensity={tier === "D_MOBILE" ? 0.4 : 0.6} />}
    </div>
  );
}
