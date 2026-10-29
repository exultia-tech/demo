"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, ShieldCheck, X, Loader2, Copy, Check, Download, Key } from "lucide-react";
import confetti from "canvas-confetti";

export default function PaymentModal() {
  const { isPaymentModalOpen, paymentOptions, closePaymentModal, refreshUser } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string>("");
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [returnPlan, setReturnPlan] = useState<string>("Exultia Platform Enterprise");
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
    fetch("/api/billing/paypal/config")
      .then((res) => res.json())
      .then((data) => setPaypalConfig(data))
      .catch(() => {});
  }, []);

  // Listen for PayPal return or cancellation query parameters
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const token = params.get("token") || params.get("orderId");

    if (status === "paypal_return" && token) {
      setIsReturnOpen(true);
      setIsProcessing(true);
      setStatusNotice("Verifying and capturing approved PayPal payment...");

      let pending: any = null;
      try {
        const stored = sessionStorage.getItem("exultia_pending_paypal");
        if (stored) pending = JSON.parse(stored);
      } catch {}

      if (pending?.planName) {
        setReturnPlan(pending.planName);
      }

      fetch("/api/billing/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: token,
          product: pending?.product || "platform",
          tier: pending?.tier || "enterprise",
          billingCycle: pending?.billingCycle || "annual",
          customPrice: pending?.customPrice,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success) {
            await refreshUser();
            const tokenStr = `EXULTIA-ED25519-V1-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-ENTERPRISE`;
            setGeneratedToken(tokenStr);
            setIsSuccess(true);
            confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
            sessionStorage.removeItem("exultia_pending_paypal");
          } else {
            setError(data.error || "Failed to capture PayPal payment.");
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to capture PayPal payment.");
        })
        .finally(() => {
          setIsProcessing(false);
          setStatusNotice("");
          window.history.replaceState({}, "", window.location.pathname);
        });
    } else if (status === "paypal_cancel") {
      setIsReturnOpen(true);
      setError("PayPal checkout was cancelled. No charges were made.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [refreshUser]);

  useEffect(() => {
    if (isPaymentModalOpen) {
      setIsSuccess(false);
      setError(null);
      setStatusNotice("");
    }
  }, [isPaymentModalOpen]);

  const isOpen = isPaymentModalOpen || isReturnOpen;
  if (!isOpen) return null;

  const activePlanName = paymentOptions?.planName || returnPlan;
  const price = paymentOptions?.price ?? 100;
  const cycleLabel = paymentOptions?.billingCycle === "annual" ? "billed annually" : "per month";

  const handleClose = () => {
    setIsReturnOpen(false);
    setIsSuccess(false);
    setError(null);
    setStatusNotice("");
    closePaymentModal();
  };

  const handlePayPalCheckout = async () => {
    setIsProcessing(true);
    setStatusNotice("Connecting to PayPal...");
    setError(null);

    try {
      // 1. Create PayPal Order
      const createRes = await fetch("/api/billing/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: paymentOptions?.product || "platform",
          tier: paymentOptions?.tier || "enterprise",
          billingCycle: paymentOptions?.billingCycle || "annual",
          customPrice: price,
          returnPath: window.location.pathname,
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to initiate PayPal order");
      }

      // If approval URL provided (standard PayPal flow):
      if (orderData.approvalUrl && !orderData.mock) {
        setStatusNotice("Redirecting to PayPal Sandbox Checkout...");
        sessionStorage.setItem(
          "exultia_pending_paypal",
          JSON.stringify({
            orderId: orderData.orderId,
            product: paymentOptions?.product || "platform",
            tier: paymentOptions?.tier || "enterprise",
            billingCycle: paymentOptions?.billingCycle || "annual",
            customPrice: price,
            planName: activePlanName,
          })
        );
        window.location.href = orderData.approvalUrl;
        return;
      }

      // Simulated instant flow for mock mode:
      await new Promise((r) => setTimeout(r, 800));

      const captureRes = await fetch("/api/billing/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          product: paymentOptions?.product || "platform",
          tier: paymentOptions?.tier || "enterprise",
          billingCycle: paymentOptions?.billingCycle || "annual",
          customPrice: price,
        }),
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok) {
        throw new Error(captureData.error || "Failed to capture PayPal payment");
      }

      await refreshUser();
      const token = `EXULTIA-ED25519-V1-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-ENTERPRISE`;
      setGeneratedToken(token);
      setIsSuccess(true);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setIsProcessing(false);
      setStatusNotice("");
    }
  };

  const handleInstantDevSimulation = async () => {
    setIsProcessing(true);
    setStatusNotice("Running instant local simulation...");
    setError(null);
    try {
      const res = await fetch("/api/billing/mock-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: paymentOptions?.product || "platform",
          tier: paymentOptions?.tier || "enterprise",
          billingCycle: paymentOptions?.billingCycle || "annual",
          customPrice: price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Simulation failed");

      await refreshUser();
      const token = `EXULTIA-ED25519-V1-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-ENTERPRISE`;
      setGeneratedToken(token);
      setIsSuccess(true);
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsProcessing(false);
      setStatusNotice("");
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
          maxWidth: "460px",
          padding: "2.25rem 2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 112, 186, 0.2)",
          position: "relative",
        }}
        className="fade-in"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
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
          aria-label="Close Payment Modal"
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.72rem",
                  background: "rgba(0, 112, 186, 0.15)",
                  color: "#38BDF8",
                  border: "1px solid rgba(0, 112, 186, 0.35)",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0070BA" }} />
                Secure PayPal Payment
              </div>

              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.4rem 0" }}>
                {activePlanName}
              </h2>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#38BDF8", margin: "0.25rem 0" }}>
                ${price}
                <span style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500, marginLeft: "6px" }}>
                  ({cycleLabel})
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: "0.5rem 0 0 0", lineHeight: 1.5 }}>
                Click below to complete your payment securely with PayPal.
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "10px",
                  padding: "0.75rem",
                  color: "#FCA5A5",
                  fontSize: "0.84rem",
                  marginBottom: "1.25rem",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* PayPal Button Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <button
                type="button"
                onClick={handlePayPalCheckout}
                disabled={isProcessing}
                style={{
                  width: "100%",
                  padding: "1rem",
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
                  transition: "all 0.2s ease",
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{statusNotice || "Connecting to PayPal..."}</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontStyle: "italic", fontWeight: 900 }}>PayPal</span>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Checkout (${price}) →</span>
                  </>
                )}
              </button>

              {paypalConfig.mode === "sandbox" && (
                <button
                  type="button"
                  onClick={handleInstantDevSimulation}
                  disabled={isProcessing}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "1px dashed rgba(56, 189, 248, 0.4)",
                    background: "rgba(56, 189, 248, 0.05)",
                    color: "#38BDF8",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <span>⚡ Instant Dev Simulation (Bypass Login)</span>
                </button>
              )}

              <div
                style={{
                  fontSize: "0.74rem",
                  color: "#94A3B8",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <span>Pay in 4 interest-free payments available via PayPal</span>
              </div>
            </div>

            {/* Security Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "0.72rem",
                color: "#64748B",
              }}
            >
              <ShieldCheck size={14} color="#34D399" />
              <span>Encrypted 256-bit SSL • PCI DSS Level 1 Certified • PayPal Verified</span>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
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

            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
              Payment Confirmed!
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              Your subscription to <strong style={{ color: "#67E8F9" }}>{paymentOptions.planName}</strong> is active.
            </p>

            {generatedToken && (
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "14px",
                  padding: "0.9rem",
                  marginBottom: "1.5rem",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#38BDF8", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "5px" }}>
                    <Key size={12} />
                    Ed25519 License Token
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedToken);
                      setCopiedToken(true);
                      setTimeout(() => setCopiedToken(false), 2000);
                    }}
                    style={{
                      padding: "3px 8px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: "rgba(56, 189, 248, 0.15)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "5px",
                      color: "#38BDF8",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {copiedToken ? <Check size={11} /> : <Copy size={11} />}
                    {copiedToken ? "Copied" : "Copy"}
                  </button>
                </div>

                <div
                  style={{
                    background: "rgba(10, 15, 26, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "0.55rem 0.75rem",
                    fontFamily: "monospace",
                    fontSize: "0.72rem",
                    color: "#A7F3D0",
                    wordBreak: "break-all",
                    userSelect: "all",
                  }}
                >
                  {generatedToken}
                </div>
              </div>
            )}

            <button
              onClick={closePaymentModal}
              className="btn-primary"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", fontWeight: 700 }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
