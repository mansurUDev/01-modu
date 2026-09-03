import { Container } from "./section-shell";

/**
 * Mockup "08 Footer" on the deep background. The three lines are TZ.md
 * Часть C §9 verbatim, and the order matters: the disclaimer goes last
 * and is not optional — it is what keeps a fictional brand honest.
 */

const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Modules", href: "#modules" },
  { label: "Specs", href: "#specs" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="border-t border-stroke bg-background-deep pt-16 pb-12">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-1.5 font-display text-2xl font-bold tracking-[0.06em] text-heading">
            MODU
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          </span>

          <nav className="flex flex-wrap gap-x-10 gap-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm text-body transition-colors duration-150 hover:text-heading"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-stroke pt-8">
          <p className="max-w-[70ch] font-body text-[13px] leading-[1.6] text-body">
            Designed &amp; built by Mansur — frontend developer. Next.js, GSAP,
            React Three Fiber. No 3D models were harmed: everything is made of
            primitives.
          </p>
          <p className="max-w-[70ch] font-body text-[13px] leading-[1.6] text-muted">
            MODU is a fictional brand created for this portfolio demo. The
            product does not exist. No real orders, no payments, and no data
            ever leaves your browser.
          </p>
          <p className="font-mono text-mono-label uppercase text-muted">
            © 2026 MODU. A concept, not a company.
          </p>
        </div>
      </Container>
    </footer>
  );
}
