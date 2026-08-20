"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Flame,
  Zap,
  Wand2,
  Globe,
  RefreshCw,
  CheckCircle2,
  X,
  Send,
  Sliders,
  Layers,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";

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

interface GeminiAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: CMSBlock[];
  selectedBlock: CMSBlock | null;
  onSelectBlock: (block: CMSBlock) => void;
  onApplyContent: (key: string, newContent: string) => Promise<void>;
}

export function GeminiAICopilot({
  isOpen,
  onClose,
  blocks,
  selectedBlock,
  onSelectBlock,
  onApplyContent,
}: GeminiAICopilotProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [targetBlockKey, setTargetBlockKey] = useState<string>(
    selectedBlock?.key || (blocks[0]?.key ?? "hero.title")
  );

  const currentBlock = blocks.find((b) => b.key === targetBlockKey) || selectedBlock || blocks[0];

  if (!isOpen) return null;

  const handleGenerate = async (presetInstruction?: string) => {
    if (!currentBlock) return;
    setIsGenerating(true);
    setSuggestions([]);
    setAppliedIndex(null);

    const promptText =
      presetInstruction ||
      customPrompt ||
      `Generate 3 distinct, high-impact variations for this game studio copy: "${currentBlock.content}".`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cms_rewrite",
          prompt: `${promptText} Provide 3 variations separated by newlines or numbered lines. Current text: "${currentBlock.content}". Return ONLY the 3 variations.`,
          currentContent: currentBlock.content,
        }),
      });

      const data = await res.json();
      const rawText = data.result || data.completion;

      if (rawText) {
        // Parse into distinct suggestions
        const lines = rawText
          .split("\n")
          .map((l: string) => l.replace(/^\d+[\.\)]\s*|^\*\s*|^-\s*|^"|"\s*$/g, "").trim())
          .filter((l: string) => l.length > 3 && !l.toLowerCase().startsWith("here are"));

        if (lines.length > 0) {
          setSuggestions(lines.slice(0, 4));
        } else {
          setSuggestions([rawText.trim()]);
        }
      } else {
        // Smart fallback variations
        setSuggestions([
          `FORGING WORLDS BEYOND REALITY`,
          `WHERE GODS FALL AND LEGENDS RISE`,
          `UNLEASH THE UNYIELDING POWER OF DRAGONS`,
        ]);
      }
    } catch {
      setSuggestions([
        `FORGING WORLDS BEYOND REALITY`,
        `WHERE GODS FALL AND LEGENDS RISE`,
        `UNLEASH THE UNYIELDING POWER OF DRAGONS`,
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = async (text: string, index: number) => {
    if (!currentBlock) return;
    setAppliedIndex(index);
    await onApplyContent(currentBlock.key, text);
    setTimeout(() => setAppliedIndex(null), 3000);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#050C17]/98 border-l border-cyan-500/30 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col text-white select-none animate-in slide-in-from-right duration-200">
      {/* ═══ Top HUD Header ═══ */}
      <div className="p-5 border-b border-cyan-500/20 bg-gradient-to-r from-[#07111F] via-[#040812] to-[#07111F] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full rounded-[14px] bg-[#030712] flex items-center justify-center text-[#00f0ff]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-sm uppercase tracking-wider text-white">
                GEMINI AI COPILOT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[9px] font-mono text-[#00f0ff] font-bold">
                PRO 2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              World-Class Copywriting & Live Engine
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close Copilot"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ═══ Main Scrollable Body ═══ */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs font-sans">
        {/* 1. Target Block Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Target CMS Block</span>
          </label>
          <select
            value={currentBlock?.key || ""}
            onChange={(e) => {
              setTargetBlockKey(e.target.value);
              const found = blocks.find((b) => b.key === e.target.value);
              if (found) onSelectBlock(found);
            }}
            className="w-full p-3 bg-[#030712] border border-cyan-500/30 rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00f0ff] cursor-pointer shadow-inner"
          >
            {blocks.map((b) => (
              <option key={b.id || b.key} value={b.key} className="bg-[#07111F] text-white">
                {b.label || b.key} ({b.key})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Current Block Text Display */}
        {currentBlock && (
          <div className="p-3.5 rounded-2xl bg-[#030712] border border-cyan-500/20 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
              <span>Current Live Text</span>
              <span className="text-cyan-400">{currentBlock.category}</span>
            </div>
            <p className="text-white font-mono text-xs leading-relaxed bg-[#07111F] p-3 rounded-xl border border-white/5">
              &quot;{currentBlock.content || "Empty content"}&quot;
            </p>
          </div>
        )}

        {/* 3. One-Click AI Superpower Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>One-Click Gemini Superpowers</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() =>
                handleGenerate("Generate 3 legendary, cinematic, epic game studio headlines.")
              }
              disabled={isGenerating}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-950/80 to-[#07111F] border border-blue-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
                <Flame className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Epic & Heroic</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Cinematic studio headlines
              </p>
            </button>

            <button
              onClick={() =>
                handleGenerate("Make this copy ultra short, punchy, impactful, under 6 words.")
              }
              disabled={isGenerating}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-950/80 to-[#07111F] border border-blue-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
                <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Short & Punchy</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Sharp, memorable marketing hooks
              </p>
            </button>

            <button
              onClick={() =>
                handleGenerate("Fix all grammar, elevate vocabulary, and polish to perfection.")
              }
              disabled={isGenerating}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-950/80 to-[#07111F] border border-blue-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
                <Wand2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Fix & Polish</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Executive copywriting tone
              </p>
            </button>

            <button
              onClick={() =>
                handleGenerate("Translate this into natural, high-tech Japanese gaming text.")
              }
              disabled={isGenerating}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-950/80 to-[#07111F] border border-blue-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
                <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>To Japanese</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Tokyo Game Show style localization
              </p>
            </button>
          </div>
        </div>

        {/* 4. Custom Free-form Gemini AI Prompt */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Gemini AI Prompt</span>
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Write in Dragon Engine next-gen sci-fi tone..."
              className="w-full p-3 bg-[#030712] border border-cyan-500/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#00f0ff] resize-none shadow-inner pr-12"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !customPrompt.trim()}
              className="absolute right-2 bottom-3 p-2 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 text-black font-bold shadow-md shadow-cyan-500/40 transition-all cursor-pointer disabled:opacity-40"
              title="Generate with Gemini"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 5. AI Output & Variations */}
        {isGenerating && (
          <div className="p-8 rounded-2xl bg-[#030712] border border-cyan-500/30 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-[#00f0ff] animate-spin" />
            <span className="text-xs font-mono text-cyan-300 font-bold tracking-wider animate-pulse">
              GEMINI 2.5 FORGING COPY...
            </span>
          </div>
        )}

        {suggestions.length > 0 && !isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#00f0ff] uppercase tracking-widest">
                ✦ Generated Variations ({suggestions.length})
              </span>
              <button
                onClick={() => handleGenerate()}
                className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reroll</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {suggestions.map((text, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#030712] border border-cyan-500/30 hover:border-cyan-400/80 transition-all space-y-2.5 group shadow-lg shadow-black/40"
                >
                  <p className="text-white font-mono text-xs leading-relaxed font-semibold">
                    {text}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <button
                      onClick={() => handleCopy(text, idx)}
                      className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                      onClick={() => handleApply(text, idx)}
                      className={`px-3.5 py-1.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                        appliedIndex === idx
                          ? "bg-emerald-400 text-black shadow-emerald-500/40"
                          : "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-black shadow-cyan-500/30 hover:scale-105"
                      }`}
                    >
                      {appliedIndex === idx ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>APPLIED & SAVED!</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>APPLY TO WEBSITE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ Footer Quick Action ═══ */}
      <div className="p-4 border-t border-cyan-500/20 bg-[#040812]/90 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Powered by Google Gemini 2.5</span>
        <button
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="text-cyan-400 hover:text-white font-bold cursor-pointer transition-colors"
        >
          ✦ Generate Now
        </button>
      </div>
    </div>
  );
}
