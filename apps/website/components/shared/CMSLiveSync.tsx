"use client";

import { useEffect, useRef } from "react";

export function CMSLiveSync() {
  const hoverOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 0. EDITOR MODE DETECTION GUARD
    // Only enable visual editing tools if loaded inside Admin Iframe or with ?editor=true
    const isEditorMode =
      typeof window !== "undefined" &&
      (window.self !== window.top || window.location.search.includes("editor=true"));

    if (!isEditorMode) {
      return;
    }

    // Floating hover outline overlay box (Editor Mode Only)
    const overlay = document.createElement("div");
    overlay.id = "dragon-cms-hover-overlay";
    overlay.style.position = "fixed";
    overlay.style.pointerEvents = "none";
    overlay.style.border = "2px dashed #38bdf8";
    overlay.style.backgroundColor = "rgba(56, 189, 248, 0.06)";
    overlay.style.borderRadius = "6px";
    overlay.style.zIndex = "999999";
    overlay.style.display = "none";
    overlay.style.transition = "top 0.05s ease, left 0.05s ease, width 0.05s ease, height 0.05s ease";

    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.top = "-22px";
    tooltip.style.left = "0";
    tooltip.style.backgroundColor = "#0284c7";
    tooltip.style.color = "#ffffff";
    tooltip.style.fontSize = "10px";
    tooltip.style.fontWeight = "600";
    tooltip.style.fontFamily = "sans-serif";
    tooltip.style.padding = "2px 6px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.innerText = "Click to Edit";
    overlay.appendChild(tooltip);

    document.body.appendChild(overlay);
    hoverOverlayRef.current = overlay;

    let activeEditableElement: HTMLElement | null = null;
    let originalTextBeforeEdit: string = "";

    // 1. Hover Listener (Blue Hover Outline + Tooltip)
    const handleMouseMove = (e: MouseEvent) => {
      if (activeEditableElement) {
        overlay.style.display = "none";
        return;
      }

      const target = e.target as HTMLElement;
      if (!target || target === overlay || target.closest("#dragon-cms-hover-overlay")) return;

      const text = target.innerText?.trim();
      if (text && text.length > 0 && text.length < 500) {
        const rect = target.getBoundingClientRect();
        overlay.style.display = "block";
        overlay.style.top = `${rect.top}px`;
        overlay.style.left = `${rect.left}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        const key = target.getAttribute("data-cms-key") || text.slice(0, 20);
        tooltip.innerText = `<${target.tagName.toLowerCase()}> ${key}`;
      } else {
        overlay.style.display = "none";
      }
    };

    // Helper: Select Block Element (Single Click)
    const selectElement = (target: HTMLElement) => {
      const text = target.innerText?.trim();
      if (!text || text.length === 0 || text.length >= 500) return;

      const rect = target.getBoundingClientRect();
      const key = target.getAttribute("data-cms-key") || "hero.title";

      window.parent.postMessage(
        {
          type: "DRAGON_CMS_ELEMENT_SELECTED",
          key,
          text: target.innerText,
          tagName: target.tagName,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        },
        "*"
      );
    };

    // Helper: Position Caret at End of Text
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

    // Helper: Start Inline Editing Mode on Element (Double Click)
    const enableElementEditing = (target: HTMLElement) => {
      if (activeEditableElement === target) return;

      if (activeEditableElement && activeEditableElement !== target) {
        activeEditableElement.blur();
      }

      const text = target.innerText;
      if (text === undefined || text === null) return;

      activeEditableElement = target;
      originalTextBeforeEdit = target.innerText;

      // Enable contentEditable without modifying element DOM structure, typography or CSS classes
      target.contentEditable = "true";
      target.setAttribute("spellcheck", "false");
      target.style.outline = "2px solid #38bdf8";
      target.style.outlineOffset = "2px";
      target.style.borderRadius = "4px";
      target.style.caretColor = "#38bdf8";

      overlay.style.display = "none";

      // Focus element & place caret at end instantly
      placeCaretAtEnd(target);

      // Notify parent frame of element selection
      selectElement(target);

      // Live typing listener
      const handleInput = () => {
        const newText = target.innerText;
        const currentKey = target.getAttribute("data-cms-key") || "hero.title";
        window.parent.postMessage(
          {
            type: "DRAGON_CMS_TEXT_TYPING",
            key: currentKey,
            content: newText,
          },
          "*"
        );
      };

      // Comprehensive Rich Text & Navigation Keyboard Shortcuts
      const handleKeyDown = (keyEvent: KeyboardEvent) => {
        const isCmdOrCtrl = keyEvent.metaKey || keyEvent.ctrlKey;

        if (isCmdOrCtrl && keyEvent.key.toLowerCase() === "b") {
          keyEvent.preventDefault();
          document.execCommand("bold");
          handleInput();
        } else if (isCmdOrCtrl && keyEvent.key.toLowerCase() === "i") {
          keyEvent.preventDefault();
          document.execCommand("italic");
          handleInput();
        } else if (isCmdOrCtrl && keyEvent.key.toLowerCase() === "u") {
          keyEvent.preventDefault();
          document.execCommand("underline");
          handleInput();
        } else if (isCmdOrCtrl && keyEvent.key.toLowerCase() === "z") {
          keyEvent.preventDefault();
          if (keyEvent.shiftKey) {
            document.execCommand("redo");
          } else {
            document.execCommand("undo");
          }
          handleInput();
        } else if (isCmdOrCtrl && keyEvent.key.toLowerCase() === "y") {
          keyEvent.preventDefault();
          document.execCommand("redo");
          handleInput();
        } else if (keyEvent.key === "Enter") {
          const isHeading = /^H[1-6]$/i.test(target.tagName);
          if (isHeading && !keyEvent.shiftKey) {
            keyEvent.preventDefault();
            target.blur();
          }
        } else if (keyEvent.key === "Escape") {
          keyEvent.preventDefault();
          target.innerText = originalTextBeforeEdit;
          target.blur();
        }
      };

      // Clean exit on blur
      const handleBlur = () => {
        target.contentEditable = "false";
        target.style.outline = "";
        target.style.outlineOffset = "";
        target.style.caretColor = "";

        target.removeEventListener("input", handleInput);
        target.removeEventListener("keydown", handleKeyDown);
        target.removeEventListener("blur", handleBlur);

        const finalContent = target.innerText;
        const currentKey = target.getAttribute("data-cms-key") || "hero.title";

        window.parent.postMessage(
          {
            type: "DRAGON_CMS_SAVE_BLOCK",
            key: currentKey,
            content: finalContent,
          },
          "*"
        );

        activeEditableElement = null;
      };

      target.addEventListener("input", handleInput);
      target.addEventListener("keydown", handleKeyDown);
      target.addEventListener("blur", handleBlur);
    };

    // 2. Event Listeners: Single Click = Select Block; Double Click = Edit Block
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || activeEditableElement) return;

      selectElement(target);
    };

    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const text = target.innerText?.trim();
      if (text && text.length > 0 && text.length < 500) {
        enableElementEditing(target);
      }
    };

    // 3. Message Listener from Parent Frame (Real-time sync)
    const handleMessage = (event: MessageEvent) => {
      const { type, key, content, command, value } = event.data || {};

      if (type === "DRAGON_CMS_TEXT_UPDATE" && content !== undefined) {
        const elements = document.querySelectorAll(`[data-cms-key="${key}"]`);
        if (elements.length > 0) {
          elements.forEach((el) => {
            // CRITICAL: Skip activeEditableElement so caret position is NEVER reset while typing!
            if (el !== activeEditableElement) {
              (el as HTMLElement).innerText = content;
            }
          });
        }
      }

      if (type === "DRAGON_CMS_EXEC_COMMAND" && activeEditableElement) {
        if (command === "bold") document.execCommand("bold");
        else if (command === "italic") document.execCommand("italic");
        else if (command === "underline") document.execCommand("underline");
        else if (command === "justifyLeft") document.execCommand("justifyLeft");
        else if (command === "justifyCenter") document.execCommand("justifyCenter");
        else if (command === "justifyRight") document.execCommand("justifyRight");
        else if (command === "createLink") document.execCommand("createLink", false, value || "https://");
        else if (command === "undo") document.execCommand("undo");
        else if (command === "redo") document.execCommand("redo");

        const newText = activeEditableElement.innerText;
        window.parent.postMessage(
          {
            type: "DRAGON_CMS_TEXT_TYPING",
            key: activeEditableElement.getAttribute("data-cms-key") || "hero.title",
            content: newText,
          },
          "*"
        );
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    document.addEventListener("dblclick", handleDblClick);
    window.addEventListener("message", handleMessage);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("dblclick", handleDblClick);
      window.removeEventListener("message", handleMessage);
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }, []);

  return null;
}

