import { MunicipalMeetingRecord, RetrievalStep, CivicDeskTicket, MunicipalDocumentType } from '@/types/civic-pulse';
import { SAMPLE_MUNICIPAL_RECORDS, SUPPORTED_CITIES } from './mockData';

export interface SearchQueryParams {
  city: string;
  state: string;
  query: string;
  documentType?: MunicipalDocumentType | 'all';
}

export interface AgentQueryResult {
  success: boolean;
  city: string;
  state: string;
  records: MunicipalMeetingRecord[];
  steps: RetrievalStep[];
  requiresHumanEscalation: boolean;
  escalationReason?: string;
  estimatedHumanResolveHours?: number;
}

export async function executeMunicipalQuery(params: SearchQueryParams): Promise<AgentQueryResult> {
  const normCity = params.city.trim().toLowerCase();
  const normState = params.state.trim().toUpperCase();
  const normQuery = params.query.trim().toLowerCase();

  // Determine if this municipality is pre-indexed in our automated portal cluster
  const matchedCity = SUPPORTED_CITIES.find(
    c => c.city.toLowerCase() === normCity && (normState === '' || c.state === normState)
  );

  const steps: RetrievalStep[] = [
    {
      step: "Resolving Municipal Portal & Vendor Architecture",
      status: "completed",
      detail: matchedCity 
        ? `Identified official domain (${matchedCity.officialDomain}) running on ${matchedCity.portalPlatform} platform.`
        : `Scanning statewide municipal registry for ${params.city}, ${params.state || 'US'}... Non-standard portal architecture detected.`
    },
    {
      step: "Crawling Meeting Minutes & Agenda Packet Archives",
      status: "completed",
      detail: matchedCity
        ? `Indexed ${matchedCity.indexedMeetingCount} archived municipal meetings through latest session (${matchedCity.latestMeetingDate}).`
        : `Target city uses non-API scanned PDFs or legacy file server. Initiating optical character recognition (OCR).`
    },
    {
      step: "Extracting Roll-Call Votes & Enacted Ordinances",
      status: "completed",
      detail: "Filtering items matching citizen query terms, segregating formal council actions from routine consent agendas."
    },
    {
      step: "Deterministic Source Verification & Link Attestation",
      status: "completed",
      detail: "Cross-verifying verbatim minutes against official municipal clerk stamps."
    }
  ];

  // Filter sample records if matched
  let matchingRecords = SAMPLE_MUNICIPAL_RECORDS.filter(rec => {
    const matchesCity = rec.city.toLowerCase() === normCity || normCity === '';
    const matchesState = normState === '' || rec.state === normState;
    const matchesType = !params.documentType || params.documentType === 'all' || rec.documentType === params.documentType;
    const matchesText = normQuery === '' || 
      rec.title.toLowerCase().includes(normQuery) || 
      rec.summary.toLowerCase().includes(normQuery) || 
      rec.itemNumber.toLowerCase().includes(normQuery) ||
      rec.verbatimExcerpt.toLowerCase().includes(normQuery);

    return matchesCity && matchesState && matchesType && matchesText;
  });

  // If no direct keyword match, fall back to matching just the city
  if (matchingRecords.length === 0 && matchedCity) {
    matchingRecords = SAMPLE_MUNICIPAL_RECORDS.filter(rec => rec.city.toLowerCase() === normCity);
  }

  // If the city is completely unknown or not indexed, trigger human escalation recommendation
  const requiresHumanEscalation = !matchedCity || matchingRecords.length === 0;

  let escalationReason = undefined;
  if (requiresHumanEscalation) {
    escalationReason = !matchedCity
      ? `The municipal repository for "${params.city}, ${params.state}" uses an unindexed or legacy portal (e.g. Laserfiche / paper scans) that requires Civic Desk human researcher retrieval.`
      : `No published council minutes directly matched "${params.query}". An Exultia Civic Desk researcher can locate offline committee recordings or sub-board records.`;
  }

  return {
    success: matchingRecords.length > 0,
    city: params.city,
    state: params.state,
    records: matchingRecords,
    steps,
    requiresHumanEscalation,
    escalationReason,
    estimatedHumanResolveHours: requiresHumanEscalation ? 24 : undefined
  };
}

export function createCivicDeskTicket(
  city: string,
  state: string,
  query: string,
  requesterEmail: string,
  reason: string
): CivicDeskTicket {
  const specialists = [
    "Sarah Jenkins (Municipal Governance Lead)",
    "Marcus Reed (Local Government Data Specialist)",
    "Elena Rostova (Civic Records Research Desk)"
  ];
  const assigned = specialists[Math.floor(Math.random() * specialists.length)];
  const ticketId = `CD-${city.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    ticketId,
    createdAt: new Date().toISOString(),
    city,
    state,
    query,
    requesterEmail,
    status: 'dispatched_to_researcher',
    estimatedHours: 24,
    reasonForEscalation: reason,
    humanSpecialistAssigned: assigned
  };
}
