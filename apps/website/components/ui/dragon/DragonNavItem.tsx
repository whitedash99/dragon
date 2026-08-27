"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { soundFx } from "@/lib/sound-effects";

export interface DragonNavItemProps {
  label: string;
  href?: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
  variant?: "cyan" | "purple" | "magenta";
}

export function DragonNavItem({
  label,
  href,
  icon,
  active = false,
  badge,
  onClick,
  className,
  variant = "cyan",
}: DragonNavItemProps) {
  const handleClick = () => {
    soundFx.playClick();
    if (onClick) onClick();
  };

  const activeGlows = {
    cyan: "bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-cyan-300 border-l-4 border-[#00E5FF] shadow-[inset_0_0_20px_rgba(0,229,255,0.15)]",
    purple: "bg-gradient-to-r from-purple-500/20 via-violet-500/15 to-transparent text-purple-300 border-l-4 border-[#A855F7] shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]",
    magenta: "bg-gradient-to-r from-pink-500/20 via-magenta-500/15 to-transparent text-pink-300 border-l-4 border-[#FF2BD6] shadow-[inset_0_0_20px_rgba(255,43,214,0.15)]",
  };

  const content = (
    <div
      className={cn(
        "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer select-none",
        active
          ? activeGlows[variant]
          : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <span className={active ? "text-cyan-400" : "text-slate-500"}>
          {icon}
        </span>
        <span>{label}</span>
      </div>

      {badge !== undefined && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
          {badge}
        </span>
      )}

      {active && badge === undefined && (
        <div className="size-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {content}
      </Link>
    );
  }

  return <button className="w-full text-left">{content}</button>;
}
