"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cmsSaveService } from "@/lib/cms/cmsSaveService";

export interface UseCMSEditorOptions {
  key: string;
  initialContent: string;
  category?: string;
  label?: string;
  type?: "text" | "textarea" | "richtext";
  placeholder?: string;
  debounceMs?: number;
  onSaveSuccess?: (content: string) => void;
  onSaveError?: (error: string) => void;
}

export type CMSSaveStatus = "idle" | "typing" | "saving" | "saved" | "error";

export function useCMSEditor({
  key,
  initialContent,
  category = "General",
  label,
  type = "text",
  placeholder = "Click here to type...",
  debounceMs = 800,
  onSaveSuccess,
  onSaveError,
}: UseCMSEditorOptions) {
  const [content, setContent] = useState<string>(initialContent ?? "");
  const [saveStatus, setSaveStatus] = useState<CMSSaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const lastSavedContentRef = useRef<string>(initialContent ?? "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const savedBadgeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Synchronize initial content changes
  useEffect(() => {
    if (initialContent !== undefined && initialContent !== lastSavedContentRef.current && !isEditing) {
      setContent(initialContent);
      lastSavedContentRef.current = initialContent;
    }
  }, [initialContent, isEditing]);

  // Real-time BroadcastChannel & postMessage listener
  useEffect(() => {
    isMountedRef.current = true;

    const handleBroadcast = (event: MessageEvent) => {
      const { type: evtType, key: evtKey, content: evtContent, status } = event.data || {};
      if (evtKey === key && evtContent !== undefined) {
        if (evtType === "DRAGON_CMS_REALTIME_SYNC" || evtType === "DRAGON_CMS_TEXT_UPDATE") {
          if (!isEditing) {
            setContent(evtContent);
            if (status === "saved") {
              lastSavedContentRef.current = evtContent;
              setSaveStatus("saved");
              if (savedBadgeTimerRef.current) clearTimeout(savedBadgeTimerRef.current);
              savedBadgeTimerRef.current = setTimeout(() => {
                if (isMountedRef.current) setSaveStatus("idle");
              }, 2500);
            }
          }
        }
      }
    };

    const channel = cmsSaveService.getBroadcastChannel();
    if (channel) {
      channel.addEventListener("message", handleBroadcast);
    }
    window.addEventListener("message", handleBroadcast);

    return () => {
      isMountedRef.current = false;
      if (channel) {
        channel.removeEventListener("message", handleBroadcast);
      }
      window.removeEventListener("message", handleBroadcast);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (savedBadgeTimerRef.current) clearTimeout(savedBadgeTimerRef.current);
    };
  }, [key, isEditing]);

  // Execute Save Request
  const performSave = useCallback(
    async (textToSave: string) => {
      if (textToSave === lastSavedContentRef.current) {
        setSaveStatus("idle");
        return;
      }

      setSaveStatus("saving");
      setErrorMessage(null);

      const result = await cmsSaveService.saveBlock({
        key,
        content: textToSave,
        category,
        label: label || key,
        type,
      });

      if (!isMountedRef.current) return;

      if (result.success) {
        lastSavedContentRef.current = textToSave;
        setSaveStatus("saved");
        onSaveSuccess?.(textToSave);

        if (savedBadgeTimerRef.current) clearTimeout(savedBadgeTimerRef.current);
        savedBadgeTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) setSaveStatus("idle");
        }, 2500);
      } else {
        setSaveStatus("error");
        setErrorMessage(result.error || "Failed to save changes");
        onSaveError?.(result.error || "Failed to save changes");
      }
    },
    [key, category, label, type, onSaveSuccess, onSaveError]
  );

  // Handle Input Changes with Debounce Autosave
  const handleContentChange = useCallback(
    (newText: string) => {
      setContent(newText);
      setSaveStatus("typing");

      // Emit optimistic typing broadcast
      cmsSaveService.broadcastUpdate(key, newText, "typing");

      // Debounced Autosave
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        performSave(newText);
      }, debounceMs);
    },
    [key, performSave, debounceMs]
  );

  // Manual Trigger Save (e.g. Ctrl+S or Blur)
  const triggerManualSave = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    performSave(content);
  }, [content, performSave]);

  // Cancel edit & revert to last saved
  const cancelEdit = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setContent(lastSavedContentRef.current);
    setSaveStatus("idle");
    setIsEditing(false);
  }, []);

  // Keyboard Shortcuts Handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        triggerManualSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      } else if (e.key === "Enter" && type === "text" && !e.shiftKey) {
        e.preventDefault();
        triggerManualSave();
        setIsEditing(false);
      }
    },
    [triggerManualSave, cancelEdit, type]
  );

  const isEmpty = content.trim().length === 0;

  return {
    content,
    saveStatus,
    errorMessage,
    isEditing,
    isEmpty,
    placeholder,
    setIsEditing,
    setContent: handleContentChange,
    triggerManualSave,
    cancelEdit,
    handleKeyDown,
    retrySave: () => performSave(content),
  };
}
