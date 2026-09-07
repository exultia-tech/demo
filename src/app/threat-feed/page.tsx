"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  // Quad-Perspective Scope State: "ALL" (Universal Threats) vs "DEV_BUILD" (Developer Exposure) vs "NON_CVE" (Pure Non-CVE Malware) vs "INFORMATIONAL" (Informational Disclosures & Vector Research)
  const [feedScope, setFeedScope] = useState<"ALL" | "DEV_BUILD" | "NON_CVE" | "INFORMATIONAL">("ALL");
  const [nonCveThreatsCount, setNonCveThreatsCount] = useState<number>(35);
  const [informationalDisclosuresCount, setInformationalDisclosuresCount] = useState<number>(6);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedSourceFeed, setSelectedSourceFeed] = useState<string>("ALL");
  const [kevOnly, setKevOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState<"cvss_desc" | "uvi_desc" | "uvi_asc" | "published_desc">("cvss_desc");

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Live Aggregated Data State
  const [advisories, setAdvisories] = useState<UviAdvisoryRecord[]>(CONSOLIDATED_UVI_ADVISORIES);
  const [totalUniversalCount, setTotalUniversalCount] = useState<number>(1787);
  const [directBuildImpactCount, setDirectBuildImpactCount] = useState<number>(385);
  const [matchedCount, setMatchedCount] = useState<number>(1787);
  const [totalPages, setTotalPages] = useState<number>(35);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLiveSynced, setHasLiveSynced] = useState<boolean>(false);

  // Inspection Dossier Modal State
  const [selectedAdvisory, setSelectedAdvisory] = useState<UviAdvisoryRecord | null>(null);
  const [dossierTab, setDossierTab] = useState<"overview" | "workstation" | "sources">("overview");
  const [copiedUviId, setCopiedUviId] = useState<string | null>(null);
  const [copiedModalCurl, setCopiedModalCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

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

  // Fetch from Aggregator API whenever filters, search, or pagination changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("query", searchQuery.trim());
        if (feedScope === "DEV_BUILD") params.set("scope", "build-impact");
        if (feedScope === "NON_CVE") params.set("scope", "non-cve");
        if (feedScope === "INFORMATIONAL") params.set("scope", "informational");
        if (selectedSeverity !== "ALL") params.set("severity", selectedSeverity);
        if (selectedDomain !== "ALL") params.set("domain", selectedDomain);
        if (selectedSourceFeed !== "ALL") params.set("source", selectedSourceFeed);
        if (kevOnly) params.set("kevOnly", "true");
        params.set("page", page.toString());
        params.set("limit", pageSize.toString());

        const res = await fetch(`/api/threat-feed?${params.toString()}`);
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data && Array.isArray(data.advisories)) {
            // Sort records according to sortBy state
            const sorted = [...data.advisories].sort((a: UviAdvisoryRecord, b: UviAdvisoryRecord) => {
              if (sortBy === "cvss_desc") return b.cvssScore - a.cvssScore;
              if (sortBy === "uvi_desc") return b.uviId.localeCompare(a.uviId);
              if (sortBy === "uvi_asc") return a.uviId.localeCompare(b.uviId);
              if (sortBy === "published_desc") return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
              return 0;
            });

            setAdvisories(sorted);
            setTotalUniversalCount(data.totalConsolidatedCount || 1787);
            setDirectBuildImpactCount(data.directBuildImpactCount || 385);
            setNonCveThreatsCount(data.nonCveThreatsCount || 35);
            setInformationalDisclosuresCount(data.informationalDisclosuresCount || 6);
            setMatchedCount(data.matchedAdvisoriesCount ?? sorted.length);
            setTotalPages(data.totalPages || Math.ceil((data.matchedAdvisoriesCount || sorted.length) / pageSize));
            setHasLiveSynced(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live aggregated UVI feed:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, feedScope, selectedSeverity, selectedDomain, selectedSourceFeed, kevOnly, page, pageSize, sortBy]);

  // Reset page to 1 when filters change
  const handleFilterChange = (setter: () => void) => {
    setPage(1);
    setter();
  };

  const handleCopyUviId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedUviId(id);
    setTimeout(() => setCopiedUviId(null), 2500);
  };


  const handleCopyModalCurl = (record: UviAdvisoryRecord) => {
    const curlCmd = `curl -s "https://secureide.dev/api/threat-feed?id=${record.uviId}" | jq .`;
    navigator.clipboard.writeText(curlCmd);
    setCopiedModalCurl(true);
    setTimeout(() => setCopiedModalCurl(false), 2500);
  };

  const handleCopyJson = (record: UviAdvisoryRecord) => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
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

  const totalUpstreamRecords = UVI_PUBLIC_FEED_SOURCES.reduce((acc, f) => acc + f.recordsIngested, 0);

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2.5rem 2rem 5rem", width: "100%" }}>
      {/* Top Header Row: Title & Subtitle (Left) + Threat Total Tile (Right) */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "stretch", 
        gap: "2rem", 
        marginBottom: "1.5rem",
        flexWrap: "wrap"
      }}>
        {/* Left Column: Banner, Title & Subtitle */}
        <div style={{ flex: "1 1 540px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Top Banner Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ 
              fontSize: "0.72rem", 
              fontWeight: 700, 
              letterSpacing: "0.08em", 
              textTransform: "uppercase", 
              padding: "0.25rem 0.65rem", 
              borderRadius: "6px", 
              background: "rgba(59, 130, 246, 0.15)", 
              color: "#60A5FA",
              border: "1px solid rgba(59, 130, 246, 0.3)"
            }}>
              Standalone Vulnerability Registry
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>•</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
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
              {hasLiveSynced ? `Live Ingestion Active (${totalUniversalCount.toLocaleString()} Records Streamed)` : "12 Synchronized Upstream Public Feeds"}
            </span>
          </div>

          <h1 style={{ 
            fontSize: "2.35rem", 
            fontWeight: 800, 
            letterSpacing: "-0.03em", 
            color: "#F8FAFC",
            marginBottom: "0.5rem",
            lineHeight: 1.2
          }}>
            Universal Vulnerability Intelligence (UVI) Threat Feed
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: "720px", lineHeight: 1.6, margin: 0 }}>
            Consolidated real-time threat intelligence synthesizing official CVEs, active zero-days, and supply chain malware into standardized <code style={{ color: "#60A5FA", fontWeight: 700, background: "rgba(59, 130, 246, 0.12)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>UVI-YYYY-NNNN</code> records.
          </p>
        </div>

        {/* Right Column: Threat Total Summary Tile */}
        <div style={{
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "1.4rem 1.65rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
          minWidth: "320px",
          flex: "0 1 360px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)"
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", fontWeight: 700, marginBottom: "0.35rem" }}>
              Total Consolidated Threats
            </div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {totalUniversalCount.toLocaleString()}
            </div>
          </div>
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.6rem", 
            fontSize: "0.8rem", 
            color: "var(--text-muted)", 
            borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
            paddingTop: "0.75rem" 
          }}>
            <span>🚨 <strong style={{ color: "#EF4444" }}>1,695+</strong> Zero-Days</span>
            <span>•</span>
            <span>💻 <strong style={{ color: "#10B981" }}>{directBuildImpactCount.toLocaleString()}</strong> Workstation</span>
            <span>•</span>
            <span>🛡️ <strong style={{ color: "#EC4899" }}>{nonCveThreatsCount.toLocaleString()}</strong> Non-CVE</span>
            <span>•</span>
            <span>📡 <strong style={{ color: "#818CF8" }}>{informationalDisclosuresCount.toLocaleString()}</strong> Informational</span>
          </div>
        </div>
      </div>

      {/* Simplified Feed Sources Strip (Compact listing, not tall) */}
      <div style={{
        background: "rgba(15, 23, 42, 0.55)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "0.75rem 1.25rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", fontWeight: 700 }}>
            Feed Sources:
          </span>
          <span style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "0.15rem 0.5rem",
            borderRadius: "4px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#34D399",
            border: "1px solid rgba(16, 185, 129, 0.3)"
          }}>
            {UVI_PUBLIC_FEED_SOURCES.length} Feeds
          </span>
        </div>

        {/* Compact inline feed list */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "0.35rem 0.5rem", 
          alignItems: "center", 
          flex: 1 
        }}>
          {UVI_PUBLIC_FEED_SOURCES.map((feed) => {
            const isSelected = selectedSourceFeed === feed.id;
            return (
              <span
                key={feed.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "5px",
                  background: isSelected ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  border: isSelected ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.07)",
                  color: isSelected ? "#93C5FD" : "#CBD5E1",
                  fontSize: "0.76rem",
                  fontWeight: 500
                }}
                title={`${feed.name}: ${feed.scope} (${feed.recordsIngested.toLocaleString()} records)`}
              >
                <span style={{ fontSize: "0.85rem" }}>{feed.icon}</span>
                <span>{feed.name.replace("NIST ", "").replace(" Database", "").replace(" Security", "").replace(" (MSRC)", "").replace(" Advisories", "")}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Unified Filter Control Bar */}
      <div style={{
        background: "rgba(15, 20, 32, 0.8)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.3)"
      }}>
        {/* Row 1: Search Input */}
        <div style={{ position: "relative", width: "100%" }}>
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
            onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
            placeholder="Search across all 1,780+ threats by UVI ID, CVE, product, vendor, protocol, or CWE..."
            style={{
              width: "100%",
              padding: "0.85rem 2.8rem 0.85rem 2.85rem",
              background: "rgba(10, 14, 23, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "10px",
              color: "#F8FAFC",
              fontSize: "0.95rem",
              outline: "none"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => handleFilterChange(() => setSearchQuery(""))}
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

        {/* Row 2: Clean Dropdown Filter Controls */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          {/* Feed Source Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, minWidth: "180px" }}>
            <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
              Feed Source
            </label>
            <select
              value={selectedSourceFeed}
              onChange={(e) => handleFilterChange(() => setSelectedSourceFeed(e.target.value))}
              style={{
                padding: "0.65rem 0.9rem",
                background: "rgba(10, 14, 23, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
                width: "100%"
              }}
            >
              <option value="ALL">All Feeds ({UVI_PUBLIC_FEED_SOURCES.length} Sources)</option>
              {UVI_PUBLIC_FEED_SOURCES.map((feed) => (
                <option key={feed.id} value={feed.id}>
                  {feed.icon} {feed.name}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type / Domain Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, minWidth: "210px" }}>
            <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
              Event Type / Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => handleFilterChange(() => setSelectedDomain(e.target.value))}
              style={{
                padding: "0.65rem 0.9rem",
                background: "rgba(10, 14, 23, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
                width: "100%"
              }}
            >
              {domainCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "ALL" ? "All Event Types & Domains" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Threat Scope Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, minWidth: "190px" }}>
            <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
              Threat Scope
            </label>
            <select
              value={feedScope}
              onChange={(e) => handleFilterChange(() => setFeedScope(e.target.value as any))}
              style={{
                padding: "0.65rem 0.9rem",
                background: "rgba(10, 14, 23, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
                width: "100%"
              }}
            >
              <option value="ALL">🌐 All Universal Advisories ({totalUniversalCount.toLocaleString()})</option>
              <option value="DEV_BUILD">💻 Developer & Build Exposure ({directBuildImpactCount.toLocaleString()})</option>
              <option value="NON_CVE">🛡️ Pure Non-CVE Threats ({nonCveThreatsCount.toLocaleString()})</option>
              <option value="INFORMATIONAL">📡 Informational Disclosures & Vector Research ({informationalDisclosuresCount.toLocaleString()})</option>
            </select>
          </div>

          {/* Severity Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "140px" }}>
            <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
              Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => handleFilterChange(() => setSelectedSeverity(e.target.value))}
              style={{
                padding: "0.65rem 0.9rem",
                background: "rgba(10, 14, 23, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
                width: "100%"
              }}
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical (9.0 - 10.0)</option>
              <option value="HIGH">High (7.0 - 8.9)</option>
              <option value="MEDIUM">Medium (4.0 - 6.9)</option>
              <option value="LOW">Low (0.1 - 3.9)</option>
            </select>
          </div>

          {/* Sort Order Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "150px" }}>
            <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: "0.65rem 0.9rem",
                background: "rgba(10, 14, 23, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
                width: "100%"
              }}
            >
              <option value="cvss_desc">CVSS (Highest First)</option>
              <option value="uvi_desc">UVI ID (Descending)</option>
              <option value="uvi_asc">UVI ID (Ascending)</option>
              <option value="published_desc">Date (Newest First)</option>
            </select>
          </div>

          {/* Reset Filters button if any filter is active */}
          {(searchQuery || selectedSeverity !== "ALL" || selectedDomain !== "ALL" || selectedSourceFeed !== "ALL" || feedScope !== "ALL" || kevOnly) && (
            <button
              onClick={() => {
                setFeedScope("ALL");
                setSearchQuery("");
                setSelectedSeverity("ALL");
                setSelectedDomain("ALL");
                setSelectedSourceFeed("ALL");
                setKevOnly(false);
                setPage(1);
              }}
              style={{
                padding: "0.65rem 1rem",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "8px",
                color: "#FCA5A5",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              ✕ Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Metadata & Reset Filters */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "1rem",
        padding: "0 0.5rem",
        flexWrap: "wrap",
        gap: "0.75rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Showing page <strong style={{ color: "#F8FAFC" }}>{page}</strong> of {totalPages} (<strong style={{ color: "#F8FAFC" }}>{matchedCount.toLocaleString()}</strong> matched advisories out of {totalUniversalCount.toLocaleString()} total)
          </span>
          {isLoading && (
            <span style={{ fontSize: "0.75rem", color: "#60A5FA", background: "rgba(59, 130, 246, 0.15)", padding: "0.15rem 0.5rem", borderRadius: "10px" }}>
              Streaming...
            </span>
          )}
        </div>

        {(searchQuery || selectedSeverity !== "ALL" || selectedDomain !== "ALL" || selectedSourceFeed !== "ALL" || kevOnly || feedScope !== "ALL") && (
          <button
            onClick={() => {
              setFeedScope("ALL");
              setSearchQuery("");
              setSelectedSeverity("ALL");
              setSelectedDomain("ALL");
              setSelectedSourceFeed("ALL");
              setKevOnly(false);
              setPage(1);
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
          marginBottom: "1.5rem"
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
                {advisories.length === 0 ? (
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
                  advisories.map((record) => {
                    const sevStyle = getSeverityStyle(record.severity);
                    const hasDevImpact = record.ideBuildImpact.hasDirectBuildImpact;

                    return (
                      <tr
                        key={record.uviId}
                        onClick={() => {
                          setSelectedAdvisory(record);
                          setDossierTab("overview");
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

                            {/* CVE list tags or Non-CVE badge */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                              {record.cveList.length > 0 ? (
                                record.cveList.map((cve) => (
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
                                ))
                              ) : record.disclosureType === "INFORMATIONAL_DISCLOSURE" ? (
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    background: "rgba(129, 140, 248, 0.2)",
                                    color: "#A5B4FC",
                                    border: "1px solid rgba(129, 140, 248, 0.4)",
                                    padding: "0.1rem 0.4rem",
                                    borderRadius: "4px"
                                  }}
                                >
                                  📡 INFORMATIONAL DISCLOSURE
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    background: record.affectedTargets[0]?.ecosystem?.includes("VS Code") 
                                      ? "rgba(168, 85, 247, 0.2)" 
                                      : record.affectedTargets[0]?.ecosystem?.includes("GitHub Actions")
                                      ? "rgba(59, 130, 246, 0.2)"
                                      : "rgba(236, 72, 153, 0.2)",
                                    color: record.affectedTargets[0]?.ecosystem?.includes("VS Code") 
                                      ? "#C084FC" 
                                      : record.affectedTargets[0]?.ecosystem?.includes("GitHub Actions")
                                      ? "#93C5FD"
                                      : "#F472B6",
                                    border: record.affectedTargets[0]?.ecosystem?.includes("VS Code") 
                                      ? "1px solid rgba(168, 85, 247, 0.4)" 
                                      : record.affectedTargets[0]?.ecosystem?.includes("GitHub Actions")
                                      ? "1px solid rgba(59, 130, 246, 0.4)"
                                      : "1px solid rgba(236, 72, 153, 0.4)",
                                    padding: "0.1rem 0.4rem",
                                    borderRadius: "4px"
                                  }}
                                >
                                  {record.affectedTargets[0]?.ecosystem?.includes("VS Code") 
                                    ? "🧩 MALICIOUS EXTENSION" 
                                    : record.affectedTargets[0]?.ecosystem?.includes("GitHub Actions")
                                    ? "⚡ WORKFLOW EXPLOIT"
                                    : "🛡️ NON-CVE MALWARE"}
                                </span>
                              )}
                            </div>

                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                              {record.publishedDate}
                            </span>
                          </div>
                        </td>

                        {/* Column 2: Severity & CVSS / Chatter Velocity */}
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

                            {record.informationalSynthesis ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <span style={{
                                  fontSize: "0.68rem",
                                  fontWeight: 800,
                                  color: record.informationalSynthesis.chatterVelocity === "VIRAL" ? "#F43F5E" : "#818CF8",
                                  background: record.informationalSynthesis.chatterVelocity === "VIRAL" ? "rgba(244, 63, 94, 0.15)" : "rgba(129, 140, 248, 0.15)",
                                  border: `1px solid ${record.informationalSynthesis.chatterVelocity === "VIRAL" ? "rgba(244, 63, 94, 0.3)" : "rgba(129, 140, 248, 0.3)"}`,
                                  padding: "0.15rem 0.45rem",
                                  borderRadius: "4px",
                                  width: "fit-content"
                                }}>
                                  {record.informationalSynthesis.chatterVelocity === "VIRAL" ? "🔥 VIRAL" : "⚡ CHATTER"}
                                </span>
                                <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>
                                  {record.informationalSynthesis.consensusLevel.replace(/_/g, " ")}
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                                <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#F8FAFC" }}>
                                  {record.cvssScore.toFixed(1)}
                                </span>
                                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>CVSS v3.1</span>
                              </div>
                            )}

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

                            {record.informationalSynthesis && (
                              <div style={{ 
                                fontSize: "0.78rem", 
                                color: "#C7D2FE", 
                                background: "rgba(99, 102, 241, 0.1)", 
                                padding: "0.4rem 0.65rem", 
                                borderRadius: "6px", 
                                borderLeft: "3px solid #818CF8",
                                marginTop: "0.2rem",
                                lineHeight: 1.5
                              }}>
                                💡 <strong>Executive Digest:</strong> {record.informationalSynthesis.executiveBrief}
                              </div>
                            )}

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
                            {record.informationalSynthesis ? (
                              <>
                                <span style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  padding: "0.2rem 0.5rem",
                                  borderRadius: "4px",
                                  background: "rgba(129, 140, 248, 0.15)",
                                  border: "1px solid rgba(129, 140, 248, 0.3)",
                                  color: "#C7D2FE",
                                  width: "fit-content"
                                }}>
                                  📡 {record.informationalSynthesis.vectorCategory}
                                </span>
                                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                                  Target: {record.informationalSynthesis.potentialVictimSurface.slice(0, 2).join(", ")}
                                </span>
                              </>
                            ) : (
                              <>
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
                                    <span>💻 Dev & Build:</span>
                                    <strong>{record.ideBuildImpact.severityOnDeveloperEnv}</strong>
                                  </span>
                                ) : (
                                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                    Server / Enterprise Scope
                                  </span>
                                )}
                              </>
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
                              setDossierTab("overview");
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
          marginBottom: "1.5rem"
        }}>
          {advisories.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#F8FAFC" }}>No matching advisories found</div>
            </div>
          ) : (
            advisories.map((record) => {
              const sevStyle = getSeverityStyle(record.severity);
              const hasDevImpact = record.ideBuildImpact.hasDirectBuildImpact;

              return (
                <div
                  key={record.uviId}
                  onClick={() => {
                    setSelectedAdvisory(record);
                    setDossierTab("overview");
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

      {/* PAGINATION CONTROLS BAR */}
      <div style={{
        background: "rgba(15, 20, 32, 0.9)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "0.9rem 1.5rem",
        marginBottom: "3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing {((page - 1) * pageSize) + 1} – {Math.min(page * pageSize, matchedCount)} of <strong style={{ color: "#F8FAFC" }}>{matchedCount.toLocaleString()}</strong> advisories
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
              style={{
                background: "rgba(10, 14, 23, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "6px",
                padding: "0.25rem 0.5rem",
                color: "#F8FAFC",
                fontSize: "0.8rem",
                cursor: "pointer"
              }}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
        </div>

        {/* Page Jump and Next/Prev buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setPage(1)}
            disabled={page <= 1}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              background: page <= 1 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: page <= 1 ? "rgba(255, 255, 255, 0.2)" : "#F8FAFC",
              fontSize: "0.8rem",
              cursor: page <= 1 ? "not-allowed" : "pointer"
            }}
          >
            « First
          </button>

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "6px",
              background: page <= 1 ? "rgba(255, 255, 255, 0.02)" : "rgba(59, 130, 246, 0.15)",
              border: page <= 1 ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(59, 130, 246, 0.35)",
              color: page <= 1 ? "rgba(255, 255, 255, 0.2)" : "#93C5FD",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: page <= 1 ? "not-allowed" : "pointer"
            }}
          >
            ‹ Previous
          </button>

          <span style={{ fontSize: "0.85rem", color: "#F8FAFC", fontWeight: 700, padding: "0 0.5rem" }}>
            Page {page} of {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "6px",
              background: page >= totalPages ? "rgba(255, 255, 255, 0.02)" : "rgba(59, 130, 246, 0.15)",
              border: page >= totalPages ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(59, 130, 246, 0.35)",
              color: page >= totalPages ? "rgba(255, 255, 255, 0.2)" : "#93C5FD",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: page >= totalPages ? "not-allowed" : "pointer"
            }}
          >
            Next ›
          </button>

          <button
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              background: page >= totalPages ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: page >= totalPages ? "rgba(255, 255, 255, 0.2)" : "#F8FAFC",
              fontSize: "0.8rem",
              cursor: page >= totalPages ? "not-allowed" : "pointer"
            }}
          >
            Last »
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
              background: "#0A0E17",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "880px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(59, 130, 246, 0.12)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Streamlined Modal Header */}
            <div style={{
              padding: "1.25rem 1.75rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(15, 23, 42, 0.5)"
            }}>
              {/* Top Row: Identifier, Badges, and Quick Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "monospace",
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#60A5FA",
                    letterSpacing: "-0.01em"
                  }}>
                    {selectedAdvisory.uviId}
                  </span>

                  {/* Severity Pill */}
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.55rem",
                    borderRadius: "4px",
                    background: selectedAdvisory.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.2)" :
                               selectedAdvisory.severity === "HIGH" ? "rgba(249, 115, 22, 0.2)" :
                               selectedAdvisory.severity === "MEDIUM" ? "rgba(245, 158, 11, 0.2)" : "rgba(59, 130, 246, 0.2)",
                    color: selectedAdvisory.severity === "CRITICAL" ? "#FCA5A5" :
                           selectedAdvisory.severity === "HIGH" ? "#FDBA74" :
                           selectedAdvisory.severity === "MEDIUM" ? "#FCD34D" : "#93C5FD",
                    border: `1px solid ${selectedAdvisory.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.1)"}`
                  }}>
                    {selectedAdvisory.severity} {selectedAdvisory.cvssScore.toFixed(1)}
                  </span>

                  {/* Context / Scope Badge */}
                  {selectedAdvisory.disclosureType === "INFORMATIONAL_DISCLOSURE" ? (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "4px",
                      background: "rgba(245, 158, 11, 0.18)",
                      color: "#FCD34D",
                      border: "1px solid rgba(245, 158, 11, 0.35)"
                    }}>
                      📡 INFORMATIONAL DISCLOSURE
                    </span>
                  ) : selectedAdvisory.cisaKev.isKnownExploited ? (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "4px",
                      background: "rgba(239, 68, 68, 0.18)",
                      color: "#FCA5A5",
                      border: "1px solid rgba(239, 68, 68, 0.35)"
                    }}>
                      🚨 CISA KEV (ACTIVE EXPLOIT)
                    </span>
                  ) : selectedAdvisory.cveList.length === 0 ? (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "4px",
                      background: "rgba(236, 72, 153, 0.18)",
                      color: "#F472B6",
                      border: "1px solid rgba(236, 72, 153, 0.35)"
                    }}>
                      🛡️ SUPPLY CHAIN MALWARE
                    </span>
                  ) : (
                    selectedAdvisory.cveList.slice(0, 2).map((cve) => (
                      <span key={cve} style={{ fontFamily: "monospace", fontSize: "0.72rem", background: "rgba(255, 255, 255, 0.08)", padding: "0.2rem 0.45rem", borderRadius: "4px", color: "#CBD5E1" }}>
                        {cve}
                      </span>
                    ))
                  )}
                </div>

                {/* Header Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleCopyUviId(selectedAdvisory.uviId)}
                    style={{
                      background: "rgba(59, 130, 246, 0.12)",
                      border: "1px solid rgba(59, 130, 246, 0.25)",
                      color: copiedUviId === selectedAdvisory.uviId ? "#34D399" : "#93C5FD",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    {copiedUviId === selectedAdvisory.uviId ? "Copied ID!" : "Copy ID"}
                  </button>

                  <button
                    onClick={() => handleCopyJson(selectedAdvisory)}
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: copiedJson ? "#34D399" : "#CBD5E1",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    {copiedJson ? "Copied JSON!" : "Copy JSON"}
                  </button>

                  <button
                    onClick={() => setSelectedAdvisory(null)}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      color: "#94A3B8",
                      width: "30px",
                      height: "30px",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "1rem",
                      cursor: "pointer",
                      marginLeft: "0.25rem"
                    }}
                    title="Close Dossier"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Advisory Title */}
              <h2 style={{ fontSize: "1.12rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.35, margin: "0.5rem 0 0.35rem 0" }}>
                {selectedAdvisory.title}
              </h2>

              {/* Metadata Subtitle */}
              <div style={{ display: "flex", gap: "0.65rem", fontSize: "0.76rem", color: "var(--text-muted)", flexWrap: "wrap", alignItems: "center" }}>
                <span>Domain: <strong style={{ color: "#C4B5FD" }}>{selectedAdvisory.domainCategory}</strong></span>
                <span>•</span>
                <span>Source: <strong style={{ color: "#93C5FD" }}>{selectedAdvisory.upstreamSignals[0]?.sourceName || "Standardized Feed"}</strong></span>
                <span>•</span>
                <span>Published: <strong style={{ color: "#E2E8F0" }}>{selectedAdvisory.publishedDate}</strong></span>
                <span>•</span>
                <span>Workstation Risk: <strong style={{ color: selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv === "CRITICAL" ? "#F87171" : selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv === "HIGH" ? "#FDBA74" : "#6EE7B7" }}>{selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv}</strong></span>
              </div>
            </div>

            {/* Streamlined Tabs Navigation (3 Clean Tabs) */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(8, 12, 20, 0.95)",
              padding: "0 1.75rem",
              overflowX: "auto"
            }}>
              {[
                { id: "overview", label: "📋 Threat Overview & Mechanism" },
                { id: "workstation", label: "💻 Developer & Workstation Impact" },
                { 
                  id: "sources", 
                  label: selectedAdvisory.disclosureType === "INFORMATIONAL_DISCLOSURE"
                    ? `📰 Journalism & Citations (${selectedAdvisory.informationalSynthesis?.primarySources.length || 0})`
                    : `📡 Intelligence Feeds (${selectedAdvisory.upstreamSignals.length})` 
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDossierTab(tab.id as any)}
                  style={{
                    padding: "0.85rem 1.15rem",
                    background: "none",
                    border: "none",
                    borderBottom: dossierTab === tab.id ? "2px solid #3B82F6" : "2px solid transparent",
                    color: dossierTab === tab.id ? "#93C5FD" : "var(--text-muted)",
                    fontWeight: dossierTab === tab.id ? 700 : 500,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body (Scrollable, Clean spacing) */}
            <div style={{
              padding: "1.5rem 1.75rem",
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}>
              {/* TAB 1: Overview & Mechanism */}
              {dossierTab === "overview" && (
                selectedAdvisory.disclosureType === "INFORMATIONAL_DISCLOSURE" && selectedAdvisory.informationalSynthesis ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Key Metrics Strip */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: "0.75rem"
                    }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Vector Category</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.2rem" }}>
                          {selectedAdvisory.informationalSynthesis.vectorCategory}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Chatter Velocity</div>
                        <div style={{ marginTop: "0.2rem", fontSize: "0.82rem", fontWeight: 700, color: selectedAdvisory.informationalSynthesis.chatterVelocity === "VIRAL" ? "#FCA5A5" : "#FDBA74" }}>
                          {selectedAdvisory.informationalSynthesis.chatterVelocity === "VIRAL" ? "🔥 Viral Chatter" :
                           selectedAdvisory.informationalSynthesis.chatterVelocity === "HIGH" ? "⚡ High Velocity" : "📈 Moderate"}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Consensus Level</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#C4B5FD", marginTop: "0.2rem" }}>
                          {selectedAdvisory.informationalSynthesis.consensusLevel.replace(/_/g, " ")}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated CVSS</div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#F97316", marginTop: "0.15rem" }}>
                          {selectedAdvisory.cvssScore.toFixed(1)} <span style={{ fontSize: "0.7rem", fontWeight: 500, color: "var(--text-muted)" }}>({selectedAdvisory.attackVector})</span>
                        </div>
                      </div>
                    </div>

                    {/* Executive Digest Card */}
                    <div style={{
                      background: "rgba(245, 158, 11, 0.04)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                      borderLeft: "3px solid #F59E0B",
                      borderRadius: "8px",
                      padding: "0.9rem 1.15rem"
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#FBBF24", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
                        💡 Executive Digest
                      </div>
                      <p style={{ color: "#FEF3C7", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                        {selectedAdvisory.informationalSynthesis.executiveBrief}
                      </p>
                    </div>

                    {/* Inferred Threat Vector & Mechanism */}
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#60A5FA", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                        ⚙️ Inferred Attack Mechanism & Vector Execution
                      </div>
                      <div style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "8px",
                        padding: "0.9rem 1.15rem",
                        color: "#CBD5E1",
                        fontSize: "0.85rem",
                        lineHeight: 1.65
                      }}>
                        {selectedAdvisory.informationalSynthesis.inferredMechanism}
                      </div>
                    </div>

                    {/* Precautionary Posture & Actionable Hygiene */}
                    <div style={{
                      background: "rgba(16, 185, 129, 0.04)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderLeft: "3px solid #10B981",
                      borderRadius: "8px",
                      padding: "0.9rem 1.15rem"
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#34D399", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
                        🛡️ Precautionary Defensive Posture (Pre-Patch Guidance)
                      </div>
                      <p style={{ color: "#D1FAE5", fontSize: "0.86rem", lineHeight: 1.6, margin: 0 }}>
                        {selectedAdvisory.informationalSynthesis.precautionaryPosture}
                      </p>
                    </div>

                    {/* Potential Victim Surface */}
                    {selectedAdvisory.informationalSynthesis.potentialVictimSurface && (
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", paddingTop: "0.25rem" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                          Target Surfaces:
                        </span>
                        {selectedAdvisory.informationalSynthesis.potentialVictimSurface.map((surf, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: "0.72rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              background: "rgba(56, 189, 248, 0.1)",
                              border: "1px solid rgba(56, 189, 248, 0.2)",
                              color: "#BAE6FD"
                            }}
                          >
                            {surf}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* CVSS & Vector Breakdown */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "0.6rem"
                    }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>CVSS v3.1</div>
                        <div style={{ fontSize: "1.35rem", fontWeight: 800, color: selectedAdvisory.cvssScore >= 9 ? "#EF4444" : "#F97316" }}>
                          {selectedAdvisory.cvssScore.toFixed(1)}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Attack Vector</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.3rem" }}>
                          {selectedAdvisory.attackVector}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Complexity</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.3rem" }}>
                          {selectedAdvisory.attackComplexity}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Privileges</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.3rem" }}>
                          {selectedAdvisory.privilegesRequired}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>User Interaction</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.3rem" }}>
                          {selectedAdvisory.userInteraction}
                        </div>
                      </div>
                    </div>

                    {/* Executive Threat Summary */}
                    <div style={{
                      background: "rgba(59, 130, 246, 0.04)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      borderLeft: "3px solid #3B82F6",
                      borderRadius: "8px",
                      padding: "0.9rem 1.15rem"
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#60A5FA", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
                        Executive Threat Summary
                      </div>
                      <p style={{ color: "#E2E8F0", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                        {selectedAdvisory.summary}
                      </p>
                    </div>

                    {/* Technical Root Cause & Weakness */}
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#93C5FD", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                        In-Depth Technical Root Cause
                      </div>
                      <div style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "8px",
                        padding: "0.9rem 1.15rem",
                        color: "#CBD5E1",
                        fontSize: "0.85rem",
                        lineHeight: 1.6
                      }}>
                        <p style={{ margin: "0 0 0.5rem 0" }}>{selectedAdvisory.technicalDetails}</p>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.75rem", color: "var(--text-muted)", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "0.5rem" }}>
                          <span>Taxonomy: <strong style={{ color: "#FBBF24" }}>{selectedAdvisory.cwe}</strong></span>
                          <span>CVSS Vector: <code style={{ color: "#93C5FD" }}>{selectedAdvisory.cvssVector}</code></span>
                        </div>
                      </div>
                    </div>

                    {/* Remediation & Actionable Fix */}
                    <div style={{
                      background: "rgba(16, 185, 129, 0.04)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderLeft: "3px solid #10B981",
                      borderRadius: "8px",
                      padding: "0.9rem 1.15rem"
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#34D399", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
                        Recommended Remediation & Fix
                      </div>
                      <p style={{ color: "#D1FAE5", fontSize: "0.86rem", lineHeight: 1.6, margin: "0 0 0.4rem 0" }}>
                        {selectedAdvisory.remediation.recommendedAction}
                      </p>
                      {selectedAdvisory.remediation.patchDetails && (
                        <div style={{ fontSize: "0.78rem", color: "#A7F3D0", opacity: 0.9 }}>
                          <strong>Patch:</strong> {selectedAdvisory.remediation.patchDetails}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* TAB 2: Workstation & Pipeline Impact */}
              {dossierTab === "workstation" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Workstation Rating Banner */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
                        Developer Workstation & Build Impact Level
                      </div>
                      <div style={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        color: selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv === "CRITICAL" ? "#F87171" :
                               selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv === "HIGH" ? "#FDBA74" : "#34D399",
                        marginTop: "0.2rem"
                      }}>
                        {selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv} WORKSTATION EXPOSURE
                      </div>
                    </div>
                    <span style={{ fontSize: "1.8rem" }}>💻</span>
                  </div>

                  {/* Workstation Vector */}
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#F59E0B", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
                      Workstation Attack Vector
                    </div>
                    <div style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "8px",
                      padding: "0.85rem 1.1rem",
                      color: "#FDE68A",
                      fontSize: "0.85rem",
                      lineHeight: 1.6
                    }}>
                      {selectedAdvisory.ideBuildImpact.workstationVector}
                    </div>
                  </div>

                  {/* Build Pipeline Risk */}
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#F87171", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
                      CI/CD & Compiler Pipeline Risk
                    </div>
                    <div style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "8px",
                      padding: "0.85rem 1.1rem",
                      color: "#FECACA",
                      fontSize: "0.85rem",
                      lineHeight: 1.6
                    }}>
                      {selectedAdvisory.ideBuildImpact.buildPipelineRisk}
                    </div>
                  </div>

                  {/* IDE Recommendation */}
                  <div style={{
                    background: "rgba(16, 185, 129, 0.04)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderLeft: "3px solid #10B981",
                    borderRadius: "8px",
                    padding: "0.9rem 1.15rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#34D399", marginBottom: "0.35rem", letterSpacing: "0.04em" }}>
                      Recommendation for IDE Builds & Workstations
                    </div>
                    <p style={{ color: "#D1FAE5", fontSize: "0.86rem", lineHeight: 1.6, margin: 0 }}>
                      {selectedAdvisory.ideBuildImpact.recommendationForIdeBuilds}
                    </p>
                  </div>

                  {/* Affected Targets Table (if present) */}
                  {selectedAdvisory.affectedTargets && selectedAdvisory.affectedTargets.length > 0 && (
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#60A5FA", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                        Affected Software Components ({selectedAdvisory.affectedTargets.length})
                      </div>
                      <div style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "8px",
                        overflow: "hidden"
                      }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                          <thead>
                            <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                              <th style={{ padding: "0.55rem 0.85rem", color: "var(--text-muted)" }}>Product</th>
                              <th style={{ padding: "0.55rem 0.85rem", color: "var(--text-muted)" }}>Ecosystem</th>
                              <th style={{ padding: "0.55rem 0.85rem", color: "var(--text-muted)" }}>Affected Versions</th>
                              <th style={{ padding: "0.55rem 0.85rem", color: "var(--text-muted)" }}>Fixed Version</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedAdvisory.affectedTargets.map((tgt, tIdx) => (
                              <tr key={tIdx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                                <td style={{ padding: "0.55rem 0.85rem", fontWeight: 600, color: "#F8FAFC" }}>{tgt.product}</td>
                                <td style={{ padding: "0.55rem 0.85rem", color: "#CBD5E1" }}>{tgt.ecosystem}</td>
                                <td style={{ padding: "0.55rem 0.85rem", color: "#F87171", fontFamily: "monospace" }}>{tgt.affectedVersions}</td>
                                <td style={{ padding: "0.55rem 0.85rem", color: "#34D399", fontFamily: "monospace", fontWeight: 600 }}>{tgt.fixedInVersion || "None / Isolation"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Sources & Intelligence Signals */}
              {dossierTab === "sources" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {selectedAdvisory.disclosureType === "INFORMATIONAL_DISCLOSURE" && selectedAdvisory.informationalSynthesis ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Primary sources, investigative journalism, and research dispatches tracking this threat vector:
                      </div>
                      {selectedAdvisory.informationalSynthesis.primarySources.map((source, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.07)",
                            borderRadius: "8px",
                            padding: "0.85rem 1.1rem"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.35rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 700, color: "#F8FAFC", fontSize: "0.88rem" }}>
                                {source.sourceName}
                              </span>
                              {source.authorOrHandle && (
                                <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                                  by <strong style={{ color: "#E2E8F0" }}>{source.authorOrHandle}</strong>
                                </span>
                              )}
                              <span style={{ fontSize: "0.72rem", color: "#93C5FD" }}>
                                • {source.headline}
                              </span>
                            </div>

                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: "0.74rem",
                                color: "#60A5FA",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontWeight: 600
                              }}
                            >
                              View Dispatch ↗
                            </a>
                          </div>

                          <blockquote style={{
                            margin: "0 0 0.35rem 0",
                            paddingLeft: "0.65rem",
                            borderLeft: "2px solid rgba(192, 132, 252, 0.5)",
                            color: "#CBD5E1",
                            fontSize: "0.82rem",
                            lineHeight: 1.5,
                            fontStyle: "italic"
                          }}>
                            &ldquo;{source.signalQuote}&rdquo;
                          </blockquote>

                          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                            Published: {source.publishedAt}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Consolidated threat intelligence signals ingested for this advisory:
                      </div>
                      {selectedAdvisory.upstreamSignals.map((signal, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.07)",
                            borderRadius: "8px",
                            padding: "0.85rem 1.1rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.35rem"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <strong style={{ fontSize: "0.88rem", color: "#F8FAFC" }}>{signal.sourceName}</strong>
                              <span style={{
                                fontSize: "0.68rem",
                                padding: "0.15rem 0.4rem",
                                borderRadius: "4px",
                                background: "rgba(59, 130, 246, 0.15)",
                                color: "#93C5FD"
                              }}>
                                {signal.badge}
                              </span>
                            </div>
                            <span style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              color: signal.confidence === "CONFIRMED" ? "#34D399" : "#FBBF24"
                            }}>
                              {signal.confidence} CONFIDENCE
                            </span>
                          </div>
                          <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.5, margin: 0 }}>
                            {signal.finding}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Streamlined Modal Footer */}
            <div style={{
              padding: "0.85rem 1.75rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(15, 23, 42, 0.5)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Standardized under UVI Ordering Schema v3.0
                </span>
                <button
                  onClick={() => handleCopyModalCurl(selectedAdvisory)}
                  style={{
                    background: "none",
                    border: "none",
                    color: copiedModalCurl ? "#34D399" : "#60A5FA",
                    fontSize: "0.72rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0
                  }}
                >
                  {copiedModalCurl ? "Copied cURL!" : "Copy cURL Command"}
                </button>
              </div>

              <button
                onClick={() => setSelectedAdvisory(null)}
                style={{
                  padding: "0.4rem 1.1rem",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#F8FAFC",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
