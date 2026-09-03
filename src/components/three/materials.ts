import * as THREE from "three";

/**
 * The deck's material palette, ported from design-system/modu-deck-3d.html
 * (the `M` object). Names are kept so the meshes stay recognisable in
 * three.js devtools and in any exported GLB.
 *
 * Two values differ from the source, deliberately. The source render had
 * NO environment map, so its author dialled metalness down to 0.3–0.4 and
 * faked "metal" with a light base colour. We do add an <Environment> with
 * Lightformers (canvas-root.tsx), so the aluminium parts can be real
 * metal again and pick up the rim highlights — DESIGN.md Часть A §5 asks
 * for exactly that ("Колпачки кнобов/каретка: metalness:1, roughness:0.22
 * — ловят блики Lightformers"). Everything else is byte-for-byte the
 * source's values.
 */
export type DeckMaterials = {
  body: THREE.MeshStandardMaterial;
  alu: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  cyan: THREE.MeshStandardMaterial;
  violet: THREE.MeshStandardMaterial;
  led: THREE.MeshStandardMaterial;
  rec: THREE.MeshStandardMaterial;
  pin: THREE.MeshStandardMaterial;
  slot: THREE.MeshStandardMaterial;
};

export function createDeckMaterials(): DeckMaterials {
  return {
    body: new THREE.MeshStandardMaterial({
      name: "anodized_black",
      color: 0x0f0f11,
      roughness: 0.55,
      metalness: 0.3,
    }),
    // Source: roughness 0.32 / metalness 0.4 (no env map). See note above.
    alu: new THREE.MeshStandardMaterial({
      name: "aluminum",
      color: 0xb9bac0,
      roughness: 0.3,
      metalness: 0.85,
    }),
    glass: new THREE.MeshStandardMaterial({
      name: "screen_glass",
      color: 0x060607,
      roughness: 0.08,
      metalness: 0.2,
    }),
    cyan: new THREE.MeshStandardMaterial({
      name: "ui_cyan",
      color: 0x0b2d36,
      emissive: 0x38d6f5,
      emissiveIntensity: 1.6,
      roughness: 0.4,
      metalness: 0,
    }),
    violet: new THREE.MeshStandardMaterial({
      name: "ui_violet",
      color: 0x1c1733,
      emissive: 0x8f7bff,
      emissiveIntensity: 1.2,
      roughness: 0.4,
      metalness: 0,
    }),
    led: new THREE.MeshStandardMaterial({
      name: "led_white",
      color: 0x777c88,
      emissive: 0xdce9ff,
      emissiveIntensity: 2,
      roughness: 0.3,
      metalness: 0,
    }),
    rec: new THREE.MeshStandardMaterial({
      name: "record_orange",
      color: 0x4a1608,
      emissive: 0xff4a1f,
      emissiveIntensity: 1.5,
      roughness: 0.35,
      metalness: 0,
    }),
    // Source: roughness 0.25 / metalness 0.4. Same env-map reasoning as `alu`.
    pin: new THREE.MeshStandardMaterial({
      name: "pogo_pin",
      color: 0xcfd2d8,
      roughness: 0.25,
      metalness: 1,
    }),
    slot: new THREE.MeshStandardMaterial({
      name: "slot_black",
      color: 0x060607,
      roughness: 0.7,
      metalness: 0.1,
    }),
  };
}

export function disposeDeckMaterials(materials: DeckMaterials): void {
  for (const material of Object.values(materials)) {
    material.dispose();
  }
}
