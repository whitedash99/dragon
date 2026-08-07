"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Sparkles, Shield, Trophy, ChevronRight, X } from "lucide-react";
import { userNotifications, NotificationItem } from "@/data/userData";
import { cn } from "@/lib/cn";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(userNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifs = filter === "all" ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-muted-foreground transition-colors hover:border-gold-400/30 hover:text-white hover:bg-white/10"
        aria-label="Open Notifications"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(28,20,22,0.98),rgba(9,9,11,0.98))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:w-96"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-dragon-400" />
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-dragon-500/20 px-2 py-0.5 text-[10px] font-bold text-dragon-300">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-dragon-400 hover:underline"
                  >
                    Mark read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white">
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredNotifs.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No notifications to display.
                </div>
              ) : (
                filteredNotifs.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "rounded-xl p-3 border transition-colors text-xs",
                      notif.read ? "border-white/5 bg-white/[0.02] text-muted-foreground" : "border-gold-400/15 bg-white/[0.055] text-white"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white">{notif.title}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{notif.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
