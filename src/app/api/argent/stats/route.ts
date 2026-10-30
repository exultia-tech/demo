import { NextResponse } from 'next/server';
import { getArgentStats } from '@/lib/argent-feed';
import { getDbArgentMetrics, syncArgentPatchesToDb } from '@/lib/db/sync-argent';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = getArgentStats();
  try {
    let dbMetrics = await getDbArgentMetrics();
    if (dbMetrics.totalCount === 0) {
      await syncArgentPatchesToDb(false);
      dbMetrics = await getDbArgentMetrics();
    }
    if (dbMetrics.totalCount > 0) {
      return NextResponse.json({
        ...stats,
        totalBundles: dbMetrics.totalCount,
        bugfixCount: dbMetrics.bugfixCount,
        enhancementCount: dbMetrics.enhancementCount,
        maintenanceCount: dbMetrics.maintenanceCount,
        generalCount: dbMetrics.generalCount,
        zeroDowntimeCount: dbMetrics.zeroDowntimeCount,
        rebootRequiredCount: dbMetrics.rebootRequiredCount,
        dataSource: 'database'
      });
    }
  } catch {}
  return NextResponse.json({ ...stats, dataSource: 'memory_fallback' });
}
