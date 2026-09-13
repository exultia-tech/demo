import { StructuredRequestParams, ResponseAnalysisResult } from '@/types/foia';
import { parsePromptDeterministically } from './deterministicParser';
import { getStatuteForJurisdiction } from './statutes';
import { compileAdministrativeAppealLetter } from './templates';

export async function parseInputWithAI(
  prompt: string,
  userJurisdiction: string,
  apiKey?: string
): Promise<StructuredRequestParams> {
  // If no Gemini API key provided, use deterministic parser
  if (!apiKey || apiKey.trim() === '') {
    return parsePromptDeterministically(prompt, userJurisdiction);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert FOIA and public records attorney. Parse the user's natural language request into a precise structured open records filing parameter schema.
User Prompt: "${prompt}"
User Suggested Jurisdiction: "${userJurisdiction}"

Return ONLY a valid JSON object matching this schema:
{
  "subjectMatter": string,
  "jurisdictionId": "US_FED" | "CA" | "TX" | "FL" | "NY" | "IL" | "PA" | "WA" | "OH" | "MA" | "GA" | "MI" | "NC" | "VA" | "NJ" | "CO" | "AZ",
  "agencyName": string,
  "agencyEmail": string,
  "dateStart": "YYYY-MM-DD",
  "dateEnd": "YYYY-MM-DD",
  "keywords": string[],
  "targetCustodians": string[],
  "feeWaiverJustification": string,
  "expeditedProcessingRequested": boolean,
  "expeditedProcessingGrounds": string
}`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API call failed, falling back to deterministic parser', await response.text());
      return parsePromptDeterministically(prompt, userJurisdiction);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      const parsed = JSON.parse(candidateText);
      const fallback = parsePromptDeterministically(prompt, parsed.jurisdictionId || userJurisdiction);
      const statute = getStatuteForJurisdiction(parsed.jurisdictionId || fallback.jurisdictionId);

      return {
        ...fallback,
        subjectMatter: parsed.subjectMatter || fallback.subjectMatter,
        agencyName: parsed.agencyName || fallback.agencyName,
        agencyEmail: parsed.agencyEmail || fallback.agencyEmail,
        jurisdictionId: parsed.jurisdictionId || fallback.jurisdictionId,
        statuteCitation: statute.citation,
        statuteName: statute.name,
        dateStart: parsed.dateStart || fallback.dateStart,
        dateEnd: parsed.dateEnd || fallback.dateEnd,
        keywords: parsed.keywords?.length ? parsed.keywords : fallback.keywords,
        targetCustodians: parsed.targetCustodians?.length ? parsed.targetCustodians : fallback.targetCustodians,
        feeWaiverJustification: parsed.feeWaiverJustification || fallback.feeWaiverJustification,
        expeditedProcessingRequested: parsed.expeditedProcessingRequested ?? fallback.expeditedProcessingRequested,
        expeditedProcessingGrounds: parsed.expeditedProcessingGrounds || fallback.expeditedProcessingGrounds
      };
    }
  } catch (err) {
    console.error('Error during AI prompt parsing:', err);
  }

  return parsePromptDeterministically(prompt, userJurisdiction);
}

export async function analyzeAgencyResponseLetter(
  responseLetterText: string,
  jurisdictionId: string = 'US_FED',
  apiKey?: string
): Promise<ResponseAnalysisResult> {
  const statute = getStatuteForJurisdiction(jurisdictionId);
  const lower = responseLetterText.toLowerCase();

  // Local Deterministic Response Analyzer
  const exemptions: ResponseAnalysisResult['citedExemptions'] = [];
  const defects: string[] = [];
  let detectedStatus: ResponseAnalysisResult['detectedStatus'] = 'acknowledgment';

  // Detect Exemption 5 (Deliberative Process)
  if (lower.includes('b(5)') || lower.includes('exemption 5') || lower.includes('deliberative') || lower.includes('predecisional') || lower.includes('advice and recommendations')) {
    exemptions.push({
      code: `${statute.shortCode} / Exemption 5 (Deliberative Process Privilege)`,
      description: 'Agency claims intra-agency communications contain predecisional opinions or recommendations.',
      vulnerabilityAssessment: 'Highly vulnerable under the FOIA Improvement Act of 2016 foreseeable harm standard (5 U.S.C. § 552(a)(8)(A)). Purely factual information, scientific data, and post-decisional explanations cannot be shielded.',
      counterArgument: 'The agency must demonstrate foreseeable and tangible harm to agency decision-making; factual segregable portions must be produced pursuant to Machin v. Zuckert and NLRB v. Sears.'
    });
    detectedStatus = 'denial';
  }

  // Detect Exemption 6 / 7(C) (Privacy)
  if (lower.includes('b(6)') || lower.includes('exemption 6') || lower.includes('7(c)') || lower.includes('privacy') || lower.includes('personal information')) {
    exemptions.push({
      code: `${statute.shortCode} / Exemption 6 & 7(C) (Personal Privacy)`,
      description: 'Agency claims disclosure constitutes an unwarranted invasion of personal privacy.',
      vulnerabilityAssessment: 'Overbroad redactions often improperly conceal public officials acting in their official capacities, government employee salaries, or contractor identities.',
      counterArgument: 'Public officials and government contractors have a diminished privacy expectation regarding official actions. Names and official roles are not exempt when weighed against the strong public interest in government transparency.'
    });
    detectedStatus = 'denial';
  }

  // Detect Exemption 7 (Law Enforcement)
  if (lower.includes('b(7)') || lower.includes('exemption 7') || lower.includes('law enforcement') || lower.includes('investigatory') || lower.includes('active investigation')) {
    exemptions.push({
      code: `${statute.shortCode} / Exemption 7(A) (Ongoing Law Enforcement Investigation)`,
      description: 'Agency asserts disclosure could interfere with pending enforcement proceedings.',
      vulnerabilityAssessment: 'Agencies cannot invoke blanket investigatory exemptions without demonstrating specific articulable risk of witness tampering or evidence destruction.',
      counterArgument: 'Closed investigations, standard administrative compliance records, CAD dispatch records, and public 911 calls do not constitute sensitive investigatory files that prejudice enforcement.'
    });
    detectedStatus = 'denial';
  }

  // Detect Exemption 4 (Trade Secrets / Commercial)
  if (lower.includes('b(4)') || lower.includes('exemption 4') || lower.includes('trade secret') || lower.includes('commercial or financial') || lower.includes('confidential commercial')) {
    exemptions.push({
      code: `${statute.shortCode} / Exemption 4 (Commercial & Financial Information)`,
      description: 'Agency asserts records contain proprietary vendor data or trade secrets.',
      vulnerabilityAssessment: 'Government contract pricing, bid amounts, and performance metrics are public once awarded and cannot be withheld under Food Marketing Institute v. Argus Leader Media.',
      counterArgument: 'Final contract terms, unit prices paid with taxpayer funds, and public procurement scoring sheets are disclosable public information.'
    });
    detectedStatus = 'denial';
  }

  // Detect Excessive Fee Estimates
  if (lower.includes('fee estimate') || lower.includes('deposit') || lower.includes('cost to process') || lower.includes('search fee') || lower.includes('payment required')) {
    detectedStatus = 'fee_estimate';
    defects.push('Agency assessed search/review fees without demonstrating why statutory public interest fee waiver does not apply.');
    defects.push('Agency failed to provide an itemized breakdown of hourly search time and reproduction costs.');
  }

  // Detect Overly Broad / Refusal to Search
  if (lower.includes('overly broad') || lower.includes('unduly burdensome') || lower.includes('unreasonably voluminous') || lower.includes('fails to reasonably describe')) {
    detectedStatus = 'denial';
    defects.push('Agency claimed request is too broad without fulfilling its affirmative statutory duty to confer with requester to narrow search terms.');
  }

  // Detect Delay / Extension Notice
  if (lower.includes('extension') || lower.includes('unusual circumstances') || lower.includes('backlog') || lower.includes('additional time')) {
    if (detectedStatus !== 'denial') {
      detectedStatus = 'delay_extension';
    }
  }

  if (exemptions.length === 0 && detectedStatus !== 'fee_estimate') {
    defects.push('Agency failed to cite specific statutory exemption subsections or provide an itemized index of withheld materials.');
  }

  const appealDraft = compileAdministrativeAppealLetter(
    {
      id: 'REC-APPEAL-DEMO',
      params: {
        subjectMatter: 'Requested Public Records',
        agencyId: 'agency-target',
        agencyName: 'Agency Records Custodian',
        agencyEmail: 'records@agency.gov',
        jurisdictionId,
        statuteCitation: statute.citation,
        statuteName: statute.name,
        dateStart: '2023-01-01',
        dateEnd: '2024-12-31',
        keywords: [],
        targetCustodians: [],
        recordCategories: [],
        requestedFormats: ['native_electronic'],
        feeCategory: 'news_media',
        feeLimitMax: 50,
        feeWaiverRequested: true,
        feeWaiverJustification: 'Public Interest Transparency',
        expeditedProcessingRequested: false,
        expeditedProcessingGrounds: '',
        preemptiveClauses: {
          segregability: true,
          electronicFormatMandate: true,
          metadataPreservation: true,
          searchKeywordCertification: true,
          destructionHoldNotice: true
        }
      },
      requesterInfo: {
        fullName: 'Jane Doe',
        organization: 'Public Integrity Project',
        email: 'requester@example.com',
        phone: '(555) 019-2834',
        addressLine1: '100 Transparency Way',
        city: 'Washington',
        state: 'DC',
        zipCode: '20001',
        defaultFeeCategory: 'news_media',
        defaultFeeLimit: 50
      },
      statuteCitation: statute.citation,
      statuteName: statute.name,
      exemptionsCited: exemptions.map(e => e.code)
    },
    statute
  );

  return {
    detectedStatus,
    citedExemptions: exemptions,
    statutoryDefectsFound: defects,
    recommendedAction: detectedStatus === 'denial'
      ? `File a formal Administrative Appeal under ${statute.citation}. The agency has 20 business days to reconsider or face judicial review.`
      : detectedStatus === 'fee_estimate'
      ? `Submit a Fee Waiver Reassertion Letter challenging the search costs under ${statute.statutoryFeeWaiverClause}.`
      : `Monitor the statutory timeline. If the agency fails to produce records by the statutory deadline, file a Constructive Denial Appeal.`,
    appealDraft
  };
}
