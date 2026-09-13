"use client";

import React, { useState } from 'react';
import { 
  FolderKanban, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Trash2, 
  Search, 
  Filter, 
  Scale, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { FilingCase, CaseStatus } from '@/types/foia';
import { getDaysRemaining } from '@/lib/foia/deadlineCalculator';
import { updateFilingCase, deleteFilingCase } from '@/lib/foia/storageService';
import { getStatuteForJurisdiction } from '@/lib/foia/statutes';
import { compileAdministrativeAppealLetter } from '@/lib/foia/templates';

interface CaseDashboardProps {
  cases: FilingCase[];
  onCasesUpdated: (cases: FilingCase[]) => void;
  onNavigateToWizard: () => void;
  onNavigateToAnalyzerWithCase?: (c: FilingCase) => void;
}

export const CaseDashboard: React.FC<CaseDashboardProps> = ({
  cases,
  onCasesUpdated,
  onNavigateToWizard,
  onNavigateToAnalyzerWithCase
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [selectedCaseForAppeal, setSelectedCaseForAppeal] = useState<FilingCase | null>(null);
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [generatedAppealText, setGeneratedAppealText] = useState('');

  // Metrics
  const totalCount = cases.length;
  const inFlightCount = cases.filter(c => c.status === 'submitted' || c.status === 'in_review').length;
  const overdueCount = cases.filter(c => c.status === 'overdue' || (c.status !== 'fulfilled' && getDaysRemaining(c.statutoryDeadline).isOverdue)).length;
  const fulfilledCount = cases.filter(c => c.status === 'fulfilled').length;

  const handleStatusChange = (caseItem: FilingCase, newStatus: CaseStatus) => {
    const updated: FilingCase = {
      ...caseItem,
      status: newStatus,
      historyLogs: [
        ...caseItem.historyLogs,
        {
          timestamp: new Date().toISOString(),
          action: `Status Updated to ${newStatus.toUpperCase()}`,
          details: `Manual status transition`
        }
      ]
    };
    updateFilingCase(updated);
    onCasesUpdated(cases.map(c => c.id === updated.id ? updated : c));
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to remove case ${id}?`)) {
      deleteFilingCase(id);
      onCasesUpdated(cases.filter(c => c.id !== id));
    }
  };

  const handleOpenAppealModal = (caseItem: FilingCase) => {
    const statute = getStatuteForJurisdiction(caseItem.params.jurisdictionId);
    const appealText = compileAdministrativeAppealLetter(
      {
        id: caseItem.id,
        params: caseItem.params,
        requesterInfo: caseItem.requesterInfo,
        statuteCitation: statute.citation,
        statuteName: statute.name,
        exemptionsCited: caseItem.denialExemptionsCited || ['Constructive Denial / Overdue Statutory Deadline']
      },
      statute
    );
    setSelectedCaseForAppeal(caseItem);
    setGeneratedAppealText(appealText);
    setAppealModalOpen(true);
  };

  const filteredCases = cases.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.params.agencyName.toLowerCase().includes(q) ||
      c.params.subjectMatter.toLowerCase().includes(q) ||
      c.params.statuteName.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)'
          }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Tracked Requests</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{inFlightCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>In-Flight / Under Review</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-rose)'
          }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: overdueCount > 0 ? 'var(--accent-rose)' : 'inherit' }}>
              {overdueCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overdue Statutory Deadlines</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-emerald)'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{fulfilledCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Responsive Records Delivered</div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
              placeholder="Search by tracking #, agency, subject..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              className="input-field"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.8rem' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses ({totalCount})</option>
              <option value="submitted">Submitted</option>
              <option value="in_review">In Review</option>
              <option value="overdue">Overdue Deadlines</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="appealed">Appealed</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        <button onClick={onNavigateToWizard} className="btn btn-primary btn-sm">
          <Plus size={16} /> File New Open Records Request
        </button>
      </div>

      {/* Case List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredCases.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FolderKanban size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px' }}>No requests matched your filter</h3>
            <p style={{ fontSize: '0.85rem' }}>Create a new request in the wizard or reset your filter criteria.</p>
          </div>
        ) : (
          filteredCases.map(caseItem => {
            const deadlineInfo = getDaysRemaining(caseItem.statutoryDeadline);
            const isOverdue = deadlineInfo.isOverdue && caseItem.status !== 'fulfilled';
            const isExpanded = expandedCaseId === caseItem.id;

            return (
              <div
                key={caseItem.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderLeft: isOverdue ? '4px solid var(--accent-rose)' : caseItem.status === 'fulfilled' ? '4px solid var(--accent-emerald)' : '4px solid var(--accent-primary)'
                }}
              >
                {/* Main Summary Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {caseItem.id}
                      </span>
                      <span className="badge badge-blue">
                        <Scale size={10} /> {caseItem.params.statuteName} ({caseItem.params.statuteCitation})
                      </span>
                      {isOverdue && (
                        <span className="badge badge-red animate-pulse-subtle">
                          <AlertTriangle size={10} /> {deadlineInfo.formatted}
                        </span>
                      )}
                      {!isOverdue && caseItem.status !== 'fulfilled' && (
                        <span className="badge badge-green">
                          <Clock size={10} /> {deadlineInfo.formatted}
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                      {caseItem.params.agencyName}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                      {caseItem.params.subjectMatter}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Submitted: <strong>{new Date(caseItem.createdAt).toLocaleDateString()}</strong></span>
                      <span>Statutory Deadline: <strong style={{ color: isOverdue ? 'var(--accent-rose)' : 'inherit' }}>{caseItem.statutoryDeadline}</strong></span>
                      <span>SHA-256 Digest: <code style={{ color: 'var(--accent-cyan)' }}>{caseItem.sha256Fingerprint.slice(0, 10)}...</code></span>
                    </div>
                  </div>

                  {/* Right Actions & Status Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div>
                      <select
                        className="input-field"
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '6px 10px',
                          background: 'var(--bg-secondary)',
                          borderColor: isOverdue ? 'var(--accent-rose)' : 'var(--border-color)'
                        }}
                        value={caseItem.status}
                        onChange={e => handleStatusChange(caseItem, e.target.value as CaseStatus)}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="in_review">In Review / Search</option>
                        <option value="fee_estimate_received">Fee Estimate Received</option>
                        <option value="fulfilled">Records Fulfilled</option>
                        <option value="overdue">Statutory Overdue</option>
                        <option value="denied">Denied</option>
                        <option value="appealed">Appealed</option>
                      </select>
                    </div>

                    {(isOverdue || caseItem.status === 'denied' || caseItem.status === 'overdue') && (
                      <button
                        onClick={() => handleOpenAppealModal(caseItem)}
                        className="btn btn-danger btn-sm"
                        style={{ fontWeight: 700 }}
                      >
                        <ShieldAlert size={14} /> 1-Click Appeal
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedCaseId(isExpanded ? null : caseItem.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 10px' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>

                    <button
                      onClick={() => handleDelete(caseItem.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px' }}
                      title="Delete case"
                    >
                      <Trash2 size={15} color="var(--accent-rose)" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {/* Left: Original Request Letter */}
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '6px' }}>
                          Original Formal Letter Filed:
                        </div>
                        <div className="legal-letter-view" style={{ maxHeight: '240px', overflowY: 'auto', fontSize: '0.75rem' }}>
                          {caseItem.generatedLetterText}
                        </div>
                      </div>

                      {/* Right: Notes & Activity Timeline */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                            Case Notes / Agency Communications:
                          </div>
                          <textarea
                            className="input-field"
                            style={{ fontSize: '0.8rem', height: '80px' }}
                            value={caseItem.notes}
                            onChange={e => {
                              const updated = { ...caseItem, notes: e.target.value };
                              updateFilingCase(updated);
                              onCasesUpdated(cases.map(c => c.id === updated.id ? updated : c));
                            }}
                            placeholder="Add notes from phone calls or email correspondences..."
                          />
                        </div>

                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Audit Timeline & Event Log:
                          </div>
                          <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-sm)', maxHeight: '110px', overflowY: 'auto', fontSize: '0.75rem' }}>
                            {caseItem.historyLogs.map((log, i) => (
                              <div key={i} style={{ marginBottom: '6px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</div>
                                <div style={{ color: 'var(--text-muted)' }}>{log.details} — <span style={{ fontSize: '0.7rem' }}>{new Date(log.timestamp).toLocaleString()}</span></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Appeal Generator Modal */}
      {appealModalOpen && selectedCaseForAppeal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} color="var(--accent-rose)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    Deterministic Administrative Appeal Generator
                  </h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Target: {selectedCaseForAppeal.params.agencyName} | Tracking ID: {selectedCaseForAppeal.id}
                </p>
              </div>
              <button onClick={() => setAppealModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
                &times;
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Legal Petition for Administrative Review & Production Order:
              </div>
              <textarea
                className="input-field"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.8rem',
                  height: '380px',
                  background: '#040711',
                  color: '#f8fafc'
                }}
                value={generatedAppealText}
                onChange={e => setGeneratedAppealText(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedAppealText);
                  alert('Appeal draft copied to clipboard!');
                }}
                className="btn btn-secondary"
              >
                Copy Appeal Text
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAppealModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedCaseForAppeal, 'appealed');
                    alert(`Administrative Appeal logged for ${selectedCaseForAppeal.id}!`);
                    setAppealModalOpen(false);
                  }}
                  className="btn btn-primary"
                >
                  Mark Case as Appealed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
