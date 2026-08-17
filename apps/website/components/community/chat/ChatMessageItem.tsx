"use client";

import React, { useState } from "react";
import { 
  Reply, 
  Smile, 
  Flag, 
  Pin, 
  MoreVertical, 
  Check, 
  Trash2,
  ShieldCheck,
  Code,
  Flame,
  Crown
} from "lucide-react";
import { ChatMessageItemData } from "@/hooks/useRealtimeChat";
import { ReactionPicker } from "./ReactionPicker";
import { cn } from "@/lib/cn";
import { useSession } from "next-auth/react";

interface ChatMessageItemProps {
  message: ChatMessageItemData;
  onReply: (message: ChatMessageItemData) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onReport: (message: ChatMessageItemData) => void;
}

export function ChatMessageItem({
  message,
  onReply,
  onToggleReaction,
  onReport,
}: ChatMessageItemProps) {
  const { data: session } = useSession();
  const [showPicker, setShowPicker] = useState(false);
  const currentUserId = session?.user?.id;

  const role = (message.user?.role || "USER").toUpperCase();
  const isOwner = role === "OWNER" || role === "FOUNDER";
  const isDev = role === "DEVELOPER" || role === "ADMIN" || role === "SUPER_ADMIN";
  const isMod = role === "MODERATOR";

  // Group reactions by emoji
  const reactionGroups: { [emoji: string]: { count: number; userReacted: boolean } } = {};
  if (Array.isArray(message.reactions)) {
    message.reactions.forEach((r) => {
      if (!reactionGroups[r.emoji]) {
        reactionGroups[r.emoji] = { count: 0, userReacted: false };
      }
      reactionGroups[r.emoji].count += 1;
      if (r.userId === currentUserId) {
        reactionGroups[r.emoji].userReacted = true;
      }
    });
  }

  const timeFormatted = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative group px-4 sm:px-6 py-2 hover:bg-blue-950/20 transition-colors">
      {/* ═══ Reply To Banner ═══ */}
      {message.replyTo && (
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-sans mb-1 ml-10 pl-2 border-l-2 border-cyan-500/40">
          <Reply className="size-3 text-cyan-400 rotate-180 shrink-0" />
          <span className="font-bold text-slate-300">
            @{message.replyTo.user?.name || "Member"}:
          </span>
          <span className="truncate max-w-md">{message.replyTo.content}</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* ═══ User Avatar ═══ */}
        <div className="relative shrink-0 mt-0.5">
          <div
            className={cn(
              "size-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border overflow-hidden",
              isOwner
                ? "bg-gradient-to-br from-blue-600 to-cyan-400 text-white border-cyan-400/50 shadow-cyan-500/20"
                : isDev
                ? "bg-blue-950 text-cyan-300 border-blue-500/40"
                : isMod
                ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800 text-slate-200 border-slate-700"
            )}
          >
            {message.user?.avatar || message.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={message.user.avatar || message.user.image || ""}
                alt={message.user?.name || "User"}
                className="size-full object-cover"
              />
            ) : (
              (message.user?.name || "D").substring(0, 2).toUpperCase()
            )}
          </div>
        </div>

        {/* ═══ Message Main Body ═══ */}
        <div className="flex-1 min-w-0">
          {/* Author info line */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "font-bold text-xs tracking-tight",
                isOwner
                  ? "text-cyan-300 font-extrabold"
                  : isDev
                  ? "text-cyan-400 font-bold"
                  : isMod
                  ? "text-emerald-400 font-semibold"
                  : "text-slate-200"
              )}
            >
              {message.user?.name || "Dragon Member"}
            </span>

            {/* Role Badge */}
            {isOwner ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-gradient-to-r from-blue-600/30 to-cyan-500/30 border border-cyan-400/40 text-[9px] font-mono text-cyan-300 font-black">
                <Crown className="size-2.5" />
                <span>OWNER</span>
              </span>
            ) : isDev ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-blue-600/20 border border-blue-500/30 text-[9px] font-mono text-cyan-300 font-bold">
                <Code className="size-2.5" />
                <span>DEV</span>
              </span>
            ) : isMod ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-600/20 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 font-bold">
                <ShieldCheck className="size-2.5" />
                <span>MOD</span>
              </span>
            ) : null}

            <span className="text-[10px] text-slate-500 font-mono">{timeFormatted}</span>

            {message.isPinned && (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                <Pin className="size-2.5" />
                <span>PINNED</span>
              </span>
            )}
          </div>

          {/* Text Content */}
          <div className="text-xs text-slate-200 leading-relaxed mt-1 font-sans break-words whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Reaction Bubbles */}
          {Object.keys(reactionGroups).length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {Object.entries(reactionGroups).map(([emoji, { count, userReacted }]) => (
                <button
                  key={emoji}
                  onClick={() => onToggleReaction(message.id, emoji)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-mono transition-all",
                    userReacted
                      ? "bg-blue-600/25 border-cyan-400/50 text-cyan-300 shadow-[0_0_8px_rgba(59,130,246,0.3)] font-bold"
                      : "bg-[#0B132B] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  )}
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Floating Action Toolbar on Hover ═══ */}
      <div className="absolute right-4 top-2 hidden group-hover:flex items-center gap-1 bg-[#0B132B] border border-blue-500/30 rounded-xl p-1 shadow-lg shadow-black/50 z-20">
        <button
          onClick={() => setShowPicker((prev) => !prev)}
          className="p-1.5 rounded-lg hover:bg-blue-600/30 text-slate-400 hover:text-cyan-300 transition-colors"
          title="Add Reaction"
        >
          <Smile className="size-3.5" />
        </button>

        <button
          onClick={() => onReply(message)}
          className="p-1.5 rounded-lg hover:bg-blue-600/30 text-slate-400 hover:text-cyan-300 transition-colors"
          title="Reply"
        >
          <Reply className="size-3.5" />
        </button>

        <button
          onClick={() => onReport(message)}
          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
          title="Report Message"
        >
          <Flag className="size-3.5" />
        </button>
      </div>

      {/* Reaction Picker Popover */}
      {showPicker && (
        <ReactionPicker
          onSelectEmoji={(emoji) => onToggleReaction(message.id, emoji)}
          onClose={() => setShowPicker(false)}
          className="right-4 top-10"
        />
      )}
    </div>
  );
}
