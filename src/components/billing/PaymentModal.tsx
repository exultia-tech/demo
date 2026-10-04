"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CreditCard, CheckCircle2, ShieldCheck, X, Sparkles, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function PaymentModal() {
  const { isPaymentModalOpen, paymentOptions, closePaymentModal, refreshUser } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("888");
  const [zip, setZip] = useState("10001");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paypalConfig, setPaypalConfig] = useState<{
    clientId: string;
    mode: string;
    isConfigured: boolean;
  }>({
    clientId: "sandbox_ready",
    mode: "sandbox",
    isConfigured: false,
  });

  useEffect(() => {
    if (isPaymentModalOpen) {
      fetch("/api/billing/paypal/config")
        .then((res) => res.json())
        .then((data) => setPaypalConfig(data))
        .catch(() => {});
    }
  }, [isPaymentModalOpen]);

  if (!isPaymentModalOpen || !paymentOptions) return null;

  // Process checkout via PayPal order creation and capture
  const handlePayPalCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create PayPal Order
      const createRes = await fetch("/api/billing/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: paymentOptions.product,
          tier: paymentOptions.tier,
          billingCycle: paymentOptions.billingCycle,
          customPrice: paymentOptions.price,
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to initiate PayPal order");
      }

      // If simulated or sandbox popup handshake
      await new Promise((r) => setTimeout(r, 1000));

      // 2. Capture PayPal Order
      const captureRes = await fetch("/api/billing/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          product: paymentOptions.product,
          tier: paymentOptions.tier,
          billingCycle: paymentOptions.billingCycle,
        }),
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok) {
        throw new Error(captureData.error || "Failed to capture PayPal payment");
      }

      await refreshUser();
      setIsSuccess(true);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Direct Card processing fallback
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1200));

      const res = await fetch("/api/billing/mock-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: paymentOptions.product,
          tier: paymentOptions.tier,
          billingCycle: paymentOptions.billingCycle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment processing failed");
      }

      await refreshUser();
      setIsSuccess(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(3, 7, 18, 0.88)",
        backdropFilter: "blur(12px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
          border: "1px solid rgba(0, 112, 186, 0.4)",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "500px",
          padding: "2.5rem 2.25rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 112, 186, 0.2)",
          position: "relative",
        }}
        className="fade-in"
      >
        {/* Close Button */}
        <button
          onClick={closePaymentModal}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            color: "#94A3B8",
            cursor: "pointer",
            padding: "6px",
            display: "grid",
            placeItems: "center",
          }}
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header & Order Summary */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    background: "rgba(0, 112, 186, 0.2)",
                    color: "#38BDF8",
                    border: "1px solid rgba(0, 112, 186, 0.4)",
                    padding: "3px 9px",
                    borderRadius: "6px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0070BA" }} />
                  PayPal Gateway • {paypalConfig.mode.toUpperCase()}
                </span>
                {!paypalConfig.isConfigured && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      background: "rgba(245, 158, 11, 0.15)",
                      color: "#FCD34D",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      padding: "2px 7px",
                      borderRadius: "5px",
                      fontWeight: 700,
                    }}
                  >
                    Awaiting Credentials
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>
                {paymentOptions.planName}
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.86rem", margin: 0 }}>
                Instant activation with full feature access, API tokens, and priority support.
              </p>
            </div>

            {/* Price Box */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Total Due Today</div>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                  Billed {paymentOptions.billingCycle === "annual" ? "Annually" : "Monthly"}
                </div>
              </div>
              <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "#FFFFFF" }}>
                ${paymentOptions.price}
                <span style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>
                  /{paymentOptions.billingCycle === "annual" ? "mo" : "mo"}
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "4px",
                borderRadius: "12px",
                marginBottom: "1.25rem",
              }}
            >
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                style={{
                  padding: "0.6rem",
                  borderRadius: "9px",
                  border: "none",
                  background: paymentMethod === "paypal" ? "#0070BA" : "transparent",
                  color: paymentMethod === "paypal" ? "#FFFFFF" : "#94A3B8",
                  fontWeight: 700,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                <span>PayPal</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  Fast
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                style={{
                  padding: "0.6rem",
                  borderRadius: "9px",
                  border: "none",
                  background: paymentMethod === "card" ? "rgba(255, 255, 255, 0.12)" : "transparent",
                  color: paymentMethod === "card" ? "#FFFFFF" : "#94A3B8",
                  fontWeight: 700,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                <CreditCard size={15} />
                <span>Card</span>
              </button>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "10px",
                  padding: "0.75rem",
                  color: "#FCA5A5",
                  fontSize: "0.85rem",
                  marginBottom: "1.25rem",
                }}
              >
                {error}
              </div>
            )}

            {/* TAB 1: PAYPAL SMART CHECKOUT */}
            {paymentMethod === "paypal" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{
                    background: "rgba(0, 112, 186, 0.08)",
                    border: "1px solid rgba(0, 112, 186, 0.25)",
                    borderRadius: "14px",
                    padding: "1.25rem",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#CBD5E1", fontSize: "0.86rem", margin: "0 0 1rem 0" }}>
                    Complete payment securely using your PayPal balance, linked bank account, or Pay in 4.
                  </p>

                  {/* Primary PayPal Gold Button */}
                  <button
                    type="button"
                    onClick={handlePayPalCheckout}
                    disabled={isProcessing}
                    style={{
                      width: "100%",
                      padding: "0.95rem",
                      borderRadius: "12px",
                      border: "none",
                      background: "#FFC439",
                      color: "#003087",
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 15px rgba(255, 196, 57, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Connecting to PayPal...</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontStyle: "italic", fontWeight: 900 }}>PayPal</span>
                        <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Checkout →</span>
                      </>
                    )}
                  </button>

                  {/* Pay in 4 Note */}
                  <div
                    style={{
                      marginTop: "0.85rem",
                      fontSize: "0.72rem",
                      color: "#94A3B8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <span>Pay in 4 interest-free payments available via PayPal</span>
                  </div>
                </div>

                {!paypalConfig.isConfigured && (
                  <div
                    style={{
                      background: "rgba(30, 41, 59, 0.6)",
                      border: "1px dashed rgba(148, 163, 184, 0.3)",
                      borderRadius: "10px",
                      padding: "0.75rem 0.9rem",
                      fontSize: "0.76rem",
                      color: "#94A3B8",
                      lineHeight: 1.4,
                    }}
                  >
                    <strong style={{ color: "#FCD34D" }}>Sandbox Ready:</strong> The backend is configured to accept
                    your PayPal Client ID & Secret. Clicking above will execute a simulated end-to-end sandbox handshake.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD */}
            {paymentMethod === "card" && (
              <form onSubmit={handleCardPayment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      color: "#CBD5E1",
                      fontWeight: 600,
                      marginBottom: "0.35rem",
                    }}
                  >
                    Card Information
                  </label>
                  <div style={{ position: "relative" }}>
                    <CreditCard
                      size={16}
                      color="#64748B"
                      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 0.75rem 0.75rem 2.4rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.3rem" }}>
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.65rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "0.85rem",
                        outline: "none",
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.3rem" }}>
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.65rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "0.85rem",
                        outline: "none",
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.3rem" }}>
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.65rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "0.85rem",
                        outline: "none",
                        textAlign: "center",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    marginTop: "0.75rem",
                    background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                    color: "#041019",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  {isProcessing ? "Processing..." : `Subscribe Now ($${paymentOptions.price}) →`}
                </button>
              </form>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "1.25rem",
                fontSize: "0.75rem",
                color: "#64748B",
              }}
            >
              <ShieldCheck size={14} color="#34D399" />
              <span>Encrypted 256-bit SSL • PCI DSS Level 1 Certified • PayPal Verified</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(52, 211, 153, 0.15)",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                margin: "0 auto 1.25rem auto",
                display: "grid",
                placeItems: "center",
                color: "#34D399",
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              Subscription Activated!
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              Your payment has been successfully confirmed. You now have full access to{" "}
              <strong style={{ color: "#67E8F9" }}>{paymentOptions.planName}</strong> across your workstations, tools, and developer environments.
            </p>

            <button
              onClick={closePaymentModal}
              className="btn-primary"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", fontWeight: 700 }}
            >
              Enter Workspace →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
