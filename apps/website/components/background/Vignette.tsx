import * as React from "react";
import { cn } from "@/lib/cn";

interface VignetteProps {
  className?: string;
  intensity?: number;
}

export function Vignette({
  className,
  intensity = 0.6,
}: VignetteProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 pointer-events-none w-full h-full", className)}
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`
      }}
    />
  );
}
