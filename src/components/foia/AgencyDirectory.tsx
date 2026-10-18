"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  LayoutGrid,
  List
} from 'lucide-react';
import { AGENCIES_DATABASE, searchAgencies } from '@/lib/foia/agencies';
import { JURISDICTIONS_LIST, getStatuteForJurisdiction } from '@/lib/foia/statutes';
import { AgencyContact } from '@/types/foia';

interface AgencyDirectoryProps {
  onSelectAgencyForFiling: (agency: AgencyContact) => void;
}

export const AgencyDirectory: React.FC<AgencyDirectoryProps> = ({ onSelectAgencyForFiling }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredAgencies = AGENCIES_DATABASE.filter(agency => {
    if (jurisdictionFilter !== 'all' && agency.jurisdictionId !== jurisdictionFilter) return false;
    if (categoryFilter !== 'all' && agency.departmentCategory !== categoryFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      agency.name.toLowerCase().includes(q) ||
      (agency.acronym && agency.acronym.toLowerCase().includes(q)) ||
      agency.foiaEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <span className="badge badge-blue" style={{ marginBottom: '10px' }}>
          <Building2 size={12} /> Verified Agency Directory
        </span>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Public Records Officers & Agency Directory
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Browse verified Custodians of Records, official FOIA email endpoints, online submission portals, and statutory response deadlines across Federal, State, and Municipal governments.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            placeholder="Search agencies by name, acronym, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="input-field"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.8rem' }}
            value={jurisdictionFilter}
            onChange={e => setJurisdictionFilter(e.target.value)}
          >
            <option value="all">All Jurisdictions</option>
            {JURISDICTIONS_LIST.map(j => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>

          <select
            className="input-field"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.8rem' }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="law_enforcement">Law Enforcement & Police</option>
            <option value="environmental">Environmental & Safety</option>
            <option value="regulatory">Regulatory & Financial</option>
            <option value="executive">Executive & Mayoral</option>
            <option value="transportation">Transportation & Aviation</option>
            <option value="health_human_services">Health & Human Services</option>
          </select>

          {/* Card / Table Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '3px', border: '1px solid var(--border-glass)' }}>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: viewMode === 'cards' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                border: viewMode === 'cards' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                color: viewMode === 'cards' ? '#67E8F9' : 'var(--text-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <LayoutGrid size={14} /> Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: viewMode === 'table' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                border: viewMode === 'table' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                color: viewMode === 'table' ? '#67E8F9' : 'var(--text-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <List size={14} /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Directory Content (Cards or Table) */}
      {viewMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
          {filteredAgencies.map(agency => {
            const statute = getStatuteForJurisdiction(agency.jurisdictionId);

            return (
              <div
                key={agency.id}
                className="glass-panel glass-panel-interactive"
                style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-blue">
                        {agency.jurisdictionType.toUpperCase()}
                      </span>
                      {agency.verified && (
                        <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                          <CheckCircle2 size={10} /> Verified Endpoint
                        </span>
                      )}
                    </div>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                      <Clock size={10} /> {statute.responseDays} {statute.dayType} days
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
                    {agency.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {agency.custodianTitle}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} color="var(--accent-primary)" />
                      <a href={`mailto:${agency.foiaEmail}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                        {agency.foiaEmail}
                      </a>
                    </div>

                    {agency.portalUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ExternalLink size={14} color="var(--accent-cyan)" />
                        <a href={agency.portalUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                          {agency.portalType || 'Online Portal'}
                        </a>
                      </div>
                    )}

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {agency.physicalAddress}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Statute: <strong>{statute.shortCode}</strong>
                  </span>
                  <button
                    onClick={() => onSelectAgencyForFiling(agency)}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    Create Request <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255, 255, 255, 0.03)' }}>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600 }}>Agency & Custodian</th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600 }}>Jurisdiction</th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600 }}>FOIA Contact</th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600 }}>Response Timeline</th>
                <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgencies.map((agency, idx) => {
                const statute = getStatuteForJurisdiction(agency.jurisdictionId);
                return (
                  <tr 
                    key={agency.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-glass)', 
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                    }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>
                        {agency.name} {agency.acronym ? `(${agency.acronym})` : ''}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {agency.custodianTitle}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                          {agency.jurisdictionType.toUpperCase()}
                        </span>
                        {agency.verified && (
                          <span className="badge badge-green" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                            <CheckCircle2 size={9} /> Verified
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {agency.jurisdictionId}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <a href={`mailto:${agency.foiaEmail}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <Mail size={12} /> {agency.foiaEmail}
                        </a>
                        {agency.portalUrl && (
                          <a href={agency.portalUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <ExternalLink size={11} /> {agency.portalType || 'Online Portal'}
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#C084FC', fontWeight: 600, fontSize: '0.8rem' }}>
                        <Clock size={12} /> {statute.responseDays} {statute.dayType} days
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Statute: {statute.shortCode}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectAgencyForFiling(agency)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '6px', whiteSpace: 'nowrap' }}
                      >
                        Create Request <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
