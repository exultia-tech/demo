"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  VantageIcon, 
  DaedelusIcon, 
  PraxisIcon, 
  ExultiaLinuxIcon,
  AxiomIcon,
  PureOsIcon
} from "@/components/BrandIcons";
import { 
  ShieldCheck, 
  Lock, 
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Terminal,
  Check,
  Copy,
  Cpu,
  Server,
  Code2,
  Box,
  Package,
  HardDrive,
  Award,
  BookOpen,
  CheckCircle2
} from "lucide-react";

export default function HomeCommandDeck() {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<"portable_pipeline" | "k8s_daemonset" | "systemd_service" | "exultia_conf" | "remediation_loop" | "stix_payload">("portable_pipeline");

  const configSnippets: Record<string, { label: string; file: string; code: string }> = {
    portable_pipeline: {
      label: "Tier 1: Portable Linux Daemon",
      file: "curl -sSL https://exultia.tech/install.sh | sudo sh",
      code: `# Tier 1: One-Line Universal Installer for Any Linux System
# Installs /usr/local/bin/exultia with pre-baked 24,388 UVI offline database
# Automatically registers continuous 60-second autonomous healing daemon
curl -sSL https://exultia.tech/install.sh | sudo sh

# 2. Or manual air-gapped tarball install:
wget https://exultia.tech/releases/exultia-linux.tar.gz
tar -xzf exultia-linux.tar.gz && cd exultia-linux
sudo ./install.sh

# 3. Instant Day-Zero Offline Commands (Zero internet connection needed):
exultia audit                  # Full security compliance audit against 24,388 advisories
exultia test --canary --sandbox # Ephemeral microVM exploit verification & sandbox validation
exultia fix                    # Auto-remediate all drifted controls & take safety snapshot
exultia search rust            # Sub-millisecond offline UVI catalog query`
    },
    k8s_daemonset: {
      label: "Tier 2: Kubernetes Helm & DaemonSet",
      file: "helm install exultia-remediator exultia/exultia-node-shield",
      code: `# Tier 2: Enterprise Kubernetes Cluster Remediation
# Option A: Helm 3 Deployment (Recommended for EKS / GKE / AKS / Talos / k3s)
helm repo add exultia https://charts.exultia.tech
helm repo update
helm install exultia-remediator exultia/exultia-node-shield \\
  --namespace kube-system \\
  --set offlineDatabase.enabled=true \\
  --set loopInterval=60s \\
  --set eBPF.socketTracing=true \\
  --set metrics.prometheusPort=9100

# Option B: Raw kubectl apply DaemonSet (Zero-Helm / Air-gapped clusters)
kubectl apply -f https://exultia.tech/k8s/exultia-daemonset.yaml

# Verify cluster-wide autonomous node healing:
kubectl get daemonset -n kube-system exultia-remediator
curl -s http://<node-ip>:9100/metrics | grep exultia_remediations_total`
    },
    exultia_conf: {
      label: "Exultia STIX/TAXII Config",
      file: "/etc/exultia/exultia.conf",
      code: `# /etc/exultia/exultia.conf (Linux / systemd)
[vantage_upstream]
url = "https://exultia.tech/api/threat-feed"
auth_token = "exultia_pki_verified"
poll_interval = "60s"
auto_safety_snapshot = true

[corporate_local]
url = "https://siem.internal.corp/taxii2/indicators"
namespace_uuid = "client-local-550e8400-e29b-41d4-a716-446655440000"
allow_kernel_patch = false
allow_network_filter = true
stability_override = true

[canary_probe]
enabled = true
canary_timeout = "10s"
non_destructive = true

[sandbox_validation]
enabled = true
canary_cycles = 5
microvm_sandbox_ttl = "10m"`
    },
    systemd_service: {
      label: "systemd Service & Watchdog",
      file: "/etc/systemd/system/exultia.service",
      code: `# /etc/systemd/system/exultia.service - Autonomous Remediator
[Unit]
Description=Exultia Autonomous Threat Remediation Daemon
After=network.target auditd.service
Documentation=https://exultia.tech/docs

[Service]
Type=simple
ExecStart=/usr/local/bin/exultia daemon --loop-interval=60s
Restart=always
RestartSec=5s
WatchdogSec=120s
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=/var/log/exultia /var/lib/exultia

[Install]
WantedBy=multi-user.target`
    },
    remediation_loop: {
      label: "Autonomous Remediation Loop",
      file: "/usr/local/bin/exultia-remediate",
      code: `#!/bin/bash
# Exultia 60-Second Autonomous Remediation Sequence
set -euo pipefail

# 1. Audit active listening sockets against offline UVI catalog
echo "[EXULTIA] Auditing active network sockets..."
exultia audit --pre-baked-uvi=/var/lib/exultia/uvi.db

# 2. Engage non-destructive canary probe & sandbox validation
echo "[EXULTIA:canary] Testing exploit viability via HMAC canary handshake..."
echo "[EXULTIA:sandbox] Stress-testing candidate hotpatch against fault safety..."
exultia test --canary --sandbox --timeout=10m

# 3. Apply surgical in-memory patch or sysctl baseline restore
echo "[EXULTIA] Applying verified in-memory trampoline (<350ms)..."
exultia fix --enforce-baseline --atomic-rollback

# 4. Verify health checks and emit audit entry
systemctl is-active --quiet exultia.service && echo "[EXULTIA] Node secured and verified."`
    },
    stix_payload: {
      label: "STIX 2.1 Threat Mitigation",
      file: "stix-mitigation-cve-2024-6387.json",
      code: `{
  "type": "indicator",
  "spec_version": "2.1",
  "id": "indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f",
  "name": "CVE-2024-6387 OpenSSH RegreSSHion Mitigation",
  "pattern": "[process:name = 'sshd' AND network-traffic:dst_port = 22]",
  "pattern_type": "stix",
  "valid_from": "2026-10-27T17:00:00Z",
  "x_exultia_mitigation": {
    "action": "in_memory_trampoline_verify",
    "target_subsystem": "sshd_binary_trampoline",
    "signature": "ed25519:exultia_master_pki_verified"
  }
}`
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(configSnippets[activeConfigTab].code);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "1.5rem 1rem 5rem 1rem" }}>
      
      {/* ── HERO: SELF-HEALING LINUX LEAD ───────────────────────────────────── */}
      <section style={{ textAlign: "center", marginBottom: "4.5rem", paddingTop: "1.5rem" }}>
        

        {/* Flagship Headline */}
        <h1 style={{ 
          fontSize: "clamp(2.8rem, 6.2vw, 4.5rem)", 
          fontWeight: 800, 
          color: "#FFFFFF", 
          letterSpacing: "-0.03em", 
          marginBottom: "0.85rem",
          lineHeight: 1.15
        }}>
          Autonomous &amp; Accessible
          <span style={{ 
            display: "block", 
            color: "var(--accent-primary, #00E5FF)",
            fontWeight: 800
          }}>
            Self-Healing Linux.
          </span>
        </h1>

        {/* Homepage Tagline */}
        <p style={{
          fontSize: "clamp(1.15rem, 2.4vw, 1.55rem)",
          fontWeight: 600,
          color: "var(--accent-primary, #00E5FF)",
          fontFamily: "var(--font-mono, monospace)",
          margin: "0 auto 1.5rem auto",
          letterSpacing: "-0.01em",
          textShadow: "0 0 24px rgba(0, 229, 255, 0.35)",
        }}>
          The duct tape is built right into the code.
        </p>

        {/* Core Value Proposition */}
        <p style={{ 
          color: "#94A3B8", 
          fontSize: "1.15rem", 
          maxWidth: "720px", 
          margin: "0 auto 2.25rem auto", 
          lineHeight: 1.6 
        }}>
          A lightweight daemon that drops onto any Linux machine. Audits listening sockets, restores baselines, and applies zero-downtime in-memory hotpatches every 60 seconds.
        </p>

        {/* Primary Call to Action Buttons */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2.75rem"
        }}>
          <button
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText("curl -sSL https://exultia.tech/install.sh | sudo sh");
                setActiveConfigTab("portable_pipeline");
                const el = document.getElementById("terminal-config-deck");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 26px",
              borderRadius: "10px",
              background: "var(--accent-primary, #00E5FF)",
              color: "#030608",
              fontWeight: 800,
              fontSize: "0.95rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(0, 229, 255, 0.35)",
              transition: "transform 0.15s ease"
            }}
          >
            <Terminal size={18} />
            Install Daemon (curl | sh)
          </button>

          <Link
            href="/products/exultia-linux"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "10px",
              background: "rgba(0, 229, 255, 0.1)",
              border: "1px solid rgba(0, 229, 255, 0.35)",
              color: "#00E5FF",
              fontSize: "0.95rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            <Package size={17} />
            Download Tarball (.tar.gz)
          </Link>

        </div>

        {/* Quick Declarative & Multi-Distro Integration Snippet */}
        <div id="terminal-config-deck" style={{
          maxWidth: "720px",
          margin: "0 auto 2.5rem auto",
          background: "rgba(3, 6, 8, 0.9)",
          border: "1px solid rgba(0, 229, 255, 0.22)",
          borderRadius: "12px",
          textAlign: "left",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            background: "rgba(255, 255, 255, 0.03)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: "0.78rem",
            color: "#94A3B8",
            fontFamily: "var(--font-mono, monospace)"
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Terminal size={14} color="#00E5FF" />
              Exultia System Configuration ({configSnippets[activeConfigTab].label})
            </span>
            <button
              onClick={copyToClipboard}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "transparent",
                border: "none",
                color: copiedSnippet ? "#34D399" : "#7E9EA8",
                cursor: "pointer",
                fontSize: "0.76rem",
                fontFamily: "var(--font-mono, monospace)"
              }}
            >
              {copiedSnippet ? <Check size={13} /> : <Copy size={13} />}
              {copiedSnippet ? "Copied" : "Copy"}
            </button>
          </div>
          <div style={{
            display: "flex",
            overflowX: "auto",
            background: "rgba(0, 0, 0, 0.4)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "2px 8px"
          }}>
            {(["portable_pipeline", "k8s_daemonset", "systemd_service", "exultia_conf", "remediation_loop", "stix_payload"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveConfigTab(key)}
                style={{
                  background: activeConfigTab === key ? "rgba(0, 229, 255, 0.12)" : "transparent",
                  color: activeConfigTab === key ? "#00E5FF" : "#94A3B8",
                  border: "none",
                  borderBottom: activeConfigTab === key ? "2px solid #00E5FF" : "2px solid transparent",
                  padding: "6px 12px",
                  fontSize: "0.76rem",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: activeConfigTab === key ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {configSnippets[key].label}
              </button>
            ))}
          </div>
          <pre style={{
            margin: 0,
            padding: "1rem 1.25rem",
            fontSize: "0.82rem",
            color: "#E2F8FF",
            fontFamily: "var(--font-mono, monospace)",
            lineHeight: 1.5,
            overflowX: "auto"
          }}>
            <code>{configSnippets[activeConfigTab].code}</code>
          </pre>
        </div>
      </section>

      {/* ── 1. HOW THE SOLUTION WORKS: THE AUTONOMOUS DAEMON 4-STAGE LOOP ── */}
      <section id="how-it-works" style={{ marginBottom: "5.5rem", scrollMarginTop: "5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
            HOW IT WORKS
          </h2>
        </div>

        {/* 4 Sequential Steps (Top to Bottom Vertical Pipeline) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "960px", margin: "0 auto" }}>
          
          {/* Stage 1: Detect */}
          <div style={{
            background: "rgba(15, 23, 42, 0.55)",
            border: "1px solid rgba(192, 132, 252, 0.25)",
            borderRadius: "14px",
            padding: "1.5rem 1.75rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1.75rem",
            flexWrap: "wrap"
          }}>
            <div style={{ minWidth: "190px", flexShrink: 0 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.74rem",
                fontFamily: "var(--font-mono, monospace)",
                color: "#C084FC",
                background: "rgba(192, 132, 252, 0.12)",
                border: "1px solid rgba(192, 132, 252, 0.3)",
                padding: "3px 10px",
                borderRadius: "6px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "0.4rem"
              }}>
                Stage 01 &bull; Detection
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem 0" }}>
                Threat Detection
              </h3>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                <code>exultia-vantage-sync.timer</code>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "260px" }}>
              <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.85rem 0" }}>
                Ingests CVE disclosures, CISA KEVs, and vendor advisories across 110+ authoritative feeds in under 60 seconds. Directly correlates affected package binary hashes against active TCP/UDP listening sockets. If a vulnerable library is sitting dormant on disk with zero bound network sockets, we don&apos;t page your on-call engineer at 3:14 AM to panic over a theoretical risk.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.6rem" }}>
                <span>&bull; <strong>Detection Latency:</strong> 110+ feeds synchronized in &lt;60s</span>
                <span>&bull; <strong>Active Correlation:</strong> Targets actual bound sockets (zero frantic grep commands)</span>
                <span>&bull; <strong>Speed Advantage:</strong> Finds exposed workloads weeks before vendor advisories clear your corporate spam filter</span>
              </div>
            </div>
          </div>

          {/* Connector 1 -> 2 */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16px", margin: "-4px 0" }}>
            <div style={{ width: "2px", height: "100%", background: "linear-gradient(180deg, #C084FC 0%, #F87171 100%)", opacity: 0.6 }} />
          </div>

          {/* Stage 2: Validate */}
          <div style={{
            background: "rgba(15, 23, 42, 0.55)",
            border: "1px solid rgba(248, 113, 113, 0.25)",
            borderRadius: "14px",
            padding: "1.5rem 1.75rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1.75rem",
            flexWrap: "wrap"
          }}>
            <div style={{ minWidth: "190px", flexShrink: 0 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.74rem",
                fontFamily: "var(--font-mono, monospace)",
                color: "#F87171",
                background: "rgba(248, 113, 113, 0.12)",
                border: "1px solid rgba(248, 113, 113, 0.3)",
                padding: "3px 10px",
                borderRadius: "6px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "0.4rem"
              }}>
                Stage 02 &bull; Validation
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem 0" }}>
                Exploit Validation
              </h3>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                <code>exultia test --canary --sandbox</code>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "260px" }}>
              <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.85rem 0" }}>
                Before touching live process memory, the daemon spins up an ephemeral 10-minute microVM sandbox mirroring your exact runtime and engages its internal twin validation harnesses: non-destructive cryptographic canary probes that mathematically verify exploit viability without delivering harmful payloads, and hermetic sandbox stress-testing against race conditions. Because nothing ruins a Tuesday quite like an alert scanner declaring a &ldquo;CVSS 10.0 CRITICAL&rdquo; on a disabled test utility nobody has executed since 2019.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.6rem" }}>
                <span>&bull; <strong>Canary Verification:</strong> Non-destructive HMAC handshake canary proves weaponization</span>
                <span>&bull; <strong>Kinetic Sandbox:</strong> In-sandbox validation verifies patch resilience under load</span>
                <span>&bull; <strong>Safety:</strong> Ephemeral microVM with 10m auto-destruct (0 host footprint)</span>
              </div>
            </div>
          </div>

          {/* Connector 2 -> 3 */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16px", margin: "-4px 0" }}>
            <div style={{ width: "2px", height: "100%", background: "linear-gradient(180deg, #F87171 0%, #34D399 100%)", opacity: 0.6 }} />
          </div>

          {/* Stage 3: Fix */}
          <div style={{
            background: "rgba(15, 23, 42, 0.55)",
            border: "1px solid rgba(52, 211, 153, 0.25)",
            borderRadius: "14px",
            padding: "1.5rem 1.75rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1.75rem",
            flexWrap: "wrap"
          }}>
            <div style={{ minWidth: "190px", flexShrink: 0 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.74rem",
                fontFamily: "var(--font-mono, monospace)",
                color: "#34D399",
                background: "rgba(52, 211, 153, 0.12)",
                border: "1px solid rgba(52, 211, 153, 0.3)",
                padding: "3px 10px",
                borderRadius: "6px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "0.4rem"
              }}>
                Stage 03 &bull; Remediation
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem 0" }}>
                In-Memory Hotpatch
              </h3>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                <code>exultia-daemon.service</code>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "260px" }}>
              <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.85rem 0" }}>
                Compiles surgical in-memory trampolines and injects them directly into running process virtual memory in &lt;350ms. Neutralizes the vulnerable branch instantaneously with 0 dropped TCP sockets and zero service restarts—patching the vulnerability and writing cryptographic audit receipts while your CISO is busy negotiating commercial leases to relocate the entire cybersecurity division closer to his house.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.6rem" }}>
                <span>&bull; <strong>Downtime:</strong> 0 dropped TCP connections</span>
                <span>&bull; <strong>Execution:</strong> Applied in &lt;350ms with zero process restarts</span>
                <span>&bull; <strong>Zero Bureaucracy:</strong> Neutralizes vulnerabilities before competitors finish writing status reports</span>
              </div>
            </div>
          </div>

          {/* Connector 3 -> 4 */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16px", margin: "-4px 0" }}>
            <div style={{ width: "2px", height: "100%", background: "linear-gradient(180deg, #34D399 0%, #00E5FF 100%)", opacity: 0.6 }} />
          </div>

          {/* Stage 4: Rollback */}
          <div style={{
            background: "rgba(15, 23, 42, 0.55)",
            border: "1px solid rgba(0, 229, 255, 0.25)",
            borderRadius: "14px",
            padding: "1.5rem 1.75rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1.75rem",
            flexWrap: "wrap"
          }}>
            <div style={{ minWidth: "190px", flexShrink: 0 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.74rem",
                fontFamily: "var(--font-mono, monospace)",
                color: "#00E5FF",
                background: "rgba(0, 229, 255, 0.12)",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                padding: "3px 10px",
                borderRadius: "6px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "0.4rem"
              }}>
                Stage 04 &bull; Rollback
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem 0" }}>
                Deterministic Rollback
              </h3>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                <code>atomic snapshot restore</code>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "260px" }}>
              <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.85rem 0" }}>
                Takes a cryptographic pre-image checkpoint before touching a single byte, arming a 120-second watchdog timer. If post-remediation socket canaries or application health checks fail to acknowledge the watchdog, the daemon unlinks the trampoline and restores baseline state in under 15ms—unlike manual hotfixes, which usually end with a senior systems engineer muttering in Slack: <em>&ldquo;Wait... did anyone save a backup copy of sshd_config?&rdquo;</em>
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.6rem" }}>
                <span>&bull; <strong>Rollback Engine:</strong> Sub-15ms deterministic atomic revert</span>
                <span>&bull; <strong>Watchdog Safety:</strong> Hardware &amp; systemd 120s failsafe auto-revert</span>
                <span>&bull; <strong>Instant Cleanliness:</strong> <code>sudo exultia rollback</code> leaves zero forensic scarring</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── DEVELOPER ECOSYSTEM & SUPPORTING TOOLS ───────────────────────── */}
      <section id="supporting-tools" style={{ marginBottom: "5rem", scrollMarginTop: "5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#60A5FA",
            fontSize: "0.78rem",
            fontFamily: "var(--font-mono, monospace)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem"
          }}>
            <Box size={14} />
            <span>Supporting Tools</span>
          </div>

          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
            Developer Ecosystem &amp; Extended Tooling
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1.05rem", maxWidth: "780px", margin: "0 auto", lineHeight: 1.6 }}>
            Specialized developer tools like Daedelus for secure workstations, distroless containers, and zero-CVE packages, Axiom certification simulators, and Praxis for administrators nursing vintage Unix systems requiring strict POSIX compliance.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Tool 1: Daedelus */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "56px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "2px" }}>
              <DaedelusIcon size={48} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Daedelus</h3>
                  <span style={{ fontSize: "0.72rem", background: "rgba(59, 130, 246, 0.15)", color: "#60A5FA", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                    SECURE IDES, CONTAINERS &amp; PACKAGES
                  </span>
                </div>
                <Link
                  href="/products/daedelus"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#60A5FA",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  Explore Daedelus &rarr;
                </Link>
              </div>

              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.25rem 0" }}>
                Pre-production developer edge security protecting code before it deploys to production Linux servers: air-gapped developer workstations without telemetry, distroless OCI containers, and negative-admission package proxies.
              </p>

              {/* 3 Subcomponents */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#60A5FA", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Code2 size={16} />
                    IDE &bull; Workstations
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Reproducible, telemetry-free developer workstations stripped of unauthorized cloud sync.
                  </p>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(6, 182, 212, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#22D3EE", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Box size={16} />
                    Container &bull; Distroless
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Distroless minimal container images signed with SLSA Level 3 cryptographic provenance.
                  </p>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#34D399", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Package size={16} />
                    Package &bull; Zero-CVE
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Negative-admission proxy rejecting packages with active disclosures from reaching builds.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Workstations:</strong> 100% telemetry-free</span>
                <span><strong>Containers:</strong> Distroless OCI &bull; SLSA L3</span>
                <span><strong>Package Admission:</strong> Zero active CVEs allowed</span>
              </div>
            </div>
          </div>

          {/* Tool 2: Axiom */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(244, 63, 94, 0.2)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "56px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "2px" }}>
              <AxiomIcon size={48} glow={false} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Axiom</h3>
                  <span style={{ fontSize: "0.72rem", background: "rgba(244, 63, 94, 0.15)", color: "#FDA4AF", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                    EXAM SIMULATOR &amp; LMS API
                  </span>
                </div>
                <Link
                  href="/app/axiom"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#FDA4AF",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  Explore Axiom Simulator &rarr;
                </Link>
              </div>

              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.25rem 0" }}>
                Hands-on cybersecurity certification simulator and enterprise training platform. Validates operator competence across 15,000+ technical scenarios with automated SCORM/LTI LMS integration and cryptographically verified skill attestations.
              </p>

              {/* 3 Subcomponents */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FDA4AF", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Award size={16} />
                    Exam &bull; Simulator
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Scenario-based practice banks for CISSP, Security+, CEH, CISM, and cloud security certifications.
                  </p>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(251, 113, 133, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FB7185", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <BookOpen size={16} />
                    LMS &bull; SCORM &amp; LTI
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Direct plug-and-play integration into enterprise learning systems (Canvas, Moodle, Blackboard) via LTI 1.3.
                  </p>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F43F5E", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={16} />
                    Proof &bull; Attestation
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Tamper-proof completion transcripts and cryptographically verifiable operator readiness scorecards.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Question Bank:</strong> 15,000+ technical questions</span>
                <span><strong>LMS Protocols:</strong> SCORM 1.2/2004 &amp; LTI 1.3</span>
                <span><strong>Certification:</strong> Cryptographic proof ledger</span>
              </div>
            </div>
          </div>

          {/* Tool 3: Praxis */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "56px 1fr",
            gap: "1.5rem",
            alignItems: "flex-start"
          }}>
            <div style={{ flexShrink: 0, marginTop: "2px" }}>
              <PraxisIcon size={48} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Praxis</h3>
                  <span style={{ fontSize: "0.72rem", background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                    LEGACY UNIX &bull; TOTAL POSIX COMPLIANCE
                  </span>
                </div>
                <Link
                  href="/app/praxis"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#FBBF24",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  Launch Praxis Hardening &rarr;
                </Link>
              </div>

              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.25rem 0" }}>
                The ultra-portable remediation solution for admins running vintage Unix architectures and environments requiring strict POSIX.1 compliance (IBM AIX, HP-UX, Oracle Solaris, older BSDs, and minimal embedded targets). If you happen to still be running the same Unix system that managed Jurassic Park in 1993, we&apos;ve got you covered.
              </p>

              {/* 3 Subcomponents */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FBBF24", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Terminal size={16} />
                    Pure Shell &bull; POSIX.1
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Zero-dependency `/bin/sh` scripts compatible with vintage KornShell (ksh88/93) and legacy runtimes without glibc or Python.
                  </p>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FBBF24", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Server size={16} />
                    Network &bull; Hardware ACLs
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Compiles production blocklists for Cisco IOS, Palo Alto EDL, Fortinet, and Juniper edge firewalls without touching host OS.
                  </p>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FBBF24", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <RotateCcw size={16} />
                    Safe Rollback &bull; Pre-Image
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.45, margin: 0 }}>
                    Deterministic file pre-imaging snapshots with instant rollback if legacy daemons fail integrity checks.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
                <span><strong>Compatibility:</strong> POSIX.1-2008 &bull; AIX, HP-UX, Solaris, BSD, Linux</span>
                <span><strong>Jurassic Park Certified:</strong> &ldquo;It&apos;s a UNIX system! I know this!&rdquo;</span>
                <span><strong>Dependencies:</strong> Zero &bull; Pure /bin/sh or static binary</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. SOVEREIGNTY & GETTING STARTED ─────────────────────────────────── */}
      <section style={{ 
        textAlign: "center", 
        borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
        paddingTop: "3.5rem",
        background: "linear-gradient(180deg, transparent 0%, rgba(0, 229, 255, 0.02) 100%)",
        borderRadius: "16px",
        paddingBottom: "1.5rem"
      }}>
        <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
          Built for True Technical Sovereignty
        </h3>
        <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "680px", margin: "0 auto 2.25rem auto", lineHeight: 1.65 }}>
          High-consequence infrastructure must remain transparent, deterministic, and verifiable. 
          The Exultia daemon Community Edition is free forever, engineered to defend workloads on any Linux distribution without vendor lock-in or proprietary traps.
        </p>

        <div style={{ display: "inline-flex", gap: "1.75rem", color: "#64748B", fontSize: "0.85rem", fontFamily: "var(--font-mono, monospace)", flexWrap: "wrap", justifyContent: "center" }}>
          <span>No Telemetry</span>
          <span>&bull;</span>
          <span>No Vendor Lock-In</span>
          <span>&bull;</span>
          <span>Deterministic Reproducible Builds</span>
          <span>&bull;</span>
          <span>Deterministic Atomic Rollback</span>
        </div>
      </section>

    </div>
  );
}
