import {
  convexAuthNextjsMiddleware,
  nextjsMiddlewareRedirect
} from "@convex-dev/auth/nextjs/server";

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtectedRoute && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
