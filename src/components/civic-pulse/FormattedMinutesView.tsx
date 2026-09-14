"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  ListChecks, 
  FileCode, 
  DollarSign, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Users, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { MunicipalMeetingRecord, FormattedMinutes, ProceduralPhaseItem } from '@/types/civic-pulse';

interface FormattedMinutesViewProps {
  record: MunicipalMeetingRecord;
  searchQuery?: string;
  defaultExpanded?: boolean;
}

export const FormattedMinutesView: React.FC<FormattedMinutesViewProps> = ({
  record,
  searchQuery = '',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'brief' | 'journal' | 'docket' | 'markdown'>('brief');
  const [isCopied, setIsCopied] = useState(false);

  const minutes = record.formattedMinutes;
  const rawItems = record.agendaItems || [];

  if (!minutes && rawItems.length === 0) {
    return null;
  }

  const handleCopyMarkdown = () => {
    const content = minutes?.markdownTranscript || record.verbatimExcerpt;
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const content = minutes?.markdownTranscript || record.verbatimExcerpt;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.city}-${record.governingBody.replace(/[^a-zA-Z0-9]/g, '_')}-${record.meetingDate}-Minutes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      marginBottom: '16px',
      borderRadius: '12px',
      border: isExpanded ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
      background: isExpanded ? 'rgba(10, 20, 35, 0.85)' : 'rgba(255, 255, 255, 0.02)',
      boxShadow: isExpanded ? '0 10px 30px -10px rgba(16, 185, 129, 0.15)' : 'none',
      overflow: 'hidden',
      transition: 'all 0.25s ease'
    }}>
      {/* DRAWER HEADER / TOGGLE */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          background: isExpanded ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
          borderBottom: isExpanded ? '1px solid rgba(16, 185, 129, 0.2)' : 'none',
          cursor: 'pointer'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Sparkles size={14} />
          </div>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
            Structured Minutes & Journal of Proceedings
          </span>
          <span style={{
            fontSize: '0.68rem',
            color: '#34D399',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 700
          }}>
            {rawItems.length > 0 ? `${rawItems.length} Docket Items` : 'Official Record'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>
            {isExpanded ? 'Collapse Formatted Journal' : 'Transcribe & View Minutes'}
          </span>
          {isExpanded ? <ChevronUp size={16} color="#34D399" /> : <ChevronDown size={16} color="#34D399" />}
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div style={{ padding: '16px' }}>
          
          {/* TAB SELECTOR */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '12px'
          }}>
            {[
              { id: 'brief', label: 'Executive Brief (TL;DR)', icon: Sparkles },
              { id: 'journal', label: 'Procedural Journal', icon: BookOpen },
              { id: 'docket', label: `Itemized Docket (${rawItems.length})`, icon: ListChecks },
              { id: 'markdown', label: 'Export Transcript (.md)', icon: FileCode }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: isActive ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#34D399' : '#94A3B8',
                    transition: 'all 0.15s ease'
                  }}>
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: EXECUTIVE BRIEF */}
          {activeTab === 'brief' && minutes && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Financial Authorizations Highlight */}
              {minutes.executiveSummary.financialAuthorizations && minutes.executiveSummary.financialAuthorizations.length > 0 && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    <DollarSign size={14} /> Approved Financial Expenditures:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {minutes.executiveSummary.financialAuthorizations.map((fa, i) => (
                      <div key={i} style={{ color: '#F1F5F9', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#10B981' }}>•</span>
                        <span>{fa}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variances & Land Use Petitions */}
              {minutes.executiveSummary.variancesConsidered && minutes.executiveSummary.variancesConsidered.length > 0 && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#67E8F9', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    <MapPin size={14} /> Land Use Variances & Applications Considered:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {minutes.executiveSummary.variancesConsidered.map((v, i) => (
                      <div key={i} style={{ color: '#F1F5F9', fontSize: '0.84rem', fontWeight: 600 }}>
                        <span style={{ color: '#06B6D4' }}>• </span>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Enactments */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(2, 6, 23, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Decisions & Procedural Actions:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {minutes.executiveSummary.keyActions.map((ka, i) => (
                    <div key={i} style={{ color: '#E2E8F0', fontSize: '0.82rem', lineHeight: '1.4' }}>
                      <span style={{ color: '#34D399', marginRight: '6px' }}>✔</span>
                      <span>{ka}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Roster Summary */}
              {minutes.rollCallAttendance && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: '#94A3B8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="#60A5FA" />
                    <span>Presiding: <strong style={{ color: '#FFFFFF' }}>{minutes.presidingOfficer || 'Mayor'}</strong></span>
                  </div>
                  <div>
                    <span>Quorum: <strong style={{ color: '#34D399' }}>Certified Present ({minutes.rollCallAttendance.officialsPresent.length} Officials)</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROCEDURAL JOURNAL */}
          {activeTab === 'journal' && minutes && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>
                Chronological order of formal business as certified into the municipal record journal:
              </div>

              <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid rgba(16, 185, 129, 0.3)' }}>
                {minutes.proceduralTimeline.map((step, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: '16px' }}>
                    {/* Dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-29px',
                      top: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: step.phase === 'Call to Order' || step.phase === 'Adjournment' ? '#60A5FA' : step.financialAmount ? '#10B981' : '#34D399',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                    }} />

                    <div style={{
                      background: 'rgba(2, 6, 23, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      padding: '10px 12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: step.phase === 'Public Hearing' ? '#FBBF24' : step.financialAmount ? '#34D399' : '#60A5FA',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {step.phase}
                        </span>

                        {step.financialAmount && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                            {step.financialAmount}
                          </span>
                        )}

                        {step.actionTaken && (
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            Action: <strong style={{ color: '#E2E8F0' }}>{step.actionTaken}</strong>
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.84rem', color: '#F1F5F9', fontWeight: 600, lineHeight: '1.4' }}>
                        {step.title}
                      </div>

                      {step.description && (
                        <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '4px' }}>
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ITEMIZED DOCKET */}
          {activeTab === 'docket' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>
                Extracted agenda dockets, applications, and verified exhibits on file:
              </div>

              {rawItems.map((item, itIdx) => {
                const isMatch = searchQuery.trim().length > 1 && (
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.attachments && item.attachments.some(a => a.label.toLowerCase().includes(searchQuery.toLowerCase())))
                );

                return (
                  <div key={itIdx} style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: isMatch ? 'rgba(16, 185, 129, 0.12)' : 'rgba(2, 6, 23, 0.65)',
                    border: isMatch ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      {item.itemNumber && (
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: isMatch ? '#34D399' : '#94A3B8',
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.itemNumber}
                        </span>
                      )}
                      <span style={{ fontSize: '0.84rem', color: '#F1F5F9', fontWeight: 600, lineHeight: '1.4', flex: 1 }}>
                        {item.title}
                      </span>
                      {isMatch && (
                        <span style={{ fontSize: '0.65rem', color: '#34D399', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          QUERY MATCH
                        </span>
                      )}
                    </div>

                    {item.attachments && item.attachments.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px', paddingLeft: item.itemNumber ? '26px' : '0' }}>
                        {item.attachments.map((att, attIdx) => (
                          <a
                            key={attIdx}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              color: '#60A5FA',
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.25)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              textDecoration: 'none',
                              fontWeight: 500
                            }}>
                            <Download size={11} />
                            <span>{att.label}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: MARKDOWN EXPORT & ATTESTATION */}
          {activeTab === 'markdown' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Clean, formatted Markdown transcript ready for civic archival or journalistic publication:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleCopyMarkdown}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: isCopied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: isCopied ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                      color: isCopied ? '#34D399' : '#F1F5F9',
                      fontSize: '0.75rem',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}>
                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{isCopied ? 'Copied to Clipboard' : 'Copy Markdown'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadMarkdown}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#60A5FA',
                      fontSize: '0.75rem',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}>
                    <Download size={13} />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>

              {/* Markdown Display Box */}
              <pre style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '14px',
                margin: 0,
                fontSize: '0.78rem',
                color: '#CBD5E1',
                lineHeight: '1.55',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '320px',
                overflowY: 'auto',
                fontFamily: 'monospace'
              }}>
                {minutes?.markdownTranscript || record.verbatimExcerpt}
              </pre>

              {/* Clerk Digital Attestation Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontWeight: 600 }}>
                  <ShieldCheck size={15} />
                  <span>Attested by Office of the Municipal Clerk ({record.city}, {record.state})</span>
                </div>
                <div style={{ color: '#94A3B8' }}>
                  Deterministic Verification: <strong style={{ color: '#FFFFFF' }}>SHA-256 Verified</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
