"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Gamepad2, Download, Users, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/cn";
import { soundFx } from "@/lib/sound-effects";

export function MobileBottomNav() {
  const pathname = usePathname();
  const sessionState = useSession();
  const isAuth = !!sessionState?.data?.user;

  const profileHref = isAuth ? "/dashboard" : "/profile";
  const ProfileIcon = isAuth ? LayoutDashboard : User;

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Games", href: "/games", icon: Gamepad2 },
    { label: "Downloads", href: "/downloads", icon: Download },
    { label: "Community", href: "/community", icon: Users },
    { label: isAuth ? "Portal" : "Profile", href: profileHref, icon: ProfileIcon },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden pointer-events-auto select-none"
    >
      {/* Background Glass Surface with Ambient Cyan Rim */}
      <div className="relative bg-[#020512]/95 backdrop-blur-2xl border-t border-cyan-500/25 shadow-[0_-8px_32px_rgba(0,0,0,0.85)] pb-[max(env(safe-area-inset-bottom,12px),12px)] pt-2 px-2">
        {/* Top Accent Neon Glow Line */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 via-blue-500/40 to-transparent"
        />

        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  try {
                    soundFx?.playClick();
                  } catch {}
                }}
                className={cn(
                  "relative flex flex-col items-center justify-center min-w-[56px] min-h-[52px] px-2 py-1 rounded-2xl transition-all duration-200 active:scale-95 group",
                  isActive
                    ? "text-cyan-300"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {/* Active Neon Capsule Glow */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_16px_rgba(0,229,255,0.25)]"
                  />
                )}

                {/* Icon Container with Micro Badge */}
                <div className="relative z-10 flex items-center justify-center">
                  <Icon
                    className={cn(
                      "size-5 transition-transform duration-200",
                      isActive ? "scale-110 text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF]" />
                  )}
                </div>

                {/* Typography Label */}
                <span
                  className={cn(
                    "relative z-10 text-[10px] font-heading font-black tracking-wider uppercase mt-1",
                    isActive ? "text-cyan-300 font-bold" : "text-slate-400"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
