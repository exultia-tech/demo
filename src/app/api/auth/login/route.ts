import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, users, subscriptions } from '@/lib/db';
import { initializeDatabase } from '@/lib/db/init';
import { eq, and } from 'drizzle-orm';
import { verifyPassword } from '@/lib/auth/crypto';
import { createSession, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { isValidationModeActive, isAuthorizedOperator, RESTRICTED_ACCESS_MESSAGE } from '@/lib/auth/access-control';
import { recordLicenseActivity } from '@/lib/licensing/audit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await initializeDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const userRecord = await db.query.users.findFirst({
      where: eq(users.email, cleanEmail),
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Optional login lockout check
    if (process.env.DISABLE_LOGIN === 'true') {
      return NextResponse.json({
        error: 'Sign in is temporarily paused.'
      }, { status: 403 });
    }

    const isValid = verifyPassword(password, userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const userSubs = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.userId, userRecord.id),
        eq(subscriptions.status, 'active')
      ),
    });

    // Create new session in Turso
    const { token, expiresAt } = await createSession(userRecord.id);

    // Passively log device and IP touch for trust-but-verify telemetry
    await recordLicenseActivity(userRecord.id, 'account', req, 'login');

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role,
        subscriptions: userSubs.map(s => ({
          product: s.product,
          tier: s.tier,
          status: s.status,
        })),
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to sign in' }, { status: 500 });
  }
}
