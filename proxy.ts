import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/pricing(.*)",
  "/business-pricing(.*)",
  "/subscriptions(.*)",
  "/privacy(.*)",
  "/terms(.*)",
]);

const isWebhookRoute = (pathname: string) =>
  pathname.startsWith("/api/clerk/webhooks") ||
  pathname.startsWith("/api/stripe/webhooks");

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  /**
   * 1. WEBHOOKS (no auth)
   */
  if (isWebhookRoute(pathname)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  /**
   * 2. REDIRECT logged-in users away from public pages
   */
  if (userId && isPublicRoute(request)) {
    if (pathname !== "/" && !pathname.startsWith("/pricing") &&
    !pathname.startsWith("/business-pricing")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  /**
   * 3. PROTECT PRIVATE ROUTES
   */
  if (!isPublicRoute(request) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};