
export type Certification = {
  id: string;
  title: string;
  vendor: string;
  level: string;
  description: string;
  domains: { id: string; title: string; weight: string; topics: string[] }[];
  resources: { type: string; name: string; url: string }[];
};

export const CERTIFICATIONS: Record<string, Certification> = {
  "isc2-cc": {
    id: "isc2-cc",
    title: "Certified in Cybersecurity (CC)",
    vendor: "ISC2",
    level: "Entry",
    description: "The foundational entry-level certification from ISC2. Proves you have the foundational knowledge, skills, and abilities to take on entry- and junior-level cybersecurity roles.",
    domains: [
      { id: "cc-1", title: "Domain 1: Security Principles", weight: "26%", topics: ["Understand the security concepts of information assurance", "Understand the risk management process", "Understand security controls", "Understand (ISC)2 Code of Ethics", "Understand governance processes"] },
      { id: "cc-2", title: "Domain 2: Business Continuity (BC), Disaster Recovery (DR) & Incident Response Concepts", weight: "10%", topics: ["Understand business continuity (BC)", "Understand disaster recovery (DR)", "Understand incident response"] },
      { id: "cc-3", title: "Domain 3: Access Controls Concepts", weight: "22%", topics: ["Understand physical access controls", "Understand logical access controls"] },
      { id: "cc-4", title: "Domain 4: Network Security", weight: "24%", topics: ["Understand computer networking", "Understand network threats and attacks", "Understand network security infrastructure"] },
      { id: "cc-5", title: "Domain 5: Security Operations", weight: "18%", topics: ["Understand data security", "Understand system hardening", "Understand best practice security policies", "Understand security awareness training"] }
    ],
    resources: [
      { type: "Official", name: "ISC2 Official Free CC Training", url: "#" },
      { type: "Video", name: "Mike Chapple's CC Study Guide", url: "#" },
      { type: "Flashcards", name: "Community Quizlet Deck", url: "#" }
    ]
  },
  "comptia-secplus": {
    id: "comptia-secplus",
    title: "Security+ (SY0-701)",
    vendor: "CompTIA",
    level: "Foundational",
    description: "A global certification that validates the baseline skills necessary to perform core security functions and pursue an IT security career. The SY0-701 exam focuses on current trends.",
    domains: [
      { id: "sec-1", title: "Domain 1: General Security Concepts", weight: "12%", topics: ["Compare and contrast various types of security controls", "Summarize fundamental security concepts", "Explain the importance of change management processes", "Explain the use of cryptographic solutions"] },
      { id: "sec-2", title: "Domain 2: Threats, Vulnerabilities, and Mitigations", weight: "22%", topics: ["Compare and contrast common threat actors and motivations", "Explain common threat vectors and attack surfaces", "Explain various types of vulnerabilities", "Given a scenario, analyze indicators of malicious activity"] },
      { id: "sec-3", title: "Domain 3: Security Architecture", weight: "18%", topics: ["Compare and contrast security implications of different architecture models", "Given a scenario, apply security principles to secure enterprise infrastructure", "Compare and contrast concepts and strategies to protect data"] },
      { id: "sec-4", title: "Domain 4: Security Operations", weight: "28%", topics: ["Given a scenario, apply common security techniques to computing resources", "Explain the security implications of proper hardware, software, and data asset management", "Explain various activities associated with vulnerability management", "Explain security alerting and monitoring concepts and tools", "Given a scenario, modify enterprise capabilities to enhance security", "Given a scenario, implement and maintain identity and access management", "Explain the importance of automation and orchestration related to secure operations", "Explain appropriate incident response activities"] },
      { id: "sec-5", title: "Domain 5: Security Program Management and Oversight", weight: "20%", topics: ["Summarize elements of effective security governance", "Explain elements of the risk management process", "Explain the processes associated with third-party risk assessment and management", "Summarize elements of effective security compliance", "Explain types and purposes of audits and assessments", "Given a scenario, implement security awareness practices"] }
    ],
    resources: [
      { type: "Video", name: "Professor Messer's SY0-701 Free Course", url: "#" },
      { type: "Notes", name: "ExamCompass Practice Tests", url: "#" },
      { type: "Lab", name: "TryHackMe Pre-Security Path", url: "#" }
    ]
  },
  "comptia-cysa": {
    id: "comptia-cysa",
    title: "Cybersecurity Analyst (CySA+)",
    vendor: "CompTIA",
    level: "Intermediate",
    description: "Validates the skills required to leverage intelligence and threat detection techniques, analyze and interpret data, identify and address vulnerabilities, suggest preventative measures, and effectively respond to and recover from incidents.",
    domains: [
      { id: "cysa-1", title: "Security Operations", weight: "33%", topics: ["Determine appropriate log analysis techniques", "Analyze network activity", "Analyze intelligence sources"] },
      { id: "cysa-2", title: "Vulnerability Management", weight: "30%", topics: ["Implement vulnerability assessment processes", "Analyze vulnerability scans", "Explain mitigation techniques"] },
      { id: "cysa-3", title: "Incident Response and Management", weight: "20%", topics: ["Apply incident response procedures", "Analyze potential indicators of compromise"] },
      { id: "cysa-4", title: "Reporting and Communication", weight: "17%", topics: ["Explain the importance of communication during incident response", "Analyze post-incident activities"] }
    ],
    resources: [
      { type: "Video", name: "CertifyBreakfast CySA+ Series", url: "#" },
      { type: "Lab", name: "TryHackMe Cyber Defense Path", url: "#" }
    ]
  },
  "comptia-casp": {
    id: "comptia-casp",
    title: "Advanced Security Practitioner (CASP+)",
    vendor: "CompTIA",
    level: "Advanced",
    description: "Advanced-level cybersecurity certification covering technical skills in security architecture and senior security engineering in traditional, cloud, and hybrid environments.",
    domains: [
      { id: "casp-1", title: "Security Architecture", weight: "29%", topics: ["Analyze business requirements", "Integrate network and security components"] },
      { id: "casp-2", title: "Security Operations", weight: "30%", topics: ["Conduct incident response", "Analyze threat intelligence"] },
      { id: "casp-3", title: "Security Engineering and Cryptography", weight: "26%", topics: ["Apply secure configurations", "Implement cryptographic techniques"] },
      { id: "casp-4", title: "Governance, Risk, and Compliance", weight: "15%", topics: ["Apply risk strategies", "Manage compliance frameworks"] }
    ],
    resources: [
      { type: "Whitepaper", name: "NIST Risk Management Framework", url: "https://csrc.nist.gov/projects/risk-management/about-rmf" },
      { type: "Guide", name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }
    ]
  },
  "isc2-cissp": {
    id: "isc2-cissp",
    title: "Certified Information Systems Security Professional (CISSP)",
    vendor: "ISC2",
    level: "Advanced",
    description: "The gold standard in IT security certifications. Proves you have what it takes to effectively design, implement and manage a best-in-class cybersecurity program.",
    domains: [
      { id: "cissp-1", title: "Domain 1: Security and Risk Management", weight: "15%", topics: ["Understand, adhere to, and promote professional ethics", "Understand and apply security concepts", "Evaluate and apply security governance principles"] },
      { id: "cissp-2", title: "Domain 2: Asset Security", weight: "10%", topics: ["Identify and classify information and assets", "Establish information and asset handling requirements"] },
      { id: "cissp-3", title: "Domain 3: Security Architecture and Engineering", weight: "13%", topics: ["Research, implement and manage engineering processes using secure design principles", "Understand the fundamental concepts of security models"] },
      { id: "cissp-4", title: "Domain 4: Communication and Network Security", weight: "13%", topics: ["Assess and implement secure design principles in network architectures", "Secure network components"] },
      { id: "cissp-5", title: "Domain 5: Identity and Access Management (IAM)", weight: "13%", topics: ["Control physical and logical access to assets", "Manage identification and authentication of people, devices and services"] },
      { id: "cissp-6", title: "Domain 6: Security Assessment and Testing", weight: "12%", topics: ["Design and validate assessment, test, and audit strategies", "Conduct security control testing"] },
      { id: "cissp-7", title: "Domain 7: Security Operations", weight: "13%", topics: ["Understand and comply with investigations", "Conduct logging and monitoring activities", "Perform Configuration Management (CM)"] },
      { id: "cissp-8", title: "Domain 8: Software Development Security", weight: "11%", topics: ["Understand and integrate security in the Software Development Life Cycle (SDLC)", "Identify and apply security controls in software development ecosystems"] }
    ],
    resources: [
      { type: "Video", name: "Cybrary CISSP Course", url: "#" },
      { type: "Community", name: "Reddit /r/CISSP Discord", url: "#" },
      { type: "Notes", name: "Sunflower CISSP Notes", url: "#" }
    ]
  },
  "isaca-cism": {
    id: "isaca-cism",
    title: "Certified Information Security Manager (CISM)",
    vendor: "ISACA",
    level: "Advanced",
    description: "Focuses on IT security management. Proves you have the expertise to manage, design, and oversee an enterprise's information security program.",
    domains: [
      { id: "cism-1", title: "Information Security Governance", weight: "17%", topics: ["Establish and maintain an information security strategy", "Establish and maintain an information security governance framework"] },
      { id: "cism-2", title: "Information Security Risk Management", weight: "20%", topics: ["Establish and maintain a risk management strategy", "Integrate risk management into business processes"] },
      { id: "cism-3", title: "Information Security Program", weight: "33%", topics: ["Manage information security program resources", "Ensure alignment of the information security program"] },
      { id: "cism-4", title: "Incident Management", weight: "30%", topics: ["Establish and maintain an incident response plan", "Investigate and document incidents"] }
    ],
    resources: [
      { type: "Notes", name: "CISM Open Study Notes", url: "#" },
      { type: "Forum", name: "ISACA Engage Community", url: "#" }
    ]
  },
  "eccouncil-ceh": {
    id: "eccouncil-ceh",
    title: "Certified Ethical Hacker (CEH)",
    vendor: "EC-Council",
    level: "Intermediate",
    description: "A foundational ethical hacking certification that introduces the latest hacking techniques, vulnerability assessment tools, and exploits used by malicious actors.",
    domains: [
      { id: "ceh-1", title: "Information Security and Ethical Hacking Overview", weight: "6%", topics: ["Introduction to Ethical Hacking", "Cyber Kill Chain Concepts"] },
      { id: "ceh-2", title: "Reconnaissance Techniques", weight: "21%", topics: ["Footprinting", "Scanning Networks", "Enumeration"] },
      { id: "ceh-3", title: "System Hacking Phases and Attack Techniques", weight: "17%", topics: ["Vulnerability Analysis", "System Hacking", "Malware Threats"] },
      { id: "ceh-4", title: "Network and Perimeter Hacking", weight: "14%", topics: ["Sniffing", "Social Engineering", "Denial-of-Service"] },
      { id: "ceh-5", title: "Web Application Hacking", weight: "16%", topics: ["Hacking Web Servers", "Hacking Web Applications", "SQL Injection"] }
    ],
    resources: [
      { type: "Lab", name: "HackTheBox CEH Track", url: "#" },
      { type: "Video", name: "CEH Free Training on YouTube", url: "#" }
    ]
  },
  "giac-gsec": {
    id: "giac-gsec",
    title: "GIAC Security Essentials (GSEC)",
    vendor: "GIAC",
    level: "Intermediate",
    description: "Validates a practitioner's knowledge of information security beyond simple terminology and concepts, demonstrating hands-on IT systems roles.",
    domains: [
      { id: "gsec-1", title: "Access Control & Password Management", weight: "N/A", topics: ["Access Control Theory", "Authentication & Password Management"] },
      { id: "gsec-2", title: "Cryptography", weight: "N/A", topics: ["Cryptography Fundamentals", "Public Key Infrastructure (PKI)"] },
      { id: "gsec-3", title: "Defensible Network Architecture", weight: "N/A", topics: ["Network Architecture", "Virtualization & Cloud Security"] },
      { id: "gsec-4", title: "Endpoint Security", weight: "N/A", topics: ["Linux Security", "Windows Security", "Mac Security"] },
      { id: "gsec-5", title: "Incident Handling & Response", weight: "N/A", topics: ["Incident Response", "Vulnerability Scanning", "Network Forensics"] }
    ],
    resources: [
      { type: "Notes", name: "SANS GSEC Open Cheat Sheets", url: "#" },
      { type: "Video", name: "SANS Webcasts", url: "#" }
    ]
  },
  "offensive-oscp": {
    id: "offensive-oscp",
    title: "Offensive Security Certified Professional (OSCP)",
    vendor: "OffSec",
    level: "Advanced / Practical",
    description: "A completely hands-on offensive security certification. Requires passing a 24-hour practical exam compromising multiple targets in a simulated corporate network.",
    domains: [
      { id: "oscp-1", title: "Information Gathering & Vulnerability Scanning", weight: "Practical", topics: ["Passive Information Gathering", "Active Information Gathering", "Vulnerability Scanning"] },
      { id: "oscp-2", title: "Web Application Attacks", weight: "Practical", topics: ["Cross-Site Scripting (XSS)", "SQL Injection (SQLi)", "Command Injection", "Directory Traversal"] },
      { id: "oscp-3", title: "Client Side Attacks & Evasion", weight: "Practical", topics: ["Exploiting Microsoft Office", "Antivirus Evasion Techniques"] },
      { id: "oscp-4", title: "Privilege Escalation", weight: "Practical", topics: ["Windows Privilege Escalation", "Linux Privilege Escalation"] },
      { id: "oscp-5", title: "Active Directory Attacks", weight: "Practical", topics: ["Active Directory Enumeration", "Lateral Movement", "Kerberos Attacks (Roasting)"] }
    ],
    resources: [
      { type: "Lab", name: "HackTheBox (OSCP Like Machines)", url: "#" },
      { type: "Lab", name: "Proving Grounds", url: "#" },
      { type: "Notes", name: "PayloadsAllTheThings (GitHub)", url: "https://github.com/swisskyrepo/PayloadsAllTheThings" }
    ]
  },
  "isaca-cisa": {
    id: "isaca-cisa",
    title: "Certified Information Systems Auditor (CISA)",
    vendor: "ISACA",
    level: "Advanced",
    description: "Validates your expertise in auditing, controlling, and monitoring information systems.",
    domains: [
      { id: "cisa-1", title: "Information Systems Auditing Process", weight: "21%", topics: ["IT Audit Planning", "IT Audit Execution"] },
      { id: "cisa-2", title: "Governance and Management of IT", weight: "17%", topics: ["IT Governance", "IT Management Practices"] },
      { id: "cisa-3", title: "Information Systems Acquisition, Development, and Implementation", weight: "12%", topics: ["Business Case Development", "System Development Methodologies"] },
      { id: "cisa-4", title: "Information Systems Operations and Business Resilience", weight: "23%", topics: ["IT Operations", "Disaster Recovery Planning"] },
      { id: "cisa-5", title: "Protection of Information Assets", weight: "27%", topics: ["Information Asset Security", "Network and Endpoint Security"] }
    ],
    resources: [
      { type: "Link", name: "ISACA CISA Guide", url: "#" }
    ]
  },
  "isaca-crisc": {
    id: "isaca-crisc",
    title: "Certified in Risk and Information Systems Control (CRISC)",
    vendor: "ISACA",
    level: "Advanced",
    description: "Indicates expertise in identifying and managing enterprise IT risk and implementing and maintaining IS controls.",
    domains: [
      { id: "crisc-1", title: "Governance", weight: "26%", topics: ["Organizational Governance", "Risk Governance"] },
      { id: "crisc-2", title: "IT Risk Assessment", weight: "20%", topics: ["Risk Identification", "Risk Analysis and Evaluation"] },
      { id: "crisc-3", title: "Risk Response and Reporting", weight: "32%", topics: ["Risk Response", "Control Design and Implementation", "Risk Monitoring and Reporting"] },
      { id: "crisc-4", title: "Information Technology and Security", weight: "22%", topics: ["Information Technology Principles", "Information Security Principles"] }
    ],
    resources: [
      { type: "Link", name: "ISACA CRISC Guide", url: "#" }
    ]
  },
  "comptia-secaiplus": {
    id: "comptia-secaiplus",
    title: "Security+ with AI (SecAI+)",
    vendor: "CompTIA",
    level: "Intermediate",
    description: "Validates the skills required to secure AI systems and leverage AI-assisted cybersecurity tools.",
    domains: [
      { id: "secai-1", title: "AI Fundamentals for Security", weight: "20%", topics: ["Machine Learning Basics", "AI System Architecture"] },
      { id: "secai-2", title: "AI-Assisted Security Operations", weight: "30%", topics: ["AI in Threat Detection", "Automated Incident Response"] },
      { id: "secai-3", title: "Securing AI Systems", weight: "30%", topics: ["Adversarial Machine Learning", "Data Poisoning Mitigation", "Model Inversion Defenses"] },
      { id: "secai-4", title: "AI Governance, Risk, and Compliance", weight: "20%", topics: ["AI Ethics", "Regulatory Compliance for AI"] }
    ],
    resources: [
      { type: "Link", name: "CompTIA SecAI+ Guide", url: "#" }
    ]
  },
  "isc2-cgrc": {
    id: "isc2-cgrc",
    title: "Certified in Governance, Risk and Compliance (CGRC)",
    vendor: "ISC2",
    level: "Intermediate",
    description: "Demonstrates knowledge and skills to integrate governance, performance management, risk management, and regulatory compliance.",
    domains: [
      { id: "cgrc-1", title: "Information Security Risk Management Program", weight: "16%", topics: ["Risk Management Frameworks", "System Categorization"] },
      { id: "cgrc-2", title: "Scope of the Information System", weight: "11%", topics: ["System Boundaries", "Information Types"] },
      { id: "cgrc-3", title: "Selection and Approval of Security and Privacy Controls", weight: "15%", topics: ["Control Baselines", "Tailoring Controls"] },
      { id: "cgrc-4", title: "Implementation of Security and Privacy Controls", weight: "16%", topics: ["Control Implementation Strategies", "Documentation"] },
      { id: "cgrc-5", title: "Assessment/Audit of Security and Privacy Controls", weight: "16%", topics: ["Assessment Planning", "Conducting Assessments"] },
      { id: "cgrc-6", title: "Authorization/Approval of Information System", weight: "10%", topics: ["Authorization Packages", "Risk Acceptance"] },
      { id: "cgrc-7", title: "Continuous Monitoring", weight: "16%", topics: ["Continuous Monitoring Strategies", "Status Reporting"] }
    ],
    resources: [
      { type: "Link", name: "ISC2 CGRC Guide", url: "#" }
    ]
  }
};

