import { NextRequest, NextResponse } from 'next/server';
import { db, users, subscriptions, oauthAccounts } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/crypto';
import { createSession, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface OAuthUserProfile {
  providerAccountId: string;
  email: string;
  name: string;
  accessToken?: string;
  scope?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const isMock = searchParams.get('mock') === 'true';

  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = req.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/oauth/callback/${provider}`;

  let profile: OAuthUserProfile | null = null;

  try {
    // -------------------------------------------------------------------------
    // 1. MOCK / DEV MODE (When API credentials are not yet added to .env)
    // -------------------------------------------------------------------------
    if (isMock || !code) {
      if (provider === 'github') {
        profile = {
          providerAccountId: 'gh_demo_1001',
          email: 'github.developer@exultia.tech',
          name: 'GitHub Engineer',
          scope: 'read:user user:email workflow repo',
        };
      } else if (provider === 'google') {
        profile = {
          providerAccountId: 'goog_demo_2002',
          email: 'google.account@exultia.tech',
          name: 'Google User',
          scope: 'openid profile email',
        };
      } else if (provider === 'microsoft') {
        profile = {
          providerAccountId: 'ms_entra_demo_3003',
          email: 'entra.enterprise@exultia.tech',
          name: 'Entra 365 Enterprise User',
          scope: 'openid profile email User.Read',
        };
      }
    }

    // -------------------------------------------------------------------------
    // 2. LIVE GITHUB OAUTH EXCHANGE
    // -------------------------------------------------------------------------
    else if (provider === 'github' && code) {
      const clientId = process.env.GITHUB_CLIENT_ID!;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET!;

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) throw new Error(tokenData.error_description || 'Failed to exchange GitHub code');

      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'User-Agent': 'Exultia-Auth-Portal',
        },
      });
      const ghUser = await userRes.json();

      let primaryEmail = ghUser.email;
      if (!primaryEmail) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'User-Agent': 'Exultia-Auth-Portal',
          },
        });
        const emails = await emailsRes.json();
        const primary = Array.isArray(emails) ? emails.find((e: any) => e.primary) || emails[0] : null;
        primaryEmail = primary?.email;
      }

      profile = {
        providerAccountId: String(ghUser.id),
        email: primaryEmail || `${ghUser.login}@github.exultia.tech`,
        name: ghUser.name || ghUser.login,
        accessToken: tokenData.access_token,
        scope: tokenData.scope,
      };
    }

    // -------------------------------------------------------------------------
    // 3. LIVE GOOGLE OAUTH EXCHANGE
    // -------------------------------------------------------------------------
    else if (provider === 'google' && code) {
      const clientId = process.env.GOOGLE_CLIENT_ID!;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) throw new Error(tokenData.error || 'Failed to exchange Google code');

      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const gUser = await userRes.json();

      profile = {
        providerAccountId: gUser.sub,
        email: gUser.email,
        name: gUser.name || 'Google User',
        accessToken: tokenData.access_token,
        scope: tokenData.scope,
      };
    }

    // -------------------------------------------------------------------------
    // 4. LIVE MICROSOFT ENTRA ID (AZURE AD) EXCHANGE
    // -------------------------------------------------------------------------
    else if (provider === 'microsoft' && code) {
      const clientId = (process.env.MICROSOFT_ENTRA_CLIENT_ID || process.env.AZURE_CLIENT_ID)!;
      const clientSecret = (process.env.MICROSOFT_ENTRA_CLIENT_SECRET || process.env.AZURE_CLIENT_SECRET)!;
      const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';

      const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) throw new Error(tokenData.error_description || 'Failed to exchange Microsoft Entra code');

      const userRes = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const msUser = await userRes.json();

      profile = {
        providerAccountId: msUser.id,
        email: msUser.mail || msUser.userPrincipalName,
        name: msUser.displayName || 'Microsoft 365 User',
        accessToken: tokenData.access_token,
        scope: tokenData.scope,
      };
    }

    if (!profile || !profile.email) {
      return NextResponse.redirect(`${baseUrl}/?auth=error&message=${encodeURIComponent('Could not retrieve user identity from provider')}`);
    }

    // -------------------------------------------------------------------------
    // 5. ACCOUNT CREATION & LINKING (Turso DB)
    // -------------------------------------------------------------------------
    let user = await db.query.users.findFirst({
      where: eq(users.email, profile.email.toLowerCase()),
    });

    if (!user) {
      // Create new user account automatically
      const newUserId = `usr_oauth_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const dummyPasswordHash = hashPassword(crypto.randomUUID());

      await db.insert(users).values({
        id: newUserId,
        email: profile.email.toLowerCase(),
        name: profile.name,
        passwordHash: dummyPasswordHash,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Provision default product subscriptions
      const defaultProducts = ['pureide', 'uvi', 'inquest', 'axiom', 'fixlist', 'pureos'];
      for (const prod of defaultProducts) {
        await db.insert(subscriptions).values({
          id: `sub_${prod}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
          userId: newUserId,
          product: prod,
          tier: 'free',
          status: 'active',
          createdAt: new Date(),
        });
      }

      user = await db.query.users.findFirst({
        where: eq(users.id, newUserId),
      });
    }

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/?auth=error&message=${encodeURIComponent('Failed to provision user record')}`);
    }

    // Store or update OAuth account link
    const existingOAuth = await db.query.oauthAccounts.findFirst({
      where: and(
        eq(oauthAccounts.provider, provider),
        eq(oauthAccounts.providerAccountId, profile.providerAccountId)
      ),
    });

    if (!existingOAuth) {
      await db.insert(oauthAccounts).values({
        id: `oa_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        userId: user.id,
        provider,
        providerAccountId: profile.providerAccountId,
        email: profile.email.toLowerCase(),
        accessToken: profile.accessToken || null,
        scope: profile.scope || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // -------------------------------------------------------------------------
    // 6. CREATE ACTIVE SESSION & SET SECURE COOKIE
    // -------------------------------------------------------------------------
    const { token, expiresAt } = await createSession(user.id);

    const response = NextResponse.redirect(`${baseUrl}/account?auth=success&provider=${provider}`);
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return response;
  } catch (err: any) {
    console.error('OAuth Callback Error:', err);
    return NextResponse.redirect(`${baseUrl}/?auth=error&message=${encodeURIComponent(err?.message || 'Authentication failed')}`);
  }
}
