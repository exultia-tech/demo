import { StructuredRequestParams, RequesterProfile, StatuteInfo } from '@/types/foia';
import { getStatuteForJurisdiction } from './statutes';
import { calculateStatutoryDeadline } from './deadlineCalculator';
import { compileInitialRequestLetter } from './templates';

// Simple fast SHA-256 implementation using browser Web Crypto API or fallback
export async function generateSha256Digest(content: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(content);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
  } catch (err) {
    console.warn('WebCrypto SHA-256 unavailable, generating surrogate hash', err);
  }

  // Fast deterministic hash fallback
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `sha256_mock_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

export function generateTrackingNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `REC-${year}-${rand}`;
}

export interface CompiledRequestPackage {
  trackingNumber: string;
  submissionDate: string;
  statutoryDeadline: string;
  statute: StatuteInfo;
  letterText: string;
  emailSubject: string;
  emailBodyRfc822: string;
  portalDescription: string;
  sha256Fingerprint: string;
}

export async function compileRequestPackage(
  params: StructuredRequestParams,
  requester: RequesterProfile,
  existingTrackingNumber?: string
): Promise<CompiledRequestPackage> {
  const trackingNumber = existingTrackingNumber || generateTrackingNumber();
  const statute = getStatuteForJurisdiction(params.jurisdictionId);
  const today = new Date().toISOString().split('T')[0];
  const submissionDateFormatted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const statutoryDeadline = calculateStatutoryDeadline(today, statute.responseDays, statute.dayType);
  const deadlineFormatted = new Date(statutoryDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Generate Base Letter
  const baseLetter = compileInitialRequestLetter(
    params,
    requester,
    statute,
    trackingNumber,
    submissionDateFormatted,
    deadlineFormatted
  );

  // Compute Digest
  const sha256Fingerprint = await generateSha256Digest(baseLetter + trackingNumber + today);

  // Final Letter with Digest attached
  const finalLetterText = baseLetter.replace('[COMPUTED_AT_DISPATCH]', sha256Fingerprint);

  const emailSubject = `Public Records Act Request (${statute.shortCode}): ${params.subjectMatter.slice(0, 75)} [Ref: ${trackingNumber}]`;

  const emailBodyRfc822 = `To: ${params.agencyEmail || 'records-officer@agency.gov'}\nFrom: ${requester.email}\nSubject: ${emailSubject}\nX-Inquest-Tracking-ID: ${trackingNumber}\nX-Statutory-Deadline: ${statutoryDeadline}\n\n${finalLetterText}`;

  const portalDescription = `${params.subjectMatter}\n\nTemporal Scope: ${params.dateStart} to ${params.dateEnd}\n\nSearch Keywords: ${params.keywords.join(', ')}\n\nFormats: ${params.requestedFormats.join(', ')}\n\nFee Waiver Requested: ${params.feeWaiverRequested ? 'Yes (Public Interest / News Media)' : 'No'}\n\nStatutory Citation: ${statute.name} (${statute.citation})\nTracking Ref: ${trackingNumber}`;

  return {
    trackingNumber,
    submissionDate: submissionDateFormatted,
    statutoryDeadline,
    statute,
    letterText: finalLetterText,
    emailSubject,
    emailBodyRfc822,
    portalDescription,
    sha256Fingerprint
  };
}
