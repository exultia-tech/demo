'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  ExternalLink, 
  Layers, 
  Zap, 
  Lock, 
  Unlock, 
  Info, 
  Sliders, 
  CheckSquare, 
  Square,
  Server,
  RefreshCw,
  Code2,
  Bug,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ErisIcon, PraxisIcon, VantageIcon } from '@/components/BrandIcons';
import { 
  ERIS_MODULES, 
  VULNERABLE_CONTAINER_SCENARIOS, 
  ERIS_COMPOSE_MANIFEST, 
  ERIS_MANDATORY_DISCLAIMER,
  compileErisChaosScript,
  type ErisModule,
  type VulnerableContainerScenario
} from '@/lib/eris-data';

export default function ErisPage() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'inoculator' | 'containers' | 'walkthrough'>('inoculator');

  // Mandatory Safety Disclaimer Acknowledgement Gate
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [showDisclaimerDetail, setShowDisclaimerDetail] = useState(false);

  // Chaos Inoculator Configuration State
  const [selectedOs, setSelectedOs] = useState<'ubuntu' | 'debian' | 'rhel' | 'rocky' | 'alpine'>('ubuntu');
  const [selectedModuleIds, setSelectedModuleIds] = useState<Set<string>>(
    new Set(ERIS_MODULES.filter(m => m.defaultEnabled).map(m => m.id))
  );
  const [autoRollbackMinutes, setAutoRollbackMinutes] = useState<number>(30);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Terminal & Copy feedback states
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedRollback, setCopiedRollback] = useState(false);
  const [copiedOneLiner, setCopiedOneLiner] = useState(false);
  const [copiedCompose, setCopiedCompose] = useState(false);
  const [copiedContainerCmd, setCopiedContainerCmd] = useState<string | null>(null);

  // Active Container inspection modal / expansion
  const [activeContainerModal, setActiveContainerModal] = useState<VulnerableContainerScenario | null>(null);

  // Origin URL for live curl commands
  const [baseUrl, setBaseUrl] = useState('https://exultia.tech');

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'containers' || tabParam === 'walkthrough' || tabParam === 'inoculator') {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (newTab: 'inoculator' | 'containers' | 'walkthrough') => {
    setActiveTab(newTab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
      window.dispatchEvent(new CustomEvent('eris-tab-change', { detail: newTab }));
    }
  };

  // Toggle chaos module
  const toggleModule = (id: string) => {
    setSelectedModuleIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllModules = () => {
    setSelectedModuleIds(new Set(ERIS_MODULES.map(m => m.id)));
  };

  const clearAllModules = () => {
    setSelectedModuleIds(new Set());
  };

  // Compile active inoculation script
  const compiledChaos = useMemo(() => {
    return compileErisChaosScript(
      selectedOs,
      Array.from(selectedModuleIds),
      autoRollbackMinutes
    );
  }, [selectedOs, selectedModuleIds, autoRollbackMinutes]);

  // Calculated Stats
  const activeModules = compiledChaos.activeModules;
  const maxCvss = activeModules.length > 0 
    ? Math.max(...activeModules.map(m => m.cvss)) 
    : 0;
  const cveCount = activeModules.filter(m => m.cveRef).length;

  // Filter modules by category
  const categories = useMemo(() => {
    const cats = new Set(ERIS_MODULES.map(m => m.category));
    return ['ALL', ...Array.from(cats)];
  }, []);

  const filteredModules = useMemo(() => {
    if (selectedCategory === 'ALL') return ERIS_MODULES;
    return ERIS_MODULES.filter(m => m.category === selectedCategory);
  }, [selectedCategory]);

  // One-liner curl command
  const rawCurlCommand = useMemo(() => {
    const ids = Array.from(selectedModuleIds).join(',');
    return `curl -fsSL "${baseUrl}/api/eris/raw?os=${selectedOs}&modules=${ids}&rollback=${autoRollbackMinutes}" | sudo bash`;
  }, [baseUrl, selectedOs, selectedModuleIds, autoRollbackMinutes]);

  const copyToClipboard = (text: string, type: 'script' | 'rollback' | 'oneliner' | 'compose' | string) => {
    if (!hasAcknowledged) {
      alert("Please acknowledge the mandatory safety testing disclaimer before copying Eris payloads.");
      return;
    }
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else if (type === 'rollback') {
      setCopiedRollback(true);
      setTimeout(() => setCopiedRollback(false), 2000);
    } else if (type === 'oneliner') {
      setCopiedOneLiner(true);
      setTimeout(() => setCopiedOneLiner(false), 2000);
    } else if (type === 'compose') {
      setCopiedCompose(true);
      setTimeout(() => setCopiedCompose(false), 2000);
    } else {
      setCopiedContainerCmd(type);
      setTimeout(() => setCopiedContainerCmd(null), 2000);
    }
  };

  const downloadScriptFile = () => {
    if (!hasAcknowledged) {
      alert("Please acknowledge the mandatory safety testing disclaimer before downloading Eris payloads.");
      return;
    }
    const blob = new Blob([compiledChaos.script], { type: 'text/x-shellscript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `eris-inoculate-${selectedOs}.sh`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadComposeFile = () => {
    if (!hasAcknowledged) {
      alert("Please acknowledge the mandatory safety testing disclaimer before downloading Eris compose manifests.");
      return;
    }
    const blob = new Blob([ERIS_COMPOSE_MANIFEST], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'docker-compose.eris.yml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060A13", color: "#F1F5F9", fontFamily: "var(--font-sans, system-ui, sans-serif)", paddingBottom: "80px" }}>
      
      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section style={{ 
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245, 158, 11, 0.22), rgba(239, 68, 68, 0.1), rgba(6, 10, 19, 0))",
        borderBottom: "1px solid rgba(245, 158, 11, 0.25)",
        padding: "48px 24px 32px 24px"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            
            {/* Title & Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ 
                padding: "12px", 
                borderRadius: "20px", 
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(124, 45, 18, 0.35), rgba(15, 23, 42, 0.8))",
                border: "1px solid rgba(245, 158, 11, 0.5)",
                boxShadow: "0 0 35px rgba(245, 158, 11, 0.35), inset 0 0 15px rgba(245, 158, 11, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ErisIcon size={56} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ 
                    fontFamily: "var(--font-display, 'Orbitron', sans-serif)", 
                    fontSize: "2.4rem", 
                    fontWeight: 900, 
                    letterSpacing: "0.08em",
                    background: "linear-gradient(90deg, #FFFFFF 15%, #FEF08A 55%, #F59E0B 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0
                  }}>
                    ERIS
                  </h1>
                  <span style={{ 
                    fontSize: "0.72rem", 
                    fontWeight: 800, 
                    background: "rgba(245, 158, 11, 0.2)", 
                    color: "#FBBF24", 
                    border: "1px solid rgba(245, 158, 11, 0.45)", 
                    padding: "3px 9px", 
                    borderRadius: "6px",
                    letterSpacing: "0.08em"
                  }}>
                    CHAOS &amp; STRIFE LAB
                  </span>
                </div>
                <p style={{ margin: "6px 0 0 0", color: "#94A3B8", fontSize: "1.02rem", maxWidth: "680px" }}>
                  Named for Eris, goddess of chaos and strife. The inverse of Praxis: intentionally seed known vulnerabilities, open ports, and broken configurations onto ephemeral test hosts to prove automated detection and remediation engines.
                </p>
              </div>
            </div>

            {/* Quick Actions: Bridge to Praxis & Pricing */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <Link 
                href="/account/subscription?product=eris"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  color: "#FBBF24",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
              >
                <Sparkles size={16} />
                <span>Pricing &amp; Bundles</span>
              </Link>
              <Link 
                href="/app/praxis?erisRemediate=true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#34D399",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
              >
                <Zap size={16} />
                <span>Remediate in Praxis</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

          {/* ── MANDATORY SAFETY DISCLAIMER BANNER & INTERACTIVE GATE ──────── */}
          <div style={{
            marginTop: "28px",
            borderRadius: "14px",
            background: hasAcknowledged ? "rgba(239, 68, 68, 0.05)" : "rgba(239, 68, 68, 0.12)",
            border: hasAcknowledged ? "1px solid rgba(239, 68, 68, 0.35)" : "2px solid rgba(239, 68, 68, 0.75)",
            boxShadow: hasAcknowledged ? "none" : "0 0 25px rgba(239, 68, 68, 0.3)",
            padding: "20px 24px",
            transition: "all 0.3s ease"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ 
                background: "rgba(239, 68, 68, 0.2)", 
                borderRadius: "10px", 
                padding: "8px", 
                flexShrink: 0,
                color: "#EF4444"
              }}>
                <ShieldAlert size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ 
                      fontSize: "0.85rem", 
                      fontWeight: 900, 
                      color: "#F87171", 
                      letterSpacing: "0.06em",
                      fontFamily: "var(--font-mono, monospace)" 
                    }}>
                      {ERIS_MANDATORY_DISCLAIMER.title}
                    </span>
                    <span style={{ 
                      fontSize: "0.72rem", 
                      fontWeight: 800, 
                      background: "rgba(239, 68, 68, 0.25)", 
                      color: "#FECACA", 
                      padding: "2px 7px", 
                      borderRadius: "4px" 
                    }}>
                      NON-PRODUCTION ONLY
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => setShowDisclaimerDetail(!showDisclaimerDetail)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      textDecoration: "underline"
                    }}
                  >
                    {showDisclaimerDetail ? "Hide Details" : "Read Full Policy"}
                  </button>
                </div>

                <p style={{ margin: "8px 0 12px 0", color: "#E2E8F0", fontSize: "0.92rem", lineHeight: 1.5 }}>
                  <strong>NOTICE:</strong> The scripts and container recipes generated by Eris <strong>intentionally introduce active security vulnerabilities</strong>, open unauthenticated listener ports (4444/8080), alter SSH race condition timeouts, and spoof DNS entries. <strong>DO NOT run these payloads on production hosts.</strong>
                </p>

                {showDisclaimerDetail && (
                  <div style={{
                    margin: "12px 0",
                    padding: "14px",
                    background: "rgba(0, 0, 0, 0.4)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    fontSize: "0.85rem",
                    color: "#CBD5E1",
                    whiteSpace: "pre-line",
                    lineHeight: 1.6
                  }}>
                    {ERIS_MANDATORY_DISCLAIMER.bodyText}
                  </div>
                )}

                {/* Interactive Checkbox Gate */}
                <div 
                  onClick={() => setHasAcknowledged(!hasAcknowledged)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: hasAcknowledged ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.2)",
                    border: hasAcknowledged ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(239, 68, 68, 0.5)",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  {hasAcknowledged ? (
                    <CheckSquare size={18} color="#34D399" />
                  ) : (
                    <Square size={18} color="#F87171" />
                  )}
                  <span style={{ 
                    fontSize: "0.86rem", 
                    fontWeight: 700, 
                    color: hasAcknowledged ? "#34D399" : "#FCA5A5" 
                  }}>
                    {ERIS_MANDATORY_DISCLAIMER.termsCheckboxText}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* ── METRICS SUMMARY BAR ─────────────────────────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            marginTop: "20px"
          }}>
            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "14px 18px"
            }}>
              <div style={{ fontSize: "0.76rem", color: "#94A3B8", fontWeight: 600 }}>Active Chaos Modules</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", marginTop: "2px" }}>
                {activeModules.length} <span style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 500 }}>/ {ERIS_MODULES.length}</span>
              </div>
            </div>

            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "14px 18px"
            }}>
              <div style={{ fontSize: "0.76rem", color: "#94A3B8", fontWeight: 600 }}>Peak CVSS Exposure</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: maxCvss >= 9 ? "#EF4444" : "#F59E0B", marginTop: "2px" }}>
                {maxCvss.toFixed(1)} <span style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 500 }}>CRITICAL</span>
              </div>
            </div>

            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "14px 18px"
            }}>
              <div style={{ fontSize: "0.76rem", color: "#94A3B8", fontWeight: 600 }}>CVE Vectors Seeded</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#60A5FA", marginTop: "2px" }}>
                {cveCount} <span style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 500 }}>Known Advisories</span>
              </div>
            </div>

            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "14px 18px"
            }}>
              <div style={{ fontSize: "0.76rem", color: "#94A3B8", fontWeight: 600 }}>Deterministic Rollback</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#34D399", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={18} />
                <span>Snapshot &amp; Revert Ready</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TAB NAVIGATION ────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "#0A0F1D" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "8px" }}>
          
          <button
            onClick={() => handleTabChange('inoculator')}
            style={{
              padding: "16px 20px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === 'inoculator' ? "2px solid #EF4444" : "2px solid transparent",
              color: activeTab === 'inoculator' ? "#FFFFFF" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease"
            }}
          >
            <Flame size={17} color={activeTab === 'inoculator' ? "#EF4444" : "#94A3B8"} />
            Chaos Inoculator (Endpoint Script)
          </button>

          <button
            onClick={() => handleTabChange('containers')}
            style={{
              padding: "16px 20px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === 'containers' ? "2px solid #EF4444" : "2px solid transparent",
              color: activeTab === 'containers' ? "#FFFFFF" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease"
            }}
          >
            <Layers size={17} color={activeTab === 'containers' ? "#EF4444" : "#94A3B8"} />
            Vulnerable Containers (Docker Lab)
          </button>

          <button
            onClick={() => handleTabChange('walkthrough')}
            style={{
              padding: "16px 20px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === 'walkthrough' ? "2px solid #EF4444" : "2px solid transparent",
              color: activeTab === 'walkthrough' ? "#FFFFFF" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease"
            }}
          >
            <BookOpen size={17} color={activeTab === 'walkthrough' ? "#EF4444" : "#94A3B8"} />
            Skeptical Customer Walkthrough
          </button>

        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ────────────────────────────────── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        
        {/* ========================================================== */}
        {/* TAB 1: CHAOS INOCULATOR (SCRIPT GENERATOR)                  */}
        {/* ========================================================== */}
        {activeTab === 'inoculator' && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "28px", alignItems: "start" }}>
            
            {/* LEFT COLUMN: Controls & Module Selector */}
            <div>
              
              {/* Configuration Controls Bar */}
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "20px"
              }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sliders size={18} color="#EF4444" />
                  Target Environment &amp; Safety Guards
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  
                  {/* OS Selector */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
                      TARGET OPERATING SYSTEM
                    </label>
                    <select
                      value={selectedOs}
                      onChange={(e) => setSelectedOs(e.target.value as any)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#0A0F1D",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "0.88rem"
                      }}
                    >
                      <option value="ubuntu">Ubuntu Linux (20.04 / 22.04 / 24.04)</option>
                      <option value="debian">Debian GNU/Linux (11 / 12)</option>
                      <option value="rhel">RHEL / Red Hat Enterprise</option>
                      <option value="rocky">Rocky Linux / AlmaLinux</option>
                      <option value="alpine">Alpine Linux (ephemeral container)</option>
                    </select>
                  </div>

                  {/* Auto-Rollback Timer */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
                      SAFETY AUTO-ROLLBACK TIMER
                    </label>
                    <select
                      value={autoRollbackMinutes}
                      onChange={(e) => setAutoRollbackMinutes(parseInt(e.target.value, 10))}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#0A0F1D",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "0.88rem"
                      }}
                    >
                      <option value={15}>15 Minutes (Recommended for quick tests)</option>
                      <option value={30}>30 Minutes (Standard lab validation)</option>
                      <option value={60}>60 Minutes (Extended chaos evaluation)</option>
                      <option value={0}>Disabled (Manual rollback via $0 --rollback)</option>
                    </select>
                  </div>

                </div>

                {/* Category Pills & Bulk Selection */}
                <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: selectedCategory === cat ? "1px solid #EF4444" : "1px solid rgba(255, 255, 255, 0.1)",
                          background: selectedCategory === cat ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.03)",
                          color: selectedCategory === cat ? "#FCA5A5" : "#94A3B8",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={selectAllModules}
                      style={{
                        padding: "4px 9px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#E2E8F0",
                        fontSize: "0.74rem",
                        cursor: "pointer"
                      }}
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAllModules}
                      style={{
                        padding: "4px 9px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#94A3B8",
                        fontSize: "0.74rem",
                        cursor: "pointer"
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

              </div>

              {/* Module Cards List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredModules.map(mod => {
                  const isSelected = selectedModuleIds.has(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      style={{
                        background: isSelected ? "rgba(239, 68, 68, 0.07)" : "rgba(15, 23, 42, 0.4)",
                        border: isSelected ? "1px solid rgba(239, 68, 68, 0.45)" : "1px solid rgba(255, 255, 255, 0.07)",
                        borderRadius: "12px",
                        padding: "16px",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                          <div style={{ marginTop: "2px" }}>
                            {isSelected ? (
                              <CheckSquare size={18} color="#EF4444" />
                            ) : (
                              <Square size={18} color="#64748B" />
                            )}
                          </div>
                          <div>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF" }}>
                                {mod.title}
                              </span>
                              {mod.cveRef && (
                                <span style={{
                                  fontSize: "0.68rem",
                                  fontWeight: 800,
                                  background: "rgba(59, 130, 246, 0.18)",
                                  color: "#93C5FD",
                                  border: "1px solid rgba(59, 130, 246, 0.35)",
                                  padding: "1px 6px",
                                  borderRadius: "4px"
                                }}>
                                  {mod.cveRef}
                                </span>
                              )}
                              <span style={{
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                background: mod.severity === 'CRITICAL' ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                                color: mod.severity === 'CRITICAL' ? "#F87171" : "#FBBF24",
                                border: mod.severity === 'CRITICAL' ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
                                padding: "1px 6px",
                                borderRadius: "4px"
                              }}>
                                CVSS {mod.cvss.toFixed(1)} {mod.severity}
                              </span>
                            </div>

                            <p style={{ margin: "6px 0 0 0", fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.4 }}>
                              {mod.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Inoculated vs Remediation Specs */}
                      <div style={{
                        marginTop: "12px",
                        paddingTop: "10px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        fontSize: "0.76rem"
                      }}>
                        <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "8px 10px", borderRadius: "6px" }}>
                          <span style={{ color: "#EF4444", fontWeight: 700 }}>🔥 Inoculates: </span>
                          <span style={{ color: "#CBD5E1", fontFamily: "var(--font-mono, monospace)" }}>{mod.injectedMisconfig}</span>
                        </div>
                        <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "8px 10px", borderRadius: "6px" }}>
                          <span style={{ color: "#10B981", fontWeight: 700 }}>⚡ Praxis Countermeasure: </span>
                          <span style={{ color: "#CBD5E1" }}>{mod.praxisRemediationClass}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: Live Inoculation Payload & Rollback Terminal */}
            <div style={{ position: "sticky", top: "110px" }}>
              
              {/* Terminal Container */}
              <div style={{
                background: "#080C16",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
              }}>
                
                {/* Terminal Header */}
                <div style={{
                  background: "#0E1526",
                  padding: "12px 18px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ marginLeft: "8px", fontSize: "0.8rem", fontFamily: "var(--font-mono, monospace)", color: "#94A3B8" }}>
                      eris-inoculate-{selectedOs}.sh
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={downloadScriptFile}
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#E2E8F0",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <Download size={13} />
                      Download .sh
                    </button>

                    <button
                      onClick={() => copyToClipboard(compiledChaos.script, 'script')}
                      style={{
                        background: copiedScript ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                        border: copiedScript ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
                        color: copiedScript ? "#34D399" : "#FCA5A5",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      {copiedScript ? <Check size={13} /> : <Copy size={13} />}
                      {copiedScript ? "Copied" : "Copy Script"}
                    </button>
                  </div>
                </div>

                {/* One-Liner Quick Run Bar */}
                <div style={{
                  padding: "12px 18px",
                  background: "rgba(239, 68, 68, 0.05)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px"
                }}>
                  <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: "0.75rem", color: "#EF4444", fontWeight: 800 }}>RUN ONE-LINER: </span>
                    <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)", color: "#CBD5E1" }}>
                      {rawCurlCommand}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(rawCurlCommand, 'oneliner')}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      padding: "4px 8px",
                      borderRadius: "5px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      flexShrink: 0
                    }}
                  >
                    {copiedOneLiner ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
                    {copiedOneLiner ? "Copied" : "Copy"}
                  </button>
                </div>

                {/* Code Body */}
                <div style={{
                  maxHeight: "440px",
                  overflowY: "auto",
                  padding: "16px 18px",
                  fontFamily: "var(--font-mono, 'SF Mono', Consolas, monospace)",
                  fontSize: "0.78rem",
                  lineHeight: 1.5,
                  color: "#94A3B8",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all"
                }}>
                  {compiledChaos.script}
                </div>

                {/* Deterministic Rollback Box */}
                <div style={{
                  background: "#0B1120",
                  padding: "14px 18px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px"
                }}>
                  <div>
                    <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#34D399", display: "flex", alignItems: "center", gap: "6px" }}>
                      <RotateCcw size={13} />
                      INSTANT ROLLBACK COMMAND
                    </div>
                    <code style={{ fontSize: "0.78rem", color: "#F1F5F9", marginTop: "3px", display: "block" }}>
                      sudo /var/log/eris/eris-setup.sh --rollback
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard('sudo /var/log/eris/eris-setup.sh --rollback', 'rollback')}
                    style={{
                      background: copiedRollback ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: copiedRollback ? "#34D399" : "#FFFFFF",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    {copiedRollback ? <Check size={13} /> : <Copy size={13} />}
                    {copiedRollback ? "Copied" : "Copy Rollback"}
                  </button>
                </div>

              </div>

              {/* Praxis Next Step Bridge Card */}
              <div style={{
                marginTop: "16px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.8))",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "12px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px"
              }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#34D399", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Zap size={16} />
                    Next: Neutralize These Flaws in Praxis
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: "#94A3B8" }}>
                    Praxis will detect the Eris manifest and execute hotpatches, port drop rules, and configuration locks with After-Action CBOM generation.
                  </p>
                </div>

                <Link
                  href="/app/praxis?erisRemediate=true"
                  style={{
                    background: "rgba(16, 185, 129, 0.2)",
                    border: "1px solid rgba(16, 185, 129, 0.5)",
                    color: "#A7F3D0",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span>Launch Praxis</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: VULNERABLE CONTAINERS (DOCKER LAB)                   */}
        {/* ========================================================== */}
        {activeTab === 'containers' && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0" }}>
                  Preconfigured Vulnerable Testing Containers
                </h2>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.9rem" }}>
                  Isolated Docker environments knowingly configured with high-profile CVEs for zero-risk validation of firewalls, canaries, and remediation scripts.
                </p>
              </div>

              {/* Compose manifest download */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => copyToClipboard(ERIS_COMPOSE_MANIFEST, 'compose')}
                  style={{
                    background: copiedCompose ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.06)",
                    border: copiedCompose ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.15)",
                    color: copiedCompose ? "#34D399" : "#E2E8F0",
                    padding: "9px 15px",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {copiedCompose ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCompose ? "Copied Compose" : "Copy docker-compose.yml"}
                </button>

                <button
                  onClick={downloadComposeFile}
                  style={{
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#FCA5A5",
                    padding: "9px 15px",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Download size={14} />
                  Download Compose Range
                </button>
              </div>
            </div>

            {/* Containers Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(560px, 1fr))", gap: "20px" }}>
              {VULNERABLE_CONTAINER_SCENARIOS.map(sc => (
                <div
                  key={sc.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            background: "rgba(239, 68, 68, 0.2)",
                            color: "#F87171",
                            border: "1px solid rgba(239, 68, 68, 0.4)",
                            padding: "2px 7px",
                            borderRadius: "4px"
                          }}>
                            {sc.cveId}
                          </span>
                          <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            background: "rgba(255, 255, 255, 0.08)",
                            color: "#CBD5E1",
                            padding: "2px 7px",
                            borderRadius: "4px"
                          }}>
                            CVSS {sc.cvss.toFixed(1)} {sc.severity}
                          </span>
                        </div>
                        <h3 style={{ margin: "10px 0 6px 0", fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF" }}>
                          {sc.name}
                        </h3>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "#94A3B8", background: "rgba(0, 0, 0, 0.3)", padding: "4px 8px", borderRadius: "6px" }}>
                        {sc.category}
                      </span>
                    </div>

                    <p style={{ margin: "6px 0 14px 0", fontSize: "0.84rem", color: "#94A3B8", lineHeight: 1.4 }}>
                      {sc.description}
                    </p>

                    {/* Docker Run Box */}
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#60A5FA", marginBottom: "4px" }}>
                        DOCKER RUN COMMAND:
                      </div>
                      <div style={{
                        background: "#080C16",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px"
                      }}>
                        <code style={{ fontSize: "0.76rem", color: "#E2E8F0", fontFamily: "var(--font-mono, monospace)", wordBreak: "break-all" }}>
                          {sc.dockerRunCommand}
                        </code>
                        <button
                          onClick={() => copyToClipboard(sc.dockerRunCommand, sc.id)}
                          style={{
                            background: copiedContainerCmd === sc.id ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                            border: "none",
                            color: copiedContainerCmd === sc.id ? "#34D399" : "#FFFFFF",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                            flexShrink: 0
                          }}
                        >
                          {copiedContainerCmd === sc.id ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    {/* Verification Command Box */}
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#F59E0B", marginBottom: "4px" }}>
                        VERIFY VULNERABILITY LISTENER:
                      </div>
                      <div style={{
                        background: "#080C16",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "8px 12px"
                      }}>
                        <code style={{ fontSize: "0.76rem", color: "#FDE68A", fontFamily: "var(--font-mono, monospace)" }}>
                          {sc.verificationCommand}
                        </code>
                      </div>
                    </div>

                  </div>

                  {/* Remediation Tier Info & Dockerfile Expander */}
                  <div style={{
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px"
                  }}>
                    <div style={{ fontSize: "0.76rem", color: "#34D399" }}>
                      <strong>Remediation: </strong>{sc.praxisRemediationTier}
                    </div>

                    <button
                      onClick={() => setActiveContainerModal(sc)}
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#E2E8F0",
                        padding: "4px 9px",
                        borderRadius: "6px",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Code2 size={12} />
                      View Dockerfile
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Dockerfile Inspector Modal */}
            {activeContainerModal && (
              <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "24px"
              }}>
                <div style={{
                  background: "#0E1526",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  maxWidth: "680px",
                  width: "100%",
                  padding: "24px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                        Dockerfile: {activeContainerModal.name}
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                        CVE: {activeContainerModal.cveId}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveContainerModal(null)}
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "none",
                        color: "#94A3B8",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div style={{
                    background: "#060A13",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "16px",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.8rem",
                    color: "#CBD5E1",
                    whiteSpace: "pre-wrap",
                    maxHeight: "360px",
                    overflowY: "auto"
                  }}>
                    {activeContainerModal.dockerfile}
                  </div>

                  <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeContainerModal.dockerfile);
                        alert("Dockerfile copied to clipboard!");
                      }}
                      style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#FCA5A5",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Copy size={13} />
                      Copy Dockerfile
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: SKEPTICAL CUSTOMER VALIDATION WALKTHROUGH           */}
        {/* ========================================================== */}
        {activeTab === 'walkthrough' && (
          <div style={{ maxWidth: "880px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34D399",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                padding: "3px 10px",
                borderRadius: "6px",
                letterSpacing: "0.08em"
              }}>
                VALIDATION PLAYBOOK
              </span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#FFFFFF", margin: "12px 0 8px 0" }}>
                Proving Praxis to a Skeptical Customer in 3 Minutes
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto" }}>
                Step-by-step instructions to run Eris and Praxis in an isolated, free cloud VM with zero vendor trust required.
              </p>
            </div>

            {/* Stepper Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* STEP 1 */}
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(59, 130, 246, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    color: "#93C5FD",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem"
                  }}>
                    1
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                    Spin Up a Free Disposable VM
                  </h3>
                </div>
                <p style={{ margin: "0 0 12px 0", color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  Launch a disposable Ubuntu or Debian environment using any free cloud sandbox:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                  <div style={{ background: "#080C16", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.82rem" }}>Killercoda Ubuntu</div>
                    <div style={{ fontSize: "0.74rem", color: "#64748B" }}>Instant browser terminal, no login required</div>
                  </div>
                  <div style={{ background: "#080C16", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.82rem" }}>Google Cloud Shell</div>
                    <div style={{ fontSize: "0.74rem", color: "#64748B" }}>Free Debian VM with sudo root privileges</div>
                  </div>
                  <div style={{ background: "#080C16", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.82rem" }}>Multipass or Local Docker</div>
                    <div style={{ fontSize: "0.74rem", color: "#64748B" }}><code>docker run --privileged -it ubuntu:22.04</code></div>
                  </div>
                </div>
              </div>

              {/* STEP 2 */}
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#F87171",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem"
                  }}>
                    2
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                    Inoculate the Host with Eris Test Flaws
                  </h3>
                </div>
                <p style={{ margin: "0 0 12px 0", color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  Execute the Eris one-liner to deliberately open ports (4444/8080), enable vulnerable OpenSSH timeouts, and inject test markers:
                </p>
                <div style={{
                  background: "#080C16",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.82rem",
                  color: "#FCA5A5"
                }}>
                  curl -fsSL &quot;https://exultia.tech/api/eris/raw?os=ubuntu&quot; | sudo bash
                </div>
                <p style={{ margin: "8px 0 0 0", color: "#64748B", fontSize: "0.78rem" }}>
                  Check open ports afterwards with <code>ss -tulnp | grep -E &apos;4444|8080|22&apos;</code> to verify the simulated rogue listeners are live.
                </p>
              </div>

              {/* STEP 3 */}
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    color: "#34D399",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem"
                  }}>
                    3
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                    Run the Praxis Countermeasure Script
                  </h3>
                </div>
                <p style={{ margin: "0 0 12px 0", color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  Generate and run the Praxis client remediation script. Praxis autonomously neutralizes the listeners, restores SSH LoginGraceTime to 0, locks rogue tester accounts, and writes a cryptographic CBOM:
                </p>
                <div style={{
                  background: "#080C16",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.82rem",
                  color: "#6EE7B7"
                }}>
                  curl -fsSL &quot;https://exultia.tech/api/patches/remediate/client?os=linux&quot; | sudo bash
                </div>
              </div>

              {/* STEP 4 */}
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(168, 85, 247, 0.2)",
                    border: "1px solid rgba(168, 85, 247, 0.4)",
                    color: "#C084FC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem"
                  }}>
                    4
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                    Inspect the Cryptographic After-Action CBOM
                  </h3>
                </div>
                <p style={{ margin: "0 0 12px 0", color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  Verify that Praxis emitted a complete attestation bill-of-materials on the endpoint:
                </p>
                <div style={{
                  background: "#080C16",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.82rem",
                  color: "#E2E8F0"
                }}>
                  cat /var/log/exultia/praxis-cbom-after-action.json | jq .
                </div>
                <p style={{ margin: "8px 0 0 0", color: "#94A3B8", fontSize: "0.8rem" }}>
                  The CBOM payload contains the SHA-256 pre-mitigation and post-mitigation fingerprints, verification probes, canary health results, and zero downtime metrics.
                </p>
              </div>

              {/* STEP 5 */}
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(245, 158, 11, 0.2)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    color: "#FBBF24",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem"
                  }}>
                    5
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                    Clean Up / Revert Host State
                  </h3>
                </div>
                <p style={{ margin: "0 0 12px 0", color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  Prove deterministic rollback by reverting both Eris and Praxis changes:
                </p>
                <div style={{
                  background: "#080C16",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.82rem",
                  color: "#FDE68A"
                }}>
                  sudo /var/log/eris/eris-setup.sh --rollback
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
