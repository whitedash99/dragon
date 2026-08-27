"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solidRed" | "glow" | "outline" | "ghost" | "destructive" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs border border-indigo-500/30",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs",
    solidRed:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs border border-indigo-500/30",
    glow:
      "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white shadow-xs border border-indigo-500/30",
    outline:
      "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent",
    destructive:
      "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2 text-xs rounded-xl gap-2",
    lg: "px-5 py-2.5 text-sm rounded-2xl gap-2.5",
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
