/**
 * Joins class names, dropping falsy ones. Deliberately not `clsx` +
 * `tailwind-merge`: the components below put the caller's `className`
 * last, and callers only ever add layout classes (w-full, mt-6) that do
 * not collide with the component's own. If a real conflict ever shows up,
 * that is the moment to reach for tailwind-merge — not before.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
