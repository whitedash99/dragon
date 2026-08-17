"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquareCode, 
  MessagesSquare, 
  Trophy, 
  Users2, 
  ShieldCheck, 
  Plus 
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export function CommunityNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Real-Time Chat", href: "/community", icon: MessageSquareCode, badge: "LIVE" },
    { label: "Forums & Threads", href: "/community/forums", icon: MessagesSquare },
    { label: "Events & Tournaments", href: "/community/events", icon: Trophy },
    { label: "Member Roster", href: "/community/members", icon: Users2 },
    { label: "Rules & Safety", href: "/community/rules", icon: ShieldCheck },
  ];

  return (
    <div className="container-site mb-6">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 rounded-2xl bg-[#07111F]/90 border border-blue-500/30 backdrop-blur-xl shadow-xl shadow-black/40 overflow-x-auto custom-scrollbar">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-400 hover:text-white hover:bg-blue-950/40"
                )}
              >
                <item.icon className={cn("size-3.5", isActive ? "text-white" : "text-cyan-400")} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[9px] font-mono px-1.5 py-0.2 rounded-md font-bold uppercase",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="glow" size="sm" className="rounded-full gap-1.5 text-xs font-bold" asChild>
            <Link href="/community/forums">
              <Plus className="size-3.5" />
              <span>New Discussion</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
