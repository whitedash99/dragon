"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { TrendingUp, Megaphone, Globe, Mail, Users, Plus, RefreshCw, Sparkles, Tag, CheckCircle2 } from "lucide-react";
import { GlassCard, GlassStat } from "@/components/ui/glass";

interface CampaignItem {
  id: string;
  name: string;
  type: string;
  audience: string;
  status: string;
  reach: number;
  createdAt: string;
}

interface PromotionItem {
  id: string;
  code: string;
  discount: string;
  status: string;
  createdAt: string;
}

export default function MarketingPage() {
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState({
    totalUsers: 0,
    totalPlayers: 0,
    totalStaff: 0,
    activeCampaigns: 0,
    totalDispatches: 0,
  });
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);

  // Create Campaign modal state
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campName, setCampName] = useState("");
  const [campType, setCampType] = useState("Product Launch");
  const [campAudience, setCampAudience] = useState("All Active Players");
  const [creatingCamp, setCreatingCamp] = useState(false);

  // AI Copywriting helper state
  const [aiTopic, setAiTopic] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const fetchMarketingData = useCallback(async () => {
    try {
      const res = await fetch("/api/marketing");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.telemetry) setTelemetry(data.telemetry);
          if (Array.isArray(data.campaigns)) setCampaigns(data.campaigns);
          if (Array.isArray(data.promotions)) setPromotions(data.promotions);
        }
      }
    } catch (e) {
      console.error("Failed to load marketing data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketingData();
  }, [fetchMarketingData]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) return;
    setCreatingCamp(true);

    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_campaign",
          name: campName.trim(),
          type: campType,
          audience: campAudience,
        }),
      });
      if (res.ok) {
        setCampName("");
        setShowCampaignModal(false);
        fetchMarketingData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingCamp(false);
    }
  };

  const handleGenerateAiCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;
    setGeneratingAi(true);

    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ai_copywriting",
          topic: aiTopic.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.copy) {
        setAiResult(data.copy);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider">Dragon Control • Growth & Marketing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Campaigns & Player Outreach</h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">Real-time database metrics for player growth, promotional campaigns, and AI dispatches.</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchMarketingData}
                className="p-2.5 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all cursor-pointer flex items-center gap-2 text-xs"
                title="Refresh Live Data"
              >
                <RefreshCw className="size-3.5 text-cyan-400" />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => setShowCampaignModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="size-3.5 text-black" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>

          {/* Real Live Database Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStat label="Real Registered Users" value={telemetry.totalUsers} icon={Users} trend="PostgreSQL Database" />
            <GlassStat label="Player Accounts" value={telemetry.totalPlayers} icon={Globe} trend="Active Players" />
            <GlassStat label="Active Campaigns" value={telemetry.activeCampaigns} icon={Megaphone} trend="Live In Database" />
            <GlassStat label="Total Dispatches" value={telemetry.totalDispatches} icon={Mail} trend="Verified Gateway" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Campaigns */}
            <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Megaphone className="size-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Campaigns ({campaigns.length})</h3>
                </div>
              </div>

              {campaigns.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">No campaigns recorded yet. Click &apos;New Campaign&apos; to create one.</div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-3.5 bg-[#02050E] rounded-xl border border-cyan-500/20 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{camp.name}</div>
                        <div className="text-[11px] text-slate-400">{camp.type} • Target: {camp.audience}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {camp.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* AI Copywriting Studio */}
            <GlassCard className="p-6 space-y-4 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] font-mono">
              <div className="flex items-center gap-2 pb-2 border-b border-cyan-500/20">
                <Sparkles className="size-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gemini Marketing Copywriter</h3>
              </div>

              <form onSubmit={handleGenerateAiCopy} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-cyan-400 font-bold">Game Title / Update Topic</label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. Uncharted Drive: Beyond v2.0 Open Highway Update"
                    className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={generatingAi}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {generatingAi ? <RefreshCw className="size-3.5 animate-spin text-cyan-400" /> : <Sparkles className="size-3.5 text-cyan-400" />}
                  <span>{generatingAi ? "Generating..." : "Generate AI Copy"}</span>
                </button>
              </form>

              {aiResult && (
                <div className="p-4 bg-[#02050E] rounded-xl border border-cyan-500/20 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {aiResult}
                </div>
              )}
            </GlassCard>
          </div>

          {/* New Campaign Modal */}
          {showCampaignModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono">
                <h3 className="text-base font-bold text-white">Create New Studio Campaign</h3>
                <form onSubmit={handleCreateCampaign} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-cyan-400 font-bold">Campaign Name *</label>
                    <input
                      type="text"
                      required
                      value={campName}
                      onChange={(e) => setCampName(e.target.value)}
                      placeholder="e.g. Uncharted Drive Global Launch"
                      className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-cyan-400 font-bold">Campaign Type</label>
                    <select
                      value={campType}
                      onChange={(e) => setCampType(e.target.value)}
                      className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Product Launch">Product Launch</option>
                      <option value="Update Announcement">Update Announcement</option>
                      <option value="Community Tournament">Community Tournament</option>
                      <option value="VIP Promotion">VIP Promotion</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowCampaignModal(false)}
                      className="flex-1 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 text-slate-400 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingCamp}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider"
                    >
                      {creatingCamp ? "Creating..." : "Create Campaign"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
