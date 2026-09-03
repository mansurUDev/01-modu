"use client";

import type { DeckResources } from "./deck";
import { VOICE_H, VOICE_LEN, VOICE_W } from "./geometries";

/**
 * MODU Voice — the handheld unit. It is the one module missing from
 * design-system/modu-deck-3d.html (it never sits in the rail), so this is
 * built from primitives against the product photo and the 2D reference in
 * design-system/modu-snap.jsx: a slim remote with a push-to-talk grille at
 * the top, one big rotary dial, a small red record button beside it, and
 * four keys at the bottom.
 *
 * It reuses the deck's shell geometry and material palette so it reads as
 * the same product family. Hidden by default — story scene 7 (T9) drops it
 * into frame via sceneProxy.voiceDrop.
 *
 * -z is the top of the unit (grille end), +z the bottom (keys end).
 */
export function Voice({ geometries, materials }: DeckResources) {
  const top = VOICE_H; // the surface plane the controls sit on
  const dialZ = -0.025;

  return (
    <group name="modu_voice" visible={false}>
      <mesh
        name="voice_body"
        geometry={geometries.voiceBody}
        material={materials.body}
      />

      {/* Push-to-talk grille — two milled slots near the top edge. */}
      {[-0.062, -0.0555].map((z, i) => (
        <mesh
          key={z}
          name={`voice_grille_${i + 1}`}
          geometry={geometries.voiceGrilleSlot}
          material={materials.slot}
          position={[0, top - 0.0002, z]}
        />
      ))}

      {/* The big dial. Grouped and centred on its own axis so T9 can spin it. */}
      <group name="voice_dial_group" position={[0, 0, dialZ]}>
        <mesh
          name="voice_dial"
          geometry={geometries.voiceDial}
          material={materials.alu}
          position={[0, top + 0.0035, 0]}
        />
        <mesh
          name="voice_dial_cap"
          geometry={geometries.voiceDialCap}
          material={materials.alu}
          position={[0, top + 0.0084, 0]}
        />
      </group>

      <mesh
        name="voice_record"
        geometry={geometries.voiceRecord}
        material={materials.rec}
        position={[0.0135, top + 0.0013, -0.0455]}
      />

      {/* Four keys, 2 x 2 — answer / mute / call / audio on the real unit. */}
      {[
        [-0.0105, 0.028],
        [0.0105, 0.028],
        [-0.0105, 0.05],
        [0.0105, 0.05],
      ].map(([x, z], i) => (
        <mesh
          key={`${x}:${z}`}
          name={`voice_key_${i + 1}`}
          geometry={geometries.voiceKey}
          material={materials.alu}
          position={[x, top + 0.00175, z]}
        />
      ))}

      {/* Push-to-talk ripples — pulsed outward from the dial in scene 7. */}
      <group
        name="voice_waves"
        position={[0, top + 0.002, dialZ]}
        visible={false}
      >
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            name={`voice_wave_${i + 1}`}
            geometry={geometries.voiceWave}
            material={materials.cyan}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.6 + i * 0.2}
          />
        ))}
      </group>

      {/* Status LED, mirroring the rail modules' single dot. */}
      <mesh
        name="voice_led"
        geometry={geometries.led}
        material={materials.led}
        position={[VOICE_W / 2 - 0.008, top + 0.0008, VOICE_LEN / 2 - 0.008]}
      />
    </group>
  );
}
