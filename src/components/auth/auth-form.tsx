"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { BackgroundBlobs } from "@/components/design-system/background-blobs";
import { Logo } from "@/components/design-system/chat-sidebar";
import { cn } from "@/lib/utils";

type Mode = "signIn" | "signUp";

const COPY = {
  signIn: {
    title: "Welcome back",
    subtitle: "Sign in to pick up where you left off.",
    submit: "Sign in",
    pending: "Signing in…",
    switchText: "New to Folio?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
  signUp: {
    title: "Create your account",
    subtitle: "Keep your conversations in sync across devices.",
    submit: "Create account",
    pending: "Creating account…",
    switchText: "Already have an account?",
    switchLink: "Sign in",
    switchHref: "/login",
  },
} as const;

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-paper-200 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-faint focus:border-brand-light focus:shadow-[0_0_0_4px_rgb(129_140_248/0.15)] aria-[invalid=true]:border-red-300";

export function AuthForm({ mode }: { mode: Mode }) {
  const authActions = useAuthActions() as ReturnType<typeof useAuthActions> | undefined;
  const router = useRouter();
  const copy = COPY[mode];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSignUp = mode === "signUp";
  const passwordTooShort = isSignUp && password.length > 0 && password.length < 8;
  const mismatch = isSignUp && confirm.length > 0 && confirm !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError("");
    if (!authActions) return;
    if (isSignUp && (password.length < 8 || password !== confirm)) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", mode);
      await authActions.signIn("password", formData);
      router.push("/");
    } catch (err) {
      console.error(`${mode} error:`, err);
      setError(
        isSignUp
          ? "We couldn't create that account. The email may already be in use."
          : "That email and password don't match. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-paper-50 px-5 py-10">
      <BackgroundBlobs />

      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:bg-white/60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to chat
      </Link>

      <div className="animate-message-in relative z-10 w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-paper-200 bg-white/85 p-7 shadow-float backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h1 className="font-serif text-[28px] font-semibold tracking-tight text-ink">
              {copy.title}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">{copy.subtitle}</p>
          </div>

          {!authActions && (
            <div className="mb-5 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Accounts aren&apos;t available because{" "}
                <code className="font-mono text-xs">NEXT_PUBLIC_CONVEX_URL</code> isn&apos;t
                set. You can still chat — history is saved in this browser.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" >
            <Field id="email" label="Email">
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className={inputClass}
              />
            </Field>

            <Field
              id="password"
              label="Password"
              hint={isSignUp ? "At least 8 characters." : undefined}
              error={passwordTooShort && touched ? "Password must be at least 8 characters." : undefined}
            >
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={isSignUp ? 8 : undefined}
                  aria-invalid={passwordTooShort && touched}
                  aria-describedby={isSignUp ? "password-hint" : undefined}
                  className={cn(inputClass, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-faint transition-colors hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {isSignUp && (
              <Field
                id="confirm"
                label="Confirm password"
                error={mismatch ? "Passwords don't match." : undefined}
              >
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  aria-invalid={mismatch}
                  className={inputClass}
                />
              </Field>
            )}

            {error && (
              <div
                role="alert"
                className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !authActions}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-medium text-white shadow-paper transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? copy.pending : copy.submit}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          {copy.switchText}{" "}
          <Link
            href={copy.switchHref}
            className="font-medium text-brand underline-offset-4 transition-colors hover:text-brand-dark hover:underline"
          >
            {copy.switchLink}
          </Link>
        </p>
      </div>
    </main>
  );
}
