import { db, client, uviThreats, uviSyncLogs } from './index';
import { initializeDatabase } from './init';
import { getAggregatedUviAdvisories } from '../feed-aggregator';
import { getRecordObservationalAssessment, UviAdvisoryRecord } from '../threat-feed-data';
import { sql } from 'drizzle-orm';

let isSyncing = false;
let lastSyncTimestamp = 0;

export interface ThreatSyncResult {
  success: boolean;
  totalSynced: number;
  directBuildImpactCount: number;
  nonCveThreatsCount: number;
  informationalDisclosuresCount: number;
  durationMs: number;
  error?: string;
}

export async function getDbThreatMetrics(): Promise<{
  totalCount: number;
  directBuildImpactCount: number;
  nonCveCount: number;
  infoCount: number;
}> {
  try {
    const totalRes = await client.execute('SELECT count(*) as count FROM uvi_threats');
    const directRes = await client.execute('SELECT count(*) as count FROM uvi_threats WHERE has_direct_build_impact = 1');
    const nonCveRes = await client.execute("SELECT count(*) as count FROM uvi_threats WHERE (cve_list_json = '[]' OR cve_list_json IS NULL) AND (disclosure_type != 'INFORMATIONAL_DISCLOSURE' OR disclosure_type IS NULL)");
    const infoRes = await client.execute("SELECT count(*) as count FROM uvi_threats WHERE disclosure_type = 'INFORMATIONAL_DISCLOSURE'");

    return {
      totalCount: Number(totalRes.rows[0]?.count ?? 0),
      directBuildImpactCount: Number(directRes.rows[0]?.count ?? 0),
      nonCveCount: Number(nonCveRes.rows[0]?.count ?? 0),
      infoCount: Number(infoRes.rows[0]?.count ?? 0),
    };
  } catch {
    return { totalCount: 0, directBuildImpactCount: 0, nonCveCount: 0, infoCount: 0 };
  }
}

