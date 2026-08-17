"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "dragon-admin-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  const applyThemeToDOM = useCallback((resolved: ResolvedTheme) => {
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }
  }, []);

  const resolveTheme = useCallback((mode: ThemeMode): ResolvedTheme => {
    if (mode === "system") {
      return getSystemTheme();
    }
    return mode;
  }, []);

  // Sync initial state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      const initialMode: ThemeMode = saved === "dark" || saved === "system" || saved === "light" ? saved : "light";
      const resolved = resolveTheme(initialMode);
      
      setThemeState(initialMode);
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved);
    } catch {
      // Fallback to light theme if localStorage throws (e.g. iframe privacy)
      setThemeState("light");
      setResolvedTheme("light");
      applyThemeToDOM("light");
    } finally {
      setMounted(true);
    }
  }, [applyThemeToDOM, resolveTheme]);

  // Handle system preference changes when theme is set to 'system'
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
        setResolvedTheme(newResolved);
        applyThemeToDOM(newResolved);
      }
    };

    // Modern and fallback event listeners
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, [theme, mounted, applyThemeToDOM]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Unable to persist theme to localStorage:", e);
    }

    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
  }, [applyThemeToDOM, resolveTheme]);

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = resolvedTheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

