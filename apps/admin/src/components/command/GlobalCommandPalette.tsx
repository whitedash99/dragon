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
        title: "Dashboard Workspace",
        subtitle: "Overview & Attention Center",
        icon: LayoutDashboard,
        action: () => { router.push("/dashboard"); onClose(); },
      },
      {
        id: "nav-team",
        category: "Navigation",
        title: "Team Directory",
        subtitle: "Manage staff, roles & permissions",
        icon: Users,
        action: () => { router.push("/users"); onClose(); },
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
        id: "nav-studio",
        category: "Navigation",
        title: "Studio Content Editor",
        subtitle: "CMS games, DLCs & media publishing",
        icon: Sparkles,
        action: () => { router.push("/cms"); onClose(); },
      },
      {
        id: "nav-security",
        category: "Navigation",
        title: "Security Center",
        subtitle: "DIP posture, WebAuthn & active sessions",
        icon: ShieldCheck,
        action: () => { router.push("/security"); onClose(); },
      },
      {
        id: "nav-audit",
        category: "Navigation",
        title: "Audit Center",
        subtitle: "Immutable system activity logs",
        icon: Activity,
        action: () => { router.push("/audit"); onClose(); },
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="relative flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="size-4 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, candidate, ticket, or team member... (Esc to cancel)"
            className="w-full h-14 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Results Stream */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="px-4 py-3 text-xs text-slate-400 font-mono animate-pulse">
              Searching database...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-slate-800 dark:bg-slate-200 border-slate-700 dark:border-slate-300 text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-semibold truncate ${isSelected ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-slate-100"}`}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className={`text-[11px] truncate ${isSelected ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${isSelected ? "bg-slate-800 dark:bg-slate-200 border-slate-700 dark:border-slate-300 text-slate-300 dark:text-slate-700" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"}`}>
                    {item.category}
                  </span>
                  <ChevronRight className={`size-3.5 ${isSelected ? "text-slate-400 dark:text-slate-600" : "text-slate-400"}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Esc</kbd> Close</span>
          </div>
          <div>Dragon OS Command Center</div>
        </div>
      </div>
    </div>
  );
}
