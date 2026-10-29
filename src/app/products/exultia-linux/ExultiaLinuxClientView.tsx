"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Server, 
  Zap, 
  Lock, 
  Clock,
  ArrowRight,
  Activity,
  FileText,
  Radio,
  HardDrive,
  AlertTriangle,
  Box
} from "lucide-react";

export default function ExultiaLinuxClientView() {
  const [deployFormat, setDeployFormat] = useState<"portable" | "k8s" | "packages" | "container">("portable");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"status" | "taxii" | "config" | "journal">("status");

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const EXULTIA_DOWNLOADS = {
    portable: {
      fileName: "exultia-linux.tar.gz",
      fileSize: "4.67 MB",
      sha256: "91a029290c863de749cf95612b405a4d42d1aa4ff79b46b8df2a14df30090654",
      targetPlatforms: "Linux (x86_64, aarch64)",
      curlCmd: "curl -sSL https://exultia.tech/install.sh | sudo sh",
      manualCmd: "wget https://exultia.tech/releases/exultia-linux.tar.gz \\\n  && tar -xzf exultia-linux.tar.gz \\\n  && cd exultia-linux && sudo ./install.sh",
      downloadUrl: "/releases/exultia-linux.tar.gz"
    },
    k8s: {
      chartName: "exultia/exultia-node-shield",
      targetPlatforms: "Kubernetes 1.26+ (EKS, GKE, AKS, Talos, k3s, RKE2)",
      helmCmd: "helm repo add exultia https://charts.exultia.org\nhelm repo update\nhelm install exultia-remediator exultia/exultia-node-shield \\\n  --namespace exultia-system --create-namespace \\\n  --set hostPid=true --set securityContext.privileged=true",
      kubectlCmd: "kubectl apply -f https://exultia.tech/k8s/exultia-daemonset.yaml",
      manifestUrl: "https://exultia.tech/k8s/exultia-daemonset.yaml"
    },
    packages: {
      managerName: "Linux Native Packages & systemd",
      cmdLabel: "Linux Exultia systemd Service & UVI Engine",
      debCmd: "curl -fsSL https://pkg.exultia.org/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/exultia.gpg\necho \"deb [signed-by=/etc/apt/keyrings/exultia.gpg] https://pkg.exultia.org/deb stable main\" | sudo tee /etc/apt/sources.list.d/exultia.list\nsudo apt update && sudo apt install -y exultia-remediator",
      rpmCmd: "sudo dnf config-manager --add-repo https://pkg.exultia.org/rpm/exultia.repo\nsudo dnf install -y exultia-remediator",
      code: `# 1. Install signed Exultia binary to /usr/local/bin\ncurl -sSL https://exultia.tech/install.sh | sudo sh\n\n# 2. Configure /etc/exultia/exultia.conf for dual STIX/TAXII channels\ncat << 'EOF' | sudo tee /etc/exultia/exultia.conf\n[vantage_upstream]\nurl = "https://taxii.exultia.org/taxii2/exultia-feed"\nauth_token = "exultia_pki_verified"\npoll_interval = "60s"\nauto_safety_snapshot = true\n\n[corporate_local]\nurl = "https://siem.internal.corp/taxii2/indicators"\nnamespace_uuid = "client-local-550e8400-e29b-41d4-a716-446655440000"\nallow_livepatch = false\nallow_network_filter = true\nEOF\n\n# 3. Enable and start systemd background remediation service\nsudo systemctl daemon-reload\nsudo systemctl enable --now exultia.service`
    },
    container: {
      imageName: "registry.exultia.tech/exultia/remediator:latest",
      imageSize: "18.4 MB (Compressed OCI)",
      targetPlatforms: "Docker, Podman, containerd, CRI-O (Linux amd64/arm64)",
      dockerCmd: "docker run -d --name exultia-remediator \\\n  --restart=always \\\n  --net=host \\\n  --pid=host \\\n  --cap-add=SYS_PTRACE \\\n  --cap-add=NET_ADMIN \\\n  -v /etc/exultia:/etc/exultia:ro \\\n  -v /var/log/exultia:/var/log/exultia \\\n  registry.exultia.tech/exultia/remediator:latest",
      podmanCmd: "podman run -d --name exultia-remediator \\\n  --restart=always \\\n  --net=host \\\n  --pid=host \\\n  --cap-add=SYS_PTRACE \\\n  --cap-add=NET_ADMIN \\\n  -v /etc/exultia:/etc/exultia:ro,Z \\\n  -v /var/log/exultia:/var/log/exultia:Z \\\n  registry.exultia.tech/exultia/remediator:latest",
      pullCmd: "docker pull registry.exultia.tech/exultia/remediator:latest"
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
      {/* ── SECTION 1: ARCHITECTURE SPECIFICATION (4 PILLARS) ─────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 229, 255, 0.12)", border: "1px solid rgba(0, 229, 255, 0.35)", padding: "3px 12px", borderRadius: "999px", marginBottom: "0.5rem" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00E5FF" }} />
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.74rem", fontWeight: 700, color: "#67E8F9", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Portable Autonomous Remediator Daemon • Built for Linux
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
            The Portable Exultia Daemon: Autonomous Remediation for Linux
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.9rem", maxWidth: "800px", margin: "0 auto" }}>
            Don&apos;t wipe your servers or migrate distributions. The portable Exultia daemon runs non-invasively directly on your existing Linux systems, providing 60-second autonomous threat remediation with zero downtime.
          </p>
        </div>

        {/* 4 Architecture Specification Panels (Stacked Vertically) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          
          {/* Specification 1: System Foundation & Linux Daemon Runtime */}
          <div className="glass-card" style={{ 
            padding: "1.1rem 1.4rem", 
            borderRadius: "14px", 
            border: "1px solid rgba(0, 229, 255, 0.3)", 
            display: "flex", 
            flexDirection: "column",
            gap: "0.75rem",
            background: "rgba(15, 23, 42, 0.75)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", borderRadius: "8px", background: "rgba(0, 229, 255, 0.15)", color: "#00E5FF" }}>
                  <HardDrive size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    1. System Foundation &amp; Linux Daemon Runtime
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    Native Linux Architecture • Statically Linked Binary • systemd Service
                  </span>
                </div>
              </div>
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#00E5FF", background: "rgba(0, 229, 255, 0.15)", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                Runs on Any Distro • Zero OS Re-Imaging
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginTop: "4px" }}>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Lightweight Daemon Architecture:</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Statically linked binary (/usr/local/bin/exultia) runs as a resident systemd unit or background daemon with minimal footprint (&lt;15MB RAM). Non-invasive socket and syscall visibility via standard Linux kernel APIs and eBPF.
                </p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Universal Distro Compatibility:</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Installs directly on top of your existing Linux distribution—Ubuntu, Debian, RHEL, Rocky, Alma, Alpine, Arch, SUSE, Amazon Linux—without OS re-imaging, disk repartitioning, or kernel recompilation. Your production systems stay live.
                </p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Daemon Sandboxing &amp; Protection:</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Protected by Linux namespaces, cgroups, and hardened systemd service sandboxing (<code style={{ color: "#67E8F9" }}>ProtectSystem=strict</code>, private temporary filesystems, and unprivileged process boundaries). Never replaces base distribution binaries.
                </p>
              </div>
            </div>
          </div>

          {/* Specification 2: Threat Intelligence Standard (STIX/TAXII) */}
          <div className="glass-card" style={{ 
            padding: "1.1rem 1.4rem", 
            borderRadius: "14px", 
            border: "1px solid rgba(6, 182, 212, 0.3)", 
            display: "flex", 
            flexDirection: "column",
            gap: "0.75rem",
            background: "rgba(15, 23, 42, 0.75)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", color: "#22D3EE" }}>
                  <Radio size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    2. Threat Intelligence Standard (STIX 2.1 / TAXII 2.1)
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    CISA &amp; FS-ISAC Standardized IoCs • RESTful Transport • Dual-Channel Subscription
                  </span>
                </div>
              </div>
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#22D3EE", background: "rgba(6, 182, 212, 0.15)", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                STIX 2.1 JSON Format
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginTop: "4px" }}>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Standardized Language:</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Standardizes on STIX 2.1 JSON specifications utilized by CISA, US-CERT, and FS-ISAC to represent threat actors, indicators of compromise (IoCs), and automated mitigation rules.
                </p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22D3EE" }}>Channel 1: Vantage Upstream (Primary):</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Authenticated HTTPS feed delivering autonomous threat definitions, zero-day remediation trampolines, and global threat intelligence directly from Exultia Technologies.
                </p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#60A5FA" }}>Channel 2: Corporate Local (Supplemental):</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  A local TAXII endpoint configured by corporate security teams to ingest internal SIEM alerts, industry-specific IoCs, and custom firewall blacklists without third-party dependencies.
                </p>
              </div>
            </div>
          </div>

          {/* Specification 3: Self-Healing & Remediation Pipeline */}
          <div className="glass-card" style={{ 
            padding: "1.1rem 1.4rem", 
            borderRadius: "14px", 
            border: "1px solid rgba(16, 185, 129, 0.3)", 
            display: "flex", 
            flexDirection: "column",
            gap: "0.75rem",
            background: "rgba(15, 23, 42, 0.75)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", color: "#34D399" }}>
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    3. The Self-Healing &amp; Remediation Pipeline
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    Continuous 60s Loop • In-Memory Trampolines • Fail-Safe Rollback Checkpoints
                  </span>
                </div>
              </div>
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#34D399", background: "rgba(16, 185, 129, 0.15)", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                Zero-Downtime Livepatching
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginTop: "4px" }}>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Phase 1: Socket &amp; Vulnerability Detection</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Cryptographic signatures and CVE records are verified against the offline 24,388 UVI database. The daemon inspects active network sockets across the host to verify if vulnerable components are listening.
                </p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Phase 2: Atomic State Snapshot &amp; Sandbox Probe</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Records an atomic rollback snapshot of process memory and configuration baselines in <code style={{ color: "#34D399" }}>/var/lib/exultia/snapshots</code>. Pre-validates the livepatch in an isolated process sandbox.
                </p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Phase 3: In-Memory Trampoline &amp; Watchdog</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Injects surgical in-memory function redirects with 0 dropped TCP sockets and zero process restarts. Continuous 120-second watchdog verifies socket responsiveness and rolls back automatically if health checks fail.
                </p>
              </div>
            </div>
          </div>

          {/* Specification 4: Corporate Integration & Access Control */}
          <div className="glass-card" style={{ 
            padding: "1.1rem 1.4rem", 
            borderRadius: "14px", 
            border: "1px solid rgba(168, 85, 247, 0.3)", 
            display: "flex", 
            flexDirection: "column",
            gap: "0.75rem",
            background: "rgba(15, 23, 42, 0.75)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", borderRadius: "8px", background: "rgba(168, 85, 247, 0.15)", color: "#C084FC" }}>
                  <Lock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    4. Corporate Integration &amp; Access Control
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    Rule Namespacing • System Stability Override • Immutable System Boundaries
                  </span>
                </div>
              </div>
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#C084FC", background: "rgba(168, 85, 247, 0.15)", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                UUID Namespaced
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginTop: "4px" }}>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Rule Namespacing:</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  All STIX objects ingested from the corporate TAXII feed are strictly tagged with a client-local UUID, preventing accidental collision with upstream global signatures.
                </p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>System Stability Override:</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  If a client rule inadvertently blocks essential infrastructure (e.g., blacklisting the Vantage server IP), Exultia triggers a Stability Override, logs an audit alert, and maintains system integrity.
                </p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E2E8F0" }}>Immutable System Boundaries:</span>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                  Corporate feeds are restricted to packet filters (nftables/iptables), application blacklists, and user-space service controls. Only Exultia-signed cryptographic payloads can inject in-memory livepatches, modify restricted sysctl parameters, or load eBPF socket probes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: INTERACTIVE LINUX TELEMETRY & REMEDIATION CONSOLE ───────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
            Live Exultia Daemon Console &amp; Remediation State
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", maxWidth: "680px", margin: "0 auto" }}>
            Inspect active daemon health, dual-channel TAXII polling, /etc/exultia/exultia.conf baselines, and journalctl -u exultia remediation logs.
          </p>
        </div>

        <div style={{
          background: "#090D16",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)"
        }}>
          {/* Console Header Tabs */}
          <div style={{
            display: "flex",
            background: "rgba(0, 0, 0, 0.5)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "4px 8px",
            overflowX: "auto"
          }}>
            {[
              { id: "status", label: "exultia status", icon: HardDrive },
              { id: "taxii", label: "exultia feed --status", icon: Radio },
              { id: "config", label: "/etc/exultia/exultia.conf", icon: FileText },
              { id: "journal", label: "journalctl -u exultia", icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeConsoleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveConsoleTab(tab.id as any)}
                  style={{
                    background: isActive ? "rgba(0, 229, 255, 0.15)" : "transparent",
                    color: isActive ? "#00E5FF" : "#94A3B8",
                    border: "none",
                    borderBottom: isActive ? "2px solid #00E5FF" : "2px solid transparent",
                    padding: "8px 14px",
                    fontSize: "0.78rem",
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap"
                  }}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Console Code View */}
          <div style={{ padding: "1.25rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", color: "#E2E8F0", lineHeight: 1.6, overflowX: "auto" }}>
            {activeConsoleTab === "status" && (
              <pre style={{ margin: 0 }}>
{`root@linux-srv01:~ # exultia status
[DAEMON] Exultia Autonomous Threat Remediator Daemon v2.4.0 (Linux x86_64)
[STATUS] Active (Running) • systemd: exultia.service • PID: 1482
[HOST]   Ubuntu 24.04 LTS (Kernel 6.8.0-45-generic) • Memory: 11.2 MB / 0.1% CPU
[LOOP]   Next scheduled scan in: 18s (60s loop interval)
[CATALOG] Pre-baked UVI Database: 24,388 advisories • CISA KEV: 12,993 CVEs (Offline)
[SOCKETS] Audited: 42 open ports • In-memory trampolines active: 1 (CVE-2024-6387)
[SNAPSHOT] Active rollback checkpoint: /var/lib/exultia/snapshots/baseline-20261027`}
              </pre>
            )}

            {activeConsoleTab === "taxii" && (
              <pre style={{ margin: 0 }}>
{`root@linux-srv01:~ # /usr/local/bin/exultia feed --status
[INFO] Exultia Threat Intelligence Ingest v2.4.0 (Linux x86_64)
[POLL] Channel 1: Vantage Upstream (https://taxii.exultia.org/taxii2/feed)
       -> Last Poll: 12 seconds ago | Status: 200 OK | Authenticated: Ed25519 Exultia PKI
       -> Ingested: STIX 2.1 Object 'indicator--cve-2024-6387' (OpenSSH Livepatch)
[POLL] Channel 2: Corporate Local (https://siem.internal.corp/taxii2/indicators)
       -> Last Poll: 35 seconds ago | Status: 200 OK | Namespace: client-local-550e8400
       -> Ingested: STIX 2.1 Object 'indicator--corp-blocklist-2026' (nftables egress ban)
[SYS]  Stability Override: ACTIVE (0 conflicting rules detected)`}
              </pre>
            )}

            {activeConsoleTab === "config" && (
              <pre style={{ margin: 0 }}>
{`# /etc/exultia/exultia.conf - Exultia Autonomous Remediator Daemon Configuration
# Resident background service running alongside host applications
[daemon]
loop_interval = "60s"
max_cpu_percent = 2
log_level = "info"
safety_rollback = true

# Host Kernel Hardening & Sysctl Baselines
[sysctl_enforcement]
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 1
fs.protected_regular = 2
fs.protected_fifos = 2
kernel.kptr_restrict = 2

# STIX 2.1 / TAXII Ingestion
[taxii_upstream]
url = "https://taxii.exultia.org/taxii2/feed"
auth_token = "exultia_pki_verified"
auto_remediate = true`}
              </pre>
            )}

            {activeConsoleTab === "journal" && (
              <pre style={{ margin: 0 }}>
{`root@linux-srv01:~ # journalctl -u exultia.service -n 8 --no-pager
Oct 28 05:30:00 linux-srv01 exultia[1482]: [AUDIT] Starting 60-second autonomous compliance audit...
Oct 28 05:30:01 linux-srv01 exultia[1482]: [AUDIT] Checked 42 listening sockets against 24,388 UVI advisories.
Oct 28 05:30:01 linux-srv01 exultia[1482]: [WARN] Socket :22 running vulnerable OpenSSH <9.8p1 (CVE-2024-6387).
Oct 28 05:30:01 linux-srv01 exultia[1482]: [ACTION] Applying in-memory trampoline signal handler (zero dropped sockets).
Oct 28 05:30:02 linux-srv01 exultia[1482]: [VERIFY] Process sandbox health probe returned 200 OK.
Oct 28 05:30:02 linux-srv01 exultia[1482]: [SUCCESS] Remediation complete in 1.4s. Audit logged to /var/log/exultia/audit.log.`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: DOWNLOAD & DEPLOY THE PORTABLE DAEMON ─────────────────── */}
      <section id="deployment-options" style={{ marginBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 229, 255, 0.12)", border: "1px solid rgba(0, 229, 255, 0.35)", padding: "3px 12px", borderRadius: "999px", marginBottom: "0.5rem" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00E5FF" }} />
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.74rem", fontWeight: 700, color: "#67E8F9", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Universal Linux Daemon &bull; Multi-Architecture Support
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
            Deploy the Portable Exultia Daemon
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem", maxWidth: "700px", margin: "0 auto" }}>
            Zero license fees. Zero node locks. Deploy the portable Exultia daemon directly onto your existing Linux infrastructure via standalone binary, systemd, Kubernetes DaemonSet, native packages, or OCI container.
          </p>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "14px", overflow: "hidden" }}>
          
          {/* Format Switcher Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(10, 16, 30, 0.7)", overflowX: "auto" }}>
            <button
              onClick={() => setDeployFormat("portable")}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                background: deployFormat === "portable" ? "rgba(0, 229, 255, 0.15)" : "transparent",
                color: deployFormat === "portable" ? "#00E5FF" : "#94A3B8",
                border: "none",
                borderBottom: deployFormat === "portable" ? "2px solid #00E5FF" : "2px solid transparent",
                fontWeight: 700,
                fontSize: "0.84rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
            >
              <Terminal size={16} /> Tier 1: Portable Linux Daemon &amp; systemd
            </button>
            <button
              onClick={() => setDeployFormat("k8s")}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                background: deployFormat === "k8s" ? "rgba(0, 229, 255, 0.15)" : "transparent",
                color: deployFormat === "k8s" ? "#00E5FF" : "#94A3B8",
                border: "none",
                borderBottom: deployFormat === "k8s" ? "2px solid #00E5FF" : "2px solid transparent",
                fontWeight: 700,
                fontSize: "0.84rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
            >
              <Layers size={16} /> Tier 2: Kubernetes DaemonSet &amp; Helm
            </button>
            <button
              onClick={() => setDeployFormat("packages")}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                background: deployFormat === "packages" ? "rgba(245, 158, 11, 0.15)" : "transparent",
                color: deployFormat === "packages" ? "#FBBF24" : "#94A3B8",
                border: "none",
                borderBottom: deployFormat === "packages" ? "2px solid #FBBF24" : "2px solid transparent",
                fontWeight: 700,
                fontSize: "0.84rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
            >
              <Server size={16} /> Native Packages (APT / DNF / APK)
            </button>
            <button
              onClick={() => setDeployFormat("container")}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                background: deployFormat === "container" ? "rgba(0, 229, 255, 0.15)" : "transparent",
                color: deployFormat === "container" ? "#00E5FF" : "#94A3B8",
                border: "none",
                borderBottom: deployFormat === "container" ? "2px solid #00E5FF" : "2px solid transparent",
                fontWeight: 700,
                fontSize: "0.84rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
            >
              <Box size={16} /> Tier 4: Container Daemon (Docker / Podman)
            </button>
          </div>

          {/* Deployment Tab Content */}
          <div style={{ padding: "1.25rem" }}>
            {deployFormat === "portable" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                        Exultia Portable Linux Remediator ({EXULTIA_DOWNLOADS.portable.fileSize})
                      </h3>
                      <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#00E5FF", background: "rgba(0, 229, 255, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 700 }}>
                        Tier 1 Core • Single Binary + systemd
                      </span>
                    </div>
                    <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0 }}>
                      Compatible with {EXULTIA_DOWNLOADS.portable.targetPlatforms}. Installs self-healing daemon and pre-baked offline catalog to any existing machine in 60 seconds.
                    </p>
                  </div>
                  <a
                    href={EXULTIA_DOWNLOADS.portable.downloadUrl}
                    className="btn-primary"
                    style={{
                      padding: "0.6rem 1.25rem",
                      fontSize: "0.85rem",
                      background: "linear-gradient(135deg, #00E5FF 0%, #007799 100%)",
                      color: "#030712",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "8px",
                      fontWeight: 800
                    }}
                  >
                    <Download size={15} /> Download Archive ({EXULTIA_DOWNLOADS.portable.fileSize})
                  </a>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px", marginBottom: "1rem" }}>
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>SHA-256 Checksum</span>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#CBD5E1", wordBreak: "break-all", marginTop: "2px" }}>
                      {EXULTIA_DOWNLOADS.portable.sha256}
                    </div>
                  </div>
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Pre-Loaded Offline Catalog</span>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#34D399", marginTop: "2px" }}>
                      24,388 UVI Advisories + 12,993 CISA KEV Records (100% Air-Gapped)
                    </div>
                  </div>
                </div>

                {/* Curl one-liner command */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                      One-Command Universal Remote Install:
                    </span>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.portable.curlCmd, "curl-portable")}
                      style={{ background: "transparent", border: "none", color: copiedKey === "curl-portable" ? "#34D399" : "#00E5FF", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                    >
                      {copiedKey === "curl-portable" ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === "curl-portable" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: "12px 14px",
                    background: "#030712",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 229, 255, 0.25)",
                    color: "#00E5FF",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.82rem",
                    overflowX: "auto"
                  }}>
                    {EXULTIA_DOWNLOADS.portable.curlCmd}
                  </pre>
                </div>

                {/* Air-gapped manual extraction */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                      Air-Gapped Tarball Manual Extraction:
                    </span>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.portable.manualCmd, "manual-portable")}
                      style={{ background: "transparent", border: "none", color: copiedKey === "manual-portable" ? "#34D399" : "#FBBF24", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                    >
                      {copiedKey === "manual-portable" ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === "manual-portable" ? "Copied" : "Copy Commands"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: "12px 14px",
                    background: "#030712",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#FDE68A",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.8rem",
                    overflowX: "auto"
                  }}>
                    {EXULTIA_DOWNLOADS.portable.manualCmd}
                  </pre>
                </div>

                {/* Satirical CISO Warning */}
                <div style={{
                  marginTop: "1.25rem",
                  background: "rgba(239, 68, 68, 0.05)",
                  border: "1px dashed rgba(239, 68, 68, 0.3)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#F87171", textTransform: "uppercase", fontFamily: "var(--font-mono, monospace)", marginBottom: "3px" }}>
                      Executive Warning for Enterprise CISOs
                    </div>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.5 }}>
                      Deploying this 60-second autonomous remediation daemon on your servers may leave your 40-person alert-triage team with zero Jira tickets to forward to developers. If your CISO just spent a zillion dollars moving all of your cyber analysts to an office down the street from his house, please run this daemon in stealth mode.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {deployFormat === "k8s" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                        Exultia Kubernetes Node DaemonSet &amp; Helm Chart
                      </h3>
                      <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#00E5FF", background: "rgba(0, 229, 255, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 700 }}>
                        Tier 2 Cluster Defense • EKS / GKE / AKS / Talos
                      </span>
                    </div>
                    <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0 }}>
                      Deploy autonomous node-level threat detection, host socket auditing, and in-memory livepatching across all worker nodes in your cluster.
                    </p>
                  </div>
                  <a
                    href={EXULTIA_DOWNLOADS.k8s.manifestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      padding: "0.6rem 1.25rem",
                      fontSize: "0.85rem",
                      background: "linear-gradient(135deg, #00E5FF 0%, #007799 100%)",
                      color: "#030712",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "8px",
                      fontWeight: 800
                    }}
                  >
                    <Download size={15} /> View Raw Manifest (YAML)
                  </a>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px", marginBottom: "1rem" }}>
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Helm Repository</span>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#00E5FF", marginTop: "2px" }}>
                      https://charts.exultia.org
                    </div>
                  </div>
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Telemetry Export</span>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#34D399", marginTop: "2px" }}>
                      Prometheus Metrics (:9100/metrics) + OTEL
                    </div>
                  </div>
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Rollback Mechanism</span>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#CBD5E1", marginTop: "2px" }}>
                      Automated Pod &amp; Node Canary Checkpoints
                    </div>
                  </div>
                </div>

                {/* Helm Install Command */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                      Deploy with Helm 3:
                    </span>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.k8s.helmCmd, "helm-k8s")}
                      style={{ background: "transparent", border: "none", color: copiedKey === "helm-k8s" ? "#34D399" : "#00E5FF", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                    >
                      {copiedKey === "helm-k8s" ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === "helm-k8s" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: "12px 14px",
                    background: "#030712",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 229, 255, 0.25)",
                    color: "#00E5FF",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.82rem",
                    overflowX: "auto"
                  }}>
                    {EXULTIA_DOWNLOADS.k8s.helmCmd}
                  </pre>
                </div>

                {/* Kubectl Manifest Command */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                      Or Apply Raw Kubernetes DaemonSet:
                    </span>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.k8s.kubectlCmd, "kubectl-k8s")}
                      style={{ background: "transparent", border: "none", color: copiedKey === "kubectl-k8s" ? "#34D399" : "#FBBF24", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                    >
                      {copiedKey === "kubectl-k8s" ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === "kubectl-k8s" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: "12px 14px",
                    background: "#030712",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#FDE68A",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.8rem",
                    overflowX: "auto"
                  }}>
                    {EXULTIA_DOWNLOADS.k8s.kubectlCmd}
                  </pre>
                </div>
              </div>
            )}

            {deployFormat === "packages" && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                      Native Linux Package Repositories (APT &amp; DNF)
                    </h3>
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#00E5FF", background: "rgba(0, 229, 255, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 700 }}>
                      deb &bull; rpm &bull; apk
                    </span>
                  </div>
                  <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0 }}>
                    Install Exultia using your standard distribution package manager with signed cryptographic repository keys.
                  </p>
                </div>

                {/* Debian/Ubuntu APT */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                      Debian / Ubuntu (APT):
                    </span>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.packages.debCmd, "apt-pkg")}
                      style={{ background: "transparent", border: "none", color: copiedKey === "apt-pkg" ? "#34D399" : "#00E5FF", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                    >
                      {copiedKey === "apt-pkg" ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === "apt-pkg" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: "12px 14px",
                    background: "#030712",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 229, 255, 0.25)",
                    color: "#00E5FF",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.8rem",
                    overflowX: "auto"
                  }}>
                    {EXULTIA_DOWNLOADS.packages.debCmd}
                  </pre>
                </div>

                {/* RHEL/Rocky DNF */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                      RHEL / Rocky / Alma / Fedora (DNF):
                    </span>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.packages.rpmCmd, "dnf-pkg")}
                      style={{ background: "transparent", border: "none", color: copiedKey === "dnf-pkg" ? "#34D399" : "#FBBF24", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                    >
                      {copiedKey === "dnf-pkg" ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === "dnf-pkg" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: "12px 14px",
                    background: "#030712",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#FDE68A",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.8rem",
                    overflowX: "auto"
                  }}>
                    {EXULTIA_DOWNLOADS.packages.rpmCmd}
                  </pre>
                </div>
              </div>
            )}

            {deployFormat === "container" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                        Containerized Exultia Daemon (Docker &amp; Podman)
                      </h3>
                      <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#00E5FF", background: "rgba(0, 229, 255, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 700 }}>
                        Tier 4 OCI • 18.4 MB Statically Linked Image
                      </span>
                    </div>
                    <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0 }}>
                      Run the autonomous threat remediation daemon as a container on any Docker, Podman, or containerd host with host socket and process visibility.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.container.pullCmd, "docker-pull")}
                      className="btn-primary"
                      style={{
                        padding: "0.6rem 1rem",
                        fontSize: "0.82rem",
                        background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
                        color: "#FFFFFF",
                        border: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        borderRadius: "8px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {copiedKey === "docker-pull" ? <Check size={14} /> : <Copy size={14} />}
                      {copiedKey === "docker-pull" ? "Copied Pull Cmd" : "Copy Pull Command"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px", marginBottom: "1rem" }}>
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Container Image</span>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#00E5FF", marginTop: "2px" }}>
                      {EXULTIA_DOWNLOADS.container.imageName}
                    </div>
                  </div>
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Footprint</span>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#34D399", marginTop: "2px" }}>
                      {EXULTIA_DOWNLOADS.container.imageSize}
                    </div>
                  </div>
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Host Visibility Flags</span>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#CBD5E1", marginTop: "2px" }}>
                      --net=host --pid=host (Full Host Audit)
                    </div>
                  </div>
                </div>

                {/* Docker Run Command */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                      Docker Launch Command:
                    </span>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.container.dockerCmd, "docker-run")}
                      style={{ background: "transparent", border: "none", color: copiedKey === "docker-run" ? "#34D399" : "#00E5FF", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                    >
                      {copiedKey === "docker-run" ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === "docker-run" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: "12px 14px",
                    background: "#030712",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 229, 255, 0.25)",
                    color: "#00E5FF",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.8rem",
                    overflowX: "auto"
                  }}>
                    {EXULTIA_DOWNLOADS.container.dockerCmd}
                  </pre>
                </div>

                {/* Podman Run Command */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                      Podman (SELinux / Rootless) Command:
                    </span>
                    <button
                      onClick={() => copyToClipboard(EXULTIA_DOWNLOADS.container.podmanCmd, "podman-run")}
                      style={{ background: "transparent", border: "none", color: copiedKey === "podman-run" ? "#34D399" : "#FBBF24", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                    >
                      {copiedKey === "podman-run" ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === "podman-run" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: "12px 14px",
                    background: "#030712",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#FDE68A",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.8rem",
                    overflowX: "auto"
                  }}>
                    {EXULTIA_DOWNLOADS.container.podmanCmd}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
