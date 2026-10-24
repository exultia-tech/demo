'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Play,
  Shield,
  FileCode,
  Download,
  X
} from 'lucide-react';
import { PraxisIcon, VantageIcon } from '@/components/BrandIcons';
import { SAMPLE_PATCH_FEED, type PatchFeedItem } from '@/lib/patch-data';
import { 
  generateAfterActionCbom, 
  generateCbomShellScriptBlock, 
  convertAdvisoryToPatchItem, 
  type PraxisCbomPayload 
} from '@/lib/praxis-cbom';

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
    description: 'Block known phishing domains and fraud URLs at the hosts file level from Vantage PHISHING_FRAUD indicators.',
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
  { value: 'paloalto', label: 'Palo Alto EDL' },
  { value: 'fortinet', label: 'Fortinet Address Group' },
  { value: 'juniper',  label: 'Juniper SRX filter' },
];

const CANARY_SLICES = [
  { percent: 2,  label: '2% Canary (12 hosts)' },
  { percent: 5,  label: '5% Canary (32 hosts)' },
  { percent: 10, label: '10% Canary (64 hosts)' },
  { percent: 25, label: '25% Ring 1 (160 hosts)' },
];

const DISTRO_OPTIONS = [
  { value: 'all',    label: 'All Platforms' },
  { value: 'ubuntu', label: 'Ubuntu' },
  { value: 'rocky',  label: 'Rocky Linux' },
  { value: 'alpine', label: 'Alpine' },
  { value: 'debian', label: 'Debian' },
  { value: 'rhel',   label: 'RHEL' }
];

