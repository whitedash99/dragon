"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Globe, 
  Gamepad2, 
  HardDrive, 
  Download, 
  BarChart3, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  ShieldCheck, 
  Terminal as TerminalIcon, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LifeBuoy,
  Key,
  Lock,
  LayoutGrid,
  Bot,
  Activity,
  Server,
  Cloud,
  FileCode,
  Shield,
  FileText,
  KeyRound,
  Zap,
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
  Radio,
  Share2,
  Bell
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
    title: "COMMAND",
    items: [
      { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "System Health", href: "/health", icon: Activity, badge: "PROBE", badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
    ],
  },
  {
    title: "STUDIO CORE",
    items: [
      { label: "Games Catalog", href: "/games", icon: Gamepad2, badge: "FLAGSHIP", badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40" },
      { label: "Media Library", href: "/media", icon: ImageIcon },
      { label: "Layout & Blocks", href: "/cms/blocks", icon: LayoutGrid },
      { label: "Studio CMS", href: "/cms", icon: FolderKanban },
      { label: "Gemini AI Studio", href: "/ai", icon: Bot, badge: "AI", badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/40" },
      { label: "Communications", href: "/communication", icon: Radio },
    ],
  },
  {
    title: "PLAYERS & TEAM",
    items: [
      { label: "Sign-Ins & Telemetry", href: "/telemetry", icon: Radio, badge: "SYNC", badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
      { label: "Team & Players", href: "/users", icon: Users },
      { label: "Dragon ID Center", href: "/identity", icon: KeyRound, badge: "LIVE", badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40" },
      { label: "Recruitment Keys", href: "/team-key-portal", icon: Key },
      { label: "Support & CRM Desk", href: "/crm", icon: LifeBuoy },
      { label: "Active Devices", href: "/devices", icon: Smartphone },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Studio BI Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Deployments", href: "/deployments", icon: Cloud },
      { label: "QA Readiness", href: "/qa", icon: ShieldCheck },
      { label: "API Platform", href: "/api-platform", icon: Server },
      { label: "Automation", href: "/automation", icon: Cpu },
      { label: "Performance", href: "/performance", icon: Zap },
    ],
  },
  {
    title: "SECURITY CORE",
    items: [
      { label: "Security Posture", href: "/security", icon: ShieldCheck },
      { label: "RBAC & Access", href: "/access", icon: Shield },
      { label: "Audit Center", href: "/audit", icon: FileText },
      { label: "Owner Data Control", href: "/data-control", icon: Lock, badge: "OWNER", badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/40" },
      { label: "Secrets Vault", href: "/secrets", icon: Key },
    ],
  },
  {
    title: "SYSTEM & CONFIG",
    items: [
      { label: "Command Terminal", href: "/terminal", icon: TerminalIcon },
      { label: "Developer Platform", href: "/developer", icon: FileCode },
      { label: "Studio Settings", href: "/settings", icon: Settings },
      { label: "Public Website", href: "https://dragongamingstudios.vercel.app", icon: Globe, isExternal: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "shrink-0 bg-[#030714]/95 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col justify-between p-3.5 min-h-screen font-sans select-none z-30 transition-all duration-300 relative shadow-[10px_0_40px_rgba(0,0,0,0.8)]",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-7 size-6.5 rounded-full bg-[#02050E] border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.4)] flex items-center justify-center text-cyan-400 hover:text-white hover:scale-105 transition-all z-40 cursor-pointer"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </button>

      {/* Brand & Grouped Navigation */}
      <div className="space-y-4">
        {/* Luxury Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1.5 border-b border-cyan-500/20 pb-3.5 bg-gradient-to-b from-cyan-950/20 to-transparent rounded-t-xl">
          <DragonLogoIcon className="size-8.5 shrink-0 drop-shadow-[0_0_15px_rgba(0,229,255,0.6)] text-cyan-400" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-black text-sm text-white tracking-tight truncate flex items-center gap-1.5 font-heading">
                <span>DRAGON</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  STUDIO OS
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                Command Operating System
              </div>
            </div>
          )}
        </div>

        {/* Grouped Navigation */}
        <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-190px)] pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[9px] font-mono font-black tracking-[0.15em] text-cyan-400/75 uppercase">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive =
                    !item.isExternal &&
                    (pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`)));

                  if (item.isExternal) {
                    return (
                      <a
                        key={`${item.label}-${idx}`}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          "flex items-center rounded-xl px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-cyan-500/10 transition-all text-xs font-mono group cursor-pointer",
                          collapsed ? "justify-center" : "justify-between"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:scale-105 transition-transform" />
                          {!collapsed && <span>{item.label}</span>}
                        </div>
                        {!collapsed && <ExternalLink className="size-3 text-slate-500" />}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={`${item.label}-${idx}`}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-xl px-2.5 py-1.5 text-xs font-mono transition-all duration-200 group relative cursor-pointer",
                        collapsed ? "justify-center" : "justify-between",
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "size-3.5 transition-all duration-200",
                            isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-300 group-hover:scale-105"
                          )}
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className={cn("text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-md border", item.badgeColor || "bg-cyan-500/15 text-cyan-300 border-cyan-400/30")}>
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

      {/* Cybernetic Node Status */}
      <div className="pt-2 border-t border-cyan-500/20 space-y-1.5">
        <div
          className={cn(
            "rounded-xl bg-[#02050E] border border-cyan-500/25 p-2 flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]",
            collapsed && "justify-center"
          )}
        >
          <div className="size-7 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#7C3CFF] text-[#020617] font-mono font-black flex items-center justify-center text-xs shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.5)]">
            DS
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5 font-mono">
                <span>Dragon Node</span>
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
              </div>
              <div className="text-[9.5px] text-cyan-400/70 font-mono">Telemetry Active</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
