'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  Zap, 
  Activity, 
  AlertTriangle, 
  Server, 
  FileText, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Layers,
  Code2,
  Bug,
  Eye,
  Sliders
} from 'lucide-react';
import { ValkyrieIcon, PraxisIcon, VantageIcon, ErisIcon } from '@/components/BrandIcons';
import { 
  VALKYRIE_PROBE_CATALOG, 
  executeValkyrieProbe, 
  compileValkyrieProbeScript, 
  generateExecutivePentestReport,
  type ValkyrieProbeVector,
  type PentestProbeResult
} from '@/lib/valkyrie-data';

export default function ValkyriePage() {
  const [selectedProbeId, setSelectedProbeId] = useState<string>('probe-regresshion');
  const [targetType, setTargetType] = useState<'remote_host' | 'docker_container' | 'simulated_sandbox'>('simulated_sandbox');
  const [targetHost, setTargetHost] = useState<string>('127.0.0.1');
  const [targetPort, setTargetPort] = useState<number>(22);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'prober' | 'catalog' | 'reports'>('prober');

  // Execution state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<PentestProbeResult | null>(null);
  const [displayedLogs, setDisplayedLogs] = useState<any[]>([]);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Active selected probe object
  const activeProbe = useMemo(() => {
    return VALKYRIE_PROBE_CATALOG.find(p => p.id === selectedProbeId) || VALKYRIE_PROBE_CATALOG[0];
  }, [selectedProbeId]);

  // Update target port when selected probe changes if port matches default
  useEffect(() => {
    setTargetPort(activeProbe.defaultPort);
  }, [activeProbe]);

  // Read URL query params on mount (e.g. ?cve=CVE-2024-6387)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const cveParam = url.searchParams.get('cve');
      if (cveParam) {
        const found = VALKYRIE_PROBE_CATALOG.find(p => p.cveRef.toLowerCase() === cveParam.toLowerCase());
        if (found) {
          setSelectedProbeId(found.id);
        }
      }
    }
  }, []);

  // Filtered probes
  const categories = useMemo(() => {
    const cats = new Set(VALKYRIE_PROBE_CATALOG.map(p => p.probeCategory));
    return ['ALL', ...Array.from(cats)];
  }, []);

  const filteredProbes = useMemo(() => {
    return VALKYRIE_PROBE_CATALOG.filter(probe => {
      const matchesCat = selectedCategory === 'ALL' || probe.probeCategory === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        probe.name.toLowerCase().includes(q) || 
        probe.cveRef.toLowerCase().includes(q) || 
        probe.targetService.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Execute on-demand pentest probe
  const handleExecuteProbe = async () => {
    setIsExecuting(true);
    setDisplayedLogs([]);
    setLastResult(null);

    // Initial starting log
    const startLog = {
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      level: 'INFO',
      message: `[Valkyrie Dispatcher] Initializing socket connection to ${targetHost}:${targetPort}...`
    };
    setDisplayedLogs([startLog]);

    try {
      // Simulate real-time dispatch with live telemetry response
      const res = await fetch('/api/valkyrie/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetHost,
          targetPort,
          targetType,
          probeId: activeProbe.id,
          timeoutMs: 4000
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        // Stream logs progressively
        const fullLogs = data.result.logs;
        for (let i = 0; i < fullLogs.length; i++) {
          await new Promise(r => setTimeout(r, 160));
          setDisplayedLogs(prev => [...prev, fullLogs[i]]);
        }
        setLastResult(data.result);
      } else {
        // Fallback local execution
        const localRes = executeValkyrieProbe({
          targetHost,
          targetPort,
          targetType,
          probeId: activeProbe.id,
          cveRef: activeProbe.cveRef,
          protocol: activeProbe.probeProtocol,
          timeoutMs: 4000
        }, activeProbe);
        setDisplayedLogs(localRes.logs);
        setLastResult(localRes);
      }
    } catch (e) {
      console.warn("API probe network fallback:", e);
      const localRes = executeValkyrieProbe({
        targetHost,
        targetPort,
        targetType,
        probeId: activeProbe.id,
        cveRef: activeProbe.cveRef,
        protocol: activeProbe.probeProtocol,
        timeoutMs: 4000
      }, activeProbe);
      setDisplayedLogs(localRes.logs);
      setLastResult(localRes);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleDownloadReport = () => {
    if (!lastResult) return;
    const reportText = generateExecutivePentestReport(lastResult);
    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${lastResult.scanId}-Valkyrie-Pentest-Report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060A13", color: "#F1F5F9", fontFamily: "var(--font-sans, system-ui, sans-serif)", paddingBottom: "80px" }}>
      
      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section style={{ 
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.22), rgba(139, 92, 246, 0.12), rgba(6, 10, 19, 0))",
        borderBottom: "1px solid rgba(6, 182, 212, 0.25)",
        padding: "48px 24px 32px 24px"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            
            {/* Title & Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ 
                padding: "12px", 
                borderRadius: "20px", 
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(30, 27, 75, 0.6), rgba(15, 23, 42, 0.8))",
                border: "1px solid rgba(6, 182, 212, 0.5)",
                boxShadow: "0 0 35px rgba(6, 182, 212, 0.35), inset 0 0 15px rgba(6, 182, 212, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ValkyrieIcon size={56} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ 
                    fontFamily: "var(--font-display, 'Orbitron', sans-serif)", 
                    fontSize: "2.4rem", 
                    fontWeight: 900, 
                    letterSpacing: "0.08em",
                    background: "linear-gradient(90deg, #FFFFFF 15%, #A5F3FC 55%, #06B6D4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0
                  }}>
                    VALKYRIE
                  </h1>
                  <span style={{ 
                    fontSize: "0.72rem", 
                    fontWeight: 800, 
                    background: "rgba(6, 182, 212, 0.2)", 
                    color: "#67E8F9", 
                    border: "1px solid rgba(6, 182, 212, 0.45)", 
                    padding: "3px 9px", 
                    borderRadius: "6px",
                    letterSpacing: "0.08em"
                  }}>
                    ON-DEMAND PENTEST &amp; BAS
                  </span>
                </div>
                <p style={{ margin: "6px 0 0 0", color: "#94A3B8", fontSize: "1.02rem", maxWidth: "700px" }}>
                  Autonomous breach &amp; attack simulation (BAS) correlated to live Vantage threat telemetry. Validate exploitability against live endpoints or container ranges with non-destructive canaries, generate executive attestation reports, and bridge directly into Praxis hotpatching.
                </p>
              </div>
            </div>

            {/* Quick Trinity Bridges */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <Link 
                href="/app/uvi"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  background: "rgba(139, 92, 246, 0.12)",
                  border: "1px solid rgba(139, 92, 246, 0.35)",
                  color: "#C4B5FD",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
              >
                <VantageIcon size={16} glow={false} />
                <span>Vantage Feed</span>
              </Link>
              <Link 
                href="/app/praxis"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#34D399",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
              >
                <PraxisIcon size={16} glow={false} />
                <span>Praxis Hotpatch</span>
              </Link>
              <Link 
                href="/app/eris"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  color: "#FBBF24",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
              >
                <ErisIcon size={16} glow={false} />
                <span>Eris Chaos Lab</span>
              </Link>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: "10px", marginTop: "2rem" }}>
            <button
              onClick={() => setActiveTab('prober')}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                borderRadius: "10px",
                background: activeTab === 'prober' ? "rgba(6, 182, 212, 0.25)" : "rgba(15, 23, 42, 0.6)",
                border: activeTab === 'prober' ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.1)",
                color: activeTab === 'prober' ? "#FFFFFF" : "#94A3B8",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Activity size={16} color={activeTab === 'prober' ? "#06B6D4" : "#94A3B8"} />
              <span>Interactive Exploit Prober</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                borderRadius: "10px",
                background: activeTab === 'catalog' ? "rgba(6, 182, 212, 0.25)" : "rgba(15, 23, 42, 0.6)",
                border: activeTab === 'catalog' ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.1)",
                color: activeTab === 'catalog' ? "#FFFFFF" : "#94A3B8",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Layers size={16} color={activeTab === 'catalog' ? "#06B6D4" : "#94A3B8"} />
              <span>Probe Vector Library ({VALKYRIE_PROBE_CATALOG.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                borderRadius: "10px",
                background: activeTab === 'reports' ? "rgba(6, 182, 212, 0.25)" : "rgba(15, 23, 42, 0.6)",
                border: activeTab === 'reports' ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.1)",
                color: activeTab === 'reports' ? "#FFFFFF" : "#94A3B8",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <FileText size={16} color={activeTab === 'reports' ? "#06B6D4" : "#94A3B8"} />
              <span>Attestation &amp; Reports</span>
            </button>
          </div>

        </div>
      </section>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────── */}
      <main style={{ maxWidth: "1280px", margin: "2.5rem auto 0 auto", padding: "0 24px" }}>

        {activeTab === 'prober' && (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2rem" }}>
            
            {/* LEFT COLUMN: Vulnerability Selector & Target Config */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              
              {/* STEP 1: Select Vantage Vulnerability */}
              <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "16px",
                padding: "1.5rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ 
                      width: "24px", 
                      height: "24px", 
                      borderRadius: "50%", 
                      background: "#06B6D4", 
                      color: "#030712", 
                      fontWeight: 900, 
                      fontSize: "0.8rem", 
                      display: "grid", 
                      placeItems: "center" 
                    }}>
                      1
                    </span>
                    <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                      Select Vantage Vulnerability
                    </h2>
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                    {filteredProbes.length} Probes Available
                  </span>
                </div>

                {/* Search & Category Filter */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search size={14} color="#64748B" style={{ position: "absolute", left: "10px", top: "11px" }} />
                    <input 
                      type="text"
                      placeholder="Search CVE (e.g. CVE-2024-6387) or service..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px 8px 32px",
                        background: "rgba(30, 41, 59, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "0.85rem",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        fontSize: "0.72rem",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        border: selectedCategory === cat ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.08)",
                        background: selectedCategory === cat ? "rgba(6, 182, 212, 0.2)" : "rgba(30, 41, 59, 0.4)",
                        color: selectedCategory === cat ? "#67E8F9" : "#94A3B8",
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                    >
                      {cat.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>

                {/* Probe List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
                  {filteredProbes.map(probe => {
                    const isSelected = selectedProbeId === probe.id;
                    return (
                      <div
                        key={probe.id}
                        onClick={() => setSelectedProbeId(probe.id)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "10px",
                          background: isSelected ? "rgba(6, 182, 212, 0.15)" : "rgba(30, 41, 59, 0.4)",
                          border: isSelected ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.06)",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 800, color: isSelected ? "#67E8F9" : "#FFFFFF", fontSize: "0.88rem" }}>
                              {probe.cveRef}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                              {probe.name}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "#64748B", marginTop: "2px" }}>
                            {probe.targetService} • {probe.probeCategory}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {probe.cisaKev && (
                            <span style={{ fontSize: "0.68rem", background: "rgba(239, 68, 68, 0.2)", color: "#F87171", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>
                              KEV
                            </span>
                          )}
                          <span style={{ 
                            fontSize: "0.72rem", 
                            fontWeight: 800, 
                            color: probe.cvss >= 9 ? "#F87171" : "#FBBF24",
                            background: "rgba(0,0,0,0.3)",
                            padding: "2px 6px",
                            borderRadius: "4px"
                          }}>
                            {probe.cvss}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* STEP 2: Target & Probe Configuration */}
              <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "16px",
                padding: "1.5rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                  <span style={{ 
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    background: "#06B6D4", 
                    color: "#030712", 
                    fontWeight: 900, 
                    fontSize: "0.8rem", 
                    display: "grid", 
                    placeItems: "center" 
                  }}>
                    2
                  </span>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    Target &amp; Injection Parameter
                  </h2>
                </div>

                {/* Target Type Switcher */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "1.25rem" }}>
                  <button
                    type="button"
                    onClick={() => { setTargetType('simulated_sandbox'); setTargetHost('127.0.0.1'); }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      background: targetType === 'simulated_sandbox' ? "rgba(6, 182, 212, 0.25)" : "rgba(30, 41, 59, 0.5)",
                      border: targetType === 'simulated_sandbox' ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.08)",
                      color: targetType === 'simulated_sandbox' ? "#67E8F9" : "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    ⚡ Safe Simulation
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTargetType('docker_container'); setTargetHost('localhost'); }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      background: targetType === 'docker_container' ? "rgba(6, 182, 212, 0.25)" : "rgba(30, 41, 59, 0.5)",
                      border: targetType === 'docker_container' ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.08)",
                      color: targetType === 'docker_container' ? "#67E8F9" : "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    🐳 Docker / Eris Range
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTargetType('remote_host'); setTargetHost('10.0.4.15'); }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      background: targetType === 'remote_host' ? "rgba(6, 182, 212, 0.25)" : "rgba(30, 41, 59, 0.5)",
                      border: targetType === 'remote_host' ? "1px solid #06B6D4" : "1px solid rgba(255, 255, 255, 0.08)",
                      color: targetType === 'remote_host' ? "#67E8F9" : "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    🌐 Remote Endpoint
                  </button>
                </div>

                {/* Host & Port Inputs */}
                <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "10px", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#94A3B8", display: "block", marginBottom: "4px" }}>
                      Target Host / IP / Domain:
                    </label>
                    <input 
                      type="text"
                      value={targetHost}
                      onChange={(e) => setTargetHost(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "rgba(30, 41, 59, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "0.88rem",
                        fontFamily: "monospace"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#94A3B8", display: "block", marginBottom: "4px" }}>
                      Port:
                    </label>
                    <input 
                      type="number"
                      value={targetPort}
                      onChange={(e) => setTargetPort(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "rgba(30, 41, 59, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "0.88rem",
                        fontFamily: "monospace"
                      }}
                    />
                  </div>
                </div>

                {/* Payload Safe Canary Spec */}
                <div style={{
                  background: "rgba(30, 41, 59, 0.4)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginBottom: "1.25rem"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "#67E8F9", fontWeight: 700, marginBottom: "2px" }}>
                    Safe Exploitability Canary:
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#CBD5E1", lineHeight: 1.4 }}>
                    {activeProbe.safePayloadDescription}
                  </div>
                </div>

                {/* Execute Button */}
                <button
                  type="button"
                  disabled={isExecuting}
                  onClick={handleExecuteProbe}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    background: isExecuting 
                      ? "rgba(6, 182, 212, 0.3)" 
                      : "linear-gradient(135deg, #06B6D4 0%, #0284C7 50%, #4F46E5 100%)",
                    border: "1px solid #67E8F9",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.98rem",
                    cursor: isExecuting ? "wait" : "pointer",
                    boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <ValkyrieIcon size={20} glow={false} />
                  <span>
                    {isExecuting ? "DISPATCHING BAS PENTEST PROBE..." : "DISPATCH VALKYRIE PENTEST PROBE ⚡"}
                  </span>
                </button>

              </div>

            </div>

            {/* RIGHT COLUMN: Execution Console & Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              
              {/* Terminal Execution Console */}
              <div style={{
                background: "#030712",
                border: "1px solid rgba(6, 182, 212, 0.35)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
              }}>
                <div style={{
                  padding: "10px 16px",
                  background: "rgba(15, 23, 42, 0.9)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: "0.78rem", color: "#94A3B8", marginLeft: "6px", fontFamily: "monospace" }}>
                      valkyrie://probe-executor/{activeProbe.cveRef.toLowerCase()}
                    </span>
                  </div>
                  {displayedLogs.length > 0 && (
                    <span style={{ fontSize: "0.7rem", color: "#67E8F9", fontFamily: "monospace" }}>
                      {displayedLogs.length} events logged
                    </span>
                  )}
                </div>

                {/* Console Logs Body */}
                <div style={{
                  padding: "16px",
                  minHeight: "260px",
                  maxHeight: "340px",
                  overflowY: "auto",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                  color: "#E2E8F0"
                }}>
                  {displayedLogs.length === 0 ? (
                    <div style={{ height: "220px", display: "grid", placeItems: "center", color: "#475569", textAlign: "center" }}>
                      <div>
                        <Terminal size={36} color="#334155" style={{ margin: "0 auto 8px auto" }} />
                        <div>Valkyrie probe executor idle.</div>
                        <div style={{ fontSize: "0.74rem" }}>Click "Dispatch Valkyrie Pentest Probe" to begin live audit.</div>
                      </div>
                    </div>
                  ) : (
                    displayedLogs.map((log, idx) => (
                      <div key={idx} style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#64748B", marginRight: "8px" }}>[{log.timestamp}]</span>
                        <span style={{
                          color: log.level === 'CRIT' ? '#F87171' : log.level === 'WARN' ? '#FBBF24' : log.level === 'OK' ? '#34D399' : '#38BDF8',
                          fontWeight: 700,
                          marginRight: "8px"
                        }}>
                          [{log.level}]
                        </span>
                        <span style={{ color: log.level === 'CRIT' ? '#FECACA' : '#E2E8F0' }}>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Assessment Findings Card (Rendered upon probe completion) */}
              {lastResult && (
                <div style={{
                  background: lastResult.status === 'VULNERABLE' 
                    ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)"
                    : lastResult.status === 'DEFENDED'
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)"
                      : "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)",
                  border: lastResult.status === 'VULNERABLE'
                    ? "1px solid rgba(239, 68, 68, 0.5)"
                    : lastResult.status === 'DEFENDED'
                      ? "1px solid rgba(16, 185, 129, 0.5)"
                      : "1px solid rgba(6, 182, 212, 0.5)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: lastResult.status === 'VULNERABLE' 
                    ? "0 0 35px rgba(239, 68, 68, 0.2)"
                    : "0 0 35px rgba(16, 185, 129, 0.2)"
                }}>
                  {/* Status Banner */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {lastResult.status === 'VULNERABLE' ? (
                        <ShieldAlert size={28} color="#EF4444" />
                      ) : (
                        <ShieldCheck size={28} color="#10B981" />
                      )}
                      <div>
                        <div style={{ 
                          fontSize: "1.1rem", 
                          fontWeight: 900, 
                          color: lastResult.status === 'VULNERABLE' ? "#EF4444" : "#10B981",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em"
                        }}>
                          {lastResult.status === 'VULNERABLE' ? "Critical Exposure Confirmed" : "Target Protected / Defended"}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                          Confidence: {lastResult.confidencePercent}% • Roundtrip: {lastResult.latencyMs}ms
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      background: "rgba(0,0,0,0.4)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      color: "#A5F3FC",
                      fontFamily: "monospace"
                    }}>
                      {lastResult.scanId}
                    </span>
                  </div>

                  {/* Evidence Text */}
                  <p style={{ fontSize: "0.85rem", color: "#E2E8F0", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                    {lastResult.vulnerabilityEvidence}
                  </p>

                  {/* Actions Grid */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "1rem" }}>
                    
                    {/* Praxis 1-Click Hotpatch Bridge */}
                    <Link
                      href={lastResult.praxisRemediationLink}
                      style={{
                        flex: 1,
                        minWidth: "180px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "rgba(16, 185, 129, 0.2)",
                        border: "1px solid rgba(16, 185, 129, 0.5)",
                        color: "#34D399",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none"
                      }}
                    >
                      <PraxisIcon size={16} glow={false} />
                      <span>Neutralize in Praxis →</span>
                    </Link>

                    {/* Download Report */}
                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer"
                      }}
                    >
                      <Download size={14} />
                      <span>Pentest Report (.md)</span>
                    </button>

                    {/* Copy CLI Script */}
                    <button
                      type="button"
                      onClick={() => handleCopy(compileValkyrieProbeScript(activeProbe, targetHost, targetPort), 'cli')}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer"
                      }}
                    >
                      {copiedSnippet === 'cli' ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
                      <span>{copiedSnippet === 'cli' ? "Copied Script!" : "Copy CLI"}</span>
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* ── TAB 2: PROBE VECTOR LIBRARY ── */}
        {activeTab === 'catalog' && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
            {VALKYRIE_PROBE_CATALOG.map(probe => (
              <div 
                key={probe.id}
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#67E8F9", fontWeight: 800 }}>
                      {probe.cveRef}
                    </span>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: "2px 0 0 0" }}>
                      {probe.name}
                    </h3>
                  </div>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: probe.cvss >= 9 ? "#F87171" : "#FBBF24",
                    background: "rgba(0,0,0,0.3)",
                    padding: "2px 8px",
                    borderRadius: "6px"
                  }}>
                    CVSS {probe.cvss}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.75rem" }}>
                  <strong>Service:</strong> {probe.targetService} • <strong>Protocol:</strong> {probe.probeProtocol}/{probe.defaultPort}
                </div>

                <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.5, flex: 1, margin: "0 0 1rem 0" }}>
                  {probe.safePayloadDescription}
                </p>

                <div style={{ 
                  background: "rgba(30, 41, 59, 0.5)", 
                  padding: "8px 12px", 
                  borderRadius: "8px", 
                  fontSize: "0.75rem", 
                  color: "#94A3B8", 
                  marginBottom: "1rem" 
                }}>
                  <strong style={{ color: "#34D399" }}>Remediation:</strong> {probe.remediationSummary}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      setSelectedProbeId(probe.id);
                      setActiveTab('prober');
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "rgba(6, 182, 212, 0.2)",
                      border: "1px solid rgba(6, 182, 212, 0.4)",
                      color: "#67E8F9",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer"
                    }}
                  >
                    Launch in Prober →
                  </button>
                  <Link
                    href={`/app/praxis?cve=${encodeURIComponent(probe.cveRef)}`}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(16, 185, 129, 0.35)",
                      color: "#34D399",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <PraxisIcon size={14} glow={false} />
                    <span>Hotpatch</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 3: REPORTS & AUDIT ── */}
        {activeTab === 'reports' && (
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem"
          }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
              Valkyrie Pentest Attestation Registry
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", margin: "0 0 1.5rem 0" }}>
              Every penetration test probe generates an immutable cryptographic attestation hash verifying test timestamps, tested CVEs, and exploitability conclusions for SOC2, ISO 27001, and federal compliance audits.
            </p>

            {lastResult ? (
              <div style={{
                background: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(6, 182, 212, 0.3)",
                borderRadius: "12px",
                padding: "1.25rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#67E8F9", fontFamily: "monospace" }}>
                      {lastResult.scanId}
                    </span>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: "2px 0 0 0" }}>
                      {lastResult.probe.name} ({lastResult.probe.cveRef})
                    </h3>
                  </div>
                  <button
                    onClick={handleDownloadReport}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      background: "#06B6D4",
                      color: "#030712",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <Download size={14} />
                    <span>Download Attestation Report (.md)</span>
                  </button>
                </div>

                <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#A5F3FC", background: "rgba(0,0,0,0.4)", padding: "10px", borderRadius: "8px" }}>
                  <strong>Attestation Signature:</strong> {lastResult.attestationHash}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
                <FileText size={42} style={{ margin: "0 auto 12px auto", opacity: 0.5 }} />
                <div>No pentest attestation reports generated in this active session.</div>
                <div style={{ fontSize: "0.82rem", marginTop: "4px" }}>
                  Run a probe from the <strong style={{ color: "#67E8F9" }}>Interactive Exploit Prober</strong> tab to generate your first attestation.
                </div>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
