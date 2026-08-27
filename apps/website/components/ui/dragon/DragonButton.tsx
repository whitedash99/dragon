"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { soundFx } from "@/lib/sound-effects";

export interface DragonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "purple" | "magenta" | "green" | "red" | "glass";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function DragonButton({
  children,
  className,
  variant = "cyan",
  size = "md",
  glow = true,
  leftIcon,
  rightIcon,
  onClick,
  ...props
}: DragonButtonProps) {
  const variantStyles = {
    cyan: "bg-gradient-to-r from-[#00E5FF] to-[#1677FF] text-[#020617] border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.7)] hover:border-[#00E5FF]",
    purple: "bg-gradient-to-r from-[#7C3CFF] to-[#A855F7] text-white border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:border-[#A855F7]",
    magenta: "bg-gradient-to-r from-[#FF2BD6] to-[#7C3CFF] text-white border-pink-400/50 hover:shadow-[0_0_30px_rgba(255,43,214,0.7)] hover:border-[#FF2BD6]",
    green: "bg-gradient-to-r from-[#00FFC6] to-[#1677FF] text-[#020617] border-emerald-400/50 hover:shadow-[0_0_30px_rgba(0,255,198,0.7)] hover:border-[#00FFC6]",
    red: "bg-gradient-to-r from-[#FF1744] to-[#7F1D1D] text-white border-red-500/50 hover:shadow-[0_0_30px_rgba(255,23,68,0.7)] hover:border-[#FF1744]",
    glass: "bg-[#060D22]/80 backdrop-blur-xl text-slate-200 border-cyan-500/30 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/10 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]",
  };

  const sizeStyles = {
    sm: "min-h-[40px] px-4 py-1.5 text-xs",
    md: "min-h-[48px] px-6 py-2.5 text-xs sm:text-sm",
    lg: "min-h-[56px] px-8 py-3.5 text-sm sm:text-base",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundFx.playClick();
    if (onClick) onClick(e);
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl font-mono font-black uppercase tracking-wider border shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
