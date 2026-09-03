"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { cartTotals } from "@/lib/cart-totals";
import { formatPrice } from "@/lib/format";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { CartLine } from "./cart-line";

/**
 * Cart drawer — mockup "04 Cart drawer", copy from TZ.md Часть C §8.
 *
 * Checkout raises the auth gate rather than navigating when nobody is
 * signed in (TZ.md Часть A §10, rows 5–6). T7 renders the modal that
 * `openAuth` opens; until then the flag simply flips and nothing shows,
 * which is the seam and not an oversight.
 *
 * Subtotal / Kit discount / Total: TZ.md Часть C §8 names the first two,
 * the mockup's footer shows the last. All three are rendered because
 * that is the only version where the arithmetic visibly holds — see
 * lib/cart-totals.ts for why kits price out the way they do.
 */
export function CartDrawer() {
  const router = useRouter();
  const open = useUiStore((s) => s.cartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const openAuth = useUiStore((s) => s.openAuth);
  const items = useCartStore((s) => s.items);
  const isAuthed = useAuthStore((s) => s.isAuthed);

  const { subtotal, kitDiscount, total, count } = cartTotals(items);
  const empty = items.length === 0;

  const browseModules = () => {
    closeCart();
    document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" });
  };

  const checkout = () => {
    if (isAuthed) {
      closeCart();
      router.push("/checkout");
      return;
    }
    openAuth();
  };

  return (
    <Drawer
      open={open}
      onClose={closeCart}
      eyebrow={count > 0 ? `Cart · ${count}` : undefined}
      title="Your deck"
      footer={
        empty ? undefined : (
          <div className="flex flex-col gap-3">
            <dl className="flex flex-col gap-2">
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

              <div className="flex items-center justify-between border-t border-stroke pt-2">
                <dt className="font-display text-sm font-semibold text-heading">
                  Total
                </dt>
                <dd className="font-mono text-mono-price text-heading">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <p className="font-body text-xs leading-[1.5] text-muted">
              Free shipping over $99. Which is a low bar here.
            </p>

            <Button size="lg" className="w-full" onClick={checkout}>
              Checkout
            </Button>
          </div>
        )
      }
    >
      {empty ? (
        <div className="flex flex-col items-start gap-3 py-6">
          <p className="font-display text-base font-semibold text-heading">
            Your deck is empty.
          </p>
          <p className="font-body text-sm text-body">
            Add a module or two. They like company.
          </p>
          <Button variant="secondary" className="mt-2" onClick={browseModules}>
            Browse modules
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => (
            <CartLine key={item.skuId} skuId={item.skuId} qty={item.qty} />
          ))}
        </ul>
      )}
    </Drawer>
  );
}
