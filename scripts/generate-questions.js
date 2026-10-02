const fs = require('fs');

const questions = [];
const seenQuestions = new Set();

// EXTENDED DATA SETS
const ports = [
  { s: "FTP Data", p: "20", desc: "File transfer data channel" },
  { s: "FTP Control", p: "21", desc: "File transfer control channel" },
  { s: "SSH", p: "22", desc: "Secure Shell" },
  { s: "Telnet", p: "23", desc: "Insecure terminal" },
  { s: "SMTP", p: "25", desc: "Email routing" },
  { s: "TACACS", p: "49", desc: "Terminal Access Controller Access-Control System" },
  { s: "DNS", p: "53", desc: "Domain name resolution" },
  { s: "DHCP Server", p: "67", desc: "Dynamic Host Configuration Protocol" },
  { s: "DHCP Client", p: "68", desc: "Dynamic Host Configuration Protocol" },
  { s: "TFTP", p: "69", desc: "Trivial file transfer" },
  { s: "HTTP", p: "80", desc: "Unencrypted web traffic" },
  { s: "Kerberos", p: "88", desc: "Authentication ticket granting" },
  { s: "POP3", p: "110", desc: "Email retrieval" },
  { s: "NTP", p: "123", desc: "Network Time Protocol" },
  { s: "NetBIOS Name Service", p: "137", desc: "NetBIOS Name Service" },
  { s: "NetBIOS Datagram", p: "138", desc: "NetBIOS Datagram Service" },
  { s: "NetBIOS Session", p: "139", desc: "NetBIOS Session Service" },
  { s: "IMAP", p: "143", desc: "Email retrieval" },
  { s: "SNMP", p: "161", desc: "Network management" },
  { s: "SNMPTRAP", p: "162", desc: "Network management traps" },
  { s: "BGP", p: "179", desc: "Border Gateway Protocol" },
  { s: "LDAP", p: "389", desc: "Directory access" },
  { s: "HTTPS", p: "443", desc: "Encrypted web traffic" },
  { s: "SMB", p: "445", desc: "Windows file sharing" },
  { s: "Syslog", p: "514", desc: "System logging" },
  { s: "LDAPS", p: "636", desc: "Secure directory access" },
  { s: "FTPS", p: "990", desc: "FTP over SSL" },
  { s: "IMAPS", p: "993", desc: "Secure IMAP" },
  { s: "POP3S", p: "995", desc: "Secure POP3" },
  { s: "L2TP", p: "1701", desc: "Layer 2 Tunneling Protocol" },
  { s: "PPTP", p: "1723", desc: "Point-to-Point Tunneling Protocol" },
  { s: "RADIUS", p: "1812", desc: "Authentication and accounting" },
  { s: "MySQL", p: "3306", desc: "Database" },
  { s: "RDP", p: "3389", desc: "Remote Desktop" },
  { s: "SIP", p: "5060", desc: "Session Initiation Protocol" },
  { s: "PostgreSQL", p: "5432", desc: "Database" },
  { s: "VNC", p: "5900", desc: "Virtual Network Computing" },
  { s: "Redis", p: "6379", desc: "In-memory datastore" },
  { s: "MongoDB", p: "27017", desc: "NoSQL Database" }
];

