export type JurisdictionType = 'federal' | 'state' | 'municipal' | 'county';

export type FeeCategory = 'news_media' | 'educational_scientific' | 'non_commercial_public_interest' | 'commercial' | 'individual';

export type RequestFormat = 'native_electronic' | 'csv_xlsx' | 'pdf_searchable' | 'audio_video_raw' | 'email_eml_msg' | 'any_electronic';

export type CaseStatus = 
  | 'draft'
  | 'submitted'
  | 'acknowledged'
  | 'in_review'
  | 'fee_estimate_received'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'denied'
  | 'appealed'
  | 'overdue';

export interface StatuteInfo {
  id: string; // e.g. 'US_FED', 'TX', 'CA', 'FL', 'NY'
  name: string; // e.g. 'Freedom of Information Act', 'California Public Records Act'
  shortCode: string; // e.g. 'FOIA', 'CPRA', 'TPIA', 'FL-Sunshine', 'FOIL'
  stateOrFederal: string; // 'Federal' or state name 'California'
  citation: string; // e.g. '5 U.S.C. § 552'
  responseDays: number; // e.g. 20
  dayType: 'business' | 'calendar';
  statutoryFeeWaiverClause: string;
  segregabilityMandate: string;
  administrativeAppealDeadlineDays: number;
  appealAuthority: string;
  notes?: string;
}

export interface AgencyContact {
  id: string;
  name: string;
  acronym?: string;
  jurisdictionId: string;
  jurisdictionType: JurisdictionType;
  departmentCategory: 'law_enforcement' | 'environmental' | 'procurement_finance' | 'executive' | 'education' | 'health_human_services' | 'regulatory' | 'transportation' | 'general';
  custodianTitle: string;
  foiaEmail: string;
  portalUrl?: string;
  portalType?: 'NextRequest' | 'GovQA' | 'FOIAonline' | 'FOIA.gov' | 'JustFOIA' | 'Custom';
  physicalAddress: string;
  phone?: string;
  verified: boolean;
}

export interface StructuredRequestParams {
  subjectMatter: string;
  agencyId: string;
  agencyName: string;
  agencyEmail: string;
  agencyPortalUrl?: string;
  jurisdictionId: string;
  statuteCitation: string;
  statuteName: string;
  dateStart: string;
  dateEnd: string;
  keywords: string[];
  targetCustodians: string[];
  recordCategories: string[];
  requestedFormats: RequestFormat[];
  feeCategory: FeeCategory;
  feeLimitMax: number;
  feeWaiverRequested: boolean;
  feeWaiverJustification: string;
  expeditedProcessingRequested: boolean;
  expeditedProcessingGrounds: string;
  preemptiveClauses: {
    segregability: boolean;
    electronicFormatMandate: boolean;
    metadataPreservation: boolean;
    searchKeywordCertification: boolean;
    destructionHoldNotice: boolean;
  };
  fanOutAgencies?: AgencyContact[];
}

export interface FilingCase {
  id: string; // Tracking number, e.g. 'REC-2026-88129'
  createdAt: string;
  submittedAt?: string;
  statutoryDeadline: string;
  status: CaseStatus;
  userPrompt: string;
  params: StructuredRequestParams;
  generatedLetterText: string;
  sha256Fingerprint: string;
  requesterInfo: RequesterProfile;
  notes: string;
  historyLogs: {
    timestamp: string;
    action: string;
    details: string;
  }[];
  agencyResponseNotes?: string;
  denialExemptionsCited?: string[];
  appealLetterText?: string;
}

export interface RequesterProfile {
  fullName: string;
  organization?: string;
  title?: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  defaultFeeCategory: FeeCategory;
  defaultFeeLimit: number;
}

export interface PresetQuery {
  id: string;
  title: string;
  category: 'Police Oversight' | 'Environmental & Toxic' | 'Government Tech & AI' | 'Budgets & Procurement' | 'Executive Accountability' | 'Education & Research';
  iconName: string;
  prompt: string;
  description: string;
  suggestedJurisdiction: string;
}

export interface ResponseAnalysisResult {
  detectedStatus: 'denial' | 'fee_estimate' | 'delay_extension' | 'acknowledgment' | 'records_delivered' | 'unknown';
  citedExemptions: {
    code: string;
    description: string;
    vulnerabilityAssessment: string;
    counterArgument: string;
  }[];
  statutoryDefectsFound: string[];
  recommendedAction: string;
  appealDraft: string;
}
