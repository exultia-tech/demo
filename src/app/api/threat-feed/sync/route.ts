import { NextResponse } from 'next/server';
import { syncUviThreatsToDb, getDbThreatMetrics } from '@/lib/db/sync-threats';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const metrics = await getDbThreatMetrics();
    return NextResponse.json({
      status: 'online',
      source: 'Turso LibSQL Database',
      databaseCounts: {
        totalRecords: metrics.totalCount,
        directBuildImpact: metrics.directBuildImpactCount,
        nonCveThreats: metrics.nonCveCount,
        informationalDisclosures: metrics.infoCount
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to get sync metrics' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { force } = await req.json().catch(() => ({ force: false }));
    const result = await syncUviThreatsToDb(Boolean(force));
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sync failed' }, { status: 500 });
  }
}
