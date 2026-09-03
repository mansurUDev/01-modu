import type { Metadata, Viewport } from "next";
import { AppInit } from "@/components/app-init";
import { AuthModal } from "@/components/auth/auth-modal";
import { SmoothScroll } from "@/components/smooth-scroll";
import { inter, jetbrainsMono, spaceGrotesk } from "./fonts";
import "./globals.css";

// TZ.md Часть C §1 — brand copy, dословно.
export const metadata: Metadata = {
  metadataBase: new URL("https://modu.vercel.app"),
  title: "MODU — Control, module by module.",
  description:
    "MODU is a modular desk controller. Aluminum dials, faders, keys and a screen that snap together with magnets. Build the deck you need.",
};

// Single dark theme, no light variant, no user toggle — see
// ../../TZ.md §10 (anti-FOUC) and ../../REVIEW.md's hard "never white" rule.
export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <AppInit />
        <SmoothScroll />
        {children}
        {/* Lives in the layout because the gate is raised from two places:
            the cart drawer on / and the guard on /checkout. */}
        <AuthModal />
      </body>
    </html>
  );
}
