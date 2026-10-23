import { client } from './index';
import { UviAdvisoryRecord, UVI_PUBLIC_FEED_SOURCES } from '../threat-feed-data';
import { getAggregatedUviAdvisories, getGlobalRegistryMetrics } from '../feed-aggregator';
import { syncUviThreatsToDb, getDbThreatMetrics } from './sync-threats';

export interface ThreatFeedQueryParams {
  query?: string | null;
  id?: string | null;
  cve?: string | null;
  severity?: string | null;
  domain?: string | null;
  source?: string | null;
  category?: string | null;
  scope?: string | null;
  kevOnly?: boolean;
  action?: string | null;
  stage?: string | null;
  horizon?: string | null;
  page?: number;
  limit?: number | 'all';
  sortBy?: string;
}

export interface ThreatFeedQueryResult {
  advisories: UviAdvisoryRecord[];
  totalMatched: number;
  totalPages: number;
  page: number;
  limit: number | 'all';
  totalConsolidatedCount: number;
  directBuildImpactCount: number;
  nonCveThreatsCount: number;
  informationalDisclosuresCount: number;
  source: 'database' | 'memory_fallback';
}

// Comprehensive source filter builder that resolves exact sourceId and vendor/ecosystem signals
export function buildSourceFilterClause(sourceId: string): { sql: string; args: any[] } {
  const s = sourceId.toLowerCase().trim();
  const clauses: string[] = [];
  const args: any[] = [];

  // 1. Exact sourceId in upstreamSignals
  clauses.push('raw_record_json LIKE ?');
  args.push(`%"sourceId":"${s}"%`);

  // 2. Vendor Security Disclosures
  if (s === 'vendor_php') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"ecosystem":"php"%');
    clauses.push('LOWER(title) LIKE ?');
    args.push('%php%');
  } else if (s === 'vendor_msrc' || s === 'csaf_microsoft' || s === 'vendor_microsoft') {
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"vendor_msrc"%');
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"vendor_msrc_eclipse"%');
    clauses.push('msrc_id IS NOT NULL');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"product":"microsoft%');
  } else if (s === 'vendor_redhat' || s === 'csaf_redhat') {
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"vendor_redhat"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"ecosystem":"red hat"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%rhsa-%');
  } else if (s === 'vendor_ubuntu' || s === 'osv_ubuntu') {
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"vendor_ubuntu"%');
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"osv_ubuntu"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%canonical%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%usn-%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"product":"ubuntu%');
  } else if (s === 'vendor_debian') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%debian%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%dsa-%');
  } else if (s === 'vendor_apple') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%apple%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%macos%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%ios%');
  } else if (s === 'vendor_google' || s === 'project_zero') {
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"project_zero"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"product":"google%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"product":"android%');
  } else if (s === 'vendor_apache') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"ecosystem":"apache"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%apache software foundation%');
  } else if (s === 'vendor_openssl') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%openssl%');
  } else if (s === 'vendor_linux_kernel') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%linux kernel%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"product":"kernel%');
  } else if (s === 'vendor_mozilla') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%mozilla%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%firefox%');
  } else if (s === 'vendor_vmware') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%vmware%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%esxi%');
  } else if (s === 'vendor_cisco' || s === 'csaf_cisco') {
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"vendor_cisco"%');
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"csaf_cisco"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"product":"cisco%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"ecosystem":"cisco%');
  } else if (s === 'vendor_oracle') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"product":"oracle%');
  } else if (s === 'vendor_nodejs') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"ecosystem":"npm"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%node.js%');
  } else if (s === 'vendor_rustsec' || s === 'osv_rustsec') {
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"osv_rustsec"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%"ecosystem":"crates.io"%');
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%rustsec%');
  }
  // 3. Authoritative Threat & Exploit Intelligence Feeds
  else if (s === 'cisa_kev') {
    clauses.push('is_known_exploited = 1');
  } else if (s === 'nvd_cve') {
    clauses.push("cve_list_json != '[]' AND cve_list_json IS NOT NULL");
  } else if (s === 'ghsa' || s === 'github_advisories') {
    clauses.push('ghsa_id IS NOT NULL');
  } else if (s === 'osv_dev') {
    clauses.push('osv_id IS NOT NULL');
  } else if (s === 'urlhaus') {
    clauses.push("uvi_id LIKE '%URLHAUS%'");
  } else if (s === 'threatfox') {
    clauses.push("uvi_id LIKE '%FOX%'");
  } else if (s === 'feodo_tracker') {
    clauses.push("uvi_id LIKE '%FEODO%'");
  } else if (s === 'openphish') {
    clauses.push("uvi_id LIKE '%PHISH%'");
  } else if (s === 'ipsum') {
    clauses.push("uvi_id LIKE '%IPSUM%'");
  } else if (s === 'cisco_talos') {
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"cisco_talos"%');
  } else if (s === 'emerging_threats' || s === 'et_open_rules') {
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"emerging_threats"%');
    clauses.push('raw_record_json LIKE ?');
    args.push('%"sourceId":"et_open_rules"%');
    clauses.push("uvi_id LIKE '%ET-%'");
  }
  // 4. Research, Bug Bounty & Practitioner Disclosures
  else if (s === 'krebs_security') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%krebs%');
  } else if (s === 'schneier_security') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%schneier%');
  } else if (s === 'portswigger_research') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%portswigger%');
  } else if (s === 'unit42_research') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%unit 42%');
  } else if (s === 'microsoft_threat_intel') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%msti%');
  } else if (s === 'trail_of_bits_vsix') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%trail of bits%');
  } else if (s === 'jfrog_research') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%jfrog%');
  } else if (s === 'aqua_nautilus') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%nautilus%');
  } else if (s === 'alienvault_otx') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%alienvault%');
  } else if (s === 'circl_misp') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%circl%');
  } else if (s === 'hackerone_hacktivity') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%hackerone%');
  } else if (s === 'bugcrowd_crowdstream') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%bugcrowd%');
  } else if (s === 'disclose_io' || s === 'bugbounty_disclosed_reports') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%disclose%');
  } else if (s === 'pentester_land') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%pentester land%');
  } else if (s === 'snyk_vulndb') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%snyk%');
  } else if (s === 'socket_dev') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%socket%');
  } else if (s === 'openssf_malicious') {
    clauses.push('LOWER(raw_record_json) LIKE ?');
    args.push('%openssf%');
  }

  return {
    sql: clauses.length === 1 ? clauses[0] : `(${clauses.join(' OR ')})`,
    args
  };
}

