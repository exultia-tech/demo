import { db, client, argentPatches, argentSyncLogs } from './index';
import { initializeDatabase } from './init';
import {
  ARGENT_PATCH_BUNDLES,
  ARGENT_PUBLIC_FEED_SOURCES,
  ArgentPatchBundle,
  ArgentQueryFilters,
  ArgentQueryResult,
  ArgentStats,
  normalizeArgentBundle,
  normalizeArgentId,
  getArgentBundles,
  getArgentStats
} from '../argent-feed';
import { sql } from 'drizzle-orm';

let isSyncing = false;
let lastSyncTimestamp = 0;

export interface ArgentSyncResult {
  success: boolean;
  totalSynced: number;
  bugfixCount: number;
  enhancementCount: number;
  maintenanceCount: number;
  generalCount: number;
  zeroDowntimeCount: number;
  rebootRequiredCount: number;
  durationMs: number;
  error?: string;
}

export async function getDbArgentMetrics(): Promise<{
  totalCount: number;
  bugfixCount: number;
  enhancementCount: number;
  maintenanceCount: number;
  generalCount: number;
  zeroDowntimeCount: number;
  rebootRequiredCount: number;
}> {
  try {
    const [totalRes, bugRes, enhRes, maintRes, genRes, zdRes, rbRes] = await Promise.all([
      client.execute('SELECT count(*) as count FROM argent_patches'),
      client.execute("SELECT count(*) as count FROM argent_patches WHERE advisory_type = 'BUGFIX'"),
      client.execute("SELECT count(*) as count FROM argent_patches WHERE advisory_type = 'ENHANCEMENT'"),
      client.execute("SELECT count(*) as count FROM argent_patches WHERE advisory_type = 'MAINTENANCE'"),
      client.execute("SELECT count(*) as count FROM argent_patches WHERE advisory_type = 'GENERAL'"),
      client.execute('SELECT count(*) as count FROM argent_patches WHERE zero_downtime = 1'),
      client.execute('SELECT count(*) as count FROM argent_patches WHERE reboot_required = 1')
    ]);

    return {
      totalCount: Number(totalRes.rows[0]?.count ?? 0),
      bugfixCount: Number(bugRes.rows[0]?.count ?? 0),
      enhancementCount: Number(enhRes.rows[0]?.count ?? 0),
      maintenanceCount: Number(maintRes.rows[0]?.count ?? 0),
      generalCount: Number(genRes.rows[0]?.count ?? 0),
      zeroDowntimeCount: Number(zdRes.rows[0]?.count ?? 0),
      rebootRequiredCount: Number(rbRes.rows[0]?.count ?? 0)
    };
  } catch {
    return {
      totalCount: 0,
      bugfixCount: 0,
      enhancementCount: 0,
      maintenanceCount: 0,
      generalCount: 0,
      zeroDowntimeCount: 0,
      rebootRequiredCount: 0
    };
  }
}

