"use client";

import React from 'react';
import { 
  FileText, 
  FolderKanban, 
  ShieldAlert, 
  Building2, 
  Settings, 
  Sun, 
  Moon, 
  Sparkles,
  Scale
} from 'lucide-react';
import { FilingCase } from '@/types/foia';

interface NavbarProps {
  activeTab: 'wizard' | 'cases' | 'analyzer' | 'directory';
  setActiveTab: (tab: 'wizard' | 'cases' | 'analyzer' | 'directory') => void;
  cases: FilingCase[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  openSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cases,
  theme,
  toggleTheme,
  openSettings
}) => {
  const overdueCount = cases.filter(c => c.status === 'overdue').length;
  const activeCount = cases.filter(c => c.status === 'submitted' || c.status === 'in_review' || c.status === 'overdue').length;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '12px 24px'
    }} className="no-print">
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('wizard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <Scale size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: theme === 'dark' ? 'transparent' : 'inherit'
              }}>
                Inquest
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>
                <Sparkles size={10} /> FOIA Assistant
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Public Records & Compliance Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            onClick={() => setActiveTab('wizard')}
            className={`btn btn-sm ${activeTab === 'wizard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <FileText size={15} />
            New Request
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`btn btn-sm ${activeTab === 'cases' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', position: 'relative' }}
          >
            <FolderKanban size={15} />
            Cases & Timeline
            {activeCount > 0 && (
              <span style={{
                background: overdueCount > 0 ? 'var(--accent-rose)' : 'var(--accent-primary)',
                color: '#fff',
                fontSize: '0.65rem',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: '700'
              }}>
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            className={`btn btn-sm ${activeTab === 'analyzer' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <ShieldAlert size={15} />
            Denial & Appeal Rebuttal
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`btn btn-sm ${activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Building2 size={15} />
            Agency Directory
          </button>
        </div>

        {/* Right Tools: Theme & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            title="Toggle Light/Dark Theme"
            style={{ padding: '8px 10px' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={openSettings}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <Settings size={15} />
            Requester Profile & AI
          </button>
        </div>
      </div>
    </nav>
  );
};
