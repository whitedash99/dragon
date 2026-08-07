"use client";

import { useState, useEffect, useRef } from "react";

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useWindowSize(): WindowSize {
  // Always initialize with identical state on server and client
  const [size, setSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  const sizeRef = useRef(size);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    let animFrameId: number | null = null;

    function update() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const snapshot: WindowSize = {
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      };

      const prev = sizeRef.current;

      if (
        prev.width !== snapshot.width ||
        prev.height !== snapshot.height ||
        prev.isMobile !== snapshot.isMobile ||
        prev.isTablet !== snapshot.isTablet ||
        prev.isDesktop !== snapshot.isDesktop
      ) {
        sizeRef.current = snapshot;
        setSize(snapshot);
      }
      ticking = false;
    }

    // Run snapshot immediately after mount
    update();

    function onResize() {
      if (!ticking) {
        animFrameId = requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return size;
}
