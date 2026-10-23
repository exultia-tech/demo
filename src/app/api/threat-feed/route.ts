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
import { getCurrentUser } from '@/lib/auth/session';
import { recordLicenseActivity } from '@/lib/licensing/audit';

export const dynamic = 'force-dynamic';

export type { UviAdvisoryRecord, PublicFeedSource, ThreatSeverity, DomainCategory, IdeBuildImpactAssessment };

const rateLimitMap = new Map<string, number>();
const proRateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const PRO_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const PRO_MAX_REQUESTS = 300;

export async function GET(request: Request) {
  // Ensure autonomous CTI research agent background worker is active
  ctiResearchAgent.ensureInitialized();

  // Non-blocking trust-but-verify license telemetry
  const user = await getCurrentUser();
  if (user) {
    recordLicenseActivity(user.id, 'uvi', request, 'feed_query').catch(() => {});
  }

  // Rate Limiting Logic
  const isPro = user?.subscriptions?.some(s => 
    (s.product === 'multipass' || s.product === 'uvi' || s.product === 'praxis') &&
    s.tier === 'pro' &&
    s.status === 'active'
  );
  
  const isEnterprise = user?.subscriptions?.some(s => 
    (s.product === 'multipass' || s.product === 'uvi' || s.product === 'praxis') &&
    s.tier === 'enterprise' &&
    s.status === 'active'
  );

  const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
  const identifier = user ? user.id : ip;
  const now = Date.now();

  if (!isPro && !isEnterprise) {
    
    const lastRequest = rateLimitMap.get(identifier);
    if (lastRequest && (now - lastRequest < RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json(
        { error: 'Free tier rate limit exceeded. You are limited to 1 request per hour. Please upgrade to Pro or Enterprise for unlimited API access.' },
        { status: 429 }
      );
    }
    
    // Simple memory cleanup for stale rate limit entries
    if (rateLimitMap.size > 5000) {
      const oneHourAgo = now - RATE_LIMIT_WINDOW_MS;
      for (const [key, timestamp] of rateLimitMap.entries()) {
        if (timestamp < oneHourAgo) {
          rateLimitMap.delete(key);
        }
      }
    }

    rateLimitMap.set(identifier, now);
  } else if (isPro) {
    const record = proRateLimitMap.get(identifier) || { count: 0, windowStart: now };
    
    if (now - record.windowStart > PRO_RATE_LIMIT_WINDOW_MS) {
      record.count = 1;
      record.windowStart = now;
    } else {
      record.count++;
      if (record.count > PRO_MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Pro tier rate limit exceeded. You are limited to 300 requests per minute. Please upgrade to Enterprise for unlimited API access.' },
          { status: 429 }
        );
      }
    }

    if (proRateLimitMap.size > 5000) {
      const oneMinuteAgo = now - PRO_RATE_LIMIT_WINDOW_MS;
      for (const [key, data] of proRateLimitMap.entries()) {
        if (data.windowStart < oneMinuteAgo) {
          proRateLimitMap.delete(key);
        }
      }
    }

    proRateLimitMap.set(identifier, record);
  }

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
    feedName: "Vantage Consolidated Registry",
    identifierSystem: "Vantage-YYYY-MM-00000001",
    dataSource: result.source === 'database' ? 'Turso LibSQL Database (Persisted & Indexed)' : 'In-Memory Fallback Aggregator',
    mission: `Universal cross-ecosystem open vulnerability & threat intelligence registry consolidating upstream signals from ${UVI_PUBLIC_FEED_SOURCES.length} authoritative feeds across Vendor Security Disclosures (PHP Foundation, Microsoft MSRC, Red Hat RHSA, Ubuntu USN, Debian DSA, Apple, Google, Apache, OpenSSL, Linux Kernel, Mozilla, VMware, Cisco, Oracle, Node.js, RustSec), Malware, C2 & Botnets, Phishing & Fraud, IP Reputation & Telemetry, Vulnerabilities & Exploitation, Multi-Indicator Hubs, and Research & Bug Bounty Disclosures (HackerOne, Bugcrowd, Immunefi, Pentester Land, disclose.io, Reddit, Brian Krebs, Bruce Schneier, PortSwigger Research, Google Project Zero, Unit 42, Microsoft MSTI, URLhaus, ThreatFox, CISA KEV, FIRST EPSS, CIRCL MISP, NVD, GHSA, OSV.dev, OpenSSF, Snyk, and more). Pre-assigned unified Vantage identifiers synthesize CVEs, active zero-days, runtime escapes, supply chain trojans, botnet C2s, bug bounty writeups, and practitioner disclosures into an organized, queryable encyclopedia. Features dual-perspective impact assessment: Global Software Awareness & Developer/Build Exposure.`,
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
      "Vendor Security Disclosures",
      "Research, Bug Bounty & Community Disclosures",
      "Malware, C2 & Botnets",
      "Phishing & Fraud",
      "IP Reputation, Scanners & Network Telemetry",
      "Vulnerabilities & Exploitation",
      "Multi-Indicator Hubs & Aggregators"
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
