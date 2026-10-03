import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createPayPalOrder } from '@/lib/billing/paypal';

export const dynamic = 'force-dynamic';

// Standard Exultia plan pricing table
const PRICING_CATALOG: Record<string, Record<string, { monthly: number; annual: number }>> = {
  pureide: {
    pro: { monthly: 59, annual: 49 * 12 },
    enterprise: { monthly: 349, annual: 299 * 12 },
  },
  uvi: {
    pro: { monthly: 99, annual: 79 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
  inquest: {
    legal: { monthly: 149, annual: 119 * 12 },
    enterprise: { monthly: 699, annual: 549 * 12 },
  },
  axiom: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 299, annual: 249 * 12 },
  },
  fixlist: {
    pro: { monthly: 79, annual: 65 * 12 },
    enterprise: { monthly: 399, annual: 319 * 12 },
  },
  pureos: {
    pro: { monthly: 89, annual: 69 * 12 },
    enterprise: { monthly: 449, annual: 359 * 12 },
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

    // Determine price
    let amount = 0;
    const productCatalog = PRICING_CATALOG[product.toLowerCase()];
    if (productCatalog && productCatalog[tier.toLowerCase()]) {
      const tierPricing = productCatalog[tier.toLowerCase()];
      amount = billingCycle === 'annual' ? tierPricing.annual : tierPricing.monthly;
    } else if (typeof customPrice === 'number' && customPrice > 0) {
      amount = customPrice;
    } else {
      amount = 49.00; // Baseline fallback
    }

    const customId = `${user.id}:${product}:${tier}:${billingCycle || 'monthly'}`;
    const description = `Exultia ${product.toUpperCase()} - ${tier.toUpperCase()} (${billingCycle || 'monthly'})`;

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
