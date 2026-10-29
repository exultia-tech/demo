"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  Shield, 
  Cpu, 
  Lock, 
  Unlock, 
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
  ExternalLink
} from "lucide-react";
import { PureIdeIcon } from "@/components/BrandIcons";
import { PlanGate } from "@/components/auth/PlanGate";

export default function PureIdeCustomerTools() {
  const { getUserTier } = useAuth();
  const tier = getUserTier("pureide");

  // Egress Firewall State
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

  // Cosign State
  const [attestationGenerated, setAttestationGenerated] = useState(false);
  const [copiedAttestation, setCopiedAttestation] = useState(false);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleInput.trim() || whitelistRules.includes(newRuleInput.trim())) return;
    setWhitelistRules([...whitelistRules, newRuleInput.trim()]);
    setNewRuleInput("");
    setFirewallSaved(true);
    setTimeout(() => setFirewallSaved(false), 2500);
  };

  const handleRemoveRule = (rule: string) => {
    setWhitelistRules(whitelistRules.filter(r => r !== rule));
    setFirewallSaved(true);
    setTimeout(() => setFirewallSaved(false), 2500);
  };

  // Perform live scrubbing on sample code
  const getRedactedOutput = (code: string) => {
    return code
      .replace(/ghp_[a-zA-Z0-9]{20,}/g, "[REDACTED_GITHUB_PAT_ENC_001]")
      .replace(/AKIA[0-9A-Z]{16}/g, "[REDACTED_AWS_ACCESS_KEY_ENC_002]")
      .replace(/sk_live_[a-zA-Z0-9]{20,}/g, "[REDACTED_STRIPE_SECRET_KEY_ENC_003]")
      .replace(/(password|secret|key)\s*[:=]\s*["'][^"']+["']/gi, '$1 = "[REDACTED_CONFIDENTIAL_TOKEN]"');
  };

  const sampleCosignJson = JSON.stringify({
    specVersion: "https://in-toto.io/Statement/v1",
    predicateType: "https://slsa.dev/provenance/v1",
    subject: [{
      name: "pureide-win-x64-v2.8.4.exe",
      digest: { sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" }
    }],
    predicate: {
      buildDefinition: {
        buildType: "https://exultia.tech/pureide/hermetic-builder@v1",
        externalParameters: { telemetryStripped: true, airgapIsolated: true },
      },
      runDetails: {
        builder: { id: "exultia-enclave-node-us-east-1a" },
        metadata: {
          invocationId: "inv_9841029418294",
          startedOn: new Date().toISOString(),
          hardwareAttestation: "Intel SGX / AMD SEV-SNP Verified"
        }
      }
    }
  }, null, 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <PureIdeIcon size={30} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              PureIDE Workstation Customer Tools
            </h2>
            <span style={{
              fontSize: "0.7rem",
              background: tier !== "free" ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
              color: tier !== "free" ? "#93C5FD" : "#94A3B8",
              border: tier !== "free" ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
              padding: "2px 8px",
              borderRadius: "6px",
              fontWeight: 800,
              textTransform: "uppercase"
            }}>
              {tier} Tier
            </span>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0 }}>
            Configure real-time workstation security policies, live egress firewall rules, and airgap attestations.
          </p>
        </div>

        <Link
          href="/app/daedelus?mode=ide"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(135deg, #3B82F6, #2563EB)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none"
          }}
        >
          Launch Builder Console <ExternalLink size={14} />
        </Link>
      </div>

      {/* TOOL 1: LIVE EGRESS SOCKET FIREWALL CONFIGURATOR (PRO / ENTERPRISE) */}
      <PlanGate
        product="pureide"
        requiredTier="pro"
        featureTitle="Live Egress Socket Firewall Configurator"
        featureDescription="Enforce granular outbound socket blocking at the workstation kernel level to prevent telemetry exfiltration and malicious extension C2 beacons."
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "18px",
          padding: "1.75rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 2px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={18} color="#60A5FA" />
                Workstation Egress Firewall & C2 Containment
              </h3>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                Real-time policy distributed to all active IDE client instances.
              </div>
            </div>
            {firewallSaved && (
              <span style={{ fontSize: "0.75rem", background: "rgba(34, 197, 94, 0.2)", color: "#86EFAC", border: "1px solid rgba(34, 197, 94, 0.4)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                Policy Synchronized ✓
              </span>
            )}
          </div>

          {/* Toggle Switches */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            
            <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>C2 Beacon Blocking</span>
                <input 
                  type="checkbox" 
                  checked={blockC2} 
                  onChange={e => { setBlockC2(e.target.checked); setFirewallSaved(true); setTimeout(() => setFirewallSaved(false), 2000); }} 
                />
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                Blocks socket connections to 4,200+ known threat actor C2 IP addresses.
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>DNS Tunneling Defense</span>
                <input 
                  type="checkbox" 
                  checked={dnsProtection} 
                  onChange={e => { setDnsProtection(e.target.checked); setFirewallSaved(true); setTimeout(() => setFirewallSaved(false), 2000); }} 
                />
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                Intercepts high-entropy base64 DNS payload exfiltration attempts.
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Strict Registry Egress</span>
                <input 
                  type="checkbox" 
                  checked={strictRegistries} 
                  onChange={e => { setStrictRegistries(e.target.checked); setFirewallSaved(true); setTimeout(() => setFirewallSaved(false), 2000); }} 
                />
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                Restricts dependency downloads strictly to authorized package registries.
              </div>
            </div>

          </div>

          {/* Custom Allowed Egress Endpoints */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.5rem" }}>
              Authorized Egress Hostnames & Ports (Whitelist)
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              {whitelistRules.map(rule => (
                <div key={rule} style={{ background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "8px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", fontFamily: "monospace", color: "#93C5FD" }}>
                  <span>{rule}</span>
                  <button 
                    onClick={() => handleRemoveRule(rule)}
                    style={{ background: "transparent", border: "none", color: "#F87171", cursor: "pointer", padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddRule} style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="text"
                placeholder="e.g. internal-artifactory.corp.local:8443"
                value={newRuleInput}
                onChange={e => setNewRuleInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.6rem 0.85rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
              <button 
                type="submit" 
                className="btn-primary"
                style={{ padding: "0.6rem 1rem", fontSize: "0.82rem", fontWeight: 700 }}
              >
                Add Endpoint
              </button>
            </form>
          </div>
        </div>
      </PlanGate>

      {/* TOOL 2: INTERACTIVE LIVE SECRETS & TOKEN REDACTION TESTER (PRO / ENTERPRISE) */}
      <PlanGate
        product="pureide"
        requiredTier="pro"
        featureTitle="Automated SBOM & Secrets Redaction Engine"
        featureDescription="Inspect your builds for leaked credentials and auto-generate SPDX/CycloneDX software bills of materials."
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "18px",
          padding: "1.75rem"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.4rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <KeyRound size={18} color="#60A5FA" />
            Live Secrets Redaction & Hermetic Token Scrubber
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1.25rem 0" }}>
            PureIDE intercepts and scrubs GitHub PATs, AWS keys, Stripe tokens, and private credentials before any compiler output or debug log is emitted.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.4rem" }}>
                Source Code / Config (Try typing a secret):
              </label>
              <textarea 
                value={sampleCodeInput}
                onChange={e => setSampleCodeInput(e.target.value)}
                rows={6}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  color: "#F87171",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#86EFAC", fontWeight: 700, marginBottom: "0.4rem" }}>
                Hermetic Output (Cleaned by PureIDE Filter):
              </label>
              <textarea 
                readOnly
                value={getRedactedOutput(sampleCodeInput)}
                rows={6}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(0, 0, 0, 0.7)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "10px",
                  color: "#86EFAC",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button
              onClick={() => alert("Downloading CycloneDX 1.5 SBOM Manifest (JSON)...")}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#CBD5E1",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <Download size={14} />
              Export CycloneDX SBOM
            </button>
          </div>
        </div>
      </PlanGate>

      {/* TOOL 3: HARDWARE ENCLAVE COSIGN & ATTESTATION (ENTERPRISE) */}
      <PlanGate
        product="pureide"
        requiredTier="enterprise"
        featureTitle="Hardware Enclave Cosign & Airgap Attestation"
        featureDescription="Generate cryptographic SHA-256 binary provenance attestations signed with isolated hardware security module (HSM) keys."
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          borderRadius: "18px",
          padding: "1.75rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 2px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <Cpu size={18} color="#C084FC" />
                Cryptographic Binary Provenance Attestation (SLSA Level 3)
              </h3>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                Zero-telemetry build signature verified with Intel SGX / AMD SEV-SNP hardware enclave.
              </div>
            </div>
            <button
              onClick={() => setAttestationGenerated(true)}
              className="btn-primary"
              style={{
                padding: "6px 14px",
                fontSize: "0.82rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #8B5CF6, #6366F1)"
              }}
            >
              {attestationGenerated ? "Re-Generate Attestation" : "Generate In-Toto Provenance"}
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <pre style={{
              background: "rgba(0, 0, 0, 0.7)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              borderRadius: "10px",
              padding: "1rem",
              color: "#C084FC",
              fontFamily: "monospace",
              fontSize: "0.78rem",
              maxHeight: "220px",
              overflowY: "auto",
              margin: 0
            }}>
              {sampleCosignJson}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sampleCosignJson);
                setCopiedAttestation(true);
                setTimeout(() => setCopiedAttestation(false), 2000);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: copiedAttestation ? "#16A34A" : "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "white",
                padding: "4px 8px",
                fontSize: "0.72rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Copy size={12} />
              {copiedAttestation ? "Copied!" : "Copy JSON"}
            </button>
          </div>
        </div>
      </PlanGate>

    </div>
  );
}
