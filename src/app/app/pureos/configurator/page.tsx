"use client";

import React, { useState } from 'react';
import { PureOsIcon } from '@/components/BrandIcons';

type Tier = 'Free' | 'Pro' | 'Enterprise';

export default function PureOSConfigurator() {
  const [tier, setTier] = useState<Tier>('Free');
  const [baseImage, setBaseImage] = useState('alpine-3.19');
  const [hardeningLevel, setHardeningLevel] = useState('standard');
  const [includeTools, setIncludeTools] = useState<Record<string, boolean>>({
    curl: true,
    jq: false,
    python: false,
    node: false,
  });

  const isPro = tier === 'Pro' || tier === 'Enterprise';
  const isEnterprise = tier === 'Enterprise';

  const toggleTool = (tool: string) => {
    setIncludeTools(prev => ({ ...prev, [tool]: !prev[tool] }));
  };

  return (
    <div className="fade-in" style={{ padding: "2rem", maxWidth: "1440px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <PureOsIcon size={40} glow={true} />
        <div>
          <h1 style={{ fontSize: "2.2rem", margin: 0 }}>Image Configurator</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Build custom, zero-trust container images tailored to your license tier.</p>
        </div>
      </header>

      {/* Tier Selector for Demonstration */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        <strong style={{ alignSelf: "center", marginRight: "1rem" }}>Simulate License Tier:</strong>
        {['Free', 'Pro', 'Enterprise'].map(t => (
          <button
            key={t}
            onClick={() => setTier(t as Tier)}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              background: tier === t ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "transparent",
              color: tier === t ? "white" : "var(--text-muted)",
              border: tier === t ? "none" : "1px solid var(--border-color)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Base Image Selection */}
          <section className="glass-card" style={{ padding: "1.5rem", borderRadius: "12px" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>1. Select Base OS</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              {[
                { id: 'alpine-3.19', name: 'Alpine 3.19', available: true },
                { id: 'debian-12', name: 'Debian 12', available: true },
                { id: 'ubuntu-24.04', name: 'Ubuntu 24.04', available: true },
                { id: 'rocky-9', name: 'Rocky Linux 9', available: isPro },
                { id: 'centos-9', name: 'CentOS Stream 9', available: isPro },
                { id: 'rhel-9', name: 'Red Hat Ent 9', available: isEnterprise },
              ].map(img => (
                <div 
                  key={img.id}
                  onClick={() => img.available && setBaseImage(img.id)}
                  style={{
                    padding: "1rem",
                    border: baseImage === img.id ? "2px solid #10B981" : "1px solid var(--border-color)",
                    borderRadius: "8px",
                    background: baseImage === img.id ? "rgba(16, 185, 129, 0.1)" : "rgba(0,0,0,0.3)",
                    cursor: img.available ? "pointer" : "not-allowed",
                    opacity: img.available ? 1 : 0.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{img.name}</span>
                  {!img.available && (
                    <span style={{ fontSize: "0.75rem", color: "#F59E0B" }}>
                      Requires {img.id === 'rhel-9' ? 'Enterprise' : 'Pro'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Hardening Level */}
          <section className="glass-card" style={{ padding: "1.5rem", borderRadius: "12px" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>2. CIS Hardening Level</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <label style={{ display: "flex", gap: "1rem", alignItems: "center", cursor: "pointer" }}>
                <input type="radio" checked={hardeningLevel === 'standard'} onChange={() => setHardeningLevel('standard')} />
                <div>
                  <div style={{ fontWeight: 600 }}>Standard Baseline (Level 1)</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Essential security configuration without breaking legacy app compatibility.</div>
                </div>
              </label>
              
              <label style={{ display: "flex", gap: "1rem", alignItems: "center", cursor: isPro ? "pointer" : "not-allowed", opacity: isPro ? 1 : 0.5 }}>
                <input type="radio" checked={hardeningLevel === 'strict'} onChange={() => isPro && setHardeningLevel('strict')} disabled={!isPro} />
                <div>
                  <div style={{ fontWeight: 600 }}>Strict Defense (Level 2) { !isPro && <span style={{ fontSize: "0.75rem", color: "#F59E0B", marginLeft: "8px" }}>(Pro/Enterprise)</span> }</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Defense-in-depth security. Highly restricted permissions, requires tailored app configurations.</div>
                </div>
              </label>

              <label style={{ display: "flex", gap: "1rem", alignItems: "center", cursor: isEnterprise ? "pointer" : "not-allowed", opacity: isEnterprise ? 1 : 0.5 }}>
                <input type="radio" checked={hardeningLevel === 'airgap'} onChange={() => isEnterprise && setHardeningLevel('airgap')} disabled={!isEnterprise} />
                <div>
                  <div style={{ fontWeight: 600 }}>Air-Gapped Paranoia (Custom) { !isEnterprise && <span style={{ fontSize: "0.75rem", color: "#F59E0B", marginLeft: "8px" }}>(Enterprise Only)</span> }</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Stripped package managers, read-only root filesystems, and strict syscall filtering (seccomp).</div>
                </div>
              </label>
            </div>
          </section>

          {/* Dev Tools */}
          <section className="glass-card" style={{ padding: "1.5rem", borderRadius: "12px" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>3. Included Packages</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {Object.keys(includeTools).map(tool => (
                <label key={tool} style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer", background: "rgba(0,0,0,0.2)", padding: "0.75rem 1rem", borderRadius: "8px" }}>
                  <input type="checkbox" checked={includeTools[tool]} onChange={() => toggleTool(tool)} />
                  <span style={{ textTransform: "capitalize" }}>{tool}</span>
                </label>
              ))}
            </div>
          </section>

        </div>

        {/* Build Summary Panel */}
        <div className="glass-card" style={{ position: "sticky", top: "2rem", padding: "1.5rem", borderRadius: "12px" }}>
          <h3 style={{ margin: "0 0 1rem 0", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>Build Summary</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Base Image</span>
              <span style={{ fontWeight: 600 }}>{baseImage}</span>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Hardening</span>
              <span style={{ fontWeight: 600 }}>{hardeningLevel}</span>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Packages</span>
              <span style={{ fontWeight: 600 }}>{Object.keys(includeTools).filter(t => includeTools[t]).length} Selected</span>
            </li>
          </ul>

          <div style={{ padding: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: "8px", marginBottom: "1.5rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#10B981" }}>
            FROM exultia/pureos-{baseImage}<br/>
            # Applying {hardeningLevel} profiles...<br/>
            # Generating Dockerfile...
          </div>

          <button style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", color: "white", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "1rem" }}>
            Generate & Download
          </button>
        </div>
      </div>
    </div>
  );
}
