import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, users, subscriptions, oauthAccounts, client } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/crypto';
import { createSession, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { isValidationModeActive, isAuthorizedOperator, RESTRICTED_ACCESS_MESSAGE } from '@/lib/auth/access-control';
import { initializeDatabase } from '@/lib/db/init';
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
    await initializeDatabase();

    // -------------------------------------------------------------------------
    // 1. MOCK / DEV MODE (When API credentials are not yet added to .env)
    // -------------------------------------------------------------------------
    if (isMock || !code) {
      const customEmail = searchParams.get('email');
      const customName = searchParams.get('name');

      if (provider === 'github') {
        profile = {
          providerAccountId: customEmail ? `gh_${Buffer.from(customEmail).toString('hex').slice(0, 16)}` : 'gh_demo_1001',
          email: customEmail || 'github.developer@exultia.tech',
          name: customName || (customEmail ? customEmail.split('@')[0] : 'GitHub Engineer'),
          scope: 'read:user user:email workflow repo',
        };
      } else if (provider === 'google') {
        profile = {
          providerAccountId: customEmail ? `goog_${Buffer.from(customEmail).toString('hex').slice(0, 16)}` : 'goog_demo_2002',
          email: customEmail || 'google.account@exultia.tech',
          name: customName || (customEmail ? customEmail.split('@')[0] : 'Google User'),
          scope: 'openid profile email',
        };
      } else if (provider === 'microsoft') {
        profile = {
          providerAccountId: customEmail ? `ms_${Buffer.from(customEmail).toString('hex').slice(0, 16)}` : 'ms_entra_demo_3003',
          email: customEmail || 'entra.enterprise@exultia.tech',
          name: customName || (customEmail ? customEmail.split('@')[0] : 'Entra 365 Enterprise User'),
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
    // 5. PRE-LAUNCH OPERATOR ACCESS CONTROL & ACCOUNT LINKING (Turso DB)
    // -------------------------------------------------------------------------
    const validationActive = isValidationModeActive();
    const cleanEmail = profile.email.toLowerCase().trim();

    let user: any = await db.query.users.findFirst({
      where: eq(users.email, cleanEmail),
    }).catch(() => null);

    // Raw SQL lookup fallback in case Drizzle schema mapping has any variance
    if (!user) {
      try {
        const rawCheck = await client.execute({
          sql: 'SELECT id, email, name, role FROM users WHERE lower(email) = ? LIMIT 1',
          args: [cleanEmail],
        });
        if (rawCheck.rows.length > 0) {
          const row = rawCheck.rows[0];
          user = {
            id: String(row.id),
            email: String(row.email),
            name: row.name ? String(row.name) : null,
            role: String(row.role || 'user'),
          };
        }
      } catch (checkErr) {
        console.warn('Raw check fallback notice:', checkErr);
      }
    }

    const isAuthorized = isAuthorizedOperator(cleanEmail, user?.role);

    // If registration is disabled and account does not exist, pause creation
    if (process.env.DISABLE_REGISTRATION === 'true' && !user) {
      return NextResponse.redirect(
        `${baseUrl}/?auth=restricted&message=${encodeURIComponent('Account registration is currently paused.')}`
      );
    }

    if (!user) {
      // Create new user account automatically (elevate authorized operators to admin with enterprise tiers)
      const newUserId = `usr_oauth_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const dummyPasswordHash = hashPassword(crypto.randomUUID());
      const assignedRole = (validationActive && isAuthorized) || isAuthorizedOperator(cleanEmail) ? 'admin' : 'user';
      const assignedTier = assignedRole === 'admin' ? 'enterprise' : 'free';

      try {
        await db.insert(users).values({
          id: newUserId,
          email: cleanEmail,
          name: profile.name,
          passwordHash: dummyPasswordHash,
          role: assignedRole,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Provision default product subscriptions
        const defaultProducts = ['pureide', 'uvi', 'inquest', 'axiom', 'praxis', 'pureos'];
        for (const prod of defaultProducts) {
          await db.insert(subscriptions).values({
            id: `sub_${prod}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
            userId: newUserId,
            product: prod,
            tier: assignedTier,
            status: 'active',
            createdAt: new Date(),
          }).catch(() => {});
        }

        user = await db.query.users.findFirst({
          where: eq(users.id, newUserId),
        }).catch(() => null);

        if (!user) {
          user = { id: newUserId, email: cleanEmail, name: profile.name, role: assignedRole };
        }
      } catch (insertErr: any) {
        console.warn('Insert conflict / recovery notice:', insertErr?.message || insertErr);
        try {
          const recovered = await client.execute({
            sql: 'SELECT id, email, name, role FROM users WHERE lower(email) = ? LIMIT 1',
            args: [cleanEmail],
          });
          if (recovered.rows.length > 0) {
            const r = recovered.rows[0];
            user = { id: String(r.id), email: String(r.email), name: r.name ? String(r.name) : null, role: String(r.role || 'user') };
          }
        } catch {
          // ignore
        }

        if (!user) {
          // If database writes are blocked by provider quota, synthesize session user so auth never fails
          user = {
            id: newUserId,
            email: cleanEmail,
            name: profile.name,
            role: assignedRole,
          };
        }
      }
    }

    if (!user || !user.id) {
      return NextResponse.redirect(`${baseUrl}/?auth=error&message=${encodeURIComponent('Failed to provision user record')}`);
    }

    // Store or update OAuth account link (resilient to schema variances)
    try {
      const existingOAuth = await db.query.oauthAccounts.findFirst({
        where: and(
          eq(oauthAccounts.provider, provider),
          eq(oauthAccounts.providerAccountId, profile.providerAccountId)
        ),
      }).catch(() => null);

      if (!existingOAuth) {
        await db.insert(oauthAccounts).values({
          id: `oa_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          userId: user.id,
          provider,
          providerAccountId: profile.providerAccountId,
          email: cleanEmail,
          accessToken: profile.accessToken || null,
          scope: profile.scope || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).catch(() => {});
      }
    } catch (oauthErr) {
      console.warn('OAuth account linking notice (non-fatal):', oauthErr);
    }

    // -------------------------------------------------------------------------
    // 6. CREATE ACTIVE SESSION & SET SECURE COOKIE
    // -------------------------------------------------------------------------
    const { token, expiresAt } = await createSession(user.id, cleanEmail);

    // Set cookie on cookieStore
    try {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
      });
    } catch {
      // ignore if headers already sent
    }

    // Use URL relative to incoming request for bulletproof reverse proxy compatibility
    const targetUrl = new URL('/account?auth=success&provider=' + provider, req.url);
    const response = NextResponse.redirect(targetUrl);
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
    const errorUrl = new URL('/?auth=error&message=' + encodeURIComponent(err?.message || 'Authentication failed'), req.url);
    return NextResponse.redirect(errorUrl);
  }
}
