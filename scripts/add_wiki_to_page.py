import re

with open("src/app/app/patches/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update lucide-react import to include BookOpen, AlertTriangle, ShieldCheck
if "BookOpen," not in content:
    content = content.replace("RotateCcw,", "RotateCcw,\n  BookOpen,\n  AlertTriangle,\n  ShieldCheck,")

# 2. Update ConceptTab type
content = content.replace("type ConceptTab = 'velocity' | 'canary' | 'slsa' | 'matrix' | 'implement';", "type ConceptTab = 'velocity' | 'canary' | 'slsa' | 'matrix' | 'implement' | 'wiki';")

# 3. Add Tab 6 button after Tab 5
tab5_pattern = r'(/\* TAB 5: IMPLEMENTATION PLAYBOOK \*/[\s\S]*?</button>)'
tab6_button = """
          {/* TAB 6: CUSTOMER WIKI & ROLLBACK MANUAL */}
          <button 
            onClick={() => setActiveConcept('wiki')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: activeConcept === 'wiki' ? '1px solid #EC4899' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeConcept === 'wiki' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: activeConcept === 'wiki' ? '0 0 15px rgba(236, 72, 153, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: activeConcept === 'wiki' ? '#EC4899' : '#F8FAFC' }}>
                6. Operations & Rollback Wiki
              </span>
              <BookOpen size={18} color={activeConcept === 'wiki' ? '#EC4899' : '#64748B'} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
              Customer playbook: Step-by-step rollout guide, self-healing traps, and emergency zero-downtime rollback runbooks.
            </span>
          </button>"""

content = re.sub(tab5_pattern, r'\1' + tab6_button, content, count=1)

# 4. Add the Wiki view inside Concept Detail Breakdown
wiki_view = """
        {activeConcept === 'wiki' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <BookOpen size={24} color="#EC4899" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#EC4899' }}>
                Customer Operations Wiki & Emergency Rollback Runbook
              </h2>
            </div>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Comprehensive operational manual for enterprise SecOps and SRE teams deploying Exultia Kinetic. Includes deterministic self-healing traps, manual CLI rollbacks, and fleet-wide reversal procedures.
            </p>

            {/* WIKI SECTIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* SECTION 1: STEP-BY-STEP WORKFLOW */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <span style={{ background: '#0EA5E9', color: '#FFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
                    Production Rollout Lifecycle: Step-by-Step
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #0EA5E9' }}>
                    <div style={{ fontWeight: 600, color: '#38BDF8', fontSize: '0.88rem', marginBottom: '4px' }}>Step 1: Feed Ingestion</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>Query JSON or bash stream with Bearer auth. Filter by <code style={{ color: '#22D3EE' }}>?os=ubuntu|rocky</code> and <code style={{ color: '#F59E0B' }}>?severity=critical</code>.</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #8B5CF6' }}>
                    <div style={{ fontWeight: 600, color: '#A78BFA', fontSize: '0.88rem', marginBottom: '4px' }}>Step 2: SLSA 3 Verification</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>Validate Cosign OIDC certificate against <code style={{ color: '#C084FC' }}>security@exultia.tech</code> transparency log before execution.</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
                    <div style={{ fontWeight: 600, color: '#34D399', fontSize: '0.88rem', marginBottom: '4px' }}>Step 3: Staged Canary Rings</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>Deploy to Ring 0 (2% nodes). Soak 15 mins. Telemetry gate evaluates latency p99 and daemon socket errors before Ring 1.</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #EC4899' }}>
                    <div style={{ fontWeight: 600, color: '#F472B6', fontSize: '0.88rem', marginBottom: '4px' }}>Step 4: Automated Verification</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>Execute daemon verification checks (<code style={{ color: '#F472B6' }}>sshd -T</code>, socket state). Self-heals instantly if checks fail.</div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ROLLBACK PROCEDURES (DEEP DIVE) */}
              <div style={{ background: 'rgba(236, 72, 153, 0.06)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RotateCcw size={20} color="#EC4899" />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#EC4899' }}>
                      Deterministic Disaster Recovery & Rollback Procedures
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(236, 72, 153, 0.2)', color: '#F472B6', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                    100% REVERSIBLE • ZERO REBOOT
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* SCENARIO 1 */}
                  <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.92rem' }}>
                        Scenario 1: OpenSSH Mitigation Rollback (CVE-2024-6387 RegreSSHion)
                      </span>
                      <button 
                        onClick={() => copyToClipboard('sudo rm -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf && sudo sshd -t && (sudo systemctl reload sshd 2>/dev/null || sudo systemctl reload ssh)', 'rb-ssh')}
                        style={{ background: 'transparent', border: 'none', color: '#EC4899', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiedText === 'rb-ssh' ? <Check size={14} /> : <Copy size={14} />}
                        {copiedText === 'rb-ssh' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 8px 0' }}>
                      Removes drop-in configuration, validates syntax via <code style={{ color: '#22D3EE' }}>sshd -t</code>, and gracefully reloads the active daemon without dropping established user sessions.
                    </p>
                    <div style={{ background: '#050811', padding: '0.8rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#F472B6' }}>
                      sudo rm -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf<br />
                      sudo sshd -t && (sudo systemctl reload sshd 2&gt;/dev/null || sudo systemctl reload ssh)
                    </div>
                  </div>

                  {/* SCENARIO 2 */}
                  <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.92rem' }}>
                        Scenario 2: CUPS Daemon & Port Unblock (CVE-2024-47176)
                      </span>
                      <button 
                        onClick={() => copyToClipboard('sudo iptables -D INPUT -p udp --dport 631 -j DROP 2>/dev/null || true ; sudo systemctl enable --now cups-browsed', 'rb-cups')}
                        style={{ background: 'transparent', border: 'none', color: '#EC4899', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiedText === 'rb-cups' ? <Check size={14} /> : <Copy size={14} />}
                        {copiedText === 'rb-cups' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 8px 0' }}>
                      Deletes firewall packet drop rule for UDP port 631 and unmasks/re-enables the cups-browsed daemon.
                    </p>
                    <div style={{ background: '#050811', padding: '0.8rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#F472B6' }}>
                      sudo iptables -D INPUT -p udp --dport 631 -j DROP 2&gt;/dev/null || true<br />
                      sudo systemctl enable --now cups-browsed
                    </div>
                  </div>

                  {/* SCENARIO 3 */}
                  <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.92rem' }}>
                        Scenario 3: Kernel Sysctl User Namespace Rollback (CVE-2024-1086)
                      </span>
                      <button 
                        onClick={() => copyToClipboard('sudo rm -f /etc/sysctl.d/99-kinetic-*.conf && sudo sysctl -w user.max_user_namespaces=15000 && sudo sysctl --system', 'rb-sysctl')}
                        style={{ background: 'transparent', border: 'none', color: '#EC4899', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiedText === 'rb-sysctl' ? <Check size={14} /> : <Copy size={14} />}
                        {copiedText === 'rb-sysctl' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 8px 0' }}>
                      Removes kernel hardening sysctl drop-in and re-enables unprivileged user namespaces to organization baseline.
                    </p>
                    <div style={{ background: '#050811', padding: '0.8rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#F472B6' }}>
                      sudo rm -f /etc/sysctl.d/99-kinetic-*.conf &amp;&amp; sudo sysctl -w user.max_user_namespaces=15000 &amp;&amp; sudo sysctl --system
                    </div>
                  </div>

                  {/* SCENARIO 4 */}
                  <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.92rem' }}>
                        Scenario 4: Centralized Fleetwide Rollback via Ansible
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 8px 0' }}>
                      To revert 10,000+ nodes simultaneously in an emergency, execute the reverse playbook across production inventory:
                    </p>
                    <div style={{ background: '#050811', padding: '0.8rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#38BDF8' }}>
                      ansible-playbook -i production_inventory.ini emergency_reversal.yml --extra-vars &quot;serial=100%&quot;
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 3: POST-ROLLBACK FORENSIC AUDIT CHECKLIST */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <ShieldCheck size={20} color="#10B981" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
                    Post-Rollback Health & Audit Verification Checklist
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', fontSize: '0.82rem', color: '#94A3B8' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Service Active State</strong>: <code style={{ color: '#E2E8F0' }}>systemctl is-active ssh || sshd</code> returns <em>active</em>.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Drop-in File Absence</strong>: Verified drop-in removed from <code style={{ color: '#E2E8F0' }}>/etc/ssh/sshd_config.d/</code>.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Runtime Parameter Reset</strong>: <code style={{ color: '#E2E8F0' }}>sshd -T</code> reports baseline <code style={{ color: '#E2E8F0' }}>logingracetime 120</code>.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Journald Audit Inspection</strong>: <code style={{ color: '#E2E8F0' }}>journalctl -u exultia-kinetic.service -n 10</code> shows clean deactivation.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
"""

# Insert before the end of CONCEPT DETAIL BREAKDOWN
target = "      {/* ── CONCEPT DETAIL BREAKDOWN ── */}"
content = content.replace("      {/* ── CONCEPT DETAIL BREAKDOWN ── */}\n      <div className=\"glass-card\" style={{ padding: '2rem', marginBottom: '2.5rem' }}>",
                          "      {/* ── CONCEPT DETAIL BREAKDOWN ── */}\n      <div className=\"glass-card\" style={{ padding: '2rem', marginBottom: '2.5rem' }}>" + wiki_view)

with open("src/app/app/patches/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully injected Customer Operational Wiki & Rollback Manual into patches/page.tsx!")
