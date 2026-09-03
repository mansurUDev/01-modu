/**
 * The one condition under which pointer-driven flourishes are allowed to
 * exist at all.
 *
 * `hover: hover` and `pointer: fine` together mean a real mouse or
 * trackpad — a touchscreen reports `hover: none`, and a tilt that only
 * fires on tap is worse than no tilt. The reduced-motion clause is not
 * optional politeness: both effects are pure motion with no informational
 * content, so under `reduce` they simply must not run.
 *
 * Used with gsap.matchMedia, which also reverts every tween it created
 * when the query stops matching — a laptop that gains a touch screen, or
 * a visitor who changes the OS setting mid-session, ends up clean.
 */
export const FINE_POINTER =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
