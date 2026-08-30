import Link from "next/link";

const THREAT_SOURCES = [
  {
    id: "nvd_ghsa_osv",
    name: "NIST NVD / GHSA / OSV.dev",
    category: "Vulnerability Registries",
    badge: "LIVE CVE SYNC",
    badgeColor: "#34D399",
    target: "api.osv.dev/v1/query",
    description: "Standard CVE and OpenSSF OSV format mapping. Continuous ingestion of vulnerabilities across npm, PyPI, and GitHub repository advisories."
  },
  {
    id: "msrc_eclipse",
    name: "MSRC & Eclipse Security Advisories",
    category: "Vendor Bulletins",
    badge: "OFFICIAL VENDOR",
    badgeColor: "#60A5FA",
    target: "msrc.microsoft.com/cvrf",
    description: "Tracks official vendor-authored extension bulletins and runtime notices from Microsoft Security Response Center, Eclipse Foundation, and Open VSX."
  },
  {
    id: "trail_of_bits",
    name: "Trail of Bits vsix-audit Database",
    category: "Malicious Patterns & C2 IoCs",
    badge: "IOC SCANNER",
    badgeColor: "#F87171",
    target: "github.com/trailofbits/vsix-audit",
    description: "Specialized scanner and rule database tracking malicious extension IDs, obfuscated payload scripts, and Command & Control (C2) network indicators."
  },
  {
    id: "jfrog",
    name: "JFrog Security Research",
    category: "Reachability Analysis",
    badge: "IPC CALL-GRAPH",
    badgeColor: "#34D399",
    target: "research.jfrog.com/api",
    description: "Evaluates contextual runtime exploitability, distinguishing theoretical CVEs in packaged dependencies from reachable IPC attack vectors."
  },
  {
    id: "aqua_nautilus",
    name: "Aqua Nautilus Research",
    category: "Marketplace Integrity",
    badge: "ANTI-TYPOSQUAT",
    badgeColor: "#60A5FA",
    target: "aquasec.com/nautilus/intel-feed",
    description: "Monitors marketplace namespace typosquatting, publisher impersonation, and trojanized package updates across public galleries."
  },
  {
    id: "socket_dev",
    name: "Socket.dev Threat Engine",
    category: "Behavioral Heuristics",
    badge: "BEHAVIOR SHIELD",
    badgeColor: "#FBBF24",
    target: "api.socket.dev/v0/threats/ide",
    description: "Analyzes extension behavior in real-time for unauthorized subprocess spawning, environment variable harvesting, and credential theft."
  },
  {
    id: "snyk",
    name: "Snyk Vulnerability Database",
    category: "Deep Dependency Tree",
    badge: "TRANSITIVE SCA",
    badgeColor: "#A78BFA",
    target: "security.snyk.io/vuln",
    description: "Indexes vulnerabilities affecting nested language servers, AST parsers, and deep transitive dependencies bundled inside IDE extensions."
  },
  {
    id: "openssf",
    name: "OpenSSF Scorecards",
    category: "Supply Chain Health",
    badge: "MAINTENANCE SCORE",
    badgeColor: "#A78BFA",
    target: "api.securityscorecards.dev",
    description: "Measures upstream repository health, commit activity, branch protection rules, and deterministic dependency pinning."
  }
];

export default function ThreatFeedPage() {
  return (
    <div className="fade-in" style={{ padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* HEADER HERO */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="hero-badge" style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
          📡 8-Source Consensus Threat Intelligence Platform
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Multi-Source IDE Threat Intelligence Feeds
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '820px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Correlated threat signals aggregating standard CVE registries, vendor bulletins (MSRC, Eclipse), and specialized supply chain audit engines (Trail of Bits, Socket.dev, JFrog, Aqua Nautilus, Snyk, OpenSSF).
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/api/threat-feed" target="_blank" className="btn-primary" style={{ padding: '0.85rem 1.75rem', textDecoration: 'none', fontSize: '0.95rem' }}>
            Query Public Threat API (JSON) →
          </a>
          <Link href="/console" style={{ padding: '0.85rem 1.75rem', textDecoration: 'none', fontSize: '0.95rem', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600 }}>
            Open Builder Console
          </Link>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="stats-grid" style={{ marginBottom: '4rem' }}>
        <div className="stat-card">
          <span className="stat-label">Synchronized Feeds</span>
          <div className="stat-number" style={{ color: '#34D399' }}>8 Active</div>
          <p style={{ fontSize: '0.75rem' }}>Continuous automated consensus polling</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Vulnerability Scope</span>
          <div className="stat-number" style={{ color: '#60A5FA' }}>0-CVE Gate</div>
          <p style={{ fontSize: '0.75rem' }}>Deprecations flagged & blocked</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Marketplace Shield</span>
          <div className="stat-number" style={{ color: '#FBBF24' }}>Anti-Typosquat</div>
          <p style={{ fontSize: '0.75rem' }}>Publisher domain verification enforced</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Access License</span>
          <div className="stat-number" style={{ color: '#A78BFA' }}>Open Access</div>
          <p style={{ fontSize: '0.75rem' }}>Free public feed under CC-BY-4.0</p>
        </div>
      </div>

      {/* 8-FEED ARCHITECTURE GRID */}
      <div style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>The 8 Synchronized Threat Intelligence Feeds</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Consensus scoring across all 8 threat vectors ensures zero false positives and proactive defense against poisoned packages.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {THREAT_SOURCES.map(source => (
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
                Endpoint: <code>{source.target}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REST API EXPLORER */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Query the Live Public Threat Feed API</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Free REST endpoint available for corporate DevSecOps pipelines and SIEM ingestion.
            </p>
          </div>
          <span className="github-badge" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            ✓ CORS Enabled • Public Open Access
          </span>
        </div>

        <pre style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '10px', color: '#38BDF8', fontSize: '0.82rem', lineHeight: '1.6', overflowX: 'auto', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.06)' }}>
{`# 1. Fetch entire consensus threat intelligence catalog
curl -s "https://secureide.dev/api/threat-feed" | jq .

# 2. Filter by Grade A+ packages only
curl -s "https://secureide.dev/api/threat-feed?grade=A+" | jq .records

# 3. Query specific extension namespace
curl -s "https://secureide.dev/api/threat-feed?query=rust-analyzer" | jq .records[0].threatSignals`}
        </pre>
      </div>

    </div>
  );
}