// In-memory matcher for consistent fallback behavior
export function matchesSourceInMemory(record: UviAdvisoryRecord, sourceId: string): boolean {
  const s = sourceId.toLowerCase().trim();
  const rawStr = JSON.stringify(record).toLowerCase();

  // 1. Direct upstream signal match
  if (record.upstreamSignals && record.upstreamSignals.some(sig => sig.sourceId.toLowerCase() === s)) {
    return true;
  }

  // 2. Vendor mappings
  if (s === 'vendor_php') {
    return rawStr.includes('"ecosystem":"php"') || Boolean(record.title && record.title.toLowerCase().includes('php'));
  }
  if (s === 'vendor_msrc' || s === 'csaf_microsoft' || s === 'vendor_microsoft') {
    return Boolean(record.msrcId) || rawStr.includes('vendor_msrc') || rawStr.includes('"product":"microsoft');
  }
  if (s === 'vendor_redhat' || s === 'csaf_redhat') {
    return rawStr.includes('vendor_redhat') || rawStr.includes('"ecosystem":"red hat"') || rawStr.includes('rhsa-');
  }
  if (s === 'vendor_ubuntu' || s === 'osv_ubuntu') {
    return rawStr.includes('canonical') || rawStr.includes('usn-') || rawStr.includes('"product":"ubuntu');
  }
  if (s === 'vendor_debian') {
    return rawStr.includes('debian') || rawStr.includes('dsa-');
  }
  if (s === 'vendor_apple') {
    return rawStr.includes('apple') || rawStr.includes('macos') || rawStr.includes('ios');
  }
  if (s === 'vendor_google' || s === 'project_zero') {
    return rawStr.includes('project_zero') || rawStr.includes('"product":"google') || rawStr.includes('"product":"android');
  }
  if (s === 'vendor_apache') {
    return rawStr.includes('"ecosystem":"apache"') || rawStr.includes('apache software foundation');
  }
  if (s === 'vendor_openssl') {
    return rawStr.includes('openssl');
  }
  if (s === 'vendor_linux_kernel') {
    return rawStr.includes('linux kernel') || rawStr.includes('"product":"kernel');
  }
  if (s === 'vendor_mozilla') {
    return rawStr.includes('mozilla') || rawStr.includes('firefox');
  }
  if (s === 'vendor_vmware') {
    return rawStr.includes('vmware') || rawStr.includes('esxi');
  }
  if (s === 'vendor_cisco' || s === 'csaf_cisco') {
    return rawStr.includes('vendor_cisco') || rawStr.includes('csaf_cisco') || rawStr.includes('"product":"cisco');
  }
  if (s === 'vendor_oracle') {
    return rawStr.includes('"product":"oracle');
  }
  if (s === 'vendor_nodejs') {
    return rawStr.includes('"ecosystem":"npm"') || rawStr.includes('node.js');
  }
  if (s === 'vendor_rustsec' || s === 'osv_rustsec') {
    return rawStr.includes('osv_rustsec') || rawStr.includes('"ecosystem":"crates.io"') || rawStr.includes('rustsec');
  }
  if (s === 'cisa_kev') {
    return Boolean(record.cisaKev?.isKnownExploited);
  }
  if (s === 'nvd_cve') {
    return Boolean(record.cveList && record.cveList.length > 0);
  }
  if (s === 'ghsa' || s === 'github_advisories') {
    return Boolean(record.ghsaId);
  }
  if (s === 'osv_dev') {
    return Boolean(record.osvId);
  }
  if (s === 'urlhaus') {
    return record.uviId.includes('URLHAUS') || rawStr.includes('urlhaus');
  }
  if (s === 'threatfox') {
    return record.uviId.includes('FOX') || rawStr.includes('threatfox');
  }
  if (s === 'feodo_tracker') {
    return record.uviId.includes('FEODO') || rawStr.includes('feodo_tracker');
  }
  if (s === 'openphish') {
    return record.uviId.includes('PHISH') || rawStr.includes('openphish');
  }
  if (s === 'ipsum') {
    return record.uviId.includes('IPSUM') || rawStr.includes('ipsum');
  }
  if (s === 'cisco_talos') {
    return rawStr.includes('cisco_talos');
  }
  if (s === 'emerging_threats' || s === 'et_open_rules') {
    return record.uviId.includes('ET-') || rawStr.includes('emerging_threats') || rawStr.includes('et_open_rules');
  }

  // 3. Research keywords fallback
  const keywords: Record<string, string> = {
    krebs_security: 'krebs',
    schneier_security: 'schneier',
    portswigger_research: 'portswigger',
    unit42_research: 'unit 42',
    microsoft_threat_intel: 'msti',
    trail_of_bits_vsix: 'trail of bits',
    jfrog_research: 'jfrog',
    aqua_nautilus: 'nautilus',
    alienvault_otx: 'alienvault',
    circl_misp: 'circl',
    hackerone_hacktivity: 'hackerone',
    bugcrowd_crowdstream: 'bugcrowd',
    disclose_io: 'disclose',
    pentester_land: 'pentester land',
    snyk_vulndb: 'snyk',
    socket_dev: 'socket',
    openssf_malicious: 'openssf'
  };

  if (keywords[s] && rawStr.includes(keywords[s])) {
    return true;
  }

  return false;
}

