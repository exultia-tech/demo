"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PureOsIcon } from '@/components/BrandIcons';
import { Download, FileCode } from 'lucide-react';

type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise';
type ActiveTab = 'base' | 'hardening' | 'packages' | 'scanner' | 'output';


interface OsPackage {
  name: string;
  category: string;
  description: string;
  downloadCount: number;
  securityGrade: "A+" | "B" | "C";
  cveCount: number;
  cveAdvisory?: { id: string; details: string; severity: "CRITICAL" | "HIGH" | "MEDIUM" };
  verified: boolean;
}

const OS_PACKAGES: OsPackage[] = [
  { name: "curl", category: "Networking", description: "Command line tool and library for transferring data with URLs.", downloadCount: 500000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "wget", category: "Networking", description: "The non-interactive network downloader.", downloadCount: 300000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "jq", category: "Utilities", description: "Command-line JSON processor.", downloadCount: 80000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "git", category: "Development", description: "Fast, scalable, distributed revision control system.", downloadCount: 400000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "python3", category: "Language", description: "Interactive high-level object-oriented language.", downloadCount: 200000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "nodejs", category: "Language", description: "Evented I/O for V8 javascript.", downloadCount: 150000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "docker", category: "Systems", description: "Linux container runtime.", downloadCount: 100000000, securityGrade: "B", cveCount: 1, cveAdvisory: { id: "CVE-2024-21626", severity: "HIGH", details: "LeakyCrates container breakout vulnerability. A vulnerability in runc allows malicious containers to break out and gain host access." }, verified: true },
  { name: "vim", category: "Utilities", description: "Vi IMproved - enhanced vi editor.", downloadCount: 90000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "htop", category: "Utilities", description: "Interactive processes viewer.", downloadCount: 50000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "tmux", category: "Utilities", description: "Terminal multiplexer.", downloadCount: 40000000, securityGrade: "A+", cveCount: 0, verified: true },
  { name: "apache-log4j", category: "Library", description: "Log4j logging library.", downloadCount: 10000000, securityGrade: "C", cveCount: 3, cveAdvisory: { id: "CVE-2021-44228", severity: "CRITICAL", details: "Log4Shell. JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints." }, verified: false },
  { name: "openssh-server", category: "Networking", description: "Secure shell server.", downloadCount: 200000000, securityGrade: "B", cveCount: 1, cveAdvisory: { id: "CVE-2024-6387", severity: "HIGH", details: "regreSSHion: Unauthenticated remote code execution vulnerability in OpenSSH's server (sshd) granting full root access." }, verified: true },
  { name: "xz-utils", category: "Utilities", description: "XZ-format compression utilities.", downloadCount: 100000000, securityGrade: "C", cveCount: 1, cveAdvisory: { id: "CVE-2024-3094", severity: "CRITICAL", details: "Supply chain compromise in liblzma affecting sshd. Malicious code allows unauthorized access and arbitrary code execution." }, verified: false },
];

