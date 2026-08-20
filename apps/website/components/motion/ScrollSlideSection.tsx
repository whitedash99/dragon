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
  const initialX = direction === "left" ? -90 : direction === "right" ? 90 : 0;
  const initialY = direction === "up" ? 45 : 0;
  const initialRotateY = direction === "left" ? -4 : direction === "right" ? 4 : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialX,
        y: initialY,
        rotateY: initialRotateY,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        rotateY: 0,
        scale: 1,
      }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 20,
        mass: 0.85,
        delay,
      }}
      className={`transform-gpu will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
