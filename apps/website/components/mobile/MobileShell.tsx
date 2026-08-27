"use client";

import React, { useState } from "react";
import { MobileTopBar } from "./MobileTopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileDrawer } from "./MobileDrawer";

interface MobileShellProps {
  children?: React.ReactNode;
}

export function MobileShell({ children }: MobileShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* ═══ MOBILE-ONLY APPLICATION SHELL (< 1024px) ═══ */}
      <div className="block lg:hidden">
        <MobileTopBar onOpenDrawer={() => setIsDrawerOpen(true)} />
        <MobileBottomNav />
        <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>

      {/* Render children with mobile bottom-padding offset */}
      <div className="w-full pb-20 lg:pb-0">
        {children}
      </div>
    </>
  );
}
