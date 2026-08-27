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

export function useRealtimeChat(roomId: string, roomSlug: string) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessageItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("CONNECTED");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([]);

  const ablyRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const typingTimerRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const lastTypingSentRef = useRef<number>(0);

  // 1. Fetch persistent history from Neon PostgreSQL
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/chat/messages?roomId=${roomId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      }
    } catch (err) {
      console.warn("[RealtimeChat] Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // 2. Fetch real online / registered community members
  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/community/chat/members");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.members)) {
          setOnlineMembers(data.members);
        }
      }
    } catch (err) {
      console.warn("[RealtimeChat] Failed to load members:", err);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchMembers();
  }, [fetchMessages, fetchMembers]);

  // 3. Initialize Ably Realtime Connection & Channel Subscription
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
            setConnectionStatus("CONNECTED");
          }
          return;
        }

        // Dynamically load Ably in browser
        if (!(window as any).Ably) {
          await new Promise<void>((resolve) => {
            const script = document.createElement("script");
            script.src = "https://cdn.ably.com/lib/ably.min-1.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => resolve();
            document.head.appendChild(script);
          });
        }

        const AblyRealtime = (window as any).Ably?.Realtime;
        if (!AblyRealtime) {
          if (isMounted) setConnectionStatus("CONNECTED");
          return;
        }

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

        // Subscribe to chat events
        channel.subscribe("new_message", (messageEvent: any) => {
          if (!isMounted) return;
          const newMsg = messageEvent.data as ChatMessageItemData;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        });

        channel.subscribe("reaction_update", (event: any) => {
          if (!isMounted) return;
          const { messageId, reactions } = event.data;
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
          );
        });

        channel.subscribe("typing_indicator", (event: any) => {
          if (!isMounted) return;
          const { userName, isTyping } = event.data;
          if (!userName || (session?.user?.name && userName === session.user.name)) return;

          setTypingUsers((prev) => {
            if (isTyping) {
              if (!prev.includes(userName)) return [...prev, userName];
              return prev;
            } else {
              return prev.filter((u) => u !== userName);
            }
          });

          if (isTyping) {
            if (typingTimerRef.current[userName]) {
              clearTimeout(typingTimerRef.current[userName]);
            }
            typingTimerRef.current[userName] = setTimeout(() => {
              setTypingUsers((prev) => prev.filter((u) => u !== userName));
            }, 3000);
          }
        });
      } catch (e) {
        console.warn("[RealtimeChat] Setup notice:", e);
        if (isMounted) setConnectionStatus("CONNECTED");
      }
    };

    setupRealtime();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (ablyRef.current) {
        ablyRef.current.close();
      }
    };
  }, [roomSlug, session?.user?.name]);

  // 4. Send Message Handler
  const sendMessage = useCallback(
    async (content: string, replyToId?: string | null, attachments?: string | null) => {
      if (!content.trim() || !roomId) return;

      const tempId = `temp-${Date.now()}`;
      const optimisticUser: ChatAuthor = {
        id: session?.user?.email || "current-user",
        name: session?.user?.name || session?.user?.email?.split("@")[0] || "Player",
        email: session?.user?.email,
        role: "MEMBER",
      };

      const optimisticMsg: ChatMessageItemData = {
        id: tempId,
        roomId,
        userId: session?.user?.email || "current-user",
        content: content.trim(),
        attachments: attachments || null,
        replyToId: replyToId || null,
        isPinned: false,
        isEdited: false,
        createdAt: new Date().toISOString(),
        user: optimisticUser,
        reactions: [],
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const res = await fetch("/api/community/chat/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId,
            content: content.trim(),
            replyToId: replyToId || undefined,
            attachments: attachments || undefined,
          }),
        });

        const data = await res.json();
        if (data.success && data.message) {
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? data.message : m))
          );
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          alert(data.error || "Failed to deliver message.");
        }
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        alert("Network error sending message.");
      }
    },
    [roomId, session]
  );

  // 5. Toggle Reaction Handler
  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      try {
        const res = await fetch("/api/community/chat/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageId, emoji }),
        });
        const data = await res.json();
        if (data.success) {
          fetchMessages();
        }
      } catch (e) {
        console.warn("Reaction error:", e);
      }
    },
    [fetchMessages]
  );

  // 6. Broadcast Typing State
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const now = Date.now();
      if (isTyping && now - lastTypingSentRef.current < 2000) return;
      lastTypingSentRef.current = now;

      if (channelRef.current) {
        channelRef.current.publish("typing_indicator", {
          userName: session?.user?.name || "Player",
          isTyping,
        });
      }
    },
    [session?.user?.name]
  );

  return {
    messages,
    loading,
    connectionStatus,
    typingUsers,
    onlineMembers,
    sendMessage,
    toggleReaction,
    sendTyping,
    refreshMessages: fetchMessages,
  };
}
