"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { Menu, X, Volume2, VolumeX, MousePointer, Moon, Sun } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useAudio } from "@/providers/audio-provider";

export function Navbar() {
  const pathname = usePathname();
  const sessionState = useSession();
  const session = sessionState?.data;
  const status = sessionState?.status;
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

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "GAMES", href: "/games" },
    { label: "DOWNLOADS", href: "/downloads" },
    { label: "STUDIO", href: "/studio" },
    { label: "CAREERS", href: "/careers" },
    { label: "COMMUNITY", href: "/community" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out border-b border-blue-500/30",
        isScrolled
          ? "bg-[#040812]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
          : "bg-[#040812]/70 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1540px] items-center justify-between px-5 sm:px-6 lg:h-20 lg:px-8">
        {/* ═══ Left: Logo ═══ */}
        <Link href="/" className="flex items-center gap-3 group shrink-0" onMouseEnter={playHover}>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-[0_0_12px_rgba(59,130,246,0.5)]">
              🐉
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-xl font-black tracking-[0.06em] text-white uppercase sm:text-2xl">
                DRAGON<span className="text-blue-500">GAMING</span>
              </span>
            </div>
          </div>
        </Link>

        {/* ═══ Center: Navigation ═══ */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-black uppercase tracking-[0.18em] font-heading">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={playHover}
                className={cn(
                  "transition-colors py-2 relative",
                  isActive ? "text-cyan-400 font-extrabold" : "text-slate-300 hover:text-cyan-300"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_#38bdf8]" />
                )}
              </Link>
            );
          })}
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
                ? "bg-slate-900/60 text-slate-500 border-slate-800 hover:bg-slate-800"
                : "bg-blue-600/15 text-cyan-400 border-blue-500/30 hover:bg-blue-600/25 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
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
                ? "bg-slate-900/60 text-slate-500 border-slate-800 hover:bg-slate-800"
                : "bg-blue-600/15 text-cyan-400 border-blue-500/30 hover:bg-blue-600/25 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
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
                ? "bg-blue-500/20 text-cyan-300 border-blue-500/40"
                : "bg-slate-900/60 text-slate-500 border-slate-800 hover:bg-slate-800"
            )}
            aria-label="Toggle Reduced Motion"
            title={reducedMotion ? "Motion: Reduced" : "Motion: Full"}
          >
            <Moon className="size-3.5" />
          </button>

          {/* Sign In & Google Auth */}
          <div className="hidden items-center gap-2 lg:flex">
            {status === "authenticated" && session?.user ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0a1124] border border-blue-500/30 hover:border-cyan-400/60 transition-all text-xs font-semibold text-white shadow-md shadow-blue-900/20"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="w-6 h-6 rounded-full object-cover border border-blue-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{session.user.name || session.user.email?.split("@")[0]}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B132B]/95 border border-blue-500/30 rounded-xl shadow-2xl backdrop-blur-2xl p-1.5 hidden group-hover:block z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800 text-slate-400 font-mono text-[10px] truncate">
                    {session.user.email}
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-950/50 transition-colors font-medium">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-950/50 transition-colors font-medium">
                    My Profile
                  </Link>
                  <Link href="/track-ticket" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-950/50 transition-colors font-medium">
                    Support Tickets
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors font-semibold border-t border-slate-800 mt-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#0B132B] hover:bg-blue-950/60 text-slate-200 border border-blue-500/30 hover:border-cyan-400 font-bold text-xs rounded-xl shadow-md transition-all group"
                  title="Sign in with Google"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="hidden xl:inline text-[11px] font-mono">Google</span>
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs px-3.5 border-blue-500/40 text-cyan-300 hover:bg-blue-600/20 hover:text-white"
                  asChild
                >
                  <Link href="/login" onMouseEnter={playHover} onClick={playClick}>SIGN IN</Link>
                </Button>

                <Button
                  variant="glow"
                  size="sm"
                  className="rounded-xl text-xs px-3.5 hidden xl:flex font-bold"
                  asChild
                >
                  <Link href="/register" onMouseEnter={playHover} onClick={playClick}>JOIN NOW</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden relative h-9 w-9 text-slate-300 hover:text-white"
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
