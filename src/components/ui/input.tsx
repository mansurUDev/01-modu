"use client";

import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Ported from design-system/components/forms/Input.jsx.
 *
 * The source passed BOTH `value` and `defaultValue` straight to the
 * <input>, which React warns about and which makes the field flip between
 * controlled and uncontrolled. Here exactly one is forwarded: `value`
 * when the caller controls the field, `defaultValue` otherwise.
 *
 * Focus and error styling moved from React state to CSS states, and the
 * label is now tied to the input by id instead of relying on the wrapping
 * <label> alone — so the error message can be announced with it.
 */

export type InputProps = {
  /** Uppercase mono eyebrow above the field. */
  label?: string;
  /** Error message below the field; turns label + border red. */
  error?: string;
  /** Applied to the field's wrapper, where the source took `style`. */
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export function Input({
  label,
  error,
  value,
  defaultValue,
  id,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const controlled = value !== undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "font-mono text-mono-label uppercase",
            error ? "text-error" : "text-muted",
          )}
        >
          {label}
        </label>
      )}

      <input
        {...rest}
        id={inputId}
        {...(controlled ? { value } : { defaultValue })}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-10 rounded-sm border bg-input px-3.5 font-body text-sm text-heading",
          "caret-accent transition-[border-color,box-shadow] duration-150 outline-none",
          "placeholder:text-muted disabled:opacity-45",
          error
            ? "border-error"
            : "border-stroke-strong focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-tint)]",
        )}
      />

      {error && (
        <span id={errorId} className="font-body text-xs leading-[1.4] text-error">
          {error}
        </span>
      )}
    </div>
  );
}
