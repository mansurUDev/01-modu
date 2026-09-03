"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Deck, type DeckResources } from "./deck";
import { createDeckGeometries, disposeDeckGeometries } from "./geometries";
import { createDeckMaterials, disposeDeckMaterials } from "./materials";
import { damp, sceneProxy } from "./scene-proxy";
import { Voice } from "./voice";

/**
 * The single persistent <Canvas> for the whole landing page. It is fixed
 * behind the content and never remounts — story scenes only change state
 * (DESIGN.md Часть B §0).
 *
 * Deliberately absent, per REVIEW.md §4: no postprocessing / Bloom, no
 * `<Environment preset|files>` (those fetch an HDR from a CDN at runtime,
 * which breaks the project's zero-external-request rule — the Lightformers
 * below build the environment in-scene instead), and no shadow maps.
 */

/** The source geometry is in metres; scale the whole deck up once here
 *  rather than editing every dimension, so the port stays diffable
 *  against design-system/modu-deck-3d.html. */
const SCENE_SCALE = 10;

/** Lifts the deck so its mass is centred on the origin — the camera then
 *  aims at the origin and T9 can rotate the deck about its own centre. */
const DECK_Y = -0.17;

/**
 * Hero camera. fov 35 is the "product photography" long lens from
 * DESIGN.md Часть B §4. That doc pairs it with position [0, 1.6, 7],
 * which framed a much larger imagined model; at SCENE_SCALE the deck is
 * ~1.8 units wide and would sit tiny in the middle of the frame, so the
 * distance is pulled in to fill the shot at the same ~22° elevation the
 * reference render uses (design-system/screenshots/deck3d.png).
 */
const HERO_CAMERA = { fov: 35, position: [1.7, 3.0, 3.3] as const };

/** Idle drift on the hero pose: ±3° of yaw over 8s (DESIGN.md Часть B §1). */
const IDLE_YAW_RAD = THREE.MathUtils.degToRad(3);
const IDLE_PERIOD_S = 8;

/**
 * Drives the camera from sceneProxy and keeps it aimed at the deck.
 *
 * The aiming is not optional: R3F leaves a camera created from the
 * `camera` prop with its default orientation (straight down -Z), so a
 * raised camera looks over the top of the scene instead of at it. Every
 * camera move in the story (T9) goes through the proxy fields damped
 * here.
 */
function CameraRig() {
  useFrame(({ camera }) => {
    camera.position.set(
      damp(camera.position.x, sceneProxy.camX),
      damp(camera.position.y, sceneProxy.camY),
      damp(camera.position.z, sceneProxy.camZ),
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function DeckRig({ geometries, materials }: DeckResources) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const targetYaw =
      Math.sin((t / IDLE_PERIOD_S) * Math.PI * 2) *
      IDLE_YAW_RAD *
      sceneProxy.idle;
    // Everything the story drives goes through sceneProxy and gets damped
    // here — never tweened onto the meshes directly. T9 adds explode,
    // focus, camera and per-module drivers alongside this drift.
    group.current.rotation.y = damp(group.current.rotation.y, targetYaw);
  });

  return (
    <group ref={group} scale={SCENE_SCALE} position={[0, DECK_Y, 0]}>
      <Deck geometries={geometries} materials={materials} />
      <Voice geometries={geometries} materials={materials} />
    </group>
  );
}

function Scene() {
  const resources = useMemo<DeckResources>(
    () => ({
      materials: createDeckMaterials(),
      geometries: createDeckGeometries(),
    }),
    [],
  );

  useEffect(
    () => () => {
      disposeDeckMaterials(resources.materials);
      disposeDeckGeometries(resources.geometries);
    },
    [resources],
  );

  return (
    <>
      {/* Base wash so silhouettes never go fully black. The reference
          render leaned on a bright hemisphere + a 2.2-intensity key light
          because it had no environment map; with the Lightformers below
          doing most of the work, those are dialled back to keep the
          "black aluminium, one warm highlight" look. */}
      <hemisphereLight args={[0xffffff, 0xd8d2c4, 0.5]} />
      <directionalLight position={[4, 7, 5]} intensity={1.1} />
      <directionalLight position={[-5, 3, -4]} intensity={0.35} color="#fff4e6" />
      <pointLight position={[3, 0.5, 2]} intensity={0.5} color="#FF4A1F" />

      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3.5}
          position={[0, 4, 0]}
          scale={[8, 2, 1]}
          rotation-x={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[-5, 1, 2]}
          scale={[1, 4, 1]}
          color="#dfe6ff"
        />
        <Lightformer
          form="rect"
          intensity={0.6}
          position={[5, 0, 1]}
          scale={[1, 4, 1]}
          color="#FF4A1F"
        />
      </Environment>

      <CameraRig />
      <DeckRig {...resources} />

      {/* Grounding shadow only — no shadow maps anywhere in this scene.
          frames={1} bakes it once; T9 fades its opacity out while the deck
          is exploded, since a single baked pass cannot follow the pieces. */}
      <ContactShadows
        position={[0, DECK_Y - 0.002, 0]}
        scale={6}
        far={1.2}
        blur={2.5}
        opacity={0.45}
        frames={1}
      />
    </>
  );
}

export default function CanvasRoot() {
  return (
    <Canvas
      className="!fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
      gl={{ alpha: true }}
      dpr={[1, 2]}
      camera={HERO_CAMERA}
      // T3 keeps the loop running so the idle drift is visible. T9 flips
      // this to 'always' only while the story is in view and 'demand'
      // everywhere else (REVIEW.md §1), so the GPU sleeps on other routes.
      frameloop="always"
    >
      <Scene />
    </Canvas>
  );
}
