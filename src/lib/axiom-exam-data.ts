import "server-only";
import generatedQuestions from './axiom-questions.json';

export type MockQuestion = {
  id: string;
  cert: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain?: string;
  difficulty?: string;
};

export const MOCK_EXAM_DB: MockQuestion[] = [
  // Security+ Questions
  { id: "q1", cert: "comptia-secplus", question: "A security analyst is investigating a compromised server. They want to capture the volatile memory before pulling the power cord. Which incident response concept does this describe?", options: ["Chain of Custody", "Order of Volatility", "Data Recovery", "Containment"], correctAnswer: 1, explanation: "Order of Volatility dictates that you must capture the most volatile data (like RAM/CPU registers) first before it is lost." },
  { id: "q3", cert: "comptia-secplus", question: "Which cryptographic algorithm is a symmetric stream cipher widely used in older wireless protocols like WEP?", options: ["AES", "RC4", "RSA", "ECC"], correctAnswer: 1, explanation: "RC4 is a symmetric stream cipher that was famously used (and broken) in WEP." },
  { id: "q8", cert: "comptia-secplus", question: "What is the primary purpose of a DNS sinkhole?", options: ["To speed up DNS resolution", "To route traffic away from known malicious domains", "To encrypt DNS queries", "To load balance web servers"], correctAnswer: 1, explanation: "A DNS sinkhole intercepts requests for malicious domains and returns a false IP, preventing the host from connecting to the attacker's server." },
  { id: "q9", cert: "comptia-secplus", question: "Which of the following describes a vulnerability where an application fails to properly validate user input before writing it to a log file, potentially allowing an attacker to forge log entries?", options: ["Cross-Site Scripting (XSS)", "SQL Injection", "Log Injection", "Directory Traversal"], correctAnswer: 2, explanation: "Log injection occurs when unvalidated user input is written to logs, allowing attackers to forge entries or inject malicious scripts for log viewers." },
  
  // ISC2 CC Questions
  { id: "q2", cert: "isc2-cc", question: "Which access control model uses clearance levels (e.g., Top Secret, Secret, Confidential) to determine access to resources?", options: ["Discretionary Access Control (DAC)", "Role-Based Access Control (RBAC)", "Mandatory Access Control (MAC)", "Attribute-Based Access Control (ABAC)"], correctAnswer: 2, explanation: "Mandatory Access Control (MAC) uses strict labels and clearance levels assigned by an administrator, common in government and military environments." },
  { id: "q10", cert: "isc2-cc", question: "Which core principle of the CIA triad ensures that data has not been altered in an unauthorized manner?", options: ["Confidentiality", "Integrity", "Availability", "Authentication"], correctAnswer: 1, explanation: "Integrity guarantees that information is accurate and has not been modified by unauthorized entities." },
  
  // CISSP Questions
  { id: "q4", cert: "isc2-cissp", question: "In the context of Risk Management, transferring a risk usually involves:", options: ["Implementing a firewall", "Accepting the potential losses", "Purchasing cyber insurance", "Removing the vulnerable service"], correctAnswer: 2, explanation: "Transferring (or sharing) a risk means shifting the financial burden to a third party, typically through insurance or outsourcing." },
  { id: "q11", cert: "isc2-cissp", question: "In a federated identity environment using SAML 2.0, which entity verifies the user's credentials and issues the assertion?", options: ["Service Provider (SP)", "Identity Provider (IdP)", "Relying Party (RP)", "Active Directory"], correctAnswer: 1, explanation: "The Identity Provider (IdP) is responsible for authenticating the user and generating the SAML assertion." },
  { id: "q12", cert: "isc2-cissp", question: "Which fire suppression system is most appropriate for a server room filled with critical IT equipment?", options: ["Wet pipe sprinkler", "Dry pipe sprinkler", "Clean agent gas (e.g., FM-200)", "Water foam extinguisher"], correctAnswer: 2, explanation: "Clean agent gases like FM-200 or Inergen suppress fires without leaving a residue or using water, protecting the electronic equipment." },
  
  // OSCP Questions
  { id: "q5", cert: "offensive-oscp", question: "When performing a Kerberoasting attack, what is the attacker actually attempting to extract and crack?", options: ["NTDS.dit hashes", "AS-REP responses for users without pre-auth", "TGS (Ticket Granting Service) tickets for service accounts", "The Golden Ticket"], correctAnswer: 2, explanation: "Kerberoasting targets Service Principal Names (SPNs) by requesting a TGS ticket and attempting to crack the ticket's RC4 encrypted portion offline to get the service account's plaintext password." },
  { id: "q13", cert: "offensive-oscp", question: "An attacker uploads a PHP web shell as 'shell.php.jpg' to bypass a poorly configured file extension filter. Which vulnerability allows this file to be executed on an Apache server?", options: ["Local File Inclusion (LFI)", "Apache AddHandler misconfiguration", "Command Injection", "Directory Traversal"], correctAnswer: 1, explanation: "If Apache is configured with 'AddHandler application/x-httpd-php .php', it will execute PHP code in ANY file that contains '.php' in the name, even if it ends in '.jpg'." },
  { id: "q14", cert: "offensive-oscp", question: "Which command would you use to spawn a fully interactive TTY shell from a dumb reverse shell using Python?", options: ["python -c 'import pty; pty.spawn(\"/bin/bash\")'", "python -c 'import os; os.system(\"/bin/bash\")'", "python -m http.server", "python3 /bin/bash"], correctAnswer: 0, explanation: "Using the pty module in Python is a standard way to upgrade a dumb shell into a fully interactive TTY." },
  
  // CEH Questions
  { id: "q6", cert: "eccouncil-ceh", question: "Which phase of the ethical hacking process involves using Nmap to find open ports and services on a target network?", options: ["Reconnaissance/Footprinting", "Scanning and Enumeration", "Gaining Access", "Maintaining Access"], correctAnswer: 1, explanation: "Scanning and Enumeration actively probes the network to discover live hosts, open ports, and services." },
  { id: "q15", cert: "eccouncil-ceh", question: "An attacker sends fragmented packets to a target to bypass the IDS/IPS rules. What type of evasion technique is this?", options: ["Session Hijacking", "MAC Spoofing", "IP Fragmentation", "ARP Poisoning"], correctAnswer: 2, explanation: "IP fragmentation breaks packets into smaller pieces to evade signature-based detection mechanisms that fail to properly reassemble them." },
  
  // CISM / CySA+ / GSEC
  { id: "q7", cert: "isaca-cism", question: "What is the primary objective of an information security governance framework?", options: ["To eliminate all organizational risk", "To ensure security strategies align with business objectives", "To select technical security controls", "To automate incident response"], correctAnswer: 1, explanation: "The primary goal of governance is to ensure that security initiatives align with and support the broader goals of the business." },
  { id: "q16", cert: "comptia-cysa", question: "During an incident response, you find a beaconing signal connecting to an external IP over port 443 every 5 minutes. The packet sizes are exactly the same. What does this most likely indicate?", options: ["Legitimate Windows Updates", "Command and Control (C2) traffic", "An aggressive port scan", "A DDoS attack"], correctAnswer: 1, explanation: "Regular, exact-interval outbound connections over standard ports (like 443) are classic indicators of C2 beaconing malware." },
  { id: "q17", cert: "giac-gsec", question: "Which Windows utility is commonly used by administrators (and attackers) to execute commands remotely and often operates over TCP port 5985?", options: ["RDP", "Telnet", "SSH", "WinRM (Windows Remote Management)"], correctAnswer: 3, explanation: "WinRM uses TCP 5985 (HTTP) or 5986 (HTTPS) and is the underlying protocol for PowerShell Remoting." },
  { id: "q18", cert: "comptia-secplus", question: "A biometric access system frequently denies access to authorized users. Which metric describes this situation?", options: ["False Acceptance Rate (FAR)", "False Rejection Rate (FRR)", "Crossover Error Rate (CER)", "Mean Time To Failure (MTTF)"], correctAnswer: 1, explanation: "False Rejection Rate (FRR), or Type I error, occurs when an authorized subject is incorrectly denied access." },
  { id: "q19", cert: "isc2-cissp", question: "In software development, which testing methodology tests the software from the outside without knowledge of its internal source code?", options: ["White-box testing", "Grey-box testing", "Black-box testing", "Unit testing"], correctAnswer: 2, explanation: "Black-box (or dynamic) testing examines the functionality of an application without peering into its internal structures or workings." },
  { id: "q20", cert: "offensive-oscp", question: "What is the primary difference between a bind shell and a reverse shell?", options: ["A bind shell connects back to the attacker; a reverse shell waits for the attacker to connect.", "A bind shell waits on the target for a connection; a reverse shell connects from the target back to the attacker.", "Bind shells use UDP; reverse shells use TCP.", "Reverse shells are encrypted; bind shells are plaintext."], correctAnswer: 1, explanation: "A bind shell opens a port on the target and waits. A reverse shell makes an outbound connection from the target back to the attacker's listening port." },
  
  // Paraphrased Conceptual Additions (CASP+, CISM, CISSP)
  { id: "q21", cert: "comptia-casp", question: "A senior security engineer is designing a zero-trust architecture for a hybrid cloud environment. Which principle should be the primary focus?", options: ["Perimeter-based IDS/IPS", "Continuous authentication and micro-segmentation", "MAC address filtering at the core switch", "Single Sign-On (SSO) without MFA"], correctAnswer: 1, explanation: "Zero-trust architecture assumes breach and requires continuous authentication and micro-segmentation to strictly control lateral movement." },
  { id: "q22", cert: "comptia-casp", question: "During a penetration test, a tester utilizes a technique known as 'Pass-the-Hash'. What does this technique achieve?", options: ["Extracts plaintext passwords from the SAM database", "Authenticates to a remote server using the NT hash without knowing the plaintext password", "Cracks the NTLM hash using a rainbow table", "Bypasses the firewall by hashing the payload"], correctAnswer: 1, explanation: "Pass-the-Hash allows an attacker to authenticate to a remote server/service by using the underlying NTLM hash of a user's password, bypassing the need for the plaintext password." },
  { id: "q23", cert: "isc2-cissp", question: "According to the (ISC)² Code of Ethics, which canon requires professionals to provide diligent and competent service to principals?", options: ["Protect society, the common good, necessary public trust and confidence, and the infrastructure.", "Act honorably, honestly, justly, responsibly, and legally.", "Provide diligent and competent service to principals.", "Advance and protect the profession."], correctAnswer: 2, explanation: "The third canon of the (ISC)² Code of Ethics explicitly states: Provide diligent and competent service to principals." },
  { id: "q24", cert: "isaca-cism", question: "When developing an incident response plan, what is the most critical first step to ensure the plan's success?", options: ["Purchasing a SIEM solution", "Identifying and classifying critical assets", "Obtaining executive management support and alignment with business objectives", "Conducting a table-top exercise"], correctAnswer: 2, explanation: "Without executive management support and alignment with business objectives, any security initiative (including incident response) will lack the necessary authority, funding, and cross-departmental cooperation." },
  { id: "q25", cert: "comptia-secplus", question: "An organization wants to securely exchange symmetric keys over an insecure channel. Which algorithm should they use?", options: ["AES", "Diffie-Hellman", "SHA-256", "RC4"], correctAnswer: 1, explanation: "Diffie-Hellman (DH) is an asymmetric cryptographic protocol specifically designed to allow two parties to securely establish a shared secret (symmetric key) over an insecure channel." },
  {
    id: "cisa-q1",
    cert: "isaca-cisa",
    question: "When reviewing an organization's disaster recovery plan (DRP), what is the PRIMARY concern for an IS auditor?",
    options: [
      "The plan does not include a detailed hardware inventory.",
      "The plan has not been tested in the last 12 months.",
      "The alternate processing facility is located 20 miles away.",
      "The DRP team lacks a communications representative."
    ],
    correctAnswer: 1,
    explanation: "An untested DRP provides no assurance that the organization can recover operations effectively. Testing is the most critical component to validate the plan's viability."
  },
  {
    id: "crisc-q1",
    cert: "isaca-crisc",
    question: "Which of the following is the BEST indicator that risk management is integrated into enterprise management?",
    options: [
      "Risk assessments are performed continuously.",
      "A dedicated risk management department exists.",
      "Business managers are accountable for risk mitigation.",
      "Risk reporting is standardized across the organization."
    ],
    correctAnswer: 2,
    explanation: "Integration of risk management is best evidenced when business owners (management) take accountability and ownership for mitigating risks within their operational areas, aligning risk management with business objectives."
  },
  {
    id: "secai-q1",
    cert: "comptia-secaiplus",
    question: "Which type of attack involves subtly altering input data to cause an AI model to misclassify it, while remaining imperceptible to human observers?",
    options: [
      "Data Poisoning",
      "Model Inversion",
      "Adversarial Evasion",
      "Prompt Injection"
    ],
    correctAnswer: 2,
    explanation: "Adversarial evasion attacks occur during the inference phase, where input data (like an image) is perturbed to trick the model into producing an incorrect output."
  },
  {
    id: "cgrc-q1",
    cert: "isc2-cgrc",
    question: "According to the NIST Risk Management Framework (RMF), during which step are security controls assessed to determine if they are implemented correctly and operating as intended?",
    options: [
      "Step 2: Select",
      "Step 3: Implement",
      "Step 4: Assess",
      "Step 6: Monitor"
    ],
    correctAnswer: 2,
    explanation: "Step 4 of the NIST RMF is 'Assess', where security and privacy controls are evaluated to determine their effectiveness."
  },
  {
    id: "cisa-q2",
    cert: "isaca-cisa",
    question: "Which of the following is the BEST control to mitigate the risk of unauthorized access to a production database?",
    options: [
      "Implement a robust backup strategy",
      "Apply the principle of least privilege",
      "Use strong encryption for data at rest",
      "Enable database query logging"
    ],
    correctAnswer: 1,
    explanation: "Applying the principle of least privilege ensures that users and applications only have the access necessary to perform their jobs, which is the most effective preventative control against unauthorized access."
  },
  {
    id: "crisc-q2",
    cert: "isaca-crisc",
    question: "When a critical risk exceeds the organization's risk appetite, what is the MOST appropriate initial action?",
    options: [
      "Immediately implement technical controls",
      "Report the risk to executive management",
      "Accept the risk temporarily",
      "Transfer the risk via insurance"
    ],
    correctAnswer: 1,
    explanation: "When a risk exceeds the defined risk appetite, it must be escalated to executive management or the board, as they hold the authority to decide on the appropriate risk response strategy."
  },
  {
    id: "secai-q2",
    cert: "comptia-secaiplus",
    question: "An attacker intentionally alters the training data of a machine learning model to introduce a backdoor. What type of attack is this?",
    options: [
      "Model Inversion",
      "Data Poisoning",
      "Data Exfiltration",
      "Adversarial Evasion"
    ],
    correctAnswer: 1,
    explanation: "Data poisoning occurs during the training phase, where an attacker injects malicious data into the training set to manipulate the model's future behavior or introduce vulnerabilities."
  },
  {
    id: "cgrc-q2",
    cert: "isc2-cgrc",
    question: "In the context of the NIST RMF, who is ultimately responsible for accepting the residual risk and authorizing an information system to operate?",
    options: [
      "Information System Security Officer (ISSO)",
      "Chief Information Security Officer (CISO)",
      "System Owner",
      "Authorizing Official (AO)"
    ],
    correctAnswer: 3,
    explanation: "The Authorizing Official (AO) is the senior management official with the authority to formally assume responsibility for operating an information system at an acceptable level of risk."
  },
  {
    id: "cisa-q3",
    cert: "isaca-cisa",
    question: "During an audit of an organization's logical access controls, an IS auditor finds that terminated employees' accounts are disabled within 30 days. What should the auditor recommend?",
    options: [
      "No action is needed as 30 days is an acceptable industry standard.",
      "Accounts should be deleted immediately instead of disabled.",
      "Access should be revoked immediately upon termination.",
      "A script should be written to disable accounts after 90 days of inactivity."
    ],
    correctAnswer: 2,
    explanation: "To minimize the risk of unauthorized access or malicious activity by disgruntled former employees, logical access (accounts) must be revoked immediately upon termination."
  },
  {
    id: "cissp-q26",
    cert: "isc2-cissp",
    question: "Which access control model relies on security labels attached to objects and clearance levels assigned to subjects?",
    options: ["Discretionary Access Control (DAC)", "Mandatory Access Control (MAC)", "Role-Based Access Control (RBAC)", "Attribute-Based Access Control (ABAC)"],
    correctAnswer: 1,
    explanation: "Mandatory Access Control (MAC) is based on security labels assigned to both subjects (clearance) and objects (classification)."
  },
  {
    id: "cysa-q27",
    cert: "comptia-cysa",
    question: "During a vulnerability scan, a security analyst discovers a high-severity vulnerability on a legacy system that cannot be patched. What is the BEST course of action?",
    options: ["Accept the risk and document it", "Isolate the system on a segmented VLAN", "Turn off the system immediately", "Deploy a host-based firewall on the system"],
    correctAnswer: 1,
    explanation: "Isolating the system on a segmented VLAN (network segmentation) acts as a compensating control, limiting the system's exposure while keeping it functional."
  },
  {
    id: "casp-q28",
    cert: "comptia-casp",
    question: "A global enterprise requires a federated identity solution to allow employees seamless access to third-party SaaS applications. Which protocol is MOST appropriate for web-based SSO?",
    options: ["RADIUS", "Kerberos", "SAML 2.0", "LDAP"],
    correctAnswer: 2,
    explanation: "SAML 2.0 (Security Assertion Markup Language) is an XML-based standard specifically designed for exchanging authentication and authorization data between identity providers and service providers, ideal for web-based SSO."
  },
  {
    id: "secai-q29",
    cert: "comptia-secaiplus",
    question: "A security operations center (SOC) deploys an AI-driven behavioral analytics tool. What is the PRIMARY advantage of this over traditional signature-based IDS?",
    options: ["It has zero false positives.", "It can detect novel, zero-day attacks.", "It operates without consuming network bandwidth.", "It automatically blocks all encrypted traffic."],
    correctAnswer: 1,
    explanation: "Behavioral analytics (often powered by AI/ML) establishes baselines and detects anomalies, enabling it to identify novel or zero-day attacks that signature-based systems would miss."
  },
  {
    id: "cgrc-q30",
    cert: "isc2-cgrc",
    question: "Within the NIST Risk Management Framework, what defines the minimum set of security controls required for a specific information system category?",
    options: ["System Security Plan (SSP)", "Security Control Baseline", "Risk Assessment Report (RAR)", "Plan of Action and Milestones (POA&M)"],
    correctAnswer: 1,
    explanation: "A Security Control Baseline is a predefined set of controls tailored to the specific impact level (Low, Moderate, High) of an information system as defined by FIPS 199."
  },
  {
    id: "cisa-q31",
    cert: "isaca-cisa",
    question: "An IS auditor is evaluating an organization's change management process. What finding poses the GREATEST risk?",
    options: ["Change requests lack minor documentation.", "Developers have access to migrate code into the production environment.", "The Change Advisory Board (CAB) meets bi-weekly instead of weekly.", "Testing is conducted in a staging environment instead of production."],
    correctAnswer: 1,
    explanation: "Allowing developers to migrate code into production violates the principle of segregation of duties, introducing the risk of unauthorized or unreviewed changes."
  },
  {
    id: "crisc-q32",
    cert: "isaca-crisc",
    question: "Which of the following BEST describes a Key Risk Indicator (KRI)?",
    options: ["A metric that measures how well a process is performing.", "A metric that indicates the probability of a risk event materializing.", "A goal set by executive management for risk reduction.", "A financial value representing the maximum possible loss."],
    correctAnswer: 1,
    explanation: "Key Risk Indicators (KRIs) act as early warning signals that provide management with a prospective indication of changes in the risk profile."
  },
  {
    id: "secplus-q33",
    cert: "comptia-secplus",
    question: "An attacker intercepts communication between a client and a server, altering the data in transit without either party knowing. What type of attack is this?",
    options: ["Denial of Service (DoS)", "Replay Attack", "Man-in-the-Middle (MitM)", "MAC Spoofing"],
    correctAnswer: 2,
    explanation: "A Man-in-the-Middle (MitM) attack occurs when an attacker secretly relays and possibly alters the communication between two parties who believe they are communicating directly."
  },
  {
    id: "cism-q34",
    cert: "isaca-cism",
    question: "When aligning the information security strategy with the business strategy, the Information Security Manager should FIRST:",
    options: ["Determine the current security maturity level.", "Understand the organization's business goals and objectives.", "Perform a comprehensive risk assessment.", "Develop a balanced scorecard."],
    correctAnswer: 1,
    explanation: "To align security with the business, the foundational first step is to thoroughly understand the business's goals, objectives, and overall strategy."
  },
  {
    id: "cissp-q35",
    cert: "isc2-cissp",
    question: "What cryptographic concept ensures that if a single key is compromised, past communications remain secure?",
    options: ["Non-repudiation", "Key Escrow", "Perfect Forward Secrecy", "Digital Signatures"],
    correctAnswer: 2,
    explanation: "Perfect Forward Secrecy (PFS) ensures that session keys are ephemeral and not derived directly from long-term private keys, protecting past sessions against future key compromises."
  },
  {
    id: "oscp-q36",
    cert: "offensive-oscp",
    question: "During a penetration test on a Linux server, you discover a cron job running as root that executes a world-writable bash script. What is the BEST way to escalate privileges?",
    options: ["Brute force the root password using Hydra.", "Append a reverse shell payload to the world-writable script.", "Exploit a kernel vulnerability.", "Use the 'sudo -l' command."],
    correctAnswer: 1,
    explanation: "Since the script is executed by root (via cron) and is world-writable, any user can append malicious commands (like a reverse shell) to it, which will then be executed with root privileges."
  },
  {
    id: "secai-q37",
    cert: "comptia-secaiplus",
    question: "An organization is deploying a generative AI chatbot for customer service. To prevent the chatbot from revealing sensitive PII to users, which defense mechanism is most critical?",
    options: ["Input sanitization", "Output filtering and guardrails", "Using a smaller LLM", "Homomorphic encryption"],
    correctAnswer: 1,
    explanation: "Output filtering and guardrails monitor and intercept the model's generated responses to ensure no sensitive or unauthorized data (like PII) is transmitted to the user."
  },
  {
    id: "cysa-q38",
    cert: "comptia-cysa",
    question: "An analyst notes repeated DNS requests for unusually long, random subdomains (e.g., k39djd82.example.com). This is MOST likely an indication of:",
    options: ["DNS amplification attack", "DNS poisoning", "DNS tunneling (C2 traffic)", "Fast-flux DNS"],
    correctAnswer: 2,
    explanation: "DNS tunneling encapsulates data within DNS queries and responses (often using long, randomized subdomains) to bypass network security controls or establish C2 communications."
  },
  {
    id: "cgrc-q39",
    cert: "isc2-cgrc",
    question: "Which document provides a formalized description of an information system, its security requirements, and the controls in place to meet those requirements?",
    options: ["Privacy Impact Assessment (PIA)", "System Security Plan (SSP)", "Risk Assessment Report (RAR)", "Business Impact Analysis (BIA)"],
    correctAnswer: 1,
    explanation: "The System Security Plan (SSP) provides a comprehensive overview of the system boundaries, the environment, and the implementation details of the selected security controls."
  },
  {
    id: "casp-q40",
    cert: "comptia-casp",
    question: "A company wants to securely integrate two distinct cloud environments (AWS and Azure) using a VPN. Which protocol suite is the industry standard for this site-to-site connection?",
    options: ["PPTP", "IPsec", "TLS", "L2TP"],
    correctAnswer: 1,
    explanation: "IPsec is the industry standard protocol suite used to establish secure, encrypted site-to-site VPN tunnels between corporate networks and diverse cloud environments."
  },
  ...(generatedQuestions as MockQuestion[])
];
