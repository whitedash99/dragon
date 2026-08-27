"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export interface DragonAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "vip";
  ringVariant?: "cyan" | "purple" | "magenta" | "amber";
  className?: string;
}

export function DragonAvatar({
  src = "/images/avatar_obsidian_lightning_dragon.jpg",
  alt = "Operative Avatar",
  size = "md",
  status = "online",
  ringVariant = "cyan",
  className,
}: DragonAvatarProps) {
  const sizeMap = {
    sm: "size-8",
    md: "size-10",
    lg: "size-14",
    xl: "size-20",
  };

  const ringStyles = {
    cyan: "border-cyan-400/60 shadow-[0_0_15px_rgba(0,229,255,0.4)]",
    purple: "border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    magenta: "border-pink-400/60 shadow-[0_0_15px_rgba(255,43,214,0.4)]",
    amber: "border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden border-2 shrink-0 select-none bg-[#020617]",
        sizeMap[size],
        ringStyles[ringVariant],
        className
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
      {status === "online" && (
        <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-[#00E5FF] border-2 border-black animate-pulse" />
      )}
      {status === "vip" && (
        <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-amber-400 border-2 border-black animate-pulse" />
      )}
    </div>
  );
}
