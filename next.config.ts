import type { NextConfig } from "next";

// Static export: no Node.js server anywhere (Upwork demo, zero backend).
// See ../TZ.md Часть B §6-17 (Vercel/static-export checklist) for why each
// option below is mandatory, not optional.
const nextConfig: NextConfig = {
  output: "export",
  // "/checkout" -> "checkout/index.html" instead of "checkout.html", so any
  // static host (Vercel included) serves direct URLs and hard reloads
  // correctly. See TZ.md §15.
  trailingSlash: true,
  // next/image's default optimizer needs a server; static export has none.
  // See TZ.md §6 — we ship pre-sized webp/avif ourselves instead.
  images: { unoptimized: true },
};

export default nextConfig;
