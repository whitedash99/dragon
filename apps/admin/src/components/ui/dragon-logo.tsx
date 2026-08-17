"use client";

import React from "react";

export function DragonLogoIcon({
  className = "size-9",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-[#06122c] to-[#040814] border border-cyan-400/40 p-1 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 ${className}`}
    >
      <svg
        viewBox="0 0 128 128"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(0,240,255,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="adminDLGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="adminDLGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="adminDLGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        <g transform="translate(6, 6) scale(0.9)">
          <path
            d="M 64 22 L 84 34 L 110 24 L 94 48 L 116 52 L 88 66 L 78 56 L 64 62 Z"
            fill="url(#adminDLGradLight)"
          />
          <path d="M 48 34 L 64 22 L 66 42 L 52 46 Z" fill="url(#adminDLGradPrimary)" />
          <path d="M 34 46 L 48 36 L 50 54 L 36 58 Z" fill="url(#adminDLGradLight)" />
          <path d="M 24 60 L 36 48 L 38 66 L 26 70 Z" fill="url(#adminDLGradPrimary)" />
          <path
            d="M 54 50 L 78 52 L 88 68 L 74 76 L 52 68 Z"
            fill="url(#adminDLGradPrimary)"
            stroke="#00f0ff"
            strokeWidth="1.5"
          />
          <path
            d="M 54 62 L 74 72 L 64 84 L 28 84 L 20 74 L 42 68 Z"
            fill="url(#adminDLGradLight)"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <polygon points="26,82 32,94 38,83" fill="#ffffff" />
          <polygon points="40,83 45,92 50,83" fill="#ffffff" />
          <path
            d="M 32 94 L 62 92 L 74 102 L 60 114 L 42 108 L 28 98 Z"
            fill="url(#adminDLGradPrimary)"
            stroke="#00f0ff"
            strokeWidth="1.5"
          />
          <polygon points="30,96 34,88 38,95" fill="#ffffff" />
          <path
            d="M 62 94 L 88 84 L 98 100 L 78 116 L 60 114 Z"
            fill="url(#adminDLGradDark)"
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <path
            d="M 74 102 L 98 100 L 106 116 L 86 126 L 68 122 Z"
            fill="url(#adminDLGradLight)"
            stroke="#00f0ff"
            strokeWidth="1.5"
          />
          <polygon points="56,66 68,68 64,74 54,70" fill="#00f0ff" />
          <polygon points="59,67 63,68 62,73 58,72" fill="#ffffff" />
          <path d="M 68 68 L 84 62 L 78 67 Z" fill="#00f0ff" />
          <path
            d="M 54 50 L 74 72 L 62 94 L 42 108"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
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
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <DragonLogoIcon />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-heading text-lg font-black tracking-[0.06em] text-white uppercase">
            DRAGON<span className="text-blue-500">OS</span>
          </span>
          <span className="text-[9px] font-mono tracking-[0.24em] text-cyan-400 uppercase mt-0.5">
            Enterprise Admin
          </span>
        </div>
      )}
    </div>
  );
}