export async function syncUviThreatsToDb(force = false): Promise<ThreatSyncResult> {
  if (isSyncing) {
    return {
      success: true,
      totalSynced: 0,
      directBuildImpactCount: 0,
      nonCveThreatsCount: 0,
      informationalDisclosuresCount: 0,
      durationMs: 0,
      error: 'Sync is currently already in progress'
    };
  }

  const now = Date.now();
  // Throttle automatic syncs to once every 30 minutes unless forced
  if (!force && now - lastSyncTimestamp < 30 * 60 * 1000) {
    const metrics = await getDbThreatMetrics();
    if (metrics.totalCount > 1000) {
      return {
        success: true,
        totalSynced: metrics.totalCount,
        directBuildImpactCount: metrics.directBuildImpactCount,
        nonCveThreatsCount: metrics.nonCveCount,
        informationalDisclosuresCount: metrics.infoCount,
        durationMs: 0
      };
    }
  }

  isSyncing = true;
  const startTime = Date.now();

  try {
    // 1. Ensure database tables and indexes exist
    await initializeDatabase();

    // 2. Aggregate all live feeds into standardized memory records
    const advisories = await getAggregatedUviAdvisories();
    if (!advisories || advisories.length === 0) {
      throw new Error('Feed aggregator returned zero advisories');
    }

    // On force sync, clear table to cleanly reload fresh schema & IDs
    if (force) {
      await client.execute('DELETE FROM uvi_threats');
    }

    // 3. Batch insert in chunks of 100
    const CHUNK_SIZE = 100;
    let syncedCount = 0;

    for (let i = 0; i < advisories.length; i += CHUNK_SIZE) {
      const chunk = advisories.slice(i, i + CHUNK_SIZE);
      const valuesToInsert = chunk.map((item: UviAdvisoryRecord) => {
        const obs = getRecordObservationalAssessment(item);
        const normalizedUviId = item.uviId?.startsWith('UVI-') ? item.uviId : `UVI-${item.uviId || '2026-ADVISORY'}`;
        const itemToSave = { ...item, uviId: normalizedUviId };
        return {
          uviId: normalizedUviId,
          legacyUviId: item.legacyUviId || null,
          title: item.title,
          headline: item.headline,
          summary: item.summary,
          technicalDetails: item.technicalDetails || null,
          globalImpact: item.globalImpact || null,
          severity: item.severity,
          cvssScore: item.cvssScore || 0,
          cvssVector: item.cvssVector || null,
          cwe: item.cwe || null,
          domainCategory: item.domainCategory,
          attackVector: item.attackVector || null,
          attackComplexity: item.attackComplexity || null,
          privilegesRequired: item.privilegesRequired || null,
          userInteraction: item.userInteraction || null,
          scope: item.scope || null,
          cveListJson: JSON.stringify(item.cveList || []),
          ghsaId: item.ghsaId || null,
          osvId: item.osvId || null,
          msrcId: item.msrcId || null,
          hasDirectBuildImpact: item.ideBuildImpact?.hasDirectBuildImpact ? 1 : 0,
          workstationVector: item.ideBuildImpact?.workstationVector || null,
          buildPipelineRisk: item.ideBuildImpact?.buildPipelineRisk || null,
          recommendationForIdeBuilds: item.ideBuildImpact?.recommendationForIdeBuilds || null,
          isKnownExploited: item.cisaKev?.isKnownExploited ? 1 : 0,
          ransomwareUse: item.cisaKev?.ransomwareUse ? 1 : 0,
          disclosureType: item.disclosureType || null,
          operationalDomain: obs.operationalDomain || null,
          actionDirective: obs.actionDirective || null,
          weaponizationStage: obs.weaponizationStage || null,
          exposureHorizon: obs.exposureHorizon || null,
          publishedDate: item.publishedDate || '2026-09-01',
          lastUpdatedDate: item.lastUpdatedDate || '2026-09-01',
          rawRecordJson: JSON.stringify(itemToSave),
          ingestedAt: new Date()
        };
      });

      await db.insert(uviThreats)
        .values(valuesToInsert)
        .onConflictDoUpdate({
          target: uviThreats.uviId,
          set: {
            title: sql`excluded.title`,
            headline: sql`excluded.headline`,
            summary: sql`excluded.summary`,
            technicalDetails: sql`excluded.technical_details`,
            globalImpact: sql`excluded.global_impact`,
            severity: sql`excluded.severity`,
            cvssScore: sql`excluded.cvss_score`,
            cvssVector: sql`excluded.cvss_vector`,
            cwe: sql`excluded.cwe`,
            domainCategory: sql`excluded.domain_category`,
            cveListJson: sql`excluded.cve_list_json`,
            hasDirectBuildImpact: sql`excluded.has_direct_build_impact`,
            isKnownExploited: sql`excluded.is_known_exploited`,
            operationalDomain: sql`excluded.operational_domain`,
            actionDirective: sql`excluded.action_directive`,
            weaponizationStage: sql`excluded.weaponization_stage`,
            exposureHorizon: sql`excluded.exposure_horizon`,
            publishedDate: sql`excluded.published_date`,
            lastUpdatedDate: sql`excluded.last_updated_date`,
            rawRecordJson: sql`excluded.raw_record_json`,
            ingestedAt: sql`excluded.ingested_at`
          }
        });

      syncedCount += chunk.length;
    }

    const durationMs = Date.now() - startTime;
    const directCount = advisories.filter(a => a.ideBuildImpact?.hasDirectBuildImpact).length;
    const nonCveCount = advisories.filter(a => a.cveList?.length === 0 && a.disclosureType !== 'INFORMATIONAL_DISCLOSURE').length;
    const infoCount = advisories.filter(a => a.disclosureType === 'INFORMATIONAL_DISCLOSURE').length;

    // 4. Log to uvi_sync_logs
    await db.insert(uviSyncLogs).values({
      id: `sync_${Date.now()}`,
      status: 'SUCCESS',
      totalRecords: syncedCount,
      directBuildImpactCount: directCount,
      nonCveThreatsCount: nonCveCount,
      informationalDisclosuresCount: infoCount,
      durationMs,
      detailsJson: JSON.stringify({
        sourcesCount: 111,
        totalParsed: advisories.length,
        syncedRecords: syncedCount
      }),
      syncedAt: new Date()
    });

    lastSyncTimestamp = Date.now();

    return {
      success: true,
      totalSynced: syncedCount,
      directBuildImpactCount: directCount,
      nonCveThreatsCount: nonCveCount,
      informationalDisclosuresCount: infoCount,
      durationMs
    };
  } catch (err: any) {
    console.error('Failed to sync Vantage threats to Turso database:', err);
    return {
      success: false,
      totalSynced: 0,
      directBuildImpactCount: 0,
      nonCveThreatsCount: 0,
      informationalDisclosuresCount: 0,
      durationMs: Date.now() - startTime,
      error: err?.message || String(err)
    };
  } finally {
    isSyncing = false;
  }
}
