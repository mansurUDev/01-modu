"use client";

import { useMemo } from "react";
import { MOD_H, MOD_W, MODULE_X, type DeckGeometries } from "./geometries";
import type { DeckMaterials } from "./materials";

/**
 * The four rail modules, ported mesh-for-mesh from
 * design-system/modu-deck-3d.html. Every `name` is kept verbatim: the
 * story choreography (T9) looks meshes up by these names, so renaming one
 * silently breaks an animation rather than the build.
 *
 * Local coordinates are the source's metres; the whole deck is scaled once
 * by its parent (canvas-root.tsx).
 */

export type DeckResources = {
  geometries: DeckGeometries;
  materials: DeckMaterials;
};

type ModuleProps = DeckResources;

/** Two rows of five pogo pins on one long side face (normal along ±x). */
function PinArray({
  geometries,
  materials,
  xFace,
  sign,
  yc,
  name,
}: ModuleProps & {
  xFace: number;
  sign: 1 | -1;
  yc: number;
  name: string;
}) {
  const pins = useMemo(() => {
    const out: { key: string; position: [number, number, number] }[] = [];
    let i = 0;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 5; col++) {
        out.push({
          key: `${name}_${++i}`,
          position: [
            xFace + sign * 0.0005,
            yc + (row - 0.5) * 0.0045,
            (col - 2) * 0.006,
          ],
        });
      }
    }
    return out;
  }, [name, sign, xFace, yc]);

  return (
    <>
      {pins.map((pin) => (
        <mesh
          key={pin.key}
          name={pin.key}
          geometry={geometries.pin}
          material={materials.pin}
          position={pin.position}
          rotation={[0, 0, Math.PI / 2]}
        />
      ))}
    </>
  );
}

function Led({
  geometries,
  materials,
  name,
  position,
}: ModuleProps & { name: string; position: [number, number, number] }) {
  return (
    <mesh
      name={name}
      geometry={geometries.led}
      material={materials.led}
      position={position}
    />
  );
}

/** Module 1 — three machined knobs. */
function ModuleDial({ geometries, materials }: ModuleProps) {
  return (
    <group name="module_dial" position={[MODULE_X[0], 0, 0]}>
      <mesh name="dial_body" geometry={geometries.body} material={materials.bodies[0]} />

      {/* Each knob sits in its own group centred on the knob axis, so T9 can
          spin cap + notch in place by rotating the group about Y. World
          positions are identical to the source's flat mesh list. */}
      {[-0.05, 0, 0.05].map((z, i) => (
        <group key={z} name={`knob_group_${i + 1}`} position={[0, 0, z]}>
          <mesh
            name={`knob_${i + 1}`}
            geometry={geometries.knob}
            material={materials.alu}
            position={[0, MOD_H + 0.0055, 0]}
          />
          <mesh
            name={`knob_${i + 1}_cap`}
            geometry={geometries.knobTop}
            material={materials.alu}
            position={[0, MOD_H + 0.0125, 0]}
          />
          <mesh
            name={`knob_${i + 1}_notch`}
            geometry={geometries.knobNotch}
            material={materials.slot}
            position={[0, MOD_H + 0.0147, -0.006]}
          />
        </group>
      ))}

      <Led
        geometries={geometries}
        materials={materials}
        name="dial_led"
        position={[0.014, MOD_H + 0.0008, -0.072]}
      />
      <PinArray
        geometries={geometries}
        materials={materials}
        xFace={MOD_W / 2}
        sign={1}
        yc={MOD_H / 2}
        name="dial_pin"
      />
    </group>
  );
}

