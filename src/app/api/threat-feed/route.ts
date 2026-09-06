import { NextResponse } from 'next/server';
import { 
  THREAT_INTELLIGENCE_CATALOG, 
  UVI_PUBLIC_FEED_SOURCES,
  ThreatFeedRecord,
  PublicFeedSource 
} from '@/lib/threat-feed-data';

export const dynamic = 'force-dynamic';

export type { ThreatFeedRecord, PublicFeedSource };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase();
  const format = searchParams.get('format') || 'json';
  const grade = searchParams.get('grade')?.toUpperCase();
  const ecosystem = searchParams.get('ecosystem')?.toLowerCase();
  const cveOnly = searchParams.get('cveOnly') === 'true';
  const kevOnly = searchParams.get('kevOnly') === 'true';

  let filtered = [...THREAT_INTELLIGENCE_CATALOG];

  // Query-Driven Resolution: Matches package name, namespace, display name, purl, or CVE identifier across all public feeds
  if (query) {
    filtered = filtered.filter(f => 
      f.name.toLowerCase().includes(query) ||
      f.namespace.toLowerCase().includes(query) ||
      f.displayName.toLowerCase().includes(query) ||
      f.purl.toLowerCase().includes(query) ||
      (f.threatSignals.nvdGhsaOsv.cveList && f.threatSignals.nvdGhsaOsv.cveList.some(cve => cve.toLowerCase().includes(query)))
    );
  }

  if (ecosystem && ecosystem !== "all") {
    filtered = filtered.filter(f => f.ecosystem === ecosystem);
  }

  if (grade && (grade === "A+" || grade === "B" || grade === "C")) {
    filtered = filtered.filter(f => f.securityGrade === grade);
  }

  if (cveOnly) {
    filtered = filtered.filter(f => f.openCveCount > 0);
  }

  if (kevOnly) {
    filtered = filtered.filter(f => f.threatSignals.cisaKev.isKnownExploited);
  }

  const responsePayload = {
    schemaVersion: "https://schema.secureide.dev/uvi/v2.json",
    feedName: "Unified Vulnerability Intelligence (UVI) Feed",
    mission: "Universal open aggregation providing Unified Vulnerability Intelligence (UVI) across all accessible public vulnerability registries and advisory databases. Feeds are ingested in their entirety without pre-exclusion; relevance to IDE extensions, language servers, toolchains, and package dependencies is determined dynamically by search query.",
    license: "CC-BY-4.0 (Open Access for All Developers)",
    generatedAt: new Date().toISOString(),
    queryParameters: {
      query: query || null,
      ecosystem: ecosystem || "all",
      grade: grade || "all",
      cveOnly,
      kevOnly
    },
    matchedPackagesCount: filtered.length,
    publicFeedSources: UVI_PUBLIC_FEED_SOURCES,
    records: filtered
  };

  return NextResponse.json(responsePayload, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
    }
  });
}
