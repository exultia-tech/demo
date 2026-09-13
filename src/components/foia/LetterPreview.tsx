"use client";

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Send, 
  Edit3, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  FileCheck,
  Scale
} from 'lucide-react';
import { CompiledRequestPackage } from '@/lib/foia/letterCompiler';
import { StructuredRequestParams, RequesterProfile } from '@/types/foia';

interface LetterPreviewProps {
  compiledPackage: CompiledRequestPackage;
  params: StructuredRequestParams;
  requester: RequesterProfile;
  onOpenDispatch: () => void;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  compiledPackage,
  params,
  requester,
  onOpenDispatch
}) => {
  const [editableText, setEditableText] = useState(compiledPackage.letterText);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadEml = () => {
    const blob = new Blob([compiledPackage.emailBodyRfc822], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${compiledPackage.trackingNumber}-${params.agencyName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}.eml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([editableText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${compiledPackage.trackingNumber}-FOIA-Request.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid var(--border-glass)',
        paddingBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
              <Scale size={12} /> {compiledPackage.statute.shortCode}
            </span>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              <Clock size={12} /> {compiledPackage.statute.responseDays} {compiledPackage.statute.dayType} days limit
            </span>
            <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
              <ShieldCheck size={12} /> {compiledPackage.trackingNumber}
            </span>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '6px' }}>
            Compiled Statutory Request Letter
          </h3>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }} className="no-print">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn btn-sm ${isEditing ? 'btn-emerald' : 'btn-secondary'}`}
            title="Edit Letter Text"
          >
            <Edit3 size={14} /> {isEditing ? 'Done Editing' : 'Edit Text'}
          </button>

          {isEditing && (
            <button
              onClick={() => setEditableText(compiledPackage.letterText)}
              className="btn btn-secondary btn-sm"
              title="Reset to generated draft"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}

          <button onClick={handleCopy} className="btn btn-secondary btn-sm" title="Copy to clipboard">
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button onClick={handleDownloadEml} className="btn btn-secondary btn-sm" title="Download .eml RFC 822 Email file">
            <Download size={14} /> .EML
          </button>

          <button onClick={handleDownloadTxt} className="btn btn-secondary btn-sm" title="Download plain text">
            <FileCheck size={14} /> .TXT
          </button>

          <button onClick={() => window.print()} className="btn btn-secondary btn-sm" title="Print or Save PDF">
            <Printer size={14} /> Print / PDF
          </button>

          <button
            onClick={onOpenDispatch}
            className="btn btn-emerald btn-sm"
            style={{ fontWeight: 700, boxShadow: 'var(--shadow-emerald-glow)' }}
          >
            <Send size={15} /> File & Dispatch Request
          </button>
        </div>
      </div>

      {/* Letter Body Viewer */}
      <div>
        {isEditing ? (
          <textarea
            className="input-field"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.825rem',
              lineHeight: 1.65,
              height: '520px',
              background: '#040711',
              color: '#f8fafc',
              border: '1px solid var(--accent-primary)'
            }}
            value={editableText}
            onChange={e => setEditableText(e.target.value)}
          />
        ) : (
          <div className="legal-letter-view" style={{ maxHeight: '560px', overflowY: 'auto' }}>
            {editableText}
          </div>
        )}
      </div>

      {/* Security & Cryptographic Footer Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '10px 14px',
        background: 'rgba(59, 130, 246, 0.06)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--accent-primary)" />
          <span>
            SHA-256 Audit Seal: <code style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{compiledPackage.sha256Fingerprint.slice(0, 32)}...</code>
          </span>
        </div>
        <div>
          Statutory Response Deadline: <strong style={{ color: 'var(--text-primary)' }}>{compiledPackage.statutoryDeadline}</strong>
        </div>
      </div>
    </div>
  );
};
