"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";

/**
 * The fake sign-in gate — mockup "05 Auth modal", copy from TZ.md Часть C
 * §8. Any front-end-valid email and password are accepted; there is no
 * server to check them against, and the disclaimer says so plainly
 * because on a portfolio piece the honesty reads better than the pretence.
 *
 * Both tabs carry the same two fields. TZ.md Часть A §5 gave Sign up a
 * Name field, REVIEW.md §1 removed it — the name is derived from the
 * email and later overwritten by the checkout form's Full name.
 *
 * The password never leaves this component: it is validated, then
 * dropped. store/auth.ts has no field for it.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FAKE_REQUEST_MS = 600;
const MIN_PASSWORD = 6;

type Tab = "signIn" | "signUp";

export function AuthModal() {
  const router = useRouter();
  const open = useUiStore((s) => s.authOpen);
  const redirectTo = useUiStore((s) => s.authRedirect);
  const closeAuth = useUiStore((s) => s.closeAuth);
  const signIn = useAuthStore((s) => s.signIn);

  const [tab, setTab] = useState<Tab>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [sending, setSending] = useState(false);

  /** Drops a field's error the moment the user starts fixing it. */
  const clearError = (field: "email" | "password") =>
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "We need this one.";
    else if (!EMAIL_RE.test(email)) next.email = "That does not look like an email.";

    if (!password) next.password = "We need this one.";
    else if (password.length < MIN_PASSWORD)
      next.password = `At least ${MIN_PASSWORD} characters`;

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // onSubmit + preventDefault only — a static export has no server to
  // post to, and server actions are unavailable by design (TZ.md §7).
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending || !validate()) return;

    setSending(true);
    setTimeout(() => {
      signIn(email.trim());
      setSending(false);
      setEmail("");
      setPassword("");
      setErrors({});
      closeAuth();
      if (redirectTo) router.push(redirectTo);
    }, FAKE_REQUEST_MS);
  };

  const submitLabel = tab === "signIn" ? "Sign in" : "Create account";

  return (
    <Modal
      open={open}
      onClose={closeAuth}
      title="One quick step."
    >
      {/* noValidate: type="email" would otherwise let the browser block
          submission for a malformed address, so our own messages never
          run and the user gets an off-brand native bubble instead. */}
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
        <p className="text-body">Sign in to place your order.</p>

        <div
          role="tablist"
          aria-label="Sign in or sign up"
          className="flex gap-6 border-b border-stroke"
        >
          {(
            [
              ["signIn", "Sign in"],
              ["signUp", "Sign up"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                "cursor-pointer border-b-2 pb-3 font-display text-sm font-semibold transition-colors duration-150",
                "focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                tab === value
                  ? "border-accent text-heading"
                  : "border-transparent text-muted hover:text-body",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
          }}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          autoComplete={tab === "signIn" ? "current-password" : "new-password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
          }}
          error={errors.password}
        />

        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "…" : submitLabel}
        </Button>

        <button
          type="button"
          onClick={() => setTab(tab === "signIn" ? "signUp" : "signIn")}
          className="cursor-pointer self-center font-body text-[13px] text-muted transition-colors duration-150 hover:text-heading focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          {tab === "signIn" ? "New here? Sign up" : "Have an account? Sign in"}
        </button>

        <p className="border-t border-stroke pt-4 font-body text-xs leading-[1.5] text-muted">
          Demo mode: any email and any password will work. Everything stays in
          your browser. We could not see it even if we wanted to.
        </p>
      </form>
    </Modal>
  );
}
