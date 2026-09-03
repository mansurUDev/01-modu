"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * Smooth scrolling, and the two things that depend on it.
 *
 * The Lenis/ScrollTrigger wiring is the snippet from DESIGN.md Часть B §0
 * verbatim: without handing Lenis' scroll events to ScrollTrigger and
 * driving Lenis from GSAP's own ticker, the pinned story judders — the
 * two run their own RAF loops and disagree about where the page is.
 *
 * Anchor links go through `lenis.scrollTo` rather than the browser's
 * native jump. Once the story is pinned, ScrollTrigger has inserted a
 * pin-spacer worth eight viewports, so an element's document position is
 * nothing like where it appears; native anchor scrolling lands in the
 * wrong place, while Lenis measures at click time and gets it right.
 *
 * Nothing here runs under `prefers-reduced-motion` — that branch keeps
 * native scrolling, per DESIGN.md Часть B §6.
 */

let lenis: Lenis | null = null;

/** Lets overlays freeze the page (hooks/use-overlay.ts) without importing Lenis. */
export function getLenis(): Lenis | null {
  return lenis;
}

// No manual offset: Lenis already honours each section's `scroll-mt`,
// which is what clears the sticky header. Adding the header height on top
// of that overshoots by exactly one header.

export function useLenis(): void {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis = instance;

    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      instance.scrollTo(target as HTMLElement);
      history.replaceState(null, "", href);
    };
    document.addEventListener("click", onAnchorClick);

    // Arriving from /checkout with a hash: the layout is only final once
    // fonts have settled and ScrollTrigger has measured the pin, so jump
    // after both rather than on mount.
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        const target = document.querySelector(hash);
        if (target) {
          instance.scrollTo(target as HTMLElement, { immediate: true });
        }
      });
    }

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);
}
