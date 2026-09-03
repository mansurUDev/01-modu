import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { QuantityStepper } from "./quantity-stepper";

/**
 * Ported from design-system/components/commerce/ProductCard.jsx.
 *
 * Changes from the source, all of them required by how the card is
 * actually used on the catalogue grid:
 * - The hard-coded `width: 300` is gone. The grid
 *   (`repeat(4, 1fr)` per the mockup) owns the width now.
 * - Media area is 170px to match "03 Build your deck" in
 *   design-system/MODU Website Mockups.dc.html, not the source's 180.
 * - `badge` slot added: the kit cards in that same mockup carry a corner
 *   badge ("Save $19"), which the source had no way to render.
 * - `action` slot added: the mockup's card footer is an "Add" button, not
 *   a quantity stepper. With no `action` the stepper still renders, so
 *   the original contract keeps working — the stepper's real home is the
 *   cart drawer, where quantities are edited.
 * - `<img>` -> next/image with `fill`, since the card knows its media box
 *   but not the render's aspect ratio. Optimisation is off globally
 *   (next.config.ts, static export), so this is a plain <img> at runtime
 *   with the layout guarantees next/image adds.
 */

export type ProductCardProps = {
  /** Uppercase mono category eyebrow, e.g. "Module · Encoder". */
  category: string;
  name: string;
  /** One line; truncates with ellipsis. */
  description: string;
  /** Preformatted price string — build it with lib/format.ts. */
  price: string;
  /** Product render URL; omit for the abstract module placeholder. */
  image?: string;
  /** Corner badge, e.g. a "Save $19" <Badge/>. */
  badge?: ReactNode;
  /** Footer control. Defaults to a QuantityStepper when omitted. */
  action?: ReactNode;
  defaultQuantity?: number;
  onQuantityChange?: (value: number) => void;
  className?: string;
};

/** Stand-in render: an abstract anodised module, used until T10 ships
 *  real screenshots of the R3F scene. */
function ModulePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[94px] w-32 items-center justify-center gap-3 rounded-[14px] bg-[linear-gradient(180deg,#1A1A1D,#0E0E10)] shadow-[inset_0_1px_0_var(--stroke-edge),0_14px_30px_rgba(0,0,0,.6)]"
    >
      <span className="size-9 rounded-full bg-[radial-gradient(circle_at_35%_30%,#232326,#0C0C0E)] shadow-[inset_0_1px_0_var(--stroke-strong)]" />
      <span className="size-9 rounded-full bg-[radial-gradient(circle_at_35%_30%,#232326,#0C0C0E)] shadow-[inset_0_1px_0_var(--stroke-strong)]" />
      <span className="size-[5px] rounded-full bg-led shadow-[var(--glow-led)]" />
    </div>
  );
}

export function ProductCard({
  category,
  name,
  description,
  price,
  image,
  badge,
  action,
  defaultQuantity = 1,
  onQuantityChange,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border border-stroke bg-card",
        "shadow-[var(--shadow-card)] transition-shadow duration-250",
        "hover:shadow-[inset_0_1px_0_var(--stroke-edge),0_2px_8px_rgba(0,0,0,.4),0_24px_56px_rgba(0,0,0,.6)]",
        className,
      )}
    >
      <div className="relative flex h-[170px] items-center justify-center border-b border-stroke bg-[var(--vignette)]">
        {badge && <div className="absolute top-3 left-3 z-10">{badge}</div>}
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="object-contain p-6"
          />
        ) : (
          <ModulePlaceholder />
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <p className="font-mono text-mono-label uppercase text-muted">{category}</p>
        <h3 className="font-display text-[18px] leading-[1.25] font-semibold tracking-[-0.02em] text-heading">
          {name}
        </h3>
        <p className="truncate font-body text-[13px] leading-[1.55] text-body">
          {description}
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="font-mono text-mono-price text-heading">{price}</span>
          {action ?? (
            <QuantityStepper
              defaultValue={defaultQuantity}
              onChange={onQuantityChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
