import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="fade-in" style={{ padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '3rem' }}>
        <span className="hero-badge">Developer & DevOps Documentation</span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          SecureIDE Integration, Threat Intel & Architecture Guide
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '850px' }}>
          Learn how to orchestrate hardened IDE builds across VS Code, Eclipse Theia, Zed (Rust), Neovim, and JupyterLab, query the public 5-source threat intelligence feed, and automate releases via CI/CD.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* DOCS SIDEBAR */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'sticky', top: '90px' }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><a href="#quickstart" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: '0.85rem' }}>1. Quickstart in 3 Steps</a></li>
            <li><a href="#threat-intel" style={{ color: '#34D399', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>2. 5-Source Threat Intelligence & API</a></li>
            <li><a href="#rest-api" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>3. Headless REST API (Enterprise)</a></li>
            <li><a href="#orchestrator" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>4. Orchestrator CLI API</a></li>
            <li><a href="#whitelist" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>5. Whitelist & Deprecation Policy</a></li>
            <li><a href="#cicd" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>6. CI/CD Automation Pipeline</a></li>
          </ul>
        </div>

        {/* DOCS CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* SECTION 1: QUICKSTART */}
          <section id="quickstart" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Quickstart in 3 Steps</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Building a secure, air-gapped IDE distribution takes under 60 seconds using the SecureIDE Builder Console.
            </p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Select Your Engine & Tier</strong>: Choose your base IDE (<code>VS Code</code>, <code>Eclipse Theia</code>, <code>Zed</code>, <code>Neovim</code>, or <code>JupyterLab</code>) and subscription tier.
              </li>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Curate Plugins & Blueprints</strong>: Search the catalog or click any <strong>Multi-IDE Stack Blueprint</strong> with auto-included language context packages.
              </li>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Validate & Compile</strong>: Click <strong>"Dry Run Validation"</strong> to inspect the CycloneDX 1.5 SBOM, then click <strong>"Compile Release"</strong> to download your zero-telemetry binary.
              </li>
            </ol>
          </section>

          {/* SECTION 2: 5-SOURCE THREAT INTELLIGENCE & OPEN REST API */}
          <section id="threat-intel" className="glass-card" style={{ padding: '2.25rem', marginBottom: 0, border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>2. 5-Source Threat Intelligence & Open API</h2>
                <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 600 }}>Public Open Threat Feed • CC-BY-4.0</span>
              </div>
              <a 
                href="/api/threat-feed" 
                target="_blank" 
                className="btn-primary" 
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📡</span> Raw JSON Endpoint ↗
              </a>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              SecureIDE synthesizes security telemetry across five authoritative threat research organizations to eliminate the latency and blind spots of isolated CVE databases:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#93C5FD', display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>🏛️ NIST NVD / GHSA / OSV.dev</strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Continuous ingestion of open CVE vulnerability advisories and CVSS v3.1 base scoring.</p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#34D399', display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>🐸 JFrog Security Research</strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Evaluates contextual runtime IPC exploitability and AST-level payload reachability.</p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#60A5FA', display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>🌊 Aqua Nautilus Research</strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Detects marketplace publisher impersonation, domain typo-squats, and trojanized packages.</p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#FBBF24', display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>🔌 Socket.dev Threat Engine</strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Monitors behavioral heuristics, child process execution, environment reads, and token theft.</p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#A78BFA', display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>🎖️ OpenSSF Scorecards</strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Measures upstream maintenance frequency, branch protection, and dependency pinning.</p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Consensus Scoring Rubric (0–100 Scale)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Every catalog package is assigned a composite 100-point security grade:
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
              <li><strong>Grade A+ (90–100)</strong>: 0 open CVEs + Verified Publisher + Clean Socket heuristics + OpenSSF score &ge; 8.0.</li>
              <li><strong>Grade B (70–89)</strong>: 0 open CVEs + Non-critical AST dependency warning with isolated reachability.</li>
              <li><strong>Grade C / Threat (0–69)</strong>: Active unresolved CVE OR marked as Deprecated / End-of-Life OR suspicious network telemetry.</li>
            </ul>

            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Public REST API Endpoints</h3>
            <pre style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '8px', color: '#38BDF8', fontSize: '0.8rem', lineHeight: '1.6', overflowX: 'auto', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.06)' }}>
{`# 1. Query full feed in JSON
curl -s "https://secureide.dev/api/threat-feed" | jq .

# 2. Search specific package
curl -s "https://secureide.dev/api/threat-feed?query=pyrefly" | jq .records

# 3. Filter by Grade A+ packages only
curl -s "https://secureide.dev/api/threat-feed?grade=A+" | jq .records`}
            </pre>
          </section>

          {/* SECTION 3: HEADLESS REST BUILD API */}
          <section id="rest-api" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>3. Headless REST Build API (Enterprise)</h2>
              <span className="upgrade-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>Enterprise</span>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Trigger hardened builds and receive signed release ZIPs, SBOMs, and manifests programmatically from your internal CI/CD pipelines:
            </p>
            
            <pre style={{ background: '#11111B', padding: '1.25rem', borderRadius: '8px', color: '#93C5FD', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace' }}>
{`# 1. Trigger Headless Build
curl -X POST https://api.secureide.internal/v1/builds/orchestrate \\
  -H "Authorization: Bearer sec_live_enterprise_token_xyz" \\
  -H "Content-Type: application/json" \\
  -d '{
    "engine": "theia",
    "engineVersion": "v1.93.1",
    "registryUrl": "https://artifactory.corp.internal/vscode/gallery",
    "plugins": ["dbaeumer.vscode-eslint@2.4.4", "esbenp.prettier-vscode@10.1.0"],
    "webhookUrl": "https://ci.corp.internal/webhooks/ide-build-complete"
  }'

# 2. Response Payload
{
  "buildId": "bld_984f7e2a1",
  "status": "QUEUED",
  "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "artifacts": {
    "binaryZip": "https://api.secureide.internal/v1/builds/bld_984f7e2a1/binary.zip",
    "sbomJson": "https://api.secureide.internal/v1/builds/bld_984f7e2a1/sbom.cdx.json",
    "manifestJson": "https://api.secureide.internal/v1/builds/bld_984f7e2a1/build-manifest.json"
  }
}`}
            </pre>
          </section>

          {/* SECTION 4: ORCHESTRATOR CLI API */}
          <section id="orchestrator" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. PowerShell Orchestrator CLI</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
              For local workstations and headless script runners, invoke <code>orchestrator.ps1</code> directly:
            </p>
            <pre style={{ background: '#11111B', padding: '1.25rem', borderRadius: '8px', color: '#93C5FD', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace' }}>
{`powershell.exe -ExecutionPolicy Bypass -File .\\orchestrator.ps1 \`
  -Engine 'theia' \` # 'vscode' | 'theia' | 'zed' | 'neovim' | 'jupyter'
  -Tier 'ENTERPRISE' \`
  -RegistryUrl 'https://artifactory.corp.internal/vscode/gallery' \`
  -Extensions 'dbaeumer.vscode-eslint,esbenp.prettier-vscode'`}
            </pre>
          </section>

          {/* SECTION 5: WHITELIST & DEPRECATION POLICY */}
          <section id="whitelist" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Security Whitelist & Deprecation Policy</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Plugins bundled into IDE distributions must strictly satisfy our deterministic policy gates:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                <strong style={{ color: '#34D399' }}>✓ Permitted (0-CVE Policy Approved)</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <li>Verified publisher or high community reputation (&gt;10k downloads)</li>
                  <li><strong>Zero Open CVEs</strong> across NVD and GitHub Security Advisories</li>
                  <li>Active maintenance (updated within active lifecycle window)</li>
                  <li>Clean permissions profile (scoped to workspace directory)</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                <strong style={{ color: '#F87171' }}>🔒 Strictly Blocked Policy Gates</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <li>Active, unresolved CVE vulnerabilities (CVSS &ge; 0.1)</li>
                  <li><strong>Officially Deprecated Packages</strong> (treated as vulnerable)</li>
                  <li>Trojanized packages flagged by Aqua Nautilus typosquatting</li>
                  <li>Direct outbound telemetry phone-home beacons or socket leaks</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 6: CI/CD PIPELINES */}
          <section id="cicd" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. Automated GitHub Actions Workflow</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Automatically rebuild security-hardened IDE releases on schedule:
            </p>
            <pre style={{ background: '#11111B', padding: '1.25rem', borderRadius: '8px', color: '#86EFAC', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace' }}>
{`name: Monthly Hardened IDE Release
on:
  schedule:
    - cron: '0 0 1 * *' # Monthly 1st

jobs:
  build:
    runs-on: windows-2022
    steps:
      - uses: actions/checkout@v4
      - name: Orchestrate Zero-Trust Build
        shell: pwsh
        run: |
          ./scripts/orchestrator.ps1 -Tier 'ENTERPRISE' -Engine 'vscode'
      - name: Archive Signed Distribution
        uses: actions/upload-artifact@v4
        with:
          name: SecureIDE-Monthly-Release
          path: dist/*.zip`}
            </pre>
          </section>

        </div>
      </div>

    </div>
  );
}

