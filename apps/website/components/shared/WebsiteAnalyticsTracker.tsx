"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function WebsiteAnalyticsTracker() {
  const pathname = usePathname();
  const sessionStarted = useRef(false);

  useEffect(() => {
    try {
      // 1. SESSION_START Event (once per session)
      if (!sessionStarted.current) {
        sessionStarted.current = true;
        fetch("/api/public/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "SESSION_START",
            category: "Website Session",
            metadata: { path: pathname, referrer: typeof document !== "undefined" ? document.referrer : "" },
          }),
        }).catch(() => {});
      }

      // 2. PAGE_VIEW Event on route change
      fetch("/api/public/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "PAGE_VIEW",
          category: "Website Traffic",
          metadata: { path: pathname, title: typeof document !== "undefined" ? document.title : "" },
        }),
      }).catch(() => {});
    } catch {}
  }, [pathname]);

  return null;
}