export default function PureOSConfigurator() {
  const [tier, setTier] = useState<SubscriptionTier>('Free');
  const [activeTab, setActiveTab] = useState<ActiveTab>('base');
  
  const [baseImage, setBaseImage] = useState('alpine-3.19');
  const [hardeningLevel, setHardeningLevel] = useState('standard');
  const [includeTools, setIncludeTools] = useState<Record<string, boolean>>({
    curl: true,
    wget: false,
    jq: false,
    git: false,
    python: false,
    node: false,
    go: false,
    rust: false,
    docker: false,
    vim: false,
    htop: false,
    tmux: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [inspectingPkg, setInspectingPkg] = useState<OsPackage | null>(null);
  
  // Convert includeTools to an array for easy rendering, but keep backward compatibility
  const [showSbomModal, setShowSbomModal] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setActiveTab('output');
    }, 1500);
  };


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
              Plans & Pricing →
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
            
            <button 
              onClick={handleCompile}
              style={{ 
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
              <span>{isCompiling ? 'Compiling...' : 'Compile Image'}</span>
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
                          Get Subscription →
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
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.6rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", margin: "0", color: "white" }}>Verified OS Marketplace</h2>
                  <p style={{ color: "var(--text-muted)", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>Select packages to pre-bake. Callouts indicate open vulnerabilities or supply chain risks.</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px', justifyContent: 'flex-end' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
                    <input 
                      type="text" 
                      placeholder="Search packages..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.52rem 0.9rem 0.52rem 2.2rem',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        outline: 'none'
                      }}
                    />
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.45, fontSize: '0.8rem', pointerEvents: 'none' }}>
                      🔍
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div 
                    style={{ 
                      maxHeight: 'calc(100vh - 280px)',
                      minHeight: '340px',
                      overflowY: 'auto', 
                      overflowX: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div 
                      style={{ 
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        display: 'grid', 
                        gridTemplateColumns: '36px minmax(200px, 2fr) 100px 110px 140px 75px', 
                        padding: '0.75rem 1rem', 
                        background: 'rgba(15, 23, 42, 0.98)', 
                        backdropFilter: 'blur(16px)',
                        borderBottom: '1px solid var(--border-color)', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: 'var(--text-muted)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em', 
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)'
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                      </div>
                      <div>Package & Category</div>
                      <div>Downloads</div>
                      <div>Provenance</div>
                      <div>Security / CVE</div>
                      <div style={{ textAlign: 'right' }}>Audit</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {OS_PACKAGES.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())).map((pkg, rowIdx) => {
                        const inCart = !!includeTools[pkg.name];
                        const formattedDownloads = pkg.downloadCount >= 1000000 
                            ? `${(pkg.downloadCount / 1000000).toFixed(1)}M` 
                            : `${pkg.downloadCount}`;

                        return (
                          <div 
                            key={pkg.name}
                            onClick={(e) => {
                              if ((e.target as HTMLElement).closest('button, a, input')) return;
                              if (pkg.cveCount > 0 && !inCart) {
                                setInspectingPkg(pkg);
                              } else {
                                toggleTool(pkg.name);
                              }
                            }}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '36px minmax(200px, 2fr) 100px 110px 140px 75px',
                              padding: '0.6rem 1rem',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                              background: inCart ? 'rgba(59, 130, 246, 0.08)' : rowIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}>
                            
                            <div style={{ textAlign: 'center' }}>
                              <input 
                                type="checkbox"
                                checked={inCart}
                                onChange={() => {
                                  if (pkg.cveCount > 0 && !inCart) {
                                    setInspectingPkg(pkg);
                                  } else {
                                    toggleTool(pkg.name);
                                  }
                                }}
                                style={{ cursor: 'pointer', transform: 'scale(1.15)', accentColor: 'var(--accent-primary)' }}
                              />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, paddingRight: '0.5rem' }}>
                              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>📦</div>
                              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: inCart ? '#93C5FD' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {pkg.name}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {pkg.category}
                                  </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {pkg.description}
                                </p>
                              </div>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>
                              {formattedDownloads}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden' }}>
                              {pkg.verified ? (
                                <span className="github-badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', background: 'rgba(52, 211, 153, 0.1)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.25)' }} title="Verified Publisher Identity">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="github-badge unverified" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
                                  Unverified
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span className={`risk-grade ${pkg.securityGrade === 'A+' ? 'grade-a' : pkg.securityGrade === 'B' ? 'grade-b' : 'grade-c'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                                {pkg.securityGrade}
                              </span>
                              {pkg.cveCount > 0 ? (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setInspectingPkg(pkg); }}
                                  className="github-badge unverified" 
                                  title="Click to view CVE advisory and risk audit"
                                  style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.35)', cursor: 'pointer', fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                                  🚨 {pkg.cveAdvisory?.id || 'CVE'}
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 500 }}>
                                  0 CVE
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem' }}>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setInspectingPkg(pkg); }}
                                style={{
                                  padding: '0.25rem 0.6rem',
                                  borderRadius: '6px',
                                  border: '1px solid var(--border-color)',
                                  background: 'rgba(255,255,255,0.06)',
                                  color: 'var(--text-muted)',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                                title="Audit package security metadata">
                                Audit
                              </button>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
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


      {/* AUDIT MODAL */}
      {inspectingPkg && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "2rem" }} onClick={() => setInspectingPkg(null)}>
          <div className="glass-card" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px", borderRadius: "16px", display: "flex", flexDirection: "column", background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "2rem" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem" }}>Audit: {inspectingPkg.name}</h2>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <span>Security Grade:</span>
                <strong style={{ color: inspectingPkg.securityGrade === 'A+' ? '#34D399' : inspectingPkg.securityGrade === 'B' ? '#FBBF24' : '#F87171' }}>{inspectingPkg.securityGrade}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <span>CVE Count:</span>
                <strong style={{ color: inspectingPkg.cveCount === 0 ? '#34D399' : '#F87171' }}>{inspectingPkg.cveCount} Detected</strong>
              </div>
              {inspectingPkg.cveAdvisory && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#F87171' }}>⚠️ Security Advisory</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', background: inspectingPkg.cveAdvisory.severity === 'CRITICAL' ? '#EF4444' : '#F97316', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>{inspectingPkg.cveAdvisory.severity}</span>
                      <strong style={{ color: '#F87171' }}>{inspectingPkg.cveAdvisory.id}</strong>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {inspectingPkg.cveAdvisory.details}
                  </p>
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
              <button onClick={() => setInspectingPkg(null)} className="btn-secondary" style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid var(--border-color)", cursor: "pointer" }}>Close</button>
              
              <button 
                onClick={() => { toggleTool(inspectingPkg.name); setInspectingPkg(null); }}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: inspectingPkg.cveCount > 0 ? "rgba(239, 68, 68, 0.85)" : "var(--accent-primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
                {includeTools[inspectingPkg.name] ? 'Remove from Build' : inspectingPkg.cveCount > 0 ? '⚠️ Acknowledge Risk & Add' : 'Add to Build'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
