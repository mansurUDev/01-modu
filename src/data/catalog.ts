/**
 * The catalog is the single source of truth for SKU names, copy and prices
 * — see BUILD_PLAN.md's "Зафиксированные решения" and TZ.md Часть C §4.
 * TZ.md Часть A §2 (line ~51-63) has a STALE price table from an earlier
 * draft (different ids, different $ amounts) — do not use it. Часть C §4
 * is the only source that survived REVIEW.md.
 *
 * Prices are in cents (no floating point money math). `category` matches
 * the mono eyebrow labels from design-system/MODU Website Mockups.dc.html
 * ("Module · Encoder" etc.) and lines up with the real
 * design-system/components/commerce/ProductCard.d.ts prop of the same name.
 */

export type SkuId =
  | "dial"
  | "keys"
  | "voice"
  | "fader"
  | "view"
  | "starter-kit"
  | "creator-kit"
  | "studio-kit";

export type Sku = {
  id: SkuId;
  name: string;
  /** Mono eyebrow, e.g. "Module · Encoder" — feeds ProductCard's `category`. */
  category: string;
  /** One line — feeds ProductCard's `description` (it truncates). */
  description: string;
  /** Cents. */
  price: number;
  /** Cents. Present only on kits; renders as a strikethrough next to `price`. */
  compareAtPrice?: number;
  /** Module ids bundled into a kit. Absent on standalone modules. */
  includes?: SkuId[];
  /** Small corner badge text, e.g. "Save $19". Absent on standalone modules. */
  badge?: string;
  /**
   * 1x product render in public/products/. The matching `-2x` file is
   * derived from this path by the catalogue grid, so the two always move
   * together.
   */
  image?: string;
};

export const CATALOG: readonly Sku[] = [
  {
    id: "dial",
    image: "/products/dial.webp",
    name: "MODU Dial",
    category: "Module · Encoder",
    description:
      "Three aluminum dials with crisp detents. Map them to anything.",
    price: 6900,
  },
  {
    id: "keys",
    image: "/products/keys.webp",
    name: "MODU Keys",
    category: "Module · Keys",
    description:
      "Five tactile keys. One has a tiny display that shows its job.",
    price: 7900,
  },
  {
    id: "voice",
    image: "/products/voice.webp",
    name: "MODU Voice",
    category: "Module · Recorder",
    description:
      "The handheld one. Big dial, push-to-talk, a proper red record button.",
    price: 8900,
  },
  {
    id: "fader",
    image: "/products/fader.webp",
    name: "MODU Fader",
    category: "Module · Fader",
    description:
      "One long motorized fader. It follows your app, until you take over.",
    price: 9900,
  },
  {
    id: "view",
    image: "/products/view.webp",
    name: "MODU View",
    category: "Module · Display",
    description:
      "A touchscreen strip. Volume rings, clock, and your calls at a glance.",
    price: 12900,
  },
  {
    id: "starter-kit",
    image: "/products/starter-kit.webp",
    name: "Starter Kit",
    category: "Kit · 2 modules",
    description: "Dial + Keys. The two modules everyone starts with.",
    price: 12900,
    compareAtPrice: 14800,
    includes: ["dial", "keys"],
    badge: "Save $19",
  },
  {
    id: "creator-kit",
    image: "/products/creator-kit.webp",
    name: "Creator Kit",
    category: "Kit · 4 modules",
    description: "Dial, Fader, Keys and View. A full deck for editing days.",
    price: 29900,
    compareAtPrice: 37600,
    includes: ["dial", "fader", "keys", "view"],
    badge: "Save $77",
  },
  {
    id: "studio-kit",
    image: "/products/studio-kit.webp",
    name: "Studio Kit",
    category: "Kit · 5 modules",
    description: "Every module we make, in one box. The whole desk, sorted.",
    price: 34900,
    compareAtPrice: 46500,
    includes: ["dial", "keys", "voice", "fader", "view"],
    badge: "Best value · Save $116",
  },
] as const;

export function skuById(id: SkuId): Sku {
  const sku = CATALOG.find((s) => s.id === id);
  if (!sku) {
    throw new Error(`Unknown SKU id: ${id}`);
  }
  return sku;
}
