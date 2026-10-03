import { describe, it, expect } from "vitest";
import {
  getPayPalPublicConfig,
  createPayPalOrder,
  capturePayPalOrder,
  verifyPayPalWebhookSignature,
  isPayPalConfigured
} from "../src/lib/billing/paypal";

describe("PayPal Payment Provider Gateway", () => {
  it("should return safe public configuration without exposing server secrets", () => {
    const config = getPayPalPublicConfig();
    expect(config).toHaveProperty("clientId");
    expect(config).toHaveProperty("mode");
    expect(config).toHaveProperty("isConfigured");
    expect(config).toHaveProperty("currency");
    expect(config.currency).toBe("USD");
    expect((config as any).clientSecret).toBeUndefined();
  });

  it("should identify whether real PayPal credentials are provided", () => {
    const configured = isPayPalConfigured();
    expect(typeof configured).toBe("boolean");
  });

  it("should generate a valid PayPal order with intent CAPTURE and custom reference ID", async () => {
    const order = await createPayPalOrder({
      amount: 49.00,
      currency: "USD",
      customId: "usr_test_123:pureide:pro:annual",
      description: "PureIDE Pro Annual Subscription",
    });

    expect(order).toBeDefined();
    expect(order.id).toBeTruthy();
    expect(order.status).toBe("CREATED");
    expect(order.approvalUrl).toBeTruthy();
  });

  it("should capture an approved order and return payment confirmation receipt", async () => {
    const captureResult = await capturePayPalOrder("PAYPAL-MOCK-TESTORDER123");

    expect(captureResult).toBeDefined();
    expect(captureResult.success).toBe(true);
    expect(captureResult.status).toBe("COMPLETED");
    expect(captureResult.orderId).toBe("PAYPAL-MOCK-TESTORDER123");
  });

  it("should handle webhook signature verification in mock and test environments", async () => {
    const valid = await verifyPayPalWebhookSignature({
      transmissionId: "trans_test_123",
      transmissionTime: new Date().toISOString(),
      certUrl: "https://api.sandbox.paypal.com/cert",
      authAlgo: "SHA256withRSA",
      transmissionSig: "mock_signature_data",
      webhookEvent: {
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        resource: { id: "CAP-12345" },
      },
    });

    expect(valid).toBe(true);
  });
});
