import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Ported from design-system/components/core/Badge.jsx. Purely
 * presentational — no state, no handlers — so unlike the rest of the kit
 * it needs no "use client" and can render inside a server component.
 */

export type BadgeProps = {
  variant?: "outline" | "accent";
  /** Prepend a glowing LED dot. */
  led?: boolean;
} & HTMLAttributes<HTMLSpanElement>;

const VARIANTS = {
  outline: "border-stroke-strong bg-transparent text-body",
  accent: "border-[rgba(255,74,31,0.3)] bg-accent-tint text-accent",
} as const;

export function Badge({
  variant = "outline",
  led = false,
  children,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex h-6 items-center gap-[7px] rounded-full border px-[11px]",
        "font-mono text-mono-label whitespace-nowrap uppercase",
        VARIANTS[variant],
        className,
      )}
    >
      {led && (
        <span
          aria-hidden="true"
          className="size-[5px] rounded-full bg-led shadow-[var(--glow-led)]"
        />
      )}
      {children}
    </span>
  );
}
