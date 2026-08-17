"use client";

import React, { useCallback } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, ThemeMode } from "@/providers/theme-provider";
import { cn } from "@/lib/utils/cn";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: React.ElementType }[] = [
    { mode: "light", label: "Light", icon: Sun },
    { mode: "dark", label: "Dark", icon: Moon },
    { mode: "system", label: "System", icon: Monitor },
  ];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, mode: ThemeMode) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setTheme(mode);
      }
    },
    [setTheme]
  );

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 transition-colors shadow-xs select-none",
        className
      )}
      role="radiogroup"
      aria-label="Theme mode selection"
    >
      {options.map(({ mode, label, icon: Icon }) => {
        const isActive = theme === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => setTheme(mode)}
            onKeyDown={(e) => handleKeyDown(e, mode)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-purple-400",
              isActive
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200/90 dark:border-slate-700 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
            )}
            title={`Switch to ${label} theme mode`}
            aria-label={`${label} theme mode`}
            aria-checked={isActive}
            role="radio"
            tabIndex={0}
          >
            <Icon
              className={cn(
                "size-3.5 transition-transform duration-200",
                isActive
                  ? "scale-110 text-amber-500 dark:text-purple-400"
                  : "text-slate-400 dark:text-slate-500"
              )}
              aria-hidden="true"
            />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ThemeToggleButton({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shadow-xs active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-purple-400",
        className
      )}
      title={`Switch to ${resolvedTheme === "light" ? "Dark" : "Light"} mode`}
      aria-label="Toggle theme mode"
    >
      {resolvedTheme === "light" ? (
        <Moon className="size-4 text-slate-700 dark:text-slate-300" aria-hidden="true" />
      ) : (
        <Sun className="size-4 text-amber-400" aria-hidden="true" />
      )}
    </button>
  );
}

