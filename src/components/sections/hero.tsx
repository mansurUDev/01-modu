import { ButtonLink } from "@/components/ui/button";
import { Container } from "./section-shell";

/**
 * First screen — mockup "01 Hero". Copy is TZ.md Часть C §2 verbatim; the
 * H1 is "The controller you build.", NOT the "Your desk. Your controls."
 * that DESIGN.md §7.2 still carries (REVIEW.md §1 retired it).
 *
 * The live 3D deck is a fixed canvas painted behind everything (rendered
 * once in page.tsx), so this section only owns type and CTAs. The bottom
 * padding leaves the deck a clear band to sit in; T10 drops a static
 * poster into the same space for phones and reduced-motion.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-end pt-28 pb-14"
    >
      {/* Cold rim light behind the product, per the mockup's hero glow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_42%_at_50%_58%,rgba(220,233,255,0.07),transparent_70%)]"
      />

      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h1 className="max-w-[16ch] font-display text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.02em] text-heading">
          The controller you build.
        </h1>

        <p className="max-w-[52ch] font-body text-[17px] leading-[1.6] text-body">
          Aluminum modules that snap together with magnets. Dials, faders,
          keys, a screen. Pick what you need. Click. Done.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="#modules" size="lg">
            Build your deck
          </ButtonLink>
          <ButtonLink href="#story" size="lg" variant="secondary">
            See how it works
          </ButtonLink>
        </div>

        <p className="mt-8 font-mono text-mono-label uppercase text-muted">
          Scroll to take it apart
        </p>
      </Container>
    </section>
  );
}
