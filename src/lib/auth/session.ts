import { cookies } from 'next/headers';
import { db, users, sessions, subscriptions } from '@/lib/db';
import { eq, and, gt } from 'drizzle-orm';
import { generateToken, signPayload, verifySignedPayload } from './crypto';

import { isAuthorizedOperator } from './access-control';

export const SESSION_COOKIE_NAME = 'exultia_session';
export const IMPERSONATOR_COOKIE_NAME = 'exultia_impersonator';
const SESSION_DURATION_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isImpersonating?: boolean;
  impersonatedBy?: string | null;
  subscriptions: Array<{
    product: string;
    tier: string;
    status: string;
  }>;
}

/**
 * Creates a new session in Turso DB (with signed fallback token if writes are blocked by provider quota)
 */
export async function createSession(userId: string, email?: string): Promise<{ token: string; expiresAt: Date }> {
  let token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  try {
    await db.insert(sessions).values({
      id: token,
      userId,
      expiresAt,
      createdAt: new Date(),
    });
  } catch (err: any) {
    console.warn('Session DB insert notice (fallback to signed token):', err?.message || err);
    // Create self-verifying HMAC signed token so user is NEVER locked out by database write quotas
    const sessionPayload = JSON.stringify({ userId, email: email || '', exp: expiresAt.getTime() });
    token = `s_fallback_${signPayload(Buffer.from(sessionPayload).toString('base64url'))}`;
  }

  return { token, expiresAt };
}

/**
 * Retrieves the current authenticated user from Turso DB or signed session fallback
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const rawImpersonatorCookie = cookieStore.get(IMPERSONATOR_COOKIE_NAME)?.value;
    const impersonatorAdminId = rawImpersonatorCookie ? verifySignedPayload(rawImpersonatorCookie) : null;

    if (!token) return null;

    // Self-verifying signed token fallback if DB writes were blocked
    if (token.startsWith('s_fallback_')) {
      const signedPart = token.replace('s_fallback_', '');
      const rawB64 = verifySignedPayload(signedPart);
      if (rawB64) {
        try {
          const parsed = JSON.parse(Buffer.from(rawB64, 'base64url').toString('utf8'));
          if (parsed.exp && parsed.exp > Date.now()) {
            const isAuthorized = isAuthorizedOperator(parsed.email);
            const userEmail = parsed.email || 'operator@exultia.tech';
            const role = isAuthorized ? 'admin' : 'user';
            const tier = isAuthorized ? 'enterprise' : 'free';
            const defaultProducts = ['pureide', 'uvi', 'axiom', 'praxis', 'pureos'];
            return {
              id: parsed.userId,
              email: userEmail,
              name: userEmail.split('@')[0],
              role,
              isImpersonating: false,
              impersonatedBy: null,
              subscriptions: defaultProducts.map(p => ({
                product: p,
                tier,
                status: 'active'
              }))
            };
          }
        } catch (parseErr) {
          console.warn('Fallback session parse error:', parseErr);
        }
      }
    }

    const now = new Date();
    const activeSession = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.id, token),
        gt(sessions.expiresAt, now)
      ),
    }).catch(() => null);

    if (!activeSession) return null;

    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, activeSession.userId),
    });

    if (!userRecord) return null;

    const userSubs = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.userId, userRecord.id),
        eq(subscriptions.status, 'active')
      ),
    });

    let isImpersonating = false;
    let impersonatedBy: string | null = null;

    if (impersonatorAdminId) {
      const adminRecord = await db.query.users.findFirst({
        where: eq(users.id, impersonatorAdminId),
      });
      if (adminRecord && adminRecord.role === 'admin') {
        isImpersonating = true;
        impersonatedBy = adminRecord.email;
      }
    }

    return {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
      isImpersonating,
      impersonatedBy,
      subscriptions: userSubs.map(s => ({
        product: s.product,
        tier: s.tier,
        status: s.status,
      })),
    };
  } catch (error: any) {
    if (!error?.message?.includes?.('request scope') && !error?.message?.includes?.('outside a request')) {
      console.error('Failed to get current user:', error);
    }
    return null;
  }
}

/**
 * Switches the active session to a target user while persisting the admin identity
 */
export async function startImpersonation(adminUserId: string, targetUserId: string): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  
  // Create a new session for the target persona
  const { token, expiresAt } = await createSession(targetUserId);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  // Persist the cryptographically signed admin impersonator cookie
  cookieStore.set(IMPERSONATOR_COOKIE_NAME, signPayload(adminUserId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    path: '/',
  });

  return getCurrentUser();
}

/**
 * Stops persona impersonation and restores the root admin session
 */
export async function stopImpersonation(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const rawImpersonatorCookie = cookieStore.get(IMPERSONATOR_COOKIE_NAME)?.value;
  const impersonatorAdminId = rawImpersonatorCookie ? verifySignedPayload(rawImpersonatorCookie) : null;
  const currentToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // Clean up current temporary impersonation session
  if (currentToken) {
    await db.delete(sessions).where(eq(sessions.id, currentToken)).catch(() => {});
  }

  // Clear impersonator cookie
  cookieStore.delete(IMPERSONATOR_COOKIE_NAME);

  if (impersonatorAdminId) {
    const adminRecord = await db.query.users.findFirst({
      where: and(eq(users.id, impersonatorAdminId), eq(users.role, 'admin')),
    });

    if (adminRecord) {
      const { token, expiresAt } = await createSession(adminRecord.id);
      cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
      });
    }
  }

  return getCurrentUser();
}

/**
 * Destroys the current session from Turso DB and deletes the cookies
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await db.delete(sessions).where(eq(sessions.id, token));
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
    cookieStore.delete(IMPERSONATOR_COOKIE_NAME);
  } catch (error) {
    console.error('Failed to destroy session:', error);
  }
}

