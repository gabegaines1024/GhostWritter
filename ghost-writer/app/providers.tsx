/**
 * App Providers
 *
 * Wraps the app with necessary providers (Convex, etc.)
 */

"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Initialize Convex client
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

