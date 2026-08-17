"use client";

import React, { useState } from "react";
import { X, Flag, AlertTriangle, ShieldCheck, Check } from "lucide-react";
import { ChatMessageItemData } from "@/hooks/useRealtimeChat";

interface ReportModalProps {
  message: ChatMessageItemData | null;
  onClose: () => void;
}

const REPORT_REASONS = [
  { id: "SPAM", label: "Spam / Advertising", desc: "Excessive messages, unsolicited promotions, or repetitive content." },
  { id: "HARASSMENT", label: "Harassment or Hate Speech", desc: "Bullying, personal attacks, or discriminatory statements." },
  { id: "INAPPROPRIATE", label: "Inappropriate Content", desc: "NSFW imagery, explicit language, or offensive references." },
  { id: "SCAM", label: "Scam / Phishing", desc: "Suspicious links, account stealing attempts, or fraudulent offers." },
  { id: "IMPERSONATION", label: "Impersonation", desc: "Pretending to be Dragon Studios staff or another player." },
  { id: "OTHER", label: "Other Violation", desc: "General violation of community safety rules." },
];

export function ReportModal({ message, onClose }: ReportModalProps) {
  const [reason, setReason] = useState("SPAM");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!message) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/community/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "MESSAGE",
          messageId: message.id,
          reportedUserId: message.user.id,
          reason,
          details,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Report error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B132B] border border-blue-500/30 rounded-3xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flag className="size-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm uppercase text-white tracking-wide">
                Report Transmission
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Message by @{message.user.name || "Member"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="size-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Check className="size-6" />
            </div>
            <div className="font-bold text-sm text-white">Report Logged Successfully</div>
            <div className="text-xs text-slate-400 max-w-xs mx-auto">
              Our safety desk has received the message metadata for administrative audit.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Quoted Message Preview */}
            <div className="p-3 rounded-xl bg-[#07111F] border border-slate-800 text-slate-300 font-sans text-[11px] truncate">
              &quot;{message.content}&quot;
            </div>

            {/* Violation Reasons */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Reason for Report
              </label>
              <div className="space-y-1">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    onClick={() => setReason(r.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      reason === r.id
                        ? "bg-blue-600/20 border-cyan-400/50 text-white"
                        : "bg-[#07111F]/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-bold text-xs">{r.label}</div>
                      <div className="text-[10px] text-slate-400">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional details */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Additional Context (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide timestamps or specific details..."
                rows={2}
                maxLength={500}
                className="w-full rounded-xl bg-[#07111F] border border-slate-800 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:opacity-90 text-white text-xs font-bold shadow-md shadow-rose-500/25 flex items-center gap-1.5"
              >
                <Flag className="size-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Report"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
