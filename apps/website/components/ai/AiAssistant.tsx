"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, X, Send, Trash2, ArrowRight, Gamepad2, ChevronRight } from "lucide-react";
import { useAi } from "@/providers/ai-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function AiAssistant() {
  const { isOpen, setIsOpen, messages, isThinking, sendMessage, clearChat } = useAi();
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-gradient-to-br from-dragon-500 via-neon-purple to-neon-cyan text-white shadow-2xl shadow-dragon-500/50 border border-white/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        aria-label="Toggle Dragon Assistant"
      >
        <Sparkles className="size-5 lg:size-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-cyan"></span>
        </span>
      </button>

      {/* Expandable Docked Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 lg:bottom-24 right-3 lg:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 rounded-3xl glass-heavy p-4 sm:p-6 border border-white/20 shadow-2xl overflow-hidden flex flex-col h-[480px] sm:h-[520px]"
          >
            {/* Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-dragon-400 to-neon-purple text-white border border-white/20 shadow">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-white flex items-center gap-1.5">
                    <span>Dragon Assistant</span>
                    <span className="rounded-full bg-dragon-500/20 px-2 py-0.5 text-[9px] font-bold text-dragon-300">
                      v1.0
                    </span>
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-mono">Context-Aware AI Assistant</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="size-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-primary text-white rounded-br-none"
                      : "mr-auto glass-md text-white border border-white/10 rounded-bl-none"
                  )}
                >
                  <span>{msg.content}</span>

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && (
                    <div className="mt-2.5 space-y-1.5 pt-2 border-t border-white/10">
                      {msg.suggestedActions.map((action, idx) => (
                        <div key={idx}>
                          {action.href ? (
                            <Link
                              href={action.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-dragon-300 hover:bg-white/20 transition-colors"
                            >
                              <span>{action.label}</span>
                              <ChevronRight className="size-3" />
                            </Link>
                          ) : (
                            <button
                              onClick={() => sendMessage(action.label)}
                              className="w-full text-left rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-dragon-300 hover:bg-white/20 transition-colors"
                            >
                              {action.label}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="mt-1 text-[9px] text-muted-foreground self-end font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isThinking && (
                <div className="mr-auto glass-md text-white border border-white/10 rounded-2xl p-3 text-xs flex items-center gap-2">
                  <Sparkles className="size-3.5 text-dragon-400 animate-spin" />
                  <span className="text-muted-foreground font-mono">Dragon Assistant is computing...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="mt-3 pt-3 border-t border-white/10 shrink-0 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Dragon Assistant..."
                className="w-full rounded-xl bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shrink-0"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
