/**
 * The one mutable bridge between GSAP and the 3D scene.
 *
 * GSAP (from the story timeline, T8/T9) only ever tweens the numbers on
 * this plain object; `useFrame` inside the scene reads them and lerps the
 * actual meshes toward them. Nothing in the scene is animated by GSAP
 * directly — that indirection is what keeps the scroll fully reversible
 * and lets reduced-motion simply read the same values without any tween.
 *
 * This file deliberately imports nothing from `three`: the story section
 * lives outside the three.js quarantine (src/components/three/) and must
 * be able to import this module without pulling three into the main
 * bundle. Keep it dependency-free.
 */

export type SceneProxy = {
  /** 0 = deck assembled, 1 = modules fully exploded (story scenes 2 and 8). */
  explode: number;
  /** Pogo-pin emissive intensity — flashes 0 → 2 → 0.4 as modules meet. */
  snapFlash: number;
  /** Extra scale applied to the whole deck — the magnetic "click" pulse. */
  deckPulse: number;

  /** Which module the camera is parked on during the 22–84% parade. */
  focus: "none" | "dial" | "fader" | "keys" | "view" | "voice";

  /** Camera position, in world units. */
  camX: number;
  camY: number;
  camZ: number;
  /** What the camera aims at — the parade needs to look off-centre. */
  lookX: number;
  lookY: number;
  lookZ: number;
  /**
   * Composition: how far right of centre the subject sits, as a fraction
   * of the frustum's half-width at the aim distance. The story copy holds
   * the left of the stage, so 0 would put the deck straight through the
   * paragraph. A fraction rather than a world offset because it has to
   * hold on a 21:9 monitor and a 1280×1024 one alike.
   */
  frameShift: number;

  /** Which module is centre stage; the others dim and drop back. */
  dimOthers: number;
  /** 0..1 — the whole deck retreating while Voice takes the scene. */
  deckAway: number;

  /** Per-module drivers, all 0..1 unless noted. */
  knobSpin: number;
  /** -1..1 — fader carriage travel along its slot. */
  faderTravel: number;
  keyPress: number;
  screenProgress: number;
  voiceDrop: number;
  /** 0..1 pulse on Voice's record button and its push-to-talk rings. */
  voicePulse: number;

  /** Idle breathing/drift on the hero shot; killed under reduced-motion. */
  idle: number;
};

const INITIAL: SceneProxy = {
  explode: 0,
  snapFlash: 0,
  deckPulse: 0,
  focus: "none",
  // Must match HERO_CAMERA in canvas-root.tsx — this is the pose the
  // story starts and ends on.
  camX: 1.7,
  camY: 3.0,
  camZ: 3.3,
  lookX: 0,
  lookY: 0,
  lookZ: 0,
  frameShift: 0.24,
  dimOthers: 0,
  deckAway: 0,
  knobSpin: 0,
  // The carriage's modelled rest position; see deck.tsx.
  faderTravel: -0.5,
  keyPress: 0,
  screenProgress: 0,
  voiceDrop: 0,
  voicePulse: 0,
  idle: 1,
};

export const sceneProxy: SceneProxy = { ...INITIAL };

export function resetSceneProxy(): void {
  Object.assign(sceneProxy, INITIAL);
}

/** Frame-rate independent lerp factor — see DESIGN.md Часть B §0 (k = 0.08–0.12). */
export const LERP_K = 0.1;

export function damp(current: number, target: number, k = LERP_K): number {
  return current + (target - current) * k;
}
