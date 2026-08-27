"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  Settings,
  Globe,
  Sliders,
  CheckCircle2,
  Lock,
  RefreshCw,
  Mail,
  Bot,
  Database,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Integration {
  id: string;
  name: string;
  provider: string;
  status: string;
  enabled: boolean;
}

interface SystemConfig {
  companyName: string;
  timezone: string;
  aiDefaultModel: string;
  smtpHost: string;
  senderEmail: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "email" | "ai" | "storage" | "integrations">("general");
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    companyName: "Dragon Gaming Studios",
    timezone: "UTC",
    aiDefaultModel: "gemini-2.5-flash",
    smtpHost: "smtp.resend.com",
    senderEmail: "verify@dragonstudios.com",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [formCompany, setFormCompany] = useState("");
  const [formTimezone, setFormTimezone] = useState("");
  const [formAiModel, setFormAiModel] = useState("");
  const [formSmtpHost, setFormSmtpHost] = useState("");
  const [formSenderEmail, setFormSenderEmail] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        setFeatureFlags(data.featureFlags || []);
        setIntegrations(data.integrations || []);
        if (data.config) {
          setSystemConfig(data.config);
          setFormCompany(data.config.companyName || "Dragon Gaming Studios");
          setFormTimezone(data.config.timezone || "UTC");
          setFormAiModel(data.config.aiDefaultModel || "gemini-2.5-flash");
          setFormSmtpHost(data.config.smtpHost || "smtp.resend.com");
          setFormSenderEmail(data.config.senderEmail || "verify@dragonstudios.com");
        }
      }
    } catch (err) {
      console.error("Fetch settings error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggleFlag = async (flagKey: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleFlag",
          flagKey,
          enabled: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeatureFlags((prev) =>
          prev.map((f) => (f.key === flagKey ? { ...f, enabled: !currentStatus } : f))
        );
      }
    } catch (err) {
      console.error("Toggle flag error", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateConfig",
          config: {
            companyName: formCompany,
            timezone: formTimezone,
            aiDefaultModel: formAiModel,
            smtpHost: formSmtpHost,
            senderEmail: formSenderEmail,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save settings error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400/80 uppercase tracking-wider mb-1">
                SYSTEM CONTROL PANEL
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Settings & System Integrations
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchSettings}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                <RefreshCw className="size-3.5 text-cyan-400" />
                <span>Refresh Config</span>
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-bold flex items-center gap-2 text-xs font-mono">
              <CheckCircle2 className="size-4 text-emerald-400" /> Configurations saved & persisted to Neon PostgreSQL.
            </div>
          )}

          {/* Configuration Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-cyan-500/20 pb-3">
            {[
              { id: "general" as const, label: "General & Studio", icon: Globe },
              { id: "email" as const, label: "Email & SMTP", icon: Mail },
              { id: "ai" as const, label: "AI Engine", icon: Bot },
              { id: "storage" as const, label: "Storage & DB", icon: Database },
              { id: "integrations" as const, label: "Integrations & Flags", icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all border shrink-0 cursor-pointer",
                    isSelected
                      ? "bg-cyan-500/25 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                      : "bg-[#03091D] text-slate-400 border-cyan-500/20 hover:text-white hover:border-cyan-500/40"
                  )}
                >
                  <Icon className="size-3.5 text-cyan-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Form Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2 font-mono">
                  <Settings className="size-4 text-cyan-400" />
                  <span>Core Platform Specifications</span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  {saving ? (
                    <span className="text-amber-400 flex items-center gap-1 font-semibold">
                      <RefreshCw className="size-3 animate-spin" /> Saving...
                    </span>
                  ) : saveSuccess ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="size-3" /> Saved ✓
                    </span>
                  ) : (
                    <span className="text-slate-500">Saved to DB</span>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 font-mono">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-cyan-400 font-mono">Company Identity</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full rounded-xl bg-[#02050E] px-3.5 py-2.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-cyan-400 font-mono">System Timezone</label>
                    <input
                      type="text"
                      value={formTimezone}
                      onChange={(e) => setFormTimezone(e.target.value)}
                      className="w-full rounded-xl bg-[#02050E] px-3.5 py-2.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-cyan-400 font-mono">AI Default Model</label>
                    <input
                      type="text"
                      value={formAiModel}
                      onChange={(e) => setFormAiModel(e.target.value)}
                      className="w-full rounded-xl bg-[#02050E] px-3.5 py-2.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-cyan-400 font-mono">SMTP Host</label>
                    <input
                      type="text"
                      value={formSmtpHost}
                      onChange={(e) => setFormSmtpHost(e.target.value)}
                      className="w-full rounded-xl bg-[#02050E] px-3.5 py-2.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-cyan-400 font-mono">Default Sender Email</label>
                    <input
                      type="email"
                      value={formSenderEmail}
                      onChange={(e) => setFormSenderEmail(e.target.value)}
                      className="w-full rounded-xl bg-[#02050E] px-3.5 py-2.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="size-4 animate-spin" /> : <Check className="size-4" />}
                    <span>SAVE CONFIGURATION MATRIX</span>
                  </button>
                </div>
              </form>
            </GlassCard>

            {/* Integrations & Feature Flags Panel */}
            <div className="lg:col-span-5 space-y-6">
              {/* Feature Flags Panel */}
              <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-cyan-500/20 pb-3 font-mono">
                  <Sliders className="size-4 text-cyan-400" />
                  <span>Studio Feature Flags</span>
                </span>

                <div className="space-y-3 font-mono">
                  {loading ? (
                    <div className="py-6 text-center text-slate-500 text-xs font-mono">
                      Loading feature flags...
                    </div>
                  ) : (
                    featureFlags.map((flag) => (
                      <div key={flag.id} className="p-3.5 rounded-xl bg-[#02050E] border border-cyan-500/20 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <strong className="text-white text-xs block font-bold font-mono">{flag.name}</strong>
                          <p className="text-[11px] text-slate-400 font-mono">{flag.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggleFlag(flag.key, flag.enabled)}
                          className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase transition-colors shrink-0 border cursor-pointer",
                            flag.enabled ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-[#03091D] text-slate-500 border-cyan-500/20"
                          )}
                        >
                          {flag.enabled ? "ENABLED" : "DISABLED"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>

              {/* Integrations Status */}
              <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-cyan-500/20 pb-3 font-mono">
                  <Lock className="size-4 text-cyan-400" />
                  <span>Connected Services</span>
                </span>

                <div className="space-y-2 font-mono">
                  {integrations.map((integ) => (
                    <div key={integ.id} className="p-3 rounded-xl bg-[#02050E] border border-cyan-500/20 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{integ.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        <CheckCircle2 className="size-3 text-emerald-400" /> {integ.status}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
