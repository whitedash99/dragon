"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollSlideSectionProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
  className?: string;
}

export function ScrollSlideSection({
  children,
  direction = "left",
  delay = 0,
  className = "",
}: ScrollSlideSectionProps) {
  const initialX = direction === "left" ? -60 : direction === "right" ? 60 : 0;
  const initialY = direction === "up" ? 35 : 0;
  const initialRotateY = direction === "left" ? -2 : direction === "right" ? 2 : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialX,
        y: initialY,
        rotateY: initialRotateY,
        scale: 0.98,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        rotateY: 0,
        scale: 1,
      }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 20,
        mass: 0.85,
        delay,
      }}
      className={`transform-gpu will-change-transform [content-visibility:auto] [contain-intrinsic-size:auto_650px] ${className}`}
    >
      {children}
    </motion.div>
  );
}
