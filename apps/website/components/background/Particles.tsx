"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";

interface Circle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  alpha: number;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

export function Particles({
  className,
  quantity = 40,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const animFrameId = useRef<number | null>(null);
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  const circleParams = useCallback((): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const size = Math.floor(Math.random() * 2) + 1;
    const alpha = Math.random() * 0.5 + 0.1;
    const dx = (Math.random() - 0.5) * 0.2;
    const dy = (Math.random() - 0.5) * 0.2;
    return { x, y, dx, dy, size, alpha };
  }, []);

  const drawParticles = useCallback(() => {
    circles.current = [];
    for (let i = 0; i < quantity; i++) {
      circles.current.push(circleParams());
    }
  }, [quantity, circleParams]);

  const resizeCanvas = useCallback(() => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  }, [dpr]);

  const initCanvas = useCallback(() => {
    resizeCanvas();
    drawParticles();
  }, [resizeCanvas, drawParticles]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();

    const animate = () => {
      if (!context.current) return;
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);

      circles.current.forEach((circle) => {
        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x < 0) circle.x = canvasSize.current.w;
        if (circle.x > canvasSize.current.w) circle.x = 0;
        if (circle.y < 0) circle.y = canvasSize.current.h;
        if (circle.y > canvasSize.current.h) circle.y = 0;

        context.current!.beginPath();
        context.current!.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
        context.current!.fillStyle = `rgba(223, 80, 51, ${circle.alpha})`;
        context.current!.fill();
      });

      animFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [initCanvas]);

  return (
    <div
      ref={canvasContainerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
