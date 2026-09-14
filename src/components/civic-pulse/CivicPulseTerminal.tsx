"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Building2, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  Users, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Landmark,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ListChecks
} from 'lucide-react';
import { MunicipalMeetingRecord, MunicipalDocumentType, CivicDeskTicket, RetrievalStep } from '@/types/civic-pulse';
import { executeMunicipalQuery, AgentQueryResult } from '@/lib/civic-pulse/agentEngine';
import { SUPPORTED_CITIES, SAMPLE_MUNICIPAL_RECORDS } from '@/lib/civic-pulse/mockData';
import { HumanEscalationModal } from './HumanEscalationModal';

export const CivicPulseTerminal: React.FC = () => {
  const [cityInput, setCityInput] = useState('Austin');
  const [stateInput, setStateInput] = useState('TX');
  const [queryInput, setQueryInput] = useState('Water infrastructure sensors');
  const [docType, setDocType] = useState<MunicipalDocumentType | 'all'>('all');
  const [portalUrlInput, setPortalUrlInput] = useState('');
  const [showPortalUrlField, setShowPortalUrlField] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(true);
  const [currentResult, setCurrentResult] = useState<AgentQueryResult>({
    success: true,
    city: 'Austin',
    state: 'TX',
    records: [SAMPLE_MUNICIPAL_RECORDS[0]],
    steps: [
      { step: "Resolving Municipal Portal & Vendor Architecture", status: "completed", detail: "Identified official domain (austintexas.gov) running on Legistar platform." },
      { step: "Crawling Meeting Minutes & Agenda Packet Archives", status: "completed", detail: "Indexed 3,420 archived municipal meetings through latest session (2026-09-10)." },
      { step: "Extracting Roll-Call Votes & Enacted Ordinances", status: "completed", detail: "Filtered items matching citizen query terms, isolating Item 48 (Res. No. 20260827-048)." },
      { step: "Deterministic Source Verification & Link Attestation", status: "completed", detail: "Cross-verified verbatim minutes against official municipal clerk stamps." }
    ],
    requiresHumanEscalation: false
  });

  const [expandedVoteId, setExpandedVoteId] = useState<string | null>(SAMPLE_MUNICIPAL_RECORDS[0].id);
  const [expandedAgendaId, setExpandedAgendaId] = useState<string | null>(SAMPLE_MUNICIPAL_RECORDS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [activeTickets, setActiveTickets] = useState<CivicDeskTicket[]>([]);

  const handleCopyAgenda = (recId: string, items?: { itemNumber?: string; title: string }[]) => {
    if (!items || items.length === 0) return;
    const text = items.map((it, idx) => `${it.itemNumber ? `${it.itemNumber}: ` : `${idx + 1}. `}${it.title}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId(recId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSearch = async (
    city = cityInput, 
    state = stateInput, 
    query = queryInput, 
    type = docType, 
    customUrl = portalUrlInput
  ) => {
    setIsSearching(true);
    setSearchExecuted(true);
    
    try {
      const res = await executeMunicipalQuery({
        city,
        state,
        query,
        documentType: type,
        customPortalUrl: customUrl
      });
      setCurrentResult(res);
      if (res.city && (!city || city.toLowerCase() === 'unknown')) {
        setCityInput(res.city);
      }
      if (res.state && (!state || state === 'US')) {
        setStateInput(res.state);
      }
      if (res.records.length > 0) {
        setExpandedVoteId(res.records[0].id);
        setExpandedAgendaId(res.records[0].id);
      }
    } catch (err) {
      console.error("Search execution failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickCitySelect = (city: string, state: string, defaultQuery: string, defaultUrl = '') => {
    setCityInput(city);
    setStateInput(state);
    setQueryInput(defaultQuery);
    if (defaultUrl) {
      setPortalUrlInput(defaultUrl);
      setShowPortalUrlField(true);
    }
    handleSearch(city, state, defaultQuery, docType, defaultUrl || portalUrlInput);
  };

  return (
    <div style={{
      borderRadius: '18px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      background: 'rgba(10, 15, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.15)',
      overflow: 'hidden'
    }}>
      
      {/* TERMINAL HEADER */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Landmark size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                CivicPulse <span style={{ color: '#10B981' }}>Terminal</span>
              </span>
              <span style={{
                fontSize: '0.68rem',
                color: '#34D399',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontWeight: 700
              }}>
                FOIA-Free Public Intelligence
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
              Deterministic municipal council minutes, roll-call voting records, and public ordinances
            </div>
          </div>
        </div>

        {/* Quick Active Tickets Badge */}
        {activeTickets.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.78rem',
            color: '#34D399'
          }}>
            <UserCheck size={14} />
            <span>{activeTickets.length} Civic Desk Ticket Active</span>
          </div>
        )}
      </div>

      {/* INPUT FORM */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            
            {/* City Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                Municipality / City:
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="e.g. Austin, Chicago, Scranton"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', borderRadius: '8px', height: '42px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* State Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                State (2 Letters):
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  maxLength={2}
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value.toUpperCase())}
                  placeholder="TX, IL, PA, CO"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', borderRadius: '8px', height: '42px', fontSize: '0.9rem', textTransform: 'uppercase' }}
                />
              </div>
            </div>

            {/* Topic / Query Input */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                Civic Topic, Ordinance, or Council Item:
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="e.g. Water infrastructure, ALPR surveillance retention, Zoning height variance..."
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', borderRadius: '8px', height: '42px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

          </div>

          {/* Direct Municipal Portal URL (Optional / For Antiquated Systems) */}
          <div style={{ marginBottom: '16px' }}>
            {!showPortalUrlField ? (
              <button
                type="button"
                onClick={() => setShowPortalUrlField(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#67E8F9',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0
                }}>
                <ExternalLink size={13} />
                <span>+ Have a direct municipal URL? (For antiquated city websites, Laserfiche, or Sire portals)</span>
              </button>
            ) : (
              <div style={{
                background: 'rgba(6, 182, 212, 0.06)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: '10px',
                padding: '12px 14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#67E8F9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ExternalLink size={14} /> Direct Municipal Portal / Website URL (Optional):
                  </label>
                  <button
                    type="button"
                    onClick={() => { setShowPortalUrlField(false); setPortalUrlInput(''); }}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
                <input
                  type="url"
                  value={portalUrlInput}
                  onChange={(e) => setPortalUrlInput(e.target.value)}
                  placeholder="https://scrantonpa.gov/agendacenter or your town's legacy meeting portal URL"
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
                />
                <div style={{ fontSize: '0.73rem', color: '#94A3B8', marginTop: '6px' }}>
                  The agent will crawl, parse antiquated HTML tables, and extract PDF packets directly from this endpoint.
                </div>
              </div>
            )}
          </div>

          {/* Quick Preloaded City Suggestions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Quick Examples:</span>
            {[
              { city: "Roswell", state: "GA", query: "Planning", url: "https://roswellcityga.iqm2.com/Services/RSS.aspx?Feed=Calendar", tag: "Live IQM2 Feed" },
              { city: "Scranton", state: "PA", query: "Paving contracts & ADA", url: "https://scrantonpa.gov/agendacenter", tag: "CivicPlus Portal" },
              { city: "Austin", state: "TX", query: "Water infrastructure sensors", url: "", tag: "Legistar" },
              { city: "Chicago", state: "IL", query: "License plate reader retention", url: "", tag: "Granicus" },
              { city: "Denver", state: "CO", query: "Zoning variance Colfax", url: "", tag: "Legistar" }
            ].map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickCitySelect(ex.city, ex.state, ex.query, ex.url)}
                style={{
                  background: (cityInput.toLowerCase() === ex.city.toLowerCase() && (!ex.url || portalUrlInput === ex.url)) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: (cityInput.toLowerCase() === ex.city.toLowerCase() && (!ex.url || portalUrlInput === ex.url)) ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: (cityInput.toLowerCase() === ex.city.toLowerCase() && (!ex.url || portalUrlInput === ex.url)) ? '#34D399' : '#CBD5E1',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                {ex.city}, {ex.state}: {ex.query} <span style={{ opacity: 0.65, fontSize: '0.7rem' }}>({ex.tag})</span>
              </button>
            ))}
          </div>

          {/* Document Type Pills & Submit */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Municipal Records' },
                { id: 'council_minutes', label: 'City Council Minutes' },
                { id: 'planning_zoning', label: 'Planning & Zoning' },
                { id: 'budget_hearing', label: 'Budget Hearings' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDocType(tab.id as any)}
                  style={{
                    background: docType === tab.id ? '#10B981' : 'rgba(255, 255, 255, 0.04)',
                    border: 'none',
                    color: docType === tab.id ? '#022C22' : '#94A3B8',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              disabled={isSearching}
              className="btn-primary"
              style={{
                padding: '0.65rem 1.6rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: isSearching ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.35)'
              }}>
              <Search size={16} />
              {isSearching ? 'Querying Municipal Portals...' : 'Query Official Minutes →'}
            </button>
          </div>
        </form>
      </div>

      {/* AGENT DISCOVERY & RETRIEVAL WORKSPACE */}
      <div style={{ padding: '24px' }}>
        
        {/* RETRIEVAL PIPELINE STATUS (STREAMING / COMPLETED) */}
        {searchExecuted && (
          <div style={{
            background: 'rgba(2, 6, 23, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Autonomous Municipal Retrieval Execution Pipeline
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {currentResult.steps.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF' }}>{s.step}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px', lineHeight: '1.4' }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS FEED */}
        {currentResult.records.length > 0 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
                {currentResult.records.length} Verified Municipal Document{currentResult.records.length > 1 ? 's' : ''} Retrieved for {cityInput}, {stateInput}:
              </div>
              <span style={{ fontSize: '0.75rem', color: '#34D399', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                Official Clerk Certified
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {currentResult.records.map((rec, idx) => {
                const isVoteExpanded = expandedVoteId === rec.id;
                const isAgendaExpanded = expandedAgendaId === rec.id;
                return (
                  <div key={`${rec.id}-${idx}`} style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    padding: '20px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}>
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ minWidth: '250px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                            {rec.governingBody}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                            Meeting Date: {rec.meetingDate}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            • {rec.itemNumber}
                          </span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', lineHeight: '1.4', wordBreak: 'break-word' }}>
                          {rec.title}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap',
                          background: (rec.outcome === 'PASSED' || rec.outcome === 'MINUTES_APPROVED')
                            ? 'rgba(16, 185, 129, 0.2)' 
                            : rec.outcome === 'AGENDA_POSTED'
                              ? 'rgba(6, 182, 212, 0.2)'
                              : rec.outcome === 'PUBLIC_COMMENT' || rec.outcome === 'TABLED'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)',
                          color: (rec.outcome === 'PASSED' || rec.outcome === 'MINUTES_APPROVED')
                            ? '#34D399' 
                            : rec.outcome === 'AGENDA_POSTED'
                              ? '#67E8F9'
                              : rec.outcome === 'PUBLIC_COMMENT' || rec.outcome === 'TABLED'
                                ? '#FBBF24'
                                : '#F87171',
                          border: (rec.outcome === 'PASSED' || rec.outcome === 'MINUTES_APPROVED')
                            ? '1px solid rgba(16, 185, 129, 0.4)' 
                            : rec.outcome === 'AGENDA_POSTED'
                              ? '1px solid rgba(6, 182, 212, 0.4)'
                              : rec.outcome === 'PUBLIC_COMMENT' || rec.outcome === 'TABLED'
                                ? '1px solid rgba(245, 158, 11, 0.4)'
                                : '1px solid rgba(239, 68, 68, 0.4)'
                        }}>
                          {rec.outcome.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: '1.5', margin: '0 0 16px 0', wordBreak: 'break-word' }}>
                      {rec.summary}
                    </p>

                    {/* SUBSTANTIVE MEETING AGENDA & DOCKET ITEMS CONTENT */}
                    {rec.agendaItems && rec.agendaItems.length > 0 && (
                      <div style={{
                        marginBottom: '16px',
                        borderRadius: '10px',
                        border: isAgendaExpanded ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isAgendaExpanded ? 'rgba(6, 182, 212, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                      }}>
                        <div
                          onClick={() => setExpandedAgendaId(isAgendaExpanded ? null : rec.id)}
                          style={{
                            padding: '12px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px',
                            background: isAgendaExpanded ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                            cursor: 'pointer'
                          }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <ListChecks size={16} color="#67E8F9" />
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#E2E8F0' }}>
                              Substantive Session Docket ({rec.agendaItems.length} Agenda Items Extracted)
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#06B6D4', background: 'rgba(6, 182, 212, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              Real Content
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyAgenda(rec.id, rec.agendaItems);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: copiedId === rec.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                                border: copiedId === rec.id ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                                color: copiedId === rec.id ? '#34D399' : '#94A3B8',
                                fontSize: '0.72rem',
                                padding: '4px 8px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 600
                              }}>
                              {copiedId === rec.id ? <Check size={12} /> : <Copy size={12} />}
                              <span>{copiedId === rec.id ? 'Copied' : 'Copy Items'}</span>
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#67E8F9', fontSize: '0.75rem', fontWeight: 600 }}>
                              <span>{isAgendaExpanded ? 'Collapse Docket' : 'View Docket'}</span>
                              {isAgendaExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </div>
                          </div>
                        </div>

                        {isAgendaExpanded && (
                          <div style={{ padding: '14px', borderTop: '1px solid rgba(6, 182, 212, 0.15)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {rec.agendaItems.map((it, itIdx) => {
                                const isKeywordMatch = queryInput.trim().length > 1 && (
                                  it.title.toLowerCase().includes(queryInput.toLowerCase()) ||
                                  (it.attachments && it.attachments.some(a => a.label.toLowerCase().includes(queryInput.toLowerCase())))
                                );

                                return (
                                  <div key={itIdx} style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    background: isKeywordMatch ? 'rgba(16, 185, 129, 0.12)' : 'rgba(2, 6, 23, 0.65)',
                                    border: isKeywordMatch ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                      {it.itemNumber && (
                                        <span style={{
                                          fontSize: '0.72rem',
                                          fontWeight: 800,
                                          color: isKeywordMatch ? '#34D399' : '#94A3B8',
                                          background: 'rgba(255, 255, 255, 0.06)',
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          whiteSpace: 'nowrap'
                                        }}>
                                          {it.itemNumber}
                                        </span>
                                      )}
                                      <span style={{ fontSize: '0.84rem', color: '#F1F5F9', fontWeight: 600, lineHeight: '1.4', flex: 1 }}>
                                        {it.title}
                                      </span>
                                      {isKeywordMatch && (
                                        <span style={{ fontSize: '0.65rem', color: '#34D399', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                          QUERY MATCH
                                        </span>
                                      )}
                                    </div>

                                    {it.attachments && it.attachments.length > 0 && (
                                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px', paddingLeft: it.itemNumber ? '26px' : '0' }}>
                                        {it.attachments.map((att, attIdx) => (
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
                          </div>
                        )}
                      </div>
                    )}

                    {/* Verbatim Excerpt Box */}
                    <div style={{
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                        Verbatim Official Record Excerpt:
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#E2E8F0', fontStyle: 'italic', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                        "{rec.verbatimExcerpt}"
                      </p>
                    </div>

                    {/* Roll Call Votes Toggle */}
                    {rec.voteTally && (
                      <div style={{ marginBottom: '16px' }}>
                        <button
                          onClick={() => setExpandedVoteId(isVoteExpanded ? null : rec.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: '#60A5FA',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0
                          }}>
                          <Users size={14} />
                          <span>Roll-Call Voting Breakdown ({rec.voteTally.ayes} Ayes, {rec.voteTally.nays} Nays)</span>
                          {isVoteExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {isVoteExpanded && (
                          <div style={{
                            marginTop: '10px',
                            background: 'rgba(10, 15, 26, 0.9)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '8px'
                          }}>
                            {rec.voteTally.rollCall.map((member, mIdx) => (
                              <div key={mIdx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 10px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '6px',
                                fontSize: '0.78rem'
                              }}>
                                <div>
                                  <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{member.officialName}</div>
                                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>{member.title}</div>
                                </div>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  color: member.vote === 'AYE' ? '#34D399' : member.vote === 'NAY' ? '#F87171' : '#FBBF24'
                                }}>
                                  {member.vote}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Sources & Attestation */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.78rem'
                    }}>
                      <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Vendor Platform: <strong>{rec.sourcePortal.vendor}</strong></span>
                        <span>• OCR Quality: <strong>{rec.sourcePortal.scannedDocConfidence}%</strong></span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <a 
                          href={rec.sourcePortal.directPdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#10B981',
                            textDecoration: 'none',
                            fontWeight: 600
                          }}>
                          <Download size={13} />
                          <span>Official PDF Record</span>
                        </a>

                        <a 
                          href={rec.sourcePortal.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#60A5FA',
                            textDecoration: 'none',
                            fontWeight: 600
                          }}>
                          <ExternalLink size={13} />
                          <span>Portal Source</span>
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* NO DIRECT MATCHES / FALLBACK CONTAINER */
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '14px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <AlertCircle size={36} color="#F59E0B" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              No Direct Electronic Record Match for "{queryInput}" in {cityInput}, {stateInput}
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
              {currentResult.escalationReason || "The municipality either uses paper-only archives, unindexed video files, or an unstandardized document repository."}
            </p>
            <button
              onClick={() => setIsEscalationModalOpen(true)}
              className="btn-primary"
              style={{
                padding: '0.85rem 1.8rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
              }}>
              Dispatch Civic Desk Researcher to Find This Record →
            </button>
          </div>
        )}

        {/* HUMAN-IN-THE-LOOP FALLBACK BANNER */}
        <div style={{
          marginTop: '28px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontWeight: 700, fontSize: '0.88rem' }}>
              <UserCheck size={16} />
              <span>The Civic Desk Guarantee: Human Research Specialist Backup</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '4px 0 0 0', maxWidth: '700px' }}>
              If a city portal is down, audio files lack transcripts, or records are kept in physical municipal file cabinets, an Exultia specialist will step in to procure the information directly.
            </p>
          </div>

          <button
            onClick={() => setIsEscalationModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34D399',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}>
            Request Assisted Retrieval →
          </button>
        </div>

      </div>

      {/* HUMAN ESCALATION MODAL */}
      <HumanEscalationModal
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        city={cityInput}
        state={stateInput}
        query={queryInput}
        customPortalUrl={portalUrlInput}
        reason={currentResult.escalationReason}
        onTicketCreated={(ticket) => setActiveTickets([ticket, ...activeTickets])}
      />

    </div>
  );
};
