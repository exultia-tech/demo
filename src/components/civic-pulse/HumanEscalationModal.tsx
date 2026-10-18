"use client";

import React, { useState } from 'react';
import { X, FileText, Clock, Send, CheckCircle2, ShieldAlert, Copy, Check } from 'lucide-react';
import { CivicDeskTicket } from '@/types/civic-pulse';
import { createCivicDeskTicket } from '@/lib/civic-pulse/agentEngine';

interface HumanEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  state: string;
  query: string;
  customPortalUrl?: string;
  reason?: string;
  onTicketCreated?: (ticket: CivicDeskTicket) => void;
}

export const HumanEscalationModal: React.FC<HumanEscalationModalProps> = ({
  isOpen,
  onClose,
  city,
  state,
  query,
  customPortalUrl,
  reason = "Portal architecture requires direct statutory petition",
  onTicketCreated
}) => {
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [createdTicket, setCreatedTicket] = useState<CivicDeskTicket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const ticket = createCivicDeskTicket(
        city || "Unknown City",
        state || "US",
        query || details || "Municipal Records Inquiry",
        email,
        reason,
        customPortalUrl
      );
      setCreatedTicket(ticket);
      setIsSubmitting(false);
      if (onTicketCreated) {
        onTicketCreated(ticket);
      }
    }, 700);
  };

  const petitionText = `FORMAL PUBLIC RECORDS REQUEST
To: Office of the Municipal Clerk / Public Records Custodian
City of ${city || "Municipal Jurisdiction"}, State of ${state || "US"}
Date: ${new Date().toLocaleDateString()}
Re: Formal Public Records Request Pursuant to State Sunshine & Public Records Act

Dear Public Records Custodian,

Pursuant to the applicable state public records statute, I hereby respectfully request copies of the following public records:

Subject Matter: ${query || "Municipal Meeting Minutes and Resolutions"}
Additional Scope/Dates: ${details || "Official recorded actions, votes, contracts, and proceedings"}
Portal Reference: ${customPortalUrl || "Public Municipal Information Portal"}
Extraction Rationale: ${reason}

Please provide these records in an electronic format to: ${email || "[Requester Email]"}.
If any portion of this request is denied or redacted, please cite the specific statutory exemption authorizing the redaction as required by law.

Respectfully submitted,
Citizen Requester
Generated via Inquest Autonomous Records Engine (Ref: ${createdTicket?.ticketId || "REQ-PENDING"})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(petitionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '560px',
        padding: '2.25rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.15)'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '6px'
          }}>
          <X size={20} />
        </button>

        {!createdTicket ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
              }}>
                <FileText size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Generate Statutory Records Demand
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 600 }}>
                  Automated Public Records Petition Generator
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              When municipal portals use broken software, paper-only scans, or unindexed audio archives, Inquest synthesizes a formal, citation-backed statutory public records demand ready to email or deliver to the city clerk.
            </p>

            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '1.5rem',
              fontSize: '0.82rem'
            }}>
              <div style={{ color: '#E2E8F0', marginBottom: '4px' }}>
                <strong>Target Jurisdiction:</strong> {city || "City Not Specified"}, {state || "State"}
              </div>
              <div style={{ color: '#E2E8F0', marginBottom: '4px' }}>
                <strong>Requested Information:</strong> {query || "Municipal Records"}
              </div>
              {customPortalUrl && (
                <div style={{ color: '#67E8F9', marginBottom: '4px', wordBreak: 'break-all' }}>
                  <strong>Citizen Portal Link:</strong> {customPortalUrl}
                </div>
              )}
              <div style={{ color: '#F59E0B', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                <ShieldAlert size={14} /> {reason}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                  Requester Email (included in demand letter):
                </label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@domain.org" 
                  className="input-field" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                  Specific Date Range or Meeting Details (Optional):
                </label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Council meeting occurred in late 2025 regarding street repair bids..."
                  rows={3}
                  className="input-field"
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={onClose}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1', cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary" 
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                }}>
                {isSubmitting ? 'Compiling Demand...' : 'Generate Statutory Demand Letter →'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#FFFFFF' }}>
              Statutory Records Demand Ready!
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Your formal municipal records demand has been compiled with statutory citations. You can copy this petition and email or deliver it directly to the city clerk.
            </p>

            <div style={{
              background: 'rgba(2, 6, 23, 0.8)',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'left',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Request Reference ID:</span>
                <span style={{ fontFamily: 'monospace', color: '#34D399', fontWeight: 700 }}>{createdTicket.ticketId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Generation Engine:</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{createdTicket.humanSpecialistAssigned}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Legal Response Window:</span>
                <span style={{ color: '#FBBF24', fontWeight: 600 }}>Statutory 5–10 Business Days (State Mandate)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '8px',
                  background: copied ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: copied ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: copied ? '#34D399' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Letter Copied to Clipboard!' : 'Copy Demand Letter Text'}</span>
              </button>

              <button 
                onClick={onClose}
                className="btn-primary" 
                style={{ padding: '0.85rem 1.75rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', fontWeight: 800 }}>
                Return to Workspace
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
