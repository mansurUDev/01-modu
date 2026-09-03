import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Shared layout for the landing sections: the 1200px column and side
 * gutters from DESIGN.md Часть A §3, and the mono eyebrow that sits above
 * every section heading — its leading number is the one place besides
 * CTAs where the accent colour is allowed (the 90/8/2 rule).
 */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] px-6 md:px-8 xl:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <p className="font-mono text-mono-label uppercase text-muted">
      <span className="text-accent">{index}</span> — {label}
    </p>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-20 md:py-32", className)}
    >
      {children}
    </section>
  );
}
