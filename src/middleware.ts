import { NextRequest, NextResponse } from "next/server";

/**
 * Parse the request Cookie header safely.
 */
function parseCookies(cookieHeader: string | null): Map<string, string> {
  const cookieMap = new Map<string, string>();

  if (!cookieHeader) {
    return cookieMap;
  }

  cookieHeader.split(";").forEach((cookie) => {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const name = cookie.substring(0, separatorIndex).trim();
    const value = cookie.substring(separatorIndex + 1).trim();

    try {
      cookieMap.set(name, decodeURIComponent(value));
    } catch {
      cookieMap.set(name, value);
    }
  });

  return cookieMap;
}

/**
 * Public routes that do not require authentication.
 */
const publicRoutes = [
  "/",
  "/auth",
  "/auth/login",
  "/about",
  "/best-sellers",
  "/collections",
  "/contact",
  "/faqs",
  "/guide",
  "/privacy",
  "/shipping-returns",
  "/shop",
  "/terms",
];

/**
 * Check whether the current path is public.
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---------------------------------------------------------------------------
  // Skip Next.js internals and static files
  // ---------------------------------------------------------------------------

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ---------------------------------------------------------------------------
  // Public routes
  // ---------------------------------------------------------------------------

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // ---------------------------------------------------------------------------
  // Read authentication cookies
  // ---------------------------------------------------------------------------

  const cookieHeader = request.headers.get("cookie");
  const cookieMap = parseCookies(cookieHeader);

  const isAuthenticated =
    cookieMap.get("is_authenticated") === "true";

  const hasAccessToken =
    !!cookieMap.get("access_token");

  const isValidAuth =
    isAuthenticated && hasAccessToken;

  // ---------------------------------------------------------------------------
  // If user is not authenticated, redirect to login
  // ---------------------------------------------------------------------------

  if (!isValidAuth) {
    const loginUrl = new URL("/auth/login", request.url);

    // Preserve the page the user originally wanted.
    if (pathname !== "/auth/login") {
      loginUrl.searchParams.set("returnUrl", pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  // ---------------------------------------------------------------------------
  // User is authenticated
  //
  // For now we do NOT call the old external API or permission API.
  //
  // Later, when NestJS backend is ready, permission checking can be added here.
  // ---------------------------------------------------------------------------

  return NextResponse.next();
}

// -----------------------------------------------------------------------------
// Middleware matcher
// -----------------------------------------------------------------------------

export const config = {
  matcher: [
    /*
     * Run middleware for application pages.
     *
     * API routes are intentionally excluded for now because the authentication
     * APIs such as /api/auth/set-cookies should be handled directly by their
     * route handlers.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