export default function PraxisPage() {
  const { user, openAuthModal } = useAuth();

  // Dual Control Operational Mode: Patching vs. Remediation vs. Both (unified)
  const [praxisMode, setPraxisMode] = useState<'patching' | 'remediation' | 'both'>('patching');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ── TARGETED VANTAGE FINDINGS INGESTED INTO PRAXIS FLOW ──
  const [targetedVantageEntries, setTargetedVantageEntries] = useState<any[]>([]);

  // ── AFTER-ACTION CBOM STATE ──
  const [cbomModalOpen, setCbomModalOpen] = useState(false);
  const [activeCbomPayload, setActiveCbomPayload] = useState<PraxisCbomPayload | null>(null);

  // ── PERDITION CHAOS INOCULATION BRIDGING STATE ──
  const [isPerditionActive, setIsPerditionActive] = useState(false);

  // ── PATCHING MODE STATE ──
  const [patchSearchQuery, setPatchSearchQuery] = useState('');
  const [selectedDistro, setSelectedDistro] = useState<'all' | 'ubuntu' | 'rocky' | 'alpine' | 'debian' | 'rhel'>('all');
  const [selectedPayloadTab, setSelectedPayloadTab] = useState<'tier1' | 'tier2' | 'tier3' | 'cbom' | 'rawJson'>('tier1');
  const [selectedPatch, setSelectedPatch] = useState<PatchFeedItem>(SAMPLE_PATCH_FEED[0]);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'CRITICAL' | 'HIGH'>('all');
  const [canarySlice, setCanarySlice] = useState<number>(2);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Canary Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationDone, setSimulationDone] = useState(false);

  // ── REMEDIATION / HARDENING MODE STATE ──
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

  // Load Saved Profiles & Ingest Selected Vantage Entries on Mount
  useEffect(() => {
    setBaseUrl(window.location.origin);
    const loadedProfiles = localStorage.getItem('praxis_saved_profiles');
    if (loadedProfiles) {
      try {
        setSavedProfiles(JSON.parse(loadedProfiles));
      } catch (e) {}
    }

    // Ingest Selected Vantage Findings from localStorage or URL query
    let entries: any[] = [];
    const savedEntries = localStorage.getItem('praxis_selected_entries');
    if (savedEntries) {
      try {
        entries = JSON.parse(savedEntries);
      } catch (e) {}
    }

    const params = new URLSearchParams(window.location.search);
    const uviParam = params.get('uviIds');
    if (uviParam) {
      const ids = uviParam.split(',').map(s => s.trim()).filter(Boolean);
      if (ids.length > 0) {
        // If we don't have matching objects from storage, seed placeholders
        for (const id of ids) {
          if (!entries.some(e => e.uviId === id)) {
            entries.push({
              uviId: id,
              cveId: id,
              title: `Targeted Advisory ${id} (Vantage Ingestion)`,
              severity: 'HIGH',
              cvssScore: 8.5,
              affectedPackages: ['system-runtime'],
              affectedDistros: ['ubuntu', 'debian', 'rocky', 'alpine'],
              remediation: { recommendedAction: 'Apply Vendor Errata & OS Baseline Hardening' }
            });
          }
        }
      }
    }

    if (entries.length > 0) {
      setTargetedVantageEntries(entries);
      const convertedPatch = convertAdvisoryToPatchItem(entries[0]);
      setSelectedPatch(convertedPatch);
    }

    // Ingest Perdition / Crucible Chaos Inoculation Remediation Flag
    const perditionParam = params.get('perditionRemediate') || params.get('crucibleRemediate');
    if (perditionParam === 'true') {
      setPraxisMode('both');
      setSelectedClasses(new Set(['network', 'config', 'service', 'phishing', 'kev']));
      setIsPerditionActive(true);
    }

    setReady(true);
  }, []);

  const removeTargetedEntry = (uviId: string) => {
    const updated = targetedVantageEntries.filter(e => e.uviId !== uviId);
    setTargetedVantageEntries(updated);
    localStorage.setItem('praxis_selected_entries', JSON.stringify(updated));
    if (updated.length > 0) {
      setSelectedPatch(convertAdvisoryToPatchItem(updated[0]));
    }
  };

  const clearTargetedEntries = () => {
    setTargetedVantageEntries([]);
    localStorage.removeItem('praxis_selected_entries');
  };

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

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Download CBOM JSON helper
  const downloadCbomJson = (cbom: any) => {
    const blob = new Blob([JSON.stringify(cbom, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `praxis-cbom-after-action-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Canary Simulation Runner with After-Action CBOM Attestation
  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationDone(false);
    setSimulationProgress(5);
    const stagedCanaryNodes = Math.max(1, Math.round(640 * (canarySlice / 100)));
    setSimulationLogs([
      `[${new Date().toISOString()}] [INIT] Connecting to Praxis Hotpatch Stream: ${selectedPatch.id}...`,
      `[TARGET] Vulnerability: ${selectedPatch.cveId} - ${selectedPatch.title}`,
      `[FLEET] Target inventory: 640 hybrid hosts (240 Ubuntu 24.04, 200 Rocky 9, 200 Alpine Containers)`
    ]);

    const steps = [
      {
        delay: 800,
        progress: 20,
        log: `[RING 0 CANARY] Staging ${stagedCanaryNodes} canary nodes (${canarySlice}% slice). Deploying Tier 1 Hot-Mitigation...`
      },
      {
        delay: 1500,
        progress: 40,
        log: `[APPLY] Executed: ${selectedPatch.remediationTier.tier1_hotMitigation.commands[0]}`
      },
      {
        delay: 2200,
        progress: 60,
        log: `[SENTINEL TELEMETRY] Verification check: "${selectedPatch.remediationTier.tier1_hotMitigation.verificationCommand}" -> OK`
      },
      {
        delay: 3000,
        progress: 80,
        log: `[CBOM ATTESTATION] Synthesizing After-Action Cybersecurity Bill of Materials (CycloneDX-CBOM v1.5)...`
      },
      {
        delay: 3800,
        progress: 100,
        log: `[COMPLETED] Fleet synchronized in 3.8s. After-Action CBOM codified at /var/log/exultia/praxis-cbom-after-action.json (Zero reboots).`
      }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, step.log]);
        setSimulationProgress(step.progress);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
          setSimulationDone(true);
          // Generate Patch-specific After-Action CBOM
          const patchCbom = generateAfterActionCbom({
            os,
            executionType: 'patching',
            selectedPatch,
            advisories: targetedVantageEntries
          });
          setActiveCbomPayload(patchCbom);
        }
      }, step.delay);
    });
  };

  // Filtered patches for browser (incorporating targeted Vantage findings)
  const filteredPatches = useMemo(() => {
    const convertedTargeted = targetedVantageEntries.map(e => ({
      ...convertAdvisoryToPatchItem(e),
      isTargeted: true
    }));

    const base = [
      ...convertedTargeted,
      ...SAMPLE_PATCH_FEED.filter(p => !convertedTargeted.some(ct => ct.cveId === p.cveId || ct.id === p.id))
    ];

    return base.filter(p => {
      const matchDistro = selectedDistro === 'all' || p.affectedDistros.includes(selectedDistro as any);
      const matchSeverity = severityFilter === 'all' || p.severity === severityFilter;
      const q = patchSearchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        p.cveId.toLowerCase().includes(q) || 
        p.title.toLowerCase().includes(q) || 
        p.affectedPackages.some(pkg => pkg.toLowerCase().includes(q));
      return matchDistro && matchSeverity && matchSearch;
    });
  }, [selectedDistro, severityFilter, patchSearchQuery, targetedVantageEntries]);

  // Fetch preview when generator settings change (runs in remediation & both modes)
  useEffect(() => {
    if (!ready || praxisMode === 'patching') return;
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
            networkMode, firewallFormat, filenamePattern, customShebang,
            uviIds: targetedVantageEntries.map(e => e.uviId),
            specificAdvisories: targetedVantageEntries
          }),
        });
        const data = await res.json();
        if (!cancelled) {
          setPreviewScript(data.script ?? '');
          setThreatCount(data.threatCount ?? 0);
          if (data.cbom) {
            setActiveCbomPayload(data.cbom);
          }
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
  }, [ready, os, cron, proxy, selectedClasses, networkMode, firewallFormat, filenamePattern, customShebang, baseUrl, praxisMode, targetedVantageEntries]);

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
          networkMode, firewallFormat, filenamePattern, customShebang,
          uviIds: targetedVantageEntries.map(e => e.uviId),
          specificAdvisories: targetedVantageEntries
        }),
      });
      const data = await res.json();
      setGeneratedId(data.id);
      if (data.cbom) {
        setActiveCbomPayload(data.cbom);
      }
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

  // Current computed CBOM payload for the active patch in Patching mode
  const currentPatchCbom = useMemo(() => {
    return generateAfterActionCbom({
      os,
      executionType: 'patching',
      selectedPatch,
      advisories: targetedVantageEntries
    });
  }, [os, selectedPatch, targetedVantageEntries]);

  return (
    <div style={{ maxWidth: '1680px', margin: '0 auto', padding: '1.25rem 1.5rem 2.5rem', color: '#F8FAFC' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.25rem' }}>
            <PraxisIcon size={34} glow={true} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#F8FAFC', lineHeight: 1.2 }}>
              Praxis
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0 }}>
            Autonomous remediation &amp; hardening engine
          </p>
        </div>

        {/* Action Controls: CBOM Payload Trigger & Mode Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (!activeCbomPayload) {
                setActiveCbomPayload(currentPatchCbom);
              }
              setCbomModalOpen(true);
            }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            title="Inspect After-Action Cybersecurity Bill of Materials"
          >
            <FileCode size={14} />
            <span>After-Action CBOM</span>
          </button>

          <div style={{
            fontSize: '0.76rem',
            fontWeight: 700,
            padding: '0.35rem 0.8rem',
            borderRadius: '8px',
            background: praxisMode === 'patching'
              ? 'rgba(245, 158, 11, 0.15)'
              : praxisMode === 'remediation'
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(59, 130, 246, 0.15)',
            color: praxisMode === 'patching'
              ? '#FBBF24'
              : praxisMode === 'remediation'
              ? '#34D399'
              : '#93C5FD',
            border: `1px solid ${praxisMode === 'patching' ? 'rgba(245, 158, 11, 0.35)' : praxisMode === 'remediation' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(59, 130, 246, 0.35)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: praxisMode === 'patching' ? '#F59E0B' : praxisMode === 'remediation' ? '#10B981' : '#3B82F6',
              boxShadow: `0 0 8px ${praxisMode === 'patching' ? '#F59E0B' : praxisMode === 'remediation' ? '#10B981' : '#3B82F6'}`
            }} />
            <span>
              {praxisMode === 'patching' ? 'Hotpatch Stream & Rollout' : praxisMode === 'remediation' ? 'Baseline Hardening & Firewall' : 'Dual Fleet Defense (Unified)'}
            </span>
          </div>
        </div>
      </div>

      {/* TARGETED VANTAGE FINDINGS STRIP (When entries are sent from Vantage) */}
      {targetedVantageEntries.length > 0 && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          padding: '0.65rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.9rem' }}>🎯</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Targeted Vantage Findings ({targetedVantageEntries.length}):
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {targetedVantageEntries.map(entry => {
                const cve = entry.cveList?.[0] || entry.cveId || entry.uviId;
                const isSelected = selectedPatch.cveId === cve || selectedPatch.id.includes(entry.uviId);
                return (
                  <div
                    key={entry.uviId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isSelected ? '#F8FAFC' : '#CBD5E1',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedPatch(convertAdvisoryToPatchItem(entry));
                    }}
                    title={`Click to focus: ${entry.title}`}
                  >
                    <span>{entry.uviId}</span>
                    <span style={{ color: '#93C5FD' }}>({cve})</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTargetedEntry(entry.uviId);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '0.75rem',
                        lineHeight: 1
                      }}
                      title="Remove from target flow"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Link
              href="/app/uvi"
              style={{
                fontSize: '0.72rem',
                color: '#60A5FA',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>+ Select More in Vantage</span>
            </Link>
            <button
              onClick={clearTargetedEntries}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: '0.72rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* PERDITION CHAOS INOCULATION COUNTERMEASURE BANNER */}
      {isPerditionActive && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.14), rgba(16, 185, 129, 0.12))',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          borderRadius: '10px',
          padding: '0.85rem 1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>🔥</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F87171', letterSpacing: '0.04em' }}>
                  PERDITION TEST COUNTERMEASURE ACTIVE
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                  AUTOMATED REMEDIATION READY
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '3px' }}>
                Praxis has auto-selected countermeasures targeting the vulnerabilities and unauthenticated listeners seeded by Perdition (SSH LoginGraceTime, port 4444/8080 drops, rogue accounts). Executing this remediation will write an endpoint After-Action CBOM confirming neutralization.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href="/app/perdition"
              style={{
                fontSize: '0.74rem',
                color: '#FCA5A5',
                textDecoration: 'none',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              Back to Perdition &rarr;
            </Link>
            <button
              onClick={() => setIsPerditionActive(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.78rem',
                padding: '4px 6px'
              }}
            >
              ✕ Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Dual-Layout: Left Control Sidebar + Main Unmolested View */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start',
        position: 'relative'
      }}>

        {/* ═══════════════════════════════════════════════════════════════════
            LEFT SIDEBAR: Dual Controls & Pre-filtered Engine Settings
            ═══════════════════════════════════════════════════════════════════ */}
        <aside style={{
          width: isSidebarCollapsed ? '56px' : '310px',
          minWidth: isSidebarCollapsed ? '56px' : '310px',
          maxWidth: isSidebarCollapsed ? '56px' : '310px',
          position: 'sticky',
          top: '1rem',
          height: 'calc(100vh - 2rem)',
          maxHeight: 'calc(100vh - 2rem)',
          background: 'rgba(13, 19, 33, 0.85)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.2s, max-width 0.2s',
          overflowY: isSidebarCollapsed ? 'hidden' : 'auto',
          zIndex: 20
        }}>
          {isSidebarCollapsed ? (
            /* Collapsed Rail View */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.75rem 0.35rem',
              gap: '0.75rem',
              height: '100%'
            }}>
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#FBBF24',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
                title="Expand Praxis Controls Sidebar"
              >
                ▶
              </button>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                margin: 'auto 0',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => { setPraxisMode('patching'); setIsSidebarCollapsed(false); }}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '7px',
                    background: praxisMode === 'patching' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: praxisMode === 'patching' ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: praxisMode === 'patching' ? '#FBBF24' : '#CBD5E1',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  title="Patching Mode"
                >
                  🩹
                </button>
                <button
                  onClick={() => { setPraxisMode('remediation'); setIsSidebarCollapsed(false); }}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '7px',
                    background: praxisMode === 'remediation' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: praxisMode === 'remediation' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: praxisMode === 'remediation' ? '#34D399' : '#CBD5E1',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  title="Remediation Mode"
                >
                  🛡️
                </button>
                <button
                  onClick={() => { setPraxisMode('both'); setIsSidebarCollapsed(false); }}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '7px',
                    background: praxisMode === 'both' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: praxisMode === 'both' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: praxisMode === 'both' ? '#93C5FD' : '#CBD5E1',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  title="Dual / Both Mode"
                >
                  ⚡
                </button>
              </div>
            </div>
          ) : (
            /* Expanded Full Sidebar View */
            <>
              {/* Sidebar Header */}
              <div style={{
                padding: '0.9rem 1rem 0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                background: 'rgba(15, 23, 42, 0.6)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Sliders size={16} color="#94A3B8" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '0.02em' }}>
                      Praxis Engine
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '4px',
                      background: praxisMode === 'patching' ? 'rgba(245, 158, 11, 0.15)' : praxisMode === 'remediation' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: praxisMode === 'patching' ? '#FBBF24' : praxisMode === 'remediation' ? '#34D399' : '#93C5FD',
                      border: `1px solid ${praxisMode === 'patching' ? 'rgba(245, 158, 11, 0.3)' : praxisMode === 'remediation' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                    }}>
                      {praxisMode === 'patching' ? 'Patching' : praxisMode === 'remediation' ? 'Remediation' : 'Unified'}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94A3B8',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      transition: 'all 0.15s ease'
                    }}
                    title="Collapse Sidebar"
                  >
                    ◀
                  </button>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {praxisMode === 'patching' 
                    ? 'Micro-patching, canary rollout & CBOM'
                    : praxisMode === 'remediation'
                    ? 'Baseline OS hardening, firewalls & CBOM'
                    : 'Unified patching, remediation & CBOM'}
                </div>
              </div>

              {/* Dual Control Switcher: Patching / Remediation / Both (matching Vantage) */}
              <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', background: 'rgba(10, 14, 23, 0.9)', padding: '0.2rem', borderRadius: '9px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {([['patching', 'Patching'], ['remediation', 'Remediation'], ['both', 'Both']] as const).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setPraxisMode(id)}
                      style={{
                        flex: 1,
                        padding: '0.4rem 0.3rem',
                        borderRadius: '7px',
                        border: 'none',
                        background: praxisMode === id 
                          ? (id === 'patching' ? 'rgba(245, 158, 11, 0.25)' : id === 'remediation' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.25)') 
                          : 'transparent',
                        color: praxisMode === id ? '#F8FAFC' : '#94A3B8',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search / Filter Box */}
              {(praxisMode === 'patching' || praxisMode === 'both') && (
                <div style={{ padding: '0.75rem 0.85rem 0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={patchSearchQuery}
                      onChange={(e) => setPatchSearchQuery(e.target.value)}
                      placeholder="Filter CVEs, packages, fixes..."
                      style={{
                        width: '100%',
                        padding: '0.45rem 1.8rem 0.45rem 0.75rem',
                        borderRadius: '7px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(10, 14, 23, 0.9)',
                        color: '#F8FAFC',
                        fontSize: '0.76rem',
                        outline: 'none'
                      }}
                    />
                    {patchSearchQuery && (
                      <button
                        onClick={() => setPatchSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Dynamic Settings Content */}
              <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', flex: 1, overflowY: 'auto' }}>
                
                {/* ── SECTION 1: PATCHING CONTROLS (Active in Patching or Both) ── */}
                {(praxisMode === 'patching' || praxisMode === 'both') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FBBF24' }}>
                        Patching Settings
                      </span>
                      <span style={{ fontSize: '0.66rem', color: '#94A3B8' }}>{filteredPatches.length} Patches</span>
                    </div>

                    {/* Target Distribution */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.35rem', fontWeight: 600 }}>
                        Target Distribution
                      </label>
                      <select
                        value={selectedDistro}
                        onChange={(e) => setSelectedDistro(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(10, 14, 23, 0.9)',
                          color: '#F8FAFC',
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                      >
                        {DISTRO_OPTIONS.map(d => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Default Remediation Payload Tier */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.35rem', fontWeight: 600 }}>
                        Remediation Tier
                      </label>
                      <select
                        value={selectedPayloadTab}
                        onChange={(e) => setSelectedPayloadTab(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(10, 14, 23, 0.9)',
                          color: '#F8FAFC',
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="tier1">Tier 1: Zero-Downtime Hotfix</option>
                        <option value="tier2">Tier 2: Distro Package Upgrade</option>
                        <option value="tier3">Tier 3: Ansible Fleet Automation</option>
                        <option value="cbom">After-Action CBOM Manifest</option>
                        <option value="rawJson">Raw Signed JSON (SLSA)</option>
                      </select>
                    </div>

                    {/* Canary Fleet Rollout Slice */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.35rem', fontWeight: 600 }}>
                        Canary Fleet Slice
                      </label>
                      <select
                        value={canarySlice}
                        onChange={(e) => setCanarySlice(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(10, 14, 23, 0.9)',
                          color: '#F8FAFC',
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                      >
                        {CANARY_SLICES.map(s => (
                          <option key={s.percent} value={s.percent}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Severity Filter */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.35rem', fontWeight: 600 }}>
                        Severity Filter
                      </label>
                      <select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(10, 14, 23, 0.9)',
                          color: '#F8FAFC',
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all">All Severities</option>
                        <option value="CRITICAL">Critical Only (9.0+ CVSS)</option>
                        <option value="HIGH">High &amp; Critical</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Divider between categories when in Both mode */}
                {praxisMode === 'both' && (
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '0.2rem 0' }} />
                )}

                {/* ── SECTION 2: REMEDIATION / HARDENING CONTROLS (Active in Remediation or Both) ── */}
                {(praxisMode === 'remediation' || praxisMode === 'both') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#34D399' }}>
                        Remediation Settings
                      </span>
                      <span style={{ fontSize: '0.66rem', color: '#94A3B8' }}>{selectedClasses.size} active modules</span>
                    </div>

                    {/* Target OS Architecture */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.35rem', fontWeight: 600 }}>
                        Target OS Architecture
                      </label>
                      <select
                        value={os}
                        onChange={(e) => setOs(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(10, 14, 23, 0.9)',
                          color: '#F8FAFC',
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                      >
                        {OS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Active Remediation Modules */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.35rem', fontWeight: 600 }}>
                        Active Remediation Modules
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {REMEDIATION_CLASSES.map(cls => {
                          const isChecked = selectedClasses.has(cls.id);
                          return (
                            <div
                              key={cls.id}
                              onClick={() => toggleClass(cls.id)}
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: isChecked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                                background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.12s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.82rem' }}>{cls.icon}</span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isChecked ? '#34D399' : '#CBD5E1' }}>
                                  {cls.title}
                                </span>
                              </div>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                style={{ accentColor: '#10B981', cursor: 'pointer', transform: 'scale(0.85)' }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hardware Firewall Format (if network class active) */}
                    {hasNetworkClass && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.35rem', fontWeight: 600 }}>
                          Firewall Export Format
                        </label>
                        <select
                          value={firewallFormat}
                          onChange={(e) => setFirewallFormat(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            background: 'rgba(10, 14, 23, 0.9)',
                            color: '#F8FAFC',
                            fontSize: '0.76rem',
                            cursor: 'pointer'
                          }}
                        >
                          {FIREWALL_FORMATS.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Hourly Cron Automation Toggle */}
                    <div style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FFFFFF' }}>Hourly Cron Automation</div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>/etc/cron.hourly daemon</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={cron}
                        onChange={(e) => setCron(e.target.checked)}
                        style={{ accentColor: '#10B981', cursor: 'pointer', transform: 'scale(1.05)' }}
                      />
                    </div>

                    {/* Saved Hardening Profiles */}
                    <div style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#CBD5E1' }}>Saved Profiles</span>
                        <button
                          onClick={() => setIsSavingProfile(!isSavingProfile)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#34D399',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          + Save
                        </button>
                      </div>

                      {isSavingProfile && (
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                          <input
                            type="text"
                            placeholder="Profile name..."
                            value={profileNameInput}
                            onChange={(e) => setProfileNameInput(e.target.value)}
                            style={{ flex: 1, padding: '4px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#000', color: '#fff', fontSize: '0.72rem' }}
                          />
                          <button onClick={saveProfile} style={{ padding: '4px 8px', borderRadius: '4px', background: '#10B981', color: '#000', fontWeight: 700, fontSize: '0.72rem', border: 'none', cursor: 'pointer' }}>OK</button>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {Object.keys(savedProfiles).length === 0 ? (
                          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>None saved.</span>
                        ) : (
                          Object.keys(savedProfiles).map(p => (
                            <button
                              key={p}
                              onClick={() => loadProfile(p)}
                              style={{
                                padding: '2px 7px',
                                borderRadius: '4px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#CBD5E1',
                                fontSize: '0.68rem',
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
                  </div>
                )}

              </div>

              {/* Sidebar Action Trigger */}
              <div style={{ padding: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(10, 14, 23, 0.8)' }}>
                {praxisMode === 'patching' ? (
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSimulating ? 'rgba(245, 158, 11, 0.3)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: '#000000',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: isSimulating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {isSimulating ? <Activity size={14} className="spin" /> : <Play size={14} />}
                    <span>{isSimulating ? 'Canary Simulating...' : 'Execute Ring 0 Canary'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: '#000000',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: generating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Zap size={14} />
                    <span>{generating ? 'Generating...' : 'Generate Deployment Link'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </aside>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN VIEW: Unmolested Workspace for Execution & Inspection
            ═══════════════════════════════════════════════════════════════════ */}
        <main style={{ flex: 1, minWidth: 0 }}>
          
          {/* ─────────────────────────────────────────────────────────────────
              VIEW A: PATCHING WORKSPACE
              ───────────────────────────────────────────────────────────────── */}
          {praxisMode === 'patching' && (
            <div>
              {/* Interactive Canary Simulator */}
              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.25)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Play size={18} color="#FBBF24" />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                        Live Canary Rollout Simulator
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
                      Simulate deploying {selectedPatch.cveId} ({selectedPatch.title}) across a 640-host hybrid fleet using a {canarySlice}% canary slice.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
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
                        fontSize: '0.82rem',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: isSimulating ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSimulating ? <Activity size={15} className="spin" /> : <Play size={15} />}
                      <span>{isSimulating ? 'Simulating Rollout...' : simulationDone ? 'Re-Run Simulation' : 'Execute Ring 0 Canary'}</span>
                    </button>

                    {simulationDone && (
                      <button
                        onClick={() => {
                          setActiveCbomPayload(currentPatchCbom);
                          setCbomModalOpen(true);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#34D399',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <FileCode size={14} />
                        <span>View After-Action CBOM</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                  <div style={{ width: `${simulationProgress}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #10B981)', transition: 'width 0.3s ease' }} />
                </div>

                {/* Terminal Simulation Log Output */}
                <div style={{
                  background: '#05070D',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '0.9rem 1.15rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.78rem',
                  color: '#34D399',
                  minHeight: '110px',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  lineHeight: 1.5
                }}>
                  {simulationLogs.length === 0 ? (
                    <span style={{ color: '#64748B' }}>// Click &quot;Execute Ring 0 Canary&quot; above or in the left sidebar to trigger simulated fleet hot-patching.</span>
                  ) : (
                    simulationLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))
                  )}
                </div>
              </div>

              {/* Patch Browser & Payload Inspector Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
                
                {/* Left: Patch Feed Selector */}
                <div className="glass-card" style={{ padding: '1.15rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>Active Hotpatch Stream</h4>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{filteredPatches.length} available</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto' }}>
                    {filteredPatches.map(patch => {
                      const isSelected = selectedPatch.id === patch.id || selectedPatch.cveId === patch.cveId;
                      const isTargeted = (patch as any).isTargeted;
                      return (
                        <div
                          key={patch.id}
                          onClick={() => setSelectedPatch(patch)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: isSelected 
                              ? (isTargeted ? '1px solid #10B981' : '1px solid #F59E0B') 
                              : '1px solid rgba(255, 255, 255, 0.05)',
                            background: isSelected 
                              ? (isTargeted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.1)') 
                              : 'rgba(255, 255, 255, 0.02)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38BDF8' }}>{patch.cveId}</span>
                              {isTargeted && (
                                <span style={{
                                  fontSize: '0.62rem',
                                  fontWeight: 800,
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  background: 'rgba(16, 185, 129, 0.25)',
                                  color: '#34D399',
                                  border: '1px solid rgba(16, 185, 129, 0.4)'
                                }}>
                                  TARGETED
                                </span>
                              )}
                            </div>
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
                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>{selectedPatch.cveId}</span>
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>({selectedPatch.affectedPackages.join(', ')})</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 500 }}>{selectedPatch.title}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedPayloadTab('tier1')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          border: selectedPayloadTab === 'tier1' ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                          background: selectedPayloadTab === 'tier1' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                          color: selectedPayloadTab === 'tier1' ? '#34D399' : '#94A3B8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Tier 1 (Hotfix)
                      </button>
                      <button
                        onClick={() => setSelectedPayloadTab('tier2')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          border: selectedPayloadTab === 'tier2' ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.08)',
                          background: selectedPayloadTab === 'tier2' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                          color: selectedPayloadTab === 'tier2' ? '#38BDF8' : '#94A3B8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Tier 2 (Kernel Live)
                      </button>
                      <button
                        onClick={() => setSelectedPayloadTab('tier3')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          border: selectedPayloadTab === 'tier3' ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.08)',
                          background: selectedPayloadTab === 'tier3' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                          color: selectedPayloadTab === 'tier3' ? '#C084FC' : '#94A3B8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Tier 3 (Ansible)
                      </button>
                      <button
                        onClick={() => setSelectedPayloadTab('cbom')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          border: selectedPayloadTab === 'cbom' ? '1px solid #34D399' : '1px solid rgba(255,255,255,0.08)',
                          background: selectedPayloadTab === 'cbom' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          color: selectedPayloadTab === 'cbom' ? '#34D399' : '#94A3B8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        After-Action CBOM
                      </button>
                      <button
                        onClick={() => setSelectedPayloadTab('rawJson')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          border: selectedPayloadTab === 'rawJson' ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.08)',
                          background: selectedPayloadTab === 'rawJson' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                          color: selectedPayloadTab === 'rawJson' ? '#FBBF24' : '#94A3B8',
                          fontSize: '0.72rem',
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
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px', zIndex: 2 }}>
                      {selectedPayloadTab === 'cbom' && (
                        <button
                          onClick={() => downloadCbomJson(currentPatchCbom)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34D399',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Download size={12} />
                          <span>Download .json</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const text = selectedPayloadTab === 'tier1'
                            ? selectedPatch.remediationTier.tier1_hotMitigation.commands.join('\n')
                            : selectedPayloadTab === 'cbom'
                            ? JSON.stringify(currentPatchCbom, null, 2)
                            : selectedPayloadTab === 'rawJson'
                            ? JSON.stringify(selectedPatch, null, 2)
                            : selectedPayloadTab === 'tier2'
                            ? Object.entries(selectedPatch.remediationTier.tier2_packageUpgrade.distroCommands).map(([d, c]) => `# ${d.toUpperCase()}:\n${c}`).join('\n\n')
                            : selectedPatch.remediationTier.tier3_fleetAutomation.ansiblePlaybook;
                          copyToClipboard(text, 'payload');
                        }}
                        style={{
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
                    </div>

                    <pre style={{
                      background: '#05070D',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '1.15rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.78rem',
                      color: selectedPayloadTab === 'tier1' ? '#34D399' : selectedPayloadTab === 'tier2' ? '#38BDF8' : selectedPayloadTab === 'cbom' ? '#A7F3D0' : '#FBBF24',
                      overflowX: 'auto',
                      lineHeight: 1.5,
                      minHeight: '260px'
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
                      {selectedPayloadTab === 'cbom' && (
                        JSON.stringify(currentPatchCbom, null, 2)
                      )}
                      {selectedPayloadTab === 'rawJson' && (
                        JSON.stringify(selectedPatch, null, 2)
                      )}
                    </pre>
                  </div>

                  {/* Provenance Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', padding: '9px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.72rem', color: '#94A3B8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="#10B981" />
                      <span>SLSA Level {selectedPatch.provenance.slsaLevel} Attested &bull; CycloneDX-CBOM Ready</span>
                    </div>
                    <span>Cosign Digest: {selectedPatch.provenance.cosignDigest.slice(0, 24)}...</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              VIEW B: REMEDIATION / HARDENING WORKSPACE
              ───────────────────────────────────────────────────────────────── */}
          {praxisMode === 'remediation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Live Script Preview Card */}
              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={18} color="#10B981" />
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Synthesized Hardening Script Preview</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
                    {threatCount} Vantage Indicators Ingested ({os}) &bull; Includes CBOM Manifest Generator
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
                    maxHeight: '440px',
                    overflowY: 'auto',
                    lineHeight: 1.55
                  }}>
                    {previewLoading ? '// Synthesizing baseline hardening script and After-Action CBOM from Vantage...' : previewScript}
                  </pre>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    Compiles dynamic firewall rules, account policies, and an <strong>After-Action CBOM payload</strong> for <strong style={{ color: '#F8FAFC' }}>{os}</strong>.
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {activeCbomPayload && (
                      <button
                        onClick={() => setCbomModalOpen(true)}
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          color: '#34D399',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          padding: '10px 18px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FileCode size={15} />
                        <span>View After-Action CBOM</span>
                      </button>
                    )}

                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      style={{
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: '#000000',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        padding: '10px 22px',
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
                    ⚠ Single-use security token. Once executed, the script applies remediations and outputs a cryptographic After-Action CBOM manifest at <code>/var/log/exultia/praxis-cbom-after-action.json</code>.
                  </p>
                </div>
              )}

              {/* Active Modules Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {REMEDIATION_CLASSES.filter(c => selectedClasses.has(c.id)).map(c => (
                  <div key={c.id} className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{c.title}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.4 }}>{c.description}</div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              VIEW C: BOTH / UNIFIED FLEET DEFENSE WORKBENCH
              ───────────────────────────────────────────────────────────────── */}
          {praxisMode === 'both' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Interactive Canary Simulator */}
              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={18} color="#60A5FA" />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                        Unified Fleet Defense: Patching + Hardening Execution
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
                      Simultaneously hotpatch vulnerabilities ({selectedPatch.cveId}) and enforce OS baseline hardening on {os} with After-Action CBOM.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={runSimulation}
                      disabled={isSimulating}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isSimulating ? 'rgba(245, 158, 11, 0.3)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '7px 14px',
                        borderRadius: '7px',
                        border: 'none',
                        cursor: isSimulating ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSimulating ? <Activity size={14} className="spin" /> : <Play size={14} />}
                      <span>{isSimulating ? 'Simulating...' : 'Run Canary'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (!activeCbomPayload) setActiveCbomPayload(currentPatchCbom);
                        setCbomModalOpen(true);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        color: '#34D399',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        padding: '7px 14px',
                        borderRadius: '7px',
                        cursor: 'pointer'
                      }}
                    >
                      <FileCode size={14} />
                      <span>CBOM Manifest</span>
                    </button>

                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '7px 14px',
                        borderRadius: '7px',
                        border: 'none',
                        cursor: generating ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Zap size={14} />
                      <span>{generating ? 'Compiling...' : 'Generate Hardening Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <div style={{ width: `${simulationProgress}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #3B82F6, #10B981)', transition: 'width 0.3s ease' }} />
                </div>

                {/* Terminal Simulation Log Output */}
                <div style={{
                  background: '#05070D',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.76rem',
                  color: '#34D399',
                  minHeight: '80px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  lineHeight: 1.45
                }}>
                  {simulationLogs.length === 0 ? (
                    <span style={{ color: '#64748B' }}>// Click &quot;Run Canary&quot; to test the patch rollout, or &quot;Generate Hardening Link&quot; to synthesize baseline rules.</span>
                  ) : (
                    simulationLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))
                  )}
                </div>
              </div>

              {/* Side-by-side Dual Column View: Patch Payload on Left, Hardening Script on Right */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem' }}>
                
                {/* Left Pane: Selected Hotpatch Payload */}
                <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>
                        Patching Payload
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>{selectedPatch.cveId}</span>
                    </div>

                    <button
                      onClick={() => {
                        const text = selectedPayloadTab === 'tier1'
                          ? selectedPatch.remediationTier.tier1_hotMitigation.commands.join('\n')
                          : JSON.stringify(selectedPatch, null, 2);
                        copyToClipboard(text, 'unified-patch');
                      }}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '5px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#CBD5E1',
                        fontSize: '0.7rem',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedText === 'unified-patch' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  <pre style={{
                    background: '#05070D',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.75rem',
                    color: '#34D399',
                    height: '320px',
                    overflowY: 'auto',
                    lineHeight: 1.5
                  }}>
                    {`# Tier 1 Zero-Downtime Hotfix for ${selectedPatch.cveId}\n# Summary: ${selectedPatch.remediationTier.tier1_hotMitigation.summary}\n\n${selectedPatch.remediationTier.tier1_hotMitigation.commands.join('\n')}\n\n# Verification:\n${selectedPatch.remediationTier.tier1_hotMitigation.verificationCommand}\n\n# Rollback:\n${selectedPatch.remediationTier.tier1_hotMitigation.rollbackCommand}`}
                  </pre>
                </div>

                {/* Right Pane: Live Hardening Script Preview */}
                <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>
                        Hardening &amp; Firewall
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{os} ({threatCount} indicators)</span>
                    </div>

                    <button
                      onClick={() => {
                        copyToClipboard(previewScript, 'unified-hardening');
                      }}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '5px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#CBD5E1',
                        fontSize: '0.7rem',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedText === 'unified-hardening' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  <pre style={{
                    background: '#05070D',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.75rem',
                    color: '#34D399',
                    height: '320px',
                    overflowY: 'auto',
                    lineHeight: 1.5
                  }}>
                    {previewLoading ? '// Synthesizing baseline hardening script from Vantage...' : previewScript}
                  </pre>
                </div>

              </div>

              {/* Generated Deployment Command (if created) */}
              {generatedId && (
                <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>
                      One-Time Shell Execution Command
                    </span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(hardeningCommand); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '5px',
                        border: 'none',
                        background: copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)',
                        color: copied ? '#34D399' : '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ background: '#05070D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 12px', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: '#38BDF8', wordBreak: 'break-all' }}>
                    {hardeningCommand}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          AFTER-ACTION CBOM MANIFEST MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      {cbomModalOpen && activeCbomPayload && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setCbomModalOpen(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div style={{
            background: '#0B1120',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '16px',
            maxWidth: '920px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileCode size={22} color="#10B981" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    After-Action Cybersecurity Bill of Materials (CBOM)
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '2px' }}>
                    Specification: CycloneDX-CBOM v1.5 &bull; Attestation: SLSA Level 3 &bull; Cryptographically Verified
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCbomModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  borderRadius: '6px',
                  width: '30px',
                  height: '30px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Ribbon */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '8px',
              padding: '0.85rem 1.5rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Format</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38BDF8' }}>{activeCbomPayload.cbomFormat}</div>
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Vulnerabilities</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34D399' }}>{activeCbomPayload.vulnerabilitiesRemediated.length} Remediated</div>
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Actions Codified</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FBBF24' }}>{activeCbomPayload.actionsPerformed.length} Actions</div>
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Attestation</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#A78BFA' }}>SLSA Level 3</div>
              </div>
            </div>

            {/* Code Body */}
            <div style={{ padding: '1.25rem 1.5rem', flex: 1, overflowY: 'auto' }}>
              <pre style={{
                margin: 0,
                background: '#05070D',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '1.15rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.78rem',
                color: '#34D399',
                maxHeight: '420px',
                overflowY: 'auto',
                lineHeight: 1.55
              }}>
                {JSON.stringify(activeCbomPayload, null, 2)}
              </pre>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '0.85rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.6)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                Digest: {activeCbomPayload.provenance.integrityHash.slice(0, 32)}...
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => downloadCbomJson(activeCbomPayload)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34D399',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} />
                  <span>Download .json</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(activeCbomPayload, null, 2));
                    setCopiedText('modal-cbom');
                    setTimeout(() => setCopiedText(null), 2000);
                  }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#F8FAFC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedText === 'modal-cbom' ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copiedText === 'modal-cbom' ? 'Copied' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={() => setCbomModalOpen(false)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94A3B8',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
