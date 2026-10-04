'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function PraxisPage() {
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

  // Only mark ready after the client has hydrated
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

  // Fetch preview whenever config changes — but only once client is ready
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    const fetchPreview = async () => {
      setPreviewLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/fix-list/generate`, {
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
  }, [ready, os, cron, proxy, selectedClasses, networkMode, firewallFormat, filenamePattern, customShebang, baseUrl]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${baseUrl}/api/fix-list/generate`, {
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

  const command = generatedId
    ? filenamePattern
      ? `curl -sL -O -J "${baseUrl}/api/fix-list/download?id=${generatedId}"`
      : `curl -sL "${baseUrl}/api/fix-list/download?id=${generatedId}" | sh`
    : '';

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 3rem' }}>
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>🔧</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            Praxis
          </h1>
          <span style={{
            fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem',
            borderRadius: '999px', border: '1px solid rgba(59,130,246,0.4)',
            color: 'var(--accent-primary)', backgroundColor: 'rgba(59,130,246,0.1)',
            letterSpacing: '0.05em', textTransform: 'uppercase'
          }}>
            Beta
          </span>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/account/subscription?product=fixlist"
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "8px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                color: "#FBBF24",
                fontWeight: 700,
                fontSize: "0.82rem",
                textDecoration: "none",
                whiteSpace: "nowrap"
              }}
            >
              Plans & Pricing ($0, $49, $149) →
            </Link>

            <div style={{ position: "relative" }}>
              <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Profile:</span>
              <select 
                onChange={(e) => {
                  if (e.target.value === '__new__') setIsSavingProfile(true);
                  else if (e.target.value) loadProfile(e.target.value);
                }}
                style={{ background: "transparent", border: "none", color: "white", outline: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                value=""
              >
                <option value="" disabled>Load Profile...</option>
                {Object.keys(savedProfiles).map(p => (
                  <option key={p} value={p} style={{ color: "black" }}>{p}</option>
                ))}
                <option value="__new__" style={{ color: "black", fontWeight: "bold" }}>+ Save Current As...</option>
              </select>
            </div>
            
            {isSavingProfile && (
              <div style={{ position: "absolute", top: "120%", right: 0, background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "12px", zIndex: 100, display: "flex", gap: "0.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Profile Name" 
                  value={profileNameInput}
                  onChange={e => setProfileNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveProfile()}
                  style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.3)", color: "white" }}
                />
                <button onClick={saveProfile} style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: "#3B82F6", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>Save</button>
                <button onClick={() => setIsSavingProfile(false)} style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none", cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', maxWidth: '700px', lineHeight: 1.6, margin: 0 }}>
          Compile and deploy targeted remediation clients directly from the Vantage threat registry.
          Scripts are generated on-demand, transmitted exactly <strong style={{ color: 'var(--text-main)' }}>once</strong>, and immediately destroyed — no server-side retention.
        </p>
      </div>

      {/* ── Stat Badges ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Threats Matched', value: threatCount > 0 ? threatCount.toString() : '—', color: 'var(--accent-primary)' },
          { label: 'Classes Selected', value: selectedClasses.size.toString(), color: '#8B5CF6' },
          { label: 'Transmission Policy', value: 'One-Time', color: '#10B981' },
          { label: 'Zero Retention', value: '✓', color: '#10B981' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '12px', padding: '0.75rem 1.25rem', backdropFilter: 'blur(12px)'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main Two-Column Layout ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* ── LEFT PANEL ──────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Remediation Classes */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                Remediation Classes
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setSelectedClasses(new Set(REMEDIATION_CLASSES.map(c => c.id)))}
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  All
                </button>
                <button onClick={() => setSelectedClasses(new Set())}
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  Clear
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {REMEDIATION_CLASSES.map(cls => {
                const active = selectedClasses.has(cls.id);
                return (
                  <div key={cls.id} onClick={() => toggleClass(cls.id)} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '0.875rem 1rem', borderRadius: '10px', cursor: 'pointer',
                    border: `1px solid ${active ? 'rgba(59,130,246,0.4)' : 'var(--border-color)'}`,
                    background: active ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.15s ease',
                  }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '0.1rem' }}>{cls.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? 'var(--text-main)' : 'var(--text-muted)', marginBottom: '0.15rem' }}>
                        {cls.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{cls.description}</div>
                    </div>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, marginTop: '2px',
                      border: `2px solid ${active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)'}`,
                      background: active ? 'var(--accent-primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease'
                    }}>
                      {active && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Network Indicator Handling — only shown when relevant */}
          {hasNetworkClass && (
            <div className="glass-card" style={{ padding: '1.5rem', borderColor: 'rgba(59,130,246,0.25)' }}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                Network Indicator Handling
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: networkMode === 'export' ? '1rem' : 0 }}>
                {[
                  { value: 'localhost', label: 'Apply directly on endpoint', desc: 'Runs iptables / ipf / genfilt commands on the local system.' },
                  { value: 'export', label: 'Export for enterprise firewall', desc: 'Generates structured indicator data — no local changes.' },
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', gap: '0.75rem', padding: '0.875rem 1rem',
                    borderRadius: '10px', cursor: 'pointer',
                    border: `1px solid ${networkMode === opt.value ? 'rgba(59,130,246,0.4)' : 'var(--border-color)'}`,
                    background: networkMode === opt.value ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.15s ease',
                  }}>
                    <input type="radio" name="networkMode" value={opt.value}
                      checked={networkMode === opt.value}
                      onChange={() => setNetworkMode(opt.value as 'localhost' | 'export')}
                      style={{ marginTop: '3px', accentColor: 'var(--accent-primary)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              {networkMode === 'export' && (
                <select value={firewallFormat} onChange={e => setFirewallFormat(e.target.value)} style={{
                  width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
                  border: '1px solid rgba(59,130,246,0.35)', background: 'rgba(59,130,246,0.07)',
                  color: 'var(--text-main)', fontSize: '0.875rem', cursor: 'pointer'
                }}>
                  {FIREWALL_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              )}
            </div>
          )}

          {/* Client Settings */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              Client Settings
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Target OS</label>
                <select value={os} onChange={e => setOs(e.target.value)} style={{
                  width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
                  border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-main)', fontSize: '0.875rem'
                }}>
                  {OS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Corporate Proxy (Optional)</label>
                <input type="text" placeholder="http://proxy.corp.local:8080" value={proxy}
                  onChange={e => setProxy(e.target.value)} style={{
                    width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-main)', fontSize: '0.875rem'
                  }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1rem', borderRadius: '8px', border: `1px solid ${cron ? 'rgba(59,130,246,0.35)' : 'var(--border-color)'}`, background: cron ? 'rgba(59,130,246,0.06)' : 'transparent', transition: 'all 0.15s ease' }}>
                <input type="checkbox" checked={cron} onChange={e => setCron(e.target.checked)}
                  style={{ width: '1rem', height: '1rem', accentColor: 'var(--accent-primary)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>Auto-deploy daily cron job</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Installs a frozen snapshot of this payload into crontab.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Advanced Configuration */}
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(245, 158, 11, 0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.5rem', borderBottomLeftRadius: '8px', color: '#F59E0B', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>PREMIUM</div>
            <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              Advanced Configuration
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Custom Shebang</label>
                <input type="text" placeholder="#!/bin/sh" value={customShebang}
                  onChange={e => setCustomShebang(e.target.value)} style={{
                    width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-main)', fontSize: '0.875rem', fontFamily: 'monospace'
                  }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Export Filename Pattern</label>
                <input type="text" placeholder="praxis-fixlist-export.sh" value={filenamePattern}
                  onChange={e => setFilenamePattern(e.target.value)} style={{
                    width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-main)', fontSize: '0.875rem', fontFamily: 'monospace'
                  }} />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={handleGenerate} disabled={generating || selectedClasses.size === 0} style={{
            width: '100%', padding: '0.875rem', borderRadius: '10px', border: 'none',
            background: selectedClasses.size === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            color: selectedClasses.size === 0 ? 'var(--text-muted)' : 'white',
            fontWeight: 700, fontSize: '0.95rem', cursor: selectedClasses.size === 0 ? 'not-allowed' : 'pointer',
            boxShadow: selectedClasses.size > 0 ? '0 0 20px rgba(59,130,246,0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}>
            {generating ? '⏳ Compiling payload...' : '⚡ Generate One-Time Payload Link'}
          </button>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Script Preview */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: previewLoading ? '#F59E0B' : '#10B981', boxShadow: `0 0 6px ${previewLoading ? '#F59E0B' : '#10B981'}` }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {previewLoading ? 'Compiling...' : 'Live Script Preview'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,95,87,0.7)' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,189,46,0.7)' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(39,201,63,0.7)' }} />
              </div>
            </div>
            <pre style={{
              padding: '1.5rem', margin: 0, minHeight: '420px', maxHeight: '600px',
              overflowY: 'auto', fontSize: '0.78rem', lineHeight: 1.65,
              color: '#a5b4fc', background: 'transparent', opacity: previewLoading ? 0.5 : 1,
              transition: 'opacity 0.2s ease'
            }}>
              <code>{previewScript || (previewLoading ? '# Compiling from Vantage threat registry...' : '# Select remediation classes to see the compiled payload.')}</code>
            </pre>
          </div>

          {/* Deployment Command */}
          {generatedId && (
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', borderColor: 'rgba(16,185,129,0.3)' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 1.5rem', borderBottom: '1px solid rgba(16,185,129,0.2)',
                background: 'rgba(16,185,129,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10B981', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    One-Time Deployment Command
                  </span>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(command); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{
                    padding: '0.3rem 0.75rem', borderRadius: '6px', border: 'none',
                    background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                    color: copied ? '#10B981' : 'var(--text-muted)', fontWeight: 600,
                    fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease'
                  }}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre style={{
                padding: '1.25rem 1.5rem', margin: 0,
                fontSize: '0.85rem', color: '#34d399', background: 'transparent',
                wordBreak: 'break-all', whiteSpace: 'pre-wrap'
              }}>
                <code>{command}</code>
              </pre>
              <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid rgba(16,185,129,0.15)', background: 'rgba(16,185,129,0.03)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  ⚠ This link is single-use. Once the client fetches the script, it is permanently deleted from our servers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
