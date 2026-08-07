"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Bot, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  MessageSquare, 
  Zap, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ToolMode = "chat" | "content" | "seo" | "translate" | "ticket";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<ToolMode>("chat");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      let action = "completion";
      if (toolMode === "content") action = "generate_content";
      if (toolMode === "seo") action = "generate_seo";
      if (toolMode === "translate") action = "translate";
      if (toolMode === "ticket") action = "analyze_ticket";

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          prompt: prompt.trim(),
          text: prompt.trim(),
          targetLanguage: "Japanese",
          ticketData: toolMode === "ticket" ? {
            ticketId: "DRG-2026-000001",
            customerName: "Alex Vance",
            customerEmail: "alex@dragonstudios.com",
            category: "Technical Support",
            subject: "Embers of Valyria pre-order query",
            description: prompt.trim(),
          } : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.generatedContent) {
          setResponse(data.generatedContent);
        } else if (data.seo) {
          setResponse(`TITLE:\n${data.seo.title}\n\nDESCRIPTION:\n${data.seo.description}\n\nKEYWORDS:\n${data.seo.keywords}`);
        } else if (data.translatedText) {
          setResponse(data.translatedText);
        } else if (data.analysis) {
          setResponse(data.analysis);
        } else {
          setResponse(data.completion);
        }
      }
    } catch (err) {
      console.error("AI Generation error", err);
      setResponse("Error communicating with Google Gemini AI engine.");
    } finally {
      setLoading(false);
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
                ENTERPRISE COGNITIVE ENGINE
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                AI CENTER & GEMINI INTELLIGENCE
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400 border border-emerald-500/30 font-bold">
                GEMINI 2.5 CONNECTED
              </span>
            </div>
          </div>

          {/* Metric Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">MODEL LATENCY</span>
              <span className="text-lg font-black text-emerald-400 block">ONLINE (&lt; 0.3s)</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOKENS PROCESSED</span>
              <span className="text-lg font-black text-white block">142,500 TOKENS</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">SUGGESTED REPLIES</span>
              <span className="text-lg font-black text-[#ff1e4b] block">100% ACTIVE</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">SECURITY & PRIVACY</span>
              <span className="text-lg font-black text-sky-400 block">SERVER-SIDE API</span>
            </div>
          </div>

          {/* Main AI Workspace Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Controls & Tool Mode Selector */}
            <div className="lg:col-span-4 rounded-3xl glass-panel p-6 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase text-white block">SELECT AI MODULE MODE</span>

              <div className="space-y-2">
                {[
                  { id: "chat" as ToolMode, label: "Studio AI Chatbot", icon: Bot, desc: "Query dragon engine specs or studio knowledge" },
                  { id: "content" as ToolMode, label: "Content & Blog Generator", icon: FileText, desc: "Generate announcements, patch notes & blogs" },
                  { id: "ticket" as ToolMode, label: "Ticket Sentiment Analyzer", icon: MessageSquare, desc: "Analyze sentiment, urgency & draft suggested reply" },
                  { id: "seo" as ToolMode, label: "SEO Metadata Generator", icon: Sparkles, desc: "Generate title, meta description & JSON-LD keywords" },
                  { id: "translate" as ToolMode, label: "Multilingual Translation", icon: Globe, desc: "Translate text to Japanese, Spanish, or German" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = toolMode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setToolMode(item.id)}
                      className={cn(
                        "w-full flex flex-col gap-1 rounded-2xl p-4 text-left border transition-all",
                        isSelected
                          ? "bg-[#ff1e4b]/20 text-white border-[#ff1e4b] shadow-lg shadow-[#ff1e4b]/30"
                          : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/20 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn("size-4", isSelected ? "text-[#ff1e4b]" : "text-muted-foreground")} />
                        <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-sans">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Prompt & Output Console */}
            <div className="lg:col-span-8 rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-white">
                    AI PROMPT & CONTEXT INPUT
                  </label>
                  <span className="text-[10px] text-muted-foreground">MODE: {toolMode.toUpperCase()}</span>
                </div>

                <textarea
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    toolMode === "content"
                      ? "Enter announcement topic (e.g., Embers of Valyria pre-alpha playtest announcement)..."
                      : toolMode === "seo"
                      ? "Enter page topic for SEO generation..."
                      : toolMode === "ticket"
                      ? "Paste customer message to analyze urgency and generate reply..."
                      : "Ask Studio AI Assistant..."
                  }
                  className="w-full rounded-2xl bg-black/60 p-4 text-xs font-mono text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b] resize-y"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    variant="solidRed"
                    size="md"
                    className="gap-2 text-xs"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        <span>PROCESSING AI PIPELINE...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="size-4" />
                        <span>EXECUTE GEMINI AI</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* AI Output Result Console */}
              {response && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <span className="text-xs font-bold text-emerald-400 uppercase block">AI GENERATION OUTPUT</span>
                  <div className="rounded-2xl bg-black/80 p-5 border border-white/15 text-xs text-white leading-relaxed whitespace-pre-wrap">
                    {response}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