export async function syncArgentPatchesToDb(force: boolean = false): Promise<ArgentSyncResult> {
  const startTime = Date.now();
  if (isSyncing) {
    return {
      success: false,
      totalSynced: 0,
      bugfixCount: 0,
      enhancementCount: 0,
      maintenanceCount: 0,
      generalCount: 0,
      zeroDowntimeCount: 0,
      rebootRequiredCount: 0,
      durationMs: 0,
      error: 'Argent sync already in progress'
    };
  }

  try {
    isSyncing = true;
    await initializeDatabase();

    if (!force) {
      const metrics = await getDbArgentMetrics();
      const fifteenMinutes = 15 * 60 * 1000;
      if (metrics.totalCount >= ARGENT_PATCH_BUNDLES.length && (Date.now() - lastSyncTimestamp < fifteenMinutes || lastSyncTimestamp === 0)) {
        lastSyncTimestamp = Date.now();
        return {
          success: true,
          totalSynced: metrics.totalCount,
          bugfixCount: metrics.bugfixCount,
          enhancementCount: metrics.enhancementCount,
          maintenanceCount: metrics.maintenanceCount,
          generalCount: metrics.generalCount,
          zeroDowntimeCount: metrics.zeroDowntimeCount,
          rebootRequiredCount: metrics.rebootRequiredCount,
          durationMs: Date.now() - startTime
        };
      }
    }

    const bundles = ARGENT_PATCH_BUNDLES.map(normalizeArgentBundle);
    const CHUNK_SIZE = 50;
    let syncedCount = 0;

    for (let i = 0; i < bundles.length; i += CHUNK_SIZE) {
      const chunk = bundles.slice(i, i + CHUNK_SIZE);
      const valuesToInsert = chunk.map((item: ArgentPatchBundle) => {
        const normalized = normalizeArgentBundle(item);
        return {
          argId: normalized.id,
          bundleId: normalized.bundleId,
          advisoryType: normalized.advisoryType,
          os: normalized.os,
          osFamily: normalized.osFamily,
          osDisplayName: normalized.osDisplayName,
          title: normalized.title,
          synopsis: normalized.synopsis,
          vendorSeverity: normalized.vendorSeverity,
          severityScore: normalized.severityScore ?? 0,
          operationalDomain: normalized.operationalDomain,
          actionDirective: normalized.actionDirective,
          issuedAt: normalized.issuedAt,
          updatedAt: normalized.updatedAt,
          cveListJson: JSON.stringify(normalized.cveList || []),
          targetReleasesJson: JSON.stringify(normalized.targetReleases || []),
          packagesJson: JSON.stringify(normalized.packages || []),
          rebootRequired: normalized.impact?.rebootRequired ? 1 : 0,
          zeroDowntime: normalized.impact?.zeroDowntime ? 1 : 0,
          nativeUpgradeCmd: normalized.commands?.nativeUpgrade || null,
          verificationCmd: normalized.commands?.verification || null,
          rollbackCmd: normalized.commands?.rollback || null,
          kineticDeployCmd: normalized.commands?.kineticDeploy || null,
          upstreamNoticeUrl: normalized.upstreamNoticeUrl || null,
          sourceFeedId: normalized.sourceFeed?.sourceId || null,
          sourceFeedName: normalized.sourceFeed?.feedName || null,
          rawRecordJson: JSON.stringify(normalized),
          ingestedAt: new Date()
        };
      });

      await db.insert(argentPatches)
        .values(valuesToInsert)
        .onConflictDoUpdate({
          target: argentPatches.argId,
          set: {
            bundleId: sql`excluded.bundle_id`,
            advisoryType: sql`excluded.advisory_type`,
            os: sql`excluded.os`,
            osFamily: sql`excluded.os_family`,
            osDisplayName: sql`excluded.os_display_name`,
            title: sql`excluded.title`,
            synopsis: sql`excluded.synopsis`,
            vendorSeverity: sql`excluded.vendor_severity`,
            severityScore: sql`excluded.severity_score`,
            operationalDomain: sql`excluded.operational_domain`,
            actionDirective: sql`excluded.action_directive`,
            issuedAt: sql`excluded.issued_at`,
            updatedAt: sql`excluded.updated_at`,
            cveListJson: sql`excluded.cve_list_json`,
            targetReleasesJson: sql`excluded.target_releases_json`,
            packagesJson: sql`excluded.packages_json`,
            rebootRequired: sql`excluded.reboot_required`,
            zeroDowntime: sql`excluded.zero_downtime`,
            nativeUpgradeCmd: sql`excluded.native_upgrade_cmd`,
            verificationCmd: sql`excluded.verification_cmd`,
            rollbackCmd: sql`excluded.rollback_cmd`,
            kineticDeployCmd: sql`excluded.kinetic_deploy_cmd`,
            upstreamNoticeUrl: sql`excluded.upstream_notice_url`,
            sourceFeedId: sql`excluded.source_feed_id`,
            sourceFeedName: sql`excluded.source_feed_name`,
            rawRecordJson: sql`excluded.raw_record_json`,
            ingestedAt: sql`excluded.ingested_at`
          }
        });

      syncedCount += chunk.length;
    }

    const durationMs = Date.now() - startTime;
    const bugfixCount = bundles.filter(b => b.advisoryType === 'BUGFIX').length;
    const enhancementCount = bundles.filter(b => b.advisoryType === 'ENHANCEMENT').length;
    const maintenanceCount = bundles.filter(b => b.advisoryType === 'MAINTENANCE').length;
    const generalCount = bundles.filter(b => b.advisoryType === 'GENERAL').length;
    const zeroDowntimeCount = bundles.filter(b => b.impact.zeroDowntime).length;
    const rebootRequiredCount = bundles.filter(b => b.impact.rebootRequired).length;

    await db.insert(argentSyncLogs).values({
      id: `argent_sync_${Date.now()}`,
      status: 'SUCCESS',
      totalRecords: syncedCount,
      bugfixCount,
      enhancementCount,
      maintenanceCount,
      generalCount,
      zeroDowntimeCount,
      rebootRequiredCount,
      durationMs,
      detailsJson: JSON.stringify({
        sourcesCount: ARGENT_PUBLIC_FEED_SOURCES.length,
        totalParsed: bundles.length,
        syncedRecords: syncedCount
      }),
      syncedAt: new Date()
    });

    lastSyncTimestamp = Date.now();

    return {
      success: true,
      totalSynced: syncedCount,
      bugfixCount,
      enhancementCount,
      maintenanceCount,
      generalCount,
      zeroDowntimeCount,
      rebootRequiredCount,
      durationMs
    };
  } catch (err: any) {
    console.error('Failed to sync Argent patches to Turso database:', err);
    return {
      success: false,
      totalSynced: 0,
      bugfixCount: 0,
      enhancementCount: 0,
      maintenanceCount: 0,
      generalCount: 0,
      zeroDowntimeCount: 0,
      rebootRequiredCount: 0,
      durationMs: Date.now() - startTime,
      error: err?.message || String(err)
    };
  } finally {
    isSyncing = false;
  }
}

