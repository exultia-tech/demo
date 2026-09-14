"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Database, 
  Network, 
  FileCheck, 
  Eye, 
  AlertTriangle, 
  Scale, 
  FileText, 
  Search, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Sparkles,
  Layers,
  BookOpen,
  Filter,
  BarChart3
} from 'lucide-react';
import { 
  ALPR_CSF_FRAMEWORK, 
  ALPR_PILLARS, 
  ALPR_CONTROLS, 
  ALPR_CROSSWALK_MATRIX, 
  ALPR_ROLLOUT_PHASES 
} from '@/lib/governance/alprFrameworkData';
import { ControlSpecification, RequirementLevel } from '@/types/governance';

export default function AlprCsfPage() {
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [expandedControlId, setExpandedControlId] = useState<string | null>(null);
  
  // Interactive Self-Assessment State
  const [checkedControls, setCheckedControls] = useState<Record<string, boolean>>({
    'AC-01': true,
    'AC-03': true,
    'DG-03': true,
    'NA-03': true,
    'PS-04': true
  });

  // Copy States
  const [isCopiedMarkdown, setIsCopiedMarkdown] = useState(false);
  const [isCopiedOrdinance, setIsCopiedOrdinance] = useState(false);
  const [copiedControlId, setCopiedControlId] = useState<string | null>(null);

  // Filtered Controls
  const filteredControls = useMemo(() => {
    return ALPR_CONTROLS.filter(c => {
      const matchesPillar = selectedPillar === 'all' || c.pillarCode === selectedPillar;
      const matchesLevel = selectedLevel === 'all' || c.requirementLevel === selectedLevel;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        c.id.toLowerCase().includes(q) || 
        c.title.toLowerCase().includes(q) || 
        c.statement.toLowerCase().includes(q) ||
        (c.detailedNotes && c.detailedNotes.some(n => n.toLowerCase().includes(q))) ||
        c.crossWalk.nist.toLowerCase().includes(q) || 
        (c.crossWalk.cjis && c.crossWalk.cjis.toLowerCase().includes(q)) || 
        c.crossWalk.statutory.toLowerCase().includes(q);

      return matchesPillar && matchesLevel && matchesSearch;
    });
  }, [selectedPillar, selectedLevel, searchQuery]);

  // Self-Assessment Score Calculation
  const keyAuditControls = useMemo(() => {
    return [
      { id: 'AC-01', label: 'AC-01: Mandatory CAD/RMS Incident Justification Required' },
      { id: 'AC-03', label: 'AC-03: Mandatory Multi-Factor Authentication (MFA) Enabled' },
      { id: 'DG-01', label: 'DG-01: 30-Day Default Auto-Purge Cap for Passive Scans' },
      { id: 'DG-03', label: 'DG-03: Real-Time NCIC Hotlist Sync & Visual Confirmation Required' },
      { id: 'NA-01', label: 'NA-01: Non-Transitive Mutual Aid Sharing Agreements Only' },
      { id: 'NA-02', label: 'NA-02: 100% Municipal Data Ownership & Vendor AI Training Ban' },
      { id: 'AU-01', label: 'AU-01: Write-Once/Read-Many (WORM) Immutable Query Logging' },
      { id: 'AU-02', label: 'AU-02: Automated Anomaly Alerts for Off-Shift / Broad Sweeps' },
      { id: 'PT-01', label: 'PT-01: Public Open Metrics Dashboard for Hits, Scans & Queries' },
      { id: 'PS-01', label: 'PS-01: AASHTO MASH-16 Breakaway Poles in Clear Zones (or Co-Location)' },
      { id: 'LE-01', label: 'LE-01: DPPA DMV Lookup Gate (Blocked for Passive Bulk Scans)' },
      { id: 'PR-01', label: 'PR-01: Open Records Exemption for Bulk Scans + Officer Pseudonymization' }
    ];
  }, []);

  const totalAuditCount = keyAuditControls.length;
  const currentCheckedCount = Object.values(checkedControls).filter(Boolean).length;
  const compliancePercentage = Math.round((currentCheckedCount / totalAuditCount) * 100);

  const getComplianceGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'Tier 1: Sovereign & Fully Certified', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
    if (pct >= 70) return { grade: 'Tier 2: Substantially Aligned (Gaps Identified)', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
    return { grade: 'Tier 3: Critical Governance & Safety Non-Compliance', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
  };

  const handleToggleAudit = (id: string) => {
    setCheckedControls(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(ALPR_CSF_FRAMEWORK.markdownExport);
    setIsCopiedMarkdown(true);
    setTimeout(() => setIsCopiedMarkdown(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([ALPR_CSF_FRAMEWORK.markdownExport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ALPR-CSF-Standard-v1.0.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyOrdinance = () => {
    const ordinanceText = `// MODEL MUNICIPAL ALPR REGULATION ORDINANCE (EXULTIA ALPR-CSF COMPLIANT)
SECTION 1. AUTOMATED LICENSE PLATE RECOGNITION SURVEILLANCE STANDARDS.
(a) Mandatory Incident Justification. No law enforcement officer or municipal employee shall execute a query or search of any automated license plate recognition (ALPR) database without first entering an active Computer Aided Dispatch (CAD) or Records Management System (RMS) incident number.
(b) Data Retention Cap. All passive license plate scan data and associated optical character recognition records shall be automatically hard-deleted after thirty (30) calendar days, unless explicitly designated as physical evidence in an active criminal prosecution.
(c) Mutual Aid & Non-Transitive Sharing. Any sharing of municipal ALPR telemetry with external law enforcement agencies requires a formal, publicly disclosed Memorandum of Understanding. Secondary or downstream sharing by recipient agencies is strictly prohibited.
(d) Roadside Crash & Clear-Zone Safety. All standalone ALPR poles located within the roadway clear zone shall comply with AASHTO Manual for Assessing Safety Hardware (MASH-16) breakaway requirements.
(e) Prohibition on Commercial Exploitation. All license plate telemetry remains 100% municipal property. Vendors are prohibited from pooling municipal records, training artificial intelligence foundation models, or monetizing scan data.`;
    
    navigator.clipboard.writeText(ordinanceText);
    setIsCopiedOrdinance(true);
    setTimeout(() => setIsCopiedOrdinance(false), 2500);
  };

  const handleCopySingleControl = (control: ControlSpecification) => {
    const text = `[${control.id}] ${control.title} (${control.requirementLevel})
${control.statement}
Cross-Walk: NIST ${control.crossWalk.nist} | CJIS ${control.crossWalk.cjis} | Statutory: ${control.crossWalk.statutory}`;
    navigator.clipboard.writeText(text);
    setCopiedControlId(control.id);
    setTimeout(() => setCopiedControlId(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', paddingBottom: '6rem' }}>
      
      {/* BREADCRUMB & TOP NAV */}
      <div style={{
        background: 'rgba(2, 6, 23, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94A3B8' }}>
            <Link href="/governance" style={{ color: '#60A5FA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={14} />
              <span>Governance Frameworks</span>
            </Link>
            <span>/</span>
            <span style={{ color: '#E2E8F0', fontWeight: 600 }}>ALPR-CSF Standard</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleCopyMarkdown}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: isCopiedMarkdown ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: isCopiedMarkdown ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isCopiedMarkdown ? '#34D399' : '#CBD5E1',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
              {isCopiedMarkdown ? <Check size={13} /> : <Copy size={13} />}
              <span>{isCopiedMarkdown ? 'Copied Full .md' : 'Copy Spec'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                border: 'none',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.35)'
              }}>
              <Download size={13} />
              <span>Download Standard (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* HEADER HERO */}
      <header style={{
        padding: '3.5rem 2rem 3rem 2rem',
        background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(59, 130, 246, 0.15), transparent 70%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60A5FA',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              border: '1px solid rgba(59, 130, 246, 0.4)'
            }}>
              FRAMEWORK CODE: ALPR-CSF
            </span>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34D399',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              VERSION 1.0.0 (EXPERIMENTAL)
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Applicable to: Flock Safety • Motorola / Vigilant • Rekor • Municipal DOT Sensor Networks
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: '1.2',
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            color: '#FFFFFF'
          }}>
            ALPR Security & Governance Control Framework (ALPR-CSF)
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#38BDF8',
            fontWeight: 600,
            lineHeight: '1.5',
            marginBottom: '1.25rem',
            maxWidth: '1000px'
          }}>
            Baseline Security, Physical Safety, and Data Governance Standard for Automated License Plate Recognition and Civic Surveillance Systems
          </p>

          <p style={{
            fontSize: '0.98rem',
            color: '#CBD5E1',
            lineHeight: '1.65',
            maxWidth: '1100px',
            marginBottom: '2rem'
          }}>
            {ALPR_CSF_FRAMEWORK.executiveSummary}
          </p>

          {/* AUDIENCE & QUICK LINKS */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px 20px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                Primary Target Stakeholders:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {ALPR_CSF_FRAMEWORK.targetAudience.slice(0, 4).map((aud, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', color: '#E2E8F0', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                    • {aud}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a 
                href="#compliance-assessment"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#34D399',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <CheckCircle2 size={13} />
                <span>Jump to Audit Checklist</span>
              </a>

              <a 
                href="#cross-walk-matrix"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#60A5FA',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Scale size={13} />
                <span>NIST / CJIS Matrix</span>
              </a>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN BODY WORKSPACE */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {/* SECTION 1: PILLARS SUMMARY TABS */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Framework Architecture
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                The 8 Control Pillars
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Filter by clicking any pillar below
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={() => setSelectedPillar('all')}
              style={{
                background: selectedPillar === 'all' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                border: selectedPillar === 'all' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedPillar === 'all' ? '#60A5FA' : '#FFFFFF' }}>
                  All 8 Pillars
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                  {ALPR_CONTROLS.length} Controls
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                View complete integrated baseline specification across all domains.
              </p>
            </button>

            {ALPR_PILLARS.map(p => {
              const isSelected = selectedPillar === p.code;
              return (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setSelectedPillar(p.code)}
                  style={{
                    background: isSelected ? p.accentBg : 'rgba(15, 23, 42, 0.6)',
                    border: isSelected ? `1px solid ${p.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: p.color,
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {p.code}
                      </span>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: isSelected ? p.color : '#FFFFFF' }}>
                        Pillar {p.number}: {p.shortName}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      {p.controlsCount} controls
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '6px', lineHeight: '1.4' }}>
                    {p.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE CONTROLS SPECIFICATION EXPLORER */}
        <section style={{ marginBottom: '4rem' }}>
          
          {/* FILTER & SEARCH CONTROLS TOOLBAR */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            
            {/* Search input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Search controls by keyword (e.g. MASH, purge, DPPA, WORM, solar, geofencing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(2, 6, 23, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '9px 12px 9px 36px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Requirement Level Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Filter Level:</span>
              {[
                { id: 'all', label: 'All Levels' },
                { id: 'MUST', label: 'MUST' },
                { id: 'MANDATORY', label: 'MANDATORY' },
                { id: 'PROHIBITED', label: 'PROHIBITED' },
                { id: 'REQUIRED', label: 'REQUIRED' },
                { id: 'COMPENSATING', label: 'COMPENSATING' }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: selectedLevel === lvl.id ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedLevel === lvl.id ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: selectedLevel === lvl.id ? '#60A5FA' : '#94A3B8'
                  }}>
                  {lvl.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Showing <strong style={{ color: '#E2E8F0' }}>{filteredControls.length}</strong> of {ALPR_CONTROLS.length} Controls
            </div>
          </div>

          {/* CONTROLS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredControls.length === 0 ? (
              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                color: '#94A3B8'
              }}>
                <Filter size={24} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>No matching controls found</div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Try clearing your search query or switching to &ldquo;All Pillars&rdquo;.</div>
              </div>
            ) : (
              filteredControls.map((ctrl) => {
                const pillar = ALPR_PILLARS.find(p => p.code === ctrl.pillarCode);
                const isExpanded = expandedControlId === ctrl.id;
                const isChecked = !!checkedControls[ctrl.id];

                return (
                  <div key={ctrl.id} style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: isExpanded ? `1px solid ${pillar?.color || '#3B82F6'}` : '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: isExpanded ? '0 10px 30px -10px rgba(0, 0, 0, 0.6)' : 'none'
                  }}>
                    
                    {/* Control Card Header */}
                    <div style={{
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                      flexWrap: 'wrap',
                      background: isExpanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                    }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            background: pillar?.color || '#3B82F6',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {ctrl.id}
                          </span>

                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: ctrl.requirementLevel === 'MUST' || ctrl.requirementLevel === 'MANDATORY'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : ctrl.requirementLevel === 'PROHIBITED'
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(16, 185, 129, 0.15)',
                            color: ctrl.requirementLevel === 'MUST' || ctrl.requirementLevel === 'MANDATORY'
                              ? '#60A5FA'
                              : ctrl.requirementLevel === 'PROHIBITED'
                                ? '#F87171'
                                : '#34D399',
                            border: ctrl.requirementLevel === 'MUST' || ctrl.requirementLevel === 'MANDATORY'
                              ? '1px solid rgba(59, 130, 246, 0.3)'
                              : ctrl.requirementLevel === 'PROHIBITED'
                                ? '1px solid rgba(239, 68, 68, 0.3)'
                                : '1px solid rgba(16, 185, 129, 0.3)'
                          }}>
                            {ctrl.requirementLevel}
                          </span>

                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            Pillar: <strong>{pillar?.shortName}</strong>
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                          {ctrl.title}
                        </h3>

                        <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.55', margin: 0 }}>
                          {ctrl.statement}
                        </p>

                      </div>

                      {/* Right Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleCopySingleControl(ctrl)}
                          title="Copy control text"
                          style={{
                            background: copiedControlId === ctrl.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: copiedControlId === ctrl.id ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: copiedControlId === ctrl.id ? '#34D399' : '#94A3B8',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                          {copiedControlId === ctrl.id ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedControlId === ctrl.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedControlId(isExpanded ? null : ctrl.id)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#E2E8F0',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                          <span>{isExpanded ? 'Collapse' : 'Details & Mappings'}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details Section */}
                    {isExpanded && (
                      <div style={{
                        padding: '16px 20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        background: 'rgba(2, 6, 23, 0.75)'
                      }}>
                        
                        {/* Sub-Clauses (e.g. for PR-01) */}
                        {ctrl.subClauses && ctrl.subClauses.length > 0 && (
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', marginBottom: '8px' }}>
                              Substantive Domains & Requirements:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {ctrl.subClauses.map((sub, sIdx) => (
                                <div key={sIdx} style={{
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '6px',
                                  padding: '8px 12px'
                                }}>
                                  <strong style={{ color: '#F1F5F9', fontSize: '0.82rem' }}>{sub.label}: </strong>
                                  <span style={{ color: '#CBD5E1', fontSize: '0.8rem', lineHeight: '1.45' }}>{sub.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Technical Implementation Guidance Notes */}
                        {ctrl.detailedNotes && ctrl.detailedNotes.length > 0 && (
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                              Technical Engineering & Deployment Guidance:
                            </div>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                              {ctrl.detailedNotes.map((note, nIdx) => (
                                <li key={nIdx} style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '4px' }}>
                                  {note}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Cross-Walk Badges */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '10px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                          paddingTop: '12px'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            NIST SP 800-53: <strong style={{ color: '#FFFFFF' }}>{ctrl.crossWalk.nist}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            FBI CJIS v5.9: <strong style={{ color: '#FFFFFF' }}>{ctrl.crossWalk.cjis}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            ISO/IEC 27001: <strong style={{ color: '#FFFFFF' }}>{ctrl.crossWalk.iso}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            Statutory Ref: <strong style={{ color: '#38BDF8' }}>{ctrl.crossWalk.statutory}</strong>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* SECTION 3: INDUSTRY FRAMEWORK CROSS-WALK MATRIX */}
        <section id="cross-walk-matrix" style={{ marginBottom: '4.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Standard Harmonization
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              Industry Framework Cross-Walk Matrix
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>
              Direct technical and statutory mapping of ALPR-CSF controls to NIST SP 800-53 Rev. 5, ISO/IEC 27001:2022, FBI CJIS v5.9, AASHTO MASH-16, and state statutes.
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            overflowX: 'auto',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(2, 6, 23, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <th style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 700 }}>Control ID & Name</th>
                  <th style={{ padding: '12px 16px', color: '#60A5FA', fontWeight: 700 }}>NIST SP 800-53 Rev. 5</th>
                  <th style={{ padding: '12px 16px', color: '#A78BFA', fontWeight: 700 }}>ISO/IEC 27001:2022</th>
                  <th style={{ padding: '12px 16px', color: '#34D399', fontWeight: 700 }}>FBI CJIS v5.9 Area</th>
                  <th style={{ padding: '12px 16px', color: '#FBBF24', fontWeight: 700 }}>Statutory / Reference Standard</th>
                </tr>
              </thead>
              <tbody>
                {ALPR_CROSSWALK_MATRIX.map((cw, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                  }}>
                    <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                      <span style={{ color: '#38BDF8', fontWeight: 800, marginRight: '6px' }}>{cw.controlId}</span>
                      <span>({cw.controlName})</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#CBD5E1' }}>{cw.nist}</td>
                    <td style={{ padding: '12px 16px', color: '#CBD5E1' }}>{cw.iso}</td>
                    <td style={{ padding: '12px 16px', color: '#CBD5E1' }}>{cw.cjis}</td>
                    <td style={{ padding: '12px 16px', color: '#F1F5F9', fontWeight: 500 }}>{cw.statutory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE COMPLIANCE SELF-ASSESSMENT CALCULATOR */}
        <section id="compliance-assessment" style={{ marginBottom: '4.5rem' }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 28, 0.98) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '2rem 2.5rem',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 25px rgba(16, 185, 129, 0.15)'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                  <BarChart3 size={15} />
                  <span>Municipal Audit Readiness Tool</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  ALPR-CSF Compliance Self-Assessment
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '4px', maxWidth: '700px' }}>
                  Check off the baseline controls currently enforced in your municipal deployment to generate an instant governance rating and gap breakdown.
                </p>
              </div>

              {/* Compliance Meter Badge */}
              <div style={{
                background: getComplianceGrade(compliancePercentage).bg,
                border: `1px solid ${getComplianceGrade(compliancePercentage).color}`,
                borderRadius: '12px',
                padding: '12px 20px',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#CBD5E1', textTransform: 'uppercase', fontWeight: 700 }}>
                  Compliance Score
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: getComplianceGrade(compliancePercentage).color, lineHeight: '1.1' }}>
                  {compliancePercentage}%
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                  {getComplianceGrade(compliancePercentage).grade}
                </div>
              </div>
            </div>

            {/* Checklist Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '10px',
              marginBottom: '2rem'
            }}>
              {keyAuditControls.map((item) => {
                const isChecked = !!checkedControls[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleAudit(item.id)}
                    style={{
                      background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isChecked ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '5px',
                      background: isChecked ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                      border: isChecked ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#022C22',
                      flexShrink: 0
                    }}>
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>

                    <span style={{ fontSize: '0.84rem', color: isChecked ? '#F1F5F9' : '#94A3B8', fontWeight: isChecked ? 600 : 400 }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action summary */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1rem',
              fontSize: '0.8rem',
              color: '#94A3B8'
            }}>
              <div>
                <strong>{currentCheckedCount}</strong> of <strong>{totalAuditCount}</strong> core baseline controls verified.
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const allTrue: Record<string, boolean> = {};
                    keyAuditControls.forEach(c => { allTrue[c.id] = true; });
                    setCheckedControls(allTrue);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#60A5FA',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    textDecoration: 'underline'
                  }}>
                  Check All (Target Benchmark)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setCheckedControls({})}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    textDecoration: 'underline'
                  }}>
                  Reset Checklist
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: IMPLEMENTATION & PHASED ROLLOUT */}
        <section style={{ marginBottom: '4.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Operational Playbook
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              Implementation & Phased Rollout (90-Day Roadmap)
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>
              Step-by-step transition roadmap for municipal agencies adopting ALPR-CSF.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {ALPR_ROLLOUT_PHASES.map((phase) => (
              <div key={phase.phase} style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      background: 'rgba(59, 130, 246, 0.25)',
                      border: '1px solid #3B82F6',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      Phase {phase.phase}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>
                      {phase.timeframe}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    {phase.title}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: '1.5', marginBottom: '14px' }}>
                    {phase.summary}
                  </p>

                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Key Deliverables:
                  </div>
                  <ul style={{ paddingLeft: '16px', margin: '0 0 14px 0', fontSize: '0.78rem', color: '#CBD5E1', lineHeight: '1.45' }}>
                    {phase.targetMilestones.map((m, mIdx) => (
                      <li key={mIdx} style={{ marginBottom: '4px' }}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '10px',
                  fontSize: '0.72rem',
                  color: '#64748B'
                }}>
                  Lead: {phase.responsibleStakeholders.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: MODEL CITY ORDINANCE TEMPLATE */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            background: 'rgba(2, 6, 23, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Model Legislation
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0 0' }}>
                  Model Municipal ALPR Surveillance Ordinance Clause
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCopyOrdinance}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isCopiedOrdinance ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  border: isCopiedOrdinance ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isCopiedOrdinance ? '#34D399' : '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                {isCopiedOrdinance ? <Check size={13} /> : <Copy size={13} />}
                <span>{isCopiedOrdinance ? 'Copied Legislative Text' : 'Copy Ordinance Language'}</span>
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1rem' }}>
              Ready for adoption by City Councils, Town Boards, or County Commissions seeking to codify ALPR-CSF controls into binding municipal code.
            </p>

            <pre style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '0.78rem',
              color: '#CBD5E1',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              margin: 0,
              fontFamily: 'monospace'
            }}>
{`// MODEL MUNICIPAL ALPR REGULATION ORDINANCE (EXULTIA ALPR-CSF COMPLIANT)
SECTION 1. AUTOMATED LICENSE PLATE RECOGNITION SURVEILLANCE STANDARDS.
(a) Mandatory Incident Justification. No law enforcement officer or municipal employee shall execute a query of any ALPR database without first entering an active CAD or RMS incident number.
(b) Data Retention Cap. All passive license plate scan data shall automatically hard-delete after thirty (30) calendar days, unless tagged as evidence in an active criminal investigation.
(c) Mutual Aid & Non-Transitive Sharing. Any sharing with external agencies requires an opt-in MOU; downstream re-sharing is strictly prohibited.
(d) Roadside Crash Safety. All standalone ALPR poles located in the roadway clear zone shall comply with AASHTO MASH-16 breakaway requirements.
(e) Prohibition on Commercial Exploitation. Telemetry remains 100% municipal property; vendor pooling or AI foundation model training across civic data is strictly banned.`}
            </pre>
          </div>
        </section>

      </main>

    </div>
  );
}
