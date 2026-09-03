"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Ported from design-system/components/core/Button.jsx, keeping the
 * ButtonProps contract from the neighbouring .d.ts.
 *
 * Three deliberate changes to the source:
 * - `type="button"` by default. The source has none, so dropping a
 *   Button inside the checkout form (T7) would silently submit it.
 *   Callers can still pass type="submit" explicitly.
 * - Hover/press are CSS states, not `useState`. The source re-rendered on
 *   every mouseenter — expensive on a page where GSAP is driving 60fps
 *   scroll animations — and gave keyboard users nothing. This version
 *   also gets the focus-visible ring the design system asks for
 *   (DESIGN.md Часть A §4.1) and the source omitted.
 * - `{...rest}` is spread before the explicit props, so a caller's stray
 *   handler can never clobber the component's own.
 */

export type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SIZES = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-[26px] text-[15px]",
} as const;

const VARIANTS = {
  primary: cn(
    "border-transparent bg-accent text-on-accent",
    "hover:bg-accent-hover hover:shadow-[0_0_24px_var(--accent-glow)]",
    "active:bg-accent-pressed active:shadow-none",
  ),
  secondary: cn(
    "border-stroke-strong bg-transparent text-heading",
    "hover:border-stroke-edge active:bg-raised",
  ),
} as const;

const BASE = cn(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border",
  "font-display font-semibold leading-none tracking-[0.01em] select-none",
  "transition-[background-color,box-shadow,border-color,color] duration-150",
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-45",
);

function buttonClasses(
  variant: keyof typeof VARIANTS,
  size: keyof typeof SIZES,
  className?: string,
) {
  return cn(BASE, SIZES[size], VARIANTS[variant], className);
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={buttonClasses(variant, size, className)}
    />
  );
}

/**
 * Same skin, anchor semantics — for CTAs that navigate (the hero's
 * "Build your deck" is an anchor to #modules, not an action). Keeping it
 * a separate component rather than giving Button an `href` keeps both
 * prop types honest.
 */
export type ButtonLinkProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonLinkProps) {
  return <a {...rest} className={buttonClasses(variant, size, className)} />;
}
