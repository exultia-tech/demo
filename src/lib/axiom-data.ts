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
      { type: "Book", name: "Official (ISC)2 CISSP Study Guide", url: "#" },
      { type: "Video", name: "Cybrary CISSP Course", url: "#" },
      { type: "Community", name: "Reddit /r/CISSP Discord", url: "#" }
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
  }
};

export type MockQuestion = {
  id: string;
  cert: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export const MOCK_EXAM_DB: MockQuestion[] = [
  {
    id: "q1",
    cert: "comptia-secplus",
    question: "A security analyst is investigating a compromised server. They want to capture the volatile memory before pulling the power cord. Which incident response concept does this describe?",
    options: ["Chain of Custody", "Order of Volatility", "Data Recovery", "Containment"],
    correctAnswer: 1,
    explanation: "Order of Volatility dictates that you must capture the most volatile data (like RAM/CPU registers) first before it is lost."
  },
  {
    id: "q2",
    cert: "isc2-cc",
    question: "Which access control model uses clearance levels (e.g., Top Secret, Secret, Confidential) to determine access to resources?",
    options: ["Discretionary Access Control (DAC)", "Role-Based Access Control (RBAC)", "Mandatory Access Control (MAC)", "Attribute-Based Access Control (ABAC)"],
    correctAnswer: 2,
    explanation: "Mandatory Access Control (MAC) uses strict labels and clearance levels assigned by an administrator, common in government and military environments."
  },
  {
    id: "q3",
    cert: "comptia-secplus",
    question: "Which cryptographic algorithm is a symmetric stream cipher widely used in older wireless protocols like WEP?",
    options: ["AES", "RC4", "RSA", "ECC"],
    correctAnswer: 1,
    explanation: "RC4 is a symmetric stream cipher that was famously used (and broken) in WEP."
  },
  {
    id: "q4",
    cert: "isc2-cissp",
    question: "In the context of Risk Management, transferring a risk usually involves:",
    options: ["Implementing a firewall", "Accepting the potential losses", "Purchasing cyber insurance", "Removing the vulnerable service"],
    correctAnswer: 2,
    explanation: "Transferring (or sharing) a risk means shifting the financial burden to a third party, typically through insurance or outsourcing."
  },
  {
    id: "q5",
    cert: "offensive-oscp",
    question: "When performing a Kerberoasting attack, what is the attacker actually attempting to extract and crack?",
    options: ["NTDS.dit hashes", "AS-REP responses for users without pre-auth", "TGS (Ticket Granting Service) tickets for service accounts", "The Golden Ticket"],
    correctAnswer: 2,
    explanation: "Kerberoasting targets Service Principal Names (SPNs) by requesting a TGS ticket and attempting to crack the ticket's RC4 encrypted portion offline to get the service account's plaintext password."
  }
];

export type AxiomLab = {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Terminal" | "Log Analysis" | "Web Exploit";
  objective: string;
  instructions: string[];
};

export const LABS_DB: AxiomLab[] = [
  {
    id: "lab-nmap-1",
    title: "Reconnaissance: Nmap Port Scanning",
    difficulty: "Beginner",
    type: "Terminal",
    objective: "Identify open ports and running services on a target server using nmap.",
    instructions: [
      "1. Type 'nmap 10.0.4.15' to perform a basic scan.",
      "2. Type 'nmap -sV -p 80,443 10.0.4.15' to detect service versions.",
      "3. Identify which web server version is running on port 80."
    ]
  },
  {
    id: "lab-logs-1",
    title: "Incident Response: Identifying SQLi in Apache Logs",
    difficulty: "Intermediate",
    type: "Log Analysis",
    objective: "Analyze a snippet of Apache access logs to identify the exact timestamp an attacker successfully extracted data via SQL injection.",
    instructions: [
      "1. Search the logs for common SQLi payloads (e.g., UNION SELECT, WAITFOR DELAY).",
      "2. Correlate the payloads with a 200 OK HTTP response.",
      "3. Note the IP address of the attacker."
    ]
  }
];
