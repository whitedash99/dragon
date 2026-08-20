"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Gamepad2, Layers, Cpu, Activity } from "lucide-react";
import { statistics } from "@/data/content";

function CounterNumber({ value, suffix, prefix = "" }: { value: number; suffix: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const displayValue = useTransform(spring, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  useEffect(() => {
    const unsubscribe = displayValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [displayValue, prefix, suffix]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}

const iconMap = [
  <Gamepad2 key="0" className="size-4 sm:size-5 text-cyan-400" />,
  <Layers key="1" className="size-4 sm:size-5 text-blue-400" />,
  <Cpu key="2" className="size-4 sm:size-5 text-sky-400" />,
  <Activity key="3" className="size-4 sm:size-5 text-emerald-400" />,
];

export default function Statistics() {
  return (
    <section
      id="statistics"
      aria-labelledby="statistics-heading"
      className="relative py-14 sm:py-24 lg:py-36 overflow-hidden bg-[#030713]"
    >
      {/* Background accent */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] sm:h-[500px] w-[600px] sm:w-[900px] rounded-full bg-cyan-600/10 blur-[180px]" 
      />

      <div className="container-site relative z-10 px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">STUDIO TELEMETRY</p>

          <h2
            id="statistics-heading"
            className="mt-3 sm:mt-6 text-3xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-white"
          >
            ENGINE & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">SPECS</span>
          </h2>
          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-slate-400 max-w-lg">
            Real performance benchmarks behind our mission to build high-performance 3D & 2D games.
          </p>
        </div>

        {/* Counter Cards (2x2 Mobile Grid) */}
        <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl bg-[#060D22]/80 p-4 sm:p-8 border border-blue-500/20 backdrop-blur-md transition-all duration-500 hover:border-cyan-400/40 shadow-xl"
            >
              {/* Icon */}
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="rounded-xl bg-blue-600/15 p-2 sm:p-3 border border-blue-500/30">
                  {iconMap[idx]}
                </div>
              </div>

              {/* Number */}
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors duration-300">
                <CounterNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>

              {/* Label */}
              <h3 className="mt-2 sm:mt-4 text-xs sm:text-sm font-bold text-white/90 truncate">
                {stat.label}
              </h3>
              <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2">
                {stat.sublabel}
              </p>

              {/* Progress bar */}
              <div className="mt-4 sm:mt-8 h-px w-full bg-white/10 overflow-hidden">
                <div className={`h-full w-1/2 bg-gradient-to-r ${stat.accent} transition-all duration-700 group-hover:w-full`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
