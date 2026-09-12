"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  CONSOLIDATED_UVI_ADVISORIES, 
  UVI_PUBLIC_FEED_SOURCES, 
  UviAdvisoryRecord, 
  PublicFeedSource,
  FeedCategory,
  ThreatSeverity,
  DomainCategory,
  IdeBuildImpactAssessment,
  OperationalDomain,
  ActionDirective,
  WeaponizationStage,
  ExposureHorizon,
  ObservationalAssessment,
  getActionDirectiveBadge,
  getWeaponizationStageLabel,
  getExposureHorizonLabel,
  getRecordObservationalAssessment
} from "@/lib/threat-feed-data";

export default function ThreatFeedPage() {
  // Global Rating System Mode: "observational" (Behavioral Observational Ratings - Zero Numbers) vs "classic" (Classic CVSS v3.1 Scoring)
  const [ratingMode, setRatingMode] = useState<"observational" | "classic">("observational");

  // Quad-Perspective Scope State: "ALL" (Universal Threats) vs "DEV_BUILD" (Developer Exposure) vs "NON_CVE" (Pure Non-CVE Malware) vs "INFORMATIONAL" (Informational Disclosures & Vector Research)
  const [feedScope, setFeedScope] = useState<"ALL" | "DEV_BUILD" | "NON_CVE" | "INFORMATIONAL">("ALL");
  const [nonCveThreatsCount, setNonCveThreatsCount] = useState<number>(46);
  const [informationalDisclosuresCount, setInformationalDisclosuresCount] = useState<number>(20);

  // Feed Sources Directory Modal & Category Filtering
  const [isFeedDirectoryOpen, setIsFeedDirectoryOpen] = useState(false);
  const [feedDirectorySearch, setFeedDirectorySearch] = useState("");
  const [feedDirectoryCategory, setFeedDirectoryCategory] = useState<string>("ALL");
  const [activeStripCategory, setActiveStripCategory] = useState<string>("ALL");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarFeedSearch, setSidebarFeedSearch] = useState("");

  const filteredSidebarFeeds = useMemo(() => {
    return UVI_PUBLIC_FEED_SOURCES.filter(f => {
      const matchesCat = activeStripCategory === "ALL" || f.category === activeStripCategory;
      const matchesSearch = !sidebarFeedSearch.trim() || 
        f.name.toLowerCase().includes(sidebarFeedSearch.toLowerCase()) || 
        f.scope.toLowerCase().includes(sidebarFeedSearch.toLowerCase()) ||
        f.category.toLowerCase().includes(sidebarFeedSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeStripCategory, sidebarFeedSearch]);

  const FEED_CATEGORIES: { id: string; label: string; icon: string; count: number }[] = [
    { id: "ALL", label: "All Feeds", icon: "🌐", count: UVI_PUBLIC_FEED_SOURCES.length },
    { id: "Malware, C2 & Botnets", label: "Malware & C2", icon: "☣️", count: UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === "Malware, C2 & Botnets").length },
    { id: "Phishing & Fraud", label: "Phishing & Fraud", icon: "🎣", count: UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === "Phishing & Fraud").length },
    { id: "IP Reputation, Scanners & Network Telemetry", label: "IP Telemetry", icon: "🌪️", count: UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === "IP Reputation, Scanners & Network Telemetry").length },
    { id: "Vulnerabilities & Exploitation", label: "Vulnerabilities", icon: "🚨", count: UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === "Vulnerabilities & Exploitation").length },
    { id: "Multi-Indicator Hubs & Aggregators", label: "Threat Hubs", icon: "👽", count: UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === "Multi-Indicator Hubs & Aggregators").length }
  ];

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
  const [totalUniversalCount, setTotalUniversalCount] = useState<number>(1820);
  const [directBuildImpactCount, setDirectBuildImpactCount] = useState<number>(414);
  const [matchedCount, setMatchedCount] = useState<number>(1820);
  const [totalPages, setTotalPages] = useState<number>(37);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLiveSynced, setHasLiveSynced] = useState<boolean>(false);

  // Inspection Dossier Modal State
  const [selectedAdvisory, setSelectedAdvisory] = useState<UviAdvisoryRecord | null>(null);
  const [dossierTab, setDossierTab] = useState<"overview" | "workstation" | "sources">("overview");
  const [copiedUviId, setCopiedUviId] = useState<string | null>(null);
  const [copiedModalCurl, setCopiedModalCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Available operational domains list
  const operationalDomains: ("ALL" | OperationalDomain)[] = [
    "ALL",
    "PATCH",
    "ENDPOINT",
    "IDENTITY",
    "SUPPLY",
    "PIPELINE",
    "AGENT",
    "NETWORK"
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

        if (selectedDomain !== "ALL") {
          params.set("domain", selectedDomain);
          params.set("action", selectedDomain);
        }
        if (ratingMode === "classic" && selectedSeverity !== "ALL") {
          params.set("severity", selectedSeverity);
        }
        if (selectedSourceFeed !== "ALL") params.set("source", selectedSourceFeed);
        if (kevOnly) params.set("kevOnly", "true");
        params.set("page", page.toString());
        params.set("limit", pageSize.toString());

        const res = await fetch(`/api/threat-feed?${params.toString()}`);
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data && Array.isArray(data.advisories)) {
            // Sort records according to sortBy state (Prioritize Action Directive in Observational mode)
            const sorted = [...data.advisories].sort((a: UviAdvisoryRecord, b: UviAdvisoryRecord) => {
              if (ratingMode === "observational" && sortBy === "cvss_desc") {
                const priorityWeights: Record<string, number> = {
                  ENDPOINT: 7,
                  PATCH: 6,
                  IDENTITY: 5,
                  SUPPLY: 4,
                  PIPELINE: 3,
                  AGENT: 2,
                  NETWORK: 1,
                  // aliases
                  QUARANTINE_AND_REVOKE: 7,
                  EXPEDITE_HOTFIX: 6,
                  ROTATE_SECRETS: 5,
                  PIN_DEPENDENCY: 4,
                  LOCKDOWN_PIPELINE: 3,
                  CONSTRAIN_AGENTS: 2,
                  SEGREGATE_NETWORK: 1,
                  HARDEN_WORKSTATION: 7,
                  AUDIT_CONFIG: 3,
                  SITUATIONAL_AWARENESS: 1,
                  INTERVENE_NOW: 7
                };
                const obsA = getRecordObservationalAssessment(a);
                const obsB = getRecordObservationalAssessment(b);
                const domA = obsA.operationalDomain || obsA.actionDirective;
                const domB = obsB.operationalDomain || obsB.actionDirective;
                const wA = priorityWeights[domA] || 0;
                const wB = priorityWeights[domB] || 0;
                if (wA !== wB) return wB - wA;
                return b.cvssScore - a.cvssScore;
              }
              if (sortBy === "cvss_desc") return b.cvssScore - a.cvssScore;
              if (sortBy === "uvi_desc") return b.uviId.localeCompare(a.uviId);
              if (sortBy === "uvi_asc") return a.uviId.localeCompare(b.uviId);
              if (sortBy === "published_desc") return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
              return 0;
            });

            setAdvisories(sorted);
            setTotalUniversalCount(data.totalConsolidatedCount || 1820);
            setDirectBuildImpactCount(data.directBuildImpactCount || 414);
            setNonCveThreatsCount(data.nonCveThreatsCount || 46);
            setInformationalDisclosuresCount(data.informationalDisclosuresCount || 20);
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
  }, [searchQuery, feedScope, ratingMode, selectedSeverity, selectedDomain, selectedSourceFeed, kevOnly, page, pageSize, sortBy]);

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
    <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "2rem 1.75rem 5rem", width: "100%" }}>
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
              {hasLiveSynced ? `Live Ingestion Active (${totalUniversalCount.toLocaleString()} Records Streamed)` : `${UVI_PUBLIC_FEED_SOURCES.length} Synchronized Upstream Public Feeds`}
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

      {/* Main Two-Column Layout: Threat Feeds Sidebar (Left) + Advisories Content (Right) */}
      <div style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "flex-start",
        position: "relative"
      }}>
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: Threat Feed Sources Navigation                              */}
        {/* ========================================================================= */}
        <aside style={{
          width: isSidebarCollapsed ? "56px" : "310px",
          minWidth: isSidebarCollapsed ? "56px" : "310px",
          maxWidth: isSidebarCollapsed ? "56px" : "310px",
          position: "sticky",
          top: "1rem",
          height: "calc(100vh - 2rem)",
          maxHeight: "calc(100vh - 2rem)",
          background: "rgba(13, 19, 33, 0.85)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.2s, max-width 0.2s",
          overflow: "hidden",
          zIndex: 20
        }}>
          {isSidebarCollapsed ? (
            /* Collapsed Rail View */
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0.75rem 0.35rem",
              gap: "0.75rem",
              height: "100%"
            }}>
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(59, 130, 246, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.35)",
                  color: "#93C5FD",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
                title="Expand Threat Feeds Sidebar"
              >
                ▶
              </button>

              <div style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: "#34D399",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "0.15rem 0.35rem",
                borderRadius: "4px"
              }}>
                37
              </div>

              {/* Stack of Category Icons */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                margin: "auto 0",
                alignItems: "center"
              }}>
                {FEED_CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveStripCategory(c.id);
                      setIsSidebarCollapsed(false);
                    }}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: activeStripCategory === c.id ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.04)",
                      border: activeStripCategory === c.id ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.06)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "0.9rem",
                      cursor: "pointer"
                    }}
                    title={`${c.label} (${c.count} feeds)`}
                  >
                    {c.icon}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsFeedDirectoryOpen(true)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#CBD5E1",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
                title="View All 37 Feeds Directory Modal"
              >
                🌐
              </button>
            </div>
          ) : (
            /* Expanded Full Sidebar View */
            <>
              {/* Sidebar Header */}
              <div style={{
                padding: "0.9rem 1rem 0.75rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                background: "rgba(15, 23, 42, 0.6)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "1rem" }}>🌐</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#F8FAFC", letterSpacing: "0.02em" }}>
                      Threat Feeds
                    </span>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.1rem 0.45rem",
                      borderRadius: "4px",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#34D399",
                      border: "1px solid rgba(16, 185, 129, 0.3)"
                    }}>
                      37 Live
                    </span>
                  </div>

                  <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#94A3B8",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      transition: "all 0.15s ease"
                    }}
                    title="Collapse Sidebar"
                  >
                    ◀
                  </button>
                </div>

                <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                  {((totalUpstreamRecords) / 1000000).toFixed(1)}M+ Synchronized Upstream Records
                </div>
              </div>

              {/* Search Within Feeds */}
              <div style={{ padding: "0.65rem 0.85rem 0.4rem" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={sidebarFeedSearch}
                    onChange={(e) => setSidebarFeedSearch(e.target.value)}
                    placeholder="Search 37 feeds (e.g. urlhaus, tor)..."
                    style={{
                      width: "100%",
                      padding: "0.38rem 0.65rem 0.38rem 1.75rem",
                      background: "rgba(10, 14, 23, 0.75)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      color: "#F8FAFC",
                      fontSize: "0.76rem",
                      outline: "none"
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    left: "0.55rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748B",
                    fontSize: "0.75rem",
                    pointerEvents: "none"
                  }}>
                    🔍
                  </span>
                  {sidebarFeedSearch && (
                    <button
                      onClick={() => setSidebarFeedSearch("")}
                      style={{
                        position: "absolute",
                        right: "0.45rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#94A3B8",
                        cursor: "pointer",
                        fontSize: "0.75rem"
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills (Horizontal scrolling compact tags) */}
              <div style={{
                padding: "0 0.85rem 0.5rem",
                display: "flex",
                gap: "0.25rem",
                overflowX: "auto",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                paddingBottom: "0.5rem"
              }}>
                {FEED_CATEGORIES.map(cat => {
                  const isActive = activeStripCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveStripCategory(cat.id)}
                      style={{
                        padding: "0.2rem 0.45rem",
                        borderRadius: "5px",
                        background: isActive ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.03)",
                        border: isActive ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.07)",
                        color: isActive ? "#93C5FD" : "#94A3B8",
                        fontSize: "0.7rem",
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem"
                      }}
                      title={`${cat.label} (${cat.count})`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.id === "ALL" ? "All" : cat.id.split("&")[0].trim()}</span>
                      <span style={{ fontSize: "0.62rem", opacity: 0.8 }}>({cat.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Feed Filter Reset Banner (If a specific feed is active) */}
              {selectedSourceFeed !== "ALL" && (
                <div style={{
                  margin: "0.4rem 0.85rem 0",
                  padding: "0.4rem 0.65rem",
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem"
                }}>
                  <div style={{ fontSize: "0.72rem", color: "#FCA5A5", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Filtered: {UVI_PUBLIC_FEED_SOURCES.find(f => f.id === selectedSourceFeed)?.name || selectedSourceFeed}
                  </div>
                  <button
                    onClick={() => handleFilterChange(() => setSelectedSourceFeed("ALL"))}
                    style={{
                      background: "rgba(239, 68, 68, 0.2)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#FFFFFF",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.4rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Reset ✕
                  </button>
                </div>
              )}

              {/* Scrollable Feed List */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "0.4rem 0.65rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem"
              }}>
                {/* Master "All Feeds" Item */}
                <button
                  onClick={() => handleFilterChange(() => setSelectedSourceFeed("ALL"))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.42rem 0.65rem",
                    borderRadius: "6px",
                    background: selectedSourceFeed === "ALL" ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.02)",
                    border: selectedSourceFeed === "ALL" ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.05)",
                    color: selectedSourceFeed === "ALL" ? "#93C5FD" : "#E2E8F0",
                    fontSize: "0.78rem",
                    fontWeight: selectedSourceFeed === "ALL" ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.12s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span>🌐</span>
                    <span>All Feeds Combined</span>
                  </div>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: selectedSourceFeed === "ALL" ? "#60A5FA" : "#64748B"
                  }}>
                    2,671 recs
                  </span>
                </button>

                {/* Filtered Feeds List */}
                {filteredSidebarFeeds.map(feed => {
                  const isSelected = selectedSourceFeed === feed.id;
                  const recFormatted = feed.recordsIngested >= 1000000 
                    ? `${(feed.recordsIngested / 1000000).toFixed(1)}M` 
                    : feed.recordsIngested >= 1000 
                    ? `${Math.round(feed.recordsIngested / 1000)}k` 
                    : `${feed.recordsIngested}`;

                  return (
                    <button
                      key={feed.id}
                      onClick={() => handleFilterChange(() => setSelectedSourceFeed(isSelected ? "ALL" : feed.id))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.45rem",
                        padding: "0.42rem 0.6rem",
                        borderRadius: "6px",
                        background: isSelected ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.025)",
                        border: isSelected ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.05)",
                        color: isSelected ? "#93C5FD" : "#CBD5E1",
                        fontSize: "0.76rem",
                        fontWeight: isSelected ? 700 : 500,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s ease"
                      }}
                      title={`${feed.name} (${feed.category})\nScope: ${feed.scope}\nRecords: ${feed.recordsIngested.toLocaleString()}\nClick to filter UVI advisories`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", overflow: "hidden" }}>
                        <span style={{ fontSize: "0.85rem", flexShrink: 0 }}>{feed.icon}</span>
                        <span style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "0.75rem"
                        }}>
                          {feed.name.replace("NIST ", "").replace(" Database", "").replace(" Security", "").replace(" (MSRC)", "").replace(" Advisories", "")}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                        <span style={{
                          fontSize: "0.64rem",
                          padding: "0.08rem 0.32rem",
                          borderRadius: "4px",
                          background: isSelected ? "rgba(59, 130, 246, 0.35)" : "rgba(255, 255, 255, 0.06)",
                          color: isSelected ? "#FFFFFF" : "#64748B",
                          fontWeight: 600
                        }}>
                          {recFormatted}
                        </span>
                        {isSelected && <span style={{ color: "#60A5FA", fontSize: "0.65rem" }}>●</span>}
                      </div>
                    </button>
                  );
                })}

                {filteredSidebarFeeds.length === 0 && (
                  <div style={{ padding: "1.5rem 0.5rem", textAlign: "center", color: "#64748B", fontSize: "0.75rem" }}>
                    No feeds match &quot;{sidebarFeedSearch}&quot;
                  </div>
                )}
              </div>

              {/* Sidebar Footer: Directory Modal Trigger */}
              <div style={{
                padding: "0.65rem 0.85rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                background: "rgba(10, 14, 23, 0.6)"
              }}>
                <button
                  onClick={() => setIsFeedDirectoryOpen(true)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    padding: "0.45rem",
                    borderRadius: "6px",
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15))",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    color: "#A5B4FC",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <span>🌐</span>
                  <span>View All 37 Feeds Directory</span>
                  <span>↗</span>
                </button>
              </div>
            </>
          )}
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT MAIN COLUMN: Triage Toolbar, Filters, Advisories Table/Cards        */}
        {/* ========================================================================= */}
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {/* Executive Rating System Mode Toggle & Quick View Toolbar */}
          <div style={{
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.09)",
            borderRadius: "14px",
            padding: "0.85rem 1.25rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", fontWeight: 700 }}>
                Triage Methodology:
              </span>

              {/* Segmented Mode Switcher */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(10, 14, 23, 0.9)",
                padding: "0.25rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <button
                  onClick={() => handleFilterChange(() => setRatingMode("observational"))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.45rem 0.95rem",
                    borderRadius: "8px",
                    border: ratingMode === "observational" ? "1px solid #3B82F6" : "1px solid transparent",
                    background: ratingMode === "observational" ? "rgba(59, 130, 246, 0.25)" : "transparent",
                    color: ratingMode === "observational" ? "#93C5FD" : "#94A3B8",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  title="Assess all threats through qualitative Operational Domains, Weaponization Stages, and Exposure Horizons without misleading numbers"
                >
                  <span>🛡️</span>
                  <span>Behavioral Observational Ratings</span>
                  <span style={{
                    fontSize: "0.65rem",
                    background: ratingMode === "observational" ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.05)",
                    color: ratingMode === "observational" ? "#FFFFFF" : "#64748B",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: 600
                  }}>
                    NON-QUANTITATIVE
                  </span>
                </button>

                <button
                  onClick={() => handleFilterChange(() => setRatingMode("classic"))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.45rem 0.95rem",
                    borderRadius: "8px",
                    border: ratingMode === "classic" ? "1px solid #F59E0B" : "1px solid transparent",
                    background: ratingMode === "classic" ? "rgba(245, 158, 11, 0.2)" : "transparent",
                    color: ratingMode === "classic" ? "#FCD34D" : "#94A3B8",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  title="Assess threats using conventional quantitative CVSS v3.1 base score, severity levels, and metric vectors"
                >
                  <span>📊</span>
                  <span>Classic CVSS Scoring</span>
                  <span style={{
                    fontSize: "0.65rem",
                    background: ratingMode === "classic" ? "rgba(245, 158, 11, 0.35)" : "rgba(255, 255, 255, 0.05)",
                    color: ratingMode === "classic" ? "#FFFFFF" : "#64748B",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: 600
                  }}>
                    CVSS 3.1
                  </span>
                </button>
              </div>
            </div>

            {/* View Mode Switcher: Table vs Cards + Feeds Sidebar Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <button
                onClick={() => setIsSidebarCollapsed(prev => !prev)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.38rem 0.75rem",
                  borderRadius: "8px",
                  background: isSidebarCollapsed ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border: isSidebarCollapsed ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: isSidebarCollapsed ? "#93C5FD" : "#CBD5E1",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                title={isSidebarCollapsed ? "Expand Threat Feeds Sidebar" : "Collapse Threat Feeds Sidebar to Maximize Table Width"}
              >
                <span>{isSidebarCollapsed ? "⚡" : "◀"}</span>
                <span>{isSidebarCollapsed ? "Show Feeds (37)" : "Hide Sidebar"}</span>
              </button>

              <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", fontWeight: 700 }}>
                Layout:
              </span>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(10, 14, 23, 0.9)",
                padding: "0.2rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <button
                  onClick={() => setViewMode("table")}
                  style={{
                    padding: "0.35rem 0.7rem",
                    borderRadius: "6px",
                    border: viewMode === "table" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
                    background: viewMode === "table" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    color: viewMode === "table" ? "#F8FAFC" : "#94A3B8",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                  title="Consolidated Table View with locked sticky header"
                >
                  📋 Table
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  style={{
                    padding: "0.35rem 0.7rem",
                    borderRadius: "6px",
                    border: viewMode === "cards" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
                    background: viewMode === "cards" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    color: viewMode === "cards" ? "#F8FAFC" : "#94A3B8",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                  title="Wiki Card Grid View"
                >
                  🎴 Cards
                </button>
              </div>
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
              {FEED_CATEGORIES.filter(c => c.id !== "ALL").map(category => (
                <optgroup key={category.id} label={`${category.icon} ${category.id}`}>
                  {UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === category.id).map(feed => (
                    <option key={feed.id} value={feed.id}>
                      {feed.icon} {feed.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Unified Operational Domain Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "200px" }}>
            <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
              Operational Domain
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
              <option value="ALL">All Operational Domains (7 Domains)</option>
              <option value="PATCH">⚡ Patch</option>
              <option value="ENDPOINT">🛡️ Endpoint</option>
              <option value="IDENTITY">🔐 Identity</option>
              <option value="SUPPLY">📦 Supply</option>
              <option value="PIPELINE">🔒 Pipeline</option>
              <option value="AGENT">🤖 Agent</option>
              <option value="NETWORK">🧱 Network</option>
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

          {/* Severity Dropdown (Only in Classic CVSS Mode) */}
          {ratingMode === "classic" && (
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
          )}

          {/* Sort Order Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "165px" }}>
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
              {ratingMode === "observational" ? (
                <>
                  <option value="cvss_desc">Domain Urgency & Reality</option>
                  <option value="published_desc">Date (Newest First)</option>
                  <option value="uvi_desc">UVI ID (Descending)</option>
                  <option value="uvi_asc">UVI ID (Ascending)</option>
                </>
              ) : (
                <>
                  <option value="cvss_desc">CVSS Score (Highest First)</option>
                  <option value="uvi_desc">UVI ID (Descending)</option>
                  <option value="uvi_asc">UVI ID (Ascending)</option>
                  <option value="published_desc">Date (Newest First)</option>
                </>
              )}
            </select>
          </div>

          {/* Reset Filters button if any filter is active */}
          {(searchQuery || (ratingMode === "classic" && selectedSeverity !== "ALL") || selectedDomain !== "ALL" || selectedSourceFeed !== "ALL" || feedScope !== "ALL" || kevOnly) && (
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

        {(searchQuery || (ratingMode === "classic" && selectedSeverity !== "ALL") || selectedDomain !== "ALL" || selectedSourceFeed !== "ALL" || kevOnly || feedScope !== "ALL") && (
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
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8" }}>
                    Threat Scope & Headline
                  </th>
                  <th style={{ padding: "1.1rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "160px" }}>
                    {ratingMode === "observational" ? "Operational Domain" : "Severity & CVSS"}
                  </th>
                  <th style={{ padding: "1.1rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "200px" }}>
                    {ratingMode === "observational" ? "Exposure & Reality" : "Impact Scope"}
                  </th>
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "230px" }}>
                    Affected Target(s)
                  </th>
                  <th style={{ padding: "1.1rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "190px" }}>
                    Upstream Signals
                  </th>
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "105px", textAlign: "right" }}>
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

                        {/* Column 2: Threat Scope & Headline */}
                        <td style={{ padding: "1.1rem 1.25rem", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.3 }}>
                              {record.title}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5 }}>
                              {record.headline}
                            </div>

                            {ratingMode === "observational" ? (
                              (() => {
                                const obs = getRecordObservationalAssessment(record);
                                return (
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
                                    💡 <strong>Behavioral Digest:</strong> {obs.executiveBrief}
                                  </div>
                                );
                              })()
                            ) : (
                              record.informationalSynthesis && (
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
                              )
                            )}

                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                              {ratingMode === "classic" && (
                                (() => {
                                  const obs = getRecordObservationalAssessment(record);
                                  const actionBadge = getActionDirectiveBadge(obs.actionDirective);
                                  return (
                                    <span style={{
                                      fontSize: "0.72rem",
                                      fontWeight: 700,
                                      color: actionBadge.text,
                                      background: actionBadge.bg,
                                      border: `1px solid ${actionBadge.border}`,
                                      padding: "0.15rem 0.5rem",
                                      borderRadius: "4px"
                                    }}>
                                      {actionBadge.label}
                                    </span>
                                  );
                                })()
                              )}
                              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                {record.cwe}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                Vector: <strong style={{ color: "#E2E8F0" }}>{record.attackVector}</strong>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Column 3: Operational Domain (or Severity & CVSS in classic mode) */}
                        <td style={{ padding: "1.1rem 1rem", width: "160px", verticalAlign: "top" }}>
                          {ratingMode === "observational" ? (
                            (() => {
                              const obs = getRecordObservationalAssessment(record);
                              const actionBadge = getActionDirectiveBadge(obs.actionDirective);
                              return (
                                <div style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.35rem",
                                  padding: "0.28rem 0.65rem",
                                  borderRadius: "6px",
                                  background: actionBadge.bg,
                                  border: `1px solid ${actionBadge.border}`,
                                  width: "fit-content",
                                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)"
                                }}>
                                  <span style={{ fontSize: "0.76rem", fontWeight: 800, color: actionBadge.text, letterSpacing: "0.03em" }}>
                                    {actionBadge.label}
                                  </span>
                                </div>
                              );
                            })()
                          ) : (
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
                          )}
                        </td>

                        {/* Column 4: Exposure & Reality / Impact Scope */}
                        <td style={{ padding: "1.1rem 1rem", width: "200px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                            {ratingMode === "observational" ? (
                              (() => {
                                const obs = getRecordObservationalAssessment(record);
                                return (
                                  <>
                                    <span style={{
                                      fontSize: "0.72rem",
                                      fontWeight: 700,
                                      padding: "0.22rem 0.55rem",
                                      borderRadius: "4px",
                                      background: "rgba(59, 130, 246, 0.12)",
                                      border: "1px solid rgba(59, 130, 246, 0.25)",
                                      color: "#93C5FD",
                                      width: "fit-content"
                                    }}>
                                      🎯 {getExposureHorizonLabel(obs.exposureHorizon)}
                                    </span>

                                    <div style={{ fontSize: "0.72rem", color: "#E2E8F0", fontWeight: 600, lineHeight: 1.3 }}>
                                      {getWeaponizationStageLabel(obs.weaponizationStage)}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                                      <span style={{
                                        fontSize: "0.65rem",
                                        fontWeight: 700,
                                        color: obs.chatterVelocity === "VIRAL" ? "#F87171" : "#A5B4FC",
                                        background: obs.chatterVelocity === "VIRAL" ? "rgba(239, 68, 68, 0.15)" : "rgba(129, 140, 248, 0.15)",
                                        padding: "0.1rem 0.4rem",
                                        borderRadius: "3px"
                                      }}>
                                        {obs.chatterVelocity === "VIRAL" ? "🔥 VIRAL" : "⚡ " + obs.chatterVelocity}
                                      </span>
                                      <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>
                                        {obs.consensusLevel.replace(/_/g, " ")}
                                      </span>
                                    </div>
                                  </>
                                );
                              })()
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
                        <td style={{ padding: "1.1rem 1.25rem", width: "230px", verticalAlign: "top" }}>
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

                            {/* Potential Victim Surfaces */}
                            {(() => {
                              const obs = getRecordObservationalAssessment(record);
                              if (!obs.potentialVictimSurface || obs.potentialVictimSurface.length === 0) return null;
                              return (
                                <div style={{ marginTop: "0.15rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                  <span style={{ 
                                    fontSize: "0.66rem", 
                                    fontWeight: 700, 
                                    textTransform: "uppercase", 
                                    letterSpacing: "0.06em", 
                                    color: "#64748B" 
                                  }}>
                                    Surfaces
                                  </span>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                                    {obs.potentialVictimSurface.map((surf, sIdx) => (
                                      <span key={sIdx} style={{
                                        fontSize: "0.68rem",
                                        fontWeight: 500,
                                        color: "#93C5FD",
                                        background: "rgba(59, 130, 246, 0.08)",
                                        border: "1px solid rgba(59, 130, 246, 0.2)",
                                        padding: "0.15rem 0.45rem",
                                        borderRadius: "4px",
                                        lineHeight: 1.3
                                      }}>
                                        {surf}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </td>

                        {/* Column 6: Upstream Signals */}
                        <td style={{ padding: "1.1rem 1rem", width: "190px", verticalAlign: "top" }}>
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
                        <td style={{ padding: "1.1rem 1.25rem", width: "105px", verticalAlign: "top", textAlign: "right" }}>
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

                      {ratingMode === "observational" ? (
                        (() => {
                          const obs = getRecordObservationalAssessment(record);
                          const actionBadge = getActionDirectiveBadge(obs.actionDirective);
                          return (
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "6px",
                              background: actionBadge.bg,
                              border: `1px solid ${actionBadge.border}`
                            }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: actionBadge.text }}>
                                {actionBadge.label}
                              </span>
                            </div>
                          );
                        })()
                      ) : (
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
                      )}
                    </div>

                    {/* Title & Headline */}
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.35, marginBottom: "0.5rem" }}>
                      {record.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.85rem" }}>
                      {record.headline}
                    </p>

                    {/* Informational Reality & Horizon Banner vs Standard Dev Impact */}
                    {ratingMode === "observational" ? (
                      (() => {
                        const obs = getRecordObservationalAssessment(record);
                        return (
                          <div style={{
                            marginBottom: "0.75rem",
                            padding: "0.45rem 0.7rem",
                            borderRadius: "6px",
                            background: "rgba(59, 130, 246, 0.1)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem",
                            fontSize: "0.75rem"
                          }}>
                            <div style={{ color: "#93C5FD", fontWeight: 600 }}>
                              📍 {getWeaponizationStageLabel(obs.weaponizationStage)}
                            </div>
                            <div style={{ color: "#94A3B8", fontSize: "0.72rem" }}>
                              🎯 {getExposureHorizonLabel(obs.exposureHorizon)}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      hasDevImpact && (
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
                      )
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
                    {(() => {
                      const obs = getRecordObservationalAssessment(record);
                      const actionBadge = getActionDirectiveBadge(obs.actionDirective);
                      return (
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: actionBadge.text,
                          background: actionBadge.bg,
                          border: `1px solid ${actionBadge.border}`,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "4px"
                        }}>
                          {actionBadge.label}
                        </span>
                      );
                    })()}

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
        </main>
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
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#F8FAFC",
                    letterSpacing: "-0.01em"
                  }}>
                    {selectedAdvisory.uviId}
                  </span>

                  {/* Severity Pill or Action Directive Pill */}
                  {ratingMode === "observational" ? (
                    (() => {
                      const obs = getRecordObservationalAssessment(selectedAdvisory);
                      const actionBadge = getActionDirectiveBadge(obs.actionDirective);
                      return (
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "4px",
                          background: actionBadge.bg,
                          color: actionBadge.text,
                          border: `1px solid ${actionBadge.border}`
                        }}>
                          {actionBadge.label}
                        </span>
                      );
                    })()
                  ) : (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      background: selectedAdvisory.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.15)" :
                                 selectedAdvisory.severity === "HIGH" ? "rgba(249, 115, 22, 0.15)" :
                                 "rgba(255, 255, 255, 0.06)",
                      color: selectedAdvisory.severity === "CRITICAL" ? "#FCA5A5" :
                             selectedAdvisory.severity === "HIGH" ? "#FDBA74" : "#CBD5E1",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}>
                      {selectedAdvisory.severity} {selectedAdvisory.cvssScore.toFixed(1)}
                    </span>
                  )}

                  {/* Context / Scope Badge - Clean neutral pill */}
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "#94A3B8",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}>
                    {selectedAdvisory.disclosureType === "INFORMATIONAL_DISCLOSURE" ? "Informational Disclosure" :
                     selectedAdvisory.cisaKev.isKnownExploited ? "CISA KEV Active Exploit" :
                     selectedAdvisory.cveList.length === 0 ? "Supply Chain Finding" :
                     selectedAdvisory.cveList[0] || "CVE Advisory"}
                  </span>
                </div>

                {/* Header Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleCopyUviId(selectedAdvisory.uviId)}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: copiedUviId === selectedAdvisory.uviId ? "#34D399" : "#CBD5E1",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 500
                    }}
                  >
                    {copiedUviId === selectedAdvisory.uviId ? "Copied ID!" : "Copy ID"}
                  </button>

                  <button
                    onClick={() => handleCopyJson(selectedAdvisory)}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: copiedJson ? "#34D399" : "#CBD5E1",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 500
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
              <h2 style={{ fontSize: "1.08rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.4, margin: "0.55rem 0 0.35rem 0" }}>
                {selectedAdvisory.title}
              </h2>

              {/* Metadata Subtitle - Fully normalized, no rainbow colors */}
              {ratingMode === "observational" ? (
                (() => {
                  const obs = getRecordObservationalAssessment(selectedAdvisory);
                  return (
                    <div style={{ display: "flex", gap: "0.65rem", fontSize: "0.76rem", color: "#94A3B8", flexWrap: "wrap", alignItems: "center" }}>
                      <span>Vector: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{obs.vectorCategory}</strong></span>
                      <span>•</span>
                      <span>Signal Source: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedAdvisory.informationalSynthesis?.primarySources[0]?.sourceName || selectedAdvisory.upstreamSignals[0]?.sourceName || "UVI Intelligence"}</strong></span>
                      <span>•</span>
                      <span>Horizon: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{getExposureHorizonLabel(obs.exposureHorizon)}</strong></span>
                      <span>•</span>
                      <span>Published: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedAdvisory.publishedDate}</strong></span>
                    </div>
                  );
                })()
              ) : (
                <div style={{ display: "flex", gap: "0.65rem", fontSize: "0.76rem", color: "#94A3B8", flexWrap: "wrap", alignItems: "center" }}>
                  <span>Domain: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{getRecordObservationalAssessment(selectedAdvisory).operationalDomain}</strong></span>
                  <span>•</span>
                  <span>Source: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedAdvisory.upstreamSignals[0]?.sourceName || "Standardized Feed"}</strong></span>
                  <span>•</span>
                  <span>Published: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedAdvisory.publishedDate}</strong></span>
                  <span>•</span>
                  <span>Workstation Exposure: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv}</strong></span>
                </div>
              )}
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
                { id: "overview", label: "Overview & Mechanism" },
                { id: "workstation", label: "Workstation & Build Impact" },
                { 
                  id: "sources", 
                  label: selectedAdvisory.disclosureType === "INFORMATIONAL_DISCLOSURE"
                    ? `Sources & Citations (${selectedAdvisory.informationalSynthesis?.primarySources.length || 0})`
                    : `Feed Signals (${selectedAdvisory.upstreamSignals.length})` 
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDossierTab(tab.id as any)}
                  style={{
                    padding: "0.85rem 1.15rem",
                    background: "none",
                    border: "none",
                    borderBottom: dossierTab === tab.id ? "2px solid #60A5FA" : "2px solid transparent",
                    color: dossierTab === tab.id ? "#F8FAFC" : "#94A3B8",
                    fontWeight: dossierTab === tab.id ? 600 : 500,
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

            {/* Modal Body (Scrollable, Normalized calm aesthetics) */}
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
                ratingMode === "observational" ? (
                  (() => {
                    const obs = getRecordObservationalAssessment(selectedAdvisory);
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {/* 4-Pillar Observational Assessment Strip (Zero numeric scores) */}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                          gap: "0.75rem"
                        }}>
                          {/* Pillar 1: Operational Domain */}
                          {(() => {
                            const actionBadge = getActionDirectiveBadge(obs.operationalDomain || obs.actionDirective);
                            return (
                              <div style={{ background: "rgba(255, 255, 255, 0.025)", border: `1px solid ${actionBadge.border}`, borderRadius: "8px", padding: "0.75rem 1rem" }}>
                                <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Operational Domain</div>
                                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: actionBadge.text, marginTop: "0.25rem" }}>
                                  {actionBadge.label}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Pillar 2: Weaponization Reality */}
                          <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                            <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Weaponization Stage</div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#F8FAFC", marginTop: "0.25rem" }}>
                              {getWeaponizationStageLabel(obs.weaponizationStage)}
                            </div>
                          </div>

                          {/* Pillar 3: Exposure Horizon */}
                          <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                            <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Exposure Horizon</div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#93C5FD", marginTop: "0.25rem" }}>
                              {getExposureHorizonLabel(obs.exposureHorizon)}
                            </div>
                          </div>

                          {/* Pillar 4: Signal & Corroboration */}
                          <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                            <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Signal & Corroboration</div>
                            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#F8FAFC", marginTop: "0.25rem" }}>
                              {obs.chatterVelocity === "VIRAL" ? "🔥 Viral" : "⚡ " + obs.chatterVelocity} • {obs.consensusLevel.replace(/_/g, " ")}
                            </div>
                          </div>
                        </div>

                        {/* Executive Digest - Unified neutral card */}
                        <div style={{
                          background: "rgba(255, 255, 255, 0.025)",
                          border: "1px solid rgba(255, 255, 255, 0.07)",
                          borderRadius: "8px",
                          padding: "1rem 1.2rem"
                        }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                            Executive Digest
                          </div>
                          <p style={{ color: "#E2E8F0", fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
                            {obs.executiveBrief}
                          </p>
                        </div>

                        {/* Inferred Threat Vector & Mechanism - Unified neutral card */}
                        <div style={{
                          background: "rgba(255, 255, 255, 0.025)",
                          border: "1px solid rgba(255, 255, 255, 0.07)",
                          borderRadius: "8px",
                          padding: "1rem 1.2rem"
                        }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                            Inferred Attack Mechanism & Vector Execution
                          </div>
                          <p style={{ color: "#CBD5E1", fontSize: "0.86rem", lineHeight: 1.65, margin: 0 }}>
                            {obs.inferredMechanism}
                          </p>
                        </div>

                        {/* Precautionary Posture - Unified neutral card */}
                        <div style={{
                          background: "rgba(255, 255, 255, 0.025)",
                          border: "1px solid rgba(255, 255, 255, 0.07)",
                          borderRadius: "8px",
                          padding: "1rem 1.2rem"
                        }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                            Precautionary Defensive Posture (Operational Guidance)
                          </div>
                          <p style={{ color: "#CBD5E1", fontSize: "0.86rem", lineHeight: 1.65, margin: 0 }}>
                            {obs.precautionaryPosture}
                          </p>
                        </div>

                        {/* Potential Victim Surface - Normalized neutral tags */}
                        {obs.potentialVictimSurface && obs.potentialVictimSurface.length > 0 && (
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", paddingTop: "0.1rem" }}>
                            <span style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 600 }}>
                              Target Surfaces:
                            </span>
                            {obs.potentialVictimSurface.map((surf, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  fontSize: "0.72rem",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "4px",
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  color: "#CBD5E1"
                                }}
                              >
                                {surf}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* CVSS & Vector Breakdown - Normalized neutral tiles */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "0.6rem"
                    }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>CVSS v3.1</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.2rem" }}>
                          {selectedAdvisory.cvssScore.toFixed(1)}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>Attack Vector</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F8FAFC", marginTop: "0.2rem" }}>
                          {selectedAdvisory.attackVector}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>Complexity</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F8FAFC", marginTop: "0.2rem" }}>
                          {selectedAdvisory.attackComplexity}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>Privileges</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F8FAFC", marginTop: "0.2rem" }}>
                          {selectedAdvisory.privilegesRequired}
                        </div>
                      </div>

                      <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.65rem 0.85rem", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>Interaction</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F8FAFC", marginTop: "0.2rem" }}>
                          {selectedAdvisory.userInteraction}
                        </div>
                      </div>
                    </div>

                    {/* Executive Threat Summary - Unified neutral card */}
                    <div style={{
                      background: "rgba(255, 255, 255, 0.025)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      borderRadius: "8px",
                      padding: "1rem 1.2rem"
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                        Executive Threat Summary
                      </div>
                      <p style={{ color: "#E2E8F0", fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
                        {selectedAdvisory.summary}
                      </p>
                    </div>

                    {/* Technical Root Cause & Weakness - Unified neutral card */}
                    <div style={{
                      background: "rgba(255, 255, 255, 0.025)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      borderRadius: "8px",
                      padding: "1rem 1.2rem"
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                        Technical Root Cause & Weakness
                      </div>
                      <p style={{ color: "#CBD5E1", fontSize: "0.86rem", lineHeight: 1.65, margin: "0 0 0.5rem 0" }}>
                        {selectedAdvisory.technicalDetails}
                      </p>
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.75rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "0.5rem" }}>
                        <span>Taxonomy: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedAdvisory.cwe}</strong></span>
                        <span>Vector: <code style={{ color: "#CBD5E1" }}>{selectedAdvisory.cvssVector}</code></span>
                      </div>
                    </div>

                    {/* Remediation & Actionable Fix - Unified neutral card */}
                    <div style={{
                      background: "rgba(255, 255, 255, 0.025)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      borderRadius: "8px",
                      padding: "1rem 1.2rem"
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                        Remediation & Fix Details
                      </div>
                      <p style={{ color: "#E2E8F0", fontSize: "0.86rem", lineHeight: 1.65, margin: "0 0 0.35rem 0" }}>
                        {selectedAdvisory.remediation.recommendedAction}
                      </p>
                      {selectedAdvisory.remediation.patchDetails && (
                        <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                          Patch: <span style={{ color: "#CBD5E1" }}>{selectedAdvisory.remediation.patchDetails}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* TAB 2: Workstation & Pipeline Impact */}
              {dossierTab === "workstation" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Workstation Exposure Summary Card */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#94A3B8", fontWeight: 700, letterSpacing: "0.04em" }}>
                        {ratingMode === "observational" ? "Observational Exposure Assessment" : "Developer Workstation Exposure Assessment"}
                      </div>
                      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F8FAFC", marginTop: "0.2rem" }}>
                        {ratingMode === "observational" ? (
                          (() => {
                            const obs = getRecordObservationalAssessment(selectedAdvisory);
                            const badge = getActionDirectiveBadge(obs.actionDirective);
                            return (
                              <span style={{ color: badge.text }}>
                                {badge.label}
                              </span>
                            );
                          })()
                        ) : (
                          `${selectedAdvisory.ideBuildImpact.severityOnDeveloperEnv} EXPOSURE`
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: "1.5rem", opacity: 0.8 }}>💻</span>
                  </div>

                  {/* Workstation Attack Vector */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                      Workstation Attack Vector
                    </div>
                    <p style={{ color: "#CBD5E1", fontSize: "0.86rem", lineHeight: 1.65, margin: 0 }}>
                      {selectedAdvisory.ideBuildImpact.workstationVector}
                    </p>
                  </div>

                  {/* Build Pipeline Risk */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                      CI/CD & Compiler Pipeline Risk
                    </div>
                    <p style={{ color: "#CBD5E1", fontSize: "0.86rem", lineHeight: 1.65, margin: 0 }}>
                      {selectedAdvisory.ideBuildImpact.buildPipelineRisk}
                    </p>
                  </div>

                  {/* IDE Recommendation */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                      Recommendation for Workstations & Builds
                    </div>
                    <p style={{ color: "#E2E8F0", fontSize: "0.86rem", lineHeight: 1.65, margin: 0 }}>
                      {selectedAdvisory.ideBuildImpact.recommendationForIdeBuilds}
                    </p>
                  </div>

                  {/* Affected Targets Table (if present) */}
                  {selectedAdvisory.affectedTargets && selectedAdvisory.affectedTargets.length > 0 && (
                    <div style={{
                      background: "rgba(255, 255, 255, 0.025)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      borderRadius: "8px",
                      padding: "1rem 1.2rem"
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.6rem", letterSpacing: "0.04em" }}>
                        Affected Software Components ({selectedAdvisory.affectedTargets.length})
                      </div>
                      <div style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                          <thead>
                            <tr style={{ background: "rgba(255, 255, 255, 0.04)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                              <th style={{ padding: "0.55rem 0.85rem", color: "#94A3B8", fontWeight: 600 }}>Product</th>
                              <th style={{ padding: "0.55rem 0.85rem", color: "#94A3B8", fontWeight: 600 }}>Ecosystem</th>
                              <th style={{ padding: "0.55rem 0.85rem", color: "#94A3B8", fontWeight: 600 }}>Affected Versions</th>
                              <th style={{ padding: "0.55rem 0.85rem", color: "#94A3B8", fontWeight: 600 }}>Fixed Version</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedAdvisory.affectedTargets.map((tgt, tIdx) => (
                              <tr key={tIdx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                                <td style={{ padding: "0.55rem 0.85rem", fontWeight: 600, color: "#F8FAFC" }}>{tgt.product}</td>
                                <td style={{ padding: "0.55rem 0.85rem", color: "#CBD5E1" }}>{tgt.ecosystem}</td>
                                <td style={{ padding: "0.55rem 0.85rem", color: "#CBD5E1", fontFamily: "monospace" }}>{tgt.affectedVersions}</td>
                                <td style={{ padding: "0.55rem 0.85rem", color: "#E2E8F0", fontFamily: "monospace", fontWeight: 600 }}>{tgt.fixedInVersion || "None"}</td>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {selectedAdvisory.disclosureType === "INFORMATIONAL_DISCLOSURE" && selectedAdvisory.informationalSynthesis ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                        Primary sources and investigative research tracking this threat vector:
                      </div>
                      {selectedAdvisory.informationalSynthesis.primarySources.map((source, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            background: "rgba(255, 255, 255, 0.025)",
                            border: "1px solid rgba(255, 255, 255, 0.07)",
                            borderRadius: "8px",
                            padding: "0.9rem 1.15rem"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.4rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 600, color: "#F8FAFC", fontSize: "0.88rem" }}>
                                {source.sourceName}
                              </span>
                              {source.authorOrHandle && (
                                <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                                  by <strong style={{ color: "#CBD5E1", fontWeight: 600 }}>{source.authorOrHandle}</strong>
                                </span>
                              )}
                              <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
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
                                fontWeight: 500
                              }}
                            >
                              View Dispatch ↗
                            </a>
                          </div>

                          <blockquote style={{
                            margin: "0 0 0.35rem 0",
                            paddingLeft: "0.65rem",
                            borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
                            color: "#CBD5E1",
                            fontSize: "0.82rem",
                            lineHeight: 1.55,
                            fontStyle: "italic"
                          }}>
                            &ldquo;{source.signalQuote}&rdquo;
                          </blockquote>

                          <div style={{ fontSize: "0.68rem", color: "#64748B" }}>
                            Published: {source.publishedAt}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                        Threat intelligence signals consolidated for this advisory:
                      </div>
                      {selectedAdvisory.upstreamSignals.map((signal, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            background: "rgba(255, 255, 255, 0.025)",
                            border: "1px solid rgba(255, 255, 255, 0.07)",
                            borderRadius: "8px",
                            padding: "0.9rem 1.15rem",
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
                                background: "rgba(255, 255, 255, 0.05)",
                                color: "#CBD5E1"
                              }}>
                                {signal.badge}
                              </span>
                            </div>
                            <span style={{
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              color: "#94A3B8"
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
                <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
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
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
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
      {/* Connected Threat Feeds Directory Modal */}
      {isFeedDirectoryOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFeedDirectoryOpen(false);
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(3, 7, 18, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
        >
          <div style={{
            background: "#0B1120",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "20px",
            maxWidth: "1280px",
            width: "100%",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "1.25rem 1.75rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.5))",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>🌐</span>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#F8FAFC", margin: 0 }}>
                    Connected Threat Intelligence Network ({UVI_PUBLIC_FEED_SOURCES.length} Feeds)
                  </h2>
                  <span style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "20px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#34D399",
                    border: "1px solid rgba(16, 185, 129, 0.3)"
                  }}>
                    LIVE FEDERATION ACTIVE
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#94A3B8", margin: 0 }}>
                  Consolidated multi-feed architecture ingesting over {((totalUpstreamRecords) / 1000000).toFixed(1)}M+ indicators across malware, botnets, phishing URLs, IP telemetry, and exploit probability models.
                </p>
              </div>

              <button
                onClick={() => setIsFeedDirectoryOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "#94A3B8",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Subheader: Search & Category Filter Toolbar */}
            <div style={{
              padding: "1rem 1.75rem",
              background: "rgba(15, 23, 42, 0.4)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}>
              {/* Search Bar */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#64748B", fontSize: "0.9rem" }}>
                    🔍
                  </span>
                  <input
                    type="text"
                    value={feedDirectorySearch}
                    onChange={(e) => setFeedDirectorySearch(e.target.value)}
                    placeholder="Search 37 threat feeds by name, protocol, URL, or coverage scope..."
                    style={{
                      width: "100%",
                      padding: "0.6rem 1rem 0.6rem 2.4rem",
                      background: "rgba(10, 14, 23, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      color: "#F8FAFC",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                  {feedDirectorySearch && (
                    <button
                      onClick={() => setFeedDirectorySearch("")}
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#94A3B8",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills inside Modal */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748B", fontWeight: 700, marginRight: "0.25rem" }}>
                  Category:
                </span>
                {FEED_CATEGORIES.map(cat => {
                  const isActive = feedDirectoryCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFeedDirectoryCategory(cat.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "6px",
                        background: isActive ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.03)",
                        border: isActive ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.08)",
                        color: isActive ? "#93C5FD" : "#94A3B8",
                        fontSize: "0.74rem",
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer"
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span style={{ 
                        fontSize: "0.65rem", 
                        padding: "0.05rem 0.35rem", 
                        borderRadius: "10px", 
                        background: isActive ? "rgba(59, 130, 246, 0.35)" : "rgba(255, 255, 255, 0.06)",
                        color: isActive ? "#FFFFFF" : "#64748B"
                      }}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body: Feed Cards Grid */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.25rem 1.75rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "1rem",
              background: "#080D1A"
            }}>
              {UVI_PUBLIC_FEED_SOURCES
                .filter(feed => {
                  const matchesCat = feedDirectoryCategory === "ALL" || feed.category === feedDirectoryCategory;
                  const q = feedDirectorySearch.trim().toLowerCase();
                  const matchesSearch = !q || (
                    feed.name.toLowerCase().includes(q) ||
                    feed.scope.toLowerCase().includes(q) ||
                    feed.coverage.toLowerCase().includes(q) ||
                    feed.access.toLowerCase().includes(q) ||
                    feed.category.toLowerCase().includes(q) ||
                    feed.homepageUrl.toLowerCase().includes(q)
                  );
                  return matchesCat && matchesSearch;
                })
                .map((feed) => {
                  const isSelectedInMainFeed = selectedSourceFeed === feed.id;
                  
                  // Category color styles
                  const getCategoryStyle = (cat: string) => {
                    switch (cat) {
                      case "Malware, C2 & Botnets":
                        return { bg: "rgba(239, 68, 68, 0.12)", text: "#FCA5A5", border: "rgba(239, 68, 68, 0.3)" };
                      case "Phishing & Fraud":
                        return { bg: "rgba(249, 115, 22, 0.12)", text: "#FDBA74", border: "rgba(249, 115, 22, 0.3)" };
                      case "IP Reputation, Scanners & Network Telemetry":
                        return { bg: "rgba(99, 102, 241, 0.12)", text: "#A5B4FC", border: "rgba(99, 102, 241, 0.3)" };
                      case "Vulnerabilities & Exploitation":
                        return { bg: "rgba(16, 185, 129, 0.12)", text: "#6EE7B7", border: "rgba(16, 185, 129, 0.3)" };
                      case "Multi-Indicator Hubs & Aggregators":
                      default:
                        return { bg: "rgba(168, 85, 247, 0.12)", text: "#D8B4FE", border: "rgba(168, 85, 247, 0.3)" };
                    }
                  };
                  const catStyle = getCategoryStyle(feed.category);

                  return (
                    <div
                      key={feed.id}
                      style={{
                        background: isSelectedInMainFeed ? "rgba(59, 130, 246, 0.08)" : "rgba(15, 23, 42, 0.7)",
                        border: isSelectedInMainFeed ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        padding: "1.1rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "0.85rem",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <div>
                        {/* Feed Card Top Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                            <span style={{ fontSize: "1.35rem" }}>{feed.icon}</span>
                            <div>
                              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8FAFC", margin: 0, lineHeight: 1.25 }}>
                                {feed.name}
                              </h3>
                              <span style={{
                                display: "inline-block",
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                padding: "0.1rem 0.45rem",
                                borderRadius: "4px",
                                background: catStyle.bg,
                                color: catStyle.text,
                                border: `1px solid ${catStyle.border}`,
                                marginTop: "0.25rem"
                              }}>
                                {feed.category}
                              </span>
                            </div>
                          </div>

                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: feed.status === "Realtime" ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                            color: feed.status === "Realtime" ? "#34D399" : "#60A5FA",
                            border: feed.status === "Realtime" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(59, 130, 246, 0.3)"
                          }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: feed.status === "Realtime" ? "#34D399" : "#60A5FA" }}></span>
                            {feed.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Scope */}
                        <div style={{ fontSize: "0.78rem", color: "#E2E8F0", fontWeight: 600, marginBottom: "0.4rem" }}>
                          {feed.scope}
                        </div>

                        {/* Coverage Details */}
                        <p style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.45, margin: "0 0 0.65rem" }}>
                          {feed.coverage}
                        </p>

                        {/* Metadata Tags */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", fontSize: "0.72rem" }}>
                          <span style={{
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#CBD5E1"
                          }}>
                            📡 {feed.access}
                          </span>
                          <span style={{
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#CBD5E1"
                          }}>
                            ⏱️ {feed.refreshRate}
                          </span>
                          <span style={{
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            color: "#34D399",
                            fontWeight: 600
                          }}>
                            📊 {feed.recordsIngested.toLocaleString()} Ingested
                          </span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "0.65rem",
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                        gap: "0.5rem"
                      }}>
                        <a
                          href={feed.homepageUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          style={{
                            fontSize: "0.75rem",
                            color: "#60A5FA",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontWeight: 600
                          }}
                        >
                          <span>Official Endpoint</span>
                          <span>↗</span>
                        </a>

                        <button
                          onClick={() => {
                            handleFilterChange(() => setSelectedSourceFeed(isSelectedInMainFeed ? "ALL" : feed.id));
                            setIsFeedDirectoryOpen(false);
                          }}
                          style={{
                            padding: "0.3rem 0.75rem",
                            borderRadius: "6px",
                            background: isSelectedInMainFeed ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)",
                            border: isSelectedInMainFeed ? "1px solid #EF4444" : "1px solid #3B82F6",
                            color: isSelectedInMainFeed ? "#FCA5A5" : "#93C5FD",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          {isSelectedInMainFeed ? "Clear Filter" : "Filter UVI Feed"}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "0.85rem 1.75rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(15, 23, 42, 0.6)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "0.76rem", color: "#94A3B8" }}>
                All feed telemetry normalized into unified <code style={{ color: "#60A5FA" }}>UVI-YYYY-NNNN</code> schema and accessible via REST API: <code style={{ color: "#34D399" }}>/api/threat-feed?source=&lt;id&gt;</code>
              </span>

              <button
                onClick={() => setIsFeedDirectoryOpen(false)}
                style={{
                  padding: "0.4rem 1.25rem",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#F8FAFC",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
