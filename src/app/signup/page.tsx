"use client";

import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BackgroundBlobs } from "@/components/design-system/background-blobs";

export default function SignupPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signUp");

      await signIn("password", formData);
      router.push("/");
    } catch (err) {
      setError("Failed to create account. Email may already be in use.");
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-paper-50 overflow-hidden">
      <BackgroundBlobs />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-paper-200 shadow-drawer rounded-2xl p-8 transition-all duration-300 hover:shadow-float">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-ink mb-2">Join us!</h1>
            <p className="text-ink-faint">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-paper-50 border border-paper-200 rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-paper-50 border border-paper-200 rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-ink mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-paper-50 border border-paper-200 rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand text-white py-3 rounded-lg font-medium shadow-sm hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ink-faint text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-brand hover:text-brand-dark font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
