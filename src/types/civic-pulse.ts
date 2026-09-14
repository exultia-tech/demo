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

export interface AgendaItemDetail {
  itemNumber?: string;
  title: string;
  category?: string;
  actionTaken?: string;
  attachments?: { label: string; url: string }[];
}

export interface ProceduralPhaseItem {
  phase: 'Call to Order' | 'Ceremonial' | 'Public Hearing' | 'Consent Agenda' | 'Regular Agenda' | 'Executive Session' | 'Adjournment';
  title: string;
  description?: string;
  actionTaken?: string;
  financialAmount?: string;
  attachments?: { label: string; url: string }[];
  vote?: { ayes: number; nays: number; status: 'Passed' | 'Failed' | 'Tabled' };
}

export interface FormattedMinutes {
  sessionType: string;
  presidingOfficer?: string;
  rollCallAttendance?: {
    officialsPresent: string[];
    officialsAbsent?: string[];
  };
  executiveSummary: {
    keyActions: string[];
    financialAuthorizations?: string[];
    ordinancesEnacted?: string[];
    appointmentsConfirmed?: string[];
    variancesConsidered?: string[];
  };
  proceduralTimeline: ProceduralPhaseItem[];
  publicCommentPeriod?: {
    summary: string;
    topicsCovered: string[];
  };
  markdownTranscript: string;
  clerkAttestation?: {
    clerkName: string;
    certifiedAt: string;
  };
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
  agendaItems?: AgendaItemDetail[];
  formattedMinutes?: FormattedMinutes;
  fullProceedingsText?: string;
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
