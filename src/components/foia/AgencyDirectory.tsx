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
  ShieldCheck
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

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
        </div>
      </div>

      {/* Agency Grid */}
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
    </div>
  );
};
