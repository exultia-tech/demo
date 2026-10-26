"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Lock, 
  Zap, 
  ShieldAlert, 
  RefreshCw, 
  Filter,
  Layers,
  ArrowRight
} from "lucide-react";
import { CATALOG_PACKAGES, PurePackage } from "@/app/api/pure-catalog/packages/route";

export default function PureCatalogClientView() {
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Simulator state
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simOutput, setSimOutput] = useState<string[]>([
    "pure-cli v2.4.0 (Exultia Sovereign Ecosystem)",
    "Connected to PureRegistry at registry.exultia.tech (Negative-Admission Gateway)",
    "Ready. Click a scenario below to test zero-CVE admission gates."
  ]);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const filteredPackages = CATALOG_PACKAGES.filter((pkg) => {
    if (selectedEcosystem !== "all" && pkg.ecosystem !== selectedEcosystem) return false;
    if (statusFilter !== "all" && pkg.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        pkg.name.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q) ||
        pkg.author.toLowerCase().includes(q) ||
        pkg.hotpatchInfo?.cveId.toLowerCase().includes(q) ||
        pkg.quarantineDetails?.cveId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const runSimulation = (scenario: "clean" | "patched" | "blocked") => {
    setSimRunning(true);
    if (scenario === "blocked") {
      setSimOutput([
        "$ pure install xz@5.6.0",
        "[PURE-GATEWAY] Resolving xz@5.6.0 from registry.exultia.tech...",
        "[VANTAGE-CHECK] Querying 110+ authoritative registries (NVD, OSV, CISA KEV)...",
        "[ADMISSION GATE] FAILED: Negative-admission invariant triggered!",
        "[SECURITY VIOLATION] CVE-2024-3094 (CVSS 10.0 CRITICAL) detected in release payload.",
        "[THREAT ANALYSIS] Malicious RSA_public_decrypt hijacking bytecode embedded in m4 build macros.",
        "[QUARANTINE ENFORCED] 423 Locked / Refusal Manifest signed with Cosign key.",
        "[ABORTED] Zero vulnerable bytes written to disk. Workspace preserved.",
        "[RECOMMENDED CLEAN] xz@5.6.1-pure1 or xz@5.4.6 (Certified 0 CVEs)."
      ]);
    } else if (scenario === "patched") {
      setSimOutput([
        "$ pure install openssh-server@9.7p1-pure1",
        "[PURE-GATEWAY] Resolving openssh-server@9.7p1-pure1 from registry.exultia.tech...",
        "[VANTAGE-CHECK] Checking RegreSSHion (CVE-2024-6387) status...",
        "[HOTPATCH VERIFIED] Kinetic in-memory patch tag #44d8 active.",
        "[PROVENANCE] SLSA Level 3 signed by Exultia Cosign Hardware Root of Trust.",
        "[SENTINEL TEST] Pre-image verified. 0 socket interruptions, 0 memory leaks.",
        "[SUCCESS] openssh-server@9.7p1-pure1 installed cleanly. 0 disclosed CVEs."
      ]);
    } else {
      setSimOutput([
        "$ pure install zod@3.23.8",
        "[PURE-GATEWAY] Resolving zod@3.23.8 from registry.exultia.tech...",
        "[VANTAGE-CHECK] Querying 110+ CVE registries... Clean.",
        "[MALWARE AUDIT] Sandboxed in Eris MicroVM: No obfuscated telemetry, no credential access.",
        "[PROVENANCE] SLSA Level 3 signed (OpenVEX: sha256:1a2b3c4d5e6f...).",
        "[SUCCESS] zod@3.23.8 installed. Zero disclosed vulnerabilities verified."
      ]);
    }
    setSimRunning(false);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 5rem 1.5rem" }}>
      
      {/* ── HERO BANNER ────────────────────────────────────────────────────────── */}
      <section style={{ textAlign: "center", padding: "4rem 0 3rem 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "5px 16px", borderRadius: "999px", marginBottom: "1.25rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34D399", boxShadow: "0 0 10px #34D399" }} />
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", fontWeight: 700, color: "#6EE7B7", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            The Pure Package Catalog • Negative-Admission Registry
          </span>
        </div>

        <h1 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "1.25rem", lineHeight: 1.15 }}>
          Install Only What Has <br />
          <span style={{ background: "linear-gradient(135deg, #34D399, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Zero Disclosed Vulnerabilities
          </span>
        </h1>

        <p style={{ maxWidth: "780px", margin: "0 auto 2.5rem auto", color: "#94A3B8", fontSize: "1.15rem", lineHeight: 1.65 }}>
          Traditional package registries distribute software with thousands of unpatched CVEs. 
          The <strong style={{ color: "#F8FAFC" }}>Pure Package Catalog</strong> flips admission: if a package has an active unmitigated vulnerability across 110+ registries, it is barred from installation with a signed refusal manifest. Clean packages and Kinetic-patched editions install instantly with 0 findings.
        </p>

        {/* Highlight Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", maxWidth: "980px", margin: "0 auto" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#34D399", fontFamily: "var(--font-mono, monospace)" }}>0 CVEs</div>
            <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "4px" }}>Admission Invariant</div>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#22D3EE", fontFamily: "var(--font-mono, monospace)" }}>110+ Feeds</div>
            <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "4px" }}>Vantage Continuous Sync</div>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#FBBF24", fontFamily: "var(--font-mono, monospace)" }}>SLSA L3</div>
            <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "4px" }}>Cosign Attested Provenance</div>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#A78BFA", fontFamily: "var(--font-mono, monospace)" }}>100% Free</div>
            <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "4px" }}>Public Sovereign Mirror</div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE TERMINAL SIMULATOR ────────────────────────────────────── */}
      <section style={{ marginBottom: "4rem" }}>
        <div style={{ background: "rgba(10, 16, 30, 0.9)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(15, 23, 42, 0.8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F59E0B" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", color: "#94A3B8", marginLeft: "10px" }}>
                pure-cli &bull; Admission Gate Live Evaluator
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={() => runSimulation("clean")}
                style={{ padding: "4px 12px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", color: "#34D399", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
              >
                Test: Clean (Zod)
              </button>
              <button 
                onClick={() => runSimulation("patched")}
                style={{ padding: "4px 12px", borderRadius: "6px", background: "rgba(6, 182, 212, 0.15)", border: "1px solid #06B6D4", color: "#22D3EE", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
              >
                Test: Patched (OpenSSH)
              </button>
              <button 
                onClick={() => runSimulation("blocked")}
                style={{ padding: "4px 12px", borderRadius: "6px", background: "rgba(239, 68, 68, 0.2)", border: "1px solid #EF4444", color: "#F87171", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
              >
                Test: Quarantined (XZ Backdoor)
              </button>
            </div>
          </div>

          {/* Console Body */}
          <div style={{ padding: "1.5rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.85rem", minHeight: "220px", maxHeight: "320px", overflowY: "auto", color: "#CBD5E1", lineHeight: 1.7 }}>
            {simOutput.map((line, idx) => {
              const isError = line.includes("FAILED") || line.includes("SECURITY VIOLATION") || line.includes("QUARANTINE");
              const isSuccess = line.includes("SUCCESS") || line.includes("VERIFIED");
              const isCmd = line.startsWith("$");
              return (
                <div key={idx} style={{ 
                  color: isError ? "#F87171" : isSuccess ? "#34D399" : isCmd ? "#38BDF8" : "#94A3B8",
                  fontWeight: isCmd || isError || isSuccess ? 700 : 400
                }}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LIVE PACKAGE CATALOG EXPLORER ────────────────────────────────────── */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
              Catalog Explorer
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: 0 }}>
              Search across ecosystems or inspect quarantined packages blocked from installation.
            </p>
          </div>

          {/* Search Input */}
          <div style={{ position: "relative", minWidth: "320px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
            <input 
              type="text"
              placeholder="Search packages, CVEs (e.g. xz, openssh, cve-2024-6387)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                borderRadius: "10px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                fontSize: "0.88rem",
                outline: "none"
              }}
            />
          </div>
        </div>

        {/* Ecosystem Filter Chips */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Ecosystems" },
            { id: "crates", label: "Rust (Crates.io)" },
            { id: "pypi", label: "Python (PyPI)" },
            { id: "npm", label: "Node.js (NPM)" },
            { id: "deb", label: "Debian (apt)" },
            { id: "apk", label: "Alpine (apk)" }
          ].map((eco) => (
            <button
              key={eco.id}
              onClick={() => setSelectedEcosystem(eco.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: selectedEcosystem === eco.id ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.04)",
                border: selectedEcosystem === eco.id ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.08)",
                color: selectedEcosystem === eco.id ? "#22D3EE" : "#94A3B8",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {eco.label}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "2rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.75rem" }}>
          <button
            onClick={() => setStatusFilter("all")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              background: statusFilter === "all" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              border: "none",
              color: statusFilter === "all" ? "#FFFFFF" : "#64748B",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            All Packages ({CATALOG_PACKAGES.length})
          </button>
          <button
            onClick={() => setStatusFilter("clean")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              background: statusFilter === "clean" ? "rgba(16, 185, 129, 0.15)" : "transparent",
              border: "none",
              color: statusFilter === "clean" ? "#34D399" : "#64748B",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Zero-CVE Clean
          </button>
          <button
            onClick={() => setStatusFilter("pure-patched")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              background: statusFilter === "pure-patched" ? "rgba(6, 182, 212, 0.15)" : "transparent",
              border: "none",
              color: statusFilter === "pure-patched" ? "#22D3EE" : "#64748B",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Pure-Patched (Hotfixed)
          </button>
          <button
            onClick={() => setStatusFilter("quarantined")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              background: statusFilter === "quarantined" ? "rgba(239, 68, 68, 0.15)" : "transparent",
              border: "none",
              color: statusFilter === "quarantined" ? "#F87171" : "#64748B",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Quarantine Enclave (Blocked)
          </button>
        </div>

        {/* Packages Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>
          {filteredPackages.map((pkg) => {
            const isQuarantined = pkg.status === "quarantined";
            const isPatched = pkg.status === "pure-patched";
            const isClean = pkg.status === "clean";

            return (
              <div 
                key={pkg.id}
                style={{
                  background: isQuarantined 
                    ? "rgba(239, 68, 68, 0.05)" 
                    : "rgba(15, 23, 42, 0.7)",
                  border: isQuarantined 
                    ? "1px solid rgba(239, 68, 68, 0.3)" 
                    : isPatched 
                    ? "1px solid rgba(6, 182, 212, 0.35)" 
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  {/* Top Bar: Ecosystem & Status Badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ 
                      padding: "3px 10px", 
                      borderRadius: "6px", 
                      background: "rgba(255, 255, 255, 0.06)", 
                      fontSize: "0.75rem", 
                      fontWeight: 800, 
                      color: "#94A3B8",
                      fontFamily: "var(--font-mono, monospace)",
                      textTransform: "uppercase" 
                    }}>
                      {pkg.ecosystem}
                    </span>

                    {isQuarantined ? (
                      <span style={{ 
                        padding: "3px 10px", 
                        borderRadius: "999px", 
                        background: "rgba(239, 68, 68, 0.15)", 
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        fontSize: "0.75rem", 
                        fontWeight: 800, 
                        color: "#F87171",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <ShieldAlert size={12} /> BLOCKED &bull; {pkg.disclosedCves} DISCLOSED CVE
                      </span>
                    ) : isPatched ? (
                      <span style={{ 
                        padding: "3px 10px", 
                        borderRadius: "999px", 
                        background: "rgba(6, 182, 212, 0.15)", 
                        border: "1px solid rgba(6, 182, 212, 0.4)",
                        fontSize: "0.75rem", 
                        fontWeight: 800, 
                        color: "#22D3EE",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <Zap size={12} /> PURE-PATCHED &bull; 0 DISCLOSURES
                      </span>
                    ) : (
                      <span style={{ 
                        padding: "3px 10px", 
                        borderRadius: "999px", 
                        background: "rgba(16, 185, 129, 0.15)", 
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        fontSize: "0.75rem", 
                        fontWeight: 800, 
                        color: "#34D399",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <CheckCircle2 size={12} /> 0 DISCLOSED CVES
                      </span>
                    )}
                  </div>

                  {/* Name & Version */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0, fontFamily: "var(--font-mono, monospace)" }}>
                      {pkg.name}
                    </h3>
                    <span style={{ fontSize: "0.85rem", color: isQuarantined ? "#F87171" : "#64748B", fontWeight: 600 }}>
                      v{pkg.version}
                    </span>
                  </div>

                  <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                    {pkg.description}
                  </p>

                  {/* Hotpatch Details Callout */}
                  {pkg.hotpatchInfo && (
                    <div style={{ background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.25)", borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.82rem" }}>
                      <div style={{ fontWeight: 800, color: "#22D3EE", marginBottom: "4px" }}>
                        ⚡ {pkg.hotpatchInfo.cveId} In-Memory Neutralized
                      </div>
                      <div style={{ color: "#CBD5E1", lineHeight: 1.4 }}>
                        {pkg.hotpatchInfo.description} (Latency: {pkg.hotpatchInfo.hotpatchLatencyMs}ms)
                      </div>
                    </div>
                  )}

                  {/* Quarantine Alert Callout */}
                  {pkg.quarantineDetails && (
                    <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.82rem" }}>
                      <div style={{ fontWeight: 800, color: "#F87171", marginBottom: "4px" }}>
                        🚫 Refusal Manifest: {pkg.quarantineDetails.cveId} (CVSS {pkg.quarantineDetails.cvss})
                      </div>
                      <div style={{ color: "#CBD5E1", marginBottom: "6px", lineHeight: 1.4 }}>
                        {pkg.quarantineDetails.refusalReason}
                      </div>
                      <div style={{ color: "#34D399", fontWeight: 700 }}>
                        Recommended Clean Alternative: {pkg.quarantineDetails.safeAlternative}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Metadata & Install Action */}
                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748B", marginBottom: "0.75rem", fontFamily: "var(--font-mono, monospace)" }}>
                    <span>{pkg.slsaLevel} Cosign Attested</span>
                    <span>{pkg.license}</span>
                  </div>

                  {isQuarantined ? (
                    <button 
                      disabled
                      style={{
                        width: "100%",
                        padding: "0.6rem",
                        borderRadius: "8px",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#F87171",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: "not-allowed",
                        textAlign: "center"
                      }}
                    >
                      Installation Barred by Negative Admission
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ 
                        flex: 1, 
                        background: "rgba(0,0,0,0.4)", 
                        border: "1px solid rgba(255, 255, 255, 0.08)", 
                        borderRadius: "8px", 
                        padding: "0.5rem 0.75rem", 
                        fontFamily: "var(--font-mono, monospace)", 
                        fontSize: "0.78rem", 
                        color: "#38BDF8", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap" 
                      }}>
                        pure install {pkg.name}@{pkg.version}
                      </div>
                      <button
                        onClick={() => copyToClipboard(`pure install ${pkg.name}@${pkg.version}`, pkg.id)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          color: "#FFFFFF",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {copiedKey === pkg.id ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3: PROXY INTEGRATION MATRIX (HOW TO POINT TOOLS) ──────────── */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Zero-Config Proxy Integration
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "700px", margin: "0 auto" }}>
            You do not need to change your build tools. Point your existing package managers directly to the Pure Package Registry mirror.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>📦</span> Universal Pure CLI
            </div>
            <pre style={{ background: "rgba(0,0,0,0.5)", padding: "0.85rem", borderRadius: "8px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", color: "#34D399", overflowX: "auto" }}>
              curl -sSf https://exultia.tech/pure.sh | sh<br />
              pure install tokio fastapi zod
            </pre>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>🟩</span> Node.js (NPM / Yarn / pnpm)
            </div>
            <pre style={{ background: "rgba(0,0,0,0.5)", padding: "0.85rem", borderRadius: "8px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", color: "#38BDF8", overflowX: "auto" }}>
              npm config set registry https://registry.exultia.tech/pure/
            </pre>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>🐍</span> Python (pip / poetry / uv)
            </div>
            <pre style={{ background: "rgba(0,0,0,0.5)", padding: "0.85rem", borderRadius: "8px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", color: "#FBBF24", overflowX: "auto" }}>
              pip install --index-url https://registry.exultia.tech/pure/simple/ ...
            </pre>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>🌀</span> Debian / Ubuntu (APT)
            </div>
            <pre style={{ background: "rgba(0,0,0,0.5)", padding: "0.85rem", borderRadius: "8px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", color: "#F87171", overflowX: "auto" }}>
              echo "deb https://registry.exultia.tech/pure/deb bookworm main" &gt; /etc/apt/sources.list.d/pure.list
            </pre>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>🏔️</span> Alpine Linux (APK)
            </div>
            <pre style={{ background: "rgba(0,0,0,0.5)", padding: "0.85rem", borderRadius: "8px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", color: "#34D399", overflowX: "auto" }}>
              echo "https://registry.exultia.tech/pure/alpine/v3.20/main" &gt;&gt; /etc/apk/repositories
            </pre>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>❄️</span> NixOS / Exultia Linux
            </div>
            <pre style={{ background: "rgba(0,0,0,0.5)", padding: "0.85rem", borderRadius: "8px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", color: "#22D3EE", overflowX: "auto" }}>
              nix.settings.substituters = [ "https://cache.exultia.tech/pure" ];
            </pre>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────────── */}
      <section style={{ 
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        borderRadius: "20px",
        padding: "3.5rem 2rem",
        textAlign: "center"
      }}>
        <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
          Integrate Pure Catalog into Your Developer Workstations
        </h2>
        <p style={{ maxWidth: "700px", margin: "0 auto 2rem auto", color: "#94A3B8", fontSize: "1.05rem", lineHeight: 1.6 }}>
          Run your builds inside hermetic <Link href="/products/pure-ide" style={{ color: "#38BDF8", textDecoration: "underline", fontWeight: 700 }}>PureIDE Enclaves</Link> or on top of sovereign <Link href="/products/exultia-linux" style={{ color: "#22D3EE", textDecoration: "underline", fontWeight: 700 }}>Exultia Linux</Link> nodes.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/app/pureide" className="btn-secondary" style={{ padding: "0.85rem 1.75rem", fontSize: "0.95rem" }}>
            Launch PureIDE Console →
          </Link>
          <Link href="/products/exultia-linux" className="btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "0.95rem" }}>
            Explore Exultia Linux OS →
          </Link>
        </div>
      </section>

    </div>
  );
}
