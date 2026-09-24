import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subs = await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, sessionUser.id),
    });

    // Ensure all 3 products are represented
    const products = ['pureide', 'uvi', 'inquest'];
    const enriched = products.map(prod => {
      const match = subs.find(s => s.product === prod);
      return {
        product: prod,
        id: match?.id || `sub_${prod}_${sessionUser.id}`,
        tier: match?.tier || 'free',
        status: match?.status || 'active',
        currentPeriodEnd: match?.currentPeriodEnd || null,
        createdAt: match?.createdAt || null,
      };
    });

    return NextResponse.json({
      success: true,
      subscriptions: enriched,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product, tier, billingCycle } = await req.json();

    if (!product || !tier) {
      return NextResponse.json({ error: 'Product and tier are required' }, { status: 400 });
    }

    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiresAt = tier === 'free' ? null : (billingCycle === 'annual' ? oneYearFromNow : oneMonthFromNow);

    const existing = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, sessionUser.id),
        eq(subscriptions.product, product)
      )
    });

    if (existing) {
      await db.update(subscriptions)
        .set({
          tier,
          status: 'active',
          currentPeriodEnd: expiresAt,
        })
        .where(eq(subscriptions.id, existing.id));
    } else {
      await db.insert(subscriptions).values({
        id: `sub_${product}_${sessionUser.id}`,
        userId: sessionUser.id,
        product,
        tier,
        status: 'active',
        currentPeriodEnd: expiresAt,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Subscription for ${product.toUpperCase()} updated to ${tier.toUpperCase()}`,
      subscription: {
        product,
        tier,
        status: 'active',
        currentPeriodEnd: expiresAt,
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to update subscription' }, { status: 500 });
  }
}
