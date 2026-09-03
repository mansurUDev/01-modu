"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { SkuId } from "@/data/catalog";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";

/**
 * The catalogue's Add button. Three labels, straight from TZ.md Часть C
 * §8: "Add to cart" normally, "Added" for 1.5s after a click, and
 * "In cart · +1" once the SKU is already in the cart.
 *
 * Adding also opens the drawer (REVIEW.md §1 chose this over the "ghost
 * flies into the cart" animation, which was cut) — so the feedback is
 * the drawer sliding in, and the label is just confirmation.
 */
const ADDED_MS = 1500;

export function AddToCartButton({ skuId }: { skuId: SkuId }) {
  const add = useCartStore((s) => s.add);
  const inCart = useCartStore((s) =>
    s.items.some((item) => item.skuId === skuId),
  );
  const openCart = useUiStore((s) => s.openCart);

  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const label = justAdded ? "Added" : inCart ? "In cart · +1" : "Add to cart";

  return (
    <Button
      size="sm"
      onClick={() => {
        add(skuId);
        openCart();
        setJustAdded(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setJustAdded(false), ADDED_MS);
      }}
    >
      {label}
    </Button>
  );
}
