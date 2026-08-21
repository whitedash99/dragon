"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

export interface ChatAuthor {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  image?: string | null;
  role?: string;
  department?: string | null;
}

export interface ChatReactionItem {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  user?: {
    id: string;
    name?: string | null;
  };
}

export interface ChatMessageItemData {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  attachments?: string | null;
  replyToId?: string | null;
  isPinned: boolean;
  isEdited: boolean;
  createdAt: string;
  user: ChatAuthor;
  replyTo?: {
    id: string;
    content: string;
    user?: {
      id: string;
      name?: string | null;
    };
  } | null;
  reactions: ChatReactionItem[];
}

export interface OnlineMember {
  clientId: string;
  userId: string;
  name: string;
  role: string;
  avatar?: string | null;
  status: "ONLINE" | "AWAY" | "OFFLINE";
}

export type ConnectionState = "CONNECTED" | "CONNECTING" | "RECONNECTING" | "OFFLINE";

const DEFAULT_MOCK_MESSAGES: Record<string, ChatMessageItemData[]> = {
  general: [
    {
      id: "msg-gen-1",
      roomId: "default_general",
      userId: "u-founder",
      content: "Welcome to Dragon Insiders! Our network physics stack for Embers of Valyria is running at 128-tick deterministic lockstep across all global clusters. Drop your balance & netcode feedback directly in this channel.",
      isPinned: true,
      isEdited: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      user: { id: "u-founder", name: "Kaelen Voss", role: "OWNER", department: "Executive / Architecture" },
      reactions: [
        { id: "r1", messageId: "msg-gen-1", userId: "u-founder", emoji: "👑" },
        { id: "r2", messageId: "msg-gen-1", userId: "u-1", emoji: "🔥" },
      ]
    },
    {
      id: "msg-gen-2",
      roomId: "default_general",
      userId: "u-dev",
      content: "Just deployed Dragon Engine v5.5 hotfix: Vulkan mesh shaders are rendering 4K 120FPS with sub-millisecond frame pacing on RTX 40 & 50 series rigs. Test build is rolling out to Insiders Elite.",
      isPinned: false,
      isEdited: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      user: { id: "u-dev", name: "Dr. Marcus Vance", role: "DEVELOPER", department: "Graphics & Netcode" },
      reactions: [
        { id: "r3", messageId: "msg-gen-2", userId: "u-1", emoji: "⚡" },
        { id: "r4", messageId: "msg-gen-2", userId: "u-2", emoji: "🚀" },
      ]
    },
    {
      id: "msg-gen-3",
      roomId: "default_general",
      userId: "u-mod",
      content: "Tournament brackets for the $100K Archon Invitational open this Friday at 18:00 UTC. Check out #announcements and the Events tab for registration guidelines!",
      isPinned: false,
      isEdited: false,
      createdAt: new Date(Date.now() - 600000).toISOString(),
      user: { id: "u-mod", name: "Aria Sterling", role: "MODERATOR", department: "Community Safety" },
      reactions: [
        { id: "r5", messageId: "msg-gen-3", userId: "u-3", emoji: "🎮" },
        { id: "r6", messageId: "msg-gen-3", userId: "u-4", emoji: "❤️" },
      ]
    }
  ],
  announcements: [
    {
      id: "msg-ann-1",
      roomId: "default_announcements",
      userId: "u-founder",
      content: "📢 OFFICIAL DISPATCH: Dragon Studios global servers have completed migration to high-throughput Neon PostgreSQL clusters with multi-region replication.",
      isPinned: true,
      isEdited: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      user: { id: "u-founder", name: "Kaelen Voss", role: "OWNER", department: "Executive" },
      reactions: [
        { id: "r7", messageId: "msg-ann-1", userId: "u-1", emoji: "🔥" },
        { id: "r8", messageId: "msg-ann-1", userId: "u-2", emoji: "👑" },
      ]
    }
  ]
};

