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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans select-none overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        {/* WORKSPACE LAYOUT */}
        <main className="flex-1 flex overflow-hidden font-sans">
          {/* LEFT PANEL — Mode Selector */}
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 p-4 space-y-4 font-mono">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              AI Module Mode
            </div>

            <div className="space-y-1">
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
                      "w-full text-left p-3 rounded-xl border text-xs transition-all space-y-1 font-bold",
                      isSelected ? "bg-slate-900 text-white border-slate-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
          <section className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
            <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl mx-auto w-full">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-4",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="size-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={cn(
                      "p-4 rounded-2xl text-xs leading-relaxed border font-sans shadow-xs",
                      msg.role === "user"
                        ? "bg-slate-900 border-slate-900 text-white font-medium max-w-xl"
                        : "bg-white border-slate-200 text-slate-900 max-w-2xl font-sans"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center text-slate-500 text-xs font-mono">
                  <RefreshCw className="size-3.5 animate-spin text-slate-700" />
                  <span>Gemini AI processing...</span>
                </div>
              )}
            </div>

            {/* Input Console */}
            <form onSubmit={handleGenerate} className="p-6 border-t border-slate-200 bg-white max-w-4xl mx-auto w-full font-sans">
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
                  placeholder="Ask Gemini AI or input text..."
                  className="w-full rounded-2xl bg-slate-50 p-4 pr-12 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:border-slate-400 resize-none font-sans"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="absolute right-3 bottom-3.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 transition-all shadow-xs"
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
