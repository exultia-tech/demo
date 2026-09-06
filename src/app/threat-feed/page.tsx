"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  CONSOLIDATED_UVI_ADVISORIES, 
  UVI_PUBLIC_FEED_SOURCES, 
  UviAdvisoryRecord, 
  PublicFeedSource,
  ThreatSeverity,
  DomainCategory,
  IdeBuildImpactAssessment
} from "@/lib/threat-feed-data";

export default function ThreatFeedPage() {
  // Dual-Perspective Scope State: "ALL" (Universal Software & Systems) vs "DEV_BUILD" (Developer & Build System Exposure)
  const [feedScope, setFeedScope] = useState<"ALL" | "DEV_BUILD">("ALL");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedSourceFeed, setSelectedSourceFeed] = useState<string>("ALL");
  const [kevOnly, setKevOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState<"cvss_desc" | "uvi_desc" | "uvi_asc" | "published_desc">("cvss_desc");

  // Inspection Dossier Modal State
  const [selectedAdvisory, setSelectedAdvisory] = useState<UviAdvisoryRecord | null>(null);
  const [dossierTab, setDossierTab] = useState<"global" | "ide_build" | "upstream" | "targets" | "export">("global");
  const [copiedUviId, setCopiedUviId] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedModalCurl, setCopiedModalCurl] = useState(false);

  // Available domain categories list
  const domainCategories: ("ALL" | DomainCategory)[] = [
    "ALL",
    "Operating Systems & Kernels",
    "Cloud & Container Infrastructure",
    "Enterprise & Web Frameworks",
    "Networking, Protocols & Cryptography",
    "Language Runtimes & Toolchains",
    "Databases & Storage",
    "Supply Chain & Malware",
    "Developer Tools & Workstations"
  ];

  // Filter and Sort Logic
  const filteredAdvisories = useMemo(() => {
    return CONSOLIDATED_UVI_ADVISORIES.filter((record) => {
      // 0. Scope Filter: Universal Feed vs Developer / Build Exposure Focus
      if (feedScope === "DEV_BUILD" && !record.ideBuildImpact.hasDirectBuildImpact) {
        return false;
      }

      // 1. Keyword search (UVI ID, CVEs, Title, Headline, Summary, Targets, CWE, Upstream, Global/Build Impact)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchUvi = record.uviId.toLowerCase().includes(q);
        const matchCve = record.cveList.some((cve) => cve.toLowerCase().includes(q));
        const matchGhsa = record.ghsaId?.toLowerCase().includes(q);
        const matchOsv = record.osvId?.toLowerCase().includes(q);
        const matchMsrc = record.msrcId?.toLowerCase().includes(q);
        const matchTitle = record.title.toLowerCase().includes(q);
        const matchHeadline = record.headline.toLowerCase().includes(q);
        const matchSummary = record.summary.toLowerCase().includes(q);
        const matchTech = record.technicalDetails.toLowerCase().includes(q);
        const matchGlobal = record.globalImpact.toLowerCase().includes(q);
        const matchDevVector = record.ideBuildImpact.workstationVector.toLowerCase().includes(q);
        const matchDevRec = record.ideBuildImpact.recommendationForIdeBuilds.toLowerCase().includes(q);
        const matchCwe = record.cwe.toLowerCase().includes(q);
        const matchDomain = record.domainCategory.toLowerCase().includes(q);
        const matchTargets = record.affectedTargets.some((t) => 
          t.product.toLowerCase().includes(q) || 
          t.ecosystem.toLowerCase().includes(q) ||
          (t.purl && t.purl.toLowerCase().includes(q))
        );
        const matchSignals = record.upstreamSignals.some((s) => 
          s.sourceName.toLowerCase().includes(q) || 
          s.finding.toLowerCase().includes(q)
        );

        if (!matchUvi && !matchCve && !matchGhsa && !matchOsv && !matchMsrc && !matchTitle && !matchHeadline && !matchSummary && !matchTech && !matchGlobal && !matchDevVector && !matchDevRec && !matchCwe && !matchDomain && !matchTargets && !matchSignals) {
          return false;
        }
      }

      // 2. Severity filter
      if (selectedSeverity !== "ALL" && record.severity !== selectedSeverity) {
        return false;
      }

      // 3. Domain Category filter
      if (selectedDomain !== "ALL" && record.domainCategory !== selectedDomain) {
        return false;
      }

      // 4. Source feed filter
      if (selectedSourceFeed !== "ALL") {
        const hasSource = record.upstreamSignals.some((s) => 
          s.sourceId.toLowerCase() === selectedSourceFeed.toLowerCase() ||
          s.sourceName.toLowerCase().includes(selectedSourceFeed.toLowerCase())
        );
        if (!hasSource) return false;
      }

      // 5. CISA KEV Known Exploited Vulnerabilities filter
      if (kevOnly && !record.cisaKev.isKnownExploited) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "cvss_desc") return b.cvssScore - a.cvssScore;
      if (sortBy === "uvi_desc") return b.uviId.localeCompare(a.uviId);
      if (sortBy === "uvi_asc") return a.uviId.localeCompare(b.uviId);
      if (sortBy === "published_desc") return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      return 0;
    });
  }, [feedScope, searchQuery, selectedSeverity, selectedDomain, selectedSourceFeed, kevOnly, sortBy]);

  // Metric Aggregations
  const totalUniversalCount = CONSOLIDATED_UVI_ADVISORIES.length;
  const directBuildImpactCount = CONSOLIDATED_UVI_ADVISORIES.filter((r) => r.ideBuildImpact.hasDirectBuildImpact).length;
  const cisaKevCount = CONSOLIDATED_UVI_ADVISORIES.filter((r) => r.cisaKev.isKnownExploited).length;
  const criticalCount = CONSOLIDATED_UVI_ADVISORIES.filter((r) => r.severity === "CRITICAL").length;
  const totalUpstreamRecords = UVI_PUBLIC_FEED_SOURCES.reduce((acc, f) => acc + f.recordsIngested, 0);

  const handleCopyUviId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedUviId(id);
    setTimeout(() => setCopiedUviId(null), 2500);
  };

  const handleCopyCurl = () => {
    const params = new URLSearchParams();
    if (feedScope === "DEV_BUILD") params.set("scope", "build-impact");
    if (searchQuery) params.set("query", searchQuery);
    if (selectedSeverity !== "ALL") params.set("severity", selectedSeverity);
    if (selectedDomain !== "ALL") params.set("domain", selectedDomain);
    if (selectedSourceFeed !== "ALL") params.set("source", selectedSourceFeed);
    if (kevOnly) params.set("kevOnly", "true");
    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const curlCmd = `curl -s "https://secureide.dev/api/threat-feed${queryStr}" | jq .`;
    navigator.clipboard.writeText(curlCmd);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  const handleCopyModalCurl = (record: UviAdvisoryRecord) => {
    const curlCmd = `curl -s "https://secureide.dev/api/threat-feed?id=${record.uviId}" | jq .`;
    navigator.clipboard.writeText(curlCmd);
    setCopiedModalCurl(true);
    setTimeout(() => setCopiedModalCurl(false), 2500);
  };

  const getSeverityStyle = (sev: ThreatSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return {
          bg: "rgba(239, 68, 68, 0.15)",
          border: "rgba(239, 68, 68, 0.4)",
          text: "#F87171",
          dot: "#EF4444"
        };
      case "HIGH":
        return {
          bg: "rgba(249, 115, 22, 0.15)",
          border: "rgba(249, 115, 22, 0.4)",
          text: "#FB923C",
          dot: "#F97316"
        };
      case "MEDIUM":
        return {
          bg: "rgba(234, 179, 8, 0.15)",
          border: "rgba(234, 179, 8, 0.4)",
          text: "#FACC15",
          dot: "#EAB308"
        };
      case "LOW":
        return {
          bg: "rgba(16, 185, 129, 0.15)",
          border: "rgba(16, 185, 129, 0.4)",
          text: "#34D399",
          dot: "#10B981"
        };
    }
  };

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2.5rem 2rem 5rem", width: "100%" }}>
      {/* Top Banner Tag */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <span style={{ 
          fontSize: "0.75rem", 
          fontWeight: 700, 
          letterSpacing: "0.08em", 
          textTransform: "uppercase", 
          padding: "0.3rem 0.75rem", 
          borderRadius: "6px", 
          background: "rgba(59, 130, 246, 0.15)", 
          color: "#60A5FA",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        }}>
          Standalone Vulnerability Registry
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>•</span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Unified Vulnerability Intelligence (UVI) Encyclopedia
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>•</span>
        <span style={{ 
          fontSize: "0.75rem", 
          fontWeight: 600, 
          color: "#34D399", 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "0.35rem" 
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399", display: "inline-block" }}></span>
          12 Synchronized Upstream Public Feeds
        </span>
      </div>

      {/* Hero Header */}
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        gap: "2rem", 
        marginBottom: "2rem",
        flexWrap: "wrap"
      }}>
        <div style={{ maxWidth: "980px" }}>
          <h1 style={{ 
            fontSize: "2.85rem", 
            fontWeight: 800, 
            letterSpacing: "-0.03em", 
            lineHeight: 1.15, 
            marginBottom: "0.75rem",
            background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Universal Vulnerability Intelligence (UVI)
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            An independent, open threat intelligence registry consolidating 12 authoritative feeds into standardized <code style={{ color: "#60A5FA", fontWeight: 700, background: "rgba(59, 130, 246, 0.12)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>UVI-YYYY-NNNN</code> advisories. Universal coverage spanning operating systems, cloud containers, web frameworks, runtimes, protocols, and supply chains — providing both <strong>general security awareness</strong> and <strong>developer workstation / IDE build exposure</strong> analysis.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span style={{ color: "#3B82F6", fontWeight: 600 }}>Standard:</span>
              <span>UVI Specification v3.0</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span style={{ color: "#10B981", fontWeight: 600 }}>Access:</span>
              <span>Creative Commons BY-4.0 (Universal Open Access)</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>REST API:</span>
              <code style={{ fontSize: "0.8rem", color: "#FCD34D" }}>/api/threat-feed</code>
            </div>
          </div>
        </div>

        {/* Quick cURL query trigger button */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-end" }}>
          <button
            onClick={handleCopyCurl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              background: copiedCurl ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.15)",
              border: copiedCurl ? "1px solid #10B981" : "1px solid rgba(59, 130, 246, 0.4)",
              color: copiedCurl ? "#34D399" : "#93C5FD",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            title="Copy cURL CLI query matching current filter state"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {copiedCurl ? (
                <path d="M20 6L9 17l-5-5"/>
              ) : (
                <>
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </>
              )}
            </svg>
            {copiedCurl ? "cURL Command Copied!" : "Copy Active cURL Query"}
          </button>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Full feed accessible programmatically
          </span>
        </div>
      </div>

      {/* DUAL-PERSPECTIVE SCOPE SWITCHER */}
      <div style={{
        background: "rgba(11, 15, 25, 0.95)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "14px",
        padding: "0.6rem 0.8rem",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700, paddingLeft: "0.5rem" }}>
            Feed Perspective:
          </span>
          <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.04)", borderRadius: "10px", padding: "3px" }}>
            <button
              onClick={() => setFeedScope("ALL")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 1.1rem",
                borderRadius: "8px",
                border: "none",
                background: feedScope === "ALL" ? "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2))" : "transparent",
                color: feedScope === "ALL" ? "#F8FAFC" : "#94A3B8",
                fontWeight: feedScope === "ALL" ? 700 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: feedScope === "ALL" ? "0 2px 8px rgba(0,0,0,0.3)" : "none"
              }}
            >
              <span>🌐</span>
              <span>Universal Software & Systems</span>
              <span style={{
                background: feedScope === "ALL" ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.08)",
                padding: "0.1rem 0.45rem",
                borderRadius: "10px",
                fontSize: "0.72rem",
                color: "#E2E8F0"
              }}>
                {totalUniversalCount}
              </span>
            </button>

            <button
              onClick={() => setFeedScope("DEV_BUILD")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 1.1rem",
                borderRadius: "8px",
                border: "none",
                background: feedScope === "DEV_BUILD" ? "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.2))" : "transparent",
                color: feedScope === "DEV_BUILD" ? "#F8FAFC" : "#94A3B8",
                fontWeight: feedScope === "DEV_BUILD" ? 700 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: feedScope === "DEV_BUILD" ? "0 2px 8px rgba(0,0,0,0.3)" : "none"
              }}
            >
              <span>💻</span>
              <span>Developer & Build System Exposure</span>
              <span style={{
                background: feedScope === "DEV_BUILD" ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.08)",
                padding: "0.1rem 0.45rem",
                borderRadius: "10px",
                fontSize: "0.72rem",
                color: "#E2E8F0"
              }}>
                {directBuildImpactCount}
              </span>
            </button>
          </div>
        </div>

        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", paddingRight: "0.5rem" }}>
          {feedScope === "ALL" 
            ? "Showing all universal software, cloud, OS & network advisories (general awareness)"
            : "Filtered to threats directly impacting developer laptops, toolchains, CI/CD, or IDE builds"}
        </span>
      </div>

      {/* Global Telemetry Statistics Bar */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "1.25rem", 
        marginBottom: "2.5rem" 
      }}>
        {/* Card 1: Total Universal Advisories */}
        <div style={{
          background: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600 }}>
              Universal Advisories
            </span>
            <span style={{ fontSize: "1.2rem" }}>🌐</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
            {totalUniversalCount} <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-muted)" }}>Records</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#60A5FA" }}>
            Normalized under <code>UVI-YYYY-NNNN</code>
          </div>
        </div>

        {/* Card 2: 12 Public Ingested Feeds */}
        <div style={{
          background: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600 }}>
              Upstream Feeds Synced
            </span>
            <span style={{ fontSize: "1.2rem" }}>📡</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34D399", letterSpacing: "-0.02em" }}>
            12 <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-muted)" }}>Authoritative Sources</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {(totalUpstreamRecords / 1000).toFixed(0)}k+ records cross-correlated
          </div>
        </div>

        {/* Card 3: CISA KEV Known Exploited Vulnerabilities */}
        <div style={{
          background: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#FCA5A5", fontWeight: 600 }}>
              CISA KEV Zero-Days
            </span>
            <span style={{ fontSize: "1.2rem" }}>🚨</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#EF4444", letterSpacing: "-0.02em" }}>
            {cisaKevCount} <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#FCA5A5" }}>Exploited in Wild</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#F87171" }}>
            Active weaponization alerts
          </div>
        </div>

        {/* Card 4: Developer Workstation & Build Exposure */}
        <div style={{
          background: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6EE7B7", fontWeight: 600 }}>
              Dev Workstation Risks
            </span>
            <span style={{ fontSize: "1.2rem" }}>💻</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10B981", letterSpacing: "-0.02em" }}>
            {directBuildImpactCount} <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#6EE7B7" }}>Affect Toolchains</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Impacts local builds, Git & compilers
          </div>
        </div>
      </div>

      {/* Search, Filter & Viewport Matrix */}
      <div style={{
        background: "rgba(15, 20, 32, 0.8)",
        border: "1px solid rgba(255, 255, 255, 0.09)",
        borderRadius: "16px",
        padding: "1.75rem",
        marginBottom: "2rem",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.36)"
      }}>
        {/* Main Search Input */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "320px", position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              id="uvi-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by UVI ID (e.g. UVI-2021-44228), CVE (e.g. CVE-2024-3094), target software, protocol, or CWE..."
              style={{
                width: "100%",
                padding: "0.85rem 3rem 0.85rem 2.85rem",
                background: "rgba(10, 14, 23, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                color: "#F8FAFC",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent-primary)";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: "0.85rem 1rem",
                background: "rgba(10, 14, 23, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                color: "#F8FAFC",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="cvss_desc">CVSS Score (Highest First)</option>
              <option value="uvi_desc">UVI ID (Descending)</option>
              <option value="uvi_asc">UVI ID (Ascending)</option>
              <option value="published_desc">Publication Date (Newest)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ 
            display: "flex", 
            background: "rgba(10, 14, 23, 0.9)", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            borderRadius: "10px",
            padding: "3px" 
          }}>
            <button
              onClick={() => setViewMode("table")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 0.9rem",
                borderRadius: "7px",
                border: "none",
                background: viewMode === "table" ? "rgba(59, 130, 246, 0.25)" : "transparent",
                color: viewMode === "table" ? "#93C5FD" : "var(--text-muted)",
                fontWeight: viewMode === "table" ? 600 : 400,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"/>
              </svg>
              Table View
            </button>
            <button
              onClick={() => setViewMode("cards")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 0.9rem",
                borderRadius: "7px",
                border: "none",
                background: viewMode === "cards" ? "rgba(59, 130, 246, 0.25)" : "transparent",
                color: viewMode === "cards" ? "#93C5FD" : "var(--text-muted)",
                fontWeight: viewMode === "cards" ? 600 : 400,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Wiki Cards
            </button>
          </div>
        </div>

        {/* Filter Chips Matrix */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Domain Category Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, minWidth: "110px" }}>
              Domain:
            </span>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {domainCategories.map((cat) => {
                const isSelected = selectedDomain === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedDomain(cat)}
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                      border: isSelected ? "1px solid #8B5CF6" : "1px solid rgba(255,255,255,0.08)",
                      background: isSelected ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.03)",
                      color: isSelected ? "#C4B5FD" : "var(--text-muted)"
                    }}
                  >
                    {cat === "ALL" ? "All Domains" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feed Source Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, minWidth: "110px" }}>
              Source Feed:
            </span>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setSelectedSourceFeed("ALL")}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: selectedSourceFeed === "ALL" ? "1px solid #3B82F6" : "1px solid rgba(255,255,255,0.08)",
                  background: selectedSourceFeed === "ALL" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.03)",
                  color: selectedSourceFeed === "ALL" ? "#93C5FD" : "var(--text-muted)"
                }}
              >
                All Feeds (12)
              </button>
              {UVI_PUBLIC_FEED_SOURCES.map((feed) => {
                const isSelected = selectedSourceFeed === feed.id;
                return (
                  <button
                    key={feed.id}
                    onClick={() => setSelectedSourceFeed(isSelected ? "ALL" : feed.id)}
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      border: isSelected ? "1px solid #3B82F6" : "1px solid rgba(255,255,255,0.08)",
                      background: isSelected ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.03)",
                      color: isSelected ? "#93C5FD" : "var(--text-muted)"
                    }}
                    title={`${feed.name} - ${feed.scope}`}
                  >
                    <span>{feed.icon}</span>
                    <span>{feed.name.replace("NIST ", "").replace(" Database", "").replace(" (MSRC)", "").replace(" Security", "")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity and CISA KEV Filter Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, minWidth: "110px" }}>
              Severity:
            </span>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((sev) => {
                const isSelected = selectedSeverity === sev;
                let badgeColor = "#94A3B8";
                if (sev === "CRITICAL") badgeColor = "#EF4444";
                if (sev === "HIGH") badgeColor = "#F97316";
                if (sev === "MEDIUM") badgeColor = "#EAB308";
                if (sev === "LOW") badgeColor = "#10B981";

                return (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    style={{
                      padding: "0.35rem 0.8rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isSelected ? `1px solid ${badgeColor}` : "1px solid rgba(255,255,255,0.08)",
                      background: isSelected ? `${badgeColor}22` : "rgba(255,255,255,0.03)",
                      color: isSelected ? badgeColor : "var(--text-muted)"
                    }}
                  >
                    {sev === "ALL" ? "All Severities" : sev}
                  </button>
                );
              })}
            </div>

            {/* CISA KEV Toggle Button */}
            <div style={{ marginLeft: "auto" }}>
              <button
                onClick={() => setKevOnly(!kevOnly)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  border: kevOnly ? "1px solid #EF4444" : "1px solid rgba(239, 68, 68, 0.3)",
                  background: kevOnly ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.08)",
                  color: kevOnly ? "#FCA5A5" : "#F87171",
                  transition: "all 0.2s ease"
                }}
              >
                <span>🚨</span>
                <span>CISA KEV Actively Exploited Only</span>
                {kevOnly && <span style={{ background: "#EF4444", color: "#fff", padding: "0.1rem 0.4rem", borderRadius: "10px", fontSize: "0.7rem" }}>ACTIVE</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Metadata & Reset Filters */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "1rem",
        padding: "0 0.5rem"
      }}>
        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Showing <strong style={{ color: "#F8FAFC" }}>{filteredAdvisories.length}</strong> of {totalUniversalCount} advisories
          {feedScope === "DEV_BUILD" && " • [Developer / Build Exposure Filter]"}
          {selectedDomain !== "ALL" && ` • [Domain: ${selectedDomain}]`}
          {selectedSourceFeed !== "ALL" && ` • [Feed: ${selectedSourceFeed}]`}
          {selectedSeverity !== "ALL" && ` • [Severity: ${selectedSeverity}]`}
          {kevOnly && " • [CISA KEV]"}
        </span>

        {(searchQuery || selectedSeverity !== "ALL" || selectedDomain !== "ALL" || selectedSourceFeed !== "ALL" || kevOnly || feedScope !== "ALL") && (
          <button
            onClick={() => {
              setFeedScope("ALL");
              setSearchQuery("");
              setSelectedSeverity("ALL");
              setSelectedDomain("ALL");
              setSelectedSourceFeed("ALL");
              setKevOnly(false);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#60A5FA",
              fontSize: "0.85rem",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* VIEW MODE 1: Consolidated Table with LOCKED HEADER & SCROLLABLE CONTENT */}
      {viewMode === "table" ? (
        <div style={{
          background: "rgba(15, 20, 32, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          marginBottom: "3rem"
        }}>
          {/* Table Container with Locked Header */}
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "1280px" }}>
              {/* LOCKED STICKY TABLE HEADER */}
              <thead style={{ 
                position: "sticky", 
                top: 0, 
                zIndex: 20, 
                background: "rgba(11, 15, 25, 0.98)",
                backdropFilter: "blur(10px)",
                borderBottom: "2px solid rgba(59, 130, 246, 0.3)"
              }}>
                <tr>
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "185px" }}>
                    UVI Identifier
                  </th>
                  <th style={{ padding: "1.1rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "140px" }}>
                    Severity & CVSS
                  </th>
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8" }}>
                    Threat Scope & Headline
                  </th>
                  <th style={{ padding: "1.1rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "200px" }}>
                    Impact Scope
                  </th>
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "220px" }}>
                    Affected Target(s)
                  </th>
                  <th style={{ padding: "1.1rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "200px" }}>
                    Upstream Signals
                  </th>
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "110px", textAlign: "right" }}>
                    Action
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* SCROLLABLE TABLE CONTENT BODY */}
          <div 
            id="uvi-advisories-scroll-body"
            style={{ 
              maxHeight: "720px", 
              overflowY: "auto", 
              overflowX: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(59, 130, 246, 0.4) rgba(15, 23, 42, 0.6)"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "1280px" }}>
              <tbody>
                {filteredAdvisories.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#F8FAFC", marginBottom: "0.5rem" }}>
                        No matching advisories found
                      </div>
                      <p style={{ fontSize: "0.9rem" }}>
                        Try adjusting your search query, clearing domain filters, or switching feed perspectives.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAdvisories.map((record) => {
                    const sevStyle = getSeverityStyle(record.severity);
                    const hasDevImpact = record.ideBuildImpact.hasDirectBuildImpact;

                    return (
                      <tr
                        key={record.uviId}
                        onClick={() => {
                          setSelectedAdvisory(record);
                          setDossierTab("global");
                        }}
                        style={{
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                          transition: "background 0.15s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(30, 41, 59, 0.45)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {/* Column 1: UVI Identifier & Cross-References */}
                        <td style={{ padding: "1.1rem 1.25rem", width: "185px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span style={{
                                fontFamily: "monospace",
                                fontSize: "0.95rem",
                                fontWeight: 800,
                                color: "#60A5FA",
                                letterSpacing: "-0.01em"
                              }}>
                                {record.uviId}
                              </span>
                              <button
                                onClick={(e) => handleCopyUviId(record.uviId, e)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: copiedUviId === record.uviId ? "#34D399" : "var(--text-muted)",
                                  padding: "2px"
                                }}
                                title="Copy UVI identifier"
                              >
                                {copiedUviId === record.uviId ? "✓" : (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                )}
                              </button>
                            </div>

                            {/* CVE list tags */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                              {record.cveList.map((cve) => (
                                <span
                                  key={cve}
                                  style={{
                                    fontSize: "0.7rem",
                                    fontFamily: "monospace",
                                    background: "rgba(255, 255, 255, 0.06)",
                                    color: "#CBD5E1",
                                    padding: "0.1rem 0.35rem",
                                    borderRadius: "4px"
                                  }}
                                >
                                  {cve}
                                </span>
                              ))}
                            </div>

                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                              {record.publishedDate}
                            </span>
                          </div>
                        </td>

                        {/* Column 2: Severity & CVSS */}
                        <td style={{ padding: "1.1rem 1rem", width: "140px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.25rem 0.55rem",
                              borderRadius: "6px",
                              background: sevStyle.bg,
                              border: `1px solid ${sevStyle.border}`,
                              width: "fit-content"
                            }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sevStyle.dot }}></span>
                              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: sevStyle.text }}>
                                {record.severity}
                              </span>
                            </div>

                            <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                              <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#F8FAFC" }}>
                                {record.cvssScore.toFixed(1)}
                              </span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>CVSS v3.1</span>
                            </div>

                            {record.cisaKev.isKnownExploited && (
                              <span style={{
                                fontSize: "0.65rem",
                                fontWeight: 800,
                                color: "#EF4444",
                                background: "rgba(239, 68, 68, 0.15)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                padding: "0.15rem 0.4rem",
                                borderRadius: "4px",
                                width: "fit-content"
                              }}>
                                🚨 CISA KEV
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 3: Threat Scope & Headline */}
                        <td style={{ padding: "1.1rem 1.25rem", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.3 }}>
                              {record.title}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5 }}>
                              {record.headline}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                              <span style={{
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                color: "#A78BFA",
                                background: "rgba(139, 92, 246, 0.15)",
                                padding: "0.15rem 0.5rem",
                                borderRadius: "4px"
                              }}>
                                {record.domainCategory}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                {record.cwe}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                Vector: <strong style={{ color: "#E2E8F0" }}>{record.attackVector}</strong>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Column 4: Impact Classification (Global vs Dev Workstation) */}
                        <td style={{ padding: "1.1rem 1rem", width: "200px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <span style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              background: "rgba(59, 130, 246, 0.12)",
                              border: "1px solid rgba(59, 130, 246, 0.25)",
                              color: "#93C5FD",
                              width: "fit-content"
                            }}>
                              🌐 Global Infrastructure
                            </span>

                            {hasDevImpact ? (
                              <span style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                background: "rgba(16, 185, 129, 0.15)",
                                border: "1px solid rgba(16, 185, 129, 0.35)",
                                color: "#34D399",
                                width: "fit-content",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem"
                              }}>
                                <span>💻 Dev & Build Risk:</span>
                                <strong>{record.ideBuildImpact.severityOnDeveloperEnv}</strong>
                              </span>
                            ) : (
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                Server / Enterprise Scope
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 5: Affected Target(s) */}
                        <td style={{ padding: "1.1rem 1.25rem", width: "220px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                            {record.affectedTargets.map((tgt, idx) => (
                              <div key={idx} style={{ 
                                background: "rgba(255, 255, 255, 0.03)", 
                                padding: "0.4rem 0.6rem", 
                                borderRadius: "6px",
                                border: "1px solid rgba(255, 255, 255, 0.06)"
                              }}>
                                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#F1F5F9" }}>
                                  {tgt.product}
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "#F87171" }}>
                                  Aff: {tgt.affectedVersions}
                                </div>
                                {tgt.fixedInVersion && (
                                  <div style={{ fontSize: "0.72rem", color: "#34D399" }}>
                                    Fix: {tgt.fixedInVersion}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Column 6: Upstream Signals */}
                        <td style={{ padding: "1.1rem 1rem", width: "200px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                            {record.upstreamSignals.map((sig, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  fontSize: "0.68rem",
                                  padding: "0.15rem 0.4rem",
                                  borderRadius: "4px",
                                  background: "rgba(255, 255, 255, 0.04)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  color: "#CBD5E1"
                                }}
                                title={`${sig.sourceName}: ${sig.finding}`}
                              >
                                {sig.sourceName.replace(" Database", "").replace(" (NVD)", "")}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Column 7: Action */}
                        <td style={{ padding: "1.1rem 1.25rem", width: "110px", verticalAlign: "top", textAlign: "right" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAdvisory(record);
                              setDossierTab("global");
                            }}
                            style={{
                              padding: "0.45rem 0.85rem",
                              borderRadius: "8px",
                              background: "rgba(59, 130, 246, 0.15)",
                              border: "1px solid rgba(59, 130, 246, 0.35)",
                              color: "#93C5FD",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              whiteSpace: "nowrap"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#3B82F6";
                              e.currentTarget.style.color = "#FFFFFF";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
                              e.currentTarget.style.color = "#93C5FD";
                            }}
                          >
                            Dossier →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: Wiki Cards View */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem"
        }}>
          {filteredAdvisories.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#F8FAFC" }}>No matching advisories found</div>
            </div>
          ) : (
            filteredAdvisories.map((record) => {
              const sevStyle = getSeverityStyle(record.severity);
              const hasDevImpact = record.ideBuildImpact.hasDirectBuildImpact;

              return (
                <div
                  key={record.uviId}
                  onClick={() => {
                    setSelectedAdvisory(record);
                    setDossierTab("global");
                  }}
                  style={{
                    background: "rgba(15, 20, 32, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.09)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div>
                    {/* Card Header: UVI ID + Severity */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 800, color: "#60A5FA" }}>
                          {record.uviId}
                        </span>
                        <button
                          onClick={(e) => handleCopyUviId(record.uviId, e)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: copiedUviId === record.uviId ? "#34D399" : "var(--text-muted)" }}
                        >
                          {copiedUviId === record.uviId ? "✓" : "📋"}
                        </button>
                      </div>

                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "6px",
                        background: sevStyle.bg,
                        border: `1px solid ${sevStyle.border}`
                      }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sevStyle.dot }}></span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: sevStyle.text }}>
                          {record.severity} {record.cvssScore.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Title & Headline */}
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.35, marginBottom: "0.5rem" }}>
                      {record.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.85rem" }}>
                      {record.headline}
                    </p>

                    {/* Dev Impact Badge */}
                    {hasDevImpact && (
                      <div style={{
                        marginBottom: "0.75rem",
                        padding: "0.4rem 0.65rem",
                        borderRadius: "6px",
                        background: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "0.75rem",
                        color: "#6EE7B7"
                      }}>
                        <span>💻</span>
                        <span><strong>Dev Workstation Risk:</strong> {record.ideBuildImpact.severityOnDeveloperEnv}</span>
                      </div>
                    )}

                    {/* CISA KEV Banner if exploited */}
                    {record.cisaKev.isKnownExploited && (
                      <div style={{
                        marginBottom: "0.75rem",
                        padding: "0.35rem 0.6rem",
                        borderRadius: "6px",
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.75rem",
                        color: "#FCA5A5",
                        fontWeight: 600
                      }}>
                        <span>🚨 CISA KEV: Known Exploited Zero-Day</span>
                      </div>
                    )}

                    {/* Targets Preview */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
                        Affected Components:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {record.affectedTargets.map((tgt, i) => (
                          <span key={i} style={{
                            fontSize: "0.75rem",
                            background: "rgba(255, 255, 255, 0.05)",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            color: "#E2E8F0"
                          }}>
                            {tgt.product} ({tgt.affectedVersions})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "#A78BFA", fontWeight: 600 }}>
                      {record.domainCategory}
                    </span>

                    <span style={{ fontSize: "0.8rem", color: "#60A5FA", fontWeight: 600 }}>
                      View Dossier →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SECTION: Ingested Public Threat Intelligence Feeds Directory */}
      <div style={{ 
        background: "rgba(11, 15, 25, 0.8)", 
        border: "1px solid rgba(255, 255, 255, 0.08)", 
        borderRadius: "18px", 
        padding: "2.5rem 2rem",
        marginBottom: "3rem"
      }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.25rem 0.6rem", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#34D399" }}>
              Universal Ingestion Engine
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>• 12 Independent Public Registries</span>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            Aggregated Upstream Threat Intelligence Feeds
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "900px", fontSize: "0.95rem", lineHeight: 1.6 }}>
            The UVI Feed engine synthesizes continuous streaming data from 12 public cybersecurity registries without pre-filtering. Each record receives unified taxonomy, cross-linked identifiers, and algorithmic confidence scoring.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "1.25rem"
        }}>
          {UVI_PUBLIC_FEED_SOURCES.map((source) => (
            <div
              key={source.id}
              style={{
                background: "rgba(15, 23, 42, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "0.75rem"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.25rem" }}>{source.icon}</span>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8FAFC" }}>
                      {source.name}
                    </h4>
                  </div>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "4px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#34D399",
                    border: "1px solid rgba(16, 185, 129, 0.3)"
                  }}>
                    {source.status}
                  </span>
                </div>

                <div style={{ fontSize: "0.75rem", color: "#60A5FA", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Scope: {source.scope}
                </div>

                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                  {source.coverage}
                </p>
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                borderTop: "1px solid rgba(255, 255, 255, 0.06)", 
                paddingTop: "0.65rem",
                fontSize: "0.75rem",
                color: "var(--text-muted)"
              }}>
                <div>
                  <strong style={{ color: "#E2E8F0" }}>{source.recordsIngested.toLocaleString()}</strong> records • {source.refreshRate}
                </div>
                <a
                  href={source.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#93C5FD", textDecoration: "none", fontWeight: 600 }}
                >
                  Source ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Universal API Integration & CLI Queries */}
      <div style={{
        background: "rgba(15, 20, 32, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem"
      }}>
        <div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#F8FAFC", marginBottom: "0.4rem" }}>
            Query the Standalone UVI Feed via REST API
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            The UVI feed is open for ingestion across enterprise SIEMs, runtime vulnerability scanners, build automation systems, and IDE security sidecars.
          </p>
        </div>

        <div style={{
          background: "rgba(6, 9, 15, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          color: "#93C5FD",
          overflowX: "auto"
        }}>
          <code>
            curl -s &quot;https://secureide.dev/api/threat-feed?query=UVI-2021-44228&quot; | jq .advisories
          </code>
          <button
            onClick={handleCopyCurl}
            style={{
              background: "rgba(59, 130, 246, 0.2)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              color: "#93C5FD",
              padding: "0.35rem 0.75rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
              marginLeft: "1rem"
            }}
          >
            {copiedCurl ? "Copied!" : "Copy cURL"}
          </button>
        </div>
      </div>

      {/* ADVISORY DOSSIER INSPECTION MODAL */}
      {selectedAdvisory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(3, 7, 18, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.5rem"
          }}
          onClick={() => setSelectedAdvisory(null)}
        >
          <div
            style={{
              background: "#0B0F19",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "18px",
              width: "100%",
              maxWidth: "1000px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.2)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: "1.5rem 2rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
              background: "rgba(15, 23, 42, 0.6)"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "monospace",
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: "#60A5FA",
                    letterSpacing: "-0.01em"
                  }}>
                    {selectedAdvisory.uviId}
                  </span>
                  <button
                    onClick={() => handleCopyUviId(selectedAdvisory.uviId)}
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      color: copiedUviId === selectedAdvisory.uviId ? "#34D399" : "#93C5FD",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      cursor: "pointer"
                    }}
                  >
                    {copiedUviId === selectedAdvisory.uviId ? "Copied!" : "Copy ID"}
                  </button>

                  {/* Cross references */}
                  {selectedAdvisory.cveList.map((cve) => (
                    <span
                      key={cve}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        background: "rgba(255, 255, 255, 0.08)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        color: "#E2E8F0"
                      }}
                    >
                      {cve}
                    </span>
                  ))}
                  {selectedAdvisory.ghsaId && (
                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", background: "rgba(139, 92, 246, 0.15)", color: "#C4B5FD", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {selectedAdvisory.ghsaId}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.3, marginBottom: "0.35rem" }}>
                  {selectedAdvisory.title}
                </h2>
                <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                  <span>Domain: <strong style={{ color: "#C4B5FD" }}>{selectedAdvisory.domainCategory}</strong></span>
                  <span>•</span>
                  <span>Published: <strong style={{ color: "#E2E8F0" }}>{selectedAdvisory.publishedDate}</strong></span>
                  <span>•</span>
                  <span>Updated: <strong style={{ color: "#E2E8F0" }}>{selectedAdvisory.lastUpdatedDate}</strong></span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedAdvisory(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#94A3B8",
                  width: "36px",
                  height: "36px",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.2rem",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>

            {/* CISA KEV Alert Banner if exploited */}
            {selectedAdvisory.cisaKev.isKnownExploited && (
              <div style={{
                background: "rgba(239, 68, 68, 0.15)",
                borderBottom: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "0.75rem 2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#FCA5A5",
                fontSize: "0.85rem"
              }}>
                <span style={{ fontSize: "1.2rem" }}>🚨</span>
                <div>
                  <strong>CISA Known Exploited Vulnerability (KEV):</strong> Added on {selectedAdvisory.cisaKev.dateAdded}. {selectedAdvisory.cisaKev.notes}
                  {selectedAdvisory.cisaKev.ransomwareUse && (
                    <span style={{ marginLeft: "0.5rem", background: "#EF4444", color: "#fff", padding: "0.1rem 0.4rem", borderRadius: "3px", fontSize: "0.7rem", fontWeight: 700 }}>
                      KNOWN RANSOMWARE WEAPON
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Modal Tabs Navigation */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(10, 14, 23, 0.95)",
              padding: "0 2rem",
              overflowX: "auto"
            }}>
              {[
                { id: "global", label: "🌐 Global & Tech Analysis" },
                { id: "ide_build", label: "💻 Developer & Build Exposure" },
                { id: "upstream", label: `📡 Upstream Signals (${selectedAdvisory.upstreamSignals.length})` },
                { id: "targets", label: "🎯 Targets & Remediation" },
                { id: "export", label: "📋 JSON & cURL Export" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDossierTab(tab.id as any)}
                  style={{
                    padding: "1rem 1.25rem",
                    background: "none",
                    border: "none",
                    borderBottom: dossierTab === tab.id ? "2px solid #3B82F6" : "2px solid transparent",
                    color: dossierTab === tab.id ? "#93C5FD" : "var(--text-muted)",
                    fontWeight: dossierTab === tab.id ? 700 : 500,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div style={{
              padding: "2rem",
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}>
              {/* TAB 1: Global Threat & Technical Analysis */}
              {dossierTab === "global" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* CVSS & Vector Breakdown */}
                  <div style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "1rem",
                    textAlign: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>CVSS v3.1</div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, color: selectedAdvisory.cvssScore >= 9 ? "#EF4444" : "#F97316" }}>
                        {selectedAdvisory.cvssScore.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Attack Vector</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.4rem" }}>
                        {selectedAdvisory.attackVector}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Complexity</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.4rem" }}>
                        {selectedAdvisory.attackComplexity}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Privileges</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.4rem" }}>
                        {selectedAdvisory.privilegesRequired}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Interaction</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.4rem" }}>
                        {selectedAdvisory.userInteraction}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#60A5FA", fontWeight: 700, marginBottom: "0.4rem" }}>
                      Executive Threat Summary
                    </h4>
                    <p style={{ color: "#E2E8F0", lineHeight: 1.6, fontSize: "0.95rem" }}>
                      {selectedAdvisory.summary}
                    </p>
                  </div>

                  {/* Global Enterprise & Infrastructure Impact (General Awareness) */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#38BDF8", fontWeight: 700, marginBottom: "0.4rem" }}>
                      🌐 Global Software & Infrastructure Impact (General Awareness)
                    </h4>
                    <div style={{
                      background: "rgba(14, 165, 233, 0.08)",
                      border: "1px solid rgba(14, 165, 233, 0.2)",
                      borderRadius: "8px",
                      padding: "1rem 1.25rem",
                      color: "#E0F2FE",
                      fontSize: "0.9rem",
                      lineHeight: 1.6
                    }}>
                      {selectedAdvisory.globalImpact}
                    </div>
                  </div>

                  {/* Technical Root Cause */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#60A5FA", fontWeight: 700, marginBottom: "0.4rem" }}>
                      In-Depth Technical Root Cause
                    </h4>
                    <div style={{
                      background: "rgba(10, 14, 23, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "8px",
                      padding: "1rem 1.25rem",
                      color: "#CBD5E1",
                      fontSize: "0.9rem",
                      lineHeight: 1.65
                    }}>
                      {selectedAdvisory.technicalDetails}
                    </div>
                  </div>

                  {/* Weakness Taxonomy */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#60A5FA", fontWeight: 700, marginBottom: "0.4rem" }}>
                      Weakness Taxonomy & CVSS Vector
                    </h4>
                    <div style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#FBBF24" }}>
                      {selectedAdvisory.cwe}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      Vector: {selectedAdvisory.cvssVector}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Developer & Build System Exposure */}
              {dossierTab === "ide_build" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#6EE7B7", fontWeight: 700 }}>
                        Developer Workstation & Build Exposure Level
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#10B981", marginTop: "0.2rem" }}>
                        {selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv} EXPOSURE
                      </div>
                    </div>
                    <span style={{ fontSize: "2rem" }}>💻</span>
                  </div>

                  {/* Workstation Vector */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#F59E0B", fontWeight: 700, marginBottom: "0.4rem" }}>
                      Workstation Attack Vector
                    </h4>
                    <p style={{ color: "#FDE68A", lineHeight: 1.6, fontSize: "0.95rem", background: "rgba(245, 158, 11, 0.08)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                      {selectedAdvisory.ideBuildImpact.workstationVector}
                    </p>
                  </div>

                  {/* CI/CD & Build Pipeline Risk */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#F87171", fontWeight: 700, marginBottom: "0.4rem" }}>
                      CI/CD & Compiler Pipeline Risk
                    </h4>
                    <div style={{
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "8px",
                      padding: "1rem",
                      color: "#FECACA",
                      fontSize: "0.9rem",
                      lineHeight: 1.6
                    }}>
                      {selectedAdvisory.ideBuildImpact.buildPipelineRisk}
                    </div>
                  </div>

                  {/* IDE Recommendation */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#34D399", fontWeight: 700, marginBottom: "0.4rem" }}>
                      Actionable Recommendation for IDE Builds & Workstations
                    </h4>
                    <div style={{
                      background: "rgba(16, 185, 129, 0.08)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      borderRadius: "8px",
                      padding: "1rem 1.25rem",
                      color: "#A7F3D0",
                      fontSize: "0.92rem",
                      lineHeight: 1.6
                    }}>
                      {selectedAdvisory.ideBuildImpact.recommendationForIdeBuilds}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Upstream Feed Signals Synthesis */}
              {dossierTab === "upstream" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    The following independent cybersecurity databases and threat intelligence organizations contributed signals for this vulnerability:
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {selectedAdvisory.upstreamSignals.map((signal, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          background: "rgba(15, 23, 42, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "10px",
                          padding: "1rem 1.25rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.4rem"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <strong style={{ fontSize: "0.95rem", color: "#F8FAFC" }}>{signal.sourceName}</strong>
                            <span style={{
                              fontSize: "0.7rem",
                              padding: "0.15rem 0.4rem",
                              borderRadius: "4px",
                              background: "rgba(59, 130, 246, 0.15)",
                              color: "#93C5FD"
                            }}>
                              {signal.badge}
                            </span>
                          </div>

                          <span style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: signal.confidence === "CONFIRMED" ? "#34D399" : "#FBBF24"
                          }}>
                            {signal.confidence} CONFIDENCE
                          </span>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: "#CBD5E1", lineHeight: 1.5 }}>
                          {signal.finding}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Affected Targets & Remediation */}
              {dossierTab === "targets" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#60A5FA", fontWeight: 700, marginBottom: "0.75rem" }}>
                      Affected Software Components
                    </h4>
                    <div style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "10px",
                      overflow: "hidden"
                    }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>Product / Component</th>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>Ecosystem</th>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>Affected Versions</th>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>Fixed Version</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAdvisory.affectedTargets.map((tgt, tIdx) => (
                            <tr key={tIdx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#F8FAFC", fontSize: "0.85rem" }}>{tgt.product}</td>
                              <td style={{ padding: "0.75rem 1rem", color: "#CBD5E1", fontSize: "0.85rem" }}>{tgt.ecosystem}</td>
                              <td style={{ padding: "0.75rem 1rem", color: "#F87171", fontSize: "0.85rem", fontFamily: "monospace" }}>{tgt.affectedVersions}</td>
                              <td style={{ padding: "0.75rem 1rem", color: "#34D399", fontSize: "0.85rem", fontFamily: "monospace", fontWeight: 600 }}>{tgt.fixedInVersion || "None / Manual Isolation"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#10B981", fontWeight: 700, marginBottom: "0.4rem" }}>
                      Recommended Remediation Action
                    </h4>
                    <p style={{ color: "#E2E8F0", fontSize: "0.95rem", lineHeight: 1.6 }}>
                      {selectedAdvisory.remediation.recommendedAction}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#60A5FA", fontWeight: 700, marginBottom: "0.4rem" }}>
                      Patch Details & Fix Engineering
                    </h4>
                    <div style={{
                      background: "rgba(10, 14, 23, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "8px",
                      padding: "1rem",
                      color: "#CBD5E1",
                      fontSize: "0.85rem",
                      lineHeight: 1.6
                    }}>
                      {selectedAdvisory.remediation.patchDetails}
                    </div>
                  </div>

                  {selectedAdvisory.remediation.workarounds && selectedAdvisory.remediation.workarounds.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#F59E0B", fontWeight: 700, marginBottom: "0.4rem" }}>
                        Interim Mitigation Workarounds
                      </h4>
                      <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {selectedAdvisory.remediation.workarounds.map((w, wIdx) => (
                          <li key={wIdx} style={{ color: "#CBD5E1", fontSize: "0.85rem", lineHeight: 1.5 }}>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Raw JSON & cURL Export */}
              {dossierTab === "export" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Query this specific advisory via cURL:
                    </span>
                    <button
                      onClick={() => handleCopyModalCurl(selectedAdvisory)}
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "6px",
                        background: "rgba(59, 130, 246, 0.2)",
                        border: "1px solid rgba(59, 130, 246, 0.4)",
                        color: "#93C5FD",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {copiedModalCurl ? "Copied Command!" : "Copy cURL"}
                    </button>
                  </div>

                  <pre style={{
                    background: "rgba(6, 9, 15, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    color: "#93C5FD",
                    fontSize: "0.8rem",
                    fontFamily: "monospace"
                  }}>
                    curl -s &quot;https://secureide.dev/api/threat-feed?id={selectedAdvisory.uviId}&quot; | jq .
                  </pre>

                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Raw Canonical UVI Record (JSON):
                  </span>
                  <pre style={{
                    background: "rgba(6, 9, 15, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    padding: "1rem",
                    color: "#A7F3D0",
                    fontSize: "0.78rem",
                    fontFamily: "monospace",
                    maxHeight: "350px",
                    overflowY: "auto"
                  }}>
                    {JSON.stringify(selectedAdvisory, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "1rem 2rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(15, 23, 42, 0.6)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Standardized under UVI Ordering Schema v3.0 • Universal Vulnerability Intelligence
              </span>
              <button
                onClick={() => setSelectedAdvisory(null)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#F8FAFC",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
