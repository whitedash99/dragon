"use client";

import { useState, useEffect, useRef } from "react";

interface ScrollState {
  scrollY: number;
  scrollProgress: number;
  direction: "up" | "down" | null;
  isScrolled: boolean;
}

export function useScroll(threshold: number = 50): ScrollState {
  // Always initialize with identical state on both server and client to prevent hydration mismatch
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrollProgress: 0,
    direction: null,
    isScrolled: false,
  });

  const stateRef = useRef(state);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    let animFrameId: number | null = null;

    function updateScrollState() {
      const scrollY = window.scrollY || 0;
      const docHeight = (document.documentElement.scrollHeight || 0) - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
      const isScrolled = scrollY > threshold;

      const lastY = lastScrollYRef.current;
      const direction: "up" | "down" | null =
        scrollY > lastY ? "down" : scrollY < lastY ? "up" : stateRef.current.direction;

      lastScrollYRef.current = scrollY;

      const newState: ScrollState = {
        scrollY,
        scrollProgress: progress,
        direction,
        isScrolled,
      };

      stateRef.current = newState;
      setState(newState);
      ticking = false;
    }

    // Run initial snapshot check immediately after mount
    updateScrollState();

    function onScroll() {
      if (!ticking) {
        animFrameId = requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, [threshold]);

  return state;
}
