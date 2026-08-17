"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, description, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = String(Date.now() + Math.random());
      setToasts((prev) => [...prev.slice(-4), { id, type, title, description, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => addToast({ type: "success", title, description }),
    [addToast]
  );
  const error = useCallback(
    (title: string, description?: string) => addToast({ type: "error", title, description }),
    [addToast]
  );
  const warning = useCallback(
    (title: string, description?: string) => addToast({ type: "warning", title, description }),
    [addToast]
  );
  const info = useCallback(
    (title: string, description?: string) => addToast({ type: "info", title, description }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {/* Floating Toast Notification Layer */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none font-sans">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xl text-slate-900"
              >
                {toast.type === "success" && <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />}
                {toast.type === "error" && <AlertCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />}
                {toast.type === "warning" && <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />}
                {toast.type === "info" && <Info className="size-5 text-sky-600 shrink-0 mt-0.5" />}

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 tracking-tight">{toast.title}</div>
                  {toast.description && (
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{toast.description}</div>
                  )}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
