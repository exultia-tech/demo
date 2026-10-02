const fs = require('fs');

const questions = [];

// DATA SETS
const ports = [
  { s: "SSH", p: "22", desc: "Secure Shell" },
  { s: "Telnet", p: "23", desc: "Insecure terminal" },
  { s: "SMTP", p: "25", desc: "Email routing" },
  { s: "DNS", p: "53", desc: "Domain name resolution" },
  { s: "HTTP", p: "80", desc: "Unencrypted web traffic" },
  { s: "HTTPS", p: "443", desc: "Encrypted web traffic" },
  { s: "RDP", p: "3389", desc: "Remote Desktop" },
  { s: "SMB", p: "445", desc: "Windows file sharing" },
  { s: "FTP", p: "21", desc: "File transfer" },
  { s: "TFTP", p: "69", desc: "Trivial file transfer" },
  { s: "SNMP", p: "161", desc: "Network management" },
  { s: "LDAP", p: "389", desc: "Directory access" },
  { s: "LDAPS", p: "636", desc: "Secure directory access" },
  { s: "Kerberos", p: "88", desc: "Authentication ticket granting" },
  { s: "MySQL", p: "3306", desc: "Database" },
  { s: "MSSQL", p: "1433", desc: "Database" }
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
  { c: "RTO (Recovery Time Objective)", def: "The maximum acceptable downtime for a system." },
  { c: "RPO (Recovery Point Objective)", def: "The maximum acceptable data loss measured in time." }
];

const attacks = [
  { a: "SQL Injection", desc: "Exploiting input validation to execute arbitrary database queries." },
  { a: "Cross-Site Scripting (XSS)", desc: "Injecting malicious client-side scripts into a trusted web page." },
  { a: "Cross-Site Request Forgery (CSRF)", desc: "Tricking an authenticated user into executing unwanted actions." },
  { a: "Pass-the-Hash", desc: "Using a captured NTLM hash to authenticate without the plaintext password." },
  { a: "Kerberoasting", desc: "Requesting TGS tickets to extract and crack service account hashes offline." },
  { a: "ARP Spoofing", desc: "Associating an attacker's MAC address with the IP address of the default gateway." },
  { a: "Phishing", desc: "Deceptive emails aiming to steal credentials or deliver malware." },
  { a: "Ransomware", desc: "Malware that encrypts files and demands payment for the decryption key." },
  { a: "Buffer Overflow", desc: "Writing more data to a memory block than it can hold, overwriting adjacent memory." },
  { a: "DDoS", desc: "Overwhelming a target system with traffic from multiple distributed sources." }
];

const crypto = [
  { algo: "AES", type: "Symmetric Block Cipher", detail: "Current US government standard, fast and secure." },
  { algo: "RSA", type: "Asymmetric Algorithm", detail: "Based on the mathematical difficulty of factoring large prime numbers." },
  { algo: "Diffie-Hellman", type: "Asymmetric Protocol", detail: "Used for secure key exchange over an insecure channel." },
  { algo: "SHA-256", type: "Hashing Algorithm", detail: "Creates a 256-bit fixed-size digest used for integrity." },
  { algo: "MD5", type: "Hashing Algorithm", detail: "Older 128-bit hash algorithm, now considered cryptographically broken." },
  { algo: "RC4", type: "Symmetric Stream Cipher", detail: "Historically used in WEP and SSL, highly vulnerable." },
  { algo: "ECC", type: "Asymmetric Algorithm", detail: "Offers similar security to RSA but with much smaller key sizes." },
  { algo: "PBKDF2", type: "Key Stretching", detail: "Used to protect passwords against brute-force attacks by adding computation time." }
];

let qId = 1;

function addQ(cert, question, options, correctAnswer, explanation) {
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
  // shuffle
  choices.sort(() => 0.5 - Math.random());
  return choices;
}

// Generate Port Questions
for (let i = 0; i < 50; i++) {
  let p = ports[i % ports.length];
  let wrong = getRandom(ports.map(x => x.p), p.p).slice(0, 3);
  let opts = [p.p, ...wrong].sort(() => 0.5 - Math.random());
  let correct = opts.indexOf(p.p);
  addQ("comptia-secplus", `Which network port is used by default for ${p.s} (${p.desc})?`, opts, correct, `${p.s} operates on TCP/UDP port ${p.p}.`);
}

// Generate Concept Questions
for (let i = 0; i < 150; i++) {
  let c = concepts[i % concepts.length];
  let wrong = getRandom(concepts.map(x => x.c), c.c).slice(0, 3);
  let opts = [c.c, ...wrong].sort(() => 0.5 - Math.random());
  let correct = opts.indexOf(c.c);
  addQ("isc2-cissp", `Which concept is best defined as: "${c.def}"?`, opts, correct, `The definition describes ${c.c}.`);
}

// Generate Attack Questions
for (let i = 0; i < 200; i++) {
  let a = attacks[i % attacks.length];
  let wrong = getRandom(attacks.map(x => x.a), a.a).slice(0, 3);
  let opts = [a.a, ...wrong].sort(() => 0.5 - Math.random());
  let correct = opts.indexOf(a.a);
  addQ("eccouncil-ceh", `Which type of attack involves ${a.desc.toLowerCase()}`, opts, correct, `This is the textbook definition of ${a.a}.`);
}

// Generate Crypto Questions
for (let i = 0; i < 150; i++) {
  let cr = crypto[i % crypto.length];
  let wrong = getRandom(crypto.map(x => x.algo), cr.algo).slice(0, 3);
  let opts = [cr.algo, ...wrong].sort(() => 0.5 - Math.random());
  let correct = opts.indexOf(cr.algo);
  addQ("comptia-casp", `Which cryptographic solution is characterized as a ${cr.type} and ${cr.detail.toLowerCase()}`, opts, correct, `${cr.algo} is a ${cr.type}.`);
}

// Add generic variations to pad to 1000
const certs = ["comptia-secplus", "isc2-cc", "isaca-cism", "giac-gsec", "comptia-cysa", "offensive-oscp"];

while(questions.length < 1000) {
  let c = concepts[Math.floor(Math.random() * concepts.length)];
  let wrong = getRandom(concepts.map(x => x.def), c.def).slice(0, 3);
  let opts = [c.def, ...wrong].sort(() => 0.5 - Math.random());
  let correct = opts.indexOf(c.def);
  let cert = certs[Math.floor(Math.random() * certs.length)];
  addQ(cert, `In the context of information security, what is the best description of ${c.c}?`, opts, correct, `${c.c} is defined as: ${c.def}`);
}

fs.writeFileSync('./src/lib/axiom-questions.json', JSON.stringify(questions, null, 2));
console.log(`Generated ${questions.length} questions.`);
