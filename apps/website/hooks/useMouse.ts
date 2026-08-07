"use client";

import { useState, useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMouse(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const posRef = useRef(position);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    let animFrameId: number | null = null;
    let latestEvent: MouseEvent | null = null;

    function updateMousePosition() {
      if (!latestEvent) {
        ticking = false;
        return;
      }

      const x = latestEvent.clientX;
      const y = latestEvent.clientY;
      const normalizedX = window.innerWidth > 0 ? x / window.innerWidth : 0;
      const normalizedY = window.innerHeight > 0 ? y / window.innerHeight : 0;

      const prev = posRef.current;

      if (
        Math.abs(prev.x - x) > 2 ||
        Math.abs(prev.y - y) > 2 ||
        Math.abs(prev.normalizedX - normalizedX) > 0.005 ||
        Math.abs(prev.normalizedY - normalizedY) > 0.005
      ) {
        const next = { x, y, normalizedX, normalizedY };
        posRef.current = next;
        setPosition(next);
      }

      ticking = false;
    }

    function handleMouseMove(event: MouseEvent) {
      latestEvent = event;
      if (!ticking) {
        animFrameId = requestAnimationFrame(updateMousePosition);
        ticking = true;
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return position;
}
