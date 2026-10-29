/**
 * Exultia High-Precision RAG Knowledge Base & Retrieval Engine
 * 
 * Provides deep, authoritative, site-specific retrieval across:
 * - 12 Technical Specifications & Architecture Wikis (wiki/*.md)
 * - 19 Curated Operational & Skepticism FAQs (src/app/faq/page.tsx)
 * - The "Bullshit Validator" Live Verification Fleet (https://github.com/exultia-tech/demo)
 * - Kinetic CLI v2.4.0 Engine Manuals & Sub-Second Rollback Mechanics
 * - Multi-Tier Pricing, Air-Gap Protocols, and Deterministic eBPF Sentinels
 */

export interface RagChunk {
  id: string;
  title: string;
  sourceDoc: string;
  sourceUrl: string;
  topic: string;
  category: 'proof' | 'engine' | 'faq' | 'architecture' | 'pricing' | 'cli' | 'security';
  tags: string[];
  keywords: string[];
  content: string;
  suggestions: string[];
}

export const EXULTIA_RAG_CORPUS: RagChunk[] = [
  // 1. The "Bullshit Validator" / Skepticism & Vaporware Proof
  {
    id: 'bullshit-validator',
    title: 'The Exultia "Bullshit Validator" & Public Verification Fleet',
    sourceDoc: 'https://github.com/exultia-tech/demo',
    sourceUrl: 'https://github.com/exultia-tech/demo',
    topic: 'skepticism',
    category: 'proof',
    tags: ['bullshit', 'validator', 'proof', 'real', 'fake', 'test', 'demo', 'toy', 'vaporware', 'evidence', 'simulator', 'quickstart'],
    keywords: [
      'bullshit', 'validator', 'prove', 'vaporware', 'proof', 'actually work', 'real', 'test suite',
      'verify', 'fleet', 'copypaste', 'single-line', 'quick test', 'github demo', 'simulator', 'quickstart'
    ],
    content: `### 🛡️ The Exultia "Bullshit Validator" & Verification Harness

Most enterprise security vendors offer **80% slide deck, 15% buzzword brochure, and 5% broken agent** that crashes production servers during a Friday update. **Exultia does not do marketing sales demos.** 

Instead, we provide an open-access, reproducible verification suite at [**github.com/exultia-tech/demo**](https://github.com/exultia-tech/demo). Any engineer can inspect the raw binaries, run live CVE hotfixes, execute 14ms sub-second rollbacks, and mathematically verify every claim on their own machine in ~5 seconds with zero external dependencies.

You can also run our in-browser [Research Wiki Simulators](/wiki?tab=simulator) and inspect our [Quick-Start Guides](/wiki?tab=quickstart) or our [Interactive FAQ Directory](/faq).

#### ⚡ 5-Second Copy-Paste Benchmark

**Linux / macOS / WSL:**
\`\`\`bash
git clone --depth=1 https://github.com/exultia-tech/demo.git && cd demo && python3 validate.py
\`\`\`
*(or zero-clone via curl: \`curl -sSL https://raw.githubusercontent.com/exultia-tech/demo/main/scripts/quick-test.sh | bash\`)*

**Windows (PowerShell):**
\`\`\`powershell
git clone --depth=1 https://github.com/exultia-tech/demo.git; cd demo; python validate.py
\`\`\`
*(or zero-clone via irm: \`irm https://raw.githubusercontent.com/exultia-tech/demo/main/scripts/quick-test.ps1 | iex\`)*

#### What the Validator Proves in Seconds:
1. **Cryptographic Checksums:** Verifies standalone binaries against Cosign OIDC SLSA Level 3 hashes.
2. **Sub-Second Deterministic Rollback:** Injects a live mutation and rolls back to baseline pre-image SHA in **14ms** (sub-millisecond ~0.74ms in Linux kernels).
3. **Public CVE Catalog:** Validates 4 in-the-wild exploit remediations (CVE-2024-6387, CVE-2024-3094, CVE-2024-21626, CVE-2024-47176).
4. **Dual-Node Fleet Harness:** Tests Alpine Linux 3.20 Ring 0 canary to Ring 1 production promotion.`,
    suggestions: [
      'Can I get a sales demo?',
      'How does the deterministic rollback command work?',
      'Why is Exultia zero telemetry?',
      'Where is the full FAQ directory?'
    ]
  },

  // 2. Sales Demo Challenge
  {
    id: 'sales-demo-faq',
    title: 'Sales Demo Policy & Technical Evaluation Challenge',
    sourceDoc: 'src/app/faq/page.tsx',
    sourceUrl: '/faq',
    topic: 'faq',
    category: 'faq',
    tags: ['sales', 'demo', 'pitch', 'sales demo', 'meeting', 'salesperson', 'call', 'zoom'],
    keywords: ['sales demo', 'sales call', 'salesperson', 'discovery call', 'pitch deck', 'presentation'],
    content: `### 🎯 Can I Get a Sales Demo?

> **"Sure. Find the most technical person you know, send them a link to our repo (https://github.com/exultia-tech/demo), and tell them to follow the instructions and report their results back to you."**

We do not have high-pressure sales reps, enterprise account executives, or polished slide decks. We are a lean, systems-first engineering lab. 

If your team wants to evaluate Exultia:
1. Clone the public test suite: \`git clone --depth=1 https://github.com/exultia-tech/demo.git\`
2. Run \`python validate.py\` to inspect real cryptographic hashes, sub-second atomic rollbacks (14ms), and active sentinels.
3. Review the complete interactive test fleet with 4 automated walkthroughs simulating enterprise canary rollouts in WSL2.
4. Try our interactive browser testbeds directly on the [**Research Wiki**](/wiki) or browse our [**Interactive FAQ Directory**](/faq).`,
    suggestions: [
      'How do I run the Bullshit Validator?',
      'Can I whitelabel the remediation pipeline?',
      'How does Kinetic per-host pricing work?',
      'What is the operational model and support policy?'
    ]
  },

  // 3. Whitelabeling Policy
  {
    id: 'whitelabel-faq',
    title: 'Remediation Pipeline Whitelabeling Policy',
    sourceDoc: 'src/app/faq/page.tsx',
    sourceUrl: '/faq',
    topic: 'faq',
    category: 'faq',
    tags: ['whitelabel', 'white-label', 'rebrand', 'resell', 'oem', 'acquisition', 'buy company'],
    keywords: ['whitelabel', 'white label', 'rebrand', 'resell', 'oem', 'license', 'purchase company'],
    content: `### 💼 Can I Whitelabel the Remediation Pipeline?

> **"Sure; for a limited time only, you can make a one-time purchase of my entire company and call it whatever you want."**

Exultia products are engineered as independent, sovereign technologies with strict cryptographic provenance (SLSA Level 3). We do not offer generic reseller re-skins or low-tier whitelabel licenses. 

Organizations seeking full exclusive IP rights, private source-code acquisition, or bespoke air-gapped redistribution can negotiate a formal Master Services Agreement (MSA) or full corporate asset acquisition. Read more in our [**Interactive FAQ**](/faq).`,
    suggestions: [
      'Can I get a sales demo?',
      'What is the pricing model for Enterprise Fleet?',
      'How does the closed-loop defense work?',
      'Why zero telemetry?'
    ]
  },

  // 4. Kinetic Sub-Second Deterministic Rollback
  {
    id: 'kinetic-rollback',
    title: 'Kinetic Sub-Second Deterministic Rollback Engine',
    sourceDoc: 'wiki/kinetic.md',
    sourceUrl: '/wiki',
    topic: 'rollback',
    category: 'engine',
    tags: ['kinetic', 'rollback', 'deterministic', 'sub-second', 'latency', 'atomic', 'snapshot', 'undo', 'revert'],
    keywords: [
      'rollback', 'deterministic rollback', 'atomic', 'snapshot', 'sub-second', 'revert', 'latency',
      'undo', 'failed patch', 'restore', 'pre-image', 'sha-256', 'failed hotfix'
    ],
    content: `### 🔄 Kinetic Deterministic Sub-Second Rollback Engine

Every Kinetic patch captures a **mandatory cryptographic pre-image snapshot** before mutating any service, configuration, or memory pointer. If post-flight health sentinels fail, atomic rollback triggers automatically in **under 100 milliseconds** (benchmarked at **14ms** atomic rollbacks, down to **0.74ms** in Linux kernels).

#### Instant Rollback Commands:
\`\`\`bash
# 1. Rollback a specific CVE hotfix
sudo kinetic rollback --cve=CVE-2024-3094

# 2. Rollback the most recently applied mitigation
sudo kinetic rollback --latest

# 3. Emergency Fleet-Wide Rollback via Ansible Orchestrator
ansible-playbook -i inventory/hosts.ini kinetic-fleet-rollback.yml --extra-vars "cve=CVE-2024-3094"
\`\`\`

#### Architectural Guarantees:
- **Pre-Image Ledger:** Stored locally in \`/var/lib/kinetic/snapshots/<cve-id>/\` (or \`%ProgramData%\\exultia-kinetic\`).
- **Integrity Validation:** SHA-256 hash matching, inode attributes, file permissions (ACLs), and systemd unit state.
- **Zero Host Reboot:** Pure runtime file/config drop-in reversion with live daemon syntax validation (\`sshd -T\`, \`nginx -t\`).`,
    suggestions: [
      'How do I install the standalone Kinetic binary?',
      'How does Kinetic verify patch safety?',
      'What is the difference between Kinetic and Praxis?',
      'How does per-host pricing work?'
    ]
  },

  // 5. Kinetic Installation & CLI Reference
  {
    id: 'kinetic-install',
    title: 'Kinetic CLI v2.4.0 Standalone Binary & Daemon Installation',
    sourceDoc: 'wiki/kinetic.md',
    sourceUrl: '/wiki',
    topic: 'installation',
    category: 'cli',
    tags: ['kinetic', 'install', 'binary', 'daemon', 'systemd', 'cli', 'setup', 'download'],
    keywords: [
      'install', 'setup', 'binary', 'daemon', 'systemd', 'download', 'cli', 'kinetic', 'curl',
      'service', 'command', 'agent', 'download and install'
    ],
    content: `### 🚀 Kinetic CLI v2.4.0 Installation & Reference

Kinetic can be deployed either via the **Standalone Compiled Binary (Recommended)** or via the **Legacy Streamed Shell Script (.sh)**:

#### 1. Standalone Compiled Binary (Recommended)
Download the high-speed native compiled binary directly from the platform:
\`\`\`bash
# Linux (Ubuntu, Debian, RHEL, Rocky, Alpine)
curl -fsSL https://exultia.tech/api/kinetic/download?platform=linux -o /usr/local/bin/kinetic
chmod +x /usr/local/bin/kinetic
kinetic test
\`\`\`

#### 2. Legacy Streamed Shell Script (.sh)
Alternatively, bootstrap the daemon via our streamed shell script:
\`\`\`bash
curl -fsSL https://exultia.io/install/kinetic.sh | sudo bash
\`\`\`

#### 3. Autonomous Systemd Daemon Setup (Ubuntu / Debian / RHEL)
Create \`/etc/systemd/system/kinetic-daemon.service\`:
\`\`\`ini
[Unit]
Description=Exultia Kinetic Autonomous Hotfix Daemon
After=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/kinetic daemon --interval=3600 --ring=0
Restart=always
Environment="KINETIC_TOKEN=EX_TOKEN_YOUR_KEY"

[Install]
WantedBy=multi-user.target
\`\`\`
Enable with:
\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable --now kinetic-daemon
\`\`\``,
    suggestions: [
      'How does Kinetic per-host pricing work?',
      'What is the deterministic rollback command?',
      'What is the difference between Community and Pro tiers?',
      'How do I test the Bullshit Validator?'
    ]
  },

  // 6. Kinetic Standalone Strictly Per-Host Pricing
  {
    id: 'kinetic-pricing',
    title: 'Kinetic Standalone: Strictly Per-Host Fleet Pricing',
    sourceDoc: 'src/app/account/subscription/page.tsx',
    sourceUrl: '/account/subscription',
    topic: 'kinetic-pricing',
    category: 'pricing',
    tags: ['kinetic', 'pricing', 'per-host', 'hosts', 'servers', 'cost', 'nodes'],
    keywords: [
      'kinetic pricing', 'kinetic per-host', 'per-host', 'how does kinetic pricing work',
      'cost for 1 host', 'cost for 10 hosts', 'cost for 50 servers', 'fee for 100 nodes'
    ],
    content: `### 💳 Kinetic Standalone Strictly Per-Host Fleet Pricing

Kinetic enforces a strictly linear per-host pricing model with **zero grouped node locks** and **no arbitrary minimum host tiers**:

#### 1 Workstation / Host Node Free Forever
- **Community Sovereign:** **$0** (Free forever for 1 host node with full CVE sync & manual verification)
- **Pro Tier:** **$49 /host/mo** ($39/host/mo billed annually) - Autonomous daemon, canary health monitoring & sub-second rollbacks.
- **Enterprise Fleet:** **$149 /host/mo** ($119/host/mo billed annually) - Phased multi-ring deployment, fleet rollback orchestrator, and Cosign SLSA Level 3 manifests.

*You pay strictly for the exact number of active production hosts with zero arbitrary bucket lock-ins.*`,
    suggestions: [
      'Calculate price for 10 hosts on Kinetic',
      'What is included in MultiPass?',
      'How do I execute a 14ms rollback?',
      'Why zero outbound telemetry?'
    ]
  },

  // 7. MultiPass & Unified Cyber Sovereignty Platform (All 7 Engines)
  {
    id: 'multipass-pricing',
    title: 'Unified Cyber Sovereignty Platform: 3-Tier MultiPass Architecture',
    sourceDoc: 'src/app/account/subscription/page.tsx',
    sourceUrl: '/account/subscription',
    topic: 'multipass',
    category: 'pricing',
    tags: ['multipass', 'unified', 'platform', 'tiers', 'subscription', 'plans'],
    keywords: [
      'multipass', 'unified platform', 'unified pricing', 'plans', 'platform plan',
      'tell me about the unified platform', 'what is included in multipass'
    ],
    content: `### 🛡️ Exultia Cyber Sovereignty Platform: Unified Pricing & Architecture

One unified subscription unlocks access to all 7 sovereign defense engines without fragmented add-on licensing:

#### Platform Tiers:
- **Community Sovereign ($0 / Free Forever):** 1 Workstation host node, public Vantage feed, 5 BAS canary probes, 5 chaos modules, and full Axiom exams.
- **Professional Operator ($100 / mo billed annually or $120/mo):** 10 production hosts, autonomous hotpatching daemon with 14ms sub-second rollbacks, full 7+ CVE chaos attack range, 10+ pentest probes with HMAC attestations, and verifiable certs.
- **Enterprise Fleet ($500 / mo billed annually or $600/mo):** Unlimited air-gap nodes, multi-node ring progression, commercial feeds, SIEM webhooks (Splunk/Sentinel), Cosign SLSA Level 3 manifests, and institutional LMS connectors.

#### Complete Sovereign Suite:
- **Vantage:** Universal vulnerability intelligence feed synchronizing 110+ global registries.
- **Praxis:** Surgical zero-downtime hotpatch compiler and POSIX-compliant remediation script generator.
- **Kinetic:** Sub-second deterministic rollback daemon (<1ms) with pre-image cryptographic snapshotting.
- **Argent:** Multi-distro vendor errata synthesizer and sovereign general patch manager.
- **Eris:** Intentional vulnerability proving ground and 5-container Docker attack range with 10-minute auto-destruct watchdogs.
- **Valkyrie:** Non-destructive BAS exploitability prober with HMAC-SHA256 cryptographic attestation tokens.
- **PureIDE:** Air-gapped hermetic workstation IDE (unified in Daedelus) with cgroup kernel network boundaries.
- **PureOS:** Minimal CIS Level 2 hardened runtime container distribution (unified in Daedelus).
- **Axiom:** Operational cybersecurity certification exam simulator with Canvas/LTI LMS connectors.`,
    suggestions: [
      'How does Kinetic per-host pricing work?',
      'How does the closed-loop defense work?',
      'How do I run the Bullshit Validator?',
      'Where do I generate an API token?'
    ]
  },

  // 8. Complete Products Overview
  {
    id: 'products-overview',
    title: 'The Exultia 7 Sovereign Defense Engines Directory',
    sourceDoc: 'wiki/README.md',
    sourceUrl: '/wiki',
    topic: 'products',
    category: 'engine',
    tags: ['products', 'overview', 'suite', 'engines', 'all products'],
    keywords: ['overview of all exultia products', 'all products', 'product suite', 'give me an overview of all exultia products'],
    content: `### 🌐 Complete Exultia Product Suite Directory

Exultia unites the following sovereign cyber defense engines:
1. **PureIDE:** Air-gapped workstation sandbox with hermetic build containers and cgroup network boundaries (now unified within Daedelus).
2. **Vantage:** Universal threat intelligence engine synchronizing 110+ global CVE feeds in real-time.
3. **Kinetic:** Autonomous patch manager with sub-second deterministic rollbacks (<100ms) and cryptographic snapshot ledgers.
4. **Argent:** General OS distribution package manager deploying vendor errata and security updates.
5. **Praxis:** Autonomous surgical hotpatching engine compiling in-memory eBPF trampolines with zero downtime.
6. **PureOS:** Minimal CIS Benchmark Level 2 hardened container base image with zero unnecessary packages (now unified within Daedelus).
7. **Axiom:** Autonomous practical examination platform with HMAC-signed digital credentialing and LMS connectors.`,
    suggestions: [
      'What is included in MultiPass?',
      'How does closed-loop defense work?',
      'What is the deterministic rollback command?',
      'Where is the full FAQ directory?'
    ]
  },

  // 9. API Tokens & Authentication
  {
    id: 'api-tokens',
    title: 'API Tokens & Automated Machine Authentication',
    sourceDoc: 'src/app/account/page.tsx',
    sourceUrl: '/account',
    topic: 'tokens',
    category: 'security',
    tags: ['token', 'api token', 'key', 'auth', 'authentication', 'account'],
    keywords: ['api token', 'where do i generate an api token', 'token', 'auth key', 'machine key', 'tokens'],
    content: `### 🔑 Exultia API Tokens & Machine Authentication

You can generate and revoke service tokens directly inside your [**Account Settings Dashboard (/account)**](/account):

1. Navigate to [**/account**](/account) and select the **API Tokens** section.
2. Click **Generate New Token**, select the appropriate engine scope (e.g., \`kinetic:deploy\`, \`vantage:read\`), and copy your secret key.
3. Keys are formatted with the standard cryptographic prefix:
   \`\`\`bash
   export KINETIC_TOKEN="EX_TOKEN_live_sec_..."
   \`\`\`
4. Pass the token as an environment variable or via \`--token\` flag when invoking the Kinetic CLI or configuring your \`kinetic-daemon.service\`.`,
    suggestions: [
      'How do I install the Kinetic daemon?',
      'What is included in the $100/mo platform plan?',
      'How does Kinetic per-host pricing work?',
      'Where is the full FAQ directory?'
    ]
  },

  // 10. Operational Model & Solo Maintainer Support Policy (SLA)
  {
    id: 'operational-model',
    title: 'Exultia Operational Philosophy & Solo Engineering Model',
    sourceDoc: 'docs/SECURITY_AND_SUPPORT.md',
    sourceUrl: '/faq',
    topic: 'sla',
    category: 'architecture',
    tags: ['operational', 'support', 'sla', 'incident', 'on-call', 'pager', 'solo', 'maintainer', 'human'],
    keywords: [
      'sla', 'human sla', 'incident engineer', 'on-call', 'pager', 'phone', 'uptime guarantee',
      'dedicated support engineer', 'call someone'
    ],
    content: `### 🛡️ Exultia Operational Model: No Human SLAs or 24/7 Pagers

**Exultia is engineered and maintained by an independent solo security researcher / engineer.**

Because of this lean, focused engineering model:
- ❌ **No Human SLAs or 24/7 Pagers:** We do not offer contractual human uptime SLAs, 24/7 on-call incident paging, or dedicated incident response phone queues. We will never promise a call center or human pager response.
- ✅ **Deterministic, Automated Software:** All software is engineered to be autonomous, self-hosted, and self-verifying. If a patch fails live sentinels, Kinetic automatically executes a deterministic rollback before production traffic is affected.
- ✅ **100% Automated Pre-Flight Sentinels:** Every remediation package contains idempotent \`hotfix.sh\`, \`verify.sh\`, and \`rollback.sh\` scripts with live runtime checks.
- 🤖 **24/7 AI Sentinel:** This AI assistant is online around the clock to assist with configuration syntax, host sizing calculations, CLI commands, and diagnostic guidance.
- 📜 **Enterprise MSAs:** Organizations requiring custom kernel drivers or bespoke MSAs can contact us directly.`,
    suggestions: [
      'Can I get a sales demo?',
      'How do I test the Bullshit Validator?',
      'What is the deterministic rollback command?',
      'How does per-host pricing work?'
    ]
  },

  // 11. Closed-Loop OODA Architecture
  {
    id: 'closed-loop-ooda',
    title: 'Closed-Loop OODA Sovereignty Architecture (Observe, Orient, Decide, Act)',
    sourceDoc: 'wiki/architecture.md',
    sourceUrl: '/wiki',
    topic: 'closed-loop',
    category: 'architecture',
    tags: ['closed-loop', 'ooda', 'architecture', 'engines', 'synergy', 'vantage', 'argent', 'kinetic', 'praxis'],
    keywords: [
      'closed loop', 'closed-loop', 'ooda', 'architecture', 'observe', 'orient', 'decide', 'act',
      'cycle', 'how it works', 'flow', 'explain how closed-loop defense works'
    ],
    content: `### ⚡ The Exultia Closed-Loop Defense Engine (OODA)

Traditional security separates scanning, pen-testing, and remediation into disconnected silos that take weeks. Exultia unifies them into a **sub-250ms machine-speed loop**:

\`\`\`
  1. OBSERVE (Vantage)   --> 110+ authoritative feeds (CISA KEV, NIST NVD, Linux Errata)
          │
          ▼
  2. ORIENT (Argent)     --> Normalizes vendor errata & synthesizes targeted package fixes
          │
          ▼
  3. DECIDE (Kinetic)    --> Validates exploitability non-destructively via canary testing
          │
          ▼
  4. ACT (Praxis/Kinetic)--> Deploys in-memory drop-in sentinel with sub-second rollback
\`\`\`

- **Observe (Vantage):** Ingests and scores zero-days in real-time.
- **Orient (Argent):** Analyzes target Linux distributions and resolves deterministic patch dependencies.
- **Decide (Kinetic):** Proves exploitability non-destructively using canary verification without causing denial of service.
- **Act (Praxis & Kinetic):** Synthesizes and applies the hotfix in <250ms (<40ms typical) with zero service reboot and instant deterministic rollback. Read more in our [**Interactive FAQ**](/faq).`,
    suggestions: [
      'Is in-memory hotpatching safe?',
      'How does Kinetic sub-second rollback work?',
      'What are the core platform engines?',
      'Where can I run the Bullshit Validator?'
    ]
  },

  // 12. Zero Telemetry & Sovereign Airgap Model
  {
    id: 'zero-telemetry',
    title: 'Zero Outbound Telemetry & Air-Gapped SCIF Operation',
    sourceDoc: 'wiki/architecture.md',
    sourceUrl: '/wiki',
    topic: 'zero-telemetry',
    category: 'security',
    tags: ['telemetry', 'privacy', 'airgap', 'scif', 'phone home', 'outbound', 'sovereign', 'offline'],
    keywords: [
      'telemetry', 'zero telemetry', 'phone home', 'privacy', 'airgap', 'air-gap', 'scif',
      'offline', 'data diode', 'exfiltration', 'cgroup', 'how does zero outbound telemetry work'
    ],
    content: `### 🔒 Exultia Unidirectional "Zero Telemetry" Architecture

Exultia enforces strict sovereign privacy for sensitive and classified air-gapped environments:
- ❌ **Zero Outbound Telemetry:** Your source code, host IPs, system topologies, and diagnostic logs never leave your perimeter. Zero outbound analytics or vendor beaconing.
- 📡 **Unidirectional Inbound Pull-Only:** Daemons update threat definitions by pulling static, cryptographically signed JSON manifests over public CDNs (exactly like \`apt-get update\`).
- 🛡️ **Air-Gapped / SCIF Operation:** In classified environments, offline \`.bundle\` files can be transferred across physical data diodes with Cosign SLSA Level 3 signature verification.
- 💻 **PureIDE Workstation Isolation:** Network egress is clamped at the Linux kernel cgroup boundary during compilation tasks. See our [**Interactive FAQ**](/faq).`,
    suggestions: [
      'Can Exultia run in an air-gapped SCIF?',
      'What is included in Daedelus?',
      'How does the deterministic rollback command work?',
      'Is in-memory hotpatching safe?'
    ]
  },

  // 13. Technical Skepticism & In-Memory Safety
  {
    id: 'technical-skepticism',
    title: 'Answers to Technical Skepticism: In-Memory Safety & Wrappers',
    sourceDoc: 'src/app/faq/page.tsx',
    sourceUrl: '/faq',
    topic: 'skepticism',
    category: 'faq',
    tags: ['skepticism', 'safety', 'in-memory', 'hotpatch', 'corrupt', 'wrapper', 'iptables', 'trivy'],
    keywords: [
      'skepticism', 'safe', 'corrupt', 'memory', 'wrapper', 'iptables', 'nftables', 'trivy',
      'suricata', 'crash', 'custom logic', 'break application', 'is in-memory hotpatching safe',
      'are you just an iptables wrapper', 'only cost $100'
    ],
    content: `### 🛡️ Direct Answers to Technical Skepticism

#### 1. In-Memory Hotpatch Safety (Zero Memory Corruption)
Praxis does not execute arbitrary byte overwrites. It compiles deterministic trampoline micro-hooks with atomic swap mechanics and eBPF targeting solely the vulnerable logic (such as input sanitizers or URI argument decoders). Before injection, an atomic pre-image snapshot is recorded. If any process fault occurs, an automatic 14ms sub-second rollback restores baseline state instantly. Read details in our [**Interactive FAQ**](/faq).

#### 2. Not an Open-Source or iptables Wrapper
While Vantage ingests public registries (CISA KEV, NIST NVD), our kinetic remediation stack is 100% proprietary systems code. Praxis compiles in-memory trampolines with eBPF & XDP kernel hooks at Layer 7 rather than simple packet-dropping iptables or nftables wrappers. Daedelus provides an air-gapped hermetic compiler for workstations, distroless containers, and zero-CVE packages with integrated exploit canary probing and resilience inoculation.

#### 3. Why Our Fleet Economics Cost Only $25/Node, $100/mo Baseline, or $500/mo Cap (Not a Toy)
Legacy enterprise vendors charge $50,000+ because 70% of revenue goes toward enterprise sales commissions, golf trips, and multi-gigabyte cloud telemetry pipelines. Built by an independent solo security researcher with automated deterministic tooling, Exultia uses compiled native binaries (<35MB RAM) with zero outbound cloud streaming. Whether scaling at $25/node, starting at a $100 baseline, or capping at $500/mo, you pay for pure systems security engineering. Inspect our [**Interactive FAQ**](/faq).`,
    suggestions: [
      'How do I run the Bullshit Validator?',
      'How does the closed-loop defense work?',
      'What is the deterministic rollback command?',
      'Why zero telemetry?'
    ]
  },

  // 14. Interactive FAQ Directory
  {
    id: 'faq-directory',
    title: 'The Comprehensive Interactive FAQ Directory',
    sourceDoc: 'src/app/faq/page.tsx',
    sourceUrl: '/faq',
    topic: 'faq',
    category: 'faq',
    tags: ['faq', 'directory', 'questions', 'skepticism', 'architecture', 'pricing'],
    keywords: ['faq', 'where is the full faq directory', 'faq directory', 'questions', 'frequently asked questions'],
    content: `### 📚 Exultia Comprehensive Interactive FAQ Directory

Our interactive directory contains answers to **19 curated operational, engineering skepticism, and architectural questions** across 5 primary categories:

- **Engineering Skepticism:** Addressing in-memory safety, eBPF trampoline verification, wrapper accusations, and our lean solo economics.
- **Architecture & Performance:** Explaining closed-loop OODA loop speeds (<250ms), zero outbound telemetry, and 14ms deterministic rollbacks.
- **Licensing & Pricing:** Detailing our transparent $0 Community Edition, $500/mo Enterprise Fleet Cap, and linear per-host fleet pricing.
- **Operations & Support:** Outlining our transparent solo security researcher model and no-human SLA policies.
- **Verification & Proving Grounds:** Directing technical evaluators to the public [**github.com/exultia-tech/demo**](https://github.com/exultia-tech/demo) validation harness.

Explore all answers directly on our [**Interactive FAQ Page (/faq)**](/faq)!`,
    suggestions: [
      'Can I get a sales demo?',
      'How does the closed-loop defense work?',
      'Is in-memory hotpatching safe?',
      'What is included in MultiPass?'
    ]
  },
  // 15. Daemon Operations, Lock Handling, Ring Testing & Safety
  {
    id: 'daemon-operations-faq',
    title: 'Kinetic Resident Daemon Operations, Ring Testing, and Safety Guarantees',
    sourceDoc: 'wiki/kinetic-daemon.md',
    sourceUrl: '/faq',
    topic: 'operations',
    category: 'engine',
    tags: ['daemon', 'apt', 'yum', 'lock', 'reboot', 'network', 'backport', 'canary', 'ring', 'testing', 'sla', 'killswitch', 'sync'],
    keywords: [
      'apt lock', 'yum lock', 'holding lock', 'randomly reboot', 'reboot server', 'network drop', 'bricked',
      'backported', 'backport', 'blast radius', 'ring testing', 'configure ring', 'remediation gone',
      'actually gone', 'verify vulnerability', 'who pays', 'downtime liability', 'guarantee remediation',
      'sla', 'broken patch', 'stop patch', 'killswitch', 'quarantine', 'feed sync', 'stops syncing'
    ],
    content: `### ⚙️ Kinetic Daemon Operations, Ring Testing & Safety FAQ

Answers to critical operational questions regarding production safety and fleet orchestration:

- **Lockfile Contention (apt/yum):** The daemon performs non-blocking checks on \`/var/lib/dpkg/lock-frontend\` and \`/var/run/yum.pid\`. It never issues \`kill -9\` or breaks locks; instead, it logs \`DEFERRED_LOCK_BUSY\` and applies exponential backoff. Tier 1 in-memory hotpatches and sysctl mitigations apply without touching package managers.
- **Zero Involuntary Reboots:** The daemon is architecturally forbidden from invoking reboot or shutdown syscalls. Tier 1 patches apply live in memory; Tier 2 package upgrades touch \`/var/run/reboot-required\` and defer restarts to your scheduled maintenance windows.
- **Network Interruption Safety:** All updates use two-phase staging into \`/var/cache/exultia/staging/\`. Binaries are verified with Cosign SLSA Level 3 Ed25519 signatures before system state changes. Network drop at 99% discards cache with zero system mutation.
- **Backported Fixes:** Vantage normalizes Debian Security Trackers, Ubuntu USN, and Red Hat RHSA errata. If a vendor backports a CVE fix into an existing package release string, Vantage marks it \`RESOLVED_BY_BACKPORT\` and leaves it untouched.
- **Multi-Ring Canary Rollouts:** Updates are never blasted simultaneously. Phased rings: **Ring 0 (Canary 2%-10%, 15m gate)** -> **Ring 1 (Staging 25%, 2h soak)** -> **Ring 2 (Broad Fleet 65%-75%)**. Automated health-check failure triggers instant rollback.
- **Client-Side Ring Configuration:** Configurable via \`/etc/exultia/kinetic.toml\` (\`[rollout] ring = 0\`), CLI (\`sudo kinetic config set rollout.ring 0\`), or Kubernetes Helm DaemonSet node labels.
- **Active Remediation Verification:** Closed-loop verification with active socket inspection, memory mapping audit, synthetic loopback exploit probes, and signed OpenVEX attestation receipts.
- **Downtime Liability & SLA:** Standard commercial software terms apply. SLA guarantees 99.9% uptime for the Vantage Threat Feed API; we reject reckless "1-hour patch" claims that bypass formal regression testing.
- **Broken Upstream Patch Killswitch:** Immediate global \`QUARANTINE_REVOCATION\` broadcast blocks admissions in minutes. Canary nodes autonomously execute clean package downgrades.
- **Threat Feed Sync Monitoring:** Monitored via Prometheus (\`exultia_feed_last_sync_timestamp_seconds\`), systemd watchdog, and automatic fallback to 24,388 pre-baked local advisories.`,
    suggestions: [
      'Will this randomly reboot my production server?',
      'What happens if another process is holding the apt/yum lock?',
      'How does the customer configure ring testing from the client?',
      'If the network drops mid-update, is my machine bricked?',
      'How do you handle backported security fixes?'
    ]
  }
];

