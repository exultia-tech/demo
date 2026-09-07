import { NextResponse } from 'next/server';
import { 
  UVI_PUBLIC_FEED_SOURCES,
  UviAdvisoryRecord,
  PublicFeedSource,
  ThreatSeverity,
  DomainCategory,
  IdeBuildImpactAssessment
} from '@/lib/threat-feed-data';
import { getAggregatedUviAdvisories } from '@/lib/feed-aggregator';

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
  const action = searchParams.get('action')?.toUpperCase();
  const stage = searchParams.get('stage')?.toUpperCase();
  const horizon = searchParams.get('horizon')?.toUpperCase();

  // Pagination parameters
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limitParam = searchParams.get('limit') || 'all'; // default 'all' or integer
  const isLimitAll = limitParam.toLowerCase() === 'all';
  const limit = isLimitAll ? 5000 : (parseInt(limitParam, 10) || 50);

  // Fetch live aggregated dataset (curated + CISA KEV + OSV)
  const allAdvisories = await getAggregatedUviAdvisories();
  let filtered = [...allAdvisories];

  // Specific UVI ID lookup (e.g., ?id=UVI-2021-44228)
  if (id) {
    filtered = filtered.filter(f => f.uviId.toUpperCase() === id);
  }

  // Specific CVE lookup (e.g., ?cve=CVE-2024-3094)
  if (cve) {
    filtered = filtered.filter(f => f.cveList.some(c => c.toUpperCase() === cve));
  }

  // Scope filter: Full Universal Feed vs Direct Developer / Build Impact Focus vs Pure Non-CVE Threats vs Informational Disclosures
  if (scope === 'build-impact' || scope === 'dev') {
    filtered = filtered.filter(f => f.ideBuildImpact.hasDirectBuildImpact);
  } else if (scope === 'non-cve' || scope === 'malware') {
    filtered = filtered.filter(f => f.cveList.length === 0 && f.disclosureType !== 'INFORMATIONAL_DISCLOSURE');
  } else if (scope === 'informational' || scope === 'chatter' || scope === 'research' || scope === 'info') {
    filtered = filtered.filter(f => f.disclosureType === 'INFORMATIONAL_DISCLOSURE');
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
      (f.informationalSynthesis && (
        f.informationalSynthesis.vectorCategory.toLowerCase().includes(query) ||
        f.informationalSynthesis.executiveBrief.toLowerCase().includes(query) ||
        f.informationalSynthesis.inferredMechanism.toLowerCase().includes(query) ||
        f.informationalSynthesis.precautionaryPosture.toLowerCase().includes(query) ||
        f.informationalSynthesis.primarySources.some(ps => ps.sourceName.toLowerCase().includes(query) || ps.headline.toLowerCase().includes(query))
      )) ||
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

  // Behavioral Observational Filters for Informational Disclosures
  if (action && action !== "ALL") {
    filtered = filtered.filter(f => f.informationalSynthesis?.actionDirective === action);
  }
  if (stage && stage !== "ALL") {
    filtered = filtered.filter(f => f.informationalSynthesis?.weaponizationStage === stage);
  }
  if (horizon && horizon !== "ALL") {
    filtered = filtered.filter(f => f.informationalSynthesis?.exposureHorizon === horizon);
  }

  const totalMatched = filtered.length;
  const totalPages = isLimitAll ? 1 : Math.ceil(totalMatched / limit);
  const startIndex = (page - 1) * limit;
  const paginatedRecords = isLimitAll ? filtered : filtered.slice(startIndex, startIndex + limit);

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
      kevOnly,
      page,
      limit: isLimitAll ? "all" : limit
    },
    totalConsolidatedCount: allAdvisories.length,
    directBuildImpactCount: allAdvisories.filter(a => a.ideBuildImpact.hasDirectBuildImpact).length,
    nonCveThreatsCount: allAdvisories.filter(a => a.cveList.length === 0 && a.disclosureType !== 'INFORMATIONAL_DISCLOSURE').length,
    informationalDisclosuresCount: allAdvisories.filter(a => a.disclosureType === 'INFORMATIONAL_DISCLOSURE').length,
    matchedAdvisoriesCount: totalMatched,
    page,
    totalPages,
    returnedCount: paginatedRecords.length,
    publicFeedSources: UVI_PUBLIC_FEED_SOURCES,
    advisories: paginatedRecords
  };

  return NextResponse.json(responsePayload, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=180, stale-while-revalidate=360'
    }
  });
}
