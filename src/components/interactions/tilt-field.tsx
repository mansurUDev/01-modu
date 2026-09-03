"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FINE_POINTER } from "./pointer-media";

/**
 * Cards lean toward the pointer — one of exactly two micro-interactions
 * the project allows itself (REVIEW.md §3 cut the rest).
 *
 * Wraps a group rather than each card: one component installs the effect
 * on every `[data-tilt]` inside it, so the catalogue grid stays a server
 * component and only this thin shell ships to the browser.
 *
 * `gsap.quickTo` is the reason this is affordable. It builds one reusable
 * tween per property per card and just retargets it on each pointer move,
 * instead of allocating a tween per event — which, at pointermove rates
 * on a page already running a 60fps WebGL scene, is the difference
 * between a flourish and a stutter.
 */

/** Maximum lean, in degrees, at the corners of a card. */
const MAX_DEG = 6;
/** How far the card rises toward the reader, in pixels. */
const LIFT = 4;

export function TiltField({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(FINE_POINTER, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-tilt]");

        const teardown = cards.map((card) => {
          const target = card.firstElementChild as HTMLElement | null;
          if (!target) return () => {};

          // Perspective lives in the element's own transform, so the card
          // needs no specially prepared parent to sit inside.
          gsap.set(target, { transformPerspective: 900 });

          const rotateX = gsap.quickTo(target, "rotationX", {
            duration: 0.45,
            ease: "power3",
          });
          const rotateY = gsap.quickTo(target, "rotationY", {
            duration: 0.45,
            ease: "power3",
          });
          const lift = gsap.quickTo(target, "y", {
            duration: 0.45,
            ease: "power3",
          });

          const onMove = (event: PointerEvent) => {
            const box = card.getBoundingClientRect();
            const dx = (event.clientX - box.left) / box.width - 0.5;
            const dy = (event.clientY - box.top) / box.height - 0.5;
            rotateY(dx * MAX_DEG * 2);
            rotateX(-dy * MAX_DEG * 2);
            lift(-LIFT);
          };

          const onLeave = () => {
            rotateX(0);
            rotateY(0);
            lift(0);
          };

          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          // A card can also be left by keyboard or by the pointer being
          // cancelled mid-gesture; both must return it to rest.
          card.addEventListener("pointercancel", onLeave);

          return () => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
            card.removeEventListener("pointercancel", onLeave);
          };
        });

        return () => teardown.forEach((off) => off());
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