/** Module 2 — one long motorised fader. */
function ModuleFader({ geometries, materials }: ModuleProps) {
  return (
    <group name="module_fader" position={[MODULE_X[1], 0, 0]}>
      <mesh name="fader_body" geometry={geometries.body} material={materials.bodies[1]} />

      <mesh
        name="fader_slot"
        geometry={geometries.faderSlot}
        material={materials.slot}
        position={[0, MOD_H + 0.0002, 0]}
      />
      {/* Stem + cap travel together along z — T9 drives them via sceneProxy.faderTravel. */}
      {/* -0.0225 is sceneProxy.faderTravel = -0.5 through scroll-rig's
          FADER_TRAVEL: the modelled rest pose and the animated rest pose
          are the same point, so nothing slides on first frame. */}
      <group name="fader_carriage" position={[0, 0, -0.0225]}>
        <mesh
          name="fader_stem"
          geometry={geometries.faderStem}
          material={materials.slot}
          position={[0, MOD_H + 0.003, 0]}
        />
        <mesh
          name="fader_cap"
          geometry={geometries.faderCap}
          material={materials.alu}
          position={[0, MOD_H + 0.0085, 0]}
        />
      </group>

      <Led
        geometries={geometries}
        materials={materials}
        name="fader_led_1"
        position={[0.015, MOD_H + 0.0008, 0.07]}
      />
      <Led
        geometries={geometries}
        materials={materials}
        name="fader_led_2"
        position={[0.015, MOD_H + 0.0008, 0.062]}
      />
      <PinArray
        geometries={geometries}
        materials={materials}
        xFace={MOD_W / 2}
        sign={1}
        yc={MOD_H / 2}
        name="fader_pin"
      />
    </group>
  );
}

/** Module 3 — five tactile keys. */
function ModuleKeys({ geometries, materials }: ModuleProps) {
  return (
    <group name="module_keys" position={[MODULE_X[2], 0, 0]}>
      <mesh name="keys_body" geometry={geometries.body} material={materials.bodies[2]} />

      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          name={`key_${i + 1}`}
          geometry={geometries.key}
          material={materials.alu}
          position={[0, MOD_H + 0.00275, (i - 2) * 0.0285]}
        />
      ))}

      <Led
        geometries={geometries}
        materials={materials}
        name="keys_led"
        position={[0.017, MOD_H + 0.0008, -0.075]}
      />
      <PinArray
        geometries={geometries}
        materials={materials}
        xFace={MOD_W / 2}
        sign={1}
        yc={MOD_H / 2}
        name="keys_pin"
      />
    </group>
  );
}

/** Module 4 — the touchscreen strip. */
function ModuleView({ geometries, materials }: ModuleProps) {
  return (
    <group name="module_view" position={[MODULE_X[3], 0, 0]}>
      <mesh name="view_body" geometry={geometries.body} material={materials.bodies[3]} />

      <mesh
        name="view_screen"
        geometry={geometries.screen}
        material={materials.glass}
        position={[0, MOD_H + 0.0003, -0.01]}
      />

      {/* The strip starts dark and wakes during story scene 6, so its
          contents are scaled to nothing rather than hidden — scroll-rig
          scales them back in, and a scale of 0 has no orientation to
          recover from. */}
      {[-0.052, -0.028].map((z, i) => (
        <mesh
          key={z}
          name={`volume_ring_${i + 1}`}
          geometry={geometries.volumeRing}
          material={materials.cyan}
          position={[0, MOD_H + 0.0011, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.001}
        />
      ))}

      {[0.006, 0.02, 0.034].map((z, i) => (
        <mesh
          key={z}
          name={`app_icon_${i + 1}`}
          geometry={geometries.appIcon}
          material={materials.violet}
          position={[0, MOD_H + 0.0011, z]}
          scale={0.001}
        />
      ))}

      <mesh
        name="record_button"
        geometry={geometries.recordButton}
        material={materials.rec}
        position={[0, MOD_H + 0.0015, 0.066]}
      />

      <PinArray
        geometries={geometries}
        materials={materials}
        xFace={-MOD_W / 2}
        sign={-1}
        yc={MOD_H / 2}
        name="view_pin"
      />
    </group>
  );
}

export function Deck({ geometries, materials }: DeckResources) {
  return (
    <group name="modu_deck">
      <ModuleDial geometries={geometries} materials={materials} />
      <ModuleFader geometries={geometries} materials={materials} />
      <ModuleKeys geometries={geometries} materials={materials} />
      <ModuleView geometries={geometries} materials={materials} />
    </group>
  );
}
