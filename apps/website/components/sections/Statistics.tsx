"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Trophy, Users, Globe, Flame, Award } from "lucide-react";
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
  <Users key="0" className="size-5 text-dragon-400" />,
  <Flame key="1" className="size-5 text-ember-500" />,
  <Globe key="2" className="size-5 text-neon-blue" />,
  <Award key="3" className="size-5 text-gold-400" />,
];

export default function Statistics() {
  return (
    <section
      id="statistics"
      aria-labelledby="statistics-heading"
      className="relative py-28 lg:py-36 overflow-hidden bg-[#030304]"
    >
      {/* Background accent */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-dragon-600/8 blur-[180px]" 
      />

      <div className="container-site relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <p className="cinematic-eyebrow">Studio Impact</p>

          <h2
            id="statistics-heading"
            className="mt-6 text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-foreground"
          >
            By The <span className="text-gradient">Numbers</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-lg">
            The metrics behind our mission to build the most ambitious interactive worlds in gaming.
          </p>
        </div>

        {/* Counter Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl glass-md p-8 border border-white/[0.06] transition-all duration-500 hover:border-white/15 magnetic-card"
            >
              {/* Icon */}
              <div className="flex items-center justify-between mb-8">
                <div className="rounded-xl bg-white/[0.04] p-3 border border-white/[0.06]">
                  {iconMap[idx]}
                </div>
              </div>

              {/* Number */}
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white group-hover:text-dragon-200 transition-colors duration-300">
                <CounterNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>

              {/* Label */}
              <h3 className="mt-4 text-sm font-bold text-white/90">
                {stat.label}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {stat.sublabel}
              </p>

              {/* Progress bar */}
              <div className="mt-8 h-px w-full bg-white/[0.04] overflow-hidden">
                <div className={`h-full w-1/2 bg-gradient-to-r ${stat.accent} transition-all duration-700 group-hover:w-full`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
