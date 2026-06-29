import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const authMiddleware = convexAuthNextjsMiddleware();

export async function POST(request: NextRequest) {
  const response = await authMiddleware(request, {} as NextFetchEvent);
  return (response ?? new Response("Auth route did not return a response.", { status: 500 })) as Response;
}
