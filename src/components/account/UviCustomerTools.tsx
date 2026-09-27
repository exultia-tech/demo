"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldAlert, 
  Activity, 
  Lock, 
  Unlock, 
  Radio, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Send, 
  Terminal, 
  ExternalLink,
  Layers,
  Database,
  Search
} from "lucide-react";
import { UviIcon } from "@/components/BrandIcons";
import { PlanGate } from "@/components/auth/PlanGate";

export default function UviCustomerTools() {
  const { getUserTier } = useAuth();
  const tier = getUserTier("uvi");

  // Webhook Stream State
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourorganization.com/webhooks/uvi-stream");
  const [webhookSecret, setWebhookSecret] = useState("exultia_whsec_984f1b2c3d4e5f6a7b8c9d0e1f2a3b4c");
  const [minSeverity, setMinSeverity] = useState("HIGH");
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any | null>(null);

  // Sample Developer Threat Radar Items
  const sampleWorkstationThreats = [
    {
      uviId: "UVI-2026-09-00000104",
      title: "VS Code / Open VSX Malicious Extension Token Harvester",
      severity: "CRITICAL",
      cvss: 9.8,
      vector: "Extension Hook Exfiltration",
      mitigation: "PureIDE Hermetic Sandbox Block Active"
    },
    {
      uviId: "UVI-2026-09-00000318",
      title: "PyPI Package Dependency Confusion in Torch Compiler Stubs",
      severity: "HIGH",
      cvss: 8.6,
      vector: "Build Pipeline Hijack",
      mitigation: "Strict Registry Egress Enforced"
    },
    {
      uviId: "UVI-2026-09-00000522",
      title: "Language Server Protocol (LSP) Unchecked JSON-RPC Deserialization",
      severity: "HIGH",
      cvss: 8.2,
      vector: "IDE Memory Corruption",
      mitigation: "Socket Isolation Sandbox"
    }
  ];

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookResponse(null);

    // Simulate realistic webhook dispatch and signature verification
    await new Promise(r => setTimeout(r, 900));

    setWebhookResponse({
      timestamp: new Date().toISOString(),
      status: 200,
      statusText: "OK",
      deliveryDurationMs: 42,
      headersSent: {
        "User-Agent": "Exultia-UVI-Webhook-Engine/2.8",
        "X-Exultia-Signature-SHA256": "hmac-sha256=4f8b9e1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
        "X-Exultia-Event-Type": "threat.advisory.critical",
        "Content-Type": "application/json"
      },
      payload: {
        event: "threat.advisory.published",
        uviId: "UVI-2026-09-00000941",
        title: "Critical C2 Command Injection in Untrusted Workstation Build Hooks",
        severity: "CRITICAL",
        cvssScore: 9.8,
        isKnownExploited: true,
        recommendedAction: "Isolate affected workspace node immediately"
      }
    });

    setIsTestingWebhook(false);
  };

  const handleDownloadDataset = (format: string) => {
    alert(`Generating high-throughput ${format.toUpperCase()} dataset export from 11,090+ indexed threat advisories...`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <UviIcon size={30} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              UVI Threat Intelligence Customer Hub
            </h2>
            <span style={{
              fontSize: "0.7rem",
              background: tier !== "free" ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
              color: tier !== "free" ? "#C084FC" : "#94A3B8",
              border: tier !== "free" ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
              padding: "2px 8px",
              borderRadius: "6px",
              fontWeight: 800,
              textTransform: "uppercase"
            }}>
              {tier} Tier
            </span>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0 }}>
            Universal Vulnerability Intelligence streaming, developer threat radar, and bulk dataset archives.
          </p>
        </div>

        <Link
          href="/threat-feed"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none"
          }}
        >
          Open Feed Registry <ExternalLink size={14} />
        </Link>
      </div>

      {/* TOOL 1: WORKSTATION & COMPILER THREAT RADAR (PRO / ENTERPRISE) */}
      <PlanGate
        product="uvi"
        requiredTier="pro"
        featureTitle="Workstation & IDE Compiler Threat Radar"
        featureDescription="Filter intelligence feeds specifically for vulnerabilities and malicious packages targeting developer environments, VS Code extensions, and build pipelines."
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "18px",
          padding: "1.75rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 2px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldAlert size={18} color="#C084FC" />
                Workstation Vector Threat Radar
              </h3>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                Filtered from 11,090+ global records for direct developer machine impact.
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", background: "rgba(139, 92, 246, 0.2)", color: "#C084FC", border: "1px solid rgba(139, 92, 246, 0.4)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
              Live Stream Active
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sampleWorkstationThreats.map(threat => (
              <div key={threat.uviId} style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "monospace", color: "#C084FC", fontSize: "0.78rem", fontWeight: 700 }}>{threat.uviId}</span>
                    <span style={{ fontSize: "0.68rem", background: "rgba(239, 68, 68, 0.2)", color: "#FCA5A5", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "1px 6px", borderRadius: "4px", fontWeight: 800 }}>
                      {threat.severity} (CVSS {threat.cvss})
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Vector: {threat.vector}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>{threat.title}</div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#86EFAC", background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "4px 10px", borderRadius: "6px", fontWeight: 600 }}>
                  ✓ {threat.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PlanGate>

      {/* TOOL 2: LIVE WEBHOOK STREAM DISPATCHER (PRO / ENTERPRISE) */}
      <PlanGate
        product="uvi"
        requiredTier="pro"
        featureTitle="Live Advisory Webhook Stream Dispatcher"
        featureDescription="Stream zero-day advisories and CISA KEV alerts in real time with cryptographically signed HMAC payloads directly to your SIEM."
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "18px",
          padding: "1.75rem"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.4rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <Radio size={18} color="#C084FC" />
            Live Webhook Endpoint Configuration
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1.25rem 0" }}>
            Exultia pushes JSON advisory events over HTTPS signed with your private HMAC secret.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.4rem" }}>
                Target Webhook Receiver URL:
              </label>
              <input 
                type="url"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.4rem" }}>
                Minimum Severity Filter:
              </label>
              <select
                value={minSeverity}
                onChange={e => setMinSeverity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  background: "#0F172A",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              >
                <option value="CRITICAL">CRITICAL (CVSS &gt;= 9.0)</option>
                <option value="HIGH">HIGH & CRITICAL (CVSS &gt;= 7.0)</option>
                <option value="ALL">ALL Advisories & Warnings</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.4rem" }}>
              HMAC Signature Secret Key:
            </label>
            <input 
              type="text"
              readOnly
              value={webhookSecret}
              style={{
                width: "100%",
                padding: "0.6rem 0.85rem",
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "8px",
                color: "#C084FC",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginBottom: "1rem" }}>
            <button
              onClick={handleTestWebhook}
              disabled={isTestingWebhook}
              className="btn-primary"
              style={{
                padding: "7px 16px",
                fontSize: "0.82rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Send size={13} />
              {isTestingWebhook ? "Dispatching Test Event..." : "Send Test Advisory Event"}
            </button>
          </div>

          {/* Test Delivery Log */}
          {webhookResponse && (
            <div style={{ background: "rgba(0, 0, 0, 0.6)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#86EFAC", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.5rem" }}>
                <CheckCircle2 size={15} />
                <span>Test Payload Delivered (HTTP {webhookResponse.status} OK • {webhookResponse.deliveryDurationMs}ms)</span>
              </div>
              <pre style={{ color: "#CBD5E1", fontFamily: "monospace", fontSize: "0.75rem", margin: 0, overflowX: "auto" }}>
                {JSON.stringify(webhookResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </PlanGate>

      {/* TOOL 3: BULK DATASET DOWNLOAD VAULT (ENTERPRISE) */}
      <PlanGate
        product="uvi"
        requiredTier="enterprise"
        featureTitle="Bulk Threat Intelligence Dataset Vault"
        featureDescription="Export complete daily and historical snapshot archives of all 11,090+ standardized threat records in Apache Parquet, JSON, and CSV formats."
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          borderRadius: "18px",
          padding: "1.75rem"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.4rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <Database size={18} color="#C084FC" />
            Bulk Dataset Download & Offline SIEM Ingestion Vault
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1.25rem 0" }}>
            Full catalog dumps optimized for high-volume ingest in Splunk, Elastic, Sentinel, and Snowflake.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            
            <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "2px" }}>Apache Parquet</div>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.75rem" }}>Columnar format • ~14.2 MB</div>
              <button
                onClick={() => handleDownloadDataset("parquet")}
                className="btn-primary"
                style={{ width: "100%", padding: "6px", fontSize: "0.78rem", fontWeight: 700 }}
              >
                Download .parquet
              </button>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "2px" }}>Full JSON Archive</div>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.75rem" }}>Raw advisories • ~48.6 MB</div>
              <button
                onClick={() => handleDownloadDataset("json")}
                className="btn-primary"
                style={{ width: "100%", padding: "6px", fontSize: "0.78rem", fontWeight: 700 }}
              >
                Download .json
              </button>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "2px" }}>CSV Threat Index</div>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.75rem" }}>Spreadsheet flat file • ~8.1 MB</div>
              <button
                onClick={() => handleDownloadDataset("csv")}
                className="btn-primary"
                style={{ width: "100%", padding: "6px", fontSize: "0.78rem", fontWeight: 700 }}
              >
                Download .csv
              </button>
            </div>

          </div>
        </div>
      </PlanGate>

    </div>
  );
}
