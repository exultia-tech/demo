"use client";

import ThreatFeedPage from "@/app/app/uvi/page";

/**
 * Persistent Standalone UVI Threat Feed Page
 * 
 * Accessible at `/threat-feed/standalone`
 * Renders the full UVI threat feed platform with isolated header and footer,
 * ensuring no links or mentions of unreleased products appear.
 */
export default function StandaloneThreatFeedPage() {
  return <ThreatFeedPage />;
}
