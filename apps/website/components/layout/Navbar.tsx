"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { Menu, X, Volume2, VolumeX, MousePointer, Moon, Sun } from "lucide-react";
import { useAudio } from "@/providers/audio-provider";

export function Navbar() {
  const { isScrolled } = useScroll();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isMuted, toggleMute, playClick, playHover } = useAudio();

  // Interaction Toggles State
  const [cursorActive, setCursorActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      setCursorActive(localStorage.getItem("dragon_cursor_enabled") !== "false");
      setReducedMotion(document.documentElement.classList.contains("reduce-motion"));
    });
    return () => { isMounted = false; };
  }, []);

  const toggleCursor = () => {
    const next = !cursorActive;
    setCursorActive(next);
    localStorage.setItem("dragon_cursor_enabled", next ? "true" : "false");
    if (next) {
      document.documentElement.classList.add("dragon-cursor-active");
    } else {
      document.documentElement.classList.remove("dragon-cursor-active");
    }
  };

  const toggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    if (next) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  };

  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out border-b border-[#ff1e4b]/40",
        isScrolled
          ? "bg-black/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-black/60 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1540px] items-center justify-between px-5 sm:px-6 lg:h-20 lg:px-8">
        {/* ═══ Left: Logo ═══ */}
        <Link href="/" className="flex items-center gap-3 group shrink-0" onMouseEnter={playHover}>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-xl font-black tracking-[0.06em] text-white uppercase sm:text-2xl">
              DRAGON<span className="text-[#ff1e4b]">GAMING</span>
            </span>
          </div>
        </Link>

        {/* ═══ Center: Navigation ═══ */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-[0.18em] font-heading">
          <Link href="/" onMouseEnter={playHover} className="text-[#ff1e4b] hover:text-white transition-colors py-2">
            HOME
          </Link>
          <Link href="/games" onMouseEnter={playHover} className="text-white/80 hover:text-[#ff1e4b] transition-colors py-2">
            GAMES
          </Link>
          <Link href="/downloads" onMouseEnter={playHover} className="text-white/80 hover:text-[#ff1e4b] transition-colors py-2">
            DOWNLOADS
          </Link>
          <Link href="/studio" onMouseEnter={playHover} className="text-white/80 hover:text-[#ff1e4b] transition-colors py-2">
            STUDIO
          </Link>
          <Link href="/community" onMouseEnter={playHover} className="text-white/80 hover:text-[#ff1e4b] transition-colors py-2">
            COMMUNITY
          </Link>
          <Link href="/contact" onMouseEnter={playHover} className="text-white/80 hover:text-[#ff1e4b] transition-colors py-2">
            CONTACT
          </Link>
        </div>

        {/* ═══ Right: Quick Control Icon Buttons ═══ */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleMute();
              playClick();
            }}
            onMouseEnter={playHover}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 border",
              isMuted
                ? "bg-white/[0.03] text-white/40 border-white/10 hover:bg-white/10"
                : "bg-[#ff1e4b]/10 text-[#ff1e4b] border-[#ff1e4b]/30 hover:bg-[#ff1e4b]/20"
            )}
            aria-label={isMuted ? "Unmute audio effects" : "Mute audio effects"}
            title={isMuted ? "Audio: Muted" : "Audio: Enabled"}
          >
            {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
          </button>

          {/* Cursor Toggle */}
          <button
            onClick={() => {
              toggleCursor();
              playClick();
            }}
            onMouseEnter={playHover}
            className={cn(
              "hidden sm:flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 border",
              !cursorActive
                ? "bg-white/[0.03] text-white/40 border-white/10 hover:bg-white/10"
                : "bg-[#ff1e4b]/10 text-[#ff1e4b] border-[#ff1e4b]/30 hover:bg-[#ff1e4b]/20"
            )}
            aria-label="Toggle Custom Cursor"
            title={cursorActive ? "Custom Cursor: ON" : "Custom Cursor: OFF"}
          >
            <MousePointer className="size-3.5" />
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => {
              toggleReducedMotion();
              playClick();
            }}
            onMouseEnter={playHover}
            className={cn(
              "hidden sm:flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 border",
              reducedMotion
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-white/[0.03] text-white/40 border-white/10 hover:bg-white/10"
            )}
            aria-label="Toggle Reduced Motion"
            title={reducedMotion ? "Motion: Reduced" : "Motion: Full"}
          >
            <Moon className="size-3.5" />
          </button>

          {/* Sign In & Join */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs px-4"
              asChild
            >
              <Link href="/login" onMouseEnter={playHover} onClick={playClick}>SIGN IN</Link>
            </Button>
            <Button
              variant="solidRed"
              size="sm"
              className="rounded-lg text-xs px-4"
              asChild
            >
              <Link href="/register" onMouseEnter={playHover} onClick={playClick}>JOIN NOW</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden relative h-9 w-9"
            onClick={() => {
              setIsMobileOpen(!isMobileOpen);
              playClick();
            }}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <MobileMenu isOpen={isMobileOpen} onClose={handleCloseMobile} />
    </header>
  );
}
