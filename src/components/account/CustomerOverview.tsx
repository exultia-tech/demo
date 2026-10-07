"use client";

import React from "react";
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
  Layers
} from "lucide-react";
import { 
  PureIdeIcon, 
  VantageIcon, 
  InquestIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon 
} from "@/components/BrandIcons";

interface CustomerOverviewProps {
  onSelectTab: (tab: any) => void;
  onOpenUpgradeModal: () => void;
}

export default function CustomerOverview({ onSelectTab, onOpenUpgradeModal }: CustomerOverviewProps) {
  const { user, getUserTier } = useAuth();

  const pureIdeTier = getUserTier("pureide");
  const uviTier = getUserTier("uvi");
  const inquestTier = getUserTier("inquest");
  const fixlistTier = getUserTier("fixlist");
  const pureosTier = getUserTier("pureos");
  const axiomTier = getUserTier("axiom");

  // Calculate unlocked capabilities percentage across the full 6-product suite
  const productTiers = [pureIdeTier, uviTier, inquestTier, fixlistTier, pureosTier, axiomTier];
  let unlockedScore = 0;
  productTiers.forEach(tier => {
    if (tier === "enterprise") unlockedScore += 16.66;
    else if (tier === "pro" || tier === "legal") unlockedScore += 12;
    else unlockedScore += 4.5;
  });
  unlockedScore = Math.min(100, Math.round(unlockedScore));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* 1. UNLOCKED CAPABILITY SCORECARD & PROGRESS METER */}
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
              Full Suite Entitlement Status
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              {unlockedScore >= 95 
                ? "Full Enterprise Ecosystem Unlocked (All 6 Products Active)" 
                : (unlockedScore >= 60 ? "Pro & Legal Developer Workstations Active" : "Community Free Tier Active")}
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "1.75rem", fontWeight: 900, color: unlockedScore >= 90 ? "#C084FC" : (unlockedScore >= 60 ? "#60A5FA" : "#94A3B8") }}>
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
            background: unlockedScore >= 90 
              ? "linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4, #10B981)" 
              : (unlockedScore >= 60 ? "linear-gradient(90deg, #3B82F6, #8B5CF6)" : "linear-gradient(90deg, #64748B, #3B82F6)"),
            borderRadius: "999px",
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          }} />
        </div>

        {/* Quick Highlights of Unlocked Customer Tools across 6 products */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          
          {/* 1. PureIDE */}
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

          {/* 2. Vantage */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <VantageIcon size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Vantage Threat Intel</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4 }}>
              {uviTier === "enterprise" 
                ? "Live Webhook Ingestion Dispatcher & Daily Parquet/JSON Bulk Dumps" 
                : (uviTier === "pro" ? "Real-time Advisory Stream, Workstation Threat Radar & 10K API/min" : "Web Catalog Search & Standard CVSS Metrics")}
            </div>
          </div>

          {/* 3. Inquest */}
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

          {/* 4. Praxis */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <PraxisIcon size={20} glow={false} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Praxis Remediation</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4 }}>
              {fixlistTier === "enterprise" 
                ? "Global Fleet Patch Automation, SIEM Webhooks & Air-gapped Script Signing" 
                : (fixlistTier === "pro" ? "Automated Bash/Ansible Payloads & SIEM Export Formats" : "Standard Manual Fix Generations & CVE Tracking")}
            </div>
          </div>

          {/* 5. PureOS */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <PureOsIcon size={20} glow={false} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>PureOS Containers</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4 }}>
              {pureosTier === "enterprise" 
                ? "Private Registry Proxy, Custom Golden Images & Hardware Attestation" 
                : (pureosTier === "pro" ? "All OS & Language Stacks, Distroless Builds & Daily Threat Rebuilds" : "Alpine & Debian CIS Level 1 Base Hardened Images")}
            </div>
          </div>

          {/* 6. Axiom */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <AxiomIcon size={20} glow={false} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Axiom Simulator</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4 }}>
              {axiomTier === "enterprise" 
                ? "Dedicated Enterprise LMS REST API, SCORM Exports & Corporate Scorecards" 
                : (axiomTier === "pro" ? "Hands-on Attack/Defense Terminal Labs & Domain Weakness Analytics" : "15,000+ Question Exam Simulator with Explanations")}
            </div>
          </div>

        </div>
      </div>

      {/* 2. PRODUCT-SPECIFIC CUSTOMER TOOL TILES (ALL 6 PRODUCTS) */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
            Customer Applications & Live Tools
          </h3>
          <Link
            href="/account/subscription"
            style={{
              fontSize: "0.85rem",
              color: "#60A5FA",
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            Manage All Product Plans <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          
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

          {/* TILE 2: Vantage */}
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
                <VantageIcon size={32} />
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Vantage Threat Intel</h4>
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
              Open Vantage Hub <ArrowRight size={14} />
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

          {/* TILE 4: PRAXIS FIX LIST */}
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "18px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <PraxisIcon size={32} glow={false} />
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Praxis</h4>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Automated Remediation</div>
                </div>
              </div>
              <span style={{
                fontSize: "0.68rem",
                background: fixlistTier !== "free" ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 255, 255, 0.08)",
                color: fixlistTier !== "free" ? "#FDE68A" : "#94A3B8",
                border: fixlistTier !== "free" ? "1px solid rgba(245, 158, 11, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 800,
                textTransform: "uppercase"
              }}>
                {fixlistTier}
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.82rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0" }}>
                <CheckCircle2 size={14} color="#F59E0B" />
                <span>CVE Fix Payload Generation (Bash / PS)</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: fixlistTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {fixlistTier !== "free" ? <CheckCircle2 size={14} color="#F59E0B" /> : <Lock size={14} color="#64748B" />}
                <span>SIEM & Firewall Custom Format Exporters</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: fixlistTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {fixlistTier !== "free" ? <CheckCircle2 size={14} color="#F59E0B" /> : <Lock size={14} color="#64748B" />}
                <span>Automated Vantage Correlation Engine</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: fixlistTier === "enterprise" ? "#E2E8F0" : "#64748B" }}>
                {fixlistTier === "enterprise" ? <CheckCircle2 size={14} color="#34D399" /> : <Lock size={14} color="#64748B" />}
                <span>Global Fleet Patch Orchestration & SLA</span>
              </li>
            </ul>

            <button
              onClick={() => onSelectTab("fixlist")}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginTop: "auto",
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              Open Praxis Console <ArrowRight size={14} />
            </button>
          </div>

          {/* TILE 5: PUREOS */}
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "18px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <PureOsIcon size={32} glow={false} />
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>PureOS Containers</h4>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Hardened Image Catalog</div>
                </div>
              </div>
              <span style={{
                fontSize: "0.68rem",
                background: pureosTier !== "free" ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.08)",
                color: pureosTier !== "free" ? "#A7F3D0" : "#94A3B8",
                border: pureosTier !== "free" ? "1px solid rgba(16, 185, 129, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 800,
                textTransform: "uppercase"
              }}>
                {pureosTier}
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.82rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0" }}>
                <CheckCircle2 size={14} color="#10B981" />
                <span>CIS Level 1 & 2 Hardened Base Images</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: pureosTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {pureosTier !== "free" ? <CheckCircle2 size={14} color="#10B981" /> : <Lock size={14} color="#64748B" />}
                <span>Daily Zero-Day Vulnerability Sync</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: pureosTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {pureosTier !== "free" ? <CheckCircle2 size={14} color="#10B981" /> : <Lock size={14} color="#64748B" />}
                <span>Distroless Builds (No Package Managers)</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: pureosTier === "enterprise" ? "#E2E8F0" : "#64748B" }}>
                {pureosTier === "enterprise" ? <CheckCircle2 size={14} color="#34D399" /> : <Lock size={14} color="#64748B" />}
                <span>Private Registry Proxy & Enclave Attestation</span>
              </li>
            </ul>

            <button
              onClick={() => onSelectTab("pureos")}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginTop: "auto",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              Open PureOS Catalog <ArrowRight size={14} />
            </button>
          </div>

          {/* TILE 6: AXIOM */}
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            borderRadius: "18px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <AxiomIcon size={32} glow={false} />
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Axiom Simulator</h4>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Exam Prep & Enterprise LMS</div>
                </div>
              </div>
              <span style={{
                fontSize: "0.68rem",
                background: axiomTier !== "free" ? "rgba(244, 63, 94, 0.25)" : "rgba(255, 255, 255, 0.08)",
                color: axiomTier !== "free" ? "#FDA4AF" : "#94A3B8",
                border: axiomTier !== "free" ? "1px solid rgba(244, 63, 94, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 800,
                textTransform: "uppercase"
              }}>
                {axiomTier}
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.82rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0" }}>
                <CheckCircle2 size={14} color="#F43F5E" />
                <span>15,000+ Question Exam Bank & Explanations</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: axiomTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {axiomTier !== "free" ? <CheckCircle2 size={14} color="#F43F5E" /> : <Lock size={14} color="#64748B" />}
                <span>Interactive Attack & Defense Terminal Labs</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: axiomTier !== "free" ? "#E2E8F0" : "#64748B" }}>
                {axiomTier !== "free" ? <CheckCircle2 size={14} color="#F43F5E" /> : <Lock size={14} color="#64748B" />}
                <span>Domain Performance Analytics & Flashcards</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: axiomTier === "enterprise" ? "#E2E8F0" : "#64748B" }}>
                {axiomTier === "enterprise" ? <CheckCircle2 size={14} color="#34D399" /> : <Lock size={14} color="#64748B" />}
                <span>Dedicated Enterprise LMS API & SCORM Exports</span>
              </li>
            </ul>

            <button
              onClick={() => onSelectTab("axiom")}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginTop: "auto",
                background: "linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              Open Axiom Simulator <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
