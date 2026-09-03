import * as THREE from "three";
import { createModuleBodyGeometry } from "./module-body";

/**
 * Every geometry in the scene, created once and shared by all meshes that
 * use it (four module shells share ONE body geometry, fifteen pogo pins
 * share one pin geometry, and so on). Dimensions are in metres and are a
 * literal port of design-system/modu-deck-3d.html — the whole deck is
 * scaled up once at the group level (see canvas-root.tsx SCENE_SCALE)
 * rather than by editing these numbers, so the port stays diffable
 * against the source.
 */

/** Module footprint — MOD_W / MOD_LEN / MOD_H in the source. */
export const MOD_W = 0.044;
export const MOD_LEN = 0.165;
export const MOD_H = 0.02;

/** Module centre X positions: `[-1.5, -0.5, 0.5, 1.5] * (MOD_W + 0.0015)`. */
export const MODULE_X = [-1.5, -0.5, 0.5, 1.5].map(
  (k) => k * (MOD_W + 0.0015),
);

/** MODU Voice is absent from the source render — it is the handheld unit,
 *  so it never sits in the deck rail. Dimensions follow the product photo
 *  (a slim remote, a little shorter and slightly wider than a rail module)
 *  and reuse the same shell language so it reads as part of the family. */
export const VOICE_W = 0.046;
export const VOICE_LEN = 0.15;
export const VOICE_H = 0.017;

export type DeckGeometries = {
  body: THREE.ExtrudeGeometry;
  knob: THREE.CylinderGeometry;
  knobTop: THREE.CylinderGeometry;
  knobNotch: THREE.BoxGeometry;
  led: THREE.SphereGeometry;
  pin: THREE.CylinderGeometry;
  faderSlot: THREE.BoxGeometry;
  faderStem: THREE.BoxGeometry;
  faderCap: THREE.BoxGeometry;
  key: THREE.BoxGeometry;
  screen: THREE.BoxGeometry;
  volumeRing: THREE.TorusGeometry;
  appIcon: THREE.BoxGeometry;
  recordButton: THREE.CylinderGeometry;
  voiceBody: THREE.ExtrudeGeometry;
  voiceDial: THREE.CylinderGeometry;
  voiceDialCap: THREE.CylinderGeometry;
  voiceRecord: THREE.CylinderGeometry;
  voiceGrilleSlot: THREE.BoxGeometry;
  voiceKey: THREE.BoxGeometry;
  voiceWave: THREE.TorusGeometry;
};

export function createDeckGeometries(): DeckGeometries {
  return {
    body: createModuleBodyGeometry(MOD_W, MOD_LEN, MOD_H),
    knob: new THREE.CylinderGeometry(0.0125, 0.0125, 0.011, 48),
    knobTop: new THREE.CylinderGeometry(0.0105, 0.0125, 0.0035, 48),
    knobNotch: new THREE.BoxGeometry(0.0016, 0.001, 0.006),
    led: new THREE.SphereGeometry(0.0011, 12, 8),
    pin: new THREE.CylinderGeometry(0.0012, 0.0012, 0.0012, 12),
    faderSlot: new THREE.BoxGeometry(0.005, 0.0012, 0.125),
    faderStem: new THREE.BoxGeometry(0.0035, 0.006, 0.0035),
    faderCap: new THREE.BoxGeometry(0.026, 0.008, 0.014),
    key: new THREE.BoxGeometry(0.03, 0.0055, 0.0225),
    screen: new THREE.BoxGeometry(0.034, 0.0012, 0.128),
    volumeRing: new THREE.TorusGeometry(0.0075, 0.0011, 10, 40),
    appIcon: new THREE.BoxGeometry(0.0065, 0.0006, 0.0065),
    recordButton: new THREE.CylinderGeometry(0.004, 0.004, 0.003, 32),

    voiceBody: createModuleBodyGeometry(VOICE_W, VOICE_LEN, VOICE_H),
    voiceDial: new THREE.CylinderGeometry(0.0155, 0.0155, 0.007, 48),
    voiceDialCap: new THREE.CylinderGeometry(0.0135, 0.0155, 0.0028, 48),
    voiceRecord: new THREE.CylinderGeometry(0.0035, 0.0035, 0.0026, 32),
    voiceGrilleSlot: new THREE.BoxGeometry(0.028, 0.0012, 0.0035),
    voiceKey: new THREE.BoxGeometry(0.0165, 0.0035, 0.0165),
    voiceWave: new THREE.TorusGeometry(0.02, 0.0007, 8, 48),
  };
}

export function disposeDeckGeometries(geometries: DeckGeometries): void {
  for (const geometry of Object.values(geometries)) {
    geometry.dispose();
  }
}
