import { NextResponse } from 'next/server';
import { 
  UVI_PUBLIC_FEED_SOURCES,
  UviAdvisoryRecord,
  PublicFeedSource,
  ThreatSeverity,
  DomainCategory,
  IdeBuildImpactAssessment,
} from '@/lib/threat-feed-data';
import { queryThreatFeedFromDb } from '@/lib/db/threats-query';
import { ctiResearchAgent } from '@/lib/informational-research-agent';

export const dynamic = 'force-dynamic';

export type { UviAdvisoryRecord, PublicFeedSource, ThreatSeverity, DomainCategory, IdeBuildImpactAssessment };

export async function GET(request: Request) {
  // Ensure autonomous CTI research agent background worker is active
  ctiResearchAgent.ensureInitialized();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim().toLowerCase();
  const id = searchParams.get('id')?.trim().toUpperCase();
  const cve = searchParams.get('cve')?.trim().toUpperCase();
  const severity = searchParams.get('severity')?.toUpperCase();
  const domain = searchParams.get('domain');
  const source = searchParams.get('source');
  const feedCategory = searchParams.get('category')?.trim();
  const scope = searchParams.get('scope')?.toLowerCase() || 'all'; // 'all' | 'build-impact'
  const kevOnly = searchParams.get('kevOnly') === 'true';
  const action = (searchParams.get('action') || searchParams.get('opDomain') || searchParams.get('domain_op'))?.toUpperCase();
  const stage = searchParams.get('stage')?.toUpperCase();
  const horizon = searchParams.get('horizon')?.toUpperCase();

  // Pagination parameters
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limitParam = searchParams.get('limit') || 'all'; // default 'all' or integer
  const isLimitAll = limitParam.toLowerCase() === 'all';
  const limit = isLimitAll ? 'all' : (parseInt(limitParam, 10) || 50);
  const sortBy = searchParams.get('sortBy') || searchParams.get('sort') || 'cvss_desc';

  // Query indexed Turso LibSQL database
  const result = await queryThreatFeedFromDb({
    query,
    id,
    cve,
    severity,
    domain,
    source,
    category: feedCategory,
    scope,
    kevOnly,
    action,
    stage,
    horizon,
    page,
    limit,
    sortBy
  });

  const responsePayload = {
    schemaVersion: "https://schema.secureide.dev/uvi/v3.json",
    feedName: "Unified Vulnerability Intelligence (UVI) Consolidated Registry",
    identifierSystem: "UVI-YYYY-MM-00000001",
    dataSource: result.source === 'database' ? 'Turso LibSQL Database (Persisted & Indexed)' : 'In-Memory Fallback Aggregator',
    mission: `Universal cross-ecosystem open vulnerability & threat intelligence registry consolidating upstream signals from ${UVI_PUBLIC_FEED_SOURCES.length} authoritative feeds across Malware, C2 & Botnets, Phishing & Fraud, IP Reputation & Telemetry, Vulnerabilities & Exploitation, Multi-Indicator Hubs, and Research & Bug Bounty Disclosures (HackerOne, Bugcrowd, Immunefi, Pentester Land, disclose.io, Reddit, Brian Krebs, Bruce Schneier, PortSwigger Research, Google Project Zero, Unit 42, Microsoft MSTI, URLhaus, ThreatFox, CISA KEV, FIRST EPSS, CIRCL MISP, NVD, GHSA, OSV.dev, OpenSSF, Snyk, and more). Pre-assigned unified UVI identifiers synthesize CVEs, active zero-days, runtime escapes, supply chain trojans, botnet C2s, bug bounty writeups, and practitioner disclosures into an organized, queryable encyclopedia. Features dual-perspective impact assessment: Global Software Awareness & Developer/Build Exposure.`,
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
      category: feedCategory || "all",
      kevOnly,
      page,
      limit: isLimitAll ? "all" : limit
    },
    totalConsolidatedCount: result.totalConsolidatedCount,
    directBuildImpactCount: result.directBuildImpactCount,
    nonCveThreatsCount: result.nonCveThreatsCount,
    informationalDisclosuresCount: result.informationalDisclosuresCount,
    totalFeedSourcesCount: UVI_PUBLIC_FEED_SOURCES.length,
    totalUpstreamRecordsIngested: UVI_PUBLIC_FEED_SOURCES.reduce((acc, f) => acc + f.recordsIngested, 0),
    feedCategories: [
      "Malware, C2 & Botnets",
      "Phishing & Fraud",
      "IP Reputation, Scanners & Network Telemetry",
      "Vulnerabilities & Exploitation",
      "Multi-Indicator Hubs & Aggregators",
      "Research, Bug Bounty & Community Disclosures"
    ],
    matchedAdvisoriesCount: result.totalMatched,
    page: result.page,
    totalPages: result.totalPages,
    returnedCount: result.advisories.length,
    publicFeedSources: UVI_PUBLIC_FEED_SOURCES,
    advisories: result.advisories
  };

  return NextResponse.json(responsePayload, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=180, stale-while-revalidate=360'
    }
  });
}
