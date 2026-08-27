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
  colors = ["#00E5FF", "#338BFF", "#8B5CF6", "#1D4ED8"],
  opacity = 0.22,
  animated = true,
}: GradientMeshProps) {
  const gradientString = colors.map((color, i) => `radial-gradient(circle at ${[
    '15% 15%', '85% 85%', '15% 85%', '85% 15%'
  ][i % 4]}, ${color} 0%, transparent 65%)`).join(', ');

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
          animation: "gradient-shift 18s ease-in-out infinite alternate"
        } : {})
      }}
    >
      {animated && (
        <style dangerouslySetInnerHTML={{__html: `
          @media (prefers-reduced-motion: no-preference) {
            @keyframes gradient-shift {
              0% { transform: scale(1) translate(0px, 0px); }
              50% { transform: scale(1.06) translate(15px, 10px); }
              100% { transform: scale(1) translate(-15px, -10px); }
            }
          }
        `}} />
      )}
    </div>
  );
}
