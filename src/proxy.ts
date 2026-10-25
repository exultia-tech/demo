/**
 * Copyright (c) 2026 Exultia Technologies Inc. All rights reserved.
 * Proprietary and Confidential.
 *
 * Exultia Edge Proxy, Route Security, and Private Preview Lockdown Gate.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_CONFIG } from "./config/site-config";
import { OPERATOR_COOKIE_NAME, DEFAULT_OPERATOR_KEY } from "./app/api/preview/unlock/route";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Always allow assets, favicons, static files, and Next.js internals (never API routes)
  const STATIC_FILE_REGEX = /\.(ico|png|jpg|jpeg|svg|webp|css|js|woff2?|map|txt|xml|py)$/i;
  if (
    !pathname.startsWith("/api") &&
    (pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      STATIC_FILE_REGEX.test(pathname))
  ) {
    return NextResponse.next();
  }

  // 2. PRIVATE PREVIEW LOCKDOWN & OPERATOR GATE
  // When active (default: true during validation), NO OTHER PAGES OR APIS are accessible
  // to the public. Only authorized operators with the valid key can access the platform.
  const isExplicitlyDisabled =
    process.env.PRIVATE_PREVIEW_MODE === "false" ||
    process.env.PUBLIC_LAUNCH === "true" ||
    process.env.ALLOW_PUBLIC_ACCESS === "true" ||
    process.env.NODE_ENV === "test" ||
    Boolean(process.env.VITEST);
  const isPreviewMode = !isExplicitlyDisabled;

  if (isPreviewMode) {
    const expectedKey = (process.env.OPERATOR_PREVIEW_KEY || DEFAULT_OPERATOR_KEY).trim();

    // Support multiple authorization bypass vectors for CLI / API & Browser access:
    // 1. Header: X-Operator-Key: <key>
    // 2. Header: Authorization: Bearer <key>
    // 3. Query Param: ?key=<key> (or ?operator_key=<key>, ?token=<key>)
    // 4. Cookie: exultia_operator_key=<key>
    const headerKey = request.headers.get("x-operator-key")?.trim();
    const authHeader = request.headers.get("authorization")?.trim();
    const bearerKey = authHeader?.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : undefined;
    const queryKey = (
      request.nextUrl.searchParams.get("key") ||
      request.nextUrl.searchParams.get("operator_key") ||
      request.nextUrl.searchParams.get("token")
    )?.trim();
    const operatorCookie = request.cookies.get(OPERATOR_COOKIE_NAME)?.value?.trim();

    const providedKey = headerKey || bearerKey || queryKey || operatorCookie;
    const isOperatorAuthorized = Boolean(providedKey && providedKey === expectedKey);

    // If operator is authenticated, allow full access to all pages and APIs
    if (isOperatorAuthorized) {
      const response = NextResponse.next();
      // If authorized via header or query param, ensure cookie is set for session persistence
      if (!operatorCookie && providedKey === expectedKey) {
        response.cookies.set(OPERATOR_COOKIE_NAME, expectedKey, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
      return response;
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

    // Unauthorized API requests are strictly rejected from the root path
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        {
          error: "Access restricted: site in private preview lockdown.",
          hint: "To authenticate API requests, provide your operator key via 'X-Operator-Key' header, 'Authorization: Bearer <key>', or '?key=<key>' query parameter."
        },
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
