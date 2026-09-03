/**
 * A minimal focus trap — no dependency, ~40 lines, which is what
 * BUILD_PLAN.md T4 asks for. The design-system's Modal/Drawer shipped
 * with no keyboard handling at all (REVIEW.md §2 flags this); this is the
 * missing piece those components compose with in use-overlay.ts.
 */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

/**
 * Keeps Tab / Shift+Tab inside `container`. Call from a keydown handler;
 * returns true when it handled (and prevented) the event.
 */
export function trapTabKey(container: HTMLElement, event: KeyboardEvent): boolean {
  if (event.key !== "Tab") return false;

  const focusable = getFocusable(container);
  if (focusable.length === 0) {
    // Nothing to focus inside — keep focus on the panel rather than
    // letting it escape to the page behind.
    event.preventDefault();
    return true;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    last.focus();
    return true;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}