export async function queryThreatFeedFromDb(params: ThreatFeedQueryParams): Promise<ThreatFeedQueryResult> {
  const page = Math.max(1, params.page || 1);
  const isLimitAll = params.limit === 'all';
  const numLimit = isLimitAll ? 50000 : (typeof params.limit === 'number' ? params.limit : 50);
  const offset = isLimitAll ? 0 : (page - 1) * numLimit;

  try {
    const whereClauses: string[] = [];
    const args: any[] = [];

    // 1. ID Lookup
    if (params.id) {
      whereClauses.push('(UPPER(uvi_id) = ? OR UPPER(legacy_uvi_id) = ?)');
      args.push(params.id.toUpperCase(), params.id.toUpperCase());
    }

    // 2. CVE Lookup
    if (params.cve) {
      whereClauses.push('UPPER(cve_list_json) LIKE ?');
      args.push(`%${params.cve.toUpperCase()}%`);
    }

    // 3. Scope Filter
    if (params.scope === 'build-impact' || params.scope === 'dev') {
      whereClauses.push('has_direct_build_impact = 1');
    } else if (params.scope === 'non-cve' || params.scope === 'malware') {
      whereClauses.push("(cve_list_json = '[]' OR cve_list_json IS NULL) AND (disclosure_type != 'INFORMATIONAL_DISCLOSURE' OR disclosure_type IS NULL)");
    } else if (params.scope === 'informational' || params.scope === 'chatter' || params.scope === 'research' || params.scope === 'info') {
      whereClauses.push("disclosure_type = 'INFORMATIONAL_DISCLOSURE'");
    }

    // 4. Free-Text Search
    if (params.query) {
      const q = `%${params.query.toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(uvi_id) LIKE ? OR 
        LOWER(legacy_uvi_id) LIKE ? OR
        LOWER(title) LIKE ? OR 
        LOWER(headline) LIKE ? OR 
        LOWER(summary) LIKE ? OR 
        LOWER(technical_details) LIKE ? OR 
        LOWER(cve_list_json) LIKE ? OR 
        LOWER(domain_category) LIKE ? OR
        LOWER(workstation_vector) LIKE ? OR
        LOWER(raw_record_json) LIKE ?
      )`);
      args.push(q, q, q, q, q, q, q, q, q, q);
    }

    // 5. Source Feed Filter
    if (params.source && params.source.toUpperCase() !== 'ALL') {
      const sourceFilter = buildSourceFilterClause(params.source);
      whereClauses.push(sourceFilter.sql);
      args.push(...sourceFilter.args);
    }

    // 6. Category Filter
    if (params.category && params.category.toUpperCase() !== 'ALL') {
      const matchingFeeds = UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === params.category);
      if (matchingFeeds.length > 0) {
        const catClauses: string[] = [];
        for (const feed of matchingFeeds) {
          const sf = buildSourceFilterClause(feed.id);
          catClauses.push(sf.sql);
          args.push(...sf.args);
        }
        whereClauses.push(`(${catClauses.join(' OR ')})`);
      }
    }

    // 7. Severity Filter
    if (params.severity && params.severity !== 'ALL') {
      whereClauses.push('UPPER(severity) = ?');
      args.push(params.severity.toUpperCase());
    }

    // 8. Domain / Operational Filter
    const targetDomain = params.domain || params.action;
    if (targetDomain && targetDomain.toUpperCase() !== 'ALL' && targetDomain.toLowerCase() !== 'all domains') {
      const dUpper = targetDomain.toUpperCase();
      whereClauses.push('(UPPER(domain_category) = ? OR UPPER(operational_domain) = ? OR UPPER(action_directive) = ?)');
      args.push(dUpper, dUpper, dUpper);
    }

    // 9. KEV Only Filter
    if (params.kevOnly) {
      whereClauses.push('is_known_exploited = 1');
    }

    // 10. Stage & Horizon Filter
    if (params.stage && params.stage !== 'ALL') {
      whereClauses.push('UPPER(weaponization_stage) = ?');
      args.push(params.stage.toUpperCase());
    }
    if (params.horizon && params.horizon !== 'ALL') {
      whereClauses.push('UPPER(exposure_horizon) = ?');
      args.push(params.horizon.toUpperCase());
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Sorting
    let orderSql = 'ORDER BY cvss_score DESC, published_date DESC';
    if (params.sortBy === 'published_desc' || params.sortBy === 'date_desc' || params.sortBy === 'newest') {
      orderSql = 'ORDER BY published_date DESC, cvss_score DESC';
    } else if (params.sortBy === 'published_asc' || params.sortBy === 'date_asc' || params.sortBy === 'oldest') {
      orderSql = 'ORDER BY published_date ASC, cvss_score DESC';
    } else if (params.sortBy === 'uvi_desc') {
      orderSql = 'ORDER BY uvi_id DESC';
    } else if (params.sortBy === 'uvi_asc') {
      orderSql = 'ORDER BY uvi_id ASC';
    }

    // Execute count query & paginated select in parallel
    const [countRes, dataRes, metrics] = await Promise.all([
      client.execute({
        sql: `SELECT count(*) as count FROM uvi_threats ${whereSql}`,
        args
      }),
      client.execute({
        sql: `SELECT raw_record_json FROM uvi_threats ${whereSql} ${orderSql} LIMIT ? OFFSET ?`,
        args: [...args, numLimit, offset]
      }),
      getDbThreatMetrics()
    ]);

    const totalMatched = Number(countRes.rows[0]?.count ?? 0);

    const advisories: UviAdvisoryRecord[] = [];
    if (dataRes.rows && dataRes.rows.length > 0) {
      for (const row of dataRes.rows) {
        if (row.raw_record_json && typeof row.raw_record_json === 'string') {
          try {
            advisories.push(JSON.parse(row.raw_record_json));
          } catch {}
        }
      }
    }

    const totalPages = isLimitAll ? 1 : (totalMatched > 0 ? Math.ceil(totalMatched / numLimit) : 0);

    return {
      advisories,
      totalMatched,
      totalPages,
      page,
      limit: params.limit || 50,
      totalConsolidatedCount: metrics.totalCount || totalMatched,
      directBuildImpactCount: metrics.directBuildImpactCount,
      nonCveThreatsCount: metrics.nonCveCount,
      informationalDisclosuresCount: metrics.infoCount,
      source: 'database'
    };
  } catch (err) {
    console.warn('Database query error, falling back to in-memory aggregator:', err);
  }

  // Fallback: in-memory aggregator
  const allRecords = await getAggregatedUviAdvisories();
  const globalMetrics = await getGlobalRegistryMetrics();
  let filtered = [...allRecords];

  if (params.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(f => 
      f.title.toLowerCase().includes(q) || 
      f.summary.toLowerCase().includes(q) || 
      f.uviId.toLowerCase().includes(q) ||
      (f.legacyUviId && f.legacyUviId.toLowerCase().includes(q)) ||
      (f.headline && f.headline.toLowerCase().includes(q)) ||
      (f.technicalDetails && f.technicalDetails.toLowerCase().includes(q)) ||
      (f.cveList && f.cveList.some(c => c.toLowerCase().includes(q))) ||
      (f.affectedTargets && f.affectedTargets.some(t => t.product.toLowerCase().includes(q) || t.ecosystem.toLowerCase().includes(q))) ||
      (f.upstreamSignals && f.upstreamSignals.some(s => s.sourceName.toLowerCase().includes(q) || s.badge.toLowerCase().includes(q) || s.sourceId.toLowerCase().includes(q)))
    );
  }
  if (params.source && params.source.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(f => matchesSourceInMemory(f, params.source!));
  }
  if (params.category && params.category.toUpperCase() !== 'ALL') {
    const matchingFeedIds = UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === params.category).map(f => f.id);
    filtered = filtered.filter(f => matchingFeedIds.some(fid => matchesSourceInMemory(f, fid)));
  }
  if (params.scope === 'build-impact' || params.scope === 'dev') {
    filtered = filtered.filter(f => f.ideBuildImpact.hasDirectBuildImpact);
  }

  const totalMatched = filtered.length;
  const totalPages = isLimitAll ? 1 : Math.ceil(totalMatched / numLimit);
  const paginated = isLimitAll ? filtered : filtered.slice(offset, offset + numLimit);

  // Trigger background sync if DB was empty
  syncUviThreatsToDb(false).catch(() => {});

  return {
    advisories: paginated,
    totalMatched,
    totalPages,
    page,
    limit: params.limit || 50,
    totalConsolidatedCount: globalMetrics.totalConsolidatedCount,
    directBuildImpactCount: globalMetrics.directBuildImpactCount,
    nonCveThreatsCount: globalMetrics.nonCveThreatsCount,
    informationalDisclosuresCount: globalMetrics.informationalDisclosuresCount,
    source: 'memory_fallback'
  };
}
