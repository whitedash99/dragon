"use client";

import { useEffect, useRef } from "react";
import { useInView, useAnimation as useMotionAnimation } from "framer-motion";

export function useAnimation(threshold: number = 0.2) {
  const ref = useRef<HTMLElement | null>(null);
  const controls = useMotionAnimation();
  const isInView = useInView(ref, { once: true, amount: threshold });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}
