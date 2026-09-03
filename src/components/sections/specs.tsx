import { Container, Eyebrow, Section } from "./section-shell";

/**
 * Spec table — all seven rows from TZ.md Часть C §5, verbatim. DESIGN.md
 * §7.5's four-fact version and its velocity-driven marquee were both cut
 * (REVIEW.md §1/§3); this is a plain, static definition list.
 */

const SPECS = [
  ["Body", "CNC-machined 6061 aluminum, matte black anodized"],
  [
    "Connection",
    "Magnetic pogo pins. Hot-swap modules any time — no restart.",
  ],
  ["Port", "One USB-C for the whole deck. Cable included."],
  [
    "Compatibility",
    "macOS 12+ and Windows 10+. Profiles for Figma, Photoshop, Premiere, Ableton, OBS and Discord.",
  ],
  ["Software", "MODU Desk app. Free, small, no account needed."],
  ["Feet", "Micro-suction pads. The deck stays where you put it."],
  ["Lights", "White status LEDs. They dim when you do not need them."],
] as const;

export function Specs() {
  return (
    <Section id="specs">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Eyebrow index="03" label="Specs" />
          <h2 className="font-display text-h2 tracking-[-0.02em] text-heading">
            The boring details. Done properly.
          </h2>
        </div>

        <dl className="border-t border-stroke">
          {SPECS.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-1 gap-2 border-b border-stroke py-5 md:grid-cols-[200px_1fr] md:gap-8"
            >
              <dt className="font-mono text-mono-label uppercase text-muted">
                {label}
              </dt>
              <dd className="font-body text-base leading-[1.6] text-body">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
