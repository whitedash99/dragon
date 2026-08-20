import React, { useState } from "react";
import { Send, StickyNote, CheckCircle2 } from "lucide-react";

interface CRMTicketComposerProps {
  onSendReply: (replyText: string) => Promise<void>;
  onAddNote: (noteText: string) => Promise<void>;
  sending: boolean;
  dispatchedSuccess: boolean;
}

export function CRMTicketComposer({
  onSendReply,
  onAddNote,
  sending,
  dispatchedSuccess,
}: CRMTicketComposerProps) {
  const [activeTab, setActiveTab] = useState<"reply" | "note">("reply");
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (activeTab === "reply") {
      await onSendReply(text);
    } else {
      await onAddNote(text);
    }
    setText("");
  };

  return (
    <div className="bg-[#040A18]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 shadow-2xl font-sans text-xs text-slate-100 space-y-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono">
        <button
          type="button"
          onClick={() => setActiveTab("reply")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "reply"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
              : "bg-[#020614] border border-cyan-500/20 text-slate-400 hover:text-white"
          }`}
        >
          <Send className="size-3.5" /> Send Customer Reply
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("note")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "note"
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30"
              : "bg-[#020614] border border-cyan-500/20 text-slate-400 hover:text-white"
          }`}
        >
          <StickyNote className="size-3.5" /> Add Staff Internal Note
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            activeTab === "reply"
              ? "Type your official response to the customer..."
              : "Add an internal staff note (visible to agents only)..."
          }
          className="w-full p-4 bg-[#020614] border border-cyan-500/30 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none font-mono shadow-inner"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
          {dispatchedSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="size-4 text-emerald-400" /> Response dispatched successfully via Resend & DB!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              {activeTab === "reply" ? "Customer will receive live email notification & dashboard alert." : "Internal notes are encrypted & audit logged."}
            </span>
          )}

          <button
            type="submit"
            disabled={sending || !text.trim()}
            className={`px-6 py-3 rounded-2xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 ${
              activeTab === "reply"
                ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95"
                : "bg-amber-500 text-black shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95"
            }`}
          >
            {sending ? "DISPATCHING..." : activeTab === "reply" ? "SEND REPLY" : "SAVE NOTE"}
          </button>
        </div>
      </form>
    </div>
  );
}
