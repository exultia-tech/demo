import { 
  FrameworkPillar, 
  ControlSpecification, 
  CrossWalkItem, 
  RolloutPhase, 
  GovernanceFrameworkMeta 
} from '@/types/governance';

export const ALPR_PILLARS: FrameworkPillar[] = [
  {
    code: 'AC',
    number: 1,
    name: 'Access Control & Identity Governance',
    shortName: 'Access Control',
    description: 'Need-to-know access enforcement, structured incident justification, and multi-factor authentication.',
    color: '#3B82F6',
    accentBg: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    iconName: 'ShieldCheck',
    controlsCount: 4
  },
  {
    code: 'DG',
    number: 2,
    name: 'Data Governance & Lifecycle Management',
    shortName: 'Data Lifecycle',
    description: 'Data minimization, 30-day default purge caps, evidentiary hold controls, and non-LE bans.',
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    iconName: 'Database',
    controlsCount: 4
  },
  {
    code: 'NA',
    number: 3,
    name: 'Network Architecture & Third-Party Integration',
    shortName: 'Network Architecture',
    description: 'Vendor isolation, non-transitive sharing MOUs, cloud tenant segregation, and TLS 1.3 / AES-256 encryption.',
    color: '#8B5CF6',
    accentBg: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    iconName: 'Network',
    controlsCount: 3
  },
  {
    code: 'AU',
    number: 4,
    name: 'Auditability & Algorithmic Oversight',
    shortName: 'Audit & Oversight',
    description: 'Immutable WORM query logging, off-shift search anomaly detection, and civilian compliance audits.',
    color: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    iconName: 'FileCheck',
    controlsCount: 3
  },
  {
    code: 'PT',
    number: 5,
    name: 'Public Transparency & Civilian Oversight',
    shortName: 'Public Transparency',
    description: 'Public open metric dashboards, transparency policy portals, and machine-readable open records readiness.',
    color: '#06B6D4',
    accentBg: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    iconName: 'Eye',
    controlsCount: 3
  },
  {
    code: 'PS',
    number: 6,
    name: 'Physical & Structural Safety',
    shortName: 'Physical & Clear-Zone',
    description: 'Roadway clear-zone compliance, AASHTO MASH breakaway poles, wind-load ratings, and co-location standards.',
    color: '#EC4899',
    accentBg: 'rgba(236, 72, 153, 0.12)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    iconName: 'AlertTriangle',
    controlsCount: 9
  },
  {
    code: 'LE',
    number: 7,
    name: 'Legal & Statutory Compliance',
    shortName: 'Statutory Compliance',
    description: 'Federal DPPA compliance, state purge mandates, cross-border geofencing, and commercial network gates.',
    color: '#E11D48',
    accentBg: 'rgba(225, 29, 72, 0.12)',
    borderColor: 'rgba(225, 29, 72, 0.3)',
    iconName: 'Scale',
    controlsCount: 8
  },
  {
    code: 'PR',
    number: 8,
    name: 'Public Records & Open Data Disclosure Boundaries',
    shortName: 'Open Records & FOIA',
    description: 'Public disclosure boundaries, bulk scan redaction, and officer accountability pseudonymization.',
    color: '#14B8A6',
    accentBg: 'rgba(20, 184, 166, 0.12)',
    borderColor: 'rgba(20, 184, 166, 0.3)',
    iconName: 'FileText',
    controlsCount: 1
  }
];

