"use client";

import React from "react";
import { DragonLogo } from "@/components/ui/dragon-logo";

export default function Logo({
  size = "md",
  showText = true,
  className,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}) {
  return (
    <DragonLogo
      size={size}
      showText={showText}
      textVariant="studios"
      subtitle="Game Studio"
      className={className}
    />
  );
}
