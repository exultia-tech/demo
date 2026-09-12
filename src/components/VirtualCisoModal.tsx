'use client';

import React, { useState, useEffect } from 'react';
import { UviAdvisoryRecord } from '@/lib/threat-feed-data';
import { generateVirtualCisoBriefing, answerVirtualCisoQuestion, VirtualCisoBriefing } from '@/lib/virtual-ciso-engine';

interface VirtualCisoModalProps {
  advisory: UviAdvisoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

type CisoTab = 'layman' | 'technical' | 'qa';

export default function VirtualCisoModal({ advisory, isOpen, onClose }: VirtualCisoModalProps) {
  const [activeTab, setActiveTab] = useState<CisoTab>('layman');
  const [briefing, setBriefing] = useState<VirtualCisoBriefing | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Interactive Q&A State
  const [customQuestion, setCustomQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    if (advisory) {
      const b = generateVirtualCisoBriefing(advisory);
      setBriefing(b);
      setActiveTab('layman');
      setQaAnswer(null);
      setCustomQuestion('');
    }
  }, [advisory]);

  if (!isOpen || !advisory || !briefing) return null;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleAskPreset = (presetQuestion: string) => {
    setCustomQuestion(presetQuestion);
    setIsAnswering(true);
    setTimeout(() => {
      const ans = answerVirtualCisoQuestion(advisory, presetQuestion);
      setQaAnswer(ans);
      setIsAnswering(false);
    }, 200);
  };

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setIsAnswering(true);
    setTimeout(() => {
      const ans = answerVirtualCisoQuestion(advisory, customQuestion);
      setQaAnswer(ans);
      setIsAnswering(false);
    }, 200);
  };

  const fullReportMarkdown = `# Virtual CISO Intelligence Briefing: ${advisory.uviId}
## ${advisory.title}

### Plain-English Summary (Layman Perspective)
${briefing.plainEnglishSummary}

### Analogy: ${briefing.analogy.title}
${briefing.analogy.description}

### Business Impact & Urgency
- **Urgency**: ${briefing.businessImpact.urgencyBadge}
- **Who is Affected**: ${briefing.businessImpact.whoIsAffected}
- **Worst-Case Scenario**: ${briefing.businessImpact.worstCaseScenario}
- **CISO Verdict**: ${briefing.businessImpact.cisoVerdict}

### Technical Remediation
**Strategy**: ${briefing.technicalRemediation.strategyOverview}

#### Vulnerable Configuration:
\`\`\`${briefing.technicalRemediation.vulnerableExample.language}
${briefing.technicalRemediation.vulnerableExample.code}
\`\`\`

#### Fixed Configuration:
\`\`\`${briefing.technicalRemediation.fixedExample.language}
${briefing.technicalRemediation.fixedExample.code}
\`\`\`

#### Verification Test:
${briefing.technicalRemediation.verificationTest}

### Engineering Action Plan:
${briefing.cisoActionPlan.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}
`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.25rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0B0F1A',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(124, 58, 237, 0.18)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
                border: '1px solid rgba(167, 139, 250, 0.5)',
                color: '#DDD6FE',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.02em'
              }}>
                <span>🛡️</span>
                <span>Virtual CISO AI Advisor</span>
              </div>

              <span style={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#93C5FD',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}>
                {advisory.uviId}
              </span>

              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: briefing.businessImpact.urgencyColor,
                background: `${briefing.businessImpact.urgencyColor}18`,
                border: `1px solid ${briefing.businessImpact.urgencyColor}40`,
                padding: '0.2rem 0.55rem',
                borderRadius: '4px'
              }}>
                {briefing.businessImpact.urgencyBadge}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => handleCopy(fullReportMarkdown, 'fullReport')}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: copiedSection === 'fullReport' ? '#34D399' : '#CBD5E1',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
                title="Copy markdown executive briefing"
              >
                <span>{copiedSection === 'fullReport' ? '✓' : '📋'}</span>
                <span>{copiedSection === 'fullReport' ? 'Report Copied!' : 'Copy CISO Briefing'}</span>
              </button>

              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#94A3B8',
                  width: '32px',
                  height: '32px',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
                title="Close Virtual CISO"
              >
                ✕
              </button>
            </div>
          </div>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', margin: '0.65rem 0 0.2rem 0', lineHeight: 1.35 }}>
            {advisory.title}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0 }}>
            {briefing.headline}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 14, 24, 0.95)',
          padding: '0 1.75rem',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'layman', label: '📖 Layman Threat Summary', desc: 'Plain English & Analogy' },
            { id: 'technical', label: '🛠️ Technical Remediation', desc: 'Before vs. After Code Fix' },
            { id: 'qa', label: '💬 Ask Virtual CISO', desc: 'Interactive AI Assistant' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CisoTab)}
              style={{
                padding: '0.85rem 1.1rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #8B5CF6' : '2px solid transparent',
                color: activeTab === tab.id ? '#EDE9FE' : '#94A3B8',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.15rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: '0.66rem', color: activeTab === tab.id ? '#A78BFA' : '#64748B', fontWeight: 400 }}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content */}
        <div style={{
          padding: '1.5rem 1.75rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* TAB 1: LAYMAN PERSPECTIVE */}
          {activeTab === 'layman' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Executive Plain English Card */}
              <div style={{
                background: 'rgba(30, 27, 75, 0.25)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem 1.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>💡</span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#DDD6FE', margin: 0 }}>
                    In Plain English: What is happening?
                  </h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#F1F5F9', lineHeight: 1.65, margin: 0 }}>
                  {briefing.plainEnglishSummary}
                </p>
              </div>

              {/* Relatable Analogy Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.2rem 1.35rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🎭</span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#93C5FD', margin: 0 }}>
                    Real-World Analogy: {briefing.analogy.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{briefing.analogy.description}"
                </p>
              </div>

              {/* 3-Step Attack Flow */}
              <div>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', marginBottom: '0.65rem' }}>
                  How the Attack Actually Plays Out:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  {briefing.attackFlow.map((flow) => (
                    <div
                      key={flow.step}
                      style={{
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: '10px',
                        padding: '0.9rem 1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '1rem' }}>{flow.icon}</span>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#E2E8F0' }}>
                          Step {flow.step}: {flow.title}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.45, margin: 0 }}>
                        {flow.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Impact Grid */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
                    Who is at Risk?
                  </span>
                  <p style={{ fontSize: '0.82rem', color: '#F8FAFC', fontWeight: 600, marginTop: '0.25rem', lineHeight: 1.45 }}>
                    {briefing.businessImpact.whoIsAffected}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
                    Worst-Case Consequence
                  </span>
                  <p style={{ fontSize: '0.82rem', color: '#F87171', fontWeight: 600, marginTop: '0.25rem', lineHeight: 1.45 }}>
                    {briefing.businessImpact.worstCaseScenario}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
                    Virtual CISO Verdict
                  </span>
                  <p style={{ fontSize: '0.82rem', color: '#A7F3D0', fontWeight: 600, marginTop: '0.25rem', lineHeight: 1.45 }}>
                    {briefing.businessImpact.cisoVerdict}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL REMEDIATION */}
          {activeTab === 'technical' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Strategy Header */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#6EE7B7', margin: 0 }}>
                    Recommended Engineering Strategy
                  </h3>
                </div>
                <p style={{ fontSize: '0.86rem', color: '#D1FAE5', lineHeight: 1.55, margin: 0 }}>
                  {briefing.technicalRemediation.strategyOverview}
                </p>
              </div>

              {/* Side-by-Side Code Examples */}
              <div>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', marginBottom: '0.65rem' }}>
                  Concrete Configuration / Code Comparison:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
                  {/* Vulnerable Snippet */}
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '0.6rem 0.9rem',
                      background: 'rgba(239, 68, 68, 0.15)',
                      borderBottom: '1px solid rgba(239, 68, 68, 0.25)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FCA5A5' }}>
                        ❌ {briefing.technicalRemediation.vulnerableExample.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#FCA5A5' }}>
                        {briefing.technicalRemediation.vulnerableExample.filename}
                      </span>
                    </div>
                    <pre style={{
                      margin: 0,
                      padding: '0.9rem',
                      fontSize: '0.76rem',
                      fontFamily: 'monospace',
                      color: '#FECACA',
                      background: '#070B14',
                      overflowX: 'auto',
                      lineHeight: 1.5
                    }}>
                      {briefing.technicalRemediation.vulnerableExample.code}
                    </pre>
                    <div style={{ padding: '0.5rem 0.8rem', background: 'rgba(0, 0, 0, 0.2)', fontSize: '0.72rem', color: '#F87171' }}>
                      ⚠️ {briefing.technicalRemediation.vulnerableExample.annotation}
                    </div>
                  </div>

                  {/* Fixed Snippet */}
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '0.6rem 0.9rem',
                      background: 'rgba(16, 185, 129, 0.15)',
                      borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6EE7B7' }}>
                        ✅ {briefing.technicalRemediation.fixedExample.title}
                      </span>
                      <button
                        onClick={() => handleCopy(briefing.technicalRemediation.fixedExample.code, 'fixedCode')}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                          color: copiedSection === 'fixedCode' ? '#34D399' : '#A7F3D0',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedSection === 'fixedCode' ? '✓ Copied' : 'Copy Fix'}
                      </button>
                    </div>
                    <pre style={{
                      margin: 0,
                      padding: '0.9rem',
                      fontSize: '0.76rem',
                      fontFamily: 'monospace',
                      color: '#A7F3D0',
                      background: '#070B14',
                      overflowX: 'auto',
                      lineHeight: 1.5
                    }}>
                      {briefing.technicalRemediation.fixedExample.code}
                    </pre>
                    <div style={{ padding: '0.5rem 0.8rem', background: 'rgba(0, 0, 0, 0.2)', fontSize: '0.72rem', color: '#34D399' }}>
                      🛡️ {briefing.technicalRemediation.fixedExample.annotation}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Commands (if present) */}
              {briefing.technicalRemediation.quickCommands && briefing.technicalRemediation.quickCommands.length > 0 && (
                <div style={{
                  background: '#070B14',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '0.9rem 1.1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#93C5FD' }}>
                      ⚡ Terminal Commands & Quick Mitigations:
                    </span>
                    <button
                      onClick={() => handleCopy(briefing.technicalRemediation.quickCommands!.join('\n'), 'commands')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedSection === 'commands' ? '#34D399' : '#94A3B8',
                        fontSize: '0.7rem',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedSection === 'commands' ? '✓ Copied' : 'Copy Commands'}
                    </button>
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.76rem', fontFamily: 'monospace', color: '#CBD5E1', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {briefing.technicalRemediation.quickCommands.join('\n')}
                  </pre>
                </div>
              )}

              {/* Verification Test */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.9rem 1.1rem'
              }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#CBD5E1' }}>
                  🧪 How to Verify Your Fix:
                </span>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.3rem 0 0 0', lineHeight: 1.5 }}>
                  {briefing.technicalRemediation.verificationTest}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE ASK VIRTUAL CISO */}
          {activeTab === 'qa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Preset Quick Question Chips */}
              <div>
                <span style={{ fontSize: '0.76rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ask the Virtual CISO (Click any preset or type below):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {[
                    { label: '💼 30-sec summary for non-tech CEO', q: 'Give me a 30-second summary for non-technical CEO and board' },
                    { label: '💬 1-minute Slack message for dev team', q: 'What is a 1-minute Slack announcement I can post for developers?' },
                    { label: '🐳 Does this impact Docker containers?', q: 'How does this vulnerability affect our applications if we run them inside Docker or Kubernetes?' },
                    { label: '🛡️ Temporary emergency workaround', q: 'What are temporary workarounds if our team cannot upgrade today?' },
                    { label: '🔍 SOC detection & log hunting', q: 'What should our SOC and engineers hunt for in logs to detect exploitation?' },
                    { label: '🔐 Is authentication required?', q: 'Can an attacker exploit this anonymously or do they need valid credentials?' },
                    { label: '💻 Are developer laptops at risk?', q: 'How does this threat impact developer laptops, IDEs, and local build environments?' },
                    { label: '🧪 Commands to audit our repos', q: 'What terminal commands can developers run to test if our code is affected?' }
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskPreset(preset.q)}
                      style={{
                        background: 'rgba(139, 92, 246, 0.12)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#DDD6FE',
                        padding: '0.35rem 0.7rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)';
                        e.currentTarget.style.borderColor = '#A78BFA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Question Input Form */}
              <form onSubmit={handleAskCustom} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Ask the Virtual CISO anything about this threat (e.g. 'Can this be exploited via an API?')..."
                  style={{
                    flex: 1,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.9rem',
                    color: '#F8FAFC',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isAnswering || !customQuestion.trim()}
                  style={{
                    background: isAnswering || !customQuestion.trim() ? 'rgba(139, 92, 246, 0.2)' : 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '0.6rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: isAnswering || !customQuestion.trim() ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{isAnswering ? 'Analyzing...' : 'Ask CISO ✨'}</span>
                </button>
              </form>

              {/* AI Answer Display Card */}
              {qaAnswer && (
                <div style={{
                  background: 'rgba(30, 27, 75, 0.25)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.4rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#DDD6FE' }}>
                        Virtual CISO Response
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(qaAnswer, 'qaAnswer')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedSection === 'qaAnswer' ? '#34D399' : '#A78BFA',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      {copiedSection === 'qaAnswer' ? '✓ Copied' : 'Copy Answer'}
                    </button>
                  </div>
                  <div style={{
                    fontSize: '0.86rem',
                    color: '#F1F5F9',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {qaAnswer}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div style={{
          padding: '0.9rem 1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 14, 24, 0.95)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
            Virtual CISO Intelligence is powered by cross-correlated CTI, CVE taxonomy, and secure developer heuristics.
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close Briefing
          </button>
        </div>
      </div>
    </div>
  );
}
