"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Megaphone, 
  Users, 
  Tag, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  Send, 
  Search, 
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface CampaignItem {
  id: string;
  name: string;
  type: string;
  audience: string;
  status: string;
  reach: number;
  openRate: number;
  clickRate: number;
  conversions: number;
}

interface AudienceItem {
  id: string;
  name: string;
  description?: string;
  size: number;
}

interface PromotionItem {
  id: string;
  code: string;
  discount: string;
  usageLimit: number;
  usageCount: number;
  status: string;
}

export default function MarketingPage() {
  const [telemetry, setTelemetry] = useState<{
    activeCampaigns?: number;
    totalReach?: string;
    emailSent?: string;
    openRate?: string;
    clickRate?: string;
    conversions?: string;
  }>({});

  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [audiences, setAudiences] = useState<AudienceItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Copywriter State
  const [copyTopic, setCopyTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("Core Gamers");
  const [aiCopy, setAiCopy] = useState<string | null>(null);
  const [generatingCopy, setGeneratingCopy] = useState(false);

  // Campaign Modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campName, setCampName] = useState("");
  const [campType, setCampType] = useState("Product Launch");
  const [campAudience, setCampAudience] = useState("All Active Players");
  const [submittingCamp, setSubmittingCamp] = useState(false);

  // View Mode
  const [viewMode, setViewMode] = useState<"campaigns" | "ai" | "audiences" | "promotions">("campaigns");
  const [searchFilter, setSearchFilter] = useState("");

  const fetchMarketingData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketing");
      const data = await res.json();
      if (data.success) {
        if (data.telemetry) setTelemetry(data.telemetry);
        if (Array.isArray(data.campaigns)) setCampaigns(data.campaigns);
        if (Array.isArray(data.audiences)) setAudiences(data.audiences);
        if (Array.isArray(data.promotions)) setPromotions(data.promotions);
      }
    } catch (e) {
      console.error("Error fetching marketing data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchMarketingData();
    });
    return () => { isMounted = false; };
  }, [fetchMarketingData]);

  const handleGenerateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyTopic.trim()) return;

    setGeneratingCopy(true);
    setAiCopy(null);
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ai_copywriting", topic: copyTopic, targetAudience }),
      });
      const data = await res.json();
      if (data.success) setAiCopy(data.copy);
    } catch (e) {
      console.error("AI Copywriting error", e);
    } finally {
      setGeneratingCopy(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCamp(true);
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_campaign", name: campName, type: campType, audience: campAudience }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCampaignModal(false);
        setCampName("");
        fetchMarketingData();
      }
    } catch (e) {
      console.error("Create campaign error", e);
    } finally {
      setSubmittingCamp(false);
    }
  };

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.type.toLowerCase().includes(searchFilter.toLowerCase())
  );

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
                ENTERPRISE GROWTH & ENGAGEMENT
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                MARKETING CENTER
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchMarketingData} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH DATA</span>
              </Button>
              <Button onClick={() => setShowCampaignModal(true)} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Plus className="size-3.5" />
                <span>NEW CAMPAIGN</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">ACTIVE CAMPAIGNS</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.activeCampaigns || 12}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL AUDIENCE REACH</span>
              <span className="text-2xl font-black text-white block">{telemetry.totalReach || "480,000"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">EMAIL OPEN RATE</span>
              <span className="text-2xl font-black text-sky-400 block">{telemetry.openRate || "42.8%"}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL CONVERSIONS</span>
              <span className="text-2xl font-black text-purple-400 block">{telemetry.conversions || "24,200"}</span>
            </div>
          </div>

          {/* View Mode Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
            {[
              { id: "campaigns" as const, label: "Marketing Campaigns", icon: Megaphone },
              { id: "ai" as const, label: "AI Copywriting Studio", icon: Sparkles },
              { id: "audiences" as const, label: "Audience Segments", icon: Users },
              { id: "promotions" as const, label: "Promotions & Discounts", icon: Tag },
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

          {/* View Mode Content */}
          {viewMode === "campaigns" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Megaphone className="size-4 text-[#ff1e4b]" />
                  <span>ACTIVE MARKETING CAMPAIGNS ({filteredCampaigns.length})</span>
                </span>

                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full rounded-xl bg-black/60 pl-9 pr-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                  Loading marketing campaigns...
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCampaigns.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 hover:border-white/20 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase text-[#ff1e4b]">{c.type}</span>
                          <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 font-bold text-[9px] uppercase">
                            {c.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white font-sans">{c.name}</h3>
                        <p className="text-[10px] text-muted-foreground">Target: {c.audience}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-[10px] text-center">
                        <div className="p-1 rounded bg-white/5">
                          <span className="text-muted-foreground block text-[8px]">REACH</span>
                          <span className="font-bold text-white">{c.reach.toLocaleString()}</span>
                        </div>
                        <div className="p-1 rounded bg-white/5">
                          <span className="text-muted-foreground block text-[8px]">OPEN %</span>
                          <span className="font-bold text-sky-400">{c.openRate}%</span>
                        </div>
                        <div className="p-1 rounded bg-white/5">
                          <span className="text-muted-foreground block text-[8px]">CONVERSIONS</span>
                          <span className="font-bold text-emerald-400">{c.conversions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === "ai" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Sparkles className="size-4 text-purple-400" />
                <span>GEMINI 2.5 AI COPYWRITING STUDIO</span>
              </span>

              <form onSubmit={handleGenerateCopy} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">CAMPAIGN / PRODUCT TOPIC</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Embers of Valyria v2.0 Expansion Release..."
                      value={copyTopic}
                      onChange={(e) => setCopyTopic(e.target.value)}
                      className="w-full rounded-xl bg-black/60 px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">TARGET AUDIENCE</label>
                    <input
                      type="text"
                      required
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full rounded-xl bg-black/60 px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={generatingCopy} variant="solidRed" size="md" className="gap-2">
                  {generatingCopy ? <RefreshCw className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  <span>GENERATE AI MARKETING COPY</span>
                </Button>
              </form>

              {aiCopy && (
                <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-white uppercase text-xs flex items-center gap-2">
                      <Sparkles className="size-4 text-purple-400" /> GEMINI AI COPY OUTPUT
                    </span>
                    <button onClick={() => navigator.clipboard.writeText(aiCopy)} className="text-purple-400 hover:text-white flex items-center gap-1 text-[10px]">
                      <Copy className="size-3.5" /> COPY TO CLIPBOARD
                    </button>
                  </div>
                  <p className="text-sm font-sans leading-relaxed text-white/90 whitespace-pre-wrap">{aiCopy}</p>
                </div>
              )}
            </div>
          )}

          {viewMode === "audiences" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <Users className="size-4 text-[#ff1e4b]" />
                <span>AUDIENCE SEGMENTS ({audiences.length})</span>
              </span>

              <div className="grid gap-4 sm:grid-cols-3">
                {audiences.map((aud) => (
                  <div key={aud.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white font-sans">{aud.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{aud.description}</p>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">TOTAL PLAYERS</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">{aud.size.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "promotions" && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <Tag className="size-4 text-emerald-400" />
                <span>ACTIVE PROMOTIONAL CODES ({promotions.length})</span>
              </span>

              <div className="grid gap-4 sm:grid-cols-2">
                {promotions.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <strong className="text-white font-mono text-base block text-[#ff1e4b]">{p.code}</strong>
                      <span className="text-xs text-muted-foreground font-sans">{p.discount}</span>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[9px] font-bold uppercase block">
                        {p.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono block">
                        {p.usageCount} / {p.usageLimit} Used
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <Megaphone className="size-4 text-[#ff1e4b]" />
                <span>LAUNCH MARKETING CAMPAIGN</span>
              </span>
              <button onClick={() => setShowCampaignModal(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">CAMPAIGN NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Campaign title..."
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">CAMPAIGN TYPE</label>
                <select
                  value={campType}
                  onChange={(e) => setCampType(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                >
                  <option value="Product Launch">Product Launch</option>
                  <option value="Game Announcement">Game Announcement</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Community Event">Community Event</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">TARGET AUDIENCE</label>
                <select
                  value={campAudience}
                  onChange={(e) => setCampAudience(e.target.value)}
                  className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                >
                  <option value="All Active Players">All Active Players</option>
                  <option value="Registered Developers">Registered Developers</option>
                  <option value="Inactive Players">Inactive Players</option>
                  <option value="VIP Dragon Pass Holders">VIP Dragon Pass Holders</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" onClick={() => setShowCampaignModal(false)} variant="outline" size="sm">
                  CANCEL
                </Button>
                <Button type="submit" disabled={submittingCamp} variant="solidRed" size="sm" className="gap-2">
                  {submittingCamp ? <RefreshCw className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                  <span>LAUNCH CAMPAIGN</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
