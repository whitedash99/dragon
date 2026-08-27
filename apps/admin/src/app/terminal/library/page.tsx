"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Terminal as TerminalIcon,
  Copy,
  Check,
  Star,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Filter,
  RefreshCw,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CommandLibraryItem {
  name: string;
  aliases: string[];
  namespace: string;
  category: string;
  description: string;
  usage: string;
  examples: string[];
  arguments: string[];
  options: { flag: string; description: string; values?: string[] }[];
  requiredPermission: string;
  requiresOwner: boolean;
  dangerLevel: "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "OPERATIONAL" | "ADMIN" | "OWNER" | "CRITICAL";
  confirmationPhrase?: string;
  isAllowed: boolean;
}

export default function TerminalCommandLibraryPage() {
  const router = useRouter();
  const [commands, setCommands] = useState<CommandLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDanger, setSelectedDanger] = useState("ALL");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedCmd, setExpandedCmd] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegistry() {
      try {
        setLoading(true);
        const res = await fetch("/api/terminal/registry");
        const data = await res.json();
        if (data.success) {
          setCommands(data.commands || []);
        } else {
          setError(data.error || "Failed to load command registry");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setLoading(false);
      }
    }

    fetchRegistry();
  }, []);

  const toggleFavorite = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleRunInTerminal = (cmdName: string) => {
    router.push(`/terminal?cmd=${encodeURIComponent(cmdName)}`);
  };

  // Categories list
  const categories = ["ALL", ...Array.from(new Set(commands.map((c) => c.category)))];

  // Danger Badge styling
  const getDangerBadge = (level: string) => {
    switch (level) {
      case "SAFE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "OPERATIONAL":
      case "LOW":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "ADMIN":
      case "MEDIUM":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "HIGH":
      case "OWNER":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "CRITICAL":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  // Filter commands
  const filteredCommands = commands.filter((cmd) => {
    const matchesSearch =
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "ALL" || cmd.category.toUpperCase() === selectedCategory.toUpperCase();
    const matchesDanger = selectedDanger === "ALL" || cmd.dangerLevel === selectedDanger;

    return matchesSearch && matchesCategory && matchesDanger;
  });

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <BookOpen className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    <span>DRAGON TERMINAL COMMAND LIBRARY</span>
                    <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      LIVE SYNCED
                    </span>
                  </h1>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Authoritative documentation catalog of every server-side command in Dragon OS Terminal 3.0.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/terminal")}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-sm"
              >
                <TerminalIcon className="size-4 text-emerald-400" />
                <span>Open Terminal</span>
              </button>
            </div>
          </div>

          {/* Controls Bar: Search & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by command, category, or description (e.g. 'dragon website', 'health', 'files')..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-xs"
                />
              </div>

              {/* Danger Level Filter */}
              <select
                value={selectedDanger}
                onChange={(e) => setSelectedDanger(e.target.value)}
                className="h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none shadow-xs"
              >
                <option value="ALL">All Danger Levels</option>
                <option value="SAFE">SAFE</option>
                <option value="OPERATIONAL">OPERATIONAL</option>
                <option value="ADMIN">ADMIN</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 select-none",
                    selectedCategory === cat
                      ? "bg-emerald-500 text-slate-950 shadow-xs font-bold"
                      : "bg-slate-200/80 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <div className="py-16 text-center space-y-3 font-mono text-slate-400">
              <RefreshCw className="size-6 animate-spin mx-auto text-emerald-500" />
              <p className="text-xs">Synchronizing Command Library with server registry...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono">
              Error loading command registry: {error}
            </div>
          )}

          {/* Command Cards Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCommands.map((cmd) => {
                const isFav = favorites.includes(cmd.name);
                const isExpanded = expandedCmd === cmd.name;

                return (
                  <div
                    key={cmd.name}
                    className={cn(
                      "rounded-3xl border transition-all p-6 space-y-4 flex flex-col justify-between shadow-xs",
                      cmd.isAllowed
                        ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        : "bg-slate-100/50 dark:bg-slate-950/40 border-slate-200/40 dark:border-slate-900 opacity-60"
                    )}
                  >
                    <div className="space-y-3">
                      {/* Top Badges & Actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                            {cmd.category}
                          </span>
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border uppercase tracking-wider",
                              getDangerBadge(cmd.dangerLevel)
                            )}
                          >
                            {cmd.dangerLevel}
                          </span>
                          {cmd.requiresOwner && (
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                              OWNER ROOT
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => toggleFavorite(cmd.name, e)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Star className={cn("size-4", isFav && "text-amber-400 fill-amber-400")} />
                        </button>
                      </div>

                      {/* Command Name & Description */}
                      <div className="space-y-1">
                        <div className="font-mono text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>{cmd.name}</span>
                          {cmd.aliases.length > 0 && (
                            <span className="text-xs font-normal text-slate-400">
                              ({cmd.aliases.join(", ")})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                          {cmd.description}
                        </p>
                      </div>

                      {/* Usage Code Box */}
                      <div className="p-3 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs flex items-center justify-between border border-slate-800 group">
                        <span className="text-emerald-400 select-all font-bold">{cmd.usage}</span>
                        <button
                          onClick={() => copyToClipboard(cmd.usage)}
                          className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                          title="Copy Usage Syntax"
                        >
                          {copiedCmd === cmd.usage ? (
                            <Check className="size-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Details Section */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs font-mono">
                          {cmd.examples.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Examples:</div>
                              {cmd.examples.map((ex) => (
                                <div key={ex} className="text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                                  {ex}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="text-[11px] text-slate-500 space-y-0.5">
                            <div>Permission Required: <span className="text-slate-300 font-bold">{cmd.requiredPermission}</span></div>
                            {cmd.confirmationPhrase && (
                              <div>Confirmation Phrase: <span className="text-amber-400 font-bold">&quot;{cmd.confirmationPhrase}&quot;</span></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setExpandedCmd(isExpanded ? null : cmd.name)}
                        className="text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Examples & Details"}</span>
                        {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                      </button>

                      <button
                        onClick={() => handleRunInTerminal(cmd.name)}
                        disabled={!cmd.isAllowed}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                        title="Prefill in Terminal prompt"
                      >
                        <TerminalIcon className="size-3.5" />
                        <span>Run in Terminal</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
