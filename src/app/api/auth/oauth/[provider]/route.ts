import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = req.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/oauth/callback/${provider}`;

  const state = crypto.randomBytes(16).toString('hex');

  // 1. GitHub OAuth
  if (provider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (clientId) {
      const scope = encodeURIComponent('read:user user:email workflow repo');
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
      return NextResponse.redirect(authUrl);
    }
    // Development / Demo Fallback Mode
    return NextResponse.redirect(`${redirectUri}?mock=true&provider=github&state=${state}`);
  }

  // 2. Google OAuth
  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      const scope = encodeURIComponent('openid profile email');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;
      return NextResponse.redirect(authUrl);
    }
    // Development / Demo Fallback Mode
    return NextResponse.redirect(`${redirectUri}?mock=true&provider=google&state=${state}`);
  }

  // 3. Microsoft 365 / Microsoft Entra ID (Azure AD)
  if (provider === 'microsoft') {
    const clientId = process.env.MICROSOFT_ENTRA_CLIENT_ID || process.env.AZURE_CLIENT_ID;
    const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
    if (clientId) {
      const scope = encodeURIComponent('openid profile email User.Read');
      const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${scope}&state=${state}`;
      return NextResponse.redirect(authUrl);
    }
    // Development / Demo Fallback Mode
    return NextResponse.redirect(`${redirectUri}?mock=true&provider=microsoft&state=${state}`);
  }

  return NextResponse.json({ error: `Unsupported OAuth provider: ${provider}` }, { status: 400 });
}
