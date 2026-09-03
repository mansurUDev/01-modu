"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Ported from design-system/components/forms/QuantityStepper.jsx. The
 * source's controlled/uncontrolled handling was already correct and is
 * kept as-is; the only fixes are `type="button"` on the two step buttons
 * (they sit inside the checkout form in T7) and CSS hover instead of state.
 */

export type QuantityStepperProps = {
  /** Controlled value; omit to use internal state seeded by defaultValue. */
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  className?: string;
};

function StepButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex size-8 cursor-pointer items-center justify-center rounded-sm",
        "font-mono text-base leading-none text-heading transition-colors duration-150",
        "hover:bg-card",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

export function QuantityStepper({
  value,
  defaultValue = 1,
  min = 1,
  max = 99,
  onChange,
  className,
}: QuantityStepperProps) {
  const [internal, setInternal] = useState(defaultValue);
  const qty = value !== undefined ? value : internal;

  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (value === undefined) setInternal(clamped);
    onChange?.(clamped);
  };

  return (
    <div
      className={cn(
        // w-fit so the control still hugs its content when a flex-column
        // parent would otherwise stretch it.
        "inline-flex w-fit items-center gap-0.5 rounded-md border border-stroke-strong bg-input p-[3px]",
        className,
      )}
    >
      <StepButton
        label="Decrease quantity"
        onClick={() => set(qty - 1)}
        disabled={qty <= min}
      >
        −
      </StepButton>
      <span className="min-w-7 text-center font-mono text-sm leading-none text-heading">
        {qty}
      </span>
      <StepButton
        label="Increase quantity"
        onClick={() => set(qty + 1)}
        disabled={qty >= max}
      >
        +
      </StepButton>
    </div>
  );
}
