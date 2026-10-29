"use client";

import { useState } from "react";
import { X, Copy, Check, Download, FileText, ShieldCheck, CheckCircle2, Terminal } from "lucide-react";

interface MsaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_MSA_TEXT = `# EXULTIA TECHNOLOGIES, PBC MASTER SERVICES AGREEMENT (MSA)
**Standard Enterprise Fleet Terms • Form MSA-2026-EX**
*Effective Date: Upon Execution / Deployment*

---

### PREAMBLE: THE "ZERO BULLSHIT" TRANSPARENCY COMMITMENT
Exultia Technologies, PBC ("Exultia") provides autonomous threat remediation, sovereign self-healing daemons, and hermetic developer tools. We believe that forcing enterprise engineering leaders into mandatory 30-minute discovery calls with sales development reps just to see contractual terms is an anti-pattern. This document represents our standard, production Master Services Agreement for fleets exceeding 100 hosts.

---

### 1. PARTIES & FLEET ENTITLEMENTS
1.1 **Parties & Governing Law**: This Master Services Agreement is entered into by and between Exultia Technologies, PBC, a public benefit corporation organized under the laws of the State of Georgia ("Provider"), and the ordering customer entity ("Customer"). This Agreement shall be governed by and construed in accordance with the laws of the State of Georgia.
1.2 **Enterprise+ Fleet Scope**: Customer is licensed to deploy Exultia resident Linux daemons across all authorized host nodes (100+ declared nodes).
1.3 **Included Capabilities**:
  - Unlimited Access to Threat Feed API with real-time continuous synchronization.
  - Unlimited Use of Daedelus - build secure IDEs, containers, and packages.
  - Unlimited Use of Praxis - generate POSIX-compliant scripts mapped to threat feed fixes.
  - Unlimited Use of Axiom - general cybersecurity exam questions and LMS API.
  - 25-Host Flat Fleet Cap savings and volume deployment protections.
  - Standard Master Services Agreement terms (Form MSA-2026-EX) with Net-30 invoicing.

---

### 2. AIRGAP SOVEREIGNTY & ZERO-LOCKOUT ARCHITECTURE
2.1 **Offline Cryptographic Licensing**: Provider delivers signed Ed25519 tokens for complete offline verification at \`/etc/exultia/license.key\`. Zero outbound network telemetry or periodic phone-home handshakes are required.
2.2 **Never-Brick Guarantee**: Provider warrants that software contains no remote kill-switches. Disconnection, transient network failure, or billing true-up delays shall NEVER halt, disable, or brick active host defenses.
2.3 **Autoscale Soft Grace Period**: Bursting beyond contracted node counts triggers a mandatory 30-day soft grace period for seamless operational uptime while true-ups occur calmly.

---

### 3. SERVICE LEVEL AGREEMENT (SLA) & THREAT FEED AVAILABILITY
3.1 **Threat Feed Uptime**: Provider guarantees 99.9% monthly availability for threat feed APIs and real-time advisory synchronization.

---

### 4. REMEDIATION SCOPE & ENVIRONMENTAL BOUNDARIES
4.1 **Exact Surgical Remediation**: Provider executes deterministic, mathematically verified remediation actions strictly tailored to isolate, mitigate, or patch identified vulnerabilities and threat vectors. Provider does exactly what is required to fix the security issue—nothing more, nothing less.
4.2 **No Environmental Impact Liability**: Provider is NOT responsible or liable for any downstream, collateral, operational, or environmental impacts resulting from legitimate security remediation actions or defensive posture adjustments.
4.3 **Customer Responsibility for Environmental Adaptability**: It is Customer's sole responsibility to ensure that Customer's operating environment, application runtime, dependencies, microservices, and orchestration configurations are adaptable and resilient to required security updates, configuration changes, port/socket isolation, and patched software binaries.
4.4 **Customer Environment & Deployment Control**: Provider does not administer, manage, or control Customer's internal host infrastructure, orchestrators, or local execution pipelines. Consequently, Provider cannot and shall not be held responsible or liable for remediation deployment speed, execution timing, or scheduling latency on Customer-administered environments.

---

### 5. COMMERCIAL PRICING & PAYMENT TERMS
5.1 **Standard Pricing Rate**:
  - Fleet Base Cap: $500.00 USD / month.
  - Extended Fleet Scale: $12.00 USD / node / month (billed annually) or $15.00 USD / node / month (billed monthly).
5.2 **Invoicing & Payment**: Net-30 days from date of invoice via ACH, Wire Transfer, or Corporate Credit Card.
5.3 **No Hidden Consulting**: Zero mandatory professional services fees, zero onboarding fees, and zero hidden implementation riders.

---

### 6. DATA PRIVACY & TELEMETRY
6.1 **Zero Telemetry Warranty**: Provider warrants that Customer source code, proprietary algorithms, memory snapshots, and local environment variables are NEVER transmitted to Provider.
6.2 **Total Sovereignty**: All threat matching, patch verification, and compiler executions occur strictly within Customer's local computing perimeter.

---

### 7. TERM & MUTUAL TERMINATION
7.1 **Term**: Standard 12-month annual commitment unless otherwise stated on Order Form.
7.2 **Termination for Convenience**: Customer may terminate with 30 days written notice prior to annual renewal with zero cancellation penalties.

---

**EXULTIA TECHNOLOGIES, PBC**
*Autonomous & Accessible Self-Healing Linux*
`;

