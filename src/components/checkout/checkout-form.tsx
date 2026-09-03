"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cartTotals } from "@/lib/cart-totals";
import { makeOrderId } from "@/lib/order-id";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useOrdersStore, type ShippingInfo } from "@/store/orders";
import { useUiStore } from "@/store/ui";

/**
 * One-step shipping form — fields and copy from TZ.md Часть C §8.
 *
 * One step, not two: TZ.md Часть A §6 described a second "Review" step
 * and a phone mask, both cut in REVIEW.md §3. Validation is presence-only
 * for the same reason the store is fake — inventing format rules for
 * addresses would fail real ones.
 *
 * There is no email field: it comes from the auth store, which is the
 * only place it was ever entered.
 */

const COUNTRIES = [
  "Germany",
  "France",
  "United Kingdom",
  "United States",
  "Canada",
  "Netherlands",
  "Spain",
  "Poland",
  "Japan",
  "Australia",
];

const PLACING_ORDER_MS = 800;
const REQUIRED_MESSAGE = "We need this one.";

type FieldName = "fullName" | "country" | "city" | "address" | "zip";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrdersStore((s) => s.add);
  const signIn = useAuthStore((s) => s.signIn);
  const email = useAuthStore((s) => s.email);
  const setOrderPlaced = useUiStore((s) => s.setOrderPlaced);

  const [values, setValues] = useState<Record<FieldName | "phone", string>>({
    fullName: "",
    country: "",
    city: "",
    address: "",
    zip: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [sending, setSending] = useState(false);

  const set = (field: FieldName | "phone", value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear this field's complaint as soon as it is being addressed —
    // leaving "We need this one." under a filled field reads as broken.
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field as FieldName];
      return next;
    });
  };

  const validate = () => {
    const next: Partial<Record<FieldName, string>> = {};
    for (const field of [
      "fullName",
      "country",
      "city",
      "address",
      "zip",
    ] as FieldName[]) {
      if (!values[field].trim()) next[field] = REQUIRED_MESSAGE;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // onSubmit + preventDefault: no server actions anywhere in a static
  // export (TZ.md Часть B §7).
  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending || !validate()) return;

    setSending(true);

    const shipping: ShippingInfo = {
      fullName: values.fullName.trim(),
      country: values.country,
      city: values.city.trim(),
      address: values.address.trim(),
      zip: values.zip.trim(),
      ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
    };

    setTimeout(() => {
      const id = makeOrderId();
      addOrder({
        id,
        createdAt: new Date().toISOString(),
        items,
        // Snapshot, never recomputed later: what was owed on this day at
        // these prices (TZ.md Часть A §9).
        total: cartTotals(items).total,
        shipping,
      });

      // The name typed here is better than the one derived from the email.
      if (email) signIn(email, shipping.fullName);

      // Flag first: clearCart() empties the cart, and the page guard must
      // not read that as "arrived here with nothing to buy".
      setOrderPlaced(true);
      clearCart();
      // The /success guard reads this — a direct visit with no order in
      // this session bounces home instead of showing a blank confirmation.
      sessionStorage.setItem("modu:lastOrder", id);
      router.push("/success");
    }, PLACING_ORDER_MS);
  };

  return (
    <form noValidate onSubmit={placeOrder} className="flex flex-col gap-6">
      <div className="rounded-lg border border-stroke bg-raised p-7">
        <h2 className="font-display text-[18px] leading-[1.25] font-semibold tracking-[-0.02em] text-heading">
          Shipping
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Full name"
            placeholder="Jane Doe"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            error={errors.fullName}
            className="sm:col-span-2"
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="country"
              className={`font-mono text-mono-label uppercase ${
                errors.country ? "text-error" : "text-muted"
              }`}
            >
              Country
            </label>
            <select
              id="country"
              autoComplete="country-name"
              value={values.country}
              onChange={(e) => set("country", e.target.value)}
              aria-invalid={errors.country ? true : undefined}
              className={`h-10 rounded-sm border bg-input px-3.5 font-body text-sm outline-none transition-[border-color,box-shadow] duration-150 ${
                errors.country
                  ? "border-error"
                  : "border-stroke-strong focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-tint)]"
              } ${values.country ? "text-heading" : "text-muted"}`}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <span className="font-body text-xs leading-[1.4] text-error">
                {errors.country}
              </span>
            )}
          </div>

          <Input
            label="City"
            placeholder="Berlin"
            autoComplete="address-level2"
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            error={errors.city}
          />

          <Input
            label="Address"
            placeholder="Street, house, apartment"
            autoComplete="street-address"
            value={values.address}
            onChange={(e) => set("address", e.target.value)}
            error={errors.address}
            className="sm:col-span-2"
          />

          <Input
            label="ZIP code"
            placeholder="10115"
            inputMode="numeric"
            autoComplete="postal-code"
            value={values.zip}
            onChange={(e) => set("zip", e.target.value)}
            error={errors.zip}
          />

          <Input
            label="Phone (optional)"
            placeholder="+1 555 0100"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={sending} className="w-full">
        {sending ? "Sending…" : "Place order"}
      </Button>
    </form>
  );
}