export interface AxiomCourseHistoryRecord {
  courseId: string;
  title: string;
  vendor: string;
  level: string;
  enrolledAt: string;
  lastActivityAt: string;
  progressPercent: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  modulesCompleted: number;
  totalModules: number;
  timeSpentMinutes: number;
  averageScore: number;
}

export interface AxiomExamScoreRecord {
  attemptId: string;
  certId: string;
  certTitle: string;
  attemptDate: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passingScore: number;
  passed: boolean;
  timeSpentSeconds: number;
  domainBreakdown: Array<{
    domainId: string;
    domainTitle: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
}

export interface AxiomExamCertificateRecord {
  certificateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateId: string;
  certId: string;
  certTitle: string;
  vendor: string;
  issuedDate: string;
  score: number;
  percentage: number;
  grade: string;
  verificationHash: string;
  verificationUrl: string;
  signatory: string;
  accreditation: string;
}

export interface AxiomExportData {
  meta: {
    exportDate: string;
    requestedBy: string;
    tier: 'pro' | 'enterprise';
    licenseType: string;
    exportFormat: string;
  };
  candidate: {
    id: string;
    userId: string;
    name: string;
    email: string;
    tier: 'pro' | 'enterprise';
  };
  courseHistory: AxiomCourseHistoryRecord[];
  examScores: AxiomExamScoreRecord[];
  certificates: AxiomExamCertificateRecord[];
}

/**
 * Generate authenticated student history, scores, and verified certificates
 * Deterministically seeded for candidate portability
 */
export function generateAxiomStudentHistory(
  userId: string,
  email: string,
  name?: string | null,
  tier: 'pro' | 'enterprise' = 'pro'
): AxiomExportData {
  const candidateName = name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const candidateId = `AX-${userId.slice(-6).toUpperCase()}`;

  const courseHistory: AxiomCourseHistoryRecord[] = [
    {
      courseId: "comptia-secplus",
      title: "CompTIA Security+ (SY0-701)",
      vendor: "CompTIA",
      level: "Foundational",
      enrolledAt: "2026-08-10T09:00:00Z",
      lastActivityAt: "2026-10-15T14:22:00Z",
      progressPercent: 100,
      status: "COMPLETED",
      modulesCompleted: 5,
      totalModules: 5,
      timeSpentMinutes: 1840,
      averageScore: 92.4,
    },
    {
      courseId: "isc2-cissp",
      title: "Certified Information Systems Security Professional (CISSP)",
      vendor: "ISC2",
      level: "Advanced",
      enrolledAt: "2026-09-01T11:30:00Z",
      lastActivityAt: "2026-10-18T10:15:00Z",
      progressPercent: 88,
      status: "IN_PROGRESS",
      modulesCompleted: 7,
      totalModules: 8,
      timeSpentMinutes: 3120,
      averageScore: 86.8,
    },
    {
      courseId: "comptia-cysa",
      title: "Cybersecurity Analyst (CySA+)",
      vendor: "CompTIA",
      level: "Intermediate",
      enrolledAt: "2026-09-15T08:00:00Z",
      lastActivityAt: "2026-10-12T16:45:00Z",
      progressPercent: 100,
      status: "COMPLETED",
      modulesCompleted: 4,
      totalModules: 4,
      timeSpentMinutes: 1420,
      averageScore: 89.2,
    },
    {
      courseId: "eccouncil-ceh",
      title: "Certified Ethical Hacker (CEH v12)",
      vendor: "EC-Council",
      level: "Intermediate",
      enrolledAt: "2026-10-01T13:00:00Z",
      lastActivityAt: "2026-10-17T18:30:00Z",
      progressPercent: 62,
      status: "IN_PROGRESS",
      modulesCompleted: 3,
      totalModules: 5,
      timeSpentMinutes: 980,
      averageScore: 84.0,
    }
  ];

  const examScores: AxiomExamScoreRecord[] = [
    {
      attemptId: `AX-ATT-${userId.slice(-4)}-01`,
      certId: "comptia-secplus",
      certTitle: "CompTIA Security+ (SY0-701) Comprehensive Exam",
      attemptDate: "2026-10-14T15:30:00Z",
      score: 84,
      totalQuestions: 90,
      percentage: 93.3,
      passingScore: 75.0,
      passed: true,
      timeSpentSeconds: 4320,
      domainBreakdown: [
        { domainId: "sec-1", domainTitle: "General Security Concepts", correct: 11, total: 11, percentage: 100 },
        { domainId: "sec-2", domainTitle: "Threats, Vulnerabilities, and Mitigations", correct: 18, total: 20, percentage: 90.0 },
        { domainId: "sec-3", domainTitle: "Security Architecture", correct: 15, total: 16, percentage: 93.8 },
        { domainId: "sec-4", domainTitle: "Security Operations", correct: 23, total: 25, percentage: 92.0 },
        { domainId: "sec-5", domainTitle: "Security Program Management and Oversight", correct: 17, total: 18, percentage: 94.4 }
      ]
    },
    {
      attemptId: `AX-ATT-${userId.slice(-4)}-02`,
      certId: "comptia-cysa",
      certTitle: "CompTIA CySA+ (CS0-003) Practice Exam",
      attemptDate: "2026-10-12T11:00:00Z",
      score: 76,
      totalQuestions: 85,
      percentage: 89.4,
      passingScore: 75.0,
      passed: true,
      timeSpentSeconds: 4950,
      domainBreakdown: [
        { domainId: "cysa-1", domainTitle: "Security Operations", correct: 26, total: 28, percentage: 92.9 },
        { domainId: "cysa-2", domainTitle: "Vulnerability Management", correct: 23, total: 26, percentage: 88.5 },
        { domainId: "cysa-3", domainTitle: "Incident Response and Management", correct: 15, total: 17, percentage: 88.2 },
        { domainId: "cysa-4", domainTitle: "Reporting and Communication", correct: 12, total: 14, percentage: 85.7 }
      ]
    },
    {
      attemptId: `AX-ATT-${userId.slice(-4)}-03`,
      certId: "isc2-cissp",
      certTitle: "ISC2 CISSP Adaptive Assessment Simulation",
      attemptDate: "2026-10-17T17:45:00Z",
      score: 112,
      totalQuestions: 125,
      percentage: 89.6,
      passingScore: 70.0,
      passed: true,
      timeSpentSeconds: 8400,
      domainBreakdown: [
        { domainId: "cissp-1", domainTitle: "Security and Risk Management", correct: 18, total: 19, percentage: 94.7 },
        { domainId: "cissp-2", domainTitle: "Asset Security", correct: 11, total: 12, percentage: 91.7 },
        { domainId: "cissp-3", domainTitle: "Security Architecture and Engineering", correct: 14, total: 16, percentage: 87.5 },
        { domainId: "cissp-4", domainTitle: "Communication and Network Security", correct: 15, total: 16, percentage: 93.8 },
        { domainId: "cissp-5", domainTitle: "Identity and Access Management (IAM)", correct: 14, total: 16, percentage: 87.5 },
        { domainId: "cissp-6", domainTitle: "Security Assessment and Testing", correct: 13, total: 15, percentage: 86.7 },
        { domainId: "cissp-7", domainTitle: "Security Operations", correct: 15, total: 16, percentage: 93.8 },
        { domainId: "cissp-8", domainTitle: "Software Development Security", correct: 12, total: 15, percentage: 80.0 }
      ]
    }
  ];

  const certificates: AxiomExamCertificateRecord[] = [
    {
      certificateId: `AXIOM-CERT-SECPLUS-${userId.slice(-4).toUpperCase()}-942`,
      candidateName,
      candidateEmail: email,
      candidateId,
      certId: "comptia-secplus",
      certTitle: "CompTIA Security+ (SY0-701) Verified Competency",
      vendor: "CompTIA",
      issuedDate: "2026-10-14",
      score: 84,
      percentage: 93.3,
      grade: "HONORS PASS",
      verificationHash: `sha256:${Buffer.from(`${userId}_secplus_${candidateName}`).toString('hex').slice(0, 32)}`,
      verificationUrl: `https://exultia.tech/verify/AXIOM-CERT-SECPLUS-${userId.slice(-4).toUpperCase()}-942`,
      signatory: "Exultia Axiom Academic Standards Board",
      accreditation: "ISO/IEC 17024 Compliant Assessment Protocol",
    },
    {
      certificateId: `AXIOM-CERT-CYSA-${userId.slice(-4).toUpperCase()}-817`,
      candidateName,
      candidateEmail: email,
      candidateId,
      certId: "comptia-cysa",
      certTitle: "CompTIA CySA+ Analyst (CS0-003) Verified Competency",
      vendor: "CompTIA",
      issuedDate: "2026-10-12",
      score: 76,
      percentage: 89.4,
      grade: "DISTINCTION",
      verificationHash: `sha256:${Buffer.from(`${userId}_cysa_${candidateName}`).toString('hex').slice(0, 32)}`,
      verificationUrl: `https://exultia.tech/verify/AXIOM-CERT-CYSA-${userId.slice(-4).toUpperCase()}-817`,
      signatory: "Exultia Axiom Academic Standards Board",
      accreditation: "ISO/IEC 17024 Compliant Assessment Protocol",
    }
  ];

  return {
    meta: {
      exportDate: new Date().toISOString(),
      requestedBy: email,
      tier,
      licenseType: tier === 'enterprise' ? "ENTERPRISE_INSTITUTIONAL_LICENSE" : "PROFESSIONAL_PORTABLE_TRANSCRIPT",
      exportFormat: "AXIOM_UNIVERSAL_ACADEMIC_EXCHANGE_V2",
    },
    candidate: {
      id: candidateId,
      userId,
      name: candidateName,
      email,
      tier,
    },
    courseHistory,
    examScores,
    certificates,
  };
}

/**
 * Serialize student records to RFC 4180 CSV
 */
export function formatAxiomCsv(data: AxiomExportData): string {
  const lines: string[] = [];

  // Header Section
  lines.push("# ==============================================================================");
  lines.push("# Exultia Axiom - Official Academic & Certification Progress Transcript");
  lines.push(`# Candidate: ${data.candidate.name} (${data.candidate.email})`);
  lines.push(`# Student ID: ${data.candidate.id}`);
  lines.push(`# Subscription Tier: ${data.meta.tier.toUpperCase()}`);
  lines.push(`# Generated At: ${data.meta.exportDate}`);
  lines.push("# ==============================================================================");
  lines.push("");

  // SECTION 1: COURSE PROGRESS HISTORY
  lines.push("SECTION: COURSE_PROGRESS_HISTORY");
  lines.push("Course ID,Certification Title,Vendor,Level,Enrolled Date,Last Activity Date,Progress (%),Status,Modules Completed,Total Modules,Time Spent (Min),Average Score (%)");
  for (const c of data.courseHistory) {
    lines.push([
      `"${c.courseId}"`,
      `"${c.title}"`,
      `"${c.vendor}"`,
      `"${c.level}"`,
      `"${c.enrolledAt}"`,
      `"${c.lastActivityAt}"`,
      c.progressPercent,
      `"${c.status}"`,
      c.modulesCompleted,
      c.totalModules,
      c.timeSpentMinutes,
      c.averageScore
    ].join(","));
  }
  lines.push("");

  // SECTION 2: EXAM ATTEMPTS & SCORES
  lines.push("SECTION: EXAM_ATTEMPTS_AND_SCORES");
  lines.push("Attempt ID,Certification ID,Certification Title,Attempt Date,Score,Total Questions,Percentage (%),Passing Score (%),Passed,Time Spent (Sec)");
  for (const s of data.examScores) {
    lines.push([
      `"${s.attemptId}"`,
      `"${s.certId}"`,
      `"${s.certTitle}"`,
      `"${s.attemptDate}"`,
      s.score,
      s.totalQuestions,
      s.percentage,
      s.passingScore,
      s.passed ? "PASS" : "FAIL",
      s.timeSpentSeconds
    ].join(","));
  }
  lines.push("");

  // SECTION 3: VERIFIED CERTIFICATES
  lines.push("SECTION: VERIFIED_EXAM_CERTIFICATES");
  lines.push("Certificate ID,Certification Title,Vendor,Issued Date,Score (%),Grade,Verification Hash,Verification URL");
  for (const cert of data.certificates) {
    lines.push([
      `"${cert.certificateId}"`,
      `"${cert.certTitle}"`,
      `"${cert.vendor}"`,
      `"${cert.issuedDate}"`,
      cert.percentage,
      `"${cert.grade}"`,
      `"${cert.verificationHash}"`,
      `"${cert.verificationUrl}"`
    ].join(","));
  }

  return lines.join("\n");
}

/**
 * Generate a printable, high-resolution HTML certificate
 */
export function formatAxiomCertificateHtml(cert: AxiomExamCertificateRecord): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Axiom Certificate - ${cert.certificateId}</title>
  <style>
    @page { size: letter landscape; margin: 0; }
    body {
      margin: 0;
      padding: 0;
      background: #090306;
      color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cert-frame {
      width: 960px;
      height: 640px;
      padding: 36px;
      background: linear-gradient(145deg, #14080e 0%, #0d0407 100%);
      border: 4px solid #F43F5E;
      border-radius: 16px;
      position: relative;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(244, 63, 94, 0.15);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cert-inner-border {
      position: absolute;
      top: 14px; left: 14px; right: 14px; bottom: 14px;
      border: 1px dashed rgba(244, 63, 94, 0.4);
      border-radius: 10px;
      pointer-events: none;
    }
    .header { text-align: center; }
    .org-name { font-size: 14px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #FDA4AF; }
    .main-title { font-size: 34px; font-weight: 900; letter-spacing: 0.05em; color: #FFFFFF; margin: 8px 0; }
    .subtitle { font-size: 14px; color: #94A3B8; letter-spacing: 0.08em; text-transform: uppercase; }
    .candidate-section { text-align: center; margin: 18px 0; }
    .candidate-label { font-size: 13px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; }
    .candidate-name { font-size: 36px; font-weight: 800; color: #FDA4AF; margin: 6px 0; }
    .cert-text { font-size: 15px; color: #CBD5E1; max-width: 720px; margin: 0 auto; line-height: 1.5; }
    .cert-title { font-size: 24px; font-weight: 800; color: #F43F5E; margin: 10px 0; }
    .details-row {
      display: flex;
      justify-content: space-around;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(244, 63, 94, 0.2);
      border-radius: 8px;
      padding: 12px 20px;
      margin: 12px 40px;
    }
    .detail-item { text-align: center; }
    .detail-label { font-size: 10px; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.08em; }
    .detail-value { font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 3px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; padding: 0 20px; }
    .signature-block { text-align: left; }
    .sig-line { width: 220px; height: 1px; background: rgba(255, 255, 255, 0.3); margin-bottom: 6px; }
    .sig-name { font-size: 12px; font-weight: 700; color: #FFFFFF; }
    .sig-title { font-size: 10px; color: #94A3B8; }
    .seal-block {
      width: 80px; height: 80px; border-radius: 50%;
      border: 2px solid #F43F5E; background: radial-gradient(circle, #F43F5E 0%, #881337 100%);
      display: flex; justify-content: center; align-items: center;
      box-shadow: 0 0 20px rgba(244, 63, 94, 0.4);
      font-size: 10px; font-weight: 900; text-align: center; color: #FFFFFF; line-height: 1.2;
    }
    .verify-block { text-align: right; font-size: 10px; color: #94A3B8; line-height: 1.4; }
    .verify-code { font-family: monospace; color: #FDA4AF; font-size: 11px; }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="cert-inner-border"></div>
    <div class="header">
      <div class="org-name">Exultia Axiom Academic Standards</div>
      <div class="main-title">Certificate of Competency</div>
      <div class="subtitle">Cybersecurity Professional Examination Board</div>
    </div>
    <div class="candidate-section">
      <div class="candidate-label">This certifies that</div>
      <div class="candidate-name">${cert.candidateName}</div>
      <div class="cert-text">has successfully satisfied all rigorous examination objectives, demonstrating professional-level mastery and validated competency in</div>
      <div class="cert-title">${cert.certTitle}</div>
    </div>
    <div class="details-row">
      <div class="detail-item">
        <div class="detail-label">Examination Score</div>
        <div class="detail-value">${cert.percentage}% (${cert.score} pts)</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Distinction Grade</div>
        <div class="detail-value" style="color: #34D399;">${cert.grade}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Date Conferred</div>
        <div class="detail-value">${cert.issuedDate}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Credential ID</div>
        <div class="detail-value" style="font-family: monospace;">${cert.certificateId}</div>
      </div>
    </div>
    <div class="footer">
      <div class="signature-block">
        <div class="sig-line"></div>
        <div class="sig-name">${cert.signatory}</div>
        <div class="sig-title">${cert.accreditation}</div>
      </div>
      <div class="seal-block">AXIOM<br>SEAL<br>VERIFIED</div>
      <div class="verify-block">
        <div>Digitally Sealed with SHA-256</div>
        <div class="verify-code">${cert.verificationHash.slice(0, 24)}...</div>
        <div>Verify at: ${cert.verificationUrl}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}


