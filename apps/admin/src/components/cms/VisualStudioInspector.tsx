import React, { useState } from "react";
import { Sliders, Sparkles, Save, CheckCircle2, RefreshCw, Wand2, X, Zap, Globe, Flame } from "lucide-react";

interface CMSBlock {
  id: string;
  key: string;
  category: string;
  label: string;
  type: string;
  content: string;
  draftContent?: string;
  isPublished: boolean;
  version: number;
  updatedBy: string;
  updatedAt: string;
}

interface VisualStudioInspectorProps {
  isOpen: boolean;
  onClose?: () => void;
  selectedBlock: CMSBlock | null;
  editContent: string;
  setEditContent: (content: string) => void;
  isPublished: boolean;
  setIsPublished: (published: boolean) => void;
  isSaving?: boolean;
  saving?: boolean;
  isSavedSuccess?: boolean;
  onSave?: () => Promise<void>;
  onSaveBlock?: () => Promise<void>;
  onOpenHistory?: () => void;
  onLiveTyping?: (content: string) => void;
}

export function VisualStudioInspector({
  isOpen,
  onClose,
  selectedBlock,
  editContent,
  setEditContent,
  isPublished,
  setIsPublished,
  isSaving = false,
  saving = false,
  isSavedSuccess = false,
  onSave,
  onSaveBlock,
  onLiveTyping,
}: VisualStudioInspectorProps) {
  const activeSaving = isSaving || saving;
  const handleSave = onSave || onSaveBlock || (async () => {});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAi, setShowAi] = useState(false);

  if (!isOpen) return null;

  const runAiRewrite = async (presetPrompt?: string) => {
    const promptToRun = presetPrompt || aiPrompt;
    if (!promptToRun) return;

    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cms_rewrite",
          prompt: promptToRun,
          currentContent: editContent,
        }),
      });
      const data = await res.json();
      const text = data.result || data.completion;
      if (text) {
        setEditContent(text);
        onLiveTyping?.(text);
      } else {
        const enhanced = `${editContent} — Engineered for Dragon gaming mastery.`;
        setEditContent(enhanced);
        onLiveTyping?.(enhanced);
      }
    } catch {
      const enhanced = `${editContent} — Engineered for Dragon gaming mastery.`;
      setEditContent(enhanced);
      onLiveTyping?.(enhanced);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="fixed right-4 top-16 bottom-4 z-40 w-96 max-w-[calc(100vw-32px)] rounded-2xl border border-cyan-500/30 bg-[#07111F]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden select-none text-xs text-[#F8FAFC] animate-in fade-in slide-in-from-right-8 duration-200">
      {/* ═══ Top Header ═══ */}
      <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#040812]/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[#00f0ff]">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-heading font-black text-xs text-white uppercase tracking-wider block">
              {selectedBlock ? selectedBlock.label || selectedBlock.key : "Property Inspector"}
            </span>
            {selectedBlock && (
              <span className="text-[10px] font-mono text-cyan-400 block truncate max-w-[200px]">
                {selectedBlock.key} • v{selectedBlock.version || 1}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!selectedBlock ? (
        <div className="flex-1 p-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#030712] border border-cyan-500/30 flex items-center justify-center text-[#00f0ff] shadow-md shadow-cyan-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <p className="font-heading font-black text-sm text-white uppercase tracking-wider">Click Any Text</p>
          <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
            Click directly on any text on the full-screen live website to edit it instantly.
          </p>
        </div>
      ) : (
        /* ═══ Main Editor Form ═══ */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                Text Content (Live Sync)
              </label>
              <button
                onClick={() => setShowAi(!showAi)}
                className="text-[10px] font-mono text-[#00f0ff] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>{showAi ? "Hide AI" : "Gemini AI Assistant"}</span>
              </button>
            </div>

            {/* AI Helper Accordion */}
            {showAi && (
              <div className="p-3 bg-[#030712] border border-cyan-500/30 rounded-xl space-y-2 mb-2">
                <div className="grid grid-cols-2 gap-1.5 mb-1">
                  <button
                    onClick={() => runAiRewrite("Make this gaming studio copy more epic, punchy, and cinematic for an original game studio.")}
                    disabled={aiGenerating}
                    className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center gap-1 font-mono cursor-pointer transition-colors"
                  >
                    <Flame className="w-3 h-3 text-cyan-400" />
                    <span>Epic & Heroic</span>
                  </button>

                  <button
                    onClick={() => runAiRewrite("Make this copy concise, impactful, and punchy (under 10 words).")}
                    disabled={aiGenerating}
                    className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center gap-1 font-mono cursor-pointer transition-colors"
                  >
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>Short & Punchy</span>
                  </button>

                  <button
                    onClick={() => runAiRewrite("Fix all grammar, improve flow, and give a sleek modern gaming aesthetic.")}
                    disabled={aiGenerating}
                    className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center gap-1 font-mono cursor-pointer transition-colors"
                  >
                    <Wand2 className="w-3 h-3 text-cyan-400" />
                    <span>Fix & Polish</span>
                  </button>

                  <button
                    onClick={() => runAiRewrite("Translate this game studio text to professional high-tech Japanese.")}
                    disabled={aiGenerating}
                    className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center gap-1 font-mono cursor-pointer transition-colors"
                  >
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <span>To Japanese</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Custom prompt (e.g. Write in Cyberpunk tone)..."
                    className="flex-1 p-1.5 bg-[#07111F] border border-cyan-500/20 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => runAiRewrite()}
                    disabled={aiGenerating || !aiPrompt}
                    className="px-3 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40 shrink-0"
                  >
                    {aiGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <span>Run</span>}
                  </button>
                </div>
              </div>
            )}

            <textarea
              rows={4}
              value={editContent}
              onChange={(e) => {
                const val = e.target.value;
                setEditContent(val);
                onLiveTyping?.(val);
              }}
              placeholder="Type content here..."
              className="w-full p-3 bg-[#030712] border border-cyan-500/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#00f0ff] resize-none shadow-inner"
            />
          </div>

          {/* Visibility Switch */}
          <div className="p-3 bg-[#030712] border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Public Visibility</div>
              <div className="text-[10px] text-slate-400">Live on dragongamingstudios.vercel.app</div>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                isPublished ? "bg-[#00f0ff]" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  isPublished ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Block Metadata */}
          <div className="p-3 bg-[#030712] border border-slate-800/80 rounded-xl space-y-1.5 font-mono text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="text-cyan-400">{selectedBlock.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Block Type:</span>
              <span className="text-white">{selectedBlock.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Modified:</span>
              <span className="text-slate-300">{selectedBlock.updatedAt || "Live"}</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Bottom Footer Action ═══ */}
      {selectedBlock && (
        <div className="p-4 border-t border-cyan-500/20 bg-[#040812]/90 flex items-center justify-between gap-2">
          <button
            onClick={() => handleSave()}
            disabled={activeSaving}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#00A8FF] to-[#19C7FF] text-black font-heading font-black tracking-wider uppercase shadow-lg shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs"
          >
            {activeSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>SAVING TO DB...</span>
              </>
            ) : isSavedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                <span>SAVED & PUBLISHED!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>SAVE & PUBLISH</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
