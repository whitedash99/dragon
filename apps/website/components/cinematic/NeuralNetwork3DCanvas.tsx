"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export function NeuralNetwork3DCanvas() {
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

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ═══ NEURAL MESH NODES ═══
    interface NetworkNode {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      color: string;
      pulsePhase: number;
    }

    const nodes: NetworkNode[] = [];
    const isMobile = width < 768;
    const nodeCount = isMobile ? 24 : 48;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 + 50,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        vz: (Math.random() - 0.5) * 0.8,
        radius: 2.5 + Math.random() * 2.5,
        color: i % 4 === 0 ? "#00F0FF" : i % 4 === 1 ? "#9D00FF" : i % 4 === 2 ? "#0066FF" : "#FF007F",
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Light Pulses Traveling on Wire
    interface SignalPulse {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
      active: boolean;
    }

    const maxPulses = 15;
    const pulses: SignalPulse[] = [];
    for (let i = 0; i < maxPulses; i++) {
      pulses.push({ fromIdx: 0, toIdx: 1, progress: 0, speed: 0.04, active: false });
    }

    const render = () => {
      if (!isVisible || !isTabActive) return;

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Update Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;
        node.pulsePhase += 0.05;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        if (node.z < 50 || node.z > 450) node.vz *= -1;

        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const distToMouseSq = dx * dx + dy * dy;
        if (distToMouseSq < 48400) { // 220px squared
          node.x += dx * 0.025;
          node.y += dy * 0.025;
        }
      }

      // Draw Connection Lines between Nearby Nodes
      const maxDist = isMobile ? 120 : 170;
      const maxDistSq = maxDist * maxDist;

      ctx.lineWidth = 1.2;

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.4;
            ctx.strokeStyle = n1.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Reuse idle pulse
            if (Math.random() < 0.003) {
              const idlePulse = pulses.find((p) => !p.active);
              if (idlePulse) {
                idlePulse.fromIdx = i;
                idlePulse.toIdx = j;
                idlePulse.progress = 0;
                idlePulse.speed = 0.035 + Math.random() * 0.04;
                idlePulse.active = true;
              }
            }
          }
        }
      }

      // Render Signal Pulses along lines
      ctx.fillStyle = "#00F0FF";
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        if (!pulse.active) continue;

        pulse.progress += pulse.speed;
        const from = nodes[pulse.fromIdx];
        const to = nodes[pulse.toIdx];

        if (pulse.progress >= 1 || !from || !to) {
          pulse.active = false;
          continue;
        }

        const px = from.x + (to.x - from.x) * pulse.progress;
        const py = from.y + (to.y - from.y) * pulse.progress;

        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Nodes with Halos
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulseSize = node.radius + Math.sin(node.pulsePhase) * 1.2;

        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
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

