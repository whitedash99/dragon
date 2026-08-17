import React, { useState } from "react";
import { Sliders, History, Bold, Italic, Link as LinkIcon, Code, List, AlignLeft, AlignCenter, AlignRight, AlignJustify, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  selectedBlock: CMSBlock | null;
  editContent: string;
  setEditContent: (content: string) => void;
  isPublished: boolean;
  setIsPublished: (published: boolean) => void;
  onSaveBlock: () => Promise<void>;
  onOpenHistory: () => void;
  saving: boolean;
}

export function VisualStudioInspector({
  isOpen,
  selectedBlock,
  editContent,
  setEditContent,
  isPublished,
  setIsPublished,
  onSaveBlock,
  onOpenHistory,
  saving,
}: VisualStudioInspectorProps) {
  const [tab, setTab] = useState<"content" | "style" | "spacing" | "motion" | "ai">("content");
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState("600");
  const [fontFamily, setFontFamily] = useState("Geist Sans");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left");
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(12);

  if (!isOpen) return null;

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 p-5 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2 shrink-0 select-none">
        <Sliders className="w-8 h-8 text-slate-400 opacity-60 mb-1" />
        <p className="font-bold text-slate-900">Visual Inspector Studio</p>
        <p className="text-slate-500">Select any section or block element to edit text, typography, colors, and motion.</p>
      </div>
    );
  }

  // Markdown Formatting Helpers
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    setEditContent(`${prefix}${editContent}${suffix}`);
  };

  const colors = [
    { name: "White", value: "#ffffff" },
    { name: "Purple", value: "#9333ea" },
    { name: "Pink", value: "#ec4899" },
    { name: "Cyan", value: "#22d3ee" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Gold", value: "#eab308" },
  ];

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 select-none text-xs text-slate-900">
      {/* Top Inspector Tab Bar */}
      <div className="flex items-center justify-around border-b border-slate-100 p-2 bg-slate-50">
        <button
          onClick={() => setTab("content")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "content" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
          title="Text & Markdown Content"
        >
          Text
        </button>

        <button
          onClick={() => setTab("style")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "style" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
          title="Figma Typography & Colors"
        >
          Type
        </button>

        <button
          onClick={() => setTab("spacing")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "spacing" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Layout & Border Radius"
        >
          Layout
        </button>

        <button
          onClick={() => setTab("motion")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "motion" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Framer Motion Presets"
        >
          Motion
        </button>

        <button
          onClick={() => setTab("ai")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === "ai" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Gemini AI Polish Studio"
        >
          AI
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Element Header */}
        <div className="border-b border-white/5 pb-3">
          <div className="flex items-center justify-between mb-1">
            <Badge variant="purple" size="sm">{selectedBlock.category}</Badge>
            <span className="text-[10px] font-mono text-slate-400">v{selectedBlock.version}</span>
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">{selectedBlock.label || selectedBlock.key}</h3>
          <span className="text-[10px] font-mono text-purple-400">key: {selectedBlock.key}</span>
        </div>

        {tab === "content" && (
          <div className="space-y-3">
            {/* Rich Text Markdown Formatting Bar */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 border border-white/10 rounded-xl overflow-x-auto">
              <button
                onClick={() => insertMarkdown("**", "**")}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900"
                title="Bold (**text**)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertMarkdown("*", "*")}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900"
                title="Italic (*text*)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertMarkdown("[", "](https://)")}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900"
                title="Link ([text](url))"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertMarkdown("`", "`")}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900"
                title="Inline Code (`code`)"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertMarkdown("- ")}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900"
                title="Bullet List (- item)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertMarkdown("# ")}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-900"
                title="Heading 1 (# Title)"
              >
                H1
              </button>
              <button
                onClick={() => insertMarkdown("## ")}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-900"
                title="Heading 2 (## Subtitle)"
              >
                H2
              </button>
            </div>

            <textarea
              rows={6}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50 font-mono leading-relaxed resize-none"
              placeholder="Enter element string content..."
            />
          </div>
        )}

        {tab === "style" && (
          <div className="space-y-4">
            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="Geist Sans">Geist Sans (Clean Modern)</option>
                <option value="Inter">Inter (Sans-Serif)</option>
                <option value="Rajdhani">Rajdhani (AAA Gaming Header)</option>
                <option value="Geist Mono">Geist Mono (Code & Telemetry)</option>
              </select>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Font Size</span>
                <span className="text-purple-300 font-mono">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 bg-slate-950"
              />
            </div>

            {/* Font Weight */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Font Weight
              </label>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                className="w-full p-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="400">400 (Regular)</option>
                <option value="500">500 (Medium)</option>
                <option value="600">600 (Semi Bold)</option>
                <option value="700">700 (Bold)</option>
                <option value="900">900 (Black)</option>
              </select>
            </div>

            {/* Text Alignment */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Text Alignment
              </label>
              <div className="flex items-center justify-between bg-slate-950/80 border border-white/10 p-1 rounded-xl">
                {(["left", "center", "right", "justify"] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => setTextAlign(align)}
                    className={`p-2 rounded-lg transition-all ${
                      textAlign === align ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                    {align === "justify" && <AlignJustify className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatch Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Color Swatches
              </label>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <div
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-7 h-7 rounded-lg cursor-pointer transition-transform border border-white/20 ${
                      selectedColor === c.value ? "scale-110 ring-2 ring-purple-400" : ""
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "spacing" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Border Radius</span>
                <span className="text-purple-300 font-mono">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 bg-slate-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Glassmorphic Backdrop Blur
              </label>
              <select className="w-full p-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white">
                <option>Glass-Sm (Blur 8px)</option>
                <option>Glass-Md (Blur 12px)</option>
                <option>Glass-Lg (Blur 16px)</option>
                <option>Glass-Heavy (Blur 24px)</option>
              </select>
            </div>
          </div>
        )}

        {tab === "motion" && (
          <div className="space-y-3">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Framer Motion Entrance Preset
            </label>
            <div className="space-y-2">
              {["Fade Up (stagger 0.08s)", "Scale In (spring 400)", "Float Orb Drift", "Glow Pulse (12px)", "Slide In Right"].map((p) => (
                <div key={p} className="p-2.5 bg-slate-950/60 border border-white/10 rounded-xl hover:border-purple-500/40 cursor-pointer font-semibold text-slate-300">
                  {p}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div className="space-y-3">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Gemini AI Content Polish
            </span>
            <Button
              type="button"
              onClick={() => {
                setEditContent(`Forge unprecedented interactive experiences. ${editContent}`);
              }}
              variant="outline"
              className="w-full text-xs border-purple-500/30 text-purple-300 hover:bg-purple-950/20"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1 text-purple-400" /> Apply AAA Polish
            </Button>
          </div>
        )}

        {/* Publish Live Toggle */}
        <div className="border-t border-white/5 pt-3 space-y-2">
          <div className="flex items-center justify-between bg-slate-950/60 border border-white/10 p-3 rounded-xl">
            <span className="text-slate-300 font-medium">Published Live</span>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                isPublished ? "bg-purple-600" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isPublished ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <Button
            type="button"
            onClick={onOpenHistory}
            variant="outline"
            className="w-full text-xs border-white/10 text-slate-300 hover:bg-white/5"
          >
            <History className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Version History Log
          </Button>

          <Button
            type="button"
            onClick={onSaveBlock}
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg shadow-purple-900/40"
          >
            {saving ? "Saving Element..." : "Apply & Save Element"}
          </Button>
        </div>
      </div>
    </div>
  );
}
