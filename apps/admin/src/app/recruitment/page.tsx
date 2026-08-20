"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecruitmentRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/team-key-portal");
  }, [router]);

  return null;
}
