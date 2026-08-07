"use client";

import React, { useSyncExternalStore } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ScrollProgress() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 30,
    restDelta: 0.001,
  });

  if (!mounted) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-1 origin-left bg-gradient-to-r from-dragon-400 via-neon-purple to-neon-cyan shadow-[0_0_12px_rgba(139,92,246,0.8)] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
