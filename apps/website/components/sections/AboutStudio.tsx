"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Shield, Compass } from "lucide-react";
import { studioStory } from "@/data/content";
import { Button } from "@/components/ui/button";

export default function AboutStudio() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-story-heading"
      className="relative py-28 lg:py-40 overflow-hidden bg-[#040405]"
    >
      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-dragon-500/8 blur-[200px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-10 bottom-10 h-[400px] w-[400px] rounded-full bg-neon-cyan/6 blur-[160px]"
      />

      <div className="container-site relative z-10">
        {/* Top Content */}
        <div className="max-w-4xl">
          <p className="cinematic-eyebrow">The Studio</p>

          <h2
            id="studio-story-heading"
            className="mt-8 text-5xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl leading-[0.88]"
          >
            Not Content. <br />
            <span className="text-gradient">A Collision</span> Of Feelings.
          </h2>

          <p className="mt-10 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {studioStory.lead}
          </p>
        </div>

        {/* Mission Statement Banner */}
        <div className="mt-16 rounded-2xl glass-lg p-8 sm:p-12 border border-white/[0.06] relative overflow-hidden">
          <div 
            aria-hidden="true" 
            className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-dragon-500/15 blur-[80px]" 
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-400 font-mono">
                Studio Mission
              </span>
              <p className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                &quot;{studioStory.mission}&quot;
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Button variant="glow" size="lg" className="rounded-full gap-2 group" asChild>
                <Link href="/studio">
                  <span>About Dragon Studios</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Core Philosophy Grid */}
        <div className="mt-24">
          <p className="cinematic-eyebrow">Our Approach</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {studioStory.philosophy.map((item, idx) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative rounded-xl border border-white/[0.06] p-8 transition-all duration-500 hover:border-dragon-500/30 magnetic-card bg-gradient-to-br from-white/[0.03] to-transparent"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-white/[0.08] group-hover:text-dragon-400/40 transition-colors duration-500">
                    {item.number}
                  </span>
                  {idx === 0 && <Flame className="size-5 text-dragon-400" />}
                  {idx === 1 && <Compass className="size-5 text-neon-cyan" />}
                  {idx === 2 && <Shield className="size-5 text-neon-purple" />}
                </div>

                <h4 className="mt-6 text-xl font-bold text-white group-hover:text-dragon-200 transition-colors">
                  {item.title}
                </h4>

                <span className="mt-1 inline-block text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  {item.subtitle}
                </span>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Studio Timeline */}
        <div className="mt-28 pt-16 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <p className="cinematic-eyebrow">Timeline</p>
              <h3 className="mt-4 text-3xl font-black uppercase text-foreground">
                Our Evolution
              </h3>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              From an independent engineering team to a global AAA studio collective.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {studioStory.timeline.map((item) => (
              <div
                key={item.year}
                className="relative rounded-xl border border-white/[0.04] p-6 hover:border-white/10 transition-all duration-300 bg-white/[0.015]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-black text-dragon-400">
                    {item.year}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
