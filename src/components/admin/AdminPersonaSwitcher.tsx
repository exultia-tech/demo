"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  Cpu, 
  Radio, 
  Scale, 
  UserCheck, 
  ShieldAlert,
  Zap,
  Lock
} from "lucide-react";
import { PureIdeIcon, VantageIcon, InquestIcon } from "@/components/BrandIcons";

interface PersonaCardProps {
  email: string;
  name: string;
  role: string;
  badge: string;
  themeColor: string;
  headline: string;
  description: string;
  entitlements: {
    pureide: string;
    uvi: string;
    inquest: string;
  };
  keyFeatures: string[];
}

const PERSONAS: PersonaCardProps[] = [
  {
    email: "admin@exultia.tech",
    name: "Exultia Administrator",
    role: "admin",
    badge: "Root Administrator",
    themeColor: "#F59E0B",
    headline: "Root Operator Privileges & Impersonation Hub",
    description: "Full system administration authority with real-time persona substitution, database management, and universal enterprise privileges.",
    entitlements: {
      pureide: "enterprise",
      uvi: "enterprise",
      inquest: "legal",
    },
    keyFeatures: [
      "1-Click Test Persona Substitution",
      "Database Seed & Migration Controls",
      "Hermetic Enclave Hardware Attestation",
      "Direct CISO Priority Advisory Hotline"
    ]
  },
  {
    email: "free@exultia.tech",
    name: "Alex Rivera",
    role: "user",
    badge: "Community Free Tier",
    themeColor: "#94A3B8",
    headline: "Baseline Developer Community Tier",
    description: "Tests platform behavior for unpaid accounts: standard sandbox compiler triggers, web feed browsing, rate limits (60/min), and 3-case FOIA limit.",
    entitlements: {
      pureide: "free",
      uvi: "free",
      inquest: "free",
    },
    keyFeatures: [
      "Telemetry Stripping Simulator",
      "Public Advisory Catalog Browsing",
      "3-Draft Case Filing Cap",
      "Standard Bates Numbering Generator"
    ]
  },
  {
    email: "pro@exultia.tech",
    name: "Jordan Vance",
    role: "user",
    badge: "Pro Developer Workstation",
    themeColor: "#3B82F6",
    headline: "PureIDE Pro & Vantage Threat Intel Pro",
    description: "Tests dedicated developer capabilities: live egress socket firewall policies, automated token redaction, priority build runners, and 10,000 req/min CVSS feeds.",
    entitlements: {
      pureide: "pro",
      uvi: "pro",
      inquest: "free",
    },
    keyFeatures: [
      "Real-time Egress Socket Firewall",
      "Live Secrets Redactor & Token Filter",
      "Priority Cloud Compiler Runner",
      "10,000 req/min CVSS v4.0 Threat Stream"
    ]
  },
  {
    email: "legal@exultia.tech",
    name: "Elena Rostova, Esq.",
    role: "user",
    badge: "Legal Discovery Pro",
    themeColor: "#06B6D4",
    headline: "Inquest FOIA Legal Discovery Pro",
    description: "Tests autonomous FOIA litigation tools: 9-exemption administrative appeal brief builder, Exemption 4/7(A) burden-of-proof scanner, and unlimited cases.",
    entitlements: {
      pureide: "free",
      uvi: "free",
      inquest: "legal",
    },
    keyFeatures: [
      "Statutory Administrative Appeal Builder",
      "Glomar Challenge Defense Assistant",
      "Exemption 4 / 7(A) Burden-of-Proof Scanner",
      "Unlimited Discovery Dockets & Bates Index"
    ]
  },
  {
    email: "enterprise@exultia.tech",
    name: "Marcus Sterling",
    role: "user",
    badge: "Hermetic Enterprise",
    themeColor: "#8B5CF6",
    headline: "Maximum Suite Entitlements (All Enterprise)",
    description: "Tests full hermetic architecture: airgap offline binary cosign, zero-egress hardware attestation, high-throughput webhook dispatchers, and APA court complaints.",
    entitlements: {
      pureide: "enterprise",
      uvi: "enterprise",
      inquest: "enterprise",
    },
    keyFeatures: [
      "Hermetic Offline Binary Cosigning",
      "Streaming Webhook Advisory Dispatcher",
      "Daily Bulk Parquet Dataset Downloads",
      "Federal APA Court Complaint Generator"
    ]
  }
];

