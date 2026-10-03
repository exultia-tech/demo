import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const OPERATOR_COOKIE_NAME = 'exultia_operator_key';
export const DEFAULT_OPERATOR_KEY = 'exultia-preview-2026';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get('key');
  const returnUrl = searchParams.get('returnUrl') || '/';

  const expectedKey = process.env.OPERATOR_PREVIEW_KEY || DEFAULT_OPERATOR_KEY;

  if (key && key.trim() === expectedKey.trim()) {
    const res = NextResponse.redirect(new URL(returnUrl, req.url));
    res.cookies.set(OPERATOR_COOKIE_NAME, expectedKey, {
      httpOnly: false, // accessible to client for banner status
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  }

  return NextResponse.redirect(new URL('/preview?error=invalid_key', req.url));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const key = body.key;
    const expectedKey = process.env.OPERATOR_PREVIEW_KEY || DEFAULT_OPERATOR_KEY;

    if (key && key.trim() === expectedKey.trim()) {
      const res = NextResponse.json({ success: true, redirect: '/' });
      res.cookies.set(OPERATOR_COOKIE_NAME, expectedKey, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return res;
    }

    return NextResponse.json({ success: false, error: 'Invalid operator authorization passkey.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Authentication error' }, { status: 500 });
  }
}
