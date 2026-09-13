import { FilingCase, RequesterProfile } from '@/types/foia';

const STORAGE_KEYS = {
  CASES: 'lexpublica_cases_v1',
  PROFILE: 'lexpublica_profile_v1',
  API_KEY: 'lexpublica_gemini_api_key_v1',
  THEME: 'lexpublica_theme_v1'
};

export const DEFAULT_REQUESTER_PROFILE: RequesterProfile = {
  fullName: 'Morgan Vance',
  organization: 'Civic Transparency Investigation Bureau',
  title: 'Investigative Research Director',
  email: 'm.vance@civictransparency.org',
  phone: '(202) 555-0184',
  addressLine1: '1250 Constitution Avenue NW',
  addressLine2: 'Suite 400',
  city: 'Washington',
  state: 'DC',
  zipCode: '20004',
  defaultFeeCategory: 'news_media',
  defaultFeeLimit: 50
};

export const SAMPLE_CASES: FilingCase[] = [
  {
    id: 'REC-2026-44912',
    createdAt: '2026-08-20T14:30:00.000Z',
    submittedAt: '2026-08-20T14:35:00.000Z',
    statutoryDeadline: '2026-09-18',
    status: 'in_review',
    userPrompt: 'FBI / DOJ: All records and intelligence assessments concerning algorithmic surveillance tools in Midwest field offices.',
    params: {
      subjectMatter: 'All records, threat assessments, and procurement evaluations regarding AI-assisted predictive surveillance software deployed across Chicago and Detroit field offices.',
      agencyId: 'fed-fbi',
      agencyName: 'Federal Bureau of Investigation (FBI / DOJ)',
      agencyEmail: 'foiparequest@fbi.gov',
      jurisdictionId: 'US_FED',
      statuteCitation: '5 U.S.C. § 552',
      statuteName: 'Freedom of Information Act',
      dateStart: '2023-01-01',
      dateEnd: '2026-08-01',
      keywords: ['predictive policing', 'facial recognition', 'procurement', 'vendor contract'],
      targetCustodians: ['Operational Technology Division (OTD)', 'Director Senior Policy Staff'],
      recordCategories: ['Vendor Contracts', 'Security Audits'],
      requestedFormats: ['native_electronic', 'pdf_searchable'],
      feeCategory: 'news_media',
      feeLimitMax: 50,
      feeWaiverRequested: true,
      feeWaiverJustification: 'Request filed on behalf of news media organization to shed light on government use of algorithmic surveillance.',
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
    generatedLetterText: 'FORMAL PUBLIC RECORDS REQUEST PURSUANT TO 5 U.S.C. § 552 (FOIA)...',
    sha256Fingerprint: 'a8f4c1979b08f83199c0b11543b593fa8879b9044238e819b139972304859a11',
    requesterInfo: DEFAULT_REQUESTER_PROFILE,
    notes: 'Agency sent acknowledgment letter on Aug 23. Request assigned tracking # FOIA-2026-08129.',
    historyLogs: [
      {
        timestamp: '2026-08-20T14:35:00.000Z',
        action: 'Dispatched via Direct Email',
        details: 'Sent RFC 822 formatted package to foiparequest@fbi.gov'
      },
      {
        timestamp: '2026-08-23T10:12:00.000Z',
        action: 'Agency Acknowledgment Received',
        details: 'Assigned FOIA tracking ID FOIA-2026-08129'
      }
    ]
  },
  {
    id: 'REC-2026-38104',
    createdAt: '2026-08-05T09:15:00.000Z',
    submittedAt: '2026-08-05T09:20:00.000Z',
    statutoryDeadline: '2026-08-19',
    status: 'overdue',
    userPrompt: 'Austin Police Department: Bodycam footage and CAD logs for incident #2024-88412 on 6th St.',
    params: {
      subjectMatter: 'Austin Police Department: All officer body-worn camera footage, dashcam footage, and incident CAD dispatch logs related to downtown public assembly incident on 6th Street.',
      agencyId: 'tx-apd',
      agencyName: 'Austin Police Department / City of Austin',
      agencyEmail: 'apdpublicinformation@austintexas.gov',
      jurisdictionId: 'TX',
      statuteCitation: 'Tex. Gov. Code Chapter 552',
      statuteName: 'Texas Public Information Act (TPIA)',
      dateStart: '2024-03-15',
      dateEnd: '2024-03-18',
      keywords: ['bodycam', 'CAD log', '6th street', 'incident 2024-88412'],
      targetCustodians: ['Downtown Command Division', 'Records Custodian'],
      recordCategories: ['Bodycam Video', 'CAD Logs'],
      requestedFormats: ['audio_video_raw', 'pdf_searchable'],
      feeCategory: 'news_media',
      feeLimitMax: 50,
      feeWaiverRequested: true,
      feeWaiverJustification: 'Public accountability regarding police operations.',
      expeditedProcessingRequested: true,
      expeditedProcessingGrounds: 'Imminent due process concerns and public safety transparency.',
      preemptiveClauses: {
        segregability: true,
        electronicFormatMandate: true,
        metadataPreservation: true,
        searchKeywordCertification: true,
        destructionHoldNotice: true
      }
    },
    generatedLetterText: 'FORMAL PUBLIC RECORDS REQUEST PURSUANT TO TEX. GOV. CODE CHAPTER 552...',
    sha256Fingerprint: '984b2e8812cba1024345f091002239f1cba0991823901a882001193309108119',
    requesterInfo: DEFAULT_REQUESTER_PROFILE,
    notes: 'Agency exceeded strict 10-business-day TPIA deadline without requesting AG ruling. Ready for 1-Click Administrative Appeal!',
    historyLogs: [
      {
        timestamp: '2026-08-05T09:20:00.000Z',
        action: 'Dispatched via Direct Email',
        details: 'Sent to apdpublicinformation@austintexas.gov'
      },
      {
        timestamp: '2026-08-20T00:00:00.000Z',
        action: 'Statutory Clock Expired',
        details: '10 business days elapsed. Records are legally presumed public under Tex. Gov. Code § 552.302.'
      }
    ]
  },
  {
    id: 'REC-2026-19283',
    createdAt: '2026-08-12T11:00:00.000Z',
    submittedAt: '2026-08-12T11:05:00.000Z',
    statutoryDeadline: '2026-08-22',
    status: 'fulfilled',
    userPrompt: 'California Air Resources Board: All chemical inspection reports for Central Valley agricultural facilities in 2024.',
    params: {
      subjectMatter: 'California Air Resources Board: All environmental inspection reports, violation notices, and chemical emissions spreadsheets for Central Valley facilities.',
      agencyId: 'ca-carb',
      agencyName: 'California Air Resources Board',
      agencyEmail: 'pra@arb.ca.gov',
      jurisdictionId: 'CA',
      statuteCitation: 'Cal. Gov. Code § 7920.000 et seq.',
      statuteName: 'California Public Records Act (CPRA)',
      dateStart: '2024-01-01',
      dateEnd: '2024-12-31',
      keywords: ['emissions', 'inspection', 'violation notice', 'Central Valley'],
      targetCustodians: ['Enforcement Division'],
      recordCategories: ['Inspection Reports', 'Violation Notices'],
      requestedFormats: ['csv_xlsx', 'pdf_searchable'],
      feeCategory: 'educational_scientific',
      feeLimitMax: 25,
      feeWaiverRequested: true,
      feeWaiverJustification: 'Scientific analysis of air quality and compliance.',
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
    generatedLetterText: 'FORMAL PUBLIC RECORDS REQUEST PURSUANT TO CAL. GOV. CODE § 7920...',
    sha256Fingerprint: '772b1192e4018244bb1928448102840192841029481029481902840192840192',
    requesterInfo: DEFAULT_REQUESTER_PROFILE,
    notes: 'Agency released 14 PDF reports and 2 CSV spreadsheets with complete unredacted testing logs.',
    historyLogs: [
      {
        timestamp: '2026-08-12T11:05:00.000Z',
        action: 'Dispatched via Direct Email',
        details: 'Sent to pra@arb.ca.gov'
      },
      {
        timestamp: '2026-08-21T16:40:00.000Z',
        action: 'Records Delivered',
        details: 'Received secure download link containing 16 responsive files.'
      }
    ]
  }
];

export function getStoredCases(): FilingCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CASES);
    if (!raw) {
      saveStoredCases(SAMPLE_CASES);
      return SAMPLE_CASES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading cases from storage:', e);
    return SAMPLE_CASES;
  }
}

export function saveStoredCases(cases: FilingCase[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  } catch (e) {
    console.error('Error saving cases to storage:', e);
  }
}

export function addFilingCase(newCase: FilingCase): void {
  const cases = getStoredCases();
  cases.unshift(newCase);
  saveStoredCases(cases);
}

export function updateFilingCase(updatedCase: FilingCase): void {
  const cases = getStoredCases();
  const index = cases.findIndex(c => c.id === updatedCase.id);
  if (index !== -1) {
    cases[index] = updatedCase;
    saveStoredCases(cases);
  }
}

export function deleteFilingCase(id: string): void {
  const cases = getStoredCases().filter(c => c.id !== id);
  saveStoredCases(cases);
}

export function getStoredProfile(): RequesterProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_REQUESTER_PROFILE;
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_REQUESTER_PROFILE;
  }
}

export function saveStoredProfile(profile: RequesterProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function getStoredApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function saveStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}
