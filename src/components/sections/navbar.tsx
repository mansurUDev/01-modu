"use client";

import { IconButton } from "@/components/ui/icon-button";
import { Container } from "./section-shell";

/**
 * Sticky header — mockup "01 Hero": 76px tall, wordmark with an accent
 * dot, four anchors, cart button.
 *
 * No Sign in button and no avatar: REVIEW.md §1 cut both, auth happens
 * only at the checkout gate. The cart button is inert until T6 wires the
 * drawer to it; its aria-label is already the copy deck's "Your deck".
 */

const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Modules", href: "#modules" },
  { label: "Specs", href: "#specs" },
  { label: "FAQ", href: "#faq" },
];

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2 2.75h1.6l1.9 8.5h7.2l1.8-6.2H5.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="14.5" r="1.1" fill="currentColor" />
      <circle cx="12.6" cy="14.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stroke bg-[rgba(10,10,11,0.72)] backdrop-blur-[12px]">
      <Container className="flex h-19 items-center justify-between gap-6">
        <a
          href="#top"
          className="flex items-center gap-1.5 font-display text-xl font-bold tracking-[0.06em] text-heading"
        >
          MODU
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm font-medium text-body transition-colors duration-150 hover:text-heading"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <IconButton label="Your deck">
          <CartIcon />
        </IconButton>
      </Container>
    </header>
  );
}
