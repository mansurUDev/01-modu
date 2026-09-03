import * as THREE from "three";
import { damp, sceneProxy } from "./scene-proxy";

/**
 * The read side of the story choreography.
 *
 * GSAP never touches a mesh. It tweens the plain numbers on `sceneProxy`
 * (see story/deck-choreography.ts) and everything here lerps the scene
 * toward them each frame. That indirection is what makes the scrubbed
 * scroll exactly reversible, and it is why scrolling back up retraces the
 * same poses instead of drifting — DESIGN.md Часть B §7.
 *
 * Meshes are found by the names carried over from
 * design-system/modu-deck-3d.html. That is what those names are for, and
 * why deck.tsx warns against renaming them.
 */

/**
 * Where each rail module flies when the deck comes apart, in the deck's
 * own metres (its group is scaled ×10 for the world).
 *
 * Converted from the POSE table in design-system/modu-snap.jsx, which is
 * authored in screen pixels for the 2D version: x keeps its sign, y flips
 * (screen-down is world-up), and a little z fans the pieces in depth so
 * the explosion reads as three-dimensional rather than as a flat spread.
 * `ws`/`ph` are that file's per-module drift speed and phase.
 */
const EXPLODE_POSE = [
  { x: -0.092, y: 0.031, z: -0.01, rx: 0.17, ry: -0.35, rz: -0.23, ws: 1.1, ph: 0 },
  { x: -0.046, y: -0.035, z: 0.018, rx: -0.1, ry: 0.3, rz: 0.17, ws: 0.8, ph: 2.1 },
  { x: 0.006, y: 0.042, z: -0.022, rx: 0.12, ry: 0.2, rz: 0.1, ws: 0.9, ph: 4.2 },
  { x: 0.064, y: -0.033, z: 0.012, rx: -0.14, ry: -0.28, rz: -0.16, ws: 0.7, ph: 1.3 },
] as const;

const MODULE_NAMES = ["module_dial", "module_fader", "module_keys", "module_view"];
const BODY_NAMES = ["dial_body", "fader_body", "keys_body", "view_body"];

/** Index order of EXPLODE_POSE, matched against sceneProxy.focus. */
const FOCUS_ORDER = ["dial", "fader", "keys", "view"];

/** Drift amplitudes, from modu-snap.jsx's wob (5°) and bob (10px). */
const WOBBLE_RAD = 0.087;
const BOB = 0.0037;

/** Half the travel of the fader slot. `faderTravel` runs -1..1 across it,
 *  and its rest value (-0.5) is the carriage position modelled in deck.tsx. */
const FADER_TRAVEL = 0.045;

const BODY_COLOR = new THREE.Color(0x0f0f11);
const DIMMED = BODY_COLOR.clone().multiplyScalar(0.35);
const PIN_FLASH = new THREE.Color(0xff4a1f);

export type DeckRefs = {
  deck: THREE.Object3D | null;
  modules: (THREE.Object3D | null)[];
  bodyMaterials: (THREE.MeshStandardMaterial | null)[];
  knobs: (THREE.Object3D | null)[];
  faderCarriage: THREE.Object3D | null;
  keys: (THREE.Object3D | null)[];
  rings: (THREE.Object3D | null)[];
  icons: (THREE.Object3D | null)[];
  pinMaterial: THREE.MeshStandardMaterial | null;
  voice: THREE.Object3D | null;
  voiceRecord: THREE.Object3D | null;
  voiceWaves: THREE.Object3D | null;
  voiceDial: THREE.Object3D | null;
  /** Module rest positions, captured before anything has moved. */
  rest: THREE.Vector3[];
};

function standardMaterial(object: THREE.Object3D | null) {
  const mesh = object as THREE.Mesh | null;
  return mesh?.material instanceof THREE.MeshStandardMaterial
    ? mesh.material
    : null;
}

