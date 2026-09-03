"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container } from "@/components/sections/section-shell";
import { useMounted } from "@/hooks/use-mounted";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";

/**
 * /checkout, with the two guards from TZ.md Часть A §7.
 *
 * Both run in an effect, not during render: the persisted stores are
 * empty on the first client pass by design (skipHydration), so deciding
 * anything before `mounted` would bounce every visitor straight back out.
 * Until the guards have had their say the page shows a dark skeleton
 * rather than content — the doc is explicit that flashing real content
 * and then redirecting is the thing to avoid.
 */
export function CheckoutView() {
  const router = useRouter();
  const mounted = useMounted();
  const itemCount = useCartStore((s) => s.items.length);
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const authOpen = useUiStore((s) => s.authOpen);
  const openAuth = useUiStore((s) => s.openAuth);
  const orderPlaced = useUiStore((s) => s.orderPlaced);
  const setOrderPlaced = useUiStore((s) => s.setOrderPlaced);

  const emptyCart = mounted && itemCount === 0 && !orderPlaced;
  const needsAuth = mounted && !isAuthed;

  useEffect(() => {
    if (!mounted) return;
    if (emptyCart) {
      router.replace("/#modules");
      return;
    }
    if (needsAuth) openAuth();
  }, [mounted, emptyCart, needsAuth, openAuth, router]);

  // Reset on the way out, so a later visit guards normally again.
  useEffect(() => () => setOrderPlaced(false), [setOrderPlaced]);

  // Dismissing the gate here means "I did not mean to come to checkout".
  useEffect(() => {
    if (mounted && !isAuthed && !authOpen) router.replace("/");
  }, [mounted, isAuthed, authOpen, router]);

  if (!mounted || emptyCart || needsAuth || orderPlaced) {
    return <CheckoutSkeleton />;
  }

  return (
    <Container className="py-28">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-h2 tracking-[-0.02em] text-heading">
          Almost there.
        </h1>
        <p className="font-body text-base text-body">
          Tell us where the deck should go.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        <CheckoutForm />
        <OrderSummary />
      </div>
    </Container>
  );
}

function CheckoutSkeleton() {
  return (
    <Container className="py-28" aria-hidden="true">
      <div className="h-9 w-64 rounded-md bg-raised" />
      <div className="mt-4 h-5 w-80 rounded-md bg-raised/70" />
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        <div className="h-[420px] rounded-lg border border-stroke bg-raised/60" />
        <div className="h-[320px] rounded-lg border border-stroke bg-card/60" />
      </div>
    </Container>
  );
}
