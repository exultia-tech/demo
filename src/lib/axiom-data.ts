
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

export type AxiomLab = {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Terminal" | "Log Analysis" | "Web Exploit" | "Linux Basics";
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
      "2. Type 'nmap -sv -p 80,443 10.0.4.15' to detect service versions.",
      "3. Identify which web server version is running on port 80."
    ]
  },
  {
    id: "lab-privesc-1",
    title: "Privilege Escalation: Sudo Misconfigurations",
    difficulty: "Intermediate",
    type: "Terminal",
    objective: "Identify what commands your current user can run as root, and exploit them.",
    instructions: [
      "1. You are logged in as 'user'. Type 'whoami' to verify.",
      "2. Use 'sudo -l' to list allowed sudo commands.",
      "3. Notice that you can run '/usr/bin/vim' as root.",
      "4. Spawn a root shell using vim: 'sudo vim -c \":!/bin/sh\"'"
    ]
  },
  {
    id: "lab-web-1",
    title: "Web Exploit: Basic curl and API enumeration",
    difficulty: "Beginner",
    type: "Web Exploit",
    objective: "Use curl to interact with an unauthenticated API endpoint and extract the flag.",
    instructions: [
      "1. Perform a GET request to the local API: 'curl http://localhost:3000/api/users'",
      "2. Notice the response is forbidden.",
      "3. The API documentation says you can bypass auth using an internal header. Try: 'curl -H \"X-Forwarded-For: 127.0.0.1\" http://localhost:3000/api/users'",
      "4. Extract the admin token from the response."
    ]
  },
  {
    id: "lab-crypto-1",
    title: "Cryptography: OpenSSL Decryption",
    difficulty: "Intermediate",
    type: "Linux Basics",
    objective: "Decrypt a base64 encoded, AES-256-CBC encrypted file using OpenSSL.",
    instructions: [
      "1. You have a file named 'secret.enc'. List it using 'ls -la'.",
      "2. You know the password is 'axiom'.",
      "3. Decrypt the file: 'openssl enc -aes-256-cbc -d -in secret.enc -out secret.txt -k axiom -pbkdf2'",
      "4. Read the decrypted contents: 'cat secret.txt'"
    ]
  },
  {
    id: "lab-logs-1",
    title: "Log Analysis: Grep Authentication Logs",
    difficulty: "Beginner",
    type: "Log Analysis",
    objective: "Analyze an authentication log to find the IP address of a brute-force attacker.",
    instructions: [
      "1. A log file is located at '/var/log/auth.log'.",
      "2. Use grep to find failed login attempts: 'grep \"Failed password\" /var/log/auth.log'",
      "3. Count how many attempts came from the attacker using 'wc -l': 'grep \"Failed password\" /var/log/auth.log | wc -l'",
      "4. Identify the attacker's IP address."
    ]
  },
  {
    id: "lab-casp-arch-1",
    title: "Architecture Analysis: Zero Trust Firewall Rules",
    difficulty: "Advanced",
    type: "Terminal",
    objective: "Implement a micro-segmentation rule using iptables to strictly allow only HTTPS traffic to a database jump server.",
    instructions: [
      "1. Check current firewall rules: 'iptables -L'",
      "2. Add a rule to drop all incoming TCP traffic by default: 'iptables -A INPUT -p tcp -j DROP'",
      "3. Insert a rule to explicitly allow incoming HTTPS (port 443): 'iptables -I INPUT 1 -p tcp --dport 443 -j ACCEPT'",
      "4. Verify the new zero-trust perimeter logic: 'iptables -S'"
    ]
  }
];
