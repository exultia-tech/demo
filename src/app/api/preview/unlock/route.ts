import { NextRequest, NextResponse } from 'next/server';
import { createEnterpriseGuestToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export const OPERATOR_COOKIE_NAME = 'exultia_operator_key';

// 5 functional random word passphrases (exactly 18 characters each):
export const VALID_PREVIEW_PASSPHRASES = [
  'forest-silver-dawn',
  'copper-timber-hawk',
  'canyon-velvet-dusk',
  'beacon-matrix-glow',
  'shadow-cobalt-reef',
] as const;

export type ValidPassphrase = typeof VALID_PREVIEW_PASSPHRASES[number];

// Primary default key for backward compatibility in imports / test suites
export const DEFAULT_OPERATOR_KEY = VALID_PREVIEW_PASSPHRASES[0];
export const DEFAULT_ENTERPRISE_KEY = VALID_PREVIEW_PASSPHRASES[1];

export function isValidPassphrase(key: string | null | undefined): boolean {
  if (!key) return false;
  const cleanKey = key.trim().toLowerCase();

  // Allow environment variable overrides if explicitly configured
  const envOpKey = process.env.OPERATOR_PREVIEW_KEY?.trim().toLowerCase();
  const envEntKey = process.env.ENTERPRISE_PREVIEW_KEY?.trim().toLowerCase();
  if (envOpKey && cleanKey === envOpKey) return true;
  if (envEntKey && cleanKey === envEntKey) return true;

  return (VALID_PREVIEW_PASSPHRASES as readonly string[]).includes(cleanKey);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get('key');
  const returnUrl = searchParams.get('returnUrl') || '/';

  if (isValidPassphrase(key)) {
    const matchedKey = key!.trim().toLowerCase();
    const res = NextResponse.redirect(new URL(returnUrl, req.url));

    res.cookies.set(OPERATOR_COOKIE_NAME, matchedKey, {
      httpOnly: false, // accessible to client for banner status
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Automatically provision Enterprise session for authorized guests
    const enterpriseToken = createEnterpriseGuestToken();
    res.cookies.set(SESSION_COOKIE_NAME, enterpriseToken, {
      httpOnly: true,
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

    if (isValidPassphrase(key)) {
      const matchedKey = key.trim().toLowerCase();
      const res = NextResponse.json({ 
        success: true, 
        redirect: '/',
        tier: 'enterprise'
      });

      res.cookies.set(OPERATOR_COOKIE_NAME, matchedKey, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      // Automatically provision Enterprise session for authorized guests
      const enterpriseToken = createEnterpriseGuestToken();
      res.cookies.set(SESSION_COOKIE_NAME, enterpriseToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return res;
    }

    return NextResponse.json({ success: false, error: 'Invalid authorization passkey.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Authentication error' }, { status: 500 });
  }
}
