import { 
  ComplianceFrameworkMeta, 
  ComplianceDomainMeta, 
  AuditChecklistItem 
} from '@/types/compliance';

export const COMPLIANCE_FRAMEWORKS: ComplianceFrameworkMeta[] = [
  {
    id: 'nist-800-53',
    name: 'NIST Special Publication 800-53 Rev. 5',
    shortName: 'NIST 800-53',
    version: 'Revision 5 (2020/2022 Update)',
    governingBody: 'National Institute of Standards and Technology (US DOC)',
    scopeSummary: 'Comprehensive catalog of security and privacy controls for federal information systems, high-assurance defense contractors, and enterprise enclaves.',
    color: '#3B82F6',
    accentBg: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    penaltyRisk: 'Loss of federal agency authorization (ATO), breach of contract, False Claims Act liability.',
    auditFrequency: 'Continuous Monitoring / Annual Assessment',
    totalControlsAnalyzed: 20
  },
  {
    id: 'iso-27001',
    name: 'ISO/IEC 27001:2022 ISMS',
    shortName: 'ISO 27001',
    version: '2022 Edition (Annex A 93 Controls)',
    governingBody: 'International Organization for Standardization & IEC',
    scopeSummary: 'International gold-standard information security management system (ISMS) specifying risk assessment, continuous governance, and operational security controls.',
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    penaltyRisk: 'Loss of accredited ISO certification, immediate disqualification from enterprise/international RFPs.',
    auditFrequency: 'Annual Surveillance / 3-Year Recertification',
    totalControlsAnalyzed: 22
  },
  {
    id: 'soc-2',
    name: 'AICPA SOC 2 Type II (Trust Services Criteria)',
    shortName: 'SOC 2 Type II',
    version: 'TSC 2017 (Revised 2022)',
    governingBody: 'American Institute of CPAs (AICPA)',
    scopeSummary: 'Third-party attestation evaluating the design and operational effectiveness of internal security, availability, confidentiality, and processing controls over a 6–12 month observation window.',
    color: '#00E5FF',
    accentBg: 'rgba(0, 229, 255, 0.12)',
    borderColor: 'rgba(0, 229, 255, 0.35)',
    penaltyRisk: 'Qualified/adverse audit opinion, enterprise customer churn, vendor security gate rejections.',
    auditFrequency: 'Annual Attestation Period (6 to 12 months)',
    totalControlsAnalyzed: 24
  },
  {
    id: 'pci-dss',
    name: 'PCI Data Security Standard v4.0.1',
    shortName: 'PCI-DSS v4',
    version: 'Version 4.0.1 (Mandatory 2025/2026)',
    governingBody: 'Payment Card Industry Security Standards Council (PCI SSC)',
    scopeSummary: 'Technical and operational baseline for entities that store, process, or transmit cardholder data (CHD) or sensitive authentication data (SAD).',
    color: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    penaltyRisk: 'Monthly acquiring bank fines ($5,000–$100,000/mo), merchant revocation, mandatory forensic QSA investigations.',
    auditFrequency: 'Annual ROC (Report on Compliance) or SAQ D',
    totalControlsAnalyzed: 19
  },
  {
    id: 'hipaa',
    name: 'HIPAA Security Rule (45 CFR Part 160/164)',
    shortName: 'HIPAA',
    version: 'HHS OCR Security Rule & HITECH Act',
    governingBody: 'U.S. Department of Health and Human Services (HHS OCR)',
    scopeSummary: 'National standards to protect individuals\' electronic protected health information (ePHI) created, received, maintained, or transmitted by covered entities and business associates.',
    color: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    penaltyRisk: 'Civil monetary penalties up to $2,067,813/year per violation category; criminal prosecution under Title 18 for willful neglect.',
    auditFrequency: 'Continuous Risk Analysis / Periodic HHS OCR Audits',
    totalControlsAnalyzed: 18
  },
  {
    id: 'sox-itgc',
    name: 'Sarbanes-Oxley Act Section 404 (ITGC)',
    shortName: 'SOX ITGC',
    version: 'Public Law 107-204 / PCAOB AS 2201',
    governingBody: 'Securities and Exchange Commission (SEC) & PCAOB',
    scopeSummary: 'Information Technology General Controls supporting internal control over financial reporting (ICFR), focusing on database access, change management, and job scheduling.',
    color: '#F43F5E',
    accentBg: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.35)',
    penaltyRisk: 'SEC enforcement action, public material weakness disclosures, CEO/CFO personal criminal liability (Section 906).',
    auditFrequency: 'Quarterly & Annual External Financial Audit',
    totalControlsAnalyzed: 16
  },
  {
    id: 'gdpr',
    name: 'EU General Data Protection Regulation (Regulation 2016/679)',
    shortName: 'GDPR',
    version: 'Articles 25 & 32 (Privacy & Security by Design)',
    governingBody: 'European Data Protection Board (EDPB) & National DPAs',
    scopeSummary: 'State-of-the-art technical and organizational measures to ensure a level of security appropriate to the risk of processing personal data of EU residents.',
    color: '#6366F1',
    accentBg: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.35)',
    penaltyRisk: 'Fines up to €20,000,000 or 4% of total worldwide annual turnover; immediate processing ban orders.',
    auditFrequency: 'Continuous Compliance / Regulatory Investigation Driven',
    totalControlsAnalyzed: 17
  },
  {
    id: 'cmmc',
    name: 'Cybersecurity Maturity Model Certification (CMMC 2.0)',
    shortName: 'CMMC 2.0 / 800-171',
    version: 'Level 2 (Advanced / NIST SP 800-171 Rev 2)',
    governingBody: 'U.S. Department of Defense (DoD)',
    scopeSummary: 'Mandatory verification standard for defense industrial base (DIB) contractors handling Controlled Unclassified Information (CUI).',
    color: '#FB923C',
    accentBg: 'rgba(251, 146, 60, 0.12)',
    borderColor: 'rgba(251, 146, 60, 0.35)',
    penaltyRisk: 'Immediate debarment from DoD defense contracts; breach of contract under DFARS 252.204-7012.',
    auditFrequency: 'Triennial C3PAO Third-Party Assessment',
    totalControlsAnalyzed: 21
  }
];

export const COMPLIANCE_DOMAINS: ComplianceDomainMeta[] = [
  {
    id: 'iam',
    name: 'Identity, Authentication & Privileged Access',
    shortName: 'Identity & Access (IAM)',
    description: 'Hardware MFA enforcement, zero permanent admin access, automated deprovisioning, and quarterly access attestation.',
    iconName: 'Key',
    color: '#3B82F6'
  },
  {
    id: 'devsecops',
    name: 'Secure Software Development & CI/CD Pipelines',
    shortName: 'DevSecOps & Code Review',
    description: 'Two-person review, cryptographically signed commits, automated SAST/SCA security gates, and air-gapped deterministic builds.',
    iconName: 'GitPullRequest',
    color: '#10B981'
  },
  {
    id: 'secops',
    name: 'Cloud Infrastructure & Operating System Hardening',
    shortName: 'Cloud & Infrastructure SecOps',
    description: 'Infrastructure-as-code, CIS benchmark OS hardening, patch remediation SLAs, and default-deny egress policies.',
    iconName: 'Server',
    color: '#00E5FF'
  },
  {
    id: 'workstation',
    name: 'Workstation & Developer Endpoint Governance',
    shortName: 'Workstation & Endpoint Security',
    description: 'Zero-telemetry workstations (PureIDE), full-disk encryption, EDR sensors, and USB peripheral containment.',
    iconName: 'Laptop',
    color: '#A855F7'
  },
  {
    id: 'cryptography',
    name: 'Data Protection, Cryptography & Privacy Controls',
    shortName: 'Data & Cryptography',
    description: 'TLS 1.3 in-transit, AES-256 at-rest with customer KMS keys, automated tokenization, and irreversible crypto-shredding.',
    iconName: 'Lock',
    color: '#F59E0B'
  },
  {
    id: 'logging',
    name: 'Centralized Logging, SIEM & Threat Intelligence',
    shortName: 'Audit Logging & SIEM',
    description: 'Immutable 365-day WORM audit trails, real-time privilege escalation alerts, and continuous zero-day feed integration (Vantage).',
    iconName: 'Eye',
    color: '#F43F5E'
  },
  {
    id: 'incident-resp',
    name: 'Incident Response, Resilience & Disaster Recovery',
    shortName: 'Incident Response & Backups',
    description: 'Documented tabletop playbooks, immutable daily backups with tested recovery drills (RTO ≤4h), and 72h disclosure readiness.',
    iconName: 'AlertOctagon',
    color: '#6366F1'
  },
  {
    id: 'vendor-risk',
    name: 'Third-Party Vendor Governance & Supply Chain',
    shortName: 'Vendor Risk Management',
    description: 'Annual SOC 2/ISO vendor security reviews, binding Data Processing Agreements (DPA/BAA), and rapid vendor offboarding.',
    iconName: 'ShieldAlert',
    color: '#FB923C'
  }
];

