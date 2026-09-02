"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWorkspace, WORKSPACES, WorkspaceId } from "@/providers/workspace-context";
import { ChevronDown, Check, LayoutGrid, Globe, Gamepad2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function WorkspaceSwitcher() {
  const { activeWorkspace, switchWorkspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = WORKSPACES[activeWorkspace];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all text-left group"
        title="Switch Workspace"
      >
        <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-500/20 text-indigo-400">
          {activeWorkspace === "STUDIO_HUB" ? (
            <Globe className="w-3.5 h-3.5" />
          ) : (
            <Gamepad2 className="w-3.5 h-3.5" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-200 tracking-tight leading-tight group-hover:text-white">
            {current.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono leading-none">
            {current.subtitle}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ml-1 ${open ? "rotate-180 text-white" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-72 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-white/5 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Select Workspace
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1 Session</span>
          </div>

          <div className="space-y-1">
            {(Object.keys(WORKSPACES) as WorkspaceId[]).map((id) => {
              const ws = WORKSPACES[id];
              const isActive = activeWorkspace === id;

              return (
                <button
                  key={id}
                  onClick={() => {
                    switchWorkspace(id, true);
                    setOpen(false);
                  }}
                  className={`w-full flex items-start justify-between p-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-indigo-600/15 border border-indigo-500/30 text-white"
                      : "hover:bg-white/[0.05] border border-transparent text-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center mt-0.5 ${
                        id === "STUDIO_HUB"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-indigo-500/20 text-indigo-400"
                      }`}
                    >
                      {id === "STUDIO_HUB" ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Gamepad2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        {ws.name}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-tight line-clamp-1">
                        {ws.description}
                      </div>
                    </div>
                  </div>

                  {isActive && <Check className="w-4 h-4 text-indigo-400 mt-1 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1 border-t border-white/5">
            <Link
              href="/workspaces"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                <span>All Workspaces Grid</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
