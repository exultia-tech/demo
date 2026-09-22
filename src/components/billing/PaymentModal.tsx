"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CreditCard, CheckCircle2, ShieldCheck, X, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function PaymentModal() {
  const { isPaymentModalOpen, paymentOptions, closePaymentModal, refreshUser } = useAuth();

  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("888");
  const [zip, setZip] = useState("10001");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPaymentModalOpen || !paymentOptions) return null;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate real-time gateway handshake
      await new Promise(r => setTimeout(r, 1200));

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
        throw new Error(data.error || "Payment simulation failed");
      }

      await refreshUser();
      setIsSuccess(true);
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(3, 7, 18, 0.88)",
      backdropFilter: "blur(10px)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
        border: "1px solid rgba(6, 182, 212, 0.35)",
        borderRadius: "22px",
        width: "100%",
        maxWidth: "480px",
        padding: "2.5rem 2rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px rgba(6, 182, 212, 0.18)",
        position: "relative"
      }} className="fade-in">
        
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
            placeItems: "center"
          }}
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header & Order Summary */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", background: "rgba(6, 182, 212, 0.2)", color: "#67E8F9", border: "1px solid rgba(6, 182, 212, 0.4)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700, textTransform: "uppercase" }}>
                  Stripe Test Gateway
                </span>
              </div>
              <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>
                {paymentOptions.planName}
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0 }}>
                Instant activation with full feature access and docket synchronization.
              </p>
            </div>

            {/* Price Box */}
            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem"
            }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#94A3B8" }}>Total Due Today</div>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                  Billed {paymentOptions.billingCycle === "annual" ? "Annually" : "Monthly"}
                </div>
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#FFFFFF" }}>
                ${paymentOptions.price}
                <span style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>
                  /{paymentOptions.billingCycle === "annual" ? "mo" : "mo"}
                </span>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "0.75rem", color: "#FCA5A5", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                {error}
              </div>
            )}

            {/* Simulated Payment Form */}
            <form onSubmit={handleProcessPayment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Card Information
                </label>
                <div style={{ position: "relative" }}>
                  <CreditCard size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem 0.75rem 0.75rem 2.4rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.3rem" }}>Expiry</label>
                  <input 
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
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
                      textAlign: "center"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.3rem" }}>CVC</label>
                  <input 
                    type="text"
                    value={cvc}
                    onChange={e => setCvc(e.target.value)}
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
                      textAlign: "center"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.3rem" }}>ZIP Code</label>
                  <input 
                    type="text"
                    value={zip}
                    onChange={e => setZip(e.target.value)}
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
                      textAlign: "center"
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
                  gap: "0.5rem"
                }}
              >
                {isProcessing ? "Processing via Stripe..." : `Subscribe Now ($${paymentOptions.price}) →`}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "1.25rem", fontSize: "0.75rem", color: "#64748B" }}>
              <ShieldCheck size={14} color="#34D399" />
              <span>Encrypted 256-bit SSL • PCI DSS Level 1 Compliant</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(52, 211, 153, 0.15)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              margin: "0 auto 1.25rem auto",
              display: "grid",
              placeItems: "center",
              color: "#34D399"
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              Subscription Activated!
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              You now have full access to <strong style={{ color: "#67E8F9" }}>{paymentOptions.planName}</strong>. All multi-agency tools and team features have been unlocked in your account.
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
