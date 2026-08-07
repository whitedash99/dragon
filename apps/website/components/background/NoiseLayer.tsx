import * as React from "react";
import { cn } from "@/lib/cn";

interface NoiseLayerProps {
  className?: string;
  opacity?: number;
  blendMode?: string;
}

export function NoiseLayer({
  className,
  opacity = 0.04,
  blendMode = "overlay",
}: NoiseLayerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 pointer-events-none w-full h-full overflow-hidden", className)}
      style={{ opacity, mixBlendMode: blendMode as any }}
    >
      <svg className="w-full h-full opacity-100">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
