import { NextResponse } from 'next/server';
import { 
  UVI_PUBLIC_FEED_SOURCES,
  UviAdvisoryRecord,
  PublicFeedSource,
  ThreatSeverity,
  DomainCategory,
  IdeBuildImpactAssessment,
  getRecordObservationalAssessment
} from '@/lib/threat-feed-data';
import { getAggregatedUviAdvisories, getGlobalRegistryMetrics } from '@/lib/feed-aggregator';
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
  const limit = isLimitAll ? 5000 : (parseInt(limitParam, 10) || 50);

  // Fetch live aggregated dataset (curated + CISA KEV + OSV) and global catalog metrics
  const allAdvisories = await getAggregatedUviAdvisories();
  const globalMetrics = await getGlobalRegistryMetrics();
  let filtered = [...allAdvisories];

  // Specific UVI ID lookup (e.g., ?id=UVI-2024-03-000001 or legacy ?id=UVI-2021-44228)
  if (id) {
    filtered = filtered.filter(f => f.uviId.toUpperCase() === id || (f.legacyUviId && f.legacyUviId.toUpperCase() === id));
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

  // Free-form Search Query across UVI ID, Legacy ID, CVEs, Title, Headline, Summary, Impact, Targets, CWE, and Upstream findings
  if (query) {
    filtered = filtered.filter(f => 
      f.uviId.toLowerCase().includes(query) ||
      (f.legacyUviId && f.legacyUviId.toLowerCase().includes(query)) ||
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

  // Unified Operational Domain / Event Type filter
  const targetDomain = (domain || action);
  if (targetDomain && targetDomain.toUpperCase() !== "ALL" && targetDomain.toLowerCase() !== "all domains" && targetDomain.toLowerCase() !== "all event types & domains") {
    const dUpper = targetDomain.toUpperCase();
    const dLower = targetDomain.toLowerCase();
    filtered = filtered.filter(f => {
      const obs = getRecordObservationalAssessment(f);
      const dom = obs.operationalDomain;
      const act = obs.actionDirective;

      if (dUpper === dom || dUpper === act) return true;

      // Single-word operational domain aliases
      if (dUpper === "PATCH" && (act === "EXPEDITE_HOTFIX" || act === "INTERVENE_NOW")) return true;
      if (dUpper === "ENDPOINT" && (act === "QUARANTINE_AND_REVOKE" || act === "HARDEN_WORKSTATION" || act === "INTERVENE_NOW")) return true;
      if (dUpper === "IDENTITY" && act === "ROTATE_SECRETS") return true;
      if (dUpper === "SUPPLY" && act === "PIN_DEPENDENCY") return true;
      if (dUpper === "PIPELINE" && (act === "LOCKDOWN_PIPELINE" || act === "AUDIT_CONFIG")) return true;
      if (dUpper === "AGENT" && act === "CONSTRAIN_AGENTS") return true;
      if (dUpper === "NETWORK" && (act === "SEGREGATE_NETWORK" || act === "SITUATIONAL_AWARENESS")) return true;

      // Legacy parameter aliases
      if (dUpper === "INTERVENE_NOW") return dom === "PATCH" || dom === "ENDPOINT";
      if (dUpper === "EXPEDITE_HOTFIX") return dom === "PATCH";
      if (dUpper === "QUARANTINE_AND_REVOKE" || dUpper === "HARDEN_WORKSTATION") return dom === "ENDPOINT";
      if (dUpper === "ROTATE_SECRETS") return dom === "IDENTITY";
      if (dUpper === "LOCKDOWN_PIPELINE" || dUpper === "AUDIT_CONFIG") return dom === "PIPELINE";
      if (dUpper === "PIN_DEPENDENCY") return dom === "SUPPLY";
      if (dUpper === "CONSTRAIN_AGENTS") return dom === "AGENT";
      if (dUpper === "SEGREGATE_NETWORK" || dUpper === "SITUATIONAL_AWARENESS") return dom === "NETWORK";

      // Legacy domain category name matches
      if (f.domainCategory && f.domainCategory.toLowerCase() === dLower) return true;
      if (dLower.includes("supply") && dom === "SUPPLY") return true;
      if (dLower.includes("network") && dom === "NETWORK") return true;
      if (dLower.includes("cloud") && dom === "PIPELINE") return true;
      if (dLower.includes("developer") && dom === "ENDPOINT") return true;
      if (dLower.includes("operating") && (dom === "ENDPOINT" || dom === "PATCH")) return true;
      if (dLower.includes("enterprise") && dom === "PATCH") return true;

      return false;
    });
  }

  // Source feed filter
  if (source && source !== "all" && source !== "All Feeds") {
    const srcLower = source.toLowerCase();
    filtered = filtered.filter(f => 
      f.upstreamSignals.some(s => {
        const sId = s.sourceId.toLowerCase();
        const sName = s.sourceName.toLowerCase();
        if (sId === srcLower || sName.includes(srcLower)) return true;
        if ((srcLower === "project_zero" || srcLower === "google_project_zero" || srcLower === "google_project_zero_blog") && (sId === "project_zero" || sId === "project_zero_research" || sName.includes("project zero"))) return true;
        if (srcLower === "academic_research" && (sId === "project_zero_research" || sName.includes("academic") || sName.includes("arxiv") || sName.includes("iacr"))) return true;
        if (srcLower === "underground_intel" && (sId === "underground_intel" || sName.includes("underground") || s.badge?.toLowerCase().includes("underground"))) return true;
        if (srcLower === "bleeping_computer" && (sId === "bleeping_computer" || sName.includes("bleepingcomputer") || sName.includes("bleeping computer"))) return true;
        if (srcLower === "hackerone_hacktivity" && (sId.includes("hackerone") || sName.includes("hackerone"))) return true;
        if (srcLower === "bugcrowd_crowdstream" && (sId.includes("crowdstream") || (sId.includes("bugcrowd") && !sId.includes("discord")) || sName.includes("crowdstream"))) return true;
        if (srcLower === "bugcrowd_discord" && (sId.includes("bugcrowd") && (sId.includes("discord") || sName.includes("discord")))) return true;
        if (srcLower === "bounty_world_discord" && (sId.includes("bounty_world") || (sId.includes("bounty") && (sId.includes("discord") || sName.includes("bounty world"))))) return true;
        if (srcLower === "immunefi_disclosures" && (sId.includes("immunefi") || sName.includes("immunefi"))) return true;
        if ((srcLower === "pentester_land" || srcLower === "pentester_land_json") && (sId.includes("pentester") || sName.includes("pentester"))) return true;
        if (srcLower === "disclose_io" && (sId.includes("disclose") || sName.includes("disclose"))) return true;
        if (srcLower === "bugbounty_disclosed_reports" && (sId.includes("disclosed_reports") || sName.includes("disclosed reports"))) return true;
        if ((srcLower === "reddit" || srcLower === "reddit_bugbounty" || srcLower === "r_bugbounty" || srcLower === "reddit_netsec" || srcLower === "r_netsec" || srcLower === "reddit_blueteamsec" || srcLower === "r_blueteamsec" || srcLower === "reddit_cybersecurity" || srcLower === "r_cybersecurity") && (sId.includes("reddit") || sName.toLowerCase().includes("reddit") || sId.includes("bugbounty") || sName.includes("bugbounty") || sId.includes("netsec") || sName.includes("netsec") || sId.includes("blueteamsec") || sName.includes("blueteamsec") || sId.includes("cybersecurity") || sName.includes("cybersecurity"))) return true;
        if (srcLower === "sec_stackexchange" && (sId.includes("stackexchange") || sName.includes("stack exchange"))) return true;
        if (srcLower === "wwhf_discord" && (sId.includes("wwhf") || sName.includes("wild west"))) return true;
        if (srcLower === "hacker_news_infosec" && (sId.includes("hacker_news") || sName.includes("hacker news"))) return true;
        if ((srcLower === "brian_krebs" || srcLower === "krebs" || srcLower === "krebs_security" || srcLower === "krebs_on_security") && (sId.includes("krebs") || sName.toLowerCase().includes("krebs"))) return true;
        if ((srcLower === "bruce_schneier" || srcLower === "schneier" || srcLower === "schneier_security" || srcLower === "schneier_on_security") && (sId.includes("schneier") || sName.toLowerCase().includes("schneier"))) return true;
        if (srcLower === "portswigger_research" && (sId.includes("portswigger") || sName.includes("portswigger"))) return true;
        if (srcLower === "unit42_research" && (sId.includes("unit42") || sId.includes("unit_42") || sName.includes("unit 42"))) return true;
        if (srcLower === "microsoft_threat_intel" && (sId.includes("microsoft") || sId.includes("msti") || sName.includes("microsoft"))) return true;
        return false;
      })
    );
  }

  // Feed Category filter (Malware, C2 & Botnets | Phishing & Fraud | IP Reputation | Vulnerabilities | Threat Hubs)
  if (feedCategory && feedCategory.toUpperCase() !== "ALL") {
    const matchingFeedIds = new Set(
      UVI_PUBLIC_FEED_SOURCES
        .filter(f => f.category.toLowerCase() === feedCategory.toLowerCase() || f.category.toLowerCase().includes(feedCategory.toLowerCase()))
        .map(f => f.id.toLowerCase())
    );
    filtered = filtered.filter(f =>
      f.upstreamSignals.some(s => matchingFeedIds.has(s.sourceId.toLowerCase()))
    );
  }

  // CISA KEV Known Exploited Vulnerability filter
  if (kevOnly) {
    filtered = filtered.filter(f => f.cisaKev.isKnownExploited);
  }

  if (stage && stage !== "ALL") {
    filtered = filtered.filter(f => getRecordObservationalAssessment(f).weaponizationStage === stage);
  }
  if (horizon && horizon !== "ALL") {
    filtered = filtered.filter(f => getRecordObservationalAssessment(f).exposureHorizon === horizon);
  }

  // Sorting parameter (supports date/age, CVSS score, UVI ID)
  const sortByParam = searchParams.get('sortBy') || searchParams.get('sort') || 'cvss_desc';
  filtered.sort((a, b) => {
    if (sortByParam === "published_desc" || sortByParam === "date_desc" || sortByParam === "newest") {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    }
    if (sortByParam === "published_asc" || sortByParam === "date_asc" || sortByParam === "oldest") {
      return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
    }
    if (sortByParam === "uvi_desc") {
      return b.uviId.localeCompare(a.uviId);
    }
    if (sortByParam === "uvi_asc") {
      return a.uviId.localeCompare(b.uviId);
    }
    // Default: CVSS score descending
    return b.cvssScore - a.cvssScore;
  });

  const totalMatched = filtered.length;
  const totalPages = isLimitAll ? 1 : Math.ceil(totalMatched / limit);
  const startIndex = (page - 1) * limit;
  const paginatedRecords = isLimitAll ? filtered : filtered.slice(startIndex, startIndex + limit);

  const responsePayload = {
    schemaVersion: "https://schema.secureide.dev/uvi/v3.json",
    feedName: "Unified Vulnerability Intelligence (UVI) Consolidated Registry",
    identifierSystem: "UVI-YYYY-MM-000001",
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
    totalConsolidatedCount: globalMetrics.totalConsolidatedCount,
    directBuildImpactCount: globalMetrics.directBuildImpactCount,
    nonCveThreatsCount: globalMetrics.nonCveThreatsCount,
    informationalDisclosuresCount: globalMetrics.informationalDisclosuresCount,
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
