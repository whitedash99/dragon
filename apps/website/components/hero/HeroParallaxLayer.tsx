"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

interface ParallaxContextValue {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  enabled: boolean;
}

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

export function HeroParallaxContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [enabled, setEnabled] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 20 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isMobile && !prefersReducedMotion) {
      setEnabled(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <ParallaxContext.Provider value={{ springX, springY, enabled }}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full h-full ${className}`}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  );
}

export function HeroParallaxLayer({
  depth = 0.2,
  children,
  className = "",
}: {
  depth?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(ParallaxContext);
  const fallbackMotion = useMotionValue(0);

  const targetX = ctx?.springX || fallbackMotion;
  const targetY = ctx?.springY || fallbackMotion;

  const maxPixelShift = 24 * depth;
  const x = useTransform(targetX, [-1, 1], [-maxPixelShift, maxPixelShift]);
  const y = useTransform(targetY, [-1, 1], [-maxPixelShift * 0.6, maxPixelShift * 0.6]);

  if (!ctx || !ctx.enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}
