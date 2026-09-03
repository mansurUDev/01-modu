"use client";

import dynamic from "next/dynamic";

/**
 * The only entry point into the three.js subsystem from the rest of the
 * app. `ssr: false` is what keeps three out of the prerender (it would
 * throw on `window` during the static export) and out of the shared
 * bundle — and it is only legal inside a client component, hence this
 * one-line file (TZ.md Часть B §4).
 *
 * No `loading` placeholder: the canvas is `position: fixed`, so it never
 * occupies layout space and cannot cause CLS. The hero's own poster sits
 * in the layout underneath it.
 */
export const CanvasRootLazy = dynamic(() => import("./canvas-root"), {
  ssr: false,
});
