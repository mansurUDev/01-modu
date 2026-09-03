"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";

/**
 * Rehydrates the three persisted stores exactly once, after mount — see
 * TZ.md §8 and REVIEW.md §1 "Хранилище". Each store is created with
 * `skipHydration: true`, so without this component they would stay at
 * their empty default state forever; with it, real localStorage data
 * appears one render after the SSG-matching first paint.
 *
 * try/catch guards the "private mode / storage unavailable" edge case
 * (TZ.md §8) — if the underlying storage throws, the app simply keeps
 * running with in-memory defaults instead of crashing.
 */
export function AppInit() {
  useEffect(() => {
    for (const rehydrate of [
      () => useCartStore.persist.rehydrate(),
      () => useAuthStore.persist.rehydrate(),
      () => useOrdersStore.persist.rehydrate(),
    ]) {
      try {
        rehydrate();
      } catch {
        // Storage unavailable (private mode, disabled, quota) — stores
        // stay at their default in-memory state. Nothing to recover here.
      }
    }
  }, []);

  return null;
}
