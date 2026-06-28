"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { convex } from "../lib/convex-client";

export function ConvexProviders({ children }: { children: React.ReactNode }) {
  return <ConvexAuthNextjsProvider client={convex}>{children}</ConvexAuthNextjsProvider>;
}
