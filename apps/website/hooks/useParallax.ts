"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal";
}

export function useParallax<T extends HTMLElement = HTMLElement>(
  options: ParallaxOptions = {}
): React.RefObject<T | null> {
  const { speed = 0.3, direction = "vertical" } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const yAmount = speed * 100;
    const props = direction === "vertical"
      ? { y: -yAmount }
      : { x: -yAmount };

    const tween = gsap.to(element, {
      ...props,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, direction]);

  return ref;
}
