"use client";

import React, { useEffect, useRef } from "react";

export interface InteractiveLightCursorProps {
  color?: string;
  radius?: number;
}

export function InteractiveLightCursor({
  radius = 380,
}: {
  radius?: number;
}) {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let animId: number;
    let isMoving = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      if (cursorEl) {
        cursorEl.style.transform = `translate3d(${currentX - radius}px, ${currentY - radius}px, 0)`;
      }

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        animId = requestAnimationFrame(render);
      } else {
        isMoving = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (cursorEl && cursorEl.style.opacity !== "1") {
        cursorEl.style.opacity = "1";
      }

      if (!isMoving) {
        isMoving = true;
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseLeave = () => {
      if (cursorEl) {
        cursorEl.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [radius]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 transition-opacity duration-300 select-none will-change-transform opacity-0"
      style={{
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle at center, rgba(0, 240, 255, 0.12) 0%, rgba(168, 85, 247, 0.08) 40%, rgba(255, 0, 127, 0.04) 70%, transparent 85%)`,
        mixBlendMode: "screen",
      }}
    />
  );
}

