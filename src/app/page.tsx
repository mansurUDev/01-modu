import { Hero3D } from "@/components/three/hero-3d";

// Placeholder — real landing sections land in T5 (see ../../BUILD_PLAN.md).
// T3 wires the live deck in behind it so the scene can be reviewed on its own.
export default function Home() {
  return (
    <>
      <Hero3D />
      <main className="relative z-10 flex min-h-svh flex-col items-center justify-end gap-4 px-6 pb-16 text-center">
        <p className="font-mono text-mono-label uppercase tracking-[0.12em] text-muted">
          MODU
        </p>
        <h1 className="font-display text-h1 text-heading">
          The controller you build.
        </h1>
        <p className="max-w-md text-body">
          Landing sections come in T5. The deck above is the live R3F scene
          from T3.
        </p>
      </main>
    </>
  );
}
