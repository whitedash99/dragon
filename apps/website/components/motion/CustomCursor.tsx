"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { MousePointer, Magnet, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type CursorMode = "default" | "pointer" | "text" | "card" | "loading" | "hidden";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [magneticEnabled, setMagneticEnabled] = useState(true);
  const [showWidget, setShowWidget] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.3 };
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

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (!active) return;
      setMounted(true);
      syncSettings();

      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isTouch || reducedMotion) {
        setEnabled(false);
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Magnetic Attraction Effect
      if (magneticEnabled) {
        const magneticEl = target.closest(
          "[data-magnetic='true'], button, a, .magnetic-target"
        ) as HTMLElement | null;

        if (magneticEl) {
          const rect = magneticEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

          if (dist < 70) {
            targetX = centerX + (e.clientX - centerX) * 0.35;
            targetY = centerY + (e.clientY - centerY) * 0.35;
          }
        }
      }

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

  const toggleCursor = () => {
    const nextVal = !enabled;
    setEnabled(nextVal);
    localStorage.setItem("dragon_cursor_enabled", String(nextVal));
    window.dispatchEvent(new Event("dragon_cursor_setting_change"));
  };

  const toggleMagnet = () => {
    const nextVal = !magneticEnabled;
    setMagneticEnabled(nextVal);
    localStorage.setItem("dragon_magnet_enabled", String(nextVal));
    window.dispatchEvent(new Event("dragon_cursor_setting_change"));
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Cursor Control Widget Trigger */}
      <div className="fixed bottom-5 right-5 z-[99990]">
        <button
          onClick={() => setShowWidget(!showWidget)}
          title="Custom Cursor & Magnetic Effect Settings"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/80 border border-white/20 text-white shadow-2xl backdrop-blur-md hover:bg-[#ff1e4b] hover:border-[#ff1e4b] transition-all"
        >
          <MousePointer className="size-4" />
        </button>

        {/* Control Panel Popover */}
        {showWidget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-12 right-0 w-64 rounded-2xl bg-[#0a0a0c]/95 p-4 border border-white/20 shadow-2xl backdrop-blur-xl text-white font-mono text-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold uppercase text-[#ff1e4b] flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                <span>CURSOR & MAGNET</span>
              </span>
              <button onClick={() => setShowWidget(false)} className="text-muted-foreground hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            {/* Custom Cursor Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="size-4 text-sky-400" />
                <span>Custom Cursor</span>
              </div>
              <button
                onClick={toggleCursor}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors border",
                  enabled ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-white/5 text-muted-foreground border-white/10"
                )}
              >
                {enabled ? "ON" : "OFF"}
              </button>
            </div>

            {/* Magnetic Effect Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Magnet className="size-4 text-purple-400" />
                <span>Magnetic Pull</span>
              </div>
              <button
                onClick={toggleMagnet}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors border",
                  magneticEnabled ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-white/5 text-muted-foreground border-white/10"
                )}
              >
                {magneticEnabled ? "ON" : "OFF"}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Render Custom Cursor graphics only if enabled & not hidden */}
      {enabled && mode !== "hidden" && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
        >
          {/* Precision Core Dot */}
          <motion.div
            className={cn(
              "fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out",
              mode === "text"
                ? "h-5 w-0.5 bg-gradient-to-b from-[#ff1e4b] via-white to-[#ff1e4b]"
                : isClicking
                ? "h-1.5 w-1.5 bg-amber-400"
                : mode === "pointer"
                ? "h-2 w-2 bg-white"
                : "h-2 w-2 bg-[#ff1e4b]",
              "shadow-[0_0_10px_rgba(255,30,75,0.8)]"
            )}
            style={{
              x: mouseX,
              y: mouseY,
            }}
          />

          {/* Outer Reticle & Magnetic Ring Follower */}
          {mode !== "text" && (
            <motion.div
              className={cn(
                "fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out flex items-center justify-center text-[0.6rem] font-bold font-mono tracking-widest text-white backdrop-blur-[1px]",
                mode === "pointer"
                  ? "h-12 w-12 border-[#ff1e4b]/80 bg-[#ff1e4b]/10 scale-110 shadow-[0_0_24px_rgba(255,30,75,0.4)]"
                  : mode === "card"
                  ? "h-16 w-16 border-amber-400/60 bg-black/40 rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                  : mode === "loading"
                  ? "h-12 w-12 border-dashed border-[#ff1e4b] bg-black/40 animate-spin"
                  : "h-8 w-8 border-white/20 bg-transparent",
                isClicking && "scale-90 border-amber-400 bg-amber-400/10"
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
                  className="px-1 text-center font-mono text-[0.55rem] tracking-wider text-amber-300 font-bold uppercase drop-shadow"
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
