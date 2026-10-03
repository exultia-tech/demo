/**
 * PayPal REST API v2 Integration Client
 * Supports both Sandbox and Live production environments.
 * Handles OAuth 2.0 token negotiation, order creation, capture, and webhook validation.
 */

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_MODE = (process.env.PAYPAL_MODE || 'sandbox').toLowerCase();
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || '';

const BASE_URL = PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/**
 * Checks if real PayPal credentials are provided or if running in mock/demo mode
 */
export function isPayPalConfigured(): boolean {
  return !!(
    PAYPAL_CLIENT_ID &&
    PAYPAL_CLIENT_SECRET &&
    !PAYPAL_CLIENT_ID.startsWith('mock_') &&
    !PAYPAL_CLIENT_SECRET.startsWith('mock_')
  );
}

/**
 * Get public PayPal configuration for frontend integration
 */
export function getPayPalPublicConfig() {
  return {
    clientId: PAYPAL_CLIENT_ID || 'sandbox_ready_awaiting_credentials',
    mode: PAYPAL_MODE,
    isConfigured: isPayPalConfigured(),
    currency: 'USD',
  };
}

/**
 * Fetch OAuth 2.0 Bearer Access Token using Client Credentials grant
 */
export async function getPayPalAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt - 60000) {
    return cachedAccessToken.token;
  }

  if (!isPayPalConfigured()) {
    // Return mock token for local dev / testing before credentials arrive
    return 'mock_paypal_access_token_' + Date.now();
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to obtain PayPal access token: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  const token = data.access_token;
  const expiresIn = (data.expires_in || 3600) * 1000;

  cachedAccessToken = {
    token,
    expiresAt: Date.now() + expiresIn,
  };

  return token;
}

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  customId?: string; // Format: userId:product:tier:billingCycle
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  approvalUrl?: string;
  mock?: boolean;
}

/**
 * Create a PayPal Order with INTENT=CAPTURE
 */
export async function createPayPalOrder(params: CreateOrderParams): Promise<PayPalOrderResponse> {
  const currency = params.currency || 'USD';
  const amountStr = params.amount.toFixed(2);

  // If credentials are not yet configured, return simulated order for seamless UI preview
  if (!isPayPalConfigured()) {
    const mockOrderId = `PAYPAL-MOCK-${Date.now().toString(36).toUpperCase()}`;
    return {
      id: mockOrderId,
      status: 'CREATED',
      approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${mockOrderId}`,
      mock: true,
    };
  }

  const token = await getPayPalAccessToken();

  const payload: Record<string, any> = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: params.customId || 'default',
        description: params.description || 'Exultia Enterprise Subscription',
        custom_id: params.customId || undefined,
        amount: {
          currency_code: currency,
          value: amountStr,
        },
      },
    ],
    application_context: {
      brand_name: 'Exultia SecOps',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: params.returnUrl || 'https://exultia.tech/account/subscription?status=success',
      cancel_url: params.cancelUrl || 'https://exultia.tech/account/subscription?status=cancel',
    },
  };

  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`PayPal Order creation failed (${res.status}): ${errorBody}`);
  }

  const orderData = await res.json();
  const approveLink = (orderData.links || []).find((l: any) => l.rel === 'approve');

  return {
    id: orderData.id,
    status: orderData.status,
    approvalUrl: approveLink ? approveLink.href : undefined,
    mock: false,
  };
}

export interface CaptureOrderResult {
  success: boolean;
  orderId: string;
  status: string;
  payerId?: string;
  payerEmail?: string;
  amountCaptured?: string;
  currency?: string;
  customId?: string;
  mock?: boolean;
  raw?: any;
}

/**
 * Capture an approved PayPal Order
 */
export async function capturePayPalOrder(orderId: string): Promise<CaptureOrderResult> {
  // If mock order
  if (!isPayPalConfigured() || orderId.startsWith('PAYPAL-MOCK-')) {
    return {
      success: true,
      orderId,
      status: 'COMPLETED',
      payerId: 'MOCK_PAYER_ID_001',
      payerEmail: 'sandbox-customer@exultia.tech',
      amountCaptured: '0.00',
      currency: 'USD',
      mock: true,
    };
  }

  const token = await getPayPalAccessToken();

  const res = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`PayPal Order capture failed (${res.status}): ${errorBody}`);
  }

  const captureData = await res.json();
  const purchaseUnit = captureData.purchase_units?.[0];
  const capture = purchaseUnit?.payments?.captures?.[0];

  return {
    success: captureData.status === 'COMPLETED',
    orderId: captureData.id,
    status: captureData.status,
    payerId: captureData.payer?.payer_id,
    payerEmail: captureData.payer?.email_address,
    amountCaptured: capture?.amount?.value,
    currency: capture?.amount?.currency_code,
    customId: purchaseUnit?.custom_id || purchaseUnit?.reference_id,
    mock: false,
    raw: captureData,
  };
}

/**
 * Verify Webhook Signature received from PayPal
 */
export async function verifyPayPalWebhookSignature(args: {
  transmissionId: string;
  transmissionTime: string;
  certUrl: string;
  authAlgo: string;
  transmissionSig: string;
  webhookId?: string;
  webhookEvent: any;
}): Promise<boolean> {
  const webhookId = args.webhookId || PAYPAL_WEBHOOK_ID;

  if (!isPayPalConfigured() || !webhookId) {
    // In mock mode or local testing without webhook ID, accept validly formed mock payloads
    return true;
  }

  const token = await getPayPalAccessToken();

  const payload = {
    auth_algo: args.authAlgo,
    cert_url: args.certUrl,
    transmission_id: args.transmissionId,
    transmission_sig: args.transmissionSig,
    transmission_time: args.transmissionTime,
    webhook_id: webhookId,
    webhook_event: args.webhookEvent,
  };

  const res = await fetch(`${BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return data.verification_status === 'SUCCESS';
}
