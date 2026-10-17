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
- ✅ **Deterministic, Automated Software:** All Exultia products (Kinetic, PureIDE, Vantage, Praxis, PureOS, Axiom, Inquest) are engineered to be completely **autonomous, self-hosted, and self-verifying**.
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

You can set your exact host count using the slider on the [Pricing & Plans page](/account/subscription?product=kinetic).`,
        suggestions: [
          'Calculate cost for 10 hosts',
          'Calculate cost for 50 hosts',
          'How do I install the Kinetic daemon?',
          'What is the deterministic rollback command?'
        ]
      };
    }

    // 3. Kinetic Installation & Setup Commands
    if (
      q.includes('install') ||
      q.includes('setup') ||
      q.includes('curl') ||
      q.includes('systemd') ||
      q.includes('daemon') ||
      q.includes('how to run kinetic') ||
      q.includes('agent')
    ) {
      return {
        topic: 'installation',
        timestamp: now,
        reply: `### 🚀 Installing the Kinetic Zero-Agent Patch Daemon

Kinetic is engineered as a lightweight, zero-agent systemd runner that streams signed hotfix payloads directly from Vantage.

#### 1. One-Line Streamlined Installer
Run the official bootstrap script with your Exultia API token:
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
      q.includes('everything')
    ) {
      return {
        topic: 'multipass',
        timestamp: now,
        reply: `### ✨ Leeloo Dallas MultiPass: The All-Inclusive Suite

MultiPass is the comprehensive bundle giving you access across the entire Exultia product ecosystem:

#### 1. MultiPass Pro ($196/mo or $156/mo annual)
Unlocks Pro-level access across all 6 core tools:
- **PureIDE Pro:** Isolated cloud compiler pipelines, egress firewall & automated CycloneDX SBOMs.
- **Vantage Pro:** Workstation threat alerts, zero-day early warnings & 300 req/min API quota.
- **Kinetic Pro:** Autonomous patch stream daemon & sub-second deterministic rollbacks.
- **Praxis Pro:** Automated bash/Ansible hotfix generation & SIEM webhook payload exporters.
- **PureOS Pro:** CIS hardened container images & cryptographic provenance.
- **Inquest Pro:** Automated FOIA redaction, denial analyzer & case management.

#### 2. MultiPass Enterprise ($595/mo or $495/mo annual)
- Unlocks **all Enterprise features** across the stack.
- Adds **Axiom Enterprise LMS API** (certification testing platform).
- Phased multi-ring deployment orchestrator for Kinetic.
- SLSA Level 3 signed manifests with Cosign OIDC.
- 24/7 AI Support Agent & automated self-hosted test suites.

You can activate MultiPass with aggregate slider control on the [Pricing & Plans page](/account/subscription?product=multipass).`,
        suggestions: [
          'How does Kinetic per-host pricing work?',
          'Do you offer human SLAs?',
          'What is the Kinetic daemon install command?',
          'How do I generate an API token?'
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
          'How do I install the Kinetic daemon?',
          'How does Kinetic per-host pricing work?',
          'What is included in MultiPass?',
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
      q.includes('inquest')
    ) {
      return {
        topic: 'products',
        timestamp: now,
        reply: `### 🌐 The Complete Exultia Product Suite

Exultia provides security engineering tools designed for solo operators, security researchers, and lean infrastructure teams:

1. **[PureIDE](/products/pure-ide):** Zero-telemetry developer workstation compiler with kernel sandboxing and real-time egress firewall.
2. **[Vantage (UVI)](/app/uvi):** Universal vulnerability feed synchronizing 110+ global registries (CISA KEV, NVD, GitHub Security Lab, historical UNIX CVEs).
3. **[Kinetic](/account/subscription?product=kinetic):** Autonomous zero-downtime hotfix stream and sub-second deterministic rollback engine ($49/host/mo Pro, 1 host free forever).
4. **[Praxis](/app/praxis):** Surgical CVE remediation compiler translating raw advisories into hardened bash scripts and Ansible playbooks.
5. **[PureOS](/products/pureos):** Pre-hardened CIS Docker/OCI container images continuously synchronized with active CVE feeds.
6. **[Axiom](/products/axiom):** Cybersecurity certification prep platform (Security+, CEH, CISSP) with Enterprise LMS REST API.
7. **[Inquest](/products/inquest):** Autonomous public records compliance platform with 9-exemption discovery vault and automated redaction.
8. **[Research Lab](/research):** Interactive validation playground demonstrating live compiler tests, historic UNIX mitigations (SunOS, AIX, HP-UX), and real threat simulations.`,
        suggestions: [
          'How does Kinetic per-host pricing work?',
          'What is the Kinetic daemon install command?',
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
- **Kinetic Per-Host Licensing:** 1 host free forever, Pro is $49/host/mo, Enterprise is $149/host/mo. (Ask me to calculate your fleet size!)
- **Kinetic Daemon Installation:** Step-by-step \`curl\` bootstrap, systemd configuration, and distro support.
- **Deterministic Rollbacks:** \`sudo kinetic rollback --cve=...\` instructions and atomic snapshot mechanics.
- **No Human SLAs Policy:** Transparent details on our automated self-hosted software model.
- **Exultia Product Guidance:** PureIDE, Vantage, Praxis, PureOS, Axiom, Inquest, and MultiPass bundles.
- **API Tokens & Licensing:** Generating service keys and air-gapped licensing.

What would you like assistance with?`,
      suggestions: [
        'How does Kinetic per-host pricing work?',
        'What is the Kinetic daemon install command?',
        'How do I execute a deterministic rollback?',
        'Do you offer human 24/7 SLAs?'
      ]
    };
  }
}
