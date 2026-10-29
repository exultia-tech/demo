"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code2,
  Server,
  Package,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { DaedelusIcon } from "@/components/BrandIcons";
import IdeConsoleView from "./IdeConsoleView";
import ContainerConsoleView from "./ContainerConsoleView";
import PackageCatalogView from "./PackageCatalogView";

export type DaedelusMode = "ide" | "container" | "package";

interface DaedelusBuilderConsoleProps {
  initialMode?: DaedelusMode;
}

export default function DaedelusBuilderConsole({ initialMode }: DaedelusBuilderConsoleProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mode state: sync with query param or prop, fallback to "ide"
  const paramMode = searchParams.get("mode") as DaedelusMode | null;
  const [activeMode, setActiveMode] = useState<DaedelusMode>(
    paramMode === "container" || paramMode === "package" ? paramMode : initialMode || "ide"
  );

  useEffect(() => {
    if (paramMode && (paramMode === "ide" || paramMode === "container" || paramMode === "package")) {
      setActiveMode(paramMode);
    }
  }, [paramMode]);

  const handleModeSwitch = (mode: DaedelusMode) => {
    setActiveMode(mode);
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary, #060913)" }}>
      {/* ── TOP MASTER MODE TOGGLE BAR ─────────────────────────────────────── */}
      <header
        style={{
          background: "linear-gradient(180deg, rgba(12, 17, 34, 0.98) 0%, rgba(8, 12, 24, 0.96) 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "0.65rem 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 90,
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div
          style={{
            maxWidth: "1720px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          {/* Brand Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/products/daedelus" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <DaedelusIcon size={34} glow={true} />
            </Link>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                  Daedelus Builder Console
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    padding: "2px 7px",
                    borderRadius: "4px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#34D399",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    fontWeight: 800
                  }}
                >
                  IDE • CONTAINER • PACKAGE
                </span>
              </div>
              <div style={{ fontSize: "0.74rem", color: "#94A3B8" }}>
                {activeMode === "ide" && "IDE Mode • Air-gapped custom workstations, hermetic toolchains & zero-CVE plugins"}
                {activeMode === "container" && "Container Mode • Minimal CIS Level 2 hardened distroless OCI containers & SBOMs"}
                {activeMode === "package" && "Package Mode • Clean-room zero-CVE dependencies & negative-admission proxy"}
              </div>
            </div>
          </div>

          {/* Master 3-Way Mode Toggle */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "4px",
              gap: "4px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)"
            }}
          >
            {/* Mode 1: IDE */}
            <button
              onClick={() => handleModeSwitch("ide")}
              style={{
                padding: "8px 18px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.86rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                background: activeMode === "ide" ? "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)" : "transparent",
                color: activeMode === "ide" ? "#FFFFFF" : "#94A3B8",
                boxShadow: activeMode === "ide" ? "0 0 16px rgba(6, 182, 212, 0.45)" : "none"
              }}
            >
              <Code2 size={16} />
              IDE Workstations
            </button>

            {/* Mode 2: Container */}
            <button
              onClick={() => handleModeSwitch("container")}
              style={{
                padding: "8px 18px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.86rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                background: activeMode === "container" ? "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" : "transparent",
                color: activeMode === "container" ? "#FFFFFF" : "#94A3B8",
                boxShadow: activeMode === "container" ? "0 0 16px rgba(139, 92, 246, 0.45)" : "none"
              }}
            >
              <Server size={16} />
              Distroless Containers
            </button>

            {/* Mode 3: Package */}
            <button
              onClick={() => handleModeSwitch("package")}
              style={{
                padding: "8px 18px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.86rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                background: activeMode === "package" ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "transparent",
                color: activeMode === "package" ? "#FFFFFF" : "#94A3B8",
                boxShadow: activeMode === "package" ? "0 0 16px rgba(16, 185, 129, 0.45)" : "none"
              }}
            >
              <Package size={16} />
              Clean Packages
              <span
                style={{
                  fontSize: "0.68rem",
                  background: activeMode === "package" ? "rgba(255,255,255,0.25)" : "rgba(16, 185, 129, 0.2)",
                  color: activeMode === "package" ? "#FFFFFF" : "#34D399",
                  padding: "1px 5px",
                  borderRadius: "999px",
                  fontWeight: 800
                }}
              >
                0-CVE
              </span>
            </button>
          </div>

          {/* Right Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)"
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399", boxShadow: "0 0 8px #34D399" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6EE7B7" }}>
                Main Plan Entitlement Active
              </span>
            </div>

            <Link
              href="/products/daedelus"
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#94A3B8",
                fontSize: "0.75rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              Platform Overview &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* ── MODE-SWITCHED WORKBENCH CONTENT ────────────────────────────────── */}
      <main style={{ flex: 1, width: "100%", overflowX: "hidden" }}>
        {activeMode === "ide" && (
          <div className="fade-in" key="mode-ide">
            <IdeConsoleView />
          </div>
        )}

        {activeMode === "container" && (
          <div className="fade-in" key="mode-container">
            <ContainerConsoleView />
          </div>
        )}

        {activeMode === "package" && (
          <div className="fade-in" key="mode-package">
            <PackageCatalogView />
          </div>
        )}
      </main>
    </div>
  );
}
