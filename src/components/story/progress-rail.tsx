"use client";

import { STORY_SCENES } from "./scene-copy";

/**
 * The chapter rail down the left edge of the pinned story — a hairline
 * with one dot per scene and a filled segment tracking progress
 * (DESIGN.md Часть A §4.7).
 *
 * Eight dots, not the "01–05" that section still shows: REVIEW.md §1
 * settled the story at eight scenes.
 *
 * The fill height and the dot states are written straight to the DOM by
 * the scroll timeline (see sections/story.tsx) — routing scroll progress
 * through React state would re-render this on every frame of a scrubbed
 * 800vh pin.
 */
export function ProgressRail() {
  const last = STORY_SCENES.length - 1;

  return (
    <div
      aria-hidden="true"
      // Only exists alongside the pinned timeline that drives it.
      className="pointer-events-none absolute top-1/2 left-6 hidden h-[280px] -translate-y-1/2 lg:motion-safe:block xl:left-12"
    >
      <div className="relative h-full w-px bg-stroke-strong">
        <div
          data-rail-fill
          className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-accent"
        />

        {STORY_SCENES.map((scene, i) => (
          <span
            key={scene.id}
            data-rail-dot={i}
            style={{ top: `${(i / last) * 100}%` }}
            className="absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stroke-strong transition-colors duration-200"
          />
        ))}
      </div>
    </div>
  );
}
