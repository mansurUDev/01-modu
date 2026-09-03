import { ButtonLink } from "@/components/ui/button";
import { STORY_SCENES } from "@/components/story/scene-copy";
import { Container, Eyebrow, Section } from "./section-shell";

/**
 * The eight scroll-story scenes, laid out as ordinary stacked blocks.
 *
 * This is NOT a throwaway placeholder: DESIGN.md Часть B §6 specifies
 * exactly this — plain sections, no pin, no scrub — as what the story
 * degrades to under `prefers-reduced-motion` and below 1024px. T8 wraps
 * the desktop path in the 800vh pin and leaves this rendering intact for
 * everyone else.
 */
export function Story() {
  return (
    <Section id="story">
      <Container className="flex flex-col gap-6">
        <Eyebrow index="01" label="Story" />

        <div className="flex flex-col gap-16 md:gap-24">
          {STORY_SCENES.map((scene) => (
            <article
              key={scene.id}
              className="flex max-w-[46ch] flex-col gap-4"
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
    </Section>
  );
}
