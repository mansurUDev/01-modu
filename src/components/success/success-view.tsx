"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { Container } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useAuthStore } from "@/store/auth";
import { useOrdersStore } from "@/store/orders";
import { SuccessAnimation } from "./success-animation";

/**
 * /success. Copy from TZ.md Часть C §8 — the heading is "Order sent."
 * with a full stop, not the "Order sent!" that TZ.md Часть A §7 still
 * carries.
 *
 * Guarded by `sessionStorage['modu:lastOrder']`, written by the checkout
 * form: this page is a confirmation of something that just happened in
 * this session, so a cold visit to the URL belongs back on the landing
 * page rather than on an empty receipt. Session storage, not local, so
 * the receipt does not resurrect in a new tab.
 *
 * The id is read through useSyncExternalStore rather than an effect that
 * calls setState — same reason as hooks/use-mounted.ts: it returns null
 * for the server snapshot, the real value on the client, and needs no
 * extra render to get there.
 */

const LAST_ORDER_KEY = "modu:lastOrder";
/** The value is written once, before this page ever mounts, so there is
 *  nothing to subscribe to. */
const subscribeToNothing = () => () => {};

function readLastOrderId(): string | null {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    // Storage unavailable (private mode) — treat it as "no order".
    return null;
  }
}

const noOrderOnServer = () => null;

export function SuccessView() {
  const router = useRouter();
  const mounted = useMounted();
  const orders = useOrdersStore((s) => s.orders);
  const name = useAuthStore((s) => s.name);
  const orderId = useSyncExternalStore(
    subscribeToNothing,
    readLastOrderId,
    noOrderOnServer,
  );

  useEffect(() => {
    if (mounted && !orderId) router.replace("/");
  }, [mounted, orderId, router]);

  if (!mounted || !orderId) {
    return (
      <Container className="flex min-h-svh items-center py-28" aria-hidden="true">
        <div className="mx-auto h-64 w-full max-w-md rounded-lg bg-raised/50" />
      </Container>
    );
  }

  const order = orders.find((o) => o.id === orderId);

  return (
    <Container className="flex min-h-svh flex-col items-center justify-center gap-8 py-28 text-center">
      <SuccessAnimation />

      <div className="flex flex-col items-center gap-4">
        <h1 className="font-display text-h2 tracking-[-0.02em] text-heading">
          Order sent.
        </h1>

        <p className="max-w-[44ch] font-body text-base leading-[1.6] text-body">
          Thanks, {name ?? "friend"}. Your modules are officially on their
          imaginary way.
        </p>

        <p className="font-mono text-mono-label uppercase text-muted">
          {order ? `Order ${order.id}` : orderId}
        </p>

        <p className="max-w-[44ch] font-body text-[13px] leading-[1.6] text-muted">
          This was a demo. But your taste in controllers is real.
        </p>
      </div>

      <ButtonLink href="/" size="lg" variant="secondary">
        Back to the top
      </ButtonLink>
    </Container>
  );
}
