"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, LayoutDashboard, Download, User, Settings, Trophy, Bookmark } from "lucide-react";
import { cn } from "@/lib/cn";
import { NotificationCenter } from "./NotificationCenter";

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Downloads", href: "/downloads", icon: Download },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="sticky top-16 z-40 border-y border-white/8 bg-black/30 backdrop-blur-xl lg:top-[5.25rem]">
      <div className="container-site flex h-16 items-center justify-between gap-4 overflow-x-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-white shadow-[0_8px_22px_-8px] shadow-dragon-500/80"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="size-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { ctrlKey: true, key: "k" });
              window.dispatchEvent(event);
            }}
            className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold-400/30 hover:text-white"
          >
            <Command className="size-3.5 text-dragon-400" />
            <span>Search</span>
            <kbd className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-mono text-white/70 border border-white/10">
              ⌘K
            </kbd>
          </button>

          <NotificationCenter />
        </div>
      </div>
    </div>
  );
}
