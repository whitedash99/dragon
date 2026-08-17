"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Globe, 
  Sparkles, 
  LifeBuoy, 
  Users, 
  Key, 
  ShieldCheck, 
  Activity, 
  Settings, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Lock,
  Gamepad2,
  FolderKanban,
  BarChart3,
  Smartphone,
  CheckSquare,
  Plug,
  Globe2,
  Terminal as TerminalIcon,
  BookOpen,
  MessagesSquare,
  Cpu,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  isExternal?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
      { label: "Website Analytics", href: "/analytics", icon: BarChart3, badge: "REALTIME", badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
      { label: "Owner Data Control", href: "/data-control", icon: Lock, badge: "ROOT", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    ],
  },
  {
    title: "WORKSPACE",
    items: [
      { label: "Community Hub", href: "/community", icon: MessagesSquare, badge: "CHAT", badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
      { label: "Team Workforce", href: "/users", icon: Users },
      { label: "Recruitment Portal", href: "/team-key-portal", icon: Key, badge: "DIP", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
      { label: "Support Desk", href: "/crm", icon: LifeBuoy },
      { label: "Studio CMS", href: "/cms", icon: FolderKanban, badge: "LIVE", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
      { label: "AAA Games", href: "/games", icon: Gamepad2, badge: "3 TITLES", badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
    ],
  },
  {
    title: "SECURITY & AUDIT",
    items: [
      { label: "Security Posture", href: "/security", icon: ShieldCheck, badge: "98%", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
      { label: "Audit Center", href: "/audit", icon: Activity },
      { label: "Passkeys & MFA", href: "/security/mfa", icon: Fingerprint },
      { label: "Devices", href: "/devices", icon: Smartphone },
      { label: "Access Reviews", href: "/access/reviews", icon: CheckSquare },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Command Terminal", href: "/terminal", icon: TerminalIcon, badge: "CLI", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
      { label: "Command Library", href: "/terminal/library", icon: BookOpen, badge: "DOCS", badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
      { label: "Integrations", href: "/integrations", icon: Plug },
      { label: "Custom Domains", href: "/domains", icon: Globe2 },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Public Website ↗", href: "https://dragongamingstudios.vercel.app", icon: Globe, isExternal: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "shrink-0 bg-[#07111F]/95 backdrop-blur-xl border-r border-blue-500/20 flex flex-col justify-between p-4 min-h-screen font-sans select-none z-30 transition-all duration-300 relative shadow-2xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3.5 top-7 size-7 rounded-full bg-[#0B132B] border border-blue-500/40 shadow-lg flex items-center justify-center text-cyan-400 hover:text-white transition-colors z-40"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>

      {/* Brand & Grouped Navigation */}
      <div className="space-y-6">
        {/* Colorful Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1.5 border-b border-blue-500/20 pb-4">
          <DragonLogoIcon className="size-10" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-black text-sm text-white tracking-tight truncate flex items-center gap-1.5">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300">Dragon OS</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-blue-600/20 text-cyan-300 rounded-md border border-blue-500/30 font-bold">
                  PRO
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wide">Enterprise v2.0</div>
            </div>
          )}
        </div>

        {/* Grouped Navigation */}
        <nav className="space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1.5">
              {!collapsed && (
                <div className="px-3 text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    !item.isExternal &&
                    (pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href)));

                  if (item.isExternal) {
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          "flex items-center rounded-xl px-3 py-2 text-slate-400 hover:text-white hover:bg-blue-950/40 transition-all text-xs font-medium group",
                          collapsed ? "justify-center" : "justify-between"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                          {!collapsed && <span>{item.label}</span>}
                        </div>
                        {!collapsed && <ExternalLink className="size-3 text-slate-500" />}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-2xl px-3 py-2.5 transition-all text-xs font-medium group relative shadow-xs",
                        collapsed ? "justify-center" : "justify-between",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-md shadow-blue-500/30"
                          : "text-slate-400 hover:text-white hover:bg-blue-950/40"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "size-4 transition-all group-hover:scale-110",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"
                          )}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className={cn("text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase", item.badgeColor || "bg-cyan-500/10 text-cyan-400 border-cyan-500/20")}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Colorful Identity Card & Status */}
      <div className="pt-4 border-t border-blue-500/20 space-y-2">
        <div
          className={cn(
            "rounded-2xl bg-[#0B132B] border border-blue-500/25 p-2.5 flex items-center gap-3 shadow-md",
            collapsed && "justify-center"
          )}
        >
          <div className="size-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
            EO
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>Executive Owner</span>
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-cyan-400 font-mono font-bold">PROTECTED ROOT</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