export const ALPR_CONTROLS: ControlSpecification[] = [
  // PILLAR 1: ACCESS CONTROL & IDENTITY GOVERNANCE (AC)
  {
    id: 'AC-01',
    pillarCode: 'AC',
    title: 'Justification Enforcement',
    requirementLevel: 'MUST',
    statement: 'Systems MUST require a mandatory, structured justification field (e.g., active CAD/RMS incident number) before executing any search query. Free-text fields alone are non-compliant.',
    detailedNotes: [
      'The CAD/RMS case number must be verified against the local agency records management API when connected.',
      'Search engines must reject blank, generic (e.g. "investigation", "patrol"), or purely free-text justifications.'
    ],
    crossWalk: {
      nist: 'AC-3, AC-6',
      iso: 'A.8.3, A.8.5',
      cjis: 'Area 5.5 (Access Control)',
      statutory: 'VA HB 2724 / CJIS 5.5'
    }
  },
  {
    id: 'AC-02',
    pillarCode: 'AC',
    title: 'Role-Based Access Control (RBAC)',
    requirementLevel: 'MANDATORY',
    statement: 'Separation of duties between System Administrators (who manage users and system rules but cannot query historical data) and Investigators (who query data but cannot alter retention rules).',
    detailedNotes: [
      'No single administrative credential may possess both raw plate querying privileges and retention/audit purge configuration privileges.',
      'Auditors and civilian oversight boards have read-only access to anonymized metadata and query logs.'
    ],
    crossWalk: {
      nist: 'AC-2, AC-5',
      iso: 'A.5.15, A.5.18',
      cjis: 'Area 5.5 (Access Control)',
      statutory: 'NIST AC-5'
    }
  },
  {
    id: 'AC-03',
    pillarCode: 'AC',
    title: 'Multi-Factor Authentication (MFA)',
    requirementLevel: 'MANDATORY',
    statement: 'Mandatory MFA for all dashboard and API access, aligned with FBI CJIS Security Policy standards.',
    detailedNotes: [
      'Hardware tokens (FIDO2/WebAuthn) or cryptographic authenticator apps required. SMS-based OTP is prohibited.',
      'Session timeouts must terminate inactive sessions after 15 minutes of idle time.'
    ],
    crossWalk: {
      nist: 'IA-2',
      iso: 'A.8.5',
      cjis: 'Area 5.6 (Identification & Auth)',
      statutory: 'CJIS Policy Area 5.6'
    }
  },
  {
    id: 'AC-04',
    pillarCode: 'AC',
    title: 'Periodic Account Attestation',
    requirementLevel: 'REQUIRED',
    statement: 'Automated 90-day review cycles requiring agency administrators to re-certify active user accounts and offboard inactive credentials.',
    detailedNotes: [
      'Accounts inactive for 60 consecutive days must be automatically disabled pending supervisor re-authorization.',
      'Separation from agency service triggers real-time credential revocation via SCIM/SSO integration.'
    ],
    crossWalk: {
      nist: 'AC-2(3)',
      iso: 'A.5.16',
      cjis: 'Area 5.5 (Access Control)',
      statutory: 'CJIS Area 5.5.1'
    }
  },

  // PILLAR 2: DATA GOVERNANCE & LIFECYCLE MANAGEMENT (DG)
  {
    id: 'DG-01',
    pillarCode: 'DG',
    title: 'Default Retention Cap (30-Day Auto-Purge)',
    requirementLevel: 'MUST',
    statement: 'Passive scan data MUST automatically hard-delete after 30 days (or the minimum statutory period), unless explicitly tagged as evidence in an active criminal investigation.',
    detailedNotes: [
      'Hard deletion requires cryptographic sanitization or complete database row unlinking and storage block overwriting.',
      'Data marked for deletion cannot be revived or retained in hidden vendor secondary caches.'
    ],
    crossWalk: {
      nist: 'MP-6, PT-2',
      iso: 'A.8.10, A.5.34',
      cjis: 'Area 5.11 (Media Protection)',
      statutory: 'OR HB 2186 / Me. Rev. Stat. 29-A'
    }
  },
  {
    id: 'DG-02',
    pillarCode: 'DG',
    title: 'Evidentiary Hold Controls',
    requirementLevel: 'MANDATORY',
    statement: 'Secondary supervisor or legal approval required to transfer a hit/scan into long-term evidentiary retention.',
    detailedNotes: [
      'Every evidentiary hold requires documented association with an active felony or misdemeanor criminal case file.',
      'Evidentiary holds must be reviewed annually to confirm ongoing trial, appeal, or statutory evidence retention necessity.'
    ],
    crossWalk: {
      nist: 'AU-10, MP-6',
      iso: 'A.8.10',
      cjis: 'Area 5.11 (Media Protection)',
      statutory: 'Fed. R. Crim. P. 16'
    }
  },
  {
    id: 'DG-03',
    pillarCode: 'DG',
    title: 'Hotlist Validation & Visual Confirmation',
    requirementLevel: 'MANDATORY',
    statement: 'Real-time hotlists (NCIC, stolen vehicles) must auto-sync and refresh to prevent field response on stale data. Mandatory visual/dispatcher confirmation required prior to enforcement action.',
    detailedNotes: [
      'Officers must visually confirm the license plate alphanumeric string and state of issuance prior to initiating a stop or drawing a weapon based solely on an automated ALPR alert.',
      'Hotlist entries must sync at minimum every 15 minutes with official state CJIS brokers.'
    ],
    crossWalk: {
      nist: 'SI-4, SI-10',
      iso: 'A.8.9',
      cjis: 'Area 5.10 (System & Comms)',
      statutory: 'NCIC / CJIS Guidelines'
    }
  },
  {
    id: 'DG-04',
    pillarCode: 'DG',
    title: 'Non-Law Enforcement Prohibition',
    requirementLevel: 'PROHIBITED',
    statement: 'Prohibition of data collection or querying for civil infractions, immigration enforcement, or municipal code violations unless explicitly authorized by ordinance.',
    detailedNotes: [
      'ALPR data shall not be accessed or supplied for parking debt collection, code enforcement inspections, or immigration status inquiries.',
      'System query interfaces must disable query access for civil infraction codes.'
    ],
    crossWalk: {
      nist: 'AC-3, PT-2',
      iso: 'A.5.34',
      cjis: 'Area 5.5 (Access Control)',
      statutory: 'Cal. Civ. Code § 1798.90.5'
    }
  },

  // PILLAR 3: NETWORK ARCHITECTURE & THIRD-PARTY INTEGRATION (NA)
  {
    id: 'NA-01',
    pillarCode: 'NA',
    title: 'Explicit Outbound Sharing Agreements',
    requirementLevel: 'MUST',
    statement: 'Mutual aid sharing controls MUST be opt-in, non-transitive (Agency A sharing with B does not allow B to pass A\'s data to C), and governed by a formal MOU.',
    detailedNotes: [
      'Automatic or global downstream syndication is strictly prohibited.',
      'Agencies must maintain an unredacted registry of all active peer agency data sharing relationships accessible to civilian oversight.'
    ],
    crossWalk: {
      nist: 'AC-21, SC-7',
      iso: 'A.5.21, A.8.20',
      cjis: 'Area 5.10 (System & Comms)',
      statutory: 'Cal. Civ. Code § 1798.90.5'
    }
  },
  {
    id: 'NA-02',
    pillarCode: 'NA',
    title: 'Vendor Isolation & 100% Customer Data Sovereignty',
    requirementLevel: 'MANDATORY',
    statement: 'Contractual guarantees that raw data, analytics, and metadata remain 100% deployer property, with strict bans on vendor data pooling, cross-customer AI training, or commercial monetization.',
    detailedNotes: [
      'Vendors are legally designated as technology service processors, never owners or co-owners of deployer vehicular telemetry.',
      'Vendors are prohibited from training foundation machine learning models across aggregated plate scans without explicit deployer and legal authorization.'
    ],
    crossWalk: {
      nist: 'SA-9, PS-7',
      iso: 'A.5.19, A.5.20',
      cjis: 'Area 5.1 (Information Handling)',
      statutory: 'Model Procurement Standard'
    }
  },
  {
    id: 'NA-03',
    pillarCode: 'NA',
    title: 'Encryption Standards (TLS 1.3 & AES-256)',
    requirementLevel: 'MANDATORY',
    statement: 'Mandatory encryption in transit (TLS 1.3) and at rest (AES-256), with cryptographic separation between agency tenants in cloud environments.',
    detailedNotes: [
      'Data in transit between roadside edge cameras and the cloud ingest endpoint must use TLS 1.3 with mutual certificate authentication.',
      'Database storage volume encryption keys must be managed in an agency-dedicated KMS or HSM.'
    ],
    crossWalk: {
      nist: 'SC-8, SC-28',
      iso: 'A.8.24',
      cjis: 'Area 5.10 (System & Comms)',
      statutory: 'FIPS 140-3 / CJIS 5.10'
    }
  },

  // PILLAR 4: AUDITABILITY & ALGORITHMIC OVERSIGHT (AU)
  {
    id: 'AU-01',
    pillarCode: 'AU',
    title: 'Immutable WORM Logging',
    requirementLevel: 'MUST',
    statement: 'System access, query parameters, returned result counts, and admin configuration changes MUST be logged in write-once/read-many (WORM) format.',
    detailedNotes: [
      'Audit log streams must be cryptographically hashed and forwarded in real-time to an immutable, external logging facility.',
      'Neither system administrators nor vendor personnel may delete, truncate, or amend historical query logs.'
    ],
    crossWalk: {
      nist: 'AU-2, AU-9',
      iso: 'A.8.15, A.8.16',
      cjis: 'Area 5.4 (Audit & Accountability)',
      statutory: 'CJIS Policy Area 5.4'
    }
  },
  {
    id: 'AU-02',
    pillarCode: 'AU',
    title: 'Automated Anomaly Detection Rules',
    requirementLevel: 'REQUIRED',
    statement: 'Automated alerts triggered by high-risk search behaviors (e.g., off-shift searches, broad geographic sweeps, or searches near sensitive locations without an active incident number).',
    detailedNotes: [
      'Heuristic detection flags: queries performed during non-scheduled shifts, search bursts (>50 queries/hour), and geographic geofence queries exceeding 0.5 miles.',
      'Triggered anomalies automatically dispatch high-priority notifications to internal affairs and compliance officers.'
    ],
    crossWalk: {
      nist: 'AU-6, SI-4',
      iso: 'A.8.16',
      cjis: 'Area 5.4 (Audit & Accountability)',
      statutory: 'NIST AU-6'
    }
  },
  {
    id: 'AU-03',
    pillarCode: 'AU',
    title: 'Periodic Independent Compliance Audits',
    requirementLevel: 'MANDATORY',
    statement: 'Bi-annual sampling (minimum 5% random audit of all search logs) conducted by an independent auditor, corporate GRC team, or civilian oversight body.',
    detailedNotes: [
      'Auditors verify that each queried CAD/RMS or security incident case number matches an actual open incident matching the suspect vehicle description.',
      'Audit findings must be published in an annual oversight report presented to executive leadership, governing boards, or civilian oversight.'
    ],
    crossWalk: {
      nist: 'AU-6(1)',
      iso: 'A.5.35',
      cjis: 'Area 5.4 (Audit & Accountability)',
      statutory: 'Independent Oversight Standard'
    }
  },

  // PILLAR 5: PUBLIC TRANSPARENCY & CIVILIAN OVERSIGHT (PT)
  {
    id: 'PT-01',
    pillarCode: 'PT',
    title: 'Open Metrics Dashboard',
    requirementLevel: 'REQUIRED',
    statement: 'Public-facing reporting on total camera counts, total hits, total queries run, arrests facilitated, and audit log reviews.',
    detailedNotes: [
      'Metrics updated monthly on an open civic portal with historical trend tracking.',
      'Public dashboard shows the volume of hotlist alerts triggered vs. verified stops conducted.'
    ],
    crossWalk: {
      nist: 'PT-3',
      iso: 'A.5.34',
      cjis: 'Civic Extension',
      statutory: 'Civic Transparency Standard'
    }
  },
  {
    id: 'PT-02',
    pillarCode: 'PT',
    title: 'Transparency Policy Portal',
    requirementLevel: 'MANDATORY',
    statement: 'Public access to current Standard Operating Procedures (SOPs), vendor contracts, and external agency sharing lists.',
    detailedNotes: [
      'Complete unredacted copies of data sharing agreements (MOUs) must be published for public inspection.',
      'Clear statements explaining data retention schedules and civilian dispute procedures.'
    ],
    crossWalk: {
      nist: 'PT-1, PT-2',
      iso: 'A.5.1',
      cjis: 'Civic Extension',
      statutory: 'Cal. Civ. Code § 1798.90.5'
    }
  },
  {
    id: 'PT-03',
    pillarCode: 'PT',
    title: 'Open Records Readiness',
    requirementLevel: 'REQUIRED',
    statement: 'Machine-readable export capabilities (CSV/JSON) for administrative audit logs with automated redaction rules for active cases.',
    detailedNotes: [
      'Export engines must support deterministic PII masking so public records requests can be fulfilled without manual redaction backlog.',
      'API access for academic researchers and civic journalists subject to credentialed verification.'
    ],
    crossWalk: {
      nist: 'PT-2, SC-28',
      iso: 'A.5.34',
      cjis: 'Area 5.1 (Information Handling)',
      statutory: 'FOIA / Open Data Standard'
    }
  },

  // PILLAR 6: PHYSICAL & STRUCTURAL SAFETY (PS)
  {
    id: 'PS-01',
    pillarCode: 'PS',
    title: 'AASHTO / MASH Roadway Clear-Zone Compliance',
    requirementLevel: 'MUST',
    statement: 'Standalone poles inside the roadway Clear Zone MUST use tested frangible aluminum poles or approved breakaway coupling systems (AASHTO MASH-16). Rigid pipe mounts are prohibited unless shielded by rated guardrails or concrete barriers.',
    detailedNotes: [
      'Clear Zone definition adheres to AASHTO Roadside Design Guide based on posted speed and annual average daily traffic (AADT).',
      'Unshielded rigid 2-inch steel pipes deployed within 10 to 30 feet of travel lanes violate state DOT and FHWA roadway safety guidelines.'
    ],
    crossWalk: {
      nist: 'PE-3, PE-18',
      iso: 'A.7.1, A.7.5',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'AASHTO MASH-16 / FHWA'
    }
  },
  {
    id: 'PS-02',
    pillarCode: 'PS',
    title: 'Enclosure Mass & Height Limits',
    requirementLevel: 'MANDATORY',
    statement: 'Solar arrays, batteries, and camera enclosures mounted on breakaway poles must remain below structural weight thresholds (e.g., FDOT 30–32 lbs payload cap) to ensure clean breakaway upon impact.',
    detailedNotes: [
      'Excessive mass atop a breakaway pole can cause windshield penetration or roof crush during a vehicular collision.',
      'Solar panels must be mounted with rated shear-away brackets certified under crash testing.'
    ],
    crossWalk: {
      nist: 'PE-18',
      iso: 'A.7.1',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'State DOT Design Manuals'
    }
  },
  {
    id: 'PS-03',
    pillarCode: 'PS',
    title: 'Right-of-Way Encroachment & ADA Clearance',
    requirementLevel: 'MANDATORY',
    statement: 'Placement must not obstruct driver sight triangles or impede pedestrian sidewalk clearance under ADA guidelines.',
    detailedNotes: [
      'Minimum unobstructed sidewalk width of 48 inches (36 inches continuous path) required at all pole installations.',
      'Intersection sight triangles defined by AASHTO Green Book must remain completely free of camera enclosures and solar panels.'
    ],
    crossWalk: {
      nist: 'PE-18',
      iso: 'A.7.1',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'ADA 28 CFR Part 35 / AASHTO'
    }
  },
  {
    id: 'PS-04',
    pillarCode: 'PS',
    title: 'Structural & Wind Engineering',
    requirementLevel: 'MANDATORY',
    statement: 'Concrete caisson foundations and pole gauge must meet local ultimate wind speed requirements (AASHTO LRFD wind ratings for 110–130+ MPH) accounting for solar/camera surface area.',
    detailedNotes: [
      'Signed and sealed engineering calculations required for coastal hurricane wind zones (>130 MPH).',
      'Foundation embedment depth must account for local soil mechanics and frost line depths.'
    ],
    crossWalk: {
      nist: 'PE-13, PE-15',
      iso: 'A.7.5',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'AASHTO LRFD Wind Specs'
    }
  },
  {
    id: 'PS-05',
    pillarCode: 'PS',
    title: 'Co-Location Load Verification',
    requirementLevel: 'REQUIRED',
    statement: 'Mounting hardware onto existing municipal light poles or traffic signal arms requires a structural load assessment to ensure added mass does not compromise primary structures.',
    detailedNotes: [
      'Traffic signal mast arms are designed with specific moment capacities; adding wind-sail area (solar arrays) requires civil engineering permit approval.',
      'Vibration dampening brackets required when mounting to high-vibration bridge decks or cantilever arms.'
    ],
    crossWalk: {
      nist: 'PE-18',
      iso: 'A.7.2',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'State DOT Attachment Rules'
    }
  },
  {
    id: 'PS-06',
    pillarCode: 'PS',
    title: 'Conduit & Cabling Security',
    requirementLevel: 'REQUIRED',
    statement: 'Power and data cabling must be routed internally through the pole or encased in rigid, tamper-resistant conduit.',
    detailedNotes: [
      'Exposed wiring on the exterior of roadside poles is prohibited to prevent physical vandalism or physical tap intercept.',
      'Conduit penetration into ground vaults must be sealed against moisture and rodent ingress.'
    ],
    crossWalk: {
      nist: 'PE-4, PE-9',
      iso: 'A.7.9',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'NEC / NFPA 70'
    }
  },
  {
    id: 'PS-07',
    pillarCode: 'PS',
    title: 'Security Hardware & Mounting Height',
    requirementLevel: 'REQUIRED',
    statement: 'Minimum mounting height of 10–12 feet with tamper-resistant fasteners (e.g., Torx pin / security bolts).',
    detailedNotes: [
      'Camera lenses and enclosures must remain beyond normal standing reach to deter spray-paint vandalism and physical re-aiming.',
      'Access panels at the base of poles must feature lockable or specialized security keying.'
    ],
    crossWalk: {
      nist: 'PE-3',
      iso: 'A.7.2',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'Physical Security Standard'
    }
  },
  {
    id: 'PS-08',
    pillarCode: 'PS',
    title: 'Power & Backup Resilience',
    requirementLevel: 'REQUIRED',
    statement: 'Battery health monitoring and surge protection required. Disconnections or unexpected power drops must trigger immediate audit log alert.',
    detailedNotes: [
      'Solar-powered installations must maintain minimum 72 hours of battery autonomy under zero-sunlight conditions.',
      'Line-powered units require inline surge suppression rated for IEEE C62.41 standards.'
    ],
    crossWalk: {
      nist: 'PE-11, CP-8',
      iso: 'A.7.11',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'IEEE C62.41'
    }
  },
  {
    id: 'PS-09',
    pillarCode: 'PS',
    title: 'Co-Location on Compliant Infrastructure (Compensating Control)',
    requirementLevel: 'COMPENSATING',
    statement: 'Deploying entities can meet crash-safety compliance without standalone breakaway poles by co-locating hardware on pre-approved existing roadside infrastructure (traffic signal mast arms, utility poles, facility lighting, or behind concrete barriers), provided dead-load/wind-load checks and clearance requirements are satisfied.',
    detailedNotes: [
      'Allows operators and agencies to avoid costly new pole installations while remaining 100% compliant with roadside safety regulations.',
      'Hardware placed behind existing concrete jersey barriers or W-beam guardrails meets roadside safety requirements without frangible couplings.'
    ],
    crossWalk: {
      nist: 'PE-18',
      iso: 'A.7.2, A.7.7',
      cjis: 'Area 5.8 (Physical Protection)',
      statutory: 'DOT / Facility Attachment Rules'
    }
  },

  // PILLAR 7: LEGAL & STATUTORY COMPLIANCE (LE)
  {
    id: 'LE-01',
    pillarCode: 'LE',
    title: 'Driver\'s Privacy Protection Act (DPPA) Gate',
    requirementLevel: 'MUST',
    statement: 'Prohibits converting raw plate scans into PII via DMV database lookups without a permitted statutory use (18 U.S.C. § 2721). Automated DMV lookups on passive scans are blocked.',
    detailedNotes: [
      'Batch conversion of passive license plate scans into registered owner names, home addresses, and DOBs is strictly forbidden.',
      'DMV registration lookups permitted only upon verification of an active criminal investigation CAD/RMS case ID.'
    ],
    crossWalk: {
      nist: 'PT-2, AC-3',
      iso: 'A.5.34, A.8.3',
      cjis: 'Area 5.5 (Access Control)',
      statutory: '18 U.S.C. § 2721 (DPPA)'
    }
  },
  {
    id: 'LE-02',
    pillarCode: 'LE',
    title: 'Permissible Use Enumeration',
    requirementLevel: 'MANDATORY',
    statement: 'Restricts system query drop-downs strictly to state-enumerated criminal offenses, missing person alerts, human trafficking, and stolen property (e.g., Va. Code § 2.2-5517).',
    detailedNotes: [
      'System administrators must configure the software to disallow searches that do not select one of the authorized statutory offenses from a controlled taxonomy.',
      'Prohibits speculative trawling or pattern-of-life queries without specific articulable suspicion.'
    ],
    crossWalk: {
      nist: 'AC-3, PT-2',
      iso: 'A.5.34',
      cjis: 'Area 5.5 (Access Control)',
      statutory: 'Va. Code § 2.2-5517'
    }
  },
  {
    id: 'LE-03',
    pillarCode: 'LE',
    title: 'Mandatory Privacy Publishing',
    requirementLevel: 'MANDATORY',
    statement: 'Mandates publishing a formal public ALPR Usage and Privacy Policy prior to deployment (e.g., Cal. Civ. Code § 1798.90.5).',
    detailedNotes: [
      'Policy must define authorized users, permissible purposes, retention duration, and security measures in plain language.',
      'Deployment of hardware or software prior to formal public notice and council authorization is non-compliant.'
    ],
    crossWalk: {
      nist: 'PT-1',
      iso: 'A.5.1',
      cjis: 'Civic Extension',
      statutory: 'Cal. Civ. Code § 1798.90.5'
    }
  },
  {
    id: 'LE-04',
    pillarCode: 'LE',
    title: 'Statutory Retention & Purge Caps',
    requirementLevel: 'MANDATORY',
    statement: 'Imposes auto-purge schedules based on state statutory windows (e.g., Maine 21 days, Oregon 30 days, Minnesota 60 days).',
    detailedNotes: [
      'Where state statute imposes a shorter retention period than the framework baseline (30 days), the shorter state period controls automatically.',
      'System configuration must lock the purge parameter to prevent local administrators from extending retention beyond state limits.'
    ],
    crossWalk: {
      nist: 'MP-6, PT-2',
      iso: 'A.8.10',
      cjis: 'Area 5.11 (Media Protection)',
      statutory: 'OR HB 2186 / Me. Rev. Stat. 29-A'
    }
  },
  {
    id: 'LE-05',
    pillarCode: 'LE',
    title: 'Hard System Sunset',
    requirementLevel: 'MANDATORY',
    statement: 'Automatic purge routines override manual tags after statutory upper bounds (e.g., GA Code § 35-1-22 30-month cap) unless backed by an active court order.',
    detailedNotes: [
      'Prevents indefinite retention through administrative inertia or perpetual "open investigation" tags.',
      'Court orders extending retention must be renewed periodically and filed with the city attorney.'
    ],
    crossWalk: {
      nist: 'MP-6',
      iso: 'A.8.10',
      cjis: 'Area 5.11 (Media Protection)',
      statutory: 'GA Code § 35-1-22'
    }
  },
  {
    id: 'LE-06',
    pillarCode: 'LE',
    title: 'Non-Transitive Data Geofencing',
    requirementLevel: 'MUST',
    statement: 'Prohibits auto-forwarding data across state lines or to federal immigration enforcement without explicit statutory authorization and signed MOUs (VA HB 2724 / Cal SB 34).',
    detailedNotes: [
      'Out-of-state queries must be blocked at the network API gateway unless an interstate compact or mutual aid agreement exists.',
      'Protects citizens against out-of-state surveillance regarding reproductive healthcare travel and lawful conduct in other jurisdictions.'
    ],
    crossWalk: {
      nist: 'AC-21, SC-7',
      iso: 'A.5.19, A.8.20',
      cjis: 'Area 5.10 (System & Comms)',
      statutory: 'VA HB 2724 / Cal SB 34'
    }
  },
  {
    id: 'LE-07',
    pillarCode: 'LE',
    title: 'Private Network Warrant Gate',
    requirementLevel: 'MANDATORY',
    statement: 'Prohibits automated queries into commercial/HOA ALPR networks unless the vendor purges data within 30 days or a search warrant is issued (Utah Code § 41-6a-2003).',
    detailedNotes: [
      'Law enforcement cannot circumvent municipal retention limits by querying privately owned commercial surveillance databases holding years of data without judicial process.',
      'Integration with private HOA cameras requires compliance with municipal 30-day purge caps.'
    ],
    crossWalk: {
      nist: 'AC-3, SA-9',
      iso: 'A.5.20',
      cjis: 'Area 5.5 (Access Control)',
      statutory: 'Utah Code § 41-6a-2003'
    }
  },
  {
    id: 'LE-08',
    pillarCode: 'LE',
    title: 'Public Records FOIA Exemption Safeguard',
    requirementLevel: 'REQUIRED',
    statement: 'Automatic redaction/exemption of raw bulk scan data from public records requests to prevent commercial harvesting and stalking (WA RCW 42.56 / FL Stat. § 316.0777).',
    detailedNotes: [
      'Raw license plate records and vehicle travel pattern logs are exempt from bulk public release to safeguard citizen privacy.',
      'Administrative query logs, audit summaries, and aggregate hit volumes remain 100% disclosable.'
    ],
    crossWalk: {
      nist: 'PT-2, SC-28',
      iso: 'A.5.34',
      cjis: 'Area 5.1 (Information Handling)',
      statutory: 'WA RCW 42.56 / FL Stat. § 316.0777'
    }
  },

  // PILLAR 8: PUBLIC RECORDS & OPEN DATA DISCLOSURE BOUNDARIES (PR)
  {
    id: 'PR-01',
    pillarCode: 'PR',
    title: 'Open Records Redaction & Disclosure Boundaries',
    requirementLevel: 'MUST',
    statement: 'Clear boundary definitions for public release: full disclosure for administrative governance, cryptographic protection for personal travel telemetry, and pseudonymization for investigating officers.',
    detailedNotes: [
      'Public Disclosable Domain: Total camera counts, general location maps (non-covert), hardware specs, vendor agreements, sharing MOUs, SOPs, and monthly aggregated hit/scan query volume counts.',
      'Protected / Redacted Domain: Raw passive plate scans and vehicle GPS histories (preventing mass commercial scraping/stalking), direct credentials/secrets, active criminal investigation hit files, undercover deployment sites, and DMV PII pulled under DPPA.',
      'Officer Accountability Balance: Public exports tokenize individual officer credentials and badge numbers into consistent pseudo-identifiers (e.g., Investigator_04) to monitor query abuse and volume without exposing operational covert personnel; unredacted maps remain available for internal affairs and judicial review.'
    ],
    subClauses: [
      {
        label: 'Public Disclosable Domain',
        description: 'Total camera counts, non-covert location maps, hardware specifications, vendor agreements, sharing MOUs, SOPs, and monthly aggregated hit/scan query volume counts.'
      },
      {
        label: 'Protected / Redacted Domain',
        description: 'Raw passive plate scans, vehicle GPS histories (preventing mass commercial scraping or stalking), direct API credentials, active criminal investigation hit files, undercover deployment sites, and DMV PII pulled under DPPA.'
      },
      {
        label: 'Officer Accountability Balance',
        description: 'Public exports tokenize individual officer credentials and badge numbers into consistent pseudo-identifiers (e.g., Investigator_04) to monitor query abuse and volume without exposing operational covert personnel; unredacted maps remain available for internal affairs and judicial review.'
      }
    ],
    crossWalk: {
      nist: 'PT-2, SC-28',
      iso: 'A.5.34',
      cjis: 'Area 5.1 (Information Handling)',
      statutory: 'WA RCW 42.56 / FL Stat. § 316.0777'
    }
  }
];

