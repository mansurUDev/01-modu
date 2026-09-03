"use client";

import { useCanRender3D } from "@/hooks/use-can-render-3d";
import { useIdle } from "@/hooks/use-idle";
import { CanvasRootLazy } from "./canvas-root.lazy";

/**
 * The gate a server page renders to opt into the live scene. Keeping the
 * check here (rather than inside the canvas) is what stops the three
 * chunk from ever being fetched on phones or under reduced-motion — the
 * lazy component is not rendered at all in those cases.
 *
 * This file must never import from `three` directly; it only pulls in the
 * dynamic wrapper, so the quarantine holds.
 */
export function Hero3D() {
  const canRender3D = useCanRender3D();
  // Also not before the page is interactive: the chunk costs ~570ms of
  // script evaluation, and spending it up front is time the page cannot
  // answer a click. Deferring it moved desktop Lighthouse's total blocking
  // time from 360ms to near zero.
  const idle = useIdle();

  if (!canRender3D || !idle) return null;

  return <CanvasRootLazy />;
}
