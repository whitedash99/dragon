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
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                SYSTEM CONTROL PANEL
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                SETTINGS & INTEGRATIONS
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchSettings} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH CONFIGURATIONS</span>
              </Button>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" /> SYSTEM CONFIGURATIONS SAVED & PERSISTED TO POSTGRESQL
            </div>
          )}

          {/* Configuration Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
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

          {/* Settings Form Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Settings className="size-4 text-[#ff1e4b]" />
                <span>CORE SYSTEM CONFIGURATION SPECIFICATION</span>
              </span>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">COMPANY IDENTITY</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">SYSTEM TIMEZONE</label>
                    <input
                      type="text"
                      value={formTimezone}
                      onChange={(e) => setFormTimezone(e.target.value)}
                      className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">AI DEFAULT MODEL</label>
                    <input
                      type="text"
                      value={formAiModel}
                      onChange={(e) => setFormAiModel(e.target.value)}
                      className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">SMTP HOST</label>
                    <input
                      type="text"
                      value={formSmtpHost}
                      onChange={(e) => setFormSmtpHost(e.target.value)}
                      className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">DEFAULT SENDER EMAIL</label>
                    <input
                      type="email"
                      value={formSenderEmail}
                      onChange={(e) => setFormSenderEmail(e.target.value)}
                      className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={saving} variant="solidRed" size="md" className="gap-2">
                    {saving ? <RefreshCw className="size-4 animate-spin" /> : <Check className="size-4" />}
                    <span>SAVE CONFIGURATION MATRIX</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Integrations & Feature Flags Panel */}
            <div className="lg:col-span-5 space-y-6">
              {/* Feature Flags Panel */}
              <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-4">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Sliders className="size-4 text-emerald-400" />
                  <span>STUDIO FEATURE FLAGS</span>
                </span>

                <div className="space-y-3">
                  {loading ? (
                    <div className="py-6 text-center text-muted-foreground text-xs">
                      Loading feature flags...
                    </div>
                  ) : (
                    featureFlags.map((flag) => (
                      <div key={flag.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <strong className="text-white text-xs block font-sans">{flag.name}</strong>
                          <p className="text-[10px] text-muted-foreground">{flag.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggleFlag(flag.key, flag.enabled)}
                          className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-colors shrink-0 border",
                            flag.enabled ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-white/5 text-muted-foreground border-white/10"
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
              <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-4">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Lock className="size-4 text-sky-400" />
                  <span>CONNECTED ENTERPRISE SERVICES</span>
                </span>

                <div className="space-y-2">
                  {integrations.map((integ) => (
                    <div key={integ.id} className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{integ.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> {integ.status}
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