export const ALPR_CROSSWALK_MATRIX: CrossWalkItem[] = [
  {
    controlId: 'AC-01',
    controlName: 'Justification Enforcement',
    pillar: 'Access Control',
    nist: 'AC-3, AC-6',
    iso: 'A.8.3, A.8.5',
    cjis: 'Area 5.5 (Access Control)',
    statutory: 'VA HB 2724 / CJIS 5.5'
  },
  {
    controlId: 'AC-02',
    controlName: 'Role-Based Access Control',
    pillar: 'Access Control',
    nist: 'AC-2, AC-5',
    iso: 'A.5.15, A.5.18',
    cjis: 'Area 5.5 (Access Control)',
    statutory: 'NIST AC-5'
  },
  {
    controlId: 'AC-03',
    controlName: 'Multi-Factor Authentication',
    pillar: 'Access Control',
    nist: 'IA-2',
    iso: 'A.8.5',
    cjis: 'Area 5.6 (Identification & Auth)',
    statutory: 'CJIS Policy Area 5.6'
  },
  {
    controlId: 'DG-01',
    controlName: '30-Day Auto-Purge Cap',
    pillar: 'Data Lifecycle',
    nist: 'MP-6, PT-2',
    iso: 'A.8.10, A.5.34',
    cjis: 'Area 5.11 (Media Protection)',
    statutory: 'OR HB 2186 / Me. Rev. Stat. 29-A'
  },
  {
    controlId: 'DG-03',
    controlName: 'Hotlist Verification',
    pillar: 'Data Lifecycle',
    nist: 'SI-4, SI-10',
    iso: 'A.8.9',
    cjis: 'Area 5.10 (System & Comms)',
    statutory: 'NCIC / CJIS Guidelines'
  },
  {
    controlId: 'NA-01',
    controlName: 'Non-Transitive Sharing',
    pillar: 'Network Architecture',
    nist: 'AC-21, SC-7',
    iso: 'A.5.21, A.8.20',
    cjis: 'Area 5.10 (System & Comms)',
    statutory: 'Cal. Civ. Code § 1798.90.5'
  },
  {
    controlId: 'NA-03',
    controlName: 'Encryption (TLS 1.3 / AES-256)',
    pillar: 'Network Architecture',
    nist: 'SC-8, SC-28',
    iso: 'A.8.24',
    cjis: 'Area 5.10 (System & Comms)',
    statutory: 'FIPS 140-3 / CJIS 5.10'
  },
  {
    controlId: 'AU-01',
    controlName: 'Immutable WORM Logging',
    pillar: 'Audit & Oversight',
    nist: 'AU-2, AU-9',
    iso: 'A.8.15, A.8.16',
    cjis: 'Area 5.4 (Audit & Accountability)',
    statutory: 'CJIS Policy Area 5.4'
  },
  {
    controlId: 'AU-02',
    controlName: 'Anomaly Detection Alerts',
    pillar: 'Audit & Oversight',
    nist: 'AU-6, SI-4',
    iso: 'A.8.16',
    cjis: 'Area 5.4 (Audit & Accountability)',
    statutory: 'NIST AU-6'
  },
  {
    controlId: 'PT-01',
    controlName: 'Public Open Metrics',
    pillar: 'Public Transparency',
    nist: 'PT-3',
    iso: 'A.5.34',
    cjis: 'Civic Extension',
    statutory: 'Civic Transparency Standard'
  },
  {
    controlId: 'PS-01',
    controlName: 'Clear Zone & Breakaway Base',
    pillar: 'Physical Safety',
    nist: 'PE-3, PE-18',
    iso: 'A.7.1, A.7.5',
    cjis: 'Area 5.8 (Physical Protection)',
    statutory: 'AASHTO MASH-16 / FHWA'
  },
  {
    controlId: 'PS-04',
    controlName: 'Wind Load & Caisson Specs',
    pillar: 'Physical Safety',
    nist: 'PE-13, PE-15',
    iso: 'A.7.5',
    cjis: 'Area 5.8 (Physical Protection)',
    statutory: 'AASHTO LRFD Wind Specs'
  },
  {
    controlId: 'PS-09',
    controlName: 'Co-Location Compensating Control',
    pillar: 'Physical Safety',
    nist: 'PE-18',
    iso: 'A.7.2, A.7.7',
    cjis: 'Area 5.8 (Physical Protection)',
    statutory: 'State DOT Attachment Rules'
  },
  {
    controlId: 'LE-01',
    controlName: 'DPPA DMV Lookup Gate',
    pillar: 'Statutory Compliance',
    nist: 'PT-2, AC-3',
    iso: 'A.5.34, A.8.3',
    cjis: 'Area 5.5 (Access Control)',
    statutory: '18 U.S.C. § 2721 (DPPA)'
  },
  {
    controlId: 'LE-06',
    controlName: 'Geofencing & Non-Transitive',
    pillar: 'Statutory Compliance',
    nist: 'AC-21, SC-7',
    iso: 'A.5.19, A.8.20',
    cjis: 'Area 5.10 (System & Comms)',
    statutory: 'VA HB 2724 / Cal SB 34'
  },
  {
    controlId: 'PR-01',
    controlName: 'Open Records Redaction Rules',
    pillar: 'Open Records & FOIA',
    nist: 'PT-2, SC-28',
    iso: 'A.5.34',
    cjis: 'Area 5.1 (Information Handling)',
    statutory: 'WA RCW 42.56 / FL Stat. § 316.0777'
  }
];

