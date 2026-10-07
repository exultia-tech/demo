"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RequestWizard } from './RequestWizard';
import { CaseDashboard } from './CaseDashboard';
import { ResponseAnalyzer } from './ResponseAnalyzer';
import { AgencyDirectory } from './AgencyDirectory';
import { SettingsModal } from './SettingsModal';
import { 
  getStoredCases, 
  getStoredProfile, 
  getStoredApiKey, 
  saveStoredCases 
} from '@/lib/foia/storageService';
import { FilingCase, RequesterProfile, AgencyContact } from '@/types/foia';
import { 
  FileText, 
  Layers, 
  Scale, 
  Building2, 
  Sliders, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface FoiaWorkspaceProps {
  initialTab?: 'wizard' | 'cases' | 'analyzer' | 'directory';
}

export const FoiaWorkspace: React.FC<FoiaWorkspaceProps> = ({ initialTab = 'wizard' }) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'wizard' | 'cases' | 'analyzer' | 'directory'>(initialTab);
  const [cases, setCases] = useState<FilingCase[]>([]);
  const [profile, setProfile] = useState<RequesterProfile>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    defaultFeeCategory: 'non_commercial_public_interest',
    defaultFeeLimit: 50
  });
  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      if (tabParam === 'agencies' || tabParam === 'directory') {
        setActiveTab('directory');
      } else if (tabParam === 'analyzer' || tabParam === 'appeals') {
        setActiveTab('analyzer');
      } else if (tabParam === 'cases' || tabParam === 'dashboard') {
        setActiveTab('cases');
      } else if (tabParam === 'wizard') {
        setActiveTab('wizard');
      }
    }
  }, [searchParams]);

  // Load initial cases and profile in client-side effect
  useEffect(() => {
    setIsMounted(true);
    try {
      const loadedCases = getStoredCases();
      setCases(loadedCases);
      setProfile(getStoredProfile());
      setApiKey(getStoredApiKey());
    } catch {
      // safe fallback
    }
  }, []);

  const handleFilingLogged = (newCase: FilingCase) => {
    const updated = [newCase, ...cases.filter(c => c.id !== newCase.id)];
    setCases(updated);
    saveStoredCases(updated);
  };

  const handleSelectAgencyForFiling = (agency: AgencyContact) => {
    setActiveTab('wizard');
  };

  const activeCasesCount = cases.filter(c => c.status !== 'fulfilled' && c.status !== 'draft').length;

  return (
    <div style={{
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(10, 15, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.15)',
      overflow: 'hidden',
      marginBottom: '3.5rem'
    }}>
      {/* Sub-Header / Workspace Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.7)'
      }} className="no-print">
        {/* Brand/Product Identity Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.35)'
          }}>
            <Scale size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#F8FAFC' }}>
                Inquest <span style={{ color: '#06B6D4' }}>Workspace</span>
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>
                50-State Sunshine Engine
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Statutory Open Records, Custodian Directory & Appeals
            </div>
          </div>
        </div>

        {/* Workspace Mode Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 6, 23, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <button
            onClick={() => setActiveTab('wizard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'wizard' ? '#3B82F6' : 'transparent',
              color: activeTab === 'wizard' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={15} />
            <span>Request Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'cases' ? '#3B82F6' : 'transparent',
              color: activeTab === 'cases' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={15} />
            <span>Case Dashboard</span>
            {cases.length > 0 && (
              <span style={{
                background: activeTab === 'cases' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(59, 130, 246, 0.2)',
                color: activeTab === 'cases' ? '#FFFFFF' : '#60A5FA',
                padding: '1px 6px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>
                {cases.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'analyzer' ? '#3B82F6' : 'transparent',
              color: activeTab === 'analyzer' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Scale size={15} />
            <span>Response & Appeals</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'directory' ? '#3B82F6' : 'transparent',
              color: activeTab === 'directory' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={15} />
            <span>Agency Directory</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            href="/account/subscription?product=inquest"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              color: '#67E8F9',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Plans & Pricing →</span>
          </Link>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#E2E8F0',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sliders size={14} />
            <span>Filing Profile & Key</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <div style={{ padding: '24px 20px', minHeight: '680px' }}>
        {activeTab === 'wizard' && (
          <RequestWizard
            requesterProfile={profile}
            apiKey={apiKey}
            onFilingLogged={handleFilingLogged}
            onNavigateToCases={() => setActiveTab('cases')}
          />
        )}

        {activeTab === 'cases' && (
          <CaseDashboard
            cases={cases}
            onCasesUpdated={setCases}
            onNavigateToWizard={() => setActiveTab('wizard')}
            onNavigateToAnalyzerWithCase={(c) => {
              setActiveTab('analyzer');
            }}
          />
        )}

        {activeTab === 'analyzer' && (
          <ResponseAnalyzer apiKey={apiKey} />
        )}

        {activeTab === 'directory' && (
          <AgencyDirectory
            onSelectAgencyForFiling={handleSelectAgencyForFiling}
          />
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        setProfile={setProfile}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onCasesUpdated={setCases}
      />
    </div>
  );
};
