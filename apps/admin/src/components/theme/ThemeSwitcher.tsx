"use client";

import React from "react";
import { Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ThemeSwitcher({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#060B18] border border-blue-500/30 text-xs font-mono text-cyan-300 font-bold shadow-inner select-none",
        className
      )}
      title="Studio Cyber OS Mode Active"
    >
      <Moon className="size-3.5 text-cyan-400" />
      <span className="tracking-wide">CYBER DARK OS</span>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
    </div>
  );
}

export function ThemeToggleButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-2 rounded-xl bg-[#060B18] text-cyan-400 border border-blue-500/30 transition-all shadow-xs select-none",
        className
      )}
      title="Dragon Cyber Theme"
    >
      <Moon className="size-4 text-cyan-400" />
    </div>
  );
}
