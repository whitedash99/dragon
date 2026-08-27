"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface DragonGlowProps {
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function DragonGlow({
  color = "rgba(0, 240, 255, 0.25)",
  size = "md",
  className,
}: DragonGlowProps) {
  const sizeClasses = {
    sm: "w-64 h-32 blur-[80px]",
    md: "w-[600px] h-[300px] blur-[140px]",
    lg: "w-[900px] h-[450px] blur-[180px]",
    xl: "w-[1200px] h-[600px] blur-[220px]",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full opacity-30 transition-all duration-700",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    />
  );
}
