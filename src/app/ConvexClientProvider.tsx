"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Only create a client when Convex is configured. Without it the chat still
// works (history lives in localStorage); auth pages show a setup notice.
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

if (!convex && process.env.NODE_ENV !== "production") {
  console.warn(
    "NEXT_PUBLIC_CONVEX_URL is not set — running without Convex. Sign in/up are disabled."
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) return <>{children}</>;
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
