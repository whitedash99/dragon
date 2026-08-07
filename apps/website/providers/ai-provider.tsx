"use client";

import React, { createContext, useContext, useState } from "react";
import { AiMessage, activeAiProvider } from "@/lib/ai/provider";

interface AiContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: AiMessage[];
  isThinking: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Greetings, Player! I am the **Dragon Assistant**. Ask me for game recommendations, tech specs, or launcher support.",
      timestamp: "Just now",
      suggestedActions: [
        { label: "Recommend games for me", action: "prompt" },
        { label: "What is Dragon Engine?", action: "prompt" },
        { label: "View launcher downloads", action: "prompt" },
      ],
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await activeAiProvider.generateCompletion({
        messages: [...messages, userMsg],
      });

      setTimeout(() => {
        setMessages((prev) => [...prev, response.message]);
        setIsThinking(false);
      }, 500);
    } catch (err) {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content: "Chat history cleared. How can I assist your gaming experience?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <AiContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        isThinking,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAi must be used within an AiProvider");
  }
  return context;
}
