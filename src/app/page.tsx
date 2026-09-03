// Placeholder — real landing sections land in T5 (see ../../BUILD_PLAN.md).
// This exists only so T1 has a dark, working "/" route to build/serve/deploy.
export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="font-mono text-mono-label uppercase tracking-[0.12em] text-muted">
        MODU
      </p>
      <h1 className="font-display text-h1 text-heading">
        The controller you build.
      </h1>
      <p className="max-w-md text-body">
        Landing sections come in T5 — this placeholder only proves the dark
        theme, tokens and fonts are wired up.
      </p>
    </main>
  );
}
