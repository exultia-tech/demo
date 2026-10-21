export type ComplianceStandardId = 
  | 'nist-800-53'
  | 'iso-27001'
  | 'soc-2'
  | 'pci-dss'
  | 'hipaa'
  | 'sox-itgc'
  | 'gdpr'
  | 'cmmc';

export type ComplianceDomainId = 
  | 'iam'              // Identity, Authentication & Access Control
  | 'devsecops'        // Secure Software Development & CI/CD Pipelines
  | 'secops'           // Infrastructure, Cloud & Operating System Hardening
  | 'workstation'      // Workstation & Endpoint Governance
  | 'cryptography'     // Data Protection, Privacy & Encryption
  | 'logging'          // Audit Logging, SIEM & Threat Monitoring
  | 'incident-resp'    // Incident Response, Business Continuity & DR
  | 'vendor-risk';     // Vendor & Third-Party Risk Management

export type AuditStatus = 'ready' | 'in_progress' | 'gap' | 'not_applicable';

export interface AuditChecklistItem {
  id: string; // e.g. "CTRL-IAM-01", "CTRL-DEV-02"
  title: string;
  domain: ComplianceDomainId;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  
  // The User's Core Pain Point Solved:
  plainEnglishRequirement: string; // Plain-English, no BS instruction
  auditorQuestion: string; // What the auditor will literally ask you in the interview
  whyItMatters: string; // The real practical breach / operational risk
  
  // Cross-Framework Mapping Matrix
  mappings: {
    nist80053: string; // e.g. "AC-2, IA-2(1), IA-2(2)"
    iso27001: string;  // e.g. "A.5.15, A.8.5"
    soc2: string;      // e.g. "CC6.1, CC6.2, CC6.6"
    pciDss: string;    // e.g. "Req 8.3.1, Req 8.3.6"
    hipaa: string;     // e.g. "164.312(a)(2)(i), 164.312(d)"
    soxItgc: string;   // e.g. "AC-01 (Logical Access to Financial DBs)"
    gdpr: string;      // e.g. "Article 32(1)(b) Confidentiality"
    cmmc: string;      // e.g. "IA.L2-3.5.3 (MFA for Privileged Access)"
  };
  
  // Technical Configuration Blueprint (How to actually configure it)
  implementationGuide: {
    cloudAwsGcpAzure: string;
    gitAndCiCd: string;
    osAndContainers: string;
    endpointWorkstation: string;
  };
  
  // Evidence Artifacts (What to hand the auditor)
  evidenceArtifacts: string[]; // Specific files/screenshots/reports to export
  sampleCliVerification: string; // CLI command to run to prove compliance
  remediationSlaDays: number; // Max days to fix a finding
}

export interface ComplianceFrameworkMeta {
  id: ComplianceStandardId;
  name: string;
  shortName: string;
  version: string;
  governingBody: string;
  scopeSummary: string;
  color: string;
  accentBg: string;
  borderColor: string;
  penaltyRisk: string;
  auditFrequency: string;
  totalControlsAnalyzed: number;
}

export interface ComplianceDomainMeta {
  id: ComplianceDomainId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  color: string;
}
