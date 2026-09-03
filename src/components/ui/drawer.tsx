"use client";

import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/hooks/use-mounted";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";

/**
 * Ported from design-system/components/overlays/Drawer.jsx.
 *
 * The source keeps the panel mounted and slides it with a transform,
 * which is what gives the drawer its slide-in — that behaviour is kept.
 * What is added is the same accessibility layer as Modal (portal,
 * Escape, focus trap, focus restore, scroll lock) plus `aria-hidden` and
 * `pointer-events: none` while closed, so a closed drawer is invisible to
 * both the mouse and a screen reader.
 *
 * Default width is 440, not the .d.ts's 380: "04 Cart drawer" in
 * design-system/MODU Website Mockups.dc.html draws it at 440, and the
 * mockups outrank the component doc in this project's source hierarchy.
 */

export type DrawerProps = {
  open?: boolean;
  title: string;
  /** Optional uppercase mono eyebrow above the title. */
  eyebrow?: string;
  children?: ReactNode;
  /** Pinned bottom area, e.g. a checkout Button. */
  footer?: ReactNode;
  onClose?: () => void;
  /** Panel width in px, default 440. */
  width?: number;
  side?: "right" | "left";
};

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Drawer({
  open = false,
  title,
  eyebrow,
  children,
  footer,
  onClose,
  width = 440,
  side = "right",
}: DrawerProps) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useOverlay({ open, onClose, panelRef });

  if (!mounted) return null;

  const closedTransform =
    side === "right" ? "translateX(102%)" : "translateX(-102%)";

  return createPortal(
    <div
      aria-hidden={!open}
      // The panel stays mounted so it can slide, which would otherwise
      // leave focusable buttons inside an aria-hidden subtree — an actual
      // a11y violation, and Tab would still reach them. `inert` removes
      // the whole closed drawer from focus order and the a11y tree.
      inert={!open}
      className={cn(
        "fixed inset-0 z-100",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[rgba(6,6,7,0.75)] backdrop-blur-[4px] transition-opacity duration-250",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          width,
          [side]: 0,
          transform: open ? "translateX(0)" : closedTransform,
        }}
        className={cn(
          "absolute top-0 bottom-0 flex max-w-[90vw] flex-col bg-raised outline-none",
          "shadow-[var(--shadow-overlay)]",
          "transition-transform duration-300 ease-[cubic-bezier(.32,.72,.28,1)]",
          side === "right" ? "border-l border-stroke" : "border-r border-stroke",
        )}
      >
        <div className="flex items-center justify-between border-b border-stroke px-6 py-5">
          <div className="flex flex-col gap-1.5">
            {eyebrow && (
              <span className="font-mono text-mono-label uppercase text-muted">
                {eyebrow}
              </span>
            )}
            <h2
              id={titleId}
              className="font-display text-[18px] leading-[1.25] font-semibold tracking-[-0.02em] text-heading"
            >
              {title}
            </h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-6 font-body text-sm leading-[1.6] text-body">
          {children}
        </div>

        {footer && (
          <div className="border-t border-stroke px-6 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