export class RagKnowledgeBase {
  /**
   * Search the RAG corpus using multi-signal term scoring, phrase boosting, and context weighting.
   */
  public static retrieve(query: string, productContext?: string, limit: number = 3): { chunk: RagChunk; score: number }[] {
    const q = query.toLowerCase().trim();
    const queryTokens = q.split(/[\s,._\-:;/!?()]+/).filter((t) => t.length > 2);

    const scored = EXULTIA_RAG_CORPUS.map((chunk) => {
      let score = 0;

      // 1. Direct keyword match
      if (chunk.keywords.some((kw) => q.includes(kw))) {
        score += 50;
      }
      if (q.includes(chunk.title.toLowerCase())) {
        score += 50;
      }

      // 2. High-priority exact intent boosts
      if (
        (q.includes('bullshit') || q.includes('validator') || q.includes('vaporware') || q.includes('prove this actually works') || q.includes('real or fake')) &&
        chunk.id === 'bullshit-validator'
      ) {
        score += 120;
      }
      if (
        (q.includes('sales demo') || q.includes('sales call') || q.includes('meeting') || q.includes('pitch deck')) &&
        chunk.id === 'sales-demo-faq'
      ) {
        score += 120;
      }
      if (
        (q.includes('whitelabel') || q.includes('white label') || q.includes('rebrand') || q.includes('buy company')) &&
        chunk.id === 'whitelabel-faq'
      ) {
        score += 120;
      }
      if (
        (q.includes('where is the full faq') || q.includes('faq directory') || q.includes('full faq')) &&
        chunk.id === 'faq-directory'
      ) {
        score += 130;
      }
      if (
        (q.includes('rollback') || q.includes('failed hotfix') || q.includes('revert') || q.includes('undo') || q.includes('snapshot')) &&
        chunk.id === 'kinetic-rollback'
      ) {
        score += 90;
      }
      if (
        (q.includes('install the kinetic daemon') || q.includes('download and install the kinetic binary') || q.includes('install kinetic') || q.includes('install the kinetic')) &&
        chunk.id === 'kinetic-install'
      ) {
        score += 95;
      }
      if (
        (q.includes('kinetic pricing') || q.includes('kinetic per-host') || q.includes('hosts on kinetic') || q.includes('cost for 1 host') || q.includes('servers cost on kinetic') || q.includes('nodes on kinetic')) &&
        chunk.id === 'kinetic-pricing'
      ) {
        score += 95;
      }
      if (
        (q.includes('multipass') || q.includes('unified platform') || q.includes('platform plan') || q.includes('unified pricing')) &&
        chunk.id === 'multipass-pricing'
      ) {
        score += 95;
      }
      if (
        (q.includes('overview of all exultia products') || q.includes('all exultia products') || q.includes('all products')) &&
        chunk.id === 'products-overview'
      ) {
        score += 100;
      }
      if (
        (q.includes('api token') || q.includes('generate an api token') || q.includes('service token')) &&
        chunk.id === 'api-tokens'
      ) {
        score += 100;
      }
      if (
        (q.includes('sla') || q.includes('human sla') || q.includes('on-call') || q.includes('pager') || q.includes('phone') || q.includes('uptime guarantee') || q.includes('incident engineer')) &&
        chunk.id === 'operational-model'
      ) {
        score += 95;
      }
      if (
        (q.includes('zero outbound telemetry') || q.includes('zero telemetry') || q.includes('telemetry work') || q.includes('phone home')) &&
        chunk.id === 'zero-telemetry'
      ) {
        score += 95;
      }
      if (
        (q.includes('closed-loop') || q.includes('closed loop') || q.includes('ooda')) &&
        chunk.id === 'closed-loop-ooda'
      ) {
        score += 95;
      }
      if (
        (q.includes('in-memory hotpatching safe') || q.includes('iptables or nftables wrapper') || q.includes('only cost $100') || q.includes('is it a toy')) &&
        chunk.id === 'technical-skepticism'
      ) {
        score += 95;
      }
      if (
        (q.includes('apt lock') || q.includes('yum lock') || q.includes('reboot') || q.includes('network drop') || q.includes('backport') || q.includes('blast radius') || q.includes('ring test') || q.includes('ring') || q.includes('actually gone') || q.includes('who pays') || q.includes('killswitch') || q.includes('stops syncing')) &&
        chunk.id === 'daemon-operations-faq'
      ) {
        score += 120;
      }

      // 3. Keyword / Tag overlap
      for (const token of queryTokens) {
        if (chunk.tags.includes(token)) score += 15;
        if (chunk.keywords.includes(token)) score += 10;
        if (chunk.content.toLowerCase().includes(token)) score += 2;
      }

      // 4. Product Context Boost
      if (productContext) {
        const lowerCtx = productContext.toLowerCase();
        if (lowerCtx.includes('patches') && (chunk.id === 'kinetic-rollback' || chunk.id === 'kinetic-install')) {
          score += 20;
        }
        if (lowerCtx.includes('subscription') && (chunk.id === 'kinetic-pricing' || chunk.id === 'multipass-pricing')) {
          score += 20;
        }
      }

      return { chunk, score };
    });

    return scored
      .filter((item) => item.score > 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Process a dynamic host count calculation query (e.g. "calculate cost for 15 hosts").
   */
  public static calculateHostCost(query: string): string | null {
    const q = query.toLowerCase();
    const hostMatch = q.match(/(\d+)\s*(host|hosts|node|nodes|server|servers|workstation|workstations)/i);
    if (!hostMatch) return null;

    const count = parseInt(hostMatch[1], 10);
    if (isNaN(count) || count <= 0) return null;

    if (count === 1) {
      return `\n\n#### 🧮 Dynamic Fleet Estimate for 1 Host:
- **Community Sovereign:** **$0/mo (Free forever for 1 host with CVE threat intelligence)**
- **Kinetic Pro:** **$49/mo** ($39/mo billed annually at $468/yr)
- **Kinetic Enterprise:** **$149/mo** ($119/mo billed annually at $1,428/yr)`;
    }

    const proMonthly = count * 49;
    const proAnnual = count * 39;
    const proAnnualTotal = proAnnual * 12;
    const entMonthly = count * 149;
    const entAnnual = count * 119;
    const entAnnualTotal = entAnnual * 12;

    return `\n\n#### 🧮 Dynamic Fleet Estimate for ${count} Hosts:
- **Kinetic Pro Tier:**
  - Monthly: **$${proMonthly}/mo** ($49/host)
  - Annual: **$${proAnnual}/mo** ($39/host, billed $${proAnnualTotal.toLocaleString()}/yr)
- **Kinetic Enterprise Tier:**
  - Monthly: **$${entMonthly}/mo** ($149/host)
  - Annual: **$${entAnnual}/mo** ($119/host, billed $${entAnnualTotal.toLocaleString()}/yr)

*Linear per-host pricing with zero arbitrary grouped-bucket minimums. You pay strictly for active production hosts.*`;
  }
}
