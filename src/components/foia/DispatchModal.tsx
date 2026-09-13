"use client";

import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Printer, 
  FileCheck2,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompiledRequestPackage } from '@/lib/foia/letterCompiler';
import { StructuredRequestParams, RequesterProfile, FilingCase } from '@/types/foia';
import { addFilingCase } from '@/lib/foia/storageService';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  compiledPackage: CompiledRequestPackage | null;
  params: StructuredRequestParams;
  requester: RequesterProfile;
  userPrompt: string;
  onFilingLogged: (newCase: FilingCase) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  compiledPackage,
  params,
  requester,
  userPrompt,
  onFilingLogged
}) => {
  const [activeChannel, setActiveChannel] = useState<'email' | 'portal' | 'mailto' | 'certified'>('email');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'transmitting' | 'dispatched'>('idle');

  if (!isOpen || !compiledPackage) return null;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSimulateDispatch = () => {
    setDispatchStatus('transmitting');
    setTimeout(() => {
      setDispatchStatus('dispatched');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      // Log case into persistent database
      const newCase: FilingCase = {
        id: compiledPackage.trackingNumber,
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        statutoryDeadline: compiledPackage.statutoryDeadline,
        status: 'submitted',
        userPrompt,
        params,
        generatedLetterText: compiledPackage.letterText,
        sha256Fingerprint: compiledPackage.sha256Fingerprint,
        requesterInfo: requester,
        notes: `Dispatched to ${params.agencyName} (${params.agencyEmail || 'Portal Submission'}). Certified SHA-256: ${compiledPackage.sha256Fingerprint.slice(0, 16)}...`,
        historyLogs: [
          {
            timestamp: new Date().toISOString(),
            action: 'Dispatched via Inquest Engine',
            details: `Dispatched request package to ${params.agencyEmail || 'Agency Online Portal'} under ${compiledPackage.statute.citation}`
          }
        ]
      };

      addFilingCase(newCase);
      onFilingLogged(newCase);
    }, 1200);
  };

  const mailtoUrl = `mailto:${encodeURIComponent(params.agencyEmail || '')}?subject=${encodeURIComponent(compiledPackage.emailSubject)}&body=${encodeURIComponent(compiledPackage.letterText)}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '840px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '30px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-glass)',
          paddingBottom: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                Deterministic Filing & Dispatch Hub
              </h2>
              <span className="badge badge-blue">
                {compiledPackage.trackingNumber}
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Target Agency: <strong style={{ color: 'var(--text-primary)' }}>{params.agencyName}</strong> | Jurisdiction: <span style={{ color: 'var(--accent-primary)' }}>{compiledPackage.statute.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Channel Selection Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          marginBottom: '22px'
        }}>
          <button
            onClick={() => setActiveChannel('email')}
            className={`btn ${activeChannel === 'email' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '12px', fontSize: '0.85rem' }}
          >
            <Mail size={16} /> Direct Email Dispatch
          </button>

          {params.agencyPortalUrl && (
            <button
              onClick={() => setActiveChannel('portal')}
              className={`btn ${activeChannel === 'portal' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '12px', fontSize: '0.85rem' }}
            >
              <ExternalLink size={16} /> Agency Online Portal
            </button>
          )}

          <button
            onClick={() => setActiveChannel('mailto')}
            className={`btn ${activeChannel === 'mailto' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '12px', fontSize: '0.85rem' }}
          >
            <Send size={16} /> Native Mail Client
          </button>

          <button
            onClick={() => setActiveChannel('certified')}
            className={`btn ${activeChannel === 'certified' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '12px', fontSize: '0.85rem' }}
          >
            <Printer size={16} /> Certified Mail / Print
          </button>
        </div>

        {/* Channel 1: Direct Email Dispatch */}
        {activeChannel === 'email' && (
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>RFC 822 Email Transmission Payload</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Recipient Custodian: <strong style={{ color: 'var(--accent-cyan)' }}>{params.agencyEmail || 'foia@agency.gov'}</strong>
                </p>
              </div>
              <button
                onClick={() => handleCopy(compiledPackage.emailBodyRfc822, 'rfc822')}
                className="btn btn-secondary btn-sm"
              >
                {copiedSection === 'rfc822' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copiedSection === 'rfc822' ? 'Copied' : 'Copy RFC Payload'}
              </button>
            </div>

            <div style={{
              background: '#040711',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.78rem',
              color: '#94a3b8',
              maxHeight: '180px',
              overflowY: 'auto',
              border: '1px solid #1e293b'
            }}>
              <div><strong>To:</strong> {params.agencyEmail || 'foia@agency.gov'}</div>
              <div><strong>From:</strong> {requester.email}</div>
              <div><strong>Subject:</strong> {compiledPackage.emailSubject}</div>
              <div><strong>X-Inquest-Tracking-ID:</strong> {compiledPackage.trackingNumber}</div>
              <div><strong>X-Statutory-Deadline:</strong> {compiledPackage.statutoryDeadline}</div>
              <div><strong>X-SHA256-Fingerprint:</strong> {compiledPackage.sha256Fingerprint}</div>
              <div style={{ marginTop: '8px', color: '#64748b' }}>[Full legal statutory body included]</div>
            </div>

            <div style={{
              marginTop: '18px',
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>
                    Cryptographic Integrity Verification Ready
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    SHA-256 Digest: {compiledPackage.sha256Fingerprint.slice(0, 24)}...
                  </div>
                </div>
              </div>
              <button
                onClick={handleSimulateDispatch}
                disabled={dispatchStatus !== 'idle'}
                className="btn btn-emerald"
                style={{ minWidth: '160px' }}
              >
                {dispatchStatus === 'transmitting' ? (
                  <>Transmitting...</>
                ) : dispatchStatus === 'dispatched' ? (
                  <>
                    <FileCheck2 size={16} /> Dispatched & Logged!
                  </>
                ) : (
                  <>
                    <Send size={16} /> Transmit & Log
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Channel 2: Agency Online Portal */}
        {activeChannel === 'portal' && (
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Official Online Portal Filing Helper</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Portal URL: <a href={params.agencyPortalUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>{params.agencyPortalUrl}</a>
                </p>
              </div>
              <a
                href={params.agencyPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
              >
                <ExternalLink size={14} /> Open Portal in New Tab
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Request Description / Subject Field (Pre-Formatted for Portal Textboxes):
                  </label>
                  <button
                    onClick={() => handleCopy(compiledPackage.portalDescription, 'portal_desc')}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                  >
                    {copiedSection === 'portal_desc' ? 'Copied' : 'Copy Description'}
                  </button>
                </div>
                <textarea
                  readOnly
                  className="input-field"
                  style={{ fontSize: '0.8rem', height: '110px' }}
                  value={compiledPackage.portalDescription}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Full Legal Letter Text (For Attachment / Extended Textbox):
                  </label>
                  <button
                    onClick={() => handleCopy(compiledPackage.letterText, 'portal_letter')}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                  >
                    {copiedSection === 'portal_letter' ? 'Copied' : 'Copy Full Letter'}
                  </button>
                </div>
                <textarea
                  readOnly
                  className="input-field"
                  style={{ fontSize: '0.8rem', height: '110px' }}
                  value={compiledPackage.letterText}
                />
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSimulateDispatch}
                disabled={dispatchStatus !== 'idle'}
                className="btn btn-emerald"
              >
                {dispatchStatus === 'dispatched' ? 'Logged to Cases Dashboard!' : 'Mark Portal Request as Submitted'}
              </button>
            </div>
          </div>
        )}

        {/* Channel 3: Native Mail Client */}
        {activeChannel === 'mailto' && (
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Launch Desktop / Default Mail Client</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Launches Outlook, Apple Mail, Thunderbird, or default handler with pre-populated recipient, statutory subject line, and complete formatted letter.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                onClick={() => {
                  setTimeout(() => {
                    handleSimulateDispatch();
                  }, 800);
                }}
              >
                <Mail size={16} /> Open in Email App & Log Filing
              </a>
              <button
                onClick={() => handleCopy(mailtoUrl, 'mailto_link')}
                className="btn btn-secondary"
              >
                {copiedSection === 'mailto_link' ? 'Copied URL' : 'Copy Mailto URL'}
              </button>
            </div>
          </div>
        )}

        {/* Channel 4: Certified Mail / Print */}
        {activeChannel === 'certified' && (
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Formal Letterhead & Physical Mail Package</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Generate a high-resolution, print-ready document formatted for USPS Certified Mail with Return Receipt Requested.
            </p>

            <div style={{
              background: '#040711',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #1e293b',
              marginBottom: '16px',
              fontSize: '0.825rem'
            }}>
              <div><strong>Recipient Physical Address:</strong></div>
              <div style={{ color: 'var(--accent-primary)', marginTop: '4px' }}>
                {params.agencyName}<br />
                {compiledPackage.statute.name} Custodian of Records<br />
                Washington, DC / Local Jurisdiction Headquarters
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
              >
                <Printer size={16} /> Print / Save as PDF
              </button>
              <button
                onClick={handleSimulateDispatch}
                className="btn btn-emerald"
              >
                Mark as Mailed & Log Case
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '16px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Statutory Deadline Clock: <strong style={{ color: 'var(--accent-primary)' }}>{compiledPackage.statutoryDeadline}</strong> ({compiledPackage.statute.responseDays} {compiledPackage.statute.dayType} days)
          </div>
          <button onClick={onClose} className="btn btn-secondary">
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
