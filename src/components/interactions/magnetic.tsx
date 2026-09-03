"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FINE_POINTER } from "./pointer-media";

/**
 * The second and last micro-interaction: a call to action that leans
 * toward the cursor as it approaches.
 *
 * The wrapper carries negative-margin padding so the pull starts a little
 * before the pointer is actually over the button. Without that reach the
 * effect only ever fires once you have already arrived, which is exactly
 * when it stops being useful.
 *
 * The button itself is never moved far enough to escape the pointer —
 * `STRENGTH` is well under 0.5, so the target always ends up closer to
 * the cursor than it started, and a click still lands where it was aimed.
 */

/** Fraction of the pointer's offset from centre that the button follows. */
const STRENGTH = 0.32;
/** How far outside the button the pull reaches, in pixels. */
const REACH = 12;

export function Magnetic({ children }: { children: ReactNode }) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(FINE_POINTER, () => {
        const field = root.current;
        const target = field?.firstElementChild as HTMLElement | null;
        if (!field || !target) return;

        const moveX = gsap.quickTo(target, "x", {
          duration: 0.5,
          ease: "power3",
        });
        const moveY = gsap.quickTo(target, "y", {
          duration: 0.5,
          ease: "power3",
        });

        const onMove = (event: PointerEvent) => {
          const box = target.getBoundingClientRect();
          moveX((event.clientX - (box.left + box.width / 2)) * STRENGTH);
          moveY((event.clientY - (box.top + box.height / 2)) * STRENGTH);
        };

        const onLeave = () => {
          moveX(0);
          moveY(0);
        };

        field.addEventListener("pointermove", onMove);
        field.addEventListener("pointerleave", onLeave);
        field.addEventListener("pointercancel", onLeave);
        // Keyboard focus must not leave the button parked off-centre from
        // its own focus ring.
        target.addEventListener("blur", onLeave);

        return () => {
          field.removeEventListener("pointermove", onMove);
          field.removeEventListener("pointerleave", onLeave);
          field.removeEventListener("pointercancel", onLeave);
          target.removeEventListener("blur", onLeave);
        };
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <span
      ref={root}
      style={{ padding: REACH, margin: -REACH }}
      className="inline-flex"
    >
      {children}
    </span>
  );
}
