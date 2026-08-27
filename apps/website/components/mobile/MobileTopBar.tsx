"use client";

import React from "react";
import Link from "next/link";
import { Menu, Sparkles, User, ShieldCheck } from "lucide-react";
import { DragonLogo } from "@/components/ui/dragon-logo";
import { useSession } from "next-auth/react";
import { soundFx } from "@/lib/sound-effects";

interface MobileTopBarProps {
  onOpenDrawer: () => void;
}

export function MobileTopBar({ onOpenDrawer }: MobileTopBarProps) {
  const sessionState = useSession();
  const session = sessionState?.data;
  const isAuth = !!session?.user;
  const user = session?.user;

  return (
    <header
      aria-label="Mobile Top App Bar"
      className="fixed top-0 inset-x-0 z-40 lg:hidden pointer-events-auto select-none"
    >
      <div className="relative bg-[#020512]/92 backdrop-blur-2xl border-b border-cyan-500/25 shadow-[0_4px_25px_rgba(0,0,0,0.85)] pt-[max(env(safe-area-inset-top,8px),8px)] pb-2.5 px-3">
        {/* Bottom Ambient Cyan Glow Accent */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 via-blue-500/30 to-transparent"
        />

        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Left: Brand Logo & Title */}
          <Link
            href="/"
            onClick={() => {
              try {
                soundFx?.playClick();
              } catch {}
            }}
            className="flex items-center gap-2 group active:scale-95 transition-transform"
          >
            <DragonLogo textVariant="gaming" size="sm" showIcon={true} />
          </Link>

          {/* Center: Live Server Pulse Status */}
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#050D24]/80 border border-cyan-500/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
            </span>
            <span className="text-[9px] font-mono font-bold text-cyan-300 tracking-wider uppercase">
              DRAGON LIVE
            </span>
          </div>

          {/* Right: Quick Actions + Drawer Hamburger Trigger */}
          <div className="flex items-center gap-2">
            {isAuth && user ? (
              <Link
                href="/dashboard"
                onClick={() => {
                  try {
                    soundFx?.playClick();
                  } catch {}
                }}
                className="flex items-center gap-1.5 p-1 pr-2 rounded-xl bg-[#050D24] border border-purple-500/40 text-white text-[11px] font-bold active:scale-95 transition-transform shadow-md"
              >
                <div className="size-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-[10px] font-heading font-black">
                  {((user?.name || user?.email || "U")[0] || "U").toUpperCase()}
                </div>
                <span className="max-w-[70px] truncate font-mono text-[10px] text-purple-300">
                  {user.name?.split(" ")[0] || "Player"}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => {
                  try {
                    soundFx?.playClick();
                  } catch {}
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-heading font-black text-[11px] tracking-wider uppercase active:scale-95 transition-transform"
              >
                <User className="size-3 text-cyan-400" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Menu Drawer Button (52px Touch Target) */}
            <button
              type="button"
              onClick={() => {
                try {
                  soundFx?.playClick();
                } catch {}
                onOpenDrawer();
              }}
              className="flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl bg-[#050D24] border border-cyan-500/35 text-slate-200 hover:text-white hover:border-cyan-400 active:scale-95 transition-all shadow-md cursor-pointer"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="size-5 text-cyan-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
