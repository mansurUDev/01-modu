/**
 * "MODU-" + 5 base36 chars derived from Date.now() + a random offset —
 * see TZ.md Часть A §9 / REVIEW.md §1 "Хранилище". Only ever called from a
 * client-side event handler (placing an order), never at module scope or
 * during render, so the Date.now()/Math.random() use here is safe (it does
 * not run during the static-export prerender).
 */
export function makeOrderId(): string {
  const n = Date.now() + Math.floor(Math.random() * 1_000_000);
  const base36 = n.toString(36).toUpperCase();
  return `MODU-${base36.slice(-5).padStart(5, "0")}`;
}
