import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="fade-in" style={{ padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* HEADER HERO */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="hero-badge" style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
          ✓ Unified Architecture & Governance Platform
        </span>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Enterprise Security, Threat Intelligence & Multi-IDE Governance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Explore the defense-in-depth security architecture, 5-source threat intelligence feeds, deterministic binary hardening, and zero-telemetry packaging built into SecureIDE.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/console" className="btn-primary" style={{ padding: '0.85rem 1.75rem', textDecoration: 'none', fontSize: '0.95rem' }}>
            Open Builder Console →
          </Link>
          <Link href="/pricing" style={{ padding: '0.85rem 1.75rem', textDecoration: 'none', fontSize: '0.95rem', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600 }}>
            Compare Plans & Pricing
          </Link>
        </div>
      </div>

      {/* FEATURE 1: SUPPLY CHAIN SANDBOXING & 0-CVE / DEPRECATION GOVERNANCE */}
      <div id="sandbox" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center', marginBottom: '6rem' }}>
        <div>
          <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Supply Chain Defense & Universal Engine Support
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
            Zero-Trust Extension Sandboxing Across 5 Major IDEs
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Standard open-source IDEs allow developers to install arbitrary marketplace extensions that execute native binaries with full filesystem and network access. SecureIDE wraps your choice of engine (VS Code, Theia, Zed, Neovim, JupyterLab) with deterministic policy gates.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Strict 0 Open CVEs Baseline</strong>: Any extension with reported vulnerabilities is blocked from baseline bundling.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Deprecation-as-Vulnerability Detection</strong>: Deprecated or end-of-life packages are flagged with threat advisories and gated on the Community tier.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Universal IDE Matrix</strong>: Unified catalog supporting VS Code, Eclipse Theia, Zed (Rust), Neovim (LazyVim), and JupyterLab.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Auto-Included Remote-SSH</strong>: Engine-specific secure remote development bridges included across all non-zero blueprint stacks.</div>
            </li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 700 }}>Extension Permission Sandbox</span>
            <span className="status-chip approved">Enforced</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <div style={{ padding: '0.65rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Outbound Network Sockets:</span>
              <span style={{ color: '#F87171', fontWeight: 600 }}>BLOCKED (Air-Gapped)</span>
            </div>
            <div style={{ padding: '0.65rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Subprocess Spawning:</span>
              <span style={{ color: '#FBBF24', fontWeight: 600 }}>AUDITED & RESTRICTED</span>
            </div>
            <div style={{ padding: '0.65rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Credential & Token Access:</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>ISOLATED</span>
            </div>
            <div style={{ padding: '0.65rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Telemetry & Beacons:</span>
              <span style={{ color: '#F87171', fontWeight: 600 }}>PERMANENTLY ZEROED</span>
            </div>
            <div style={{ padding: '0.65rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Workspace Filesystem Scope:</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>ALLOWED (Isolated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 2: 5-SOURCE THREAT INTELLIGENCE & RESEARCH FEEDS */}
      <div id="threat-feed" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '3.5rem', alignItems: 'center', marginBottom: '6rem' }}>
        <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>📡</span> Synchronized Threat Feeds
            </span>
            <a href="/api/threat-feed" target="_blank" style={{ fontSize: '0.75rem', color: '#60A5FA', textDecoration: 'none', background: 'rgba(59,130,246,0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, border: '1px solid var(--accent-primary)' }}>
              Open REST API (JSON) ↗
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#93C5FD' }}>🏛️ NIST NVD / GHSA / OSV.dev</strong>
                <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 600 }}>LIVE CVE GATE</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Continuous CVE ingestion and CVSS severity mapping.</p>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#34D399' }}>🐸 JFrog Security Research</strong>
                <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 600 }}>REACHABILITY ANALYSIS</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluates practical runtime IPC exploitability and AST-level injection.</p>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#60A5FA' }}>🌊 Aqua Nautilus Research</strong>
                <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 600 }}>ANTI-TYPOSQUAT</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Marketplace publisher impersonation and trojanized package detection.</p>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#FBBF24' }}>🔌 Socket.dev Threat Engine</strong>
                <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 600 }}>BEHAVIORAL HEURISTICS</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Detects credential theft, child process execution, and exfiltration.</p>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#A78BFA' }}>🎖️ OpenSSF Scorecards</strong>
                <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 600 }}>SUPPLY CHAIN HEALTH</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automated branch protection checks and dependency pinning metrics.</p>
            </div>
          </div>
        </div>

        <div>
          <div style={{ color: '#34D399', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Multi-Feed Threat Intelligence
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
            Consensus Threat Intelligence from Leading Security Teams
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Rather than relying solely on lagging CVE registries, SecureIDE correlates signals from premier cybersecurity research organizations to proactively protect developers from poisoned upstream updates and trojanized tools.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Contextual Exploitability</strong>: Distinguishes theoretical CVEs in packaged dependencies from reachable IPC attack vectors.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Marketplace Impersonation Shield</strong>: Blocks typosquatting packages that mimic trusted publishers like Microsoft or Prettier.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Pre-Build AST & Socket Inspection</strong>: Automated static analysis to detect hidden subprocess spawning or unauthorized token access prior to bundling.</div>
            </li>
          </ul>
        </div>
      </div>

      {/* FEATURE 3: IDE HARDENING & SUPPLY CHAIN POLICY AS CODE */}
      <div id="hardening" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center', marginBottom: '6rem' }}>
        <div>
          <div style={{ color: 'var(--accent-secondary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Deterministic Binary Hardening
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
            IDE Hardening & Supply-Chain Policy as Code
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Enforce mandatory editor sandbox boundaries and supply-chain lockdowns directly within the compiled IDE binary, outputting cryptographic <code>policy.json</code> configurations that cannot be tampered with by workstation users.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Air-Gap Extension Lockdown</strong>: Prevents unauthorized in-editor extension downloads; only pre-bundled, vetted tools can execute.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Extension Auto-Update Freeze</strong>: Locks extension versions to eliminate silent upstream supply chain poisoning.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Strict Workspace Trust Boundary</strong>: Prohibits auto-execution of untrusted build tasks or debug scripts in unverified directories.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Total Telemetry Nullification</strong>: Shuts down all editor analytics, tracking beacons, and crash report uploads.</div>
            </li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#93C5FD' }}>enforced policy.json</span>
            <span className="status-chip approved">Hardened</span>
          </div>
          <pre style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '8px', color: '#38BDF8', fontSize: '0.8rem', lineHeight: '1.6', overflowX: 'auto', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.06)' }}>
{`{
  "telemetry.telemetryLevel": "off",
  "telemetry.enableCrashReporter": false,
  "telemetry.enableTelemetry": false,
  "update.mode": "none",
  "extensions.autoUpdate": false,
  "extensions.autoCheckUpdates": false,
  "extensions.ignoreRecommendations": true,
  "security.workspace.trust.enabled": true,
  "security.workspace.trust.startupPrompt": "always"
}`}
          </pre>
        </div>
      </div>

      {/* FEATURE 4: ENTERPRISE WHITE-LABEL BRAND STUDIO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '3.5rem', alignItems: 'center', marginBottom: '6rem' }}>
        <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
          <div className="ide-titlebar" style={{ borderRadius: '8px 8px 0 0' }}>
            <span>[Citadel Studio] — Zero-Trust Enterprise Edition</span>
            <span style={{ color: '#34D399' }}>● Air-Gap Verified</span>
          </div>
          <div style={{ background: '#181824', padding: '1.5rem', borderRadius: '0 0 8px 8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.85rem', color: '#93C5FD', fontFamily: 'monospace', lineHeight: '1.8' }}>
              ✓ Corporate Binary: Citadel Studio v2.4.0<br/>
              ✓ Corporate Theme: Quantum Blue (#3B82F6)<br/>
              ✓ Internal IT Helpdesk: https://it.citadel.corp<br/>
              ✓ Sec-Ops Incident Channel: #sec-ops-alert<br/>
              ✓ Zero Telemetry & Air-Gapped Internal Gallery
            </div>
          </div>
        </div>

        <div>
          <div style={{ color: '#FBBF24', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Enterprise Whitelabeling & Branding
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
            Custom Brand & Identity Studio (Enterprise)
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Compile an IDE that looks and feels like a native part of your engineering organization. Customize application binary names, window titles, splash screens, accent color swatches, and embed direct routing to internal IT support and SOC2 incident channels.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/console" className="btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.95rem' }}>
              Open Brand Studio in Console →
            </Link>
          </div>
        </div>
      </div>

      {/* CORE SECURITY & ARCHITECTURE COMMITMENTS */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>Our Core Security Commitments</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#34D399' }}>1.</span> Zero Outbound Telemetry Architecture
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Standard upstream IDE binaries transmit anonymous telemetry back to cloud endpoints. SecureIDE completely zeros all telemetry beacons across VS Code, Eclipse Theia, Zed, Neovim, and JupyterLab at the core engine level.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#60A5FA' }}>2.</span> Immutable Cryptographic CycloneDX SBOMs
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Every single distribution is accompanied by a CycloneDX 1.5 JSON Software Bill of Materials with individual SHA-256 integrity hashes for the main binary, runtime (Electron/Node/Rust), and all bundled plugins.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#A78BFA' }}>3.</span> Stateless Engine & Zero Customer Data Custody
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              SecureIDE operates as a completely stateless build tool. We never store customer source code, build logs, or compliance data on our servers. All CycloneDX SBOMs and SHA-256 manifests output directly to your own storage.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#FBBF24' }}>4.</span> Community Verified & Zero-CVE Policy Auditing
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Our baseline whitelist automatically validates that every plugin is from a verified publisher with community reputation and 0 open CVEs in NVD / GitHub Security Advisories before approval.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to Build Your Hardened Developer Workstation?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Start building zero-trust, multi-IDE developer distributions in under 60 seconds with our interactive web console.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/console" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem', textDecoration: 'none' }}>
            Open Builder Console Free →
          </Link>
          <Link href="/pricing" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600 }}>
            View Pricing Plans
          </Link>
        </div>
      </div>

    </div>
  );
}
