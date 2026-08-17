"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const PRESET_EMOJIS = ["👍", "❤️", "🔥", "😂", "🎮", "💡", "⚡", "🚀", "👑", "🛡️"];

interface ReactionPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
  className?: string;
}

export function ReactionPicker({ onSelectEmoji, onClose, className }: ReactionPickerProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className={cn(
        "absolute z-50 bg-[#0B132B] border border-blue-500/30 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-100",
        className
      )}
    >
      {PRESET_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelectEmoji(emoji);
            onClose();
          }}
          className="size-8 rounded-xl hover:bg-blue-600/30 hover:scale-125 text-base flex items-center justify-center transition-all"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
