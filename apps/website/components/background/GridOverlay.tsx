import * as React from "react";
import { cn } from "@/lib/cn";

interface GridOverlayProps {
  className?: string;
  opacity?: number;
  size?: number;
}

export function GridOverlay({
  className,
  opacity = 0.03,
  size = 60,
}: GridOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 pointer-events-none w-full h-full", className)}
      style={{
        opacity,
        backgroundImage: `
          repeating-linear-gradient(to right, rgba(255, 255, 255, 1) 0, rgba(255, 255, 255, 1) 1px, transparent 1px, transparent ${size}px),
          repeating-linear-gradient(to bottom, rgba(255, 255, 255, 1) 0, rgba(255, 255, 255, 1) 1px, transparent 1px, transparent ${size}px)
        `,
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)"
      }}
    />
  );
}
