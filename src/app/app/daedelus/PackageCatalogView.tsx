"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Package,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Filter,
  Layers,
  ShieldAlert,
  RefreshCw,
  FileCode,
  Lock,
  Code2,
  Info,
  X,
  Zap,
  ArrowRight,
  Server,
  Cpu
} from "lucide-react";
import { CATALOG_PACKAGES, PurePackage } from "@/app/api/pure-catalog/packages/route";

export type PackageActiveTab = "catalog" | "quarantine" | "proxy" | "attestation" | "export";

export default function PackageCatalogView() {
  const [activeTab, setActiveTab] = useState<PackageActiveTab>("catalog");
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inspectingPkg, setInspectingPkg] = useState<PurePackage | null>(null);
  const [activeProxyTab, setActiveProxyTab] = useState<"dae" | "npm" | "pip" | "cargo">("dae");
  const [exportFormat, setExportFormat] = useState<"lock" | "cyclonedx" | "vex">("lock");

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const filteredPackages = CATALOG_PACKAGES.filter((pkg) => {
    const matchesEco = selectedEcosystem === "all" || pkg.ecosystem.toLowerCase() === selectedEcosystem.toLowerCase();
    const matchesStatus = selectedStatus === "all" || pkg.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      pkg.name.toLowerCase().includes(q) ||
      pkg.description.toLowerCase().includes(q) ||
      pkg.author.toLowerCase().includes(q) ||
      pkg.hotpatchInfo?.cveId.toLowerCase().includes(q) ||
      pkg.quarantineDetails?.cveId.toLowerCase().includes(q);
    return matchesEco && matchesStatus && matchesSearch;
  });

  const totalClean = CATALOG_PACKAGES.filter(p => p.status !== "quarantined").length;
  const totalQuarantined = CATALOG_PACKAGES.filter(p => p.status === "quarantined").length;
  const totalPatched = CATALOG_PACKAGES.filter(p => p.status === "pure-patched").length;
  const quarantinedPackages = CATALOG_PACKAGES.filter(p => p.status === "quarantined");

  interface TabItem {
    id: PackageActiveTab;
    label: string;
    icon: string;
    badge?: number;
    badgeColor?: string;
  }

  const tabs: TabItem[] = [
    { id: "catalog", label: "Clean Catalog", icon: "📦", badge: totalClean },
    { id: "quarantine", label: "Admission Blocks", icon: "🚫", badge: totalQuarantined, badgeColor: "#F87171" },
    { id: "proxy", label: "Edge Proxy & CLI", icon: "⚡" },
    { id: "attestation", label: "OpenVEX Attestations", icon: "📋" },
    { id: "export", label: "Review & Export", icon: "🚀" }
  ];

  return (
    <div
      className="fade-in"
      style={{
        padding: "0.85rem 1.5rem 1.5rem",
        maxWidth: "1720px",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
    >
      {/* ── NORMALIZED HEADER (Identical to IDE & Container views) ────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1rem 1.25rem",
          background: "rgba(10, 15, 29, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          backdropFilter: "blur(16px)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#34D399",
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.25)"
            }}
          >
            <Package size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", margin: 0 }}>
                Daedelus Clean-Room Packages (0-CVE)
              </h1>
              <span
                style={{
                  fontSize: "0.68rem",
                  padding: "2px 8px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34D399",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  borderRadius: "6px",
                  fontWeight: 700
                }}
              >
                NEGATIVE ADMISSION
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  padding: "2px 8px",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60A5FA",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "6px",
                  fontWeight: 700
                }}
              >
                SLSA LEVEL 3/4
              </span>
            </div>
            <p style={{ color: "#94A3B8", margin: "0.25rem 0 0 0", fontSize: "0.82rem", lineHeight: 1.4 }}>
              Zero-CVE dependencies with Cosign hardware signatures, ABI neutralization, and developer-edge negative admission.
            </p>
          </div>
        </div>

        {/* Right Status / Action Controls */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab(activeTab === "proxy" ? "catalog" : "proxy")}
            className="btn-primary"
            style={{
              padding: "0.45rem 0.85rem",
              fontSize: "0.82rem",
              background: activeTab === "proxy" ? "rgba(255, 255, 255, 0.12)" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              border: "none",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Terminal size={14} />
            {activeTab === "proxy" ? "View Catalog Grid" : "Edge Proxy Setup"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)"
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "#34D399", fontWeight: 800, letterSpacing: "0.04em" }}>
              DAEDELUS INCLUDED
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKBENCH 2-COLUMN LAYOUT (Matching IDE & Container views) ── */}
      <div style={{ display: "flex", gap: "1.25rem", flex: 1, minHeight: 0 }}>
        
        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
        <aside
          style={{
            width: "230px",
            minWidth: "230px",
            padding: "0.75rem 0.5rem",
            borderRadius: "14px",
            background: "rgba(10, 14, 23, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            overflowY: "auto",
            backdropFilter: "blur(16px)"
          }}
        >
          {/* Sidebar Section Title */}
          <div style={{ padding: "0.3rem 0.6rem 0.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8" }}>
              Package Pipeline
            </span>
          </div>

          {/* Primary View Tabs */}
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PackageActiveTab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                background: activeTab === tab.id ? "rgba(16, 185, 129, 0.16)" : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid transparent",
                color: activeTab === tab.id ? "#6EE7B7" : "#94A3B8",
                cursor: "pointer",
                textAlign: "left",
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: "0.82rem",
                transition: "all 0.15s ease",
                width: "100%",
                position: "relative"
              }}
            >
              <span style={{ fontSize: "1rem", lineHeight: 1 }}>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.65rem",
                    padding: "1px 6px",
                    borderRadius: "999px",
                    background: tab.badgeColor ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                    color: tab.badgeColor || "#34D399",
                    fontWeight: 800
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}

          {/* Ecosystem Filter Subgroup in Sidebar */}
          <div style={{ marginTop: "0.85rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ padding: "0 0.6rem 0.4rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B" }}>
                Target Ecosystem
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {(["all", "npm", "pypi", "crates", "deb", "apk", "nix"] as const).map((eco) => (
                <button
                  key={eco}
                  onClick={() => {
                    setSelectedEcosystem(eco);
                    if (activeTab !== "catalog") setActiveTab("catalog");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "6px",
                    background: selectedEcosystem === eco ? "rgba(255, 255, 255, 0.06)" : "transparent",
                    color: selectedEcosystem === eco ? "#FFFFFF" : "#94A3B8",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: selectedEcosystem === eco ? 700 : 500,
                    textAlign: "left",
                    textTransform: eco === "all" ? "none" : "uppercase"
                  }}
                >
                  <span>{eco === "all" ? "All Ecosystems" : eco}</span>
                  {selectedEcosystem === eco && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399" }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Summary Footer */}
          <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.85rem" }}>
            <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.5rem" }}>
              Registry Summary
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94A3B8" }}>Clean 0-CVE</span>
                <span style={{ color: "#34D399", fontWeight: 700, fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem" }}>{totalClean}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94A3B8" }}>Hotpatched</span>
                <span style={{ color: "#22D3EE", fontWeight: 700, fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem" }}>{totalPatched}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94A3B8" }}>Quarantined</span>
                <span style={{ color: "#F87171", fontWeight: 700, fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem" }}>{totalQuarantined}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94A3B8" }}>Provenance</span>
                <span style={{ color: "#C084FC", fontWeight: 600, fontSize: "0.75rem" }}>SLSA L3/4</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("proxy")}
              style={{
                marginTop: "0.85rem",
                width: "100%",
                padding: "0.55rem 0.75rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.78rem",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem"
              }}
            >
              <span>⚡</span>
              <span>Connect Edge Proxy</span>
            </button>
          </div>
        </aside>

        {/* ── RIGHT MAIN VIEWPORT ──────────────────────────────────────────── */}
        <main
          className="glass-card"
          style={{
            flex: 1,
            padding: "1.5rem",
            borderRadius: "14px",
            overflowY: "auto",
            position: "relative",
            minWidth: 0
          }}
        >
          {/* TAB 1: CLEAN CATALOG ─────────────────────────────────────────── */}
          {activeTab === "catalog" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Stat Metric Pills (Compact) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.75rem"
                }}
              >
                <div style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Clean Packages</div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#34D399", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>
                    {totalClean}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#6EE7B7" }}>Zero Disclosed CVEs</div>
                </div>

                <div style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.25)" }}>
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Hotpatched</div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#22D3EE", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>
                    {totalPatched}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#67E8F9" }}>ABI-Verified Neutralization</div>
                </div>

                <div style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Quarantine Blocked</div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#F87171", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>
                    {totalQuarantined}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#FCA5A5" }}>Refused at Admission Edge</div>
                </div>

                <div style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", background: "rgba(168, 85, 247, 0.08)", border: "1px solid rgba(168, 85, 247, 0.25)" }}>
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Provenance</div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#C084FC", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>
                    OpenVEX
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#D8B4FE" }}>Cosign Signed</div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                {/* Search Input */}
                <div style={{ position: "relative", flex: "1 1 260px", maxWidth: "420px" }}>
                  <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    type="text"
                    placeholder="Search by package name, CVE, or ecosystem..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px 10px 7px 32px",
                      background: "rgba(0, 0, 0, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      fontSize: "0.82rem",
                      outline: "none"
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        color: "#94A3B8",
                        cursor: "pointer"
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div style={{ display: "flex", gap: "4px" }}>
                  {[
                    { id: "all", label: "All" },
                    { id: "clean", label: "0-CVE Clean" },
                    { id: "pure-patched", label: "Hotpatched" },
                    { id: "quarantined", label: "Quarantined" }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStatus(st.id)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: selectedStatus === st.id ? "#38BDF8" : "rgba(255, 255, 255, 0.08)",
                        background: selectedStatus === st.id ? "rgba(56, 189, 248, 0.18)" : "transparent",
                        color: selectedStatus === st.id ? "#38BDF8" : "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
                {filteredPackages.map((pkg) => {
                  const isQuarantined = pkg.status === "quarantined";
                  const isPatched = pkg.status === "pure-patched";

                  return (
                    <div
                      key={pkg.id}
                      style={{
                        padding: "1.15rem",
                        borderRadius: "12px",
                        border: `1px solid ${
                          isQuarantined
                            ? "rgba(239, 68, 68, 0.35)"
                            : isPatched
                            ? "rgba(6, 182, 212, 0.35)"
                            : "rgba(16, 185, 129, 0.22)"
                        }`,
                        background: isQuarantined
                          ? "rgba(239, 68, 68, 0.04)"
                          : isPatched
                          ? "rgba(6, 182, 212, 0.03)"
                          : "rgba(15, 23, 42, 0.55)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "0.85rem"
                      }}
                    >
                      <div>
                        {/* Header Row */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                background: "rgba(255, 255, 255, 0.08)",
                                color: "#E2E8F0"
                              }}
                            >
                              {pkg.ecosystem}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)" }}>
                              v{pkg.version}
                            </span>
                          </div>

                          {/* Status Badge */}
                          {isQuarantined ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.68rem",
                                background: "rgba(239, 68, 68, 0.15)",
                                color: "#F87171",
                                border: "1px solid rgba(239, 68, 68, 0.35)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: 800
                              }}
                            >
                              <AlertTriangle size={12} /> QUARANTINED
                            </span>
                          ) : isPatched ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.68rem",
                                background: "rgba(6, 182, 212, 0.15)",
                                color: "#22D3EE",
                                border: "1px solid rgba(6, 182, 212, 0.35)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: 800
                              }}
                            >
                              <Zap size={12} /> PURE-PATCHED
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.68rem",
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#34D399",
                                border: "1px solid rgba(16, 185, 129, 0.35)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: 800
                              }}
                            >
                              <ShieldCheck size={12} /> 0 CVE CLEAN
                            </span>
                          )}
                        </div>

                        {/* Package Name */}
                        <h3
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 800,
                            color: "#FFFFFF",
                            fontFamily: "var(--font-mono, monospace)",
                            margin: "0 0 0.3rem 0"
                          }}
                        >
                          {pkg.name}
                        </h3>

                        <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.4, margin: "0 0 0.65rem 0" }}>
                          {pkg.description}
                        </p>

                        {/* Quarantined Alert */}
                        {isQuarantined && pkg.quarantineDetails && (
                          <div
                            style={{
                              background: "rgba(239, 68, 68, 0.12)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              borderRadius: "6px",
                              padding: "0.5rem 0.65rem",
                              marginBottom: "0.65rem"
                            }}
                          >
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#F87171", display: "flex", alignItems: "center", gap: "4px" }}>
                              <ShieldAlert size={13} /> Refusal Reason ({pkg.quarantineDetails.cveId} &bull; CVSS {pkg.quarantineDetails.cvss})
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#FCA5A5", marginTop: "2px" }}>
                              {pkg.quarantineDetails.refusalReason}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "#34D399", marginTop: "3px", fontWeight: 600 }}>
                              Safe Alternative: {pkg.quarantineDetails.safeAlternative}
                            </div>
                          </div>
                        )}

                        {/* Hotpatch Alert */}
                        {isPatched && pkg.hotpatchInfo && (
                          <div
                            style={{
                              background: "rgba(6, 182, 212, 0.12)",
                              border: "1px solid rgba(6, 182, 212, 0.3)",
                              borderRadius: "6px",
                              padding: "0.5rem 0.65rem",
                              marginBottom: "0.65rem"
                            }}
                          >
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#22D3EE", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Zap size={13} /> Kinetic Hotpatch Active ({pkg.hotpatchInfo.cveId})
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "2px" }}>
                              {pkg.hotpatchInfo.description}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "#67E8F9", marginTop: "2px" }}>
                              Neutralization Latency: <strong>{pkg.hotpatchInfo.hotpatchLatencyMs}ms</strong>
                            </div>
                          </div>
                        )}

                        {/* Metadata Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "0.72rem", color: "#64748B" }}>
                          <div>Author: <span style={{ color: "#CBD5E1" }}>{pkg.author}</span></div>
                          <div>License: <span style={{ color: "#CBD5E1" }}>{pkg.license}</span></div>
                          <div>Weekly: <span style={{ color: "#CBD5E1" }}>{pkg.downloadsWeekly}</span></div>
                          <div>SLSA: <span style={{ color: "#34D399" }}>{pkg.slsaLevel}</span></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: "flex", gap: "6px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                        <button
                          onClick={() => setInspectingPkg(pkg)}
                          style={{
                            flex: 1,
                            padding: "6px 8px",
                            background: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            borderRadius: "6px",
                            color: "#FFFFFF",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px"
                          }}
                        >
                          <FileCode size={13} />
                          Inspect VEX
                        </button>

                        <button
                          onClick={() => {
                            const cmd = `dae pkg install ${pkg.name}@${pkg.version}`;
                            copyToClipboard(cmd, pkg.id);
                          }}
                          title="Copy install command"
                          style={{
                            padding: "6px 8px",
                            background: "rgba(16, 185, 129, 0.12)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            borderRadius: "6px",
                            color: "#34D399",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          {copiedKey === pkg.id ? <Check size={13} /> : <Copy size={13} />}
                          {copiedKey === pkg.id ? "Copied" : "Copy Install"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: QUARANTINE SENTINEL ───────────────────────────────────── */}
          {activeTab === "quarantine" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.4rem 0", color: "#FFFFFF" }}>
                  Negative Admission Sentinel &amp; Quarantine Audit
                </h2>
                <p style={{ color: "#94A3B8", margin: 0, fontSize: "0.82rem", lineHeight: 1.4 }}>
                  Dependencies with active, unpatched disclosures or unverified provenance are intercepted and blocked at the edge proxy before reaching developer workstations.
                </p>
              </div>

              {/* Explanatory Banner */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "10px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem"
                }}
              >
                <ShieldAlert size={20} color="#F87171" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F87171" }}>
                    How Developer Edge Negative Admission Works
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#CBD5E1", marginTop: "4px", lineHeight: 1.5 }}>
                    When a developer runs <code>npm install</code>, <code>pip install</code>, or <code>cargo add</code>, requests are proxied through Daedelus. If a package contains critical CVE disclosures or malicious payload signatures, the gateway responds with HTTP 403 Forbidden and returns the verified safe drop-in alternative.
                  </div>
                </div>
              </div>

              {/* Quarantined Packages List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {quarantinedPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    style={{
                      padding: "1.1rem 1.25rem",
                      borderRadius: "10px",
                      background: "rgba(239, 68, 68, 0.04)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "1rem"
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", color: "#CBD5E1", textTransform: "uppercase", fontWeight: 700 }}>
                          {pkg.ecosystem}
                        </span>
                        <strong style={{ fontSize: "1.05rem", fontFamily: "var(--font-mono, monospace)", color: "#F87171" }}>
                          {pkg.name}@{pkg.version}
                        </strong>
                        <span style={{ fontSize: "0.7rem", color: "#F87171", background: "rgba(239,68,68,0.15)", padding: "1px 6px", borderRadius: "4px", fontWeight: 800 }}>
                          ADMISSION REFUSED
                        </span>
                      </div>
                      <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: "0.4rem 0" }}>
                        {pkg.description}
                      </p>
                      {pkg.quarantineDetails && (
                        <div style={{ fontSize: "0.75rem", color: "#CBD5E1" }}>
                          <span style={{ color: "#F87171", fontWeight: 700 }}>Refusal:</span> {pkg.quarantineDetails.refusalReason} ({pkg.quarantineDetails.cveId}, CVSS {pkg.quarantineDetails.cvss})
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      {pkg.quarantineDetails && (
                        <div style={{ fontSize: "0.78rem", color: "#34D399", fontWeight: 700 }}>
                          Safe: {pkg.quarantineDetails.safeAlternative}
                        </div>
                      )}
                      <button
                        onClick={() => setInspectingPkg(pkg)}
                        style={{
                          marginTop: "0.5rem",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#FFFFFF",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        Inspect VEX Statement
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EDGE PROXY & CLI SETUP ────────────────────────────────── */}
          {activeTab === "proxy" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.4rem 0", color: "#FFFFFF" }}>
                  Developer Edge Proxy &amp; CLI Configuration
                </h2>
                <p style={{ color: "#94A3B8", margin: 0, fontSize: "0.82rem", lineHeight: 1.4 }}>
                  Connect your local package managers to the Daedelus clean-room repository to enforce zero-CVE admission automatically.
                </p>
              </div>

              {/* Ecosystem Selector */}
              <div style={{ display: "flex", gap: "6px" }}>
                {(["dae", "npm", "pip", "cargo"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveProxyTab(tab)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: activeProxyTab === tab ? "#34D399" : "rgba(255, 255, 255, 0.1)",
                      background: activeProxyTab === tab ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.04)",
                      color: activeProxyTab === tab ? "#6EE7B7" : "#94A3B8",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textTransform: "uppercase"
                    }}
                  >
                    {tab === "dae" ? "dae cli" : tab}
                  </button>
                ))}
              </div>

              {/* Terminal Command Box */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  padding: "1rem 1.25rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                    Run in your developer terminal
                  </span>
                  <button
                    onClick={() => {
                      const cmd =
                        activeProxyTab === "dae" ? "dae pkg install <package> --enforce-zero-cve --slsa=3" :
                        activeProxyTab === "npm" ? "npm config set registry https://registry.exultia.tech/npm" :
                        activeProxyTab === "pip" ? "pip config set global.index-url https://registry.exultia.tech/pypi/simple" :
                        'cargo config set source.crates-io.replace-with = "exultia-sparse"';
                      copyToClipboard(cmd, `proxy-${activeProxyTab}`);
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      padding: "5px 10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}
                  >
                    {copiedKey === `proxy-${activeProxyTab}` ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
                    {copiedKey === `proxy-${activeProxyTab}` ? "Copied" : "Copy Command"}
                  </button>
                </div>
                <code style={{ fontSize: "0.85rem", color: "#34D399", fontFamily: "var(--font-mono, monospace)" }}>
                  {activeProxyTab === "dae" && "dae pkg install <package> --enforce-zero-cve --slsa=3"}
                  {activeProxyTab === "npm" && "npm config set registry https://registry.exultia.tech/npm"}
                  {activeProxyTab === "pip" && "pip config set global.index-url https://registry.exultia.tech/pypi/simple"}
                  {activeProxyTab === "cargo" && 'cargo config set source.crates-io.replace-with = "exultia-sparse"'}
                </code>
              </div>

              {/* Instructions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.3rem" }}>
                    1. Zero Client Re-configuration
                  </div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.5 }}>
                    Standard tools (`npm`, `pip`, `cargo`) communicate normally over standard registry protocols. Daedelus transparently inspects requests and admits verified packages only.
                  </p>
                </div>

                <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.3rem" }}>
                    2. Cryptographic Hardware Signing
                  </div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.5 }}>
                    Every package tarball is stamped with Cosign SLSA Level 3/4 hardware keys, verifiable offline via your organization's public key.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPENVEX ATTESTATIONS ──────────────────────────────────── */}
          {activeTab === "attestation" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.4rem 0", color: "#FFFFFF" }}>
                  OpenVEX Attestations &amp; Cosign Provenance
                </h2>
                <p style={{ color: "#94A3B8", margin: 0, fontSize: "0.82rem", lineHeight: 1.4 }}>
                  Inspect cryptographically signed statements verifying that packages are either vulnerability-free or protected by verified runtime hotpatch neutralizations.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {filteredPackages.slice(0, 8).map((pkg) => (
                  <div
                    key={pkg.id}
                    style={{
                      padding: "0.85rem 1.1rem",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <strong style={{ fontSize: "0.95rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)" }}>
                          {pkg.name}@{pkg.version}
                        </strong>
                        <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", fontWeight: 800 }}>
                          {pkg.status === "pure-patched" ? "VEX: NEUTRALIZED" : "VEX: NOT_AFFECTED"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)", marginTop: "4px" }}>
                        Cosign Digest: {pkg.cosignDigest.slice(0, 48)}...
                      </div>
                    </div>

                    <button
                      onClick={() => setInspectingPkg(pkg)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "#34D399",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      View Raw VEX
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEW & EXPORT ────────────────────────────────────────── */}
          {activeTab === "export" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#FFFFFF" }}>
                    Review &amp; Export Package Manifests
                  </h2>
                  <p style={{ color: "#94A3B8", margin: "0.25rem 0 0 0", fontSize: "0.82rem" }}>
                    Export hermetic package lockfiles or CycloneDX / OpenVEX SBOM payloads.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  {(["lock", "cyclonedx", "vex"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: exportFormat === fmt ? "#10B981" : "rgba(255, 255, 255, 0.1)",
                        background: exportFormat === fmt ? "rgba(16, 185, 129, 0.2)" : "transparent",
                        color: exportFormat === fmt ? "#6EE7B7" : "#94A3B8",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textTransform: "uppercase"
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Preview */}
              <div
                style={{
                  background: "#0D1117",
                  padding: "1.25rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.82rem",
                  color: "#E6EDF3",
                  lineHeight: 1.6,
                  overflowX: "auto"
                }}
              >
                {exportFormat === "lock" && (
                  <pre style={{ margin: 0 }}>
{`# Daedelus Sovereign Package Lockfile (dae.lock)
# Generated: ${new Date().toISOString()}
# SLSA Level: 3/4 Verified | Enforce Zero-CVE: TRUE

registry "https://registry.exultia.tech/clean" {
${filteredPackages.slice(0, 6).map(p => `  package "${p.name}" {
    version = "${p.version}"
    ecosystem = "${p.ecosystem}"
    status = "${p.status}"
    sha256 = "${p.openVexHash.slice(0, 32)}"
  }`).join("\n")}
}`}
                  </pre>
                )}
                {exportFormat === "cyclonedx" && (
                  <pre style={{ margin: 0 }}>
{`{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "serialNumber": "urn:uuid:daedelus-${Date.now()}",
  "version": 1,
  "metadata": {
    "timestamp": "${new Date().toISOString()}",
    "tools": [{ "vendor": "Exultia", "name": "Daedelus" }]
  },
  "components": [
${filteredPackages.slice(0, 4).map(p => `    {
      "type": "library",
      "name": "${p.name}",
      "version": "${p.version}",
      "purl": "pkg:${p.ecosystem}/${p.name}@${p.version}"
    }`).join(",\n")}
  ]
}`}
                  </pre>
                )}
                {exportFormat === "vex" && (
                  <pre style={{ margin: 0 }}>
{`{
  "@context": "https://openvex.dev/ns/v0.2.0",
  "@id": "https://exultia.tech/vex/daedelus-${Date.now()}",
  "author": "Exultia Daedelus Clean-Room Forge",
  "timestamp": "${new Date().toISOString()}",
  "statements": [
${filteredPackages.slice(0, 4).map(p => `    {
      "vulnerability": { "name": "${p.hotpatchInfo?.cveId || 'CVE-CLEAN-VERIFIED'}" },
      "products": [{ "@id": "pkg:${p.ecosystem}/${p.name}@${p.version}" }],
      "status": "${p.status === 'pure-patched' ? 'fixed' : 'not_affected'}"
    }`).join(",\n")}
  ]
}`}
                  </pre>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── INSPECT ATTESTATION MODAL ─────────────────────────────────────── */}
      {inspectingPkg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
          onClick={() => setInspectingPkg(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: "700px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "2rem",
              borderRadius: "16px",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              background: "rgba(10, 15, 29, 0.98)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.2)", color: "#34D399", padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>
                  OPENVEX &bull; COSIGN SIGNED
                </span>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: "0.4rem 0 0.1rem 0", fontFamily: "var(--font-mono, monospace)" }}>
                  {inspectingPkg.name}@{inspectingPkg.version}
                </h2>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                  Ecosystem: {inspectingPkg.ecosystem} &bull; SLSA: {inspectingPkg.slsaLevel}
                </div>
              </div>
              <button
                onClick={() => setInspectingPkg(null)}
                style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "4px" }}>
                Cosign Attestation Signature
              </div>
              <div style={{ background: "rgba(0, 0, 0, 0.5)", padding: "8px 12px", borderRadius: "6px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#A78BFA", wordBreak: "break-all" }}>
                {inspectingPkg.cosignDigest}
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "4px" }}>
                OpenVEX Attestation Statement
              </div>
              <div style={{ background: "rgba(0, 0, 0, 0.5)", padding: "8px 12px", borderRadius: "6px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#34D399", wordBreak: "break-all" }}>
                {inspectingPkg.openVexHash}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "4px" }}>
                Negative-Admission Proxy Install Command
              </div>
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.6)",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.82rem",
                  color: "#38BDF8",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <code>dae pkg install {inspectingPkg.name}@{inspectingPkg.version} --enforce-zero-cve</code>
                <button
                  onClick={() => copyToClipboard(`dae pkg install ${inspectingPkg.name}@${inspectingPkg.version} --enforce-zero-cve`, "modal-cmd")}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "4px",
                    color: "#FFFFFF",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "0.72rem"
                  }}
                >
                  {copiedKey === "modal-cmd" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setInspectingPkg(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
