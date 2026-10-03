import { NextRequest, NextResponse } from 'next/server';
import { OPERATOR_COOKIE_NAME } from '../unlock/route';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/preview', req.url));
  res.cookies.delete(OPERATOR_COOKIE_NAME);
  return res;
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true, redirect: '/preview' });
  res.cookies.delete(OPERATOR_COOKIE_NAME);
  return res;
}