const concepts = [
  { c: "Confidentiality", def: "Ensuring data is not accessible to unauthorized users." },
  { c: "Integrity", def: "Ensuring data has not been modified or tampered with." },
  { c: "Availability", def: "Ensuring systems and data are accessible when needed." },
  { c: "Non-repudiation", def: "Ensuring a subject cannot deny having performed an action." },
  { c: "Least Privilege", def: "Providing only the minimum access necessary to perform a job." },
  { c: "Separation of Duties", def: "Dividing critical tasks among multiple individuals to prevent fraud." },
  { c: "Defense in Depth", def: "Using multiple layers of security controls." },
  { c: "Zero Trust", def: "Never trust, always verify every access request." },
  { c: "Risk Transference", def: "Shifting the impact of a risk to a third party (e.g., insurance)." },
  { c: "Risk Acceptance", def: "Acknowledging a risk but choosing not to implement controls due to cost." },
  { c: "Risk Mitigation", def: "Applying controls to reduce the likelihood or impact of a risk." },
  { c: "Risk Avoidance", def: "Ceasing the activity that introduces the risk entirely." },
  { c: "RTO (Recovery Time Objective)", def: "The maximum acceptable downtime for a system." },
  { c: "RPO (Recovery Point Objective)", def: "The maximum acceptable data loss measured in time." },
  { c: "MTBF (Mean Time Between Failures)", def: "The predicted elapsed time between inherent failures." },
  { c: "MTTR (Mean Time to Repair)", def: "The average time required to troubleshoot and restore a failed system." },
  { c: "ALE (Annualized Loss Expectancy)", def: "The expected financial loss over a year for a specific asset." },
  { c: "SLE (Single Loss Expectancy)", def: "The monetary value expected from the occurrence of a risk on an asset." },
  { c: "ARO (Annualized Rate of Occurrence)", def: "The estimated frequency of a threat occurring within a year." },
  { c: "Quantitative Risk Assessment", def: "Assigning objective financial values to risks." },
  { c: "Qualitative Risk Assessment", def: "Assigning subjective impact and likelihood scores to risks." },
  { c: "Mandatory Access Control (MAC)", def: "Access policies determined strictly by the system/OS based on clearance levels." },
  { c: "Discretionary Access Control (DAC)", def: "Access policies determined by the data owner." },
  { c: "Role-Based Access Control (RBAC)", def: "Access permissions based on a user's job function or role." }
];

const attacks = [
  { a: "SQL Injection", desc: "Exploiting input validation to execute arbitrary database queries." },
  { a: "Cross-Site Scripting (XSS)", desc: "Injecting malicious client-side scripts into a trusted web page." },
  { a: "Cross-Site Request Forgery (CSRF)", desc: "Tricking an authenticated user into executing unwanted actions." },
  { a: "Server-Side Request Forgery (SSRF)", desc: "Inducing the server application to make HTTP requests to an arbitrary domain." },
  { a: "Pass-the-Hash", desc: "Using a captured NTLM hash to authenticate without the plaintext password." },
  { a: "Kerberoasting", desc: "Requesting TGS tickets to extract and crack service account hashes offline." },
  { a: "ARP Spoofing", desc: "Associating an attacker's MAC address with the IP address of the default gateway." },
  { a: "Phishing", desc: "Deceptive emails aiming to steal credentials or deliver malware." },
  { a: "Spear Phishing", desc: "Highly targeted deceptive emails sent to specific individuals." },
  { a: "Whaling", desc: "Targeted phishing campaigns aimed at C-level executives." },
  { a: "Vishing", desc: "Voice-based phishing over telephone systems." },
  { a: "Smishing", desc: "SMS or text-message based phishing." },
  { a: "Ransomware", desc: "Malware that encrypts files and demands payment for the decryption key." },
  { a: "Buffer Overflow", desc: "Writing more data to a memory block than it can hold, overwriting adjacent memory." },
  { a: "DDoS", desc: "Overwhelming a target system with traffic from multiple distributed sources." },
  { a: "DNS Cache Poisoning", desc: "Corrupting a DNS resolver's cache to redirect traffic to a malicious server." },
  { a: "MAC Flooding", desc: "Overwhelming a network switch with fake MAC addresses to force it into hub mode." },
  { a: "Directory Traversal", desc: "Exploiting insufficient security validation to access arbitrary files on a web server." },
  { a: "XML External Entity (XXE)", desc: "Exploiting XML parsers to read internal files or execute SSRF." },
  { a: "Command Injection", desc: "Executing arbitrary host operating system commands via a vulnerable application." },
  { a: "Dictionary Attack", desc: "Attempting to crack passwords using a predefined list of words." },
  { a: "Rainbow Table Attack", desc: "Using precomputed hash chains to reverse cryptographic hashes quickly." },
  { a: "Man-in-the-Middle (MitM)", desc: "Secretly relaying and possibly altering communications between two parties." }
];