export const ALPR_ROLLOUT_PHASES: RolloutPhase[] = [
  {
    phase: 1,
    title: 'Legal & Ordinance Alignment',
    summary: 'Enact local enabling ordinance reflecting LE-01 through LE-08 controls, publish public privacy policy (PT-02), and establish open records redaction SOPs (Pillar 8).',
    timeframe: 'Days 1 – 30',
    targetMilestones: [
      'City council adoption of model ALPR surveillance ordinance.',
      'Draft and sign non-transitive mutual aid MOUs (NA-01).',
      'Publish public ALPR Usage and Privacy Policy on city portal (PT-02).',
      'Establish FOIA redaction pipeline with city attorney and clerk (PR-01).'
    ],
    responsibleStakeholders: [
      'City Council / County Commissioners',
      'City Attorney / Legal Counsel',
      'Chief of Police / Sheriff',
      'Municipal Clerk'
    ]
  },
  {
    phase: 2,
    title: 'Technical & API Configuration',
    summary: 'Enforce mandatory CAD/RMS incident justification in search UI (AC-01), configure MFA (AC-03), and set database TTL auto-purge timers to 30 days (DG-01).',
    timeframe: 'Days 31 – 60',
    targetMilestones: [
      'Configure CAD/RMS case ID validation gate in search console (AC-01).',
      'Deploy FIDO2 / authenticator MFA for all agency accounts (AC-03).',
      'Configure automated 30-day hard-delete cron / TTL policies (DG-01).',
      'Verify vendor contract guarantees 100% municipal data ownership (NA-02).'
    ],
    responsibleStakeholders: [
      'Municipal IT Director / CISO',
      'Vendor Technical Account Lead',
      'Police IT / Records Management Supervisor'
    ]
  },
  {
    phase: 3,
    title: 'Roadway Engineering Review',
    summary: 'Verify all roadside hardware deployments against AASHTO MASH breakaway specs (PS-01) or execute co-location MOUs on existing signal/utility structures (PS-09).',
    timeframe: 'Days 61 – 90',
    targetMilestones: [
      'Encroachment permit approval from State DOT / City Public Works.',
      'Field inspection of roadside clear zones and MASH-16 breakaway couplings (PS-01).',
      'Enclosure and solar panel mass verification (<32 lbs FDOT cap) (PS-02).',
      'ADA sidewalk clearance verification (min 48 inches) (PS-03).'
    ],
    responsibleStakeholders: [
      'City Public Works Director',
      'State DOT District Traffic Engineer',
      'Hardware Installation Contractor'
    ]
  },
  {
    phase: 4,
    title: 'Ongoing Oversight & Civilian Auditing',
    summary: 'Establish WORM logging (AU-01), enable automated anomaly alerts for off-shift searches (AU-02), and launch public transparency metric portal (PT-01).',
    timeframe: 'Day 91 Onward (Continuous)',
    targetMilestones: [
      'Connect WORM audit logging to independent municipal cloud storage (AU-01).',
      'Activate behavioral anomaly detection rules for off-shift queries (AU-02).',
      'Launch public open metrics dashboard with monthly hit/search counts (PT-01).',
      'Initiate bi-annual 5% random audit by civilian oversight body (AU-03).'
    ],
    responsibleStakeholders: [
      'Civilian Oversight Board / Police Auditor',
      'Internal Affairs Division',
      'Municipal Transparency Office'
    ]
  }
];

