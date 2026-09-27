"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Unlock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  KeyRound, 
  FileText, 
  Activity, 
  ChevronRight, 
  RefreshCw,
  Layers,
  Zap
} from "lucide-react";
import { PureIdeIcon, UviIcon, InquestIcon } from "@/components/BrandIcons";

interface CustomerOverviewProps {
  onSelectTab: (tab: "overview" | "pureide" | "uvi" | "inquest" | "tokens" | "security") => void;
  onOpenUpgradeModal: () => void;
}

export default function CustomerOverview({ onSelectTab, onOpenUpgradeModal }: CustomerOverviewProps) {
  const { user, getUserTier, refreshUser } = useAuth();
  const [isSwitchingTier, setIsSwitchingTier] = useState(false);

  const pureIdeTier = getUserTier("pureide");
  const uviTier = getUserTier("uvi");
  const inquestTier = getUserTier("inquest");

  // Calculate unlocked capabilities percentage
  let unlockedScore = 0;
  if (pureIdeTier === "enterprise") unlockedScore += 35;
  else if (pureIdeTier === "pro") unlockedScore += 25;
  else unlockedScore += 10;

  if (uviTier === "enterprise") unlockedScore += 35;
  else if (uviTier === "pro") unlockedScore += 25;
  else unlockedScore += 10;

  if (inquestTier === "enterprise") unlockedScore += 30;
  else if (inquestTier === "legal") unlockedScore += 20;
  else unlockedScore += 10;

  const handleSimulateTier = async (targetTier: "free" | "pro" | "enterprise") => {
    setIsSwitchingTier(true);
    try {
      const inquestTarget = targetTier === "pro" ? "legal" : targetTier;
      await Promise.all([
        fetch("/api/user/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: "pureide", tier: targetTier, billingCycle: "annual" }),
        }),
        fetch("/api/user/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: "uvi", tier: targetTier, billingCycle: "annual" }),
        }),
        fetch("/api/user/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: "inquest", tier: inquestTarget, billingCycle: "annual" }),
        })
      ]);
      await refreshUser();
    } catch (e) {
      console.error("Failed to switch simulation tier:", e);
    } finally {
      setIsSwitchingTier(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* 1. TIER SIMULATOR & PREVIEW CONTROL BAR */}
      <div style={{
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
        border: "1px dashed rgba(59, 130, 246, 0.4)",
        borderRadius: "16px",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "rgba(59, 130, 246, 0.2)", padding: "6px", borderRadius: "8px", color: "#60A5FA" }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>
              Customer Tier Preview & Simulator
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
              Simulate how the portal adapts to different purchased subscription levels in real time.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => handleSimulateTier("free")}
            disabled={isSwitchingTier}
            style={{
              background: (pureIdeTier === "free" && uviTier === "free") ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
              border: (pureIdeTier === "free" && uviTier === "free") ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "6px 14px",
              color: "#CBD5E1",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Community (Free)
          </button>

          <button
            onClick={() => handleSimulateTier("pro")}
            disabled={isSwitchingTier}
            style={{
              background: (pureIdeTier === "pro" || inquestTier === "legal") ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.04)",
              border: (pureIdeTier === "pro" || inquestTier === "legal") ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "6px 14px",
              color: "#93C5FD",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Pro / Legal Tier
          </button>

          <button
            onClick={() => handleSimulateTier("enterprise")}
            disabled={isSwitchingTier}
            style={{
              background: (pureIdeTier === "enterprise" && uviTier === "enterprise") ? "rgba(139, 92, 246, 0.3)" : "rgba(255, 255, 255, 0.04)",
              border: (pureIdeTier === "enterprise" && uviTier === "enterprise") ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "6px 14px",
              color: "#C084FC",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Enterprise Suite
          </button>
        </div>
      </div>

      {/* 2. UNLOCKED CAPABILITY SCORECARD & PROGRESS METER */}
      <div style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.25)",
        borderRadius: "20px",
        padding: "1.75rem",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>
              Customer Entitlement Level
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              {unlockedScore === 100 ? "Full Enterprise Ecosystem Unlocked" : (unlockedScore >= 60 ? "Pro & Legal Developer Workstation Active" : "Community Tier Active")}
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "1.75rem", fontWeight: 900, color: unlockedScore === 100 ? "#C084FC" : (unlockedScore >= 60 ? "#60A5FA" : "#94A3B8") }}>
              {unlockedScore}%
            </span>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8", display: "block" }}>Platform Access</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: "100%", height: "10px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "999px", overflow: "hidden", marginBottom: "1.25rem" }}>
          <div style={{
            width: `${unlockedScore}%`,
            height: "100%",
            background: unlockedScore === 100 
              ? "linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4)" 
              : (unlockedScore >= 60 ? "linear-gradient(90deg, #3B82F6, #8B5CF6)" : "linear-gradient(90deg, #64748B, #3B82F6)"),
            borderRadius: "999px",
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          }} />
        </div>

        {/* Quick Highlights of Unlocked Customer Tools */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <PureIdeIcon size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>PureIDE Workstation</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4 }}>
              {pureIdeTier === "enterprise" 
                ? "Hermetic Airgap Cosigning, Enclave Keys & Org Extension Blocklists" 
                : (pureIdeTier === "pro" ? "Priority Cloud Builds, Egress Socket Firewall & SBOM Scanners" : "Community Build Triggers & Public VSIX Verification")}
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <UviIcon size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>UVI Threat Intel</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4 }}>
              {uviTier === "enterprise" 
                ? "Live Webhook Ingestion Dispatcher & Daily Parquet/JSON Bulk Dumps" 
                : (uviTier === "pro" ? "Real-time Advisory Stream, Workstation Threat Radar & 10K API/min" : "Web Catalog Search & Standard CVSS Metrics")}
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <InquestIcon size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Inquest FOIA Legal</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4 }}>
              {inquestTier === "enterprise" 
                ? "Multi-Attorney Docket Sharing, APA Court Filing Generator & Vault Hasher" 
                : (inquestTier === "legal" ? "Statutory 9-Exemption Brief Builder & 20-Day Response Tracker" : "Community Standard FOIA Drafts & Agency Directory")}
            </div>
          </div>

        </div>
      </div>

      {/* 3. PRODUCT-SPECIFIC CUSTOMER TOOL TILES */}
      <div>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "1rem" }}>
          Customer Applications & Live Tools
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
          
          {/* TILE 1: PUREIDE */}
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "18px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <PureIdeIcon size={32} />
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>PureIDE Tools</h4>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Developer Compiler Suite</div>
                </div>
              </div>
              <span style={{
                fontSize: "0.68rem",
                background: pureIdeTier !== "free" ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
                color: pureIdeTier !== "free" ? "#93C5FD" : "#94A3B8",
                border: pureIdeTier !== "free" ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 800,
                textTransform: "uppercase"
              }}>
                {pureIdeTier}
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.82rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0" }}>
                <CheckCircle2 size={14} color="#60A5FA" />
                <span>Zero-telemetry Workstation Builder</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: pureIdeTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {pureIdeTier !== "free" ? <CheckCircle2 size={14} color="#60A5FA" /> : <Lock size={14} color="#64748B" />}
                <span>Live Egress Firewall Configurator</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: pureIdeTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {pureIdeTier !== "free" ? <CheckCircle2 size={14} color="#60A5FA" /> : <Lock size={14} color="#64748B" />}
                <span>SBOM & Token Redaction Engine</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: pureIdeTier === "enterprise" ? "#E2E8F0" : "#64748B" }}>
                {pureIdeTier === "enterprise" ? <CheckCircle2 size={14} color="#C084FC" /> : <Lock size={14} color="#64748B" />}
                <span>Airgap Enclave Cosign Manager</span>
              </li>
            </ul>

            <button
              onClick={() => onSelectTab("pureide")}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              Open PureIDE Workspace <ArrowRight size={14} />
            </button>
          </div>

          {/* TILE 2: UVI */}
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "18px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <UviIcon size={32} />
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>UVI Threat Intel</h4>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Intelligence & Feeds</div>
                </div>
              </div>
              <span style={{
                fontSize: "0.68rem",
                background: uviTier !== "free" ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
                color: uviTier !== "free" ? "#C084FC" : "#94A3B8",
                border: uviTier !== "free" ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 800,
                textTransform: "uppercase"
              }}>
                {uviTier}
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.82rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0" }}>
                <CheckCircle2 size={14} color="#C084FC" />
                <span>110+ Source Vulnerability Registry</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: uviTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {uviTier !== "free" ? <CheckCircle2 size={14} color="#C084FC" /> : <Lock size={14} color="#64748B" />}
                <span>Workstation CVE Threat Radar</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: uviTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {uviTier !== "free" ? <CheckCircle2 size={14} color="#C084FC" /> : <Lock size={14} color="#64748B" />}
                <span>Live Webhook Streaming Receiver</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: uviTier === "enterprise" ? "#E2E8F0" : "#64748B" }}>
                {uviTier === "enterprise" ? <CheckCircle2 size={14} color="#34D399" /> : <Lock size={14} color="#64748B" />}
                <span>Bulk Parquet/JSON Dataset Vault</span>
              </li>
            </ul>

            <button
              onClick={() => onSelectTab("uvi")}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginTop: "auto",
                background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              Open UVI Hub <ArrowRight size={14} />
            </button>
          </div>

          {/* TILE 3: INQUEST */}
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "18px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <InquestIcon size={32} />
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Inquest Legal</h4>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>FOIA Discovery & Appeals</div>
                </div>
              </div>
              <span style={{
                fontSize: "0.68rem",
                background: inquestTier !== "free" ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.08)",
                color: inquestTier !== "free" ? "#67E8F9" : "#94A3B8",
                border: inquestTier !== "free" ? "1px solid rgba(6, 182, 212, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 800,
                textTransform: "uppercase"
              }}>
                {inquestTier}
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.82rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0" }}>
                <CheckCircle2 size={14} color="#67E8F9" />
                <span>50-State Agency Statutory Directory</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: inquestTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {inquestTier !== "free" ? <CheckCircle2 size={14} color="#67E8F9" /> : <Lock size={14} color="#64748B" />}
                <span>9-Exemption Appeal Brief Builder</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: inquestTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {inquestTier !== "free" ? <CheckCircle2 size={14} color="#67E8F9" /> : <Lock size={14} color="#64748B" />}
                <span>Statutory 20-Day Response Tracker</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: inquestTier === "enterprise" ? "#E2E8F0" : "#64748B" }}>
                {inquestTier === "enterprise" ? <CheckCircle2 size={14} color="#34D399" /> : <Lock size={14} color="#64748B" />}
                <span>Multi-Firm Docket & Vault Hasher</span>
              </li>
            </ul>

            <button
              onClick={() => onSelectTab("inquest")}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginTop: "auto",
                background: "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)",
                color: "#041019",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              Open Inquest Vault <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
