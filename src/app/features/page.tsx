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
    description: "Community feed documenting malicious packages, backdoored dependencies, brandjacking attempts, and cryptominers."
  },
  {
    id: "msrc_eclipse",
    name: "Microsoft MSRC & Eclipse Security Advisories",
    category: "Upstream IDE Vendor Advisories",
    badge: "UPSTREAM VENDOR",
    badgeColor: "#60A5FA",
    target: "msrc.microsoft.com / eclipse.org/security",
    description: "Direct security disclosures for upstream VS Code Core, Eclipse Theia, LSP implementations, and Electron frameworks."
  },
  {
    id: "trailofbits",
    name: "Trail of Bits Research & Audit Disclosures",
    category: "Security Research Labs",
    badge: "EXPERT AUDIT",
    badgeColor: "#A78BFA",
    target: "trailofbits.com/publications",
    description: "In-depth security evaluations, compiler instrumentation audits, memory-safety reviews, and advanced tooling advisories."
  },
  {
    id: "socket_dev",
    name: "Socket.dev Supply Chain Intelligence",
    category: "Behavioral Analysis",
    badge: "BEHAVIORAL RISK",
    badgeColor: "#EC4899",
    target: "socket.dev/api",
    description: "Detects supply chain attacks via behavioral risk indicators (network calls in install scripts, typo-squatting, obfuscated code)."
  },
  {
    id: "jfrog_research",
    name: "JFrog Security Research & Zero-Day Feed",
    category: "Artifact Analysis",
    badge: "ARTIFACT ANALYSIS",
    badgeColor: "#34D399",
    target: "research.jfrog.com",
    description: "Automated analysis of binary packages, transitive dependency graphs, and newly disclosed zero-day vulnerabilities."
  },
  {
    id: "aqua_nautilus",
    name: "Aqua Nautilus Cloud & Container Threat Feed",
    category: "Runtime & Container",
    badge: "CONTAINER THREATS",
    badgeColor: "#38BDF8",
    target: "aquasec.com/research",
    description: "Monitors malicious activity in cloud-native developer containers, CI/CD runners, and developer images."
  },
  {
    id: "snyk_intel",
    name: "Snyk Open Source Vulnerability Database",
    category: "Developer Toolchains",
    badge: "DEVELOPER TOOLCHAINS",
    badgeColor: "#FBBF24",
    target: "security.snyk.io",
    description: "Comprehensive vulnerability data across programming language ecosystems and integrated IDE extensions."
  },
  {
    id: "openssf_scorecard",
    name: "OpenSSF Scorecards (Supply Chain Health)",
    category: "Repository Posture",
    badge: "SUPPLY CHAIN POSTURE",
    badgeColor: "#60A5FA",
    target: "api.securityscorecards.dev",
    description: "Measures upstream repository health, maintenance cadence, branch protection rules, and verified dependency pinning."
  }
];

