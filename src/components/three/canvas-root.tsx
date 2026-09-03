"use client";

import {
  ContactShadows,
  Environment,
  Lightformer,
  Preload,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Deck, type DeckResources } from "./deck";
import { createDeckGeometries, disposeDeckGeometries } from "./geometries";
import { createDeckMaterials, disposeDeckMaterials } from "./materials";
import { damp, sceneProxy } from "./scene-proxy";
import { applyChoreography, collectDeckRefs, type DeckRefs } from "./scroll-rig";
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

/** Resting opacity of the baked contact shadow. */
const SHADOW_OPACITY = 0.45;

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
  // The aim point is damped as its own vector rather than snapped: during
  // the module parade the camera swings from one exploded module to the
  // next, and an undamped lookAt makes that a cut instead of a pan.
  // The camera's own position is not the damped state: the framing offset
  // below is re-applied every frame, so damping toward the target from an
  // already-offset position would let the offset compound. `base` is the
  // pose; the camera is where the pose lands after composition.
  const base = useRef(
    new THREE.Vector3(HERO_CAMERA.position[0], HERO_CAMERA.position[1], HERO_CAMERA.position[2]),
  );
  const aim = useRef(new THREE.Vector3(0, 0, 0));
  const shift = useRef(sceneProxy.frameShift);
  const offset = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());

  useFrame(({ camera, size }) => {
    base.current.set(
      damp(base.current.x, sceneProxy.camX),
      damp(base.current.y, sceneProxy.camY),
      damp(base.current.z, sceneProxy.camZ),
    );
    aim.current.set(
      damp(aim.current.x, sceneProxy.lookX),
      damp(aim.current.y, sceneProxy.lookY),
      damp(aim.current.z, sceneProxy.lookZ),
    );
    shift.current = damp(shift.current, sceneProxy.frameShift);

    camera.position.copy(base.current);
    camera.lookAt(aim.current);

    // Slide the whole frustum left along the camera's own right axis, which
    // pushes the subject the same distance right on screen. The amount is a
    // fraction of the half-width actually visible at the aim distance, so
    // the composition holds on any viewport and at any camera distance.
    const fov = (camera as THREE.PerspectiveCamera).fov ?? HERO_CAMERA.fov;
    const halfWidth =
      base.current.distanceTo(aim.current) *
      Math.tan(THREE.MathUtils.degToRad(fov) / 2) *
      (size.width / size.height);

    offset.current
      .setFromMatrixColumn(camera.matrix, 0)
      .multiplyScalar(-shift.current * halfWidth);
    camera.position.add(offset.current);
    camera.lookAt(target.current.copy(aim.current).add(offset.current));
  });

  return null;
}

function DeckRig({ geometries, materials }: DeckResources) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<DeckRefs | null>(null);

  useFrame((state) => {
    if (!group.current) return;
    // Collected on the first frame rather than in an effect: by then every
    // child mesh has mounted and none of them has been moved yet, so the
    // positions captured here are the true rest pose.
    refs.current ??= collectDeckRefs(group.current);

    const t = state.clock.elapsedTime;
    const targetYaw =
      Math.sin((t / IDLE_PERIOD_S) * Math.PI * 2) *
      IDLE_YAW_RAD *
      sceneProxy.idle;
    // Everything the story drives goes through sceneProxy and is damped
    // here — never tweened onto the meshes directly.
    group.current.rotation.y = damp(group.current.rotation.y, targetYaw);

    applyChoreography(refs.current, t);
  });

  return (
    <group ref={group} scale={SCENE_SCALE} position={[0, DECK_Y, 0]}>
      <Deck geometries={geometries} materials={materials} />
      <Voice geometries={geometries} materials={materials} />
    </group>
  );
}

/**
 * The grounding shadow is baked once (`frames={1}`), so it cannot follow
 * the modules once they scatter — it would sit under the scene as a hard
 * deck-shaped smudge with nothing above it. Fading it out while the deck
 * is exploded or pushed back is cheaper and more honest than re-baking.
 */
function GroundShadow() {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const target =
      SHADOW_OPACITY * (1 - sceneProxy.explode) * (1 - sceneProxy.deckAway);
    group.current.traverse((object) => {
      const material = (object as THREE.Mesh).material;
      if (material && !Array.isArray(material) && "opacity" in material) {
        material.opacity = damp(material.opacity, target, 0.15);
      }
    });
  });

  return (
    <group ref={group}>
      <ContactShadows
        position={[0, DECK_Y - 0.002, 0]}
        scale={6}
        far={1.2}
        blur={2.5}
        opacity={SHADOW_OPACITY}
        frames={1}
      />
    </group>
  );
}

/**
 * Runs the render loop only while the 3D scene can actually be seen.
 *
 * The canvas is `fixed`, so it stays mounted for the whole page, but from
 * the catalogue down it is covered by an opaque block — REVIEW.md §1 asks
 * for the GPU to sleep there. A plain IntersectionObserver on the hero and
 * the story does the job without another ScrollTrigger to keep in sync,
 * and `invalidate()` on the way out renders one last frame so the scene
 * does not freeze mid-transition.
 */
function FrameloopRig() {
  const setFrameloop = useThree((state) => state.setFrameloop);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const targets = ["#top", "#story"]
      .map((selector) => document.querySelector(selector))
      .filter((element): element is Element => element !== null);
    if (targets.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      if (visible.size > 0) {
        setFrameloop("always");
      } else {
        setFrameloop("demand");
        invalidate();
      }
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [invalidate, setFrameloop]);

  return null;
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

      {/* Voice spends the first seventy percent of the story hidden, so its
          geometry and shaders would otherwise upload on the single frame it
          appears — a measured 160ms stall in the middle of a scrub. Preload
          pays that cost once, during the hero. */}
      <Preload all />

      <FrameloopRig />
      <CameraRig />
      <DeckRig {...resources} />

      {/* Grounding shadow only — no shadow maps anywhere in this scene. */}
      <GroundShadow />
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
      // Starts running so the hero's idle drift is there on first paint;
      // FrameloopRig drops it to 'demand' as soon as the hero and story
      // are both off screen.
      frameloop="always"
    >
      <Scene />
    </Canvas>
  );
}