export default function MsaPreviewModal({ isOpen, onClose }: MsaPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_MSA_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([SAMPLE_MSA_TEXT], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Exultia_Master_Services_Agreement_Sample.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(3, 7, 18, 0.88)",
        backdropFilter: "blur(12px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
          border: "1px solid rgba(139, 92, 246, 0.4)",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "840px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(139, 92, 246, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}
        className="fade-in"
      >
        {/* Header */}
        <div
          style={{
            padding: "1.75rem 2rem 1.25rem 2rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  background: "rgba(139, 92, 246, 0.2)",
                  color: "#C4B5FD",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FileText size={12} />
                Form MSA-2026-EX • Enterprise+ Fleet Terms
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34D399",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  fontWeight: 700,
                }}
              >
                Public Transparency Standard
              </span>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>
              Standard Master Services Agreement (MSA)
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0 }}>
              Transparent terms for deployments exceeding 100 host nodes. Zero hidden sales barriers.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#94A3B8",
              cursor: "pointer",
              padding: "6px",
              display: "grid",
              placeItems: "center",
            }}
            aria-label="Close MSA Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Anti-Sales Callout */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "0.9rem 2rem",
            fontSize: "0.82rem",
            color: "#E2E8F0",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🛡️</span>
          <div>
            <strong>Why publish our standard MSA openly?</strong> Because &quot;Contact Sales&quot; buttons designed to force technical buyers into uncomfortable SDR cold calls are the most annoying pattern on the web. Here is our actual contract.
          </div>
        </div>

        {/* Agreement Body (Scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.75rem 2rem",
            color: "#CBD5E1",
            fontSize: "0.86rem",
            lineHeight: 1.65,
            fontFamily: "var(--font-mono, monospace)",
            background: "rgba(3, 7, 18, 0.5)",
          }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "inherit",
              color: "#E2E8F0",
            }}
          >
            {SAMPLE_MSA_TEXT}
          </pre>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "1.25rem 2rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(10, 15, 26, 0.95)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", color: "#94A3B8" }}>
            <ShieldCheck size={14} color="#34D399" />
            <span>Standard Net-30 Invoicing • 99.9% Feed SLA • Exact Remediation Boundaries • State of Georgia Jurisdiction</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {copied ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
              <span>{copied ? "Copied to Clipboard" : "Copy Agreement Text"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
                border: "none",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 14px rgba(139, 92, 246, 0.35)",
              }}
            >
              <Download size={14} />
              <span>Download Sample MSA (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
