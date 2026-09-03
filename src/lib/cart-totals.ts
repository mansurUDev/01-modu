import type { CartItem } from "@/store/cart";
import { skuById } from "@/data/catalog";

/**
 * Cart arithmetic, kept out of the components so the numbers can be
 * reasoned about (and corrected) in one place.
 *
 * Kits carry both `price` and `compareAtPrice` — what they cost and what
 * the same modules would cost bought separately. The drawer therefore
 * shows the separate-parts figure as the subtotal, the saving as a
 * discount line, and the real amount as the total, so Subtotal − Kit
 * discount = Total actually holds. Modules have no compareAtPrice and
 * simply contribute their price to both ends.
 */
export type CartTotals = {
  /** What the contents would cost with every kit unbundled. Cents. */
  subtotal: number;
  /** Everything the kits save, as a positive number. Cents. */
  kitDiscount: number;
  /** What is actually owed: subtotal − kitDiscount. Cents. */
  total: number;
  /** Sum of quantities, for the header badge. */
  count: number;
};

export function cartTotals(items: CartItem[]): CartTotals {
  let subtotal = 0;
  let kitDiscount = 0;
  let count = 0;

  for (const item of items) {
    const sku = skuById(item.skuId);
    const listPrice = sku.compareAtPrice ?? sku.price;

    subtotal += listPrice * item.qty;
    kitDiscount += (listPrice - sku.price) * item.qty;
    count += item.qty;
  }

  return { subtotal, kitDiscount, total: subtotal - kitDiscount, count };
}
