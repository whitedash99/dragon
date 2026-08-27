"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "cyan";
  size?: "sm" | "md" | "lg" | "icon";
  shine?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", shine = false, children, ...props }, ref) => {
    const variantClasses = {
      primary: "bg-gradient-to-r from-[#00E5FF] via-[#1685FF] to-[#7C3CFF] text-[#020617] font-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:scale-[1.02] active:scale-[0.98]",
      cyan: "bg-cyan-500 text-[#020617] font-black shadow-[0_0_15px_rgba(0,229,255,0.35)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:scale-[1.02] active:scale-[0.98]",
      secondary: "bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 font-bold active:scale-[0.98] shadow-[0_0_15px_rgba(0,0,0,0.5)]",
      ghost: "bg-transparent hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 font-medium",
      danger: "bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)] active:scale-[0.98]",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs rounded-xl",
      md: "px-4 py-2 text-xs rounded-xl font-mono",
      lg: "px-6 py-2.5 text-sm rounded-xl font-mono font-bold",
      icon: "size-9 p-0 flex items-center justify-center rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono",
          variantClasses[variant],
          sizeClasses[size],
          shine && "glass-shine-sweep",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
