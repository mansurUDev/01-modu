"use client";

import { useRef } from "react";
import {
  clamp,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  segment,
} from "@/lib/easing";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Port of design-system/modu-success.jsx — a parcel closes, a ring draws
 * itself around it, then an orange check badge pops with a little burst
 * of particles.
 *
 * The original runs on the design system's own playback engine, where the
 * whole frame is a pure function of one authored-time value T. That model
 * is kept exactly: GSAP tweens nothing but `state.T`, and `render(T)`
 * writes attributes straight to refs. No React state, so no re-renders at
 * 60fps — and freezing the animation on its last frame for
 * `prefers-reduced-motion` is just `render(TOTAL)` with no timeline at all.
 *
 * Every geometry constant and cue time below is the source's.
 */

const CX = 540;
const CY = 590;
const R = 250;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Scene cues: Close 0.6s, Circle 0.6s, Check 0.8s. */
const CUE_CIRCLE = 0.6;
const CUE_CHECK = 1.2;
const TOTAL = 2;
const CLOSE_END = CUE_CIRCLE - 0.08;

const BADGE_X = CX + R * Math.cos(-Math.PI / 4);
const BADGE_Y = CY - 20 + R * Math.sin(-Math.PI / 4);

const PARTICLE_COUNT = 10;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  angle: (i / PARTICLE_COUNT) * Math.PI * 2 + 0.4,
  distance: 90 + (i % 3) * 26,
  radius: i % 2 ? 5 : 7,
  fill: i % 2 ? "#DCE9FF" : "#FF4A1F",
}));

export function SuccessAnimation() {
  const root = useRef<SVGSVGElement>(null);
  const zoom = useRef<SVGGElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const parcel = useRef<SVGGElement>(null);
  const flapLeft = useRef<SVGGElement>(null);
  const flapRight = useRef<SVGGElement>(null);
  const badge = useRef<SVGGElement>(null);
  const check = useRef<SVGPathElement>(null);
  const particles = useRef<(SVGCircleElement | null)[]>([]);

  useGSAP(
    () => {
      const render = (t: number) => {
        const flap = segment(t, 0.08, CLOSE_END, easeOutBack);
        const squash =
          (segment(t, CLOSE_END - 0.02, CLOSE_END + 0.06, easeOutCubic) -
            segment(t, CLOSE_END + 0.06, CLOSE_END + 0.32, easeOutCubic)) *
          0.045;
        const circ = segment(t, CUE_CIRCLE, CUE_CIRCLE + 0.55, easeInOutCubic);
        const badgeScale = segment(t, CUE_CHECK, CUE_CHECK + 0.38, easeOutBack);
        const checkDraw = segment(
          t,
          CUE_CHECK + 0.12,
          CUE_CHECK + 0.45,
          easeInOutCubic,
        );
        const burst = segment(
          t,
          CUE_CHECK + 0.1,
          CUE_CHECK + 0.68,
          easeOutCubic,
        );

        zoom.current?.setAttribute(
          "transform",
          `translate(${CX} ${CY}) scale(${1.025 - 0.025 * clamp(t / TOTAL)}) translate(${-CX} ${-CY})`,
        );

        ring.current?.setAttribute(
          "stroke-dashoffset",
          String(CIRCUMFERENCE * (1 - circ)),
        );

        parcel.current?.setAttribute(
          "transform",
          `translate(${CX} ${CY}) scale(1 ${1 - squash}) translate(${-CX} ${-CY})`,
        );
        flapLeft.current?.setAttribute(
          "transform",
          `rotate(${-96 * (1 - flap)} 410 480)`,
        );
        flapRight.current?.setAttribute(
          "transform",
          `rotate(${96 * (1 - flap)} 670 480)`,
        );

        PARTICLES.forEach((particle, i) => {
          const node = particles.current[i];
          if (!node) return;
          const distance = particle.distance * burst;
          node.setAttribute(
            "cx",
            String(BADGE_X + Math.cos(particle.angle) * distance),
          );
          node.setAttribute(
            "cy",
            String(BADGE_Y + Math.sin(particle.angle) * distance),
          );
          node.setAttribute(
            "r",
            String(Math.max(0, particle.radius * (1 - burst * 0.85))),
          );
          node.setAttribute(
            "opacity",
            String(burst > 0 ? clamp(1.4 - burst * 1.4) : 0),
          );
        });

        badge.current?.setAttribute(
          "transform",
          `translate(${BADGE_X} ${BADGE_Y}) scale(${badgeScale})`,
        );
        badge.current?.setAttribute(
          "opacity",
          badgeScale > 0.01 ? "1" : "0",
        );
        check.current?.setAttribute(
          "stroke-dashoffset",
          String(90 * (1 - checkDraw)),
        );
      };

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        // DESIGN.md Часть B §6: the last frame, no motion.
        render(TOTAL);
        return;
      }

      const state = { t: 0 };
      render(0);
      gsap.to(state, {
        t: TOTAL,
        duration: TOTAL,
        ease: "none",
        onUpdate: () => render(state.t),
      });
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 1080 1080"
      role="img"
      aria-label="Your parcel is on its way"
      className="mx-auto w-full max-w-[320px]"
    >
      <g ref={zoom}>
        <circle
          ref={ring}
          cx={CX}
          cy={CY - 20}
          r={R}
          fill="none"
          stroke="#DCE9FF"
          strokeOpacity="0.5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform={`rotate(-90 ${CX} ${CY - 20})`}
        />

        <g ref={parcel}>
          <rect
            x="410"
            y="480"
            width="260"
            height="200"
            rx="12"
            fill="#141416"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2.5"
          />
          <rect x="523" y="480" width="34" height="200" fill="#FF4A1F" opacity="0.92" />
          <rect x="410" y="560" width="260" height="3" fill="rgba(255,255,255,0.07)" />

          <g ref={flapLeft}>
            <rect
              x="410"
              y="468"
              width="130"
              height="14"
              rx="4"
              fill="#1A1A1D"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="2"
            />
            <rect x="523" y="468" width="17" height="14" fill="#FF4A1F" opacity="0.92" />
          </g>

          <g ref={flapRight}>
            <rect
              x="540"
              y="468"
              width="130"
              height="14"
              rx="4"
              fill="#1A1A1D"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="2"
            />
            <rect x="540" y="468" width="17" height="14" fill="#FF4A1F" opacity="0.92" />
          </g>
        </g>

        {PARTICLES.map((particle, i) => (
          <circle
            key={i}
            ref={(node) => {
              particles.current[i] = node;
            }}
            r="0"
            opacity="0"
            fill={particle.fill}
          />
        ))}

        <g ref={badge} opacity="0">
          <circle r="58" fill="#FF4A1F" />
          <path
            ref={check}
            d="M -24 2 L -6 20 L 26 -16"
            fill="none"
            stroke="#0A0A0B"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="90"
            strokeDashoffset="90"
          />
        </g>
      </g>
    </svg>
  );
}
