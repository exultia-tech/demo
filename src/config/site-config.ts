/**
 * Global Site Configuration & Mode Management
 * 
 * Allows toggling "Isolated Threat Feed Mode" globally or per-route.
 * When isolated mode is ACTIVE:
 * 1. Navbar removes product dropdowns and links to PureIDE / Inquest.
 * 2. Navbar brand logo links to the Threat Feed registry.
 * 3. Subnav displays only Vantage Threat Intelligence navigation.
 * 4. Footer removes all references / links to PureIDE and Inquest, replacing them with Vantage platform resources.
 * 5. Visiting the root `/` redirects to `/threat-feed` when global isolation is enabled.
 * 
 * To enable/disable:
 * - Option A: Toggle `ISOLATED_THREAT_FEED_DEFAULT = true` below.
 * - Option B: Set `NEXT_PUBLIC_ISOLATED_THREAT_FEED="true"` in .env / Vercel Environment Variables.
 * - Option C: Use the dedicated persistent standalone routes: `/threat-feed/standalone` or `/threat-feed/standalone/stats`.
 * - Option D: Add `?standalone=true` or `?isolated=true` to any threat-feed URL.
 */

// Set to true to make the entire site default to Threat-Feed-Only mode
const ISOLATED_THREAT_FEED_DEFAULT = false;

export const SITE_CONFIG = {
  // Global toggle: true = Isolated Threat Feed, false = Full Multi-Product Suite
  isolatedThreatFeed: 
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_ISOLATED_THREAT_FEED !== undefined
      ? process.env.NEXT_PUBLIC_ISOLATED_THREAT_FEED === "true"
      : ISOLATED_THREAT_FEED_DEFAULT,
  
  // Dedicated persistent standalone routes
  standaloneThreatFeedPath: "/app/uvi/standalone",
  standaloneStatsPath: "/app/uvi/standalone/stats",
};

/**
 * Helper to determine if a request / pathname is currently operating in Isolated Threat Feed Mode
 */
export function isIsolatedThreatFeed(pathname: string | null, searchParams?: URLSearchParams | null): boolean {
  if (SITE_CONFIG.isolatedThreatFeed) return true;
  if (!pathname) return false;
  
  // Explicit standalone / isolated path prefixes
  if (
    pathname.startsWith("/app/uvi/standalone") ||
    pathname.startsWith("/app/uvi/isolated") ||
    pathname.startsWith("/standalone/threat-feed")
  ) {
    return true;
  }
  
  // Query parameter override on threat feed routes (?standalone=true or ?isolated=true or ?mode=standalone)
  if (pathname.startsWith("/app/uvi") && searchParams) {
    const standaloneParam = searchParams.get("standalone");
    const isolatedParam = searchParams.get("isolated");
    const modeParam = searchParams.get("mode");
    if (standaloneParam === "true" || isolatedParam === "true" || modeParam === "standalone" || modeParam === "isolated") {
      return true;
    }
  }
  
  return false;
}