export default function AdminPersonaSwitcher() {
  const { user, isImpersonating, impersonate, revertImpersonation } = useAuth();
  const [switchingEmail, setSwitchingEmail] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!user || (user.role !== "admin" && !isImpersonating)) {
    return null;
  }

  const handleSwitch = async (email: string) => {
    setSwitchingEmail(email);
    setSuccessMsg(null);
    setErrorMsg(null);

    let res;
    if (email === "admin@exultia.tech") {
      res = await revertImpersonation();
    } else {
      res = await impersonate(email);
    }

    if (res.success) {
      setSuccessMsg(`Switched active session to ${email}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg(res.error || "Failed to switch persona");
    }
    setSwitchingEmail(null);
  };

  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 26, 0.98) 100%)",
      border: "1px solid rgba(245, 158, 11, 0.35)",
      borderRadius: "20px",
      padding: "2rem",
      marginBottom: "2.5rem",
      boxShadow: "0 20px 40px -15px rgba(245, 158, 11, 0.15)"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "4px 12px", borderRadius: "999px", marginBottom: "0.75rem" }}>
            <Sparkles size={14} color="#F59E0B" />
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#FDE68A", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Administrator Testing Controls
            </span>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0", letterSpacing: "-0.02em" }}>
            Entitlement Substitution & Test Persona Switcher
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0, maxWidth: "750px" }}>
            Substitute your session into pre-configured personas representing each entitlement tier. Experience the platform exactly as individual developers, law firms, and enterprise security architects see it.
          </p>
        </div>

        {isImpersonating && (
          <button
            onClick={() => handleSwitch("admin@exultia.tech")}
            disabled={!!switchingEmail}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              border: "none",
              color: "#0F172A",
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)"
            }}
          >
            <RotateCcw size={15} />
            Revert to Root Administrator
          </button>
        )}
      </div>

      {successMsg && (
        <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#86EFAC", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          ✓ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#FCA5A5", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          ⚠ {errorMsg}
        </div>
      )}

      {/* Personas Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {PERSONAS.map((p) => {
          const isCurrent = user.email.toLowerCase() === p.email.toLowerCase();
          const isSelected = switchingEmail === p.email;

          return (
            <div
              key={p.email}
              style={{
                background: isCurrent 
                  ? "linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)" 
                  : "rgba(15, 23, 42, 0.6)",
                border: isCurrent 
                  ? `2px solid ${p.themeColor}` 
                  : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all 0.2s ease"
              }}
            >
              {isCurrent && (
                <div style={{
                  position: "absolute",
                  top: "-10px",
                  right: "1.25rem",
                  background: p.themeColor,
                  color: "#0F172A",
                  fontSize: "0.68rem",
                  fontWeight: 900,
                  padding: "2px 10px",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  boxShadow: `0 0 15px ${p.themeColor}66`
                }}>
                  Active Persona
                </div>
              )}

              {/* Persona Top Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${p.themeColor}44, ${p.themeColor}11)`,
                  border: `1px solid ${p.themeColor}88`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.2rem",
                  color: p.themeColor,
                  fontWeight: 800
                }}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>{p.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{p.email}</div>
                </div>
              </div>

              {/* Badge & Headline */}
              <div style={{ marginBottom: "0.85rem" }}>
                <span style={{
                  fontSize: "0.68rem",
                  background: `${p.themeColor}22`,
                  color: p.themeColor,
                  border: `1px solid ${p.themeColor}44`,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em"
                }}>
                  {p.badge}
                </span>
                <p style={{ color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.4, margin: "8px 0 0 0" }}>
                  {p.description}
                </p>
              </div>

              {/* Entitlement Badges */}
              <div style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
                padding: "8px 10px",
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Entitlement Tiers
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.72rem",
                    background: "rgba(59, 130, 246, 0.15)",
                    color: "#93C5FD",
                    padding: "2px 7px",
                    borderRadius: "4px",
                    fontWeight: 700
                  }}>
                    <PureIdeIcon size={12} glow={false} />
                    PureIDE: {p.entitlements.pureide.toUpperCase()}
                  </span>

                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.72rem",
                    background: "rgba(139, 92, 246, 0.15)",
                    color: "#C084FC",
                    padding: "2px 7px",
                    borderRadius: "4px",
                    fontWeight: 700
                  }}>
                    <VantageIcon size={12} glow={false} />
                    Vantage: {p.entitlements.uvi.toUpperCase()}
                  </span>

                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.72rem",
                    background: "rgba(6, 182, 212, 0.15)",
                    color: "#67E8F9",
                    padding: "2px 7px",
                    borderRadius: "4px",
                    fontWeight: 700
                  }}>
                    <InquestIcon size={12} glow={false} />
                    Inquest: {p.entitlements.inquest.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Key Features List */}
              <div style={{ marginBottom: "1.25rem", flex: 1 }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Features Tested
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                  {p.keyFeatures.map((feat) => (
                    <li key={feat} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#E2E8F0" }}>
                      <Check size={13} color={p.themeColor} style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSwitch(p.email)}
                disabled={isCurrent || isSelected}
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem",
                  background: isCurrent 
                    ? "rgba(255, 255, 255, 0.05)" 
                    : `linear-gradient(135deg, ${p.themeColor}, ${p.themeColor}CC)`,
                  border: isCurrent ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                  borderRadius: "8px",
                  color: isCurrent ? "#64748B" : (p.themeColor === "#F59E0B" ? "#0F172A" : "#FFFFFF"),
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: isCurrent ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "transform 0.15s ease",
                  boxShadow: isCurrent ? "none" : `0 4px 15px ${p.themeColor}44`
                }}
              >
                {isSelected ? (
                  <span>Switching...</span>
                ) : isCurrent ? (
                  <>
                    <Check size={14} color="#34D399" />
                    <span>Currently Active</span>
                  </>
                ) : (
                  <>
                    <span>Substitute as {p.badge}</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
