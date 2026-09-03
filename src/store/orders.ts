import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SkuId } from "@/data/catalog";

export type OrderItem = { skuId: SkuId; qty: number };

/**
 * The 1-step checkout form's fields (BUILD_PLAN.md T7) — no email (comes
 * from the auth store) and no notes/2nd step (both cut, see REVIEW.md §3).
 */
export type ShippingInfo = {
  fullName: string;
  country: string;
  city: string;
  address: string;
  zip: string;
  phone?: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO timestamp
  items: OrderItem[];
  /** Cents — a snapshot of the total at purchase time, never recomputed. */
  total: number;
  shipping: ShippingInfo;
};

type OrdersState = {
  orders: Order[];
  /** Prepends — TZ.md §9 "новые в начало". Caller builds the full Order
   * (id via lib/order-id.ts, createdAt via `new Date().toISOString()`) —
   * this store just persists it. */
  add: (order: Order) => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      add: (order) => set((s) => ({ orders: [order, ...s.orders] })),
    }),
    {
      name: "modu-orders",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
