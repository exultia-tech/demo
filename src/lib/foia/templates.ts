import { StructuredRequestParams, RequesterProfile, StatuteInfo } from '@/types/foia';

export function compileInitialRequestLetter(
  params: StructuredRequestParams,
  requester: RequesterProfile,
  statute: StatuteInfo,
  trackingNumber: string,
  submissionDate: string,
  statutoryDeadline: string
): string {
  const formatList = params.requestedFormats
    .map(f => {
      switch (f) {
        case 'csv_xlsx': return 'Raw Delimited Spreadsheets (.CSV / .XLSX) with underlying formulas and metadata intact';
        case 'native_electronic': return 'Native Electronic Format (as maintained in ordinary course of business)';
        case 'pdf_searchable': return 'Text-Searchable PDF documents (with OCR enabled)';
        case 'audio_video_raw': return 'Original uncompressed Audio/Video digital media recordings';
        case 'email_eml_msg': return 'Native email containers (.EML / .MSG) preserving full header fields, MIME parts, and attachments';
        default: return 'Electronic format via digital download or direct email transmission';
      }
    })
    .join('\n- ');

  const keywordSection = params.keywords.length > 0
    ? `\n\nSEARCH STRATEGY & KEYWORD PARAMETERS:\nTo assist agency personnel in executing comprehensive electronic searches across email servers, enterprise document repositories, and shared network directories, please execute Boolean queries including, but not limited to, the following terms:\n- ${params.keywords.map(k => `"${k}"`).join('\n- ')}`
    : '';

  const custodianSection = params.targetCustodians.length > 0
    ? `\n\nTARGET CUSTODIANS & ORGANIZATIONAL UNITS:\nThis request specifically encompasses responsive records authored, received, carbon-copied, blind-copied, or retained by:\n- ${params.targetCustodians.join('\n- ')}`
    : '';

  let feeWaiverSection = '';
  if (params.feeWaiverRequested) {
    feeWaiverSection = `
STATUTORY FEE WAIVER / REDUCTION REQUEST:
Pursuant to ${statute.citation} (${statute.statutoryFeeWaiverClause}), I hereby formally request a full waiver of all search, review, and duplication fees.
Justification: ${params.feeWaiverJustification || 'The subject matter of this request concerns the operations and activities of government. The disclosure of these records is in the public interest and will significantly enhance public understanding of government operations without serving any commercial enterprise.'}

In the event that a fee waiver is denied or requires supplemental justification, please authorize expenses up to the maximum pre-authorized threshold of $${params.feeLimitMax}.00 USD without further approval. Please notify me immediately in writing with an itemized statutory cost estimate before incurring any expenses exceeding this cap.`;
  } else {
    feeWaiverSection = `
FEE AUTHORIZATION:
I hereby agree to pay reasonable and statutory duplication fees associated with processing this request up to $${params.feeLimitMax}.00 USD. If the agency estimates that allowable statutory fees will exceed this amount, please provide an itemized written estimate detailing search and reproduction charges prior to undertaking the work.`;
  }

  let expeditedSection = '';
  if (params.expeditedProcessingRequested) {
    expeditedSection = `
FORMAL MOTION FOR EXPEDITED PROCESSING:
Pursuant to ${statute.citation}, I hereby request expedited processing of this request.
Urgent Grounds: ${params.expeditedProcessingGrounds || 'There exists an urgent necessity to inform the public concerning actual or alleged government activity, and an imminent risk to public health, due process rights, or vital public interest that would be irrevocably compromised by customary processing delays.'}
I hereby certify under penalty of perjury that the foregoing statements regarding urgency are true and correct to the best of my knowledge.`;
  }

  const segregabilitySection = params.preemptiveClauses.segregability
    ? `
MANDATORY SEGREGABILITY & EXEMPTION PREEMPTION:
${statute.segregabilityMandate}
If the agency determines that any portion of a requested record falls within an enumerated statutory exemption, you are statutorily required to redact only the specific exempt information and release all reasonably segregable non-exempt portions. For every redaction or withheld document, please identify in writing:
1. The exact statutory exemption and subsection invoked.
2. The specific factual basis establishing that the disclosure would cause reasonably foreseeable harm or violates mandatory statutory non-disclosure.
3. The volume, date, author, and description of withheld materials (Vaughn Index).`
    : '';

  const preservationSection = params.preemptiveClauses.destructionHoldNotice
    ? `
EVIDENCE PRESERVATION & DESTRUCTION HOLD NOTICE:
Pursuant to applicable public records laws and retention schedules, this formal filing constitutes legal notice placing a mandatory preservation hold on all potentially responsive physical and electronic documents, including ephemeral chat logs, text messages, deleted mailbox archives, backup tapes, and metadata. Any routine auto-deletion or destruction protocols governing these records must be suspended immediately.`
    : '';

  const electronicFormatMandate = params.preemptiveClauses.electronicFormatMandate
    ? `
ELECTRONIC PRODUCTION MANDATE:
Pursuant to statutory electronic records mandates, please deliver all responsive records electronically via secure digital download link or direct email transmission to: ${requester.email}. Please do not print electronic documents to paper for scanning, as this degrades searchability and strips native metadata.`
    : '';

  return `================================================================================
FORMAL PUBLIC RECORDS REQUEST PURSUANT TO ${statute.citation.toUpperCase()}
TRACKING IDENTIFIER: ${trackingNumber}
================================================================================

DATE OF SUBMISSION: ${submissionDate}
STATUTORY DETERMINATION DEADLINE: ${statutoryDeadline} (${statute.responseDays} ${statute.dayType} days)

TO:
${params.agencyName}
ATTN: ${params.agencyEmail ? `Records Custodian / FOIA Officer <${params.agencyEmail}>` : 'Freedom of Information / Public Records Custodian'}
JURISDICTION: ${statute.stateOrFederal} (${statute.name})

FROM:
${requester.fullName}${requester.title ? `, ${requester.title}` : ''}${requester.organization ? `\n${requester.organization}` : ''}
Email: ${requester.email}
Phone: ${requester.phone}
Mailing Address: ${requester.addressLine1}${requester.addressLine2 ? `, ${requester.addressLine2}` : ''}, ${requester.city}, ${requester.state} ${requester.zipCode}

--------------------------------------------------------------------------------
RE: FORMAL PUBLIC RECORDS ACT REQUEST — ${params.subjectMatter.toUpperCase()}
--------------------------------------------------------------------------------

Dear Public Records Officer / Custodian of Records:

This is a formal request for public records made pursuant to ${statute.name} (${statute.citation}).

I hereby request access to, and electronic copies of, all public records within the custody, possession, or control of ${params.agencyName} as described below:

DESCRIPTION OF REQUESTED RECORDS:
${params.subjectMatter}

TEMPORAL SCOPE:
This request encompasses all records created, received, modified, or archived between ${params.dateStart || 'January 1, 2023'} and ${params.dateEnd || 'Present Date'}.
${custodianSection}
${keywordSection}

PREFERRED FORMAT OF PRODUCTION:
- ${formatList}
${electronicFormatMandate}
${segregabilitySection}
${feeWaiverSection}
${expeditedSection}
${preservationSection}

STATUTORY TIMELINE AND CONTACT:
Pursuant to ${statute.citation}, your agency is required to respond to this request within ${statute.responseDays} ${statute.dayType} days, making the statutory deadline for initial determination ${statutoryDeadline}.

If you require any clarification regarding the scope of this request or believe that any portion of it is overly broad, please contact me immediately at ${requester.email} or by phone at ${requester.phone} so we may confer and resolve any questions without tolling statutory deadlines.

Thank you for your prompt dedication to open government and statutory compliance.

Respectfully submitted,

/s/ ${requester.fullName}
${requester.title ? `${requester.title}, ` : ''}${requester.organization ? requester.organization : ''}
${requester.email} | ${requester.phone}

================================================================================
CRYPTOGRAPHIC INTEGRITY DIGEST (SHA-256 RECORD VERIFICATION)
LEGAL FILING REF: ${trackingNumber} | HASH: [COMPUTED_AT_DISPATCH]
================================================================================`;
}

