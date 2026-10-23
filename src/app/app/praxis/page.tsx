'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldAlert, 
  Zap, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Server, 
  Cpu, 
  Layers, 
  GitFork, 
  Flame, 
  ArrowRight, 
  Lock, 
  RotateCcw,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Code2,
  FileCheck2,
  Activity,
  Search,
  Filter,
  Package,
  Wrench,
  Ban,
  Radio,
  Sliders,
  Play
} from 'lucide-react';
import { PraxisIcon, VantageIcon } from '@/components/BrandIcons';
import { SAMPLE_PATCH_FEED, type PatchFeedItem } from '@/lib/patch-data';

const REMEDIATION_CLASSES = [
  {
    id: 'network',
    icon: '🛡️',
    title: 'IP/Network Blocking',
    description: 'Block inbound connections from C2, botnet, and IP reputation indicators via OS firewall rules.',
  },
  {
    id: 'config',
    icon: '⚙️',
    title: 'Configuration Management',
    description: 'Harden baseline OS configuration, lock default accounts, and enforce password policy based on CVE exposure.',
  },
  {
    id: 'service',
    icon: '🔌',
    title: 'Service & Process Isolation',
    description: 'Halt insecure legacy subsystems: telnet, rpcbind, and exposed daemons mapped to active advisories.',
  },
  {
    id: 'phishing',
    icon: '🎣',
    title: 'Phishing & Domain Blocking',
    description: 'Block known phishing domains and fraud URLs at the hosts file level from the Vantage PHISHING_FRAUD indicators.',
  },
  {
    id: 'kev',
    icon: '🚨',
    title: 'CISA KEV Priority Patches',
    description: 'Apply remediations for all vulnerabilities on the CISA Known Exploited Vulnerabilities catalog.',
  },
];

const OS_OPTIONS = [
  { value: 'linux',   label: 'Linux (Generic)' },
  { value: 'rpi',     label: 'Raspberry Pi (Raspbian)' },
  { value: 'aix',     label: 'IBM AIX' },
  { value: 'hpux',    label: 'HP-UX' },
  { value: 'solaris', label: 'Oracle Solaris' },
];

const FIREWALL_FORMATS = [
  { value: 'plain',    label: 'Plain IP/Domain List (universal)' },
  { value: 'json',     label: 'JSON (structured, API-ready)' },
  { value: 'cisco',    label: 'Cisco IOS ACL' },
  { value: 'paloalto', label: 'Palo Alto EDL (External Dynamic List)' },
  { value: 'fortinet', label: 'Fortinet Address Group' },
  { value: 'juniper',  label: 'Juniper SRX filter' },
];

type HotpatchConceptTab = 'velocity' | 'canary' | 'slsa' | 'matrix' | 'implement' | 'wiki';

