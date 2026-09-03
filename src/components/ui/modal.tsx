"use client";

import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/hooks/use-mounted";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/cn";
import { Button } from "./button";
import { IconButton } from "./icon-button";

/**
 * Ported from design-system/components/overlays/Modal.jsx, with the
 * accessibility the source was missing (REVIEW.md §2): rendered through a
 * portal on <body> so it escapes any transformed/overflow-hidden
 * ancestor, Escape to close, Tab trapped inside, focus returned to
 * whatever opened it, and the page behind locked — all via useOverlay.
 *
 * The portal is mount-guarded: these components are prerendered during
 * the static export, where `document` does not exist.
 */

export type ModalProps = {
  open?: boolean;
  title: string;
  /** Optional uppercase mono eyebrow above the title, in accent. */
  eyebrow?: string;
  children?: ReactNode;
  /** Primary action label; omit when the content supplies its own submit. */
  confirmLabel?: string;
  /** Replaces the default action row entirely (e.g. a form's own button). */
  footer?: ReactNode;
  cancelLabel?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  /** Panel width in px, default 440 (mockup "05 Auth modal"). */
  width?: number;
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

export function Modal({
  open = false,
  title,
  eyebrow,
  children,
  confirmLabel,
  footer,
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  width = 440,
}: ModalProps) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useOverlay({ open, onClose, panelRef });

  if (!mounted || !open) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(6,6,7,0.75)] p-6 backdrop-blur-[4px]"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        style={{ width }}
        className={cn(
          "flex max-w-full flex-col gap-4 rounded-xl border border-stroke bg-card p-7",
          "shadow-[var(--shadow-overlay)] outline-none",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            {eyebrow && (
              <span className="font-mono text-mono-label uppercase text-accent">
                {eyebrow}
              </span>
            )}
            <h2
              id={titleId}
              className="font-display text-h3 tracking-[-0.02em] text-heading"
            >
              {title}
            </h2>
          </div>
          <IconButton label="Close" onClick={onClose} className="-mt-1.5 -mr-1.5">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="font-body text-sm leading-[1.6] text-body">{children}</div>

        {/* A lone Cancel next to the X is noise, so the default action row
            only appears when there is a real primary action. Content with
            its own submit passes `footer` instead. */}
        {footer ??
          (confirmLabel && (
            <div className="mt-2 flex justify-end gap-2.5">
              <Button variant="secondary" onClick={onClose}>
                {cancelLabel}
              </Button>
              <Button onClick={onConfirm}>{confirmLabel}</Button>
            </div>
          ))}
      </div>
    </div>,
    document.body,
  );
}
