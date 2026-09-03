import { create } from "zustand";

/**
 * Ephemeral UI state — which overlay is open. Deliberately NOT persisted:
 * a drawer that reopens itself on reload would feel broken, and it is not
 * information worth keeping.
 *
 * The auth flags are here rather than in T7 because the cart's Checkout
 * button already needs to raise the gate; T7 only has to render a modal
 * bound to them.
 */
type UiState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  /** Set while an order is being placed: clearing the cart would
   *  otherwise trip /checkout's empty-cart guard and bounce the user
   *  home mid-navigation. */
  orderPlaced: boolean;
  setOrderPlaced: (value: boolean) => void;

  authOpen: boolean;
  /** Where to go once the gate is passed; null means "just close". */
  authRedirect: string | null;
  openAuth: (redirectTo?: string) => void;
  closeAuth: () => void;
};

export const useUiStore = create<UiState>()((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),

  orderPlaced: false,
  setOrderPlaced: (value) => set({ orderPlaced: value }),

  authOpen: false,
  authRedirect: null,
  openAuth: (redirectTo) =>
    set({ authOpen: true, authRedirect: redirectTo ?? null }),
  closeAuth: () => set({ authOpen: false, authRedirect: null }),
}));
