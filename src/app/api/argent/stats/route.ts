import { NextResponse } from 'next/server';
import { getArgentStats } from '@/lib/argent-feed';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = getArgentStats();
  return NextResponse.json(stats);
}