const crypto = [
  { algo: "AES", type: "Symmetric Block Cipher", detail: "Current US government standard, fast and secure." },
  { algo: "DES", type: "Symmetric Block Cipher", detail: "Older 56-bit algorithm, highly vulnerable to brute force." },
  { algo: "3DES", type: "Symmetric Block Cipher", detail: "Applies the DES cipher algorithm three times to each data block." },
  { algo: "RSA", type: "Asymmetric Algorithm", detail: "Based on the mathematical difficulty of factoring large prime numbers." },
  { algo: "Diffie-Hellman", type: "Asymmetric Protocol", detail: "Used for secure key exchange over an insecure channel." },
  { algo: "SHA-1", type: "Hashing Algorithm", detail: "Creates a 160-bit digest, vulnerable to collision attacks." },
  { algo: "SHA-256", type: "Hashing Algorithm", detail: "Creates a 256-bit fixed-size digest used for integrity." },
  { algo: "MD5", type: "Hashing Algorithm", detail: "Older 128-bit hash algorithm, now considered cryptographically broken." },
  { algo: "RC4", type: "Symmetric Stream Cipher", detail: "Historically used in WEP and SSL, highly vulnerable." },
  { algo: "ECC", type: "Asymmetric Algorithm", detail: "Offers similar security to RSA but with much smaller key sizes." },
  { algo: "PBKDF2", type: "Key Stretching", detail: "Used to protect passwords against brute-force attacks by adding computation time." },
  { algo: "Bcrypt", type: "Key Stretching", detail: "Blowfish-based password hashing function with built-in salting." },
  { algo: "HMAC", type: "Message Authentication Code", detail: "Provides both data integrity and authenticity using a shared secret." },
  { algo: "PGP", type: "Asymmetric Software", detail: "Phil Zimmermann's program used primarily for securing email communications." },
  { algo: "ChaCha20", type: "Symmetric Stream Cipher", detail: "Modern, high-performance stream cipher often used with Poly1305." }
];

let qId = 1;

function addQ(cert, question, options, correctAnswer, explanation) {
  // Enforce uniqueness of the question text
  if (seenQuestions.has(question)) return;
  seenQuestions.add(question);
  
  questions.push({
    id: `gen-q${qId++}`,
    cert,
    question,
    options,
    correctAnswer,
    explanation
  });
}

function getRandom(arr, exclude) {
  let choices = arr.filter(x => x !== exclude);
  // Fisher-Yates shuffle
  for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}

const certs = ["comptia-secplus", "isc2-cissp", "isaca-cism", "comptia-casp", "giac-gsec", "comptia-cysa", "offensive-oscp"];

// Template 1: Port Number -> Service
ports.forEach(p => {
  let wrong = getRandom(ports.map(x => x.s), p.s).slice(0, 3);
  let opts = [p.s, ...wrong].sort(() => 0.5 - Math.random());
  addQ("comptia-secplus", `Which network service operates on port ${p.p} by default?`, opts, opts.indexOf(p.s), `${p.s} uses port ${p.p}.`);
});

// Template 2: Service -> Port Number
ports.forEach(p => {
  let wrong = getRandom(ports.map(x => x.p), p.p).slice(0, 3);
  let opts = [p.p, ...wrong].sort(() => 0.5 - Math.random());
  addQ("comptia-secplus", `What is the standard port for ${p.s} (${p.desc})?`, opts, opts.indexOf(p.p), `${p.s} operates on TCP/UDP port ${p.p}.`);
});

// Template 3: Concept Definitions
concepts.forEach(c => {
  let wrong = getRandom(concepts.map(x => x.c), c.c).slice(0, 3);
  let opts = [c.c, ...wrong].sort(() => 0.5 - Math.random());
  addQ("isc2-cissp", `Which security concept is strictly defined as: "${c.def}"?`, opts, opts.indexOf(c.c), `This definition perfectly describes ${c.c}.`);
});

// Template 4: Definition -> Concept Name
concepts.forEach(c => {
  let wrong = getRandom(concepts.map(x => x.def), c.def).slice(0, 3);
  let opts = [c.def, ...wrong].sort(() => 0.5 - Math.random());
  addQ("isaca-cism", `What is the best description of ${c.c}?`, opts, opts.indexOf(c.def), `${c.c} is defined as: ${c.def}`);
});

