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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  const applyThemeToDOM = useCallback((resolved: ResolvedTheme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
  }, []);

  useEffect(() => {
    applyThemeToDOM("dark");
  }, [applyThemeToDOM]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState("dark");
    try {
      localStorage.setItem(STORAGE_KEY, "dark");
    } catch {}
    applyThemeToDOM("dark");
  }, [applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme: "dark", resolvedTheme: "dark", setTheme, toggleTheme }}>
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
