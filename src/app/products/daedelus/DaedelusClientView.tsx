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
  ArrowRight,
  Code2,
  Box,
  Cpu,
  Play,
  FileCode,
  FileCheck,
  Server
} from "lucide-react";
import { DaedelusIcon } from "@/components/BrandIcons";
import SelfHealingSimulator from "@/components/research/SelfHealingSimulator";
import { CATALOG_PACKAGES, PurePackage } from "@/app/api/pure-catalog/packages/route";

interface Blueprint {
  id: string;
  name: string;
  category: "Systems" | "Cloud Native" | "Data & AI" | "Web & Microservices";
  description: string;
  toolchain: string;
  memoryQuota: string;
  securityProfile: "Strict Air-Gapped" | "Isolated Proxy" | "Hardware Enclave";
  extensions: string[];
  command: string;
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: "bp-rust-enclave",
    name: "Rust Systems Enclave",
    category: "Systems",
    description: "Hermetic rustc 1.78 toolchain, cargo-audit, miri, and llvm-tools in an air-gapped container with zero network egress.",
    toolchain: "rustc 1.78.0 • cargo • miri • rust-analyzer",
    memoryQuota: "8 GB RAM / 4 vCPU",
    securityProfile: "Strict Air-Gapped",
    extensions: ["rust-analyzer", "crates", "tombi", "lldb-dap"],
    command: "daedelus launch ws:rust-systems-enclave"
  },
  {
    id: "bp-go-microservices",
    name: "Zero-Trust Go Microservices",
    category: "Cloud Native",
    description: "Hardened Go 1.22 toolchain with govulncheck pre-commit hook, gopls, and negative-admission proxy.",
    toolchain: "go 1.22.4 • govulncheck • gopls • delve",
    memoryQuota: "4 GB RAM / 2 vCPU",
    securityProfile: "Isolated Proxy",
    extensions: ["golang.go", "docker", "buf", "proto"],
    command: "daedelus launch ws:go-cloud-native"
  },
  {
    id: "bp-python-secops",
    name: "Confidential Python Data Lab",
    category: "Data & AI",
    description: "Pre-audited NumPy, PyTorch, and Polars environment with memory encryption and strict offline wheel cache.",
    toolchain: "python 3.11.9 • pip-audit • pyright • ruff",
    memoryQuota: "16 GB RAM / 8 vCPU",
    securityProfile: "Hardware Enclave",
    extensions: ["ms-python.python", "charliermarsh.ruff", "jupyter"],
    command: "daedelus launch ws:python-confidential"
  },
  {
    id: "bp-cpp-embedded",
    name: "C/C++ Hardened Systems & RTOS",
    category: "Systems",
    description: "Clang 18, ASan/UBSan instrumentation, Bear compile-commands generator, and GDB multiarch.",
    toolchain: "clang-18 • asan/ubsan • cmake • ninja • gdb",
    memoryQuota: "8 GB RAM / 4 vCPU",
    securityProfile: "Strict Air-Gapped",
    extensions: ["llvm-vs-code-extensions.vscode-clangd", "cmake-tools"],
    command: "daedelus launch ws:cpp-hardened"
  },
  {
    id: "bp-node-secure",
    name: "Node.js & TypeScript Clean Room",
    category: "Web & Microservices",
    description: "Node 20 LTS with pnpm locked against Daedelus Registry, biome linter, and sandboxed child_process.",
    toolchain: "node 20.14.0 • pnpm • biome • typescript 5.4",
    memoryQuota: "4 GB RAM / 2 vCPU",
    securityProfile: "Isolated Proxy",
    extensions: ["biomejs.biome", "typescript-next", "tailwind-intellisense"],
    command: "daedelus launch ws:node-cleanroom"
  }
];

interface OciContainer {
  id: string;
  name: string;
  tag: string;
  size: string;
  cveDisclosed: number;
  baseArch: "x86_64" | "aarch64" | "multi-arch";
  description: string;
  pullCommand: string;
  digest: string;
}

