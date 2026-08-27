"use client";

import { useState, useEffect } from "react";

export type DeviceTier =
  | "A_DESKTOP"
  | "B_LARGE_TOUCH"
  | "C_TABLET"
  | "D_MOBILE"
  | "E_LOW_POWER";

export interface DeviceCapabilityState {
  tier: DeviceTier;
  isTouch: boolean;
  isLargeDisplay: boolean;
  isTablet: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  particleScale: number;
  maxFps: number;
  glowBlurRadius: number;
}

export function useDeviceTier(): DeviceCapabilityState {
  const [state, setState] = useState<DeviceCapabilityState>({
    tier: "A_DESKTOP",
    isTouch: false,
    isLargeDisplay: true,
    isTablet: false,
    isMobile: false,
    prefersReducedMotion: false,
    particleScale: 1.0,
    maxFps: 60,
    glowBlurRadius: 180,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const computeCapabilities = (): DeviceCapabilityState => {
      const width = window.innerWidth;
      const hasTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const nav = navigator as any;
      const isLowHardware =
        (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) ||
        (nav.deviceMemory && nav.deviceMemory <= 2);

      let tier: DeviceTier = "A_DESKTOP";
      let particleScale = 1.0;
      let glowBlurRadius = 180;

      if (reducedMotion || isLowHardware) {
        tier = "E_LOW_POWER";
        particleScale = 0.25;
        glowBlurRadius = 60;
      } else if (width < 768) {
        tier = "D_MOBILE";
        particleScale = 0.4;
        glowBlurRadius = 90;
      } else if (width < 1024) {
        tier = "C_TABLET";
        particleScale = 0.65;
        glowBlurRadius = 120;
      } else if (hasTouch && width >= 1024) {
        tier = "B_LARGE_TOUCH";
        particleScale = 0.75;
        glowBlurRadius = 140;
      } else {
        tier = "A_DESKTOP";
        particleScale = 1.0;
        glowBlurRadius = 180;
      }

      return {
        tier,
        isTouch: hasTouch,
        isLargeDisplay: width >= 1024,
        isTablet: width >= 768 && width < 1024,
        isMobile: width < 768,
        prefersReducedMotion: reducedMotion,
        particleScale,
        maxFps: tier === "E_LOW_POWER" ? 30 : 60,
        glowBlurRadius,
      };
    };

    const update = () => setState(computeCapabilities());
    update();

    window.addEventListener("resize", update);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", update);
      }
    };
  }, []);

  return state;
}

/**
 * Returns an intelligent device-pixel-ratio cap to prevent massive overdraw on 3x retina mobile screens.
 */
export function getOptimalPixelRatio(tier: DeviceTier = "A_DESKTOP"): number {
  if (typeof window === "undefined") return 1;
  const dpr = window.devicePixelRatio || 1;
  if (tier === "E_LOW_POWER" || tier === "D_MOBILE") {
    return Math.min(dpr, 1.25);
  }
  if (tier === "C_TABLET" || tier === "B_LARGE_TOUCH") {
    return Math.min(dpr, 1.5);
  }
  return Math.min(dpr, 2.0);
}

/**
 * Hook to track tab visibility so animation loops can pause when tab is hidden.
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

