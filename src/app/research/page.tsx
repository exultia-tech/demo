'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Cpu, 
  Server, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Layers, 
  Search, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Download, 
  Code2, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Flame, 
  Sliders,
  ChevronRight,
  Database,
  Lock,
  Globe,
  Filter,
  Package,
  Wrench,
  Ban,
  Activity,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  HelpCircle,
  Share2
} from 'lucide-react';
import { 
  PureIdeIcon, 
  VantageIcon, 
  KineticIcon, 
  InquestIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon 
} from '@/components/BrandIcons';

type ResearchTab = 'pureide' | 'vantage' | 'kinetic' | 'inquest' | 'praxis' | 'pureos' | 'axiom';

export default function ResearchLabPage() {
  const [activeTab, setActiveTab] = useState<ResearchTab>('pureide');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. PUREIDE SIMULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [pureIdeRepo, setPureIdeRepo] = useState<'auth-vault' | 'telemetry-agent' | 'kernel-driver'>('telemetry-agent');
  const [pureIdeEgressBlock, setPureIdeEgressBlock] = useState(true);
  const [pureIdeBuilding, setPureIdeBuilding] = useState(false);
  const [pureIdeProgress, setPureIdeProgress] = useState(0);
  const [pureIdeLogs, setPureIdeLogs] = useState<string[]>([]);
  const [pureIdeDone, setPureIdeDone] = useState(false);
  const [pureIdeBlockedLeak, setPureIdeBlockedLeak] = useState(false);

  const runPureIdeBuild = () => {
    setPureIdeBuilding(true);
    setPureIdeDone(false);
    setPureIdeProgress(5);
    setPureIdeBlockedLeak(false);
    setPureIdeLogs([
      `[INIT] PureIDE Sandboxed Compiler v3.8.4 initialized`,
      `[TARGET] Repository: ${pureIdeRepo}`,
      `[SANDBOX] Mounting hermetic namespace chroot /tmp/pureide-build-root...`,
      `[SECURITY] Egress Network Isolation Policy: ${pureIdeEgressBlock ? 'STRICT_BLOCK_ALL' : 'OPEN_TELEMETRY'}`
    ]);

    setTimeout(() => {
      setPureIdeProgress(30);
      setPureIdeLogs(prev => [
        ...prev,
        `[AUDIT] Ingesting 24 bundled dependencies from verified OpenVSX cache...`,
        `[HASH] Calculating in-toto input tree hashes: SHA256: 4f8b2... valid`
      ]);
    }, 600);

    setTimeout(() => {
      setPureIdeProgress(65);
      if (pureIdeRepo === 'telemetry-agent' && pureIdeEgressBlock) {
        setPureIdeBlockedLeak(true);
        setPureIdeLogs(prev => [
          ...prev,
          `[SUPPLY CHAIN TRIGGER] Dependency "analytics-tracker@1.4.2" executed postinstall lifecycle hook.`,
          `[FIREWALL ALERT] Attempted outbound socket connection: tcp://198.51.100.42:4444 (untrusted beacon).`,
          `[EGRESS NEUTRALIZED] Connection forcibly dropped with SIGKILL. Exfiltration prevented.`
        ]);
      } else {
        setPureIdeLogs(prev => [
          ...prev,
          `[COMPILER] Invoking native hermetic compiler with -trimpath and zero-timestamp flags...`,
          `[OPTIMIZER] Binary stripped of developer username, path metadata, and hardware IDs.`
        ]);
      }
    }, 1300);

    setTimeout(() => {
      setPureIdeProgress(100);
      setPureIdeBuilding(false);
      setPureIdeDone(true);
      setPureIdeLogs(prev => [
        ...prev,
        `[ARTIFACT] Hermetic executable generated: build/bin/${pureIdeRepo}.bin`,
        `[DIGEST] Deterministic Digest: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
        `[PROVENANCE] SLSA Level 3 In-Toto attestation generated and cryptographically signed via Cosign OIDC.`
      ]);
    }, 2000);
  };

  // ─────────────────────────────────────────────────────────────
  // 2. VANTAGE SIMULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [vantageSearch, setVantageSearch] = useState('CVE-2024-6387');
  const [vantageViewMode, setVantageViewMode] = useState<'dossier' | 'json'>('dossier');

  const VANTAGE_SAMPLE_FEED = [
    {
      cve: 'CVE-2024-6387',
      title: 'RegreSSHion: OpenSSH Remote Unauthenticated Code Execution',
      severity: 'CRITICAL',
      cvss: 8.1,
      vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H',
      kev: true,
      epss: '94.6%',
      affected: ['Ubuntu 24.04 LTS (glibc-based)', 'Rocky Linux 9', 'Debian 12 Bookworm'],
      description: 'A signal handler race condition in OpenSSH sshd (server) allows remote unauthenticated attackers to execute arbitrary code with root privileges on 32-bit and 64-bit systems via ASLR memory brute-forcing.',
      hotfix: 'echo "LoginGraceTime 0" | sudo tee /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf && sudo sshd -t && sudo systemctl reload sshd',
      rollback: 'sudo rm -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf && sudo sshd -t && sudo systemctl reload sshd'
    },
    {
      cve: 'CVE-2024-47176',
      title: 'CUPS cups-browsed Daemon UDP Remote Code Execution Chain',
      severity: 'CRITICAL',
      cvss: 9.0,
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      kev: true,
      epss: '89.1%',
      affected: ['Ubuntu 22.04 / 24.04', 'Fedora 40', 'RHEL 8 / 9', 'Alpine Linux'],
      description: 'cups-browsed binds to UDP INADDR_ANY:631 and blindly trusts IPP packets from any WAN source, initiating attacker-controlled IPP queries that inject arbitrary PostScript directives into foomatic-rip filters.',
      hotfix: 'sudo iptables -I INPUT -p udp --dport 631 -j DROP && sudo systemctl disable --now cups-browsed 2>/dev/null || true',
      rollback: 'sudo iptables -D INPUT -p udp --dport 631 -j DROP 2>/dev/null || true ; sudo systemctl enable --now cups-browsed'
    },
    {
      cve: 'CVE-2024-1086',
      title: 'Linux Kernel nf_tables Netfilter Use-After-Free Local Privilege Escalation',
      severity: 'HIGH',
      cvss: 7.8,
      vector: 'CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H',
      kev: true,
      epss: '98.2%',
      affected: ['Linux Kernel 5.14 - 6.6', 'Ubuntu 23.10', 'Debian 11/12'],
      description: 'Use-after-free flaw in netfilter nf_tables module permits unprivileged user namespaces to corrupt kernel page tables and execute arbitrary shell code as root.',
      hotfix: 'sudo sysctl -w user.max_user_namespaces=0 && echo "user.max_user_namespaces=0" | sudo tee /etc/sysctl.d/99-kinetic-cve-2024-1086.conf',
      rollback: 'sudo rm -f /etc/sysctl.d/99-kinetic-cve-2024-1086.conf && sudo sysctl -w user.max_user_namespaces=15000 && sudo sysctl --system'
    },
    {
      cve: 'CVE-2024-3094',
      title: 'XZ Utils / liblzma Malicious Multi-Stage Supply Chain Backdoor',
      severity: 'CRITICAL',
      cvss: 10.0,
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
      kev: true,
      epss: '99.9%',
      affected: ['Fedora Rawhide', 'Debian Sid (unstable)', 'openSUSE Tumbleweed', 'Alpine Edge'],
      description: 'Malicious upstream commits inject an obfuscated test file payload into release tarballs that intercepts RSA decryption routines in sshd via IFUNC hooks in systemd-linked liblzma.',
      hotfix: 'sudo dnf downgrade -y xz-libs-5.4.6 || sudo apt-get install --allow-downgrades -y liblzma5=5.4.5-0.1',
      rollback: 'echo "Rollback prohibited: target package contains known state-sponsored backdoor."'
    }
  ];

  const activeVantageItem = VANTAGE_SAMPLE_FEED.find(item => 
    item.cve.toLowerCase().includes(vantageSearch.toLowerCase()) || 
    item.title.toLowerCase().includes(vantageSearch.toLowerCase())
  ) || VANTAGE_SAMPLE_FEED[0];

  // ─────────────────────────────────────────────────────────────
  // 3. KINETIC SIMULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [kineticState, setKineticState] = useState<'vulnerable' | 'applying' | 'mitigated' | 'reverting' | 'reverted'>('vulnerable');
  const [kineticLogs, setKineticLogs] = useState<string[]>([
    '[INIT] Fleet Status: 640 nodes vulnerable to CVE-2024-6387 (RegreSSHion)',
    '[WAITING] Ready to apply Tier 1 Zero-Downtime Hot-Mitigation...'
  ]);

  const applyKineticHotfix = () => {
    setKineticState('applying');
    setKineticLogs([
      `[${new Date().toISOString()}] [DEPLOY] Initiating Tier 1 Hot-Mitigation across Ring 0 canary hosts...`,
      `[CONFIG] Injecting /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf (LoginGraceTime 0)...`,
      `[VALIDATE] Executing pre-flight syntax check: /usr/sbin/sshd -t... OK.`
    ]);

    setTimeout(() => {
      setKineticState('mitigated');
      setKineticLogs(prev => [
        ...prev,
        `[SIGNAL] Executing graceful daemon reload: systemctl reload sshd (elapsed: 14ms)`,
        `[HEALTH] Telemetry Sentinel confirms active SSH connections: 1,420 intact (0 dropped).`,
        `[STATUS] VULNERABILITY MITIGATED. Root race condition window permanently closed.`
      ]);
    }, 1200);
  };

  const rollbackKineticHotfix = () => {
    setKineticState('reverting');
    setKineticLogs([
      `[${new Date().toISOString()}] [REVERT] Emergency operator reversal requested.`,
      `[CLEANUP] Removing drop-in config /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf...`,
      `[VALIDATE] Syntax verification: /usr/sbin/sshd -t... OK.`
    ]);

    setTimeout(() => {
      setKineticState('reverted');
      setKineticLogs(prev => [
        ...prev,
        `[SIGNAL] Gracefully reloading sshd daemon to baseline state: systemctl reload sshd (elapsed: 11ms)`,
        `[STATE] Baseline restored (LoginGraceTime 120). Zero reboots required. 100% reversible.`
      ]);
    }, 1000);
  };

  // ─────────────────────────────────────────────────────────────
  // 4. INQUEST SIMULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [inquestDoc, setInquestDoc] = useState<'water-contract' | 'police-ia' | 'grant-audit'>('water-contract');
  const [inquestRedacted, setInquestRedacted] = useState(false);
  const [inquestProcessing, setInquestProcessing] = useState(false);

  const INQUEST_DOCS = {
    'water-contract': {
      title: 'Municipal Acoustic Water Grid Sensor Installation Agreement (Contract #2026-0827-048)',
      agency: 'City of Austin Water Utility & FluidTech Telemetry LLC',
      unredacted: `CONTRACT EXECUTION DOCUMENT:
The City hereby authorizes payment of $14,200,000 to FluidTech Telemetry LLC.
Lead Technical Officer: Marcus Vance (SSN: 948-22-1049, Personal Phone: 512-555-0199).
Proprietary Acoustic Calibration Frequency: 42.8 kHz with private Fourier transform algorithm patent application #US-2026-0914-A1.
Subcontractor banking routing: Wire routing #111000025, Account #8849201948, Wells Fargo Austin Downtown.`,
      redacted: `CONTRACT EXECUTION DOCUMENT:
The City hereby authorizes payment of $14,200,000 to FluidTech Telemetry LLC.
Lead Technical Officer: Marcus Vance ([REDACTED: 5 U.S.C. § 552(b)(6) - Personal Privacy], [REDACTED: 5 U.S.C. § 552(b)(6) - Personal Telephone Number]).
Proprietary Acoustic Calibration: [REDACTED: 5 U.S.C. § 552(b)(4) - Commercial Trade Secrets & Proprietary Algorithm Patent].
Subcontractor banking routing: [REDACTED: 5 U.S.C. § 552(b)(4) - Financial Account Information].`,
      exemptions: ['Exemption 4 (Trade Secrets)', 'Exemption 6 (Personal Privacy)']
    },
    'police-ia': {
      title: 'Internal Affairs Incident Investigation Dossier #IA-2026-019',
      agency: 'Metropolitan Police Department Office of Professional Responsibility',
      unredacted: `COMPLAINT INVESTIGATION SUMMARY:
Incident Date: June 14, 2026. Complainant Jane Doe (Home Address: 742 Evergreen Terrace, Springfield, SSN: 112-44-9021).
Undercover Narcotics Detective John Miller (Badge #4812, Active Undercover Identity: "Razor", cell: 202-555-0144) was present during vehicle intervention.
Body-Worn Camera Segment #04-18 indicates no policy violations observed.`,
      redacted: `COMPLAINT INVESTIGATION SUMMARY:
Incident Date: June 14, 2026. Complainant [REDACTED: 5 U.S.C. § 552(b)(6) - Personal Privacy] ([REDACTED: Home Address], [REDACTED: SSN]).
Undercover Narcotics Detective [REDACTED: 5 U.S.C. § 552(b)(7)(C) - Law Enforcement Undercover Officer Identity] ([REDACTED: Badge/Cell]) was present during vehicle intervention.
Body-Worn Camera Segment #04-18 indicates no policy violations observed.`,
      exemptions: ['Exemption 6 (Personal Privacy)', 'Exemption 7(C) (Law Enforcement Identity Protection)']
    },
    'grant-audit': {
      title: 'NSF Sub-Award Quantum Cryptography Research Audit',
      agency: 'National Science Foundation Division of Computing & Communication Foundations',
      unredacted: `GRANT ALLOCATION AUDIT:
Awardee Institution: Quantum Cryptographic Labs Inc. (DUNS: 948102948).
Lead PI: Dr. Elena Rostova (DOB: 04/12/1981, Passport: US-P-908129481).
Classified post-quantum lattice encryption benchmark formula: Matrix dimension N=1024 with q=12289 secret seed key 0xFA48B1C90819.`,
      redacted: `GRANT ALLOCATION AUDIT:
Awardee Institution: Quantum Cryptographic Labs Inc. (DUNS: 948102948).
Lead PI: Dr. Elena Rostova ([REDACTED: 5 U.S.C. § 552(b)(6) - Date of Birth], [REDACTED: Passport Identifier]).
Classified post-quantum lattice encryption benchmark formula: [REDACTED: 5 U.S.C. § 552(b)(1) - National Security & Defense Cryptographic Algorithms].`,
      exemptions: ['Exemption 1 (National Defense)', 'Exemption 6 (Personal Privacy)']
    }
  };

  const runInquestRedaction = () => {
    setInquestProcessing(true);
    setTimeout(() => {
      setInquestProcessing(false);
      setInquestRedacted(true);
    }, 700);
  };

  // ─────────────────────────────────────────────────────────────
  // 5. PRAXIS SIMULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [praxisLang, setPraxisLang] = useState<'typescript' | 'python' | 'go' | 'rust'>('typescript');
  const [praxisSchema, setPraxisSchema] = useState<'k8s' | 'fintech' | 'scada'>('k8s');

  const PRAXIS_CODE_SAMPLES: Record<string, Record<string, string>> = {
    'k8s': {
      typescript: `// Praxis Synthesized Zero-Trust Client: Kubernetes Pod Lifecycle
import { createHmac } from "crypto";

export class PraxisK8sClient {
  constructor(private readonly baseUrl: string, private readonly mTLSKey: string) {}

  async isolateNode(nodeId: string, reason: string): Promise<{ success: boolean; quarantinedPods: number }> {
    const timestamp = Date.now().toString();
    const signature = createHmac("sha256", this.mTLSKey)
      .update(\`POST:/v1/nodes/\${nodeId}/quarantine:\${timestamp}\`)
      .digest("hex");

    const res = await fetch(\`\${this.baseUrl}/v1/nodes/\${nodeId}/quarantine\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Exultia-Timestamp": timestamp,
        "X-Exultia-Signature": signature
      },
      body: JSON.stringify({ reason, timestamp })
    });
    return res.json();
  }
}`,
      python: `# Praxis Synthesized Zero-Trust Client: Kubernetes Pod Lifecycle
import hmac, hashlib, time, httpx

class PraxisK8sClient:
    def __init__(self, base_url: str, client_cert: tuple[str, str], secret_key: bytes):
        self.base_url = base_url
        self.secret_key = secret_key
        self.client = httpx.Client(cert=client_cert, timeout=5.0)

    def isolate_node(self, node_id: str, reason: str) -> dict:
        ts = str(int(time.time()))
        payload = f"POST:/v1/nodes/{node_id}/quarantine:{ts}".encode()
        sig = hmac.new(self.secret_key, payload, hashlib.sha256).hexdigest()
        
        headers = {"X-Exultia-Timestamp": ts, "X-Exultia-Signature": sig}
        resp = self.client.post(f"{self.base_url}/v1/nodes/{node_id}/quarantine", headers=headers, json={"reason": reason})
        resp.raise_for_status()
        return resp.json()`,
      go: `// Praxis Synthesized Zero-Trust Client: Kubernetes Pod Lifecycle
package client

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"crypto/tls"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type K8sClient struct {
	BaseURL    string
	SecretKey  []byte
	HTTPClient *http.Client
}

func (c *K8sClient) IsolateNode(nodeID, reason string) error {
	ts := fmt.Sprintf("%d", time.Now().Unix())
	mac := hmac.New(sha256.New, c.SecretKey)
	mac.Write([]byte("POST:/v1/nodes/" + nodeID + "/quarantine:" + ts))
	sig := hex.EncodeToString(mac.Sum(nil))

	reqBody, _ := json.Marshal(map[string]string{"reason": reason})
	req, _ := http.NewRequest("POST", c.BaseURL+"/v1/nodes/"+nodeID+"/quarantine", bytes.NewBuffer(reqBody))
	req.Header.Set("X-Exultia-Timestamp", ts)
	req.Header.Set("X-Exultia-Signature", sig)

	resp, err := c.HTTPClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return fmt.Errorf("isolation failed: %v", err)
	}
	return nil
}`,
      rust: `// Praxis Synthesized Zero-Trust Client: Kubernetes Pod Lifecycle
use hmac::{Hmac, Mac};
use sha2::Sha256;
use reqwest::Client;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct PraxisK8sClient {
    base_url: String,
    secret_key: Vec<u8>,
    http: Client,
}

impl PraxisK8sClient {
    pub async fn isolate_node(&self, node_id: &str, reason: &str) -> Result<(), reqwest::Error> {
        let ts = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs().to_string();
        let mut mac = Hmac::<Sha256>::new_from_slice(&self.secret_key).unwrap();
        mac.update(format!("POST:/v1/nodes/{}/quarantine:{}", node_id, ts).as_bytes());
        let sig = hex::encode(mac.finalize().into_bytes());

        self.http.post(format!("{}/v1/nodes/{}/quarantine", self.base_url, node_id))
            .header("X-Exultia-Timestamp", ts)
            .header("X-Exultia-Signature", sig)
            .json(&serde_json::json!({ "reason": reason }))
            .send().await?.error_for_status()?;
        Ok(())
    }
}`
    }
  };

  const activePraxisCode = (PRAXIS_CODE_SAMPLES['k8s'] && PRAXIS_CODE_SAMPLES['k8s'][praxisLang]) || '// Praxis Code';

  // ─────────────────────────────────────────────────────────────
  // 6. PUREOS SIMULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [pureOsImage, setPureOsImage] = useState<'ubuntu' | 'node' | 'python'>('ubuntu');

  const PUREOS_COMPARISONS = {
    ubuntu: {
      upstream: { name: 'ubuntu:24.04', size: '78 MB', binaries: 384, cves: 34, cisScore: '64.2%' },
      pureos: { name: 'pureos/ubuntu-hardened:24.04', size: '22 MB', binaries: 42, cves: 0, cisScore: '99.4%' },
      removed: [
        { bin: '/usr/bin/gcc', reason: 'Prevent runtime C compiler exploit payload compilation' },
        { bin: '/usr/bin/curl', reason: 'Eliminate reverse shell exfiltration download vectors' },
        { bin: '/bin/su', reason: 'Eradicate local root privilege escalation binaries' },
        { bin: '/etc/sudoers', reason: 'Zero-sudoer immutable runtime architecture' },
        { bin: '/usr/bin/passwd', reason: 'Prevent rogue user account credential injection' }
      ]
    },
    node: {
      upstream: { name: 'node:20-alpine', size: '138 MB', binaries: 298, cves: 21, cisScore: '68.5%' },
      pureos: { name: 'pureos/node-zero-trust:20-alpine', size: '39 MB', binaries: 31, cves: 0, cisScore: '98.8%' },
      removed: [
        { bin: '/usr/bin/npm', reason: 'Excise package manager from production production layer' },
        { bin: '/bin/sh', reason: 'Enforce distroless scratch shell execution avoidance' },
        { bin: '/sbin/apk', reason: 'Immutable alpine package index prevents untrusted installs' }
      ]
    },
    python: {
      upstream: { name: 'python:3.12-slim', size: '154 MB', binaries: 340, cves: 28, cisScore: '71.0%' },
      pureos: { name: 'pureos/python-cis:3.12', size: '44 MB', binaries: 36, cves: 0, cisScore: '99.2%' },
      removed: [
        { bin: '/usr/local/bin/pip', reason: 'Pip excised to prevent runtime rogue wheel injection' },
        { bin: '/usr/bin/wget', reason: 'Eliminate remote code payload fetch utilities' },
        { bin: '/usr/bin/perl', reason: 'Remove auxiliary script engines exploited in memory injections' }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 7. AXIOM API PLAYGROUND STATE
  // ─────────────────────────────────────────────────────────────
  const [axiomEndpoint, setAxiomEndpoint] = useState<'domains' | 'session' | 'submit' | 'transcript'>('domains');
  const [axiomCalling, setAxiomCalling] = useState(false);
  const [axiomResponse, setAxiomResponse] = useState<any>({
    status: 200,
    latency: '18ms',
    data: {
      domains: [
        { id: 'sec_plus_sy0701', name: 'CompTIA Security+ SY0-701', questionsCount: 450, passScore: 750 },
        { id: 'cissp_cat8', name: 'ISC2 CISSP (8 Common Body of Knowledge Domains)', questionsCount: 920, passScore: 700 },
        { id: 'ceh_v12', name: 'EC-Council Certified Ethical Hacker v12', questionsCount: 600, passScore: 70 }
      ],
      engineVersion: 'Axiom-LMS-2.4.0',
      activeProctors: 14
    }
  });

  const runAxiomApiCall = (endpoint: 'domains' | 'session' | 'submit' | 'transcript') => {
    setAxiomCalling(true);
    setAxiomEndpoint(endpoint);

    setTimeout(() => {
      setAxiomCalling(false);
      if (endpoint === 'domains') {
        setAxiomResponse({
          status: 200,
          latency: '19ms',
          data: {
            domains: [
              { id: 'sec_plus_sy0701', name: 'CompTIA Security+ SY0-701', questionsCount: 450, passScore: 750 },
              { id: 'cissp_cat8', name: 'ISC2 CISSP (8 Common Body of Knowledge Domains)', questionsCount: 920, passScore: 700 },
              { id: 'ceh_v12', name: 'EC-Council Certified Ethical Hacker v12', questionsCount: 600, passScore: 70 }
            ],
            engineVersion: 'Axiom-LMS-2.4.0',
            activeProctors: 14
          }
        });
      } else if (endpoint === 'session') {
        setAxiomResponse({
          status: 201,
          latency: '34ms',
          data: {
            sessionId: 'sess_99a8b1c4e',
            candidateId: 'cand_48102',
            examCode: 'SY0-701',
            proctorStatus: 'VERIFIED_WEBCAM_LOCKED',
            durationMinutes: 90,
            antiCheatToken: 'act_09f8c12a48b914',
            expiresAt: new Date(Date.now() + 5400000).toISOString()
          }
        });
      } else if (endpoint === 'submit') {
        setAxiomResponse({
          status: 200,
          latency: '42ms',
          data: {
            submissionId: 'sub_7749102',
            candidateId: 'cand_48102',
            domainBreakdown: {
              'Threats, Attacks, & Vulnerabilities': '92%',
              'Architecture & Design': '88%',
              'Implementation & Cryptography': '95%',
              'Operations & Incident Response': '90%'
            },
            calculatedScore: 824,
            minimumPassingScore: 750,
            outcome: 'PASSED_CERTIFICATION_AWARDED',
            credentialVerificationUrl: 'https://exultia.tech/verify/AXIOM-2026-9481'
          }
        });
      } else {
        setAxiomResponse({
          status: 200,
          latency: '22ms',
          data: {
            candidateId: 'cand_48102',
            fullName: 'Alex Vance',
            issuedCredential: 'CompTIA Security+ Equivalent (Axiom Standard)',
            credentialHash: 'sha256:49182ab91c4801e9981240a18293c8a91823',
            digitalSignature: 'SIG_ED25519:9f8b1c48a91048...',
            cryptographicAttestationVerified: true
          }
        });
      }
    }, 400);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#F8FAFC', paddingBottom: '5rem' }}>
      
      {/* ── TOP HERO HEADER ── */}
      <div style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.15) 0%, rgba(2, 6, 23, 0) 70%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '3.5rem 1.5rem 2.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 14px', borderRadius: '999px', marginBottom: '1.25rem' }}>
            <Sparkles size={14} color="#38BDF8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Exultia Systems Research &amp; Live Validation Lab
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 1rem 0', color: '#FFFFFF' }}>
            Interactive Security Testing &amp; Product Validation
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '820px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Experience first-hand how every product in the Exultia ecosystem performs during real-world security testing. Demo compilers, threat feeds, 3-tier remediation, redaction engines, and classic OS emulators <strong>without installing anything or running code locally</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            maxWidth: '1000px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Interactive Simulators</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#38BDF8' }}>7 Live Modules</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Live Ingest Audits</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#A78BFA' }}>10,895 CVEs</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Rollback Verification</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#34D399' }}>100% Deterministic</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Zero-Trust Compliance</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#EAB308' }}>100% Airgap Safe</div>
            </div>
          </div>

        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* ── TOP-LEVEL RESEARCH MODULE SELECTOR ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '2.5rem'
        }}>
          {[
            { id: 'pureide', name: 'PureIDE', desc: 'Hermetic Compiler', icon: <PureIdeIcon size={20} glow={false} />, color: '#3B82F6' },
            { id: 'vantage', name: 'Vantage', desc: 'Threat Ingest', icon: <VantageIcon size={20} glow={false} />, color: '#8B5CF6' },
            { id: 'kinetic', name: 'Kinetic', desc: '3-Tier Hotfix', icon: <KineticIcon size={20} glow={false} />, color: '#06B6D4' },
            { id: 'inquest', name: 'Inquest', desc: 'FOIA Redaction', icon: <InquestIcon size={20} glow={false} />, color: '#EC4899' },
            { id: 'praxis', name: 'Praxis', desc: 'SDK Synthesizer', icon: <PraxisIcon size={20} glow={false} />, color: '#F59E0B' },
            { id: 'pureos', name: 'PureOS', desc: 'Attack Surface', icon: <PureOsIcon size={20} glow={false} />, color: '#10B981' },
            { id: 'axiom', name: 'Axiom', desc: 'LMS REST API', icon: <AxiomIcon size={20} glow={false} />, color: '#F43F5E' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ResearchTab)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 8px',
                  background: isActive ? `${tab.color}25` : 'transparent',
                  border: isActive ? `1px solid ${tab.color}` : '1px solid transparent',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 0 15px ${tab.color}33` : 'none'
                }}
              >
                {tab.icon}
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isActive ? '#FFFFFF' : '#CBD5E1' }}>
                  {tab.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: PUREIDE HERMETIC COMPILER & WORKSTATION ATTRIBUTOR
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'pureide' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PureIdeIcon size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#38BDF8' }}>
                    PureIDE Hermetic Workstation Compiler &amp; Egress Sandbox
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Validating zero-telemetry compilation, supply-chain lifecycle hook interception, and in-toto SLSA L3 provenance.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700 }}>
                  SLSA Level 3
                </span>
                <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#34D399', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700 }}>
                  Zero-Egress
                </span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Target Workspace Repository:</label>
                  <select
                    value={pureIdeRepo}
                    onChange={(e) => setPureIdeRepo(e.target.value as any)}
                    style={{ background: '#0F172A', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }}
                  >
                    <option value="telemetry-agent">telemetry-agent (Malicious postinstall beacon)</option>
                    <option value="auth-vault">auth-vault (Zero-trust Go token microservice)</option>
                    <option value="kernel-driver">kernel-driver (Rust eBPF network probe)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                  <input
                    type="checkbox"
                    id="egress-toggle"
                    checked={pureIdeEgressBlock}
                    onChange={(e) => setPureIdeEgressBlock(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="egress-toggle" style={{ fontSize: '0.82rem', color: '#CBD5E1', cursor: 'pointer' }}>
                    Enforce PureIDE Egress Firewall (Zero-Trust)
                  </label>
                </div>
              </div>

              <button
                onClick={runPureIdeBuild}
                disabled={pureIdeBuilding}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #0284C7, #2563EB)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: pureIdeBuilding ? 'not-allowed' : 'pointer',
                  opacity: pureIdeBuilding ? 0.6 : 1,
                  boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
                }}
              >
                <Play size={16} />
                {pureIdeBuilding ? 'Compiling in Sandbox...' : 'Run Hermetic Sandboxed Build'}
              </button>
            </div>

            {/* Live Progress Bar */}
            {pureIdeBuilding && (
              <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${pureIdeProgress}%`, height: '100%', background: '#38BDF8', transition: 'width 0.3s ease' }} />
              </div>
            )}

            {/* Live Build Terminal Log */}
            <div style={{ background: '#020617', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', minHeight: '180px', maxHeight: '280px', overflowY: 'auto' }}>
              {pureIdeLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.includes('ALERT') || log.includes('NEUTRALIZED') ? '#F87171' : log.includes('PROVENANCE') || log.includes('DIGEST') ? '#34D399' : '#94A3B8', marginBottom: '4px' }}>
                  {log}
                </div>
              ))}
            </div>

            {/* Validation Callout Card */}
            {pureIdeDone && (
              <div style={{ marginTop: '1.25rem', background: pureIdeBlockedLeak ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)', border: pureIdeBlockedLeak ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <ShieldCheck size={18} color={pureIdeBlockedLeak ? '#EF4444' : '#22C55E'} />
                  <strong style={{ color: pureIdeBlockedLeak ? '#FCA5A5' : '#86EFAC', fontSize: '0.9rem' }}>
                    {pureIdeBlockedLeak ? 'Validation Passed: Malicious Egress Attempt Intercepted & Blocked' : 'Validation Passed: Pure Hermetic Reproducible Build Verified'}
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                  The PureIDE compiler sandbox successfully prevented untrusted telemetry exfiltration without interrupting the artifact assembly. Output hashes are 100% reproducible across isolated build nodes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: VANTAGE THREAT INTELLIGENCE & CVE QUERY EXPLORER
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'vantage' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <VantageIcon size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#C084FC' }}>
                    Vantage Threat Intelligence &amp; CVE Feed Explorer
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Real-time query engine auditing 10,895 enriched advisories with CISA KEV status, EPSS ratings, and machine-executable hotfixes.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setVantageViewMode('dossier')}
                  style={{
                    background: vantageViewMode === 'dossier' ? '#8B5CF6' : 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Visual Dossier
                </button>
                <button
                  onClick={() => setVantageViewMode('json')}
                  style={{
                    background: vantageViewMode === 'json' ? '#8B5CF6' : 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Raw REST API (JSON)
                </button>
              </div>
            </div>

            {/* Search and Quick Preset Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 240px' }}>
                <Search size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={vantageSearch}
                  onChange={(e) => setVantageSearch(e.target.value)}
                  placeholder="Search CVE, keyword, or advisory..."
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '7px 10px 7px 32px',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              {VANTAGE_SAMPLE_FEED.map(item => (
                <button
                  key={item.cve}
                  onClick={() => setVantageSearch(item.cve)}
                  style={{
                    background: activeVantageItem.cve === item.cve ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: activeVantageItem.cve === item.cve ? '1px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: activeVantageItem.cve === item.cve ? '#C084FC' : '#CBD5E1',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {item.cve}
                </button>
              ))}
            </div>

            {/* Dossier or JSON View */}
            {vantageViewMode === 'dossier' ? (
              <div style={{ background: '#020617', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#C084FC' }}>
                      {activeVantageItem.cve}
                    </span>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      {activeVantageItem.severity} (CVSS {activeVantageItem.cvss})
                    </span>
                    {activeVantageItem.kev && (
                      <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.2)', color: '#FDE047', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        CISA KEV EXPLOITED
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    EPSS Exploitation Probability: <strong style={{ color: '#38BDF8' }}>{activeVantageItem.epss}</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
                  {activeVantageItem.title}
                </h3>

                <p style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  {activeVantageItem.description}
                </p>

                <div style={{ background: '#0B0F19', padding: '10px', borderRadius: '6px', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '14px' }}>
                  <strong>Affected Linux Distributions:</strong> {activeVantageItem.affected.join(' • ')}
                </div>

                {/* Hotfix and Rollback commands */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#22D3EE', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>TIER 1 ZERO-DOWNTIME HOTFIX</span>
                      <button
                        onClick={() => copyToClipboard(activeVantageItem.hotfix, 'vt-fix')}
                        style={{ background: 'transparent', border: 'none', color: '#22D3EE', cursor: 'pointer', fontSize: '0.7rem' }}
                      >
                        {copiedText === 'vt-fix' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code style={{ fontSize: '0.75rem', color: '#67E8F9', display: 'block', wordBreak: 'break-all' }}>
                      {activeVantageItem.hotfix}
                    </code>
                  </div>

                  <div style={{ background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F472B6', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>DETERMINISTIC ROLLBACK</span>
                      <button
                        onClick={() => copyToClipboard(activeVantageItem.rollback, 'vt-rb')}
                        style={{ background: 'transparent', border: 'none', color: '#F472B6', cursor: 'pointer', fontSize: '0.7rem' }}
                      >
                        {copiedText === 'vt-rb' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code style={{ fontSize: '0.75rem', color: '#F472B6', display: 'block', wordBreak: 'break-all' }}>
                      {activeVantageItem.rollback}
                    </code>
                  </div>
                </div>
              </div>
            ) : (
              <pre style={{ background: '#020617', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '1.25rem', color: '#A78BFA', fontSize: '0.78rem', overflowX: 'auto', maxHeight: '350px' }}>
                {JSON.stringify(activeVantageItem, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: KINETIC AUTONOMOUS 3-TIER REMEDIATION RIG
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'kinetic' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <KineticIcon size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#22D3EE' }}>
                    Kinetic Autonomous Remediation &amp; Canary Rollback Testing Rig
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Simulating zero-reboot hot-mitigation on active OpenSSH server clusters with deterministic rollback.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700 }}>
                  Zero-Reboot
                </span>
                <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#F472B6', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700 }}>
                  100% Reversible
                </span>
              </div>
            </div>

            {/* Status Ribbon & Controls */}
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Current Host State:</span>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '6px',
                  background: kineticState === 'vulnerable' ? 'rgba(239, 68, 68, 0.2)' : kineticState === 'mitigated' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                  color: kineticState === 'vulnerable' ? '#F87171' : kineticState === 'mitigated' ? '#34D399' : '#F472B6',
                  border: `1px solid ${kineticState === 'vulnerable' ? '#EF4444' : kineticState === 'mitigated' ? '#22C55E' : '#EC4899'}`
                }}>
                  {kineticState.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={applyKineticHotfix}
                  disabled={kineticState === 'mitigated' || kineticState === 'applying'}
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                    color: '#000',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: kineticState === 'mitigated' ? 'not-allowed' : 'pointer',
                    opacity: kineticState === 'mitigated' ? 0.5 : 1
                  }}
                >
                  ▶ Deploy Tier 1 Hot-Mitigation
                </button>
                <button
                  onClick={rollbackKineticHotfix}
                  disabled={kineticState === 'vulnerable' || kineticState === 'reverting'}
                  style={{
                    background: 'rgba(236, 72, 153, 0.15)',
                    color: '#F472B6',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: kineticState === 'vulnerable' ? 'not-allowed' : 'pointer',
                    opacity: kineticState === 'vulnerable' ? 0.5 : 1
                  }}
                >
                  ↺ Trigger Deterministic Rollback
                </button>
              </div>
            </div>

            {/* Execution Trace */}
            <div style={{ background: '#020617', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', minHeight: '180px' }}>
              {kineticLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.includes('MITIGATED') ? '#34D399' : log.includes('REVERT') || log.includes('restored') ? '#F472B6' : '#94A3B8', marginBottom: '4px' }}>
                  {log}
                </div>
              ))}
            </div>

            {/* Action Bar Linking to Kinetic Stream & Subscription */}
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'rgba(0, 0, 0, 0.25)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                Deploying to live production clusters? Manage your node licenses and SLSA Level 3 signed manifests.
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/app/patches"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#22D3EE',
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Launch Live Stream Console →</span>
                </Link>
                <Link
                  href="/account/subscription?product=kinetic"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#000',
                    background: '#22D3EE',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Sparkles size={13} />
                  <span>View Kinetic Pricing &amp; Plans →</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: INQUEST FOIA LEGAL REDACTION PIPELINE
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'inquest' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <InquestIcon size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#F472B6' }}>
                    Inquest Automated Public Records &amp; FOIA Redaction Pipeline
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Automated entity identification, statutory exemption tagging (FOIA 1-9), and court-admissible chain-of-custody seals.
                  </span>
                </div>
              </div>

              <button
                onClick={runInquestRedaction}
                disabled={inquestProcessing}
                style={{
                  background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {inquestProcessing ? 'Processing Redactions...' : 'Run Automated Legal Discovery & Redaction'}
              </button>
            </div>

            {/* Document Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              {[
                { id: 'water-contract', label: 'Austin Water Contract ($14.2M)' },
                { id: 'police-ia', label: 'Police Internal Affairs Report' },
                { id: 'grant-audit', label: 'NSF Quantum Cryptography Audit' }
              ].map(doc => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setInquestDoc(doc.id as any);
                    setInquestRedacted(false);
                  }}
                  style={{
                    background: inquestDoc === doc.id ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: inquestDoc === doc.id ? '1px solid #EC4899' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: inquestDoc === doc.id ? '#F472B6' : '#CBD5E1',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {doc.label}
                </button>
              ))}
            </div>

            {/* Side-by-Side Comparator */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#020617', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EF4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={15} /> ORIGINAL UNREDACTED RECORD (EXPOSES PII &amp; TRADE SECRETS)
                </div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#FCA5A5', fontSize: '0.76rem', lineHeight: 1.5, fontFamily: 'monospace' }}>
                  {INQUEST_DOCS[inquestDoc].unredacted}
                </pre>
              </div>

              <div style={{ background: '#020617', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} /> COMPLIANCE REDACTED OUTPUT (STATUTORY CITATIONS TAGGED)
                </div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: inquestRedacted ? '#86EFAC' : '#64748B', fontSize: '0.76rem', lineHeight: 1.5, fontFamily: 'monospace' }}>
                  {inquestRedacted ? INQUEST_DOCS[inquestDoc].redacted : 'Click "Run Automated Legal Discovery & Redaction" above to process document...'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 5: PRAXIS ZERO-TRUST SDK SYNTHESIZER
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'praxis' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PraxisIcon size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#FDE047' }}>
                    Praxis Zero-Trust API Client SDK Synthesizer
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Synthesizing hardened, zero-telemetry API client SDKs with native mTLS, token rotation, and HMAC replay guards.
                  </span>
                </div>
              </div>

              {/* Language Pills */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['typescript', 'python', 'go', 'rust'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setPraxisLang(lang)}
                    style={{
                      background: praxisLang === lang ? '#F59E0B' : 'rgba(255, 255, 255, 0.05)',
                      color: praxisLang === lang ? '#000000' : '#CBD5E1',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Output Window */}
            <div style={{ background: '#020617', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1.25rem', position: 'relative' }}>
              <button
                onClick={() => copyToClipboard(activePraxisCode, 'praxis-code')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#FDE047',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedText === 'praxis-code' ? <Check size={13} /> : <Copy size={13} />}
                {copiedText === 'praxis-code' ? 'Copied SDK' : 'Copy Code'}
              </button>

              <pre style={{ margin: 0, color: '#FDE047', fontSize: '0.78rem', lineHeight: 1.5, fontFamily: 'monospace', overflowX: 'auto', maxHeight: '380px' }}>
                {activePraxisCode}
              </pre>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 6: PUREOS CONTAINER ATTACK-SURFACE ANALYZER
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'pureos' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PureOsIcon size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#34D399' }}>
                    PureOS Pre-Hardened Container Attack-Surface Analyzer
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Comparative analysis demonstrating 88% binary reduction, zero critical CVEs, and 99.4% CIS Benchmark compliance.
                  </span>
                </div>
              </div>

              {/* Image selector */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['ubuntu', 'node', 'python'] as const).map(img => (
                  <button
                    key={img}
                    onClick={() => setPureOsImage(img)}
                    style={{
                      background: pureOsImage === img ? '#10B981' : 'rgba(255, 255, 255, 0.05)',
                      color: pureOsImage === img ? '#000000' : '#CBD5E1',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {img}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Comparative Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ background: '#020617', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.25rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', color: '#F87171', fontWeight: 800 }}>UPSTREAM DEFAULT ({PUREOS_COMPARISONS[pureOsImage].upstream.name})</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>{PUREOS_COMPARISONS[pureOsImage].upstream.cves} Known CVEs</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>Binaries in $PATH: {PUREOS_COMPARISONS[pureOsImage].upstream.binaries} • CIS Score: {PUREOS_COMPARISONS[pureOsImage].upstream.cisScore}</div>
              </div>

              <div style={{ background: '#020617', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1.25rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800 }}>PUREOS HARDENED ({PUREOS_COMPARISONS[pureOsImage].pureos.name})</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34D399', marginTop: '6px' }}>0 Critical/High CVEs</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>Binaries in $PATH: {PUREOS_COMPARISONS[pureOsImage].pureos.binaries} (88% reduction) • CIS Score: {PUREOS_COMPARISONS[pureOsImage].pureos.cisScore}</div>
              </div>
            </div>

            {/* Removed Vectors Table */}
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Excised Attack Surface Utilities &amp; Rationale:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {PUREOS_COMPARISONS[pureOsImage].removed.map(r => (
                  <div key={r.bin} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.4)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <code style={{ color: '#F87171', fontWeight: 700 }}>{r.bin}</code>
                    <span style={{ color: '#94A3B8' }}>{r.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 7: AXIOM LMS & ASSESSMENT REST API PLAYGROUND
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'axiom' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AxiomIcon size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#FDA4AF' }}>
                    Axiom Cybersecurity Exam Simulator &amp; LMS API Playground
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Direct testing interface for enterprise LMS integration, proctored session generation, and candidate grading endpoints.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'domains', label: 'GET /domains' },
                  { id: 'session', label: 'POST /sessions/start' },
                  { id: 'submit', label: 'POST /assessments/submit' },
                  { id: 'transcript', label: 'GET /transcript' }
                ].map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => runAxiomApiCall(ep.id as any)}
                    style={{
                      background: axiomEndpoint === ep.id ? '#F43F5E' : 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            {/* API Console Display */}
            <div style={{ background: '#020617', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#22C55E', color: '#000', fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                    HTTP {axiomResponse.status} OK
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                    Latency: {axiomResponse.latency}
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>
                  Bearer sec_live_axiom_99a8b12...
                </span>
              </div>

              <pre style={{ margin: 0, color: '#FDA4AF', fontSize: '0.78rem', lineHeight: 1.5, fontFamily: 'monospace', overflowX: 'auto', maxHeight: '300px' }}>
                {JSON.stringify(axiomResponse.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
