import * as React from "react";
import { cn } from "@/lib/cn";
import { GradientMesh } from "./GradientMesh";
import { NoiseLayer } from "./NoiseLayer";
import { AmbientOrbs } from "./AmbientOrbs";
import { GridOverlay } from "./GridOverlay";
import { Vignette } from "./Vignette";
import { RadialGlow } from "./RadialGlow";

interface SceneBackgroundProps {
  className?: string;
  gradient?: boolean;
  noise?: boolean;
  orbs?: boolean;
  grid?: boolean;
  vignette?: boolean;
  glow?: boolean;
  children?: React.ReactNode;
}

export function SceneBackground({
  className,
  gradient = true,
  noise = true,
  orbs = true,
  grid = false,
  vignette = true,
  glow = false,
  children,
}: SceneBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-[#050505] [background-image:radial-gradient(ellipse_70%_42%_at_50%_-12%,rgba(122,29,31,0.16),transparent_74%)]", className)}>
      {gradient && <GradientMesh />}
      {grid && <GridOverlay />}
      {glow && <RadialGlow />}
      {orbs && <AmbientOrbs />}
      {vignette && <Vignette />}
      {noise && <NoiseLayer />}
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
