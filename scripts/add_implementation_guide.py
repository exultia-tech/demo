import os

file_path = os.path.join('src', 'app', 'app', 'patches', 'page.tsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update ConceptTab type
content = content.replace(
    "type ConceptTab = 'velocity' | 'canary' | 'slsa' | 'matrix';",
    "type ConceptTab = 'velocity' | 'canary' | 'slsa' | 'matrix' | 'implement';"
)

# 2. Add sub-state for implementation tabs
old_state = "const [selectedPayloadTab, setSelectedPayloadTab] = useState<'tier1' | 'tier2' | 'tier3' | 'rawJson'>('tier1');"
new_state = """const [selectedPayloadTab, setSelectedPayloadTab] = useState<'tier1' | 'tier2' | 'tier3' | 'rawJson'>('tier1');
  const [activeImplementTab, setActiveImplementTab] = useState<'systemd' | 'gitops' | 'ansible' | 'agent'>('systemd');"""

if old_state in content and 'activeImplementTab' not in content:
    content = content.replace(old_state, new_state)

# 3. Add 5th tab button in the grid
tab4_marker = """          {/* TAB 4 */}
          <button 
            onClick={() => setActiveConcept('matrix')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: activeConcept === 'matrix' ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeConcept === 'matrix' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: activeConcept === 'matrix' ? '#F59E0B' : '#F8FAFC' }}>
                4. ROI & Speed Matrix
              </span>
              <Clock size={18} color={activeConcept === 'matrix' ? '#F59E0B' : '#64748B'} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
              Direct comparison against legacy patch managers (WSUS, Tanium, Ivanti, manual CAB review cycles).
            </span>
          </button>"""

tab5_code = """          {/* TAB 4 */}
          <button 
            onClick={() => setActiveConcept('matrix')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: activeConcept === 'matrix' ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeConcept === 'matrix' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: activeConcept === 'matrix' ? '#F59E0B' : '#F8FAFC' }}>
                4. ROI & Speed Matrix
              </span>
              <Clock size={18} color={activeConcept === 'matrix' ? '#F59E0B' : '#64748B'} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
              Direct comparison against legacy patch managers (WSUS, Tanium, Ivanti, manual CAB review cycles).
            </span>
          </button>

          {/* TAB 5: IMPLEMENTATION PLAYBOOK */}
          <button 
            onClick={() => setActiveConcept('implement')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: activeConcept === 'implement' ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeConcept === 'implement' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: activeConcept === 'implement' ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: activeConcept === 'implement' ? '#38BDF8' : '#F8FAFC' }}>
                5. Customer Implementation
              </span>
              <Terminal size={18} color={activeConcept === 'implement' ? '#38BDF8' : '#64748B'} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
              Ready-to-deploy setups: Zero-agent systemd timer, GitOps PR bot, Ansible Tower, or micro-daemon.
            </span>
          </button>"""

if tab4_marker in content and '5. Customer Implementation' not in content:
    content = content.replace(tab4_marker, tab5_code)

# 4. Add the Implementation Section to the concept body
matrix_end_marker = """        {activeConcept === 'matrix' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <Clock size={22} color="#F59E0B" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#F59E0B' }}>
                Concept 4: Enterprise Speed & Impact Comparison
              </h2>
            </div>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              How Exultia Kinetic completely redesigns the enterprise response velocity compared to traditional patching workflows:
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'left', color: '#94A3B8' }}>
                    <th style={{ padding: '12px 16px' }}>Metric</th>
                    <th style={{ padding: '12px 16px' }}>Legacy Enterprise Patching (WSUS, Tanium, Manual)</th>
                    <th style={{ padding: '12px 16px', color: '#22D3EE' }}>Exultia Kinetic Patch Feed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>Time to Neutralize 0-Day</td>
                    <td style={{ padding: '14px 16px', color: '#F87171' }}>14 – 35 Days (Pending vendor package)</td>
                    <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>&lt; 15 Minutes (Tier 1 Hot-Mitigation)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>Downtime & Reboots</td>
                    <td style={{ padding: '14px 16px', color: '#F87171' }}>Scheduled weekend maintenance reboot window</td>
                    <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>Zero downtime (Runtime parameter drop-in)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>Rollout Confidence</td>
                    <td style={{ padding: '14px 16px', color: '#FCD34D' }}>High risk of collateral breakage across apps</td>
                    <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>Canary 2% ring with automated health sentinel</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>Compliance & Proof</td>
                    <td style={{ padding: '14px 16px', color: '#FCD34D' }}>Manual Excel spreadsheets / screenshots for audit</td>
                    <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>Cryptographic Cosign signature + CycloneDX VEX</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}"""

implement_section_code = """        {activeConcept === 'matrix' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <Clock size={22} color="#F59E0B" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#F59E0B' }}>
                Concept 4: Enterprise Speed & Impact Comparison
              </h2>
            </div>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              How Exultia Kinetic completely redesigns the enterprise response velocity compared to traditional patching workflows:
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'left', color: '#94A3B8' }}>
                    <th style={{ padding: '12px 16px' }}>Metric</th>
                    <th style={{ padding: '12px 16px' }}>Legacy Enterprise Patching (WSUS, Tanium, Manual)</th>
                    <th style={{ padding: '12px 16px', color: '#22D3EE' }}>Exultia Kinetic Patch Feed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>Time to Neutralize 0-Day</td>
                    <td style={{ padding: '14px 16px', color: '#F87171' }}>14 – 35 Days (Pending vendor package)</td>
                    <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>&lt; 15 Minutes (Tier 1 Hot-Mitigation)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>Downtime & Reboots</td>
                    <td style={{ padding: '14px 16px', color: '#F87171' }}>Scheduled weekend maintenance reboot window</td>
                    <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>Zero downtime (Runtime parameter drop-in)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>Rollout Confidence</td>
                    <td style={{ padding: '14px 16px', color: '#FCD34D' }}>High risk of collateral breakage across apps</td>
                    <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>Canary 2% ring with automated health sentinel</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>Compliance & Proof</td>
                    <td style={{ padding: '14px 16px', color: '#FCD34D' }}>Manual Excel spreadsheets / screenshots for audit</td>
                    <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>Cryptographic Cosign signature + CycloneDX VEX</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeConcept === 'implement' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <Terminal size={22} color="#38BDF8" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#38BDF8' }}>
                Customer Implementation Playbook: How You Roll This Out
              </h2>
            </div>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Enterprises have diverse infrastructure stacks. Exultia Kinetic supports <strong>four distinct integration topologies</strong>, ranging from 60-second zero-agent cron hooks to enterprise GitOps PR bots and centralized Ansible orchestration:
            </p>

            {/* IMPLEMENTATION SUB-NAV */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'systemd', label: '1. Zero-Agent Systemd Hook', icon: '⚡' },
                { id: 'gitops', label: '2. GitOps & PR Bot (CI/CD)', icon: '🐙' },
                { id: 'ansible', label: '3. Central Ansible Orchestrator', icon: '📜' },
                { id: 'agent', label: '4. Kinetic Micro-Daemon', icon: '🛡️' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveImplementTab(t.id as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: activeImplementTab === t.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: activeImplementTab === t.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                    color: activeImplementTab === t.id ? '#38BDF8' : '#94A3B8',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: SYSTEMD / CRON */}
            {activeImplementTab === 'systemd' && (
              <div style={{ background: '#090D16', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: '#F8FAFC', fontSize: '0.95rem' }}>Topolgy A: Lightweight Systemd Timer (No Agent, Zero Overhead)</strong>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>EASIEST SETUP (60s)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '12px' }}>
                  Ideal for Linux VM fleets, edge nodes, and air-gapped staging servers. A lightweight systemd timer wakes up every 15 minutes, polls your authenticated Kinetic feed for your distro, verifies the signature, and applies hot-mitigations.
                </p>

                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>1. CREATE /etc/systemd/system/exultia-kinetic.service</span>
                  <pre style={{ background: '#040711', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#38BDF8', marginTop: '4px' }}>
{`[Unit]
Description=Exultia Kinetic Rapid Remediation Runner
After=network-online.target

[Service]
Type=oneshot
ExecStart=/bin/sh -c "curl -sL --fail 'https://api.exultia.tech/patches/feed?format=bash&os=rocky&token=YOUR_API_TOKEN' | /bin/sh"
StandardOutput=journal
StandardError=journal`}
                  </pre>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>2. CREATE /etc/systemd/system/exultia-kinetic.timer (Polls every 15m)</span>
                  <pre style={{ background: '#040711', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#34D399', marginTop: '4px' }}>
{`[Unit]
Description=Run Exultia Kinetic every 15 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=15min
Persistent=true

[Install]
WantedBy=timers.target

# Enable & activate:
# systemctl daemon-reload && systemctl enable --now exultia-kinetic.timer`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 2: GITOPS & PR BOT */}
            {activeImplementTab === 'gitops' && (
              <div style={{ background: '#090D16', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: '#F8FAFC', fontSize: '0.95rem' }}>Topology B: GitOps Automated PR Bot (GitHub Actions / GitLab CI)</strong>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>FOR KUBERNETES & CLOUD-NATIVE</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '12px' }}>
                  Never touch production servers directly. Exultia Kinetic dispatches a repository webhook when an emergency CVE/KEV drops. Your CI pipeline automatically opens an auditable Pull Request containing the exact Ansible or DaemonSet patch, SLSA proof, and ephemeral VM test logs.
                </p>

                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>.github/workflows/exultia-patch-sync.yml</span>
                  <pre style={{ background: '#040711', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#C084FC', marginTop: '4px' }}>
{`name: Exultia Kinetic GitOps Sync
on:
  repository_dispatch:
    types: [exultia-patch-advisory]

jobs:
  stage-hotfix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Stage Hot-Mitigation Playbook
        run: |
          mkdir -p playbooks/security-hotfixes
          echo "\${{ github.event.client_payload.ansiblePlaybook }}" > playbooks/security-hotfixes/\${{ github.event.client_payload.cveId }}.yml
      - name: Open Audited Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          title: "🚨 [HOTFIX] \${{ github.event.client_payload.cveId }} (\${{ github.event.client_payload.title }})"
          branch: "exultia-patch/\${{ github.event.client_payload.cveId }}"
          body: |
            ### Automated Emergency Patch from Exultia Kinetic
            * **CVE:** \${{ github.event.client_payload.cveId }}
            * **Severity:** \${{ github.event.client_payload.severity }} (CVSS \${{ github.event.client_payload.cvss }})
            * **CISA KEV:** \${{ github.event.client_payload.cisaKev }}
            * **SLSA Provenance:** Signed via Cosign (\${{ github.event.client_payload.cosignDigest }})`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: ANSIBLE TOWER */}
            {activeImplementTab === 'ansible' && (
              <div style={{ background: '#090D16', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: '#F8FAFC', fontSize: '0.95rem' }}>Topology C: Centralized Ansible Tower / AWX Fleet Orchestrator</strong>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>FOR 1,000+ SERVER FLEETS</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '12px' }}>
                  Connect your existing Ansible Tower, AWX, or SaltStack control plane. Exultia Kinetic feeds directly into a dynamic workflow template that rolls out patches with <code>serial: &quot;5%&quot;</code> canary pacing.
                </p>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>ANSIBLE TOWER WORKFLOW TEMPLATE EXECUTION</span>
                  <pre style={{ background: '#040711', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#34D399', marginTop: '4px' }}>
{`# 1. Fetch live playbooks directly from Exultia Kinetic API:
curl -s -H "Authorization: Bearer $EXULTIA_TOKEN" \\
  "https://api.exultia.tech/patches/feed?format=ansible&severity=critical" > /etc/ansible/kinetic_urgent.yml

# 2. Trigger AWX / Tower CLI job launch with rolling canary strategy:
awx job_templates launch "Kinetic-Fleet-Remediation" \\
  --extra_vars '{"serial_percent": "5%", "telemetry_wait_seconds": 600}'`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: MICRO-DAEMON */}
            {activeImplementTab === 'agent' && (
              <div style={{ background: '#090D16', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: '#F8FAFC', fontSize: '0.95rem' }}>Topology D: Kinetic Micro-Daemon (Real-Time Push Stream)</strong>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>FOR REAL-TIME SOC TELEMETRY</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '12px' }}>
                  A lightweight 12MB static binary (Go/Rust) with 0 runtime dependencies. Maintains a long-lived mTLS WebSocket connection to Exultia Cloud. When a patch is published, the daemon evaluates local kernel/package versions in microseconds and streams real-time execution status back to your central SecOps dashboard.
                </p>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>1-LINE ENROLLMENT SCRIPT</span>
                  <pre style={{ background: '#040711', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#FBBF24', marginTop: '4px' }}>
{`# Install and enroll host into customer enclave:
curl -sL https://download.exultia.tech/kinetic-agent.sh | \\
  sudo bash -s -- --token="exultia_org_sec8921" --canary-ring="ring-0" --auto-apply="tier1"`}
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}"""

if matrix_end_marker in content and "Customer Implementation Playbook" not in content:
    content = content.replace(matrix_end_marker, implement_section_code)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Implementation guide added to page.tsx")
elif "Customer Implementation Playbook" in content:
    print("INFO: Implementation guide already present")
else:
    print("WARNING: Could not find matrix_end_marker in page.tsx")
