"use client";

import { motion } from "framer-motion";
import { useMouse } from "@/hooks/useMouse";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

interface MouseGlowProps {
  className?: string;
}

export function MouseGlow({ className }: MouseGlowProps) {
  const { x, y } = useMouse();
  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (isReducedMotion) return null;

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.60 0.22 25 / 0.12) 0%, transparent 70%)",
        }}
        animate={{
          x: x - 250,
          y: y - 250,
        }}
        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}
