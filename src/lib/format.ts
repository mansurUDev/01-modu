/**
 * All catalog/cart/order prices are stored in cents. This is the only
 * place that turns them into display strings — never hand-format a price
 * elsewhere. Every SKU price here is a whole number of dollars (x900 or
 * x000 cents), so there are never cents to show.
 */
export function formatPrice(cents: number): string {
  const dollars = Math.round(cents) / 100;
  return `$${dollars.toLocaleString("en-US")}`;
}
