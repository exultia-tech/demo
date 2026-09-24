import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db, users, apiTokens, subscriptions, inquestCases, pureideWorkstations } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, sessionUser.id),
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    const userTokens = await db.query.apiTokens.findMany({
      where: eq(apiTokens.userId, sessionUser.id),
    });

    const userSubs = await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, sessionUser.id),
    });

    let casesCount = 0;
    try {
      const cases = await db.query.inquestCases.findMany({
        where: eq(inquestCases.userId, sessionUser.id),
      });
      casesCount = cases.length;
    } catch {
      casesCount = 0;
    }

    let workstationsCount = 0;
    try {
      const wss = await db.query.pureideWorkstations.findMany({
        where: eq(pureideWorkstations.userId, sessionUser.id),
      });
      workstationsCount = wss.length;
    } catch {
      workstationsCount = 0;
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
        stats: {
          activeSubscriptionsCount: userSubs.filter(s => s.status === 'active').length,
          apiTokensCount: userTokens.length,
          casesCount,
          workstationsCount,
        },
        subscriptions: userSubs.map(s => ({
          id: s.id,
          product: s.product,
          tier: s.tier,
          status: s.status,
          currentPeriodEnd: s.currentPeriodEnd,
          createdAt: s.createdAt,
        })),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    await db.update(users)
      .set({
        name: name !== undefined ? (name?.trim() || null) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, sessionUser.id));

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: sessionUser.id,
        email: sessionUser.email,
        name: name?.trim() || null,
        role: sessionUser.role,
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to update profile' }, { status: 500 });
  }
}
