"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Ported from design-system/components/core/IconButton.jsx. Same fixes as
 * Button: default `type="button"`, CSS hover/press instead of state, and
 * `{...rest}` spread first. `label` stays required — the button has no
 * text, so without it screen readers announce nothing.
 */

export type IconButtonProps = {
  label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({
  label,
  type = "button",
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      className={cn(
        "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center",
        "rounded-md border border-stroke-strong bg-raised text-body",
        "transition-[background-color,color,border-color] duration-150",
        "hover:border-stroke-edge hover:bg-card hover:text-heading active:bg-input",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
    />
  );
}
