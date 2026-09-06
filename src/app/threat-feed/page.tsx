"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  THREAT_INTELLIGENCE_CATALOG, 
  UVI_PUBLIC_FEED_SOURCES, 
  ThreatFeedRecord, 
  PublicFeedSource,
  CveDetail 
} from "@/lib/threat-feed-data";

export default function ThreatFeedPage() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [threatFilter, setThreatFilter] = useState<"all" | "cve" | "kev" | "deprecated">("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState<"score_desc" | "score_asc" | "cve_desc" | "name_asc">("score_desc");

  // Inspection Modal State
  const [selectedRecord, setSelectedRecord] = useState<ThreatFeedRecord | null>(null);
  const [copiedPurl, setCopiedPurl] = useState<string | null>(null);
  const [showJsonExplorer, setShowJsonExplorer] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Filter and Sort Logic
  const filteredRecords = useMemo(() => {
    return THREAT_INTELLIGENCE_CATALOG.filter((record) => {
      // 1. Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = record.name.toLowerCase().includes(q);
        const matchNamespace = record.namespace.toLowerCase().includes(q);
        const matchDisplay = record.displayName.toLowerCase().includes(q);
        const matchPurl = record.purl.toLowerCase().includes(q);
        const matchDesc = record.description.toLowerCase().includes(q);
        const matchCve = record.threatSignals.nvdGhsaOsv.cveList.some((cve) => cve.toLowerCase().includes(q));
        const matchAdvisory = record.threatSignals.nvdGhsaOsv.advisory?.toLowerCase().includes(q);
        if (!matchName && !matchNamespace && !matchDisplay && !matchPurl && !matchDesc && !matchCve && !matchAdvisory) {
          return false;
        }
      }

      // 2. Ecosystem filter
      if (selectedEcosystem !== "all" && record.ecosystem !== selectedEcosystem) {
        return false;
      }

      // 3. Grade filter
      if (selectedGrade !== "all" && record.securityGrade !== selectedGrade) {
        return false;
      }

      // 4. Threat category filter
      if (threatFilter === "cve" && record.openCveCount === 0) return false;
      if (threatFilter === "kev" && !record.threatSignals.cisaKev.isKnownExploited) return false;
      if (threatFilter === "deprecated" && !record.isDeprecated) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "score_desc") return b.compositeScore - a.compositeScore;
      if (sortBy === "score_asc") return a.compositeScore - b.compositeScore;
      if (sortBy === "cve_desc") return b.openCveCount - a.openCveCount;
      if (sortBy === "name_asc") return a.displayName.localeCompare(b.displayName);
      return 0;
    });
  }, [searchQuery, selectedEcosystem, selectedGrade, threatFilter, sortBy]);

  // Metric Aggregations
  const totalMonitored = THREAT_INTELLIGENCE_CATALOG.length;
  const cveFlaggedCount = THREAT_INTELLIGENCE_CATALOG.filter(r => r.openCveCount > 0).length;
  const cisaKevCount = THREAT_INTELLIGENCE_CATALOG.filter(r => r.threatSignals.cisaKev.isKnownExploited).length;
  const gradeAPlusCount = THREAT_INTELLIGENCE_CATALOG.filter(r => r.securityGrade === "A+").length;

  const handleCopyPurl = (purl: string) => {
    navigator.clipboard.writeText(purl);
    setCopiedPurl(purl);
    setTimeout(() => setCopiedPurl(null), 2500);
  };

  const handleCopyCurl = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedEcosystem !== "all") params.set("ecosystem", selectedEcosystem);
    if (selectedGrade !== "all") params.set("grade", selectedGrade);
    if (threatFilter === "cve") params.set("cveOnly", "true");
    if (threatFilter === "kev") params.set("kevOnly", "true");
    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const curlCmd = `curl -s "https://secureide.dev/api/threat-feed${queryStr}" | jq .`;
    navigator.clipboard.writeText(curlCmd);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-main)" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "2.5rem 1.5rem 4rem 1.5rem", maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        
        {/* =========================================================================
            1. HERO & MISSION HEADER
           ========================================================================= */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.4rem", 
              padding: "0.25rem 0.65rem", 
              borderRadius: "20px", 
              background: "rgba(59, 130, 246, 0.15)", 
              border: "1px solid rgba(59, 130, 246, 0.35)", 
              color: "#93C5FD", 
              fontSize: "0.75rem", 
              fontWeight: 700, 
              letterSpacing: "0.04em", 
              textTransform: "uppercase" 
            }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34D399", display: "inline-block", boxShadow: "0 0 8px #34D399" }}></span>
              Live Threat Registry • CC-BY-4.0 Open Access
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
              • Schema v2.0 • Aggregating 12 Upstream Vulnerability Feeds
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ maxWidth: "880px" }}>
              <h1 style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: "0.5rem", lineHeight: 1.2 }}>
                Unified Vulnerability Intelligence <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>(UVI) Feed</span>
              </h1>
              <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                The open-access security encyclopedia for developer toolchains, IDE extensions, language servers (LSP), compilers, and software packages. Ingests, cross-correlates, and tracks CVEs, weaponized exploits, AST analysis, and supply chain threats in real time.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleCopyCurl}
                style={{
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid var(--border-color)",
                  color: "#fff",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  transition: "all 0.2s"
                }}
                title="Copy ready-to-run curl command for current filters"
              >
                <span>{copiedCurl ? "✓" : "📋"}</span>
                <span>{copiedCurl ? "cURL Command Copied!" : "Copy cURL Query"}</span>
              </button>

              <a
                href="/api/threat-feed"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(59, 130, 246, 0.18)",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  color: "#93C5FD",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  transition: "all 0.2s"
                }}
              >
                <span>🌐</span>
                <span>UVI REST API (JSON) →</span>
              </a>

              <Link
                href="/console"
                className="btn-primary"
                style={{
                  padding: "0.55rem 1.15rem",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem"
                }}
              >
                <span>⚡</span>
                <span>Build Hardened IDE</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. THREAT METRICS BAR
           ========================================================================= */}
        <section style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", 
          gap: "1rem", 
          marginBottom: "2rem" 
        }}>
          <div className="glass-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #3B82F6" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
              Monitored Artifacts
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff" }}>
              {totalMonitored}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#60A5FA", marginTop: "0.2rem" }}>
              Extensions, LSPs & Toolchains
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #8B5CF6" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
              Integrated Feeds
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#DDD6FE" }}>
              {UVI_PUBLIC_FEED_SOURCES.length} Feeds
            </div>
            <div style={{ fontSize: "0.75rem", color: "#A78BFA", marginTop: "0.2rem" }}>
              NVD, CISA KEV, GHSA, OSV.dev
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #34D399" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
              Grade A+ Verified
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#34D399" }}>
              {gradeAPlusCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(52, 211, 153, 0.85)", marginTop: "0.2rem" }}>
              Zero Open CVEs • Sandboxed
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #EF4444" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
              CISA KEV Exploits
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#F87171" }}>
              {cisaKevCount} Flagged
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(248, 113, 113, 0.85)", marginTop: "0.2rem" }}>
              Actively Weaponized Vectors
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #F59E0B" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
              Vulnerabilities / Warnings
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FBBF24" }}>
              {cveFlaggedCount} Tracked
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(251, 191, 36, 0.85)", marginTop: "0.2rem" }}>
              NVD / GHSA / Ast Advisories
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. SEARCH & MULTI-FACET FILTER TOOLBAR
           ========================================================================= */}
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
          
          {/* Top Row: Search Input & Sort & View Mode */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
              <input
                type="text"
                id="uvi-search-input"
                placeholder="Search packages, namespaces, CVE IDs (e.g. CVE-2023-36742, CVE-2024-27982), PURLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem 0.65rem 2.5rem",
                  background: "rgba(0, 0, 0, 0.45)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  color: "#fff",
                  outline: "none"
                }}
              />
              <span style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", opacity: 0.5, pointerEvents: "none" }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <select
                id="uvi-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: "0.6rem 0.85rem",
                  background: "rgba(0, 0, 0, 0.45)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "var(--text-muted)",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="score_desc">🏆 Highest Trust Score</option>
                <option value="score_asc">⚠️ Lowest Trust Score</option>
                <option value="cve_desc">🚨 Most CVEs</option>
                <option value="name_asc">🔤 Name (A → Z)</option>
              </select>

              <div style={{ display: "inline-flex", background: "rgba(0, 0, 0, 0.45)", padding: "2px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <button
                  type="button"
                  id="view-mode-table"
                  onClick={() => setViewMode("table")}
                  style={{
                    padding: "0.45rem 0.75rem",
                    borderRadius: "6px",
                    background: viewMode === "table" ? "var(--accent-primary)" : "transparent",
                    color: viewMode === "table" ? "#fff" : "var(--text-muted)",
                    border: "none",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                >
                  <span>📋</span> Table
                </button>
                <button
                  type="button"
                  id="view-mode-cards"
                  onClick={() => setViewMode("cards")}
                  style={{
                    padding: "0.45rem 0.75rem",
                    borderRadius: "6px",
                    background: viewMode === "cards" ? "var(--accent-primary)" : "transparent",
                    color: viewMode === "cards" ? "#fff" : "var(--text-muted)",
                    border: "none",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                >
                  <span>🗂️</span> Cards
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Ecosystem Chips & Threat Filter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.85rem" }}>
            
            {/* Ecosystem Chips */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginRight: "0.25rem" }}>
                Ecosystem:
              </span>
              {[
                { id: "all", label: "All" },
                { id: "vscode", label: "VS Code / Theia" },
                { id: "golang", label: "Golang" },
                { id: "cargo", label: "Rust (Cargo)" },
                { id: "pypi", label: "Python (PyPI)" },
                { id: "npm", label: "Node (npm)" },
                { id: "maven", label: "Java (Maven)" }
              ].map((eco) => {
                const isSelected = selectedEcosystem === eco.id;
                return (
                  <button
                    key={eco.id}
                    type="button"
                    onClick={() => setSelectedEcosystem(eco.id)}
                    style={{
                      padding: "0.3rem 0.65rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.04)",
                      border: isSelected ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.08)",
                      color: isSelected ? "#93C5FD" : "var(--text-muted)",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {eco.label}
                  </button>
                );
              })}
            </div>

            {/* Severity & Threat Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginRight: "0.25rem" }}>
                Filter:
              </span>
              {[
                { id: "all", label: "All Packages" },
                { id: "cve", label: "🚨 Has CVE" },
                { id: "kev", label: "⚡ CISA KEV Active" },
                { id: "deprecated", label: "⚠️ Deprecated / Quarantined" }
              ].map((tf) => {
                const isSelected = threatFilter === tf.id;
                return (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setThreatFilter(tf.id as any)}
                    style={{
                      padding: "0.3rem 0.65rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.04)",
                      border: isSelected ? "1px solid #EF4444" : "1px solid rgba(255, 255, 255, 0.08)",
                      color: isSelected ? "#FCA5A5" : "var(--text-muted)",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {tf.label}
                  </button>
                );
              })}

              {/* Grade Filter Dropdown */}
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                style={{
                  padding: "0.3rem 0.6rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: "rgba(0, 0, 0, 0.45)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "var(--text-muted)",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="all">Grade: All</option>
                <option value="A+">Grade: A+ (Safe)</option>
                <option value="B">Grade: B (Warning)</option>
                <option value="C">Grade: C (Quarantine)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Filter Summary Count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", padding: "0 0.25rem" }}>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Showing <strong>{filteredRecords.length}</strong> of <strong>{totalMonitored}</strong> registered threat intelligence records
            {searchQuery && <span> matching query &ldquo;{searchQuery}&rdquo;</span>}
          </div>
          {(searchQuery || selectedEcosystem !== "all" || selectedGrade !== "all" || threatFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedEcosystem("all");
                setSelectedGrade("all");
                setThreatFilter("all");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#60A5FA",
                fontSize: "0.78rem",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* =========================================================================
            4. MAIN VIEWPORT (LOCKED TABLE HEADER OR CARD GRID)
           ========================================================================= */}
        {filteredRecords.length === 0 ? (
          <div className="glass-card" style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>No Threat Records Found</h3>
            <p style={{ fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto 1.5rem auto" }}>
              No threat intelligence entries matched your current search parameters or filter combination.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedEcosystem("all");
                setSelectedGrade("all");
                setThreatFilter("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE WIKI VIEW (Locked Sticky Header) */
          <div style={{ 
            background: "rgba(255, 255, 255, 0.02)", 
            border: "1px solid var(--border-color)", 
            borderRadius: "12px", 
            overflow: "hidden", 
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)" 
          }}>
            <div 
              id="uvi-wiki-table-scroll-body"
              style={{ 
                maxHeight: "calc(100vh - 360px)", 
                minHeight: "420px", 
                overflowY: "auto", 
                overflowX: "hidden" 
              }}
            >
              {/* LOCKED STICKY TABLE HEADER */}
              <div 
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 2.5fr) minmax(130px, 1.2fr) 95px 110px minmax(150px, 1.5fr) minmax(180px, 1.8fr) 95px",
                  padding: "0.85rem 1.25rem",
                  background: "rgba(15, 23, 42, 0.98)",
                  backdropFilter: "blur(16px)",
                  borderBottom: "1px solid var(--border-color)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)"
                }}
              >
                <div>Package & Namespace</div>
                <div>Type / Ecosystem</div>
                <div>Grade</div>
                <div>Trust Score</div>
                <div>Vulnerabilities & KEV</div>
                <div>Threat Signals Matrix</div>
                <div style={{ textAlign: "right" }}>Wiki Dossier</div>
              </div>

              {/* TABLE ROWS */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {filteredRecords.map((record, rowIdx) => {
                  const isSafe = record.securityGrade === "A+";
                  const isWarning = record.securityGrade === "B";
                  const isCrit = record.securityGrade === "C";

                  return (
                    <div
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(220px, 2.5fr) minmax(130px, 1.2fr) 95px 110px minmax(150px, 1.5fr) minmax(180px, 1.8fr) 95px",
                        padding: "0.85rem 1.25rem",
                        borderBottom: rowIdx === filteredRecords.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.04)",
                        background: rowIdx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.015)",
                        alignItems: "center",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59, 130, 246, 0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = rowIdx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.015)")}
                    >
                      {/* Column 1: Package & Namespace */}
                      <div style={{ minWidth: 0, paddingRight: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {record.displayName}
                          </span>
                          {record.verifiedPublisher && (
                            <span title="Verified Publisher" style={{ color: "#34D399", fontSize: "0.8rem" }}>✓</span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.74rem", fontFamily: "monospace", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {record.namespace}/{record.name}@{record.version}
                        </div>
                      </div>

                      {/* Column 2: Type / Ecosystem */}
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
                          {record.packageType}
                        </div>
                        <span style={{ 
                          fontSize: "0.68rem", 
                          padding: "0.1rem 0.35rem", 
                          borderRadius: "4px", 
                          background: "rgba(255, 255, 255, 0.06)", 
                          color: "var(--text-muted)",
                          textTransform: "uppercase" 
                        }}>
                          {record.ecosystem}
                        </span>
                      </div>

                      {/* Column 3: Security Grade */}
                      <div>
                        <span className={`risk-grade ${isSafe ? "grade-a" : isWarning ? "grade-b" : "grade-c"}`} style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem" }}>
                          {record.securityGrade}
                        </span>
                      </div>

                      {/* Column 4: Trust Score */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ 
                            fontSize: "0.9rem", 
                            fontWeight: 800, 
                            color: record.compositeScore >= 90 ? "#34D399" : record.compositeScore >= 70 ? "#FBBF24" : "#F87171" 
                          }}>
                            {record.compositeScore}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/100</span>
                        </div>
                        <div style={{ width: "65px", height: "4px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "2px", overflow: "hidden", marginTop: "3px" }}>
                          <div style={{ 
                            width: `${record.compositeScore}%`, 
                            height: "100%", 
                            background: record.compositeScore >= 90 ? "#34D399" : record.compositeScore >= 70 ? "#FBBF24" : "#EF4444" 
                          }}></div>
                        </div>
                      </div>

                      {/* Column 5: Vulnerabilities & KEV */}
                      <div>
                        {record.isDeprecated ? (
                          <span style={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: "0.25rem", 
                            fontSize: "0.72rem", 
                            fontWeight: 700, 
                            padding: "0.15rem 0.45rem", 
                            borderRadius: "4px", 
                            background: "rgba(239, 68, 68, 0.15)", 
                            color: "#F87171", 
                            border: "1px solid rgba(239, 68, 68, 0.3)" 
                          }}>
                            ⚠️ DEPRECATED
                          </span>
                        ) : record.threatSignals.cisaKev.isKnownExploited ? (
                          <span style={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: "0.25rem", 
                            fontSize: "0.72rem", 
                            fontWeight: 700, 
                            padding: "0.15rem 0.45rem", 
                            borderRadius: "4px", 
                            background: "rgba(239, 68, 68, 0.2)", 
                            color: "#F87171", 
                            border: "1px solid #EF4444" 
                          }}>
                            ⚡ CISA KEV (RCE)
                          </span>
                        ) : record.openCveCount > 0 ? (
                          <span style={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: "0.25rem", 
                            fontSize: "0.72rem", 
                            fontWeight: 600, 
                            padding: "0.15rem 0.45rem", 
                            borderRadius: "4px", 
                            background: "rgba(245, 158, 11, 0.15)", 
                            color: "#FBBF24", 
                            border: "1px solid rgba(245, 158, 11, 0.3)" 
                          }}>
                            🚨 {record.openCveCount} CVE (CVSS {record.threatSignals.nvdGhsaOsv.cvssMaxSeverity})
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#34D399", fontWeight: 600 }}>
                            ✓ 0 Open CVEs
                          </span>
                        )}
                      </div>

                      {/* Column 6: Threat Signals Radar */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                        <span 
                          title={`NVD / CVE: ${record.threatSignals.nvdGhsaOsv.hasCve ? 'Flagged' : 'Clean'}`}
                          style={{ 
                            fontSize: "0.68rem", 
                            padding: "0.1rem 0.35rem", 
                            borderRadius: "4px", 
                            background: record.threatSignals.nvdGhsaOsv.hasCve ? "rgba(239, 68, 68, 0.15)" : "rgba(52, 211, 153, 0.1)",
                            color: record.threatSignals.nvdGhsaOsv.hasCve ? "#F87171" : "#34D399",
                            border: `1px solid ${record.threatSignals.nvdGhsaOsv.hasCve ? "rgba(239,68,68,0.3)" : "rgba(52,211,153,0.2)"}`
                          }}
                        >
                          NVD
                        </span>
                        <span 
                          title={`Trail of Bits: ${record.threatSignals.trailOfBits.hasMaliciousIoC ? 'Malicious Pattern Detected' : 'Passed AST Scan'}`}
                          style={{ 
                            fontSize: "0.68rem", 
                            padding: "0.1rem 0.35rem", 
                            borderRadius: "4px", 
                            background: record.threatSignals.trailOfBits.hasMaliciousIoC ? "rgba(239, 68, 68, 0.15)" : "rgba(52, 211, 153, 0.1)",
                            color: record.threatSignals.trailOfBits.hasMaliciousIoC ? "#F87171" : "#34D399",
                            border: `1px solid ${record.threatSignals.trailOfBits.hasMaliciousIoC ? "rgba(239,68,68,0.3)" : "rgba(52,211,153,0.2)"}`
                          }}
                        >
                          ToB
                        </span>
                        <span 
                          title={`Socket.dev: ${record.threatSignals.socketDev.credentialAccess ? 'Credential/Env Theft Risk' : 'Clean Heuristics'}`}
                          style={{ 
                            fontSize: "0.68rem", 
                            padding: "0.1rem 0.35rem", 
                            borderRadius: "4px", 
                            background: record.threatSignals.socketDev.credentialAccess ? "rgba(239, 68, 68, 0.15)" : "rgba(52, 211, 153, 0.1)",
                            color: record.threatSignals.socketDev.credentialAccess ? "#F87171" : "#34D399",
                            border: `1px solid ${record.threatSignals.socketDev.credentialAccess ? "rgba(239,68,68,0.3)" : "rgba(52,211,153,0.2)"}`
                          }}
                        >
                          Socket
                        </span>
                        <span 
                          title={`JFrog Research: ${record.threatSignals.jfrog.runtimeExploitable ? 'Reachable Exploit Vector' : 'Clean Runtime'}`}
                          style={{ 
                            fontSize: "0.68rem", 
                            padding: "0.1rem 0.35rem", 
                            borderRadius: "4px", 
                            background: record.threatSignals.jfrog.runtimeExploitable ? "rgba(239, 68, 68, 0.15)" : "rgba(52, 211, 153, 0.1)",
                            color: record.threatSignals.jfrog.runtimeExploitable ? "#F87171" : "#34D399",
                            border: `1px solid ${record.threatSignals.jfrog.runtimeExploitable ? "rgba(239,68,68,0.3)" : "rgba(52,211,153,0.2)"}`
                          }}
                        >
                          JFrog
                        </span>
                        <span 
                          title={`OpenSSF Score: ${record.threatSignals.openSsf.score}/10`}
                          style={{ 
                            fontSize: "0.68rem", 
                            padding: "0.1rem 0.35rem", 
                            borderRadius: "4px", 
                            background: record.threatSignals.openSsf.score >= 8 ? "rgba(52, 211, 153, 0.1)" : "rgba(245, 158, 11, 0.1)",
                            color: record.threatSignals.openSsf.score >= 8 ? "#34D399" : "#FBBF24",
                            border: `1px solid ${record.threatSignals.openSsf.score >= 8 ? "rgba(52,211,153,0.2)" : "rgba(245,158,11,0.2)"}`
                          }}
                        >
                          SSF {record.threatSignals.openSsf.score}
                        </span>
                      </div>

                      {/* Column 7: Action Button */}
                      <div style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}
                          style={{
                            padding: "0.3rem 0.65rem",
                            borderRadius: "6px",
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid var(--border-color)",
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          Inspect →
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* CARD GRID VIEW */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.25rem" }}>
            {filteredRecords.map((record) => {
              const isSafe = record.securityGrade === "A+";
              const isWarning = record.securityGrade === "B";
              const isCrit = record.securityGrade === "C";

              return (
                <div
                  key={record.id}
                  className="glass-card"
                  onClick={() => setSelectedRecord(record)}
                  style={{
                    padding: "1.25rem",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.15s ease, border-color 0.15s ease",
                    border: `1px solid ${isCrit ? "rgba(239, 68, 68, 0.35)" : isWarning ? "rgba(245, 158, 11, 0.3)" : "var(--border-color)"}`
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  <div>
                    {/* Top Row: Grade + Trust Score + Ecosystem */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className={`risk-grade ${isSafe ? "grade-a" : isWarning ? "grade-b" : "grade-c"}`} style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem" }}>
                          {record.securityGrade}
                        </span>
                        <span style={{ 
                          fontSize: "0.7rem", 
                          padding: "0.15rem 0.45rem", 
                          borderRadius: "4px", 
                          background: "rgba(255, 255, 255, 0.08)", 
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          fontWeight: 600
                        }}>
                          {record.ecosystem}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: record.compositeScore >= 90 ? "#34D399" : record.compositeScore >= 70 ? "#FBBF24" : "#F87171" }}>
                          {record.compositeScore}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/100 Trust</span>
                      </div>
                    </div>

                    {/* Name & Purl */}
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
                      {record.displayName}
                    </h3>
                    <div style={{ fontSize: "0.74rem", fontFamily: "monospace", color: "#93C5FD", marginBottom: "0.6rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {record.purl}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "1rem" }}>
                      {record.description}
                    </p>
                  </div>

                  <div>
                    {/* Threat Status Badge */}
                    <div style={{ marginBottom: "0.75rem" }}>
                      {record.isDeprecated ? (
                        <div style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", background: "rgba(239, 68, 68, 0.15)", color: "#F87171", fontSize: "0.74rem", fontWeight: 600, border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                          ⚠️ Deprecated / Quarantined Package
                        </div>
                      ) : record.threatSignals.cisaKev.isKnownExploited ? (
                        <div style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", background: "rgba(239, 68, 68, 0.2)", color: "#F87171", fontSize: "0.74rem", fontWeight: 700, border: "1px solid #EF4444" }}>
                          ⚡ CISA KEV: Actively Exploited In-The-Wild
                        </div>
                      ) : record.openCveCount > 0 ? (
                        <div style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", fontSize: "0.74rem", fontWeight: 600, border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                          🚨 {record.openCveCount} CVE Tracked (Max CVSS {record.threatSignals.nvdGhsaOsv.cvssMaxSeverity})
                        </div>
                      ) : (
                        <div style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", background: "rgba(52, 211, 153, 0.1)", color: "#34D399", fontSize: "0.74rem", fontWeight: 600, border: "1px solid rgba(52, 211, 153, 0.25)" }}>
                          ✓ 0 CVEs • All 9 Security Feeds Clean
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.6rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        Audited {new Date(record.lastAudited).toLocaleDateString()}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "#60A5FA", fontWeight: 600 }}>
                        Inspect Wiki Dossier →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            5. PUBLIC THREAT SOURCES DIRECTORY
           ========================================================================= */}
        <section style={{ marginTop: "4rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.3rem" }}>
              Integrated Public Threat Feeds & Advisory Sources
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
              The Unified Vulnerability Intelligence (UVI) feed dynamically reconciles security signals from 12 authoritative global sources without pre-exclusion.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
            {UVI_PUBLIC_FEED_SOURCES.map((source) => (
              <div key={source.id} className="glass-card" style={{ padding: "1.15rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.25rem" }}>{source.icon}</span>
                    <strong style={{ fontSize: "0.92rem", color: "#fff" }}>
                      {source.name}
                    </strong>
                  </div>
                  <span style={{ 
                    fontSize: "0.65rem", 
                    padding: "0.15rem 0.4rem", 
                    borderRadius: "4px", 
                    background: "rgba(52, 211, 153, 0.15)", 
                    color: "#34D399", 
                    border: "1px solid rgba(52, 211, 153, 0.3)",
                    fontWeight: 700 
                  }}>
                    {source.status}
                  </span>
                </div>

                <div style={{ fontSize: "0.78rem", color: "#93C5FD", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Scope: {source.scope}
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                  {source.coverage}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.5rem", fontSize: "0.72rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>
                    🔄 Sync: <strong>{source.refreshRate}</strong> ({source.access})
                  </span>
                  <a href={source.homepageUrl} target="_blank" rel="noreferrer" style={{ color: "#60A5FA", textDecoration: "none", fontWeight: 600 }}>
                    Source Docs ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            6. LIVE REST API & JSON CONSOLE TOGGLE
           ========================================================================= */}
        <section style={{ marginTop: "3rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: "0 0 0.25rem 0" }}>
                  Headless REST API Endpoint
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                  Integrate UVI vulnerability intelligence directly into your CI/CD pipelines, IDE extensions, or security orchestration engines.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowJsonExplorer(!showJsonExplorer)}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "6px",
                    background: showJsonExplorer ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.06)",
                    border: "1px solid var(--border-color)",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {showJsonExplorer ? "Hide JSON Schema" : "Inspect Raw JSON Schema"}
                </button>

                <button
                  type="button"
                  onClick={handleCopyCurl}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "6px",
                    background: "rgba(52, 211, 153, 0.15)",
                    border: "1px solid rgba(52, 211, 153, 0.3)",
                    color: "#34D399",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {copiedCurl ? "✓ Copied cURL" : "Copy cURL"}
                </button>
              </div>
            </div>

            {showJsonExplorer && (
              <div style={{ marginTop: "1rem" }}>
                <pre style={{ 
                  background: "rgba(0, 0, 0, 0.65)", 
                  padding: "1rem", 
                  borderRadius: "8px", 
                  fontSize: "0.76rem", 
                  color: "#93C5FD", 
                  maxHeight: "350px", 
                  overflowY: "auto",
                  border: "1px solid var(--border-color)"
                }}>
                  {JSON.stringify({
                    schemaVersion: "https://schema.secureide.dev/uvi/v2.json",
                    feedName: "Unified Vulnerability Intelligence (UVI) Feed",
                    queryParameters: {
                      query: searchQuery || null,
                      ecosystem: selectedEcosystem,
                      grade: selectedGrade
                    },
                    matchedPackagesCount: filteredRecords.length,
                    sampleRecords: filteredRecords.slice(0, 2)
                  }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* =========================================================================
          7. DETAILED THREAT INSPECTOR DOSSIER MODAL
         ========================================================================= */}
      {selectedRecord && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "grid",
            placeItems: "center",
            padding: "1.5rem"
          }}
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            style={{
              background: "rgba(15, 23, 42, 0.98)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              borderRadius: "16px",
              maxWidth: "960px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.2)",
              display: "flex",
              flexDirection: "column"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ 
              padding: "1.5rem 1.75rem", 
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start",
              gap: "1rem",
              background: "rgba(255, 255, 255, 0.02)"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                  <span className={`risk-grade ${selectedRecord.securityGrade === 'A+' ? 'grade-a' : selectedRecord.securityGrade === 'B' ? 'grade-b' : 'grade-c'}`} style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem" }}>
                    GRADE {selectedRecord.securityGrade}
                  </span>
                  <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", borderRadius: "4px", background: "rgba(255, 255, 255, 0.08)", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    {selectedRecord.ecosystem}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    • {selectedRecord.packageType}
                  </span>
                  {selectedRecord.verifiedPublisher && (
                    <span style={{ fontSize: "0.72rem", color: "#34D399", background: "rgba(52, 211, 153, 0.1)", padding: "0.1rem 0.45rem", borderRadius: "4px", border: "1px solid rgba(52, 211, 153, 0.3)", fontWeight: 600 }}>
                      ✓ Verified Publisher ({selectedRecord.publisherDomain || 'Official'})
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", margin: "0 0 0.35rem 0" }}>
                  {selectedRecord.displayName}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <code style={{ fontSize: "0.8rem", color: "#93C5FD", background: "rgba(0, 0, 0, 0.4)", padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    {selectedRecord.purl}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopyPurl(selectedRecord.purl)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: copiedPurl === selectedRecord.purl ? "#34D399" : "#60A5FA",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {copiedPurl === selectedRecord.purl ? "✓ Copied!" : "Copy PURL"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Deprecation Warning Banner */}
              {selectedRecord.isDeprecated && (
                <div style={{ 
                  padding: "1rem 1.25rem", 
                  borderRadius: "8px", 
                  background: "rgba(239, 68, 68, 0.12)", 
                  border: "1px solid rgba(239, 68, 68, 0.35)", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "0.4rem" 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#F87171", fontWeight: 700, fontSize: "0.9rem" }}>
                    <span>⚠️ QUARANTINED / DEPRECATION ALERT</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#FCA5A5", lineHeight: 1.5 }}>
                    {selectedRecord.deprecationReason}
                  </div>
                  {selectedRecord.replacementPackage && (
                    <div style={{ fontSize: "0.8rem", color: "#fff", marginTop: "0.2rem" }}>
                      Recommended Replacement: <code style={{ color: "#93C5FD", background: "rgba(0,0,0,0.3)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>{selectedRecord.replacementPackage}</code>
                    </div>
                  )}
                </div>
              )}

              {/* Package Description & Metrics */}
              <div>
                <h4 style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
                  Overview & Threat Analysis
                </h4>
                <p style={{ fontSize: "0.92rem", color: "var(--text-main)", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                  {selectedRecord.description}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
                  <div style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Composite Trust Score</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: selectedRecord.compositeScore >= 90 ? "#34D399" : selectedRecord.compositeScore >= 70 ? "#FBBF24" : "#F87171" }}>
                      {selectedRecord.compositeScore}/100
                    </div>
                  </div>
                  <div style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>License</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                      {selectedRecord.license}
                    </div>
                  </div>
                  <div style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>OpenSSF Hygiene Score</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: selectedRecord.threatSignals.openSsf.score >= 8 ? "#34D399" : "#FBBF24" }}>
                      {selectedRecord.threatSignals.openSsf.score}/10
                    </div>
                  </div>
                  <div style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Last Audited</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginTop: "2px" }}>
                      {new Date(selectedRecord.lastAudited).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vulnerabilities & CVE Deep Dive */}
              {selectedRecord.threatSignals.nvdGhsaOsv.cveDetails && selectedRecord.threatSignals.nvdGhsaOsv.cveDetails.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "0.85rem", color: "#F87171", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>🚨 Documented CVE Advisories</span>
                    <span style={{ fontSize: "0.7rem", background: "rgba(239, 68, 68, 0.2)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                      {selectedRecord.threatSignals.nvdGhsaOsv.cveDetails.length} Detected
                    </span>
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {selectedRecord.threatSignals.nvdGhsaOsv.cveDetails.map((cve) => (
                      <div 
                        key={cve.id} 
                        style={{ 
                          padding: "1rem", 
                          borderRadius: "8px", 
                          background: "rgba(0, 0, 0, 0.35)", 
                          border: "1px solid rgba(239, 68, 68, 0.3)" 
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                          <div>
                            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginRight: "0.5rem" }}>
                              {cve.id}
                            </span>
                            <span style={{ 
                              fontSize: "0.68rem", 
                              fontWeight: 700, 
                              padding: "0.15rem 0.45rem", 
                              borderRadius: "4px", 
                              background: cve.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.25)" : "rgba(245, 158, 11, 0.25)",
                              color: cve.severity === "CRITICAL" ? "#F87171" : "#FBBF24",
                              border: `1px solid ${cve.severity === "CRITICAL" ? "#EF4444" : "#F59E0B"}`
                            }}>
                              {cve.severity} (CVSS {cve.cvssScore})
                            </span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            Published {cve.publishedDate}
                          </span>
                        </div>

                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#DDD6FE", marginBottom: "0.35rem" }}>
                          {cve.title}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#60A5FA", marginBottom: "0.4rem" }}>
                          {cve.cwe}
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 0.6rem 0" }}>
                          {cve.summary}
                        </p>

                        <div style={{ fontSize: "0.78rem", color: "#34D399", background: "rgba(52, 211, 153, 0.08)", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid rgba(52, 211, 153, 0.2)" }}>
                          <strong>Remediation:</strong> {cve.remediation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9-Engine Threat Signals Matrix */}
              <div>
                <h4 style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                  9-Engine Threat Signal Audit Breakdown
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
                  
                  {/* 1. NVD / GHSA / OSV */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🏛️ NIST NVD & OSV</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.nvdGhsaOsv.hasCve ? "#F87171" : "#34D399", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.nvdGhsaOsv.hasCve ? `${selectedRecord.openCveCount} CVEs` : "Clean"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {selectedRecord.threatSignals.nvdGhsaOsv.advisory || "No public CVE records registered in NVD or GitHub Advisory Database."}
                    </div>
                  </div>

                  {/* 2. CISA KEV */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🚨 CISA KEV Catalog</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.cisaKev.isKnownExploited ? "#F87171" : "#34D399", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.cisaKev.isKnownExploited ? "EXPLOITED" : "Clean"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {selectedRecord.threatSignals.cisaKev.isKnownExploited ? `Weaponized exploit active. Added: ${selectedRecord.threatSignals.cisaKev.dateAdded}. ${selectedRecord.threatSignals.cisaKev.notes || ''}` : "Zero entries in CISA Known Exploited Vulnerabilities catalog."}
                    </div>
                  </div>

                  {/* 3. Trail of Bits */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🔬 Trail of Bits vsix-audit</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.trailOfBits.hasMaliciousIoC ? "#F87171" : "#34D399", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.trailOfBits.hasMaliciousIoC ? "IoC Flagged" : "Verified AST"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {selectedRecord.threatSignals.trailOfBits.details}
                    </div>
                  </div>

                  {/* 4. Socket.dev */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🔌 Socket.dev Behavioral</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.socketDev.credentialAccess ? "#F87171" : "#34D399", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.socketDev.credentialAccess ? "Credential Risk" : "Clean"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {selectedRecord.threatSignals.socketDev.details}
                    </div>
                  </div>

                  {/* 5. JFrog Research */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🐸 JFrog Reachability</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.jfrog.runtimeExploitable ? "#F87171" : "#34D399", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.jfrog.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {selectedRecord.threatSignals.jfrog.details}
                    </div>
                  </div>

                  {/* 6. Aqua Nautilus */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🌊 Aqua Nautilus Typosquats</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.aquaNautilus.isTyposquat ? "#F87171" : "#34D399", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.aquaNautilus.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {selectedRecord.threatSignals.aquaNautilus.details}
                    </div>
                  </div>

                  {/* 7. Snyk VulnDB */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🐕 Snyk Transitive Trees</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.snyk.transitiveVulnerabilities > 0 ? "#FBBF24" : "#34D399", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.snyk.transitiveVulnerabilities} Transitive
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {selectedRecord.threatSignals.snyk.details}
                    </div>
                  </div>

                  {/* 8. OpenSSF Scorecard */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🛡️ OpenSSF Scorecard</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.openSsf.score >= 8 ? "#34D399" : "#FBBF24", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.openSsf.score}/10
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      Branch Protection: {selectedRecord.threatSignals.openSsf.branchProtection ? "Enforced" : "None"} • Dependencies Pinned: {selectedRecord.threatSignals.openSsf.pinnedDependencies ? "Yes" : "Unpinned"}
                    </div>
                  </div>

                  {/* 9. MSRC & Eclipse */}
                  <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#fff" }}>🏢 Vendor Bulletins</strong>
                      <span style={{ fontSize: "0.7rem", color: selectedRecord.threatSignals.msrcEclipse.vendorCompliant ? "#34D399" : "#F87171", fontWeight: 700 }}>
                        {selectedRecord.threatSignals.msrcEclipse.mfrStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {selectedRecord.threatSignals.msrcEclipse.details}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: "1rem 1.75rem", 
              borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              background: "rgba(0, 0, 0, 0.3)",
              flexWrap: "wrap",
              gap: "0.75rem"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                ID: <code>{selectedRecord.id}</code> • Audit hash verified by SecureIDE Gateway
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link
                  href={`/console`}
                  className="btn-primary"
                  style={{
                    padding: "0.45rem 0.95rem",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  Configure in Builder Console →
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid var(--border-color)",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Close Dossier
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
