"use client";

import { useRef } from "react";
import { ProgressRail } from "@/components/story/progress-rail";
import { STORY_SCENES } from "@/components/story/scene-copy";
import { ButtonLink } from "@/components/ui/button";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Container, Eyebrow } from "./section-shell";

/**
 * The scroll story.
 *
 * One set of markup serves both renderings, rather than two DOM trees
 * behind media queries:
 *
 * - Below 1024px, or under `prefers-reduced-motion`, the scenes are
 *   ordinary stacked blocks in normal flow. That is not a fallback bolted
 *   on afterwards — DESIGN.md Часть B §6 specifies exactly this, and it is
 *   what T5 shipped.
 * - On desktop the same scenes become absolutely-positioned overlays and
 *   the stage sticks for eight viewports of scroll, with one master
 *   timeline scrubbing them in and out (DESIGN.md Часть B §0).
 *
 * The stage is held by CSS `position: sticky`, not ScrollTrigger's `pin`.
 * The doc asks for `pin: '#story-stage'`, and that is what this started
 * as — but ScrollTrigger pinned the stage at `top: 900px`, exactly the
 * hero's height, parking every scene just below the fold. Sticky gets the
 * same result with no pin-spacer to mis-measure, and leaves anchors and
 * layout alone. ScrollTrigger keeps its real job here: scrubbing the
 * timeline across the section.
 *
 * Scene 1 renders visible so the section is never blank before JS runs;
 * the rest start transparent on desktop only (`lg:opacity-0`) and the
 * timeline takes them from there.
 *
 * The timeline writes to the DOM directly and holds no React state: a
 * scrubbed pin fires on every frame, and re-rendering eight scenes plus a
 * rail that often would eat the frame budget the 3D scene needs.
 */

/** Timeline units are percent of the master, matching scene-copy.ts. */
const FADE = 4;

export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        {
          pinned: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          plain: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (!context.conditions?.pinned) return;

          const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");
          const fill = root.current?.querySelector<HTMLElement>("[data-rail-fill]");
          const dots = gsap.utils.toArray<HTMLElement>("[data-rail-dot]");

          gsap.set(scenes, { opacity: 0, yPercent: 100 });
          gsap.set(scenes[0], { opacity: 1, yPercent: 0 });

          const master = gsap.timeline({
            scrollTrigger: {
              trigger: "#story",
              start: "top top",
              // The section is 900vh and the stage sticks at 100vh, so the
              // travel between these two points is exactly the eight
              // screens of scroll the spec asks for.
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const progress = self.progress;
                if (fill) fill.style.transform = `scaleY(${progress})`;

                const activeIndex = STORY_SCENES.findIndex(
                  (scene) =>
                    progress * 100 >= scene.at && progress * 100 < scene.until,
                );
                dots.forEach((dot, i) => {
                  dot.classList.toggle(
                    "bg-accent",
                    i <= (activeIndex === -1 ? STORY_SCENES.length - 1 : activeIndex),
                  );
                  dot.classList.toggle(
                    "bg-stroke-strong",
                    i > (activeIndex === -1 ? STORY_SCENES.length - 1 : activeIndex),
                  );
                });
              },
            },
          });

          // Chapters roll rather than dissolve: the outgoing scene rides up
          // and out of the clipped window while the incoming one comes up
          // from below, over the same stretch of scroll. Two earlier
          // attempts were worse — fading out before the next scene began
          // left the screen blank between chapters, and cross-fading in
          // place put two paragraphs on the same pixels, which reads as
          // double vision.
          //
          // Both are plain tweens on the scrubbed timeline with no
          // onComplete side effects, which is what keeps scrubbing backwards
          // exact — the acceptance rule in DESIGN.md Часть B §7.
          STORY_SCENES.forEach((scene, i) => {
            const el = scenes[i];
            if (!el) return;

            if (i > 0) {
              master.to(
                el,
                { opacity: 1, yPercent: 0, duration: FADE, ease: "power2.out" },
                scene.at,
              );
            }

            const isLast = i === STORY_SCENES.length - 1;
            if (!isLast) {
              master.to(
                el,
                { opacity: 0, yPercent: -100, duration: FADE, ease: "power2.in" },
                scene.until,
              );
            }
          });

          // The master must be at least as long as the last label, or GSAP
          // compresses the mapping between scroll and timeline position.
          master.to({}, { duration: 0 }, 100);
        },
      );

      // Scene boundaries depend on the section's measured height, which
      // is only final once fonts have settled.
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="story"
      ref={root}
      className="relative lg:motion-safe:h-[900vh]"
    >
      <div
        id="story-stage"
        // Every desktop-pin style is motion-safe gated: under reduced
        // motion there is no timeline, so the overlay layout would just
        // stack eight scenes on top of each other.
        className="relative lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:items-center lg:motion-safe:overflow-hidden"
      >
        <ProgressRail />

        <Container className="flex flex-col gap-6 py-20 lg:motion-safe:py-0">
          <Eyebrow index="01" label="Story" />

          <div className="flex flex-col gap-16 md:gap-24 lg:motion-safe:relative lg:motion-safe:block lg:motion-safe:h-[220px] lg:motion-safe:overflow-hidden">
            {STORY_SCENES.map((scene, i) => (
              <article
                key={scene.id}
                data-scene={scene.id}
                // motion-safe matters: without it, a desktop visitor with
                // reduced motion gets scenes hidden by CSS and no timeline
                // to ever reveal them.
                className={`flex max-w-[46ch] flex-col gap-4 lg:motion-safe:absolute lg:motion-safe:inset-x-0 lg:motion-safe:top-0 ${
                  i > 0 ? "lg:motion-safe:opacity-0" : ""
                }`}
              >
                <h2 className="font-display text-h2 tracking-[-0.02em] text-heading">
                  {scene.heading}
                </h2>
                <p className="font-body text-base leading-[1.6] text-body">
                  {scene.body}
                </p>
                {scene.cta && (
                  <ButtonLink href={scene.cta.href} className="mt-2 self-start">
                    {scene.cta.label}
                  </ButtonLink>
                )}
              </article>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
