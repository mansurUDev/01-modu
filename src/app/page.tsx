import { CartDrawer } from "@/components/cart/cart-drawer";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { ModulesGrid } from "@/components/sections/modules-grid";
import { Navbar } from "@/components/sections/navbar";
import { Reviews } from "@/components/sections/reviews";
import { Specs } from "@/components/sections/specs";
import { Story } from "@/components/sections/story";
import { Hero3D } from "@/components/three/hero-3d";

/**
 * Stays a server component — it only composes sections, so the whole page
 * is prerendered into the static export and the client bundle only pays
 * for the pieces that actually need interactivity (TZ.md Часть B §1).
 *
 * <Hero3D/> renders a fixed, full-viewport canvas behind everything (and
 * nothing at all below 1024px or under reduced-motion), which is why the
 * content sits in its own stacking context above it.
 */
export default function Home() {
  return (
    <>
      <Hero3D />
      <Navbar />

      <div className="relative z-10">
        <main>
          {/* Hero and story sit ON the canvas — it is their backdrop. */}
          <Hero />
          <Story />

          {/* From the catalogue down the page rides over the canvas on an
              opaque background, which is what DESIGN.md Часть B §1 means by
              "#modules наезжает поверх канваса". T8 additionally fades the
              canvas to a 15% ghost once the story timeline ends. */}
          <div className="relative bg-background">
            <ModulesGrid />
            <Specs />
            <Reviews />
            <Faq />
          </div>
        </main>
        <Footer />
      </div>

      <CartDrawer />
    </>
  );
}
