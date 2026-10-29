"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Terminal, Copy, Check, Box } from "lucide-react";

export default function DaedelusClientView() {
  const searchParams = useSearchParams();
  const [activeQuickstart, setActiveQuickstart] = useState<"cli" | "container">("cli");
  const [copied, setCopied] = useState<boolean>(false);

  // Smooth scroll to section if arriving from legacy ?tab= parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) return;
    const targetMap: Record<string, string> = {
      blueprints: "workstations",
      workstations: "workstations",
      packages: "packages",
      containers: "containers",
      security: "security",
    };
    const targetId = targetMap[tab];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  const cliSnippet = `# 1. Install the Daedelus developer CLI
curl -fsSL https://get.exultia.tech/daedelus | sh

# 2. Launch an air-gapped Rust development enclave
dae launch ws:rust-systems-enclave

# 3. Build with negative-admission package verification
dae build --strict-provenance`;

  const containerSnippet = `# 1. Pull the signed, distroless minimal base image (<5MB)
docker pull registry.exultia.tech/daedelus/base-distroless:2026.1

# 2. Verify cryptographic SLSA Level 4 provenance with cosign
cosign verify --key https://exultia.tech/pki/cosign.pub \\
  registry.exultia.tech/daedelus/base-distroless:2026.1`;

  const activeSnippet = activeQuickstart === "cli" ? cliSnippet : containerSnippet;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(activeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        background: "rgba(10, 15, 26, 0.8)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Code Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          background: "rgba(15, 23, 42, 0.9)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => setActiveQuickstart("cli")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "0.84rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background:
                activeQuickstart === "cli"
                  ? "rgba(16, 185, 129, 0.18)"
                  : "transparent",
              color: activeQuickstart === "cli" ? "#34D399" : "#94A3B8",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor:
                activeQuickstart === "cli"
                  ? "rgba(16, 185, 129, 0.35)"
                  : "transparent",
              transition: "all 0.15s ease",
            }}
          >
            <Terminal size={14} />
            Daedelus CLI
          </button>
          <button
            onClick={() => setActiveQuickstart("container")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "0.84rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background:
                activeQuickstart === "container"
                  ? "rgba(6, 182, 212, 0.18)"
                  : "transparent",
              color: activeQuickstart === "container" ? "#22D3EE" : "#94A3B8",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor:
                activeQuickstart === "container"
                  ? "rgba(6, 182, 212, 0.35)"
                  : "transparent",
              transition: "all 0.15s ease",
            }}
          >
            <Box size={14} />
            Distroless OCI
          </button>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            background: copied
              ? "rgba(16, 185, 129, 0.2)"
              : "rgba(255, 255, 255, 0.05)",
            border: `1px solid ${
              copied ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.12)"
            }`,
            borderRadius: "6px",
            color: copied ? "#34D399" : "#94A3B8",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-mono, monospace)",
            transition: "all 0.15s ease",
          }}
        >
          {copied ? (
            <>
              <Check size={14} /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} /> Copy
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre
        style={{
          margin: 0,
          padding: "1.25rem 1.5rem",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.88rem",
          lineHeight: 1.6,
          color: "#E2E8F0",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        <code>{activeSnippet}</code>
      </pre>
    </div>
  );
}
