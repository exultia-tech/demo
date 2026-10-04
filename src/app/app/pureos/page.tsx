"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PureOsIcon } from '@/components/BrandIcons';
import { Download, FileCode } from 'lucide-react';

type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise';
type ActiveTab = 'base' | 'hardening' | 'packages' | 'scanner' | 'output';

export default function PureOSConfigurator() {
  const [tier, setTier] = useState<SubscriptionTier>('Free');
  const [activeTab, setActiveTab] = useState<ActiveTab>('base');
  
  const [baseImage, setBaseImage] = useState('alpine-3.19');
  const [hardeningLevel, setHardeningLevel] = useState('standard');
  const [includeTools, setIncludeTools] = useState<Record<string, boolean>>({
    curl: true,
    jq: false,
    python: false,
    node: false,
  });

  const [showSbomModal, setShowSbomModal] = useState(false);

  const isPro = tier === 'Pro' || tier === 'Enterprise';
  const isEnterprise = tier === 'Enterprise';

  const toggleTool = (tool: string) => {
    setIncludeTools(prev => ({ ...prev, [tool]: !prev[tool] }));
  };

  const [savedProfiles, setSavedProfiles] = useState<Record<string, any>>({});
  const [profileNameInput, setProfileNameInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const loaded = localStorage.getItem('pureos_saved_profiles');
    if (loaded) {
      try {
        setSavedProfiles(JSON.parse(loaded));
      } catch (e) {}
    }
  }, []);

  const saveProfile = () => {
    if (!profileNameInput.trim()) return;
    const newProfiles = {
      ...savedProfiles,
      [profileNameInput]: { baseImage, hardeningLevel, includeTools }
    };
    setSavedProfiles(newProfiles);
    localStorage.setItem('pureos_saved_profiles', JSON.stringify(newProfiles));
    setProfileNameInput('');
    setIsSavingProfile(false);
  };

  const loadProfile = (name: string) => {
    const profile = savedProfiles[name];
    if (profile) {
      setBaseImage(profile.baseImage);
      setHardeningLevel(profile.hardeningLevel);
      setIncludeTools(profile.includeTools);
    }
  };

  const deleteProfile = (name: string) => {
    const newProfiles = { ...savedProfiles };
    delete newProfiles[name];
    setSavedProfiles(newProfiles);
    localStorage.setItem('pureos_saved_profiles', JSON.stringify(newProfiles));
  };

  const tabs = [
    { id: 'base', label: 'Base Image', icon: '💿' },
    { id: 'hardening', label: 'Hardening Profile', icon: '🛡️' },
    { id: 'packages', label: 'Packages & Tools', icon: '📦' },
    { id: 'scanner', label: 'Vuln Scanner', icon: '🔍' },
    { id: 'output', label: 'Output & SBOM', icon: '📝' },
  ] as const;

  return (
    <div className="fade-in" style={{ padding: "2rem", maxWidth: "1600px", margin: "0 auto", height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <PureOsIcon size={40} glow={true} />
          <div>
            <h1 style={{ fontSize: "2rem", margin: 0, display: "flex", alignItems: "center", gap: "1rem" }}>
              PureOS Configurator
              <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", background: "rgba(16, 185, 129, 0.2)", color: "#10B981", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Beta</span>
            </h1>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>Build zero-trust, CIS-hardened container images tailored to your environment.</p>
          </div>
        </div>
        
        {/* Right Header Section */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          
          {/* Saved Profiles */}
          <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "12px", position: "relative" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Profile:</span>
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
                <button onClick={saveProfile} style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: "#10B981", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>Save</button>
                <button onClick={() => setIsSavingProfile(false)} style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none", cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>

          {/* Tier Selector */}
          <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", borderRadius: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginRight: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>License:</span>
            {['Free', 'Pro', 'Enterprise'].map(t => (
              <button
              key={t}
              onClick={() => setTier(t as SubscriptionTier)}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "8px",
                background: tier === t ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "transparent",
                color: tier === t ? "white" : "var(--text-muted)",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
                transition: "all 0.2s ease"
              }}
            >
              {t} {t === 'Free' ? '($0)' : t === 'Pro' ? '($49)' : '($149)'}
            </button>
            ))}
            <Link
              href="/account/subscription?product=pureos"
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#34D399",
                fontWeight: 700,
                fontSize: "0.8rem",
                textDecoration: "none",
                marginLeft: "0.25rem",
                whiteSpace: "nowrap"
              }}
            >
              Plans & Pricing ($0, $49, $149) →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: "flex", gap: "2rem", flex: 1, minHeight: 0 }}>
        
        {/* Sidebar Tabs */}
        <div className="glass-card" style={{ width: "260px", padding: "1rem", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                background: activeTab === tab.id ? "rgba(255,255,255,0.05)" : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                color: activeTab === tab.id ? "white" : "var(--text-muted)",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "0.95rem",
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: "all 0.2s ease"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}

          <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Build Summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>OS</span>
                <span style={{ color: "white" }}>{baseImage}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Hardening</span>
                <span style={{ color: "white" }}>{hardeningLevel}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Packages</span>
                <span style={{ color: "white" }}>{Object.values(includeTools).filter(Boolean).length} included</span>
              </div>
            </div>
            
            <button style={{ 
              marginTop: "1.5rem",
              width: "100%", 
              padding: "0.85rem", 
              borderRadius: "8px", 
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", 
              color: "white", 
              fontWeight: 600, 
              border: "1px solid rgba(255,255,255,0.1)", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}>
              <span>Compile Image</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="glass-card" style={{ flex: 1, padding: "2rem", borderRadius: "12px", overflowY: "auto", position: "relative" }}>
          
          {activeTab === 'base' && (
            <div className="fade-in">
              <h2 style={{ fontSize: "1.5rem", margin: "0 0 1.5rem 0", color: "white" }}>Select Base OS Foundation</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
                {[
                  { id: 'alpine-3.19', name: 'Alpine Linux 3.19', desc: 'Minimalist, musl libc, apk', icon: '🏔️', available: true },
                  { id: 'debian-12', name: 'Debian 12 (Bookworm)', desc: 'Stable, glibc, apt', icon: '🌀', available: true },
                  { id: 'ubuntu-24.04', name: 'Ubuntu 24.04 LTS', desc: 'Popular, glibc, apt', icon: '🟠', available: true },
                  { id: 'arch', name: 'Arch Linux', desc: 'Bleeding-edge, pacman', icon: '🦅', available: true },
                  { id: 'opensuse-15', name: 'openSUSE Leap 15', desc: 'Stable community release, zypper', icon: '🦎', available: true },
                  
                  { id: 'rpios-12', name: 'Raspberry Pi OS 12', desc: 'Debian-based ARM edge IoT', icon: '🍓', available: true },
                  { id: 'ubuntu-core', name: 'Ubuntu Core 22', desc: 'Transactional IoT edge, snaps', icon: '⚙️', available: isPro },
                  { id: 'yocto', name: 'Yocto OpenEmbedded', desc: 'Custom IoT firmware builder', icon: '🛠️', available: isPro },
                  { id: 'freertos-build', name: 'FreeRTOS / Arduino Chain', desc: 'Hardened MCU compile env', icon: '📟', available: isPro },

                  { id: 'win-nano', name: 'Windows Nano Server', desc: 'Minimal Windows container', icon: '🪟', available: isEnterprise },
                  { id: 'win-core', name: 'Windows Server Core', desc: 'Legacy .NET & IIS support', icon: '🗄️', available: isEnterprise },

                  { id: 'amazon-2023', name: 'Amazon Linux 2023', desc: 'Optimized for AWS EC2', icon: '☁️', available: isPro },
                  { id: 'rocky-9', name: 'Rocky Linux 9', desc: 'Enterprise downstream, dnf', icon: '🪨', available: isPro },
                  { id: 'almalinux-9', name: 'AlmaLinux 9', desc: 'Enterprise downstream, dnf', icon: '💠', available: isPro },
                  { id: 'centos-9', name: 'CentOS Stream 9', desc: 'Enterprise upstream, dnf', icon: '⚙️', available: isPro },
                  { id: 'rhel-9', name: 'Red Hat Ent Linux 9', desc: 'Commercial enterprise, dnf', icon: '🎩', available: isEnterprise },
                  { id: 'suse-15', name: 'SUSE Linux Enterprise 15', desc: 'Commercial enterprise, zypper', icon: '🏢', available: isEnterprise },
                  { id: 'oracle-9', name: 'Oracle Linux 9', desc: 'Commercial enterprise, dnf', icon: '🛡️', available: isEnterprise },
                ].map(img => (
                  <div 
                    key={img.id}
                    onClick={() => img.available && setBaseImage(img.id)}
                    style={{
                      padding: "1.5rem",
                      border: baseImage === img.id ? "2px solid #10B981" : "1px solid var(--border-color)",
                      borderRadius: "12px",
                      background: baseImage === img.id ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)",
                      cursor: img.available ? "pointer" : "not-allowed",
                      opacity: img.available ? 1 : 0.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                      position: "relative"
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{img.icon}</div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "white" }}>{img.name}</h3>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{img.desc}</p>
                    
                    {!img.available && (
                      <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", borderRadius: "8px", fontWeight: 600 }}>
                        {img.id === 'rhel-9' ? 'ENTERPRISE' : 'PRO'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* BYOS Entitlements Section */}
              {['rhel-9', 'suse-15', 'oracle-9'].includes(baseImage) && (
                <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "12px", animation: "fadeIn 0.3s ease" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "1.5rem", marginTop: "-2px" }}>🔑</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5, flex: 1 }}>
                          Building {baseImage.split('-')[0].toUpperCase()} with official package repositories requires an active subscription. Provide your subscription token to authorize the build worker.
                        </p>
                        <Link
                          href="/account/subscription?product=pureos"
                          style={{
                            padding: "0.4rem 0.85rem",
                            borderRadius: "6px",
                            background: "linear-gradient(135deg, #F59E0B, #D97706)",
                            color: "#000",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            whiteSpace: "nowrap"
                          }}
                        >
                          Get Subscription ($0, $49, $149) →
                        </Link>
                      </div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {baseImage === 'rhel-9' ? 'Red Hat Activation Key' : baseImage === 'suse-15' ? 'SUSE Customer Center Token' : 'Oracle Support Identifier (CSI)'}
                        </label>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <input 
                            type="password" 
                            placeholder="Enter your subscription token..."
                            style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.3)", color: "white", fontFamily: "monospace" }}
                          />
                          <button style={{ padding: "0 1.5rem", borderRadius: "8px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid var(--border-color)", cursor: "pointer", fontWeight: 600 }}>
                            Validate
                          </button>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                          Tokens are securely injected into the build container and <strong>never</strong> persisted to disk.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'hardening' && (
            <div className="fade-in">
              <h2 style={{ fontSize: "1.5rem", margin: "0 0 1.5rem 0", color: "white" }}>CIS Hardening & Compliance Profile</h2>
              
              {/* Windows Hardening Profiles */}
              {baseImage.startsWith('win-') ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div onClick={() => setHardeningLevel('win-standard')} style={{ padding: "1.5rem", border: hardeningLevel === 'win-standard' ? "2px solid #10B981" : "1px solid var(--border-color)", borderRadius: "12px", background: hardeningLevel === 'win-standard' ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)", cursor: "pointer", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + (hardeningLevel === 'win-standard' ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>{hardeningLevel === 'win-standard' && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />}</div>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "white" }}>Windows Baseline (CIS Level 1)</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Disables SMBv1, forces NTLMv2, disables weak cipher suites, and removes telemetry endpoints.</p>
                    </div>
                  </div>
                  <div onClick={() => isPro && setHardeningLevel('win-strict')} style={{ padding: "1.5rem", border: hardeningLevel === 'win-strict' ? "2px solid #10B981" : "1px solid var(--border-color)", borderRadius: "12px", background: hardeningLevel === 'win-strict' ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)", cursor: isPro ? "pointer" : "not-allowed", opacity: isPro ? 1 : 0.5, display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative" }}>
                    {!isPro && <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", borderRadius: "8px", fontWeight: 600 }}>PRO REQUIRED</div>}
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + (hardeningLevel === 'win-strict' ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>{hardeningLevel === 'win-strict' && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />}</div>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "white" }}>Strict Domain Guard (CIS Level 2)</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Enforces gMSA (Group Managed Service Accounts), PowerShell Constrained Language Mode, and AppLocker rules.</p>
                    </div>
                  </div>
                  <div onClick={() => isEnterprise && setHardeningLevel('win-stig')} style={{ padding: "1.5rem", border: hardeningLevel === 'win-stig' ? "2px solid #10B981" : "1px solid var(--border-color)", borderRadius: "12px", background: hardeningLevel === 'win-stig' ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)", cursor: isEnterprise ? "pointer" : "not-allowed", opacity: isEnterprise ? 1 : 0.5, display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative" }}>
                    {!isEnterprise && <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", borderRadius: "8px", fontWeight: 600 }}>ENTERPRISE REQUIRED</div>}
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + (hardeningLevel === 'win-stig' ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>{hardeningLevel === 'win-stig' && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />}</div>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "white" }}>DoD STIG / High Security</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Full Department of Defense Security Technical Implementation Guide (STIG) compliance for container workloads.</p>
                    </div>
                  </div>
                </div>
              ) : ['yocto', 'freertos-build', 'ubuntu-core', 'rpios-12'].includes(baseImage) ? (
                /* IoT / Embedded Hardening Profiles */
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div onClick={() => setHardeningLevel('iot-standard')} style={{ padding: "1.5rem", border: hardeningLevel === 'iot-standard' ? "2px solid #10B981" : "1px solid var(--border-color)", borderRadius: "12px", background: hardeningLevel === 'iot-standard' ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)", cursor: "pointer", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + (hardeningLevel === 'iot-standard' ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>{hardeningLevel === 'iot-standard' && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />}</div>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "white" }}>IoT Minimal Footprint</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Removes all interactive shells, disables unnecessary hardware interfaces, and locks package managers.</p>
                    </div>
                  </div>
                  <div onClick={() => isPro && setHardeningLevel('iot-strict')} style={{ padding: "1.5rem", border: hardeningLevel === 'iot-strict' ? "2px solid #10B981" : "1px solid var(--border-color)", borderRadius: "12px", background: hardeningLevel === 'iot-strict' ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)", cursor: isPro ? "pointer" : "not-allowed", opacity: isPro ? 1 : 0.5, display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative" }}>
                    {!isPro && <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", borderRadius: "8px", fontWeight: 600 }}>PRO REQUIRED</div>}
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + (hardeningLevel === 'iot-strict' ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>{hardeningLevel === 'iot-strict' && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />}</div>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "white" }}>Transactional Edge Security</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Forces read-only root filesystems, AB boot rollback safeguards, and verifiable firmware signature checking.</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Linux Hardening Profiles */
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div onClick={() => setHardeningLevel('standard')} style={{ padding: "1.5rem", border: hardeningLevel === 'standard' ? "2px solid #10B981" : "1px solid var(--border-color)", borderRadius: "12px", background: hardeningLevel === 'standard' ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)", cursor: "pointer", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + (hardeningLevel === 'standard' ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>{hardeningLevel === 'standard' && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />}</div>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "white" }}>Standard Baseline (CIS Level 1)</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Essential security configuration. Removes unused default packages, sets secure file permissions, and patches known vulnerabilities.</p>
                    </div>
                  </div>
                  <div onClick={() => isPro && setHardeningLevel('strict')} style={{ padding: "1.5rem", border: hardeningLevel === 'strict' ? "2px solid #10B981" : "1px solid var(--border-color)", borderRadius: "12px", background: hardeningLevel === 'strict' ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)", cursor: isPro ? "pointer" : "not-allowed", opacity: isPro ? 1 : 0.5, display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative" }}>
                    {!isPro && <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", borderRadius: "8px", fontWeight: 600 }}>PRO REQUIRED</div>}
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + (hardeningLevel === 'strict' ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>{hardeningLevel === 'strict' && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />}</div>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "white" }}>Strict Defense (CIS Level 2)</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Defense-in-depth security. Highly restricted permissions, drops all ambient capabilities, enforces non-root execution.</p>
                    </div>
                  </div>
                  <div onClick={() => isEnterprise && setHardeningLevel('airgap')} style={{ padding: "1.5rem", border: hardeningLevel === 'airgap' ? "2px solid #10B981" : "1px solid var(--border-color)", borderRadius: "12px", background: hardeningLevel === 'airgap' ? "rgba(16, 185, 129, 0.05)" : "rgba(0,0,0,0.2)", cursor: isEnterprise ? "pointer" : "not-allowed", opacity: isEnterprise ? 1 : 0.5, display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative" }}>
                    {!isEnterprise && <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", borderRadius: "8px", fontWeight: 600 }}>ENTERPRISE REQUIRED</div>}
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + (hardeningLevel === 'airgap' ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>{hardeningLevel === 'airgap' && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />}</div>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "white" }}>Air-Gapped Paranoia (Custom)</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Ultimate lockdown. Stripped package managers, read-only root filesystems, strict syscall filtering (seccomp).</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="fade-in">
              <h2 style={{ fontSize: "1.5rem", margin: "0 0 1.5rem 0", color: "white" }}>Inject Utilities & Runtimes</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Select the packages to pre-bake into your image. PureOS automatically verifies supply chain signatures for all selected tools.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {Object.keys(includeTools).map(tool => (
                  <div 
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    style={{ 
                      display: "flex", 
                      gap: "1rem", 
                      alignItems: "center", 
                      cursor: "pointer", 
                      background: includeTools[tool] ? "rgba(16, 185, 129, 0.1)" : "rgba(0,0,0,0.2)", 
                      border: includeTools[tool] ? "1px solid rgba(16, 185, 129, 0.5)" : "1px solid var(--border-color)",
                      padding: "1rem 1.5rem", 
                      borderRadius: "12px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: "2px solid " + (includeTools[tool] ? "#10B981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {includeTools[tool] && <div style={{ width: "10px", height: "10px", background: "#10B981", borderRadius: "2px" }} />}
                    </div>
                    <span style={{ textTransform: "capitalize", fontWeight: 600, color: "white" }}>{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scanner' && (
            <div className="fade-in">
              <h2 style={{ fontSize: "1.5rem", margin: "0 0 1.5rem 0", color: "white" }}>Vulnerability Scanner Integrations</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Integrate continuous scanning directly into the generated Dockerfile.</p>
              
              <div style={{ padding: "2rem", background: "rgba(0,0,0,0.2)", border: "1px dashed var(--border-color)", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white" }}>Trivy & Grype Native Support</h3>
                <p style={{ color: "var(--text-muted)", margin: "0 auto", maxWidth: "400px" }}>
                  By default, PureOS images are guaranteed zero-CVE upon generation. Add scanning hooks to your pipeline to maintain this guarantee.
                </p>
                <button disabled style={{ marginTop: "1.5rem", padding: "0.6rem 1.5rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-muted)", cursor: "not-allowed" }}>
                  Enable Pipeline Hooks (Coming Soon)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'output' && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", margin: 0, color: "white" }}>Review & Export</h2>
                <button 
                  onClick={() => setShowSbomModal(true)}
                  className="btn-primary" 
                  style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid #10B981", borderRadius: "8px", cursor: "pointer" }}
                >
                  <FileCode size={16} /> View SBOM Payload
                </button>
              </div>
              
              <div style={{ background: "#0D1117", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: "0.9rem", color: "#E6EDF3", lineHeight: 1.6, overflowX: "auto" }}>
                <span style={{ color: "#8B949E" }}># Generated by Exultia PureOS Configurator</span><br/>
                <span style={{ color: "#FF7B72" }}>FROM</span> exultia/pureos-{baseImage}:latest AS base<br/>
                <br/>
                <span style={{ color: "#8B949E" }}># Hardening Profile: {hardeningLevel.toUpperCase()}</span><br/>
                <span style={{ color: "#FF7B72" }}>ENV</span> PUREOS_HARDENING_PROFILE={hardeningLevel}<br/>
                {hardeningLevel === 'airgap' && <><span style={{ color: "#FF7B72" }}>ENV</span> PUREOS_SECCOMP_STRICT=1<br/></>}
                <br/>
                {Object.values(includeTools).some(Boolean) && (
                  <>
                    <span style={{ color: "#8B949E" }}># Injecting Selected Utilities</span><br/>
                    <span style={{ color: "#FF7B72" }}>RUN</span> pureos-pkg-mgr install -y \ <br/>
                    {Object.entries(includeTools).filter(([_, v]) => v).map(([tool]) => `  ${tool}`).join(' \\\n')}<br/>
                    <br/>
                  </>
                )}
                <span style={{ color: "#8B949E" }}># Finalize Zero-Trust Layer</span><br/>
                <span style={{ color: "#FF7B72" }}>USER</span> pureos_user<br/>
                <span style={{ color: "#FF7B72" }}>CMD</span> ["/bin/pureos-init"]<br/>
              </div>
            </div>
          )}

        </div>
      </div>

      {showSbomModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "2rem" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "800px", maxHeight: "80vh", borderRadius: "16px", display: "flex", flexDirection: "column", animation: "scaleIn 0.2s ease" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileCode size={20} color="#10B981" /> 
                SBOM & Manifest - exultia/pureos-{baseImage}:latest
              </h2>
              <button onClick={() => setShowSbomModal(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.5rem" }}>&times;</button>
            </div>
            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1, background: "#0D1117", fontFamily: "monospace", fontSize: "0.85rem", color: "#E6EDF3", whiteSpace: "pre-wrap" }}>
{`{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "serialNumber": "urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79",
  "version": 1,
  "metadata": {
    "timestamp": "${new Date().toISOString()}",
    "component": {
      "type": "container",
      "name": "exultia/pureos-${baseImage}",
      "version": "latest",
      "description": "Exultia PureOS Hardened Image"
    }
  },
  "components": [
    {
      "type": "operating-system",
      "name": "${baseImage}",
      "version": "latest",
      "properties": [
        { "name": "hardening_profile", "value": "${hardeningLevel}" }
      ]
    },
${baseImage.startsWith('win-') ? `    {
      "type": "framework",
      "name": "Microsoft.NETCore.App",
      "version": "8.0.0"
    },
    {
      "type": "library",
      "name": "msvcrt.dll",
      "version": "10.0.20348.1"
    }` : baseImage.includes('rpios') || baseImage.includes('ubuntu-core') ? `    {
      "type": "firmware",
      "name": "raspberrypi-bootloader",
      "version": "1.20230405-1"
    },
    {
      "type": "library",
      "name": "musl",
      "version": "1.2.3"
    }` : `    {
      "type": "library",
      "name": "openssl",
      "version": "3.0.2",
      "cpe": "cpe:2.3:a:openssl:openssl:3.0.2:*:*:*:*:*:*:*"
    },
    {
      "type": "library",
      "name": "glibc",
      "version": "2.35"
    }`}
  ],
  "vulnerabilities": []
}`}
            </div>
            <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button onClick={() => setShowSbomModal(false)} className="btn-secondary" style={{ padding: "0.75rem 1.5rem", borderRadius: "8px" }}>Close</button>
              <button className="btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}><Download size={16} /> Download JSON</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
