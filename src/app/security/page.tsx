import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="fade-in" style={{ padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* HEADER HERO */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <span className="hero-badge" style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
          🔒 Zero-Trust Endpoint Architecture & Threat Governance
        </span>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Enterprise Security Architecture
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '840px', margin: '0 auto', lineHeight: '1.6' }}>
          SecureIDE eliminates the developer workstation as an attack vector through Unified Vulnerability Intelligence (UVI), immutable binary encapsulation, and isolated zero-custody cloud orchestration.
        </p>
      </div>

      {/* 4 DEFENSE-IN-DEPTH LAYERS */}
      <div style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Defense-in-Depth Endpoint Protection</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
            A four-tier containment model ensuring developer releases cannot be tampered with on disk, bypassed locally, or compromised via unvetted marketplace access.
          </p>
        </div>

        <div className="feature-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          
          <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              1
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Immutable Binary Encapsulation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Governance rules, air-gap registry routes, and core security boundaries are sealed directly into the native runtime binary, eliminating editable plaintext configurations on disk.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              2
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>OS-Protected Directory Scopes</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Installers target root system directories (<code>Program Files</code> / <code>Applications</code>), enforcing standard non-admin read-only permissions so users cannot modify bundled extension payloads.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.15)', border: '1px solid rgba(167, 139, 250, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              3
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Code-Signing & EDR Integrity</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Cryptographic signatures bind binary contents. Any disk-level modification invalidates the digital signature, triggering immediate Windows Defender WDAC and macOS Gatekeeper execution blocks.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              4
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Network Egress Sandboxing</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Default public marketplace endpoints are removed. Editor network traffic is restricted to your private internal registry proxy (e.g. JFrog Artifactory) or completely air-gapped from outbound traffic.
            </p>
          </div>

        </div>
      </div>

      {/* RECONCILING WITH UNIFIED VULNERABILITY INTELLIGENCE (UVI) */}
      <div className="glass-card" style={{ padding: '3rem', marginBottom: '6rem', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#34D399', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Threat Intelligence Integration
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
              Unified Vulnerability Intelligence (UVI) Gate
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Before any extension, language server (LSP), or compiler binary is packaged into a release, it is verified against the <strong>Unified Vulnerability Intelligence (UVI)</strong> multi-feed. Our build engine correlates signals across 12+ public and research databases to block threats at build-time.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
                <div><strong>Live CVE & KEV Hard Stop</strong>: Zero builds are generated with unmitigated CVEs or CISA Known Exploited Vulnerabilities.</div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
                <div><strong>AST Reachability Analysis</strong>: Correlates JFrog and Trail of Bits research to evaluate runtime IPC call graphs and exploitability.</div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
                <div><strong>Anti-Typosquatting Shield</strong>: Verifies publisher cryptographic identity and blocks trojanized marketplace clones.</div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
                <div><strong>Behavioral Heuristics</strong>: Inspects extension code for hidden subprocess spawning, token theft, or unauthorized filesystem access.</div>
              </li>
            </ul>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#93C5FD' }}>UVI Feed Synchronizations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-muted)' }}>CVE Registries:</span>
                <span style={{ fontWeight: 600, color: '#34D399' }}>NIST NVD / Global CVE List</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Exploits:</span>
                <span style={{ fontWeight: 600, color: '#EF4444' }}>CISA KEV Catalog</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Open Source Advisories:</span>
                <span style={{ fontWeight: 600, color: '#60A5FA' }}>GitHub GHSA & OSV.dev</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Supply Chain Malware:</span>
                <span style={{ fontWeight: 600, color: '#F59E0B' }}>OpenSSF Malicious Packages</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Specialty Research:</span>
                <span style={{ fontWeight: 600, color: '#A78BFA' }}>Trail of Bits / JFrog / Socket</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Marketplace Defense:</span>
                <span style={{ fontWeight: 600, color: '#60A5FA' }}>Aqua Nautilus Anti-Typosquat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLOUD PIPELINE & ZERO CUSTODY */}
      <div className="glass-card" style={{ padding: '3rem', marginBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#34D399', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Stateless Cloud Orchestration
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
              Isolated Multi-OS Cloud Pipeline
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Builds are executed inside dedicated, isolated cloud sandboxes. Each build environment is provisioned on-demand, executes deterministic assembly, and is permanently destroyed upon completion.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#34D399' }}>✓</span> <strong>Zero Local Server Overhead</strong>: No dedicated build hardware or local maintenance required.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#34D399' }}>✓</span> <strong>Zero Customer Code Custody</strong>: We never store customer source code, private keys, or build logs.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#34D399' }}>✓</span> <strong>Multi-OS Matrix</strong>: Simultaneous compilation for Windows, macOS, and Linux targets.
              </li>
            </ul>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#93C5FD' }}>Compliance & Attestation Standards</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-muted)' }}>SBOM Standard:</span>
                <span style={{ fontWeight: 600, color: '#34D399' }}>CycloneDX 1.5 JSON</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Integrity Verification:</span>
                <span style={{ fontWeight: 600, color: '#60A5FA' }}>Cryptographic SHA-256</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Supply Chain Level:</span>
                <span style={{ fontWeight: 600, color: '#A78BFA' }}>SLSA Compliant</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Telemetry Level:</span>
                <span style={{ fontWeight: 600, color: '#34D399' }}>Strict Zero Outbound</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STRICT ZERO TELEMETRY GUARANTEE */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem', background: 'rgba(52, 211, 153, 0.03)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', display: 'grid', placeItems: 'center', color: '#34D399', fontSize: '1.2rem' }}>
            🛡️
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Strict Zero Outbound Telemetry Protocol</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Engineered for air-gapped financial institutions, defense contractors, and regulated environments.</p>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
          All upstream telemetry modules, usage analytics probes, remote crash reporting daemons, and Microsoft/Google tracking endpoints are permanently excised from the source tree during compilation. Your engineering team's keystrokes, repository names, file structures, and code remain 100% private to your workstations.
        </p>
      </div>

    </div>
  );
}
