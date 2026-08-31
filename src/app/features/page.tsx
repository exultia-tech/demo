import Link from "next/link";

const PUBLIC_FEEDS = [
  {
    id: "nvd_cve",
    name: "NIST NVD & Global CVE List",
    category: "Global Vulnerability Registries",
    badge: "GLOBAL CVE",
    badgeColor: "#34D399",
    target: "services.nvd.nist.gov / cve.mitre.org",
    description: "Universal database of Common Vulnerabilities and Exposures across software components, runtime binaries, and dependencies."
  },
  {
    id: "cisa_kev",
    name: "CISA Known Exploited Vulnerabilities (KEV)",
    category: "Active Weaponization",
    badge: "EXPLOITED IN WILD",
    badgeColor: "#EF4444",
    target: "cisa.gov/known-exploited-vulnerabilities",
    description: "Catalog of vulnerabilities actively exploited by threat actors and ransomware groups in production environments."
  },
  {
    id: "ghsa",
    name: "GitHub Advisory Database (GHSA)",
    category: "Open Source Advisories",
    badge: "LIVE GHSA",
    badgeColor: "#60A5FA",
    target: "github.com/advisories",
    description: "Open-source advisories spanning TypeScript, JavaScript, Python, Go, Rust, Java, C/C++, and GitHub repository releases."
  },
  {
    id: "osv_dev",
    name: "Open Source Vulnerabilities (OSV.dev)",
    category: "Ecosystem Aggregation",
    badge: "OPENSSF OSV",
    badgeColor: "#34D399",
    target: "api.osv.dev/v1/query",
    description: "Aggregates vulnerabilities across ecosystems (npm, PyPI, Crates.io, Go, Maven, NuGet, Linux distros) in OpenSSF OSV format."
  },
  {
    id: "openssf_malicious",
    name: "OpenSSF Malicious Packages Repository",
    category: "Malware & Supply Chain",
    badge: "MALWARE REPO",
    badgeColor: "#F59E0B",
    target: "github.com/ossf/malicious-packages",
    description: "Community-driven open repository indexing confirmed malicious open-source packages, token stealers, and typosquats."
  },
  {
    id: "msrc_eclipse",
    name: "MSRC & Eclipse Security Advisories",
    category: "Vendor Bulletins",
    badge: "OFFICIAL VENDOR",
    badgeColor: "#60A5FA",
    target: "msrc.microsoft.com / eclipse.org/security",
    description: "Official vendor bulletins, security updates, and runtime notices from Microsoft, Eclipse Foundation, and Open VSX."
  },
  {
    id: "trail_of_bits",
    name: "Trail of Bits vsix-audit IoC Engine",
    category: "AST & C2 IoCs",
    badge: "IOC SCANNER",
    badgeColor: "#F87171",
    target: "github.com/trailofbits/vsix-audit",
    description: "Static AST inspection engine tracking malicious scripts, obfuscated payloads, and Command & Control network indicators."
  },
  {
    id: "socket_dev",
    name: "Socket.dev Threat Heuristics",
    category: "Behavioral Heuristics",
    badge: "BEHAVIOR SHIELD",
    badgeColor: "#FBBF24",
    target: "api.socket.dev/v0/threats",
    description: "Monitors behavioral anomalies including unauthorized subprocess execution, environment variable harvesting, and network leaks."
  },
  {
    id: "jfrog",
    name: "JFrog Security Research",
    category: "Reachability Analysis",
    badge: "AST REACHABILITY",
    badgeColor: "#34D399",
    target: "research.jfrog.com/api",
    description: "Evaluates call-graph reachability, distinguishing theoretical CVEs in packaged dependencies from exploitable execution paths."
  },
  {
    id: "aqua_nautilus",
    name: "Aqua Nautilus Research",
    category: "Marketplace Integrity",
    badge: "ANTI-TYPOSQUAT",
    badgeColor: "#60A5FA",
    target: "aquasec.com/nautilus/intel-feed",
    description: "Monitors marketplace namespace typosquatting, publisher impersonation, and trojanized releases across public package registries."
  },
  {
    id: "snyk",
    name: "Snyk Open Vulnerability Database",
    category: "Deep Dependency Tree",
    badge: "TRANSITIVE SCA",
    badgeColor: "#A78BFA",
    target: "security.snyk.io/vuln",
    description: "Indexes vulnerabilities affecting language servers, AST parsers, and deep transitive package dependency trees."
  },
  {
    id: "openssf_scorecards",
    name: "OpenSSF Scorecards",
    category: "Supply Chain Health",
    badge: "MAINTENANCE SCORE",
    badgeColor: "#A78BFA",
    target: "api.securityscorecards.dev",
    description: "Measures upstream repository health, maintenance cadence, branch protection rules, and deterministic dependency pinning."
  }
];

