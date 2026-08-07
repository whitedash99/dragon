import * as React from "react";
import { cn } from "@/lib/cn";

interface GradientMeshProps {
  className?: string;
  colors?: string[];
  opacity?: number;
  animated?: boolean;
}

export function GradientMesh({
  className,
  colors = ['oklch(0.65 0.25 275)', 'oklch(0.55 0.28 300)', 'oklch(0.70 0.20 245)'],
  opacity = 0.15,
  animated = true,
}: GradientMeshProps) {
  const gradientString = colors.map((color, i) => `radial-gradient(circle at ${[
    '0% 0%', '100% 100%', '0% 100%', '100% 0%'
  ][i % 4]}, ${color} 0%, transparent 60%)`).join(', ');

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 pointer-events-none w-full h-full",
        className
      )}
      style={{
        backgroundImage: gradientString,
        opacity,
        ...(animated ? {
          animation: "gradient-shift 15s ease-in-out infinite alternate"
        } : {})
      }}
    >
      {animated && (
        <style dangerouslySetInnerHTML={{__html: `
          @media (prefers-reduced-motion: no-preference) {
            @keyframes gradient-shift {
              0% { transform: scale(1) translate(0px, 0px); }
              50% { transform: scale(1.05) translate(10px, 10px); }
              100% { transform: scale(1) translate(-10px, -5px); }
            }
          }
        `}} />
      )}
    </div>
  );
}
