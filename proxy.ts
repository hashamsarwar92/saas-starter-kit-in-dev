import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/terms(.*)",
  "/privacy(.*)",
  "/pricing(.*)",
]);

const isNonAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
]);

const isSubscribedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

const isWebhookRoute = (pathname: string) =>
  pathname.startsWith("/api/webhooks");


export default clerkMiddleware(async (auth, request) => {

  // 1. Get the pathname from the request URL
  const url = new URL(request.url);
  const pathname = url.pathname;


  // 2. Allow webhooks without auth
  if (isWebhookRoute(pathname)) return NextResponse.next();

  // 3. Allow non-auth routes without auth
  if (isPublicRoute(request)) return NextResponse.next();

  // 4. Get user and session claims
  const { userId, sessionClaims } = await auth();

  if (!userId && isNonAuthRoute(request)) return NextResponse.next();

  if (userId && isNonAuthRoute(request)) return NextResponse.redirect(
    new URL("/dashboard", request.url)
  );

  if (!userId && isSubscribedRoute(request)) return NextResponse.redirect(
    new URL("/sign-in", request.url)
  );

  if (userId && !sessionClaims?.isSubscribed && isSubscribedRoute(request)) return NextResponse.redirect(
    new URL("/pricing", request.url)
  );

  return NextResponse.next();
});


export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};