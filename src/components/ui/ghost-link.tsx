"use client";

import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Ported from design-system/components/core/GhostLink.jsx — a text link
 * with an arrow that nudges right on hover.
 *
 * Stays a plain <a> rather than next/link: the contract is `href?:
 * string`, and most uses are same-page anchors (#modules). Where real
 * client-side routing is wanted, the caller reaches for next/link
 * directly instead of routing it through a presentational component.
 *
 * The arrow's nudge is a `group-hover` class, not React state.
 */

export type GhostLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function GhostLink({
  href = "#",
  children,
  className,
  ...rest
}: GhostLinkProps) {
  return (
    <a
      {...rest}
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-display text-sm font-semibold leading-none",
        "text-heading transition-colors duration-150 hover:text-accent-hover",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
    >
      {children}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-150 group-hover:translate-x-[3px]"
      >
        <path
          d="M2 8h11M9 3.5 13.5 8 9 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