export function useRealtimeChat(roomId: string, roomSlug: string) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessageItemData[]>(() => {
    return DEFAULT_MOCK_MESSAGES[roomSlug] || DEFAULT_MOCK_MESSAGES.general;
  });
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("CONNECTED");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([
    { clientId: "st-1", userId: "st-1", name: "Kaelen Voss", role: "FOUNDER", status: "ONLINE" },
    { clientId: "st-2", userId: "st-2", name: "Dr. Marcus Vance", role: "DEVELOPER", status: "ONLINE" },
    { clientId: "st-3", userId: "st-3", name: "Aria Sterling", role: "MODERATOR", status: "ONLINE" },
    { clientId: "st-4", userId: "st-4", name: "ValkyrieStream", role: "INSIDER ELITE", status: "ONLINE" },
    { clientId: "st-5", userId: "st-5", name: "ShadowSniper99", role: "INSIDER", status: "ONLINE" },
  ]);

  const ablyRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const typingTimerRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const lastTypingSentRef = useRef<number>(0);

  // 1. Fetch persistent history from Neon PostgreSQL
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    try {
      const res = await fetch(`/api/community/chat/messages?roomId=${roomId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.warn("[RealtimeChat] Failed to load messages:", err);
    }
  }, [roomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // 2. Initialize Ably Realtime Connection & Channel Subscription
  useEffect(() => {
    if (!roomSlug) return;

    let isMounted = true;
    const channelName = `community:room:${roomSlug}`;

    const setupRealtime = async () => {
      try {
        const tokenRes = await fetch("/api/community/realtime/token");
        const tokenData = await tokenRes.json();

        if (!tokenData.enabled) {
          if (isMounted) {
            setConnectionStatus("CONNECTED"); // Local polling mode
          }
          return;
        }

        // Dynamically import Ably promises bundle to avoid webpack parse errors with legacy build/ably.js
        // @ts-ignore
        const AblyModule: any = await import("ably/build/ably-promises.js" as any).catch(() => null);
        const AblyRealtime = AblyModule?.Realtime || AblyModule?.default?.Realtime;
        if (!AblyRealtime) return;

        // Initialize Ably client with Token Auth
        const ably = new AblyRealtime({
          authUrl: "/api/community/realtime/token",
          autoConnect: true,
        });

        ablyRef.current = ably;

        ably.connection.on("connected", () => {
          if (isMounted) setConnectionStatus("CONNECTED");
        });
        ably.connection.on("connecting", () => {
          if (isMounted) setConnectionStatus("CONNECTING");
        });
        ably.connection.on("disconnected", () => {
          if (isMounted) setConnectionStatus("RECONNECTING");
        });
        ably.connection.on("failed", () => {
          if (isMounted) setConnectionStatus("OFFLINE");
        });

        const channel = ably.channels.get(channelName);
        channelRef.current = channel;

        // Subscribe to New Message
        channel.subscribe("new_message", (message: any) => {
          if (!isMounted) return;
          const msgData: ChatMessageItemData = message.data;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msgData.id)) return prev;
            return [...prev, msgData];
          });
        });

        // Subscribe to Reactions Update
        channel.subscribe("reaction_updated", (message: any) => {
          if (!isMounted) return;
          const { messageId, reactions } = message.data;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, reactions: reactions || [] } : msg
            )
          );
        });

        // Subscribe to Typing Events
        channel.subscribe("user_typing", (message: any) => {
          if (!isMounted) return;
          const { userId, userName } = message.data;
          if (userId === session?.user?.id) return;

          setTypingUsers((prev) => {
            if (!prev.includes(userName)) return [...prev, userName];
            return prev;
          });

          if (typingTimerRef.current[userId]) {
            clearTimeout(typingTimerRef.current[userId]);
          }

          typingTimerRef.current[userId] = setTimeout(() => {
            if (isMounted) {
              setTypingUsers((prev) => prev.filter((u) => u !== userName));
            }
          }, 3000);
        });

        // Enter Presence
        if (session?.user) {
          channel.presence.enter({
            userId: session.user.id,
            name: session.user.name || "Dragon Insider",
            role: session.user.role || "MEMBER",
            avatar: session.user.image,
            status: "ONLINE",
          });
        }

        // Subscribe to Presence changes
        channel.presence.subscribe(async () => {
          try {
            const members = await channel.presence.get();
            if (!isMounted || !Array.isArray(members)) return;
            const liveMembers: OnlineMember[] = members.map((m: any) => ({
              clientId: m.clientId,
              userId: m.data?.userId || m.clientId,
              name: m.data?.name || "Player",
              role: m.data?.role || "MEMBER",
              avatar: m.data?.avatar,
              status: m.data?.status || "ONLINE",
            }));
            if (liveMembers.length > 0) {
              setOnlineMembers(liveMembers);
            }
          } catch {
            // fallback
          }
        });
      } catch (err) {
        console.warn("[RealtimeChat] Ably connect fallback:", err);
        if (isMounted) setConnectionStatus("CONNECTED");
      }
    };

    setupRealtime();

    return () => {
      isMounted = false;
      Object.values(typingTimerRef.current).forEach((t) => clearTimeout(t));
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        if (session?.user) {
          channelRef.current.presence.leave();
        }
      }
      if (ablyRef.current) {
        ablyRef.current.close();
      }
    };
  }, [roomSlug, session?.user]);

  // 3. Send Message Handler (with optimistic UI update)
  const sendMessage = async (content: string, replyToId?: string | null) => {
    if (!content.trim()) return;

    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: ChatMessageItemData = {
      id: tempId,
      roomId,
      userId: session?.user?.id || "guest",
      content: content.trim(),
      replyToId: replyToId || null,
      isPinned: false,
      isEdited: false,
      createdAt: new Date().toISOString(),
      user: {
        id: session?.user?.id || "guest",
        name: session?.user?.name || "Dragon Insider",
        avatar: session?.user?.image,
        role: session?.user?.role || "MEMBER",
      },
      reactions: [],
    };

    // Optimistically append message
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/community/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          content: content.trim(),
          replyToId: replyToId || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        // Rollback optimistic message if rate-limited or error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        alert(data.error || "Failed to send message.");
      } else if (data.message) {
        // Replace tempId with server created message
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        );
      }
    } catch (err) {
      console.error("[RealtimeChat] Message transmission failed:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  // 4. Toggle Emoji Reaction (Optimistic + Backend sync)
  const toggleReaction = async (messageId: string, emoji: string) => {
    const currentUserId = session?.user?.id || "guest";

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;

        const exists = msg.reactions.some(
          (r) => r.emoji === emoji && r.userId === currentUserId
        );

        let nextReactions: ChatReactionItem[];
        if (exists) {
          nextReactions = msg.reactions.filter(
            (r) => !(r.emoji === emoji && r.userId === currentUserId)
          );
        } else {
          nextReactions = [
            ...msg.reactions,
            {
              id: `temp_react_${Date.now()}`,
              messageId,
              userId: currentUserId,
              emoji,
            },
          ];
        }
        return { ...msg, reactions: nextReactions };
      })
    );

    try {
      await fetch("/api/community/chat/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, emoji }),
      });
    } catch (err) {
      console.error("[RealtimeChat] Toggle reaction error:", err);
    }
  };

  // 5. Send Typing Status Broadcast (throttled to 2 seconds)
  const sendTyping = () => {
    const now = Date.now();
    if (now - lastTypingSentRef.current < 2000) return;
    lastTypingSentRef.current = now;

    if (channelRef.current && session?.user) {
      channelRef.current.publish("user_typing", {
        userId: session.user.id,
        userName: session.user.name || "Player",
      });
    }
  };

  return {
    messages,
    loading,
    connectionStatus,
    typingUsers,
    onlineMembers,
    sendMessage,
    toggleReaction,
    sendTyping,
    refetch: fetchMessages,
  };
}
