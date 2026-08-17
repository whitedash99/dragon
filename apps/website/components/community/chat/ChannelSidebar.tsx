"use client";

import React, { useState } from "react";
import { 
  Hash, 
  Megaphone, 
  Sparkles, 
  ShieldAlert, 
  Gamepad2, 
  Image as ImageIcon, 
  Lightbulb, 
  Coffee, 
  Flame, 
  Zap, 
  Crosshair, 
  ChevronDown, 
  ChevronRight,
  Radio,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useSession, signIn } from "next-auth/react";

export interface CommunityRoomItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  type: string;
  icon?: string | null;
  order: number;
}

interface ChannelSidebarProps {
  rooms: CommunityRoomItem[];
  activeRoomSlug: string;
  onSelectRoom: (room: CommunityRoomItem) => void;
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  ShieldAlert,
  Megaphone,
  Hash,
  Gamepad2,
  Image: ImageIcon,
  Lightbulb,
  Coffee,
  Flame,
  Zap,
  Crosshair,
};

export function ChannelSidebar({
  rooms,
  activeRoomSlug,
  onSelectRoom,
  className,
}: ChannelSidebarProps) {
  const { data: session } = useSession();
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group rooms by category
  const categories = ["INFORMATION", "COMMUNITY", "GAMES", "OFF_TOPIC"];
  const groupedRooms: { [key: string]: CommunityRoomItem[] } = {};

  categories.forEach((cat) => {
    groupedRooms[cat] = rooms
      .filter((r) => r.category === cat)
      .sort((a, b) => a.order - b.order);
  });

  return (
    <aside
      className={cn(
        "flex flex-col justify-between w-64 bg-[#07111F]/95 backdrop-blur-2xl border-r border-blue-500/20 text-slate-200 select-none h-full",
        className
      )}
    >
      {/* ═══ Header Brand ═══ */}
      <div className="p-4 border-b border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-[0_0_12px_rgba(59,130,246,0.3)] shrink-0">
            🐉
          </div>
          <div className="truncate">
            <h2 className="font-heading font-black text-xs uppercase tracking-wider text-white truncate">
              Dragon Insiders
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono">
              <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Real-Time Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Channels Navigation ═══ */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5 custom-scrollbar">
        {categories.map((catKey) => {
          const catRooms = groupedRooms[catKey] || [];
          if (catRooms.length === 0) return null;

          const isCollapsed = collapsedCategories[catKey];
          const displayTitle =
            catKey === "INFORMATION"
              ? "STUDIO DISPATCHES"
              : catKey === "COMMUNITY"
              ? "COMMUNITY CHANNELS"
              : catKey === "GAMES"
              ? "GAME LOUNGES"
              : catKey;

          return (
            <div key={catKey} className="space-y-1">
              <button
                onClick={() => toggleCategory(catKey)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-mono font-bold tracking-widest text-slate-400 hover:text-white uppercase transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {isCollapsed ? (
                    <ChevronRight className="size-3 text-slate-500" />
                  ) : (
                    <ChevronDown className="size-3 text-slate-500" />
                  )}
                  <span>{displayTitle}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono font-normal">
                  {catRooms.length}
                </span>
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 mt-1">
                  {catRooms.map((room) => {
                    const isActive = activeRoomSlug === room.slug;
                    const IconComponent = (room.icon && ICON_MAP[room.icon]) || Hash;

                    return (
                      <button
                        key={room.id}
                        onClick={() => onSelectRoom(room)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group text-left",
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-md shadow-blue-500/25"
                            : "text-slate-400 hover:text-white hover:bg-blue-950/40"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <IconComponent
                            className={cn(
                              "size-4 shrink-0 transition-transform group-hover:scale-110",
                              isActive
                                ? "text-white"
                                : "text-slate-500 group-hover:text-cyan-400"
                            )}
                          />
                          <span className="truncate">{room.name}</span>
                        </div>

                        {room.type === "ANNOUNCEMENT" && (
                          <span
                            className={cn(
                              "text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold",
                              isActive
                                ? "bg-white/20 text-white border-white/30"
                                : "bg-blue-600/10 text-cyan-400 border-blue-500/20"
                            )}
                          >
                            OFFICIAL
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ User Identity Footer ═══ */}
      <div className="p-3 bg-[#040812]/90 border-t border-blue-500/20">
        {session?.user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative size-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="size-full rounded-xl object-cover"
                  />
                ) : (
                  (session.user.name || "D").substring(0, 2).toUpperCase()
                )}
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 border-2 border-[#040812]" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {session.user.name || "Dragon Insider"}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                  {session.user.role || "MEMBER"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <UserIcon className="size-3.5" />
            <span>Sign In to Chat</span>
          </button>
        )}
      </div>
    </aside>
  );
}
