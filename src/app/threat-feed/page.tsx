"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  CONSOLIDATED_UVI_ADVISORIES, 
  UVI_PUBLIC_FEED_SOURCES, 
  UviAdvisoryRecord, 
  PublicFeedSource,
  ThreatSeverity,
  ThreatCategory
} from "@/lib/threat-feed-data";

export default function ThreatFeedPage() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSourceFeed, setSelectedSourceFeed] = useState<string>("ALL");
  const [kevOnly, setKevOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState<"uvi_desc" | "uvi_asc" | "cvss_desc" | "published_desc">("cvss_desc");

  // Inspection Dossier Modal State
  const [selectedAdvisory, setSelectedAdvisory] = useState<UviAdvisoryRecord | null>(null);
  const [dossierTab, setDossierTab] = useState<"technical" | "upstream" | "targets" | "export">("technical");
  const [copiedUviId, setCopiedUviId] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedModalCurl, setCopiedModalCurl] = useState(false);

  // Available categories list
  const categories: ("ALL" | ThreatCategory)[] = [
    "ALL",
    "Runtimes & Toolchains",
    "Infrastructure & Cloud",
    "Supply Chain Malware",
    "Dependencies & Libraries",
    "Operating Systems & Kernels",
    "Developer Tools & IDEs",
    "Networking & Cryptography"
  ];

  // Filter and Sort Logic
  const filteredAdvisories = useMemo(() => {
    return CONSOLIDATED_UVI_ADVISORIES.filter((record) => {
      // 1. Keyword search (UVI ID, CVEs, Title, Headline, Target, CWE, Upstream)
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
        const matchCwe = record.cwe.toLowerCase().includes(q);
        const matchCategory = record.category.toLowerCase().includes(q);
        const matchTargets = record.affectedTargets.some((t) => 
          t.product.toLowerCase().includes(q) || 
          t.ecosystem.toLowerCase().includes(q) ||
          (t.purl && t.purl.toLowerCase().includes(q))
        );
        const matchSignals = record.upstreamSignals.some((s) => 
          s.sourceName.toLowerCase().includes(q) || 
          s.finding.toLowerCase().includes(q)
        );

        if (!matchUvi && !matchCve && !matchGhsa && !matchOsv && !matchMsrc && !matchTitle && !matchHeadline && !matchSummary && !matchTech && !matchCwe && !matchCategory && !matchTargets && !matchSignals) {
          return false;
        }
      }

      // 2. Severity filter
      if (selectedSeverity !== "ALL" && record.severity !== selectedSeverity) {
        return false;
      }

      // 3. Category filter
      if (selectedCategory !== "ALL" && record.category !== selectedCategory) {
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
  }, [searchQuery, selectedSeverity, selectedCategory, selectedSourceFeed, kevOnly, sortBy]);

  // Metric Aggregations
  const totalMonitored = CONSOLIDATED_UVI_ADVISORIES.length;
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
    if (searchQuery) params.set("query", searchQuery);
    if (selectedSeverity !== "ALL") params.set("severity", selectedSeverity);
    if (selectedCategory !== "ALL") params.set("category", selectedCategory);
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
        {/* Breadcrumb / Top Tag */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
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
            Universal Security Registry
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
            12 Upstream Feeds Ingested in Realtime
          </span>
        </div>

        {/* Hero Section */}
        <div style={{ 
          display: "flex", 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          gap: "2rem", 
          marginBottom: "2.5rem",
          flexWrap: "wrap"
        }}>
          <div style={{ maxWidth: "900px" }}>
            <h1 style={{ 
              fontSize: "2.75rem", 
              fontWeight: 800, 
              letterSpacing: "-0.03em", 
              lineHeight: 1.15, 
              marginBottom: "0.75rem",
              background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Consolidated Threat Feed Registry
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Authoritative, cross-ecosystem open vulnerability encyclopedia synthesizing 12 public threat feeds into standardized <code style={{ color: "#60A5FA", fontWeight: 700, background: "rgba(59, 130, 246, 0.12)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>UVI-YYYY-NNNN</code> advisory records. Covering language runtimes, operating systems, cloud containers, cryptographic protocols, and supply chain malware.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span style={{ color: "#3B82F6", fontWeight: 600 }}>Standard:</span>
                <span>UVI Ordering Specification v2.4</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span style={{ color: "#10B981", fontWeight: 600 }}>License:</span>
                <span>Creative Commons BY-4.0 (Universal Open Access)</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span style={{ color: "#F59E0B", fontWeight: 600 }}>API Endpoint:</span>
                <code style={{ fontSize: "0.8rem", color: "#FCD34D" }}>/api/threat-feed</code>
              </div>
            </div>
          </div>

          {/* Quick API Query Trigger & Live cURL Button */}
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
              title="Copy cURL CLI command to query current filtered UVI records"
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
              Direct JSON export available via REST API
            </span>
          </div>
        </div>

        {/* Global Telemetry Statistics Bar */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "1.25rem", 
          marginBottom: "2.5rem" 
        }}>
          {/* Card 1: Total Consolidated UVI Advisories */}
          <div style={{
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600 }}>
                Consolidated Advisories
              </span>
              <span style={{ fontSize: "1.2rem" }}>📚</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              {totalMonitored} <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-muted)" }}>Records</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#60A5FA" }}>
              Ordered using normalized <code>UVI-YYYY-NNNN</code>
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
                Upstream Feeds Ingested
              </span>
              <span style={{ fontSize: "1.2rem" }}>🌐</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34D399", letterSpacing: "-0.02em" }}>
              12 <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-muted)" }}>Authoritative Sources</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {(totalUpstreamRecords / 1000).toFixed(0)}k+ upstream records cross-correlated
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
                CISA KEV Active Zero-Days
              </span>
              <span style={{ fontSize: "1.2rem" }}>🚨</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#EF4444", letterSpacing: "-0.02em" }}>
              {cisaKevCount} <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#FCA5A5" }}>Exploited in Wild</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#F87171" }}>
              Mandatory federal patching directives
            </div>
          </div>

          {/* Card 4: Critical Severity Index */}
          <div style={{
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(249, 115, 22, 0.25)",
            borderRadius: "14px",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#FDBA74", fontWeight: 600 }}>
                Critical CVSS 9.0–10.0
              </span>
              <span style={{ fontSize: "1.2rem" }}>🔥</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#FB923C", letterSpacing: "-0.02em" }}>
              {criticalCount} <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#FDBA74" }}>Advisories</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Includes XZ Utils (10.0) & BatBadBut (10.0)
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
                placeholder="Search across all feeds by UVI ID (e.g. UVI-2024-3094), CVE (e.g. CVE-2024-27982), target runtime, protocol, or CWE..."
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
            {/* Feed Source Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, minWidth: "100px" }}>
                Feed Source:
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
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, minWidth: "100px" }}>
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

            {/* Category Filter Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, minWidth: "100px" }}>
                Category:
              </span>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
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
                      {cat === "ALL" ? "All Categories" : cat}
                    </button>
                  );
                })}
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
            Showing <strong style={{ color: "#F8FAFC" }}>{filteredAdvisories.length}</strong> of {totalMonitored} consolidated advisories
            {selectedSourceFeed !== "ALL" && ` • filtered by feed [${selectedSourceFeed}]`}
            {selectedSeverity !== "ALL" && ` • [${selectedSeverity}]`}
            {selectedCategory !== "ALL" && ` • [${selectedCategory}]`}
            {kevOnly && " • [CISA KEV]"}
          </span>

          {(searchQuery || selectedSeverity !== "ALL" || selectedCategory !== "ALL" || selectedSourceFeed !== "ALL" || kevOnly) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSeverity("ALL");
                setSelectedCategory("ALL");
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
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "1150px" }}>
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
                    <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "190px" }}>
                      UVI Identifier
                    </th>
                    <th style={{ padding: "1.1rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "150px" }}>
                      Severity & CVSS
                    </th>
                    <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8" }}>
                      Advisory Headline & Threat Scope
                    </th>
                    <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "220px" }}>
                      Affected Target(s)
                    </th>
                    <th style={{ padding: "1.1rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "240px" }}>
                      Upstream Feeds
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
                maxHeight: "700px", 
                overflowY: "auto", 
                overflowX: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(59, 130, 246, 0.4) rgba(15, 23, 42, 0.6)"
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "1150px" }}>
                <tbody>
                  {filteredAdvisories.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#F8FAFC", marginBottom: "0.5rem" }}>
                          No matching advisories found
                        </div>
                        <p style={{ fontSize: "0.9rem" }}>
                          Try adjusting your search query or loosening your severity/category filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredAdvisories.map((record) => {
                      const sevStyle = getSeverityStyle(record.severity);
                      return (
                        <tr
                          key={record.uviId}
                          onClick={() => {
                            setSelectedAdvisory(record);
                            setDossierTab("technical");
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
                          <td style={{ padding: "1.1rem 1.25rem", width: "190px", verticalAlign: "top" }}>
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

                              {/* CVE list tag */}
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
                                Pub: {record.publishedDate}
                              </span>
                            </div>
                          </td>

                          {/* Column 2: Severity & CVSS */}
                          <td style={{ padding: "1.1rem 1rem", width: "150px", verticalAlign: "top" }}>
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

                          {/* Column 3: Advisory Headline & Threat Scope */}
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
                                  {record.category}
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

                          {/* Column 4: Affected Target(s) */}
                          <td style={{ padding: "1.1rem 1.25rem", width: "220px", verticalAlign: "top" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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

                          {/* Column 5: Upstream Feeds */}
                          <td style={{ padding: "1.1rem 1rem", width: "240px", verticalAlign: "top" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                              {record.upstreamSignals.map((sig, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    fontSize: "0.7rem",
                                    padding: "0.2rem 0.45rem",
                                    borderRadius: "4px",
                                    background: "rgba(59, 130, 246, 0.1)",
                                    border: "1px solid rgba(59, 130, 246, 0.2)",
                                    color: "#93C5FD",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem"
                                  }}
                                  title={`${sig.sourceName}: ${sig.finding}`}
                                >
                                  <strong>{sig.sourceName}</strong>
                                  <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                                  <span style={{ fontSize: "0.65rem", color: "#E2E8F0" }}>{sig.badge}</span>
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Column 6: Action */}
                          <td style={{ padding: "1.1rem 1.25rem", width: "110px", verticalAlign: "top", textAlign: "right" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAdvisory(record);
                                setDossierTab("technical");
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
                return (
                  <div
                    key={record.uviId}
                    onClick={() => {
                      setSelectedAdvisory(record);
                      setDossierTab("technical");
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
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "1rem" }}>
                        {record.headline}
                      </p>

                      {/* CISA KEV Banner if exploited */}
                      {record.cisaKev.isKnownExploited && (
                        <div style={{
                          marginBottom: "0.75rem",
                          padding: "0.4rem 0.6rem",
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
                          <span>🚨 CISA KEV: Actively Exploited in the Wild</span>
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

                    {/* Card Footer: Upstream Feeds & Action */}
                    <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                        {record.upstreamSignals.slice(0, 3).map((s, idx) => (
                          <span key={idx} style={{ fontSize: "0.68rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", padding: "0.15rem 0.35rem", borderRadius: "3px" }}>
                            {s.sourceName}
                          </span>
                        ))}
                        {record.upstreamSignals.length > 3 && (
                          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                            +{record.upstreamSignals.length - 3} more
                          </span>
                        )}
                      </div>

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
                Multi-Feed Ingestion Engine
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>• 12 Authoritative Public Registries</span>
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              Aggregated Upstream Threat Intelligence Feeds
            </h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "900px", fontSize: "0.95rem", lineHeight: 1.6 }}>
              The SecureIDE Threat Feed engine synthesizes continuous streaming data from 12 public cybersecurity registries without pre-filtering. Each record receives unified taxonomy, cross-linked identifiers, and algorithmic confidence scoring.
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
              Query the UVI Registry via REST API
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              All consolidated threat advisories are programmatically accessible for integration into build pipelines, runtime monitors, and security scanners.
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
              curl -s &quot;https://secureide.dev/api/threat-feed?query=UVI-2024-3094&quot; | jq .advisories
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
              maxWidth: "950px",
              maxHeight: "90vh",
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
                <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <span>Published: <strong style={{ color: "#E2E8F0" }}>{selectedAdvisory.publishedDate}</strong></span>
                  <span>•</span>
                  <span>Updated: <strong style={{ color: "#E2E8F0" }}>{selectedAdvisory.lastUpdatedDate}</strong></span>
                  <span>•</span>
                  <span>Category: <strong style={{ color: "#C4B5FD" }}>{selectedAdvisory.category}</strong></span>
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
                      KNOWN RANSOMWARE USE
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
              padding: "0 2rem"
            }}>
              {[
                { id: "technical", label: "Root Cause & Technical Analysis" },
                { id: "upstream", label: `Upstream Feed Signals (${selectedAdvisory.upstreamSignals.length})` },
                { id: "targets", label: "Affected Targets & Remediation" },
                { id: "export", label: "Raw JSON & cURL Export" }
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
                    transition: "all 0.15s ease"
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
              {/* TAB 1: Technical Root Cause Analysis */}
              {dossierTab === "technical" && (
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
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>CVSS Score</div>
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
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>User Interaction</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.4rem" }}>
                        {selectedAdvisory.userInteraction}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#60A5FA", fontWeight: 700, marginBottom: "0.4rem" }}>
                      Executive Summary
                    </h4>
                    <p style={{ color: "#E2E8F0", lineHeight: 1.6, fontSize: "0.95rem" }}>
                      {selectedAdvisory.summary}
                    </p>
                  </div>

                  {/* Technical Analysis */}
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
                      Weakness Taxonomy
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

              {/* TAB 2: Upstream Feed Signals Synthesis */}
              {dossierTab === "upstream" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    The following upstream registries and security intelligence organizations independently flagged and contributed signals for this advisory:
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

              {/* TAB 3: Affected Targets & Remediation */}
              {dossierTab === "targets" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#60A5FA", fontWeight: 700, marginBottom: "0.75rem" }}>
                      Affected Component Matrix
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
                              <td style={{ padding: "0.75rem 1rem", color: "#34D399", fontSize: "0.85rem", fontFamily: "monospace", fontWeight: 600 }}>{tgt.fixedInVersion || "None / Manual Quarantine"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#10B981", fontWeight: 700, marginBottom: "0.4rem" }}>
                      Recommended Action
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

              {/* TAB 4: Raw JSON & cURL Export */}
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
                    Raw Consolidated UVI Record:
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
                Standardized under UVI Ordering Schema v2.4 • Open Vulnerability Intelligence
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
