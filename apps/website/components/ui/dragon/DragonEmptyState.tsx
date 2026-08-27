"use client";

import React from "react";
import { Gamepad2 } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DragonEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function DragonEmptyState({
  title = "No Content Available",
  description = "Dragon Studios is actively forging new experiences. Check back soon.",
  action,
  className,
}: DragonEmptyStateProps) {
  return (
    <div className={cn("p-12 text-center rounded-3xl bg-[#090D16]/90 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl", className)}>
      <div className="size-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
        <Gamepad2 className="size-7" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-lg font-heading font-black text-white uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          {description}
        </p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
