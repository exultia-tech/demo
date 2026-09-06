import { NextResponse } from 'next/server';
import { 
  CONSOLIDATED_UVI_ADVISORIES, 
  UVI_PUBLIC_FEED_SOURCES,
  UviAdvisoryRecord,
  PublicFeedSource,
  ThreatSeverity,
  DomainCategory,
  IdeBuildImpactAssessment
} from '@/lib/threat-feed-data';

export const dynamic = 'force-dynamic';

export type { UviAdvisoryRecord, PublicFeedSource, ThreatSeverity, DomainCategory, IdeBuildImpactAssessment };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim().toLowerCase();
  const id = searchParams.get('id')?.trim().toUpperCase();
  const cve = searchParams.get('cve')?.trim().toUpperCase();
  const severity = searchParams.get('severity')?.toUpperCase();
  const domain = searchParams.get('domain');
  const source = searchParams.get('source');
  const scope = searchParams.get('scope')?.toLowerCase() || 'all'; // 'all' | 'build-impact'
  const kevOnly = searchParams.get('kevOnly') === 'true';

  let filtered = [...CONSOLIDATED_UVI_ADVISORIES];

  // Specific UVI ID lookup (e.g., ?id=UVI-2021-44228)
  if (id) {
    filtered = filtered.filter(f => f.uviId.toUpperCase() === id);
  }

  // Specific CVE lookup (e.g., ?cve=CVE-2024-3094)
  if (cve) {
    filtered = filtered.filter(f => f.cveList.some(c => c.toUpperCase() === cve));
  }

  // Scope filter: Full Universal Feed vs Direct Developer / Build Impact Focus
  if (scope === 'build-impact' || scope === 'dev') {
    filtered = filtered.filter(f => f.ideBuildImpact.hasDirectBuildImpact);
  }

  // Free-form Search Query across UVI ID, CVEs, Title, Headline, Summary, Impact, Targets, CWE, and Upstream findings
  if (query) {
    filtered = filtered.filter(f => 
      f.uviId.toLowerCase().includes(query) ||
      f.cveList.some(c => c.toLowerCase().includes(query)) ||
      (f.ghsaId && f.ghsaId.toLowerCase().includes(query)) ||
      (f.osvId && f.osvId.toLowerCase().includes(query)) ||
      (f.msrcId && f.msrcId.toLowerCase().includes(query)) ||
      f.title.toLowerCase().includes(query) ||
      f.headline.toLowerCase().includes(query) ||
      f.summary.toLowerCase().includes(query) ||
      f.technicalDetails.toLowerCase().includes(query) ||
      f.globalImpact.toLowerCase().includes(query) ||
      f.ideBuildImpact.workstationVector.toLowerCase().includes(query) ||
      f.ideBuildImpact.recommendationForIdeBuilds.toLowerCase().includes(query) ||
      f.cwe.toLowerCase().includes(query) ||
      f.domainCategory.toLowerCase().includes(query) ||
      f.affectedTargets.some(t => 
        t.product.toLowerCase().includes(query) || 
        t.ecosystem.toLowerCase().includes(query) ||
        (t.purl && t.purl.toLowerCase().includes(query))
      ) ||
      f.upstreamSignals.some(s => 
        s.sourceName.toLowerCase().includes(query) || 
        s.finding.toLowerCase().includes(query)
      )
    );
  }

  // Severity filter
  if (severity && severity !== "ALL") {
    filtered = filtered.filter(f => f.severity === severity);
  }

  // Domain Category filter
  if (domain && domain !== "all" && domain !== "All Domains") {
    filtered = filtered.filter(f => f.domainCategory.toLowerCase() === domain.toLowerCase());
  }

  // Source feed filter
  if (source && source !== "all" && source !== "All Feeds") {
    filtered = filtered.filter(f => 
      f.upstreamSignals.some(s => s.sourceId.toLowerCase() === source.toLowerCase() || s.sourceName.toLowerCase().includes(source.toLowerCase()))
    );
  }

  // CISA KEV Known Exploited Vulnerability filter
  if (kevOnly) {
    filtered = filtered.filter(f => f.cisaKev.isKnownExploited);
  }

  const responsePayload = {
    schemaVersion: "https://schema.secureide.dev/uvi/v3.json",
    feedName: "Unified Vulnerability Intelligence (UVI) Consolidated Registry",
    identifierSystem: "UVI-YYYY-NNNN",
    mission: "Universal cross-ecosystem open vulnerability & threat intelligence registry consolidating upstream signals from 12 authoritative feeds (NVD, CISA KEV, GHSA, OSV.dev, OpenSSF, MSRC, Trail of Bits, Socket.dev, JFrog, Aqua Nautilus, Snyk, Language Advisory DBs). Pre-assigned unified UVI identifiers synthesize CVEs, active zero-days, runtime escapes, supply chain trojans, and protocol flaws into an organized, queryable encyclopedia. Features dual-perspective impact assessment: Global Software Awareness & Developer/Build Exposure.",
    license: "CC-BY-4.0 (Open Access for All Developers and Systems)",
    generatedAt: new Date().toISOString(),
    queryParameters: {
      query: query || null,
      id: id || null,
      cve: cve || null,
      scope: scope,
      severity: severity || "ALL",
      domain: domain || "all",
      source: source || "all",
      kevOnly
    },
    totalConsolidatedCount: CONSOLIDATED_UVI_ADVISORIES.length,
    directBuildImpactCount: CONSOLIDATED_UVI_ADVISORIES.filter(a => a.ideBuildImpact.hasDirectBuildImpact).length,
    matchedAdvisoriesCount: filtered.length,
    publicFeedSources: UVI_PUBLIC_FEED_SOURCES,
    advisories: filtered
  };

  return NextResponse.json(responsePayload, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
    }
  });
}
