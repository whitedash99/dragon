"use client";

import React, { useState, useEffect } from "react";
import { ChannelSidebar, CommunityRoomItem } from "./ChannelSidebar";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { MessageComposer } from "./MessageComposer";
import { TypingIndicator } from "./TypingIndicator";
import { MemberSidebar } from "./MemberSidebar";
import { ReportModal } from "../modals/ReportModal";
import { useRealtimeChat, ChatMessageItemData } from "@/hooks/useRealtimeChat";
import { X } from "lucide-react";

export const DEFAULT_COMMUNITY_ROOMS: CommunityRoomItem[] = [
  { id: "room_welcome", name: "welcome", slug: "welcome", description: "Studio onboarding, server manifest, and official links.", category: "INFORMATION", type: "TEXT", icon: "Sparkles", order: 1 },
  { id: "room_rules", name: "rules", slug: "rules", description: "Community conduct, moderation policies, and safety protocols.", category: "INFORMATION", type: "TEXT", icon: "ShieldAlert", order: 2 },
  { id: "room_announcements", name: "announcements", slug: "announcements", description: "Direct developer dispatches, game patch notes, and engine updates.", category: "INFORMATION", type: "ANNOUNCEMENT", icon: "Megaphone", order: 3 },
  { id: "room_general", name: "general", slug: "general", description: "Main lobby for Dragon Studios gamers and creators.", category: "COMMUNITY", type: "TEXT", icon: "Hash", order: 10 },
  { id: "room_gaming", name: "gaming", slug: "gaming", description: "General gaming chat, competitive builds, and hardware talk.", category: "COMMUNITY", type: "TEXT", icon: "Gamepad2", order: 11 },
  { id: "room_clips", name: "gameplay-clips", slug: "gameplay-clips", description: "Share 4K gameplay clips, screenshots, and artwork.", category: "COMMUNITY", type: "TEXT", icon: "Image", order: 12 },
  { id: "room_suggestions", name: "suggestions", slug: "suggestions", description: "Pitch features and balance ideas directly to Dragon devs.", category: "COMMUNITY", type: "TEXT", icon: "Lightbulb", order: 13 },
  { id: "room_offtopic", name: "off-topic", slug: "off-topic", description: "Chill lounge for non-gaming banter and memes.", category: "COMMUNITY", type: "TEXT", icon: "Coffee", order: 14 },
  { id: "room_valyria", name: "embers-of-valyria", slug: "embers-of-valyria", description: "Official tactical discussion for Embers of Valyria playtesters.", category: "GAMES", type: "TEXT", icon: "Flame", order: 20 },
  { id: "room_neondrift", name: "neon-drift", slug: "neon-drift", description: "Speedruns, vehicle tuning, and track leaderboard discussion.", category: "GAMES", type: "TEXT", icon: "Zap", order: 21 },
  { id: "room_blacksite", name: "blacksite-zero", slug: "blacksite-zero", description: "Extraction tactics, weapon loadouts, and classified intel.", category: "GAMES", type: "TEXT", icon: "Crosshair", order: 22 },
];

export function CommunityChatView() {
  const [rooms, setRooms] = useState<CommunityRoomItem[]>(DEFAULT_COMMUNITY_ROOMS);
  const [activeRoom, setActiveRoom] = useState<CommunityRoomItem>(DEFAULT_COMMUNITY_ROOMS[3]); // default to general

  // Mobile drawer states
  const [showChannelsMobile, setShowChannelsMobile] = useState(false);
  const [showMembers, setShowMembers] = useState(true);

  // Replying & Report Modals
  const [replyingTo, setReplyingTo] = useState<ChatMessageItemData | null>(null);
  const [reportingMessage, setReportingMessage] = useState<ChatMessageItemData | null>(null);

  // Fetch rooms on mount and merge
  useEffect(() => {
    fetch("/api/community/chat/rooms")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.rooms) && data.rooms.length > 0) {
          setRooms(data.rooms);
          const gen = data.rooms.find((r: CommunityRoomItem) => r.slug === "general");
          if (gen) setActiveRoom(gen);
        }
      })
      .catch((e) => console.warn("[ChatView] Rooms fetch notice:", e));
  }, []);

  // Realtime hook for current room
  const {
    messages,
    loading,
    connectionStatus,
    typingUsers,
    onlineMembers,
    sendMessage,
    toggleReaction,
    sendTyping,
  } = useRealtimeChat(activeRoom.id, activeRoom.slug);

  const handleSelectRoom = (room: CommunityRoomItem) => {
    setActiveRoom(room);
    setShowChannelsMobile(false);
    setReplyingTo(null);
  };

  return (
    <div className="w-full h-[720px] max-h-[85vh] min-h-[580px] rounded-3xl bg-[#040812] border border-blue-500/30 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex relative z-10">
      {/* ═══ 1. Desktop Left: Channel Sidebar ═══ */}
      <div className="hidden lg:flex shrink-0 w-64 h-full">
        <ChannelSidebar
          rooms={rooms}
          activeRoomSlug={activeRoom.slug}
          onSelectRoom={handleSelectRoom}
          className="w-full h-full"
        />
      </div>

      {/* ═══ Mobile Left Drawer: Channel Sidebar ═══ */}
      {showChannelsMobile && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex">
          <div className="w-72 max-w-[80vw] h-full relative">
            <ChannelSidebar
              rooms={rooms}
              activeRoomSlug={activeRoom.slug}
              onSelectRoom={handleSelectRoom}
              className="w-full h-full"
            />
            <button
              onClick={() => setShowChannelsMobile(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-blue-950 text-slate-400 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1" onClick={() => setShowChannelsMobile(false)} />
        </div>
      )}

      {/* ═══ 2. Center: Chat Arena ═══ */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#07111F]/70 h-full relative">
        <ChatHeader
          roomName={activeRoom.name}
          roomDescription={activeRoom.description}
          connectionStatus={connectionStatus}
          onToggleMembers={() => setShowMembers((prev) => !prev)}
          onToggleChannels={() => setShowChannelsMobile(true)}
          showMembers={showMembers}
          onlineCount={onlineMembers.length || 5}
        />

        <div className="flex-1 overflow-hidden flex flex-col justify-between">
          <ChatMessageList
            messages={messages}
            roomName={activeRoom.name}
            roomDescription={activeRoom.description}
            loading={loading}
            onReply={(msg) => setReplyingTo(msg)}
            onToggleReaction={toggleReaction}
            onReport={(msg) => setReportingMessage(msg)}
          />

          <TypingIndicator typingUsers={typingUsers} />
        </div>

        <MessageComposer
          roomName={activeRoom.name}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onSendMessage={sendMessage}
          onSendTyping={sendTyping}
        />
      </div>

      {/* ═══ 3. Desktop Right: Members Sidebar ═══ */}
      {showMembers && (
        <div className="hidden xl:flex shrink-0 w-60 h-full">
          <MemberSidebar members={onlineMembers} className="w-full h-full" />
        </div>
      )}

      {/* Report Modal */}
      {reportingMessage && (
        <ReportModal
          message={reportingMessage}
          onClose={() => setReportingMessage(null)}
        />
      )}
    </div>
  );
}
