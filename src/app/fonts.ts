import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

// Self-hosted at build time by next/font — zero runtime requests to
// fonts.googleapis.com, zero FOUC. Exactly 6 weights total, per
// ../../REVIEW.md §3/§4 (do NOT add more — REVIEW.md explicitly cut the
// weight list to keep the shared JS/font budget small).
//
// tokens/fonts.css in design-system/ pulls the same families from Google's
// CDN at runtime — that file is intentionally NOT imported anywhere in this
// project; these definitions replace it.

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
