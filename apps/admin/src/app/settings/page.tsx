"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Settings, 
  Globe, 
  Mail, 
  Bot, 
  Database, 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  Check, 
  Lock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { cn } from "@/lib/utils/cn";

interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  description?: string;
}

interface IntegrationItem {
  id: string;
  name: string;
  provider: string;
  status: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagItem[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "email" | "ai" | "storage" | "integrations">("general");

  const [formCompany, setFormCompany] = useState("Dragon Studios");
  const [formTimezone, setFormTimezone] = useState("UTC-5 (Eastern Time)");
  const [formSmtpHost, setFormSmtpHost] = useState("smtp.dragonstudios.com");
  const [formSenderEmail, setFormSenderEmail] = useState("support@dragonstudios.com");
  const [formAiModel, setFormAiModel] = useState("gemini-2.5-flash");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        if (data.settings) {
          setFormCompany(data.settings.companyName || "Dragon Studios");
          setFormTimezone(data.settings.timezone || "UTC-5 (Eastern Time)");
          setFormSmtpHost(data.settings.smtpHost || "smtp.dragonstudios.com");
          setFormSenderEmail(data.settings.senderEmail || "support@dragonstudios.com");
          setFormAiModel(data.settings.defaultAiModel || "gemini-2.5-flash");
        }
        if (Array.isArray(data.featureFlags)) setFeatureFlags(data.featureFlags);
        if (Array.isArray(data.integrations)) setIntegrations(data.integrations);
      }
    } catch (e) {
      console.error("Error fetching settings", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchSettings();
    });
    return () => { isMounted = false; };
  }, [fetchSettings]);

  const handleToggleFlag = async (key: string, currentVal: boolean) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_flag", key, enabled: !currentVal }),
      });
      const data = await res.json();
      if (data.success) fetchSettings();
    } catch (e) {
      console.error("Toggle flag error", e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formCompany,
          timezone: formTimezone,
          smtpHost: formSmtpHost,
          senderEmail: formSenderEmail,
          defaultAiModel: formAiModel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        fetchSettings();
      }
    } catch (err) {
      console.error("Save settings error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 font-sans text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                SYSTEM CONTROL PANEL
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Settings & System Integrations
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchSettings} variant="outline" size="sm" className="rounded-xl text-xs gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs">
                <RefreshCw className="size-3.5 text-slate-500" />
                <span>Refresh Config</span>
              </Button>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" /> Configurations saved & persisted to Neon PostgreSQL.
            </div>
          )}

          {/* Configuration Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3">
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
                    "rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all border shrink-0 font-mono",
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Form Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase text-slate-900 flex items-center gap-2 font-mono">
                  <Settings className="size-4 text-slate-600" />
                  <span>Core Platform Specifications</span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  {saving ? (
                    <span className="text-amber-700 flex items-center gap-1 font-semibold">
                      <RefreshCw className="size-3 animate-spin" /> Saving...
                    </span>
                  ) : saveSuccess ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="size-3" /> Saved ✓
                    </span>
                  ) : (
                    <span className="text-slate-400">Saved to DB</span>
                  )}
                </div>
              </div>

              {/* Appearance & Theme Governance Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4 font-mono">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Admin OS Theme Preference</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Switch between Light, Dark, or System automatic theme adaptation.</div>
                </div>
                <ThemeSwitcher />
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Company Identity</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">System Timezone</label>
                    <input
                      type="text"
                      value={formTimezone}
                      onChange={(e) => setFormTimezone(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">AI Default Model</label>
                    <input
                      type="text"
                      value={formAiModel}
                      onChange={(e) => setFormAiModel(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">SMTP Host</label>
                    <input
                      type="text"
                      value={formSmtpHost}
                      onChange={(e) => setFormSmtpHost(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Default Sender Email</label>
                    <input
                      type="email"
                      value={formSenderEmail}
                      onChange={(e) => setFormSenderEmail(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={saving} variant="solidRed" size="md" className="gap-2 bg-slate-900 text-white hover:bg-slate-800 border-none shadow-xs rounded-xl">
                    {saving ? <RefreshCw className="size-4 animate-spin" /> : <Check className="size-4" />}
                    <span>SAVE CONFIGURATION MATRIX</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Integrations & Feature Flags Panel */}
            <div className="lg:col-span-5 space-y-6 font-sans">
              {/* Feature Flags Panel */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
                <span className="text-xs font-bold uppercase text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 font-mono">
                  <Sliders className="size-4 text-emerald-600" />
                  <span>Studio Feature Flags</span>
                </span>

                <div className="space-y-3">
                  {loading ? (
                    <div className="py-6 text-center text-slate-400 text-xs font-mono">
                      Loading feature flags...
                    </div>
                  ) : (
                    featureFlags.map((flag) => (
                      <div key={flag.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <strong className="text-slate-900 text-xs block font-semibold">{flag.name}</strong>
                          <p className="text-[11px] text-slate-500">{flag.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggleFlag(flag.key, flag.enabled)}
                          className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase transition-colors shrink-0 border",
                            flag.enabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                          )}
                        >
                          {flag.enabled ? "ENABLED" : "DISABLED"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Integrations Status */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
                <span className="text-xs font-bold uppercase text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 font-mono">
                  <Lock className="size-4 text-sky-600" />
                  <span>Connected Services</span>
                </span>

                <div className="space-y-2 font-mono">
                  {integrations.map((integ) => (
                    <div key={integ.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{integ.name}</span>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="size-3 text-emerald-600" /> {integ.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
