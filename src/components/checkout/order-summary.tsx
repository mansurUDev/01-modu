"use client";

import { skuById } from "@/data/catalog";
import { cartTotals } from "@/lib/cart-totals";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";

/**
 * The sticky order summary beside the shipping form — mockup "06
 * Checkout", the `1fr 400px` right-hand column. Same numbers and the same
 * lib/cart-totals.ts as the cart drawer, so the two can never disagree.
 */
export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const { subtotal, kitDiscount, total } = cartTotals(items);

  return (
    <aside className="h-fit rounded-lg border border-stroke bg-card p-7 lg:sticky lg:top-28">
      <h2 className="font-display text-[18px] leading-[1.25] font-semibold tracking-[-0.02em] text-heading">
        Order summary
      </h2>

      <ul className="mt-5 flex flex-col gap-4">
        {items.map((item) => {
          const sku = skuById(item.skuId);
          return (
            <li key={item.skuId} className="flex items-baseline justify-between gap-4">
              <span className="font-body text-sm text-body">
                {sku.name}
                <span className="text-muted"> × {item.qty}</span>
              </span>
              <span className="shrink-0 font-mono text-mono-price text-heading">
                {formatPrice(sku.price * item.qty)}
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 flex flex-col gap-2 border-t border-stroke pt-5">
        <div className="flex items-center justify-between">
          <dt className="font-body text-sm text-body">Subtotal</dt>
          <dd className="font-mono text-mono-price text-heading">
            {formatPrice(subtotal)}
          </dd>
        </div>

        {kitDiscount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="font-body text-sm text-body">Kit discount</dt>
            <dd className="font-mono text-mono-price text-accent">
              −{formatPrice(kitDiscount)}
            </dd>
          </div>
        )}

        <div className="mt-1 flex items-center justify-between border-t border-stroke pt-3">
          <dt className="font-display text-base font-semibold text-heading">
            Total
          </dt>
          <dd className="font-mono text-[17px] font-medium text-heading">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 border-t border-stroke pt-5 font-body text-xs leading-[1.5] text-muted">
        Payment — demo checkout. No card needed. No money exists here.
      </p>
    </aside>
  );
}
