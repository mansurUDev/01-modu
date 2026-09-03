"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Ported from design-system/components/overlays/Accordion.jsx. The
 * source's `grid-template-rows: 0fr -> 1fr` height animation is a neat
 * trick and is kept verbatim; the fixes are `type="button"` on the
 * trigger and the aria wiring (`aria-controls` + a panel id, `role`),
 * which the source left out.
 */

export type AccordionItem = {
  title: string;
  content: ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** Index open on mount; -1 (default) for all closed. */
  defaultOpen?: number;
  className?: string;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={cn(
        "shrink-0 transition-transform duration-200",
        open && "rotate-180",
      )}
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Accordion({
  items,
  defaultOpen = -1,
  className,
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("border-t border-stroke", className)}>
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const triggerId = `${baseId}-trigger-${i}`;

        return (
          <div key={item.title} className="border-b border-stroke">
            <button
              type="button"
              id={triggerId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? -1 : i)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-4 px-1 py-4 text-left",
                "font-display text-[15px] leading-[1.3] font-semibold tracking-[-0.02em]",
                "transition-colors duration-150 hover:text-heading",
                "focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                open ? "text-heading" : "text-body",
              )}
            >
              {item.title}
              <Chevron open={open} />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-[grid-template-rows] duration-250 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-1 pb-[18px] font-body text-sm leading-[1.6] text-body">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
