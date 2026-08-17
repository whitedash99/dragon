"use client";

import React from "react";
import { OnlineMember } from "@/hooks/useRealtimeChat";
import { Crown, Code, ShieldCheck, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface MemberSidebarProps {
  members: OnlineMember[];
  className?: string;
}

// Fallback staff roster when in offline/demo mode
const DEFAULT_STAFF: OnlineMember[] = [
  { clientId: "st-1", userId: "st-1", name: "Kaelen Voss", role: "FOUNDER", status: "ONLINE" },
  { clientId: "st-2", userId: "st-2", name: "Dr. Marcus Vance", role: "DEVELOPER", status: "ONLINE" },
  { clientId: "st-3", userId: "st-3", name: "Aria Sterling", role: "MODERATOR", status: "ONLINE" },
];

export function MemberSidebar({ members, className }: MemberSidebarProps) {
  const mergedMembers = members.length > 0 ? members : DEFAULT_STAFF;

  const owners = mergedMembers.filter(
    (m) => m.role.toUpperCase() === "OWNER" || m.role.toUpperCase() === "FOUNDER"
  );
  const devs = mergedMembers.filter(
    (m) =>
      m.role.toUpperCase() === "DEVELOPER" ||
      m.role.toUpperCase() === "ADMIN" ||
      m.role.toUpperCase() === "SUPER_ADMIN"
  );
  const mods = mergedMembers.filter((m) => m.role.toUpperCase() === "MODERATOR");
  const players = mergedMembers.filter(
    (m) => !["OWNER", "FOUNDER", "DEVELOPER", "ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(m.role.toUpperCase())
  );

  return (
    <aside
      className={cn(
        "w-60 bg-[#07111F]/95 backdrop-blur-2xl border-l border-blue-500/20 text-slate-200 p-4 select-none h-full overflow-y-auto custom-scrollbar space-y-6",
        className
      )}
    >
      {/* ═══ Owners Section ═══ */}
      {owners.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase px-2 flex items-center gap-1.5">
            <Crown className="size-3 text-cyan-400" />
            <span>FOUNDERS — {owners.length}</span>
          </div>
          <div className="space-y-1">
            {owners.map((member) => (
              <MemberCard key={member.clientId} member={member} isOwner />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Developers Section ═══ */}
      {devs.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase px-2 flex items-center gap-1.5">
            <Code className="size-3 text-blue-400" />
            <span>DEV TEAM — {devs.length}</span>
          </div>
          <div className="space-y-1">
            {devs.map((member) => (
              <MemberCard key={member.clientId} member={member} isDev />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Moderators Section ═══ */}
      {mods.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase px-2 flex items-center gap-1.5">
            <ShieldCheck className="size-3 text-emerald-400" />
            <span>MODERATORS — {mods.length}</span>
          </div>
          <div className="space-y-1">
            {mods.map((member) => (
              <MemberCard key={member.clientId} member={member} isMod />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Online Players Section ═══ */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase px-2">
          INSIDERS — {players.length}
        </div>
        <div className="space-y-1">
          {players.length === 0 ? (
            <div className="px-2 py-1 text-[11px] text-slate-500 font-mono">
              Waiting for players...
            </div>
          ) : (
            players.map((member) => <MemberCard key={member.clientId} member={member} />)
          )}
        </div>
      </div>
    </aside>
  );
}

function MemberCard({
  member,
  isOwner,
  isDev,
  isMod,
}: {
  member: OnlineMember;
  isOwner?: boolean;
  isDev?: boolean;
  isMod?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-blue-950/40 transition-colors group cursor-pointer">
      <div className="relative size-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] text-slate-200 shrink-0">
        {member.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.avatar} alt={member.name} className="size-full rounded-xl object-cover" />
        ) : (
          (member.name || "D").substring(0, 2).toUpperCase()
        )}
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 border-2 border-[#07111F]" />
      </div>

      <div className="truncate">
        <div
          className={cn(
            "text-xs font-bold truncate",
            isOwner
              ? "text-cyan-300"
              : isDev
              ? "text-cyan-400"
              : isMod
              ? "text-emerald-300"
              : "text-slate-300 group-hover:text-white"
          )}
        >
          {member.name}
        </div>
        <div className="text-[9px] text-slate-500 font-mono uppercase">
          {member.role || "MEMBER"}
        </div>
      </div>
    </div>
  );
}