/** One traversal at mount; after that every driver is a direct reference. */
export function collectDeckRefs(root: THREE.Object3D): DeckRefs {
  const find = (name: string) => root.getObjectByName(name) ?? null;

  const modules = MODULE_NAMES.map(find);

  return {
    deck: find("modu_deck"),
    modules,
    // Per-module clones (materials.ts), so the parade can dim three shells
    // and leave the fourth lit.
    bodyMaterials: BODY_NAMES.map((name) => standardMaterial(find(name))),
    knobs: [1, 2, 3].map((i) => find(`knob_group_${i}`)),
    faderCarriage: find("fader_carriage"),
    keys: [1, 2, 3, 4, 5].map((i) => find(`key_${i}`)),
    rings: [1, 2].map((i) => find(`volume_ring_${i}`)),
    icons: [1, 2, 3].map((i) => find(`app_icon_${i}`)),
    // All fifteen pins per module share one material instance, so flashing
    // this one flashes the whole connector array at once.
    pinMaterial: standardMaterial(find("dial_pin_1")),
    voice: find("modu_voice"),
    voiceRecord: find("voice_record"),
    voiceWaves: find("voice_waves"),
    voiceDial: find("voice_dial_group"),
    rest: modules.map((module) =>
      module ? module.position.clone() : new THREE.Vector3(),
    ),
  };
}

const tmpColor = new THREE.Color();

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

