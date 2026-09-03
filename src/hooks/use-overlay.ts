"use client";

import { useEffect, type RefObject } from "react";
import { getLenis } from "@/hooks/use-lenis";
import { trapTabKey } from "@/lib/focus-trap";

/**
 * Everything an accessible overlay needs, in one place: Escape to close,
 * Tab trapped inside the panel, focus moved in on open and handed back to
 * whatever opened it on close, and the page behind locked from scrolling.
 *
 * The design-system's Modal and Drawer have none of this (REVIEW.md §2
 * lists it as a gap); both compose this hook instead of each growing
 * their own copy.
 *
 * Smooth scrolling has to be stopped as well as the body locked: Lenis
 * runs its own scroll position, so `overflow: hidden` alone leaves the
 * page gliding along underneath the overlay. Where Lenis is not running
 * (mobile, reduced motion) the body lock is the whole story.
 */
export function useOverlay({
  open,
  onClose,
  panelRef,
}: {
  open: boolean;
  onClose?: () => void;
  panelRef: RefObject<HTMLElement | null>;
}): void {
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus into the panel so the next Tab starts inside it.
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }
      if (panel) trapTabKey(panel, event);
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      getLenis()?.start();
      previouslyFocused?.focus?.();
    };
  }, [open, onClose, panelRef]);
}
