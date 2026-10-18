import { NextResponse } from 'next/server';
import { ARGENT_PUBLIC_FEED_SOURCES } from '@/lib/argent-feed';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    totalSources: ARGENT_PUBLIC_FEED_SOURCES.length,
    status: 'healthy',
    sources: ARGENT_PUBLIC_FEED_SOURCES
  });
}
