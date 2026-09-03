import { cn } from "@/lib/cn";

/**
 * A still of the 3D deck, for every visitor who does not get the live one:
 * phones, tablets, and anyone who asked for reduced motion.
 *
 * The files in public/posters/ are frames captured from the real R3F scene
 * at the exact story poses they stand in for (see the T10 notes in
 * ../../../STATUS.md), so the fallback is the same product from the same
 * angle rather than a separate illustration that can drift out of date.
 * The page's own #0A0A0B is baked into each file — the canvas renders with
 * an alpha buffer, and a transparent PNG here would punch a hole through
 * to whatever sits behind it.
 *
 * `width`/`height` are mandatory, not decorative: without them the image
 * has no intrinsic ratio until it loads and every poster shifts the page
 * as it arrives.
 *
 * A plain <img> rather than next/image because the export runs with
 * `images: { unoptimized: true }` — next/image would emit this same markup
 * after a detour through a component that cannot optimise anything.
 */

const WIDTH = 640;
const HEIGHT = 480;

export type PosterProps = {
  /** File stem in public/posters/, without the density suffix. */
  name: string;
  alt: string;
  className?: string;
};

export function Poster({ name, alt, className }: PosterProps) {
  return (
    // The export runs with images.unoptimized, so next/image would render
    // this same tag with nothing optimising behind it. See the note above.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/posters/${name}.webp`}
      srcSet={`/posters/${name}.webp ${WIDTH}w, /posters/${name}-2x.webp ${WIDTH * 2}w`}
      // The poster never renders wider than the column it sits in, which
      // the story caps at 46ch.
      sizes="(min-width: 640px) 600px, 100vw"
      width={WIDTH}
      height={HEIGHT}
      alt={alt}
      // Lazy even for the hero. It is 5KB and never the LCP element, and
      // laziness is what stops desktop — where these are hidden by CSS and
      // the live canvas is running instead — from fetching them at all.
      loading="lazy"
      decoding="async"
      className={cn("h-auto w-full rounded-lg", className)}
    />
  );
}