export const AUDIT_CHECKLIST_DATA: AuditChecklistItem[] = [
  // ==========================================================================
  // DOMAIN 1: IDENTITY, AUTHENTICATION & ACCESS CONTROL (IAM & PAM)
  // ==========================================================================
  {
    id: 'CTRL-IAM-01',
    title: 'Phishing-Resistant Multi-Factor Authentication (MFA) Everywhere',
    domain: 'iam',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'Every human user logging into company email, cloud consoles (AWS/GCP/Azure), VPNs, GitHub/GitLab, or production servers MUST be required to use hardware/FIDO2 security keys or device WebAuthn (YubiKey, Touch ID, Windows Hello). Push notifications, SMS codes, and phone calls are strictly banned as primary factors for production or admin access.',
    auditorQuestion: 'Can an employee or contractor authenticate to any company service or cloud infrastructure without completing an MFA challenge? Show me your IAM policy enforcing MFA and demonstrate an attempted login with only a password.',
    whyItMatters: 'Over 85% of corporate credential compromises stem from credential-stuffing or adversary-in-the-middle (AiTM) reverse-proxy phishing that easily bypasses SMS and legacy authenticator app OTP codes.',
    mappings: {
      nist80053: 'IA-2(1), IA-2(2), IA-2(8), IA-8(1)',
      iso27001: 'A.5.15, A.8.5',
      soc2: 'CC6.1, CC6.2',
      pciDss: 'Req 8.3.1, Req 8.3.2, Req 8.3.6',
      hipaa: '45 CFR § 164.312(a)(2)(i), § 164.312(d)',
      soxItgc: 'AC-01 (Logical Security & Authentication)',
      gdpr: 'Article 32(1)(b) (Integrity & Confidentiality)',
      cmmc: 'IA.L2-3.5.3 (Multifactor for Privileged & Network Access)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'AWS: Attach an SCP denying all actions if aws:MultiFactorAuthPresent is false, except for managing MFA devices. Azure: Create Conditional Access Policy requiring "Require phishing-resistant multifactor authentication".',
      gitAndCiCd: 'GitHub Organization Settings -> Require two-factor authentication for all members. Disable SMS 2FA if enterprise plan permits.',
      osAndContainers: 'Configure pam_u2f for all sudo elevation and SSH bastion authentication.',
      endpointWorkstation: 'Enforce FIDO2 smartcard or Passkey logon in corporate Okta/Google Workspace SSO.'
    },
    evidenceArtifacts: [
      'Export of all Okta/Google Workspace users showing MFA status = Active (100% compliance)',
      'AWS IAM Credential Report (csv) with mfa_active = true for every active identity',
      'Screenshot of Conditional Access Policy blocking non-MFA authentication'
    ],
    sampleCliVerification: 'aws iam get-credential-report --output text --query "Content" | base64 -d | cut -d, -f1,4,8',
    remediationSlaDays: 3
  },
  {
    id: 'CTRL-IAM-02',
    title: 'Zero Permanent Administrative Access (Just-In-Time PAM / Least Privilege)',
    domain: 'iam',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'No engineer, developer, or IT administrator may have permanent root, Administrator, or Owner access in production. All high-privilege access must be requested on-demand, approved by a designated peer or lead, time-bounded to ≤4 hours, and automatically revoked when the session ends.',
    auditorQuestion: 'Show me the list of users who have permanent AdministratorAccess in AWS production right now. Walk me through the approval and ticket log for the last time someone needed production access.',
    whyItMatters: 'Standing privileges mean that a single compromised laptop immediately grants an attacker persistent, unmonitored keys to the entire corporate infrastructure.',
    mappings: {
      nist80053: 'AC-2(2), AC-6(1), AC-6(2), AC-6(5)',
      iso27001: 'A.8.2, A.8.4',
      soc2: 'CC6.1, CC6.3',
      pciDss: 'Req 7.1.1, Req 7.2.1, Req 7.2.2',
      hipaa: '45 CFR § 164.308(a)(3)(ii)(A)',
      soxItgc: 'AC-02 (Segregation of Incompatible Duties & Privileged IDs)',
      gdpr: 'Article 25(2) (Default Access Minimization)',
      cmmc: 'AC.L2-3.1.2 (Employ Least Privilege)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Use AWS IAM Identity Center (SSO) with Teleport, Boundary, or AWS PIM. Assign read-only roles by default; elevate to production-operator role only via Slack/PagerDuty approved workflow.',
      gitAndCiCd: 'No developers in the "Owners" group on GitHub organization. Repository write access granted strictly via role teams, not individual users.',
      osAndContainers: 'Disable root SSH login in /etc/ssh/sshd_config (PermitRootLogin no). Enforce individual sudo logging.',
      endpointWorkstation: 'Standard users operate as non-administrative accounts on corporate laptops.'
    },
    evidenceArtifacts: [
      'AWS IAM Identity Center permission set assignments showing zero permanent Admin bindings',
      'Audit log excerpt from PIM/Teleport showing access request, approval, and automated expiry',
      'Policy document defining segregation of duties between developers and production deployers'
    ],
    sampleCliVerification: 'aws iam list-entities-for-policy --policy-arn arn:aws:iam::aws:policy/AdministratorAccess',
    remediationSlaDays: 7
  },
  {
    id: 'CTRL-IAM-03',
    title: 'Automated Deprovisioning & Immediate Offboarding SLA (≤24 Hours)',
    domain: 'iam',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'When an employee, contractor, or intern leaves the company, an automated webhook from HR (BambooHR, Workday, Rippling) MUST suspend their primary SSO account, invalidate all active refresh tokens, revoke SSH/VPN keys, and reclaim hardware within 24 hours (or immediately for involuntary terminations).',
    auditorQuestion: 'Provide a list of the last 5 employees terminated. For each person, show me the HR termination timestamp and the matching timestamp when their Google Workspace/Okta and AWS accounts were suspended.',
    whyItMatters: 'Orphaned accounts of former staff are among the most common intrusion vectors for corporate ransomware, IP theft, and sabotage.',
    mappings: {
      nist80053: 'AC-2(3), PS-4, PS-5',
      iso27001: 'A.5.18, A.6.5',
      soc2: 'CC6.2, CC6.5',
      pciDss: 'Req 8.1.3, Req 8.1.4',
      hipaa: '45 CFR § 164.308(a)(3)(ii)(C)',
      soxItgc: 'AC-03 (Timely Removal of User Access)',
      gdpr: 'Article 32(1)(b)',
      cmmc: 'AC.L2-3.1.1 (Authorize and Revoke Authorized Users)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Configure SCIM provisioning between Okta/Entra and all downstream SaaS/cloud tools to cascade status = suspended instantly.',
      gitAndCiCd: 'Enforce SAML SSO with SCIM on GitHub Enterprise so terminating the SSO account immediately ejects them from all private repositories.',
      osAndContainers: 'Automate deletion of public keys in ~/.ssh/authorized_keys via central configuration management (Ansible/Puppet).',
      endpointWorkstation: 'MDM remote lock and wipe command issued via Jamf/InTune upon termination trigger.'
    },
    evidenceArtifacts: [
      'Sample of 5 terminated employees: HR separation notice matched against IdP deprovisioning log',
      'Documented Standard Operating Procedure (SOP) for voluntary vs involuntary offboarding',
      'Automated SCIM synchronization audit logs'
    ],
    sampleCliVerification: 'aws identitystore list-users --identity-store-id <id> --filters AttributePath=UserName,AttributeValue=former.employee',
    remediationSlaDays: 1
  },
  {
    id: 'CTRL-IAM-04',
    title: 'Quarterly User Access Review (UAR) with Manager Sign-Off',
    domain: 'iam',
    priority: 'HIGH',
    plainEnglishRequirement: 'Every 90 days, security leads must generate a complete inventory of all users with access to production databases, financial systems, source code, and cloud consoles. Department managers must formally review and sign off that every user still requires their granted permissions. Any stale access must be revoked within 5 business days.',
    auditorQuestion: 'Provide the signed sign-off sheets from your Q1, Q2, and Q3 user access reviews for production and GitHub. Who approved the access for the engineering team, and what evidence shows unneeded permissions were removed?',
    whyItMatters: 'Permissions drift over time as employees change teams or projects. Without regular recertification, excessive privilege accumulation creates massive breach blast radiuses.',
    mappings: {
      nist80053: 'AC-2(4), AC-6(9)',
      iso27001: 'A.5.16, A.8.2',
      soc2: 'CC6.2, CC6.3',
      pciDss: 'Req 7.2.5, Req 7.3.1',
      hipaa: '45 CFR § 164.308(a)(4)(ii)(B)',
      soxItgc: 'AC-04 (Periodic Review of User Access Rights)',
      gdpr: 'Article 25(1) (Privacy by Design)',
      cmmc: 'AC.L2-3.1.5 (Employ Least Privilege & Periodic Review)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Run AWS IAM Access Analyzer and export all IAM roles/users quarterly into a ticketing queue (Jira) assigned to engineering managers.',
      gitAndCiCd: 'Export GitHub organization members and collaborators via API; flag any user who has not committed or reviewed PRs in 90 days.',
      osAndContainers: 'Audit /etc/group and sudoers file across all production instances.',
      endpointWorkstation: 'Review MDM enrolled inventory against active HR roster.'
    },
    evidenceArtifacts: [
      'Completed Q1, Q2, Q3, Q4 User Access Review sign-off packets with manager digital signatures',
      'Jira tickets showing access revocation completed following review findings',
      'Written policy defining the 90-day review cadence and manager escalation protocol'
    ],
    sampleCliVerification: 'aws accessanalyzer list-analyzers && aws iam get-account-authorization-details --output json > uar_audit_dump.json',
    remediationSlaDays: 14
  },
  {
    id: 'CTRL-IAM-05',
    title: 'Elimination of Long-Lived Static API Keys & Centralized Secret Vaulting',
    domain: 'iam',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'No static, long-lived AWS Access Keys (AKIA...), database passwords, or third-party API tokens may be stored on developer laptops, in environment variables, or committed to Git. Applications must use IAM Roles (OIDC, IRSA, AWS Instance Profiles) with automatic credential rotation.',
    auditorQuestion: 'Do any developers have static AWS access keys active for more than 90 days? Show me how your production containers connect to the database without hardcoded credentials.',
    whyItMatters: 'Leaked static credentials in Git repositories or developer shell histories account for over 50% of major cloud infrastructure takeovers.',
    mappings: {
      nist80053: 'IA-5(1), SC-12, SC-13',
      iso27001: 'A.8.20, A.8.24',
      soc2: 'CC6.1, CC6.6',
      pciDss: 'Req 8.2.1, Req 8.6.1, Req 8.6.2',
      hipaa: '45 CFR § 164.312(a)(2)(iv)',
      soxItgc: 'AC-05 (Authentication & Cryptographic Credential Protection)',
      gdpr: 'Article 32(1)(a)',
      cmmc: 'IA.L2-3.5.7 (Enforce Credential Expiration & Disallow Static Keys)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Store all DB credentials in AWS Secrets Manager or HashiCorp Vault. Enable automatic 30-day rotation Lambda functions.',
      gitAndCiCd: 'Use GitHub Actions OIDC (OpenID Connect) with AWS assume-role. Do NOT store AWS_ACCESS_KEY_ID in GitHub Actions repository secrets.',
      osAndContainers: 'Use Kubernetes Service Accounts with AWS EKS Pod Identity (IRSA) so pods obtain short-lived 15-minute STS tokens.',
      endpointWorkstation: 'Deploy git-secrets / gitleaks pre-commit hooks on developer laptops to prevent accidental key commits.'
    },
    evidenceArtifacts: [
      'AWS IAM credential report showing 0 static keys with age > 90 days',
      'Terraform configuration of AWS Secrets Manager showing automated rotation enabled',
      'GitHub Actions workflow file using aws-actions/configure-aws-credentials with OIDC role-to-assume'
    ],
    sampleCliVerification: 'aws iam list-users --query "Users[*].UserName" --output text | tr "\\t" "\\n" | while read u; do aws iam list-access-keys --user-name "$u" --query "AccessKeyMetadata[?Status==\'Active\'].[UserName,AccessKeyId,CreateDate]" --output text; done',
    remediationSlaDays: 5
  },

  // ==========================================================================
  // DOMAIN 2: SECURE SOFTWARE DEVELOPMENT & CI/CD PIPELINES (DEVSECOPS)
  // ==========================================================================
  {
    id: 'CTRL-DEV-01',
    title: 'Mandatory Branch Protection & Two-Person Pull Request Approval',
    domain: 'devsecops',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'Direct pushes, force-pushes, and deletions to the main/production branches must be mathematically blocked. All production code changes must originate from a feature branch and require at least one independent, qualified peer review approval before merging.',
    auditorQuestion: 'Can an engineering lead push code directly to production without a peer reviewing it? Show me your GitHub branch protection rules for the main repository.',
    whyItMatters: 'Eliminates rogue insider changes, single-point-of-failure accidental deletions, and unverified backdoors introduced by a single compromised workstation.',
    mappings: {
      nist80053: 'CM-3, CM-5, SA-11(1)',
      iso27001: 'A.8.25, A.8.32',
      soc2: 'CC8.1 (Change Management & Authorization)',
      pciDss: 'Req 6.4.1, Req 6.4.2',
      hipaa: '45 CFR § 164.312(c)(1)',
      soxItgc: 'CM-01 (Program Change Authorization & Independent Review)',
      gdpr: 'Article 25(1) (Data Protection by Design)',
      cmmc: 'CM.L2-3.4.5 (Change Control & Testing)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Audit CloudFormation / Terraform repositories to ensure infra code also lives under mandatory PR enforcement.',
      gitAndCiCd: 'GitHub Repo Settings -> Branches -> Add branch protection rule for "main". Enable "Require a pull request before merging", "Require approvals" = 1 or 2, "Dismiss stale pull request approvals when new commits are pushed", "Require status checks to pass before merging", "Do not allow bypassing the above settings" (check for Admins).',
      osAndContainers: 'Production deployment manifests (Kubernetes Helm charts, Dockerfiles) must be tracked in the protected repo.',
      endpointWorkstation: 'Developers work exclusively in Git feature branches.'
    },
    evidenceArtifacts: [
      'Screenshot and JSON export of GitHub Branch Protection settings for main branch',
      'Sample of 5 recent pull requests showing approval timestamp, author, reviewer, and merge commit',
      'Written Software Development Life Cycle (SDLC) Change Management Policy'
    ],
    sampleCliVerification: 'gh api repos/{owner}/{repo}/branches/main/protection --jq "{required_approvals: .required_pull_request_reviews.required_approving_review_count, enforce_admins: .enforce_admins.enabled}"',
    remediationSlaDays: 1
  },
  {
    id: 'CTRL-DEV-02',
    title: 'Cryptographically Signed Git Commits (GPG / SSH Commit Verification)',
    domain: 'devsecops',
    priority: 'HIGH',
    plainEnglishRequirement: 'All commits pushed to corporate repositories and merged into release branches must be digitally signed with a verified developer GPG or SSH key. GitHub must be configured with "Require signed commits" enabled, and unsigned commits must be rejected at the Git push boundary.',
    auditorQuestion: 'How do you prove that a commit made by "alice@company.com" was actually created by Alice and not someone spoofing her Git author config? Show me the cryptographic signature on your latest release tag.',
    whyItMatters: 'Git author names and email addresses are trivial to forge in local .gitconfig. Without cryptographic signatures, an attacker with repository write access can commit backdoors under an executive or senior architect\'s name.',
    mappings: {
      nist80053: 'SI-7(1), CM-5(6), SC-12',
      iso27001: 'A.8.25, A.8.28',
      soc2: 'CC6.6, CC8.1',
      pciDss: 'Req 6.4.1, Req 6.5.1',
      hipaa: '45 CFR § 164.312(c)(2)',
      soxItgc: 'CM-02 (Integrity of Software Releases)',
      gdpr: 'Article 32(1)(b)',
      cmmc: 'SI.L2-3.14.1 (Identify and Protect System Integrity)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'CI/CD pipeline verifies git verify-commit HEAD before triggering production container build.',
      gitAndCiCd: 'GitHub Repo Settings -> Rulesets or Branch Protection -> Enable "Require signed commits". Developers configure git config --global user.signingkey and commit with git commit -S.',
      osAndContainers: 'Docker container images signed with Cosign / Sigstore keyless signing attached to GitHub Actions OIDC identity.',
      endpointWorkstation: 'Corporate laptop provisioning script installs and registers developer hardware security key (YubiKey) for Git commit signing.'
    },
    evidenceArtifacts: [
      'GitHub branch protection configuration showing "Require signed commits" checked',
      'Output of git log --show-signature -n 5 verifying GPG/SSH signatures on main branch',
      'Cosign signature verification log for production container image'
    ],
    sampleCliVerification: 'git log --show-signature -n 3 --format="Commit: %H%nAuthor: %an%nSigned: %G? (Key: %GK)%nDate: %ad%n"',
    remediationSlaDays: 7
  },
  {
    id: 'CTRL-DEV-03',
    title: 'Automated SAST & SCA Vulnerability Scanning in CI/CD Blocking Gates',
    domain: 'devsecops',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'Static Application Security Testing (SAST) and Software Composition Analysis (SCA / dependency vulnerability scanning) must run automatically on every pull request. Builds containing vulnerabilities with CVSS ≥ 7.0 or known exploited vulnerabilities (KEVs) must be automatically blocked from merging.',
    auditorQuestion: 'What automated tools scan your code for security bugs and vulnerable npm/Python/Go packages before deployment? Show me a pull request where a build was blocked due to a vulnerable dependency.',
    whyItMatters: 'Supply chain vulnerabilities in open-source third-party dependencies (like log4j, xz-utils, or polyfill.io) represent the single highest-volume remote code execution attack vector.',
    mappings: {
      nist80053: 'SA-11(2), SA-11(8), RA-5',
      iso27001: 'A.8.8, A.8.28',
      soc2: 'CC7.1, CC8.1',
      pciDss: 'Req 6.2.4, Req 6.3.2',
      hipaa: '45 CFR § 164.308(a)(1)(ii)(B)',
      soxItgc: 'CM-03 (Pre-Implementation Testing & Security Validation)',
      gdpr: 'Article 32(1)(d) (Regular Testing of Technical Measures)',
      cmmc: 'RA.L2-3.11.2 (Scan for Vulnerabilities & Remediate)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Integrate AWS Inspector or GCP Artifact Analysis to scan container images stored in ECR/GCR upon push.',
      gitAndCiCd: 'Add Semgrep, GitHub CodeQL, or Snyk to GitHub Actions workflow. Set failure threshold to fail-on-severity = high,critical.',
      osAndContainers: 'Integrate Trivy in Docker build workflow to reject base images with unpatched OS CVEs.',
      endpointWorkstation: 'Developers run local linting and dependency audits (npm audit, pip-audit) prior to pushing.'
    },
    evidenceArtifacts: [
      'GitHub Actions workflow YAML showing automated SAST (CodeQL/Semgrep) and SCA (Trivy/Snyk) steps',
      'Audit log showing a PR blocked due to CVSS > 7.0 finding',
      'Software Bill of Materials (SBOM) exported in CycloneDX / SPDX format for the current release'
    ],
    sampleCliVerification: 'npm audit --audit-level=high || echo "Vulnerabilities detected blocking pipeline"',
    remediationSlaDays: 5
  },
  {
    id: 'CTRL-DEV-04',
    title: 'Hermetic, Deterministic Builds & Internal Dependency Caching',
    domain: 'devsecops',
    priority: 'HIGH',
    plainEnglishRequirement: 'Production build runners must execute in isolated, reproducible environments. External package repositories (npm, PyPI, Maven, Docker Hub) must be mirrored through an internal artifact proxy cache (e.g. JFrog Artifactory) with package immutability, preventing typosquatting attacks and unexpected upstream package tampering.',
    auditorQuestion: 'How do you prevent a malicious or deleted npm package from corrupting your production build pipeline? Show me your artifact caching and package lockfile policy.',
    whyItMatters: 'Direct outbound calls to public registries during CI/CD builds allow attackers to deploy live typosquatting, dependency confusion, and account takeover payloads directly into production builds.',
    mappings: {
      nist80053: 'CM-3(2), SA-10, SI-7',
      iso27001: 'A.8.27, A.8.30',
      soc2: 'CC6.8, CC8.1',
      pciDss: 'Req 6.3.1, Req 6.3.3',
      hipaa: '45 CFR § 164.312(c)(1)',
      soxItgc: 'CM-04 (Source Code Repository & Build Reproducibility)',
      gdpr: 'Article 32(1)(b)',
      cmmc: 'CM.L2-3.4.1 (Baseline Configurations & Controlled Changes)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Deploy private AWS CodeArtifact or Artifactory repository proxying public registries.',
      gitAndCiCd: 'Enforce package-lock.json / pnpm-lock.yaml / poetry.lock commitment in Git. Use npm ci instead of npm install in CI pipelines.',
      osAndContainers: 'Pin container base images by immutable SHA256 digest (e.g., node@sha256:abc...) rather than mutable tags (:latest).',
      endpointWorkstation: 'PureIDE workstation policy routes local package queries through internal verified cache.'
    },
    evidenceArtifacts: [
      'CI/CD build script showing use of npm ci and pinned package lockfiles',
      'Artifactory / CodeArtifact repository configuration with quarantine rules for unvetted public packages',
      'Container Dockerfile showing base image pinned by sha256 digest'
    ],
    sampleCliVerification: 'head -n 20 package-lock.json | grep -E "(integrity|resolved)"',
    remediationSlaDays: 14
  },
  {
    id: 'CTRL-DEV-05',
    title: 'Strict Environment Isolation (Zero Production Data in Development)',
    domain: 'devsecops',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'Development, testing, staging, and production environments must be housed in strictly segregated cloud accounts or VPCs with distinct IAM boundaries and network firewalls. Real customer PII, financial records, or credentials MUST NEVER be copied or restored into development or testing environments.',
    auditorQuestion: 'Can developers access production customer data on their test servers or local workstations? What controls prevent a production database backup from being restored in staging?',
    whyItMatters: 'Developers routinely use lower-security tools, relaxed logging, and permissive keys in dev environments. Storing real customer data in dev leads to disastrous breaches via unmonitored staging test instances.',
    mappings: {
      nist80053: 'SC-7(4), AC-3(3), SA-11(5)',
      iso27001: 'A.8.31 (Separation of Development, Testing and Production)',
      soc2: 'CC6.6, CC7.1',
      pciDss: 'Req 6.5.1, Req 6.5.3, Req 6.5.4',
      hipaa: '45 CFR § 164.308(a)(1)(ii)(D), § 164.312(a)(1)',
      soxItgc: 'OPS-01 (Segregation of Production and Non-Production Environments)',
      gdpr: 'Article 25(1) & Article 32(1)(a) (Pseudonymization)',
      cmmc: 'SC.L2-3.13.1 (Separate Subnetworks for Non-Production)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Separate AWS Organizations accounts for Production, Staging, and Development. Zero cross-account IAM trust policies except for dedicated deployment automation.',
      gitAndCiCd: 'Staging and Production deploy keys stored in segregated GitHub environment secrets requiring separate approval protection.',
      osAndContainers: 'Synthetic test data generators (Faker, FactoryBot) used to populate non-production test fixtures.',
      endpointWorkstation: 'Developers never granted AWS access keys or VPN tunnels to production databases.'
    },
    evidenceArtifacts: [
      'AWS Organizations structure diagram showing distinct accounts for Dev, Staging, Prod',
      'Data Sanitization & Synthetic Data Policy signed by engineering leadership',
      'Database snapshot restore policy blocking cross-account restoration to non-production accounts'
    ],
    sampleCliVerification: 'aws organizations list-accounts --query "Accounts[*].[Name,Id,Status]" --output table',
    remediationSlaDays: 7
  },

  // ==========================================================================
  // DOMAIN 3: CLOUD INFRASTRUCTURE & OS HARDENING (SECOPS)
  // ==========================================================================
  {
    id: 'CTRL-OPS-01',
    title: 'Infrastructure-as-Code (IaC) & Zero Manual Console Changes',
    domain: 'secops',
    priority: 'HIGH',
    plainEnglishRequirement: '100% of cloud resources (VPCs, security groups, S3 buckets, IAM roles, databases) must be provisioned and updated exclusively via version-controlled Infrastructure-as-Code (Terraform, OpenTofu, CloudFormation). Manual configuration changes via the AWS/GCP web console are prohibited and automatically flagged as drift.',
    auditorQuestion: 'Show me your Terraform repository and the CI/CD pipeline that applies cloud infrastructure changes. How do you detect if an administrator manually modifies a security group in the AWS console?',
    whyItMatters: 'Manual "click-ops" in cloud consoles leads to undocumented misconfigurations, open S3 buckets, permissive security groups, and audit untraceability.',
    mappings: {
      nist80053: 'CM-2, CM-3, CM-8',
      iso27001: 'A.8.9 (Configuration Management), A.8.32',
      soc2: 'CC8.1',
      pciDss: 'Req 2.2.1, Req 2.2.2',
      hipaa: '45 CFR § 164.312(a)(1)',
      soxItgc: 'CM-05 (Infrastructure & Cloud Change Tracking)',
      gdpr: 'Article 32(1)(b)',
      cmmc: 'CM.L2-3.4.1 (Establish and Maintain Baseline Configurations)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Enable AWS Config with managed rules (e.g., s3-bucket-public-read-prohibited, restricted-ssh). Terraform state stored in encrypted, versioned S3 bucket with DynamoDB state locking.',
      gitAndCiCd: 'Deploy Atlantis or GitHub Actions with terraform plan in PR comments and terraform apply strictly upon merge to main.',
      osAndContainers: 'Immutable AMIs built via HashiCorp Packer and scanned before deployment.',
      endpointWorkstation: 'Developers test Terraform locally with tflint and checkov before opening PR.'
    },
    evidenceArtifacts: [
      'Terraform/OpenTofu repository commit log matching recent infrastructure deployment tickets',
      'AWS Config dashboard report showing 100% compliance with security baselines',
      'Automated drift detection report verifying zero out-of-band console changes'
    ],
    sampleCliVerification: 'aws configservice describe-compliance-by-config-rule --query "ComplianceByConfigRules[*].[ConfigRuleName,Compliance.ComplianceType]" --output table',
    remediationSlaDays: 7
  },
  {
    id: 'CTRL-OPS-02',
    title: 'Automated Patch Management SLAs (Critical ≤7 Days, High ≤30 Days)',
    domain: 'secops',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'Operating systems, container runtimes, web servers, and third-party libraries must be patched according to strict written SLAs: Critical zero-days & CISA KEVs patched within 7 calendar days; High severity (CVSS 7.0–8.9) patched within 30 days. Emergency out-of-band patch procedures must be operational 24/7.',
    auditorQuestion: 'Provide your vulnerability scan report from the past 30 days. Walk me through the remediation ticket for the last Critical CVE that affected your servers, and show that it was deployed within your 7-day SLA.',
    whyItMatters: 'Exploit code for critical vulnerabilities is weaponized within 48 to 72 hours of public disclosure. Slow patching cycles are the root cause of almost every mass corporate ransomware incident.',
    mappings: {
      nist80053: 'SI-2, RA-5',
      iso27001: 'A.8.8 (Management of Technical Vulnerabilities)',
      soc2: 'CC7.1, CC8.1',
      pciDss: 'Req 6.3.3 (Install Critical Security Patches Within One Month / One Week for KEVs)',
      hipaa: '45 CFR § 164.308(a)(1)(ii)(B)',
      soxItgc: 'OPS-02 (System Maintenance & Patch Application Timeliness)',
      gdpr: 'Article 32(1)(d)',
      cmmc: 'SI.L2-3.14.1 (Identify Flaws and Install Security Updates Within Timeframes)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Configure AWS Systems Manager (SSM) Patch Manager or AWS Inspector. Schedule weekly maintenance window patch baselines with automatic rollbacks.',
      gitAndCiCd: 'Integrate Exultia Kinetic or Dependabot to automatically open PRs for patched packages and run automated regression tests.',
      osAndContainers: 'Rebuild container images on a weekly schedule using updated base images (e.g., alpine or debian-slim with latest apt-get upgrade).',
      endpointWorkstation: 'MDM enforces automated OS patch updates (macOS/Windows) within 7 days of Apple/Microsoft release.'
    },
    evidenceArtifacts: [
      'AWS SSM Patch Manager compliance report showing 0 unpatched Critical vulnerabilities',
      'Historical patch deployment log showing remediation within 7 days of CVE publication',
      'Written Vulnerability & Patch Management Policy with defined SLA tier tables'
    ],
    sampleCliVerification: 'aws ssm describe-instance-patch-states --query "InstancePatchStates[*].[InstanceId,MissingCount,FailedCount,CriticalNonCompliantCount]" --output table',
    remediationSlaDays: 7
  },
  {
    id: 'CTRL-OPS-03',
    title: 'Default-Deny Ingress & Egress Network Firewalls (Zero Public Databases)',
    domain: 'secops',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'No database, cache, or internal management interface (PostgreSQL, MySQL, Redis, Elasticsearch, SSH, RDP) may be assigned a public IP address or open to 0.0.0.0/0. All database traffic must be confined to private subnets accessible only via internal VPC routing or mutual-TLS reverse proxies.',
    auditorQuestion: 'Are any database instances or Kubernetes control plane endpoints accessible directly over the public internet? Show me your AWS security group configuration for RDS.',
    whyItMatters: 'Publicly exposed databases are indexed by automated internet scanners (Shodan, Censys) within 15 minutes of launch and subjected to continuous brute-force attacks and zero-day probes.',
    mappings: {
      nist80053: 'SC-7, AC-4',
      iso27001: 'A.8.20, A.8.21',
      soc2: 'CC6.6, CC6.7',
      pciDss: 'Req 1.2.1, Req 1.3.1, Req 1.3.2',
      hipaa: '45 CFR § 164.312(e)(1)',
      soxItgc: 'OPS-03 (Network Perimeter Controls & Ingress Protection)',
      gdpr: 'Article 32(1)(a)',
      cmmc: 'SC.L2-3.13.1 (Monitor and Control Communications at External Boundaries)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Place all RDS and ElastiCache instances inside private DB subnets without Internet Gateways. Set Security Group ingress strictly from application cluster security group on port 5432/3306.',
      gitAndCiCd: 'Run automated IaC security checks (Checkov, tfsec) to fail any PR that sets publicly_accessible = true on RDS.',
      osAndContainers: 'Configure Kubernetes NetworkPolicies with default-deny ingress and egress across all namespaces.',
      endpointWorkstation: 'Developers connect to private resources exclusively through WireGuard/Tailscale VPN or AWS SSM Session Manager.'
    },
    evidenceArtifacts: [
      'AWS RDS describe-db-instances output proving PubliclyAccessible = false across all databases',
      'VPC Route Table diagram showing zero direct internet routes to database subnets',
      'Checkov scan report verifying no open ingress security groups in Terraform'
    ],
    sampleCliVerification: 'aws rds describe-db-instances --query "DBInstances[*].[DBInstanceIdentifier,PubliclyAccessible,Endpoint.Address]" --output table',
    remediationSlaDays: 1
  },

  // ==========================================================================
  // DOMAIN 4: WORKSTATION & DEVELOPER ENDPOINT GOVERNANCE
  // ==========================================================================
  {
    id: 'CTRL-WRK-01',
    title: 'Mandatory Full-Disk Encryption & Inactivity Screen Lock (≤10 Min)',
    domain: 'workstation',
    priority: 'HIGH',
    plainEnglishRequirement: '100% of company laptops and mobile devices must have hardware-backed full-disk encryption (FileVault 2 on macOS, BitLocker with TPM 2.0 on Windows) enabled with escrowed recovery keys. Screens must automatically lock and require password/biometric re-entry after ≤10 minutes of inactivity.',
    auditorQuestion: 'Provide an MDM report for all company laptops showing FileVault/BitLocker encryption status. What percentage of machines have encryption active?',
    whyItMatters: 'Lost or stolen laptops with unencrypted drives constitute an immediate reportable regulatory data breach under HIPAA, GDPR, and state data privacy laws.',
    mappings: {
      nist80053: 'SC-28(1), AC-11, PE-18',
      iso27001: 'A.8.1 (User Endpoint Devices), A.8.7',
      soc2: 'CC6.1, CC6.6',
      pciDss: 'Req 8.2.8, Req 9.4.1',
      hipaa: '45 CFR § 164.312(a)(2)(iii), § 164.312(a)(2)(iv)',
      soxItgc: 'AC-06 (Workstation Security & Automatic Terminal Lockout)',
      gdpr: 'Article 32(1)(a) (Encryption of Personal Data)',
      cmmc: 'PE.L2-3.10.1 (Physical Access), SC.L2-3.13.16 (Data at Rest on Endpoints)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'InTune / Jamf MDM policy enforces FileVault / BitLocker encryption before allowing access to corporate email or cloud resources.',
      gitAndCiCd: 'Zero code access permitted from unmanaged personal devices (BYOD).',
      osAndContainers: 'Laptops without MDM compliance blocked from corporate VPN/SSO via Conditional Access.',
      endpointWorkstation: 'Screen saver timeout set to 600 seconds with immediate password challenge on wake.'
    },
    evidenceArtifacts: [
      'MDM dashboard report showing 100% of active fleet laptops encrypted (FileVault/BitLocker)',
      'Escrowed recovery key management policy',
      'Screenshot of MDM configuration profile enforcing 10-minute inactivity lock'
    ],
    sampleCliVerification: '# macOS: fdesetup status | # Windows: manage-bde -status C:',
    remediationSlaDays: 2
  },
  {
    id: 'CTRL-WRK-02',
    title: 'Zero-Telemetry Developer Workstations & Hermetic IDE Tooling',
    domain: 'workstation',
    priority: 'HIGH',
    plainEnglishRequirement: 'Developer workstations must not leak proprietary source code, internal file structures, API keys, or keystrokes to third-party telemetry endpoints. Editor plugins and developer IDEs (e.g. PureIDE) must be compiled with tracking/telemetry probes disabled, and marketplace extensions must be vetted or mirrored internally.',
    auditorQuestion: 'How do you ensure developer IDEs, AI coding assistants, and local extensions do not upload proprietary customer code or confidential intellectual property to external cloud providers?',
    whyItMatters: 'Default desktop development tools and unvetted AI coding extensions continuously transmit keystrokes, active document contents, and repository metadata to commercial servers.',
    mappings: {
      nist80053: 'CM-7, SA-11, SC-7',
      iso27001: 'A.8.19 (Installation of Software), A.8.23',
      soc2: 'CC6.6, CC6.8',
      pciDss: 'Req 6.3.1, Req 6.4.3',
      hipaa: '45 CFR § 164.312(c)(1)',
      soxItgc: 'CM-06 (Control over Developer Workstation Utilities)',
      gdpr: 'Article 25(2) (Data Protection by Default)',
      cmmc: 'CM.L2-3.4.6 (Least Functionality & Nonessential Software Removal)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Block known telemetry endpoints at corporate secure web gateway / DNS proxy.',
      gitAndCiCd: 'Provide pre-built, verified developer containers and dev environments with zero analytics flags.',
      osAndContainers: 'PureOS container profiles with telemetry endpoints stripped during compilation.',
      endpointWorkstation: 'Deploy Exultia PureIDE configured for zero-telemetry and internal Artifactory extension routing.'
    },
    evidenceArtifacts: [
      'PureIDE workstation configuration profile showing telemetry.telemetryLevel = "off"',
      'DNS egress log demonstrating blocked connections to tracking endpoints',
      'Corporate AI and Third-Party Extension Security Governance Policy'
    ],
    sampleCliVerification: 'grep -rn "telemetry" ~/.config/Code/User/settings.json 2>/dev/null || echo "Check workstation config"',
    remediationSlaDays: 14
  },
  {
    id: 'CTRL-WRK-03',
    title: 'Centralized Endpoint Detection & Response (EDR) with Tamper Protection',
    domain: 'workstation',
    priority: 'HIGH',
    plainEnglishRequirement: 'All employee laptops and servers must run a centrally monitored EDR sensor (CrowdStrike, SentinelOne, Defender for Endpoint) with tamper protection enabled, real-time behavioral malware blocking, and 24/7 telemetry ingestion into the central security operations center (SOC).',
    auditorQuestion: 'Show me your EDR console. Are there any laptops currently offline or with the sensor disabled? Walk me through what happens when an EDR alert is triggered.',
    whyItMatters: 'Legacy signature-based antiviruses fail against modern fileless malware, memory injection, and PowerShell-based attacks. EDR provides the necessary behavioral telemetry to stop attacks before lateral movement occurs.',
    mappings: {
      nist80053: 'SI-3, SI-4, AU-6',
      iso27001: 'A.8.7 (Protection Against Malware), A.8.16',
      soc2: 'CC6.8, CC7.2',
      pciDss: 'Req 5.1.1, Req 5.2.1, Req 5.3.1',
      hipaa: '45 CFR § 164.308(a)(5)(ii)(B)',
      soxItgc: 'OPS-04 (Malware Defense & Threat Detection)',
      gdpr: 'Article 32(1)(b)',
      cmmc: 'SI.L2-3.14.2 (Provide Protection from Malicious Code)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Install EDR daemon on all EC2/GCE instances via base AMI or automated user-data script.',
      gitAndCiCd: 'Ensure CI/CD self-hosted runners run EDR sensor.',
      osAndContainers: 'Configure container runtime security (Falco, Sysdig) across Kubernetes nodes.',
      endpointWorkstation: 'MDM pushes EDR agent with policy forbidding non-admin uninstallation or service termination.'
    },
    evidenceArtifacts: [
      'EDR console fleet health report showing 100% active sensor coverage',
      'Screenshot demonstrating EDR Tamper Protection enabled across all endpoints',
      'SOC escalation procedure for high-severity behavioral threat detections'
    ],
    sampleCliVerification: '# Linux: systemctl is-active falcon-sensor || systemctl is-active sentinelone || echo "Sensor status check"',
    remediationSlaDays: 3
  },

  // ==========================================================================
  // DOMAIN 5: DATA PROTECTION, PRIVACY & CRYPTOGRAPHIC CONTROLS
  // ==========================================================================
  {
    id: 'CTRL-DAT-01',
    title: 'Mandatory TLS 1.3 Encryption-in-Transit & Strict HSTS Preload',
    domain: 'cryptography',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'All public web applications, APIs, and internal microservice communications must enforce TLS 1.3 (or strictly TLS 1.2 with forward-secrecy ciphers). Legacy TLS 1.0, 1.1, and plaintext HTTP must be permanently disabled. HTTP Strict Transport Security (HSTS) headers must be enforced with max-age ≥ 31536000 and includeSubDomains.',
    auditorQuestion: 'Show me an SSL Labs / testssl.sh report for your public domain. Are any deprecated TLS versions or weak cipher suites accepted by your load balancer?',
    whyItMatters: 'Weak SSL/TLS ciphers allow man-in-the-middle decryption of customer session cookies and sensitive financial or health records in transit.',
    mappings: {
      nist80053: 'SC-8, SC-13, SC-23',
      iso27001: 'A.8.20, A.8.24',
      soc2: 'CC6.6, CC6.7',
      pciDss: 'Req 4.1.1, Req 4.1.2',
      hipaa: '45 CFR § 164.312(e)(1), § 164.312(e)(2)(i)',
      soxItgc: 'OPS-05 (Data Transmission Security & Cryptographic Protocols)',
      gdpr: 'Article 32(1)(a) (Encryption of Personal Data in Transit)',
      cmmc: 'SC.L2-3.13.8 (Prevent Unauthorized Exfiltration & Encrypt in Transit)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'AWS ALB: Set Security Policy to ELBSecurityPolicy-TLS13-1-2-2021-06. Redirect HTTP (port 80) to HTTPS (port 443) with 301 permanent redirect.',
      gitAndCiCd: 'Configure Next.js / server headers to return Strict-Transport-Security: max-age=63072000; includeSubDomains; preload.',
      osAndContainers: 'Ingress NGINX: ssl_protocols TLSv1.2 TLSv1.3; ssl_prefer_server_ciphers on.',
      endpointWorkstation: 'Enforce HTTPS-only mode across all enterprise web browsers.'
    },
    evidenceArtifacts: [
      'Qualys SSL Labs report showing "A+" rating with TLS 1.0/1.1 disabled',
      'AWS ALB Listener configuration showing TLS 1.3 security policy',
      'Header audit output proving HSTS preload header response on all endpoints'
    ],
    sampleCliVerification: 'curl -I -s https://exultia.tech | grep -iE "(strict-transport-security|http/)"',
    remediationSlaDays: 2
  },
  {
    id: 'CTRL-DAT-02',
    title: 'Customer-Managed KMS Encryption-at-Rest with Automated Key Rotation',
    domain: 'cryptography',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'All production database volumes, S3 storage buckets, message queues, and snapshot backups must be encrypted at rest using AES-256 with Customer-Managed Keys (CMK) in AWS KMS or GCP Cloud KMS. Automatic annual cryptographic key rotation must be enabled on all KMS keys.',
    auditorQuestion: 'Provide proof that your production databases and S3 buckets are encrypted. Are you using default AWS managed keys or customer-managed KMS keys with automated rotation enabled?',
    whyItMatters: 'Using unencrypted storage means that an accidental snapshot share or unauthorized volume mount immediately exposes raw plaintext records to unauthorized parties.',
    mappings: {
      nist80053: 'SC-12, SC-13, SC-28',
      iso27001: 'A.8.24 (Use of Cryptography)',
      soc2: 'CC6.1, CC6.6',
      pciDss: 'Req 3.4.1, Req 3.5.1, Req 3.6.1',
      hipaa: '45 CFR § 164.312(a)(2)(iv)',
      soxItgc: 'OPS-06 (Protection of Sensitive Financial Data at Rest)',
      gdpr: 'Article 32(1)(a) (Encryption at Rest)',
      cmmc: 'SC.L2-3.13.16 (Protect Confidentiality of Data at Rest)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Terraform: aws_kms_key with enable_key_rotation = true. AWS S3: server_side_encryption_configuration with kms_master_key_id. AWS RDS: storage_encrypted = true.',
      gitAndCiCd: 'Enforce Checkov rule CKV_AWS_19 (Ensure all data stored in the S3 bucket is securely encrypted at rest).',
      osAndContainers: 'Database connection strings encrypt all columns containing sensitive records.',
      endpointWorkstation: 'Developer workstation drives encrypted with BitLocker / FileVault.'
    },
    evidenceArtifacts: [
      'AWS KMS get-key-rotation-status output verifying KeyRotationEnabled = true',
      'AWS RDS describe-db-instances output showing StorageEncrypted = true with KMS Key ARN',
      'AWS S3 bucket encryption audit report verifying 100% encrypted buckets'
    ],
    sampleCliVerification: 'aws kms get-key-rotation-status --key-id <kms-key-id> --query "KeyRotationEnabled"',
    remediationSlaDays: 5
  },
  {
    id: 'CTRL-DAT-03',
    title: 'Data Tokenization & Redaction of PII/Cardholder Data in Logs',
    domain: 'cryptography',
    priority: 'HIGH',
    plainEnglishRequirement: 'Sensitive personal identifiers (SSNs, tax IDs), full credit card Primary Account Numbers (PANs), passwords, and private health records MUST NEVER be written to application logs, debug traces, or analytics streams. When sensitive payment data is processed, it must be delegated to a PCI-certified tokenization vault (e.g. PayPal, Stripe).',
    auditorQuestion: 'Search your application log aggregator (Datadog, CloudWatch, OpenSearch) for credit card patterns (RegEx for PANs). Show me your data masking filters preventing passwords and PII from being logged.',
    whyItMatters: 'Developers frequently log full request payloads for debugging. If request bodies contain plaintext passwords or credit cards, the log aggregation platform becomes an unregulated high-risk breach honeypot.',
    mappings: {
      nist80053: 'SI-10, SC-28, AU-3(1)',
      iso27001: 'A.8.11 (Data Masking), A.8.12',
      soc2: 'CC6.1, CC6.5',
      pciDss: 'Req 3.3.1, Req 3.3.2, Req 3.4.2',
      hipaa: '45 CFR § 164.312(a)(2)(iv)',
      soxItgc: 'OPS-07 (Data Privacy & Integrity of Audit Records)',
      gdpr: 'Article 25(1) & Article 32(1)(a) (Pseudonymization)',
      cmmc: 'SC.L2-3.13.11 (Employ Cryptography to Mask Sensitive Information)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Configure CloudWatch Logs Data Protection policy with managed data identifiers for CreditCardNumber and SSN.',
      gitAndCiCd: 'Implement middleware payload redaction in Next.js / Express logging filters before writing to stdout.',
      osAndContainers: 'Audit container log drivers to ensure structured JSON logging masks sensitive fields.',
      endpointWorkstation: 'Developers test local APIs using dummy test credit card numbers.'
    },
    evidenceArtifacts: [
      'Log aggregator search query export showing 0 matches for 16-digit card regex',
      'Application logging filter source code showing password and token redaction logic',
      'PCI DSS SAQ A or Attestation of Compliance (AOC) from third-party payment processor'
    ],
    sampleCliVerification: 'aws logs put-data-protection-policy --log-group-name /aws/lambda/exultia-api --policy-document file://data-protection-policy.json',
    remediationSlaDays: 7
  },

  // ==========================================================================
  // DOMAIN 6: AUDIT LOGGING, SIEM & THREAT MONITORING
  // ==========================================================================
  {
    id: 'CTRL-LOG-01',
    title: 'Immutable 365-Day Audit Logging with WORM Bucket Protection',
    domain: 'logging',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'All authentication events, administrative actions, privilege escalations, network firewall changes, and data access requests must be centrally collected in an immutable, tamper-proof log repository (Write-Once-Read-Many / S3 Object Lock) and retained for at least 365 days (with at least 90 days immediately searchable).',
    auditorQuestion: 'Can an administrator who has compromised your AWS account delete or modify the CloudTrail audit logs to cover their tracks? Show me your S3 Object Lock or separate log archive account.',
    whyItMatters: 'Sophisticated adversaries prioritize deleting or modifying event logs immediately upon compromising an environment to prevent attribution and evade incident response forensics.',
    mappings: {
      nist80053: 'AU-2, AU-3, AU-4, AU-9(1), AU-11',
      iso27001: 'A.8.15 (Logging), A.8.17 (Clock Synchronization)',
      soc2: 'CC7.2, CC7.3',
      pciDss: 'Req 10.2.1, Req 10.3.1, Req 10.5.1, Req 10.7.1',
      hipaa: '45 CFR § 164.312(b)',
      soxItgc: 'OPS-08 (Retention & Protection of Audit Trails)',
      gdpr: 'Article 30 & Article 32(1)(b)',
      cmmc: 'AU.L2-3.3.1 (System Auditing & Audit Log Retention for 1 Year)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'AWS: Multi-Region CloudTrail writing to an S3 bucket in a separate dedicated Security/Log Archive AWS Account. Enable S3 Object Lock in Compliance Mode with 365-day retention.',
      gitAndCiCd: 'Export GitHub Enterprise audit logs to AWS S3 / Datadog via GitHub Audit Log Streaming.',
      osAndContainers: 'Configure auditd on Linux servers and fluent-bit shipping to central OpenSearch.',
      endpointWorkstation: 'NTP synchronization enforced across all endpoints to ensure accurate forensic timestamps.'
    },
    evidenceArtifacts: [
      'AWS CloudTrail configuration showing multi-region logging enabled with log file validation = true',
      'S3 bucket configuration showing S3 Object Lock Compliance Mode active for 365 days',
      'Screenshot of central SIEM dashboard displaying real-time log ingestion'
    ],
    sampleCliVerification: 'aws cloudtrail describe-trails --query "trailList[*].[Name,IsMultiRegionTrail,LogFileValidationEnabled,S3BucketName]" --output table',
    remediationSlaDays: 3
  },
  {
    id: 'CTRL-LOG-02',
    title: 'Real-Time Alerting on Anomalous Security Events & Privilege Escalation',
    domain: 'logging',
    priority: 'HIGH',
    plainEnglishRequirement: 'Automated SIEM alerts must immediately notify on-call security engineers (via PagerDuty, Slack, or SMS within ≤15 minutes) for critical events: root account login, IAM policy modifications, unauthorized API calls, multiple failed MFA attempts, or mass data exfiltration anomalies.',
    auditorQuestion: 'What happens when someone logs in as root or disables a security group in production? Show me the alert that fired the last time someone made an administrative change.',
    whyItMatters: 'Logs without active monitoring are useless during an active attack. Dwell time between initial breach and detection averages over 200 days unless automated real-time alarms trigger immediate response.',
    mappings: {
      nist80053: 'SI-4, AU-6, IR-4',
      iso27001: 'A.8.16 (Monitoring Activities)',
      soc2: 'CC7.2, CC7.3',
      pciDss: 'Req 10.4.1, Req 10.4.2, Req 10.6.1',
      hipaa: '45 CFR § 164.308(a)(1)(ii)(D)',
      soxItgc: 'OPS-09 (Monitoring & Escalation of System Exceptions)',
      gdpr: 'Article 33 (Breach Detection Within 72 Hours)',
      cmmc: 'SI.L2-3.14.3 (Monitor Systems for Inbound/Outbound Anomalies)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Enable AWS GuardDuty and Security Hub across all regions. Create CloudWatch Metric Filters for root account usage and trigger SNS topic sending to on-call pager.',
      gitAndCiCd: 'Configure GitHub Security Alerts (secret scanning, Dependabot) with immediate webhook notification.',
      osAndContainers: 'Falco rules configured to alert on shell spawn inside production container.',
      endpointWorkstation: 'EDR alerts route to central security Slack channel.'
    },
    evidenceArtifacts: [
      'CloudWatch Alarm configuration for RootAccountUsage and IAMPolicyChanges',
      'Sample PagerDuty incident record triggered by automated security alarm',
      'Documented 24/7 Security Operations Escalation Matrix'
    ],
    sampleCliVerification: 'aws cloudwatch describe-alarms --alarm-name-prefix "Security-" --query "MetricAlarms[*].[AlarmName,StateValue,ActionsEnabled]" --output table',
    remediationSlaDays: 5
  },

  // ==========================================================================
  // DOMAIN 7: INCIDENT RESPONSE, RESILIENCE & DISASTER RECOVERY
  // ==========================================================================
  {
    id: 'CTRL-IR-01',
    title: 'Documented Incident Response Plan & Annual Executive Tabletop Drill',
    domain: 'incident-resp',
    priority: 'HIGH',
    plainEnglishRequirement: 'The organization must maintain a written, actionable Incident Response (IR) plan detailing roles (Incident Commander, Lead Investigator, Legal Counsel, PR), evidence preservation guidelines, and communication channels. The executive team and technical leads must conduct an annual simulated tabletop exercise (e.g. ransomware or customer database leak).',
    auditorQuestion: 'Provide your written Incident Response Plan. When was your last tabletop exercise conducted, what scenario was tested, and what lessons learned were documented?',
    whyItMatters: 'During a real extortion or data breach crisis, teams panic and make fatal mistakes without pre-rehearsed decision trees, established legal counsel, and communication protocols.',
    mappings: {
      nist80053: 'IR-2, IR-3, IR-4, IR-8',
      iso27001: 'A.5.24, A.5.25, A.5.26, A.5.28',
      soc2: 'CC7.3, CC7.4',
      pciDss: 'Req 12.10.1, Req 12.10.2',
      hipaa: '45 CFR § 164.308(a)(6)(i), § 164.308(a)(6)(ii)',
      soxItgc: 'OPS-10 (Incident Response & Business Continuity Management)',
      gdpr: 'Article 33 & Article 34 (Mandatory 72-Hour DPA Notification)',
      cmmc: 'IR.L2-3.6.1 (Establish Operational Incident Handling Capability)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Pre-configure AWS Incident Manager and pre-authorized forensic snapshots via AWS Systems Manager.',
      gitAndCiCd: 'Out-of-band communication channel (e.g. Signal or external Slack workspace) designated in case corporate Google/Slack is compromised.',
      osAndContainers: 'Memory dump and disk snapshot automation scripts tested and ready.',
      endpointWorkstation: 'Network isolation command pre-tested in EDR dashboard.'
    },
    evidenceArtifacts: [
      'Documented Incident Response Plan (reviewed and approved within past 12 months)',
      'Tabletop Exercise After-Action Report (AAR) showing date, attendees, scenario, and remediation actions',
      '72-hour regulatory breach notification decision tree and contact roster'
    ],
    sampleCliVerification: '# Review IR document metadata and approval signatures',
    remediationSlaDays: 30
  },
  {
    id: 'CTRL-IR-02',
    title: 'Immutable Daily Backups with Quarterly Restoration Verification Drills',
    domain: 'incident-resp',
    priority: 'CRITICAL',
    plainEnglishRequirement: 'All production databases and file stores must be backed up automatically at least daily (with point-in-time recovery for transaction logs). Backups must be replicated to an isolated cloud region or account with S3 Object Lock / AWS Backup Vault Lock. A full restore test drill must be executed and documented at least quarterly with RTO ≤ 4 hours and RPO ≤ 1 hour.',
    auditorQuestion: 'Show me evidence that you successfully restored a production database backup within the past 90 days. What are your documented RTO and RPO metrics, and did the drill meet them?',
    whyItMatters: 'Backups that have never been restored fail when you need them most due to corrupted schemas, missing encryption keys, or permission errors. Unprotected backups are also targeted and deleted first by ransomware.',
    mappings: {
      nist80053: 'CP-9, CP-10, SI-12',
      iso27001: 'A.8.13 (Information Backup), A.8.14 (Redundancy)',
      soc2: 'A1.2, A1.3 (Availability & Data Recovery)',
      pciDss: 'Req 9.5.1, Req 10.5.3',
      hipaa: '45 CFR § 164.308(a)(7)(ii)(A), § 164.308(a)(7)(ii)(B)',
      soxItgc: 'OPS-11 (Data Backup Management & Recovery Assurance)',
      gdpr: 'Article 32(1)(c) (Ability to Restore Availability & Access)',
      cmmc: 'CP.L2-3.8.9 (Protect System Backups from Unauthorized Deletion)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'AWS Backup: Create backup plan running daily at 02:00 UTC with 35-day retention. Enable AWS Backup Vault Lock in Compliance mode to prevent accidental or malicious deletion.',
      gitAndCiCd: 'Database migration scripts tested against backup restores in staging CI.',
      osAndContainers: 'Database snapshots restored to an ephemeral staging RDS instance quarterly to verify data integrity and measure RTO.',
      endpointWorkstation: 'All code committed to remote GitHub; zero reliance on local laptop storage.'
    },
    evidenceArtifacts: [
      'AWS Backup console report showing successful daily backup job completions over the last 90 days',
      'Quarterly Backup Restoration Drill Log with measured RTO (< 4 hours) and RPO (< 1 hour)',
      'AWS Backup Vault Lock configuration showing compliance mode active'
    ],
    sampleCliVerification: 'aws backup list-recovery-points-by-backup-vault --backup-vault-name production-vault --query "RecoveryPoints[?Status==\'COMPLETED\'].[RecoveryPointArn,CreationDate,BackupVaultName]" --output table',
    remediationSlaDays: 3
  },

  // ==========================================================================
  // DOMAIN 8: VENDOR & THIRD-PARTY RISK MANAGEMENT
  // ==========================================================================
  {
    id: 'CTRL-VEN-01',
    title: 'Annual Third-Party Vendor Security Reviews (SOC 2 / ISO Recertification)',
    domain: 'vendor-risk',
    priority: 'HIGH',
    plainEnglishRequirement: 'Every third-party SaaS provider, cloud host, and sub-processor that stores or processes company or customer data (AWS, GitHub, Vercel, Turso, Stripe, Google) must undergo an annual security review. The company must obtain and evaluate their current SOC 2 Type II or ISO 27001 certificate before contract signing and annually thereafter.',
    auditorQuestion: 'Provide your vendor risk inventory. For your top 5 critical vendors, show me their current SOC 2 Type II reports and your internal security sign-off assessing their controls.',
    whyItMatters: 'Organizations inherit the security risks of their vendor supply chain. A breach at a SaaS sub-processor legally binds your organization to customer disclosures and regulatory fines.',
    mappings: {
      nist80053: 'SA-9, SR-3, SR-5',
      iso27001: 'A.5.19, A.5.20, A.5.21, A.5.22',
      soc2: 'CC9.2 (Assessing & Managing Vendor Risks)',
      pciDss: 'Req 12.8.1, Req 12.8.2, Req 12.8.4',
      hipaa: '45 CFR § 164.308(b)(1), § 164.314(a)(1)',
      soxItgc: 'OPS-12 (Third-Party Service Organization SOC 1 / SOC 2 Review)',
      gdpr: 'Article 28 (Processor Due Diligence & Auditing)',
      cmmc: 'SR.L2-3.11.1 (Supply Chain Risk Assessment)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'Download AWS SOC 2 Type II report annually from AWS Artifact for internal auditor compliance binder.',
      gitAndCiCd: 'Verify GitHub Enterprise SOC 2 Type II report annually.',
      osAndContainers: 'Ensure base OS container registries (Docker Hub, Chainguard) publish verified provenance signatures.',
      endpointWorkstation: 'Maintain centralized vendor inventory tracking contract dates and compliance certificate expiration.'
    },
    evidenceArtifacts: [
      'Master Vendor Inventory Spreadsheet tracking all third-party sub-processors, data types, and review dates',
      'Collected SOC 2 Type II / ISO 27001 reports for AWS, GitHub, Vercel, and Stripe',
      'Internal Vendor Security Evaluation Questionnaires (VSAQ) signed by Security Lead'
    ],
    sampleCliVerification: '# Review vendor inventory repository and certification folder',
    remediationSlaDays: 30
  },
  {
    id: 'CTRL-VEN-02',
    title: 'Binding Data Processing Agreements (DPA, BAA, & Standard Contractual Clauses)',
    domain: 'vendor-risk',
    priority: 'HIGH',
    plainEnglishRequirement: 'Prior to granting any third-party vendor access to customer personal data, cardholder data, or healthcare records, a legally binding Data Processing Agreement (DPA) must be executed. This must include HIPAA Business Associate Agreements (BAA), PCI-DSS responsibility matrices, and EU Standard Contractual Clauses (SCCs).',
    auditorQuestion: 'Show me the executed Business Associate Agreement (BAA) with your cloud provider (AWS/GCP) and your Data Processing Agreements with your analytics and hosting vendors.',
    whyItMatters: 'Without signed DPAs/BAAs, processing personal or health data violates HIPAA and GDPR by statutory default, exposing the organization to immediate regulatory penalties regardless of whether a breach occurred.',
    mappings: {
      nist80053: 'SA-9(1), PS-7',
      iso27001: 'A.5.20 (Addressing Security Within Supplier Agreements)',
      soc2: 'CC9.2',
      pciDss: 'Req 12.8.2, Req 12.8.5',
      hipaa: '45 CFR § 164.502(e)(2), § 164.504(e)',
      soxItgc: 'OPS-13 (Service Level Agreements & Legal Contracts)',
      gdpr: 'Article 28(3) (Mandatory Processor Contractual Clauses)',
      cmmc: 'SR.L2-3.11.2 (Flow Down Security Requirements to Subcontractors)'
    },
    implementationGuide: {
      cloudAwsGcpAzure: 'AWS: Accept AWS BAA in AWS Artifact console. Sign AWS Data Processing Addendum online.',
      gitAndCiCd: 'Execute GitHub DPA through GitHub Enterprise customer portal.',
      osAndContainers: 'Ensure vendor agreements explicitly define vulnerability disclosure responsibilities.',
      endpointWorkstation: 'Procurement policy forbids staff from entering credit cards for unauthorized SaaS tools without legal DPA review.'
    },
    evidenceArtifacts: [
      'Signed AWS Business Associate Agreement (BAA) accepted via AWS Artifact',
      'Executed Data Processing Agreements (DPA) with sub-processors',
      'Written Third-Party Vendor Security Policy with DPA execution mandate'
    ],
    sampleCliVerification: 'aws artifact get-report --report-id "report-id-for-soc" 2>/dev/null || echo "Check AWS Artifact console for BAA status"',
    remediationSlaDays: 14
  }
];
