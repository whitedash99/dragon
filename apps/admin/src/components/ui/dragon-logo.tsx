"use client";

import React from "react";

export function DragonLogoIcon({
  className = "size-10",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-b from-[#0a1838] via-[#050e24] to-[#02050f] border border-cyan-400/50 p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] group-hover:scale-105 overflow-hidden ${className}`}
    >
      <img
        src="/images/dragon-logo.jpg"
        alt="Dragon Gaming Studio Logo"
        className="w-full h-full object-cover rounded-xl relative z-10"
      />
    </div>
  );
}

export function DragonLogo({
  showText = true,
  className = "",
}: {
  showText?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3.5 group shrink-0 select-none ${className}`}>
      <DragonLogoIcon />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-heading text-lg font-black tracking-[0.08em] text-white uppercase flex items-center gap-1.5">
            DRAGON
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#2563eb] font-black">
              CONTROL
            </span>
          </span>
          <span className="text-[9px] font-mono font-bold tracking-[0.24em] text-cyan-400/90 uppercase mt-0.5">
            EXECUTIVE OS
          </span>
        </div>
      )}
    </div>
  );
}

export default DragonLogo;
