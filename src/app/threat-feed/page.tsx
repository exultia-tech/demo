"use client";

import { useState, useEffect } from "react";
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

export default function ThreatFeedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchThreatData = async (queryStr = "") => {
    setLoading(true);
    try {
      const url = queryStr 
        ? `/api/threat-feed?query=${encodeURIComponent(queryStr)}` 
        : `/api/threat-feed`;
      const res = await fetch(url);
      const data = await res.json();
      setApiData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatData();
  }, []);

  return (
    <div className="fade-in" style={{ padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* HEADER HERO */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="hero-badge" style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
          🌐 Universal Public Threat Intelligence Multi-Feed
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          All Accessible Public Vulnerability & Security Feeds
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '840px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          We ingest all accessible public vulnerability registries and advisory databases without pre-exclusion. Whether an advisory applies to an IDE extension, language server (LSP), compiler toolchain, or runtime package dependency is determined dynamically by the query.
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
          <span className="stat-label">Ingested Public Feeds</span>
          <div className="stat-number" style={{ color: '#34D399' }}>12+ Sources</div>
          <p style={{ fontSize: '0.75rem' }}>NVD, CISA KEV, GHSA, OSV & Specialty Feeds</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Inclusion Model</span>
          <div className="stat-number" style={{ color: '#60A5FA' }}>Query-Driven</div>
          <p style={{ fontSize: '0.75rem' }}>Zero feed pre-exclusion; resolved by search</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Ecosystem Coverage</span>
          <div className="stat-number" style={{ color: '#FBBF24' }}>Full Stack</div>
          <p style={{ fontSize: '0.75rem' }}>Extensions, LSPs, compilers & dependencies</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Public License</span>
          <div className="stat-number" style={{ color: '#A78BFA' }}>Open CC-BY-4.0</div>
          <p style={{ fontSize: '0.75rem' }}>Free open access for all developers & CI/CD</p>
        </div>
      </div>

      {/* LIVE QUERY EXPLORER */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '4.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>🔍 Live Multi-Feed Query Engine</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Test how the multi-feed searches across public vulnerability databases for extensions, language servers, toolchains, or CVEs.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {["eslint", "gopls", "ruff", "rust-analyzer", "semgrep"].map(example => (
              <button
                key={example}
                onClick={() => {
                  setSearchQuery(example);
                  fetchThreatData(example);
                }}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-color)',
                  color: '#93C5FD',
                  cursor: 'pointer'
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchThreatData(searchQuery)}
            placeholder="Search by package name, extension ID, LSP binary, purl, or CVE ID..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-color)',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => fetchThreatData(searchQuery)}
            className="btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
          >
            {loading ? "Searching..." : "Query Feeds"}
          </button>
        </div>

        {apiData && (
          <div style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Matched Records: <strong>{apiData.matchedPackagesCount}</strong></span>
              <span>Feed Sources Evaluated: <strong>{apiData.publicFeedSources?.length || 12} Public Feeds</strong></span>
            </div>
            <pre style={{ margin: 0, maxHeight: '280px', overflowY: 'auto', color: '#38BDF8', fontSize: '0.8rem', lineHeight: '1.5', fontFamily: 'monospace' }}>
              {JSON.stringify(apiData.records, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* PUBLIC FEED SOURCES DIRECTORY */}
      <div style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Integrated Public Vulnerability Feeds</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px', margin: '0 auto' }}>
            Aggregated continuously from official CVE repositories, OpenSSF aggregators, vendor advisories, and specialized supply-chain research labs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
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
      </div>

      {/* REST API EXPLORER */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Universal Threat Feed REST API</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Query any public vulnerability, package ecosystem, extension, or language server directly via REST.
            </p>
          </div>
          <span className="github-badge" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            ✓ CORS Enabled • Open Access (CC-BY-4.0)
          </span>
        </div>

        <pre style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '10px', color: '#38BDF8', fontSize: '0.82rem', lineHeight: '1.6', overflowX: 'auto', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.06)' }}>
{`# 1. Fetch entire universal threat intelligence feed
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
  );
}
