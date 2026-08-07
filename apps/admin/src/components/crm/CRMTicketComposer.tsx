import React, { useState } from "react";
import { Send, StickyNote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("reply")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === "reply"
              ? "bg-purple-600 text-white"
              : "bg-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Send className="w-3.5 h-3.5" /> Send Customer Reply
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("note")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === "note"
              ? "bg-amber-600 text-white"
              : "bg-transparent text-slate-400 hover:text-white"
          }`}
        >
          <StickyNote className="w-3.5 h-3.5" /> Add Staff Internal Note
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            activeTab === "reply"
              ? "Type your response to the customer..."
              : "Add an internal staff note (visible to agents only)..."
          }
          className="w-full p-3.5 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
        />

        <div className="flex items-center justify-between">
          {dispatchedSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Message saved to database!
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              {activeTab === "reply" ? "Customer will receive email notification." : "Internal notes are encrypted & audit logged."}
            </span>
          )}

          <Button
            type="submit"
            disabled={sending || !text.trim()}
            className={`text-xs px-4 py-2 ${
              activeTab === "reply"
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : "bg-amber-600 hover:bg-amber-500 text-white"
            }`}
          >
            {sending ? "Processing..." : activeTab === "reply" ? "Send Reply" : "Save Note"}
          </Button>
        </div>
      </form>
    </div>
  );
}
