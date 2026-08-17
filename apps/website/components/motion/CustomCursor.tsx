"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

export type CursorMode = "default" | "pointer" | "text" | "card" | "loading" | "hidden";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [magneticEnabled, setMagneticEnabled] = useState(true);
  const [mode, setMode] = useState<CursorMode>("default");
  const [isClicking, setIsClicking] = useState(false);
  const [isMagneticHover, setIsMagneticHover] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for magnetic reticle
  const springConfig = { damping: 24, stiffness: 400, mass: 0.25 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const prevModeRef = useRef<CursorMode>("default");

  const syncSettings = useCallback(() => {
    const userCursor = localStorage.getItem("dragon_cursor_enabled");
    const userMagnet = localStorage.getItem("dragon_magnet_enabled");

    if (userCursor !== null) {
      setEnabled(userCursor === "true");
    }
    if (userMagnet !== null) {
      setMagneticEnabled(userMagnet === "true");
    }
  }, []);

  // Dynamically toggle default Windows native OS cursor visibility
  useEffect(() => {
    if (enabled && mode !== "hidden") {
      document.documentElement.classList.add("dragon-cursor-active");
    } else {
      document.documentElement.classList.remove("dragon-cursor-active");
    }
    return () => {
      document.documentElement.classList.remove("dragon-cursor-active");
    };
  }, [enabled, mode]);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (!active) return;
      setMounted(true);
      syncSettings();

      const isTouch =
        typeof window !== "undefined" &&
        (window.matchMedia("(pointer: coarse)").matches ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0);
      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isTouch || reducedMotion) {
        setEnabled(false);
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Magnetic Attraction Physics & Snap
      let magHovered = false;
      if (magneticEnabled) {
        const magneticEl = target.closest(
          "[data-magnetic='true'], button, a, .magnetic-target, [role='button']"
        ) as HTMLElement | null;

        if (magneticEl) {
          const rect = magneticEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

          if (dist < 85) {
            magHovered = true;
            targetX = centerX + (e.clientX - centerX) * 0.3;
            targetY = centerY + (e.clientY - centerY) * 0.3;
          }
        }
      }
      setIsMagneticHover(magHovered);

      mouseX.set(targetX);
      mouseY.set(targetY);

      // Mode detection
      const isBusy = target.closest("[aria-busy='true'], [data-cursor-loading='true']") !== null;
      if (isBusy) {
        if (prevModeRef.current !== "loading") {
          prevModeRef.current = "loading";
          setMode("loading");
        }
        setCursorText("LOADING");
        return;
      }

      const cardEl = target.closest(
        "[data-cursor-card], .group\\/card, .group\\/tilt, [id='games'] .group"
      ) as HTMLElement | null;

      const interactiveEl = target.closest(
        "a, button, input[type='submit'], input[type='button'], select, [role='button'], [data-cursor='pointer']"
      ) as HTMLElement | null;

      const textEl = target.closest(
        "input[type='text'], input[type='email'], input[type='password'], input[type='search'], textarea, [contenteditable='true']"
      ) as HTMLElement | null;

      const customText =
        interactiveEl?.getAttribute("data-cursor-text") ||
        cardEl?.getAttribute("data-cursor-text") ||
        "";

      if (textEl) {
        if (prevModeRef.current !== "text") {
          prevModeRef.current = "text";
          setMode("text");
        }
        setCursorText("");
      } else if (interactiveEl) {
        if (prevModeRef.current !== "pointer") {
          prevModeRef.current = "pointer";
          setMode("pointer");
        }
        setCursorText(customText);
      } else if (cardEl) {
        if (prevModeRef.current !== "card") {
          prevModeRef.current = "card";
          setMode("card");
        }
        setCursorText(customText || "VIEW");
      } else {
        if (prevModeRef.current !== "default") {
          prevModeRef.current = "default";
          setMode("default");
        }
        setCursorText("");
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      setMode("hidden");
      prevModeRef.current = "hidden";
    };
    const handleMouseEnter = () => {
      setMode("default");
      prevModeRef.current = "default";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const handleStorageChange = () => syncSettings();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("dragon_cursor_setting_change", handleStorageChange);

    return () => {
      active = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("dragon_cursor_setting_change", handleStorageChange);
    };
  }, [mouseX, mouseY, magneticEnabled, syncSettings]);

  if (!mounted) return null;

  return (
    <>
      {/* Custom Cursor graphic in Obsidian & Electric Neon Blue */}
      {enabled && mode !== "hidden" && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
        >
          {/* 1. Subtle Electric Blue Aura Lighting */}
          <motion.div
            className={cn(
              "fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-300 ease-out",
              isMagneticHover ? "h-16 w-16 opacity-90" : "h-10 w-10 opacity-60"
            )}
            style={{
              x: ringX,
              y: ringY,
              background: "radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(37,99,235,0.15) 55%, transparent 75%)",
              filter: "blur(5px)",
            }}
          />

          {/* 2. Precision Electric Core Dot */}
          <motion.div
            className={cn(
              "fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-100 ease-out z-10",
              mode === "text"
                ? "h-5 w-0.5 bg-cyan-400"
                : isClicking
                ? "h-2 w-2 bg-cyan-300 shadow-[0_0_12px_rgba(56,189,248,1)] scale-125"
                : mode === "pointer"
                ? "h-2 w-2 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"
                : "h-2 w-2 bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
            )}
            style={{
              x: mouseX,
              y: mouseY,
            }}
          />

          {/* 3. Outer Electric Reticle */}
          {mode !== "text" && (
            <motion.div
              className={cn(
                "fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 ease-out flex items-center justify-center text-[0.6rem] font-bold font-mono tracking-widest text-cyan-300 backdrop-blur-[1px]",
                isMagneticHover
                  ? "h-12 w-12 border-cyan-400 bg-blue-600/20 shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-110"
                  : mode === "pointer"
                  ? "h-10 w-10 border-cyan-400/80 bg-blue-600/10 scale-105 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                  : "h-8 w-8 border-cyan-400/30 bg-blue-950/20",
                isClicking && "scale-90 border-cyan-300"
              )}
              style={{
                x: ringX,
                y: ringY,
              }}
            >
              {cursorText && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-1 py-0.5 text-center font-mono text-[0.5rem] tracking-wider text-cyan-200 font-extrabold uppercase rounded bg-[#07111F]/90 border border-blue-500/30"
                >
                  {cursorText}
                </motion.span>
              )}
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}
