import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata = {
  title: "Checkout — MODU",
};

// Thin server wrapper: the page itself is prerendered, and only the
// interactive view below it ships as a client component.
export default function CheckoutPage() {
  return <CheckoutView />;
}
