"use client";

import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { soundFx } from "@/lib/sound-effects";

export interface MediaLightboxModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onSelectIndex: (idx: number) => void;
}

export function MediaLightboxModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onSelectIndex,
}: MediaLightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        soundFx.playClick();
        onSelectIndex((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        soundFx.playClick();
        onSelectIndex((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onSelectIndex]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200">
      
      {/* Top Controls Bar */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20 pointer-events-none">
        <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300 font-mono text-xs font-bold uppercase backdrop-blur-md">
          {currentIndex + 1} / {images.length}
        </span>

        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer pointer-events-auto border border-white/15"
          title="Close Lightbox (Esc)"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Main High-Res Image Showcase */}
      <div className="relative max-w-6xl max-h-[80vh] w-full flex items-center justify-center">
        <img
          src={currentImage}
          alt="Dragon Studios Cinematic Media"
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/15"
        />
      </div>

      {/* Prev / Next Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectIndex((currentIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-black/60 hover:bg-cyan-500/20 text-white border border-white/15 hover:border-cyan-400/40 transition-all cursor-pointer shadow-2xl backdrop-blur-md"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="size-6 text-cyan-400" />
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onSelectIndex((currentIndex + 1) % images.length);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-black/60 hover:bg-cyan-500/20 text-white border border-white/15 hover:border-cyan-400/40 transition-all cursor-pointer shadow-2xl backdrop-blur-md"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="size-6 text-cyan-400" />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-center gap-2 overflow-x-auto py-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundFx.playClick();
                onSelectIndex(idx);
              }}
              className={cn(
                "relative size-14 sm:size-16 rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer",
                currentIndex === idx
                  ? "border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.6)] scale-105"
                  : "border-white/20 opacity-60 hover:opacity-100"
              )}
            >
              <img src={img} alt="Thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
