"use client";

import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { skuById, type SkuId } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";

/** Max per row — TZ.md Часть A §4; the stepper enforces it too. */
const MAX_QTY = 5;

/**
 * One row of the cart drawer, per mockup "04 Cart drawer": a 64px thumb,
 * the name and unit price, a stepper and Remove.
 *
 * Nothing about the product is stored in the cart — the row resolves it
 * from the catalogue by id, so a price change can never leave a stale
 * number sitting in someone's localStorage.
 */
export function CartLine({ skuId, qty }: { skuId: SkuId; qty: number }) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const sku = skuById(skuId);

  const includes = sku.includes
    ?.map((id) => skuById(id).name.replace("MODU ", ""))
    .join(", ");

  return (
    <li className="flex gap-4 border-b border-stroke py-5 first:pt-0">
      <div
        aria-hidden="true"
        className="flex size-16 shrink-0 items-center justify-center rounded-md border border-stroke bg-[var(--vignette)]"
      >
        <span className="size-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,#232326,#0C0C0E)] shadow-[inset_0_1px_0_var(--stroke-strong)]" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-display text-sm font-semibold text-heading">
              {sku.name}
            </p>
            {includes && (
              <p className="font-mono text-mono-label uppercase text-muted">
                Includes: {includes}
              </p>
            )}
          </div>
          <span className="shrink-0 font-mono text-mono-price text-heading">
            {formatPrice(sku.price)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            value={qty}
            min={1}
            max={MAX_QTY}
            onChange={(next) => setQty(skuId, next)}
          />
          <button
            type="button"
            onClick={() => remove(skuId)}
            className="cursor-pointer font-body text-[13px] text-muted transition-colors duration-150 hover:text-heading focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
