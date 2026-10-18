import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to upgrade or subscribe' }, { status: 401 });
    }

    const { product, tier, billingCycle, customPrice, amount } = await req.json();

    if (!product) {
      return NextResponse.json({ error: 'Product is required' }, { status: 400 });
    }

    const paidAmount = typeof customPrice === 'number' ? customPrice : (typeof amount === 'number' ? amount : null);
    let resolvedTier = (tier || 'pro').toLowerCase();

    // Pay-what-you-want dynamic entitlement unlocking:
    if (paidAmount !== null) {
      if (paidAmount >= 399 || tier === 'enterprise') {
        resolvedTier = 'enterprise';
      } else if (paidAmount >= 49 || tier === 'pro') {
        resolvedTier = 'pro';
      } else {
        resolvedTier = 'community';
      }
    }

    const subId = `sub_${product}_${user.id}`;
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiresAt = billingCycle === 'annual' ? oneYearFromNow : oneMonthFromNow;

    // Check if subscription record already exists
    const existing = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, user.id),
        eq(subscriptions.product, product)
      )
    });

    if (existing) {
      await db.update(subscriptions)
        .set({
          tier: resolvedTier,
          status: 'active',
          currentPeriodEnd: expiresAt,
        })
        .where(eq(subscriptions.id, existing.id));
    } else {
      await db.insert(subscriptions).values({
        id: subId,
        userId: user.id,
        product,
        tier: resolvedTier,
        status: 'active',
        currentPeriodEnd: expiresAt,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded ${product.toUpperCase()} to ${resolvedTier.toUpperCase()} tier!`,
      subscription: {
        product,
        tier: resolvedTier,
        status: 'active',
        currentPeriodEnd: expiresAt,
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to process checkout' }, { status: 500 });
  }
}
