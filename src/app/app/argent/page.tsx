"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArgentIcon, KineticIcon, VantageIcon } from "@/components/BrandIcons";
import { 
  ArgentPatchBundle, 
  ArgentPublicFeedSource, 
  ARGENT_PUBLIC_FEED_SOURCES, 
  ARGENT_PATCH_BUNDLES, 
  ArgentVendorSeverity, 
  ArgentOperationalDomain,
  ArgentAdvisoryType,
  getArgentOperationalDomainBadge,
  getArgentAdvisoryTypeBadge,
  formatRelativeAge
} from "@/lib/argent-feed";
import { 
  Search, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Filter, 
  Layers, 
  Zap, 
  RefreshCw, 
  FileText, 
  Server, 
  Download, 
  Check, 
  Info,
  ChevronRight,
  Database,
  Radio,
  Package,
  Cpu,
  ArrowRight,
  Shield,
  Bug,
  Wrench
} from "lucide-react";

export default function ArgentThreatFeedPage() {
  // Global Rating System Mode: "observational" (Zero-Downtime Rollout / Operational Impact) vs "classic" (Classic Quantitative Vendor Severity)
  const [ratingMode, setRatingMode] = useState<"observational" | "classic">("observational");

  // Quad-Perspective Scope State: "ALL" vs "ZERO_REBOOT" vs "KERNEL_CORE" vs "ENTERPRISE_LTS"
  const [feedScope, setFeedScope] = useState<"ALL" | "ZERO_REBOOT" | "KERNEL_CORE" | "ENTERPRISE_LTS">("ALL");

  // Advisory Type Filter: "ALL" vs "SECURITY" vs "BUGFIX" vs "ENHANCEMENT" vs "MAINTENANCE"
  const [selectedAdvisoryType, setSelectedAdvisoryType] = useState<string>("ALL");

  // Feed Sources Directory Modal & Category Filtering
  const [isFeedDirectoryOpen, setIsFeedDirectoryOpen] = useState(false);
  const [feedDirectorySearch, setFeedDirectorySearch] = useState("");
  const [feedDirectoryCategory, setFeedDirectoryCategory] = useState<string>("ALL");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Alphabetized feeds list for sidebar
  const alphabetizedFeeds = useMemo(() => {
    return [...ARGENT_PUBLIC_FEED_SOURCES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const FEED_CATEGORIES = useMemo(() => [
    { id: "ALL", label: "All Distros", icon: "≡ƒîÉ", count: ARGENT_PUBLIC_FEED_SOURCES.length },
    { id: "Debian & Ubuntu Ecosystem", label: "Debian & Ubuntu", icon: "≡ƒƒá", count: ARGENT_PUBLIC_FEED_SOURCES.filter(f => f.category === "Debian & Ubuntu Ecosystem").length },
    { id: "Enterprise Linux (RHEL/Rocky/Alma)", label: "Enterprise Linux", icon: "≡ƒƒó", count: ARGENT_PUBLIC_FEED_SOURCES.filter(f => f.category === "Enterprise Linux (RHEL/Rocky/Alma)").length },
    { id: "Lightweight & Container OS", label: "Container & Edge", icon: "≡ƒÅö∩╕Å", count: ARGENT_PUBLIC_FEED_SOURCES.filter(f => f.category === "Lightweight & Container OS").length },
    { id: "Cloud & Hyperscaler Linux", label: "Cloud & Hyperscalers", icon: "≡ƒôª", count: ARGENT_PUBLIC_FEED_SOURCES.filter(f => f.category === "Cloud & Hyperscaler Linux").length },
    { id: "BSD & Unix Ecosystem", label: "BSD & UNIX", icon: "≡ƒÿê", count: ARGENT_PUBLIC_FEED_SOURCES.filter(f => f.category === "BSD & Unix Ecosystem").length },
    { id: "Independent & Rolling Distros", label: "Rolling & Community", icon: "≡ƒÅ╣", count: ARGENT_PUBLIC_FEED_SOURCES.filter(f => f.category === "Independent & Rolling Distros").length },
    { id: "Embedded & Edge Linux", label: "Embedded & IoT", icon: "≡ƒô╢", count: ARGENT_PUBLIC_FEED_SOURCES.filter(f => f.category === "Embedded & Edge Linux").length },
    { id: "Upstream Linux Kernel", label: "Kernel Stable", icon: "≡ƒÉº", count: ARGENT_PUBLIC_FEED_SOURCES.filter(f => f.category === "Upstream Linux Kernel").length }
  ], []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedSourceFeed, setSelectedSourceFeed] = useState<string>("ALL");
  const [zeroDowntimeOnly, setZeroDowntimeOnly] = useState(false);
  const [rebootRequiredOnly, setRebootRequiredOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState<"cvss_desc" | "published_desc" | "published_asc" | "id_asc" | "id_desc">("cvss_desc");

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
  const [bundles, setBundles] = useState<ArgentPatchBundle[]>([]);
  const [totalUniversalCount, setTotalUniversalCount] = useState<number>(0);
  const [generalCount, setGeneralCount] = useState<number>(0);
  const [bugfixCount, setBugfixCount] = useState<number>(0);
  const [enhancementCount, setEnhancementCount] = useState<number>(0);
  const [maintenanceCount, setMaintenanceCount] = useState<number>(0);
  const [zeroDowntimeCount, setZeroDowntimeCount] = useState<number>(0);
  const [rebootRequiredCount, setRebootRequiredCount] = useState<number>(0);
  const [totalPackagesCount, setTotalPackagesCount] = useState<number>(0);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Inspection Dossier Modal State
  const [selectedBundle, setSelectedBundle] = useState<ArgentPatchBundle | null>(null);
  const [dossierTab, setDossierTab] = useState<"overview" | "packages" | "remediation" | "provenance">("overview");
  const [copiedBundleId, setCopiedBundleId] = useState<string | null>(null);
  const [copiedModalCurl, setCopiedModalCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Kinetic deploy modal state
  const [deployBundle, setDeployBundle] = useState<ArgentPatchBundle | null>(null);

  // Single unified handler for opening the dossier modal directly into the Overview tab
  const handleOpenExplain = (record: ArgentPatchBundle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedBundle(record);
    setDossierTab("overview");
  };

  // Available operational domains list
  const operationalDomains: ("ALL" | ArgentOperationalDomain)[] = [
    "ALL",
    "PATCH",
    "CORE",
    "NETWORK",
    "KERNEL",
    "CONTAINER",
    "SYSTEMD",
    "STORAGE",
    "DRIVER",
    "STABILITY",
    "PERFORMANCE"
  ];

  // Fetch from Aggregator API whenever filters, search, or pagination changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("query", searchQuery.trim());
        if (feedScope !== "ALL") params.set("scope", feedScope);
        if (selectedAdvisoryType !== "ALL") params.set("type", selectedAdvisoryType);
        if (selectedDomain !== "ALL") params.set("domain", selectedDomain);
        if (ratingMode === "classic" && selectedSeverity !== "ALL") {
          params.set("severity", selectedSeverity);
        }
        if (selectedSourceFeed !== "ALL") params.set("source", selectedSourceFeed);
        if (zeroDowntimeOnly) params.set("reboot", "false");
        if (rebootRequiredOnly) params.set("reboot", "true");
        params.set("sortBy", sortBy);
        params.set("page", page.toString());
        params.set("limit", pageSize.toString());

        const res = await fetch(`/api/argent/feed?${params.toString()}`);
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data && Array.isArray(data.bundles)) {
            setBundles(data.bundles);
            setTotalUniversalCount(data.totalConsolidatedCount ?? ARGENT_PATCH_BUNDLES.length);
            setGeneralCount(data.generalCount ?? ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'GENERAL').length);
            setBugfixCount(data.bugfixCount ?? ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'BUGFIX').length);
            setEnhancementCount(data.enhancementCount ?? ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'ENHANCEMENT').length);
            setMaintenanceCount(data.maintenanceCount ?? ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'MAINTENANCE').length);
            setZeroDowntimeCount(data.zeroDowntimeCount ?? ARGENT_PATCH_BUNDLES.filter(b => b.impact.zeroDowntime).length);
            setRebootRequiredCount(data.rebootRequiredCount ?? ARGENT_PATCH_BUNDLES.filter(b => b.impact.rebootRequired).length);
            setTotalPackagesCount(data.totalPackagesUpdated ?? ARGENT_PATCH_BUNDLES.reduce((acc, b) => acc + b.packages.length, 0));
            setMatchedCount(data.total ?? data.bundles.length);
            setTotalPages(data.totalPages || Math.ceil((data.total || data.bundles.length) / pageSize));
          }
        }
      } catch (err) {
        console.error("Failed to fetch live aggregated Argent feed:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, feedScope, selectedAdvisoryType, ratingMode, selectedSeverity, selectedDomain, selectedSourceFeed, zeroDowntimeOnly, rebootRequiredOnly, page, pageSize, sortBy]);

  // Reset page to 1 when filters change
  const handleFilterChange = (setter: () => void) => {
    setPage(1);
    setter();
  };

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedBundleId(id);
    setTimeout(() => setCopiedBundleId(null), 2500);
  };

  const handleCopyModalCurl = (record: ArgentPatchBundle) => {
    const curlCmd = `curl -s "https://exultia.tech/api/argent/feed?q=${record.bundleId}" | jq .`;
    navigator.clipboard.writeText(curlCmd);
    setCopiedModalCurl(true);
    setTimeout(() => setCopiedModalCurl(false), 2500);
  };

  const handleCopyJson = (record: ArgentPatchBundle) => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const getSeverityStyle = (sev: ArgentVendorSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return {
          bg: "rgba(239, 68, 68, 0.15)",
          border: "rgba(239, 68, 68, 0.4)",
          text: "#F87171",
          dot: "#EF4444"
        };
      case "IMPORTANT":
        return {
          bg: "rgba(249, 115, 22, 0.15)",
          border: "rgba(249, 115, 22, 0.4)",
          text: "#FB923C",
          dot: "#F97316"
        };
      case "MODERATE":
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

  const totalUpstreamRecords = ARGENT_PUBLIC_FEED_SOURCES.reduce((acc, f) => acc + f.recordsIngested, 0);

  return (
    <div 
      style={{ maxWidth: "1720px", margin: "0 auto", padding: "2rem 1.75rem 5rem", width: "100%", userSelect: "none" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Direct Subscription / Referral Banner */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        background: "linear-gradient(90deg, rgba(56, 189, 248, 0.12), rgba(148, 163, 184, 0.12))",
        border: "1px solid rgba(56, 189, 248, 0.35)",
        borderRadius: "12px",
        padding: "0.75rem 1.25rem",
        marginBottom: "1.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.88rem", color: "#E2E8F0", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1.1rem" }}>ΓÜí</span>
          <span>
            <strong>Argent Licensing:</strong> Looking for machine-readable distro patch feeds, automated errata webhooks, or enterprise fleet seats?
          </span>
          <span style={{
            fontSize: "0.75rem",
            padding: "0.2rem 0.55rem",
            borderRadius: "6px",
            background: "rgba(56, 189, 248, 0.2)",
            color: "#38BDF8",
            fontWeight: 700
          }}>
            Community ┬╖ Pro ┬╖ Enterprise Tiers
          </span>
        </div>
        <Link
          href="/account/subscription?product=kinetic"
          style={{
            padding: "0.45rem 1rem",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#0F172A",
            background: "linear-gradient(135deg, #38BDF8, #0284C7)",
            borderRadius: "8px",
            textDecoration: "none",
            boxShadow: "0 2px 10px rgba(56, 189, 248, 0.35)",
            whiteSpace: "nowrap"
          }}
        >
          View Plans &amp; Upgrade ΓåÆ
        </Link>
      </div>

      {/* Top Header Row: Title & Subtitle (Left) + Patches Total Tile (Right) */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "stretch", 
        gap: "2rem", 
        marginBottom: "1.5rem",
        flexWrap: "wrap"
      }}>
        {/* Left Column: Title & Subtitle */}
        <div style={{ flex: "1 1 540px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <ArgentIcon size={44} glow={true} />
            <h1 style={{ 
              fontSize: "2.35rem", 
              fontWeight: 800, 
              letterSpacing: "-0.03em", 
              color: "#F8FAFC",
              margin: 0,
              lineHeight: 1.2
            }}>
              Argent
            </h1>
          </div>
          <p style={{ fontSize: "0.98rem", color: "var(--text-muted)", maxWidth: "760px", lineHeight: 1.6, margin: "0 0 0.5rem 0" }}>
            Aggregating authoritative regular vendor operating system updates, non-security stability errata, driver enhancements, and maintenance point releases across {ARGENT_PUBLIC_FEED_SOURCES.length} Linux, BSD, and Cloud distributions.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#94A3B8" }}>
            <span>Seeking vulnerability advisories, CVEs, or zero-days?</span>
            <Link href="/app/uvi" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              Explore Vantage Threat Feed <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Column: Patches Total Summary Tile */}
        <div style={{
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
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
              Total Consolidated Patch Bundles
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
            <span>≡ƒÉ¢ <strong style={{ color: "#FBBF24" }}>{bugfixCount}</strong> Bug Fixes</span>
            <span>ΓÇó</span>
            <span>ΓÜí <strong style={{ color: "#38BDF8" }}>{enhancementCount}</strong> Enhancements</span>
            <span>ΓÇó</span>
            <span>≡ƒöº <strong style={{ color: "#A78BFA" }}>{maintenanceCount}</strong> Maintenance</span>
            <span>ΓÇó</span>
            <span>≡ƒôª <strong style={{ color: "#C084FC" }}>{totalPackagesCount}</strong> Packages</span>
            <span>ΓÇó</span>
            <span>≡ƒîÉ <strong style={{ color: "#34D399" }}>{ARGENT_PUBLIC_FEED_SOURCES.length}</strong> Distros</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Distro Feeds Sidebar (Left) + Advisories Content (Right) */}
      <div style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "flex-start",
        position: "relative"
      }}>
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: Distro Feed Sources Navigation                              */}
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
          border: "1px solid rgba(148, 163, 184, 0.18)",
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
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  color: "#38BDF8",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
                title="Expand Distro Feeds Sidebar"
              >
                Γû╢
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
                {ARGENT_PUBLIC_FEED_SOURCES.length}
              </div>

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
                    background: searchQuery ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.05)",
                    border: searchQuery ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.1)",
                    color: searchQuery ? "#38BDF8" : "#CBD5E1",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    fontSize: "0.95rem"
                  }}
                  title={searchQuery ? `Searching: "${searchQuery}" (Click to expand)` : "Search Distro Patches in Sidebar"}
                >
                  ≡ƒöì
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
                title={`View All ${ARGENT_PUBLIC_FEED_SOURCES.length} Distro Feeds Directory Modal`}
              >
                ≡ƒîÉ
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
                    <span style={{ fontSize: "1rem" }}>≡ƒîÉ</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#F8FAFC", letterSpacing: "0.02em" }}>
                      Distro Feeds
                    </span>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.1rem 0.45rem",
                      borderRadius: "4px",
                      background: "rgba(56, 189, 248, 0.15)",
                      color: "#38BDF8",
                      border: "1px solid rgba(56, 189, 248, 0.3)"
                    }}>
                      {ARGENT_PUBLIC_FEED_SOURCES.length} Feeds
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
                    ΓùÇ
                  </button>
                </div>

                <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                  {((totalUpstreamRecords) / 1000).toFixed(0)}k+ Synchronized Errata Records
                </div>
              </div>

              {/* Main Distro & Package Search */}
              <div style={{ padding: "0.75rem 0.85rem 0.65rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    id="sidebar-main-search-input"
                    value={searchQuery}
                    onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                    placeholder="Search errata, packages, CVEs..."
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
                    onFocus={(e) => e.currentTarget.style.borderColor = "#38BDF8"}
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
                    ≡ƒöì
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
                      Γ£ò
                    </button>
                  )}
                </div>
              </div>

              {/* Active Feed Filter Reset Banner (If a specific feed is active) */}
              {selectedSourceFeed !== "ALL" && (
                <div style={{
                  margin: "0.4rem 0.85rem 0",
                  padding: "0.4rem 0.65rem",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem"
                }}>
                  <div style={{ fontSize: "0.72rem", color: "#BAE6FD", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Filtered: {ARGENT_PUBLIC_FEED_SOURCES.find(f => f.id === selectedSourceFeed)?.name || selectedSourceFeed}
                  </div>
                  <button
                    onClick={() => handleFilterChange(() => setSelectedSourceFeed("ALL"))}
                    style={{
                      background: "rgba(56, 189, 248, 0.2)",
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
                    Reset Γ£ò
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
                    background: selectedSourceFeed === "ALL" ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.02)",
                    border: selectedSourceFeed === "ALL" ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.05)",
                    color: selectedSourceFeed === "ALL" ? "#38BDF8" : "#E2E8F0",
                    fontSize: "0.78rem",
                    fontWeight: selectedSourceFeed === "ALL" ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.12s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "0.85rem" }}>≡ƒîÉ</span>
                    <span>All Distros Combined</span>
                  </div>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: selectedSourceFeed === "ALL" ? "#38BDF8" : "#64748B"
                  }}>
                    {ARGENT_PATCH_BUNDLES.length} bundles
                  </span>
                </button>

                {/* Alphabetized Feeds List (A to Z) */}
                {alphabetizedFeeds.map(feed => {
                  const isSelected = selectedSourceFeed === feed.id;
                  const recFormatted = `${Math.round(feed.recordsIngested / 1000)}k`;

                  return (
                    <button
                      key={feed.id}
                      onClick={() => handleFilterChange(() => setSelectedSourceFeed(isSelected ? "ALL" : feed.id))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.45rem",
                        padding: "0.42rem 0.65rem",
                        borderRadius: "6px",
                        background: isSelected ? "rgba(56, 189, 248, 0.15)" : "transparent",
                        border: isSelected ? "1px solid #38BDF8" : "1px solid transparent",
                        color: isSelected ? "#38BDF8" : "#CBD5E1",
                        fontSize: "0.77rem",
                        fontWeight: isSelected ? 700 : 400,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s ease"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", minWidth: 0 }}>
                        <span style={{ fontSize: "0.85rem", flexShrink: 0 }}>{feed.icon}</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {feed.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: "0.68rem",
                        color: isSelected ? "#38BDF8" : "#64748B",
                        fontFamily: "monospace",
                        flexShrink: 0
                      }}>
                        {recFormatted}
                      </span>
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
                    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.15))",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    color: "#BAE6FD",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <span>≡ƒîÉ</span>
                  <span>View All {ARGENT_PUBLIC_FEED_SOURCES.length} Distro Feeds</span>
                  <span>Γåù</span>
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
            border: "1px solid rgba(148, 163, 184, 0.18)",
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
                    border: ratingMode === "observational" ? "1px solid #38BDF8" : "1px solid transparent",
                    background: ratingMode === "observational" ? "rgba(56, 189, 248, 0.25)" : "transparent",
                    color: ratingMode === "observational" ? "#BAE6FD" : "#94A3B8",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  title="Prioritize zero-downtime micro-mitigations and instant live service reloads"
                >
                  <span>ΓÜí</span>
                  <span>Zero-Downtime Rollout View</span>
                  <span style={{
                    fontSize: "0.65rem",
                    background: ratingMode === "observational" ? "rgba(56, 189, 248, 0.4)" : "rgba(255, 255, 255, 0.05)",
                    color: ratingMode === "observational" ? "#FFFFFF" : "#64748B",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: 600
                  }}>
                    ZERO-DOWNTIME
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
                  title="Assess patches using conventional quantitative vendor severity classifications"
                >
                  <span>≡ƒôè</span>
                  <span>Classic Vendor Severity</span>
                  <span style={{
                    fontSize: "0.65rem",
                    background: ratingMode === "classic" ? "rgba(245, 158, 11, 0.35)" : "rgba(255, 255, 255, 0.05)",
                    color: ratingMode === "classic" ? "#FFFFFF" : "#64748B",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: 600
                  }}>
                    VENDOR ERRATA
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
                  background: isSidebarCollapsed ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border: isSidebarCollapsed ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: isSidebarCollapsed ? "#BAE6FD" : "#CBD5E1",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                title={isSidebarCollapsed ? "Expand Distro Feeds Sidebar" : "Collapse Distro Feeds Sidebar to Maximize Table Width"}
              >
                <span>{isSidebarCollapsed ? "ΓÜí" : "ΓùÇ"}</span>
                <span>{isSidebarCollapsed ? `Show Feeds (${ARGENT_PUBLIC_FEED_SOURCES.length})` : "Hide Sidebar"}</span>
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
                  ≡ƒôï Table
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
                  ≡ƒÄ┤ Cards
                </button>
              </div>
            </div>
          </div>

          {/* Unified Filter Control Bar */}
          <div style={{
            background: "rgba(15, 20, 32, 0.8)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.3)"
          }}>
            {/* Advisory Stream Selector: Security vs Bugfix vs Enhancement vs Maintenance */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              paddingBottom: "0.6rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.07)"
            }}>
              <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
                Advisory Stream:
              </span>
              {[
                { id: "ALL", label: "All Regular Updates", icon: "≡ƒîÉ", count: totalUniversalCount },
                { id: "BUGFIX", label: "Bug Fixes (RHBA/RLBA/EN)", icon: "≡ƒÉ¢", count: bugfixCount },
                { id: "ENHANCEMENT", label: "Enhancements (HWE/Perf)", icon: "ΓÜí", count: enhancementCount },
                { id: "MAINTENANCE", label: "Maintenance & Point Releases", icon: "≡ƒöº", count: maintenanceCount },
                { id: "GENERAL", label: "General Packages", icon: "≡ƒôª", count: generalCount }
              ].map(tab => {
                const isActive = selectedAdvisoryType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleFilterChange(() => setSelectedAdvisoryType(tab.id))}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.3rem 0.65rem",
                      borderRadius: "6px",
                      background: isActive ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.04)",
                      border: isActive ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.08)",
                      color: isActive ? "#38BDF8" : "#94A3B8",
                      fontSize: "0.76rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span style={{
                      fontSize: "0.68rem",
                      padding: "0.05rem 0.35rem",
                      borderRadius: "4px",
                      background: isActive ? "rgba(56, 189, 248, 0.3)" : "rgba(255, 255, 255, 0.06)",
                      color: isActive ? "#FFFFFF" : "#64748B",
                      fontWeight: 600
                    }}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown Filter Controls */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
              {/* Feed Source Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, minWidth: "180px" }}>
                <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
                  Distro Feed Source
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
                  <option value="ALL">All Distros ({ARGENT_PUBLIC_FEED_SOURCES.length} Feeds)</option>
                  {alphabetizedFeeds.map(feed => (
                    <option key={feed.id} value={feed.id}>
                      {feed.icon} {feed.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subsystem / Operational Domain Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "200px" }}>
                <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
                  Subsystem Domain
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
                  <option value="ALL">All Subsystems (10 Domains)</option>
                  <option value="PATCH">ΓÜí Patch &amp; Packaging</option>
                  <option value="CORE">ΓÜÖ∩╕Å Core &amp; Glibc</option>
                  <option value="NETWORK">≡ƒîÉ Network &amp; SSH</option>
                  <option value="KERNEL">≡ƒÉº Kernel &amp; Drivers</option>
                  <option value="CONTAINER">≡ƒôª Container &amp; Musl</option>
                  <option value="SYSTEMD">≡ƒöÆ Systemd &amp; Services</option>
                  <option value="STORAGE">≡ƒÆ╛ Storage &amp; NVMe</option>
                  <option value="DRIVER">≡ƒöî Driver &amp; Hardware</option>
                  <option value="STABILITY">≡ƒ¢í∩╕Å Stability &amp; Resiliency</option>
                  <option value="PERFORMANCE">≡ƒÜÇ Performance Tuning</option>
                </select>
              </div>

              {/* Patch Scope Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, minWidth: "190px" }}>
                <label style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
                  Patch Scope
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
                  <option value="ALL">≡ƒîÉ All Universal Advisories ({totalUniversalCount.toLocaleString()})</option>
                  <option value="ZERO_REBOOT">ΓÜí Zero-Downtime Rollouts ({zeroDowntimeCount.toLocaleString()})</option>
                  <option value="KERNEL_CORE">≡ƒÉº Kernel &amp; Core Subsystems</option>
                  <option value="ENTERPRISE_LTS">≡ƒÅó Enterprise LTS Releases</option>
                </select>
              </div>

              {/* Severity Dropdown (Only in Classic Mode) */}
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
                    <option value="CRITICAL">Critical</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="LOW">Low</option>
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
                  <option value="cvss_desc">Severity &amp; Reality (Highest First)</option>
                  <option value="published_desc">Date (Newest First)</option>
                  <option value="published_asc">Date (Oldest First)</option>
                  <option value="id_desc">Bundle ID (Descending)</option>
                  <option value="id_asc">Bundle ID (Ascending)</option>
                </select>
              </div>

              {/* Reset Filters button */}
              {(searchQuery || (ratingMode === "classic" && selectedSeverity !== "ALL") || selectedDomain !== "ALL" || selectedSourceFeed !== "ALL" || feedScope !== "ALL" || zeroDowntimeOnly || rebootRequiredOnly) && (
                <button
                  onClick={() => {
                    setFeedScope("ALL");
                    setSearchQuery("");
                    setSelectedSeverity("ALL");
                    setSelectedDomain("ALL");
                    setSelectedSourceFeed("ALL");
                    setZeroDowntimeOnly(false);
                    setRebootRequiredOnly(false);
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
                  Γ£ò Reset Filters
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
                Showing page <strong style={{ color: "#F8FAFC" }}>{page}</strong> of {totalPages} (<strong style={{ color: "#F8FAFC" }}>{matchedCount.toLocaleString()}</strong> matched bundles out of {totalUniversalCount.toLocaleString()} total)
              </span>
              {isLoading && (
                <span style={{ fontSize: "0.75rem", color: "#38BDF8", background: "rgba(56, 189, 248, 0.15)", padding: "0.15rem 0.5rem", borderRadius: "10px" }}>
                  Streaming...
                </span>
              )}
            </div>
          </div>

          {/* VIEW MODE 1: Consolidated Table with LOCKED HEADER & SCROLLABLE CONTENT */}
          {viewMode === "table" ? (
            <div style={{
              background: "rgba(15, 20, 32, 0.75)",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
              marginBottom: "1.5rem"
            }}>
              <div 
                id="argent-advisories-scroll-body"
                style={{ 
                  maxHeight: "750px", 
                  overflowY: "auto", 
                  overflowX: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(56, 189, 248, 0.4) rgba(15, 23, 42, 0.6)"
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "760px" }}>
                  <thead style={{ 
                    position: "sticky", 
                    top: 0, 
                    zIndex: 20, 
                    background: "rgba(11, 15, 25, 0.98)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "2px solid rgba(56, 189, 248, 0.3)"
                  }}>
                    <tr>
                      <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "210px" }}>
                        Advisory / Identifier
                      </th>
                      <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8" }}>
                        Patch &amp; Target Package Summary
                      </th>
                      <th 
                        onClick={handleToggleDateSort}
                        style={{ 
                          padding: "1.1rem 1.1rem", 
                          fontSize: "0.75rem", 
                          textTransform: "uppercase", 
                          letterSpacing: "0.08em", 
                          color: (sortBy === "published_desc" || sortBy === "published_asc") ? "#38BDF8" : "#94A3B8", 
                          width: "135px",
                          cursor: "pointer",
                          userSelect: "none"
                        }}
                        title="Click to sort by date / age"
                      >
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                          <span>Date / Age</span>
                          <span style={{ fontSize: "0.85rem", color: (sortBy === "published_desc" || sortBy === "published_asc") ? "#38BDF8" : "#64748B", fontWeight: 700 }}>
                            {sortBy === "published_desc" ? "Γåô" : sortBy === "published_asc" ? "Γåæ" : "Γåò"}
                          </span>
                        </div>
                      </th>
                      <th style={{ padding: "1.1rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", width: "195px", textAlign: "right" }}>
                        {ratingMode === "observational" ? "Rollout Impact" : "Vendor Severity"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bundles.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
                          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>≡ƒöì</div>
                          <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#F8FAFC", marginBottom: "0.5rem" }}>
                            No matching vendor patch bundles found
                          </div>
                          <p style={{ fontSize: "0.9rem" }}>
                            Try adjusting your search query, clearing distro filters, or switching scope perspectives.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      bundles.map((bundle) => {
                        const sevStyle = getSeverityStyle(bundle.vendorSeverity);
                        const domBadge = getArgentOperationalDomainBadge(bundle.operationalDomain);
                        const typeBadge = getArgentAdvisoryTypeBadge(bundle.advisoryType);

                        return (
                          <tr
                            key={bundle.id}
                            onClick={() => {
                              setSelectedBundle(bundle);
                              setDossierTab("overview");
                            }}
                            style={{
                              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                              transition: "background 0.15s ease",
                              cursor: "pointer",
                              background: "transparent"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(30, 41, 59, 0.45)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            {/* Column 1: Identifier */}
                            <td style={{ padding: "1.1rem 1.25rem", width: "210px", verticalAlign: "top" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <span style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.95rem",
                                    fontWeight: 800,
                                    color: "#38BDF8",
                                    letterSpacing: "-0.01em"
                                  }}>
                                    {bundle.bundleId}
                                  </span>
                                  <button
                                    onClick={(e) => handleCopyId(bundle.bundleId, e)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      color: copiedBundleId === bundle.bundleId ? "#34D399" : "var(--text-muted)",
                                      padding: "2px"
                                    }}
                                    title="Copy Advisory identifier"
                                  >
                                    {copiedBundleId === bundle.bundleId ? "Γ£ô" : <Copy size={13} />}
                                  </button>
                                </div>

                                <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                                  {bundle.osDisplayName}
                                </div>

                                {/* CVE Tags */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                                  {bundle.cveList.map((cve) => (
                                    <span
                                      key={cve}
                                      style={{
                                        fontSize: "0.7rem",
                                        fontFamily: "monospace",
                                        background: "rgba(56, 189, 248, 0.1)",
                                        color: "#BAE6FD",
                                        border: "1px solid rgba(56, 189, 248, 0.2)",
                                        padding: "0.1rem 0.35rem",
                                        borderRadius: "4px"
                                      }}
                                    >
                                      {cve}
                                    </span>
                                  ))}
                                </div>

                                <div style={{ marginTop: "0.35rem" }}>
                                  <button
                                    onClick={(e) => handleOpenExplain(bundle, e)}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.35rem",
                                      padding: "0.22rem 0.55rem",
                                      borderRadius: "6px",
                                      background: "linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)",
                                      border: "1px solid rgba(56, 189, 248, 0.45)",
                                      color: "#E0F2FE",
                                      fontSize: "0.71rem",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      boxShadow: "0 0 10px rgba(56, 189, 248, 0.15)",
                                      whiteSpace: "nowrap"
                                    }}
                                  >
                                    <span>Γ£¿</span>
                                    <span>Inspect Dossier</span>
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Column 2: Patch & Target Summary */}
                            <td style={{ padding: "1.1rem 1.25rem", verticalAlign: "top" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.35 }}>
                                  {bundle.title}
                                </div>

                                <div style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5 }}>
                                  {bundle.synopsis}
                                </div>

                                {/* Upgraded Packages Version Deltas */}
                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                                  {bundle.packages.map((pkg, idx) => (
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
                                      <span style={{ color: "#38BDF8" }}>≡ƒôª {pkg.name}</span>
                                      <span style={{ color: "#F87171", fontSize: "0.7rem", textDecoration: "line-through", opacity: 0.8 }}>
                                        {pkg.currentVersion}
                                      </span>
                                      <span style={{ color: "#34D399", fontSize: "0.7rem", fontWeight: 700 }}>
                                        Γ₧ö {pkg.fixedVersion}
                                      </span>
                                    </span>
                                  ))}
                                </div>

                                {/* Domain & Signal Badges */}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                                  <span style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 800,
                                    padding: "0.1rem 0.45rem",
                                    borderRadius: "4px",
                                    background: typeBadge.bg,
                                    border: `1px solid ${typeBadge.border}`,
                                    color: typeBadge.text,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem"
                                  }}>
                                    <span>{typeBadge.icon}</span>
                                    <span>{typeBadge.label}</span>
                                  </span>

                                  <span style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    padding: "0.1rem 0.45rem",
                                    borderRadius: "4px",
                                    background: domBadge.bg,
                                    border: `1px solid ${domBadge.border}`,
                                    color: domBadge.text
                                  }}>
                                    {domBadge.label}
                                  </span>

                                  <span style={{
                                    fontSize: "0.68rem",
                                    color: "#94A3B8",
                                    background: "rgba(255, 255, 255, 0.04)",
                                    border: "1px solid rgba(255, 255, 255, 0.07)",
                                    padding: "0.1rem 0.45rem",
                                    borderRadius: "4px"
                                  }}>
                                    ≡ƒôí {bundle.sourceFeed.feedName}
                                  </span>

                                  {bundle.impact.zeroDowntime && (
                                    <span style={{
                                      fontSize: "0.68rem",
                                      fontWeight: 700,
                                      color: "#34D399",
                                      background: "rgba(16, 185, 129, 0.12)",
                                      border: "1px solid rgba(16, 185, 129, 0.3)",
                                      padding: "0.1rem 0.45rem",
                                      borderRadius: "4px"
                                    }}>
                                      ΓÜí Zero-Downtime Hotfix
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Column 3: Date & Age */}
                            <td style={{ padding: "1.1rem 1.1rem", width: "135px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <span style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700, color: "#E2E8F0" }}>
                                  {bundle.issuedAt.split("T")[0]}
                                </span>
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
                                  <span>ΓÅ▒∩╕Å</span>
                                  <span>{formatRelativeAge(bundle.issuedAt)}</span>
                                </span>
                              </div>
                            </td>

                            {/* Column 4: Operational Impact / Severity */}
                            <td style={{ padding: "1.1rem 1.25rem", width: "195px", verticalAlign: "top", textAlign: "right" }}>
                              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                {ratingMode === "observational" ? (
                                  bundle.impact.zeroDowntime ? (
                                    <div style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.35rem",
                                      padding: "0.32rem 0.65rem",
                                      borderRadius: "6px",
                                      background: "rgba(16, 185, 129, 0.15)",
                                      border: "1px solid rgba(16, 185, 129, 0.35)",
                                      whiteSpace: "nowrap"
                                    }}>
                                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }}></span>
                                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#34D399", letterSpacing: "0.02em" }}>
                                        ΓÜí ZERO-DOWNTIME
                                      </span>
                                    </div>
                                  ) : (
                                    <div style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.35rem",
                                      padding: "0.32rem 0.65rem",
                                      borderRadius: "6px",
                                      background: "rgba(245, 158, 11, 0.15)",
                                      border: "1px solid rgba(245, 158, 11, 0.35)",
                                      whiteSpace: "nowrap"
                                    }}>
                                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F59E0B" }}></span>
                                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#FBBF24", letterSpacing: "0.02em" }}>
                                        ≡ƒöä REBOOT REQ
                                      </span>
                                    </div>
                                  )
                                ) : (
                                  <div style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    padding: "0.32rem 0.65rem",
                                    borderRadius: "6px",
                                    background: sevStyle.bg,
                                    border: `1px solid ${sevStyle.border}`,
                                    whiteSpace: "nowrap"
                                  }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sevStyle.dot }}></span>
                                    <span style={{ fontSize: "0.76rem", fontWeight: 800, color: sevStyle.text }}>
                                      {bundle.vendorSeverity} ({bundle.severityScore.toFixed(1)})
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
            /* VIEW MODE 2: Cards Grid View */
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "1.5rem",
              marginBottom: "1.5rem"
            }}>
              {bundles.length === 0 ? (
                <div style={{ gridColumn: "1 / -1", padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>≡ƒöì</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#F8FAFC" }}>No matching vendor patch bundles found</div>
                </div>
              ) : (
                bundles.map((bundle) => {
                  const sevStyle = getSeverityStyle(bundle.vendorSeverity);
                  const domBadge = getArgentOperationalDomainBadge(bundle.operationalDomain);
                  const typeBadge = getArgentAdvisoryTypeBadge(bundle.advisoryType);

                  return (
                    <div
                      key={bundle.id}
                      onClick={() => {
                        setSelectedBundle(bundle);
                        setDossierTab("overview");
                      }}
                      style={{
                        background: "rgba(15, 23, 42, 0.65)",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        borderRadius: "14px",
                        padding: "1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "1rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)"
                      }}
                    >
                      <div>
                        {/* Card Header: Bundle ID & Severity & Advisory Type */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 800, color: "#38BDF8" }}>
                            {bundle.bundleId}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <span style={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              padding: "0.12rem 0.4rem",
                              borderRadius: "4px",
                              background: typeBadge.bg,
                              border: `1px solid ${typeBadge.border}`,
                              color: typeBadge.text,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.2rem"
                            }}>
                              <span>{typeBadge.icon}</span>
                              <span>{typeBadge.label}</span>
                            </span>
                            <span style={{
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              background: sevStyle.bg,
                              border: `1px solid ${sevStyle.border}`,
                              color: sevStyle.text
                            }}>
                              {bundle.vendorSeverity}
                            </span>
                          </div>
                        </div>

                        <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginBottom: "0.5rem" }}>
                          {bundle.osDisplayName} ΓÇó {bundle.targetReleases[0]}
                        </div>

                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#F8FAFC", margin: "0 0 0.4rem 0", lineHeight: 1.4 }}>
                          {bundle.title}
                        </h4>
                        <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: "0 0 0.75rem 0", lineHeight: 1.5 }}>
                          {bundle.synopsis}
                        </p>

                        {/* Packages Diff Box */}
                        <div style={{ background: "rgba(2, 6, 23, 0.8)", border: "1px solid rgba(148, 163, 184, 0.12)", borderRadius: "6px", padding: "0.5rem", marginBottom: "0.75rem" }}>
                          {bundle.packages.map((pkg, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontFamily: "monospace" }}>
                              <span style={{ color: "#38BDF8" }}>{pkg.name}</span>
                              <span>
                                <span style={{ color: "#EF4444", textDecoration: "line-through" }}>{pkg.currentVersion}</span>
                                {" Γ₧ö "}
                                <span style={{ color: "#10B981", fontWeight: 700 }}>{pkg.fixedVersion}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <span style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          background: domBadge.bg,
                          border: `1px solid ${domBadge.border}`,
                          color: domBadge.text
                        }}>
                          {domBadge.label}
                        </span>

                        <span style={{ fontSize: "0.8rem", color: "#38BDF8", fontWeight: 600 }}>
                          View Dossier ΓåÆ
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
            border: "1px solid rgba(148, 163, 184, 0.18)",
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
                Showing {((page - 1) * pageSize) + 1} ΓÇô {Math.min(page * pageSize, matchedCount)} of <strong style={{ color: "#F8FAFC" }}>{matchedCount.toLocaleString()}</strong> bundles
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
                </select>
              </div>
            </div>

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
                ┬½ First
              </button>

              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "6px",
                  background: page <= 1 ? "rgba(255, 255, 255, 0.02)" : "rgba(56, 189, 248, 0.15)",
                  border: page <= 1 ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(56, 189, 248, 0.35)",
                  color: page <= 1 ? "rgba(255, 255, 255, 0.2)" : "#38BDF8",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: page <= 1 ? "not-allowed" : "pointer"
                }}
              >
                ΓÇ╣ Previous
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
                  background: page >= totalPages ? "rgba(255, 255, 255, 0.02)" : "rgba(56, 189, 248, 0.15)",
                  border: page >= totalPages ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(56, 189, 248, 0.35)",
                  color: page >= totalPages ? "rgba(255, 255, 255, 0.2)" : "#38BDF8",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: page >= totalPages ? "not-allowed" : "pointer"
                }}
              >
                Next ΓÇ║
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
                Last ┬╗
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ADVISORY DOSSIER INSPECTION MODAL (1:1 VANTAGE CLONE) */}
      {selectedBundle && (
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
          onClick={() => setSelectedBundle(null)}
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
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(56, 189, 248, 0.12)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: "1.25rem 1.75rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(15, 23, 42, 0.5)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <ArgentIcon size={24} glow={false} />
                  <span style={{
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#F8FAFC",
                    letterSpacing: "-0.01em"
                  }}>
                    {selectedBundle.bundleId}
                  </span>

                  {/* Advisory Type Badge */}
                  {(() => {
                    const modalTypeBadge = getArgentAdvisoryTypeBadge(selectedBundle.advisoryType);
                    return (
                      <span style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        background: modalTypeBadge.bg,
                        color: modalTypeBadge.text,
                        border: `1px solid ${modalTypeBadge.border}`,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}>
                        <span>{modalTypeBadge.icon}</span>
                        <span>{modalTypeBadge.label}</span>
                      </span>
                    );
                  })()}

                  {/* Status / Severity Pill */}
                  {ratingMode === "observational" ? (
                    selectedBundle.impact.zeroDowntime ? (
                      <span style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#34D399",
                        border: "1px solid rgba(16, 185, 129, 0.35)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10B981" }}></span>
                        ΓÜí ZERO DOWNTIME
                      </span>
                    ) : (
                      <span style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        background: "rgba(245, 158, 11, 0.15)",
                        color: "#FBBF24",
                        border: "1px solid rgba(245, 158, 11, 0.35)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#F59E0B" }}></span>
                        ≡ƒöä REBOOT REQUIRED
                      </span>
                    )
                  ) : (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "4px",
                      background: selectedBundle.vendorSeverity === "CRITICAL" ? "rgba(239, 68, 68, 0.15)" :
                                 selectedBundle.vendorSeverity === "IMPORTANT" ? "rgba(249, 115, 22, 0.15)" :
                                 "rgba(255, 255, 255, 0.06)",
                      color: selectedBundle.vendorSeverity === "CRITICAL" ? "#FCA5A5" :
                             selectedBundle.vendorSeverity === "IMPORTANT" ? "#FDBA74" : "#CBD5E1",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}>
                      {selectedBundle.vendorSeverity} ({selectedBundle.severityScore.toFixed(1)})
                    </span>
                  )}

                  {/* Scope Pill */}
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "#94A3B8",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}>
                    {selectedBundle.osDisplayName}
                  </span>
                </div>

                {/* Header Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleCopyId(selectedBundle.bundleId)}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: copiedBundleId === selectedBundle.bundleId ? "#34D399" : "#CBD5E1",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 500
                    }}
                  >
                    {copiedBundleId === selectedBundle.bundleId ? "Copied ID!" : "Copy ID"}
                  </button>

                  <button
                    onClick={() => handleCopyJson(selectedBundle)}
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
                    onClick={() => setSelectedBundle(null)}
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
                    Γ£ò
                  </button>
                </div>
              </div>

              {/* Advisory Title */}
              <h2 style={{ fontSize: "1.08rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.4, margin: "0.55rem 0 0.35rem 0" }}>
                {selectedBundle.title}
              </h2>

              {/* Metadata Subtitle */}
              <div style={{ display: "flex", gap: "0.65rem", fontSize: "0.76rem", color: "#94A3B8", flexWrap: "wrap", alignItems: "center" }}>
                <span>Subsystem: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedBundle.operationalDomain}</strong></span>
                <span>ΓÇó</span>
                <span>Distro Feed: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedBundle.sourceFeed.feedName}</strong></span>
                <span>ΓÇó</span>
                <span>Issued: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedBundle.issuedAt.split("T")[0]}</strong></span>
                <span>ΓÇó</span>
                <span>Packages: <strong style={{ color: "#38BDF8", fontWeight: 600 }}>{selectedBundle.packages.length} Binaries</strong></span>
                <span>ΓÇó</span>
                <span>Target: <strong style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedBundle.targetReleases.join(", ")}</strong></span>
              </div>
            </div>

            {/* Unified Tabs Navigation (1:1 Vantage Header Bar) */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(8, 12, 20, 0.95)",
              padding: "0 1.75rem",
              overflowX: "auto"
            }}>
              {[
                { id: "overview", label: "Overview" },
                { id: "packages", label: `Package Matrix (${selectedBundle.packages.length})` },
                { id: "remediation", label: "Remediation & Commands" },
                { id: "provenance", label: "Upstream Feed Signals" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDossierTab(tab.id as any)}
                  style={{
                    padding: "0.85rem 1.15rem",
                    background: "none",
                    border: "none",
                    borderBottom: dossierTab === tab.id ? "2px solid #38BDF8" : "2px solid transparent",
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

            {/* Modal Body (Scrollable, Calm High-Fidelity Aesthetics) */}
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
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* 4-Pillar Telemetry Assessment Strip */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                    gap: "0.75rem"
                  }}>
                    {/* Pillar 1: Subsystem Domain */}
                    {(() => {
                      const domBadge = getArgentOperationalDomainBadge(selectedBundle.operationalDomain);
                      return (
                        <div style={{ background: "rgba(255, 255, 255, 0.025)", border: `1px solid ${domBadge.border}`, borderRadius: "8px", padding: "0.7rem 0.95rem" }}>
                          <div style={{ fontSize: "0.66rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Operational Subsystem</div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: domBadge.text, marginTop: "0.2rem" }}>
                            {domBadge.label}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Pillar 2: Downtime Profile */}
                    <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.7rem 0.95rem" }}>
                      <div style={{ fontSize: "0.66rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Downtime Profile</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: selectedBundle.impact.zeroDowntime ? "#34D399" : "#FBBF24", marginTop: "0.2rem" }}>
                        {selectedBundle.impact.zeroDowntime ? "ΓÜí Zero-Downtime Hotfix" : "≡ƒöä Reboot Required"}
                      </div>
                    </div>

                    {/* Pillar 3: Rollout Urgency */}
                    <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.7rem 0.95rem" }}>
                      <div style={{ fontSize: "0.66rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Rollout Urgency</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: selectedBundle.vendorSeverity === "CRITICAL" ? "#F87171" : "#38BDF8", marginTop: "0.2rem" }}>
                        {selectedBundle.vendorSeverity === "CRITICAL" ? "≡ƒöÑ Mandatory Fleet Hotfix" : "ΓÜí Standard Maintenance"}
                      </div>
                    </div>

                    {/* Pillar 4: Signal & Feed */}
                    <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "8px", padding: "0.7rem 0.95rem" }}>
                      <div style={{ fontSize: "0.66rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Signal Corroboration</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#F8FAFC", marginTop: "0.2rem" }}>
                        ≡ƒôí {selectedBundle.sourceFeed.feedName.split(" ")[0]} ΓÇó Verified
                      </div>
                    </div>
                  </div>

                  {/* Section 1: In Plain English Summary */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                      In Plain English: Errata Synopsis &amp; Root Cause
                    </div>
                    <p style={{ color: "#CBD5E1", fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
                      {selectedBundle.synopsis}
                    </p>
                  </div>

                  {/* Section 2: Real-World Infrastructure Analogy */}
                  <div style={{
                    background: "rgba(56, 189, 248, 0.04)",
                    border: "1px solid rgba(56, 189, 248, 0.2)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#38BDF8", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                      ≡ƒÆí Infrastructure Analogy
                    </div>
                    <p style={{ color: "#BAE6FD", fontSize: "0.86rem", lineHeight: 1.6, margin: 0 }}>
                      {selectedBundle.impact.zeroDowntime
                        ? `Applying this patch bundle is like replacing the deadbolt cylinder on an active office door while employees walk through: the service reloads seamlessly in-place without dropping live TCP sessions or cycling the operating system kernel.`
                        : `This patch modifies low-level OS kernel memory structures or glibc base pointers. Like replacing the concrete foundation of an active data center, a planned reboot is required to swap the active runtime image safely.`}
                    </p>
                  </div>

                  {/* Section 3: Operational Rollout Requirements */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.6rem", letterSpacing: "0.04em" }}>
                      Operational Rollout Requirements
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                      <div style={{ background: "rgba(10, 14, 23, 0.8)", border: "1px solid rgba(255, 255, 255, 0.06)", padding: "0.65rem 0.85rem", borderRadius: "6px" }}>
                        <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Kernel Reboot Gate</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: selectedBundle.impact.rebootRequired ? "#FBBF24" : "#34D399", marginTop: "2px" }}>
                          {selectedBundle.impact.rebootRequired ? "Reboot Required" : "Zero-Downtime Hotfix"}
                        </div>
                      </div>
                      <div style={{ background: "rgba(10, 14, 23, 0.8)", border: "1px solid rgba(255, 255, 255, 0.06)", padding: "0.65rem 0.85rem", borderRadius: "6px" }}>
                        <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Service Reload Directives</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8FAFC", marginTop: "2px" }}>
                          {selectedBundle.impact.servicesToRestart.length > 0 ? selectedBundle.impact.servicesToRestart.join(", ") : "None (In-Place)"}
                        </div>
                      </div>
                      <div style={{ background: "rgba(10, 14, 23, 0.8)", border: "1px solid rgba(255, 255, 255, 0.06)", padding: "0.65rem 0.85rem", borderRadius: "6px" }}>
                        <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Supported Releases</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#CBD5E1", marginTop: "2px" }}>
                          {selectedBundle.targetReleases.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Resolved Vulnerabilities (CVE References) */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.5rem", letterSpacing: "0.04em" }}>
                      Resolved Vulnerabilities ({selectedBundle.cveList.length} CVEs)
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {selectedBundle.cveList.map(cve => (
                        <span key={cve} style={{
                          fontFamily: "monospace",
                          fontSize: "0.78rem",
                          background: "rgba(56, 189, 248, 0.1)",
                          color: "#BAE6FD",
                          border: "1px solid rgba(56, 189, 248, 0.25)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px"
                        }}>
                          {cve}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Package Matrix */}
              {dossierTab === "packages" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                    Binary package version deltas upgraded by this patch bundle:
                  </div>
                  <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "rgba(15, 23, 42, 0.8)", color: "#94A3B8", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                          <th style={{ padding: "0.6rem 0.85rem", fontWeight: 600 }}>Package Name</th>
                          <th style={{ padding: "0.6rem 0.85rem", fontWeight: 600 }}>Arch</th>
                          <th style={{ padding: "0.6rem 0.85rem", fontWeight: 600 }}>Current Version</th>
                          <th style={{ padding: "0.6rem 0.85rem", fontWeight: 600 }}>Fixed Version</th>
                          <th style={{ padding: "0.6rem 0.85rem", fontWeight: 600 }}>Package Manager</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBundle.packages.map((pkg, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)", fontFamily: "monospace" }}>
                            <td style={{ padding: "0.6rem 0.85rem", color: "#38BDF8", fontWeight: 600 }}>{pkg.name}</td>
                            <td style={{ padding: "0.6rem 0.85rem", color: "#94A3B8" }}>{pkg.arch}</td>
                            <td style={{ padding: "0.6rem 0.85rem", color: "#F87171", textDecoration: "line-through", opacity: 0.85 }}>{pkg.currentVersion}</td>
                            <td style={{ padding: "0.6rem 0.85rem", color: "#34D399", fontWeight: 700 }}>{pkg.fixedVersion}</td>
                            <td style={{ padding: "0.6rem 0.85rem", color: "#CBD5E1" }}>{pkg.packageManager}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: Remediation & Commands */}
              {dossierTab === "remediation" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Command 1: Native Upgrade */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>Native Distribution Upgrade Command:</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedBundle.commands.nativeUpgrade)}
                        style={{ background: "none", border: "none", color: "#38BDF8", fontSize: "0.74rem", cursor: "pointer", fontWeight: 600 }}
                      >
                        Copy Command
                      </button>
                    </div>
                    <div style={{ background: "rgba(2, 6, 23, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#A7F3D0" }}>
                      <code>{selectedBundle.commands.nativeUpgrade}</code>
                    </div>
                  </div>

                  {/* Command 2: Verification */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>Post-Upgrade Verification Gate:</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedBundle.commands.verification)}
                        style={{ background: "none", border: "none", color: "#38BDF8", fontSize: "0.74rem", cursor: "pointer", fontWeight: 600 }}
                      >
                        Copy Command
                      </button>
                    </div>
                    <div style={{ background: "rgba(2, 6, 23, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#BAE6FD" }}>
                      <code>{selectedBundle.commands.verification}</code>
                    </div>
                  </div>

                  {/* Command 3: Rollback */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>Deterministic Rollback Transaction:</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedBundle.commands.rollback)}
                        style={{ background: "none", border: "none", color: "#38BDF8", fontSize: "0.74rem", cursor: "pointer", fontWeight: 600 }}
                      >
                        Copy Command
                      </button>
                    </div>
                    <div style={{ background: "rgba(2, 6, 23, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#FED7AA" }}>
                      <code>{selectedBundle.commands.rollback}</code>
                    </div>
                  </div>

                  {/* Command 4: Kinetic CLI Command */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#22D3EE" }}>Kinetic CLI Autonomous Deployment:</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedBundle.commands.kineticDeploy)}
                        style={{ background: "none", border: "none", color: "#22D3EE", fontSize: "0.74rem", cursor: "pointer", fontWeight: 600 }}
                      >
                        Copy Command
                      </button>
                    </div>
                    <div style={{ background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "6px", padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#67E8F9" }}>
                      <code>{selectedBundle.commands.kineticDeploy}</code>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Upstream Feed Signals */}
              {dossierTab === "provenance" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    padding: "1rem 1.2rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ fontSize: "0.95rem", color: "#F8FAFC", fontWeight: 700 }}>
                        {selectedBundle.sourceFeed.feedName}
                      </div>
                      <span style={{
                        fontSize: "0.7rem",
                        fontFamily: "monospace",
                        background: "rgba(56, 189, 248, 0.15)",
                        color: "#38BDF8",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px"
                      }}>
                        {selectedBundle.sourceFeed.format}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                      Authoritative distribution advisory published by the operating system security maintainers with cryptographic package hashes.
                    </div>
                    <a
                      href={selectedBundle.upstreamNoticeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#38BDF8",
                        fontSize: "0.84rem",
                        textDecoration: "none",
                        fontWeight: 600
                      }}
                    >
                      <ExternalLink size={14} /> Open Official Advisory Notice at Vendor Portal Γåù
                    </a>
                  </div>

                  {/* Raw Telemetry Snippet */}
                  <div style={{
                    background: "rgba(2, 6, 23, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "0.85rem 1rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#64748B", fontWeight: 700 }}>
                        Raw Errata JSON Descriptor
                      </span>
                      <button
                        onClick={() => handleCopyJson(selectedBundle)}
                        style={{ background: "none", border: "none", color: "#38BDF8", fontSize: "0.74rem", cursor: "pointer" }}
                      >
                        Copy JSON
                      </button>
                    </div>
                    <pre style={{
                      margin: 0,
                      maxHeight: "180px",
                      overflowY: "auto",
                      fontSize: "0.74rem",
                      fontFamily: "monospace",
                      color: "#94A3B8",
                      lineHeight: 1.45
                    }}>
                      {JSON.stringify({
                        bundleId: selectedBundle.bundleId,
                        os: selectedBundle.os,
                        issuedAt: selectedBundle.issuedAt,
                        cveList: selectedBundle.cveList,
                        impact: selectedBundle.impact,
                        packages: selectedBundle.packages
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
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
                All patch telemetry normalized into unified <code style={{ color: "#38BDF8" }}>ARG-DISTRO-YYYY-XXXX</code> schema.
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                  onClick={() => setSelectedBundle(null)}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#CBD5E1",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setDeployBundle(selectedBundle);
                    setSelectedBundle(null);
                  }}
                  style={{
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(14, 165, 233, 0.35))",
                    border: "1px solid rgba(6, 182, 212, 0.5)",
                    borderRadius: "6px",
                    color: "#22D3EE",
                    padding: "0.45rem 1.15rem",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem"
                  }}
                >
                  <KineticIcon size={16} glow={false} /> Deploy via Kinetic CLI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISTRO FEEDS DIRECTORY MODAL (1:1 VANTAGE PARITY) */}
      {isFeedDirectoryOpen && (
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
          onClick={() => setIsFeedDirectoryOpen(false)}
        >
          <div
            style={{
              background: "#0A0E17",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "1080px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(56, 189, 248, 0.12)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: "1.25rem 1.75rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(15, 23, 42, 0.5)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.85rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.25rem" }}>≡ƒîÉ</span>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#F8FAFC", margin: 0 }}>
                      Public Distro Patch Feeds Directory
                    </h2>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "6px",
                      background: "rgba(56, 189, 248, 0.15)",
                      color: "#38BDF8",
                      border: "1px solid rgba(56, 189, 248, 0.3)"
                    }}>
                      {ARGENT_PUBLIC_FEED_SOURCES.length} Distributions
                    </span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: "0.3rem 0 0 0" }}>
                    Browse the 10 synchronized official Linux distribution security errata, package tracker, and kernel stable feeds aggregated into Argent.
                  </p>
                </div>

                <button
                  onClick={() => setIsFeedDirectoryOpen(false)}
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
                    cursor: "pointer"
                  }}
                  title="Close Directory"
                >
                  Γ£ò
                </button>
              </div>

              {/* Search Inside Directory Modal */}
              <div style={{ marginBottom: "0.85rem" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={feedDirectorySearch}
                    onChange={(e) => setFeedDirectorySearch(e.target.value)}
                    placeholder="Search public distro feeds by name, ecosystem, or format..."
                    style={{
                      width: "100%",
                      padding: "0.55rem 1rem 0.55rem 2.25rem",
                      background: "rgba(10, 14, 23, 0.85)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      color: "#F8FAFC",
                      fontSize: "0.82rem",
                      outline: "none"
                    }}
                  />
                  <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748B", fontSize: "0.85rem", pointerEvents: "none" }}>
                    ≡ƒöì
                  </span>
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
                      Γ£ò
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills inside Modal */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748B", fontWeight: 700, marginRight: "0.25rem" }}>
                  Distro Ecosystem:
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
                        background: isActive ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.03)",
                        border: isActive ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.08)",
                        color: isActive ? "#38BDF8" : "#94A3B8",
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
                        background: isActive ? "rgba(56, 189, 248, 0.35)" : "rgba(255, 255, 255, 0.06)",
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
              {ARGENT_PUBLIC_FEED_SOURCES
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
                      case "Debian & Ubuntu Ecosystem":
                        return { bg: "rgba(249, 115, 22, 0.12)", text: "#FDBA74", border: "rgba(249, 115, 22, 0.3)" };
                      case "Enterprise Linux (RHEL/Rocky/Alma)":
                        return { bg: "rgba(16, 185, 129, 0.12)", text: "#6EE7B7", border: "rgba(16, 185, 129, 0.3)" };
                      case "Lightweight & Container OS":
                        return { bg: "rgba(6, 182, 212, 0.12)", text: "#67E8F9", border: "rgba(6, 182, 212, 0.35)" };
                      case "Cloud & Hyperscaler Linux":
                        return { bg: "rgba(99, 102, 241, 0.12)", text: "#A5B4FC", border: "rgba(99, 102, 241, 0.3)" };
                      case "Independent & Rolling Distros":
                        return { bg: "rgba(168, 85, 247, 0.12)", text: "#D8B4FE", border: "rgba(168, 85, 247, 0.3)" };
                      case "Upstream Linux Kernel":
                      default:
                        return { bg: "rgba(245, 158, 11, 0.12)", text: "#FDE047", border: "rgba(245, 158, 11, 0.3)" };
                    }
                  };
                  const catStyle = getCategoryStyle(feed.category);

                  return (
                    <div
                      key={feed.id}
                      style={{
                        background: isSelectedInMainFeed ? "rgba(56, 189, 248, 0.08)" : "rgba(15, 23, 42, 0.7)",
                        border: isSelectedInMainFeed ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.08)",
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
                            background: feed.status === "Realtime" ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)",
                            color: feed.status === "Realtime" ? "#34D399" : "#38BDF8",
                            border: feed.status === "Realtime" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(56, 189, 248, 0.3)"
                          }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: feed.status === "Realtime" ? "#34D399" : "#38BDF8" }}></span>
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
                            ≡ƒôí {feed.access}
                          </span>
                          <span style={{
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#CBD5E1"
                          }}>
                            ΓÅ▒∩╕Å {feed.refreshRate}
                          </span>
                          <span style={{
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            color: "#34D399",
                            fontWeight: 600
                          }}>
                            ≡ƒôè {feed.recordsIngested.toLocaleString()} Ingested
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
                            color: "#38BDF8",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontWeight: 600
                          }}
                        >
                          <span>Official Endpoint</span>
                          <span>Γåù</span>
                        </a>

                        <button
                          onClick={() => {
                            handleFilterChange(() => setSelectedSourceFeed(isSelectedInMainFeed ? "ALL" : feed.id));
                            setIsFeedDirectoryOpen(false);
                          }}
                          style={{
                            padding: "0.3rem 0.75rem",
                            borderRadius: "6px",
                            background: isSelectedInMainFeed ? "rgba(239, 68, 68, 0.2)" : "rgba(56, 189, 248, 0.2)",
                            border: isSelectedInMainFeed ? "1px solid #EF4444" : "1px solid #38BDF8",
                            color: isSelectedInMainFeed ? "#FCA5A5" : "#BAE6FD",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          {isSelectedInMainFeed ? "Clear Filter" : "Filter Argent Feed"}
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
                All distro patch errata normalized into unified <code style={{ color: "#38BDF8" }}>ARG-DISTRO-YYYY-XXXX</code> schema.
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

      {/* KINETIC DISPATCH MODAL */}
      {deployBundle && (
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
          onClick={() => setDeployBundle(null)}
        >
          <div
            style={{
              background: "#0A0E17",
              border: "1px solid rgba(6, 182, 212, 0.35)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "680px",
              padding: "1.75rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <KineticIcon size={24} glow={false} />
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#F8FAFC", margin: 0 }}>
                    Deploy {deployBundle.bundleId} via Kinetic
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#22D3EE" }}>
                    Autonomous Zero-Downtime Package Orchestrator
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDeployBundle(null)}
                style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "1.2rem", cursor: "pointer" }}
              >
                Γ£ò
              </button>
            </div>

            <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5, margin: "0 0 1.25rem 0" }}>
              Kinetic executes package upgrades with atomic pre-snapshots, verification gates, and sub-second deterministic rollback.
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: "0.3rem" }}>
                Option 1: Kinetic CLI Targeted Upgrade
              </div>
              <div style={{ background: "rgba(2, 6, 23, 0.95)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "6px", padding: "0.75rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#67E8F9" }}>
                <code>{`kinetic upgrade --bundle ${deployBundle.bundleId} --os ${deployBundle.os}`}</code>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: "0.3rem" }}>
                Option 2: Direct Streamed POSIX Shell (Zero-Agent)
              </div>
              <div style={{ background: "rgba(2, 6, 23, 0.95)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "0.75rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#F8FAFC" }}>
                <code>{`curl -sSL "https://exultia.tech/api/argent/feed?os=${deployBundle.os}&format=bash" | sudo bash`}</code>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeployBundle(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  color: "#F8FAFC",
                  padding: "0.45rem 1rem",
                  fontSize: "0.82rem",
                  cursor: "pointer"
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
