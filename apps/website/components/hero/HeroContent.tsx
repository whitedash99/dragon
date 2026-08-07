"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { heroContent } from "@/lib/hero";
import { staggerContainer, heroWord, fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Zap, Play, ArrowUpRight } from "lucide-react";

interface CmsHeroData {
  eyebrow: string;
  announcement: string;
  title: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
}

export function HeroContent() {
  const [cmsData, setCmsData] = useState<CmsHeroData>({
    eyebrow: "ENTER THE REALM",
    announcement: "The first game to be released by us is Parking Nightmare! Coming Soon!",
    title: "ENTER THE REALM",
    subheadline: "Where Myths Unleash Next-Gen Worlds.",
    primaryCta: "EXPLORE UPCOMING GAMES",
    secondaryCta: "EXPLORE CURRENT GAMES",
    tertiaryCta: "JOIN THE STUDIO",
  });

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blocks)) {
          const map: Record<string, string> = {};
          data.blocks.forEach((b: any) => { map[b.key] = b.content; });
          setCmsData((prev) => ({
            eyebrow: map["hero.eyebrow"] || prev.eyebrow,
            announcement: map["hero.announcement"] || prev.announcement,
            title: map["hero.title"] || prev.title,
            subheadline: map["hero.subheadline"] || prev.subheadline,
            primaryCta: map["hero.cta_primary"] || prev.primaryCta,
            secondaryCta: map["hero.cta_secondary"] || prev.secondaryCta,
            tertiaryCta: map["hero.cta_tertiary"] || prev.tertiaryCta,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const words = cmsData.title.split(" ");

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center text-center max-w-5xl mx-auto py-6"
    >
      {/* ═══ 1. AAA Large Cinematic Heading ═══ */}
      <h1 
        id="hero-heading" 
        className="font-heading text-5xl font-black uppercase leading-[0.88] tracking-[0.02em] text-white sm:text-7xl md:text-8xl lg:text-[7rem] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
      >
        {words.map((word, i) => {
          const isAccent = word.toUpperCase() === "REALM" || word.toUpperCase() === "VALYRIA";
          return (
            <span key={i} className="inline-block mr-4">
              {isAccent ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-400 to-orange-500 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)]">
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
          );
        })}
      </h1>

      {/* ═══ 2. Subheadline ═══ */}
      <motion.p
        variants={fadeUp}
        className="mt-6 text-sm font-semibold tracking-wide text-white/70 sm:text-lg max-w-2xl leading-relaxed font-sans"
      >
        {cmsData.subheadline}
      </motion.p>

      {/* ═══ 3. AAA Live Transmission Ribbon ═══ */}
      <motion.div
        variants={fadeUp}
        className="mt-8 relative flex items-center gap-3 rounded-lg border-l-4 border-gold-400 bg-[#0c121e]/90 px-6 py-3.5 shadow-2xl border border-white/10 max-w-3xl w-full justify-start text-left backdrop-blur-md"
      >
        <Zap className="size-4 text-gold-400 shrink-0 fill-current animate-pulse" />
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="font-black uppercase tracking-wider text-white">
            LIVE TRANSMISSION:
          </span>
          <span className="text-white/80 font-medium">
            {cmsData.announcement}
          </span>
        </div>
      </motion.div>

      {/* ═══ 4. AAA Square Action Buttons ═══ */}
      <motion.div
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full"
      >
        {/* Button 1: Outline with Red Glow */}
        <Button variant="glowOutline" size="lg" className="rounded-lg px-8 py-3.5" asChild>
          <Link href="/games">
            <span>{cmsData.primaryCta}</span>
          </Link>
        </Button>

        {/* Button 2: Vibrant Solid Crimson */}
        <Button variant="solidRed" size="lg" className="rounded-lg px-8 py-3.5" asChild>
          <Link href="/games">
            <span>{cmsData.secondaryCta}</span>
          </Link>
        </Button>
      </motion.div>

      {/* Button 3: Dark Square Outline */}
      <motion.div variants={fadeUp} className="mt-4">
        <Button variant="outline" size="default" className="rounded-lg px-10 border-white/30 hover:border-white text-xs tracking-[0.16em]" asChild>
          <Link href="/careers">
            <span>{cmsData.tertiaryCta}</span>
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
