export type MunicipalDocumentType = 
  | 'council_minutes'
  | 'agenda_packet'
  | 'ordinance_resolution'
  | 'planning_zoning'
  | 'budget_hearing'
  | 'police_oversight'
  | 'public_notice';

export interface RollCallVote {
  officialName: string;
  title: string;
  vote: 'AYE' | 'NAY' | 'ABSTAIN' | 'ABSENT';
}

export interface MunicipalMeetingRecord {
  id: string;
  city: string;
  state: string;
  governingBody: string; // e.g. "Austin City Council", "Scranton Planning Commission"
  meetingDate: string; // ISO date or formatted
  documentType: MunicipalDocumentType;
  title: string;
  itemNumber: string; // e.g. "Item 42", "Resolution 2026-0814"
  summary: string;
  outcome: 'PASSED' | 'FAILED' | 'TABLED' | 'AMENDED' | 'PUBLIC_COMMENT' | 'AGENDA_POSTED' | 'MINUTES_APPROVED';
  voteTally?: {
    ayes: number;
    nays: number;
    abstentions: number;
    rollCall: RollCallVote[];
  };
  sourcePortal: {
    vendor: 'Legistar' | 'Granicus' | 'CivicPlus' | 'Laserfiche' | 'PrimeGov' | 'Municipal Direct';
    portalUrl: string;
    directPdfUrl: string;
    scannedDocConfidence: number; // 0-100
  };
  verbatimExcerpt: string;
  videoTimestampSeconds?: number;
}

export interface RetrievalStep {
  step: string;
  status: 'pending' | 'running' | 'completed' | 'warning';
  detail: string;
}

export interface CivicDeskTicket {
  ticketId: string;
  createdAt: string;
  city: string;
  state: string;
  query: string;
  requesterEmail: string;
  customPortalUrl?: string;
  status: 'dispatched_to_researcher' | 'in_progress' | 'resolved';
  estimatedHours: number;
  reasonForEscalation: string;
  humanSpecialistAssigned: string;
}
