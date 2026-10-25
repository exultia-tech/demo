import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_CONFIG } from "./config/site-config";
import { OPERATOR_COOKIE_NAME, DEFAULT_OPERATOR_KEY } from "./app/api/preview/unlock/route";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Always allow assets, favicons, static files, and Next.js internals
  const STATIC_FILE_REGEX = /\.(ico|png|jpg|jpeg|svg|webp|css|js|woff2?|map|json|txt|xml)$/i;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    STATIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. PRIVATE PREVIEW LOCKDOWN & OPERATOR GATE
  // When active (default: true during validation), NO OTHER PAGES OR APIS are accessible
  // to the public. Only authorized operators with the valid key can access the platform.
  const isExplicitlyDisabled =
    process.env.PRIVATE_PREVIEW_MODE === "false" ||
    process.env.PUBLIC_LAUNCH === "true" ||
    process.env.ALLOW_PUBLIC_ACCESS === "true";
  const isPreviewMode = !isExplicitlyDisabled;

  if (isPreviewMode) {
    // Check for operator authorization passkey cookie
    const operatorCookie = request.cookies.get(OPERATOR_COOKIE_NAME)?.value;
    const expectedKey = (process.env.OPERATOR_PREVIEW_KEY || DEFAULT_OPERATOR_KEY).trim();

    const isOperatorAuthorized = Boolean(
      operatorCookie && operatorCookie.trim() === expectedKey
    );

    // If operator is authenticated, allow full access to all pages and APIs
    if (isOperatorAuthorized) {
      return NextResponse.next();
    }

    // --- STRICT LOCKDOWN (Unauthenticated Visitors) ---
    // Only allow the preview holding page and the operator unlock API endpoints
    if (
      pathname === "/preview" ||
      pathname.startsWith("/preview/") ||
      pathname.startsWith("/api/preview")
    ) {
      return NextResponse.next();
    }

    // Unauthorized API requests are strictly rejected with 403 Forbidden
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Access restricted: site in private preview lockdown." },
        { status: 403 }
      );
    }

    // All unauthorized page requests are redirected to the holding page
    const url = request.nextUrl.clone();
    url.pathname = "/preview";
    return NextResponse.redirect(url);
  }

  // 3. Isolated Threat Feed Mode (legacy / optional)
  if (SITE_CONFIG.isolatedThreatFeed) {
    if (
      pathname.startsWith("/app/uvi") ||
      pathname.startsWith("/api")
    ) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/app/uvi";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
