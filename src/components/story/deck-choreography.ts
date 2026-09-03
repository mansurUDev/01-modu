import { sceneProxy } from "@/components/three/scene-proxy";

/**
 * The write side of the story choreography: everything the scroll does to
 * the 3D deck, as tweens on `sceneProxy` and nothing else.
 *
 * There is not a single `gsap.to(mesh, ...)` here, and there must never
 * be one. GSAP moves numbers; `components/three/scroll-rig.ts` lerps the
 * scene toward them each frame. That split is what makes a scrubbed
 * scroll exactly reversible in both directions, and it is why this module
 * can live outside the three.js quarantine — `scene-proxy.ts` imports
 * nothing from three, so the story section never pulls the 3D bundle.
 *
 * Positions on the master timeline are percent, matching the windows in
 * scene-copy.ts. Each scene's camera move runs over the first half of its
 * window so the pose has settled before the reader finishes the sentence.
 */

/**
 * Camera poses, in world units.
 *
 * These are literals rather than imports because the numbers they derive
 * from (MODULE_X, MOD_H, SCENE_SCALE) live in modules that import three,
 * and importing those here would drag the 3D bundle into every page. The
 * derivation: a module's world position is its rail X times SCENE_SCALE
 * (10), plus its exploded offset from scroll-rig's EXPLODE_POSE, also
 * times 10, with the deck group's -0.17 Y offset applied. The camera then
 * sits about 2.6 units off at roughly 30° elevation — the product-shot
 * angle from DESIGN.md Часть B §4 — alternating sides down the rail so
 * the parade does not feel like four identical shots.
 */
type CameraPose = {
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  /** Fraction of the frustum half-width the subject sits right of centre;
   *  see sceneProxy.frameShift. Larger where the subject is larger. */
  frameShift: number;
};

/** Hero and finale. The position must match HERO_CAMERA in canvas-root.tsx. */
const HERO: CameraPose = {
  camX: 1.7,
  camY: 3.0,
  camZ: 3.3,
  lookX: 0,
  lookY: 0,
  lookZ: 0,
  frameShift: 0.24,
};

/** Scene 2 — pulled back far enough to hold the full spread even on a
 *  narrow desktop window, where less horizontal field is available. */
const WIDE: CameraPose = {
  camX: 0.4,
  camY: 3.6,
  camZ: 5.0,
  lookX: 0,
  lookY: -0.1,
  lookZ: 0,
  frameShift: 0.3,
};

/**
 * The four parade poses. Each is its module's world position plus a ~3.3
 * unit offset at roughly 30° elevation, alternating which side of the
 * module the camera stands on so the sequence does not read as four
 * identical shots. 3.3 rather than the 2.6 this started at: at 2.6 a
 * single module filled the frame edge to edge, which loses the fact that
 * it is one part of a rail.
 */
const DIAL: CameraPose = {
  camX: -0.51,
  camY: 1.93,
  camZ: 2.52,
  lookX: -1.6,
  lookY: 0.14,
  lookZ: -0.1,
  frameShift: 0.36,
};

const FADER: CameraPose = {
  camX: -1.71,
  camY: 1.08,
  camZ: 2.93,
  lookX: -0.69,
  lookY: -0.52,
  lookZ: 0.18,
  frameShift: 0.36,
};

const KEYS: CameraPose = {
  camX: 1.05,
  camY: 2.29,
  camZ: 2.26,
  lookX: 0.29,
  lookY: 0.25,
  lookZ: -0.22,
  frameShift: 0.36,
};

const VIEW: CameraPose = {
  camX: 0.45,
  camY: 1.12,
  camZ: 2.86,
  lookX: 1.32,
  lookY: -0.5,
  lookZ: 0.12,
  frameShift: 0.36,
};

/** Scene 7 — Voice alone, with the rail pushed back behind it. */
const VOICE: CameraPose = {
  camX: 1.04,
  camY: 1.56,
  camZ: 2.65,
  lookX: 0,
  lookY: -0.17,
  lookZ: 0,
  frameShift: 0.34,
};

/**
 * Adds every 3D beat of the story to the master timeline.
 *
 * Called from sections/story.tsx inside the desktop + motion-safe branch
 * of its matchMedia, so mobile and reduced-motion never build these
 * tweens — there is no 3D scene on those to drive.
 */
