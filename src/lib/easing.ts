/**
 * The three easings and the segment helper used by
 * design-system/animations-v3.jsx, reimplemented here (they are ~20 lines
 * and the original ships bundled with a whole playback engine we do not
 * want). The success animation is a direct port of that engine's model:
 * every value is a pure function of one authored-time variable T, so the
 * animation can be scrubbed, replayed or frozen on its last frame just by
 * choosing a T.
 */

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Overshoots slightly past 1 before settling — the box-flap "snap". */
export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * Value of a 0→1 segment that runs between `start` and `end` on the
 * authored timeline, clamped outside that window.
 */
export function segment(
  t: number,
  start: number,
  end: number,
  ease: (t: number) => number,
): number {
  if (end <= start) return t >= end ? 1 : 0;
  return ease(clamp((t - start) / (end - start)));
}
