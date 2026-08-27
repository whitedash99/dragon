"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { GradientMesh } from "./GradientMesh";
import { NoiseLayer } from "./NoiseLayer";
import { AmbientOrbs } from "./AmbientOrbs";
import { GridOverlay } from "./GridOverlay";
import { Vignette } from "./Vignette";
import { RadialGlow } from "./RadialGlow";
import { useDeviceTier } from "@/hooks/useDeviceTier";

// Dynamic 3D canvas modules - split bundles so secondary pages only load their respective engine
const GlobalDimensionCanvas3D = dynamic(
  () => import("@/components/cinematic/GlobalDimensionCanvas3D").then((m) => m.GlobalDimensionCanvas3D),
  { ssr: false }
);
const NeuralNetwork3DCanvas = dynamic(
  () => import("@/components/cinematic/NeuralNetwork3DCanvas").then((m) => m.NeuralNetwork3DCanvas),
  { ssr: false }
);
const QuantumSignal3DCanvas = dynamic(
  () => import("@/components/cinematic/QuantumSignal3DCanvas").then((m) => m.QuantumSignal3DCanvas),
  { ssr: false }
);
const CreativeNebula3DCanvas = dynamic(
  () => import("@/components/cinematic/CreativeNebula3DCanvas").then((m) => m.CreativeNebula3DCanvas),
  { ssr: false }
);
const CyberVault3DCanvas = dynamic(
  () => import("@/components/cinematic/CyberVault3DCanvas").then((m) => m.CyberVault3DCanvas),
  { ssr: false }
);
const LaunchBay3DCanvas = dynamic(
  () => import("@/components/cinematic/LaunchBay3DCanvas").then((m) => m.LaunchBay3DCanvas),
  { ssr: false }
);

interface SceneBackgroundProps {
  className?: string;
  gradient?: boolean;
  noise?: boolean;
  orbs?: boolean;
  grid?: boolean;
  vignette?: boolean;
  glow?: boolean;
  dimension3D?: boolean;
  world3D?: "default" | "neural" | "signal" | "creative" | "cyber" | "launch";
  children?: React.ReactNode;
}

export function SceneBackground({
  className,
  gradient = true,
  noise = true,
  orbs = true,
  grid = false,
  vignette = true,
  glow = true,
  dimension3D = true,
  world3D = "default",
  children,
}: SceneBackgroundProps) {
  const { tier, prefersReducedMotion } = useDeviceTier();
  const [canMountCanvas, setCanMountCanvas] = React.useState(false);

  const isLowPower = tier === "E_LOW_POWER" || prefersReducedMotion;

  // Staged loading: defer canvas mounting to idle time
  React.useEffect(() => {
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
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-[#020512] text-slate-100", className)}>
      {/* Luminous Royal Blue/Indigo Spatial Base */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 229, 255, 0.15) 0%, rgba(29, 78, 216, 0.12) 45%, transparent 75%)",
        }}
      />

      {/* ═══ WORLD-SPECIFIC DEDICATED 3D CANVAS ENGINES ═══ */}
      {dimension3D && canMountCanvas && !isLowPower && (
        <>
          {world3D === "neural" && <NeuralNetwork3DCanvas />}
          {world3D === "signal" && <QuantumSignal3DCanvas />}
          {world3D === "creative" && <CreativeNebula3DCanvas />}
          {world3D === "cyber" && <CyberVault3DCanvas />}
          {world3D === "launch" && <LaunchBay3DCanvas />}
          {world3D === "default" && <GlobalDimensionCanvas3D />}
        </>
      )}

      {gradient && <GradientMesh />}
      {grid && <GridOverlay />}
      {glow && <RadialGlow />}
      {orbs && <AmbientOrbs />}
      {vignette && <Vignette intensity={0.65} />}
      {noise && <NoiseLayer opacity={0.02} />}
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}

