"use client";

import React, { useState, useEffect } from "react";
import { Search, ShieldCheck, Bell, User, LogOut, CheckCircle2, ChevronRight, Sparkles, Laptop, Loader2, Activity } from "lucide-react";
import { GlobalCommandPalette } from "../command/GlobalCommandPalette";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: nextAuthSession } = useSession();

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

  // Fetch current authenticated staff session info
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

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoggingOut(true);

    try {
      // 1. Invalidate custom admin database session & cookie
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch (err) {
      console.warn("Logout API warning:", err);
    }

    try {
      // 2. Invalidate NextAuth session if active
      await signOut({ redirect: false });
    } catch (err) {
      console.warn("NextAuth signOut warning:", err);
    }

    // 3. Clear cookie on client side and force reload to login
    document.cookie = "dragon_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") return { section: "Command", page: "Command Center" };
    if (pathname === "/health") return { section: "Command", page: "Live System Health" };
    if (pathname === "/notifications") return { section: "Command", page: "Operational Notifications" };
    if (pathname === "/games") return { section: "Studio", page: "Games Catalog & Engine" };
    if (pathname === "/cms/blocks") return { section: "Studio", page: "Layout & Content Blocks" };
    if (pathname === "/cms") return { section: "Studio", page: "Visual Studio CMS" };
    if (pathname === "/media") return { section: "Studio", page: "Media & Asset Library" };
    if (pathname === "/ai") return { section: "Studio", page: "Gemini AI Studio" };
    if (pathname === "/communication") return { section: "Studio", page: "Communication & News" };
    if (pathname === "/users") return { section: "Players", page: "Team & Player Workforce" };
    if (pathname === "/identity") return { section: "Players", page: "Dragon ID Center" };
    if (pathname === "/team-key-portal") return { section: "Players", page: "Recruitment Keys" };
    if (pathname === "/crm") return { section: "Players", page: "Support & CRM Desk" };
    if (pathname === "/devices") return { section: "Players", page: "Active Devices & Sessions" };
    if (pathname === "/analytics") return { section: "Operations", page: "Studio BI & Analytics" };
    if (pathname === "/deployments") return { section: "Operations", page: "Vercel Deployments" };
    if (pathname === "/qa") return { section: "Operations", page: "QA & Test Center" };
    if (pathname === "/api-platform") return { section: "Operations", page: "Edge API Platform" };
    if (pathname === "/automation") return { section: "Operations", page: "Automation Workflows" };
    if (pathname === "/performance") return { section: "Operations", page: "Performance & Latency" };
    if (pathname === "/security") return { section: "Security", page: "Security Posture" };
    if (pathname === "/access") return { section: "Security", page: "RBAC & Permissions" };
    if (pathname === "/audit") return { section: "Security", page: "Audit Center" };
    if (pathname === "/data-control") return { section: "Security", page: "Owner Data Control" };
    if (pathname === "/secrets") return { section: "Security", page: "Secrets Vault" };
    if (pathname === "/terminal") return { section: "System", page: "Command Terminal" };
    if (pathname === "/developer") return { section: "System", page: "Developer Platform" };
    if (pathname === "/settings") return { section: "System", page: "System Settings" };
    return { section: "Dragon Control", page: "Workspace" };
  };

  const breadcrumbs = getBreadcrumbs();
  const displayName = currentUser?.name || nextAuthSession?.user?.name || "Executive Owner";
  const displayEmail = currentUser?.email || nextAuthSession?.user?.email || "Owner Account";
  const displayRole = (currentUser?.role || (nextAuthSession?.user as unknown as { role?: string })?.role || "OWNER").toUpperCase();
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "DS";

  return (
    <>
      <header className="h-16 bg-[#030714]/90 backdrop-blur-2xl border-b border-cyan-500/20 px-4 sm:px-6 flex items-center justify-between z-20 sticky top-0 font-sans shadow-[0_4px_30px_rgba(0,0,0,0.6)] select-none">
        {/* Global Command Search Trigger & Breadcrumbs */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="text-slate-500">{breadcrumbs.section}</span>
            <ChevronRight className="size-3 text-cyan-400/60" />
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>{breadcrumbs.page}</span>
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
            </span>
          </div>

          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-2.5 w-60 sm:w-72 rounded-xl bg-[#02050E] hover:bg-[#06132E] px-3.5 py-1.5 text-xs text-slate-400 hover:text-white border border-cyan-500/25 hover:border-cyan-400/60 transition-all text-left group shadow-[0_0_12px_rgba(0,0,0,0.4)] cursor-pointer font-mono"
          >
            <Search className="size-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="flex-1 truncate">Quick search commands...</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-[#040C20] text-[10px] font-mono text-cyan-300 font-bold border border-cyan-500/30 shadow-[0_0_6px_rgba(0,229,255,0.2)]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Status & Account Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live System Health Pill */}
          <Link
            href="/health"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            <Activity className="size-3 text-emerald-400 animate-pulse" />
            <span>NODE HEALTHY</span>
          </Link>

          {/* Quick Notifications */}
          <Link
            href="/notifications"
            className="relative p-2 rounded-xl bg-[#02050E] hover:bg-[#06132E] text-slate-400 hover:text-white border border-cyan-500/25 transition-all shadow-[0_0_10px_rgba(0,0,0,0.4)] cursor-pointer"
            title="Notifications"
          >
            <Bell className="size-4 text-cyan-400" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00E5FF] animate-pulse" />
          </Link>

          {/* Account Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-[#02050E] hover:bg-[#06132E] hover:border-cyan-400/50 px-2.5 py-1.5 border border-cyan-500/30 text-xs font-mono font-bold text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer select-none"
            >
              <div className="size-6.5 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#7C3CFF] flex items-center justify-center font-mono font-black text-[10px] text-[#020617] shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                {initials}
              </div>
              <span className="hidden sm:inline font-bold text-slate-200">{displayName}</span>
              <ShieldCheck className="size-3.5 text-cyan-400" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#03091D]/98 backdrop-blur-2xl border border-cyan-500/35 shadow-[0_10px_40px_rgba(0,0,0,0.9)] p-2 z-50 text-xs font-mono animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-2.5 border-b border-white/10 mb-1 bg-gradient-to-b from-cyan-950/30 to-transparent rounded-t-xl">
                  <div className="font-black text-white flex items-center justify-between">
                    <span className="truncate">{displayName}</span>
                    <Sparkles className="size-3.5 text-cyan-400 shrink-0" />
                  </div>
                  <div className="text-[10.5px] text-slate-400 truncate mt-0.5">{displayEmail}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[9.5px] text-cyan-300 font-bold">
                    <ShieldCheck className="size-3 text-cyan-400" />
                    <span>Role: {displayRole}</span>
                  </div>
                </div>

                <Link
                  href="/security"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-cyan-500/15 transition-all cursor-pointer"
                >
                  <User className="size-4 text-cyan-400" />
                  <div>
                    <div className="font-bold text-white">Security & Credentials</div>
                    <div className="text-[10px] text-slate-400">Access keys, Dragon Key & MFA</div>
                  </div>
                </Link>

                <Link
                  href="/audit"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-cyan-500/15 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <div>
                    <div className="font-bold text-white">Audit Center</div>
                    <div className="text-[10px] text-slate-400">Real-time security log stream</div>
                  </div>
                </Link>

                <Link
                  href="/devices"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-cyan-500/15 transition-all cursor-pointer"
                >
                  <Laptop className="size-4 text-purple-400" />
                  <div>
                    <div className="font-bold text-white">Active Sessions</div>
                    <div className="text-[10px] text-slate-400">Inspect device authorizations</div>
                  </div>
                </Link>

                <div className="border-t border-white/10 my-1" />

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-500/15 transition-all font-bold cursor-pointer disabled:opacity-50 text-left"
                >
                  {loggingOut ? (
                    <Loader2 className="size-4 animate-spin text-rose-400" />
                  ) : (
                    <LogOut className="size-4 text-rose-400" />
                  )}
                  <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
                </button>
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
