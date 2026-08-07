"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface AnimatedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
}

export const AnimatedLink = React.forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ href, external = false, className, children, ...props }, ref) => {
    const baseClasses = cn("relative inline-block", className);

    const underline = (
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full bg-current origin-left"
        variants={{
          initial: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    );

    if (external) {
      return (
        <motion.a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          initial="initial"
          whileHover="hover"
          {...(props as any)}
        >
          {children}
          {underline}
        </motion.a>
      );
    }

    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a
          ref={ref}
          className={baseClasses}
          initial="initial"
          whileHover="hover"
          {...(props as any)}
        >
          {children}
          {underline}
        </motion.a>
      </Link>
    );
  }
);

AnimatedLink.displayName = "AnimatedLink";
