"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Gamepad2, 
  Newspaper, 
  Image as ImageIcon, 
  Users, 
  Briefcase,
  UserCheck,
  BarChart3, 
  Globe, 
  Settings, 
  FileEdit, 
  LifeBuoy,
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Activity,
  Megaphone,
  Database,
  Cpu,
  Bot,
  ShieldCheck,
  FileSpreadsheet,
  LockKeyhole,
  TrendingUp,
  Terminal,
  Server,
  Radio,
  BookOpen,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Dragon QA", href: "/admin/qa", icon: FileCheck },
    { label: "Dragon Knowledge", href: "/admin/knowledge", icon: BookOpen },
    { label: "Dragon LiveOps", href: "/admin/liveops", icon: Radio },
    { label: "DragonOps Platform", href: "/admin/devops", icon: Server },
    { label: "Dragon DevHub", href: "/admin/devhub", icon: Terminal },
    { label: "Executive BI", href: "/admin/bi", icon: TrendingUp },
    { label: "System Health", href: "/admin/health", icon: Cpu },
    { label: "Database Manager", href: "/admin/database", icon: Database },
    { label: "Support CRM", href: "/admin/tickets", icon: LifeBuoy },
    { label: "Website Content", href: "/admin/content", icon: FileEdit },
    { label: "Game Manager", href: "/admin/games", icon: Gamepad2 },
    { label: "News Manager", href: "/admin/news", icon: Newspaper },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { label: "Careers Manager", href: "/admin/careers", icon: Briefcase },
    { label: "Team Manager", href: "/admin/team", icon: UserCheck },
    { label: "User Directory", href: "/admin/users", icon: Users },
    { label: "Roles & Permissions", href: "/admin/roles", icon: LockKeyhole },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "AI Center", href: "/admin/ai", icon: Bot },
    { label: "Security Center", href: "/admin/security", icon: ShieldCheck },
    { label: "Audit Logs", href: "/admin/logs", icon: FileSpreadsheet },
    { label: "SEO Manager", href: "/admin/seo", icon: Globe },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "relative z-40 flex flex-col justify-between border-r border-white/10 bg-[linear-gradient(180deg,rgba(20,16,18,0.98),rgba(7,7,9,0.98)_40%)] shadow-[20px_0_60px_rgba(0,0,0,0.18)] transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center gap-3 group overflow-hidden">
            <DragonLogoIcon size="sm" />
            {!collapsed && (
              <div>
                <span className="text-sm font-black tracking-tight text-white uppercase block">
                  DRAGON OS
                </span>
                <span className="text-[9px] font-mono text-cyan-400">ENTERPRISE CRM</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 border border-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] font-mono">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors",
                  isActive
                    ? "border border-[#ff1e4b]/40 bg-[#ff1e4b] text-white shadow-lg shadow-[#ff1e4b]/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Exit */}
      <div className="p-4 border-t border-white/10 font-mono">
        {!collapsed && (
          <div className="mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span className="flex items-center gap-1">
                <Activity className="size-3 text-emerald-400 animate-pulse" />
                <span>POSTGRESQL</span>
              </span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
            <span className="text-[9px] text-muted-foreground block">DRAGON OS OPERATIONAL</span>
          </div>
        )}

        <Link
          href="/"
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-white/10 transition-colors border border-white/5",
            collapsed ? "w-full" : ""
          )}
        >
          <LogOut className="size-4" />
          {!collapsed && <span>View Main Site</span>}
        </Link>
      </div>
    </aside>
  );
}
