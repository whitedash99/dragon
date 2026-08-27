"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface AuroraFieldProps {
  atmosphere?: "cyan-blue" | "violet-magenta" | "amber-orange" | "crimson-violet" | "emerald-turquoise";
  className?: string;
}

export function AuroraField({
  atmosphere = "cyan-blue",
  className,
}: AuroraFieldProps) {
  const themes = {
    "cyan-blue": {
      a: "bg-cyan-500/15",
      b: "bg-blue-600/15",
      c: "bg-teal-400/10",
    },
    "violet-magenta": {
      a: "bg-violet-600/15",
      b: "bg-pink-600/15",
      c: "bg-purple-500/10",
    },
    "amber-orange": {
      a: "bg-amber-500/15",
      b: "bg-orange-600/15",
      c: "bg-yellow-500/10",
    },
    "crimson-violet": {
      a: "bg-red-600/15",
      b: "bg-violet-700/15",
      c: "bg-rose-500/10",
    },
    "emerald-turquoise": {
      a: "bg-emerald-500/15",
      b: "bg-teal-500/15",
      c: "bg-cyan-500/10",
    },
  };

  const selected = themes[atmosphere] || themes["cyan-blue"];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden select-none z-0", className)}
    >
      <div className={cn("absolute top-0 left-1/4 w-[650px] h-[350px] rounded-full blur-[160px] animate-pulse duration-10000", selected.a)} />
      <div className={cn("absolute top-1/4 right-1/4 w-[600px] h-[400px] rounded-full blur-[180px]", selected.b)} />
      <div className={cn("absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full blur-[140px]", selected.c)} />
    </div>
  );
}
