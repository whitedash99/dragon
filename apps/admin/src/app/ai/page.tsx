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
  FileText,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToolMode = "chat" | "content" | "seo" | "translate" | "ticket";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    { role: "assistant", text: "Welcome to Dragon AI Center. Powered by Google Gemini AI. How can I assist you?" }
  ]);
  const [toolMode, setToolMode] = useState<ToolMode>("chat");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

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
          prompt: userMsg,
          text: userMsg,
          targetLanguage: "Japanese",
        }),
      });

      const data = await res.json();
      let aiText = "Error generating response from Gemini API.";

      if (data.success) {
        if (data.generatedContent) aiText = data.generatedContent;
        else if (data.seo) aiText = `Title: ${data.seo.title}\nDescription: ${data.seo.description}\nKeywords: ${data.seo.keywords}`;
        else if (data.translatedText) aiText = data.translatedText;
        else if (data.analysis) aiText = data.analysis;
        else if (data.completion) aiText = data.completion;
      }

      setChatHistory((prev) => [...prev, { role: "assistant", text: aiText }]);
    } catch (err) {
      console.error("AI error", err);
      setChatHistory((prev) => [...prev, { role: "assistant", text: "Error connecting to Gemini API service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#02040A] text-slate-100 font-sans select-none overflow-hidden font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        {/* WORKSPACE LAYOUT */}
        <main className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL — Mode Selector */}
          <aside className="w-64 bg-[#03091D]/95 border-r border-cyan-500/20 flex flex-col shrink-0 p-4 space-y-4 font-mono shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
              <span>Gemini AI Engine</span>
            </div>

            <div className="space-y-1.5">
              {[
                { id: "chat" as ToolMode, label: "Studio Assistant", icon: Bot },
                { id: "content" as ToolMode, label: "Content Generator", icon: FileText },
                { id: "ticket" as ToolMode, label: "Ticket Sentiment", icon: MessageSquare },
                { id: "seo" as ToolMode, label: "SEO Generator", icon: Sparkles },
                { id: "translate" as ToolMode, label: "Translation Engine", icon: Globe },
              ].map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = toolMode === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setToolMode(tmpl.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border text-xs transition-all space-y-1 font-bold cursor-pointer",
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                        : "bg-[#02050E] border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-500/40"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="size-3.5" />
                      <span>{tmpl.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CENTER CHAT CANVAS */}
          <section className="flex-1 flex flex-col min-w-0 bg-[#02040A] relative">
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-cyan-500/20">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-4",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="size-8 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7C3CFF] text-[#020617] flex items-center justify-center font-black text-xs shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                      AI
                    </div>
                  )}

                  <div
                    className={cn(
                      "p-4 rounded-2xl text-xs leading-relaxed border shadow-[0_4px_20px_rgba(0,0,0,0.6)] font-mono",
                      msg.role === "user"
                        ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-200 max-w-xl"
                        : "bg-[#03091D]/90 border-cyan-500/25 text-slate-200 max-w-2xl"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center text-cyan-400 text-xs font-mono animate-pulse">
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Google Gemini 1.5 Flash synthesizing intelligence...</span>
                </div>
              )}
            </div>

            {/* Input Console */}
            <form onSubmit={handleGenerate} className="p-4 sm:p-6 border-t border-cyan-500/20 bg-[#03091D]/95 max-w-4xl mx-auto w-full">
              <div className="relative">
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate(e);
                    }
                  }}
                  placeholder="Ask Gemini AI or input studio copy to generate, analyze, or translate..."
                  className="w-full rounded-2xl bg-[#02050E] p-4 pr-12 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 resize-none font-mono"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="absolute right-3 bottom-3.5 p-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3CFF] text-[#020617] font-bold disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
