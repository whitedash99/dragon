"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { useSearchParams } from "next/navigation";
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  Copy,
  Download,
  Search,
  Plus,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  CornerDownLeft,
  ChevronRight,
  Star,
  Activity,
  Edit2,
  Layers,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "system" | "error";
  text: string;
  exitCode?: number;
  durationMs?: number;
  operationId?: string;
  dangerLevel?: string;
  timestamp: string;
  format?: "text" | "table" | "json";
}

interface TerminalTab {
  id: string;
  title: string;
  history: TerminalLine[];
  commandHistory: string[];
}

function getRiskIndicator(dangerLevel: string) {
  switch (dangerLevel.toUpperCase()) {
    case "CRITICAL":
      return {
        badge: "🔴 CRITICAL",
        label: "CRITICAL",
        textClass: "text-rose-400",
        bgClass: "bg-rose-500/10",
        borderClass: "border-rose-500/30",
        icon: AlertTriangle,
      };
    case "HIGH":
    case "OWNER":
      return {
        badge: "🟠 HIGH RISK",
        label: "HIGH RISK",
        textClass: "text-amber-400",
        bgClass: "bg-amber-500/10",
        borderClass: "border-amber-500/30",
        icon: AlertTriangle,
      };
    case "LOW":
    case "OPERATIONAL":
      return {
        badge: "🟡 LOW RISK",
        label: "LOW RISK",
        textClass: "text-blue-400",
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/30",
        icon: ShieldCheck,
      };
    case "SAFE":
    default:
      return {
        badge: "🟢 SAFE",
        label: "SAFE",
        textClass: "text-emerald-400",
        bgClass: "bg-emerald-500/10",
        borderClass: "border-emerald-500/30",
        icon: CheckCircle2,
      };
  }
}

function deriveCommandRisk(cmdInput: string): string {
  const trimmed = cmdInput.trim().toLowerCase();
  if (trimmed.startsWith("dragon data full-purge")) return "CRITICAL";
  if (
    trimmed.startsWith("dragon cms edit") ||
    trimmed.startsWith("dragon cms unpublish") ||
    trimmed.startsWith("dragon games publish") ||
    trimmed.startsWith("dragon content edit") ||
    trimmed.startsWith("dragon recruitment approve") ||
    trimmed.startsWith("dragon files create") ||
    trimmed.startsWith("dragon files delete")
  ) {
    return "HIGH";
  }
  if (
    trimmed.startsWith("dragon website analytics") ||
    trimmed.startsWith("dragon website realtime") ||
    trimmed.startsWith("dragon team inspect") ||
    trimmed.startsWith("dragon cms page")
  ) {
    return "LOW";
  }
  return "SAFE";
}

