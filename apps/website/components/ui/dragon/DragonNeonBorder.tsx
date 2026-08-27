"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface DragonNeonBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "cyan" | "purple" | "magenta" | "green";
  children: React.ReactNode;
}

export function DragonNeonBorder({
  children,
  className,
  variant = "cyan",
  ...props
}: DragonNeonBorderProps) {
  const borderVariants = {
    cyan: "border-cyan-400/40 shadow-[0_0_20px_rgba(0,229,255,0.25)]",
    purple: "border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    magenta: "border-pink-400/40 shadow-[0_0_20px_rgba(255,43,214,0.25)]",
    green: "border-emerald-400/40 shadow-[0_0_20px_rgba(0,255,198,0.25)]",
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl border transition-all duration-300",
        borderVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
