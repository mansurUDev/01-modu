import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { TiltField } from "@/components/interactions/tilt-field";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import { CATALOG } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { Container, Eyebrow, Section } from "./section-shell";

/**
 * The catalogue — mockup "03 Build your deck": a four-column grid of all
 * eight SKUs, kits included. The slot-based configurator DESIGN.md §7.4
 * describes was cut in REVIEW.md §3; this grid plus Add to cart covers
 * the same job.
 *
 * Nothing here hard-codes a price or a product name: everything comes
 * from data/catalog.ts through formatPrice, so the catalogue stays the
 * single source of truth.
 */
export function ModulesGrid() {
  return (
    <Section id="modules">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Eyebrow index="02" label="Build" />
          <h2 className="font-display text-h2 tracking-[-0.02em] text-heading">
            Build your deck.
          </h2>
          <p className="max-w-[46ch] font-body text-base leading-[1.6] text-body">
            Start with one module. Add more when you need them.
          </p>
        </div>

        {/* The only client code in this section: it installs the pointer
            tilt on the cards below and leaves the grid itself on the
            server. */}
        <TiltField>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATALOG.map((sku) => (
              <div key={sku.id} data-tilt>
                <ProductCard
                  category={sku.category}
                  name={sku.name}
                  description={sku.description}
                  price={formatPrice(sku.price)}
                  image={sku.image}
                  badge={
                    sku.badge ? (
                      <Badge variant="accent">{sku.badge}</Badge>
                    ) : undefined
                  }
                  action={<AddToCartButton skuId={sku.id} />}
                />
              </div>
            ))}
          </div>
        </TiltField>
      </Container>
    </Section>
  );
}
