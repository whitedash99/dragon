"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  MessageSquare, 
  Star, 
  Trophy, 
  Sparkles, 
  HelpCircle, 
  Plus, 
  Search 
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export function CommunityNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Hub Overview", href: "/community", icon: Users },
    { label: "Forums & Discussions", href: "/community/forums", icon: MessageSquare },
    { label: "Verified Reviews", href: "/community/reviews", icon: Star },
    { label: "Events & Tournaments", href: "/community/events", icon: Trophy },
    { label: "Creator Program", href: "/community/creators", icon: Sparkles },
    { label: "Knowledge Base", href: "/community/knowledge", icon: HelpCircle },
  ];

  return (
    <div className="border-b border-white/10 glass-md sticky top-16 lg:top-20 z-40">
      <div className="container-site flex h-14 items-center justify-between gap-4 overflow-x-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="size-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Button variant="glow" size="sm" className="rounded-full gap-1.5 text-xs" asChild>
            <Link href="/community/forums">
              <Plus className="size-3.5" />
              <span>Start Discussion</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
