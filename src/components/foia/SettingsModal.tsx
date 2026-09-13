"use client";

import React, { useState } from 'react';
import { X, User, Key, Save, Download, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { RequesterProfile, FilingCase } from '@/types/foia';
import { saveStoredProfile, saveStoredApiKey, saveStoredCases, getStoredCases } from '@/lib/foia/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: RequesterProfile;
  setProfile: (p: RequesterProfile) => void;
  apiKey: string;
  setApiKey: (k: string) => void;
  onCasesUpdated: (cases: FilingCase[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
  apiKey,
  setApiKey,
  onCasesUpdated
}) => {
  const [localProfile, setLocalProfile] = useState<RequesterProfile>({ ...profile });
  const [localKey, setLocalKey] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredProfile(localProfile);
    setProfile(localProfile);
    saveStoredApiKey(localKey);
    setApiKey(localKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleExportData = () => {
    const cases = getStoredCases();
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: localProfile,
      cases
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexpublica-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cases && Array.isArray(parsed.cases)) {
          saveStoredCases(parsed.cases);
          onCasesUpdated(parsed.cases);
        }
        if (parsed.profile) {
          saveStoredProfile(parsed.profile);
          setProfile(parsed.profile);
          setLocalProfile(parsed.profile);
        }
        alert(`Successfully imported ${parsed.cases?.length || 0} cases!`);
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-glass)',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}>
              <User size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Settings & Requester Profile</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Configure legal letterhead details and optional AI generative keys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Requester Contact Information */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-primary)' }}>
            Official Requester Letterhead
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Full Name / Representative *
              </label>
              <input
                type="text"
                className="input-field"
                value={localProfile.fullName}
                onChange={e => setLocalProfile({ ...localProfile, fullName: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Organization / Newsroom / Affiliation
              </label>
              <input
                type="text"
                className="input-field"
                value={localProfile.organization || ''}
                onChange={e => setLocalProfile({ ...localProfile, organization: e.target.value })}
                placeholder="The Daily Herald / Public Integrity Org"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Email Address (For Inbound Records) *
              </label>
              <input
                type="email"
                className="input-field"
                value={localProfile.email}
                onChange={e => setLocalProfile({ ...localProfile, email: e.target.value })}
                placeholder="jane.doe@organization.org"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                className="input-field"
                value={localProfile.phone}
                onChange={e => setLocalProfile({ ...localProfile, phone: e.target.value })}
                placeholder="(555) 234-5678"
              />
            </div>
          </div>

          <div style={{ marginTop: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Mailing Address Line 1 *
            </label>
            <input
              type="text"
              className="input-field"
              value={localProfile.addressLine1}
              onChange={e => setLocalProfile({ ...localProfile, addressLine1: e.target.value })}
              placeholder="100 Pennsylvania Ave NW"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                City
              </label>
              <input
                type="text"
                className="input-field"
                value={localProfile.city}
                onChange={e => setLocalProfile({ ...localProfile, city: e.target.value })}
                placeholder="Washington"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                State
              </label>
              <input
                type="text"
                className="input-field"
                value={localProfile.state}
                onChange={e => setLocalProfile({ ...localProfile, state: e.target.value })}
                placeholder="DC"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                ZIP Code
              </label>
              <input
                type="text"
                className="input-field"
                value={localProfile.zipCode}
                onChange={e => setLocalProfile({ ...localProfile, zipCode: e.target.value })}
                placeholder="20004"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Statutory Defaults */}
        <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '18px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-cyan)' }}>
            Fee & Requester Category Defaults
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Default Requester Classification
              </label>
              <select
                className="input-field"
                value={localProfile.defaultFeeCategory}
                onChange={e => setLocalProfile({ ...localProfile, defaultFeeCategory: e.target.value as any })}
              >
                <option value="news_media">Representative of News Media (Waiver Favored)</option>
                <option value="educational_scientific">Educational or Scientific Institution</option>
                <option value="non_commercial_public_interest">Non-Commercial / Public Interest Group</option>
                <option value="individual">Individual Citizen / Requester</option>
                <option value="commercial">Commercial Requester</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Pre-authorized Fee Cap ($ USD)
              </label>
              <input
                type="number"
                className="input-field"
                value={localProfile.defaultFeeLimit}
                onChange={e => setLocalProfile({ ...localProfile, defaultFeeLimit: Number(e.target.value) })}
                min={0}
                max={1000}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Live AI API Key */}
        <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={16} /> Optional Google Gemini API Key
            </h3>
            <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
              Zero-Config Fallback Active
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            LexPublica functions 100% deterministically offline. Providing a Gemini API key unlocks advanced contextual legal reasoning, automated agency disambiguation, and AI denial letter analysis.
          </p>
          <input
            type="password"
            className="input-field"
            value={localKey}
            onChange={e => setLocalKey(e.target.value)}
            placeholder="AIzaSy..."
          />
        </div>

        {/* Section 4: Data Management */}
        <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '18px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px' }}>
            Data Backup & Migration
          </h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportData}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              <Download size={14} /> Export Cases JSON
            </button>
            <label className="btn btn-secondary btn-sm" style={{ gap: '6px', cursor: 'pointer' }}>
              <Upload size={14} /> Import Cases JSON
              <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '16px'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            style={{ minWidth: '130px' }}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={16} /> Saved!
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
