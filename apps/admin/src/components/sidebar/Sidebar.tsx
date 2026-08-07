"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileCode2, 
  LifeBuoy, 
  Gamepad2, 
  FolderGit2, 
  Users, 
  BarChart3, 
  Bot, 
  ShieldCheck, 
  Settings, 
  Bell,
  Terminal,
  Zap,
  Cloud,
  GitFork,
  BookOpen,
  Code2,
  Megaphone,
  LogOut,
  ChevronRight,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

interface NavGroup {
  groupName: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    badgeVariant?: "purple" | "cyan" | "success" | "danger" | "default";
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: "CORE PLATFORM",
    items: [
      { label: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Website Experience CMS", href: "/cms", icon: FileCode2, badge: "Studio", badgeVariant: "purple" },
      { label: "Support & CRM Desk", href: "/crm", icon: LifeBuoy, badge: "SLA Live", badgeVariant: "success" },
      { label: "Game Catalog Manager", href: "/games", icon: Gamepad2 },
      { label: "Digital Asset Manager (DAM)", href: "/media", icon: FolderGit2 },
      { label: "Users & Roles (IAM)", href: "/users", icon: Users },
    ],
  },
  {
    groupName: "DATA & INTELLIGENCE",
    items: [
      { label: "Analytics & Telemetry BI", href: "/analytics", icon: BarChart3 },
      { label: "AI Cognitive Assistant", href: "/ai", icon: Bot, badge: "Gemini AI", badgeVariant: "cyan" },
      { label: "Knowledge Base AI", href: "/knowledge", icon: BookOpen },
      { label: "Marketing & Growth Engine", href: "/marketing", icon: Megaphone },
    ],
  },
  {
    groupName: "OPERATIONS & DEVTOOLKIT",
    items: [
      { label: "API Platform & Webhooks", href: "/api-platform", icon: Code2 },
      { label: "Automation Workflows", href: "/automation", icon: GitFork },
      { label: "Security & Audit Vault", href: "/security", icon: ShieldCheck },
      { label: "Developer Toolkit", href: "/developer", icon: Terminal },
      { label: "Performance & Scaling", href: "/performance", icon: Zap },
      { label: "Cloud Infrastructure", href: "/deployments", icon: Cloud },
      { label: "Notifications Center", href: "/notifications", icon: Bell },
      { label: "System Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <aside className="w-[360px] shrink-0 bg-slate-950 border-r border-white/10 flex flex-col justify-between p-5 min-h-screen font-sans select-none z-30 shadow-2xl">
      {/* Top Header & Navigation */}
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3.5 px-3 py-3 border-b border-white/10 pb-5">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-purple-900/50 border border-white/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-black uppercase text-white tracking-tight truncate font-heading">
                DRAGON STUDIOS
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="purple" size="sm">ENTERPRISE OS</Badge>
              <span className="text-[10px] text-slate-400 font-mono">v4.8</span>
            </div>
          </div>
        </div>

        {/* Grouped Navigation */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsedGroups[group.groupName];
            return (
              <div key={group.groupName} className="space-y-2">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.groupName)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-white transition-colors group text-[11px] font-bold uppercase tracking-wider font-mono"
                >
                  <span>{group.groupName}</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  )}
                </button>

                {/* Group Navigation Items */}
                {!isCollapsed && (
                  <nav className="space-y-1.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" && pathname?.startsWith(item.href));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 group border text-[15px] font-medium min-h-[56px]",
                            isActive
                              ? "bg-purple-600/20 text-white border-purple-500/50 shadow-lg shadow-purple-950/40 font-semibold"
                              : "bg-slate-900/30 text-slate-300 border-transparent hover:bg-slate-900/80 hover:text-white hover:border-white/10"
                          )}
                        >
                          <div className="flex items-center gap-3.5 truncate">
                            <Icon
                              className={cn(
                                "size-[22px] shrink-0 transition-colors",
                                isActive
                                  ? "text-purple-400"
                                  : "text-slate-400 group-hover:text-purple-300"
                              )}
                            />
                            <span className="truncate tracking-tight">{item.label}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <Badge variant={item.badgeVariant || "purple"} size="sm">
                                {item.badge}
                              </Badge>
                            )}
                            {isActive && <ChevronRight className="size-4 text-purple-400" />}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* User Profile & Sign Out Footer */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="rounded-xl bg-slate-900/80 border border-white/10 p-3 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-sm shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white truncate">Super Admin</span>
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
            </div>
            <span className="text-xs text-slate-400 block truncate font-mono">admin@dragonstudios.com</span>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
        >
          <LogOut className="size-4" />
          <span>SIGN OUT OS</span>
        </Link>
      </div>
    </aside>
  );
}