export default function PraxisPage() {
  const { user, openAuthModal } = useAuth();

  // Top-Level Operational Mode: Hotpatch Stream vs. Firewall & Baseline Hardening
  const [activeMode, setActiveMode] = useState<'hotpatch' | 'hardening'>('hotpatch');

  // ── HOTPATCH MODE STATE (Consolidated from Kinetic) ──
  const [activeConcept, setActiveConcept] = useState<HotpatchConceptTab>('velocity');
  const [selectedPatch, setSelectedPatch] = useState<PatchFeedItem>(SAMPLE_PATCH_FEED[0]);
  const [selectedPayloadTab, setSelectedPayloadTab] = useState<'tier1' | 'tier2' | 'tier3' | 'rawJson'>('tier1');
  const [activeImplementTab, setActiveImplementTab] = useState<'systemd' | 'gitops' | 'ansible' | 'agent'>('systemd');
  const [selectedDistro, setSelectedDistro] = useState<'all' | 'ubuntu' | 'rocky' | 'alpine'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationDone, setSimulationDone] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationDone(false);
    setSimulationProgress(5);
    setSimulationLogs([
      `[${new Date().toISOString()}] [INIT] Connecting to Praxis Hotpatch Stream: ${selectedPatch.id}...`,
      `[TARGET] Vulnerability: ${selectedPatch.cveId} - ${selectedPatch.title}`,
      `[FLEET] Target inventory: 640 hybrid hosts (240 Ubuntu 24.04, 200 Rocky 9, 200 Alpine Containers)`
    ]);

    const steps = [
      {
        delay: 800,
        progress: 25,
        log: `[RING 0 CANARY] Staging 12 canary nodes (2.0% slice). Deploying Tier 1 Hot-Mitigation...`
      },
      {
        delay: 1600,
        progress: 45,
        log: `[APPLY] Executed: ${selectedPatch.remediationTier.tier1_hotMitigation.commands[0]}`
      },
      {
        delay: 2400,
        progress: 65,
        log: `[SENTINEL TELEMETRY] Verification check: "${selectedPatch.remediationTier.tier1_hotMitigation.verificationCommand}" -> OK`
      },
      {
        delay: 3200,
        progress: 80,
        log: `[SENTINEL TELEMETRY] Error rate: 0.00% | Latency delta: +0.1ms | Services: 100% HEALTHY. Promoting to Ring 1...`
      },
      {
        delay: 4000,
        progress: 100,
        log: `[COMPLETED] Fleet synchronized in 4.2s. 640/640 hosts hardened. Zero reboots required.`
      }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, step.log]);
        setSimulationProgress(step.progress);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
          setSimulationDone(true);
        }
      }, step.delay);
    });
  };

  const filteredPatches = selectedDistro === 'all' 
    ? SAMPLE_PATCH_FEED 
    : SAMPLE_PATCH_FEED.filter(p => p.affectedDistros.includes(selectedDistro as any));

  // ── HARDENING / GENERATOR MODE STATE ──
  const [os, setOs] = useState('linux');
  const [cron, setCron] = useState(false);
  const [proxy, setProxy] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set(['network']));
  const [networkMode, setNetworkMode] = useState<'localhost' | 'export'>('localhost');
  const [firewallFormat, setFirewallFormat] = useState('plain');
  const [filenamePattern, setFilenamePattern] = useState('');
  const [customShebang, setCustomShebang] = useState('#!/bin/sh');

  const [ready, setReady] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://exultia.tech');
  const [previewScript, setPreviewScript] = useState('');
  const [threatCount, setThreatCount] = useState<number>(0);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [savedProfiles, setSavedProfiles] = useState<Record<string, any>>({});
  const [profileNameInput, setProfileNameInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const loaded = localStorage.getItem('praxis_saved_profiles');
    if (loaded) {
      try {
        setSavedProfiles(JSON.parse(loaded));
      } catch (e) {}
    }
    setReady(true);
  }, []);

  const saveProfile = () => {
    if (!profileNameInput.trim()) return;
    const newProfiles = {
      ...savedProfiles,
      [profileNameInput]: { os, cron, proxy, selectedClasses: Array.from(selectedClasses), networkMode, firewallFormat, filenamePattern, customShebang }
    };
    setSavedProfiles(newProfiles);
    localStorage.setItem('praxis_saved_profiles', JSON.stringify(newProfiles));
    setProfileNameInput('');
    setIsSavingProfile(false);
  };

  const loadProfile = (name: string) => {
    const profile = savedProfiles[name];
    if (profile) {
      setOs(profile.os);
      setCron(profile.cron);
      setProxy(profile.proxy);
      setSelectedClasses(new Set(profile.selectedClasses));
      setNetworkMode(profile.networkMode);
      setFirewallFormat(profile.firewallFormat);
      setFilenamePattern(profile.filenamePattern);
      setCustomShebang(profile.customShebang);
    }
  };

  const hasNetworkClass = selectedClasses.has('network') || selectedClasses.has('phishing');

  // Fetch preview when generator settings change
  useEffect(() => {
    if (!ready || activeMode !== 'hardening') return;
    let cancelled = false;

    const fetchPreview = async () => {
      setPreviewLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/praxis/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            os, cron, proxy,
            preview: true,
            classes: Array.from(selectedClasses),
            networkMode, firewallFormat, filenamePattern, customShebang
          }),
        });
        const data = await res.json();
        if (!cancelled) {
          setPreviewScript(data.script ?? '');
          setThreatCount(data.threatCount ?? 0);
          setGeneratedId(null);
        }
      } catch {
        if (!cancelled) setPreviewScript('# Error generating preview.');
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };

    fetchPreview();
    return () => { cancelled = true; };
  }, [ready, os, cron, proxy, selectedClasses, networkMode, firewallFormat, filenamePattern, customShebang, baseUrl, activeMode]);

  const handleGenerate = async () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch(`${baseUrl}/api/praxis/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          os, cron, proxy,
          preview: false,
          classes: Array.from(selectedClasses),
          networkMode, firewallFormat, filenamePattern, customShebang
        }),
      });
      const data = await res.json();
      setGeneratedId(data.id);
      setCopied(false);
    } finally {
      setGenerating(false);
    }
  };

  const toggleClass = (id: string) => {
    setSelectedClasses(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const hardeningCommand = generatedId
    ? filenamePattern
      ? `curl -sL -O -J "${baseUrl}/api/praxis/download?id=${generatedId}"`
      : `curl -sL "${baseUrl}/api/praxis/download?id=${generatedId}" | sh`
    : '';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem', color: '#F8FAFC' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.35rem' }}>
            <PraxisIcon size={36} glow={true} />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#F8FAFC', lineHeight: 1.2 }}>
              Praxis
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', margin: 0 }}>
            Autonomous remediation &amp; hardening engine
          </p>
        </div>
        <Link
          href="/account/subscription?product=praxis"
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#FBBF24',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '8px',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          Plans
        </Link>
      </div>

      {/* Mode switcher */}
      <div style={{
        display: 'inline-flex',
        gap: '4px',
        padding: '4px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        marginBottom: '1.75rem'
      }}>
        <button
          onClick={() => setActiveMode('hotpatch')}
          style={{
            padding: '9px 18px',
            borderRadius: '9px',
            border: 'none',
            cursor: 'pointer',
            background: activeMode === 'hotpatch' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'transparent',
            color: activeMode === 'hotpatch' ? '#000000' : '#94A3B8',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}
        >
          Hotpatching
        </button>
        <button
          onClick={() => setActiveMode('hardening')}
          style={{
            padding: '9px 18px',
            borderRadius: '9px',
            border: 'none',
            cursor: 'pointer',
            background: activeMode === 'hardening' ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
            color: activeMode === 'hardening' ? '#000000' : '#94A3B8',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}
        >
          Firewall &amp; Hardening
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MODE 1: AUTONOMOUS HOTPATCHING & CANARY STREAM
          ═══════════════════════════════════════════════════════════════════ */}
      {activeMode === 'hotpatch' && (
        <div>
          {/* INTERACTIVE CANARY SIMULATOR */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.25)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Play size={18} color="#FBBF24" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                    Live Canary Rollout Simulator
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                  Simulate deploying {selectedPatch.cveId} ({selectedPatch.title}) across a 640-host hybrid fleet.
                </p>
              </div>

              <button
                onClick={runSimulation}
                disabled={isSimulating}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isSimulating ? 'rgba(245, 158, 11, 0.3)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isSimulating ? 'not-allowed' : 'pointer'
                }}
              >
                {isSimulating ? <Activity size={16} className="spin" /> : <Play size={16} />}
                <span>{isSimulating ? 'Simulating Rollout...' : simulationDone ? 'Re-Run Simulation' : 'Execute Ring 0 Canary'}</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ width: `${simulationProgress}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #10B981)', transition: 'width 0.3s ease' }} />
            </div>

            {/* Terminal Simulation Log Output */}
            <div style={{
              background: '#05070D',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.78rem',
              color: '#34D399',
              minHeight: '120px',
              maxHeight: '180px',
              overflowY: 'auto',
              lineHeight: 1.55
            }}>
              {simulationLogs.length === 0 ? (
                <span style={{ color: '#64748B' }}>// Click "Execute Ring 0 Canary" above to trigger simulated fleet hot-patching.</span>
              ) : (
                simulationLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))
              )}
            </div>
          </div>

          {/* PATCH BROWSER & PAYLOAD INSPECTOR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left: Patch Feed Selector */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>Active Hotpatch Stream</h4>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['all', 'ubuntu', 'rocky', 'alpine'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDistro(d)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: selectedDistro === d ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.06)',
                        background: selectedDistro === d ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                        color: selectedDistro === d ? '#FBBF24' : '#94A3B8',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredPatches.map(patch => {
                  const isSelected = selectedPatch.id === patch.id;
                  return (
                    <div
                      key={patch.id}
                      onClick={() => setSelectedPatch(patch)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.05)',
                        background: isSelected ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38BDF8' }}>{patch.cveId}</span>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '3px',
                          background: patch.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: patch.severity === 'CRITICAL' ? '#F87171' : '#FBBF24',
                          border: patch.severity === 'CRITICAL' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                        }}>
                          {patch.severity} {patch.cvss}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#E2E8F0', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {patch.title}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem', color: '#94A3B8' }}>
                        <span>Target: {patch.affectedPackages.join(', ')}</span>
                        <span>&bull;</span>
                        <span>SLSA L{patch.provenance.slsaLevel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Patch Payload Viewer */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>{selectedPatch.cveId}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({selectedPatch.affectedPackages.join(', ')})</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#CBD5E1', fontWeight: 500 }}>{selectedPatch.title}</div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedPayloadTab('tier1')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: selectedPayloadTab === 'tier1' ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                      background: selectedPayloadTab === 'tier1' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: selectedPayloadTab === 'tier1' ? '#34D399' : '#94A3B8',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Tier 1 (Hotfix)
                  </button>
                  <button
                    onClick={() => setSelectedPayloadTab('tier2')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: selectedPayloadTab === 'tier2' ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.08)',
                      background: selectedPayloadTab === 'tier2' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      color: selectedPayloadTab === 'tier2' ? '#38BDF8' : '#94A3B8',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Tier 2 (Kernel Live)
                  </button>
                  <button
                    onClick={() => setSelectedPayloadTab('tier3')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: selectedPayloadTab === 'tier3' ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.08)',
                      background: selectedPayloadTab === 'tier3' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                      color: selectedPayloadTab === 'tier3' ? '#C084FC' : '#94A3B8',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Tier 3 (Package)
                  </button>
                  <button
                    onClick={() => setSelectedPayloadTab('rawJson')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: selectedPayloadTab === 'rawJson' ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.08)',
                      background: selectedPayloadTab === 'rawJson' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                      color: selectedPayloadTab === 'rawJson' ? '#FBBF24' : '#94A3B8',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Raw JSON
                  </button>
                </div>
              </div>

              {/* Payload Content Area */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    const text = selectedPayloadTab === 'tier1'
                      ? selectedPatch.remediationTier.tier1_hotMitigation.commands.join('\n')
                      : selectedPayloadTab === 'rawJson'
                      ? JSON.stringify(selectedPatch, null, 2)
                      : selectedPayloadTab === 'tier2'
                      ? Object.entries(selectedPatch.remediationTier.tier2_packageUpgrade.distroCommands).map(([d, c]) => `# ${d.toUpperCase()}:\n${c}`).join('\n\n')
                      : selectedPatch.remediationTier.tier3_fleetAutomation.ansiblePlaybook;
                    copyToClipboard(text, 'payload');
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#CBD5E1',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedText === 'payload' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                  <span>{copiedText === 'payload' ? 'Copied' : 'Copy'}</span>
                </button>

                <pre style={{
                  background: '#05070D',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.8rem',
                  color: selectedPayloadTab === 'tier1' ? '#34D399' : selectedPayloadTab === 'tier2' ? '#38BDF8' : '#FBBF24',
                  overflowX: 'auto',
                  lineHeight: 1.5,
                  minHeight: '200px'
                }}>
                  {selectedPayloadTab === 'tier1' && (
                    `# Tier 1 Zero-Downtime Hotfix for ${selectedPatch.cveId}\n# Summary: ${selectedPatch.remediationTier.tier1_hotMitigation.summary}\n\n${selectedPatch.remediationTier.tier1_hotMitigation.commands.join('\n')}\n\n# Verification:\n${selectedPatch.remediationTier.tier1_hotMitigation.verificationCommand}\n\n# Rollback (Sub-Second):\n${selectedPatch.remediationTier.tier1_hotMitigation.rollbackCommand}`
                  )}
                  {selectedPayloadTab === 'tier2' && (
                    `# Tier 2 Distro Native Package Upgrades for ${selectedPatch.cveId}\n# Target Distros: ${selectedPatch.affectedDistros.join(', ')}\n\n${Object.entries(selectedPatch.remediationTier.tier2_packageUpgrade.distroCommands).map(([d, c]) => `# ${d.toUpperCase()}:\n${c}`).join('\n\n')}`
                  )}
                  {selectedPayloadTab === 'tier3' && (
                    `# Tier 3 Fleet Automation Ansible Playbook for ${selectedPatch.cveId}\n\n${selectedPatch.remediationTier.tier3_fleetAutomation.ansiblePlaybook}`
                  )}
                  {selectedPayloadTab === 'rawJson' && (
                    JSON.stringify(selectedPatch, null, 2)
                  )}
                </pre>
              </div>

              {/* Provenance Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.74rem', color: '#94A3B8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#10B981" />
                  <span>SLSA Level {selectedPatch.provenance.slsaLevel} Attested</span>
                </div>
                <span>Cosign Digest: {selectedPatch.provenance.cosignDigest.slice(0, 20)}...</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODE 2: FIREWALL ACLs & BASELINE HARDENING COMPILER
          ═══════════════════════════════════════════════════════════════════ */}
      {activeMode === 'hardening' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '2rem' }}>
          
          {/* LEFT: Configuration Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Profile Management Box */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#CBD5E1' }}>
                  Saved Hardening Profiles
                </span>
                <button
                  onClick={() => setIsSavingProfile(true)}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34D399',
                    padding: '3px 9px',
                    borderRadius: '5px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + Save Current
                </button>
              </div>

              {isSavingProfile && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Profile name (e.g. Edge DMZ Gateway)"
                    value={profileNameInput}
                    onChange={(e) => setProfileNameInput(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.82rem' }}
                  />
                  <button onClick={saveProfile} style={{ padding: '6px 12px', borderRadius: '6px', background: '#10B981', color: '#000', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setIsSavingProfile(false)} style={{ padding: '6px 10px', borderRadius: '6px', background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Cancel</button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {Object.keys(savedProfiles).length === 0 ? (
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>No saved profiles yet. Configure settings below and click "+ Save Current".</span>
                ) : (
                  Object.keys(savedProfiles).map(p => (
                    <button
                      key={p}
                      onClick={() => loadProfile(p)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#CBD5E1',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {p}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Target OS & Distribution */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#CBD5E1', marginBottom: '0.75rem' }}>
                Target OS Architecture
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {OS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setOs(opt.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: os === opt.value ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                      background: os === opt.value ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                      color: os === opt.value ? '#34D399' : '#CBD5E1',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Remediation Modules */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#CBD5E1', marginBottom: '0.75rem' }}>
                Active Remediation Modules
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REMEDIATION_CLASSES.map(cls => {
                  const isChecked = selectedClasses.has(cls.id);
                  return (
                    <div
                      key={cls.id}
                      onClick={() => toggleClass(cls.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: isChecked ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                        background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{cls.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isChecked ? '#34D399' : '#FFFFFF' }}>{cls.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px', lineHeight: 1.4 }}>{cls.description}</div>
                      </div>
                      <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ accentColor: '#10B981', cursor: 'pointer', marginTop: '3px' }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hardware Firewall Exporters (if network class active) */}
            {hasNetworkClass && (
              <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#CBD5E1', marginBottom: '0.75rem' }}>
                  Hardware Firewall &amp; Export Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {FIREWALL_FORMATS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setFirewallFormat(f.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: firewallFormat === f.value ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.08)',
                        background: firewallFormat === f.value ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: firewallFormat === f.value ? '#38BDF8' : '#CBD5E1',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cron & Automation */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Install Hourly Cron Job</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Runs script periodically via /etc/cron.hourly for continuous hardening</div>
              </div>
              <input
                type="checkbox"
                checked={cron}
                onChange={(e) => setCron(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
              />
            </div>

          </div>

          {/* RIGHT: Live Script Preview & Single-Use Command */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={18} color="#10B981" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>Hardening Script Preview</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
                  {threatCount} Vantage Indicators Ingested
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <pre style={{
                  background: '#05070D',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.78rem',
                  color: '#34D399',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  lineHeight: 1.55
                }}>
                  {previewLoading ? '// Synthesizing baseline hardening script from Vantage...' : previewScript}
                </pre>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#000000',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    padding: '11px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: generating ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Zap size={16} />
                  <span>{generating ? 'Generating Link...' : 'Generate Single-Use Deployment Link'}</span>
                </button>
              </div>
            </div>

            {/* Generated Deployment Command */}
            {generatedId && (
              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      One-Time Shell Execution Command
                    </span>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(hardeningCommand); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '5px',
                      border: 'none',
                      background: copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)',
                      color: copied ? '#34D399' : '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                <div style={{ background: '#05070D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: '#38BDF8', wordBreak: 'break-all' }}>
                  {hardeningCommand}
                </div>

                <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '10px 0 0 0' }}>
                  ⚠ Single-use security token. Once downloaded by the target host, this link is permanently deleted from the Exultia cache.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
