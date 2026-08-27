"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { GlassSurface } from "./GlassSurface";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3 | 4 | 5;
  interactive?: boolean;
  shine?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, level = 2, interactive = false, shine = false, header, footer, children, ...props }, ref) => {
    return (
      <GlassSurface
        ref={ref}
        level={level}
        interactive={interactive}
        shine={shine}
        className={cn(
          "overflow-hidden flex flex-col bg-[#03091D]/90 backdrop-blur-xl border border-cyan-500/25 shadow-[0_4px_25px_rgba(0,0,0,0.7)] hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300",
          className
        )}
        {...props}
      >
        {header && (
          <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#02050E]/80">
            {header}
          </div>
        )}
        <div className="p-5 sm:p-6 flex-1 text-slate-200">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-3.5 border-t border-cyan-500/20 bg-[#02050E]/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            {footer}
          </div>
        )}
      </GlassSurface>
    );
  }
);

GlassCard.displayName = "GlassCard";
