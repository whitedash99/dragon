"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Smile, 
  Paperclip, 
  X, 
  Sparkles, 
  Lock, 
  Radio 
} from "lucide-react";
import { ReactionPicker } from "./ReactionPicker";
import { ChatMessageItemData } from "@/hooks/useRealtimeChat";
import { useSession, signIn } from "next-auth/react";
import { cn } from "@/lib/cn";

interface MessageComposerProps {
  roomName: string;
  replyingTo: ChatMessageItemData | null;
  onCancelReply: () => void;
  onSendMessage: (content: string, replyToId?: string | null) => Promise<void>;
  onSendTyping: () => void;
}

export function MessageComposer({
  roomName,
  replyingTo,
  onCancelReply,
  onSendMessage,
  onSendTyping,
}: MessageComposerProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    const messageText = content;
    setContent("");
    setIsSubmitting(true);

    try {
      await onSendMessage(messageText, replyingTo?.id);
      if (replyingTo) onCancelReply();
    } catch (err: any) {
      // Restore on failure
      setContent(messageText);
    } finally {
      setIsSubmitting(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else {
      onSendTyping();
    }
  };

  if (!session?.user) {
    return (
      <div className="p-4 bg-[#07111F]/90 border-t border-blue-500/20 text-center">
        <div className="rounded-2xl bg-[#0B132B] border border-blue-500/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Lock className="size-4 text-cyan-400" />
            <span>Sign in to participate in #{roomName} discussions</span>
          </div>
          <button
            onClick={() => signIn()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:opacity-90 transition-opacity"
          >
            Sign In with Dragon ID
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#07111F]/95 backdrop-blur-2xl border-t border-blue-500/20 select-none relative">
      {/* ═══ Reply Context Banner ═══ */}
      {replyingTo && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <span className="text-cyan-400 font-bold">Replying to @{replyingTo.user?.name || "Member"}:</span>
            <span className="text-slate-400 truncate max-w-sm">{replyingTo.content}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* ═══ Input Container ═══ */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-[#0B132B] border border-blue-500/30 focus-within:border-cyan-400/60 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.25)] p-2 transition-all flex items-end gap-2"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-2 rounded-xl hover:bg-blue-600/20 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Emoji Picker"
          >
            <Smile className="size-5" />
          </button>

          {showEmojiPicker && (
            <ReactionPicker
              onSelectEmoji={(emoji) => {
                setContent((prev) => prev + emoji);
                setShowEmojiPicker(false);
                textareaRef.current?.focus();
              }}
              onClose={() => setShowEmojiPicker(false)}
              className="bottom-12 left-0"
            />
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${roomName}... (Enter to send, Shift+Enter for new line)`}
          rows={1}
          maxLength={2000}
          className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none max-h-32 py-2 font-sans"
        />

        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className={cn(
            "p-2.5 rounded-xl transition-all font-bold text-xs shrink-0 flex items-center justify-center",
            content.trim() && !isSubmitting
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 hover:scale-105 active:scale-95"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          )}
          title="Send Transmission"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
