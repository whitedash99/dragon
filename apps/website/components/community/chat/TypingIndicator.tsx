"use client";

import React from "react";

interface TypingIndicatorProps {
  typingUsers: string[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const namesDisplay =
    typingUsers.length === 1
      ? typingUsers[0]
      : typingUsers.length === 2
      ? `${typingUsers[0]} and ${typingUsers[1]}`
      : `${typingUsers[0]} and ${typingUsers.length - 1} others`;

  return (
    <div className="h-6 px-6 flex items-center gap-2 text-[11px] text-cyan-400 font-mono select-none">
      <div className="flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="size-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="size-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span>
        <strong className="text-white">{namesDisplay}</strong> {typingUsers.length === 1 ? "is" : "are"} typing...
      </span>
    </div>
  );
}
