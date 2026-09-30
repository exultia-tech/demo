"use client";

import ThreatFeedStatsPage from "@/app/app/uvi/stats/page";

/**
 * Persistent Standalone Vantage Global Statistics Page
 * 
 * Accessible at `/threat-feed/standalone/stats`
 * Renders global threat metrics and telemetry with isolated header and footer.
 */
export default function StandaloneStatsPage() {
  return <ThreatFeedStatsPage />;
}
