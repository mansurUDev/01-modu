import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SkuId } from "@/data/catalog";

/** Max qty per row — TZ.md §4 "Cart Drawer" / §11 edge-case checklist. */
const MAX_QTY_PER_ITEM = 5;

export type CartItem = { skuId: SkuId; qty: number };

type CartState = {
  items: CartItem[];
  /** Adds one unit; increments qty (capped at 5) if the SKU is already in the cart. */
  add: (skuId: SkuId) => void;
  remove: (skuId: SkuId) => void;
  /** qty <= 0 removes the row instead of leaving a zero-qty line (TZ.md §4 "qty → 0"). */
  setQty: (skuId: SkuId, qty: number) => void;
  clear: () => void;
};

// Prices/names are intentionally NOT stored here — every consumer resolves
// them from src/data/catalog.ts by skuId, so a catalog price change can
// never desync from what's sitting in someone's cart. See TZ.md §9.
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (skuId) =>
        set((s) => {
          const hit = s.items.find((i) => i.skuId === skuId);
          if (hit) {
            if (hit.qty >= MAX_QTY_PER_ITEM) return s;
            return {
              items: s.items.map((i) =>
                i.skuId === skuId ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return { items: [...s.items, { skuId, qty: 1 }] };
        }),
      remove: (skuId) =>
        set((s) => ({ items: s.items.filter((i) => i.skuId !== skuId) })),
      setQty: (skuId, qty) =>
        set((s) => {
          if (qty <= 0) {
            return { items: s.items.filter((i) => i.skuId !== skuId) };
          }
          const clamped = Math.min(qty, MAX_QTY_PER_ITEM);
          return {
            items: s.items.map((i) =>
              i.skuId === skuId ? { ...i, qty: clamped } : i,
            ),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "modu-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Skips the automatic rehydrate-on-create; AppInit triggers it once,
      // after mount, so the first client render matches the SSG HTML
      // (empty cart) and never mismatches. See TZ.md §8 and src/hooks/use-mounted.ts.
      skipHydration: true,
    },
  ),
);
