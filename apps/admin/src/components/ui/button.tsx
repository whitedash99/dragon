"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solidRed" | "glow" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "solidRed",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    solidRed:
      "bg-[#ff1e4b] hover:bg-[#e0123c] text-white shadow-lg shadow-[#ff1e4b]/25 hover:shadow-[#ff1e4b]/40 border border-[#ff1e4b]/40",
    glow:
      "bg-gradient-to-r from-[#ff1e4b] to-purple-600 hover:from-[#e0123c] hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 border border-purple-500/30",
    outline:
      "bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30",
    ghost:
      "bg-transparent hover:bg-white/10 text-muted-foreground hover:text-white border border-transparent",
    destructive:
      "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-xs rounded-xl gap-2",
    lg: "px-6 py-3 text-sm rounded-2xl gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
