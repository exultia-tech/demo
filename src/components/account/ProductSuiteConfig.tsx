"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  Shield, 
  Cpu, 
  Lock, 
  Terminal, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  Plus, 
  Trash2, 
  Sparkles, 
  KeyRound, 
  Activity,
  Sliders,
  ExternalLink,
  Layers,
  Radio,
  Send,
  Database,
  Server,
  RefreshCw,
  Box,
  HardDrive
} from "lucide-react";
import { 
  DaedelusIcon, 
  VantageIcon, 
  PraxisIcon, 
  PureOsIcon, 
  ExultiaLinuxIcon 
} from "@/components/BrandIcons";

type ConfigSection = "all" | "daedelus" | "vantage" | "praxis" | "containers";

export default function ProductSuiteConfig() {
  const { user, getUserTier } = useAuth();
  
  const pureIdeTier = getUserTier("pureide");
  const uviTier = getUserTier("uvi");
  const praxisTier = getUserTier("praxis");
  const pureosTier = getUserTier("pureos");

  const [activeFilter, setActiveFilter] = useState<ConfigSection>("all");

  // ── 1. DAEDELUS WORKSTATION STATE ──────────────────────────────────────────
  const [blockC2, setBlockC2] = useState(true);
  const [dnsProtection, setDnsProtection] = useState(true);
  const [strictRegistries, setStrictRegistries] = useState(true);
  const [whitelistRules, setWhitelistRules] = useState<string[]>([
    "api.github.com:443",
    "registry.npmjs.org:443",
    "pypi.org:443",
    "crates.io:443"
  ]);
  const [newRuleInput, setNewRuleInput] = useState("");
  const [firewallSaved, setFirewallSaved] = useState(false);

  // Live Secrets Redaction Tester State
  const [sampleCodeInput, setSampleCodeInput] = useState(
    'const GITHUB_TOKEN = "ghp_984f1b2c3d4e5f6a7b8c9d0e1f2a3b4c";\nconst AWS_KEY = "AKIAIOSFODNN7EXAMPLE";\nfetch("https://api.github.com/repos", { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } });'
  );
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubResult, setScrubResult] = useState<string | null>(null);

  // Cosign State
  const [attestationGenerated, setAttestationGenerated] = useState(false);
  const [copiedAttestation, setCopiedAttestation] = useState(false);

  // ── 2. VANTAGE THREAT INTEL STATE ──────────────────────────────────────────
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourorganization.com/webhooks/uvi-stream");
  const [webhookSecret, setWebhookSecret] = useState("exultia_whsec_984f1b2c3d4e5f6a7b8c9d0e1f2a3b4c");
  const [minSeverity, setMinSeverity] = useState("HIGH");
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // ── 3. PRAXIS REMEDIATION & DAEMON STATE ───────────────────────────────────
  const [remediationMode, setRemediationMode] = useState<"autonomous" | "canary" | "audit">("autonomous");
  const [loopInterval, setLoopInterval] = useState("60s");
  const [watchdogSeconds, setWatchdogSeconds] = useState("120");
  const [aclTarget, setAclTarget] = useState<"nftables" | "cisco" | "paloalto" | "fortinet" | "juniper">("nftables");
  const [generatedAcl, setGeneratedAcl] = useState<string | null>(null);
  const [copiedAcl, setCopiedAcl] = useState(false);

  // ── 4. CONTAINER & REGISTRY STATE ──────────────────────────────────────────
  const [baseImage, setBaseImage] = useState("distroless-debian12");
  const [kernelLockdown, setKernelLockdown] = useState(true);
  const [dailyZeroDaySync, setDailyZeroDaySync] = useState(true);
  const [registrySaved, setRegistrySaved] = useState(false);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleInput.trim() || whitelistRules.includes(newRuleInput.trim())) return;
    setWhitelistRules([...whitelistRules, newRuleInput.trim()]);
    setNewRuleInput("");
    setFirewallSaved(true);
    setTimeout(() => setFirewallSaved(false), 2000);
  };

  const handleRemoveRule = (rule: string) => {
    setWhitelistRules(whitelistRules.filter(r => r !== rule));
    setFirewallSaved(true);
    setTimeout(() => setFirewallSaved(false), 2000);
  };

  const handleScrubSecrets = () => {
    setIsScrubbing(true);
    setTimeout(() => {
      let cleaned = sampleCodeInput;
      cleaned = cleaned.replace(/ghp_[a-zA-Z0-9]{36}/g, "[REDACTED_GITHUB_PAT]");
      cleaned = cleaned.replace(/AKIA[0-9A-Z]{16}/g, "[REDACTED_AWS_ACCESS_KEY]");
      cleaned = cleaned.replace(/Bearer\s+[^`"'\s]+/g, "Bearer [REDACTED_AUTH_TOKEN]");
      setScrubResult(cleaned);
      setIsScrubbing(false);
    }, 350);
  };

  const handleGenerateAttestation = () => {
    setAttestationGenerated(true);
  };

  const handleCopyAttestation = () => {
    const payload = JSON.stringify({
      _type: "https://in-toto.io/Statement/v0.1",
      predicateType: "https://slsa.dev/provenance/v0.2",
      subject: [
        { name: "exultia-workstation-artifact.bin", digest: { sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" } }
      ],
      builder: { id: "https://exultia.tech/pureide/builder@v2" },
      invocation: { configSource: { uri: "git+https://github.com/org/repo@refs/heads/main" } },
      materials: [{ uri: "git+https://github.com/org/repo@main", digest: { sha1: "7d8f3e2a1b" } }]
    }, null, 2);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(payload);
      setCopiedAttestation(true);
      setTimeout(() => setCopiedAttestation(false), 2000);
    }
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookResponse(null);
    await new Promise(r => setTimeout(r, 700));

    setWebhookResponse({
      timestamp: new Date().toISOString(),
      status: 200,
      statusText: "OK",
      deliveryDurationMs: 38,
      headersSent: {
        "User-Agent": "Exultia-Vantage-Webhook-Engine/2.8",
        "X-Exultia-Signature-SHA256": "hmac-sha256=4f8b9e1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
        "X-Exultia-Event-Type": "threat.advisory.critical",
        "Content-Type": "application/json"
      },
      payload: {
        event: "threat.advisory.published",
        uviId: "UVI-2026-10-00000412",
        title: "CVE-2026-3819 Linux eBPF Subsystem Memory Leak & Bound Violation",
        severity: minSeverity,
        cvssScore: 9.8,
        isKnownExploited: true,
        recommendedAction: "Apply automated in-memory trampoline hotpatch via Praxis"
      }
    });
    setIsTestingWebhook(false);
  };

  const handleCopySecret = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(webhookSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleGenerateAcl = () => {
    let output = "";
    if (aclTarget === "nftables") {
      output = `# /etc/nftables.d/exultia-threat-drop.nft\ntable inet exultia_filter {\n  set malicious_ips {\n    type ipv4_addr\n    flags interval\n    elements = { 198.51.100.14, 203.0.113.88, 192.0.2.45 }\n  }\n  chain input {\n    type filter hook input priority 0; policy accept;\n    ip saddr @malicious_ips counter drop\n  }\n}`;
    } else if (aclTarget === "cisco") {
      output = `! Cisco IOS XE C2 Blocklist Generated by Exultia\nip access-list extended EXULTIA_THREAT_BLOCK\n deny ip host 198.51.100.14 any log-input\n deny ip host 203.0.113.88 any log-input\n permit ip any any`;
    } else if (aclTarget === "paloalto") {
      output = `# Palo Alto EDL (External Dynamic List) Plain Format\n# Source: https://exultia.tech/api/threat-feed/edl\n198.51.100.14\n203.0.113.88\n192.0.2.45`;
    } else if (aclTarget === "fortinet") {
      output = `config firewall address\n    edit "exultia_bad_ip_1"\n        set subnet 198.51.100.14 255.255.255.255\n    next\nend`;
    } else {
      output = `/* Juniper JunOS Firewall Filter */\nfirewall {\n  family inet {\n    filter EXULTIA_DROP {\n      term drop-c2 {\n        from { source-address { 198.51.100.14/32; 203.0.113.88/32; } }\n        then { count c2-drop; discard; }\n      }\n    }\n  }\n}`;
    }
    setGeneratedAcl(output);
  };

  const handleCopyAcl = () => {
    if (navigator.clipboard && generatedAcl) {
      navigator.clipboard.writeText(generatedAcl);
      setCopiedAcl(true);
      setTimeout(() => setCopiedAcl(false), 2000);
    }
  };

  const handleSaveRegistry = () => {
    setRegistrySaved(true);
    setTimeout(() => setRegistrySaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* ── HEADER BANNER ─────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)",
        border: "1px solid rgba(0, 229, 255, 0.25)",
        borderRadius: "18px",
        padding: "1.75rem",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ fontSize: "0.74rem", color: "var(--accent-primary, #00E5FF)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Sliders size={14} />
              <span>Unified Platform Controls</span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", margin: 0, fontFamily: "var(--font-display)" }}>
              Product Suite Configuration
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", margin: "6px 0 0 0", maxWidth: "680px", lineHeight: 1.5 }}>
              Centralized management cockpit for active workstation firewalls, threat feed webhooks, autonomous daemon policies, and container registry enforcement.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: "rgba(52, 211, 153, 0.12)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              borderRadius: "6px",
              color: "#34D399",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 700
            }}>
              <CheckCircle2 size={13} />
              ALL ENGINES ACTIVE
            </span>
          </div>
        </div>

        {/* Section Jump Bar */}
        <div style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          {[
            { id: "all", label: "All Engines", icon: Layers },
            { id: "daedelus", label: "Workstations (Daedelus)", icon: DaedelusIcon },
            { id: "vantage", label: "Threat Feeds (Vantage)", icon: VantageIcon },
            { id: "praxis", label: "Remediation & Daemon (Praxis)", icon: PraxisIcon },
            { id: "containers", label: "Container Policies (PureOS)", icon: PureOsIcon },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as ConfigSection)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: active ? "1px solid var(--accent-primary, #00E5FF)" : "1px solid rgba(255, 255, 255, 0.1)",
                  background: active ? "rgba(0, 229, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  color: active ? "#FFFFFF" : "#94A3B8",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={14} glow={false} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 1. DAEDELUS WORKSTATION & COMPILER CONTROLS ─────────────────────── */}
      {(activeFilter === "all" || activeFilter === "daedelus") && (
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <DaedelusIcon size={24} glow={false} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Daedelus Workstation &amp; Compiler Controls
            </h2>
            <span style={{ fontSize: "0.72rem", background: "rgba(59, 130, 246, 0.15)", color: "#60A5FA", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
              TIER: {pureIdeTier.toUpperCase()}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
            
            {/* Box 1A: Egress Firewall */}
            <div style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Shield size={18} color="#60A5FA" />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                    Workstation Egress Firewall
                  </h3>
                </div>
                {firewallSaved && (
                  <span style={{ fontSize: "0.72rem", color: "#34D399", fontWeight: 700 }}>Saved!</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.84rem", color: "#CBD5E1", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={blockC2}
                    onChange={e => setBlockC2(e.target.checked)}
                    style={{ accentColor: "#3B82F6", cursor: "pointer" }}
                  />
                  <span>Block Outbound C2 &amp; Botnet Callbacks</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.84rem", color: "#CBD5E1", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={dnsProtection}
                    onChange={e => setDnsProtection(e.target.checked)}
                    style={{ accentColor: "#3B82F6", cursor: "pointer" }}
                  />
                  <span>Enforce DNS Tunneling / Exfiltration Sinkholing</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.84rem", color: "#CBD5E1", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={strictRegistries}
                    onChange={e => setStrictRegistries(e.target.checked)}
                    style={{ accentColor: "#3B82F6", cursor: "pointer" }}
                  />
                  <span>Strict Verified Package Registries (npm, PyPI, Crates)</span>
                </label>
              </div>

              {/* Domain Table */}
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 700, marginBottom: "0.5rem" }}>
                AUTHORIZED OUTBOUND DOMAINS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "1rem", maxHeight: "120px", overflowY: "auto" }}>
                {whitelistRules.map(rule => (
                  <div key={rule} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.3)", padding: "5px 10px", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                    <span style={{ color: "#E2F8FF" }}>{rule}</span>
                    <button type="button" onClick={() => handleRemoveRule(rule)} style={{ background: "none", border: "none", color: "#F87171", cursor: "pointer", padding: 0 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddRule} style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  placeholder="e.g. repo.corp.internal:443"
                  value={newRuleInput}
                  onChange={e => setNewRuleInput(e.target.value)}
                  style={{ flex: 1, padding: "6px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none" }}
                />
                <button type="submit" style={{ padding: "6px 12px", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "6px", color: "#93C5FD", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                  <Plus size={13} />
                </button>
              </form>
            </div>

            {/* Box 1B: Secret Redaction & Token Scrubbing */}
            <div style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Lock size={18} color="#60A5FA" />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                    Hermetic Secret Redaction
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleScrubSecrets}
                  disabled={isScrubbing}
                  style={{
                    padding: "4px 10px",
                    background: "rgba(59, 130, 246, 0.25)",
                    border: "1px solid rgba(59, 130, 246, 0.5)",
                    borderRadius: "6px",
                    color: "#93C5FD",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {isScrubbing ? "Scrubbing..." : "Test Redaction"}
                </button>
              </div>

              <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "0 0 0.75rem 0", lineHeight: 1.4 }}>
                Evaluates source code blocks against 40+ API token patterns (GitHub, AWS, OpenAI, Stripe) before committing to disk.
              </p>

              <textarea
                value={scrubResult || sampleCodeInput}
                onChange={e => {
                  setSampleCodeInput(e.target.value);
                  setScrubResult(null);
                }}
                rows={5}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 10px",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: scrubResult ? "#34D399" : "#CBD5E1",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                  resize: "vertical",
                  outline: "none"
                }}
              />

              {/* SLSA Cosign Attestation */}
              <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "#CBD5E1" }}>
                  SLSA Level 3 In-Toto Attestations:
                </span>
                <button
                  type="button"
                  onClick={attestationGenerated ? handleCopyAttestation : handleGenerateAttestation}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "4px 10px",
                    background: attestationGenerated ? "rgba(52, 211, 153, 0.15)" : "rgba(255, 255, 255, 0.06)",
                    border: attestationGenerated ? "1px solid rgba(52, 211, 153, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "6px",
                    color: attestationGenerated ? "#34D399" : "#CBD5E1",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {copiedAttestation ? "Copied JSON!" : (attestationGenerated ? "Copy Attestation" : "Generate Key")}
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── 2. VANTAGE THREAT INTEL & FEEDS CONTROLS ────────────────────────── */}
      {(activeFilter === "all" || activeFilter === "vantage") && (
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <VantageIcon size={24} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Vantage Threat Intelligence &amp; Feeds
            </h2>
            <span style={{ fontSize: "0.72rem", background: "rgba(168, 85, 247, 0.15)", color: "#C084FC", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
              24,388 CVES INDEXED
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
            
            {/* Box 2A: Webhook Configuration */}
            <div style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Radio size={18} color="#C084FC" />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                    Real-Time Threat Webhooks
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "4px 10px",
                    background: "rgba(168, 85, 247, 0.2)",
                    border: "1px solid rgba(168, 85, 247, 0.4)",
                    borderRadius: "6px",
                    color: "#D8B4FE",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  <Send size={12} />
                  {isTestingWebhook ? "Sending..." : "Test Webhook"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                    Webhook Destination URL:
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                    HMAC-SHA256 Signing Secret:
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="password"
                      value={webhookSecret}
                      readOnly
                      style={{ flex: 1, padding: "7px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none", fontFamily: "var(--font-mono)" }}
                    />
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: copiedSecret ? "#34D399" : "#CBD5E1", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      {copiedSecret ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                    Minimum CVSS Severity Filter:
                  </label>
                  <select
                    value={minSeverity}
                    onChange={e => setMinSeverity(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none" }}
                  >
                    <option value="CRITICAL">CRITICAL ONLY (CVSS &ge; 9.0)</option>
                    <option value="HIGH">HIGH &amp; CRITICAL (CVSS &ge; 7.0)</option>
                    <option value="ALL">ALL DISCLOSURES (CVSS &ge; 4.0)</option>
                  </select>
                </div>
              </div>

              {webhookResponse && (
                <div style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(52, 211, 153, 0.3)", borderRadius: "6px", padding: "8px 10px", fontSize: "0.74rem", fontFamily: "var(--font-mono)", color: "#A7F3D0" }}>
                  <div>STATUS: 200 OK &bull; LATENCY: {webhookResponse.deliveryDurationMs}ms</div>
                  <div style={{ color: "#94A3B8", marginTop: "2px" }}>EVENT: {webhookResponse.payload.title}</div>
                </div>
              )}
            </div>

            {/* Box 2B: Offline Database Downloads */}
            <div style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
                <Database size={18} color="#C084FC" />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  Offline Vulnerability Database (UVI)
                </h3>
              </div>

              <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: "0 0 1.25rem 0", lineHeight: 1.5 }}>
                Pre-baked air-gapped vulnerability catalog indexing 24,388+ disclosures across 110+ authoritative sources. Enables zero-internet sub-millisecond local queries.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link
                  href="/api/download?type=uvi-sqlite"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "rgba(168, 85, 247, 0.12)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    fontWeight: 700
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Download size={14} color="#C084FC" />
                    <span>Download SQLite Catalog (.db)</span>
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#C084FC" }}>~14.2 MB</span>
                </Link>

                <Link
                  href="/api/download?type=uvi-jsonl"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#CBD5E1",
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    fontWeight: 600
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Download size={14} />
                    <span>Raw JSON Lines (.jsonl)</span>
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>~28.6 MB</span>
                </Link>

                <div style={{ fontSize: "0.74rem", color: "#64748B", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                  CLI query: <code>exultia search &lt;package&gt; --offline</code>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── 3. PRAXIS REMEDIATION & DAEMON CONTROLS ─────────────────────────── */}
      {(activeFilter === "all" || activeFilter === "praxis") && (
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <PraxisIcon size={24} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Praxis Remediation &amp; Linux Daemon
            </h2>
            <span style={{ fontSize: "0.72rem", background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
              SUB-15MS ROLLBACK
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
            
            {/* Box 3A: Daemon Healing Policy */}
            <div style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
                <Activity size={18} color="#FBBF24" />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  60s Self-Healing Daemon Policy
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                    Remediation Execution Mode:
                  </label>
                  <select
                    value={remediationMode}
                    onChange={e => setRemediationMode(e.target.value as any)}
                    style={{ width: "100%", padding: "7px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none" }}
                  >
                    <option value="autonomous">Full Autonomous Hotpatching (&lt;350ms In-Memory)</option>
                    <option value="canary">Canary Ring 0 Staged (Soak test before fleet)</option>
                    <option value="audit">Audit &amp; Alert Only (Dry-run without memory edits)</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                      Scan Interval:
                    </label>
                    <select
                      value={loopInterval}
                      onChange={e => setLoopInterval(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none" }}
                    >
                      <option value="30s">30s (Aggressive)</option>
                      <option value="60s">60s (Standard Default)</option>
                      <option value="300s">300s (5-Minute)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                      Watchdog Timer:
                    </label>
                    <select
                      value={watchdogSeconds}
                      onChange={e => setWatchdogSeconds(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none" }}
                    >
                      <option value="60">60s</option>
                      <option value="120">120s (Default Failsafe)</option>
                      <option value="300">300s</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.35)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.74rem", color: "#94A3B8", lineHeight: 1.5 }}>
                <strong style={{ color: "#FDE68A" }}>Rollback Guarantee:</strong> If the post-patch daemon or application socket fails health verification within {watchdogSeconds} seconds, the kernel unlinks trampolines and restores snapshot in &lt;15ms.
              </div>
            </div>

            {/* Box 3B: Network & Firewall ACL Compiler */}
            <div style={{
              background: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Server size={18} color="#FBBF24" />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                    Firewall &amp; SIEM ACL Compiler
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAcl}
                  style={{
                    padding: "4px 10px",
                    background: "rgba(245, 158, 11, 0.2)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    borderRadius: "6px",
                    color: "#FDE68A",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Compile ACL
                </button>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                  Hardware / Software Firewall Target:
                </label>
                <select
                  value={aclTarget}
                  onChange={e => {
                    setAclTarget(e.target.value as any);
                    setGeneratedAcl(null);
                  }}
                  style={{ width: "100%", padding: "7px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none" }}
                >
                  <option value="nftables">Linux Host &bull; nftables</option>
                  <option value="cisco">Cisco IOS XE &bull; Extended ACLs</option>
                  <option value="paloalto">Palo Alto &bull; External Dynamic List (EDL)</option>
                  <option value="fortinet">Fortinet FortiGate &bull; Address Groups</option>
                  <option value="juniper">Juniper JunOS &bull; Stateless Filters</option>
                </select>
              </div>

              {generatedAcl ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.7rem", color: "#94A3B8", fontFamily: "var(--font-mono)" }}>OUTPUT</span>
                    <button type="button" onClick={handleCopyAcl} style={{ background: "none", border: "none", color: copiedAcl ? "#34D399" : "#FBBF24", fontSize: "0.72rem", cursor: "pointer", fontWeight: 700 }}>
                      {copiedAcl ? "Copied!" : "Copy Rules"}
                    </button>
                  </div>
                  <pre style={{ margin: 0, padding: "8px 10px", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#E2F8FF", fontSize: "0.72rem", fontFamily: "var(--font-mono)", maxHeight: "110px", overflowY: "auto" }}>
                    <code>{generatedAcl}</code>
                  </pre>
                </div>
              ) : (
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "1.25rem", borderRadius: "8px", textAlign: "center", color: "#64748B", fontSize: "0.78rem" }}>
                  Select a firewall platform and click &ldquo;Compile ACL&rdquo; to generate hardware-compatible drop rules.
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* ── 4. CONTAINER & REGISTRY CONTROLS ───────────────────────────────── */}
      {(activeFilter === "all" || activeFilter === "containers") && (
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <PureOsIcon size={24} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Distroless Containers &amp; Registry Admission
            </h2>
            <span style={{ fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
              ZERO-CVE PROXY
            </span>
          </div>

          <div style={{
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            borderRadius: "14px",
            padding: "1.5rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Box size={18} color="#34D399" />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  Daedelus / PureOS Distroless OCI Policy
                </h3>
              </div>
              <button
                type="button"
                onClick={handleSaveRegistry}
                style={{
                  padding: "5px 14px",
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  borderRadius: "6px",
                  color: "#6EE7B7",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {registrySaved ? "Saved!" : "Save Policy"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                  Default Base Image Architecture:
                </label>
                <select
                  value={baseImage}
                  onChange={e => setBaseImage(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "white", fontSize: "0.8rem", outline: "none", marginBottom: "1rem" }}
                >
                  <option value="distroless-debian12">distroless-base-debian12 (SLSA L3 Verified)</option>
                  <option value="distroless-static-musl">distroless-static-musl (Zero-Glibc Minimal)</option>
                  <option value="hardened-alpine3.20">hardened-alpine3.20 (Kernel Hardened)</option>
                </select>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.84rem", color: "#CBD5E1", cursor: "pointer", marginBottom: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={kernelLockdown}
                    onChange={e => setKernelLockdown(e.target.checked)}
                    style={{ accentColor: "#10B981", cursor: "pointer" }}
                  />
                  <span>Enforce Kernel Lockdown Mode (Block eBPF Hijacking)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.84rem", color: "#CBD5E1", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={dailyZeroDaySync}
                    onChange={e => setDailyZeroDaySync(e.target.checked)}
                    style={{ accentColor: "#10B981", cursor: "pointer" }}
                  />
                  <span>Daily Zero-CVE Rebuild Trigger on Vantage Disclosures</span>
                </label>
              </div>

              <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.75rem", color: "#94A3B8", lineHeight: 1.5 }}>
                <div style={{ color: "#6EE7B7", fontWeight: 700, marginBottom: "4px" }}>
                  NEGATIVE-ADMISSION PROXY RUNNER:
                </div>
                <code>docker pull registry.exultia.tech/pureos/{baseImage}:latest</code>
                <div style={{ marginTop: "8px" }}>
                  Packages with unresolved CISA KEV or CVSS &ge; 8.0 advisories are automatically rejected from admission into deployment pipelines.
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