const CONTAINERS: OciContainer[] = [
  {
    id: "oci-distroless-base",
    name: "daedelus/base-distroless",
    tag: "2026.1",
    size: "4.8 MB",
    cveDisclosed: 0,
    baseArch: "multi-arch",
    description: "Pure runtime scratch container without package manager or shell. Stripped glibc, CA certs, and tzdata only.",
    pullCommand: "daedelus pull oci:registry.exultia.tech/daedelus/base-distroless:2026.1",
    digest: "sha256:7e91a20f9c2d1b827364501a349bc9aef7c11a8"
  },
  {
    id: "oci-static-scratch",
    name: "daedelus/static-scratch",
    tag: "latest",
    size: "1.2 MB",
    cveDisclosed: 0,
    baseArch: "multi-arch",
    description: "Zero-dependency static container base for pure Go and Rust binaries. Highest possible attack surface reduction.",
    pullCommand: "daedelus pull oci:registry.exultia.tech/daedelus/static-scratch:latest",
    digest: "sha256:3a180cf91a74d420f18821035b8014a93c9d12f"
  },
  {
    id: "oci-node-runtime",
    name: "daedelus/node-runtime",
    tag: "20.14-distroless",
    size: "38.2 MB",
    cveDisclosed: 0,
    baseArch: "multi-arch",
    description: "Pre-hardened Node.js 20 LTS runtime with V8 sandbox flags enabled, no npm CLI, and read-only rootfs.",
    pullCommand: "daedelus pull oci:registry.exultia.tech/daedelus/node-runtime:20.14-distroless",
    digest: "sha256:4d872a901844b2049182377bce981cba90124fe"
  },
  {
    id: "oci-python-minimal",
    name: "daedelus/python-minimal",
    tag: "3.11-hardened",
    size: "46.5 MB",
    cveDisclosed: 0,
    baseArch: "multi-arch",
    description: "CPython 3.11 with bytecode pre-compiled, stripped tests/tk/idlelib, and hardened memory allocator (scudo).",
    pullCommand: "daedelus pull oci:registry.exultia.tech/daedelus/python-minimal:3.11-hardened",
    digest: "sha256:8b0124fc69830da019842f1b402839a9cba801a"
  }
];

