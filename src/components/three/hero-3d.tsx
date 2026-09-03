"use client";

import { useCanRender3D } from "@/hooks/use-can-render-3d";
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

  if (!canRender3D) return null;

  return <CanvasRootLazy />;
}
