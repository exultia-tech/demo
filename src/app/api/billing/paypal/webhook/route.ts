import { NextResponse } from 'next/server';
import { verifyPayPalWebhookSignature } from '@/lib/billing/paypal';
import { db, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const event = JSON.parse(rawBody);

    // Extract headers for webhook signature validation
    const transmissionId = req.headers.get('paypal-transmission-id') || '';
    const transmissionTime = req.headers.get('paypal-transmission-time') || '';
    const certUrl = req.headers.get('paypal-cert-url') || '';
    const authAlgo = req.headers.get('paypal-auth-algo') || '';
    const transmissionSig = req.headers.get('paypal-transmission-sig') || '';

    // Verify signature
    const isValid = await verifyPayPalWebhookSignature({
      transmissionId,
      transmissionTime,
      certUrl,
      authAlgo,
      transmissionSig,
      webhookEvent: event,
    });

    if (!isValid) {
      console.warn('Invalid PayPal webhook signature rejected.');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const eventType = event.event_type;
    console.log(`[PayPal Webhook] Processing event: ${eventType}`);

    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const resource = event.resource;
        const customId = resource.custom_id || resource.purchase_units?.[0]?.custom_id;

        if (customId) {
          const [userId, product, tier, cycle] = customId.split(':');
          if (userId && product && tier) {
            const durationMs = cycle === 'annual'
              ? 365 * 24 * 60 * 60 * 1000
              : 30 * 24 * 60 * 60 * 1000;
            const expiresAt = new Date(Date.now() + durationMs);

            const existing = await db.query.subscriptions.findFirst({
              where: and(
                eq(subscriptions.userId, userId),
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
                id: `sub_${product}_${userId}`,
                userId,
                product,
                tier,
                status: 'active',
                currentPeriodEnd: expiresAt,
                createdAt: new Date(),
              });
            }
            console.log(`[PayPal Webhook] Activated ${product}:${tier} for user ${userId}`);
          }
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const resource = event.resource;
        const customId = resource.custom_id;
        if (customId) {
          const [userId, product] = customId.split(':');
          if (userId && product) {
            const existing = await db.query.subscriptions.findFirst({
              where: and(
                eq(subscriptions.userId, userId),
                eq(subscriptions.product, product)
              )
            });
            if (existing) {
              await db.update(subscriptions)
                .set({
                  status: 'canceled',
                })
                .where(eq(subscriptions.id, existing.id));
              console.log(`[PayPal Webhook] Marked subscription ${product} as canceled for ${userId}`);
            }
          }
        }
        break;
      }

      default:
        console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('PayPal webhook processing error:', err);
    return NextResponse.json({ error: message || 'Webhook processing failed' }, { status: 500 });
  }
}
