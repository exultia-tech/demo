"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Sparkles, ShieldCheck, ArrowRight, Zap, KeyRound, Cpu, Terminal } from "lucide-react";
import { PureIdeIcon, UviIcon, InquestIcon } from "@/components/BrandIcons";

interface PlanGateProps {
  product: "pureide" | "uvi" | "inquest";
  requiredTier: "free" | "pro" | "legal" | "enterprise";
  featureTitle?: string;
  featureDescription?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const TIER_WEIGHTS: Record<string, number> = {
  free: 0,
  pro: 10,
  legal: 10,
  enterprise: 20,
};

export function PlanGate({
  product,
  requiredTier,
  featureTitle = "Pro Feature",
  featureDescription = "This feature requires an active subscription tier to unlock.",
  children,
  fallback,
}: PlanGateProps) {
  const { user, getUserTier, openAuthModal, openPaymentModal } = useAuth();
  
  const currentTier = getUserTier(product);
  const currentWeight = TIER_WEIGHTS[currentTier] || 0;
  const requiredWeight = TIER_WEIGHTS[requiredTier] || 0;
  const hasAccess = currentWeight >= requiredWeight;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const productNames = {
    pureide: "PureIDE Workstations",
    uvi: "Universal Vulnerability Intelligence",
    inquest: "Inquest FOIA Discovery",
  };

  const productBrandGlow = {
    pureide: "rgba(59, 130, 246, 0.2)",
    uvi: "rgba(139, 92, 246, 0.2)",
    inquest: "rgba(6, 182, 212, 0.2)",
  };

  const productBadgeColor = {
    pureide: "#60A5FA",
    uvi: "#C084FC",
    inquest: "#67E8F9",
  };

  return (
    <div style={{
      position: "relative",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px dashed rgba(255, 255, 255, 0.15)",
      background: "linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(10, 15, 26, 0.9) 100%)",
      padding: "2rem 1.5rem",
      textAlign: "center"
    }}>
      {/* Background preview blurred */}
      <div style={{
        filter: "blur(5px)",
        opacity: 0.15,
        pointerEvents: "none",
        userSelect: "none",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}>
        {children}
      </div>

      {/* Overlay Content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "480px", margin: "0 auto" }}>
        <div style={{
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          background: productBrandGlow[product],
          border: `1px solid ${productBadgeColor[product]}55`,
          display: "grid",
          placeItems: "center",
          margin: "0 auto 1.25rem auto",
          color: productBadgeColor[product],
          boxShadow: `0 0 20px ${productBrandGlow[product]}`
        }}>
          <Lock size={24} />
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "3px 10px", borderRadius: "999px", marginBottom: "0.75rem" }}>
          <Sparkles size={12} color={productBadgeColor[product]} />
          <span style={{ fontSize: "0.72rem", color: "#CBD5E1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {productNames[product]} • {requiredTier.toUpperCase()} TIER
          </span>
        </div>

        <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
          {featureTitle}
        </h4>

        <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
          {featureDescription}
        </p>

        {!user ? (
          <button
            onClick={() => openAuthModal("login")}
            className="btn-primary"
            style={{
              padding: "9px 20px",
              fontSize: "0.88rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            Sign In to Access →
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => openPaymentModal({
                product,
                tier: requiredTier as any,
                price: requiredTier === "enterprise" ? 299 : 99,
                billingCycle: "annual",
                planName: `${productNames[product]} (${requiredTier.toUpperCase()})`
              })}
              className="btn-primary"
              style={{
                padding: "9px 20px",
                fontSize: "0.88rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              Upgrade to {requiredTier.toUpperCase()} →
            </button>

            <Link
              href="/account/subscription"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                padding: "9px 16px",
                color: "#CBD5E1",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              View All Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Sample Gated Feature Demonstration Components
// ============================================================================

/**
 * Enterprise PureIDE Feature: Hermetic Airgap Cosign & Attestation
 */
export function PureIdeAirgapSigningGate() {
  return (
    <PlanGate
      product="pureide"
      requiredTier="enterprise"
      featureTitle="Hermetic Airgap Binary Cosign"
      featureDescription="Cryptographically sign your workstation binaries with hardware enclave keys and generate zero-telemetry SBOM attestations."
    >
      <div style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "14px",
        padding: "1.5rem",
        textAlign: "left"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
          <PureIdeIcon size={22} />
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
            Hardware Enclave Cosign Manager
          </h4>
          <span style={{ fontSize: "0.68rem", background: "rgba(34, 197, 94, 0.2)", color: "#86EFAC", border: "1px solid rgba(34, 197, 94, 0.4)", padding: "1px 6px", borderRadius: "4px", fontWeight: 800 }}>
            ACTIVE (ENTERPRISE)
          </span>
        </div>
        <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1rem 0" }}>
          Target Binary: <code style={{ color: "#60A5FA" }}>pureide-win-x64-v2.8.4.exe</code> • SHA-256: <code style={{ color: "#CBD5E1" }}>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code>
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button style={{ background: "#2563EB", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
            Generate Airgap Attestation
          </button>
          <button style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#CBD5E1", padding: "6px 12px", borderRadius: "6px", fontSize: "0.8rem" }}>
            Export Cosign Certificate
          </button>
        </div>
      </div>
    </PlanGate>
  );
}

/**
 * Pro UVI Feature: Real-time Kafka / Webhook Ingestion Feed
 */
export function UviWebhookStreamingGate() {
  return (
    <PlanGate
      product="uvi"
      requiredTier="pro"
      featureTitle="Real-time Advisory Webhook Streaming"
      featureDescription="Stream live vulnerability disclosures and CISA KEV updates directly to your SIEM, Discord, or automated orchestration pipelines."
    >
      <div style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        borderRadius: "14px",
        padding: "1.5rem",
        textAlign: "left"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
          <UviIcon size={22} />
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
            UVI Real-time Webhook Receiver
          </h4>
          <span style={{ fontSize: "0.68rem", background: "rgba(139, 92, 246, 0.2)", color: "#C084FC", border: "1px solid rgba(139, 92, 246, 0.4)", padding: "1px 6px", borderRadius: "4px", fontWeight: 800 }}>
            ACTIVE (PRO FEED)
          </span>
        </div>
        <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1rem 0" }}>
          Registered Webhook: <code style={{ color: "#C084FC" }}>https://api.yourorg.com/webhooks/uvi-stream</code> • HMAC SHA-256 Verified
        </p>
        <button style={{ background: "#7C3AED", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
          Send Test Advisory Event
        </button>
      </div>
    </PlanGate>
  );
}

/**
 * Legal Pro Inquest Feature: Autonomous 9-Exemption Scanner
 */
export function InquestExemptionScannerGate() {
  return (
    <PlanGate
      product="inquest"
      requiredTier="legal"
      featureTitle="Statutory 9-Exemption Redaction Scanner"
      featureDescription="De-construct agency denial justifications, identify Glomar boilerplate claims, and automatically draft administrative appeals citing statutory circuit precedents."
    >
      <div style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(6, 182, 212, 0.3)",
        borderRadius: "14px",
        padding: "1.5rem",
        textAlign: "left"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
          <InquestIcon size={22} />
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
            Statutory Brief & Exemption Analyzer
          </h4>
          <span style={{ fontSize: "0.68rem", background: "rgba(6, 182, 212, 0.2)", color: "#67E8F9", border: "1px solid rgba(6, 182, 212, 0.4)", padding: "1px 6px", borderRadius: "4px", fontWeight: 800 }}>
            ACTIVE (LEGAL PRO)
          </span>
        </div>
        <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1rem 0" }}>
          Agency Target: <code style={{ color: "#67E8F9" }}>Department of Energy (DOE)</code> • Exemption Challenged: <code style={{ color: "#CBD5E1" }}>5 U.S.C. § 552(b)(4) & (b)(7)(A)</code>
        </p>
        <button style={{ background: "#0891B2", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
          Generate Circuit Brief (PDF)
        </button>
      </div>
    </PlanGate>
  );
}