export function applyChoreography(refs: DeckRefs, elapsed: number): void {
  const {
    explode,
    dimOthers,
    focus,
    snapFlash,
    deckPulse,
    deckAway,
    knobSpin,
    faderTravel,
    keyPress,
    screenProgress,
    voiceDrop,
    voicePulse,
  } = sceneProxy;

  const focusIndex = FOCUS_ORDER.indexOf(focus);
  // Voice's scene dims the whole rail: none of the four is centre stage,
  // but they should not all stay lit either.
  const dimAll = focus === "voice";

  refs.modules.forEach((module, i) => {
    if (!module) return;
    const pose = EXPLODE_POSE[i];
    const home = refs.rest[i];

    // Drift only once the pieces are apart, exactly as modu-snap.jsx gates
    // it with driftK.
    const wobble = Math.sin(elapsed * pose.ws * 2.2 + pose.ph) * WOBBLE_RAD * explode;
    const bob = Math.sin(elapsed * pose.ws * 1.6 + pose.ph * 2) * BOB * explode;

    // Modules that are not centre stage fall back and down, well out of
    // the frame the copy occupies. Dimming the shell alone is not enough:
    // knobs, keys and the screen all use shared materials that cannot be
    // dimmed for one module only, so a merely darkened neighbour still
    // throws bright machined highlights across the paragraph. Distance
    // handles every material at once.
    const isBackground = dimAll || (focusIndex >= 0 && focusIndex !== i);
    const recede = isBackground ? dimOthers : 0;

    module.position.set(
      damp(module.position.x, home.x + pose.x * explode),
      damp(module.position.y, home.y + pose.y * explode + bob - recede * 0.1),
      damp(module.position.z, home.z + pose.z * explode - recede * 0.3),
    );
    module.rotation.set(
      damp(module.rotation.x, pose.rx * explode),
      damp(module.rotation.y, pose.ry * explode + wobble),
      damp(module.rotation.z, pose.rz * explode),
    );

    const material = refs.bodyMaterials[i];
    if (material) {
      tmpColor.copy(BODY_COLOR).lerp(DIMMED, isBackground ? dimOthers : 0);
      material.color.lerp(tmpColor, 0.12);
    }
  });

  // The deck itself retreats while Voice takes the scene, and pops once on
  // the magnetic click at the end.
  if (refs.deck) {
    const scale = 1 - deckAway * 0.35 + deckPulse;
    refs.deck.scale.setScalar(damp(refs.deck.scale.x, scale, 0.18));
    refs.deck.position.z = damp(refs.deck.position.z, deckAway * -0.35);
    refs.deck.position.y = damp(refs.deck.position.y, deckAway * -0.05);
  }

  // Knobs land on a detent every 15° — the "24 clicks per turn" feel from
  // TZ.md Часть C §5. Each knob turns at its own rate so the three read as
  // three separate controls rather than one geared shaft.
  const detent = Math.PI / 12;
  refs.knobs.forEach((knob, i) => {
    if (!knob) return;
    const rate = [1, 1.4, 0.7][i] ?? 1;
    const target =
      Math.round((knobSpin * Math.PI * 4 * rate) / detent) * detent;
    knob.rotation.y = damp(knob.rotation.y, target, 0.22);
  });

  // The motorised fader runs its slot on its own — the scene's whole point.
  if (refs.faderCarriage) {
    refs.faderCarriage.position.z = damp(
      refs.faderCarriage.position.z,
      faderTravel * FADER_TRAVEL,
      0.16,
    );
  }

  // Keys press in a wave, each one a beat behind the last. The stagger
  // (0.13) is deliberately shorter than a key's own press window (0.45),
  // so three of the five are always mid-travel — stagger them wider and
  // the wave degenerates into five separate presses that a reader
  // scrolling at any speed mostly misses between beats.
  refs.keys.forEach((key, i) => {
    if (!key) return;
    const phase = clamp01((keyPress - i * 0.13) / 0.45);
    key.position.y = damp(
      key.position.y,
      0.02275 - Math.sin(phase * Math.PI) * 0.0035,
      0.3,
    );
  });

  // The strip wakes bottom-up: level rings first, then the app icons.
  // DESIGN.md Часть B §1 draws this with a 256×1024 CanvasTexture; these
  // elements are already real meshes from the deck port, so scaling them
  // in reads the same and costs no per-frame texture upload.
  refs.rings.forEach((ring, i) => {
    if (!ring) return;
    const on = clamp01(screenProgress * 2.5 - i * 0.4);
    ring.scale.setScalar(damp(ring.scale.x, 0.001 + on, 0.2));
  });
  refs.icons.forEach((icon, i) => {
    if (!icon) return;
    const on = clamp01(screenProgress * 2.5 - 0.8 - i * 0.3);
    icon.scale.setScalar(damp(icon.scale.x, 0.001 + on, 0.2));
  });

  // Pogo pins flare orange as the modules meet, then cool off.
  if (refs.pinMaterial) {
    refs.pinMaterial.emissive.copy(PIN_FLASH);
    refs.pinMaterial.emissiveIntensity = damp(
      refs.pinMaterial.emissiveIntensity,
      snapFlash,
      0.35,
    );
  }

  if (refs.voice) {
    // Kept out of the render list entirely until its scene — it shares the
    // frame with the deck for only fourteen percent of the story.
    refs.voice.visible = voiceDrop > 0.01;
    refs.voice.position.y = damp(refs.voice.position.y, (1 - voiceDrop) * 0.4);
    refs.voice.rotation.z = damp(refs.voice.rotation.z, (1 - voiceDrop) * -0.3);
    refs.voice.rotation.y = damp(refs.voice.rotation.y, (1 - voiceDrop) * 0.5);
  }
  if (refs.voiceDial) {
    refs.voiceDial.rotation.y = damp(
      refs.voiceDial.rotation.y,
      voicePulse * 0.6,
      0.15,
    );
  }
  if (refs.voiceRecord) {
    // Push-to-talk: the button breathes only while the rings are running.
    const pulse = 1 + Math.sin(elapsed * 6) * 0.3 * voicePulse;
    refs.voiceRecord.scale.setScalar(damp(refs.voiceRecord.scale.x, pulse, 0.3));
  }
  if (refs.voiceWaves) {
    refs.voiceWaves.visible = voicePulse > 0.01;
    const ripple = (elapsed * 0.6) % 1;
    refs.voiceWaves.scale.setScalar(0.4 + ripple * voicePulse * 1.4);
  }
}
