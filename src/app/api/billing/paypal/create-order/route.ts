import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createPayPalOrder } from '@/lib/billing/paypal';

export const dynamic = 'force-dynamic';

// Standard Exultia plan pricing table
const PRICING_CATALOG: Record<string, Record<string, { monthly: number; annual: number }>> = {
  pureide: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 149, annual: 119 * 12 },
  },
  uvi: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 149, annual: 119 * 12 },
  },
  inquest: {
    pro: { monthly: 49, annual: 39 * 12 },
    legal: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 149, annual: 119 * 12 },
  },
  axiom: {
    enterprise: { monthly: 149, annual: 119 * 12 },
  },
  praxis: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 149, annual: 119 * 12 },
  },
  pureos: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 149, annual: 119 * 12 },
  },
};

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to initiate checkout' }, { status: 401 });
    }

    const body = await req.json();
    const { product, tier, billingCycle, customPrice } = body;

    if (!product || !tier) {
      return NextResponse.json({ error: 'Product and tier are required' }, { status: 400 });
    }

    // Determine price with Pay What You Want support
    let amount = 0;
    if (typeof customPrice === 'number' && customPrice > 0) {
      amount = customPrice;
    } else {
      const productCatalog = PRICING_CATALOG[product.toLowerCase()];
      if (productCatalog && productCatalog[tier.toLowerCase()]) {
        const tierPricing = productCatalog[tier.toLowerCase()];
        amount = billingCycle === 'annual' ? tierPricing.annual : tierPricing.monthly;
      } else {
        amount = 49.00; // Baseline fallback
      }
    }

    // Pay-what-you-want dynamic tier entitlement unlocking:
    // Pro entitlements unlock at 49, Enterprise entitlements unlock at 149
    let resolvedTier = (tier || 'pro').toLowerCase();
    if (amount >= 149) {
      resolvedTier = 'enterprise';
    } else if (amount >= 49) {
      resolvedTier = 'pro';
    } else {
      resolvedTier = 'community';
    }

    const customId = `${user.id}:${product}:${resolvedTier}:${billingCycle || 'monthly'}:${amount}`;
    const description = `Exultia ${product.toUpperCase()} - ${resolvedTier.toUpperCase()} [Pay What You Want: $${amount}]`;

    const order = await createPayPalOrder({
      amount,
      currency: 'USD',
      customId,
      description,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://exultia.tech'}/account/subscription?status=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://exultia.tech'}/account/subscription?status=cancel`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      approvalUrl: order.approvalUrl,
      amount,
      currency: 'USD',
      mock: order.mock,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('PayPal create-order error:', err);
    return NextResponse.json({ error: message || 'Failed to create PayPal order' }, { status: 500 });
  }
}
