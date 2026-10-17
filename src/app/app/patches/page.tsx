'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Zap, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Server, 
  Cpu, 
  Layers, 
  GitFork, 
  Flame, 
  ArrowRight, 
  Lock, 
  RotateCcw,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Code2,
  FileCheck2,
  Activity,
  Search,
  Filter,
  Package,
  Wrench,
  Ban
} from 'lucide-react';
import { KineticIcon } from '@/components/BrandIcons';
import { SAMPLE_PATCH_FEED, type PatchFeedItem } from '@/lib/patch-data';
type ConceptTab = 'velocity' | 'canary' | 'slsa' | 'matrix' | 'implement' | 'wiki';

export default function PatchFeedConceptPage() {
  const [activeConcept, setActiveConcept] = useState<ConceptTab>('velocity');
  const [selectedPatch, setSelectedPatch] = useState<PatchFeedItem>(SAMPLE_PATCH_FEED[0]);
  const [selectedPayloadTab, setSelectedPayloadTab] = useState<'tier1' | 'tier2' | 'tier3' | 'rawJson'>('tier1');
  const [activeImplementTab, setActiveImplementTab] = useState<'systemd' | 'gitops' | 'ansible' | 'agent'>('systemd');
  const [selectedDistro, setSelectedDistro] = useState<'all' | 'ubuntu' | 'rocky' | 'alpine'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationDone, setSimulationDone] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationDone(false);
    setSimulationProgress(5);
    setSimulationLogs([
      `[${new Date().toISOString()}] [INIT] Connecting to Exultia Kinetic Stream: ${selectedPatch.id}...`,
      `[TARGET] Vulnerability: ${selectedPatch.cveId} - ${selectedPatch.title}`,
      `[FLEET] Target inventory: 640 hybrid hosts (240 Ubuntu 24.04, 200 Rocky 9, 200 Alpine Containers)`
    ]);

    const steps = [
      {
        delay: 800,
        progress: 25,
        log: `[RING 0 CANARY] Staging 12 canary nodes (2.0% slice). Deploying Tier 1 Hot-Mitigation...`
      },
      {
        delay: 1600,
        progress: 45,
        log: `[APPLY] Executed: ${selectedPatch.remediationTier.tier1_hotMitigation.commands[0]}`
      },
      {
        delay: 2400,
        progress: 65,
        log: `[SENTINEL TELEMETRY] Verification check: "${selectedPatch.remediationTier.tier1_hotMitigation.verificationCommand}" -> OK`
      },
      {
        delay: 3200,
        progress: 80,
        log: `[SENTINEL TELEMETRY] Error rate: 0.00% | Latency delta: +0.1ms | Services: 100% HEALTHY. Promoting to Ring 1...`
      },
      {
        delay: 4000,
        progress: 100,
        log: `[COMPLETED] Fleet synchronized in 4.2s. 640/640 hosts hardened. Zero reboots required.`
      }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, step.log]);
        setSimulationProgress(step.progress);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
          setSimulationDone(true);
        }
      }, step.delay);
    });
  };

  const filteredPatches = selectedDistro === 'all' 
    ? SAMPLE_PATCH_FEED 
    : SAMPLE_PATCH_FEED.filter(p => p.affectedDistros.includes(selectedDistro as any));

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', color: '#F8FAFC' }}>
      
      {/* ── TOP BREADCRUMB & BADGE ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/preview" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem' }}>Exultia Suite</Link>
          <span style={{ color: '#64748B' }}>/</span>
          <span style={{ color: '#22D3EE', fontSize: '0.88rem', fontWeight: 600 }}>Kinetic Patch Feed Concept</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '6px 14px', borderRadius: '9999px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22D3EE', boxShadow: '0 0 10px #22D3EE' }} />
          <span style={{ fontSize: '0.78rem', color: '#22D3EE', fontWeight: 600, letterSpacing: '0.04em' }}>ARCHITECTURE DESIGN LAB</span>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="glass-card" style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: '2.5rem', 
        marginBottom: '2rem',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        background: 'linear-gradient(135deg, rgba(8, 20, 35, 0.85) 0%, rgba(12, 16, 26, 0.95) 100%)'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.15, pointerEvents: 'none' }}>
          <KineticIcon size={340} glow={false} />
        </div>

        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem' }}>
            <KineticIcon size={44} />
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #FFFFFF 0%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Exultia Kinetic
            </h1>
            <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
              RAPID PATCH FEED
            </span>
          </div>

          <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Enterprise security teams face a catastrophic 14–30 day Mean Time to Remediate (MTTR), while attackers weaponize exploits in under 48 hours. <strong>Exultia Kinetic</strong> transforms patch management from slow monthly maintenance into an automated, machine-executable stream of zero-downtime micro-mitigations.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#22D3EE" />
              <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}><strong style={{ color: '#F8FAFC' }}>&lt; 15 min</strong> Response Window</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="#10B981" />
              <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}><strong style={{ color: '#F8FAFC' }}>Zero-Downtime</strong> Workarounds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#F59E0B" />
              <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}><strong style={{ color: '#F8FAFC' }}>Canary Ring</strong> Rollout Safety</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck2 size={18} color="#8B5CF6" />
              <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}><strong style={{ color: '#F8FAFC' }}>SLSA L3</strong> Cryptographic Proof</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONCEPT SELECTION TABS ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 700, marginBottom: '0.75rem' }}>
          Explore Enterprise Architecture Concepts
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          
          {/* TAB 1 */}
          <button 
            onClick={() => setActiveConcept('velocity')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: activeConcept === 'velocity' ? '1px solid #22D3EE' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeConcept === 'velocity' ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.6)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: activeConcept === 'velocity' ? '#22D3EE' : '#F8FAFC' }}>
                1. Velocity Stream
              </span>
              <Zap size={18} color={activeConcept === 'velocity' ? '#22D3EE' : '#64748B'} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
              3-tier machine-executable payloads (hot-mitigation, package pin, GitOps playbook) delivered via API & Webhook.
            </span>
          </button>

          {/* TAB 2 */}
          <button 
            onClick={() => setActiveConcept('canary')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: activeConcept === 'canary' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeConcept === 'canary' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.6)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: activeConcept === 'canary' ? '#10B981' : '#F8FAFC' }}>
                2. Canary Ring Staging
              </span>
              <Activity size={18} color={activeConcept === 'canary' ? '#10B981' : '#64748B'} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
              Autonomous ring deployment (Ring 0 Canary 2% → Telemetry Sentinel → Ring 1 25%) with instant automated rollback.
            </span>
          </button>

          {/* TAB 3 */}
          <button 
            onClick={() => setActiveConcept('slsa')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: activeConcept === 'slsa' ? '1px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeConcept === 'slsa' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(15, 23, 42, 0.6)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: activeConcept === 'slsa' ? '#8B5CF6' : '#F8FAFC' }}>
                3. Zero-Trust Provenance
              </span>
              <Lock size={18} color={activeConcept === 'slsa' ? '#8B5CF6' : '#64748B'} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
              SLSA Level 3 signed manifests via Cosign OIDC, automated ephemeral VM test logs, and CycloneDX VEX statements.
            </span>
          </button>

          {/* TAB 4 */}
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
          </button>
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
          </button>

        </div>

        {/* PROMINENT SYSTEMS RESEARCH LAB CALLOUT BANNER */}
        <div style={{
          marginTop: '1.25rem',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(56, 189, 248, 0.08))',
          border: '1px solid rgba(234, 179, 8, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}>
              <Terminal size={22} color="#EAB308" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Looking for the Systems Security Research Lab?
                </span>
                <span style={{ fontSize: '0.68rem', background: 'rgba(234, 179, 8, 0.2)', color: '#FDE047', border: '1px solid rgba(234, 179, 8, 0.4)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  TOP-LEVEL PORTAL
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                We&apos;ve graduated the 1972 Unix V1 PDP-11 simulator, Dennis Ritchie C kernel lineage, and Commercial Unix Titans (Solaris, IBM AIX, HP-UX) into our dedicated Systems Research Lab.
              </p>
            </div>
          </div>
          <Link
            href="/research"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            Launch Research Portal
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── CONCEPT DETAIL BREAKDOWN ── */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
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

        {activeConcept === 'velocity' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <Zap size={22} color="#22D3EE" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#22D3EE' }}>
                Concept 1: The Machine-Executable Velocity Stream
              </h2>
            </div>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Rather than forcing sysadmins to read advisory text and manually research fixes, the Kinetic feed breaks down every critical vulnerability into three structured tiers of automated remediation. Systems can auto-apply Tier 1 within 5 minutes without touching upstream software packages or taking down active user traffic.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(8, 15, 28, 0.8)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: '#22D3EE', color: '#06080D', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>TIER 1</span>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Hot-Mitigation (0 Downtime)</strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Immediate configuration drop-ins, eBPF packet filters, sysctl tweaks, or service parameter overrides. <strong>Applied in &lt; 60 seconds</strong> without rebooting or restarting critical clusters.
                </p>
              </div>

              <div style={{ background: 'rgba(8, 15, 28, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: '#10B981', color: '#06080D', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>TIER 2</span>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Atomic Package Pin</strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Surgically upgrades <em>only</em> the affected library or binary (via <code>apt-get --only-upgrade</code>, <code>dnf upgrade</code>, etc.) preventing untested system-wide dependency drift.
                </p>
              </div>

              <div style={{ background: 'rgba(8, 15, 28, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: '#8B5CF6', color: '#06080D', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>TIER 3</span>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>GitOps & Ansible Playbook</strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Declarative Infrastructure-as-Code recipes ready for GitOps (Flux/ArgoCD) or Enterprise Ansible Tower, ensuring permanent immutable compliance across all environments.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeConcept === 'canary' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <Activity size={22} color="#10B981" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#10B981' }}>
                Concept 2: Canary Ring Staging & Autonomous Rollback
              </h2>
            </div>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              The #1 blocker of rapid patching in the enterprise is <strong>fear of service disruption</strong> ("Patch Tuesday breaks production on Wednesday"). The Kinetic Canary Engine guarantees safety by executing progressive ring rollouts backed by live health sentinels.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>PHASE 1</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10B981', margin: '4px 0' }}>Ring 0 (Canary 2%)</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Deploy to designated sacrificial staging / canary hosts.</div>
              </div>

              <ArrowRight size={24} color="#64748B" />

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>PHASE 2</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#22D3EE', margin: '4px 0' }}>Telemetry Sentinel (10m)</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Watches systemd crashes, dmesg segfaults, and APM error spikes.</div>
              </div>

              <ArrowRight size={24} color="#64748B" />

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>PHASE 3</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8B5CF6', margin: '4px 0' }}>Ring 1 → Ring 2 (Prod 100%)</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Auto-promotes if healthy; triggers instant automated rollback if anomalous.</div>
              </div>
            </div>
          </div>
        )}

        {activeConcept === 'slsa' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <Lock size={22} color="#8B5CF6" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#8B5CF6' }}>
                Concept 3: Zero-Trust Cryptographic SLSA Level 3 Feed
              </h2>
            </div>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              In highly regulated enclaves (FedRAMP High, DoD, PCI-DSS v4, Healthcare), sysadmins cannot pipe unverified scripts into production shells. Every patch payload in Exultia Kinetic carries an immutable chain-of-custody cryptographic signature and proof-of-execution test report.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                  <FileCheck2 size={18} />
                  Cosign OIDC Signatures
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Signed with keyless OIDC transparency log (Rekor). Any altered byte or tampered payload is instantly rejected by the client runner.
                </p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                  <Server size={18} />
                  Bare-Metal Ephemeral VM Proof
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Every fix is pre-tested on genuine Rocky 9 & Ubuntu 24.04 QEMU runner nodes. The test execution duration and exit code 0 are bundled into the feed metadata.
                </p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                  <Code2 size={18} />
                  CycloneDX VEX Attestations
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Exports standard Vulnerability Exploitability eXchange (VEX) JSON for automated ingestion by enterprise SIEM/SOAR platforms (Wiz, Prisma Cloud, Splunk).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeConcept === 'matrix' && (
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
curl -s -H "Authorization: Bearer $EXULTIA_TOKEN" \
  "https://api.exultia.tech/patches/feed?format=ansible&severity=critical" > /etc/ansible/kinetic_urgent.yml

# 2. Trigger AWX / Tower CLI job launch with rolling canary strategy:
awx job_templates launch "Kinetic-Fleet-Remediation" \
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
curl -sL https://download.exultia.tech/kinetic-agent.sh | \
  sudo bash -s -- --token="exultia_org_sec8921" --canary-ring="ring-0" --auto-apply="tier1"`}
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ── LIVE INTERACTIVE FEED DEMO & FLEET SIMULATOR ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: LIVE FEED ADVISORY LIST */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#EF4444" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Active Threat Stream</h3>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              LIVE KEV
            </span>
          </div>

          {/* OS Filter */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
            {(['all', 'ubuntu', 'rocky', 'alpine'] as const).map(os => (
              <button
                key={os}
                onClick={() => setSelectedDistro(os)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: '6px',
                  border: selectedDistro === os ? '1px solid #22D3EE' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: selectedDistro === os ? 'rgba(6, 182, 212, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                  color: selectedDistro === os ? '#22D3EE' : '#94A3B8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {os}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPatches.map(patch => {
              const isSelected = selectedPatch.id === patch.id;
              return (
                <div
                  key={patch.id}
                  onClick={() => setSelectedPatch(patch)}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid #22D3EE' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{patch.cveId}</span>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 800, 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      background: patch.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: patch.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B'
                    }}>
                      CVSS {patch.cvss}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '8px', lineHeight: 1.4 }}>
                    {patch.title}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                    <span>{patch.id}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {patch.affectedDistros.map(d => (
                        <span key={d} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2px 5px', borderRadius: '3px', textTransform: 'capitalize' }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick API Snippet */}
          <div style={{ marginTop: '1.5rem', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22D3EE', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} />
              Machine-Executable Feed Endpoint
            </div>
            <code style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', wordBreak: 'break-all', background: '#090D16', padding: '8px', borderRadius: '6px' }}>
              curl -sL &quot;http://localhost:3000/api/patches/feed?format=bash&quot; | sh
            </code>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONABLE REMEDIATION ENGINE & FLEET SIMULATOR */}
        <div>
          {/* ADVISORY HEADER */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>ADVISORY DETAILS</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 0 0', color: '#F8FAFC' }}>
                  {selectedPatch.cveId}: {selectedPatch.title}
                </h2>
              </div>
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                style={{
                  background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isSimulating ? 'not-allowed' : 'pointer',
                  opacity: isSimulating ? 0.7 : 1,
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
                }}
              >
                <Zap size={16} />
                {isSimulating ? 'Canary Simulating...' : 'Simulate Fleet Push'}
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '0 0 1rem 0' }}>
              {selectedPatch.remediationTier.tier1_hotMitigation.summary}
            </p>

            {/* Provenance Badge Row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
              <div><strong style={{ color: '#E2E8F0' }}>Signer:</strong> {selectedPatch.provenance.signedBy}</div>
              <div><strong style={{ color: '#E2E8F0' }}>Validation:</strong> {selectedPatch.provenance.testValidation.targetEnv} (0 errors)</div>
              <div><strong style={{ color: '#E2E8F0' }}>SLSA:</strong> Level {selectedPatch.provenance.slsaLevel}</div>
            </div>
          </div>

          {/* SIMULATION TERMINAL (IF ACTIVE OR DONE) */}
          {(isSimulating || simulationDone) && (
            <div className="glass-card" style={{ 
              padding: '1.25rem', 
              marginBottom: '1.5rem', 
              background: '#090D16', 
              border: '1px solid rgba(6, 182, 212, 0.4)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={16} color="#22D3EE" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22D3EE' }}>
                    Kinetic Autonomous Fleet Runner (Simulation)
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: simulationDone ? '#34D399' : '#FCD34D', fontWeight: 700 }}>
                  {simulationDone ? 'SUCCESS (0 FAILURES)' : `RUNNING: ${simulationProgress}%`}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: `${simulationProgress}%`, height: '100%', background: simulationDone ? '#10B981' : '#06B6D4', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto' }}>
                {simulationLogs.map((log, i) => (
                  <div key={i} style={{ color: log.includes('COMPLETED') ? '#34D399' : log.includes('CANARY') ? '#FCD34D' : '#94A3B8' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYLOAD CODE VIEWER */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            {/* TABS */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.25rem', gap: '4px' }}>
              <button
                onClick={() => setSelectedPayloadTab('tier1')}
                style={{
                  padding: '8px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: selectedPayloadTab === 'tier1' ? '2px solid #22D3EE' : '2px solid transparent',
                  color: selectedPayloadTab === 'tier1' ? '#22D3EE' : '#94A3B8',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Tier 1: Hot-Mitigation (0 Downtime)
              </button>

              <button
                onClick={() => setSelectedPayloadTab('tier2')}
                style={{
                  padding: '8px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: selectedPayloadTab === 'tier2' ? '2px solid #10B981' : '2px solid transparent',
                  color: selectedPayloadTab === 'tier2' ? '#10B981' : '#94A3B8',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Tier 2: Package Commands
              </button>

              <button
                onClick={() => setSelectedPayloadTab('tier3')}
                style={{
                  padding: '8px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: selectedPayloadTab === 'tier3' ? '2px solid #8B5CF6' : '2px solid transparent',
                  color: selectedPayloadTab === 'tier3' ? '#8B5CF6' : '#94A3B8',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Tier 3: Ansible Playbook
              </button>

              <button
                onClick={() => setSelectedPayloadTab('rawJson')}
                style={{
                  padding: '8px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: selectedPayloadTab === 'rawJson' ? '2px solid #F59E0B' : '2px solid transparent',
                  color: selectedPayloadTab === 'rawJson' ? '#F59E0B' : '#94A3B8',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Raw JSON Feed
              </button>
            </div>

            {/* TAB CONTENT 1: TIER 1 */}
            {selectedPayloadTab === 'tier1' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>SHELL COMMANDS</span>
                  <button
                    onClick={() => copyToClipboard(selectedPatch.remediationTier.tier1_hotMitigation.commands.join('\n'), 'tier1')}
                    style={{ background: 'transparent', border: 'none', color: '#22D3EE', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedText === 'tier1' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedText === 'tier1' ? 'Copied' : 'Copy Commands'}
                  </button>
                </div>

                <div style={{ background: '#090D16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1rem' }}>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.82rem', color: '#38BDF8', lineHeight: 1.6 }}>
                    {selectedPatch.remediationTier.tier1_hotMitigation.commands.join('\n')}
                  </pre>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginBottom: '4px' }}>VERIFICATION CHECK</div>
                    <code style={{ fontSize: '0.75rem', color: '#34D399', background: '#090D16', padding: '6px 10px', borderRadius: '6px', display: 'block' }}>
                      {selectedPatch.remediationTier.tier1_hotMitigation.verificationCommand}
                    </code>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginBottom: '4px' }}>INSTANT ROLLBACK</div>
                    <code style={{ fontSize: '0.75rem', color: '#F87171', background: '#090D16', padding: '6px 10px', borderRadius: '6px', display: 'block' }}>
                      {selectedPatch.remediationTier.tier1_hotMitigation.rollbackCommand}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: TIER 2 */}
            {selectedPayloadTab === 'tier2' && (
              <div>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem' }}>
                  Single-package atomic upgrade commands tailored by target distribution:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(selectedPatch.remediationTier.tier2_packageUpgrade.distroCommands).map(([distro, cmd]) => (
                    <div key={distro} style={{ background: '#090D16', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FCD34D', textTransform: 'uppercase', marginRight: '10px' }}>
                          {distro}
                        </span>
                        <code style={{ fontSize: '0.8rem', color: '#E2E8F0', fontFamily: 'monospace' }}>
                          {cmd}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(cmd, distro)}
                        style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                      >
                        {copiedText === distro ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: TIER 3 */}
            {selectedPayloadTab === 'tier3' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>ANSIBLE GITOPS PLAYBOOK</span>
                  <button
                    onClick={() => copyToClipboard(selectedPatch.remediationTier.tier3_fleetAutomation.ansiblePlaybook, 'ansible')}
                    style={{ background: 'transparent', border: 'none', color: '#8B5CF6', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedText === 'ansible' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedText === 'ansible' ? 'Copied' : 'Copy Playbook'}
                  </button>
                </div>

                <div style={{ background: '#090D16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', maxHeight: '300px', overflowY: 'auto' }}>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.78rem', color: '#C084FC', lineHeight: 1.5 }}>
                    {selectedPatch.remediationTier.tier3_fleetAutomation.ansiblePlaybook}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: RAW JSON */}
            {selectedPayloadTab === 'rawJson' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>STREAMING JSON PAYLOAD</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedPatch, null, 2), 'rawJson')}
                    style={{ background: 'transparent', border: 'none', color: '#F59E0B', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedText === 'rawJson' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedText === 'rawJson' ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>

                <div style={{ background: '#090D16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', maxHeight: '300px', overflowY: 'auto' }}>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#FDE047', lineHeight: 1.4 }}>
                    {JSON.stringify(selectedPatch, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
