/**
 * Film grain and a vignette over the whole viewport — the last layer of
 * DESIGN.md Часть A's "anodised aluminium under one warm lamp" look.
 *
 * On a site this dark, large flat fields band badly on 8-bit panels; a
 * few percent of noise dithers those gradients away for far less than the
 * cost of shipping higher-precision artwork.
 *
 * The noise is one small SVG tile repeated, not a viewport-sized filter:
 * feTurbulence is expensive in proportion to the area it covers, and a
 * 160px tile is rasterised once and then just repeated by the compositor.
 *
 * It sits above the page (z-10) but below the header (z-50) and the
 * overlays (z-100) deliberately — grain drawn over an open modal would
 * fight its backdrop blur, and being under them means it can never
 * intercept a click even if `pointer-events` were ever lost.
 */

const NOISE_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Grain() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE_TILE, backgroundSize: "160px 160px" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 62% at 50% 45%, transparent 42%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </div>
  );
}