export default function FeaturesPage() {
  return (
    <div className="fade-in features-container">
      
      {/* HEADER HERO */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <h1 style={{ fontSize: '3.3rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          DevSecOps By Design
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '820px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          The first step in developing securely is securing development.
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

      {/* SECTION 1: 4 DEFENSE-IN-DEPTH CONTAINMENT LAYERS (MOVED TO TOP) */}
      <div id="security" style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#60A5FA', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Zero-Trust Endpoint Security
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>The 4 Defense-in-Depth Containment Layers</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
            A four-tier containment architecture ensuring developer releases cannot be tampered with on disk, bypassed locally, or compromised via unvetted marketplace access.
          </p>
        </div>

        <div className="containment-layers-grid">
          
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

      {/* SECTION 2: STRICT ZERO TELEMETRY PROTOCOL (PLACED UNDERNEATH 4 LAYERS) */}
      <div id="telemetry" className="glass-card" style={{ padding: '2.5rem', marginBottom: '6rem', background: 'rgba(52, 211, 153, 0.03)', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', display: 'grid', placeItems: 'center', color: '#34D399', fontSize: '1.35rem' }}>
            🛡️
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.35rem' }}>Strict Zero Outbound Telemetry Protocol</h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>Engineered for air-gapped financial institutions, defense contractors, and regulated environments.</p>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: '1.65', margin: 0 }}>
          All upstream telemetry modules, usage analytics probes, remote crash reporting daemons, and Microsoft/Google tracking endpoints are permanently excised from the source tree during compilation. Your engineering team's keystrokes, repository names, file structures, and code remain 100% private to your workstations.
        </p>
      </div>

      {/* SECTION 3: WIDESCREEN DUAL SECTION: EXTENSION SANDBOXING & CLOUD PIPELINE */}
      <div className="widescreen-duo-grid">
        
        {/* CARD 1: SUPPLY CHAIN SANDBOXING & UNIVERSAL ENGINES */}
        <div id="sandbox" className="glass-card" style={{ padding: '2.5rem', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Supply Chain Defense & Universal Engines
            </div>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>
              Zero-Trust Extension Sandboxing Across 6 IDE Engines
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
              Standard IDEs allow arbitrary marketplace plugins to execute native code with root-level access. PureIDE enforces strict policy boundaries and pre-approved extension toolchains across 6 engines.
            </p>

            {/* CHECKLIST HIGHLIGHTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <span style={{ color: '#34D399', fontSize: '1.1rem', lineHeight: '1.3' }}>✓</span> 
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Strict 0 Open CVEs Baseline</strong>
                  <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>Any extension with active CVEs is blocked from bundling.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <span style={{ color: '#60A5FA', fontSize: '1.1rem', lineHeight: '1.3' }}>✓</span> 
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Universal IDE Matrix</strong>
                  <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>VS Code, Theia, Zed (Rust), Neovim, JupyterLab, and VSCodium.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <span style={{ color: '#A78BFA', fontSize: '1.1rem', lineHeight: '1.3' }}>✓</span> 
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Air-Gapped Localization (i18n)</strong>
                  <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>12+ verified language packs pre-provisioned for offline use.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <span style={{ color: '#FBBF24', fontSize: '1.1rem', lineHeight: '1.3' }}>✓</span> 
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Auto-Included Remote-SSH</strong>
                  <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>Secure remote development bridges bundled across all toolchains.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: CLOUD PIPELINE, SBOMs & ZERO CUSTODY */}
        <div id="pipeline" className="glass-card" style={{ padding: '2.5rem', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#34D399', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Stateless Cloud Orchestration
            </div>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>
              Isolated Multi-OS Cloud Pipeline & Attestation
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
              Builds execute inside dedicated, ephemeral cloud runners. Each sandbox is provisioned on-demand, compiles sealed binaries, and is permanently destroyed upon completion.
            </p>

            {/* PIPELINE CAPABILITIES CHECKLIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <span style={{ color: '#34D399', fontSize: '1.1rem', lineHeight: '1.3' }}>✓</span> 
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Zero Local Server Overhead</strong>
                  <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>No dedicated build hardware or local OS runners required.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <span style={{ color: '#60A5FA', fontSize: '1.1rem', lineHeight: '1.3' }}>✓</span> 
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Zero Customer Code Custody</strong>
                  <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>We never store customer source code, keys, or build logs.</p>
                </div>
              </div>

              <div id="sbom" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <span style={{ color: '#A78BFA', fontSize: '1.1rem', lineHeight: '1.3' }}>✓</span> 
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>CycloneDX 1.5 JSON SBOMs</strong>
                  <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>SLSA-compliant Software Bill of Materials with SHA-256 binary digests.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <span style={{ color: '#FBBF24', fontSize: '1.1rem', lineHeight: '1.3' }}>✓</span> 
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Multi-OS Cross-Compilation & REST API</strong>
                  <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>Simultaneous output for Windows, macOS, and Linux with CI/CD triggers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 4: UNIFIED VULNERABILITY INTELLIGENCE (UVI) MULTI-FEED */}
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
