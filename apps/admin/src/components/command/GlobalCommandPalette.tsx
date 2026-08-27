"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Users,
  Key,
  LifeBuoy,
  Sparkles,
  ShieldCheck,
  Activity,
  Settings,
  X,
  ChevronRight,
  User,
  Ticket,
  FileText,
  Gamepad2,
  LayoutGrid,
  HardDrive,
  BarChart3,
  Lock,
  Terminal as TerminalIcon
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "Navigation" | "Workforce" | "Applications" | "Support Tickets" | "Security & Audit";
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  action: () => void;
}

interface UserRecord {
  id: string;
  name?: string;
  email: string;
  role: string;
}

interface TicketRecord {
  id: string;
  ticketId: string;
  subject: string;
  customerEmail: string;
  status: string;
}

interface AppRecord {
  id: string;
  applicantName: string;
  applicationNumber: string;
  jobTitle: string;
  status: string;
}

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalCommandPalette({ isOpen, onClose }: GlobalCommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Dynamic search across API endpoints
  useEffect(() => {
    const defaultNavItems: CommandItem[] = [
      {
        id: "nav-dashboard",
        category: "Navigation",
        title: "Command Center",
        subtitle: "Real-time telemetry, node latency & executive metrics",
        icon: LayoutDashboard,
        action: () => { router.push("/dashboard"); onClose(); },
      },
      {
        id: "nav-health",
        category: "Navigation",
        title: "Live System Health",
        subtitle: "PostgreSQL, Backblaze B2, Resend & Edge diagnostic probes",
        icon: Activity,
        action: () => { router.push("/health"); onClose(); },
      },
      {
        id: "nav-games",
        category: "Navigation",
        title: "Games Catalog & Engine",
        subtitle: "Uncharted Drive: Beyond, metadata & release distribution",
        icon: Gamepad2,
        action: () => { router.push("/games"); onClose(); },
      },
      {
        id: "nav-identity",
        category: "Navigation",
        title: "Dragon ID Center",
        subtitle: "Player handles, banners, avatars & identity resolution",
        icon: Key,
        action: () => { router.push("/identity"); onClose(); },
      },
      {
        id: "nav-users",
        category: "Navigation",
        title: "Team & Player Workforce",
        subtitle: "Manage studio staff, players, permissions & status",
        icon: Users,
        action: () => { router.push("/users"); onClose(); },
      },
      {
        id: "nav-media",
        category: "Navigation",
        title: "Media & Asset Library",
        subtitle: "B2 object storage, game assets & CMS media",
        icon: FileText,
        action: () => { router.push("/media"); onClose(); },
      },
      {
        id: "nav-recruitment",
        category: "Navigation",
        title: "Recruitment Portal",
        subtitle: "Applications & Team Invitations",
        icon: Key,
        action: () => { router.push("/team-key-portal"); onClose(); },
      },
      {
        id: "nav-support",
        category: "Navigation",
        title: "Support Desk CRM",
        subtitle: "Customer tickets & communications",
        icon: LifeBuoy,
        action: () => { router.push("/crm"); onClose(); },
      },
      {
        id: "nav-security",
        category: "Navigation",
        title: "Security & Identity Posture",
        subtitle: "SAIF audit, WebAuthn & active sessions",
        icon: ShieldCheck,
        action: () => { router.push("/security"); onClose(); },
      },
      {
        id: "nav-data-control",
        category: "Navigation",
        title: "Owner Data Control & Retention",
        subtitle: "Privacy, compliance & database exports",
        icon: Lock,
        action: () => { router.push("/data-control"); onClose(); },
      },
      {
        id: "nav-terminal",
        category: "Navigation",
        title: "Command Terminal",
        subtitle: "Interactive studio CLI & maintenance",
        icon: TerminalIcon,
        action: () => { router.push("/terminal"); onClose(); },
      },
      {
        id: "nav-settings",
        category: "Navigation",
        title: "System Settings",
        subtitle: "Platform configuration & API keys",
        icon: Settings,
        action: () => { router.push("/settings"); onClose(); },
      },
    ];

    if (!query.trim()) {
      setResults(defaultNavItems);
      setSelectedIndex(0);
      setLoading(false);
      return;
    }

    const q = query.toLowerCase();
    const navMatches = defaultNavItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );

    // Show initial nav matches immediately for instant UX
    setResults(navMatches);

    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      // Fetch dynamic database results after 250ms debounce
      Promise.all([
        fetch("/api/users").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/crm").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/team-key-portal").then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
      ]).then(([usersData, crmData, portalData]) => {
        if (!isMounted) return;

        const dynamicItems: CommandItem[] = [];

        // Users
        if (Array.isArray(usersData)) {
          usersData
            .filter((u: UserRecord) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach((u: UserRecord) => {
              dynamicItems.push({
                id: `user-${u.id}`,
                category: "Workforce",
                title: u.name || u.email,
                subtitle: `${u.role} • ${u.email}`,
                icon: User,
                action: () => { router.push(`/users?select=${u.id}`); onClose(); },
              });
            });
        }

        // Tickets
        const tickets: TicketRecord[] = Array.isArray(crmData) ? crmData : crmData?.tickets || [];
        if (Array.isArray(tickets)) {
          tickets
            .filter(
              (t: TicketRecord) =>
                t.ticketId?.toLowerCase().includes(q) ||
                t.subject?.toLowerCase().includes(q) ||
                t.customerEmail?.toLowerCase().includes(q)
            )
            .slice(0, 3)
            .forEach((t: TicketRecord) => {
              dynamicItems.push({
                id: `ticket-${t.id}`,
                category: "Support Tickets",
                title: `[${t.ticketId}] ${t.subject}`,
                subtitle: `${t.status} • ${t.customerEmail}`,
                icon: Ticket,
                action: () => { router.push(`/crm?ticket=${t.ticketId}`); onClose(); },
              });
            });
        }

        // Applications
        const apps: AppRecord[] = (portalData as { applications?: AppRecord[] })?.applications || [];
        if (Array.isArray(apps)) {
          apps
            .filter(
              (a: AppRecord) =>
                a.applicantName?.toLowerCase().includes(q) ||
                a.applicationNumber?.toLowerCase().includes(q) ||
                a.jobTitle?.toLowerCase().includes(q)
            )
            .slice(0, 3)
            .forEach((a: AppRecord) => {
              dynamicItems.push({
                id: `app-${a.id}`,
                category: "Applications",
                title: `${a.applicantName} — ${a.jobTitle}`,
                subtitle: `${a.applicationNumber} • ${a.status}`,
                icon: FileText,
                action: () => { router.push(`/team-key-portal?app=${a.id}`); onClose(); },
              });
            });
        }

        setResults([...navMatches, ...dynamicItems]);
        setSelectedIndex(0);
        setLoading(false);
      });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, onClose, router]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      results[selectedIndex].action();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#02040A]/85 backdrop-blur-md flex items-start justify-center pt-[12vh] px-4">
      <div
        className="w-full max-w-2xl bg-[#03091D]/98 border border-cyan-500/35 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-mono animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="relative flex items-center px-4 border-b border-cyan-500/20 bg-gradient-to-b from-cyan-950/25 to-transparent">
          <Search className="size-4 text-cyan-400 shrink-0 mr-3 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search command, player, title, ticket, or API... (Esc to cancel)"
            className="w-full h-14 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md hover:bg-cyan-500/20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Results Stream */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="px-4 py-3 text-xs text-cyan-400 font-mono animate-pulse">
              Querying database telemetry...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-400 text-xs font-mono">
              No matching commands or database records found for &quot;{query}&quot;
            </div>
          )}

          {results.map((item, index) => {
            const Icon = item.icon;
            const isSelected = index === selectedIndex;

            return (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.25)] font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-cyan-500/30 border-cyan-400/60 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                        : "bg-[#02050E] border-cyan-500/20 text-slate-400"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-mono font-bold truncate ${isSelected ? "text-cyan-200" : "text-slate-200"}`}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className={`text-[10.5px] truncate font-mono ${isSelected ? "text-cyan-300/80" : "text-slate-500"}`}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${isSelected ? "bg-cyan-500/25 border-cyan-400/40 text-cyan-300" : "bg-[#02050E] border-cyan-500/20 text-slate-500"}`}>
                    {item.category}
                  </span>
                  <ChevronRight className={`size-3.5 ${isSelected ? "text-cyan-300" : "text-slate-600"}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#02050E] border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#040C20] text-cyan-300 border border-cyan-500/30">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#040C20] text-cyan-300 border border-cyan-500/30">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#040C20] text-cyan-300 border border-cyan-500/30">Esc</kbd> Close</span>
          </div>
          <div className="text-cyan-400/80 font-bold">Dragon Control Studio OS</div>
        </div>
      </div>
    </div>
  );
}
