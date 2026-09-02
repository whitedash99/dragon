"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace, WORKSPACES } from "@/providers/workspace-context";
import {
  Globe,
  Gamepad2,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  FolderKanban,
  Radio,
  BarChart3,
  Activity,
  Settings,
  Layers,
  Users,
  Trophy,
  Award,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Shield,
  LayoutGrid,
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { activeWorkspace, workspace, switchWorkspace } = useWorkspace();
  const [collapsed, setCollapsed] = useState(false);

  // If we are on the /workspaces selector screen, hide the sidebar
  if (pathname === "/workspaces" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  // Navigation tree for Dragon Gaming Studio Hub
  const studioNavGroups: NavGroup[] = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Studio Overview", href: "/studio", icon: LayoutDashboard },
      ],
    },
    {
      title: "CONTENT & ASSETS",
      items: [
        { label: "Pages & SEO", href: "/studio/content", icon: FileText },
        { label: "Media Library", href: "/studio/media", icon: ImageIcon },
        { label: "Studio Projects", href: "/studio/projects", icon: FolderKanban },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        { label: "Communications", href: "/studio/communication", icon: Radio },
        { label: "Studio Analytics", href: "/studio/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "INFRASTRUCTURE",
      items: [
        { label: "System & Health", href: "/studio/system", icon: Activity },
        { label: "Studio Settings", href: "/studio/settings", icon: Settings },
      ],
    },
  ];

  // Navigation tree for Dragon Web Games Platform
  const gamesNavGroups: NavGroup[] = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Platform Overview", href: "/games-hub", icon: LayoutDashboard },
      ],
    },
    {
      title: "GAME PLATFORM",
      items: [
        { label: "Game Catalog", href: "/games-hub/catalog", icon: Gamepad2, badge: "FLAGSHIP", badgeColor: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30" },
        { label: "Level Progression", href: "/games-hub/levels", icon: Layers },
        { label: "Media & Assets", href: "/games-hub/media", icon: ImageIcon },
      ],
    },
    {
      title: "PLAYERS & COMMUNITY",
      items: [
        { label: "Player Directory", href: "/games-hub/players", icon: Users },
        { label: "Leaderboards", href: "/games-hub/competition", icon: Trophy },
        { label: "Achievements", href: "/games-hub/achievements", icon: Award },
      ],
    },
    {
      title: "OPERATIONS & ENGINE",
      items: [
        { label: "Game Releases", href: "/games-hub/releases", icon: Cloud },
        { label: "Player Analytics", href: "/games-hub/analytics", icon: BarChart3 },
        { label: "Engine & Health", href: "/games-hub/system", icon: Activity },
      ],
    },
  ];

  const currentGroups = activeWorkspace === "STUDIO_HUB" ? studioNavGroups : gamesNavGroups;

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-[#0B0F19] border-r border-white/[0.08] flex flex-col transition-all duration-200 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 border-b border-white/[0.08] flex items-center justify-between px-3.5">
        <Link href="/workspaces" className="flex items-center gap-2.5 group overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:border-indigo-500/60 transition-colors">
            <DragonLogoIcon className="w-4 h-4 text-indigo-400" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                Dragon Command
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-none">
                Enterprise OS
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Quick Card */}
      {!collapsed && (
        <div className="p-3 border-b border-white/[0.06]">
          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                  activeWorkspace === "STUDIO_HUB"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-indigo-500/20 text-indigo-400"
                }`}
              >
                {activeWorkspace === "STUDIO_HUB" ? (
                  <Globe className="w-3.5 h-3.5" />
                ) : (
                  <Gamepad2 className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {workspace.shortName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono leading-none">
                  Active Workspace
                </div>
              </div>
            </div>

            <button
              onClick={() => switchWorkspace(activeWorkspace === "STUDIO_HUB" ? "WEB_GAMES" : "STUDIO_HUB", true)}
              className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[10px] font-mono text-slate-300 border border-white/10 transition-colors"
              title="Switch Workspace"
            >
              Switch
            </button>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {currentGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
                {group.title}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/studio" && item.href !== "/games-hub" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / All Workspaces */}
      <div className="p-2 border-t border-white/[0.08]">
        <Link
          href="/workspaces"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
          title="All Workspaces"
        >
          <LayoutGrid className="w-4 h-4 text-slate-400" />
          {!collapsed && <span>All Workspaces</span>}
        </Link>
      </div>
    </aside>
  );
}