export function compileAdministrativeAppealLetter(
  caseFile: {
    id: string;
    params: StructuredRequestParams;
    requesterInfo: RequesterProfile;
    statuteCitation: string;
    statuteName: string;
    denialReason?: string;
    exemptionsCited?: string[];
  },
  statute: StatuteInfo
): string {
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const exemptionsText = caseFile.exemptionsCited && caseFile.exemptionsCited.length > 0
    ? caseFile.exemptionsCited.map(e => `- Cited Exemption: ${e}`).join('\n')
    : '- Constructive Denial / Failure to Respond within Statutory Deadline';

  return `================================================================================
ADMINISTRATIVE APPEAL / PETITION FOR DETERMINATION REVIEW
PURSUANT TO ${statute.citation.toUpperCase()} & ${statute.appealAuthority.toUpperCase()}
CASE TRACKING ID: ${caseFile.id}
================================================================================

DATE: ${now}

TO:
${statute.appealAuthority}
c/o ${caseFile.params.agencyName} Legal Appeals Division
Email: ${caseFile.params.agencyEmail}

FROM:
${caseFile.requesterInfo.fullName}
${caseFile.requesterInfo.organization ? `${caseFile.requesterInfo.organization}\n` : ''}Email: ${caseFile.requesterInfo.email} | Phone: ${caseFile.requesterInfo.phone}

RE: FORMAL ADMINISTRATIVE APPEAL — UNLAWFUL DENIAL / CONSTRUCTIVE WITHHOLDING
ORIGINAL REQUEST ID: ${caseFile.id}
ORIGINAL SUBJECT: ${caseFile.params.subjectMatter}

Dear Appeals Officer / Review Authority:

I hereby file this formal Administrative Appeal pursuant to ${statute.name} (${statute.citation}) challenging the improper denial, unjustified redactions, or unlawful constructive delay regarding public records request ${caseFile.id}.

GROUNDS FOR APPEAL:
${exemptionsText}

SUMMARY OF LEGAL REASONS WHY WITHHOLDING IS IMPROPER:
1. FAILURE TO MEET BURDEN OF PROOF: Under ${statute.citation}, the governmental body bears the strict legal burden of demonstrating that requested public records fall squarely within a recognized statutory exemption. Blanket or conclusory assertions fail to meet this legal threshold.
2. FAILURE TO RELEASE REASONABLY SEGREGABLE INFORMATION: ${statute.segregabilityMandate}. Even if specific phrases or personal identifiers were properly subject to redaction, the agency failed in its affirmative duty to release factual narratives, statistical tables, and segregable background text.
3. ABSENCE OF FORESEEABLE HARM: Purely factual materials, procurement records, final administrative actions, and environmental compliance audits are not protected under deliberative process or general privacy exemptions where strong public interest in transparency prevails.

REQUESTED RELIEF:
1. An immediate reversal of the agency's denial determination.
2. A formal order directing the Custodian of Records to produce all responsive records without further delay.
3. Waiver of any search or processing fees improperly assessed in violation of statutory schedules.

Please provide your written determination regarding this administrative appeal within the statutory review timeframe.

Respectfully submitted,

/s/ ${caseFile.requesterInfo.fullName}
${caseFile.requesterInfo.email}
Tracked via LexPublica Compliance Engine`;
}