export const ALPR_RAW_MARKDOWN = `# ALPR Security & Governance Control Framework (ALPR-CSF)
**Baseline Security, Physical Safety, and Data Governance Standard for Automated License Plate Recognition Systems (Enterprise, Logistics, Campus, Critical Infrastructure & Public Deployments)**

## 1. Executive Summary & Purpose
The Automated License Plate Recognition Control Security Framework (ALPR-CSF) provides enterprise security directors, corporate campus operators, logistics hubs, critical infrastructure facilities, and public sector agencies with a vendor-agnostic, open baseline standard for deploying, operating, and auditing ALPR technology. By bridging technical cybersecurity, physical roadway safety, privacy protection, and statutory compliance, ALPR-CSF ensures that vehicular monitoring technology operates within strict constitutional, privacy, and structural engineering boundaries regardless of operating environment or vendor.

---

## 2. Framework Architecture & Pillars
1. **Pillar 1: Access Control & Identity Governance (AC)** — Need-to-know access enforcement and multi-factor authentication.
2. **Pillar 2: Data Governance & Lifecycle Management (DG)** — Data minimization, retention caps, and automatic purging.
3. **Pillar 3: Network Architecture & Third-Party Integration (NA)** — Vendor isolation, non-transitive sharing, and encryption.
4. **Pillar 4: Auditability & Algorithmic Oversight (AU)** — Immutable query logging and automated anomaly detection.
5. **Pillar 5: Public Transparency & Civilian Oversight (PT)** — Public metric portals, open policy disclosures, and reporting.
6. **Pillar 6: Physical & Structural Safety (PS)** — Roadway clear-zone compliance, crash safety, wind loading, and co-location standards.
7. **Pillar 7: Legal & Statutory Compliance (LE)** — Federal DPPA compliance, state purge mandates, and non-transitive geofencing.
8. **Pillar 8: Public Records & Open Data Disclosure Boundaries (PR)** — Open records standardization, PII redaction boundaries, and officer identity protection.

---

## 3. Detailed Control Specifications

### Pillar 1: Access Control & Identity Governance (AC)
* **AC-01: Justification Enforcement:** Systems MUST require a mandatory, structured justification field (e.g., active CAD/RMS incident number) before executing any search query. Free-text fields alone are non-compliant.
* **AC-02: Role-Based Access Control (RBAC):** Separation of duties between System Administrators (who manage users and system rules but cannot query historical data) and Investigators (who query data but cannot alter retention rules).
* **AC-03: Multi-Factor Authentication (MFA):** Mandatory MFA for all dashboard and API access, aligned with FBI CJIS Security Policy standards.
* **AC-04: Periodic Account Attestation:** Automated 90-day review cycles requiring agency administrators to re-certify active user accounts and offboard inactive credentials.

### Pillar 2: Data Governance & Lifecycle Management (DG)
* **DG-01: Default Retention Cap:** Passive scan data MUST automatically hard-delete after 30 days (or the minimum statutory period), unless explicitly tagged as evidence in an active criminal investigation.
* **DG-02: Evidentiary Hold Controls:** Secondary supervisor or legal approval required to transfer a hit/scan into long-term evidentiary retention.
* **DG-03: Hotlist Validation:** Real-time hotlists (NCIC, stolen vehicles) must auto-sync and refresh to prevent field response on stale data. Mandatory visual/dispatcher confirmation required prior to enforcement action.
* **DG-04: Non-Law Enforcement Prohibition:** Prohibition of data collection or querying for civil infractions, immigration enforcement, or municipal code violations unless explicitly authorized by ordinance.

### Pillar 3: Network Architecture & Third-Party Integration (NA)
* **NA-01: Explicit Outbound Sharing Agreements:** Mutual aid sharing controls MUST be opt-in, non-transitive (Agency A sharing with B does not allow B to pass A's data to C), and governed by a formal MOU.
* **NA-02: Vendor Isolation & Data Ownership:** Contractual guarantees that raw data, analytics, and metadata remain 100% municipal property, with strict bans on vendor data pooling, cross-customer AI training, or commercial monetization.
* **NA-03: Encryption Standards:** Mandatory encryption in transit (TLS 1.3) and at rest (AES-256), with cryptographic separation between agency tenants in cloud environments.

### Pillar 4: Auditability & Algorithmic Oversight (AU)
* **AU-01: Immutable Logging:** System access, query parameters, returned result counts, and admin configuration changes MUST be logged in write-once/read-many (WORM) format.
* **AU-02: Anomaly Detection Rules:** Automated alerts triggered by high-risk search behaviors (e.g., off-shift searches, broad geographic sweeps, or searches near sensitive locations without an active incident number).
* **AU-03: Periodic Compliance Audits:** Bi-annual sampling (minimum 5% random audit of all search logs) conducted by an independent auditor or civilian oversight body.

### Pillar 5: Public Transparency & Civilian Oversight (PT)
* **PT-01: Open Metrics Dashboard:** Public-facing reporting on total camera counts, total hits, total queries run, arrests facilitated, and audit log reviews.
* **PT-02: Transparency Policy Portal:** Public access to current Standard Operating Procedures (SOPs), vendor contracts, and external agency sharing lists.
* **PT-03: Open Records Readiness:** Machine-readable export capabilities (CSV/JSON) for administrative audit logs with automated redaction rules for active cases.

### Pillar 6: Physical & Structural Safety (PS)
* **PS-01: AASHTO / MASH Compliance:** Standalone poles inside the roadway Clear Zone MUST use tested frangible aluminum poles or approved breakaway coupling systems (AASHTO MASH-16). Rigid pipe mounts are prohibited unless shielded by rated guardrails or concrete barriers.
* **PS-02: Enclosure Mass & Height Limits:** Solar arrays, batteries, and camera enclosures mounted on breakaway poles must remain below structural weight thresholds (e.g., FDOT 30–32 lbs payload cap) to ensure clean breakaway upon impact.
* **PS-03: Right-of-Way Encroachment:** Placement must not obstruct driver sight triangles or impede pedestrian sidewalk clearance under ADA guidelines.
* **PS-04: Structural & Wind Engineering:** Concrete caisson foundations and pole gauge must meet local ultimate wind speed requirements (AASHTO LRFD wind ratings for 110–130+ MPH) accounting for solar/camera surface area.
* **PS-05: Co-Location Load Verification:** Mounting hardware onto existing municipal light poles or traffic signal arms requires a structural load assessment to ensure added mass does not compromise primary structures.
* **PS-06: Conduit & Cabling Security:** Power and data cabling must be routed internally through the pole or encased in rigid, tamper-resistant conduit.
* **PS-07: Security Hardware & Mounting Height:** Minimum mounting height of 10–12 feet with tamper-resistant fasteners (e.g., Torx pin / security bolts).
* **PS-08: Power & Backup Resilience:** Battery health monitoring and surge protection required. Disconnections or unexpected power drops must trigger immediate audit log alert.
* **PS-09: Co-Location on Compliant Infrastructure (Compensating Control):** Municipalities can meet crash-safety compliance without standalone breakaway poles by co-locating hardware on pre-approved roadside infrastructure (traffic signal mast arms, utility poles, or behind concrete barriers), provided dead-load/wind-load checks and clearance requirements are satisfied.

### Pillar 7: Legal & Statutory Compliance (LE)
* **LE-01: Driver's Privacy Protection Act (DPPA) Gate:** Prohibits converting raw plate scans into PII via DMV database lookups without a permitted statutory use (18 U.S.C. § 2721). Automated DMV lookups on passive scans are blocked.
* **LE-02: Permissible Use Enumeration:** Restricts system query drop-downs strictly to state-enumerated criminal offenses, missing person alerts, human trafficking, and stolen property (e.g., Va. Code § 2.2-5517).
* **LE-03: Mandatory Privacy Publishing:** Mandates publishing a formal public ALPR Usage and Privacy Policy prior to deployment (e.g., Cal. Civ. Code § 1798.90.5).
* **LE-04: Statutory Retention & Purge Caps:** Imposes auto-purge schedules based on state statutory windows (e.g., Maine 21 days, Oregon 30 days, Minnesota 60 days).
* **LE-05: Hard System Sunset:** Automatic purge routines override manual tags after statutory upper bounds (e.g., GA Code § 35-1-22 30-month cap) unless backed by an active court order.
* **LE-06: Non-Transitive Data Geofencing:** Prohibits auto-forwarding data across state lines or to federal immigration enforcement without explicit statutory authorization and signed MOUs (VA HB 2724 / Cal SB 34).
* **LE-07: Private Network Warrant Gate:** Prohibits automated queries into commercial/HOA ALPR networks unless the vendor purges data within 30 days or a search warrant is issued (Utah Code § 41-6a-2003).
* **LE-08: Public Records FOIA Exemption:** Automatic redaction/exemption of raw bulk scan data from public records requests to prevent commercial harvesting and stalking (WA RCW 42.56 / FL Stat. § 316.0777).

### Pillar 8: Public Records & Open Data Disclosure Boundaries (PR)
* **PR-01: Open Records Redaction & Disclosure Boundaries:**
  * **Public Disclosable Domain:** Total camera counts, general location maps (non-covert), hardware specs, vendor agreements, sharing MOUs, SOPs, and monthly aggregated hit/scan query volume counts.
  * **Protected / Redacted Domain:** Raw passive plate scans and vehicle GPS histories (preventing mass commercial scraping/stalking), direct credentials/secrets, active criminal investigation hit files, undercover deployment sites, and DMV PII pulled under DPPA.
  * **Officer Accountability Balance:** Public exports tokenize individual officer credentials and badge numbers into consistent pseudo-identifiers (e.g., Investigator_04) to monitor query abuse and volume without exposing operational covert personnel; unredacted maps remain available for internal affairs and judicial review.

---

## 4. Industry Framework Cross-Walk Matrix

| Framework Control ID | NIST SP 800-53 Rev. 5 | ISO/IEC 27001:2022 | FBI CJIS v5.9 Policy Area | Statutory / Reference Standard |
| :--- | :--- | :--- | :--- | :--- |
| **AC-01** (Justification Enforcement) | AC-3, AC-6 | A.8.3, A.8.5 | Area 5.5 (Access Control) | VA HB 2724 / CJIS 5.5 |
| **AC-02** (Role-Based Access Control) | AC-2, AC-5 | A.5.15, A.5.18 | Area 5.5 (Access Control) | NIST AC-5 |
| **AC-03** (Multi-Factor Authentication) | IA-2 | A.8.5 | Area 5.6 (Identification & Auth) | CJIS Policy Area 5.6 |
| **DG-01** (30-Day Auto-Purge) | MP-6, PT-2 | A.8.10, A.5.34 | Area 5.11 (Media Protection) | OR HB 2186 / Me. Rev. Stat. 29-A |
| **DG-03** (Hotlist Verification) | SI-4, SI-10 | A.8.9 | Area 5.10 (System & Comms) | NCIC / CJIS Guidelines |
| **NA-01** (Non-Transitive Sharing) | AC-21, SC-7 | A.5.21, A.8.20 | Area 5.10 (System & Comms) | Cal. Civ. Code § 1798.90.5 |
| **NA-03** (Encryption TLS 1.3/AES-256) | SC-8, SC-28 | A.8.24 | Area 5.10 (System & Comms) | FIPS 140-3 / CJIS 5.10 |
| **AU-01** (Immutable WORM Logging) | AU-2, AU-9 | A.8.15, A.8.16 | Area 5.4 (Audit & Accountability) | CJIS Policy Area 5.4 |
| **AU-02** (Anomaly Detection Alerts) | AU-6, SI-4 | A.8.16 | Area 5.4 (Audit & Accountability) | NIST AU-6 |
| **PT-01** (Public Open Metrics) | PT-3 | A.5.34 | Civic Extension | Civic Transparency Standard |
| **PS-01** (Clear Zone & Breakaway Base) | PE-3, PE-18 | A.7.1, A.7.5 | Area 5.8 (Physical Protection) | AASHTO MASH-16 / FHWA |
| **PS-04** (Wind Load & Caisson Specs) | PE-13, PE-15 | A.7.5 | Area 5.8 (Physical Protection) | AASHTO LRFD Wind Specs |
| **PS-09** (Co-Location Compensating) | PE-18 | A.7.2, A.7.7 | Area 5.8 (Physical Protection) | State DOT Attachment Rules |
| **LE-01** (DPPA DMV Lookup Gate) | PT-2, AC-3 | A.5.34, A.8.3 | Area 5.5 (Access Control) | 18 U.S.C. § 2721 (DPPA) |
| **LE-06** (Geofencing & Non-Transitive) | AC-21, SC-7 | A.5.19, A.8.20 | Area 5.10 (System & Comms) | VA HB 2724 / Cal SB 34 |
| **PR-01** (Open Records Redaction Rules) | PT-2, SC-28 | A.5.34 | Area 5.1 (Information Handling) | WA RCW 42.56 / FL Stat. § 316.0777 |

---

## 5. Implementation & Phased Rollout
1. **Phase 1: Legal & Ordinance Alignment:** Enact local enabling ordinance reflecting LE-01 through LE-08 controls, publish public privacy policy (PT-02), and establish open records redaction SOPs (Pillar 8).
2. **Phase 2: Technical & API Configuration:** Enforce mandatory CAD/RMS incident justification in search UI (AC-01), configure MFA (AC-03), and set database TTL auto-purge timers to 30 days (DG-01).
3. **Phase 3: Roadway Engineering Review:** Verify all roadside hardware deployments against AASHTO MASH breakaway specs (PS-01) or execute co-location MOUs on existing signal/utility structures (PS-09).
4. **Phase 4: Ongoing Oversight:** Establish WORM logging (AU-01), enable automated anomaly alerts for off-shift searches (AU-02), and launch public transparency metric portal (PT-01).
`;

