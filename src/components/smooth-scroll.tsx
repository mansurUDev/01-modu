"use client";

import { useLenis } from "@/hooks/use-lenis";

/**
 * Mounts Lenis for the whole site. Separate from AppInit so store
 * rehydration and scroll behaviour stay independently readable — and so
 * this can be dropped from a route later without touching persistence.
 */
export function SmoothScroll() {
  useLenis();
  return null;
}