export async function queryArgentFeedFromDb(
  filters: ArgentQueryFilters = {}
): Promise<ArgentQueryResult & { dataSource: 'database' | 'memory_fallback' }> {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 25));
  const offset = (page - 1) * limit;

  try {
    // Ensure DB has all static curated records; if empty or fewer than curated catalog, sync synchronously
    const metrics = await getDbArgentMetrics();
    if (metrics.totalCount < ARGENT_PATCH_BUNDLES.length) {
      await syncArgentPatchesToDb(true);
    }

    const whereClauses: string[] = [];
    const args: any[] = [];

    if (filters.id) {
      const normId = normalizeArgentId(filters.id).toUpperCase();
      const rawId = filters.id.toUpperCase();
      whereClauses.push('(UPPER(arg_id) = ? OR UPPER(bundle_id) = ?)');
      args.push(normId, rawId);
    }

    if (filters.scope === 'ZERO_REBOOT') {
      whereClauses.push('zero_downtime = 1');
    } else if (filters.scope === 'KERNEL_CORE') {
      whereClauses.push("(operational_domain = 'KERNEL' OR operational_domain = 'CORE')");
    } else if (filters.scope === 'ENTERPRISE_LTS') {
      whereClauses.push("os IN ('ubuntu', 'rocky', 'rhel', 'debian', 'almalinux', 'oracle-linux', 'suse', 'openeuler', 'cloudlinux')");
    }

    const typeFilter = (filters.type || filters.advisoryType || 'all').toUpperCase();
    if (typeFilter !== 'ALL') {
      whereClauses.push('UPPER(advisory_type) = ?');
      args.push(typeFilter);
    }

    if (filters.os && filters.os.toLowerCase() !== 'all') {
      const targetOs = filters.os.toLowerCase();
      whereClauses.push('(LOWER(os) = ? OR LOWER(os_family) = ?)');
      args.push(targetOs, targetOs);
    }

    if (filters.source && filters.source.toUpperCase() !== 'ALL') {
      whereClauses.push('source_feed_id = ?');
      args.push(filters.source);
    }

    if (filters.severity && filters.severity.toLowerCase() !== 'all') {
      whereClauses.push('UPPER(vendor_severity) = ?');
      args.push(filters.severity.toUpperCase());
    }

    if (filters.domain && filters.domain.toUpperCase() !== 'ALL') {
      const targetDom = filters.domain.toUpperCase();
      whereClauses.push('(UPPER(operational_domain) = ? OR UPPER(action_directive) = ?)');
      args.push(targetDom, targetDom);
    }

    if (filters.reboot !== undefined) {
      const wantReboot = filters.reboot === true || filters.reboot === 'true';
      whereClauses.push('reboot_required = ?');
      args.push(wantReboot ? 1 : 0);
    }

    if (filters.release && filters.release.trim()) {
      whereClauses.push('LOWER(target_releases_json) LIKE ?');
      args.push(`%${filters.release.trim().toLowerCase()}%`);
    }

    if (filters.query && filters.query.trim()) {
      const q = `%${filters.query.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(arg_id) LIKE ? OR
        LOWER(bundle_id) LIKE ? OR
        LOWER(title) LIKE ? OR
        LOWER(synopsis) LIKE ? OR
        LOWER(os_display_name) LIKE ? OR
        LOWER(advisory_type) LIKE ? OR
        LOWER(packages_json) LIKE ?
      )`);
      args.push(q, q, q, q, q, q, q);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderSql = 'ORDER BY issued_at DESC, severity_score DESC';
    const sortBy = filters.sortBy || 'date_desc';
    if (sortBy === 'cvss_desc') {
      orderSql = 'ORDER BY severity_score DESC, issued_at DESC';
    } else if (sortBy === 'date_desc' || (sortBy as string) === 'published_desc') {
      orderSql = 'ORDER BY issued_at DESC';
    } else if (sortBy === 'date_asc' || (sortBy as string) === 'published_asc') {
      orderSql = 'ORDER BY issued_at ASC';
    } else if (sortBy === 'id_asc') {
      orderSql = 'ORDER BY arg_id ASC';
    } else if (sortBy === 'id_desc') {
      orderSql = 'ORDER BY arg_id DESC';
    }

    const [countRes, dataRes, latestMetrics] = await Promise.all([
      client.execute({
        sql: `SELECT count(*) as count FROM argent_patches ${whereSql}`,
        args
      }),
      client.execute({
        sql: `SELECT raw_record_json FROM argent_patches ${whereSql} ${orderSql} LIMIT ? OFFSET ?`,
        args: [...args, limit, offset]
      }),
      getDbArgentMetrics()
    ]);

    const totalMatched = Number(countRes.rows[0]?.count ?? 0);
    if (latestMetrics.totalCount > 0) {
      const bundles: ArgentPatchBundle[] = [];
      for (const row of dataRes.rows) {
        if (row.raw_record_json && typeof row.raw_record_json === 'string') {
          try {
            const parsed = JSON.parse(row.raw_record_json);
            if (parsed && typeof parsed === 'object') {
              bundles.push(normalizeArgentBundle(parsed));
            }
          } catch {}
        }
      }

      const totalPages = Math.ceil(totalMatched / limit) || 1;
      const totalPackagesUpdated = ARGENT_PATCH_BUNDLES.reduce((acc, b) => acc + b.packages.length, 0);

      return {
        total: totalMatched,
        page,
        limit,
        totalPages,
        totalConsolidatedCount: latestMetrics.totalCount,
        bugfixCount: latestMetrics.bugfixCount,
        enhancementCount: latestMetrics.enhancementCount,
        maintenanceCount: latestMetrics.maintenanceCount,
        generalCount: latestMetrics.generalCount,
        zeroDowntimeCount: latestMetrics.zeroDowntimeCount,
        rebootRequiredCount: latestMetrics.rebootRequiredCount,
        totalPackagesUpdated,
        bundles,
        dataSource: 'database'
      };
    }
  } catch (err) {
    console.warn('Argent Turso DB query fallback to in-memory:', err);
  }

  const fallback = getArgentBundles(filters);
  syncArgentPatchesToDb(false).catch(() => {});
  return {
    ...fallback,
    dataSource: 'memory_fallback'
  };
}