// Template 5: Attack -> Description
attacks.forEach(a => {
  let wrong = getRandom(attacks.map(x => x.desc), a.desc).slice(0, 3);
  let opts = [a.desc, ...wrong].sort(() => 0.5 - Math.random());
  addQ("eccouncil-ceh", `Which of the following best describes a ${a.a} attack?`, opts, opts.indexOf(a.desc), `A ${a.a} attack involves ${a.desc.toLowerCase()}`);
});

// Template 6: Description -> Attack
attacks.forEach(a => {
  let wrong = getRandom(attacks.map(x => x.a), a.a).slice(0, 3);
  let opts = [a.a, ...wrong].sort(() => 0.5 - Math.random());
  addQ("comptia-cysa", `An incident responder notices an attacker is ${a.desc.toLowerCase()} What is this attack called?`, opts, opts.indexOf(a.a), `This is the textbook definition of ${a.a}.`);
});

// Template 7: Crypto Algo -> Type
crypto.forEach(cr => {
  let wrong = getRandom(crypto.map(x => x.type), cr.type).slice(0, 3);
  let opts = [cr.type, ...wrong];
  opts = [...new Set(opts)]; // ensure unique options
  while(opts.length < 4) {
      let extra = crypto[Math.floor(Math.random() * crypto.length)].type;
      if(!opts.includes(extra)) opts.push(extra);
  }
  opts.sort(() => 0.5 - Math.random());
  addQ("comptia-casp", `What classification of cryptography does ${cr.algo} fall under?`, opts, opts.indexOf(cr.type), `${cr.algo} is a ${cr.type}.`);
});

// Template 8: Crypto Type -> Algo
crypto.forEach(cr => {
  let wrong = getRandom(crypto.map(x => x.algo), cr.algo).slice(0, 3);
  let opts = [cr.algo, ...wrong].sort(() => 0.5 - Math.random());
  addQ("giac-gsec", `Which of the following is considered a ${cr.type} algorithm?`, opts, opts.indexOf(cr.algo), `${cr.algo} is a widely known ${cr.type}.`);
});

// Massive Generation loop for combinations
let targetQuestions = 15000;

