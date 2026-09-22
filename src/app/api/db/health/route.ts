import { NextResponse } from 'next/server';
import { client } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isConfigured = Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

  if (!isConfigured) {
    return NextResponse.json({
      status: 'unconfigured',
      configured: false,
      message: 'TURSO_DATABASE_URL and/or TURSO_AUTH_TOKEN environment variables are missing.',
      instructions: 'Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to .env.local locally or in Vercel Project Settings.',
    });
  }

  try {
    const startTime = Date.now();
    const result = await client.execute("SELECT 1 as is_connected, datetime('now') as db_time");
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'connected',
      configured: true,
      latencyMs,
      message: 'Successfully connected to Turso database!',
      details: result.rows,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      status: 'error',
      configured: true,
      message: `Failed to query Turso: ${errorMessage}`,
    }, { status: 500 });
  }
}