export function addDeckChoreography(master: gsap.core.Timeline): void {
  const camera = (at: number, duration: number, pose: CameraPose) => {
    master.to(sceneProxy, { ...pose, duration, ease: "power2.inOut" }, at);
  };

  // Scene 1 · 0–10 · "Meet MODU." — the hero pose the page already loads
  // in, so nothing to tween. The idle drift is on until the deck moves.

  // Scene 2 · 10–22 · "It comes apart."
  // The split is modu-snap.jsx's easeInOutCubic, and the pins give a
  // parting flicker as the contacts break rather than the hard flash they
  // get on reconnection in scene 8.
  camera(10, 8, WIDE);
  master
    .to(sceneProxy, { idle: 0, duration: 3, ease: "power1.out" }, 10)
    .to(sceneProxy, { explode: 1, duration: 10, ease: "power3.inOut" }, 10)
    .to(sceneProxy, { snapFlash: 0.7, duration: 2, ease: "power2.out" }, 10)
    .to(sceneProxy, { snapFlash: 0, duration: 5, ease: "power2.in" }, 12);

  // Scene 3 · 22–34 · "Turn things."
  // Three knobs at three rates, each landing on a 15° detent — the
  // "twenty-four clicks per turn" claim from the spec sheet, shown rather
  // than stated.
  camera(22, 6, DIAL);
  master
    .set(sceneProxy, { focus: "dial" }, 22)
    .to(sceneProxy, { dimOthers: 1, duration: 5, ease: "power2.out" }, 22)
    .to(sceneProxy, { knobSpin: 1, duration: 8, ease: "power1.inOut" }, 24);

  // Scene 4 · 34–46 · "Slide things."
  // The carriage runs almost the full slot, then is pulled back to a
  // settled value — the motor catching up with the app, which is the only
  // reason this module is interesting.
  camera(34, 6, FADER);
  master
    .set(sceneProxy, { focus: "fader" }, 34)
    .to(sceneProxy, { faderTravel: 0.85, duration: 5, ease: "power2.inOut" }, 36)
    .to(sceneProxy, { faderTravel: 0.1, duration: 3, ease: "power3.out" }, 41);

  // Scene 5 · 46–58 · "Press things."
  camera(46, 6, KEYS);
  master
    .set(sceneProxy, { focus: "keys" }, 46)
    .to(sceneProxy, { keyPress: 1, duration: 8, ease: "none" }, 48);

  // Scene 6 · 58–70 · "See things." The strip wakes and stays lit through
  // the finale — a dead screen on the closing shot would undercut it.
  camera(58, 6, VIEW);
  master
    .set(sceneProxy, { focus: "view" }, 58)
    .to(sceneProxy, { screenProgress: 1, duration: 8, ease: "power1.out" }, 60);

  // Scene 7 · 70–84 · "Take one with you."
  // Voice drops in with a little overshoot while the rail retreats, then
  // push-to-talk starts: the button breathes and the rings ripple out.
  camera(70, 8, VOICE);
  master
    .set(sceneProxy, { focus: "voice" }, 70)
    .to(sceneProxy, { deckAway: 1, duration: 8, ease: "power2.inOut" }, 70)
    .to(sceneProxy, { voiceDrop: 1, duration: 7, ease: "back.out(1.3)" }, 71)
    .to(sceneProxy, { voicePulse: 1, duration: 3, ease: "power2.out" }, 78);

  // Scene 8 · 84–100 · "Snap. Done."
  // Voice lifts back out, the rail returns, and the modules close on a
  // hard out-ease. modu-snap.jsx uses easeOutBack here; that overshoot is
  // dropped deliberately, because a negative `explode` mirrors the offsets
  // and drives the shells through one another instead of past the target.
  camera(90, 8, HERO);
  master
    .to(sceneProxy, { voicePulse: 0, duration: 2, ease: "power2.in" }, 84)
    .to(sceneProxy, { voiceDrop: 0, duration: 6, ease: "power2.in" }, 84)
    .to(sceneProxy, { deckAway: 0, duration: 6, ease: "power2.inOut" }, 84)
    .to(sceneProxy, { dimOthers: 0, duration: 4, ease: "power2.out" }, 84)
    .to(sceneProxy, { explode: 0, duration: 8, ease: "power4.out" }, 86)
    .set(sceneProxy, { focus: "none" }, 92)
    // The contacts light, then hold at a low glow — the deck is powered.
    .to(sceneProxy, { snapFlash: 2, duration: 1, ease: "power3.out" }, 92)
    .to(sceneProxy, { snapFlash: 0.4, duration: 3, ease: "power2.out" }, 93)
    // One magnetic click, scaled through the whole deck.
    .to(sceneProxy, { deckPulse: 0.04, duration: 0.6, ease: "power3.out" }, 92)
    .to(sceneProxy, { deckPulse: 0, duration: 2.5, ease: "power2.out" }, 92.6)
    .to(sceneProxy, { idle: 1, duration: 4, ease: "power1.inOut" }, 94);
}
