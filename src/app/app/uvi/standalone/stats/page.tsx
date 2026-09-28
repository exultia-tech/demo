"use client";

import ThreatFeedStatsPage from "@/app/threat-feed/stats/page";

/**
 * Persistent Standalone UVI Global Statistics Page
 * 
 * Accessible at `/threat-feed/standalone/stats`
 * Renders global threat metrics and telemetry with isolated header and footer.
 */
export default function StandaloneStatsPage() {
  return <ThreatFeedStatsPage />;
}
