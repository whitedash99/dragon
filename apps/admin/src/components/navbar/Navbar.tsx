"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspace } from "@/providers/workspace-context";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { CommandPalette } from "../command/CommandPalette";
import {
  ChevronRight,
  Bell,
  User,
  LogOut,
  Shield,
  Activity,
  Settings,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { workspace, activeWorkspace, switchWorkspace } = useWorkspace();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // If on /workspaces, /login or /signup, do not render standard workspace navbar
  if (pathname === "/workspaces" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch {}

    try {
      await signOut({ redirect: false });
    } catch {}

    document.cookie = "dragon_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  const getPageTitle = (): string => {
    if (pathname === "/studio") return "Overview";
    if (pathname === "/studio/content") return "Pages & SEO";
    if (pathname === "/studio/media") return "Media Library";
    if (pathname === "/studio/projects") return "Studio Projects";
    if (pathname === "/studio/communication") return "Communications";
    if (pathname === "/studio/analytics") return "Studio Analytics";
    if (pathname === "/studio/system") return "System & Health";
    if (pathname === "/studio/settings") return "Studio Settings";

    if (pathname === "/games-hub") return "Platform Overview";
    if (pathname === "/games-hub/catalog") return "Game Catalog";
    if (pathname === "/games-hub/levels") return "Level Progression";
    if (pathname === "/games-hub/players") return "Player Directory";
    if (pathname === "/games-hub/competition") return "Leaderboards";
    if (pathname === "/games-hub/achievements") return "Achievements";
    if (pathname === "/games-hub/media") return "Game Media";
    if (pathname === "/games-hub/releases") return "Game Releases";
    if (pathname === "/games-hub/analytics") return "Player Analytics";
    if (pathname === "/games-hub/system") return "Engine & Health";

    if (pathname.includes("/games/")) return "Game Management";
    return "Workspace";
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between px-4 lg:px-6 transition-all">
      {/* Left: Breadcrumbs & Workspace Switcher */}
      <div className="flex items-center gap-3">
        <WorkspaceSwitcher />

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-200 font-medium">{getPageTitle()}</span>
        </div>
      </div>

      {/* Center & Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search / Command Palette */}
        <CommandPalette />

        {/* Live DB Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PostgreSQL Live</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-slate-400 font-mono">Studio Sync</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                  <div className="font-medium text-slate-200">Zero-Trust Core Active</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Unified audit logging synchronized with Neon PostgreSQL.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              {currentUser?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="hidden lg:flex flex-col pr-1">
              <span className="text-xs font-medium text-slate-200 leading-tight">
                {currentUser?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-none">
                {currentUser?.role || "SUPER_ADMIN"}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <div className="text-xs font-semibold text-white">
                  {currentUser?.name || "Administrator"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentUser?.email || "admin@dragongaming.studio"}
                </div>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/workspaces"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Workspace Selector</span>
                </Link>
                <Link
                  href="/studio/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings & RBAC</span>
                </Link>
              </div>

              <div className="mt-1 pt-1 border-t border-white/5">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
