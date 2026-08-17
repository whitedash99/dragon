"use client";

import React, { useEffect, useRef } from "react";
import { Hash, Sparkles, MessageSquare } from "lucide-react";
import { ChatMessageItemData } from "@/hooks/useRealtimeChat";
import { ChatMessageItem } from "./ChatMessageItem";

interface ChatMessageListProps {
  messages: ChatMessageItemData[];
  roomName: string;
  roomDescription?: string | null;
  loading: boolean;
  onReply: (message: ChatMessageItemData) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onReport: (message: ChatMessageItemData) => void;
}

export function ChatMessageList({
  messages,
  roomName,
  roomDescription,
  loading,
  onReply,
  onToggleReaction,
  onReport,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col justify-between custom-scrollbar"
    >
      {/* ═══ Room Welcome Header ═══ */}
      <div className="px-6 pt-10 pb-6 space-y-3">
        <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Hash className="size-7" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
            Welcome to #{roomName}!
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-1 max-w-lg leading-relaxed">
            {roomDescription || `This is the start of the #${roomName} channel. Discuss topics and collaborate with Dragon Insiders.`}
          </p>
        </div>
        <div className="h-px bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-transparent" />
      </div>

      {/* ═══ Messages Stream ═══ */}
      <div className="flex-1 flex flex-col justify-end space-y-1">
        {loading ? (
          <div className="p-8 text-center space-y-2">
            <div className="size-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-xs text-slate-400 font-mono">Connecting to channel stream...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs font-mono">
            No messages yet. Send the first transmission!
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              onReply={onReply}
              onToggleReaction={onToggleReaction}
              onReport={onReport}
            />
          ))
        )}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
