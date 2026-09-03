import Link from "next/link";

// Required by static export (TZ.md §14): without a custom not-found.tsx,
// `next build` emits no out/404.html and Vercel falls back to its own
// (white!) 404 page. This one becomes out/404.html and is served for any
// unknown path.
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="font-mono text-mono-label uppercase tracking-[0.12em] text-muted">
        404
      </p>
      <h1 className="font-display text-h2 text-heading">
        This page snapped off.
      </h1>
      <Link
        href="/"
        className="font-display text-accent transition-colors hover:text-accent-hover"
      >
        Back to MODU
      </Link>
    </main>
  );
}
