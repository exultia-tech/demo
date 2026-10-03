import { NextResponse } from 'next/server';
import { getPayPalPublicConfig } from '@/lib/billing/paypal';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = getPayPalPublicConfig();
  return NextResponse.json(config);
}
