"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  KeyRound, 
  Layers,
  Terminal,
  ExternalLink,
  Flame,
  Zap
} from "lucide-react";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon,
  ErisIcon,
  ValkyrieIcon 
} from "@/components/BrandIcons";

interface CustomerOverviewProps {
  onSelectTab: (tab: any) => void;
  onOpenUpgradeModal: () => void;
}

export default function CustomerOverview({ onSelectTab, onOpenUpgradeModal }: CustomerOverviewProps) {
  const { user, getUserTier } = useAuth();

  const pureIdeTier = getUserTier("pureide");
  const uviTier = getUserTier("uvi");
  const praxisTier = getUserTier("praxis");
  const pureosTier = getUserTier("pureos");
  const axiomTier = getUserTier("axiom");
  const erisTier = getUserTier("eris");
  const valkyrieTier = getUserTier("valkyrie");

  // Calculate unlocked capabilities percentage across the full 7-product ecosystem
  const productTiers = [pureIdeTier, uviTier, praxisTier, pureosTier, axiomTier, erisTier, valkyrieTier];
  let unlockedScore = 0;
  productTiers.forEach(tier => {
    if (tier === "enterprise") unlockedScore += 14.28;
    else if (tier === "pro" || tier === "legal") unlockedScore += 10.5;
    else unlockedScore += 4;
  });
  unlockedScore = Math.min(100, Math.round(unlockedScore));

  const activePaidSubs = productTiers.filter(t => t !== "free").length;

  const quickLaunchers = [
    { id: "pureide", name: "PureIDE", desc: "Airgap Compiler", icon: PureIdeIcon, url: "/app/pureide", color: "#3B82F6", tier: pureIdeTier },
    { id: "uvi", name: "Vantage", desc: "Threat Intel Feed", icon: VantageIcon, url: "/app/uvi", color: "#8B5CF6", tier: uviTier },
    { id: "praxis", name: "Praxis", desc: "Auto Remediation", icon: PraxisIcon, url: "/app/praxis", color: "#F59E0B", tier: praxisTier },
    { id: "pureos", name: "PureOS", desc: "Hardened OCI", icon: PureOsIcon, url: "/app/pureos", color: "#10B981", tier: pureosTier },
    { id: "axiom", name: "Axiom", desc: "LMS Exam Simulator", icon: AxiomIcon, url: "/app/axiom", color: "#F43F5E", tier: axiomTier },
    { id: "eris", name: "Eris", desc: "Proving Ground", icon: ErisIcon, url: "/app/eris", color: "#EAB308", tier: erisTier },
    { id: "valkyrie", name: "Valkyrie", desc: "On-Demand Pentest", icon: ValkyrieIcon, url: "/app/valkyrie", color: "#06B6D4", tier: valkyrieTier },
  ];

  const products = [
    {
      id: "pureide",
      name: "PureIDE Workstation",
      category: "Compiler & IDE",
      icon: PureIdeIcon,
      tier: pureIdeTier,
      color: "#3B82F6",
      bgGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)",
      borderColor: "rgba(59, 130, 246, 0.3)",
      badgeColor: "#60A5FA",
      description: "Containerized hermetic compiler, airgapped binary cosigning, and developer workstation security.",
      features: [
        { label: "Hermetic Build Engine", unlocked: true },
        { label: "Cloud Build Acceleration", unlocked: pureIdeTier !== "free" },
        { label: "Hardware Cosign Key Enclave", unlocked: pureIdeTier === "enterprise" }
      ],
      primaryAction: { label: "Open PureIDE", tab: "pureide" }
    },
    {
      id: "uvi",
      name: "Vantage Threat Intel",
      category: "Global Threat Registry",
      icon: VantageIcon,
      tier: uviTier,
      color: "#8B5CF6",
      bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)",
      borderColor: "rgba(139, 92, 246, 0.3)",
      badgeColor: "#C084FC",
      description: "Unified encyclopedia of 110+ authoritative feeds across vendor advisories, zero-days, C2, and botnets.",
      features: [
        { label: "Realtime Consolidated Feed", unlocked: true },
        { label: "High-Throughput API Streams", unlocked: uviTier !== "free" },
        { label: "Bulk Parquet & JSON Dumps", unlocked: uviTier === "enterprise" }
      ],
      primaryAction: { label: "Open Vantage Feed", tab: "uvi" }
    },
    {
      id: "praxis",
      name: "Praxis Remediation",
      category: "Autonomous Defense",
      icon: PraxisIcon,
      tier: praxisTier,
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      badgeColor: "#FDE68A",
      description: "Sub-second hotpatch generation, firewall ACL synthesis, and deterministic CVE rollback execution.",
      features: [
        { label: "Targeted CVE Hotpatches", unlocked: true },
        { label: "Firewall & SIEM Exporters", unlocked: praxisTier !== "free" },
        { label: "Enterprise Fleet Orchestration", unlocked: praxisTier === "enterprise" }
      ],
      primaryAction: { label: "Open Praxis Console", tab: "praxis" }
    },
    {
      id: "valkyrie",
      name: "Valkyrie Pentesting",
      category: "On-Demand BAS",
      icon: ValkyrieIcon,
      tier: valkyrieTier,
      color: "#06B6D4",
      bgGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)",
      borderColor: "rgba(6, 182, 212, 0.3)",
      badgeColor: "#67E8F9",
      description: "On-demand exploitability verification with safe non-destructive probes and signed SHA-256 HMAC attestations.",
      features: [
        { label: "Critical CVE Verification Probes", unlocked: true },
        { label: "Cryptographic HMAC Attestations", unlocked: valkyrieTier !== "free" },
        { label: "Unlimited Fleet Telemetry & Reports", unlocked: valkyrieTier === "enterprise" }
      ],
      primaryAction: { label: "Open Valkyrie Pentest", tab: "valkyrie" }
    },
    {
      id: "eris",
      name: "Eris Proving Ground",
      category: "Chaos & Adversary Sandbox",
      icon: ErisIcon,
      tier: erisTier,
      color: "#EAB308",
      bgGradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)",
      borderColor: "rgba(234, 179, 8, 0.3)",
      badgeColor: "#FDE047",
      description: "Deliberately non-compliant configurations and vulnerable container sandboxes with automated safety watchdog timers.",
      features: [
        { label: "Curated Inoculation Modules", unlocked: true },
        { label: "Docker Vulnerability Range", unlocked: erisTier !== "free" },
        { label: "Custom Threat Simulations & Cron", unlocked: erisTier === "enterprise" }
      ],
      primaryAction: { label: "Open Eris Proving Ground", tab: "eris" }
    },
    {
      id: "pureos",
      name: "PureOS Hardened Containers",
      category: "Secure Linux Base",
      icon: PureOsIcon,
      tier: pureosTier,
      color: "#10B981",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)",
      borderColor: "rgba(16, 185, 129, 0.3)",
      badgeColor: "#6EE7B7",
      description: "CIS Level 1 & 2 pre-hardened container images synchronized with daily Vantage disclosures.",
      features: [
        { label: "CIS Level 1 Base Images", unlocked: true },
        { label: "Distroless & Daily Zero-Day Sync", unlocked: pureosTier !== "free" },
        { label: "Private Registry Proxy & Enclave", unlocked: pureosTier === "enterprise" }
      ],
      primaryAction: { label: "Open PureOS Catalog", tab: "pureos" }
    },
    {
      id: "axiom",
      name: "Axiom Simulator & LMS",
      category: "Certification Platform",
      icon: AxiomIcon,
      tier: axiomTier,
      color: "#F43F5E",
      bgGradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)",
      borderColor: "rgba(244, 63, 94, 0.3)",
      badgeColor: "#FDA4AF",
      description: "15,000+ question cybersecurity certification simulator with attack/defense terminal labs.",
      features: [
        { label: "15K+ Question Exam Engine", unlocked: true },
        { label: "Interactive Terminal Labs", unlocked: axiomTier !== "free" },
        { label: "Dedicated LMS API & SCORM", unlocked: axiomTier === "enterprise" }
      ],
      primaryAction: { label: "Open Axiom Simulator", tab: "axiom" }
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      
      {/* ── TOP STREAMLINED EXECUTIVE STATUS CARD ──────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.25)",
        borderRadius: "18px",
        padding: "1.5rem",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "#60A5FA", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={14} color="#60A5FA" />
              <span>Unified Customer Identity & Security Posture</span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              {activePaidSubs > 0 ? `${activePaidSubs} Active Licensed Workspaces` : "Community Free Tier Active"}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: unlockedScore >= 80 ? "#34D399" : (unlockedScore >= 45 ? "#60A5FA" : "#94A3B8"), lineHeight: 1 }}>
                {unlockedScore}%
              </div>
              <span style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                Capabilities Unlocked
              </span>
            </div>

            <Link
              href="/account/subscription"
              className="btn-primary"
              style={{
                padding: "8px 16px",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>Manage Plans</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "999px", overflow: "hidden", marginBottom: "1rem" }}>
          <div style={{
            width: `${unlockedScore}%`,
            height: "100%",
            background: unlockedScore >= 80
              ? "linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4, #10B981)" 
              : "linear-gradient(90deg, #3B82F6, #8B5CF6)",
            borderRadius: "999px",
            transition: "width 0.4s ease"
          }} />
        </div>

        {/* Quick Launcher Chips (Horizontal, uncluttered) */}
        <div>
          <div style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.6rem" }}>
            Instant Workspace Quick Launchers
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.6rem" }}>
            {quickLaunchers.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 10px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.borderColor = item.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  }}
                >
                  <Icon size={18} glow={false} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: item.tier !== "free" ? item.color : "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                      {item.tier}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SOVEREIGNTY BUNDLE CALLOUT BANNER ─────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
        border: "1px solid rgba(234, 179, 8, 0.35)",
        borderRadius: "14px",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(234, 179, 8, 0.2)", display: "grid", placeItems: "center" }}>
            <Sparkles size={20} color="#FBBF24" />
          </div>
          <div>
            <div style={{ color: "#FDE047", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "-0.01em" }}>
              Sovereignty Multi-Product Discount Active
            </div>
            <div style={{ color: "#CBD5E1", fontSize: "0.75rem", lineHeight: 1.4 }}>
              Unlock <strong>30% off</strong> for 1 companion product, <strong>40% off</strong> for 2 companions, and <strong>50% off</strong> when bundling Vantage, Praxis, Eris, and Valkyrie.
            </div>
          </div>
        </div>

        <Link
          href="/account/subscription"
          style={{
            padding: "6px 14px",
            background: "rgba(234, 179, 8, 0.2)",
            border: "1px solid rgba(234, 179, 8, 0.5)",
            borderRadius: "8px",
            color: "#FEF08A",
            fontSize: "0.75rem",
            fontWeight: 800,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <span>Calculate Bundle Savings</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* ── 7-PRODUCT UNCLUTTERED WORKSPACE TILES ─────────────────────────── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Product Consoles & Capabilities
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
              Access individual tools or customize entitlements across your organization.
            </span>
          </div>
          <Link
            href="/account/subscription"
            style={{ fontSize: "0.8rem", color: "#60A5FA", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
          >
            Plan Matrix <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.1rem" }}>
          {products.map(prod => {
            const Icon = prod.icon;
            const isPaid = prod.tier !== "free";

            return (
              <div
                key={prod.id}
                style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: `1px solid ${isPaid ? prod.borderColor : "rgba(255, 255, 255, 0.08)"}`,
                  borderRadius: "16px",
                  padding: "1.35rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.15s ease, border-color 0.15s ease"
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon size={28} glow={false} />
                    <div>
                      <h4 style={{ fontSize: "0.98rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                        {prod.name}
                      </h4>
                      <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                        {prod.category}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    padding: "2px 7px",
                    borderRadius: "6px",
                    background: isPaid ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
                    color: isPaid ? prod.badgeColor : "#94A3B8",
                    border: `1px solid ${isPaid ? prod.borderColor : "rgba(255, 255, 255, 0.1)"}`
                  }}>
                    {prod.tier}
                  </span>
                </div>

                {/* Description */}
                <p style={{ color: "#94A3B8", fontSize: "0.78rem", lineHeight: 1.45, margin: "0 0 1rem 0", minHeight: "44px" }}>
                  {prod.description}
                </p>

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem 0", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  {prod.features.map((feat, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "0.75rem", color: feat.unlocked ? "#E2E8F0" : "#64748B" }}>
                      {feat.unlocked ? (
                        <CheckCircle2 size={13} color={prod.color} />
                      ) : (
                        <Lock size={13} color="#475569" />
                      )}
                      <span>{feat.label}</span>
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr auto", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => onSelectTab(prod.primaryAction.tab)}
                    className="btn-primary"
                    style={{
                      padding: "7px 12px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px"
                    }}
                  >
                    <span>{prod.primaryAction.label}</span>
                    <ArrowRight size={13} />
                  </button>

                  <Link
                    href={`/account/subscription?product=${prod.id}`}
                    style={{
                      padding: "7px 10px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      color: "#CBD5E1",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title="Plan details"
                  >
                    Tier
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
