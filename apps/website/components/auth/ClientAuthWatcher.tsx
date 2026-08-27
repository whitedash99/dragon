"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function ClientAuthWatcher() {
  // Public website remains accessible to everyone (authenticated or visitor)
  return null;
}
