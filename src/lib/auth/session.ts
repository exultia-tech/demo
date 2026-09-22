import { cookies } from 'next/headers';
import { db, users, sessions, subscriptions } from '@/lib/db';
import { eq, and, gt } from 'drizzle-orm';
import { generateToken } from './crypto';

export const SESSION_COOKIE_NAME = 'exultia_session';
const SESSION_DURATION_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscriptions: Array<{
    product: string;
    tier: string;
    status: string;
  }>;
}

/**
 * Creates a new session in Turso DB and returns the token and expiration
 */
export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    id: token,
    userId,
    expiresAt,
    createdAt: new Date(),
  });

  return { token, expiresAt };
}

/**
 * Retrieves the current authenticated user from Turso DB via session cookie
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    const now = new Date();
    const activeSession = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.id, token),
        gt(sessions.expiresAt, now)
      ),
    });

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

    return {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
      subscriptions: userSubs.map(s => ({
        product: s.product,
        tier: s.tier,
        status: s.status,
      })),
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Destroys the current session from Turso DB and deletes the cookie
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await db.delete(sessions).where(eq(sessions.id, token));
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch (error) {
    console.error('Failed to destroy session:', error);
  }
}
