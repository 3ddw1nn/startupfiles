"use client";

import { ConvexReactClient } from "convex/react";
import { requireEnv } from "./env";

export const convex = new ConvexReactClient(requireEnv("NEXT_PUBLIC_CONVEX_URL"));
