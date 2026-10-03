import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { capturePayPalOrder } from '@/lib/billing/paypal';
import { db, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { orderId, product, tier, billingCycle } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Capture payment through PayPal API
    const captureResult = await capturePayPalOrder(orderId);

    if (!captureResult.success && captureResult.status !== 'COMPLETED') {
      return NextResponse.json({
        error: `Payment capture incomplete (Status: ${captureResult.status})`,
      }, { status: 400 });
    }

    // Parse target product and tier from customId if omitted in body
    let finalProduct = product;
    let finalTier = tier;
    let finalBillingCycle = billingCycle || 'annual';

    if ((!finalProduct || !finalTier) && captureResult.customId) {
      const parts = captureResult.customId.split(':');
      if (parts.length >= 3) {
        finalProduct = parts[1];
        finalTier = parts[2];
        if (parts[3]) finalBillingCycle = parts[3];
      }
    }

    if (!finalProduct || !finalTier) {
      return NextResponse.json({ error: 'Could not determine subscription product and tier' }, { status: 400 });
    }

    // 2. Calculate entitlement validity period
    const now = Date.now();
    const durationMs = finalBillingCycle === 'annual'
      ? 365 * 24 * 60 * 60 * 1000
      : 30 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(now + durationMs);

    // 3. Upsert subscription record in database
    const existing = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, user.id),
        eq(subscriptions.product, finalProduct)
      )
    });

    const subId = `sub_${finalProduct}_${user.id}`;

    if (existing) {
      await db.update(subscriptions)
        .set({
          tier: finalTier,
          status: 'active',
          currentPeriodEnd: expiresAt,
        })
        .where(eq(subscriptions.id, existing.id));
    } else {
      await db.insert(subscriptions).values({
        id: subId,
        userId: user.id,
        product: finalProduct,
        tier: finalTier,
        status: 'active',
        currentPeriodEnd: expiresAt,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed PayPal payment! ${finalProduct.toUpperCase()} upgraded to ${finalTier.toUpperCase()}.`,
      capture: {
        orderId: captureResult.orderId,
        status: captureResult.status,
        amountCaptured: captureResult.amountCaptured,
        payerEmail: captureResult.payerEmail,
        mock: captureResult.mock,
      },
      subscription: {
        product: finalProduct,
        tier: finalTier,
        status: 'active',
        currentPeriodEnd: expiresAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('PayPal capture-order error:', err);
    return NextResponse.json({ error: message || 'Failed to capture PayPal order' }, { status: 500 });
  }
}
