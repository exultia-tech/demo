import { PresetQuery } from '@/types/foia';

export const PRESET_QUERIES: PresetQuery[] = [
  {
    id: 'preset-police-bodycam',
    title: 'Police Bodycam & Incident Records',
    category: 'Police Oversight',
    iconName: 'ShieldAlert',
    suggestedJurisdiction: 'TX',
    prompt: 'Austin Police Department: Request all officer body-worn camera footage, dashcam footage, and incident CAD dispatch logs related to the downtown public assembly on 6th Street between March 15, 2024 and March 18, 2024.',
    description: 'Procures uncompressed bodycam video, dispatch CAD audio, and shift supervisor incident reports with redaction justification mandates.'
  },
  {
    id: 'preset-epa-forever-chemicals',
    title: 'EPA PFAS / Forever Chemicals Water Audits',
    category: 'Environmental & Toxic',
    iconName: 'Droplet',
    suggestedJurisdiction: 'US_FED',
    prompt: 'Environmental Protection Agency: All groundwater contamination test reports, chemical sampling data in raw CSV format, and internal memos regarding PFAS/PFOA compliance in Michigan industrial facilities from Jan 2023 to present.',
    description: 'Requests raw scientific laboratory testing tables (.csv/.xlsx), enforcement warning letters, and executive remediation plans.'
  },
  {
    id: 'preset-ai-procurement',
    title: 'Municipal AI & Facial Recognition Tech Contracts',
    category: 'Government Tech & AI',
    iconName: 'Cpu',
    suggestedJurisdiction: 'CA',
    prompt: 'Los Angeles Police Department: Request all software licensing contracts, procurement purchase orders, algorithmic impact assessments, and vendor communications regarding automated facial recognition and predictive policing tools signed between Jan 2022 and Dec 2024.',
    description: 'Obtains vendor invoices, master service agreements (MSAs), algorithmic error-rate audits, and data retention policies.'
  },
  {
    id: 'preset-corporate-subsidies',
    title: 'City Economic Development Tax Subsidies & NDAs',
    category: 'Budgets & Procurement',
    iconName: 'Building2',
    suggestedJurisdiction: 'FL',
    prompt: 'Miami-Dade County: All non-disclosure agreements (NDAs), property tax abatement agreements, and job-creation compliance audit reports with private commercial real estate developers for fiscal years 2022 through 2024.',
    description: 'Uncovers tax abatements, clawback enforcement provisions, municipal bond guarantees, and secret commercial incentive packages.'
  },
  {
    id: 'preset-mayor-travel',
    title: 'Mayoral Private Jet & Executive Travel Expenditures',
    category: 'Executive Accountability',
    iconName: 'PlaneTakeoff',
    suggestedJurisdiction: 'NY',
    prompt: 'Office of the Mayor of New York City: All itemized flight invoices, hotel receipts, security detail per-diem vouchers, and executive calendar entries for out-of-state and international official travel conducted between July 1, 2023 and June 30, 2024.',
    description: 'Extracts itemized expense reports, credit card merchant statements, flight manifests, and calendar schedules.'
  },
  {
    id: 'preset-sec-crypto',
    title: 'SEC Cryptocurrency Enforcement Internal Guidelines',
    category: 'Executive Accountability',
    iconName: 'Coins',
    suggestedJurisdiction: 'US_FED',
    prompt: 'Securities and Exchange Commission: Internal staff bulletins, formal guidance memoranda, and formal meeting minutes between senior SEC Division of Enforcement personnel and third-party digital asset custody providers regarding Howey Test staking classifications from 2023 to 2024.',
    description: 'Discovers regulatory interpretation emails, staff legal guidance, and external stakeholder meeting minutes.'
  }
];
