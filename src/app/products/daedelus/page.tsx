import React, { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Terminal,
  Package,
  Box,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers,
  Cpu,
  FileCheck
} from "lucide-react";
import { DaedelusIcon } from "@/components/BrandIcons";
import DaedelusClientView from "./DaedelusClientView";

export const metadata: Metadata = {
  title: "Daedelus | Secure Developer Enclave & Containers",
  description:
    "The unified developer security platform: air-gapped workstations, negative-admission zero-CVE packages, distroless OCI containers, and cryptographic supply-chain verification.",
};

export default function DaedelusPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section
        className="hero-section"
        style={{
          paddingTop: "3.5rem",
          paddingBottom: "3.5rem",
          textAlign: "center",
          maxWidth: "1100px",
          margin: "0 auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {/* Category Eyebrow Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "6px 16px",
            borderRadius: "999px",
            marginBottom: "1.75rem",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#34D399",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Daedelus Platform
          </span>
        </div>

        {/* Brand Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <DaedelusIcon size={64} glow={false} />
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "1.25rem",
            color: "#F8FAFC",
          }}
        >
          Air-Gapped Workstations.
          <br />
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #34D399 0%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Zero-CVE Containers.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p
          style={{
            maxWidth: "760px",
            margin: "0 auto 2.25rem auto",
            fontSize: "1.15rem",
            lineHeight: 1.6,
            color: "#94A3B8",
          }}
        >
          The unified developer security platform: isolate toolchains in hermetic workstations,
          quarantine upstream dependencies through negative-admission proxies, and deliver signed
          distroless OCI containers for production.
        </p>

        {/* Primary Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          <Link
            href="/app/daedelus"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.85rem 1.85rem",
              background: "linear-gradient(135deg, #059669 0%, #0891B2 100%)",
              color: "#FFFFFF",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(5, 150, 105, 0.35)",
              transition: "transform 0.15s ease",
            }}
          >
            Launch Web Console
            <ArrowRight size={18} />
          </Link>
          <a
            href="#quickstart"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.85rem 1.85rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#E2E8F0",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "background 0.15s ease",
            }}
          >
            <Terminal size={18} />
            Quickstart
          </a>
        </div>

        {/* Inline Invariants Tags */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            color: "#94A3B8",
            fontSize: "0.86rem",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="#34D399" />
            Zero Network Egress
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="#34D399" />
            0 Admitted CVEs
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="#34D399" />
            &lt; 5MB Distroless Images
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="#34D399" />
            SLSA Level 4 Provenance
          </span>
        </div>
      </section>

      {/* ── SECTION 1: THE THREE CORE PILLARS ──────────────────────────────────── */}
      <section
        style={{
          maxWidth: "1140px",
          margin: "0 auto 5rem auto",
          padding: "0 1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#F8FAFC",
              marginBottom: "0.75rem",
            }}
          >
            Complete Developer Isolation
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            From the initial keystroke to production runtime, eliminate every supply chain attack surface.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {/* Pillar 1: Workstations */}
          <div
            id="workstations"
            style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(16, 185, 129, 0.22)",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <Terminal size={24} color="#34D399" />
            </div>
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#F8FAFC",
                marginBottom: "0.75rem",
              }}
            >
              Hermetic Workstations
            </h3>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
                flex: 1,
              }}
            >
              Zero-egress development enclaves for Rust, Go, Python, C/C++, and Node. Pre-audited
              compilers, language servers, and linters running in strict isolation to prevent C2
              exfiltration and token harvesting.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem 0",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "0.88rem",
                color: "#CBD5E1",
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#34D399" /> Hardware-enforced zero network egress
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#34D399" /> Pre-configured hermetic toolchain images
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#34D399" /> Ephemeral workspaces with clean state
              </li>
            </ul>
            <Link
              href="/app/daedelus?mode=ide"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#34D399",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Launch Workstation in Console <ArrowRight size={16} />
            </Link>
          </div>

          {/* Pillar 2: Package Registry */}
          <div
            id="packages"
            style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(6, 182, 212, 0.22)",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(6, 182, 212, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <Package size={24} color="#22D3EE" />
            </div>
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#F8FAFC",
                marginBottom: "0.75rem",
              }}
            >
              Negative-Admission Registry
            </h3>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
                flex: 1,
              }}
            >
              A transparent drop-in upstream mirror for npm, PyPI, and Crates.io that quarantines
              dependencies with disclosed CVEs, typosquatting patterns, or unverified keys before
              they reach developers.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem 0",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "0.88rem",
                color: "#CBD5E1",
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#22D3EE" /> Zero unpatched CVEs admitted
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#22D3EE" /> Automated typosquat &amp; payload detection
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#22D3EE" /> Drop-in proxy with standard package managers
              </li>
            </ul>
            <Link
              href="/app/daedelus?mode=packages"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#22D3EE",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Browse Curated Catalog <ArrowRight size={16} />
            </Link>
          </div>

          {/* Pillar 3: Distroless Containers */}
          <div
            id="containers"
            style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(139, 92, 246, 0.22)",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(139, 92, 246, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <Box size={24} color="#A78BFA" />
            </div>
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#F8FAFC",
                marginBottom: "0.75rem",
              }}
            >
              Distroless OCI Containers
            </h3>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
                flex: 1,
              }}
            >
              Scratch-based minimal container images under 5 MB. Completely stripped of shells,
              package managers, and unnecessary binaries to drastically shrink your production
              attack surface.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem 0",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "0.88rem",
                color: "#CBD5E1",
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#A78BFA" /> &lt;5 MB minimal base images
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#A78BFA" /> Zero shell (/bin/sh) attack surface
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#A78BFA" /> Cosign signed with SLSA Level 4 SBOM
              </li>
            </ul>
            <Link
              href="/app/daedelus?mode=containers"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#A78BFA",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Inspect Container Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS (3 SIMPLE STEPS) ─────────────────────────── */}
      <section
        style={{
          maxWidth: "1140px",
          margin: "0 auto 5rem auto",
          padding: "0 1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#F8FAFC",
              marginBottom: "0.75rem",
            }}
          >
            How Daedelus Works
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1.05rem" }}>
            A seamless three-stage security pipeline that stays out of your developers&apos; way.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "1.75rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#34D399",
                marginBottom: "0.75rem",
              }}
            >
              01
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#F8FAFC", marginBottom: "0.5rem" }}>
              Launch Isolated Enclave
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Developers spin up an air-gapped workstation in seconds via CLI or browser. Toolchains and language servers are locked and verified.
            </p>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "1.75rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#22D3EE",
                marginBottom: "0.75rem",
              }}
            >
              02
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#F8FAFC", marginBottom: "0.5rem" }}>
              Develop with Pre-Vetted Dependencies
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              All package pulls transparently route through the negative-admission proxy. Packages with known CVEs or suspect signatures are quarantined.
            </p>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "1.75rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#A78BFA",
                marginBottom: "0.75rem",
              }}
            >
              03
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#F8FAFC", marginBottom: "0.5rem" }}>
              Ship Signed Distroless Images
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Binaries compile directly into distroless OCI containers. Each build is automatically stamped with SLSA Level 4 provenance and OpenVEX attestations.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: DEVELOPER QUICKSTART ───────────────────────────────────── */}
      <section
        id="quickstart"
        style={{
          maxWidth: "880px",
          margin: "0 auto 5rem auto",
          padding: "0 1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.85rem",
              fontWeight: 700,
              color: "#F8FAFC",
              marginBottom: "0.5rem",
            }}
          >
            Developer Quickstart
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.98rem" }}>
            Get started locally with the Daedelus CLI or pull a distroless container base.
          </p>
        </div>

        <Suspense fallback={<div style={{ textAlign: "center", padding: "2rem", color: "#94A3B8" }}>Loading Quickstart...</div>}>
          <DaedelusClientView />
        </Suspense>
      </section>

      {/* ── SECTION 4: SECURITY INVARIANTS COMPARISON ──────────────────────────── */}
      <section
        id="security"
        style={{
          maxWidth: "1000px",
          margin: "0 auto 5rem auto",
          padding: "0 1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.85rem",
              fontWeight: 700,
              color: "#F8FAFC",
              marginBottom: "0.5rem",
            }}
          >
            Security Invariants Comparison
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.98rem" }}>
            How traditional developer machines compare against the Daedelus sovereign enclave model.
          </p>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.92rem" }}>
              <thead>
                <tr style={{ background: "rgba(255, 255, 255, 0.04)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <th style={{ padding: "14px 20px", color: "#94A3B8", fontWeight: 600 }}>Security Dimension</th>
                  <th style={{ padding: "14px 20px", color: "#EF4444", fontWeight: 600 }}>Standard Developer Setup</th>
                  <th style={{ padding: "14px 20px", color: "#34D399", fontWeight: 600 }}>Daedelus Enclave</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <td style={{ padding: "14px 20px", color: "#F8FAFC", fontWeight: 600 }}>Network Egress</td>
                  <td style={{ padding: "14px 20px", color: "#94A3B8" }}>Unrestricted internet access; vulnerable to exfiltration</td>
                  <td style={{ padding: "14px 20px", color: "#34D399", fontWeight: 600 }}>Zero-egress air-gap with verified proxy</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <td style={{ padding: "14px 20px", color: "#F8FAFC", fontWeight: 600 }}>Package Admission</td>
                  <td style={{ padding: "14px 20px", color: "#94A3B8" }}>Permissive; installs unknown zero-days &amp; typosquats</td>
                  <td style={{ padding: "14px 20px", color: "#34D399", fontWeight: 600 }}>Negative admission; 0 unpatched CVEs permitted</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <td style={{ padding: "14px 20px", color: "#F8FAFC", fontWeight: 600 }}>Container Base Images</td>
                  <td style={{ padding: "14px 20px", color: "#94A3B8" }}>Fat OS images (100MB+ with sh, apt, curl)</td>
                  <td style={{ padding: "14px 20px", color: "#34D399", fontWeight: 600 }}>Distroless scratch (&lt;5MB, zero shell)</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <td style={{ padding: "14px 20px", color: "#F8FAFC", fontWeight: 600 }}>Build Provenance</td>
                  <td style={{ padding: "14px 20px", color: "#94A3B8" }}>Unattested local builds; mutable toolchains</td>
                  <td style={{ padding: "14px 20px", color: "#34D399", fontWeight: 600 }}>SLSA Level 4 cosign &amp; OpenVEX attestations</td>
                </tr>
                <tr>
                  <td style={{ padding: "14px 20px", color: "#F8FAFC", fontWeight: 600 }}>Credential Protection</td>
                  <td style={{ padding: "14px 20px", color: "#94A3B8" }}>Plaintext ~/.aws, ~/.ssh, and env tokens readable</td>
                  <td style={{ padding: "14px 20px", color: "#34D399", fontWeight: 600 }}>Hardware enclave isolation with ephemeral secrets</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CALL TO ACTION BANNER ───────────────────────────────────── */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(6, 78, 59, 0.35) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "20px",
            padding: "3rem 2rem",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
              fontWeight: 800,
              color: "#F8FAFC",
              marginBottom: "0.75rem",
            }}
          >
            Ready to secure your developer pipeline?
          </h2>
          <p
            style={{
              color: "#94A3B8",
              fontSize: "1.05rem",
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
              lineHeight: 1.6,
            }}
          >
            Launch an instant air-gapped workstation in your browser or explore the full Daedelus suite in the web console.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/app/daedelus"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.85rem 1.85rem",
                background: "linear-gradient(135deg, #059669 0%, #0891B2 100%)",
                color: "#FFFFFF",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(5, 150, 105, 0.35)",
              }}
            >
              Open Daedelus Console
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/account?tab=config"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.85rem 1.85rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#E2E8F0",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              Configure Policies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
