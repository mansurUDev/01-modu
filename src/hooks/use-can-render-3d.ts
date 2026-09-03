"use client";

import { useSyncExternalStore } from "react";

/**
 * Gates the live 3D scene. Returns false on the server and on the first
 * client render, then re-evaluates.
 *
 * The threshold is 1024px, not the 768px in TZ.md Часть B §4 — REVIEW.md
 * §1 raised it, and the same doc rules out the mobile 3D choreography
 * entirely: below this width the story shows static posters and the three
 * chunk is never requested at all. That only holds because the caller
 * checks this hook BEFORE rendering <CanvasRootLazy/> — rendering it and
 * hiding it with CSS would still download the chunk.
 *
 * `hardwareConcurrency` is a crude proxy for "can this machine hold 60fps
 * with a live WebGL scene" (TZ.md Часть B §4). Unknown means assume yes.
 */
const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MIN_CORES = 4;

function subscribe(onChange: () => void): () => void {
  const desktop = window.matchMedia(DESKTOP_QUERY);
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  desktop.addEventListener("change", onChange);
  reducedMotion.addEventListener("change", onChange);
  return () => {
    desktop.removeEventListener("change", onChange);
    reducedMotion.removeEventListener("change", onChange);
  };
}

function getSnapshot(): boolean {
  return (
    window.matchMedia(DESKTOP_QUERY).matches &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches &&
    (navigator.hardwareConcurrency ?? MIN_CORES + 1) > MIN_CORES
  );
}

function getServerSnapshot(): boolean {
  return false;
}

export function useCanRender3D(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
