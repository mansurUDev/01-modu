import { Container, Eyebrow, Section } from "./section-shell";

/**
 * Four testimonials — quotes and authors verbatim from TZ.md Часть C §6.
 *
 * No star rows: DESIGN.md §7.6 draws five stars per card, REVIEW.md §1
 * removed them and set the count at four. The card layout and the mono
 * "DECK: …" line under each author do come from that DESIGN section — it
 * is the detail that makes the reviews sell configurations rather than
 * just the product.
 */

const REVIEWS = [
  {
    quote:
      "I bought one Dial to try it. Two weeks later I owned the Studio Kit.",
    name: "Lena K.",
    role: "video editor",
    deck: "Dial + Fader + Keys + View",
    initials: "LK",
    accent: "text-ui-cyan",
  },
  {
    quote: "The fader moving by itself is the most satisfying thing on my desk.",
    name: "Tomás R.",
    role: "sound designer",
    deck: "Fader + Keys",
    initials: "TR",
    accent: "text-ui-violet",
  },
  {
    quote:
      "Voice lives on my couch now. Mute, volume, hang up. My laptop stays closed.",
    name: "Priya S.",
    role: "product manager",
    deck: "Voice + View",
    initials: "PS",
    accent: "text-ui-green",
  },
  {
    quote:
      "It clicks together like it was always one piece. My setup finally looks intentional.",
    name: "Daniel M.",
    role: "streamer",
    deck: "Dial + Keys + View",
    initials: "DM",
    accent: "text-ui-cyan",
  },
] as const;

export function Reviews() {
  return (
    <Section id="reviews">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Eyebrow index="04" label="Reviews" />
          <h2 className="font-display text-h2 tracking-[-0.02em] text-heading">
            People build different decks.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col gap-6 rounded-lg border border-stroke bg-card p-6 shadow-[var(--shadow-card)]"
            >
              <blockquote className="font-body text-base leading-[1.6] text-heading">
                “{review.quote}”
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1B1B1E] font-display text-[13px] font-semibold ${review.accent}`}
                >
                  {review.initials}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-body text-sm text-heading">
                    {review.name}
                  </span>
                  <span className="font-mono text-mono-label uppercase text-muted">
                    {review.role}
                  </span>
                </span>
              </figcaption>

              <p className="border-t border-stroke pt-4 font-mono text-mono-label uppercase text-muted">
                Deck: {review.deck}
              </p>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
