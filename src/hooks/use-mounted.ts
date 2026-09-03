"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Mount-guard for the hydration-mismatch problem described in TZ.md §8:
 * the SSG HTML is built with no localStorage, so the very first client
 * render must match it exactly (mounted === false). Persisted store state
 * only becomes visible one tick later, after AppInit's rehydrate() runs.
 *
 * TZ.md's own snippet for this hook is `useEffect(() => setMounted(true),
 * [])` — the classic idiom, but the eslint-config-next bundled with this
 * project's Next.js version flags synchronous setState-in-effect as an
 * error (react-hooks/set-state-in-effect). useSyncExternalStore is React's
 * sanctioned replacement for exactly this "value differs between server
 * and first client render" case: it returns `false` for the server
 * snapshot and the first hydration pass, then `true` once the client
 * snapshot is read — same semantics, no extra render-triggering effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
