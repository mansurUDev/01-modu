"use client";

import { useEffect, useState } from "react";

/**
 * False until the browser has finished the work it considers urgent, then
 * true for good.
 *
 * The three.js chunk costs about half a second of script evaluation, and
 * running it during the page's first moments is what a browser counts as
 * blocking: it cannot answer a click or a keypress while that work is on
 * the main thread. Waiting for idle moves the whole cost after the page is
 * interactive, at the price of the deck arriving a beat later than the
 * copy — which nobody notices, because the copy is what they are reading.
 *
 * The timeout is the important half of the contract. `requestIdleCallback`
 * makes no promise about ever firing on a busy page, so the deadline turns
 * "when convenient" into "within a second, whatever happens".
 */
const DEADLINE_MS = 1000;

export function useIdle(): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback !== "function") {
      const timer = setTimeout(() => setIdle(true), 200);
      return () => clearTimeout(timer);
    }
    const handle = requestIdleCallback(() => setIdle(true), {
      timeout: DEADLINE_MS,
    });
    return () => cancelIdleCallback(handle);
  }, []);

  return idle;
}
