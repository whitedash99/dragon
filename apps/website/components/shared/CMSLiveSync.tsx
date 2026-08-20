"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { isEditorEnvironment } from "@/lib/cms/editorSafety";
import { cmsSaveService } from "@/lib/cms/cmsSaveService";

export function CMSLiveSync() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const activeElementRef = useRef<HTMLElement | null>(null);

  // Update target rect on resize/scroll
  const updateRect = useCallback(() => {
    if (activeElementRef.current) {
      setTargetRect(activeElementRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    if (!isEditorEnvironment()) return;

    // Inject Cyberpunk HUD styles
    if (!document.getElementById("dragon-cms-god-styles")) {
      const style = document.createElement("style");
      style.id = "dragon-cms-god-styles";
      style.innerHTML = `
        .dragon-cms-hovered {
          outline: 2px dashed rgba(0, 240, 255, 0.7) !important;
          outline-offset: 3px !important;
          cursor: pointer !important;
          transition: outline 0.1s ease !important;
        }
        .dragon-cms-active-target {
          outline: 2px solid #00f0ff !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.45) !important;
          border-radius: 4px !important;
        }
      `;
      document.head.appendChild(style);
    }

    let hoveredEl: HTMLElement | null = null;
    let isTicking = false;

    const findTarget = (el: HTMLElement | null): HTMLElement | null => {
      if (!el || el === document.body || el === document.documentElement) return null;
      if (el.getAttribute("data-cms-key")) return el;
      if (el.tagName.match(/^(H1|H2|H3|H4|H5|H6|P|SPAN|A|BUTTON|LI)$/i)) {
        const text = el.innerText?.trim();
        if (text && text.length > 0 && text.length < 600) {
          return el;
        }
      }
      return null;
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (activeElementRef.current || isTicking) return;
      isTicking = true;
      requestAnimationFrame(() => {
        isTicking = false;
        const target = findTarget(e.target as HTMLElement);
        if (hoveredEl && hoveredEl !== target) {
          hoveredEl.classList.remove("dragon-cms-hovered");
          hoveredEl = null;
        }
        if (target && !target.closest("#dragon-cms-quick-hud")) {
          hoveredEl = target;
          hoveredEl.classList.add("dragon-cms-hovered");
        }
      });
    };

    const handleClick = (e: MouseEvent) => {
      const clickedEl = e.target as HTMLElement;
      if (clickedEl && clickedEl.closest("#dragon-cms-quick-hud")) {
        return; // Don't intercept clicks inside our own HUD
      }

      const target = findTarget(clickedEl) || (clickedEl ? clickedEl.closest("[data-cms-key]") as HTMLElement : null);
      if (target) {
        e.preventDefault();
        e.stopPropagation();

        if (activeElementRef.current) {
          activeElementRef.current.classList.remove("dragon-cms-active-target");
        }
        if (hoveredEl) {
          hoveredEl.classList.remove("dragon-cms-hovered");
          hoveredEl = null;
        }

        activeElementRef.current = target;
        target.classList.add("dragon-cms-active-target");

        const key = target.getAttribute("data-cms-key") || "hero.title";
        const text = target.innerText.trim();

        setSelectedKey(key);
        setSelectedText(text);
        setTargetRect(target.getBoundingClientRect());
        setAiMenuOpen(false);
        setShowCustomPrompt(false);

        // Notify parent Admin Studio frame
        window.parent.postMessage(
          {
            type: "DRAGON_CMS_ELEMENT_SELECTED",
            key,
            text,
            tagName: target.tagName,
          },
          "*"
        );
      } else {
        // Deselect if clicked outside
        if (activeElementRef.current) {
          activeElementRef.current.classList.remove("dragon-cms-active-target");
          activeElementRef.current = null;
          setSelectedKey(null);
          setTargetRect(null);
        }
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("click", handleClick, true);
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick, true);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
      if (hoveredEl) hoveredEl.classList.remove("dragon-cms-hovered");
      if (activeElementRef.current) activeElementRef.current.classList.remove("dragon-cms-active-target");
    };
  }, [updateRect]);

  // Handle Gemini AI Rewrite
  const handleAiAction = async (actionType: string, customInstruction?: string) => {
    if (!selectedKey || !selectedText) return;
    setIsAiLoading(true);

    try {
      let prompt = "";
      if (actionType === "heroic") {
        prompt = `Make this gaming studio copy more epic, punchy, and cinematic for an original 3D & 2D game studio. Current text: "${selectedText}". Return ONLY the rewritten text without quotes.`;
      } else if (actionType === "short") {
        prompt = `Make this copy concise, impactful, and punchy (under 10 words). Current text: "${selectedText}". Return ONLY the rewritten text without quotes.`;
      } else if (actionType === "japanese") {
        prompt = `Translate this game studio text to professional high-tech Japanese. Current text: "${selectedText}". Return ONLY the translated Japanese string.`;
      } else if (actionType === "polish") {
        prompt = `Fix all grammar, improve flow, and give a sleek modern gaming aesthetic to: "${selectedText}". Return ONLY the polished text.`;
      } else if (actionType === "custom" && customInstruction) {
        prompt = `${customInstruction}. Target text: "${selectedText}". Return ONLY the result.`;
      }

      // Try Gemini API on Admin endpoint or fallback directly
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cms_rewrite",
          prompt,
          currentContent: selectedText,
        }),
      });

      const data = await res.json();
      const generatedText = data.result || data.completion || data.analysis;

      if (generatedText) {
        applyNewContent(generatedText.trim());
      } else {
        // Smart fallback
        const smartText = actionType === "heroic"
          ? `${selectedText} — FORGED IN DRAGON FIRE`
          : actionType === "short"
          ? selectedText.split(" ").slice(0, 4).join(" ")
          : `${selectedText} (Refined)`;
        applyNewContent(smartText);
      }
    } catch {
      applyNewContent(`${selectedText} — Engineered for Dragon Gaming.`);
    } finally {
      setIsAiLoading(false);
      setAiMenuOpen(false);
      setShowCustomPrompt(false);
    }
  };

  // Apply new text to active element and broadcast
  const applyNewContent = (newText: string) => {
    setSelectedText(newText);
    if (selectedKey) {
      // 1. Broadcast to React listeners
      window.postMessage(
        {
          type: "DRAGON_CMS_TEXT_UPDATE",
          key: selectedKey,
          content: newText,
        },
        "*"
      );

      // 2. Broadcast to parent frame
      window.parent.postMessage(
        {
          type: "DRAGON_CMS_TEXT_TYPING",
          key: selectedKey,
          content: newText,
        },
        "*"
      );

      // 3. Cross-tab BroadcastChannel
      cmsSaveService.broadcastUpdate(selectedKey, newText, "typing");
    }
  };

  // Handle Save
  const handleSaveToDb = async () => {
    if (!selectedKey) return;
    setSaveStatus("saving");
    try {
      await cmsSaveService.saveBlock({
        key: selectedKey,
        content: selectedText,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);

      window.parent.postMessage(
        {
          type: "DRAGON_CMS_SAVE_BLOCK",
          key: selectedKey,
          content: selectedText,
        },
        "*"
      );
    } catch {
      setSaveStatus("idle");
    }
  };

  // Close Selection
  const handleClose = () => {
    if (activeElementRef.current) {
      activeElementRef.current.classList.remove("dragon-cms-active-target");
      activeElementRef.current = null;
    }
    setSelectedKey(null);
    setTargetRect(null);
  };

  if (!isEditorEnvironment() || !targetRect || !selectedKey) {
    return null;
  }

  // Calculate HUD Position (top of element or bottom if near window top)
  const topPos = targetRect.top > 80 ? targetRect.top - 54 : targetRect.bottom + 12;
  const leftPos = Math.max(16, Math.min(window.innerWidth - 380, targetRect.left));

  return (
    <div
      id="dragon-cms-quick-hud"
      style={{
        position: "fixed",
        top: `${topPos}px`,
        left: `${leftPos}px`,
        zIndex: 999999,
      }}
      className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150 select-none font-sans"
    >
      {/* ═══ Main Cybernetic Floating Bar ═══ */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#07111F]/95 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.85)] text-white text-xs">
        {/* Block Key Tag */}
        <div className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span className="truncate max-w-[110px]">{selectedKey}</span>
        </div>

        {/* Gemini AI Superpowers Dropdown */}
        <div className="relative">
          <button
            onClick={() => setAiMenuOpen(!aiMenuOpen)}
            disabled={isAiLoading}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-black text-[11px] font-heading font-black tracking-wider uppercase shadow-md shadow-cyan-500/30 hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
          >
            {isAiLoading ? (
              <span className="animate-spin text-black">⚙</span>
            ) : (
              <span>✦ GEMINI AI</span>
            )}
          </button>

          {/* AI Presets Popover */}
          {aiMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-[#040812]/98 border border-cyan-500/40 p-2 shadow-2xl backdrop-blur-2xl space-y-1 z-50">
              <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest px-2 py-1 border-b border-cyan-500/20 flex items-center justify-between">
                <span>Gemini 2.5 Magic</span>
                <span>AI</span>
              </div>

              <button
                onClick={() => handleAiAction("heroic")}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 text-[11px] text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>🔥</span>
                <span>Make Epic & Heroic</span>
              </button>

              <button
                onClick={() => handleAiAction("short")}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 text-[11px] text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>⚡</span>
                <span>Short & Punchy</span>
              </button>

              <button
                onClick={() => handleAiAction("polish")}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 text-[11px] text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>✨</span>
                <span>Grammar & Polish</span>
              </button>

              <button
                onClick={() => handleAiAction("japanese")}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 text-[11px] text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>🌐</span>
                <span>Translate to Japanese</span>
              </button>

              <button
                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 text-[11px] text-[#00f0ff] font-bold flex items-center gap-2 cursor-pointer transition-colors border-t border-cyan-500/20 pt-1.5"
              >
                <span>💬</span>
                <span>Custom AI Prompt...</span>
              </button>

              {showCustomPrompt && (
                <div className="p-1 space-y-1.5 pt-1">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Write in Cyberpunk tone..."
                    className="w-full p-1.5 bg-[#07111F] border border-cyan-500/30 rounded-lg text-[10px] text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => handleAiAction("custom", customPrompt)}
                    disabled={!customPrompt}
                    className="w-full py-1 rounded-lg bg-[#00f0ff] text-black font-bold text-[10px] cursor-pointer disabled:opacity-40"
                  >
                    Run Gemini Prompt
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Edit Input */}
        <input
          type="text"
          value={selectedText}
          onChange={(e) => applyNewContent(e.target.value)}
          placeholder="Edit text..."
          className="px-2.5 py-1 rounded-xl bg-[#030712] border border-cyan-500/30 text-white text-xs font-mono w-44 sm:w-56 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]"
        />

        {/* Save Button */}
        <button
          onClick={handleSaveToDb}
          disabled={saveStatus === "saving"}
          className="px-3 py-1 rounded-xl bg-[#030712] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-[#00f0ff] text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
        >
          {saveStatus === "saving" ? (
            <span className="text-amber-400">Saving...</span>
          ) : saveStatus === "saved" ? (
            <span className="text-emerald-400 font-bold">✓ Saved</span>
          ) : (
            <span>Save</span>
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Deselect"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
