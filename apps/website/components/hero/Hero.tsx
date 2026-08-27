"use client";

import React from "react";
import { HeroContent } from "./HeroContent";
import { MobileHero } from "@/components/mobile/MobileHero";
import { HeroParallaxContainer, HeroParallaxLayer } from "./HeroParallaxLayer";

export function Hero() {
  return (
    <section 
      id="hero"
      aria-label="Hero Section"
      className="relative flex items-center justify-center pt-24 pb-6 sm:pt-28 sm:pb-8"
    >
      <HeroParallaxContainer>
        <div className="container-site relative z-10 w-full px-3 sm:px-6">
          <HeroParallaxLayer depth={0.03}>
            {/* ═══ MOBILE & TABLET HERO (< 1024px) ═══ */}
            <div className="block lg:hidden w-full">
              <MobileHero />
            </div>

            {/* ═══ DESKTOP HERO (>= 1024px — 100% LOCKED & PROTECTED) ═══ */}
            <div className="hidden lg:block w-full">
              <HeroContent />
            </div>
          </HeroParallaxLayer>
        </div>
      </HeroParallaxContainer>

      {/* Subtle Bottom Ambient Transition Line */}
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 via-blue-500/20 to-transparent" 
      />
    </section>
  );
}
