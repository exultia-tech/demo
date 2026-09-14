import { MunicipalMeetingRecord } from '@/types/civic-pulse';

export interface CityCoverageInfo {
  city: string;
  state: string;
  portalPlatform: 'Legistar' | 'Granicus' | 'CivicPlus' | 'Laserfiche' | 'PrimeGov';
  officialDomain: string;
  indexedMeetingCount: number;
  latestMeetingDate: string;
  liveFeedAvailable: boolean;
}

export const SUPPORTED_CITIES: CityCoverageInfo[] = [
  {
    city: "Austin",
    state: "TX",
    portalPlatform: "Legistar",
    officialDomain: "austintexas.gov",
    indexedMeetingCount: 3420,
    latestMeetingDate: "2026-09-10",
    liveFeedAvailable: true
  },
  {
    city: "Chicago",
    state: "IL",
    portalPlatform: "Legistar",
    officialDomain: "chicago.gov",
    indexedMeetingCount: 6810,
    latestMeetingDate: "2026-09-09",
    liveFeedAvailable: true
  },
  {
    city: "Denver",
    state: "CO",
    portalPlatform: "Granicus",
    officialDomain: "denvergov.org",
    indexedMeetingCount: 2980,
    latestMeetingDate: "2026-09-08",
    liveFeedAvailable: true
  },
  {
    city: "Scranton",
    state: "PA",
    portalPlatform: "CivicPlus",
    officialDomain: "scrantonpa.gov",
    indexedMeetingCount: 1140,
    latestMeetingDate: "2026-09-03",
    liveFeedAvailable: false
  },
  {
    city: "Seattle",
    state: "WA",
    portalPlatform: "Legistar",
    officialDomain: "seattle.gov",
    indexedMeetingCount: 4210,
    latestMeetingDate: "2026-09-07",
    liveFeedAvailable: true
  },
  {
    city: "Miami",
    state: "FL",
    portalPlatform: "PrimeGov",
    officialDomain: "miamigov.com",
    indexedMeetingCount: 2450,
    latestMeetingDate: "2026-09-04",
    liveFeedAvailable: true
  }
];

