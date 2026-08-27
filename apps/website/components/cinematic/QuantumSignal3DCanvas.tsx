"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export function QuantumSignal3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { tier, prefersReducedMotion } = useDeviceTier();

  useEffect(() => {
    if (prefersReducedMotion || tier === "E_LOW_POWER") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let isTabActive = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let rotationAngle = 0;
    let sweepAngle = 0;

    // ═══ FLOATING ENCRYPTED DATA PACKETS ═══
    interface DataPacket {
      distance: number;
      speed: number;
      angle: number;
      size: number;
      color: string;
    }

    const packets: DataPacket[] = [];
    const isMobile = width < 768;
    const packetCount = isMobile ? 12 : 24;

    for (let i = 0; i < packetCount; i++) {
      packets.push({
        distance: 100 + Math.random() * 380,
        speed: (Math.random() - 0.5) * 0.045,
        angle: Math.random() * Math.PI * 2,
        size: 2.5 + Math.random() * 3.5,
        color: i % 3 === 0 ? "#00F0FF" : i % 3 === 1 ? "#00FF88" : "#9D00FF",
      });
    }

    const render = () => {
      if (!isVisible || !isTabActive) return;

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const centerX = width / 2 + mouseX * 45;
      const centerY = height * 0.4 + mouseY * 35;

      rotationAngle += 0.01;
      sweepAngle += 0.045;

      // ── LAYER 1: CONCENTRIC 3D RADAR RINGS ──
      ctx.save();
      ctx.translate(centerX, centerY);

      const ringCount = 5;
      for (let r = 1; r <= ringCount; r++) {
        const radius = r * 85;
        ctx.strokeStyle = "rgba(0, 240, 255, 0.16)";
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 0.45, rotationAngle * (r % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
        ctx.stroke();
      }

      // RADAR SWEEP LINE
      const sweepX = Math.cos(sweepAngle) * 440;
      const sweepY = Math.sin(sweepAngle) * 195;

      ctx.strokeStyle = "rgba(0, 240, 255, 0.55)";
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // ── LAYER 2: ORBITING ENCRYPTED PACKETS ──
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        p.angle += p.speed;

        const px = Math.cos(p.angle) * p.distance;
        const py = Math.sin(p.angle) * (p.distance * 0.45);

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // CENTER SIGNAL CORE
      ctx.fillStyle = "#00F0FF";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    // ═══ LIFECYCLE & VISIBILITY OPTIMIZATIONS ═══
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && isTabActive) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      }
    }, { threshold: 0.05 });

    observer.observe(canvas);

    const handleVisibility = () => {
      isTabActive = document.visibilityState === "visible";
      if (isTabActive && isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tier, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none w-full h-full z-0"
    />
  );
}

