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
]);

const isWebhookRoute = (pathname: string) =>
  pathname.startsWith("/api/webhooks/clerk") ||
  pathname.startsWith("/api/stripe/webhooks");


const isDashboardRoute = createRouteMatcher([
  "/dashboard(.*)",
]);


export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;


  // 1. Allow webhooks without auth
  if (isWebhookRoute(pathname)) {
    return NextResponse.next();
  }


  const { userId, sessionClaims } = await auth();


  // 2. Redirect logged-in users away from auth pages
  if (userId && isPublicRoute(request)) {
    if (
      pathname !== "/" &&
      !pathname.startsWith("/pricing") &&
      !pathname.startsWith("/business-pricing")
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }


  // 3. Protect private routes
  if (!isPublicRoute(request) && !userId) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }


  // 4. Subscription check for dashboard
  if (userId && isDashboardRoute(request)) {

    const isSubscribed =
      sessionClaims?.metadata?.isSubscribed === true;


    if (!isSubscribed) {
      return NextResponse.redirect(
        new URL("/pricing", request.url)
      );
    }
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