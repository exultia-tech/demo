import { StructuredRequestParams, RequestFormat, AgencyContact } from '@/types/foia';
import { AGENCIES_DATABASE, searchAgencies } from './agencies';
import { STATUTES_DATABASE, getStatuteForJurisdiction } from './statutes';

export function parsePromptDeterministically(
  prompt: string,
  userSelectedJurisdiction?: string
): StructuredRequestParams {
  const p = prompt.trim();
  const lower = p.toLowerCase();

  // 1. Detect Jurisdiction
  let jurisdictionId = userSelectedJurisdiction || 'US_FED';
  if (!userSelectedJurisdiction || userSelectedJurisdiction === 'auto') {
    if (/\b(california|ca|los angeles|lapd|san francisco|sfpd|cpra|sacramento)\b/i.test(prompt)) {
      jurisdictionId = 'CA';
    } else if (/\b(texas|tx|austin|houston|dallas|tpia|hpd|apd)\b/i.test(prompt)) {
      jurisdictionId = 'TX';
    } else if (/\b(florida|fl|miami|orlando|sunshine|fdle|mdpd)\b/i.test(prompt)) {
      jurisdictionId = 'FL';
    } else if (/\b(new york|ny|nyc|nypd|foil|albany|manhattan)\b/i.test(prompt)) {
      jurisdictionId = 'NY';
    } else if (/\b(illinois|il|chicago|cpd|cook county)\b/i.test(prompt)) {
      jurisdictionId = 'IL';
    } else if (/\b(washington|wa|seattle|spd|olympia)\b/i.test(prompt)) {
      jurisdictionId = 'WA';
    } else if (/\b(pennsylvania|pa|philadelphia|pittsburgh|rtkl)\b/i.test(prompt)) {
      jurisdictionId = 'PA';
    } else if (/\b(massachusetts|ma|boston)\b/i.test(prompt)) {
      jurisdictionId = 'MA';
    } else if (/\b(georgia|ga|atlanta)\b/i.test(prompt)) {
      jurisdictionId = 'GA';
    } else if (/\b(fbi|epa|sec|dod|fda|ftc|dhs|doj|federal|foia)\b/i.test(prompt)) {
      jurisdictionId = 'US_FED';
    }
  }

  // 2. Detect Agency
  let matchedAgency: AgencyContact | undefined;
  let highestScore = 0;

  for (const agency of AGENCIES_DATABASE) {
    let score = 0;
    
    // Check exact acronym with word boundary
    if (agency.acronym) {
      const acronymRegex = new RegExp(`\\b${agency.acronym}\\b`, 'i');
      if (acronymRegex.test(prompt)) {
        score += 50;
      }
    }

    // Check full name in prompt
    if (lower.includes(agency.name.toLowerCase())) {
      score += 40;
    }

    // Check agency main name tokens (e.g., "Austin", "Police", "Department")
    const agencyTokens = agency.name.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2 && !['and', 'the', 'city', 'state', 'department', 'office'].includes(t));

    const matchedTokens = agencyTokens.filter(token => lower.includes(token));
    if (agencyTokens.length > 0 && matchedTokens.length === agencyTokens.length) {
      score += 30;
    } else {
      score += matchedTokens.length * 5;
    }

    // Jurisdiction match bonus
    if (agency.jurisdictionId === jurisdictionId) {
      score += 5;
    }

    if (score > highestScore) {
      highestScore = score;
      matchedAgency = agency;
    }
  }

  // Fallback if no strong match found
  if (!matchedAgency || highestScore < 10) {
    matchedAgency = AGENCIES_DATABASE.find(a => a.jurisdictionId === jurisdictionId) || AGENCIES_DATABASE[0];
  } else {
    jurisdictionId = matchedAgency.jurisdictionId;
  }

  const statute = getStatuteForJurisdiction(jurisdictionId);

  // 3. Extract Dates & Temporal Bounds
  let dateStart = '2023-01-01';
  let dateEnd = new Date().toISOString().split('T')[0];

  // Regex patterns for years and dates
  const yearMatches = prompt.match(/\b(20\d\d)\b/g);
  if (yearMatches && yearMatches.length > 0) {
    const sortedYears = [...yearMatches].map(Number).sort();
    if (sortedYears.length === 1) {
      dateStart = `${sortedYears[0]}-01-01`;
      dateEnd = `${sortedYears[0]}-12-31`;
    } else {
      dateStart = `${sortedYears[0]}-01-01`;
      dateEnd = `${sortedYears[sortedYears.length - 1]}-12-31`;
    }
  }

  if (lower.includes('last 2 years') || lower.includes('past two years') || lower.includes('past 2 years')) {
    const startYear = new Date().getFullYear() - 2;
    dateStart = `${startYear}-01-01`;
  } else if (lower.includes('last year') || lower.includes('past year')) {
    const startYear = new Date().getFullYear() - 1;
    dateStart = `${startYear}-01-01`;
  }

  // 4. Extract Record Formats
  const requestedFormats: RequestFormat[] = ['native_electronic', 'pdf_searchable'];
  if (lower.includes('csv') || lower.includes('excel') || lower.includes('spreadsheet') || lower.includes('dataset') || lower.includes('raw data') || lower.includes('tables')) {
    requestedFormats.push('csv_xlsx');
  }
  if (lower.includes('bodycam') || lower.includes('dashcam') || lower.includes('video') || lower.includes('audio') || lower.includes('footage') || lower.includes('recording') || lower.includes('cctv')) {
    requestedFormats.push('audio_video_raw');
  }
  if (lower.includes('email') || lower.includes('messages') || lower.includes('communications') || lower.includes('threads') || lower.includes('inbox') || lower.includes('correspondence')) {
    requestedFormats.push('email_eml_msg');
  }

  // 5. Extract Keywords for Boolean Search
  const extractedKeywords: string[] = [];
  const keywordCandidates = prompt
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !['request', 'records', 'department', 'police', 'office', 'agency', 'between', 'present', 'regarding', 'about', 'from', 'with', 'state', 'public', 'information'].includes(word.toLowerCase()));

  // Extract distinct meaningful terms or phrases
  const uniqueWords = Array.from(new Set(keywordCandidates)).slice(0, 6);
  extractedKeywords.push(...uniqueWords);

  // 6. Extract Target Custodians
  const targetCustodians: string[] = [];
  if (lower.includes('mayor')) targetCustodians.push('Office of the Mayor / Chief of Staff');
  if (lower.includes('chief') || lower.includes('commissioner')) targetCustodians.push('Chief of Police / Department Commissioner');
  if (lower.includes('administrator') || lower.includes('director')) targetCustodians.push('Agency Administrator & Division Directors');
  if (lower.includes('council')) targetCustodians.push('City Council Members & Legislative Aides');
  if (targetCustodians.length === 0) {
    targetCustodians.push(`${matchedAgency.name} Custodian of Records & Senior Leadership`);
  }

  // 7. Extract Subject Matter & Clean Topic
  let subjectMatter = p;
  // Clean prefix if user typed "Austin Police Department: Request all..."
  if (subjectMatter.includes(':')) {
    const parts = subjectMatter.split(':');
    if (parts[1] && parts[1].trim().length > 10) {
      subjectMatter = parts.slice(1).join(':').trim();
    }
  }

  // 8. Determine Fee Waiver & Expedited Grounds
  const isPublicInterest = lower.includes('police') || lower.includes('chemical') || lower.includes('safety') || lower.includes('contract') || lower.includes('spending') || lower.includes('toxic') || lower.includes('environmental') || lower.includes('investigation') || lower.includes('misconduct') || lower.includes('budget') || lower.includes('subsid');
  const isUrgentSafety = lower.includes('bodycam') || lower.includes('shooting') || lower.includes('protest') || lower.includes('spill') || lower.includes('emergency') || lower.includes('contaminat');

  const feeWaiverJustification = isPublicInterest
    ? `The requested records concern matters of significant public interest and government accountability regarding ${extractedKeywords.slice(0, 3).join(', ') || 'public expenditure and administrative decisions'}. The information will be disseminated to the public at large and will not be used for commercial benefit.`
    : 'Disclosure is in the public interest to shed light on government operations without commercial motive.';

  const expeditedGrounds = isUrgentSafety
    ? `There is an imminent threat to public safety, individual due process rights, and urgent public interest in ongoing events requiring immediate transparency without standard administrative delays.`
    : '';

  // 9. Multi-agency Fan-out suggestions
  const fanOutAgencies: AgencyContact[] = [];
  if (matchedAgency.departmentCategory === 'law_enforcement') {
    // Add state DOJ or FBI if not already matched
    const extra = AGENCIES_DATABASE.filter(a => a.id !== matchedAgency?.id && (a.departmentCategory === 'law_enforcement' || a.id === 'fed-doj-crm')).slice(0, 2);
    fanOutAgencies.push(...extra);
  } else if (matchedAgency.departmentCategory === 'environmental') {
    const extra = AGENCIES_DATABASE.filter(a => a.id !== matchedAgency?.id && (a.departmentCategory === 'environmental' || a.id === 'fed-epa')).slice(0, 2);
    fanOutAgencies.push(...extra);
  }

  return {
    subjectMatter,
    agencyId: matchedAgency.id,
    agencyName: matchedAgency.name,
    agencyEmail: matchedAgency.foiaEmail,
    agencyPortalUrl: matchedAgency.portalUrl,
    jurisdictionId,
    statuteCitation: statute.citation,
    statuteName: statute.name,
    dateStart,
    dateEnd,
    keywords: extractedKeywords,
    targetCustodians,
    recordCategories: [
      'Invoices & Contracts',
      'Internal Email & Correspondence',
      'Incident Reports & Logs',
      'Electronic Datasets'
    ],
    requestedFormats,
    feeCategory: 'news_media',
    feeLimitMax: 50,
    feeWaiverRequested: true,
    feeWaiverJustification,
    expeditedProcessingRequested: isUrgentSafety,
    expeditedProcessingGrounds: expeditedGrounds,
    preemptiveClauses: {
      segregability: true,
      electronicFormatMandate: true,
      metadataPreservation: true,
      searchKeywordCertification: true,
      destructionHoldNotice: true
    },
    fanOutAgencies
  };
}
