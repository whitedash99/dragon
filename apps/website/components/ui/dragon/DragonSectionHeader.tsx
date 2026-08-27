"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { Sparkles } from "lucide-react";

export interface DragonSectionHeaderProps {
  category?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: "cyan" | "purple" | "magenta" | "green";
  className?: string;
}

export function DragonSectionHeader({
  category,
  title,
  subtitle,
  action,
  variant = "cyan",
  className,
}: DragonSectionHeaderProps) {
  const gradientTitles = {
    cyan: "text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#00E5FF]",
    purple: "text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-[#A855F7]",
    magenta: "text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-[#FF2BD6]",
    green: "text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-[#00FFC6]",
  };

  const categoryAccents = {
    cyan: "text-cyan-300 border-cyan-400/30 bg-cyan-500/10",
    purple: "text-purple-300 border-purple-400/30 bg-purple-500/10",
    magenta: "text-pink-300 border-pink-400/30 bg-pink-500/10",
    green: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 select-none",
        className
      )}
    >
      <div className="space-y-2 max-w-2xl">
        {category && (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[10px] font-mono font-black uppercase tracking-wider",
              categoryAccents[variant]
            )}
          >
            <Sparkles className="size-3" />
            <span>{category}</span>
          </div>
        )}
        <h2
          className={cn(
            "text-2xl sm:text-3xl lg:text-4xl font-heading font-black uppercase tracking-tight leading-none",
            gradientTitles[variant]
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm font-mono text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