export const ALPR_CSF_FRAMEWORK: GovernanceFrameworkMeta = {
  id: 'alpr-csf',
  code: 'ALPR-CSF',
  title: 'ALPR Security & Governance Control Framework',
  subtitle: 'Baseline Security, Physical Safety, and Data Governance Standard for Automated License Plate Recognition Systems (Enterprise, Logistics, Campus, Critical Infrastructure & Public Deployments)',
  version: '1.0.0 (Experimental)',
  status: 'Active Standard',
  category: 'Surveillance & Sensors',
  executiveSummary: 'The Automated License Plate Recognition Control Security Framework (ALPR-CSF) provides enterprise security directors, corporate campus operators, logistics hubs, critical infrastructure facilities, and public sector agencies with a vendor-agnostic, open baseline standard for deploying, operating, and auditing ALPR technology. By bridging technical cybersecurity, physical roadway safety, privacy protection, and statutory compliance, ALPR-CSF ensures that vehicular monitoring technology operates within strict constitutional, privacy, and structural engineering boundaries regardless of operating environment or vendor.',
  scope: 'Applicable to all deployments of fixed, solar-powered, mobile, and vehicle-mounted automated license plate recognition systems across corporate campuses, logistics depots, critical infrastructure perimeters, private tolling/parking facilities, and public agency roadways. Fully agnostic of hardware and software vendors (including Flock Safety, Motorola/Vigilant Solutions, Rekor Systems, Genetec AutoVu, Axis Communications, open-source or custom neural models).',
  targetAudience: [
    'Corporate Security Directors & Physical Security Teams',
    'Enterprise Facility, Campus & Logistics Fleet Managers',
    'Critical Infrastructure & Port Security Operators',
    'Public Safety Agencies, Sheriffs & Municipal Engineers',
    'Privacy Officers, GRC Auditors & General Counsels',
    'Civil Liberties, Oversight Boards & Compliance Advocates'
  ],
  pillars: ALPR_PILLARS,
  controls: ALPR_CONTROLS,
  crossWalk: ALPR_CROSSWALK_MATRIX,
  rolloutPhases: ALPR_ROLLOUT_PHASES,
  markdownExport: ALPR_RAW_MARKDOWN
};
