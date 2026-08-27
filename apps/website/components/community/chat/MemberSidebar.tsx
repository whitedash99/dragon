"use client";

import React from "react";
import { OnlineMember } from "@/hooks/useRealtimeChat";
import { Crown, Code, ShieldCheck, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface MemberSidebarProps {
  members: OnlineMember[];
  className?: string;
}

export function MemberSidebar({ members, className }: MemberSidebarProps) {
  const owners = members.filter(
    (m) => m.role.toUpperCase() === "OWNER" || m.role.toUpperCase() === "FOUNDER"
  );
  const devs = members.filter(
    (m) =>
      m.role.toUpperCase() === "DEVELOPER" ||
      m.role.toUpperCase() === "ADMIN" ||
      m.role.toUpperCase() === "SUPER_ADMIN"
  );
  const mods = members.filter((m) => m.role.toUpperCase() === "MODERATOR");
  const players = members.filter(
    (m) => !["OWNER", "FOUNDER", "DEVELOPER", "ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(m.role.toUpperCase())
  );

  return (
    <aside
      className={cn(
        "w-60 bg-[#03091D]/95 backdrop-blur-2xl border-l border-cyan-500/20 text-slate-200 p-4 select-none h-full overflow-y-auto custom-scrollbar space-y-6 font-mono",
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
              <MemberCard key={member.clientId || member.userId} member={member} isOwner />
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
              <MemberCard key={member.clientId || member.userId} member={member} isDev />
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
              <MemberCard key={member.clientId || member.userId} member={member} isMod />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Online Players Section ═══ */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase px-2">
          REAL PLAYERS — {players.length}
        </div>
        <div className="space-y-1">
          {players.length === 0 ? (
            <div className="px-2 py-2 text-[11px] text-slate-500 font-mono">
              No other players in database.
            </div>
          ) : (
            players.map((member) => <MemberCard key={member.clientId || member.userId} member={member} />)
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
    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-cyan-500/10 transition-colors group cursor-pointer border border-transparent hover:border-cyan-500/20">
      <div className="relative size-7 rounded-xl bg-[#02050E] border border-cyan-500/30 flex items-center justify-center font-bold text-[11px] text-cyan-300 shrink-0">
        {member.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.avatar} alt={member.name} className="size-full rounded-xl object-cover" />
        ) : (
          (member.name || "D").substring(0, 2).toUpperCase()
        )}
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 border-2 border-[#02050E]" />
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
          {member.role || "PLAYER"}
        </div>
      </div>
    </div>
  );
}
