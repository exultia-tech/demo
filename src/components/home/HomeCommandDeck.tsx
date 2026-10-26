"use client";

import React from "react";
import { 
  VantageIcon, 
  DaedelusIcon, 
  PraxisIcon, 
  ErisIcon, 
  ExultiaLinuxIcon,
  PureOsIcon
} from "@/components/BrandIcons";
import { 
  ShieldCheck, 
  Layers, 
  Lock, 
  RotateCcw,
  Zap,
  Cpu,
  Search,
  CheckCircle2,
  FileCode2,
  Terminal,
  Activity,
  Server
} from "lucide-react";

export default function HomeCommandDeck() {
  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "2rem 1rem 6rem 1rem" }}>
      
      {/* ── 1. INTRODUCTION & STATEMENT OF PURPOSE ────────────────────────────── */}
      <section style={{ textAlign: "center", marginBottom: "4.5rem", paddingTop: "2rem" }}>
        
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "5px 16px",
          borderRadius: "999px",
          marginBottom: "1.75rem",
          fontSize: "0.8rem",
          fontFamily: "var(--font-mono, monospace)",
          color: "var(--text-muted, #94A3B8)",
          letterSpacing: "0.05em",
          textTransform: "uppercase"
        }}>
          <span>Platform Overview</span>
        </div>

        <h1 style={{ 
          fontSize: "clamp(2.4rem, 5vw, 3.6rem)", 
          fontWeight: 800, 
          color: "#FFFFFF", 
          letterSpacing: "-0.03em", 
          marginBottom: "1.5rem",
          lineHeight: 1.15
        }}>
          Sovereign Infrastructure.
          <span style={{ 
            display: "block", 
            color: "#60A5FA",
            fontWeight: 800
          }}>
            Continuous Autonomous Defense.
          </span>
        </h1>

        <p style={{ 
          color: "#94A3B8", 
          fontSize: "1.2rem", 
          maxWidth: "800px", 
          margin: "0 auto 2.5rem auto", 
          lineHeight: 1.65 
        }}>
          Exultia is an integrated cyber defense platform. We replace fragmented security tools and slow upstream vendor patch cycles with an end-to-end architecture: from air-gapped developer workstations to self-healing operating systems and in-memory hotpatching.
        </p>

        {/* Minimal architectural traits */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "1.75rem", 
          flexWrap: "wrap", 
          fontSize: "0.84rem", 
          color: "#64748B", 
          fontFamily: "var(--font-mono, monospace)" 
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Lock size={14} color="#60A5FA" /> Zero Developer Telemetry
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Zap size={14} color="#34D399" /> In-Memory Hotpatching
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RotateCcw size={14} color="#38BDF8" /> &lt;50ms Deterministic Rollback SLA
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={14} color="#A78BFA" /> Cryptographic Provenance
          </span>
        </div>
      </section>

      {/* ── 2. THE PROBLEM WE SOLVE ───────────────────────────────────────────── */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "2.5rem 2rem"
        }}>
          <div style={{ maxWidth: "720px", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              The Problem: The Latency Gap in Modern Security
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Traditional infrastructure security is fragmented across point solutions that notify engineers of vulnerabilities, but leave the hard work of verification, compilation, and downtime-inducing maintenance to human operators.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F87171", marginBottom: "0.5rem", fontFamily: "var(--font-mono, monospace)" }}>
                01. The Patch Lag
              </div>
              <p style={{ fontSize: "0.9rem", color: "#CBD5E1", lineHeight: 1.55, margin: 0 }}>
                Upstream open-source maintainers and Linux distributions often take weeks or months to publish backported security fixes, while automated adversaries weaponize exploits within hours of disclosure.
              </p>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F87171", marginBottom: "0.5rem", fontFamily: "var(--font-mono, monospace)" }}>
                02. Costly Service Restarts
              </div>
              <p style={{ fontSize: "0.9rem", color: "#CBD5E1", lineHeight: 1.55, margin: 0 }}>
                Applying standard package updates forces full service or host reboots. Because reboots drop active TCP connections and risk downtime, teams frequently defer critical patches until weekend maintenance windows.
              </p>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F87171", marginBottom: "0.5rem", fontFamily: "var(--font-mono, monospace)" }}>
                03. Developer Supply-Chain Leaks
              </div>
              <p style={{ fontSize: "0.9rem", color: "#CBD5E1", lineHeight: 1.55, margin: 0 }}>
                Default development tools stream telemetry, source code snippets, and token data back to third-party cloud providers, while package managers happily install packages with active, unpatched CVEs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. GUIDED PRODUCT EXPLANATION ─────────────────────────────────────── */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
            The Exultia Architecture
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "680px", margin: "0 auto" }}>
            Each component in the Exultia ecosystem addresses a specific layer of the attack surface, from initial code authoring to running kernels in production.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Component 1: Vantage */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "60px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "4px" }}>
              <VantageIcon size={48} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Vantage Intel</h3>
                <span style={{ fontSize: "0.72rem", background: "rgba(168, 85, 247, 0.15)", color: "#C084FC", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                  THREAT INTELLIGENCE &amp; INVENTORY
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                Vantage continuously monitors over 110 global vulnerability registries, Linux security advisories, NIST NVD feeds, and early-warning disclosure forums. Rather than generating generic alerts, Vantage cross-references incoming disclosures with your active host inventories to immediately determine whether your specific software builds are exposed.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Ingestion Latency:</strong> &lt; 60 seconds from public disclosure</span>
                <span><strong>Sources:</strong> 110+ authoritative feeds deduplicated</span>
              </div>
            </div>
          </div>

          {/* Component 2: Daedelus */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "60px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "4px" }}>
              <DaedelusIcon size={48} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Daedelus</h3>
                <span style={{ fontSize: "0.72rem", background: "rgba(59, 130, 246, 0.15)", color: "#60A5FA", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                  DEVELOPER PLATFORM &amp; REGISTRY GATEKEEPER
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                Daedelus secures the software authoring environment. It provides <strong>PureIDE</strong>—reproducible, air-gapped developer builds of standard tools (VS Code, Zed, Neovim) stripped of vendor telemetry and cloud tracking. Paired with the <strong>Zero-CVE Catalog</strong>, it acts as a negative-admission registry proxy for npm, PyPI, and Cargo, intercepting and blocking dependencies with known vulnerabilities before they are ever installed on developer laptops.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Developer Privacy:</strong> 100% telemetry-free</span>
                <span><strong>Admission Policy:</strong> Zero open CVEs permitted</span>
              </div>
            </div>
          </div>

          {/* Component 3: Eris & Valkyrie */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "60px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "4px" }}>
              <ErisIcon size={48} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Eris &amp; Valkyrie</h3>
                <span style={{ fontSize: "0.72rem", background: "rgba(239, 68, 68, 0.15)", color: "#F87171", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                  ADVERSARY EMULATION &amp; PROOF OF EXPLOIT
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                Before any patch is released, defense teams need certainty that an exploit is both valid and actually exploitable on their system configuration. Eris and Valkyrie spin up isolated ephemeral microVMs matching your environment, executing non-destructive exploit simulations to generate verifiable cryptographic proofs without touching live production instances.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Verification Method:</strong> Non-destructive HMAC proofs</span>
                <span><strong>Execution:</strong> Isolated ephemeral microVMs</span>
              </div>
            </div>
          </div>

          {/* Component 4: Praxis */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "60px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "4px" }}>
              <PraxisIcon size={48} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Praxis</h3>
                <span style={{ fontSize: "0.72rem", background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                  IN-MEMORY HOTPATCH ENGINE
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                Praxis solves the dilemma between immediate remediation and service stability. It compiles and injects atomic hotpatches directly into the virtual memory spaces of running binaries and the Linux kernel. Vulnerable execution branches are redirected instantaneously with zero dropped TCP connections, zero socket terminations, and no process restarts.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Host Execution Latency:</strong> Sub-second in-memory injection</span>
                <span><strong>Network Impact:</strong> 0 dropped TCP sockets</span>
              </div>
            </div>
          </div>

          {/* Component 5: Exultia Linux */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "60px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "4px" }}>
              <ExultiaLinuxIcon size={48} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Exultia Linux</h3>
                <span style={{ fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                  SOVEREIGN HOST OPERATING SYSTEM
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                The host operating system where self-healing lives. Built on an immutable, declarative Nix store, Exultia Linux runs a native <strong>Kinetic daemon</strong>. When an active vulnerability is identified in an installed package, the OS retroactively solves the dependency graph, injects in-memory fixes, and stages a clean rollback generation. If any behavioral regression is detected, the host reverts to its known-good snapshot in under 50 milliseconds.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Base Architecture:</strong> Declarative immutable Nix store</span>
                <span><strong>Rollback SLA:</strong> Guaranteed &lt; 50ms deterministic revert</span>
              </div>
            </div>
          </div>

          {/* Component 6: PureOS */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "60px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "4px" }}>
              <PureOsIcon size={48} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>PureOS</h3>
                <span style={{ fontSize: "0.72rem", background: "rgba(6, 182, 212, 0.15)", color: "#22D3EE", border: "1px solid rgba(6, 182, 212, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                  DISTROLESS CONTAINER BASES
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                For workloads destined for containers and Kubernetes clusters, PureOS supplies ultra-minimal distroless OCI container images. Stripped of shells, package managers, and extraneous utilities, they present a drastically reduced attack surface with cryptographic SLSA Level 3 provenance and Cosign verification.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Format:</strong> OCI Distroless compliant</span>
                <span><strong>Attestation:</strong> Cosign &amp; SLSA Level 3 signed</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. HOW THE PIECES WORK TOGETHER (THE CLOSED LOOP) ─────────────────── */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "2.5rem 2rem"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem", textAlign: "center" }}>
            How It Works Together: The Closed-Loop Lifecycle
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", textAlign: "center", maxWidth: "640px", margin: "0 auto 2.5rem auto" }}>
            The power of Exultia lies in interconnecting threat intelligence, developer environments, and running kernels into a single continuous feedback loop.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            
            <div style={{ borderLeft: "2px solid #C084FC", paddingLeft: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#C084FC", fontWeight: 700, textTransform: "uppercase" }}>
                Stage 1 &bull; Ingest &amp; Correlate
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", margin: "4px 0 6px 0" }}>
                Vantage
              </div>
              <p style={{ fontSize: "0.88rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                Discovers new CVE or zero-day disclosure across 110+ registries and maps impact against fleet inventory within 60 seconds.
              </p>
            </div>

            <div style={{ borderLeft: "2px solid #F87171", paddingLeft: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#F87171", fontWeight: 700, textTransform: "uppercase" }}>
                Stage 2 &bull; Prove Exploitability
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", margin: "4px 0 6px 0" }}>
                Eris &amp; Valkyrie
              </div>
              <p style={{ fontSize: "0.88rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                Validates whether the specific host build is actually exploitable using non-destructive simulation inside ephemeral sandboxes.
              </p>
            </div>

            <div style={{ borderLeft: "2px solid #34D399", paddingLeft: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#34D399", fontWeight: 700, textTransform: "uppercase" }}>
                Stage 3 &bull; Hotpatch Runtime
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", margin: "4px 0 6px 0" }}>
                Praxis &amp; Exultia Linux
              </div>
              <p style={{ fontSize: "0.88rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                Compiles and injects in-memory hotpatches into live processes and kernels without service restarts, backed by &lt;50ms rollback.
              </p>
            </div>

            <div style={{ borderLeft: "2px solid #60A5FA", paddingLeft: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase" }}>
                Stage 4 &bull; Gate Upstream
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", margin: "4px 0 6px 0" }}>
                Daedelus &amp; PureOS
              </div>
              <p style={{ fontSize: "0.88rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                Quarantines the vulnerable package from developer package managers and regenerates distroless containers with clean dependencies.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. CORE PHILOSOPHY & SOVEREIGNTY ──────────────────────────────────── */}
      <section style={{ textAlign: "center", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "3.5rem" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.75rem" }}>
          Built for True Technical Sovereignty
        </h3>
        <p style={{ color: "#94A3B8", fontSize: "0.95rem", maxWidth: "640px", margin: "0 auto 1.5rem auto", lineHeight: 1.6 }}>
          We believe high-consequence infrastructure must remain transparent, deterministic, and verifiable. 
          Exultia Linux is free and open-source forever. Our commercial services exist solely to fund 24/7 continuous threat intelligence, verification compute, and fleet coordination.
        </p>
        <div style={{ display: "inline-flex", gap: "2rem", color: "#64748B", fontSize: "0.85rem", fontFamily: "var(--font-mono, monospace)" }}>
          <span>No Telemetry</span>
          <span>&bull;</span>
          <span>No Vendor Lock-In</span>
          <span>&bull;</span>
          <span>Deterministic Builds</span>
        </div>
      </section>

    </div>
  );
}
