"use client";

import React from "react";
import { HeroContent } from "./HeroContent";
import { HeroBackground } from "./HeroBackground";

export function Hero() {
  return (
    <section 
      id="hero"
      aria-label="Hero Section"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#01030A] pt-28 pb-16"
    >
      <HeroBackground />
      <div className="container-site relative z-10 w-full">
        <HeroContent />
      </div>

      {/* Electric Cyan bottom accent line */}
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_20px_#00f0ff]" 
      />
    </section>
  );
}
