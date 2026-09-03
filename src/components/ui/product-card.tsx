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
 * - The render is a plain <img> with a hand-written srcset. Optimisation
 *   is off globally (next.config.ts, static export), so next/image would
 *   emit this same tag and drop the srcset on the way — and these files
 *   are shot at the media box's own 5:3, so `object-cover` fills it with
 *   no letterboxing and no guessing at aspect ratios.
 */

export type ProductCardProps = {
  /** Uppercase mono category eyebrow, e.g. "Module · Encoder". */
  category: string;
  name: string;
  /** One line; truncates with ellipsis. */
  description: string;
  /** Preformatted price string — build it with lib/format.ts. */
  price: string;
  /**
   * 1x product render URL; omit for the abstract module placeholder. The
   * 2x file is expected beside it under the same name with a `-2x` suffix
   * — one convention rather than a second prop to keep in step.
   */
  image?: string;
  /** Corner badge, e.g. a "Save $19" <Badge/>. */
  badge?: ReactNode;
  /** Footer control. Defaults to a QuantityStepper when omitted. */
  action?: ReactNode;
  defaultQuantity?: number;
  onQuantityChange?: (value: number) => void;
  className?: string;
};

/** Stand-in for a SKU with no render yet: an abstract anodised module.
 *  Every catalogue entry ships one now, so this is the contract's
 *  fallback rather than something the site renders. */
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            srcSet={`${image} 600w, ${image.replace(/\.webp$/, "-2x.webp")} 1200w`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            alt={name}
            width={600}
            height={360}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
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
