"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useCartStore } from "@/store/cart";

/**
 * The count bubble on the header's cart button.
 *
 * This is the exact shape TZ.md Часть B §8 prescribes, and the reason is
 * worth keeping in mind: the static export's HTML is built with an empty
 * cart, so rendering a real count on the first client pass would be a
 * hydration mismatch — the "flashing badge" bug the doc names. Rendering
 * nothing until `mounted` makes the first client paint identical to the
 * prerendered HTML; the number appears one tick later, after AppInit has
 * rehydrated the store.
 */
export function CartBadge() {
  const mounted = useMounted();
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));

  if (!mounted || count === 0) return null;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-1 -right-1 flex size-[18px] items-center justify-center rounded-full bg-accent font-mono text-[10px] leading-none font-medium text-on-accent"
    >
      {count}
    </span>
  );
}