export const SAMPLE_MUNICIPAL_RECORDS: MunicipalMeetingRecord[] = [
  {
    id: "ATX-2026-CC-849",
    city: "Austin",
    state: "TX",
    governingBody: "Austin City Council",
    meetingDate: "2026-08-27",
    documentType: "council_minutes",
    title: "Resolution on Municipal Water Infrastructure Expansion & Advanced Sensor Deployment",
    itemNumber: "Item 48 (Res. No. 20260827-048)",
    summary: "Authorized execution of a $14,200,000 capital contract for real-time acoustic leak detection sensors across the central municipal water grid. Public comment centered on ratepayer impact and subcontracting disclosure.",
    outcome: "PASSED",
    voteTally: {
      ayes: 9,
      nays: 2,
      abstentions: 0,
      rollCall: [
        { officialName: "Mayor Watson", title: "Mayor", vote: "AYE" },
        { officialName: "Council Member Alter", title: "District 10", vote: "AYE" },
        { officialName: "Council Member Kelly", title: "District 6", vote: "NAY" },
        { officialName: "Council Member Fuentes", title: "District 2", vote: "AYE" },
        { officialName: "Council Member Vela", title: "District 4", vote: "AYE" },
        { officialName: "Council Member Pool", title: "District 7", vote: "AYE" },
        { officialName: "Council Member Ellis", title: "District 8", vote: "AYE" },
        { officialName: "Council Member Qadri", title: "District 9", vote: "AYE" },
        { officialName: "Council Member Ryan", title: "District 5", vote: "NAY" },
        { officialName: "Council Member Harper-Madison", title: "District 1", vote: "AYE" },
        { officialName: "Council Member Alison", title: "District 3", vote: "AYE" }
      ]
    },
    sourcePortal: {
      vendor: "Legistar",
      portalUrl: "https://austin.siretechnologies.com/legistar/Detail.aspx?ID=20260827-048",
      directPdfUrl: "https://austintexas.gov/edims/document.cfm?id=438920",
      scannedDocConfidence: 99.4
    },
    verbatimExcerpt: "Motion made by Council Member Vela, seconded by Council Member Fuentes, to approve Resolution 20260827-048. Mayor Watson called for the vote. The motion carried on a 9-2 vote with Council Members Kelly and Ryan voting nay. Staff directed to submit quarterly deployment telemetry to the Water Oversight Commission.",
    videoTimestampSeconds: 4320
  },
  {
    id: "CHI-2026-CC-1120",
    city: "Chicago",
    state: "IL",
    governingBody: "Chicago City Council (Committee on Public Safety)",
    meetingDate: "2026-07-22",
    documentType: "council_minutes",
    title: "Ordinance Regulating Automated License Plate Reader (ALPR) Retention & Audit Logs",
    itemNumber: "Ordinance O2026-3819",
    summary: "Mandates 30-day purge requirement for non-hit automated license plate scans and establishes quarterly public reporting to the Community Commission for Public Safety and Accountability.",
    outcome: "PASSED",
    voteTally: {
      ayes: 38,
      nays: 10,
      abstentions: 2,
      rollCall: [
        { officialName: "Alderman Rodriguez", title: "22nd Ward", vote: "AYE" },
        { officialName: "Alderman Hopkins", title: "2nd Ward", vote: "NAY" },
        { officialName: "Alderman Dowell", title: "3rd Ward", vote: "AYE" },
        { officialName: "Alderman Reilly", title: "42nd Ward", vote: "NAY" },
        { officialName: "Alderman Sigcho-Lopez", title: "25th Ward", vote: "AYE" }
      ]
    },
    sourcePortal: {
      vendor: "Legistar",
      portalUrl: "https://chicago.legistar.com/LegislationDetail.aspx?ID=6831092&GUID=O2026-3819",
      directPdfUrl: "https://chicago.legistar.com/View.ashx?M=F&ID=12938102&GUID=O2026-3819-PDF",
      scannedDocConfidence: 98.8
    },
    verbatimExcerpt: "BE IT ORDAINED BY THE CITY COUNCIL OF THE CITY OF CHICAGO: Section 2-84-180 is amended to mandate that any photographic capture or license plate record that does not match an active stolen vehicle or felony warrant alert must be expunged from all primary and secondary databases within thirty (30) calendar days.",
    videoTimestampSeconds: 7890
  },
  {
    id: "DEN-2026-PZ-402",
    city: "Denver",
    state: "CO",
    governingBody: "Denver Planning Board & Land Use Committee",
    meetingDate: "2026-08-14",
    documentType: "planning_zoning",
    title: "Zoning Variance for Transit-Oriented Mixed-Income Development (Colfax Corridor)",
    itemNumber: "Application 2026-Z-089",
    summary: "Approved height variance from 5 stories to 8 stories in exchange for 30% permanently deed-restricted affordable housing units at or below 60% Area Median Income (AMI).",
    outcome: "PASSED",
    voteTally: {
      ayes: 8,
      nays: 1,
      abstentions: 0,
      rollCall: [
        { officialName: "Chairwoman Martinez", title: "Board Chair", vote: "AYE" },
        { officialName: "Commissioner Thorne", title: "Vice Chair", vote: "AYE" },
        { officialName: "Commissioner Vance", title: "Member", vote: "NAY" },
        { officialName: "Commissioner Chen", title: "Member", vote: "AYE" }
      ]
    },
    sourcePortal: {
      vendor: "Granicus",
      portalUrl: "https://denver.granicus.com/GeneratedAgendaViewer.php?view_id=14&event_id=9812",
      directPdfUrl: "https://denvergov.org/files/assets/public/v/1/planning/documents/2026-Z-089-variance.pdf",
      scannedDocConfidence: 96.5
    },
    verbatimExcerpt: "The Board finds that the proposed transit-oriented overlay satisfies Chapter 59 of the Revised Municipal Code, provided that the applicant executes the binding affordability covenant prior to the issuance of the foundation permit.",
    videoTimestampSeconds: 3120
  },
  {
    id: "SCR-2026-CC-194",
    city: "Scranton",
    state: "PA",
    governingBody: "Scranton City Council",
    meetingDate: "2026-06-18",
    documentType: "budget_hearing",
    title: "Ordinance Approving Paving Program Sub-Contracts & Sidewalk ADA Upgrades",
    itemNumber: "File of Council No. 42, 2026",
    summary: "Authorized release of $3,100,000 in liquid fuels funding for 24 lane miles of resurfacing in South Scranton and East Mountain, incorporating federally mandated ADA tactile curb cutouts.",
    outcome: "PASSED",
    voteTally: {
      ayes: 5,
      nays: 0,
      abstentions: 0,
      rollCall: [
        { officialName: "Council President Gaughan", title: "Council President", vote: "AYE" },
        { officialName: "Council Vice President King", title: "Vice President", vote: "AYE" },
        { officialName: "Councilman Schuster", title: "Member", vote: "AYE" },
        { officialName: "Councilman Rothchild", title: "Member", vote: "AYE" },
        { officialName: "Councilwoman McAndrew", title: "Member", vote: "AYE" }
      ]
    },
    sourcePortal: {
      vendor: "CivicPlus",
      portalUrl: "https://scrantonpa.gov/agendacenter/viewfile/minutes/_06182026-441",
      directPdfUrl: "https://scrantonpa.gov/documents/city-council/minutes/2026-06-18-minutes-official.pdf",
      scannedDocConfidence: 97.2
    },
    verbatimExcerpt: "Motion to adopt File of Council No. 42 by Councilman Schuster, seconded by Councilwoman McAndrew. On roll call: Mrs. McAndrew, Yes; Mr. Rothchild, Yes; Mr. Schuster, Yes; Mr. King, Yes; Mr. Gaughan, Yes. The ordinance is hereby adopted.",
    videoTimestampSeconds: 2450
  }
];
