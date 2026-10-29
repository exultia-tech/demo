"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Copy,
  Check,
  Search,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Server,
  Terminal,
  Activity,
  Package,
  Layers,
  Cpu,
  RefreshCw,
  ExternalLink,
  Code2
} from "lucide-react";
import {
  DaedelusIcon,
  PureIdeIcon,
  VantageIcon,
  KineticIcon,
  PraxisIcon,
  PureOsIcon,
  AxiomIcon,
  ArgentIcon,
  ErisIcon,
  ValkyrieIcon
} from "@/components/BrandIcons";

interface ProductSimulatorsProps {
  productId: string;
  accentColor: string;
}

export default function ProductSimulators({ productId, accentColor }: ProductSimulatorsProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [exultiaTerminalTab, setExultiaTerminalTab] = useState<"status" | "hotfix" | "rollback" | "audit">("status");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // 1. PUREIDE SIMULATOR STATE
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

  // 2. VANTAGE SIMULATOR STATE
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

  // 3. KINETIC SIMULATOR STATE
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


  // 5. PRAXIS SIMULATOR STATE
  const [praxisLang, setPraxisLang] = useState<'typescript' | 'python' | 'go' | 'rust'>('typescript');
  const PRAXIS_CODE_SAMPLES: Record<string, string> = {
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
  };

  // 6. PUREOS SIMULATOR STATE
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

  // 7. AXIOM SIMULATOR STATE
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

  // 8. ARGENT SIMULATOR STATE
  const [argentDistro, setArgentDistro] = useState<'ubuntu24' | 'rocky9' | 'debian12' | 'rhel9' | 'alpine320'>('rocky9');
  const [argentStream, setArgentStream] = useState<'all' | 'security' | 'bugfix' | 'enhancement'>('all');
  const [argentSyncing, setArgentSyncing] = useState(false);
  const [argentLogs, setArgentLogs] = useState<string[]>([
    '[INIT] Argent Unified Vendor Patch Engine v2.1.0 ready',
    '[MIRROR] Upstream vendor repos connected: Canonical, Red Hat, Rocky Enterprise Software Foundation, Debian, Alpine',
    '[CACHE] 1,480 vendor advisories indexed in local SQLite/Turso buffer'
  ]);

  const runArgentSync = () => {
    setArgentSyncing(true);
    setArgentLogs([
      `[${new Date().toISOString()}] [CONNECT] Connecting to official upstream mirror for ${argentDistro.toUpperCase()}...`,
      `[INGEST] Fetching metadata stream: filter=${argentStream}...`,
      `[GPG] Verifying release signature using vendor public keyring... OK (Valid signature from Release Key ID: 0x48A1B9)`
    ]);

    setTimeout(() => {
      setArgentLogs(prev => [
        ...prev,
        `[INDEX] Ingesting 48 candidate package advisories...`,
        `[DEDUPE] Cross-referencing against universal package database (Zero duplicate entries).`,
        `[AUDIT] Calculating package SHA256 integrity trees for binary verification.`
      ]);
    }, 800);

    setTimeout(() => {
      setArgentSyncing(false);
      setArgentLogs(prev => [
        ...prev,
        `[SUCCESS] Mirror sync complete in 1,240ms. 48 clean packages staged for zero-downtime deployment.`,
        `[STREAM] Live feed ready: https://exultia.tech/api/argent/feed?distro=${argentDistro}&stream=${argentStream}`
      ]);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* ─────────────────────────────────────────────────────────────
          PRAXIS / KINETIC HOTPATCH SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {(productId === "kinetic" || productId === "praxis" || productId === "exultia-linux") && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(6, 182, 212, 0.3)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <KineticIcon size={32} />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#22D3EE" }}>
                  Kinetic Autonomous 3-Tier Hotfix &amp; Sub-Second Rollback Rig
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Simulate zero-reboot hot-mitigation on active server clusters with sub-50ms deterministic rollback.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "rgba(6, 182, 212, 0.15)", color: "#22D3EE", border: "1px solid rgba(6, 182, 212, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                Zero-Reboot
              </span>
              <span style={{ background: "rgba(236, 72, 153, 0.15)", color: "#F472B6", border: "1px solid rgba(236, 72, 153, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                100% Reversible
              </span>
            </div>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.4)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "0.85rem", color: "#94A3B8" }}>Current Host State:</span>
              <span style={{
                fontSize: "0.82rem",
                fontWeight: 800,
                padding: "4px 12px",
                borderRadius: "6px",
                background: kineticState === 'vulnerable' ? 'rgba(239, 68, 68, 0.2)' : kineticState === 'mitigated' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                color: kineticState === 'vulnerable' ? '#F87171' : kineticState === 'mitigated' ? '#34D399' : '#F472B6',
                border: `1px solid ${kineticState === 'vulnerable' ? '#EF4444' : kineticState === 'mitigated' ? '#22C55E' : '#EC4899'}`
              }}>
                {kineticState.toUpperCase()}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
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

          <div style={{ background: '#020617', borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "1.25rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", minHeight: "180px" }}>
            {kineticLogs.map((log, idx) => (
              <div key={idx} style={{ color: log.includes('MITIGATED') ? '#34D399' : log.includes('REVERT') || log.includes('restored') ? '#F472B6' : '#94A3B8', marginBottom: '4px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PUREIDE SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {(productId === "pureide" || productId === "daedelus") && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {productId === "daedelus" ? <DaedelusIcon size={32} /> : <PureIdeIcon size={32} />}
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#38BDF8" }}>
                  {productId === "daedelus" ? "Daedelus: Secure Workstations, Containers & Packages" : "PureIDE Hermetic Compiler & Workstation Egress Sandbox"}
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Auditing zero-telemetry compilation, supply-chain hook interception, and in-toto SLSA Level 3 provenance.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                SLSA Level 3
              </span>
              <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#34D399", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                Zero-Egress
              </span>
            </div>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.4)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Target Workspace Repository:</label>
                <select
                  value={pureIdeRepo}
                  onChange={(e) => setPureIdeRepo(e.target.value as any)}
                  style={{ background: "#0F172A", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.82rem", outline: "none" }}
                >
                  <option value="telemetry-agent">telemetry-agent (Malicious postinstall beacon)</option>
                  <option value="auth-vault">auth-vault (Zero-trust Go token microservice)</option>
                  <option value="kernel-driver">kernel-driver (Rust eBPF network probe)</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <input
                  type="checkbox"
                  id="egress-toggle"
                  checked={pureIdeEgressBlock}
                  onChange={(e) => setPureIdeEgressBlock(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="egress-toggle" style={{ fontSize: "0.82rem", color: "#CBD5E1", cursor: "pointer" }}>
                  Enforce PureIDE Egress Firewall (Zero-Trust)
                </label>
              </div>
            </div>

            <button
              onClick={runPureIdeBuild}
              disabled={pureIdeBuilding}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #0284C7, #2563EB)",
                color: "white",
                border: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: pureIdeBuilding ? "not-allowed" : "pointer",
                opacity: pureIdeBuilding ? 0.6 : 1
              }}
            >
              <Play size={16} />
              {pureIdeBuilding ? "Compiling in Sandbox..." : "Run Hermetic Sandboxed Build"}
            </button>
          </div>

          {pureIdeBuilding && (
            <div style={{ marginBottom: "1rem", background: "rgba(255,255,255,0.08)", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: `${pureIdeProgress}%`, height: "100%", background: "#38BDF8", transition: "width 0.3s ease" }} />
            </div>
          )}

          <div style={{ background: "#020617", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "1.25rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", minHeight: "180px", maxHeight: "280px", overflowY: "auto" }}>
            {pureIdeLogs.map((log, idx) => (
              <div key={idx} style={{ color: log.includes('ALERT') || log.includes('NEUTRALIZED') ? '#F87171' : log.includes('PROVENANCE') || log.includes('DIGEST') ? '#34D399' : '#94A3B8', marginBottom: '4px' }}>
                {log}
              </div>
            ))}
          </div>

          {pureIdeDone && (
            <div style={{ marginTop: "1.25rem", background: pureIdeBlockedLeak ? "rgba(239, 68, 68, 0.08)" : "rgba(34, 197, 94, 0.08)", border: pureIdeBlockedLeak ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <ShieldCheck size={18} color={pureIdeBlockedLeak ? "#EF4444" : "#22C55E"} />
                <strong style={{ color: pureIdeBlockedLeak ? "#FCA5A5" : "#86EFAC", fontSize: "0.9rem" }}>
                  {pureIdeBlockedLeak ? "Validation Passed: Malicious Egress Attempt Intercepted & Blocked" : "Validation Passed: Pure Hermetic Reproducible Build Verified"}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#CBD5E1", lineHeight: 1.5 }}>
                The PureIDE compiler sandbox successfully prevented untrusted telemetry exfiltration without interrupting the artifact assembly. Output hashes are 100% reproducible across isolated build nodes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VANTAGE SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {productId === "vantage" && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(139, 92, 246, 0.3)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <VantageIcon size={32} />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#C084FC" }}>
                  Vantage Threat Intelligence &amp; CVE Feed Explorer
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Real-time query engine auditing enriched advisories with CISA KEV status, EPSS ratings, and machine-executable hotfixes.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
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
                Raw JSON
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 240px" }}>
              <Search size={16} color="#64748B" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                value={vantageSearch}
                onChange={(e) => setVantageSearch(e.target.value)}
                placeholder="Search CVE, keyword, or advisory..."
                style={{
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  padding: "7px 10px 7px 32px",
                  color: "#FFFFFF",
                  fontSize: "0.82rem",
                  outline: "none"
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

          {vantageViewMode === 'dossier' ? (
            <div style={{ background: "#020617", border: "1px solid rgba(139, 92, 246, 0.3)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#C084FC" }}>
                    {activeVantageItem.cve}
                  </span>
                  <span style={{ fontSize: "0.72rem", background: "rgba(239, 68, 68, 0.2)", color: "#F87171", padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>
                    {activeVantageItem.severity} (CVSS {activeVantageItem.cvss})
                  </span>
                  {activeVantageItem.kev && (
                    <span style={{ fontSize: "0.72rem", background: "rgba(245, 158, 11, 0.2)", color: "#FDE047", padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>
                      CISA KEV
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                  EPSS Exploitation Probability: <strong style={{ color: "#38BDF8" }}>{activeVantageItem.epss}</strong>
                </span>
              </div>

              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 10px 0" }}>
                {activeVantageItem.title}
              </h4>

              <p style={{ fontSize: "0.84rem", color: "#CBD5E1", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                {activeVantageItem.description}
              </p>

              <div style={{ background: "#0B0F19", padding: "10px", borderRadius: "6px", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "14px" }}>
                <strong>Affected Distributions:</strong> {activeVantageItem.affected.join(" • ")}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                <div style={{ background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "8px", padding: "10px" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#22D3EE", marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
                    <span>TIER 1 ZERO-DOWNTIME HOTFIX</span>
                    <button
                      onClick={() => copyToClipboard(activeVantageItem.hotfix, 'vt-fix')}
                      style={{ background: "transparent", border: "none", color: "#22D3EE", cursor: "pointer", fontSize: "0.7rem" }}
                    >
                      {copiedText === 'vt-fix' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <code style={{ fontSize: "0.75rem", color: "#67E8F9", display: "block", wordBreak: "break-all" }}>
                    {activeVantageItem.hotfix}
                  </code>
                </div>

                <div style={{ background: "rgba(236, 72, 153, 0.08)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: "8px", padding: "10px" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#F472B6", marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
                    <span>DETERMINISTIC ROLLBACK</span>
                    <button
                      onClick={() => copyToClipboard(activeVantageItem.rollback, 'vt-rb')}
                      style={{ background: "transparent", border: "none", color: "#F472B6", cursor: "pointer", fontSize: "0.7rem" }}
                    >
                      {copiedText === 'vt-rb' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <code style={{ fontSize: "0.75rem", color: "#F472B6", display: "block", wordBreak: "break-all" }}>
                    {activeVantageItem.rollback}
                  </code>
                </div>
              </div>
            </div>
          ) : (
            <pre style={{ background: "#020617", border: "1px solid rgba(139, 92, 246, 0.3)", borderRadius: "12px", padding: "1.25rem", color: "#A78BFA", fontSize: "0.78rem", overflowX: "auto", maxHeight: "350px" }}>
              {JSON.stringify(activeVantageItem, null, 2)}
            </pre>
          )}
        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────
          PRAXIS SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {productId === "praxis" && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <PraxisIcon size={32} />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#FDE047" }}>
                  Praxis Zero-Trust API Client SDK Synthesizer
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Synthesize hardened, zero-telemetry API client SDKs with native mTLS, token rotation, and HMAC replay guards.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
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

          <div style={{ background: "#020617", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", padding: "1.25rem", position: "relative" }}>
            <button
              onClick={() => copyToClipboard(PRAXIS_CODE_SAMPLES[praxisLang], 'praxis-code')}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#FDE047",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              {copiedText === 'praxis-code' ? <Check size={13} /> : <Copy size={13} />}
              {copiedText === 'praxis-code' ? 'Copied SDK' : 'Copy Code'}
            </button>

            <pre style={{ margin: 0, color: "#FDE047", fontSize: "0.78rem", lineHeight: 1.5, fontFamily: "var(--font-mono, monospace)", overflowX: "auto", maxHeight: "380px" }}>
              {PRAXIS_CODE_SAMPLES[praxisLang]}
            </pre>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PUREOS SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {productId === "pureos" && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <PureOsIcon size={32} />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#34D399" }}>
                  PureOS Pre-Hardened Container Attack-Surface Analyzer
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Comparative analysis demonstrating 88% binary reduction, zero critical CVEs, and 99.4% CIS Benchmark compliance.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ background: "#020617", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "1.25rem", borderRadius: "10px" }}>
              <div style={{ fontSize: "0.72rem", color: "#F87171", fontWeight: 800 }}>UPSTREAM DEFAULT ({PUREOS_COMPARISONS[pureOsImage].upstream.name})</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#FFFFFF", marginTop: "6px" }}>{PUREOS_COMPARISONS[pureOsImage].upstream.cves} Known CVEs</div>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "4px" }}>Binaries in $PATH: {PUREOS_COMPARISONS[pureOsImage].upstream.binaries} • CIS Score: {PUREOS_COMPARISONS[pureOsImage].upstream.cisScore}</div>
            </div>

            <div style={{ background: "#020617", border: "1px solid rgba(16, 185, 129, 0.4)", padding: "1.25rem", borderRadius: "10px" }}>
              <div style={{ fontSize: "0.72rem", color: "#34D399", fontWeight: 800 }}>PUREOS HARDENED ({PUREOS_COMPARISONS[pureOsImage].pureos.name})</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#34D399", marginTop: "6px" }}>0 Critical/High CVEs</div>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "4px" }}>Binaries in $PATH: {PUREOS_COMPARISONS[pureOsImage].pureos.binaries} (88% reduction) • CIS Score: {PUREOS_COMPARISONS[pureOsImage].pureos.cisScore}</div>
            </div>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: "10px", padding: "1rem", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
              Excised Attack Surface Utilities &amp; Rationale:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {PUREOS_COMPARISONS[pureOsImage].removed.map(r => (
                <div key={r.bin} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.4)", padding: "6px 10px", borderRadius: "6px", fontSize: "0.75rem" }}>
                  <code style={{ color: "#F87171", fontWeight: 700 }}>{r.bin}</code>
                  <span style={{ color: "#94A3B8" }}>{r.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          AXIOM SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {productId === "axiom" && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <AxiomIcon size={32} />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#FDA4AF" }}>
                  Axiom Cybersecurity Exam Simulator &amp; LMS API Playground
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Direct testing interface for enterprise LMS integration, proctored session generation, and candidate grading endpoints.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
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

          <div style={{ background: "#020617", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "12px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#22C55E", color: "#000", fontSize: "0.7rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                  HTTP {axiomResponse.status} OK
                </span>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                  Latency: {axiomResponse.latency}
                </span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)" }}>
                Bearer sec_live_axiom_99a8b12...
              </span>
            </div>

            <pre style={{ margin: 0, color: "#FDA4AF", fontSize: "0.78rem", lineHeight: 1.5, fontFamily: "var(--font-mono, monospace)", overflowX: "auto", maxHeight: "300px" }}>
              {JSON.stringify(axiomResponse.data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VANTAGE / ARGENT VENDOR STREAM SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {(productId === "argent" || productId === "vantage") && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(148, 163, 184, 0.3)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ArgentIcon size={32} />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#F1F5F9" }}>
                  Argent Multi-Distro Vendor Stream Synchronizer &amp; Mirror Ingest Rig
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Aggregating vendor bugfix, maintenance, and security updates across 27 Linux distributions with GPG signature verification.
                </span>
              </div>
            </div>

            <button
              onClick={runArgentSync}
              disabled={argentSyncing}
              style={{
                background: "linear-gradient(135deg, #64748B, #38BDF8)",
                color: "#FFFFFF",
                border: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "0.82rem",
                cursor: argentSyncing ? "not-allowed" : "pointer",
                opacity: argentSyncing ? 0.6 : 1
              }}
            >
              <RefreshCw size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
              {argentSyncing ? "Syncing Mirror Stream..." : "Sync Upstream Vendor Repos"}
            </button>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.4)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Distribution Profile:</label>
                <select
                  value={argentDistro}
                  onChange={(e) => setArgentDistro(e.target.value as any)}
                  style={{ background: "#0F172A", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.82rem", outline: "none" }}
                >
                  <option value="rocky9">Rocky Linux 9.4 (Enterprise EL9)</option>
                  <option value="ubuntu24">Ubuntu 24.04 LTS (Noble Numbat)</option>
                  <option value="debian12">Debian 12 (Bookworm Stable)</option>
                  <option value="rhel9">Red Hat Enterprise Linux 9</option>
                  <option value="alpine320">Alpine Linux 3.20 (musl/busybox)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Stream Filter:</label>
                <select
                  value={argentStream}
                  onChange={(e) => setArgentStream(e.target.value as any)}
                  style={{ background: "#0F172A", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.82rem", outline: "none" }}
                >
                  <option value="all">All Vendor Streams (Security + Bugfix + Enhancements)</option>
                  <option value="security">Security Only</option>
                  <option value="bugfix">Bugfixes &amp; Maintenance</option>
                  <option value="enhancement">Enhancements &amp; New Packages</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "rgba(148, 163, 184, 0.15)", color: "#F1F5F9", border: "1px solid rgba(148, 163, 184, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                27 OS Families
              </span>
              <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                GPG Verified
              </span>
            </div>
          </div>

          <div style={{ background: "#020617", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "1.25rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", minHeight: "180px" }}>
            {argentLogs.map((log, idx) => (
              <div key={idx} style={{ color: log.includes('SUCCESS') || log.includes('OK') ? '#34D399' : log.includes('STREAM') ? '#38BDF8' : '#94A3B8', marginBottom: '4px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ERIS CHAOS INOCULATOR SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {productId === "eris" && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.4)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ErisIcon size={32} glow={false} />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#FBBF24" }}>
                  Eris Intentional Vulnerability Inoculation &amp; Chaos Range
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Adversary emulation proving ground. Safely compile reproducible bash attack payloads with timed failsafe auto-rollback.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "rgba(245, 158, 11, 0.15)", color: "#FDE047", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                7+ CVE Scenarios
              </span>
              <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#86EFAC", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                100% Reversible
              </span>
            </div>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.4)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>
                Active Target: <strong style={{ color: "#FBBF24" }}>CVE-2024-6387 (SSH RegreSSHion)</strong>
              </span>
              <span style={{ fontSize: "0.85rem", color: "#94A3B8" }}>•</span>
              <span style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>
                Failsafe Auto-Rollback: <strong style={{ color: "#34D399" }}>30 Minutes</strong>
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Link
                href="/app/eris"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #F59E0B, #DC2626)",
                  color: "#FFFFFF",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textDecoration: "none"
                }}
              >
                <span>🔥</span> Open Full Eris Chaos Lab
              </Link>
              <Link
                href="/app/praxis?erisRemediate=true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(34, 197, 94, 0.2)",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  color: "#86EFAC",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textDecoration: "none"
                }}
              >
                <span>⚡</span> Praxis Hotpatch Verification &rarr;
              </Link>
            </div>
          </div>

          <div style={{ background: "#020617", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "1.25rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem" }}>
            <div style={{ color: "#94A3B8", marginBottom: "6px" }}># Eris Ephemeral Attack Range Compilation</div>
            <div style={{ color: "#38BDF8", marginBottom: "4px" }}>$ curl -X POST https://exultia.tech/api/eris/generate -d &#39;&#123;&quot;cveId&quot;:&quot;CVE-2024-6387&quot;,&quot;failsafeMinutes&quot;:30&#125;&#39;</div>
            <div style={{ color: "#34D399", marginBottom: "4px" }}>[OK] Synthesized non-destructive bash payload (SHA-256: e8b91a0c4f...)</div>
            <div style={{ color: "#FBBF24", marginBottom: "4px" }}>[CHAOS] Injected artificial latency probe to test sshd race window (Safe simulation)</div>
            <div style={{ color: "#86EFAC" }}>[FAILSAFE] Registered watchdog rollback timer at /etc/cron.d/eris_rollback (Reverts in 30m)</div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VALKYRIE ON-DEMAND PENTEST SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {productId === "valkyrie" && (
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", border: "1px solid rgba(6, 182, 212, 0.4)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ValkyrieIcon size={32} glow={false} />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#38BDF8" }}>
                  Valkyrie On-Demand Pentest &amp; Exploitability Probes
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                  Breach &amp; attack simulation (BAS) mapped directly to Vantage CVE advisories with cryptographic attestation tokens.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "rgba(6, 182, 212, 0.15)", color: "#67E8F9", border: "1px solid rgba(6, 182, 212, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                Safe BAS Probes
              </span>
              <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#86EFAC", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                SHA-256 Attested
              </span>
            </div>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.4)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>
                Target Probe: <strong style={{ color: "#38BDF8" }}>VALK-SSH-01 (Insecure Handshake)</strong>
              </span>
              <span style={{ fontSize: "0.85rem", color: "#94A3B8" }}>•</span>
              <span style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>
                Vantage Sync: <strong style={{ color: "#A855F7" }}>CVE-2024-6387 (CVSS 9.8)</strong>
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Link
                href="/app/valkyrie"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #06B6D4, #0284C7)",
                  color: "#FFFFFF",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textDecoration: "none"
                }}
              >
                <span>🎯</span> Launch Pentest Console
              </Link>
              <Link
                href="/account/subscription?product=valkyrie"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(6, 182, 212, 0.15)",
                  border: "1px solid rgba(6, 182, 212, 0.4)",
                  color: "#67E8F9",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textDecoration: "none"
                }}
              >
                <span>✨</span> Bundle Discount (30-50% Off)
              </Link>
            </div>
          </div>

          <div style={{ background: "#020617", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "1.25rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem" }}>
            <div style={{ color: "#94A3B8", marginBottom: "6px" }}># Valkyrie Live BAS Probe Execution</div>
            <div style={{ color: "#38BDF8", marginBottom: "4px" }}>$ curl -X POST https://exultia.tech/api/valkyrie/probe -d &#39;&#123;&quot;vectorId&quot;:&quot;VALK-SSH-01&quot;,&quot;targetUrl&quot;:&quot;https://localhost:22&quot;&#125;&#39;</div>
            <div style={{ color: "#34D399", marginBottom: "4px" }}>[PROBE] Sent non-destructive SSH version handshake to localhost:22</div>
            <div style={{ color: "#67E8F9", marginBottom: "4px" }}>[RESULT] Banner: OpenSSH_9.6p1 • Exploit vector mitigated by drop-in config</div>
            <div style={{ color: "#86EFAC" }}>[ATTESTATION] Signed token: VALK-20261024-PASS (HMAC-SHA256 verified)</div>
          </div>
        </div>
      )}

    </div>
  );
}