export default function FeaturesPage() {
  return (
    <div className="fade-in" style={{ padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* HEADER HERO */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <span className="hero-badge" style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
          🛡️ Enterprise Platform Architecture
        </span>
        <h1 style={{ fontSize: '3.3rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          DevSecOps By Design
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '820px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Immutable binary hardening and Unified Vulnerability Intelligence (UVI) built for security-first teams.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/console" className="btn-primary" style={{ padding: '0.85rem 1.75rem', textDecoration: 'none', fontSize: '0.95rem' }}>
            Open Builder Console →
          </Link>
          <Link href="/pricing" style={{ padding: '0.85rem 1.75rem', textDecoration: 'none', fontSize: '0.95rem', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600 }}>
            View Plans & Pricing
          </Link>
        </div>
      </div>

      {/* SECTION 1: SUPPLY CHAIN SANDBOXING & MULTI-IDE ENGINES */}
      <div id="sandbox" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center', marginBottom: '6rem' }}>
        <div>
          <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Supply Chain Defense & Universal Engines
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
            Zero-Trust Extension Sandboxing Across 6 IDE Engines
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Standard open-source IDEs allow developers to install arbitrary marketplace extensions that execute native binaries with full filesystem and network access. SecureIDE wraps your choice of engine with deterministic security policy gates.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Strict 0 Open CVEs Baseline</strong>: Any extension with reported vulnerabilities is blocked from baseline bundling.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Universal IDE Matrix</strong>: Unified catalog supporting VS Code, Eclipse Theia, Zed (Rust), Neovim (LazyVim), JupyterLab, and VSCodium.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Air-Gapped Localization (i18n)</strong>: Pre-provisions 12+ verified language packs with native offline locale enforcement.</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>✓</span> 
              <div><strong>Auto-Included Remote-SSH</strong>: Engine-specific secure remote development bridges included across all non-zero stacks.</div>
            </li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 700 }}>Extension Permission Sandbox</span>
            <span className="status-chip approved">Enforced</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Outbound Network Sockets:</span>
              <span style={{ color: '#F87171', fontWeight: 600 }}>BLOCKED (Air-Gapped)</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Subprocess Spawning:</span>
              <span style={{ color: '#FBBF24', fontWeight: 600 }}>AUDITED & RESTRICTED</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Credential & Token Access:</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>ISOLATED</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Telemetry & Beacons:</span>
              <span style={{ color: '#F87171', fontWeight: 600 }}>PERMANENTLY ZEROED</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Workspace Filesystem Scope:</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>ALLOWED (Isolated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 4 DEFENSE-IN-DEPTH CONTAINMENT LAYERS */}
      <div id="security" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#60A5FA', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Zero-Trust Endpoint Security
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>The 4 Defense-in-Depth Containment Layers</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
            A four-tier containment architecture ensuring developer releases cannot be tampered with on disk, bypassed locally, or compromised via unvetted marketplace access.
          </p>
        </div>

        <div className="feature-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          
          <div id="hardening" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
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

      {/* SECTION 3: UNIFIED VULNERABILITY INTELLIGENCE (UVI) MULTI-FEED */}
      <div id="uvi" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#34D399', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Continuous Supply Chain Threat Intelligence
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Unified Vulnerability Intelligence (UVI) Multi-Feed</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '780px', margin: '0 auto' }}>
            Before any extension, language server (LSP), or compiler binary is packaged, it is evaluated against our 12+ multi-feed intelligence consensus to block vulnerabilities, reachability exploits, and typosquats.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {PUBLIC_FEEDS.map(source => (
            <div key={source.id} className="glass-card" style={{ padding: '1.5rem', marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{source.category}</span>
                <span style={{ fontSize: '0.68rem', color: source.badgeColor, background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                  {source.badge}
                </span>
              </div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{source.name}</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '1rem', flex: 1 }}>
                {source.description}
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace', padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                Source: <code>{source.target}</code>
              </div>
            </div>
          ))}
        </div>

        {/* REST API EXPLORER */}
        <div className="glass-card" style={{ padding: '2.5rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.35rem' }}>Unified Vulnerability Intelligence (UVI) REST API</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                Query any public vulnerability, package ecosystem, extension, or language server directly via the open UVI endpoint.
              </p>
            </div>
            <span className="github-badge" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              ✓ CORS Enabled • Open Access (CC-BY-4.0)
            </span>
          </div>

          <pre style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '10px', color: '#38BDF8', fontSize: '0.82rem', lineHeight: '1.6', overflowX: 'auto', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.06)' }}>
{`# 1. Fetch entire Unified Vulnerability Intelligence (UVI) feed
curl -s "https://secureide.dev/api/threat-feed" | jq .

# 2. Query specific package or extension by keyword
curl -s "https://secureide.dev/api/threat-feed?query=rust-analyzer" | jq .records[0].threatSignals

# 3. Query language server binaries and toolchains
curl -s "https://secureide.dev/api/threat-feed?query=gopls&ecosystem=golang" | jq .records

# 4. Filter by security grade
curl -s "https://secureide.dev/api/threat-feed?grade=A+" | jq .records`}
          </pre>
        </div>
      </div>

      {/* SECTION 4: CLOUD PIPELINE, SBOMs & ZERO CUSTODY */}
      <div id="pipeline" className="glass-card" style={{ padding: '3rem', marginBottom: '6rem' }}>
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

          <div id="sbom" style={{ background: 'rgba(0,0,0,0.35)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
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

      {/* SECTION 5: STRICT ZERO TELEMETRY PROTOCOL */}
      <div id="telemetry" className="glass-card" style={{ padding: '2.5rem', marginBottom: '5rem', background: 'rgba(52, 211, 153, 0.03)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
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
