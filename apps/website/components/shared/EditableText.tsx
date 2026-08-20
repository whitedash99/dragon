"use client";

import React, { useRef, useEffect, memo } from "react";
import { useCMSEditor } from "@/hooks/useCMSEditor";
import { Loader2, Check, AlertCircle } from "lucide-react";

export interface EditableTextProps {
  cmsKey: string;
  initialContent: string;
  category?: string;
  label?: string;
  type?: "text" | "textarea" | "richtext";
  placeholder?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  debounceMs?: number;
  children?: React.ReactNode;
}

import { isEditorEnvironment } from "@/lib/cms/editorSafety";

export const EditableText = memo(function EditableText({
  cmsKey,
  initialContent,
  category = "General",
  label,
  type = "text",
  placeholder = "Click here to type...",
  as: Component = "span",
  className = "",
  style = {},
  debounceMs = 800,
}: EditableTextProps) {
  const elementRef = useRef<HTMLElement | null>(null);

  const {
    content,
    saveStatus,
    errorMessage,
    isEditing,
    isEmpty,
    setIsEditing,
    setContent,
    triggerManualSave,
    cancelEdit,
    handleKeyDown,
    retrySave,
  } = useCMSEditor({
    key: cmsKey,
    initialContent,
    category,
    label,
    type,
    placeholder,
    debounceMs,
  });

  // Enable editor mode safely
  const isEditorMode = isEditorEnvironment();

  // Keep DOM innerText synchronized when content changes externally
  useEffect(() => {
    if (elementRef.current && document.activeElement !== elementRef.current) {
      elementRef.current.innerText = content;
    }
  }, [content]);

  // Position caret at end of element
  const placeCaretAtEnd = (el: HTMLElement) => {
    el.focus();
    if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const handleFocus = () => {
    if (!isEditorMode) return;
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (!isEditorMode) return;
    setIsEditing(false);
    triggerManualSave();
  };

  const handleInput = () => {
    if (elementRef.current) {
      // Extract text content cleanly
      const text = elementRef.current.innerText;
      setContent(text);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditorMode || !elementRef.current) return;
    elementRef.current.contentEditable = "true";
    placeCaretAtEnd(elementRef.current);
  };

  // Base styling for editor outline & empty placeholder safety
  const editorStyles: React.CSSProperties = {
    ...style,
    minWidth: isEmpty && isEditorMode ? "8ch" : undefined,
    minHeight: isEmpty && isEditorMode ? "1.2em" : undefined,
    display: isEmpty && isEditorMode ? "inline-block" : style.display,
    outline: isEditing ? "2px solid #38bdf8" : undefined,
    outlineOffset: isEditing ? "2px" : undefined,
    borderRadius: isEditing ? "4px" : undefined,
    caretColor: isEditing ? "#38bdf8" : undefined,
    position: "relative",
    cursor: isEditorMode ? "text" : undefined,
    transition: "outline 0.15s ease, outline-offset 0.15s ease",
  };

  return (
    <span className="relative inline-block group/cms">
      <Component
        ref={elementRef}
        data-cms-key={cmsKey}
        data-empty={isEmpty ? "true" : "false"}
        data-placeholder={placeholder}
        contentEditable={isEditorMode ? "true" : "false"}
        suppressContentEditableWarning
        spellCheck={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onDoubleClick={handleDoubleClick}
        style={editorStyles}
        className={`${className} ${
          isEmpty && isEditorMode
            ? "before:content-[attr(data-placeholder)] before:text-slate-400/60 before:pointer-events-none before:italic"
            : ""
        }`}
      >
        {content}
      </Component>

      {/* UX Status Badge (Saving / Saved / Error) */}
      {isEditorMode && saveStatus !== "idle" && (
        <span className="absolute -top-6 right-0 z-50 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/90 border border-white/10 text-[10px] font-mono shadow-xl backdrop-blur-md transition-all duration-200">
          {saveStatus === "typing" && (
            <span className="text-sky-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" /> Typing...
            </span>
          )}
          {saveStatus === "saving" && (
            <span className="text-amber-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin text-amber-400" /> Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <Check className="w-3 h-3 text-emerald-400" /> Saved ✓
            </span>
          )}
          {saveStatus === "error" && (
            <button
              onClick={retrySave}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold underline"
              title={errorMessage || "Retry Save"}
            >
              <AlertCircle className="w-3 h-3 text-rose-400" /> Failed (Retry)
            </button>
          )}
        </span>
      )}
    </span>
  );
});
