import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, users, subscriptions } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/crypto';
import { createSession, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { isValidationModeActive, isAuthorizedOperator, RESTRICTED_ACCESS_MESSAGE } from '@/lib/auth/access-control';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password, inviteCode } = await req.json();

    // Registration lockout policy (optional via DISABLE_REGISTRATION)
    if (process.env.DISABLE_REGISTRATION === 'true') {
      return NextResponse.json({
        error: 'Account registration is temporarily paused.',
      }, { status: 403 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, cleanEmail),
    });

    if (existing) {
      return NextResponse.json({
        error: 'An account with this email address already exists. Please sign in or reset your password.',
      }, { status: 409 });
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const passwordHash = hashPassword(password);

    const isOperator = isAuthorizedOperator(cleanEmail);
    const assignedRole = isOperator ? 'admin' : 'user';

    // Create User
    await db.insert(users).values({
      id: userId,
      email: cleanEmail,
      name: name?.trim() || null,
      passwordHash,
      role: assignedRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create default Free tiers for products
    await db.insert(subscriptions).values([
      {
        id: `sub_pureide_${userId}`,
        userId,
        product: 'pureide',
        tier: 'free',
        status: 'active',
        createdAt: new Date(),
      },
      {
        id: `sub_inquest_${userId}`,
        userId,
        product: 'inquest',
        tier: 'free',
        status: 'active',
        createdAt: new Date(),
      },
      {
        id: `sub_uvi_${userId}`,
        userId,
        product: 'uvi',
        tier: 'free',
        status: 'active',
        createdAt: new Date(),
      },
      {
        id: `sub_axiom_${userId}`,
        userId,
        product: 'axiom',
        tier: 'free',
        status: 'active',
        createdAt: new Date(),
      },
      {
        id: `sub_praxis_${userId}`,
        userId,
        product: 'praxis',
        tier: 'free',
        status: 'active',
        createdAt: new Date(),
      }
    ]);

    // Create Session
    const { token, expiresAt } = await createSession(userId);

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
        id: userId,
        email: cleanEmail,
        name: name?.trim() || null,
        role: assignedRole,
        subscriptions: [
          { product: 'pureide', tier: 'free', status: 'active' },
          { product: 'inquest', tier: 'free', status: 'active' },
          { product: 'uvi', tier: 'free', status: 'active' },
          { product: 'axiom', tier: 'free', status: 'active' },
          { product: 'praxis', tier: 'free', status: 'active' }
        ]
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to register' }, { status: 500 });
  }
}
