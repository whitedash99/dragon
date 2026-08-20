"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function ClientAuthWatcher() {
  const router = useRouter();
  const sessionState = useSession();

  useEffect(() => {
    if (sessionState?.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionState?.status, router]);

  return null;
}
