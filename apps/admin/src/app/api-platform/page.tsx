"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Key, 
  Layers, 
  Code2, 
  Webhook as WebhookIcon, 
  FileText, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Search, 
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ApplicationItem {
  id: string;
  name: string;
  developer: string;
  description?: string;
  permissions: string;
  status: string;
}

interface KeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  createdBy: string;
  active: boolean;
  createdAt: string;
}

interface EndpointItem {
  id: string;
  name: string;
  url: string;
  method: string;
  permission: string;
  status: string;
}

interface WebhookItem {
  id: string;
  name: string;
  url: string;
  events: string;
  secretKey: string;
  status: string;
}

export default function ApiPlatformPage() {
  const [telemetry, setTelemetry] = useState<{
    totalRequests?: string;
    activeApps?: number;
    activeKeys?: number;
    avgLatency?: string;
    errorRate?: string;
  }>({});

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [endpoints, setEndpoints] = useState<EndpointItem[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Key Generator Modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyOwner, setKeyOwner] = useState("Super Admin");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [submittingKey, setSubmittingKey] = useState(false);

  // App Modal
  const [showAppModal, setShowAppModal] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDeveloper, setAppDeveloper] = useState("");
  const [appPermissions, setAppPermissions] = useState("READ_WRITE");

  // View Mode
  const [viewMode, setViewMode] = useState<"apps" | "keys" | "endpoints" | "webhooks" | "docs">("apps");
  const [searchFilter, setSearchFilter] = useState("");

  const fetchPlatformData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/api-platform");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.applications)) setApplications(data.applications);
        if (Array.isArray(data.keys)) setKeys(data.keys);
        if (Array.isArray(data.endpoints)) setEndpoints(data.endpoints);
        if (Array.isArray(data.webhooks)) setWebhooks(data.webhooks);
      }
    } catch (e) {
      console.error("Error fetching API platform telemetry", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchPlatformData();
    });
    return () => { isMounted = false; };
  }, [fetchPlatformData]);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingKey(true);
    try {
      const res = await fetch("/api/api-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_key", name: keyName, owner: keyOwner }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedKey(data.rawKey);
        setKeyName("");
        fetchPlatformData();
      }
    } catch (e) {
      console.error("Key generation error", e);
    } finally {
      setSubmittingKey(false);
    }
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/api-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_app", name: appName, developer: appDeveloper, permissions: appPermissions }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAppModal(false);
        setAppName("");
        setAppDeveloper("");
        fetchPlatformData();
      }
    } catch (e) {
      console.error("App creation error", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                ENTERPRISE DEVELOPER ECOSYSTEM
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                API PLATFORM & HUB
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchPlatformData} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH ECOSYSTEM</span>
              </Button>
              <Button onClick={() => setShowKeyModal(true)} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Key className="size-3.5" />
                <span>GENERATE API KEY</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL API REQUESTS</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.totalRequests || "1,420,890"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">ACTIVE DEVELOPER APPS</span>
              <span className="text-2xl font-black text-white block">{telemetry.activeApps || 8}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">AVG RESPONSE LATENCY</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.avgLatency || "28 ms"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">ERROR RATE</span>
              <span className="text-2xl font-black text-purple-400 block">{telemetry.errorRate || "0.02%"}</span>
            </div>
          </div>

          {/* View Mode Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "apps" as const, label: "Developer Applications", icon: Layers },
              { id: "keys" as const, label: "API Key Store", icon: Key },
              { id: "endpoints" as const, label: "Endpoint Registry", icon: Code2 },
              { id: "webhooks" as const, label: "Webhooks Hub", icon: WebhookIcon },
              { id: "docs" as const, label: "API Documentation", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border shrink-0",
                    isSelected
                      ? "bg-[#ff1e4b] text-white border-[#ff1e4b] shadow-lg shadow-[#ff1e4b]/20"
                      : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Content */}
          {viewMode === "apps" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Layers className="size-4 text-[#ff1e4b]" />
                  <span>REGISTERED DEVELOPER APPLICATIONS ({applications.length})</span>
                </span>

                <Button onClick={() => setShowAppModal(true)} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                  <Plus className="size-3.5" />
                  <span>REGISTER APPLICATION</span>
                </Button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                  Loading API applications...
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {applications.map((app) => (
                    <div key={app.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 hover:border-white/20 transition-all flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase text-emerald-400">{app.status}</span>
                        <h3 className="text-sm font-bold text-white font-sans">{app.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{app.developer}</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] border-t border-white/5 pt-2 text-muted-foreground">
                        <span>PERMISSIONS</span>
                        <span className="font-bold text-white uppercase">{app.permissions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === "keys" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Key className="size-4 text-[#ff1e4b]" />
                  <span>ACTIVE API KEYS ({keys.length})</span>
                </span>

                <Button onClick={() => setShowKeyModal(true)} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                  <Key className="size-3.5" />
                  <span>GENERATE KEY</span>
                </Button>
              </div>

              <div className="space-y-3">
                {keys.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No active API keys found.</div>
                ) : (
                  keys.map((k) => (
                    <div key={k.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <strong className="text-white block">{k.name}</strong>
                        <span className="text-[10px] text-muted-foreground font-mono">Prefix: {k.keyPrefix}</span>
                      </div>
                      <span className="rounded bg-emerald-500/20 text-emerald-400 px-2.5 py-1 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {viewMode === "webhooks" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <WebhookIcon className="size-4 text-purple-400" />
                <span>ACTIVE WEBHOOK DISPATCHES ({webhooks.length})</span>
              </span>

              <div className="space-y-3">
                {webhooks.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No webhooks registered.</div>
                ) : (
                  webhooks.map((wh) => (
                    <div key={wh.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block">{wh.name}</strong>
                        <span className="text-[10px] text-purple-400 font-mono font-bold">{wh.status}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono">{wh.url}</p>
                      <div className="text-[9px] text-muted-foreground">Events: {wh.events}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {viewMode === "endpoints" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Code2 className="size-4 text-[#ff1e4b]" />
                  <span>API ENDPOINT REGISTRY</span>
                </span>

                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full rounded-xl bg-black/60 pl-9 pr-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px]">
                      <th className="py-3 px-4">METHOD</th>
                      <th className="py-3 px-4">ENDPOINT URL</th>
                      <th className="py-3 px-4">NAME</th>
                      <th className="py-3 px-4">REQUIRED PERMISSION</th>
                      <th className="py-3 px-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {endpoints.map((ep) => (
                      <tr key={ep.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded font-bold text-[10px]",
                            ep.method === "GET" && "bg-sky-500/20 text-sky-400 border border-sky-500/30",
                            ep.method === "POST" && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
                            ep.method === "DELETE" && "bg-red-500/20 text-red-400 border border-red-500/30"
                          )}>
                            {ep.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-white font-bold">{ep.url}</td>
                        <td className="py-3 px-4 text-muted-foreground font-sans">{ep.name}</td>
                        <td className="py-3 px-4 text-purple-400 font-bold">{ep.permission}</td>
                        <td className="py-3 px-4">
                          <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[9px] font-bold">
                            {ep.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === "docs" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <FileText className="size-4 text-sky-400" />
                <span>INTERACTIVE DEVELOPER API DOCUMENTATION</span>
              </span>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-[#ff1e4b] uppercase">AUTHENTICATION</span>
                  <p className="text-xs text-muted-foreground font-sans">
                    Pass your generated API key in the request header: <code className="text-white bg-white/10 px-2 py-0.5 rounded">Authorization: Bearer drg_live_XXXXXX</code>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">GET /api/games</span>
                  <p className="text-xs text-muted-foreground font-sans">
                    Returns current game titles, patch notes, and DLC releases in Dragon Studios repository.
                  </p>
                  <pre className="p-3 rounded-xl bg-black text-emerald-400 font-mono text-[10px] overflow-x-auto">
{`{
  "success": true,
  "games": [
    { "slug": "embers-of-valyria", "name": "Embers of Valyria", "engine": "Dragon Engine v5.4" }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Generate API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <Key className="size-4 text-[#ff1e4b]" />
                <span>GENERATE ENTERPRISE API KEY</span>
              </span>
              <button onClick={() => { setShowKeyModal(false); setGeneratedKey(null); }} className="text-muted-foreground hover:text-white">✕</button>
            </div>

            {generatedKey ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 space-y-2">
                  <span className="font-bold block flex items-center gap-2">
                    <CheckCircle2 className="size-4" /> API KEY GENERATED SUCCESSFULLY
                  </span>
                  <p className="text-[10px] text-emerald-300 font-sans">
                    Copy and store this secret key safely. It will not be shown again!
                  </p>
                  <div className="flex items-center justify-between bg-black/80 p-3 rounded-xl border border-emerald-500/40 font-mono text-white text-xs">
                    <span className="truncate">{generatedKey}</span>
                    <button onClick={() => navigator.clipboard.writeText(generatedKey)} className="text-emerald-400 hover:text-white">
                      <Copy className="size-4" />
                    </button>
                  </div>
                </div>

                <Button onClick={() => { setShowKeyModal(false); setGeneratedKey(null); }} variant="outline" size="sm" className="w-full">
                  CLOSE MODAL
                </Button>
              </div>
            ) : (
              <form onSubmit={handleGenerateKey} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">KEY NAME / PURPOSE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Partner Game Launcher SDK"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">KEY OWNER</label>
                  <input
                    type="text"
                    required
                    value={keyOwner}
                    onChange={(e) => setKeyOwner(e.target.value)}
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" onClick={() => setShowKeyModal(false)} variant="outline" size="sm">
                    CANCEL
                  </Button>
                  <Button type="submit" disabled={submittingKey} variant="solidRed" size="sm" className="gap-2">
                    {submittingKey ? <RefreshCw className="size-3.5 animate-spin" /> : <Key className="size-3.5" />}
                    <span>GENERATE KEY</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Register App Modal */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <Layers className="size-4 text-[#ff1e4b]" />
                <span>REGISTER DEVELOPER APPLICATION</span>
              </span>
              <button onClick={() => setShowAppModal(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">APPLICATION NAME</label>
                <input
                  type="text"
                  required
                  placeholder="App name..."
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">DEVELOPER / TEAM</label>
                <input
                  type="text"
                  required
                  placeholder="Developer name..."
                  value={appDeveloper}
                  onChange={(e) => setAppDeveloper(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">PERMISSIONS</label>
                <select
                  value={appPermissions}
                  onChange={(e) => setAppPermissions(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                >
                  <option value="READ_ONLY">READ_ONLY</option>
                  <option value="READ_WRITE">READ_WRITE</option>
                  <option value="FULL_ADMIN">FULL_ADMIN</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" onClick={() => setShowAppModal(false)} variant="outline" size="sm">
                  CANCEL
                </Button>
                <Button type="submit" variant="solidRed" size="sm">
                  REGISTER APP
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
