"use client";

import React, { useState, useEffect } from "react";
import { Search, ShieldCheck, Bell, User, LogOut, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { GlobalCommandPalette } from "../command/GlobalCommandPalette";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") return { section: "Overview", page: "Dashboard" };
    if (pathname === "/users") return { section: "Workspace", page: "Team Workforce" };
    if (pathname === "/team-key-portal") return { section: "Workspace", page: "Recruitment Portal" };
    if (pathname === "/crm") return { section: "Workspace", page: "Support Desk" };
    if (pathname === "/cms") return { section: "Workspace", page: "Studio CMS" };
    if (pathname === "/security") return { section: "Security", page: "Security Posture" };
    if (pathname === "/audit") return { section: "Security", page: "Audit Center" };
    if (pathname === "/terminal") return { section: "System", page: "Command Terminal" };
    if (pathname === "/terminal/library") return { section: "System", page: "Command Library" };
    if (pathname === "/settings") return { section: "System", page: "Settings" };
    return { section: "Admin OS", page: "Workspace" };
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="h-16 bg-[#0B132B]/90 backdrop-blur-xl border-b border-blue-500/20 px-6 flex items-center justify-between z-20 sticky top-0 font-sans shadow-lg shadow-black/40">
        {/* Global Command Search Trigger & Breadcrumbs */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono">
            <span className="text-slate-500">{breadcrumbs.section}</span>
            <ChevronRight className="size-3 text-slate-600" />
            <span className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>{breadcrumbs.page}</span>
              <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
            </span>
          </div>

          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-3 w-72 rounded-2xl bg-[#060B18] px-4 py-2 text-xs text-slate-400 border border-slate-700/80 hover:border-blue-500 hover:text-white transition-all text-left group shadow-inner"
          >
            <Search className="size-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="flex-1 truncate font-mono">Search commands or data...</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-mono text-cyan-300 font-bold border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Status & Account Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <ThemeSwitcher className="hidden sm:inline-flex" />

          {/* Quick Notifications */}
          <Link
            href="/audit"
            className="relative p-2.5 rounded-2xl bg-[#060B18] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-xs"
            title="Audit Center"
          >
            <Bell className="size-4 text-cyan-400" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-cyan-400 animate-pulse" />
          </Link>

          {/* Account Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-2xl bg-[#060B18] hover:border-blue-500/50 px-3.5 py-1.5 border border-slate-700 text-xs font-medium text-slate-100 transition-all shadow-xs"
            >
              <div className="size-7 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center font-black text-[11px] text-white shadow-sm">
                DS
              </div>
              <span className="hidden sm:inline font-bold">Executive Owner</span>
              <ShieldCheck className="size-4 text-cyan-400" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-3xl bg-[#0B132B] backdrop-blur-2xl border border-blue-500/30 shadow-2xl p-2 z-50 text-xs font-sans animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setMenuOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-800 mb-1">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span>Protected Executive Account</span>
                    <Sparkles className="size-3 text-cyan-400" />
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono font-bold">DIP Role: OWNER ROOT</div>
                </div>

                <div className="p-2 sm:hidden border-b border-slate-800 mb-1">
                  <ThemeSwitcher className="w-full justify-between" />
                </div>

                <Link
                  href="/security"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-blue-950/40 transition-all"
                >
                  <User className="size-3.5 text-cyan-400" />
                  <span>Security & Passkeys</span>
                </Link>

                <Link
                  href="/audit"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-blue-950/40 transition-all"
                >
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Audit Logs</span>
                </Link>

                <div className="border-t border-slate-800 my-1" />

                <Link
                  href="/login"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out of DIP</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <GlobalCommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
