import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { recordLicenseActivity } from '@/lib/licensing/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Passive trust-but-verify telemetry
    recordLicenseActivity(sessionUser.id, 'account', req, 'check_entitlements').catch(() => {});

    const subs = await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, sessionUser.id),
    });

    // Check if user has an overarching platform subscription
    const platformSub = subs.find(s => (s.product === 'platform' || s.product === 'multipass') && s.status === 'active');
    const platformTier = platformSub?.tier?.toLowerCase();

    // Ensure all flagship engines in the suite are represented
    const products = ['platform', 'pureide', 'uvi', 'praxis', 'pureos', 'axiom', 'eris', 'valkyrie'];
    const enriched = products.map(prod => {
      const match = subs.find(s => s.product === prod);
      let effectiveTier = match?.tier || 'free';

      if (prod !== 'platform' && platformTier) {
        if (platformTier === 'enterprise') {
          effectiveTier = 'enterprise';
        } else if (platformTier === 'pro' && effectiveTier === 'free') {
          effectiveTier = 'pro';
        }
      }

      return {
        product: prod,
        id: match?.id || `sub_${prod}_${sessionUser.id}`,
        tier: effectiveTier,
        status: match?.status || (prod !== 'platform' && platformSub ? 'active' : 'active'),
        currentPeriodEnd: match?.currentPeriodEnd || (platformSub ? platformSub.currentPeriodEnd : null),
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

    // Only administrators can grant paid tiers directly without checkout verification
    const isFree = tier.toLowerCase() === 'free' || tier.toLowerCase() === 'community';
    const isAdmin = sessionUser.role === 'admin';

    if (!isFree && !isAdmin) {
      return NextResponse.json({ 
        error: 'Upgrades require completing checkout via Pricing & Plans.' 
      }, { status: 403 });
    }

    const normalizedTier = isFree ? 'free' : tier.toLowerCase();
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiresAt = isFree ? null : (billingCycle === 'annual' ? oneYearFromNow : oneMonthFromNow);

    const existing = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, sessionUser.id),
        eq(subscriptions.product, product)
      )
    });

    if (existing) {
      await db.update(subscriptions)
        .set({
          tier: normalizedTier,
          status: 'active',
          currentPeriodEnd: expiresAt,
        })
        .where(eq(subscriptions.id, existing.id));
    } else {
      await db.insert(subscriptions).values({
        id: `sub_${product}_${sessionUser.id}`,
        userId: sessionUser.id,
        product,
        tier: normalizedTier,
        status: 'active',
        currentPeriodEnd: expiresAt,
        createdAt: new Date(),
      });
    }

    // If upgrading platform or multipass, also elevate all flagship engines
    if (product === 'platform' || product === 'multipass') {
      const engines = ['pureide', 'uvi', 'praxis', 'pureos', 'axiom', 'eris', 'valkyrie'];
      for (const eng of engines) {
        const engSub = await db.query.subscriptions.findFirst({
          where: and(
            eq(subscriptions.userId, sessionUser.id),
            eq(subscriptions.product, eng)
          )
        });
        if (engSub) {
          await db.update(subscriptions)
            .set({
              tier: normalizedTier,
              status: 'active',
              currentPeriodEnd: expiresAt,
            })
            .where(eq(subscriptions.id, engSub.id));
        } else {
          await db.insert(subscriptions).values({
            id: `sub_${eng}_${sessionUser.id}`,
            userId: sessionUser.id,
            product: eng,
            tier: normalizedTier,
            status: 'active',
            currentPeriodEnd: expiresAt,
            createdAt: new Date(),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Subscription for ${product.toUpperCase()} updated to ${normalizedTier.toUpperCase()}`,
      subscription: {
        product,
        tier: normalizedTier,
        status: 'active',
        currentPeriodEnd: expiresAt,
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to update subscription' }, { status: 500 });
  }
}
