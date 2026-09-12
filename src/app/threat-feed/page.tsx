"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import VirtualCisoView from "@/components/VirtualCisoView";
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
  getRecordObservationalAssessment,
  getExploitationRealityBadge,
  formatRelativeAge
} from "@/lib/threat-feed-data";

export default function ThreatFeedPage() {
  // Global Rating System Mode: "observational" (Behavioral Observational Ratings - Zero Numbers) vs "classic" (Classic CVSS v3.1 Scoring)
  const [ratingMode, setRatingMode] = useState<"observational" | "classic">("observational");

  // Quad-Perspective Scope State: "ALL" (Universal Threats) vs "DEV_BUILD" (Developer Exposure) vs "NON_CVE" (Pure Non-CVE Malware) vs "INFORMATIONAL" (Informational Disclosures & Vector Research)
  const [feedScope, setFeedScope] = useState<"ALL" | "DEV_BUILD" | "NON_CVE" | "INFORMATIONAL">("ALL");
  const [nonCveThreatsCount, setNonCveThreatsCount] = useState<number>(884);
  const [informationalDisclosuresCount, setInformationalDisclosuresCount] = useState<number>(72);

  // AI CTI Research Agent Background Telemetry
  const [agentTelemetry, setAgentTelemetry] = useState<{
    agentName: string;
    version: string;
    status: string;
    totalFindingsAnalyzed: number;
    monitoredChannels: string[];
    lastCycleTimestamp: string;
    unprocessedQueueCount: number;
  } | null>(null);

  // Feed Sources Directory Modal & Category Filtering
  const [isFeedDirectoryOpen, setIsFeedDirectoryOpen] = useState(false);
  const [feedDirectorySearch, setFeedDirectorySearch] = useState("");
  const [feedDirectoryCategory, setFeedDirectoryCategory] = useState<string>("ALL");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Alphabetized feeds list for sidebar
  const alphabetizedFeeds = useMemo(() => {
    return [...UVI_PUBLIC_FEED_SOURCES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const FEED_CATEGORIES: { id: string; label: string; icon: string; count: number }[] = [
    { id: "ALL", label: "All Feeds", icon: "🌐", count: UVI_PUBLIC_FEED_SOURCES.length },
    { id: "Research, Bug Bounty & Community Disclosures", label: "Research & Bounties", icon: "🔬", count: UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === "Research, Bug Bounty & Community Disclosures").length },
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
  const [sortBy, setSortBy] = useState<"cvss_desc" | "uvi_desc" | "uvi_asc" | "published_desc" | "published_asc">("cvss_desc");

  // Toggle date/age sort (Newest -> Oldest -> Newest)
  const handleToggleDateSort = () => {
    setPage(1);
    if (sortBy === "published_desc") {
      setSortBy("published_asc");
    } else {
      setSortBy("published_desc");
    }
  };

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Live Aggregated Data State
  const [advisories, setAdvisories] = useState<UviAdvisoryRecord[]>(CONSOLIDATED_UVI_ADVISORIES);
  const [totalUniversalCount, setTotalUniversalCount] = useState<number>(2723);
  const [directBuildImpactCount, setDirectBuildImpactCount] = useState<number>(989);
  const [matchedCount, setMatchedCount] = useState<number>(2723);
  const [totalPages, setTotalPages] = useState<number>(55);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLiveSynced, setHasLiveSynced] = useState<boolean>(false);

  // Inspection Dossier Modal State (Unified Threat Dossier & AI Explain Dialog)
  const [selectedAdvisory, setSelectedAdvisory] = useState<UviAdvisoryRecord | null>(null);
  const [dossierTab, setDossierTab] = useState<"overview" | "remediation" | "workstation" | "sources">("overview");
  const [copiedUviId, setCopiedUviId] = useState<string | null>(null);
  const [copiedModalCurl, setCopiedModalCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Single unified handler for opening the dossier modal directly into the Overview tab
  const handleOpenExplain = (record: UviAdvisoryRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAdvisory(record);
    setDossierTab("overview");
  };

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
        params.set("sortBy", sortBy);
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
              if (sortBy === "published_asc") return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
              return 0;
            });

            setAdvisories(sorted);
            if (typeof data.totalConsolidatedCount === "number") setTotalUniversalCount(data.totalConsolidatedCount);
            if (typeof data.directBuildImpactCount === "number") setDirectBuildImpactCount(data.directBuildImpactCount);
            if (typeof data.nonCveThreatsCount === "number") setNonCveThreatsCount(data.nonCveThreatsCount);
            if (typeof data.informationalDisclosuresCount === "number") setInformationalDisclosuresCount(data.informationalDisclosuresCount);
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

  // Fetch initial agent telemetry on mount
  useEffect(() => {
    fetch("/api/threat-feed/agent-research")
      .then(r => r.json())
      .then(data => {
        if (data && data.telemetry) {
          setAgentTelemetry(data.telemetry);
        }
      })
      .catch(() => {});
  }, []);

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
              {UVI_PUBLIC_FEED_SOURCES.length} Synchronized Upstream Public Feeds
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
            Consolidated real-time threat intelligence synthesizing official CVEs, active zero-days, and supply chain malware into standardized records.
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
                {UVI_PUBLIC_FEED_SOURCES.length}
              </div>

              {/* Stack of Category Icons */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                margin: "auto 0",
                alignItems: "center"
              }}>
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "7px",
                    background: searchQuery ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.05)",
                    border: searchQuery ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.1)",
                    color: searchQuery ? "#93C5FD" : "#CBD5E1",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    fontSize: "0.95rem"
                  }}
                  title={searchQuery ? `Searching: "${searchQuery}" (Click to expand)` : "Search Threats in Sidebar"}
                >
                  🔍
                </button>
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
                title={`View All ${UVI_PUBLIC_FEED_SOURCES.length} Feeds Directory Modal`}
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
                      {UVI_PUBLIC_FEED_SOURCES.length} Feeds
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

              {/* Main Threat & Target Search (Controls Center Feed) */}
              <div style={{ padding: "0.75rem 0.85rem 0.65rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    id="sidebar-main-search-input"
                    value={searchQuery}
                    onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                    placeholder="Search threats, CVEs, targets..."
                    style={{
                      width: "100%",
                      padding: "0.45rem 1.85rem 0.45rem 1.85rem",
                      background: "rgba(10, 14, 23, 0.85)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "7px",
                      color: "#F8FAFC",
                      fontSize: "0.8rem",
                      outline: "none",
                      transition: "border-color 0.15s ease"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#3B82F6"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"}
                  />
                  <span style={{
                    position: "absolute",
                    left: "0.6rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748B",
                    fontSize: "0.75rem",
                    pointerEvents: "none"
                  }}>
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => handleFilterChange(() => setSearchQuery(""))}
                      style={{
                        position: "absolute",
                        right: "0.45rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#94A3B8",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        padding: "2px"
                      }}
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
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
                    <span style={{
                      fontSize: "0.85rem",
                      flexShrink: 0,
                      width: "1.25rem",
                      minWidth: "1.25rem",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1
                    }}>🌐</span>
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

                {/* Alphabetized Feeds List (A to Z) */}
                {alphabetizedFeeds.map(feed => {
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
                        <span style={{
                          fontSize: "0.85rem",
                          flexShrink: 0,
                          width: "1.25rem",
                          minWidth: "1.25rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1
                        }}>
                          {feed.icon}
                        </span>
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
                  <span>View All {UVI_PUBLIC_FEED_SOURCES.length} Feeds Directory</span>
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
                  title="Assess real-world threat weaponization: CISA KEV active exploitation, in-the-wild campaigns, botnet C2 nodes, scanner sprays, and public PoCs"
                >
                  <span>🌐</span>
                  <span>Exploitation Reality View</span>
                  <span style={{
                    fontSize: "0.65rem",
                    background: ratingMode === "observational" ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.05)",
                    color: ratingMode === "observational" ? "#FFFFFF" : "#64748B",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: 600
                  }}>
                    IN-THE-WILD
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
                <span>{isSidebarCollapsed ? `Show Feeds (${UVI_PUBLIC_FEED_SOURCES.length})` : "Hide Sidebar"}</span>
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
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.3)"
      }}>
        {/* Dropdown Filter Controls */}
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
              {alphabetizedFeeds.map(feed => (
                <option key={feed.id} value={feed.id}>
                  {feed.icon} {feed.name}
                </option>
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
              onChange={(e) => {
                setPage(1);
                setSortBy(e.target.value as any);
              }}
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
                  <option value="published_asc">Date (Oldest First)</option>
                  <option value="uvi_desc">UVI ID (Descending)</option>
                  <option value="uvi_asc">UVI ID (Ascending)</option>
                </>
              ) : (
                <>
                  <option value="cvss_desc">CVSS Score (Highest First)</option>
                  <option value="published_desc">Date (Newest First)</option>
                  <option value="published_asc">Date (Oldest First)</option>
                  <option value="uvi_desc">UVI ID (Descending)</option>
                  <option value="uvi_asc">UVI ID (Ascending)</option>
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
          {/* SCROLLABLE TABLE CONTENT BODY WITH STICKY HEADER */}
          <div 
            id="uvi-advisories-scroll-body"
            style={{ 
              maxHeight: "750px", 
              overflowY: "auto", 
              overflowX: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(59, 130, 246, 0.4) rgba(15, 23, 42, 0.6)"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "760px" }}>
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
                    Identifier
                  </th>
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8" }}>
                    Threat & Target Summary
                  </th>
                  <th 
                    onClick={handleToggleDateSort}
                    style={{ 
                      padding: "1.1rem 1.1rem", 
                      fontSize: "0.75rem", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.08em", 
                      color: (sortBy === "published_desc" || sortBy === "published_asc") ? "#60A5FA" : "#94A3B8", 
                      width: "135px",
                      cursor: "pointer",
                      userSelect: "none",
                      transition: "color 0.15s ease"
                    }}
                    title="Click to sort by date / age (toggle newest/oldest)"
                  >
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <span>Date / Age</span>
                      <span style={{ 
                        fontSize: "0.85rem",
                        color: (sortBy === "published_desc" || sortBy === "published_asc") ? "#60A5FA" : "#64748B",
                        fontWeight: 700
                      }}>
                        {sortBy === "published_desc" ? "↓" : sortBy === "published_asc" ? "↑" : "↕"}
                      </span>
                    </div>
                  </th>
                  <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "195px", textAlign: "right" }}>
                    {ratingMode === "observational" ? "Exploitation Reality" : "Severity & Score"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {advisories.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
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
                          cursor: "pointer",
                          background: "transparent",
                          borderLeft: "3px solid transparent"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(30, 41, 59, 0.45)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {/* Column 1: Identifier */}
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
                                  📡 INFO DISCLOSURE
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
                                    ? "🧩 MALICIOUS EXT" 
                                    : record.affectedTargets[0]?.ecosystem?.includes("GitHub Actions")
                                    ? "⚡ WORKFLOW EXPLOIT"
                                    : "🛡️ NON-CVE MALWARE"}
                                </span>
                              )}
                            </div>

                            {/* Explain trigger button underneath identifiers */}
                            <div style={{ marginTop: "0.35rem" }}>
                              <button
                                onClick={(e) => handleOpenExplain(record, e)}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.35rem",
                                  padding: "0.22rem 0.55rem",
                                  borderRadius: "6px",
                                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.22) 0%, rgba(79, 70, 229, 0.22) 100%)",
                                  border: "1px solid rgba(167, 139, 250, 0.45)",
                                  color: "#DDD6FE",
                                  fontSize: "0.71rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                  boxShadow: "0 0 10px rgba(139, 92, 246, 0.15)",
                                  whiteSpace: "nowrap"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(124, 58, 237, 0.4) 0%, rgba(79, 70, 229, 0.4) 100%)";
                                  e.currentTarget.style.borderColor = "#A78BFA";
                                  e.currentTarget.style.color = "#FFFFFF";
                                  e.currentTarget.style.boxShadow = "0 0 14px rgba(167, 139, 250, 0.35)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(124, 58, 237, 0.22) 0%, rgba(79, 70, 229, 0.22) 100%)";
                                  e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.45)";
                                  e.currentTarget.style.color = "#DDD6FE";
                                  e.currentTarget.style.boxShadow = "0 0 10px rgba(139, 92, 246, 0.15)";
                                }}
                                title="Explain: Plain-English explanation, analogy & code remediation"
                              >
                                <span>✨</span>
                                <span>Explain</span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Threat & Target Summary */}
                        <td style={{ padding: "1.1rem 1.25rem", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {/* Title */}
                            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.35 }}>
                              {record.title}
                            </div>

                            {/* Headline / Summary */}
                            <div style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5 }}>
                              {record.headline}
                            </div>

                            {/* Affected Target(s) Badges */}
                            {record.affectedTargets.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                                {record.affectedTargets.slice(0, 3).map((tgt, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      fontSize: "0.74rem",
                                      fontWeight: 600,
                                      background: "rgba(255, 255, 255, 0.05)",
                                      border: "1px solid rgba(255, 255, 255, 0.09)",
                                      color: "#E2E8F0",
                                      padding: "0.2rem 0.5rem",
                                      borderRadius: "5px",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.35rem"
                                    }}
                                  >
                                    <span style={{ color: "#93C5FD" }}>📦 {tgt.product}</span>
                                    {tgt.affectedVersions && (
                                      <span style={{ color: "#F87171", fontSize: "0.7rem" }}>
                                        {tgt.affectedVersions}
                                      </span>
                                    )}
                                    {tgt.fixedInVersion && (
                                      <span style={{ color: "#34D399", fontSize: "0.7rem", fontWeight: 700 }}>
                                        (fix: {tgt.fixedInVersion})
                                      </span>
                                    )}
                                  </span>
                                ))}
                                {record.affectedTargets.length > 3 && (
                                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                    +{record.affectedTargets.length - 3} more targets
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Metadata tags: CWE, Feed Signals Count, Direct Build Impact */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                              {record.cwe && (
                                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                  {record.cwe}
                                </span>
                              )}
                              <span style={{
                                fontSize: "0.68rem",
                                color: "#94A3B8",
                                background: "rgba(255, 255, 255, 0.04)",
                                border: "1px solid rgba(255, 255, 255, 0.07)",
                                padding: "0.1rem 0.45rem",
                                borderRadius: "4px"
                              }}>
                                📡 {record.upstreamSignals.length} feed signal{record.upstreamSignals.length === 1 ? "" : "s"}
                              </span>
                              {hasDevImpact && (
                                <span style={{
                                  fontSize: "0.68rem",
                                  fontWeight: 700,
                                  color: "#34D399",
                                  background: "rgba(16, 185, 129, 0.12)",
                                  border: "1px solid rgba(16, 185, 129, 0.3)",
                                  padding: "0.1rem 0.45rem",
                                  borderRadius: "4px"
                                }}>
                                  💻 Direct Build Impact
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Column 3: Date & Age (Clickable sort in header) */}
                        <td style={{ padding: "1.1rem 1.1rem", width: "135px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <span style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700, color: "#E2E8F0" }}>
                              {record.publishedDate}
                            </span>
                            {(() => {
                              const age = formatRelativeAge(record.publishedDate);
                              return age ? (
                                <span style={{
                                  fontSize: "0.68rem",
                                  color: "#94A3B8",
                                  background: "rgba(255, 255, 255, 0.04)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  padding: "0.1rem 0.4rem",
                                  borderRadius: "4px",
                                  width: "fit-content",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem"
                                }}>
                                  <span>⏱️</span>
                                  <span>{age}</span>
                                </span>
                              ) : null;
                            })()}
                          </div>
                        </td>

                        {/* Column 4: Exploitation Reality (or Severity & Score in classic mode) */}
                        <td style={{ padding: "1.1rem 1.25rem", width: "195px", verticalAlign: "top", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            {ratingMode === "observational" ? (
                              (() => {
                                const reality = getExploitationRealityBadge(record);
                                return (
                                  <div style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    padding: "0.32rem 0.65rem",
                                    borderRadius: "6px",
                                    background: reality.bg,
                                    border: `1px solid ${reality.border}`,
                                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
                                    whiteSpace: "nowrap"
                                  }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: reality.dot }}></span>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: reality.text, letterSpacing: "0.02em" }}>
                                      {reality.label}
                                    </span>
                                  </div>
                                );
                              })()
                            ) : (
                              <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                padding: "0.32rem 0.65rem",
                                borderRadius: "6px",
                                background: sevStyle.bg,
                                border: `1px solid ${sevStyle.border}`,
                                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
                                whiteSpace: "nowrap"
                              }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sevStyle.dot }}></span>
                                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: sevStyle.text }}>
                                  {record.severity} {record.cvssScore.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
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
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
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
                          const reality = getExploitationRealityBadge(record);
                          return (
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "6px",
                              background: reality.bg,
                              border: `1px solid ${reality.border}`
                            }}>
                              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: reality.dot }}></span>
                              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: reality.text }}>
                                {reality.label}
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

                    {/* Dev Impact Alert Banner if applicable */}
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

                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <button
                        onClick={(e) => handleOpenExplain(record, e)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.22rem 0.65rem",
                          borderRadius: "6px",
                          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(79, 70, 229, 0.25) 100%)",
                          border: "1px solid rgba(167, 139, 250, 0.5)",
                          color: "#DDD6FE",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          boxShadow: "0 0 10px rgba(139, 92, 246, 0.15)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "linear-gradient(135deg, rgba(124, 58, 237, 0.42) 0%, rgba(79, 70, 229, 0.42) 100%)";
                          e.currentTarget.style.borderColor = "#C4B5FD";
                          e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(79, 70, 229, 0.25) 100%)";
                          e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.5)";
                          e.currentTarget.style.color = "#DDD6FE";
                        }}
                        title="Explain: Plain-English explanation & code remediation"
                      >
                        <span>✨</span>
                        <span>Explain</span>
                      </button>

                      <span style={{ fontSize: "0.8rem", color: "#60A5FA", fontWeight: 600 }}>
                        View Dossier →
                      </span>
                    </div>
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

                  {/* Severity Pill or Exploitation Reality Pill */}
                  {ratingMode === "observational" ? (
                    (() => {
                      const reality = getExploitationRealityBadge(selectedAdvisory);
                      return (
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "4px",
                          background: reality.bg,
                          color: reality.text,
                          border: `1px solid ${reality.border}`
                        }}>
                          {reality.label}
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

            {/* Unified Tabs Navigation (Overview & Explain, Workstation, Sources) */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(8, 12, 20, 0.95)",
              padding: "0 1.75rem",
              overflowX: "auto"
            }}>
              {[
                { id: "overview", label: "Overview" },
                { id: "remediation", label: "Remediation & Fix" },
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
              {/* TAB 1: Overview */}
              {dossierTab === "overview" && (
                <VirtualCisoView
                  advisory={selectedAdvisory}
                  ratingMode={ratingMode}
                  view="overview"
                />
              )}

              {/* TAB 2: Remediation & Fix */}
              {dossierTab === "remediation" && (
                <VirtualCisoView
                  advisory={selectedAdvisory}
                  ratingMode={ratingMode}
                  view="remediation"
                />
              )}

              {/* TAB 3: Workstation & Pipeline Impact */}
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
                    SYNCHRONIZED NETWORK
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
                    placeholder={`Search ${UVI_PUBLIC_FEED_SOURCES.length} threat feeds by name, protocol, URL, or coverage scope...`}
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
                      case "Research, Bug Bounty & Community Disclosures":
                        return { bg: "rgba(6, 182, 212, 0.12)", text: "#67E8F9", border: "rgba(6, 182, 212, 0.35)" };
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
                All feed telemetry normalized into unified <code style={{ color: "#60A5FA" }}>UVI-YYYY-MM-000001</code> schema and accessible via REST API: <code style={{ color: "#34D399" }}>/api/threat-feed?source=&lt;id&gt;</code>
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
