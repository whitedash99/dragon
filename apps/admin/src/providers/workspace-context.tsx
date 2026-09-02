"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export type WorkspaceId = "STUDIO_HUB" | "WEB_GAMES";

export interface WorkspaceMetadata {
  id: WorkspaceId;
  name: string;
  shortName: string;
  subtitle: string;
  tagline: string;
  basePath: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const WORKSPACES: Record<WorkspaceId, WorkspaceMetadata> = {
  STUDIO_HUB: {
    id: "STUDIO_HUB",
    name: "Dragon Gaming Studio",
    shortName: "Studio Hub",
    subtitle: "Main Studio Hub",
    tagline: "Studio Operations & Digital Infrastructure",
    basePath: "/studio",
    accentColor: "#3B82F6", // Blue
    badgeBg: "bg-blue-500/10 border-blue-500/20",
    badgeText: "text-blue-400",
    description: "Manage studio website, pages, releases, communications, team access, and core infrastructure.",
  },
  WEB_GAMES: {
    id: "WEB_GAMES",
    name: "Dragon Web Games",
    shortName: "Web Games",
    subtitle: "Game Platform",
    tagline: "Game Platform, Catalog & Player Network",
    basePath: "/games-hub",
    accentColor: "#6366F1", // Indigo
    badgeBg: "bg-indigo-500/10 border-indigo-500/20",
    badgeText: "text-indigo-400",
    description: "Manage games catalog, levels, player accounts, leaderboards, achievements, and game engine releases.",
  },
};

interface WorkspaceContextType {
  activeWorkspace: WorkspaceId;
  workspace: WorkspaceMetadata;
  switchWorkspace: (id: WorkspaceId, navigate?: boolean) => void;
  isStudioHub: boolean;
  isWebGames: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine initial workspace from pathname or fallback to STUDIO_HUB
  const getInitialWorkspace = (): WorkspaceId => {
    if (typeof window !== "undefined") {
      if (pathname.startsWith("/games-hub")) return "WEB_GAMES";
      if (pathname.startsWith("/studio")) return "STUDIO_HUB";

      const saved = localStorage.getItem("dragon_active_workspace") as WorkspaceId;
      if (saved === "WEB_GAMES" || saved === "STUDIO_HUB") return saved;
    }
    return "STUDIO_HUB";
  };

  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>("STUDIO_HUB");

  useEffect(() => {
    if (pathname.startsWith("/games-hub")) {
      setActiveWorkspace("WEB_GAMES");
      localStorage.setItem("dragon_active_workspace", "WEB_GAMES");
      document.cookie = "dragon_admin_workspace=WEB_GAMES; path=/; max-age=31536000; SameSite=Lax";
    } else if (pathname.startsWith("/studio")) {
      setActiveWorkspace("STUDIO_HUB");
      localStorage.setItem("dragon_active_workspace", "STUDIO_HUB");
      document.cookie = "dragon_admin_workspace=STUDIO_HUB; path=/; max-age=31536000; SameSite=Lax";
    } else {
      const saved = localStorage.getItem("dragon_active_workspace") as WorkspaceId;
      if (saved === "WEB_GAMES" || saved === "STUDIO_HUB") {
        setActiveWorkspace(saved);
      }
    }
  }, [pathname]);

  const switchWorkspace = (id: WorkspaceId, navigate: boolean = true) => {
    setActiveWorkspace(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("dragon_active_workspace", id);
      document.cookie = `dragon_admin_workspace=${id}; path=/; max-age=31536000; SameSite=Lax`;
    }

    if (navigate) {
      const targetBase = WORKSPACES[id].basePath;
      router.push(targetBase);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        workspace: WORKSPACES[activeWorkspace],
        switchWorkspace,
        isStudioHub: activeWorkspace === "STUDIO_HUB",
        isWebGames: activeWorkspace === "WEB_GAMES",
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
