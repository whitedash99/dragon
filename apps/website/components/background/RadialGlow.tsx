import * as React from "react";
import { cn } from "@/lib/cn";

interface RadialGlowProps {
  className?: string;
  color?: string;
  size?: string;
  position?: { x: string; y: string };
  opacity?: number;
}

export function RadialGlow({
  className,
  color = "oklch(0.65 0.25 275)",
  size = "600px",
  position = { x: "50%", y: "30%" },
  opacity = 0.2,
}: RadialGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute pointer-events-none", className)}
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        filter: "blur(60px)"
      }}
    />
  );
}
