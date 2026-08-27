"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface DragonPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "cyan" | "purple" | "magenta" | "green";
  action?: React.ReactNode;
}

export function DragonPanel({
  title,
  subtitle,
  icon,
  action,
  children,
  className,
  variant = "cyan",
  ...props
}: DragonPanelProps) {
  const borderVariants = {
    cyan: "border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.1)]",
    purple: "border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]",
    magenta: "border-pink-500/30 shadow-[0_0_30px_rgba(255,43,214,0.1)]",
    green: "border-emerald-500/30 shadow-[0_0_30px_rgba(0,255,198,0.1)]",
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl bg-[#03091D]/90 backdrop-blur-2xl border p-6 sm:p-8 space-y-6 overflow-hidden",
        borderVariants[variant],
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            {icon && <span className="text-cyan-400 shrink-0">{icon}</span>}
            <div>
              {title && (
                <h3 className="text-base sm:text-lg font-heading font-black text-white uppercase tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
