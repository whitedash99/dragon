import React, { useState } from "react";
import { Bold, Italic, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Copy, Trash2, Undo, Redo, Sparkles, Minus, Plus, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FloatingFormattingToolbarProps {
  elementLabel: string;
  elementKey: string;
  elementContent?: string;
  onContentChange?: (newContent: string) => void;
  onBold: () => void;
  onItalic: () => void;
  onLink: () => void;
  onAlign: (align: "left" | "center" | "right") => void;
  onHeading: (level: "h1" | "h2" | "h3") => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAiPolish: () => void;
}

export function FloatingFormattingToolbar({
  elementLabel,
  elementKey,
  elementContent = "",
  onContentChange,
  onBold,
  onItalic,
  onLink,
  onAlign,
  onHeading,
  onDuplicate,
  onDelete,
  onUndo,
  onRedo,
  onAiPolish,
}: FloatingFormattingToolbarProps) {
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Geist Sans");

  const sizes = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64, 72];

  return (
    <div className="w-full max-w-4xl mb-3 z-30 bg-slate-900/95 backdrop-blur-2xl border border-purple-500/50 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-2 text-xs select-none">
      {/* Top Bar: Element Meta Badge & Inline Text Input */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1.5 px-1">
        <Badge variant="purple" size="sm">{elementLabel}</Badge>
        <span className="font-mono text-[9px] text-slate-400 truncate max-w-[120px]">{elementKey}</span>

        {/* Instant Inline Text Input */}
        <div className="flex-1 flex items-center gap-1.5 bg-slate-950/90 border border-white/15 rounded-xl px-2.5 py-1">
          <Type className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <input
            type="text"
            value={elementContent}
            onChange={(e) => onContentChange?.(e.target.value)}
            placeholder="Click to edit element text live..."
            className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Bottom Bar: Typography Size, Font Family, Alignments & Formatting Tools */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-1">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-white/10 pr-1.5">
          <button
            onClick={onUndo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Font Size Adjuster (- / + & Selector) */}
        <div className="flex items-center gap-1 bg-slate-950/80 border border-white/10 px-2 py-0.5 rounded-xl border-r border-white/10 pr-1.5">
          <button
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            className="text-slate-400 hover:text-white p-0.5"
            title="Decrease Font Size"
          >
            <Minus className="w-3 h-3" />
          </button>

          <select
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
            className="bg-transparent text-xs font-mono font-bold text-purple-300 focus:outline-none cursor-pointer px-1"
          >
            {sizes.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-white">
                {s}px
              </option>
            ))}
          </select>

          <button
            onClick={() => setFontSize(Math.min(72, fontSize + 2))}
            className="text-slate-400 hover:text-white p-0.5"
            title="Increase Font Size"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Font Family Selector */}
        <div className="border-r border-white/10 pr-1.5">
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-2 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-purple-500"
          >
            <option value="Geist Sans">Geist Sans</option>
            <option value="Inter">Inter</option>
            <option value="Rajdhani">Rajdhani (Gaming)</option>
            <option value="Geist Mono">Geist Mono</option>
          </select>
        </div>

        {/* Bold / Italic / Link */}
        <div className="flex items-center gap-0.5 border-r border-white/10 pr-1.5">
          <button
            onClick={onBold}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onItalic}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onLink}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Add Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignments */}
        <div className="flex items-center gap-0.5 border-r border-white/10 pr-1.5">
          <button
            onClick={() => onAlign("left")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlign("center")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlign("right")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-1.5 text-[10px] font-bold">
          <button
            onClick={() => onHeading("h1")}
            className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            H1
          </button>
          <button
            onClick={() => onHeading("h2")}
            className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            H2
          </button>
          <button
            onClick={() => onHeading("h3")}
            className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            H3
          </button>
        </div>

        {/* AI Polish & Duplicate/Delete */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onAiPolish}
            className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-950/40"
            title="AI Content Polish"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Duplicate Element (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
            title="Delete Element (Delete)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
