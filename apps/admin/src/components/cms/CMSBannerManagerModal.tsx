"use client";

import React, { useState } from "react";
import { X, Sparkles, Plus, Radio, Check, Trash2, Edit3, Zap } from "lucide-react";

interface BannerItem {
  key: string;
  title: string;
  category: string;
  content: string;
  active: boolean;
}

interface CMSBannerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBanner: (key: string, content: string, label?: string) => Promise<void>;
  onDeleteBanner?: (key: string) => Promise<void>;
  currentBanners: { key: string; content: string; label: string }[];
}

export function CMSBannerManagerModal({
  isOpen,
  onClose,
  onSaveBanner,
  onDeleteBanner,
  currentBanners,
}: CMSBannerManagerModalProps) {
  const [newKey, setNewKey] = useState("hero.announcement");
  const [newLabel, setNewLabel] = useState("Top Live Intel Banner");
  const [newContent, setNewContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiBanner = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cms_rewrite",
          prompt: "Generate a punchy 1-line gaming studio live intel transmission announcement banner for Dragon Slayer 3D & Cyber Drift 3D builds ready for PC and Mobile. Keep under 12 words. Return ONLY the line.",
        }),
      });
      const data = await res.json();
      const text = data.result || data.completion;
      if (text) {
        setNewContent(text.replace(/"/g, "").trim());
      }
    } catch {
      setNewContent("DRAGON SLAYER 3D & CYBER DRIFT — PC (.EXE) & MOBILE (.APK) BUILDS READY");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSaving(true);
    try {
      await onSaveBanner(newKey, newContent.trim(), newLabel);
      setNewContent("");
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl bg-[#040D24] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Radio className="size-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg uppercase tracking-wider">
                CMS Banner & Intel Studio
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Create and push live transmission ribbons directly to the website.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#020718] border border-cyan-500/30 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Create / Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
                Banner Target Slot
              </label>
              <select
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="hero.announcement">Hero Live Intel Ribbon (hero.announcement)</option>
                <option value="hero.eyebrow">Studio Eyebrow Badge (hero.eyebrow)</option>
                <option value="games.eyebrow">Games Section Badge (games.eyebrow)</option>
                <option value="studio.eyebrow">Studio Tech Badge (studio.eyebrow)</option>
                <option value="news.eyebrow">News Section Badge (news.eyebrow)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-cyan-300 uppercase mb-1">
                Slot Description
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Top Live Announcement"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040D] border border-cyan-500/30 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono text-cyan-300 uppercase">
                Banner Content Copy
              </label>
              <button
                type="button"
                onClick={handleGenerateAiBanner}
                disabled={aiGenerating}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-500/30 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="size-3" />
                <span>{aiGenerating ? "Gemini Writing..." : "✦ Gemini AI Draft"}</span>
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter announcement banner copy (e.g. DRAGON SLAYER 3D & CYBER DRIFT — PC (.EXE) & MOBILE (.APK) BUILDS READY)"
              className="w-full px-4 py-3 rounded-2xl bg-[#01040D] border border-cyan-500/30 text-xs text-white font-sans placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Active Banners in System */}
          <div className="pt-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
              Existing Active Banners in Neon DB:
            </span>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {currentBanners
                .filter((b) => b.key.includes("announcement") || b.key.includes("eyebrow"))
                .map((b) => (
                  <div
                    key={b.key}
                    onClick={() => {
                      setNewKey(b.key);
                      setNewLabel(b.label);
                      setNewContent(b.content);
                    }}
                    className="p-2.5 rounded-xl bg-[#01040D] border border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="truncate">
                      <span className="font-mono text-[10px] text-cyan-400 font-bold mr-2">[{b.key}]</span>
                      <span className="text-slate-300 truncate">{b.content}</span>
                    </div>
                    <Edit3 className="size-3.5 text-slate-500 hover:text-cyan-400 shrink-0 ml-2" />
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="size-4" />
              <span>{isSaving ? "Publishing to Neon..." : "Publish Banner Live"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
