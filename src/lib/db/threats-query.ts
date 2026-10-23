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
      whereClauses.push('raw_record_json LIKE ?');
      args.push(`%"sourceId":"${params.source}"%`);
    }

    // 6. Category Filter
    if (params.category && params.category.toUpperCase() !== 'ALL') {
      const matchingFeeds = UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === params.category);
      if (matchingFeeds.length > 0) {
        const feedLikes = matchingFeeds.map(() => 'raw_record_json LIKE ?').join(' OR ');
        whereClauses.push(`(${feedLikes})`);
        for (const feed of matchingFeeds) {
          args.push(`%"sourceId":"${feed.id}"%`);
        }
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

    if (totalMatched > 0 && dataRes.rows && dataRes.rows.length > 0) {
      const advisories: UviAdvisoryRecord[] = [];
      for (const row of dataRes.rows) {
        if (row.raw_record_json && typeof row.raw_record_json === 'string') {
          try {
            advisories.push(JSON.parse(row.raw_record_json));
          } catch {}
        }
      }

      const totalPages = isLimitAll ? 1 : Math.ceil(totalMatched / numLimit);

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
    }
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
    const s = params.source.toLowerCase();
    filtered = filtered.filter(f => f.upstreamSignals && f.upstreamSignals.some(sig => sig.sourceId.toLowerCase() === s));
  }
  if (params.category && params.category.toUpperCase() !== 'ALL') {
    const matchingFeedIds = new Set(UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === params.category).map(f => f.id.toLowerCase()));
    filtered = filtered.filter(f => f.upstreamSignals && f.upstreamSignals.some(sig => matchingFeedIds.has(sig.sourceId.toLowerCase())));
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
