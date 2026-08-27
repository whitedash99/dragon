"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type AnimationType = "crossfade" | "fade" | "slide" | "typing" | "static";

export interface ConfigurableTextRotatorProps {
  messages: string[];
  animationType?: AnimationType;
  displayDurationMs?: number; // Default 4500ms (4.5s)
  transitionDurationSec?: number; // Default 0.6s
  typingSpeedMs?: number; // For typing mode, ms per character
  loop?: boolean;
  className?: string;
  textClassName?: string;
  prefixIcon?: React.ReactNode;
}

export function ConfigurableTextRotator({
  messages,
  animationType = "crossfade",
  displayDurationMs = 7000,
  transitionDurationSec = 0.7,
  typingSpeedMs = 45,
  loop = true,
  className = "",
  textClassName = "",
  prefixIcon,
}: ConfigurableTextRotatorProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const cleanMessages = (messages && messages.length > 0) ? messages : ["Dragon Gaming Studios"];
  const currentMessage = cleanMessages[currentIndex] || cleanMessages[0];

  // If user prefers reduced motion, force static rendering
  const effectiveAnimation = prefersReducedMotion ? "static" : animationType;

  // Typing animation effect
  useEffect(() => {
    if (effectiveAnimation !== "typing") return;

    let charIndex = 0;
    setTypedText("");
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setTypedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, typingSpeedMs);

    return () => clearInterval(typeInterval);
  }, [currentIndex, currentMessage, effectiveAnimation, typingSpeedMs]);

  // Rotator timer with pause on hover/focus
  useEffect(() => {
    if (cleanMessages.length <= 1 || effectiveAnimation === "static" || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= cleanMessages.length) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, displayDurationMs);

    return () => clearInterval(timer);
  }, [cleanMessages.length, displayDurationMs, effectiveAnimation, loop, isPaused]);

  // Animation variants
  const variants = {
    crossfade: {
      initial: { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -4 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    },
    static: {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 1, y: 0 },
    },
    typing: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  };

  const selectedVariant = variants[effectiveAnimation] || variants.crossfade;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      className={`inline-flex items-center gap-2 overflow-hidden outline-none ${className}`}
    >
      {prefixIcon && <span className="shrink-0">{prefixIcon}</span>}

      <div className="relative overflow-hidden min-h-[1.5em] flex items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={effectiveAnimation === "typing" ? "typing-box" : currentIndex}
            initial={selectedVariant.initial}
            animate={selectedVariant.animate}
            exit={selectedVariant.exit}
            transition={{
              duration: effectiveAnimation === "static" ? 0 : transitionDurationSec,
              ease: [0.16, 1, 0.3, 1], // Luxury cubic ease
            }}
            className={`inline-block font-sans whitespace-nowrap ${textClassName}`}
          >
            {effectiveAnimation === "typing" ? (
              <>
                {typedText}
                {isTyping && (
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 animate-pulse" />
                )}
              </>
            ) : (
              currentMessage
            )}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
