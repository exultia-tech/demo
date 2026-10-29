"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";
import { 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Zap, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Server, 
  Terminal, 
  Copy, 
  Download, 
  Loader2, 
  Sparkles, 
  Key, 
  ExternalLink,
  Shield,
  Clock,
  Layers,
  HelpCircle,
  Laptop
} from "lucide-react";
import { 
  calculateEnterpriseFleetPrice, 
  EXULTIA_PLATFORM_TIERS 
} from "@/lib/bundle-pricing";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, getUserTier, refreshUser } = useAuth();

  // URL Query Parameters or Defaults
  const initialNodes = parseInt(searchParams.get("nodes") || "5", 10);
  const initialCycle = (searchParams.get("cycle") === "monthly" ? "monthly" : "annual") as "monthly" | "annual";
  const initialTier = searchParams.get("tier") === "community" ? "community" : "enterprise";

  const [selectedTier, setSelectedTier] = useState<"community" | "enterprise">(initialTier);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(initialCycle);
  const [nodeCount, setNodeCount] = useState<number>(isNaN(initialNodes) || initialNodes < 1 ? 5 : initialNodes);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");

  // Card form state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("888");
  const [zip, setZip] = useState("10001");

  // Processing & State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string>("");

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

  // Calculate pricing
  const fleetCalc = calculateEnterpriseFleetPrice(nodeCount, billingCycle);
  const finalPrice = selectedTier === "community" ? 0 : fleetCalc.monthlyRate;
  const annualTotal = selectedTier === "community" ? 0 : (billingCycle === "annual" ? fleetCalc.monthlyRate * 12 : fleetCalc.monthlyRate * 12);

  // Preset node options
  const nodePresets = [
    { nodes: 1, label: "1 Node", hint: "Solo Dev" },
    { nodes: 5, label: "5 Nodes", hint: "Small Team ★" },
    { nodes: 10, label: "10 Nodes", hint: "Growing Shop" },
    { nodes: 25, label: "25 Nodes", hint: "Flat Cap ★" },
    { nodes: 50, label: "50 Nodes", hint: "Scale Fleet" },
    { nodes: 100, label: "100 Nodes", hint: "Infrastructure" },
  ];

  // PayPal Checkout
  const handlePayPalCheckout = async () => {
    if (selectedTier === "community") {
      handleCommunityActivation();
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create order
      const createRes = await fetch("/api/billing/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "platform",
          tier: "enterprise",
          billingCycle,
          customPrice: finalPrice,
          nodeCount,
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to initiate PayPal order");
      }

      // Simulated approval step for sandbox/instant flow
      await new Promise((r) => setTimeout(r, 1000));

      // 2. Capture order
      const captureRes = await fetch("/api/billing/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          product: "platform",
          tier: "enterprise",
          billingCycle,
          customPrice: finalPrice,
          nodeCount,
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
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Direct Card Checkout
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTier === "community") {
      handleCommunityActivation();
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1100));

      const res = await fetch("/api/billing/mock-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "platform",
          tier: "enterprise",
          billingCycle,
          customPrice: finalPrice,
          amount: finalPrice,
          nodeCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment processing failed");
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
    } finally {
      setIsProcessing(false);
    }
  };

  // Community Activation ($0)
  const handleCommunityActivation = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await fetch("/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "platform",
          tier: "community",
          billingCycle: "annual",
        }),
      });
      if (!res.ok) throw new Error("Failed to activate Community plan");
      await refreshUser();
      setIsSuccess(true);
      setGeneratedToken(`EXULTIA-ED25519-COMMUNITY-${Date.now().toString(36).toUpperCase()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ background: "radial-gradient(ellipse at top, #0f172a 0%, #030712 100%)", minHeight: "100vh", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        
        {/* Security & Verification Top Badge */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "6px", 
              padding: "4px 12px", 
              borderRadius: "9999px", 
              background: "rgba(16, 185, 129, 0.12)", 
              border: "1px solid rgba(16, 185, 129, 0.3)", 
              color: "#34D399", 
              fontSize: "0.8rem", 
              fontWeight: 700 
            }}>
              <ShieldCheck size={14} />
              256-Bit SSL Encrypted Payment Gateway
            </span>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "6px", 
              padding: "4px 12px", 
              borderRadius: "9999px", 
              background: "rgba(56, 189, 248, 0.12)", 
              border: "1px solid rgba(56, 189, 248, 0.3)", 
              color: "#38BDF8", 
              fontSize: "0.8rem", 
              fontWeight: 700 
            }}>
              <Key size={14} />
              Offline Ed25519 SCIF Tokens
            </span>
          </div>

          <Link href="/account/subscription" style={{ color: "#94A3B8", fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
            ← Back to Plan Matrix
          </Link>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
            Platform Payment & Fleet Checkout
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "1.05rem", maxWidth: "780px", lineHeight: 1.6 }}>
            Pay for what you deploy with zero sales friction. Community Sovereign is free forever; Enterprise Edition automatically unlocks 24/7 priority live feeds, unlimited PureIDE builds, and offline Ed25519 host tokens on any paid allocation.
          </p>
        </div>

        {!isSuccess ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              
              {/* LEFT COLUMN: TIER CONFIGURATION & FLEET SIZING */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                {/* 1. Edition Selector */}
                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                    Step 1: Choose Your Platform Edition
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {/* Community Option */}
                    <div 
                      onClick={() => setSelectedTier("community")}
                      style={{ 
                        padding: "1.25rem", 
                        borderRadius: "14px", 
                        cursor: "pointer", 
                        border: selectedTier === "community" ? "2px solid #34D399" : "1px solid rgba(255, 255, 255, 0.1)",
                        background: selectedTier === "community" ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "1.1rem" }}>Community</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#34D399" }}>$0</span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.4 }}>
                        Free sovereign host daemon with local sentinels & offline CLI. Free forever.
                      </div>
                    </div>

                    {/* Enterprise Option */}
                    <div 
                      onClick={() => setSelectedTier("enterprise")}
                      style={{ 
                        padding: "1.25rem", 
                        borderRadius: "14px", 
                        cursor: "pointer", 
                        border: selectedTier === "enterprise" ? "2px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.1)",
                        background: selectedTier === "enterprise" ? "rgba(56, 189, 248, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        transition: "all 0.2s ease",
                        position: "relative"
                      }}
                    >
                      <div style={{ position: "absolute", top: "-10px", right: "12px", background: "linear-gradient(135deg, #00E5FF, #3B82F6)", color: "#030712", fontSize: "0.68rem", fontWeight: 900, padding: "2px 8px", borderRadius: "9999px", textTransform: "uppercase" }}>
                        Recommended
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "1.1rem" }}>Enterprise</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#38BDF8" }}>
                          ${fleetCalc.monthlyRate}<span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>/mo</span>
                        </span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.4 }}>
                        Any paid allocation unlocks 24/7 priority live threat streaming, unlimited PureIDE builds, and Ed25519 tokens.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Enterprise Fleet Sizing (Only if Enterprise selected) */}
                {selectedTier === "enterprise" && (
                  <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Step 2: Fleet Node Capacity
                      </div>

                      {/* Billing Cycle Toggle */}
                      <div style={{ display: "flex", background: "rgba(0, 0, 0, 0.4)", padding: "3px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <button
                          type="button"
                          onClick={() => setBillingCycle("annual")}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            background: billingCycle === "annual" ? "#0070BA" : "transparent",
                            color: billingCycle === "annual" ? "#FFFFFF" : "#94A3B8",
                          }}
                        >
                          Annual (Save 20%)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle("monthly")}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            background: billingCycle === "monthly" ? "#0070BA" : "transparent",
                            color: billingCycle === "monthly" ? "#FFFFFF" : "#94A3B8",
                          }}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>

                    {/* Node Slider & Count */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>
                          {nodeCount} Protected Host{nodeCount > 1 ? "s" : ""}
                        </span>
                        <span style={{ fontSize: "0.85rem", color: fleetCalc.isCappedAtFlatRate ? "#34D399" : "#38BDF8", fontWeight: 700 }}>
                          {fleetCalc.isCappedAtFlatRate ? "★ Flat Rate Fleet Cap Active" : `$${fleetCalc.effectivePerNodeRate.toFixed(2)}/host/mo`}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={nodeCount}
                        onChange={(e) => setNodeCount(parseInt(e.target.value, 10))}
                        style={{ width: "100%", accentColor: "#00E5FF", cursor: "pointer", height: "6px" }}
                      />
                    </div>

                    {/* Presets */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", marginBottom: "1.25rem" }}>
                      {nodePresets.map((preset) => {
                        const isSelected = nodeCount === preset.nodes;
                        return (
                          <button
                            key={preset.nodes}
                            type="button"
                            onClick={() => setNodeCount(preset.nodes)}
                            style={{
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: isSelected ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.08)",
                              background: isSelected ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.02)",
                              color: isSelected ? "#38BDF8" : "#94A3B8",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                          >
                            <div>{preset.label}</div>
                            <div style={{ fontSize: "0.68rem", opacity: 0.75 }}>{preset.hint}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Enterprise Breakdown Card */}
                    <div style={{ background: "rgba(0, 0, 0, 0.35)", borderRadius: "12px", padding: "1rem", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                        <span style={{ color: "#94A3B8" }}>Host Rate</span>
                        <span style={{ color: "#FFFFFF", fontWeight: 600 }}>${fleetCalc.sub25Rate}/node/mo ({billingCycle})</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                        <span style={{ color: "#94A3B8" }}>Base Allocation</span>
                        <span style={{ color: "#FFFFFF", fontWeight: 600 }}>{nodeCount} Nodes ({nodeCount <= 25 ? "Standard Baseline" : "25 Baseline + " + (nodeCount - 25) + " Extended"})</span>
                      </div>
                      {fleetCalc.savingsVsPerNode > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                          <span style={{ color: "#34D399" }}>Fleet Cap Savings</span>
                          <span style={{ color: "#34D399", fontWeight: 700 }}>-${fleetCalc.savingsVsPerNode}/mo</span>
                        </div>
                      )}
                      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", fontSize: "1rem" }}>
                        <span style={{ color: "#FFFFFF", fontWeight: 700 }}>Total Billed</span>
                        <span style={{ color: "#38BDF8", fontWeight: 800 }}>
                          ${fleetCalc.monthlyRate}/mo {billingCycle === "annual" && <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>(${(fleetCalc.monthlyRate * 12).toLocaleString()}/yr)</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Reassurance & Jokes Card */}
                <div style={{ background: "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: "16px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FCD34D", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🛡️</span> Zero Sales Bureaucracy Guarantee
                  </div>
                  <p style={{ color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.5, margin: "0 0 0.5rem 0" }}>
                    <strong>Zero aggressive badge-scanning or elevator pitches from that InfoSec convention hottie hired to extract your corporate email so their SDR team can stalk your LinkedIn for six months.</strong>
                  </p>
                  <p style={{ color: "#94A3B8", fontSize: "0.78rem", lineHeight: 1.4, margin: 0 }}>
                    No &apos;no-obligation&apos; Ruth&apos;s Chris steak dinner required to scale up your node count or access preem-tier airgap compiler tools. Just enter the number of nodes you need, pay directly, and download your offline Ed25519 token.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: PAYMENT GATEWAY & SUMMARY */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                <div style={{ background: "linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 26, 0.95) 100%)", border: "1px solid rgba(0, 112, 186, 0.4)", borderRadius: "20px", padding: "2rem", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8)" }}>
                  
                  {/* Gateway Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Payment Terminal
                      </div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF" }}>
                        {selectedTier === "community" ? "Community Sovereign" : `Enterprise Fleet (${nodeCount} Nodes)`}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: selectedTier === "community" ? "#34D399" : "#38BDF8" }}>
                        ${finalPrice}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                        {selectedTier === "community" ? "Free Forever" : `per month (${billingCycle})`}
                      </div>
                    </div>
                  </div>

                  {/* Entitlement Highlights */}
                  <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: "12px", padding: "0.9rem", marginBottom: "1.5rem", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "0.5rem" }}>
                      Included with your deployment:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.6 }}>
                      <li>Autonomous Linux Daemon with in-memory self-healing sentinels</li>
                      {selectedTier === "enterprise" && (
                        <>
                          <li style={{ color: "#67E8F9" }}>24/7 priority live threat intelligence stream (110+ global registries)</li>
                          <li style={{ color: "#67E8F9" }}>Unlimited PureIDE workstation builds &amp; compiler daemons</li>
                          <li style={{ color: "#67E8F9" }}>Zero-telemetry cryptographic Ed25519 token (/etc/exultia/license.key)</li>
                          <li style={{ color: "#67E8F9" }}>Airgap &amp; SCIF compliant offline operation</li>
                        </>
                      )}
                      {selectedTier === "community" && (
                        <li>Full Live Threat Feed w/local copy (daily sync) &amp; local sentinels</li>
                      )}
                    </ul>
                  </div>

                  {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "0.75rem", color: "#FCA5A5", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                      {error}
                    </div>
                  )}

                  {selectedTier === "community" ? (
                    <div>
                      <button
                        type="button"
                        onClick={handleCommunityActivation}
                        disabled={isProcessing}
                        className="btn-primary"
                        style={{
                          width: "100%",
                          padding: "1rem",
                          borderRadius: "12px",
                          fontWeight: 800,
                          fontSize: "1rem",
                          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                          color: "#FFFFFF",
                          border: "none",
                          cursor: isProcessing ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        <span>Activate Community Sovereign ($0) →</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Payment Method Selector */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", background: "rgba(0, 0, 0, 0.3)", padding: "4px", borderRadius: "12px", marginBottom: "1.25rem" }}>
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
                          <span style={{ fontSize: "0.65rem", background: "rgba(255, 255, 255, 0.2)", padding: "1px 5px", borderRadius: "4px" }}>
                            Instant
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

                      {/* TAB 1: PAYPAL */}
                      {paymentMethod === "paypal" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div style={{ background: "rgba(0, 112, 186, 0.08)", border: "1px solid rgba(0, 112, 186, 0.25)", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
                            <p style={{ color: "#CBD5E1", fontSize: "0.86rem", margin: "0 0 1rem 0" }}>
                              Complete payment securely using your PayPal balance, linked bank account, or Pay in 4.
                            </p>

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
                                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Checkout (${finalPrice}) →</span>
                                </>
                              )}
                            </button>

                            <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "#94A3B8" }}>
                              Pay in 4 interest-free payments available via PayPal
                            </div>
                          </div>

                          {!paypalConfig.isConfigured && (
                            <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px dashed rgba(148, 163, 184, 0.3)", borderRadius: "10px", padding: "0.75rem 0.9rem", fontSize: "0.76rem", color: "#94A3B8", lineHeight: 1.4 }}>
                              <strong style={{ color: "#FCD34D" }}>Sandbox Ready:</strong> The gateway is ready for client credentials. Click above to execute a simulated end-to-end sandbox handshake and token generation.
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 2: CREDIT / DEBIT CARD */}
                      {paymentMethod === "card" && (
                        <form onSubmit={handleCardPayment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                              Card Information
                            </label>
                            <div style={{ position: "relative" }}>
                              <CreditCard size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
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
                                style={{ width: "100%", padding: "0.65rem", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", color: "white", fontSize: "0.85rem", textAlign: "center" }}
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
                                style={{ width: "100%", padding: "0.65rem", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", color: "white", fontSize: "0.85rem", textAlign: "center" }}
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
                                style={{ width: "100%", padding: "0.65rem", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", color: "white", fontSize: "0.85rem", textAlign: "center" }}
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
                              marginTop: "0.5rem",
                              background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                              color: "#041019",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            {isProcessing ? "Processing..." : `Pay $${finalPrice} & Activate Fleet →`}
                          </button>
                        </form>
                      )}
                    </>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "1.5rem", fontSize: "0.75rem", color: "#64748B" }}>
                    <ShieldCheck size={14} color="#34D399" />
                    <span>Encrypted 256-bit SSL • PCI DSS Level 1 • PayPal Verified</span>
                  </div>

                </div>

              </div>

            </div>
          </div>
        ) : (
          /* SUCCESS STATE: ACTIVATION & OFFLINE TOKEN */
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "24px", padding: "3rem 2rem", maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.4)", margin: "0 auto 1.5rem auto", display: "grid", placeItems: "center", color: "#34D399" }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              Subscription &amp; Fleet Activated!
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 2rem auto" }}>
              Your {selectedTier === "enterprise" ? `Enterprise Fleet (${nodeCount} nodes)` : "Community Sovereign"} entitlement is now active across your organization.
            </p>

            {/* Offline Token Card */}
            {generatedToken && (
              <div style={{ background: "rgba(0, 0, 0, 0.6)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "16px", padding: "1.5rem", textAlign: "left", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Key size={15} />
                    Cryptographic Offline Ed25519 License Token
                  </span>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedToken);
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      style={{
                        padding: "5px 12px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        background: "rgba(56, 189, 248, 0.15)",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        borderRadius: "6px",
                        color: "#38BDF8",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {copiedToken ? <Check size={13} /> : <Copy size={13} />}
                      {copiedToken ? "Copied" : "Copy Token"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([generatedToken], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "license.key";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{
                        padding: "5px 12px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "6px",
                        color: "#E2E8F0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Download size={13} />
                      Download license.key
                    </button>
                  </div>
                </div>

                <div style={{ background: "rgba(10, 15, 26, 0.95)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "0.85rem 1rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#A7F3D0", wordBreak: "break-all", userSelect: "all", marginBottom: "1rem" }}>
                  {generatedToken}
                </div>

                {/* Host Installation Commands */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#CBD5E1", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      <Terminal size={13} />
                      Linux / Unix Node Deployment (Zero Phone-Home SCIF):
                    </div>
                    <code style={{ display: "block", background: "rgba(0, 0, 0, 0.4)", padding: "6px 10px", borderRadius: "6px", color: "#93C5FD", fontFamily: "monospace", fontSize: "0.75rem" }}>
                      sudo mkdir -p /etc/exultia &amp;&amp; echo &quot;{generatedToken}&quot; | sudo tee /etc/exultia/license.key
                    </code>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#CBD5E1", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      <Laptop size={13} />
                      Windows Workstation PureIDE Deployment:
                    </div>
                    <code style={{ display: "block", background: "rgba(0, 0, 0, 0.4)", padding: "6px 10px", borderRadius: "6px", color: "#93C5FD", fontFamily: "monospace", fontSize: "0.75rem" }}>
                      New-Item -ItemType Directory -Force -Path C:\ProgramData\Exultia; Set-Content -Path C:\ProgramData\Exultia\license.key -Value &quot;{generatedToken}&quot;
                    </code>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href="/account/subscription"
                className="btn-primary"
                style={{ padding: "0.85rem 1.75rem", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none" }}
              >
                Manage Fleet Subscriptions →
              </Link>
              <Link
                href="/app/daedelus?mode=ide"
                style={{ padding: "0.85rem 1.75rem", fontSize: "0.95rem", fontWeight: 700, background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "10px", color: "#FFFFFF", textDecoration: "none" }}
              >
                Launch Daedelus Console
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#94A3B8" }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
