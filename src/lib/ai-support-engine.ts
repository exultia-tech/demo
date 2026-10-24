/**
 * Exultia Autonomous AI Support Engine
 * 
 * Provides 24/7 autonomous technical support, licensing calculations,
 * installation commands, deterministic rollback instructions, and product guidance.
 * Explicitly communicates the solo-operator self-service model (no human SLAs/paging).
 */

export interface SupportChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface SupportResponse {
  reply: string;
  suggestions: string[];
  topic: 'sla' | 'kinetic-pricing' | 'installation' | 'rollback' | 'products' | 'multipass' | 'tokens' | 'general';
  timestamp: string;
}

// Knowledge Base Topics & Prompt Handlers
export class AiSupportEngine {
  /**
   * Process a customer inquiry and return an authoritative, self-service resolution.
   */
  public static processQuery(
    query: string,
    history: SupportChatMessage[] = [],
    productContext?: string
  ): SupportResponse {
    const q = query.trim().toLowerCase();
    const now = new Date().toISOString();

    // 1. SLA, Human Support, 24/7 Incident Engineer inquiries
    if (
      q.includes('sla') ||
      q.includes('incident engineer') ||
      q.includes('on-call') ||
      q.includes('call you') ||
      q.includes('phone') ||
      q.includes('support team') ||
      q.includes('human') ||
      q.includes('guarantee') ||
      q.includes('paging') ||
      q.includes('uptime guarantee')
    ) {
      return {
        topic: 'sla',
        timestamp: now,
        reply: `### 🛡️ Exultia Operational Model & Support Policy

**Exultia is built, engineered, and maintained by an independent solo security researcher / engineer.**

Because of this lean, focused engineering model:
- ❌ **No Human SLAs or 24/7 Pagers:** We do not offer contractual human uptime SLAs, 24/7 on-call incident engineers, or phone support.
- ✅ **Deterministic, Automated Software:** All Exultia products (PureIDE, Vantage, Praxis, PureOS, Axiom, Eris, Valkyrie) are engineered to be completely **autonomous, self-hosted, and self-verifying**.
- ✅ **100% Automated Test Suite:** Every hotfix, patch script, and container image undergoes exhaustive automated pre-flight testing and regression sentinels prior to publication.
- ✅ **Sub-Second Deterministic Rollbacks:** If any hotfix causes an unexpected state, Kinetic includes instant local rollback commands (\`sudo kinetic rollback --cve=...\`) that restore the previous binary state in milliseconds.
- 🤖 **24/7 AI Sentinel:** This AI Support Agent is online around the clock to assist you with installation commands, host capacity calculations, configuration syntax, and troubleshooting.

If you encounter reproducible bugs, you can file an issue on our GitHub repository with technical reproduction steps.`,
        suggestions: [
          'How does Kinetic per-host pricing work?',
          'What is the Kinetic daemon install command?',
          'How do I execute a deterministic rollback?',
          'What is included in MultiPass?'
        ]
      };
    }

    // 2. Kinetic Pricing & Host Count Inquiries
    if (
      (q.includes('kinetic') && (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('host') || q.includes('node') || q.includes('tier') || q.includes('license'))) ||
      q.includes('per host') ||
      q.includes('how much does kinetic')
    ) {
      // Check for host count mentions in query
      const hostMatch = q.match(/(\d+)\s*(host|hosts|node|nodes|server|servers)/i);
      const hosts = hostMatch ? parseInt(hostMatch[1], 10) : null;

      let calculationText = '';
      if (hosts && hosts > 0) {
        if (hosts === 1) {
          calculationText = `\n\n#### 🧮 Fleet Estimate for 1 Host:\n- **Community Tier:** **$0/mo** (Free forever for 1 workstation host!)\n- **Pro Tier:** **$49/mo** ($39/mo billed annually)\n- **Enterprise Tier:** **$149/mo** ($119/mo billed annually)`;
        } else {
          const proMonthly = hosts * 49;
          const proAnnual = hosts * 39;
          const entMonthly = hosts * 149;
          const entAnnual = hosts * 119;
          calculationText = `\n\n#### 🧮 Fleet Estimate for ${hosts} Hosts:\n- **Kinetic Pro:** **$${proMonthly}/mo** (or $${proAnnual}/mo billed annually at $39/host)\n- **Kinetic Enterprise:** **$${entMonthly}/mo** (or $${entAnnual}/mo billed annually at $119/host)\n*Note: Zero grouped bucket minimums—you pay strictly for your exact host count.*`;
        }
      }

      return {
        topic: 'kinetic-pricing',
        timestamp: now,
        reply: `### ⚡ Kinetic Strictly Per-Host Pricing

Kinetic uses **transparent, linear per-host licensing** with **zero grouped node locks** (no arbitrary "25-node" or "100-node" bundles):

| Tier | Monthly Rate | Annual Rate | Included Scope |
| :--- | :--- | :--- | :--- |
| **Community** | **$0** | **$0** | **1 Workstation / Host Node Free Forever** with Vantage CVE sync & manual hotfix verification |
| **Pro** | **$49 /host/mo** | **$39 /host/mo** | Autonomous systemd patch daemon, live canary monitoring & sub-second deterministic rollbacks |
| **Enterprise** | **$149 /host/mo** | **$119 /host/mo** | Phased multi-ring deployment (Ring 0 -> Ring 1 -> Ring 2), SLSA Level 3 signed manifests & fleet rollback orchestrator |${calculationText}

#### Why Per-Host?
As a solo-engineered project, we believe in fair, predictable software licensing. You scale up or down based on your active production fleet size.

You can select your preset plan on the [Pricing & Plans page](/account/subscription?product=kinetic).`,
        suggestions: [
          'Calculate cost for 10 hosts',
          'Calculate cost for 50 hosts',
          'How do I install the Kinetic daemon?',
          'What is the deterministic rollback command?'
        ]
      };
    }

    // 3. Kinetic Installation, Compiled Binary & Setup Commands
    if (
      q.includes('install') ||
      q.includes('setup') ||
      q.includes('binary') ||
      q.includes('compiled') ||
      q.includes('download') ||
      q.includes('curl') ||
      q.includes('systemd') ||
      q.includes('daemon') ||
      q.includes('how to run kinetic') ||
      q.includes('agent')
    ) {
      return {
        topic: 'installation',
        timestamp: now,
        reply: `### 🚀 Installing the Kinetic Standalone Binary & Daemon

Kinetic is available as both a **compiled standalone executable binary** (Linux AMD64, Windows PE32+, and multi-arch zipapp) and as a **legacy streaming shell script (.sh)**.

#### Option A: Standalone Compiled Binary (Recommended)
Download and execute the self-contained binary with built-in sub-second deterministic rollbacks and atomic snapshotting:
\`\`\`bash
# 1. Download compiled standalone binary for Linux
sudo curl -fsSL "https://exultia.io/api/kinetic/download?platform=linux" -o /usr/local/bin/kinetic
sudo chmod +x /usr/local/bin/kinetic

# 2. Run automated self-test verification
kinetic test

# 3. Apply hot-mitigations or launch autonomous daemon
sudo kinetic apply --cve=CVE-2024-3094
sudo kinetic daemon --interval=3600
\`\`\`
*(For Windows fleets, download the compiled native PE32+ executable: \`https://exultia.io/api/kinetic/download?platform=windows\`)*

#### Option B: Legacy Streamed Shell Script (.sh)
If you prefer running a direct POSIX shell stream without installing a binary:
\`\`\`bash
curl -fsSL https://exultia.io/install/kinetic.sh | sudo bash -s -- --token=EX_TOKEN_YOUR_KEY
\`\`\`

#### 2. Manual Systemd Unit Configuration
If your environment enforces strict airgaps or Ansible provisioning, create \`/etc/systemd/system/kinetic-daemon.service\`:
\`\`\`ini
[Unit]
Description=Exultia Kinetic Autonomous Hotfix Daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/kinetic daemon --feed-url="https://exultia.io/api/patches/feed?source=vantage" --auto-rollback=true
Restart=always
RestartSec=10
Environment="KINETIC_TOKEN=EX_TOKEN_YOUR_KEY"
Environment="KINETIC_CANARY_PERCENT=10"

[Install]
WantedBy=multi-user.target
\`\`\`

#### 3. Enable & Inspect Daemon
\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable --now kinetic-daemon
sudo systemctl status kinetic-daemon
\`\`\`

#### 4. Supported Operating Systems
Ubuntu 20.04/22.04/24.04, Debian 11/12, RHEL 8/9, Rocky/AlmaLinux, Alpine Linux 3.18+, Arch Linux, and historical UNIX research targets (SunOS, AIX, HP-UX).`,
        suggestions: [
          'How do I execute a deterministic rollback?',
          'How does Kinetic verify patch safety?',
          'Where do I generate an API token?',
          'How does Kinetic per-host pricing work?'
        ]
      };
    }

    // 4. Deterministic Rollback Commands & Safety Inquiries
    if (
      q.includes('rollback') ||
      q.includes('undo') ||
      q.includes('revert') ||
      q.includes('snapshot') ||
      q.includes('break') ||
      q.includes('safety') ||
      q.includes('failed patch')
    ) {
      return {
        topic: 'rollback',
        timestamp: now,
        reply: `### 🔄 Kinetic Deterministic Sub-Second Rollback Engine

Every Kinetic patch executes a **mandatory atomic snapshot** before modifying any file, service, or kernel parameter. If post-flight health gates fail, rollback triggers automatically in under 500ms.

#### 1. Command-Line Instant Rollback (Single CVE)
To instantly revert a specific hotfix:
\`\`\`bash
sudo kinetic rollback --cve=CVE-2024-3094
\`\`\`

#### 2. Revert Most Recent Applied Patch
\`\`\`bash
sudo kinetic rollback --latest
\`\`\`

#### 3. Emergency Fleet-Wide Rollback (Ansible Orchestrator)
For Enterprise fleets, trigger the synchronized canary rollback across all nodes:
\`\`\`bash
ansible-playbook -i inventory/hosts.ini kinetic-fleet-rollback.yml --extra-vars "cve=CVE-2024-3094"
\`\`\`

#### 4. How Snapshots Are Guarded
- **Location:** \`/var/lib/kinetic/snapshots/<cve-id>/\`
- **Integrity:** SHA-256 binary hash, inode attributes, file permissions (ACLs), and systemd unit state.
- **Verification:** Pre-flight and post-flight sentinel scripts ensure socket connectivity, zero zombie processes, and verified process return codes before declaring success.`,
        suggestions: [
          'How do I install the Kinetic daemon?',
          'What is included in Kinetic Enterprise?',
          'How does Kinetic per-host pricing work?',
          'Tell me about the Systems Research Lab'
        ]
      };
    }

    // 5. MultiPass Suite Inquiries
    if (
      q.includes('multipass') ||
      q.includes('bundle') ||
      q.includes('all products') ||
      q.includes('suite') ||
      q.includes('platform') ||
      q.includes('unified') ||
      q.includes('pricing') ||
      q.includes('plans') ||
      q.includes('tier') ||
      q.includes('everything')
    ) {
      return {
        topic: 'multipass',
        timestamp: now,
        reply: `### 🛡️ Exultia Cyber Sovereignty Platform: Unified Pricing & 7-Engine Synergy

Exultia has consolidated from piecemeal point products into a **singular, unified cyber defense platform**. One subscription unlocks all 7 interconnected engines with zero fragmented add-ons:

| Tier | Price (Annual) | Price (Monthly) | Core Value & Scope |
| :--- | :--- | :--- | :--- |
| **Community Sovereign** | **$0 / Free** | **$0** | Open-source threat feed (Vantage), 5 BAS canary probes (Valkyrie), 5 chaos modules (Eris), manual hotpatches (Praxis), local hermetic compiler (PureIDE), CIS base containers (PureOS), and full exam banks (Axiom). |
| **Professional Operator** | **$59 / mo** ($708/yr) | **$79 / mo** | **Full Closed Loop:** Real-time threat feeds, autonomous hotpatch streaming daemon with sub-second rollbacks, complete 7+ CVE chaos lab & 5-container attack range, 10+ CVE pentest probes with SHA-256 attestations, cloud compiler runners, and verifiable certs. |
| **Enterprise Fleet** | **$399 / mo** ($4,788/yr) | **$499 / mo** | **Fleet Scale & Compliance:** Multi-node fleet orchestration, commercial threat feeds, SIEM webhooks (Splunk/Sentinel/QRadar), Cosign SLSA Level 3 signed manifests, institutional LMS embedding (Canvas/Blackboard/Moodle) with SCORM/LTI, executive compliance reports, and priority SLA. |

#### The 7 Interconnected Engines:
1. **Vantage:** Universal threat feed aggregating 110+ authoritative registries.
2. **Praxis:** Autonomous zero-downtime hotpatching, canary rollouts, and hardware firewall ACLs.
3. **Eris:** Adversary emulation, intentional vulnerability labs, and Docker test ranges.
4. **Valkyrie:** On-demand penetration testing, safe BAS probes, and cryptographic attestation tokens.
5. **PureIDE:** Hermetic compiler sandbox and workstation egress firewall.
6. **PureOS:** CIS-hardened container images with automated CycloneDX SBOMs.
7. **Axiom:** Operational cybersecurity certification simulator and institutional LMS API.

You can select your unified platform plan directly on the [Pricing & Plans page](/account/subscription).`,
        suggestions: [
          'What is included in Professional Operator?',
          'How does the closed-loop defense work?',
          'What is the deterministic rollback command?',
          'Where do I generate an API token?'
        ]
      };
    }

    // 6. API Tokens & Authentication
    if (
      q.includes('token') ||
      q.includes('api key') ||
      q.includes('auth') ||
      q.includes('account') ||
      q.includes('where do i find my key')
    ) {
      return {
        topic: 'tokens',
        timestamp: now,
        reply: `### 🔑 Exultia API Tokens & Key Management

API tokens authenticate your local daemons (Kinetic), IDE compilers (PureIDE), and threat intelligence feeds (Vantage).

#### 1. Generating an API Token
1. Log into your account or open the [Account Overview](/account).
2. Navigate to the **API Tokens** tab.
3. Click **"Generate New Service Token"**.
4. Label your token (e.g., \`kinetic-prod-fleet-01\`) and select your desired scope.
5. Copy the generated key (\`EX_TOKEN_...\`) immediately—it is hashed using Argon2id and only displayed once.

#### 2. Using Your Token in Kinetic
Pass the token in the bootstrap installer or set the environment variable:
\`\`\`bash
export KINETIC_TOKEN="EX_TOKEN_YOUR_KEY"
curl -fsSL https://exultia.io/install/kinetic.sh | sudo -E bash
\`\`\`

#### 3. Air-Gapped / Offline Environments
For air-gapped data centers, Enterprise subscribers can generate offline cryptographic license keys signed with Cosign SLSA Level 3 keys from the portal.`,
        suggestions: [
          'What is included in MultiPass?',
          'Tell me about Valkyrie pentesting',
          'How does the Sovereignty discount bundle work?',
          'Do you offer human SLAs?'
        ]
      };
    }

    // 7. General Products Overview
    if (
      q.includes('product') ||
      q.includes('what do you do') ||
      q.includes('overview') ||
      q.includes('pureide') ||
      q.includes('vantage') ||
      q.includes('praxis') ||
      q.includes('pureos') ||
      q.includes('axiom') ||
      q.includes('argent') ||
      q.includes('eris') ||
      q.includes('valkyrie')
    ) {
      return {
        topic: 'products',
        timestamp: now,
        reply: `### 🌐 The Complete Exultia Product Suite

Exultia provides security engineering tools designed for solo operators, security researchers, and lean infrastructure teams:

1. **[PureIDE](/products/pure-ide):** Zero-telemetry developer workstation compiler with kernel sandboxing and real-time egress firewall.
2. **[Vantage (UVI)](/app/uvi):** Universal vulnerability feed synchronizing 110+ global registries (CISA KEV, NVD, GitHub Security Lab, historical UNIX CVEs).
3. **[Kinetic](/account/subscription?product=kinetic):** Autonomous zero-downtime hotfix stream and sub-second deterministic rollback engine ($49/host/mo Pro, 1 host free forever).
4. **[Argent](/argent):** Multi-distro vendor patch bundle stream and errata feed with native package manager automation.
5. **[Praxis](/app/praxis):** Autonomous zero-downtime hotpatching daemon, rolling canary engine & hardware firewall ACL generator.
6. **[PureOS](/products/pure-os):** Pre-hardened CIS Docker/OCI container images continuously synchronized with active CVE feeds.
7. **[Axiom](/app/axiom):** Cybersecurity certification prep platform (Security+, CEH, CISSP) with Enterprise LMS REST API.
8. **[Eris](/app/eris):** Goddess of chaos & strife — adversary emulation, intentional vulnerability proving ground & 5-container test range. Eligible for 30%, 40%, or 50% Sovereignty Bundle Discounts.
9. **[Valkyrie](/app/valkyrie):** On-demand penetration testing & exploitability verification bridge correlated directly with Vantage CVE feeds and Praxis hotpatching. Eligible for 30%, 40%, or 50% Sovereignty Bundle Discounts.
10. **[Research Wiki](/wiki):** Interactive documentation, API references, and full ecosystem simulators.`,
        suggestions: [
          'How does the Sovereignty bundle discount work?',
          'What is Valkyrie on-demand pentesting?',
          'What is included in MultiPass?',
          'Do you offer human SLAs?'
        ]
      };
    }

    // 8. Default / Fallback Technical Assistant Response
    return {
      topic: 'general',
      timestamp: now,
      reply: `### 🤖 Exultia Technical AI Support Sentinel

Hello! I am Exultia's autonomous technical support agent. Because Exultia is run as a focused **solo-operator engineering project**, I am here 24/7 to provide instant answers without putting our solo maintainer on the hook for routine inquiries.

Here is what I can help you with immediately:
- **Sovereignty Bundle Discounts:** 30% for 1 companion, 40% for 2 companions, and 50% if you buy all three (Vantage, Praxis, Eris, Valkyrie).
- **Valkyrie Pentest On-Demand:** Trigger non-destructive BAS scans, verify Vantage CVE exploitability, and generate signed attestations.
- **Eris Chaos Inoculation:** Compile reversible bash attack payloads with timed failsafe rollbacks.
- **Deterministic Rollbacks:** \`sudo kinetic rollback --cve=...\` instructions and atomic snapshot mechanics.
- **No Human SLAs Policy:** Transparent details on our automated self-hosted software model.
- **Exultia Product Suite Guidance:** PureIDE, Vantage, Praxis, PureOS, Axiom, Eris, Valkyrie, and MultiPass bundles.
- **API Tokens & Licensing:** Generating service keys and air-gapped licensing.

What would you like assistance with?`,
        suggestions: [
          'How does the Sovereignty discount bundle work?',
          'Tell me about Valkyrie on-demand pentesting',
          'How do I execute a deterministic rollback?',
          'Do you offer human 24/7 SLAs?'
        ]
    };
  }
}
