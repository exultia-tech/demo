import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, users, subscriptions } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/crypto';
import { createSession, SESSION_COOKIE_NAME } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

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
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const passwordHash = hashPassword(password);

    // Create User
    await db.insert(users).values({
      id: userId,
      email: cleanEmail,
      name: name?.trim() || null,
      passwordHash,
      role: 'user',
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
        role: 'user',
        subscriptions: [
          { product: 'pureide', tier: 'free', status: 'active' },
          { product: 'inquest', tier: 'free', status: 'active' }
        ]
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to register' }, { status: 500 });
  }
}
