import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createPayPalOrder } from '@/lib/billing/paypal';

export const dynamic = 'force-dynamic';

// Standard Exultia plan pricing table
const PRICING_CATALOG: Record<string, Record<string, { monthly: number; annual: number }>> = {
  pureide: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
  uvi: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
  inquest: {
    pro: { monthly: 49, annual: 39 * 12 },
    legal: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
  axiom: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
  praxis: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
  pureos: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
  eris: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
  valkyrie: {
    pro: { monthly: 49, annual: 39 * 12 },
    enterprise: { monthly: 499, annual: 399 * 12 },
  },
};

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to initiate checkout' }, { status: 401 });
    }

    const body = await req.json();
    const { product, tier, billingCycle, customPrice, returnPath } = body;

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
    let resolvedTier = (tier || 'enterprise').toLowerCase();
    if (product.toLowerCase() === 'platform' || product.toLowerCase() === 'multipass') {
      resolvedTier = amount > 0 || tier === 'enterprise' ? 'enterprise' : 'community';
    } else if (amount >= 399 || resolvedTier === 'enterprise') {
      resolvedTier = 'enterprise';
    } else if (amount >= 49 || resolvedTier === 'pro') {
      resolvedTier = 'pro';
    } else {
      resolvedTier = 'community';
    }

    const customId = `${user.id}:${product}:${resolvedTier}:${billingCycle || 'monthly'}:${amount}`;
    const description = `Exultia ${product.toUpperCase()} - ${resolvedTier.toUpperCase()} [Pay What You Want: $${amount}]`;

    // Dynamic dev vs prod URL detection
    const originHeader = req.headers.get('origin');
    const hostHeader = req.headers.get('host');
    const refererHeader = req.headers.get('referer');
    let appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://exultia.tech';

    if (originHeader && (originHeader.includes('localhost') || originHeader.includes('127.0.0.1'))) {
      appBaseUrl = originHeader;
    } else if (hostHeader && (hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1'))) {
      const proto = req.headers.get('x-forwarded-proto') || 'http';
      appBaseUrl = `${proto}://${hostHeader}`;
    } else if (refererHeader && (refererHeader.includes('localhost') || refererHeader.includes('127.0.0.1'))) {
      try {
        const u = new URL(refererHeader);
        appBaseUrl = `${u.protocol}//${u.host}`;
      } catch {}
    }

    const targetReturnPath = (returnPath && typeof returnPath === 'string' && returnPath.startsWith('/'))
      ? returnPath
      : '/account/subscription';

    const returnUrl = `${appBaseUrl}${targetReturnPath}?status=paypal_return`;
    const cancelUrl = `${appBaseUrl}${targetReturnPath}?status=paypal_cancel`;

    const order = await createPayPalOrder({
      amount,
      currency: 'USD',
      customId,
      description,
      returnUrl,
      cancelUrl,
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
