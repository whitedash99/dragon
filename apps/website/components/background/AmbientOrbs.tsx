"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface AmbientOrbsProps {
  className?: string;
  count?: number;
}

export function AmbientOrbs({ className, count = 3 }: AmbientOrbsProps) {
  const numOrbs = Math.min(Math.max(1, count), 5);
  
  const orbs = [
    { color: "bg-blue-500", size: "w-[400px] h-[400px]", top: "10%", left: "20%", anim: "orb-float-1" },
    { color: "bg-purple-500", size: "w-[500px] h-[500px]", top: "50%", left: "70%", anim: "orb-float-2" },
    { color: "bg-cyan-400", size: "w-[300px] h-[300px]", top: "80%", left: "30%", anim: "orb-float-3" },
    { color: "bg-pink-500", size: "w-[450px] h-[450px]", top: "20%", left: "80%", anim: "orb-float-1" },
    { color: "bg-indigo-500", size: "w-[350px] h-[350px]", top: "70%", left: "10%", anim: "orb-float-2" },
  ];

  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
    >
      {orbs.slice(0, numOrbs).map((orb, i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full blur-[100px] mix-blend-screen opacity-20 will-change-transform",
            orb.color,
            orb.size
          )}
          style={{
            top: orb.top,
            left: orb.left,
            animation: `${orb.anim} ${15 + i * 5}s ease-in-out infinite alternate`
          }}
        />
      ))}
    </div>
  );
}