function TerminalWorkspaceContent() {
  const searchParams = useSearchParams();
  const prefilledCmd = searchParams.get("cmd") || "";

  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: "tab-general",
      title: "General Workspace",
      commandHistory: [],
      history: [
        {
          id: "init-1",
          type: "system",
          text: "DRAGON TERMINAL 3.0 [Ultimate Enterprise Command Platform]\nConnected to Dragon OS Platform (Neon Serverless PostgreSQL)\nType 'dragon help' or '?' for command catalog.\nType 'dragon health' for aggregated system health check.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    },
    {
      id: "tab-security",
      title: "Security Console",
      commandHistory: [],
      history: [
        {
          id: "init-2",
          type: "system",
          text: "SECURITY WORKSPACE SESSION\nType 'dragon security status' or 'dragon audit recent'.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-general");
  const [inputVal, setInputVal] = useState(prefilledCmd);

  useEffect(() => {
    if (prefilledCmd) {
      setInputVal(prefilledCmd);
    }
  }, [prefilledCmd]);

  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [executing, setExecuting] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([
    "dragon status",
    "dragon health",
    "dragon website status",
    "dragon security status",
    "dragon database counts",
  ]);

  // Output Search Modal (Ctrl + F)
  const [outputSearchOpen, setOutputSearchOpen] = useState(false);
  const [outputSearchQuery, setOutputSearchQuery] = useState("");

  // Command Catalog Search (Ctrl + K)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Danger Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    command: string;
    expectedPhrase: string;
    dangerLevel: string;
  }>({
    isOpen: false,
    command: "",
    expectedPhrase: "",
    dangerLevel: "",
  });
  const [confirmPhraseInput, setConfirmPhraseInput] = useState("");

  // Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState<{ name: string; risk: string }[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const scrollToBottom = useCallback(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeTab?.history, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeTabId]);

  // Command Autocomplete dictionary with risk levels
  const COMMAND_DICTIONARY: { name: string; risk: string }[] = [
    { name: "dragon help", risk: "SAFE" },
    { name: "dragon version", risk: "SAFE" },
    { name: "dragon status", risk: "SAFE" },
    { name: "dragon health", risk: "SAFE" },
    { name: "dragon whoami", risk: "SAFE" },
    { name: "dragon macro website-check", risk: "SAFE" },
    { name: "dragon macro security-audit", risk: "SAFE" },
    { name: "dragon macro daily-triage", risk: "SAFE" },
    { name: "dragon website status", risk: "SAFE" },
    { name: "dragon website analytics", risk: "LOW" },
    { name: "dragon website realtime", risk: "LOW" },
    { name: "dragon website pages", risk: "SAFE" },
    { name: "dragon team list", risk: "SAFE" },
    { name: "dragon team inspect", risk: "LOW" },
    { name: "dragon recruitment applications", risk: "SAFE" },
    { name: "dragon recruitment approve", risk: "HIGH" },
    { name: "dragon support tickets", risk: "SAFE" },
    { name: "dragon cms pages", risk: "SAFE" },
    { name: "dragon cms page", risk: "LOW" },
    { name: "dragon cms edit", risk: "HIGH" },
    { name: "dragon cms unpublish", risk: "HIGH" },
    { name: "dragon games list", risk: "SAFE" },
    { name: "dragon games get", risk: "SAFE" },
    { name: "dragon games publish", risk: "HIGH" },
    { name: "dragon content search", risk: "SAFE" },
    { name: "dragon content edit", risk: "HIGH" },
    { name: "dragon assets list", risk: "SAFE" },
    { name: "dragon downloads list", risk: "SAFE" },
    { name: "dragon security status", risk: "SAFE" },
    { name: "dragon audit recent", risk: "SAFE" },
    { name: "dragon database status", risk: "SAFE" },
    { name: "dragon database counts", risk: "SAFE" },
    { name: "dragon data full-purge", risk: "CRITICAL" },
    { name: "dragon files list", risk: "SAFE" },
    { name: "dragon files read", risk: "LOW" },
    { name: "dragon files create", risk: "HIGH" },
    { name: "dragon files delete", risk: "HIGH" },
    { name: "clear", risk: "SAFE" },
    { name: "cls", risk: "SAFE" },
    { name: "history", risk: "SAFE" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    setHistoryIndex(null);

    if (val.trim()) {
      const matches = COMMAND_DICTIONARY.filter(
        (c) => c.name.toLowerCase().startsWith(val.toLowerCase()) && c.name.toLowerCase() !== val.toLowerCase()
      );
      setSuggestions(matches);
      setActiveSuggestionIndex(0);
    } else {
      setSuggestions([]);
    }
  };

  const runCommand = async (cmdStr: string, confirmationPhrase?: string) => {
    if (!cmdStr.trim()) return;
    const trimmed = cmdStr.trim();
    const currentRisk = deriveCommandRisk(trimmed);

    // Client-side clear / cls
    if (trimmed.toLowerCase() === "clear" || trimmed.toLowerCase() === "cls") {
      setTabs((prev) =>
        prev.map((tab) => (tab.id === activeTabId ? { ...tab, history: [] } : tab))
      );
      setInputVal("");
      setSuggestions([]);
      return;
    }

    const inputLine: TerminalLine = {
      id: `in-${Date.now()}`,
      type: "input",
      text: trimmed,
      dangerLevel: currentRisk,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              history: [...tab.history, inputLine],
              commandHistory: [...tab.commandHistory, trimmed],
            }
          : tab
      )
    );

    setInputVal("");
    setSuggestions([]);
    setExecuting(true);

    try {
      const res = await fetch("/api/terminal/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: trimmed, confirmationPhrase }),
      });

      const data = await res.json();

      if (data.requiresConfirmation) {
        setConfirmModal({
          isOpen: true,
          command: trimmed,
          expectedPhrase: data.expectedPhrase,
          dangerLevel: data.dangerLevel,
        });
        setConfirmPhraseInput("");
        setExecuting(false);
        return;
      }

      const outputLine: TerminalLine = {
        id: `out-${Date.now()}`,
        type: data.exitCode === 0 ? "output" : "error",
        text: data.output,
        exitCode: data.exitCode,
        durationMs: data.durationMs,
        operationId: data.operationId,
        dangerLevel: data.dangerLevel || currentRisk,
        format: data.format,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, history: [...tab.history, outputLine] }
            : tab
        )
      );
    } catch (e) {
      const errorLine: TerminalLine = {
        id: `err-${Date.now()}`,
        type: "error",
        text: e instanceof Error ? e.message : "Network error executing terminal command.",
        exitCode: 1,
        dangerLevel: currentRisk,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, history: [...tab.history, errorLine] }
            : tab
        )
      );
    } finally {
      setExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl + K: Command Catalog Search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
      return;
    }

    // Ctrl + F: Output Stream Search
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      setOutputSearchOpen((prev) => !prev);
      return;
    }

    // Tab: Autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInputVal(suggestions[activeSuggestionIndex].name);
        setSuggestions([]);
      }
      return;
    }

    // Arrow Up: Previous Command
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const hist = activeTab.commandHistory;
      if (hist.length === 0) return;

      const nextIdx = historyIndex === null ? hist.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(hist[nextIdx] || "");
      return;
    }

    // Arrow Down: Next Command
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const hist = activeTab.commandHistory;
      if (historyIndex === null) return;

      const nextIdx = historyIndex + 1;
      if (nextIdx >= hist.length) {
        setHistoryIndex(null);
        setInputVal("");
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(hist[nextIdx]);
      }
      return;
    }

    // Enter: Execute
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(inputVal);
    }
  };

  // Workspace Operations
  const addNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: TerminalTab = {
      id: newId,
      title: `Workspace ${tabs.length + 1}`,
      commandHistory: [],
      history: [
        {
          id: `init-${newId}`,
          type: "system",
          text: `DRAGON TERMINAL Workspace [${newId}]\nType 'dragon help' for command catalog.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[0].id);
    }
  };

  const copyOutput = () => {
    const text = activeTab.history.map((h) => h.text).join("\n\n");
    navigator.clipboard.writeText(text);
  };

  const downloadLog = () => {
    const text = activeTab.history.map((h) => `[${h.timestamp}] ${h.text}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dragon_terminal_session_${activeTab.id}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered Output Stream based on Ctrl+F Output Search
  const displayHistory = outputSearchQuery
    ? activeTab.history.filter((line) => line.text.toLowerCase().includes(outputSearchQuery.toLowerCase()))
    : activeTab.history;

  // Active Prompt Risk
  const currentInputRisk = deriveCommandRisk(inputVal);
  const promptRiskMeta = getRiskIndicator(currentInputRisk);

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-hidden p-6 max-w-7xl mx-auto w-full flex flex-col font-mono gap-4">
          {/* Top Quick Favorites Bar */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 font-sans text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
              <Star className="size-3 text-amber-400 fill-amber-400" />
              Favorites:
            </span>
            {favorites.map((fav) => (
              <button
                key={fav}
                onClick={() => runCommand(fav)}
                className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] border border-slate-300 dark:border-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>{fav}</span>
              </button>
            ))}
          </div>

          {/* Terminal Container */}
          <div className="flex-1 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
            {/* Top Terminal Toolbar */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-10">
              {/* Left Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer select-none",
                      activeTabId === tab.id
                        ? "bg-slate-800 text-white border border-slate-700 shadow-xs"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    )}
                  >
                    <TerminalIcon className="size-3.5 text-emerald-400" />
                    <span>{tab.title}</span>
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => closeTab(tab.id, e)}
                        className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addNewTab}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Open New Terminal Workspace"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              {/* Center Status Indicators */}
              <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-400 font-semibold">ONLINE</span>
                </span>
                <span>•</span>
                <span>Identity: Executive Owner</span>
                <span>•</span>
                <span className="text-purple-400 font-semibold">OWNER ROOT</span>
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOutputSearchOpen((prev) => !prev)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                  title="Search Output Stream (Ctrl+F)"
                >
                  <Search className="size-3.5" />
                  <kbd className="hidden sm:inline px-1 py-0.5 text-[9px] bg-slate-800 rounded border border-slate-700">⌘F</kbd>
                </button>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                  title="Search Command Catalog (Ctrl+K)"
                >
                  <Layers className="size-3.5 text-emerald-400" />
                  <kbd className="hidden sm:inline px-1 py-0.5 text-[9px] bg-slate-800 rounded border border-slate-700">⌘K</kbd>
                </button>
                <button
                  onClick={copyOutput}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy Output Stream"
                >
                  <Copy className="size-3.5" />
                </button>
                <button
                  onClick={downloadLog}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Download Log File"
                >
                  <Download className="size-3.5" />
                </button>
                <button
                  onClick={() => runCommand("clear")}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear Screen (cls)"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* In-Terminal Output Stream Search Bar (Ctrl+F) */}
            {outputSearchOpen && (
              <div className="bg-slate-950 border-b border-slate-800 px-6 py-2 flex items-center justify-between gap-3 z-10 font-mono text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="size-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={outputSearchQuery}
                    onChange={(e) => setOutputSearchQuery(e.target.value)}
                    placeholder="Search terminal output text..."
                    className="w-full bg-transparent text-white focus:outline-none placeholder:text-slate-600"
                  />
                </div>
                <button onClick={() => setOutputSearchOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="size-4" />
                </button>
              </div>
            )}

            {/* Terminal Body Output Stream */}
            <div
              onClick={() => inputRef.current?.focus()}
              className="flex-1 p-6 overflow-y-auto space-y-4 text-xs font-mono select-text"
            >
              {displayHistory.map((line) => {
                const riskMeta = getRiskIndicator(line.dangerLevel || "SAFE");

                if (line.type === "system") {
                  return (
                    <div key={line.id} className="text-slate-400 whitespace-pre-wrap leading-relaxed p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      {line.text}
                    </div>
                  );
                }

                if (line.type === "input") {
                  return (
                    <div key={line.id} className="flex items-center gap-2.5 font-bold">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] border uppercase tracking-wider font-mono", riskMeta.bgClass, riskMeta.borderClass, riskMeta.textClass)}>
                        {riskMeta.badge}
                      </span>
                      <span className="text-purple-400">dragon@dragon-os:~$</span>
                      <span className="text-slate-100">{line.text}</span>
                    </div>
                  );
                }

                if (line.type === "error") {
                  return (
                    <div key={line.id} className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 whitespace-pre-wrap leading-relaxed space-y-1">
                      <div>{line.text}</div>
                      {line.exitCode !== undefined && (
                        <div className="text-[10px] text-rose-400 font-semibold">EXIT {line.exitCode}</div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={line.id} className="space-y-1">
                    <div className="text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">
                      {line.text}
                    </div>
                    {line.durationMs !== undefined && (
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                        {line.operationId && <span className="text-amber-400 font-semibold">{line.operationId}</span>}
                        {line.operationId && <span>•</span>}
                        <span>Command completed in {line.durationMs} ms</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">EXIT 0</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {executing && (
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono animate-pulse">
                  <RefreshCw className="size-3.5 animate-spin text-emerald-400" />
                  <span>Executing server command...</span>
                </div>
              )}

              <div ref={terminalEndRef} />
            </div>

            {/* Autocomplete Suggestion Popup */}
            {suggestions.length > 0 && (
              <div className="absolute bottom-14 left-6 z-20 bg-slate-950 border border-slate-800 rounded-2xl p-2 max-h-56 overflow-y-auto text-xs shadow-xl space-y-1 min-w-[320px]">
                {suggestions.map((sug, idx) => {
                  const sugRisk = getRiskIndicator(sug.risk);
                  return (
                    <button
                      key={sug.name}
                      onClick={() => {
                        setInputVal(sug.name);
                        setSuggestions([]);
                        inputRef.current?.focus();
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-mono transition-colors",
                        idx === activeSuggestionIndex ? "bg-slate-800 text-emerald-400 font-bold" : "text-slate-300 hover:text-white"
                      )}
                    >
                      <span className="truncate">{sug.name}</span>
                      <span className={cn("px-2 py-0.5 rounded text-[10px] border font-bold font-mono shrink-0 ml-2", sugRisk.bgClass, sugRisk.borderClass, sugRisk.textClass)}>
                        {sugRisk.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom Command Prompt Bar with Subtle Risk Indicator */}
            <div className="bg-slate-950 border-t border-slate-800 px-6 py-3.5 flex items-center gap-3">
              <span className={cn("px-2.5 py-0.5 rounded text-[10px] border font-bold font-mono uppercase tracking-wider shrink-0 transition-all", promptRiskMeta.bgClass, promptRiskMeta.borderClass, promptRiskMeta.textClass)}>
                {promptRiskMeta.badge}
              </span>
              <span className="text-purple-400 font-bold text-xs shrink-0">dragon@dragon-os:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type 'dragon help', 'dragon health', 'dragon website status', or 'd status'..."
                className="flex-1 bg-transparent text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none"
              />
              <button
                onClick={() => runCommand(inputVal)}
                disabled={!inputVal.trim() || executing}
                className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 transition-colors shadow-xs"
                title="Execute Command (Enter)"
              >
                <CornerDownLeft className="size-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* DANGEROUS COMMAND CONFIRMATION MODAL WITH RISK INDICATOR */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <AlertTriangle className="size-4" />
                <span>CONFIRMATION REQUIRED [{confirmModal.dangerLevel}]</span>
              </div>
              <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="p-1 text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 leading-relaxed font-sans">
                Notice: Command <span className="font-bold font-mono text-white">&apos;{confirmModal.command}&apos;</span> performs a server-side state mutation.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 space-y-1">
                <div>Type exact confirmation phrase:</div>
                <div className="font-bold text-amber-400 text-sm font-mono">{confirmModal.expectedPhrase}</div>
              </div>

              <input
                type="text"
                value={confirmPhraseInput}
                onChange={(e) => setConfirmPhraseInput(e.target.value)}
                placeholder={confirmModal.expectedPhrase}
                className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmModal({ ...confirmModal, isOpen: false });
                  runCommand(confirmModal.command, confirmPhraseInput);
                }}
                disabled={confirmPhraseInput.trim().toUpperCase() !== confirmModal.expectedPhrase.toUpperCase()}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-md"
              >
                Confirm & Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMAND SEARCH CATALOG MODAL (Ctrl + K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Search className="size-4 text-emerald-400" />
                <span>Command Catalog & Risk Matrix</span>
              </div>
              <button onClick={() => setSearchOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commands by name or category (e.g. 'health', 'macro', 'website')..."
              className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />

            <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
              {COMMAND_DICTIONARY.filter(
                (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((cmd) => {
                const cmdRisk = getRiskIndicator(cmd.risk);
                return (
                  <button
                    key={cmd.name}
                    onClick={() => {
                      setSearchOpen(false);
                      runCommand(cmd.name);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-emerald-400 flex items-center gap-2">
                        <span>{cmd.name}</span>
                        <span className={cn("px-2 py-0.5 rounded text-[9px] border font-bold uppercase", cmdRisk.bgClass, cmdRisk.borderClass, cmdRisk.textClass)}>
                          {cmdRisk.badge}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-slate-500" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TerminalWorkspacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-slate-400 bg-slate-950 min-h-screen">Loading Dragon Terminal...</div>}>
      <TerminalWorkspaceContent />
    </Suspense>
  );
}
