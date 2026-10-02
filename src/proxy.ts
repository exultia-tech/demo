import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_CONFIG } from "./config/site-config";

export function proxy(request: NextRequest) {
  // If global isolated threat feed mode is active, prevent visitors from reaching unreleased products
  if (SITE_CONFIG.isolatedThreatFeed) {
    const { pathname } = request.nextUrl;
    
    // Allow threat feed routes, API routes, internal assets
    if (
      pathname.startsWith("/app/uvi") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }
    
    // Redirect root and unreleased product paths to /threat-feed
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