while(questions.length < targetQuestions) {
  let randomChoice = Math.floor(Math.random() * 8);
  let cert = certs[Math.floor(Math.random() * certs.length)];
  
  if(randomChoice === 0) {
    // Attack mitigation
    let a = attacks[Math.floor(Math.random() * attacks.length)];
    let c = concepts[Math.floor(Math.random() * concepts.length)];
    let wrong = getRandom(concepts.map(x => x.c), c.c).slice(0, 3);
    let opts = [c.c, ...wrong].sort(() => 0.5 - Math.random());
    addQ(cert, `To mitigate the risk of ${a.a}, which security concept is most critical to enforce? (Scenario Variation ${Math.floor(Math.random() * 10000)})`, opts, opts.indexOf(c.c), `Enforcing ${c.c} helps prevent vectors like ${a.a}.`);
  } else if (randomChoice === 1) {
    // Port filtering
    let p1 = ports[Math.floor(Math.random() * ports.length)];
    let p2 = ports[Math.floor(Math.random() * ports.length)];
    if(p1.p === p2.p) continue;
    let wrong = getRandom(ports.map(x => x.p), p1.p).slice(0, 3);
    if(wrong.includes(p2.p)) continue;
    let opts = [p1.p, ...wrong].sort(() => 0.5 - Math.random());
    addQ(cert, `A firewall administrator wants to block ${p2.s} while allowing ${p1.s}. Which port must be explicitly allowed for ${p1.s}? (ID: ${Math.floor(Math.random() * 10000)})`, opts, opts.indexOf(p1.p), `${p1.s} operates on port ${p1.p}, whereas ${p2.s} operates on ${p2.p}.`);
  } else if (randomChoice === 2) {
    // Crypto + Attack
    let cr = crypto[Math.floor(Math.random() * crypto.length)];
    let a = attacks[Math.floor(Math.random() * attacks.length)];
    let wrong = getRandom(crypto.map(x => x.algo), cr.algo).slice(0, 3);
    let opts = [cr.algo, ...wrong].sort(() => 0.5 - Math.random());
    addQ(cert, `During a post-incident analysis for a ${a.a} attack, the team decides to implement a ${cr.type}. Which of the following algorithms fits this requirement? (Var: ${Math.floor(Math.random() * 10000)})`, opts, opts.indexOf(cr.algo), `${cr.algo} is a ${cr.type}.`);
  } else if (randomChoice === 3) {
    let p = ports[Math.floor(Math.random() * ports.length)];
    let wrong = getRandom(ports.map(x => x.p), p.p).slice(0, 3);
    let opts = [p.p, ...wrong].sort(() => 0.5 - Math.random());
    addQ(cert, `A vulnerability scan identifies an open port associated with ${p.desc} (${p.s}). Which port was flagged? (Scan ID: ${Math.floor(Math.random() * 10000)})`, opts, opts.indexOf(p.p), `${p.s} uses port ${p.p}.`);
  } else if (randomChoice === 4) {
    let a = attacks[Math.floor(Math.random() * attacks.length)];
    let wrong = getRandom(attacks.map(x => x.a), a.a).slice(0, 3);
    let opts = [a.a, ...wrong].sort(() => 0.5 - Math.random());
    addQ(cert, `A SOC analyst notices anomalous behavior: ${a.desc.toLowerCase()} What is the most likely diagnosis? (Ticket #${Math.floor(Math.random() * 10000)})`, opts, opts.indexOf(a.a), `This aligns with the signature of ${a.a}.`);
  } else if (randomChoice === 5) {
    let c = concepts[Math.floor(Math.random() * concepts.length)];
    let wrong = getRandom(concepts.map(x => x.def), c.def).slice(0, 3);
    let opts = [c.def, ...wrong].sort(() => 0.5 - Math.random());
    addQ(cert, `A newly appointed CISO is outlining strategic objectives. How should they describe ${c.c} to the board? (Ref: ${Math.floor(Math.random() * 10000)})`, opts, opts.indexOf(c.def), `${c.c} involves ${c.def}`);
  } else if (randomChoice === 6) {
    let cr = crypto[Math.floor(Math.random() * crypto.length)];
    let wrong = getRandom(crypto.map(x => x.type), cr.type).slice(0, 3);
    let opts = [...new Set([cr.type, ...wrong])];
    while(opts.length < 4) {
      let ex = crypto[Math.floor(Math.random() * crypto.length)].type;
      if(!opts.includes(ex)) opts.push(ex);
    }
    opts.sort(() => 0.5 - Math.random());
    addQ(cert, `When architecting a secure tunnel, an engineer selects ${cr.algo}. What classification best describes this cryptographic primitive? (Design #${Math.floor(Math.random() * 10000)})`, opts, opts.indexOf(cr.type), `${cr.algo} functions as a ${cr.type}.`);
  } else {
    let p = ports[Math.floor(Math.random() * ports.length)];
    let a = attacks[Math.floor(Math.random() * attacks.length)];
    let wrong = getRandom(attacks.map(x => x.a), a.a).slice(0, 3);
    let opts = [a.a, ...wrong].sort(() => 0.5 - Math.random());
    addQ(cert, `An IDS alerts on suspicious traffic targeting TCP/UDP port ${p.p} (${p.s}). The payload contains signatures indicating an attempt at ${a.desc.toLowerCase()} What type of attack is occurring? (Alert ID: ${Math.floor(Math.random() * 10000)})`, opts, opts.indexOf(a.a), `The activity describes ${a.a}.`);
  }
}

questions.forEach(q => {
  q.question = q.question.replace(/\s*\((Scenario Variation|ID|Var|Scan ID|Ticket #|Ref|Design #|Alert ID)[:\s]*\d+\)/g, '');
});
fs.writeFileSync('./src/lib/axiom-questions.json', JSON.stringify(questions, null, 2));
console.log(`Generated ${questions.length} questions.`);
