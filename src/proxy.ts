import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_CONFIG } from "./config/site-config";
import { OPERATOR_COOKIE_NAME, DEFAULT_OPERATOR_KEY } from "./app/api/preview/unlock/route";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Always allow assets, favicons, static files, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. PRIVATE PREVIEW & OPERATOR GATE
  // When active (default: true during validation), visitors cannot see the live site unless authorized
  const isPreviewMode = process.env.PRIVATE_PREVIEW_MODE !== "false" && process.env.PUBLIC_LAUNCH !== "true";

  if (isPreviewMode) {
    // Whitelist the preview page itself, unlock/lock APIs, and the emergency admin login
    if (
      pathname.startsWith("/preview") ||
      pathname.startsWith("/api/preview") ||
      pathname.startsWith("/admin/login")
    ) {
      return NextResponse.next();
    }

    // Check for operator cookie or session
    const operatorCookie = request.cookies.get(OPERATOR_COOKIE_NAME)?.value;
    const sessionCookie = request.cookies.get("exultia_session")?.value;
    const expectedKey = process.env.OPERATOR_PREVIEW_KEY || DEFAULT_OPERATOR_KEY;

    const isOperatorAuthorized = Boolean(
      (operatorCookie && operatorCookie === expectedKey) || sessionCookie
    );

    // If not authorized as operator, redirect to the preview holding page
    if (!isOperatorAuthorized) {
      const url = request.nextUrl.clone();
      url.pathname = "/preview";
      return NextResponse.redirect(url);
    }
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
