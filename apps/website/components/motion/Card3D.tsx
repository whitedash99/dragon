"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "magenta" | "violet" | "gold" | "emerald" | "multi";
  depth?: number;
  enableGlare?: boolean;
}

export function Card3D({
  children,
  className,
  glowColor = "cyan",
  depth = 15,
  enableGlare = true,
  ...props
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery-smooth 3D return
  const mouseX = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [depth, -depth]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-depth, depth]);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const posX = (e.clientX - rect.left) / rect.width - 0.5;
      const posY = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(posX);
      y.set(posY);
    },
    [x, y]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glowStyles = {
    cyan: "hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,240,255,0.4)]",
    magenta: "hover:border-pink-500 hover:shadow-[0_0_35px_rgba(255,0,127,0.45)]",
    violet: "hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.45)]",
    gold: "hover:border-amber-400 hover:shadow-[0_0_35px_rgba(255,184,0,0.45)]",
    emerald: "hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(0,255,136,0.4)]",
    multi: "hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(0,240,255,0.35),0_0_70px_rgba(168,85,247,0.2)]",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 w-full"
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative overflow-hidden rounded-3xl transition-all duration-300",
          glowStyles[glowColor],
          className
        )}
      >
        {children}

        {/* Dynamic Holographic Specular Glare */}
        {enableGlare && (
          <motion.div
            aria-hidden="true"
            style={{
              left: glareX,
              top: glareY,
              opacity: isHovered ? 0.35 : 0,
            }}
            className="pointer-events-none absolute -inset-full bg-radial from-white/30 via-cyan-300/10 to-transparent transition-opacity duration-300 blur-xl"
          />
        )}
      </motion.div>
    </div>
  );
}
