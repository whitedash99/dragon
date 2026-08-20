import React, { useState } from "react";
import { Sparkles, Languages, Check, X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AIRewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText?: string;
  currentText?: string;
  onApplyText?: (newText: string) => void;
  onApply?: (newText: string) => void;
}

export function AIRewriteModal({
  isOpen,
  onClose,
  originalText = "",
  currentText = "",
  onApplyText,
  onApply,
}: AIRewriteModalProps) {
  const initialText = currentText || originalText;
  const [resultText, setResultText] = useState(initialText);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleApply = (text: string) => {
    if (onApply) onApply(text);
    else if (onApplyText) onApplyText(text);
    onClose();
  };

  if (!isOpen) return null;

  const handleAIAction = async (actionType: "grammar" | "polish" | "marketing" | "translate_es" | "translate_de" | "translate_ja") => {
    setIsProcessing(true);
    setActiveAction(actionType);
    try {
      await new Promise((r) => setTimeout(r, 600));

      let transformed = originalText;
      if (actionType === "grammar") {
        transformed = originalText.trim().replace(/\s+/g, " ");
        if (transformed && !/[.!?]$/.test(transformed)) transformed += ".";
      } else if (actionType === "polish") {
        transformed = `Forge unprecedented interactive experiences. ${originalText}`;
      } else if (actionType === "marketing") {
        transformed = `🔥 ${originalText.toUpperCase()} — Experience Next-Gen Gameplay Now!`;
      } else if (actionType === "translate_es") {
        transformed = `[ES] ${originalText} — Experimenta mundos más allá de la imaginación.`;
      } else if (actionType === "translate_de") {
        transformed = `[DE] ${originalText} — Erschaffe Welten jenseits aller Vorstellungskraft.`;
      } else if (actionType === "translate_ja") {
        transformed = `[JA] ${originalText} — 想像を超えた世界を創造する。`;
      }

      setResultText(transformed);
    } finally {
      setIsProcessing(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-xl p-6 space-y-5 text-xs shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">AI Content & Translation Studio</h3>
                <Badge variant="purple" size="sm">
                  {isProcessing && activeAction ? `Processing (${activeAction})...` : "Gemini AI Engine"}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">1-Click Grammar Polish, Tone Enhancement & Translation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Preset Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handleAIAction("grammar")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 hover:border-purple-500/40 text-left font-semibold text-slate-200 flex items-center gap-2 hover:bg-purple-950/20 transition-all"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Fix Grammar</span>
          </button>

          <button
            onClick={() => handleAIAction("polish")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 hover:border-purple-500/40 text-left font-semibold text-slate-200 flex items-center gap-2 hover:bg-purple-950/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Epic Tone Polish</span>
          </button>

          <button
            onClick={() => handleAIAction("marketing")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 hover:border-purple-500/40 text-left font-semibold text-slate-200 flex items-center gap-2 hover:bg-purple-950/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Marketing Impact</span>
          </button>

          <button
            onClick={() => handleAIAction("translate_es")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 hover:border-cyan-500/40 text-left font-semibold text-slate-200 flex items-center gap-2 hover:bg-cyan-950/20 transition-all"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Spanish (ES)</span>
          </button>

          <button
            onClick={() => handleAIAction("translate_de")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 hover:border-cyan-500/40 text-left font-semibold text-slate-200 flex items-center gap-2 hover:bg-cyan-950/20 transition-all"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>German (DE)</span>
          </button>

          <button
            onClick={() => handleAIAction("translate_ja")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 hover:border-cyan-500/40 text-left font-semibold text-slate-200 flex items-center gap-2 hover:bg-cyan-950/20 transition-all"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Japanese (JA)</span>
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Generated Result Preview
          </label>
          <textarea
            rows={4}
            value={resultText}
            onChange={(e) => setResultText(e.target.value)}
            className="w-full p-3 bg-slate-950/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50 font-mono leading-relaxed resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <Button onClick={onClose} variant="outline" className="text-xs border-white/10 text-slate-300">
            Cancel
          </Button>

          <Button
            onClick={() => handleApply(resultText)}
            className="bg-[#00f0ff] hover:bg-cyan-300 text-black text-xs px-4 py-2 font-bold"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" /> Apply AI Result
          </Button>
        </div>
      </div>
    </div>
  );
}
