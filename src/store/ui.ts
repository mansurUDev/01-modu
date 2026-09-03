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

  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
};

export const useUiStore = create<UiState>()((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),

  authOpen: false,
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false }),
}));
