"use client";

import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";
import { NavLink } from "./NavLink";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href) || false);
        return (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={isActive}
          />
        );
      })}
    </nav>
  );
}
