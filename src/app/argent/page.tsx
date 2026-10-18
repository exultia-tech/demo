"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  ArgentPatchBundle, 
  ArgentOsCategory, 
  ArgentVendorSeverity, 
  ARGENT_PATCH_BUNDLES, 
  ARGENT_PUBLIC_FEED_SOURCES,
  ArgentPublicFeedSource 
} from "@/lib/argent-feed";
import { ArgentIcon, KineticIcon, VantageIcon } from "@/components/BrandIcons";
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
  Radio
} from "lucide-react";

export default function ArgentPage() {
  const [selectedOs, setSelectedOs] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [rebootFilter, setRebootFilter] = useState<"all" | "zero-downtime" | "reboot-required">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Selected bundle for inspection modal
  const [inspectedBundle, setInspectedBundle] = useState<ArgentPatchBundle | null>(null);

  // Distro feed sources modal
  const [showSourcesModal, setShowSourcesModal] = useState<boolean>(false);

  // Kinetic deploy modal
  const [deployBundle, setDeployBundle] = useState<ArgentPatchBundle | null>(null);

  // Copy notification state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // OS Category definitions with tailored themes and badge styling
  const OS_CATEGORIES: { id: string; label: string; icon: string; count: number; badgeColor: string }[] = useMemo(() => [
    { id: "all", label: "All Distributions", icon: "🌐", count: ARGENT_PATCH_BUNDLES.length, badgeColor: "#94A3B8" },
    { id: "ubuntu", label: "Ubuntu (USN)", icon: "🟠", count: ARGENT_PATCH_BUNDLES.filter(b => b.os === "ubuntu").length, badgeColor: "#E95420" },
    { id: "rocky", label: "Rocky / RHEL (RLSA)", icon: "🟢", count: ARGENT_PATCH_BUNDLES.filter(b => b.os === "rocky" || b.os === "rhel").length, badgeColor: "#10B981" },
    { id: "debian", label: "Debian (DSA)", icon: "🔴", count: ARGENT_PATCH_BUNDLES.filter(b => b.os === "debian").length, badgeColor: "#D70A53" },
    { id: "alpine", label: "Alpine (SecDB)", icon: "🏔️", count: ARGENT_PATCH_BUNDLES.filter(b => b.os === "alpine").length, badgeColor: "#0D597F" },
    { id: "suse", label: "SUSE (SUSE-SU)", icon: "🦎", count: ARGENT_PATCH_BUNDLES.filter(b => b.os === "suse").length, badgeColor: "#30BA78" },
    { id: "arch", label: "Arch Linux (ASA)", icon: "🏹", count: ARGENT_PATCH_BUNDLES.filter(b => b.os === "arch").length, badgeColor: "#1793D1" },
    { id: "amazon-linux", label: "Amazon Linux", icon: "📦", count: ARGENT_PATCH_BUNDLES.filter(b => b.os === "amazon-linux").length, badgeColor: "#F59E0B" },
    { id: "kernel", label: "Kernel Stable", icon: "🐧", count: ARGENT_PATCH_BUNDLES.filter(b => b.os === "kernel").length, badgeColor: "#EAB308" }
  ], []);

  // Filtered bundles
  const filteredBundles = useMemo(() => {
    return ARGENT_PATCH_BUNDLES.filter(b => {
      // OS match
      if (selectedOs !== "all") {
        if (selectedOs === "rocky" && (b.os !== "rocky" && b.os !== "rhel")) return false;
        else if (selectedOs !== "rocky" && b.os !== selectedOs) return false;
      }

      // Severity match
      if (selectedSeverity !== "all" && b.vendorSeverity.toLowerCase() !== selectedSeverity.toLowerCase()) {
        return false;
      }

      // Reboot requirement match
      if (rebootFilter === "zero-downtime" && !b.impact.zeroDowntime) return false;
      if (rebootFilter === "reboot-required" && !b.impact.rebootRequired) return false;

      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesBundle = b.bundleId.toLowerCase().includes(q);
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesSynopsis = b.synopsis.toLowerCase().includes(q);
        const matchesCve = b.cveList.some(c => c.toLowerCase().includes(q));
        const matchesPkg = b.packages.some(p => p.name.toLowerCase().includes(q) || p.fixedVersion.toLowerCase().includes(q));
        if (!matchesBundle && !matchesTitle && !matchesSynopsis && !matchesCve && !matchesPkg) {
          return false;
        }
      }

      return true;
    });
  }, [selectedOs, selectedSeverity, rebootFilter, searchQuery]);

  // Macro metrics
  const stats = useMemo(() => {
    const total = ARGENT_PATCH_BUNDLES.length;
    const critical = ARGENT_PATCH_BUNDLES.filter(b => b.vendorSeverity === "CRITICAL").length;
    const zeroDowntime = ARGENT_PATCH_BUNDLES.filter(b => b.impact.zeroDowntime).length;
    const totalPkgs = ARGENT_PATCH_BUNDLES.reduce((acc, b) => acc + b.packages.length, 0);
    const feedCount = ARGENT_PUBLIC_FEED_SOURCES.length;
    return { total, critical, zeroDowntime, totalPkgs, feedCount };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #090D16 0%, #060910 100%)", color: "#F8FAFC" }}>
      
      {/* HERO SECTION */}
      <section style={{ 
        position: "relative",
        borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 189, 248, 0.12), transparent 70%)",
        padding: "48px 24px 36px 24px"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          {/* TOP TAG & CONTROLS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(148, 163, 184, 0.12)", border: "1px solid rgba(148, 163, 184, 0.3)", borderRadius: "9999px", padding: "4px 14px" }}>
              <ArgentIcon size={18} glow={false} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "#E2E8F0", textTransform: "uppercase" }}>
                Exultia Argent Platform
              </span>
              <span style={{ fontSize: "0.65rem", background: "rgba(56, 189, 248, 0.2)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.4)", borderRadius: "4px", padding: "1px 5px", fontWeight: 700 }}>
                FEED CLONE
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button 
                onClick={() => setShowSourcesModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(30, 41, 59, 0.7)",
                  border: "1px solid rgba(148, 163, 184, 0.25)",
                  borderRadius: "8px",
                  color: "#E2E8F0",
                  padding: "6px 12px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <Radio size={14} color="#38BDF8" />
                Distro Feeds ({ARGENT_PUBLIC_FEED_SOURCES.length})
              </button>

              <a 
                href="/api/argent/feed?format=bash"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.1))",
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  borderRadius: "8px",
                  color: "#38BDF8",
                  padding: "6px 12px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                <Terminal size={14} />
                Export Bash Script
              </a>

              <Link
                href="/wiki#argent"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(30, 41, 59, 0.7)",
                  border: "1px solid rgba(148, 163, 184, 0.25)",
                  borderRadius: "8px",
                  color: "#94A3B8",
                  padding: "6px 12px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                <FileText size={14} />
                Wiki &amp; API
              </Link>
            </div>
          </div>

          {/* MAIN HEADLINE */}
          <div style={{ maxWidth: "880px" }}>
            <h1 style={{ 
              fontSize: "2.4rem", 
              fontWeight: 800, 
              lineHeight: 1.2, 
              margin: "0 0 12px 0",
              background: "linear-gradient(135deg, #FFFFFF 30%, #CBD5E1 70%, #38BDF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Public Distribution Vendor Patch Aggregator
            </h1>
            <p style={{ fontSize: "1.05rem", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
              Specialized Vantage feed derivative focused entirely on <strong>vendor patch bundles</strong> and 
              native OS package errata across Ubuntu, Debian, Rocky Linux/RHEL, Alpine, SUSE, Arch, and Amazon Linux. 
              <strong> Zero abstract CWE clutter</strong>—delivering actionable binary package deltas, package manager commands, 
              and direct deployment via Kinetic.
            </p>
          </div>

          {/* MACRO TELEMETRY STATS */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "14px", 
            marginTop: "28px" 
          }}>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600 }}>
                <span>Total Active Bundles</span>
                <Layers size={16} color="#38BDF8" />
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
                {stats.total}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
                {stats.totalPkgs} packages indexed
              </div>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600 }}>
                <span>Public Feeds Monitored</span>
                <Radio size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#10B981", marginTop: "4px" }}>
                {stats.feedCount} Distros
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
                Canonical, RESF, Debian, Alpine, Red Hat
              </div>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600 }}>
                <span>Critical Vendor Fixes</span>
                <ShieldAlert size={16} color="#EF4444" />
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F87171", marginTop: "4px" }}>
                {stats.critical}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
                High-priority security errata
              </div>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600 }}>
                <span>Zero-Downtime Rollouts</span>
                <Zap size={16} color="#FBBF24" />
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FBBF24", marginTop: "4px" }}>
                {stats.zeroDowntime} ({Math.round((stats.zeroDowntime / stats.total) * 100)}%)
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
                No server reboot required
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FILTER & CONTENT SECTION */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 24px 60px 24px" }}>
        
        {/* OS CATEGORY PILLS */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748B", marginBottom: "10px" }}>
            Operating System Distribution Feeds
          </div>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "thin" }}>
            {OS_CATEGORIES.map(cat => {
              const isSelected = selectedOs === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedOs(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontSize: "0.84rem",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    background: isSelected 
                      ? "rgba(56, 189, 248, 0.15)" 
                      : "rgba(15, 23, 42, 0.6)",
                    color: isSelected ? "#FFFFFF" : "#94A3B8",
                    border: isSelected 
                      ? "1px solid rgba(56, 189, 248, 0.5)" 
                      : "1px solid rgba(148, 163, 184, 0.15)",
                    boxShadow: isSelected ? "0 0 12px rgba(56, 189, 248, 0.15)" : "none"
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span style={{
                    fontSize: "0.72rem",
                    padding: "1px 6px",
                    borderRadius: "9999px",
                    background: isSelected ? "rgba(56, 189, 248, 0.3)" : "rgba(30, 41, 59, 0.6)",
                    color: isSelected ? "#E0F2FE" : "#64748B"
                  }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEARCH & FILTERS TOOLBAR */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: "12px", 
          background: "rgba(15, 23, 42, 0.4)", 
          border: "1px solid rgba(148, 163, 184, 0.15)", 
          borderRadius: "12px", 
          padding: "14px 18px", 
          marginBottom: "24px" 
        }}>
          {/* SEARCH INPUT */}
          <div style={{ position: "relative", flex: "1 1 280px" }}>
            <Search size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text"
              placeholder="Search by package name (e.g. openssh, glibc), bundle ID (USN, RLSA), or CVE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(2, 6, 23, 0.8)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: "8px",
                color: "#F8FAFC",
                padding: "8px 12px 8px 36px",
                fontSize: "0.85rem",
                outline: "none"
              }}
            />
          </div>

          {/* CONTROLS */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* SEVERITY DROPDOWN */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.78rem", color: "#64748B" }}>Severity:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                style={{
                  background: "rgba(2, 6, 23, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "6px",
                  color: "#E2E8F0",
                  padding: "6px 10px",
                  fontSize: "0.82rem",
                  outline: "none"
                }}
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="important">Important</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>

            {/* REBOOT FILTER */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.78rem", color: "#64748B" }}>Reboot:</span>
              <select
                value={rebootFilter}
                onChange={(e) => setRebootFilter(e.target.value as any)}
                style={{
                  background: "rgba(2, 6, 23, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "6px",
                  color: "#E2E8F0",
                  padding: "6px 10px",
                  fontSize: "0.82rem",
                  outline: "none"
                }}
              >
                <option value="all">All Bundles</option>
                <option value="zero-downtime">⚡ Zero-Downtime Only</option>
                <option value="reboot-required">🔄 Reboot Required</option>
              </select>
            </div>

            {/* VIEW MODE TOGGLE */}
            <div style={{ display: "flex", background: "rgba(2, 6, 23, 0.8)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "2px" }}>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  background: viewMode === "grid" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                  color: viewMode === "grid" ? "#38BDF8" : "#64748B",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 600
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                style={{
                  background: viewMode === "table" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                  color: viewMode === "table" ? "#38BDF8" : "#64748B",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 600
                }}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", color: "#64748B", fontSize: "0.82rem" }}>
          <span>
            Showing <strong>{filteredBundles.length}</strong> vendor patch bundles
            {selectedOs !== "all" && <span> for <strong>{selectedOs.toUpperCase()}</strong></span>}
          </span>
          <span>
            Feeds updated in real-time from official public vendor trackers
          </span>
        </div>

        {/* BUNDLE LIST: GRID VIEW */}
        {viewMode === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "18px" }}>
            {filteredBundles.map(bundle => {
              const isCritical = bundle.vendorSeverity === "CRITICAL";
              const isImportant = bundle.vendorSeverity === "IMPORTANT";
              
              const sevBg = isCritical ? "rgba(239, 68, 68, 0.15)" : isImportant ? "rgba(249, 115, 22, 0.15)" : "rgba(234, 179, 8, 0.15)";
              const sevColor = isCritical ? "#F87171" : isImportant ? "#FB923C" : "#FACC15";
              const sevBorder = isCritical ? "rgba(239, 68, 68, 0.35)" : isImportant ? "rgba(249, 115, 22, 0.35)" : "rgba(234, 179, 8, 0.35)";

              return (
                <div 
                  key={bundle.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.55)",
                    border: "1px solid rgba(148, 163, 184, 0.18)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.15s ease, border-color 0.15s ease",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div>
                    {/* BUNDLE TOP BADGES */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ 
                            fontFamily: "monospace", 
                            fontSize: "0.85rem", 
                            fontWeight: 700, 
                            color: "#FFFFFF", 
                            background: "rgba(30, 41, 59, 0.8)", 
                            border: "1px solid rgba(148, 163, 184, 0.3)", 
                            padding: "2px 8px", 
                            borderRadius: "6px" 
                          }}>
                            {bundle.bundleId}
                          </span>
                          <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            background: sevBg,
                            color: sevColor,
                            border: `1px solid ${sevBorder}`
                          }}>
                            {bundle.vendorSeverity}
                          </span>
                        </div>

                        <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "4px" }}>
                          {bundle.osDisplayName} • {bundle.targetReleases[0]}
                        </div>
                      </div>

                      {/* ZERO DOWNTIME / REBOOT BADGE */}
                      {bundle.impact.zeroDowntime ? (
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#34D399",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          padding: "2px 7px",
                          borderRadius: "4px"
                        }}>
                          <Zap size={10} /> ZERO DOWNTIME
                        </span>
                      ) : (
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          background: "rgba(245, 158, 11, 0.15)",
                          color: "#FBBF24",
                          border: "1px solid rgba(245, 158, 11, 0.3)",
                          padding: "2px 7px",
                          borderRadius: "4px"
                        }}>
                          <RefreshCw size={10} /> REBOOT REQ
                        </span>
                      )}
                    </div>

                    {/* TITLE & SYNOPSIS */}
                    <h3 style={{ fontSize: "1.02rem", fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px 0", lineHeight: 1.4 }}>
                      {bundle.title}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                      {bundle.synopsis}
                    </p>

                    {/* AFFECTED PACKAGES VERSION DIFF */}
                    <div style={{ background: "rgba(2, 6, 23, 0.6)", border: "1px solid rgba(148, 163, 184, 0.12)", borderRadius: "8px", padding: "10px", marginBottom: "16px" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "6px" }}>
                        Package Upgrades ({bundle.packages.length}):
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {bundle.packages.map((pkg, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", fontFamily: "monospace" }}>
                            <span style={{ color: "#38BDF8", fontWeight: 600 }}>{pkg.name}</span>
                            <span style={{ color: "#94A3B8" }}>
                              <span style={{ color: "#EF4444", textDecoration: "line-through", opacity: 0.8 }}>{pkg.currentVersion}</span>
                              {" ➔ "}
                              <span style={{ color: "#10B981", fontWeight: 700 }}>{pkg.fixedVersion}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTIONS */}
                  <div>
                    {/* COMMAND COPY PREVIEW */}
                    <div style={{ 
                      position: "relative", 
                      background: "rgba(2, 6, 23, 0.9)", 
                      border: "1px solid rgba(148, 163, 184, 0.2)", 
                      borderRadius: "6px", 
                      padding: "8px 10px", 
                      fontFamily: "monospace", 
                      fontSize: "0.74rem", 
                      color: "#A7F3D0",
                      marginBottom: "12px",
                      overflowX: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      <code>{bundle.commands.nativeUpgrade}</code>
                      <button
                        onClick={() => handleCopy(bundle.commands.nativeUpgrade, `cmd-${bundle.id}`)}
                        title="Copy command"
                        style={{
                          position: "absolute",
                          right: "6px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid rgba(148, 163, 184, 0.3)",
                          borderRadius: "4px",
                          color: copiedKey === `cmd-${bundle.id}` ? "#34D399" : "#E2E8F0",
                          padding: "3px 6px",
                          cursor: "pointer"
                        }}
                      >
                        {copiedKey === `cmd-${bundle.id}` ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setInspectedBundle(bundle)}
                        style={{
                          flex: 1,
                          background: "rgba(30, 41, 59, 0.7)",
                          border: "1px solid rgba(148, 163, 184, 0.25)",
                          borderRadius: "6px",
                          color: "#E2E8F0",
                          padding: "8px 12px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}
                      >
                        <Info size={14} /> Details
                      </button>

                      <button
                        onClick={() => setDeployBundle(bundle)}
                        style={{
                          flex: 1,
                          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(14, 165, 233, 0.25))",
                          border: "1px solid rgba(6, 182, 212, 0.4)",
                          borderRadius: "6px",
                          color: "#22D3EE",
                          padding: "8px 12px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}
                      >
                        <KineticIcon size={14} glow={false} /> Deploy via Kinetic
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div style={{ 
            background: "rgba(15, 23, 42, 0.6)", 
            border: "1px solid rgba(148, 163, 184, 0.2)", 
            borderRadius: "10px", 
            overflowX: "auto" 
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(30, 41, 59, 0.7)", borderBottom: "1px solid rgba(148, 163, 184, 0.2)", color: "#94A3B8" }}>
                  <th style={{ padding: "12px 16px" }}>Advisory / Bundle ID</th>
                  <th style={{ padding: "12px 16px" }}>Operating System</th>
                  <th style={{ padding: "12px 16px" }}>Severity</th>
                  <th style={{ padding: "12px 16px" }}>Title &amp; Synopsis</th>
                  <th style={{ padding: "12px 16px" }}>Upgraded Packages</th>
                  <th style={{ padding: "12px 16px" }}>Impact</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBundles.map(bundle => (
                  <tr 
                    key={bundle.id}
                    style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)", transition: "background 0.15s ease" }}
                  >
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#38BDF8" }}>
                      {bundle.bundleId}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#E2E8F0" }}>
                      {bundle.osDisplayName}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "4px",
                        background: bundle.vendorSeverity === "CRITICAL" ? "rgba(239, 68, 68, 0.2)" : "rgba(249, 115, 22, 0.2)",
                        color: bundle.vendorSeverity === "CRITICAL" ? "#F87171" : "#FB923C",
                        border: bundle.vendorSeverity === "CRITICAL" ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(249, 115, 22, 0.4)"
                      }}>
                        {bundle.vendorSeverity}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", maxWidth: "340px" }}>
                      <div style={{ fontWeight: 600, color: "#F8FAFC", marginBottom: "2px" }}>{bundle.title}</div>
                      <div style={{ fontSize: "0.76rem", color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bundle.synopsis}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "0.78rem" }}>
                      {bundle.packages.map(p => `${p.name} (${p.fixedVersion})`).join(", ")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {bundle.impact.zeroDowntime ? (
                        <span style={{ color: "#34D399", fontSize: "0.74rem", fontWeight: 600 }}>⚡ Zero Downtime</span>
                      ) : (
                        <span style={{ color: "#FBBF24", fontSize: "0.74rem", fontWeight: 600 }}>🔄 Reboot Req</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          onClick={() => setInspectedBundle(bundle)}
                          style={{
                            background: "rgba(30, 41, 59, 0.8)",
                            border: "1px solid rgba(148, 163, 184, 0.25)",
                            borderRadius: "4px",
                            color: "#E2E8F0",
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => setDeployBundle(bundle)}
                          style={{
                            background: "rgba(6, 182, 212, 0.2)",
                            border: "1px solid rgba(6, 182, 212, 0.4)",
                            borderRadius: "4px",
                            color: "#22D3EE",
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          Kinetic
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      {/* INSPECTION MODAL DRAWER */}
      {inspectedBundle && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#0F172A",
            border: "1px solid rgba(148, 163, 184, 0.25)",
            borderRadius: "14px",
            maxWidth: "760px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "28px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)"
          }}>
            {/* MODAL HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ArgentIcon size={22} glow={false} />
                  <span style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                    {inspectedBundle.bundleId}
                  </span>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: inspectedBundle.vendorSeverity === "CRITICAL" ? "rgba(239, 68, 68, 0.2)" : "rgba(249, 115, 22, 0.2)",
                    color: inspectedBundle.vendorSeverity === "CRITICAL" ? "#F87171" : "#FB923C",
                    border: inspectedBundle.vendorSeverity === "CRITICAL" ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(249, 115, 22, 0.4)"
                  }}>
                    {inspectedBundle.vendorSeverity}
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "4px" }}>
                  {inspectedBundle.osDisplayName} • Releases: {inspectedBundle.targetReleases.join(", ")}
                </div>
              </div>

              <button
                onClick={() => setInspectedBundle(null)}
                style={{
                  background: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "6px",
                  color: "#94A3B8",
                  padding: "4px 10px",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* SYNOPSIS & RESOLVED CVES */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F8FAFC", margin: "0 0 8px 0" }}>
                {inspectedBundle.title}
              </h4>
              <p style={{ fontSize: "0.88rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 12px 0" }}>
                {inspectedBundle.synopsis}
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.78rem", color: "#64748B" }}>Resolved Vulnerabilities:</span>
                {inspectedBundle.cveList.map(cve => (
                  <span key={cve} style={{
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    background: "rgba(56, 189, 248, 0.15)",
                    color: "#38BDF8",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    padding: "2px 6px",
                    borderRadius: "4px"
                  }}>
                    {cve}
                  </span>
                ))}
              </div>
            </div>

            {/* UPGRADE PACKAGES TABLE */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "8px" }}>
                Target Binary Package Updates
              </div>
              <div style={{ background: "rgba(2, 6, 23, 0.8)", border: "1px solid rgba(148, 163, 184, 0.15)", borderRadius: "8px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "rgba(30, 41, 59, 0.6)", color: "#94A3B8", borderBottom: "1px solid rgba(148, 163, 184, 0.15)" }}>
                      <th style={{ padding: "8px 12px" }}>Package</th>
                      <th style={{ padding: "8px 12px" }}>Architecture</th>
                      <th style={{ padding: "8px 12px" }}>Affected Version</th>
                      <th style={{ padding: "8px 12px" }}>Fixed Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectedBundle.packages.map((pkg, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.08)", fontFamily: "monospace" }}>
                        <td style={{ padding: "8px 12px", color: "#38BDF8", fontWeight: 600 }}>{pkg.name}</td>
                        <td style={{ padding: "8px 12px", color: "#94A3B8" }}>{pkg.arch}</td>
                        <td style={{ padding: "8px 12px", color: "#EF4444" }}>{pkg.currentVersion}</td>
                        <td style={{ padding: "8px 12px", color: "#10B981", fontWeight: 700 }}>{pkg.fixedVersion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SHELL COMMANDS SECTION */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {/* NATIVE UPGRADE */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>Native Distribution Upgrade Command:</span>
                  <button 
                    onClick={() => handleCopy(inspectedBundle.commands.nativeUpgrade, "modal-upg")}
                    style={{ background: "transparent", border: "none", color: copiedKey === "modal-upg" ? "#34D399" : "#38BDF8", fontSize: "0.74rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    {copiedKey === "modal-upg" ? <Check size={12} /> : <Copy size={12} />} Copy
                  </button>
                </div>
                <div style={{ background: "rgba(2, 6, 23, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "8px 12px", fontFamily: "monospace", fontSize: "0.8rem", color: "#A7F3D0" }}>
                  <code>{inspectedBundle.commands.nativeUpgrade}</code>
                </div>
              </div>

              {/* VERIFICATION */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>Package State Verification Command:</span>
                  <button 
                    onClick={() => handleCopy(inspectedBundle.commands.verification, "modal-ver")}
                    style={{ background: "transparent", border: "none", color: copiedKey === "modal-ver" ? "#34D399" : "#38BDF8", fontSize: "0.74rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    {copiedKey === "modal-ver" ? <Check size={12} /> : <Copy size={12} />} Copy
                  </button>
                </div>
                <div style={{ background: "rgba(2, 6, 23, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "8px 12px", fontFamily: "monospace", fontSize: "0.8rem", color: "#BAE6FD" }}>
                  <code>{inspectedBundle.commands.verification}</code>
                </div>
              </div>

              {/* ROLLBACK */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>Deterministic Rollback Command:</span>
                  <button 
                    onClick={() => handleCopy(inspectedBundle.commands.rollback, "modal-rb")}
                    style={{ background: "transparent", border: "none", color: copiedKey === "modal-rb" ? "#34D399" : "#38BDF8", fontSize: "0.74rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    {copiedKey === "modal-rb" ? <Check size={12} /> : <Copy size={12} />} Copy
                  </button>
                </div>
                <div style={{ background: "rgba(2, 6, 23, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "8px 12px", fontFamily: "monospace", fontSize: "0.8rem", color: "#FED7AA" }}>
                  <code>{inspectedBundle.commands.rollback}</code>
                </div>
              </div>
            </div>

            {/* UPSTREAM NOTICE LINK & KINETIC DISPATCH */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
              <a 
                href={inspectedBundle.upstreamNoticeUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#94A3B8",
                  fontSize: "0.82rem",
                  textDecoration: "none"
                }}
              >
                <ExternalLink size={14} /> Official Upstream Advisory
              </a>

              <button
                onClick={() => {
                  setDeployBundle(inspectedBundle);
                  setInspectedBundle(null);
                }}
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(14, 165, 233, 0.35))",
                  border: "1px solid rgba(6, 182, 212, 0.5)",
                  borderRadius: "6px",
                  color: "#22D3EE",
                  padding: "8px 16px",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <KineticIcon size={16} glow={false} /> Deploy via Kinetic CLI
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DISTRO SOURCES DIRECTORY MODAL */}
      {showSourcesModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#0F172A",
            border: "1px solid rgba(148, 163, 184, 0.25)",
            borderRadius: "14px",
            maxWidth: "880px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "28px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Radio size={22} color="#38BDF8" />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    Public Distro Patch Feeds Directory
                  </h3>
                </div>
                <p style={{ fontSize: "0.84rem", color: "#94A3B8", margin: "4px 0 0 0" }}>
                  Official public security notice streams, OVAL endpoints, and package tracker APIs monitored by Argent.
                </p>
              </div>

              <button
                onClick={() => setShowSourcesModal(false)}
                style={{
                  background: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "6px",
                  color: "#94A3B8",
                  padding: "4px 10px",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* SOURCES LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {ARGENT_PUBLIC_FEED_SOURCES.map(source => (
                <div 
                  key={source.id}
                  style={{
                    background: "rgba(2, 6, 23, 0.7)",
                    border: "1px solid rgba(148, 163, 184, 0.15)",
                    borderRadius: "8px",
                    padding: "16px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <div>
                      <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8FAFC" }}>{source.name}</span>
                      <span style={{ fontSize: "0.78rem", color: "#64748B", marginLeft: "8px" }}>by {source.provider}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{
                        fontSize: "0.68rem",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        background: "rgba(56, 189, 248, 0.15)",
                        color: "#38BDF8",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        padding: "1px 6px",
                        borderRadius: "4px"
                      }}>
                        {source.format}
                      </span>
                      <span style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#34D399",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        padding: "1px 6px",
                        borderRadius: "4px"
                      }}>
                        LIVE
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: "0 0 10px 0" }}>
                    {source.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "0.75rem", color: "#64748B" }}>
                    <div>
                      Cadence: <span style={{ color: "#E2E8F0" }}>{source.updateFrequency}</span> • Releases: <span style={{ color: "#E2E8F0" }}>{source.supportedReleases.join(", ")}</span>
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <a href={source.officialFeedUrl} target="_blank" rel="noreferrer" style={{ color: "#38BDF8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Database size={12} /> Feed Endpoint
                      </a>
                      <a href={source.documentationUrl} target="_blank" rel="noreferrer" style={{ color: "#94A3B8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <ExternalLink size={12} /> Docs
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KINETIC DEPLOYMENT MODAL */}
      {deployBundle && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#0F172A",
            border: "1px solid rgba(6, 182, 212, 0.35)",
            borderRadius: "14px",
            maxWidth: "680px",
            width: "100%",
            padding: "28px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <KineticIcon size={24} glow={false} />
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    Deploy {deployBundle.bundleId} via Kinetic
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#22D3EE" }}>
                    Autonomous Zero-Downtime Package Orchestrator
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDeployBundle(null)}
                style={{
                  background: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "6px",
                  color: "#94A3B8",
                  padding: "4px 10px",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                ✕ Close
              </button>
            </div>

            <p style={{ fontSize: "0.84rem", color: "#94A3B8", lineHeight: 1.5, margin: "0 0 16px 0" }}>
              Kinetic ingests Argent patch feeds to atomically upgrade distribution packages with pre-snapshotting, 
              post-upgrade verification gates, and sub-second deterministic rollback.
            </p>

            {/* CLI COMMAND BOX 1 */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>Option 1: Kinetic CLI Targeted Upgrade</span>
                <button
                  onClick={() => handleCopy(`kinetic upgrade --bundle ${deployBundle.bundleId} --os ${deployBundle.os}`, "deploy-cli")}
                  style={{ background: "transparent", border: "none", color: copiedKey === "deploy-cli" ? "#34D399" : "#22D3EE", fontSize: "0.74rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  {copiedKey === "deploy-cli" ? <Check size={12} /> : <Copy size={12} />} Copy
                </button>
              </div>
              <div style={{ background: "rgba(2, 6, 23, 0.95)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "6px", padding: "10px 14px", fontFamily: "monospace", fontSize: "0.82rem", color: "#67E8F9" }}>
                <code>{`kinetic upgrade --bundle ${deployBundle.bundleId} --os ${deployBundle.os}`}</code>
              </div>
            </div>

            {/* CLI COMMAND BOX 2: STREAMED BASH */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>Option 2: Direct Streamed POSIX Ingestion (Zero-Agent)</span>
                <button
                  onClick={() => handleCopy(`curl -sSL "https://exultia.tech/api/argent/feed?os=${deployBundle.os}&format=bash" | sudo bash`, "deploy-sh")}
                  style={{ background: "transparent", border: "none", color: copiedKey === "deploy-sh" ? "#34D399" : "#22D3EE", fontSize: "0.74rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  {copiedKey === "deploy-sh" ? <Check size={12} /> : <Copy size={12} />} Copy
                </button>
              </div>
              <div style={{ background: "rgba(2, 6, 23, 0.95)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "6px", padding: "10px 14px", fontFamily: "monospace", fontSize: "0.82rem", color: "#F8FAFC" }}>
                <code>{`curl -sSL "https://exultia.tech/api/argent/feed?os=${deployBundle.os}&format=bash" | sudo bash`}</code>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeployBundle(null)}
                style={{
                  background: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "6px",
                  color: "#E2E8F0",
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  cursor: "pointer"
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