export default function DaedelusClientView() {
  const [activeTab, setActiveTab] = useState<"blueprints" | "packages" | "containers" | "simulator">("blueprints");
  
  // Package filtering state
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const filteredPackages = CATALOG_PACKAGES.filter((pkg) => {
    const matchesEco = selectedEcosystem === "all" || pkg.ecosystem.toLowerCase() === selectedEcosystem.toLowerCase();
    const matchesSearch = 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEco && matchesSearch;
  });

  return (
    <div>
      {/* ── TOP NAV CONTROLS & TAB SWITCHER ───────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
        <div 
          style={{ 
            display: "inline-flex", 
            background: "rgba(15, 23, 42, 0.8)", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            borderRadius: "16px", 
            padding: "6px",
            gap: "6px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          <button
            onClick={() => setActiveTab("blueprints")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.92rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              background: activeTab === "blueprints" ? "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)" : "transparent",
              color: activeTab === "blueprints" ? "#FFFFFF" : "#94A3B8"
            }}
          >
            <Code2 size={18} />
            Workstations &amp; Blueprints
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.92rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              background: activeTab === "packages" ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "transparent",
              color: activeTab === "packages" ? "#FFFFFF" : "#94A3B8"
            }}
          >
            <Package size={18} />
            Clean Packages &amp; Libraries
            <span style={{ fontSize: "0.72rem", background: "rgba(255, 255, 255, 0.2)", padding: "1px 6px", borderRadius: "999px" }}>0-CVE</span>
          </button>

          <button
            onClick={() => setActiveTab("containers")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.92rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              background: activeTab === "containers" ? "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" : "transparent",
              color: activeTab === "containers" ? "#FFFFFF" : "#94A3B8"
            }}
          >
            <Server size={18} />
            Sovereign Containers (OCI)
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.92rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              background: activeTab === "simulator" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "transparent",
              color: activeTab === "simulator" ? "#FFFFFF" : "#94A3B8"
            }}
          >
            <RefreshCw size={18} />
            Self-Healing Engine Lab
          </button>
        </div>
      </div>

      {/* ── TAB 1: WORKSTATIONS & BLUEPRINTS ──────────────────────────────────── */}
      {activeTab === "blueprints" && (
        <div className="fade-in" style={{ marginBottom: "5rem" }}>
          {/* Header Action Banner */}
          <div 
            style={{ 
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)",
              border: "1px solid rgba(6, 182, 212, 0.35)",
              borderRadius: "20px",
              padding: "2rem 2.5rem",
              marginBottom: "3rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5rem"
            }}
          >
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(6, 182, 212, 0.2)", padding: "4px 12px", borderRadius: "999px", marginBottom: "0.75rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22D3EE" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#67E8F9", letterSpacing: "0.06em", textTransform: "uppercase" }}>Interactive Web Workstation</span>
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
                Launch Daedelus in Your Browser
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.98rem", maxWidth: "680px", margin: 0 }}>
                Instant air-gapped developer enclave. Zero telemetry, locked cryptographic toolchains, and hardware enclave attestation without installing local binaries.
              </p>
            </div>
            <Link
              href="/app/pureide"
              className="btn-primary"
              style={{
                padding: "1rem 2.25rem",
                fontSize: "1.05rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)",
                boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)",
                fontWeight: 800
              }}
            >
              <Play size={18} fill="currentColor" />
              Open Daedelus Console →
            </Link>
          </div>

          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              Hermetic Role Blueprints
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "700px", margin: "0 auto" }}>
              Standardized, pre-compiled developer stacks guaranteed to run identically on developer laptops, CI workers, and air-gapped security enclaves.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
            {BLUEPRINTS.map((bp) => (
              <div 
                key={bp.id} 
                className="glass-card" 
                style={{ 
                  padding: "1.75rem", 
                  borderRadius: "16px", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", background: "rgba(59, 130, 246, 0.15)", color: "#60A5FA", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      {bp.category}
                    </span>
                    <span style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      {bp.securityProfile}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
                    {bp.name}
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                    {bp.description}
                  </p>

                  <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: "8px", padding: "10px 12px", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      Locked Toolchain
                    </div>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", color: "#CBD5E1" }}>
                      {bp.toolchain}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.5rem" }}>
                    {bp.extensions.map((ext) => (
                      <span key={ext} style={{ fontSize: "0.75rem", background: "rgba(255, 255, 255, 0.05)", color: "#94A3B8", padding: "2px 8px", borderRadius: "4px" }}>
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{ flex: 1, background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "8px 12px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", color: "#38BDF8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {bp.command}
                  </div>
                  <button
                    onClick={() => copyToClipboard(bp.command, bp.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                    title="Copy CLI command"
                  >
                    {copiedKey === bp.id ? <Check size={16} color="#34D399" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: PACKAGES & LIBRARIES ───────────────────────────────────────── */}
      {activeTab === "packages" && (
        <div className="fade-in" style={{ marginBottom: "5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              Clean-Room Package Registry
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "700px", margin: "0 auto" }}>
              Negative-admission proxy for npm, PyPI, Cargo, and APT. Every artifact admitted has 0 active CVEs and an automated SLA for retroactive zero-day eviction.
            </p>
          </div>

          {/* Search & Ecosystem Filter Bar */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ position: "relative", flex: "1 1 320px", maxWidth: "480px" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
              <input
                type="text"
                placeholder="Search clean packages (e.g. fastify, openssl, tokio)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  fontSize: "0.95rem",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["all", "npm", "pypi", "cargo", "apt", "nix"].map((eco) => (
                <button
                  key={eco}
                  onClick={() => setSelectedEcosystem(eco)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: selectedEcosystem === eco ? "rgba(16, 185, 129, 0.5)" : "rgba(255, 255, 255, 0.1)",
                    background: selectedEcosystem === eco ? "rgba(16, 185, 129, 0.2)" : "rgba(15, 23, 42, 0.5)",
                    color: selectedEcosystem === eco ? "#34D399" : "#94A3B8",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase"
                  }}
                >
                  {eco}
                </button>
              ))}
            </div>
          </div>

          {/* Package Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.25rem" }}>
            {filteredPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="glass-card" 
                style={{ 
                  padding: "1.5rem", 
                  borderRadius: "14px", 
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                        {pkg.ecosystem.toUpperCase()}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)" }}>
                        v{pkg.version}
                      </span>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#34D399", fontWeight: 800, background: "rgba(16, 185, 129, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                      <ShieldCheck size={14} /> 0 CVE
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0.25rem 0 0.5rem 0" }}>
                    {pkg.name}
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                    {pkg.description}
                  </p>
                </div>

                <div>
                  {(() => {
                    const installCmd = pkg.ecosystem === "npm" ? `pure install npm:${pkg.name}@${pkg.version}` :
                      pkg.ecosystem === "pypi" ? `pure pip install ${pkg.name}==${pkg.version}` :
                      pkg.ecosystem === "crates" ? `pure cargo add ${pkg.name}@${pkg.version}` :
                      pkg.ecosystem === "deb" ? `pure apt-get install ${pkg.name}=${pkg.version}` :
                      `pure install ${pkg.name}@${pkg.version}`;
                    return (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ flex: 1, background: "rgba(0, 0, 0, 0.4)", borderRadius: "8px", padding: "8px 12px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#34D399", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {installCmd}
                        </div>
                        <button
                          onClick={() => copyToClipboard(installCmd, pkg.id)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            background: "rgba(255, 255, 255, 0.05)",
                            color: "#FFFFFF",
                            cursor: "pointer"
                          }}
                          title="Copy install command"
                        >
                          {copiedKey === pkg.id ? <Check size={16} color="#34D399" /> : <Copy size={16} />}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: CONTAINERS & OCI RUNTIMES ─────────────────────────────────── */}
      {activeTab === "containers" && (
        <div className="fade-in" style={{ marginBottom: "5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              Sovereign OCI Runtimes &amp; Distroless Bases
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "700px", margin: "0 auto" }}>
              Engineered for production Kubernetes clusters and microVM hypervisors. Stripped of shells, package managers, and vulnerable utilities.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
            {CONTAINERS.map((c) => (
              <div 
                key={c.id} 
                className="glass-card" 
                style={{ 
                  padding: "1.75rem", 
                  borderRadius: "16px", 
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", background: "rgba(139, 92, 246, 0.15)", color: "#C084FC", border: "1px solid rgba(139, 92, 246, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                      OCI IMAGE
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#34D399", fontWeight: 800, background: "rgba(16, 185, 129, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                      <ShieldCheck size={14} /> 0 CVE DISCLOSED
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.25rem", fontFamily: "var(--font-mono, monospace)" }}>
                    {c.name}:{c.tag}
                  </h3>
                  <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem", color: "#64748B", marginBottom: "1rem" }}>
                    <span>Size: <strong style={{ color: "#E2E8F0" }}>{c.size}</strong></span>
                    <span>•</span>
                    <span>Arch: <strong style={{ color: "#E2E8F0" }}>{c.baseArch}</strong></span>
                  </div>

                  <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                    {c.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ flex: 1, background: "rgba(0, 0, 0, 0.4)", borderRadius: "8px", padding: "8px 12px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#C084FC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.pullCommand}
                    </div>
                    <button
                      onClick={() => copyToClipboard(c.pullCommand, c.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#FFFFFF",
                        cursor: "pointer"
                      }}
                      title="Copy pull command"
                    >
                      {copiedKey === c.id ? <Check size={16} color="#34D399" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)", wordBreak: "break-all" }}>
                    Digest: {c.digest}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: AUTONOMOUS SELF-HEALING ENGINE SIMULATOR ───────────────────── */}
      {activeTab === "simulator" && (
        <div className="fade-in" style={{ marginBottom: "5rem" }}>
          <SelfHealingSimulator />
        </div>
      )}

      {/* ── UNIFIED ZERO-CONFIG PROXY GUIDE ───────────────────────────────────── */}
      <section style={{ marginBottom: "5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "4rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Zero-Config Client Integration
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "700px", margin: "0 auto" }}>
            Daedelus is fully drop-in compatible with standard package managers, container runtimes, and CI runners. Point your endpoints to the sovereign registry mirror.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>📦</span> Daedelus CLI
            </div>
            <pre style={{ background: "rgba(0, 0, 0, 0.5)", padding: "12px", borderRadius: "8px", color: "#34D399", fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", overflowX: "auto" }}>
              {`curl -fsSL https://get.exultia.tech/daedelus | sh
daedelus auth login --key $EXULTIA_TOKEN
daedelus pull pkg:npm/fastify`}
            </pre>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>🟢</span> Node / NPM Proxy
            </div>
            <pre style={{ background: "rgba(0, 0, 0, 0.5)", padding: "12px", borderRadius: "8px", color: "#38BDF8", fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", overflowX: "auto" }}>
              {`npm config set registry \\
  https://registry.exultia.tech/npm/
npm install --audit=strict`}
            </pre>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>🐍</span> Python / Pip Mirror
            </div>
            <pre style={{ background: "rgba(0, 0, 0, 0.5)", padding: "12px", borderRadius: "8px", color: "#FCD34D", fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", overflowX: "auto" }}>
              {`pip config set global.index-url \\
  https://registry.exultia.tech/pypi/simple/
pip install polars`}
            </pre>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              <span>🦀</span> Cargo / Rust Config
            </div>
            <pre style={{ background: "rgba(0, 0, 0, 0.5)", padding: "12px", borderRadius: "8px", color: "#F87171", fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", overflowX: "auto" }}>
              {`[source.crates-io]
replace-with = "daedelus-registry"
[source.daedelus-registry]
registry = "sparse+https://registry.exultia.tech/cargo/"`}
            </pre>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURAL ADVANTAGES ─────────────────────────────────────────── */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Why Daedelus Changes Developer Security
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "700px", margin: "0 auto" }}>
            Traditional registries are blind mirrors that happily distribute zero-days. Daedelus enforces mathematical clean-room invariants.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
              <div style={{ padding: "10px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#34D399" }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Negative-Admission Gate</h3>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              Upstream packages from npm, PyPI, and Crates.io undergo automatic dynamic analysis and multi-feed scanning against Vantage Intel. Any package with a disclosed vulnerability is rejected before ingestion.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
              <div style={{ padding: "10px", borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", color: "#22D3EE" }}>
                <RefreshCw size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Retroactive Self-Healing</h3>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              When a package is admitted today but compromised tomorrow, Daedelus taints the package immediately, synthesizes the Next-Best Non-Vulnerable candidate, verifies ABI parity, and deploys fixes in &lt;50ms.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
              <div style={{ padding: "10px", borderRadius: "10px", background: "rgba(139, 92, 246, 0.15)", color: "#A78BFA" }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Unbroken SLSA Provenance</h3>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              From package dependency, to developer workspace compilation, to production distroless OCI container, every artifact carries Cosign SLSA Level 3/4 cryptographic signatures and OpenVEX attestations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
