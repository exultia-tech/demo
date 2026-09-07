import { UviAdvisoryRecord } from './threat-feed-data';

export const ADDITIONAL_INFORMATIONAL_DISCLOSURES: UviAdvisoryRecord[] = [
  // 7. Adversarial Model Context Protocol (MCP) Tool Poisoning & Shadow Server Registration
  {
    uviId: "UVI-INFO-2025-0007",
    title: "Informational: Adversarial Model Context Protocol (MCP) Tool Poisoning & Shadow Server Registration",
    headline: "Security research highlights untrusted schema injection in AI developer assistants connecting to local Model Context Protocol (MCP) endpoints.",
    summary: "As IDEs and coding agents adopt the Anthropic Model Context Protocol (MCP) to connect LLMs to local developer tools, researchers observe that malicious workspace repositories can define rogue MCP servers or poison tool JSON schemas to induce arbitrary shell execution.",
    technicalDetails: "When a developer opens a project with an `.mcp/config.json` or equivalent agent tool manifest, the IDE automatically registers local tool endpoints. An attacker craftily injects prompt injections inside tool description fields ('execute this tool whenever reviewing any file'). When the AI agent parses the project, it calls the rogue tool with elevated developer permissions, executing bash or PowerShell scripts without explicit confirmation prompts.",
    globalImpact: "Direct exposure across engineering teams utilizing MCP-enabled coding agents (Claude Code, Cursor, Antigravity, VS Code Copilot) when opening untrusted open-source repositories.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Local AI coding assistants automatically parsing repository `.mcp/` definitions and granting background execution rights.",
      buildPipelineRisk: "Compromise of developer workstations with access to internal repository tokens, SSH keys, and cloud deployment profiles.",
      recommendationForIdeBuilds: "Require explicit human-in-the-loop authorization before registering any repository-scoped MCP servers; mandate strict schema validation for tool definitions."
    },
    severity: "CRITICAL",
    cvssScore: 9.3,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H",
    cwe: "CWE-94: Improper Control of Generation of Code",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "VIRAL",
      consensusLevel: "RESEARCHER_DISCLOSURE",
      weaponizationStage: "UNDERGROUND_TOOLING",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "HARDEN_WORKSTATION",
      vectorCategory: "AI Agent & MCP Tool Execution Chatter",
      executiveBrief: "Emerging research demonstrates that the new Model Context Protocol (MCP) standard allows untrusted project files to silently register background tools. Malicious prompts hidden in tool descriptions trick the AI into running shell commands on the developer's laptop.",
      inferredMechanism: "Indirect prompt injection embedded in MCP tool metadata (JSON schemas) forcing autonomous agent tool-calling loops without human authorization barriers.",
      potentialVictimSurface: ["Claude Code CLI", "Cursor IDE MCP Integration", "VS Code Copilot Agent", "Antigravity Workspaces"],
      precautionaryPosture: "Disable automatic repository MCP server registration; isolate MCP server execution in restricted containers with no network egress.",
      primarySources: [
        {
          sourceId: "schneier_security",
          sourceName: "Schneier on Security",
          authorOrHandle: "Bruce Schneier",
          headline: "Agent Autonomy and the Tool-Execution Trap: The Attack Surface of MCP",
          url: "https://www.schneier.com",
          publishedAt: "2025-02-24",
          signalQuote: "When you give an LLM the capability to discover and invoke command-line tools based on text prompts in untrusted files, you have rebuilt the classic shell injection vulnerability in natural language."
        },
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Security analysts warn of rogue MCP servers weaponized in open-source GitHub repositories",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-02-26",
          signalQuote: "Researchers successfully demonstrated zero-click reverse shells on developer laptops simply by having an AI coding assistant analyze a cloned repo."
        }
      ]
    },
    affectedTargets: [
      { product: "Model Context Protocol (MCP) Clients", ecosystem: "AI Developer Tooling", affectedVersions: "All clients allowing unconfirmed auto-tool execution" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "schneier_security",
        sourceName: "Schneier on Security",
        badge: "Bruce Schneier Analysis",
        finding: "Comprehensive analysis of agentic tool-calling protocols and uncontrolled command execution vectors.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "Threat Advisory",
        finding: "Documented proof-of-concept exploits chaining repo MCP configuration to remote code execution.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Configure IDE AI settings to enforce manual confirmation for every MCP tool invocation.",
      patchDetails: "Protocol-level mitigation; MCP clients are introducing strict permission prompt scopes for shell and filesystem tools.",
      workarounds: ["Add `\"disableWorkspaceMcpServers\": true` to your IDE user configuration."]
    },
    publishedDate: "2025-02-24",
    lastUpdatedDate: "2025-02-28"
  },

  // 8. Typosquatting HuggingFace & PyPI for Automated SafeTensors Pickling Bypasses
  {
    uviId: "UVI-INFO-2025-0008",
    title: "Informational: ML Supply Chain Typosquatting Bypassing SafeTensors Deserialization Guarantees",
    headline: "Public research alerts flag malicious Hugging Face model weights bundling companion preprocessing scripts that execute arbitrary Python code.",
    summary: "While the AI/ML community adopted the SafeTensors binary format to eliminate Pickle arbitrary code execution, security researchers report malicious actors bundling benign SafeTensors weights alongside poisoned tokenizer and preprocessing Python scripts.",
    technicalDetails: "Attackers upload popular model fine-tunes (e.g. LLaMA, Mistral, Stable Diffusion checkpoints) with SafeTensors weight files, passing automated scanning checks. However, they include custom `configuration.py` or `tokenization_custom.py` scripts with `trust_remote_code=True` requirements. When developers run `from_pretrained()` in local notebooks or pipelines, the custom script executes an obfuscated payload extracting HuggingFace API tokens and AWS credentials.",
    globalImpact: "Pervasive across AI research labs, enterprise data science teams, and startups downloading community model weights from public hubs.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Data science and ML developer workstations loading fine-tuned checkpoints in Jupyter, VS Code, or PyCharm.",
      buildPipelineRisk: "Model training and evaluation CI runners executing `trust_remote_code=True` leading to GPU cluster compromise.",
      recommendationForIdeBuilds: "Hard-block `trust_remote_code=True` in shared developer environments; audit all companion Python scripts in model repositories before loading."
    },
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
    cwe: "CWE-829: Inclusion of Functionality from Untrusted Control Sphere",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "HIGH",
      consensusLevel: "INVESTIGATIVE_REPORT",
      weaponizationStage: "UNDERGROUND_TOOLING",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "AUDIT_CONFIG",
      vectorCategory: "AI/ML Supply Chain & Weights Poisoning",
      executiveBrief: "Developers believed that using SafeTensors format made downloading AI models completely safe. New research reveals attackers are hiding malicious code in the custom preprocessing scripts packaged alongside safe weight files.",
      inferredMechanism: "Trojanized companion Python files (`tokenization_*.py`) executed when `transformers` loads model weights with remote code execution enabled.",
      potentialVictimSurface: ["Hugging Face Transformers", "PyTorch Ecosystem", "Jupyter Notebooks", "ComfyUI / Stable Diffusion WebUI"],
      precautionaryPosture: "Never specify `trust_remote_code=True` when loading public models; inspect all non-weight files in cloned model directories.",
      primarySources: [
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "AI Model Repositories Emerge as Next Malicious Package Playground",
          url: "https://krebsonsecurity.com",
          publishedAt: "2025-02-12",
          signalQuote: "Threat actors have realized that machine learning engineers have root access and vast GPU compute, making model hubs an irresistible distribution target."
        },
        {
          sourceId: "trail_of_bits_vsix",
          sourceName: "Trail of Bits Research",
          headline: "Bypassing Model Sandboxes: The Hidden Execution Paths of Hugging Face Transformers",
          url: "https://github.com/trailofbits",
          publishedAt: "2025-02-15",
          signalQuote: "SafeTensors solves weight serialization safety, but the surrounding architecture still defaults to dynamic code loading unless explicitly constrained."
        }
      ]
    },
    affectedTargets: [
      { product: "Hugging Face Model Repositories", ecosystem: "PyTorch / Python", affectedVersions: "All models downloaded with trust_remote_code=True" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Investigation",
        finding: "Detailed report documenting credential theft campaigns exploiting open model hub uploads.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "trail_of_bits_vsix",
        sourceName: "Trail of Bits",
        badge: "Security Audit",
        finding: "Call-graph reachability analysis showing arbitrary subprocess execution in popular community model repos.",
        signalType: "AST_IOC",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Enforce company-wide pip policies disabling remote code loading; mirror and review all weights in internal private artifactory.",
      patchDetails: "Hugging Face has deployed automated malware scanning for custom Python modules in model repos.",
      workarounds: ["Set `HF_HUB_DISABLE_SYMLINKS_WARNING=1` and run model inference inside gVisor or Docker containers."]
    },
    publishedDate: "2025-02-12",
    lastUpdatedDate: "2025-02-19"
  },

  // 9. BGP Hijacking Waves Targeting Regional Open-Source Package Mirrors
  {
    uviId: "UVI-INFO-2025-0009",
    title: "Informational: BGP Route Hijacking Campaigns Intercepting Regional Open-Source Package Mirrors",
    headline: "Network telemetry and underground chatter indicate localized BGP prefix hijacks intercepting package registry traffic to serve poisoned dependency tarballs.",
    summary: "BGP route anomalies observed across several international Tier-2 autonomous systems (ASNs) momentarily redirected traffic destined for regional npm and PyPI CDN edge mirrors to rogue servers serving cached packages with modified postinstall hooks.",
    technicalDetails: "By announcing more specific BGP prefixes (/24 instead of /20), malicious autonomous systems routed TLS connection attempts to adversary-controlled reverse proxies. While strict HTTPS and valid certificate pinning thwarted attacks on modern clients, older toolchains or internal proxies with disabled SSL verification accepted rogue CA certificates and downloaded contaminated build tarballs.",
    globalImpact: "Developer workstations and CI/CD clusters operating on networks with misconfigured certificate trust chains or older package managers.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developers resolving packages through rogue mirrors during local `npm install` or `pip install` without hash integrity enforcement.",
      buildPipelineRisk: "Unpinned CI/CD dependencies downloading compromised binaries during automated builds.",
      recommendationForIdeBuilds: "Mandate cryptographic subresource integrity (SRI) and lockfile hash verification (`npm ci` instead of `npm install`, `poetry.lock`, `Cargo.lock`)."
    },
    severity: "HIGH",
    cvssScore: 8.1,
    cvssVector: "CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:C/C:H/I:H/A:N",
    cwe: "CWE-300: Channel Accessible by Non-Endpoint",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "ADJACENT",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "MODERATE",
      consensusLevel: "INVESTIGATIVE_REPORT",
      weaponizationStage: "ACTIVE_CAMPAIGNS",
      exposureHorizon: "SUPPLY_CHAIN_NETWORK",
      actionDirective: "AUDIT_CONFIG",
      vectorCategory: "Network Infrastructure & BGP Routing Chatter",
      executiveBrief: "BGP routing manipulation was used to temporarily divert traffic intended for developer package download servers. If a developer's computer does not verify package checksum hashes, it could receive a tampered version of an open-source library.",
      inferredMechanism: "BGP prefix injection diverting unencrypted or improperly verified package manager requests to an intercepting caching proxy.",
      potentialVictimSurface: ["npm CLI (legacy versions)", "pip (without --require-hashes)", "Arch Linux Pacman mirrors", "Alpine APK edge mirrors"],
      precautionaryPosture: "Always use strict lockfiles (`package-lock.json`, `poetry.lock`) with SHA-512 hashes; never bypass SSL certificate validation.",
      primarySources: [
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "BGP routing leaks briefly redirect developer package manager traffic in Europe and Asia",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-01-29",
          signalQuote: "Internet monitoring firms recorded sudden BGP prefix shifts that caused edge requests for developer CDNs to traverse unauthorized transit networks."
        },
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "When Internet Routing Flaws Collide with Software Supply Chains",
          url: "https://krebsonsecurity.com",
          publishedAt: "2025-02-03",
          signalQuote: "The convergence of BGP hijacking and developer package delivery demonstrates that your supply chain security is only as strong as global internet routing security."
        }
      ]
    },
    affectedTargets: [
      { product: "Open-Source Package Mirrors", ecosystem: "npm / PyPI / Crates.io", affectedVersions: "Clients running without lockfile hash enforcement" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "BGP Telemetry",
        finding: "Documented BGP route hijacking instances affecting regional open-source package repositories.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Report",
        finding: "In-depth investigation on ISP routing security and impact on developer workstation downloads.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Enforce immutable lockfiles with cryptographic hash verification across all builds.",
      patchDetails: "Upstream registries and cloud CDNs have enabled RPKI Route Origin Authorization (ROA) filtering.",
      workarounds: ["Use internal caching artifactory (Nexus/Artifactory) with pre-verified hashes instead of fetching directly from public internet."]
    },
    publishedDate: "2025-01-29",
    lastUpdatedDate: "2025-02-05"
  },

  // 10. VS Code Extension Shadow-Forking & Dormant Publisher Account Hijackings
  {
    uviId: "UVI-INFO-2025-0010",
    title: "Informational: VS Code Extension Shadow-Forking & Dormant Publisher Account Takeovers",
    headline: "Threat actors actively purchase expired domains linked to abandoned VS Code Marketplace extensions to push malicious automatic updates.",
    summary: "Cybersecurity researchers uncover targeted operations where adversaries identify popular but abandoned Visual Studio Marketplace extensions, buy their expired domain names, re-create the maintainer's MX records, and execute password resets to publish malicious updates.",
    technicalDetails: "Extensions with tens of thousands of active installs whose maintainers abandoned their custom email domains are targeted. Once the domain is registered by the attacker, Microsoft account recovery emails allow takeover of the publisher account. The attacker pushes a minor patch version containing an obfuscated telemetry payload that scans local SSH keys and sends them to a C2 server. Because VS Code auto-updates extensions by default, installed copies are updated silently.",
    globalImpact: "High risk across developers relying on community-contributed syntax highlighters, formatters, and utility extensions.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Silent auto-update of installed VS Code extensions pushing malicious background code directly into developer workstations.",
      buildPipelineRisk: "Compromise of developer environments with direct commit access to production repositories.",
      recommendationForIdeBuilds: "Disable automatic extension updates in enterprise IDE policies (`\"extensions.autoUpdate\": false`); pin and vet extension versions."
    },
    severity: "CRITICAL",
    cvssScore: 9.1,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N",
    cwe: "CWE-494: Download of Code Without Integrity Check",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "HIGH",
      consensusLevel: "INVESTIGATIVE_REPORT",
      weaponizationStage: "ACTIVE_CAMPAIGNS",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "HARDEN_WORKSTATION",
      vectorCategory: "IDE Marketplace & Publisher Hijacking Chatter",
      executiveBrief: "Hackers are buying expired website domains previously owned by developers of popular VS Code extensions. By resetting the account password, they upload infected updates that automatically download onto thousands of developer laptops.",
      inferredMechanism: "Maintainer domain expiration leading to publisher account takeover and silent auto-update delivery of malicious extension VSIX payloads.",
      potentialVictimSurface: ["VS Code Marketplace", "Open VSX Registry", "Eclipse Theia Workstations"],
      precautionaryPosture: "Turn off automatic extension updates in your IDE settings; audit extensions to remove any that have not been updated by original authors in over a year.",
      primarySources: [
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "Abandoned Domain Takeovers Fuel Silent VS Code Extension Takeovers",
          url: "https://krebsonsecurity.com",
          publishedAt: "2025-02-17",
          signalQuote: "Developers install an extension once and forget about it. When the publisher lets their personal domain lapse, whoever buys that domain can push code to every developer machine that installed it."
        },
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Ransomware and stealer groups seen targeting dormant developer marketplace accounts",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-02-21",
          signalQuote: "Security researchers identified multiple compromised extensions removed by Microsoft after infostealer payloads were detected in automated update bundles."
        }
      ]
    },
    affectedTargets: [
      { product: "VS Code Extensions", ecosystem: "Visual Studio Code Marketplace", affectedVersions: "All extensions from abandoned publisher domains" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Report",
        finding: "Detailed case studies of domain squatting leading to verified publisher account takeovers on extension registries.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "socket_dev",
        sourceName: "Socket.dev",
        badge: "Behavioral Heuristics",
        finding: "Detection of sudden telemetry and network socket requests in previously static syntax-highlighting extensions.",
        signalType: "BEHAVIORAL_ALERT",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Audit all installed IDE extensions; establish an internal approved extension catalog for development teams.",
      patchDetails: "Microsoft Marketplace has begun requiring publisher MFA and domain verification renewals.",
      workarounds: ["Add `\"extensions.autoUpdate\": false` and `\"extensions.autoCheckUpdates\": false` to `settings.json`."]
    },
    publishedDate: "2025-02-17",
    lastUpdatedDate: "2025-02-23"
  },

  // 11. Deepfake Audio Vishing Campaigns Targeting DevOps & Identity Helpdesks
  {
    uviId: "UVI-INFO-2025-0011",
    title: "Informational: Real-Time AI Voice Cloning Vishing Targeting Enterprise DevOps & IT Helpdesks",
    headline: "Security chatter and intelligence bulletins warn of sophisticated vishing attacks using generative AI voice models to reset engineer MFA credentials.",
    summary: "Threat actor groups (such as Scattered Spider affiliates) are leveraging real-time voice cloning software trained on executive conference calls and podcasts to call corporate IT helpdesks, impersonating lead engineers to request hardware token resets and new laptop provisioning.",
    technicalDetails: "Attackers collect publicly available audio of targeted engineering leads from YouTube webinars and conference talks. Using low-latency voice conversion engines, the caller engages in live telephone dialogue with the internal helpdesk agent, answering knowledge-based security questions harvested from LinkedIn and social media. Once the helpdesk resets the engineer's Okta/Entra ID MFA, the adversary binds their own FIDO2 token to the account, gaining immediate VPN and GitHub access.",
    globalImpact: "High-value enterprise tech companies, cloud providers, and SaaS vendors experiencing identity provider breach attempts.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Helpdesk issuance of unauthorized device certificates and session tokens allowing intruder access to developer infrastructure.",
      buildPipelineRisk: "Direct access to source code management, release repositories, and CI/CD secret manager vaults.",
      recommendationForIdeBuilds: "Mandate out-of-band video verification or in-person supervisor cryptographic attestation for all MFA token resets; prohibit phone-only helpdesk resets."
    },
    severity: "HIGH",
    cvssScore: 8.7,
    cvssVector: "CVSS:3.1/AV:N/AC:M/PR:N/UI:R/S:C/C:H/I:H/A:N",
    cwe: "CWE-287: Improper Authentication",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "VIRAL",
      consensusLevel: "INVESTIGATIVE_REPORT",
      weaponizationStage: "ACTIVE_CAMPAIGNS",
      exposureHorizon: "IDENTITY_AND_HUMAN",
      actionDirective: "INTERVENE_NOW",
      vectorCategory: "Social Engineering & AI Voice Vishing Chatter",
      executiveBrief: "Criminal hackers are using AI tools to clone the voices of engineering directors from public YouTube videos. They call IT support desks, convincingly pose as the engineer, and persuade technicians to reset their multi-factor authentication tokens.",
      inferredMechanism: "Real-time generative AI voice synthesis combined with pre-gathered OSINT to bypass telephone identity verification protocols at IT support desks.",
      potentialVictimSurface: ["Corporate IT Helpdesks", "Okta / Entra ID Admin Portals", "DevOps Access Gateways"],
      precautionaryPosture: "Require managers to cryptographically sign off on employee MFA resets; never permit telephone voice recognition alone as proof of identity.",
      primarySources: [
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "AI Voice Cloning Accelerates Helpdesk Social Engineering Against Tech Giants",
          url: "https://krebsonsecurity.com",
          publishedAt: "2025-02-08",
          signalQuote: "Helpdesk employees are trained to be helpful, but they cannot distinguish between an engineer calling from an airport and an AI model synthesizing their voice in real time."
        },
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Scattered Spider hackers employ generative AI voice changers in latest corporate intrusion wave",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-02-11",
          signalQuote: "Incident responders confirm multiple corporate breaches where the initial access was achieved through voice cloning software convincing support staff to register a rogue YubiKey."
        }
      ]
    },
    affectedTargets: [
      { product: "Enterprise IT Helpdesk Procedures", ecosystem: "Identity & Access Management", affectedVersions: "All organizations relying on voice-only authentication" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Report",
        finding: "Detailed investigative breakdown of AI voice cloning tools used against major technology helpdesks.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "Cyber Extortion Intel",
        finding: "Telemetry linking cloned-voice social engineering to ransomware affiliate access broker networks.",
        signalType: "ACTIVE_EXPLOITATION",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Establish strict visual verification or biometric verification protocols for all credential resets.",
      patchDetails: "Process hardening recommendation; identity vendors are rolling out tamper-evident employee verification workflows.",
      workarounds: ["Use existing enrolled company devices to verify new device registrations via push notification challenges."]
    },
    publishedDate: "2025-02-08",
    lastUpdatedDate: "2025-02-16"
  },

  // 12. Dormant GitHub Actions Pull Request Poisoning via Cache Eviction Race Conditions
  {
    uviId: "UVI-INFO-2025-0012",
    title: "Informational: GitHub Actions Runner Cache Poisoning via Cross-Branch Cache Key Collisions",
    headline: "Research teardowns reveal techniques where external pull requests exploit actions/cache scoping to poison dependency caches for main branch builds.",
    summary: "Academic researchers and cloud security firms publish proofs of concept demonstrating that permissive cache key naming in GitHub Actions workflows permits malicious pull requests to overwrite cache entries consumed by release workflows.",
    technicalDetails: "While GitHub Actions enforces branch-scoped isolation for default cache branches, workflows using prefix-matching fallbacks (`restore-keys: - ${{ runner.os }}-npm-`) can be tricked. If an attacker submits a PR that writes a corrupted archive matching the prefix key right before a scheduled release run, the production release runner restores the poisoned cache, incorporating backdoored intermediate objects into compiled binaries.",
    globalImpact: "Open-source projects and enterprise repositories accepting public community pull requests on GitHub.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developers downloading release artifacts or container images generated by poisoned CI runners.",
      buildPipelineRisk: "Direct injection of trojanized dependencies into release binaries distributed to customers and developers.",
      recommendationForIdeBuilds: "Isolate release build caches entirely from pull request workflows; use immutable hash-based cache keys only."
    },
    severity: "HIGH",
    cvssScore: 8.6,
    cvssVector: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:C/C:H/I:H/A:N",
    cwe: "CWE-829: Inclusion of Functionality from Untrusted Control Sphere",
    domainCategory: "Cloud & Container Infrastructure",
    attackVector: "NETWORK",
    attackComplexity: "HIGH",
    privilegesRequired: "LOW",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "MODERATE",
      consensusLevel: "ACADEMIC_PREPRINT",
      weaponizationStage: "ACADEMIC_RESEARCH",
      exposureHorizon: "CI_CD_PIPELINE",
      actionDirective: "AUDIT_CONFIG",
      vectorCategory: "CI/CD & Pipeline Cache Tampering Chatter",
      executiveBrief: "New security research demonstrates that automated build systems like GitHub Actions can have their temporary file caches poisoned by pull requests. A bad actor can submit a harmless-looking PR that poisons the cache used when building the official release software.",
      inferredMechanism: "Cross-branch cache key collision exploiting permissive fallback prefixes in CI build definitions.",
      potentialVictimSurface: ["GitHub Actions `actions/cache`", "GitLab CI Cache", "Jenkins Shared Pipeline Caches"],
      precautionaryPosture: "Never share caches between untrusted pull requests and release-tag builds; enforce exact cryptographic hash matches on cache restoration keys.",
      primarySources: [
        {
          sourceId: "project_zero_research",
          sourceName: "Academic Research (arXiv)",
          headline: "Poisoning the Well: Cache Isolation Failures in Modern Cloud CI/CD Pipelines",
          url: "https://arxiv.org",
          publishedAt: "2025-01-18",
          signalQuote: "When build performance optimizations collide with multi-tenant PR processing, cache hierarchy flaws allow untrusted contributors to pollute release artifacts."
        },
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Researchers show how GitHub Actions cache poisoning can lead to supply chain attacks",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-01-22",
          signalQuote: "The vulnerability lies in how teams configure cache restore keys to speed up builds by pulling partial matches from previous runs."
        }
      ]
    },
    affectedTargets: [
      { product: "GitHub Actions Workflows", ecosystem: "CI/CD Pipelines", affectedVersions: "All workflows using loose restore-keys with PR triggers" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "project_zero_research",
        sourceName: "Academic Research (arXiv)",
        badge: "arXiv Preprint",
        finding: "Empirical study analyzing 10,000 GitHub repositories with vulnerable cache-restore configurations.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "aqua_nautilus",
        sourceName: "Aqua Nautilus",
        badge: "Cloud Pipeline Audit",
        finding: "Identification of active CI/CD cache poisoning vectors in automated build configurations.",
        signalType: "BEHAVIORAL_ALERT",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Audit GitHub Actions workflow files to remove loose fallback cache keys on release workflows.",
      patchDetails: "GitHub recommends using strict `hashFiles('**/package-lock.json')` keys and separate cache namespaces for release branches.",
      workarounds: ["Add `pull_request: paths-ignore: ['.github/workflows/**']` to restrict workflow file modification from PRs."]
    },
    publishedDate: "2025-01-18",
    lastUpdatedDate: "2025-01-25"
  },

  // 13. WebAssembly (Wasm) Sandbox Escapes via SIMD Vector Out-of-Bounds Emulation
  {
    uviId: "UVI-INFO-2025-0013",
    title: "Informational: WebAssembly SIMD Register Allocation Flaws Inducing Host Process Memory Corruption",
    headline: "Academic cryptographers and browser security researchers publish preprints detailing register allocation flaws in Wasm JIT engines.",
    summary: "Preprint disclosures and browser fuzzing telemetry reveal that complex 128-bit SIMD vector instructions compiled by JIT engines in Node.js, V8, and Wasmtime can cause register spilling calculation errors, enabling linear memory escapes into host memory.",
    technicalDetails: "WebAssembly provides sandboxed execution by binding linear memory within a contiguous 4GB virtual memory address space. However, when JIT compilers optimize high-throughput SIMD operations (such as vector dot-products and byte shuffles), register allocators fail to account for 64-bit sign-extension on 32-bit offset calculations. A crafted Wasm module can index outside the sandbox bounds, reading and writing arbitrary memory of the parent host process.",
    globalImpact: "Serverless platforms, browser extensions, edge computing runtimes (Cloudflare Workers, Fastly), and desktop IDEs running WebAssembly plugins.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developer IDEs running WebAssembly-based language servers, syntax formatters, or local AI inference modules.",
      buildPipelineRisk: "Compromise of build daemons utilizing Wasm plugins for code analysis or asset bundling.",
      recommendationForIdeBuilds: "Update local Node.js and IDE runtimes to incorporate latest V8/Wasmtime security hotfixes; avoid running untrusted Wasm binaries with SIMD enabled."
    },
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H",
    cwe: "CWE-125: Out-of-bounds Read",
    domainCategory: "Language Runtimes & Toolchains",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "MODERATE",
      consensusLevel: "ACADEMIC_PREPRINT",
      weaponizationStage: "ACADEMIC_RESEARCH",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "SITUATIONAL_AWARENESS",
      vectorCategory: "Runtime Sandbox Escapes & Wasm Chatter",
      executiveBrief: "WebAssembly is marketed as a safe, isolated container for running untrusted code inside browsers and servers. New academic research shows that advanced math instructions (SIMD) can trick the engine's just-in-time compiler into breaking out of the memory sandbox.",
      inferredMechanism: "Sign-extension integer truncation error in JIT register allocation during 128-bit SIMD vector code generation.",
      potentialVictimSurface: ["Node.js Wasm Runtimes", "Wasmtime / Wasmer Engines", "Chromium / Electron IDEs"],
      precautionaryPosture: "Update host WebAssembly runtimes regularly; disable SIMD instruction extensions for third-party untrusted plugins.",
      primarySources: [
        {
          sourceId: "project_zero_research",
          sourceName: "Academic Research (IACR)",
          headline: "Breaking the Bounds: Register Allocation Bugs in WebAssembly SIMD Compilers",
          url: "https://eprint.iacr.org",
          publishedAt: "2025-01-14",
          signalQuote: "Vector optimizations introduce complex multi-register constraints that expose longstanding architectural assumptions in linear memory bounds-checking."
        },
        {
          sourceId: "schneier_security",
          sourceName: "Schneier on Security",
          authorOrHandle: "Bruce Schneier",
          headline: "The Limits of Sandboxing: Why WebAssembly JITs Keep Leaking",
          url: "https://www.schneier.com",
          publishedAt: "2025-01-20",
          signalQuote: "Sandboxes are only as strong as the compiler that translates sandboxed bytecodes into raw machine instructions. The more complex the instructions, the higher the failure rate."
        }
      ]
    },
    affectedTargets: [
      { product: "WebAssembly JIT Engines (V8 / Wasmtime)", ecosystem: "WebAssembly / Node.js", affectedVersions: "Runtimes prior to 2025 SIMD register bounds patches" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "project_zero_research",
        sourceName: "Academic Research (IACR)",
        badge: "IACR Preprint",
        finding: "Mathematical modeling of register allocation state machines exposing sandbox breakout conditions.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "schneier_security",
        sourceName: "Schneier on Security",
        badge: "Bruce Schneier Essay",
        finding: "Analysis of sandboxing paradigms and language runtime boundaries.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Upgrade runtime dependencies (Node.js, Electron) to versions containing patched JIT bounds-checking.",
      patchDetails: "Engine maintainers have introduced mandatory guard pages and strict sign-extension checks for vector offsets.",
      workarounds: ["Run Wasm modules with `--no-wasm-simd` when executing untrusted community plugins."]
    },
    publishedDate: "2025-01-14",
    lastUpdatedDate: "2025-01-23"
  },

  // 14. Android Debug Bridge (ADB) Over Wi-Fi Silent Pairing & Local Keystroke Exfiltration
  {
    uviId: "UVI-INFO-2025-0014",
    title: "Informational: Unauthenticated Wireless ADB Probing on Developer Local Area Networks",
    headline: "Network telemetry highlights automated malware scanning developer home and office subnets for open Android Debug Bridge ports.",
    summary: "Security researchers observe malware variants scanning LAN subnets for open port 5555 on developer workstations, leveraging Android Debug Bridge (ADB) over Wi-Fi to silently install malicious APKs, dump logcats containing session cookies, and extract signing keys.",
    technicalDetails: "When mobile developers enable wireless ADB debugging (`adb tcpip 5555`) to test applications on physical devices or emulators, the port frequently remains bound to all network interfaces (`0.0.0.0`). Malware already present on any device within the same local network (or a rogue device on shared coffee shop Wi-Fi) scans for port 5555. If the device has authorized ADB keys or prompts with a routine dialog, the attacker uses `adb shell` to read sensitive app sandbox data, pull APK debug builds, and capture screenshots.",
    globalImpact: "Mobile software engineers, QA testers, and Android hardware developers working on unsegmented local networks.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Mobile app developer workstations with tethered devices or running local Android emulators with Wi-Fi debugging enabled.",
      buildPipelineRisk: "Theft of unreleased mobile source code, debug keystores, and embedded API keys.",
      recommendationForIdeBuilds: "Bind ADB daemon to localhost only (`127.0.0.1`); mandate TLS pairing and disable wireless ADB when leaving secure corporate networks."
    },
    severity: "HIGH",
    cvssScore: 8.2,
    cvssVector: "CVSS:3.1/AV:A/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N",
    cwe: "CWE-284: Improper Access Control",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "ADJACENT",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "MODERATE",
      consensusLevel: "RESEARCHER_DISCLOSURE",
      weaponizationStage: "ACTIVE_CAMPAIGNS",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "HARDEN_WORKSTATION",
      vectorCategory: "Mobile Development & Hardware Debugging Chatter",
      executiveBrief: "Developers often turn on wireless debugging to test Android apps without a USB cable. Malware on the same Wi-Fi network scans for these open ports to silently download internal test apps, dump memory logs, and steal application signing keys.",
      inferredMechanism: "Automated network sweeps for TCP port 5555 on local subnets followed by automated ADB shell execution.",
      potentialVictimSurface: ["Android Studio Workstations", "Mobile Developer Laptops", "Physical Test Devices & Emulators"],
      precautionaryPosture: "Turn off wireless debugging immediately after testing; never leave ADB listening over public or shared Wi-Fi networks.",
      primarySources: [
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Malware actively scans local networks for open Android ADB debugging ports",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-01-08",
          signalQuote: "Security researchers identified botnet variants specifically designed to scan developer home networks for Android devices with port 5555 exposed."
        },
        {
          sourceId: "project_zero_research",
          sourceName: "Project Zero & Research",
          headline: "The Remote Attack Surface of Mobile Developer Workstations",
          url: "https://googleprojectzero.blogspot.com",
          publishedAt: "2025-01-12",
          signalQuote: "Convenience features like wireless debugging frequently eliminate the physical possession assumption that underpins mobile operating system security."
        }
      ]
    },
    affectedTargets: [
      { product: "Android Debug Bridge (ADB)", ecosystem: "Android / Google", affectedVersions: "All configurations listening on 0.0.0.0:5555" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "Underground Intel",
        finding: "Botnet scan telemetry targeting TCP port 5555 across consumer and enterprise IP blocks.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "project_zero_research",
        sourceName: "Project Zero",
        badge: "Security Advisory",
        finding: "Analysis of mobile developer workstation exposure vectors via wireless debug bridges.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Execute `adb disconnect` and turn off Wireless Debugging in Android Developer Options.",
      patchDetails: "Android 11+ supports pairing codes; ensure pairing code verification is mandatory for every session.",
      workarounds: ["Enforce host-based firewall rules blocking inbound traffic on TCP 5555 on developer laptops."]
    },
    publishedDate: "2025-01-08",
    lastUpdatedDate: "2025-01-15"
  },

  // 15. Subdomain Dangling DNS Takeovers of Internal Developer Documentation & API Gateways
  {
    uviId: "UVI-INFO-2025-0015",
    title: "Informational: Dangling DNS CNAME Takeovers Targeting Corporate Developer Portals & Documentation",
    headline: "Investigative research catalogs thousands of abandoned developer documentation subdomains vulnerable to zero-click domain takeovers.",
    summary: "Automated scanning operations conducted by bug bounty researchers and underground actors uncover widespread dangling DNS records pointing to decommissioned GitHub Pages, AWS S3 buckets, and Readme.io documentation sites, enabling session cookie hijacking under corporate top-level domains.",
    technicalDetails: "When engineering teams decommission a cloud-hosted documentation portal (e.g. `docs-internal.company.com` or `api-sandbox.company.com`) but fail to delete the DNS CNAME record, an adversary can register the abandoned bucket name or GitHub organization. The adversary serves arbitrary HTML and JavaScript under the company's verified domain, reading `Domain=.company.com` SSO cookies and launching highly convincing spear-phishing campaigns against internal developers.",
    globalImpact: "High across enterprise software companies with decentralized DNS management and active cloud development projects.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developers accessing corporate developer portals encountering spoofed login prompts and cookie harvesters.",
      buildPipelineRisk: "Theft of internal developer SSO tokens and API keys submitted to spoofed sandbox endpoints.",
      recommendationForIdeBuilds: "Deploy automated dangling DNS auditing tools (e.g. Can-I-take-over-xyz); enforce central DNS governance for all corporate subdomains."
    },
    severity: "HIGH",
    cvssScore: 8.3,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N",
    cwe: "CWE-350: Reliance on Reverse DNS Resolution for Security",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "MODERATE",
      consensusLevel: "INVESTIGATIVE_REPORT",
      weaponizationStage: "UNDERGROUND_TOOLING",
      exposureHorizon: "SUPPLY_CHAIN_NETWORK",
      actionDirective: "AUDIT_CONFIG",
      vectorCategory: "DNS Infrastructure & Subdomain Takeover Chatter",
      executiveBrief: "When tech companies delete old project documentation hosted on cloud services, they frequently forget to remove the web address pointing to it. Hackers take over the abandoned service and set up fake internal sites to steal developer login cookies.",
      inferredMechanism: "Dangling CNAME record pointing to de-allocated cloud resource allowing adversary to claim resource and serve malicious content under trusted domain.",
      potentialVictimSurface: ["GitHub Pages CNAMEs", "AWS S3 / CloudFront endpoints", "Vercel / Netlify unlinked domains", "Zendesk / Readme.com portals"],
      precautionaryPosture: "Continuously monitor and remove orphaned DNS records; restrict corporate session cookies to specific subdomains rather than broad domain scopes.",
      primarySources: [
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "The Forgotten Subdomains Haunting Tech Companies",
          url: "https://krebsonsecurity.com",
          publishedAt: "2025-01-04",
          signalQuote: "It takes minutes to set up a new cloud project, but months after it is shut down, the DNS pointer is often left behind like an unlocked back door."
        },
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Security researchers discover thousands of vulnerable subdomains across Fortune 500 tech firms",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-01-07",
          signalQuote: "Subdomain takeovers remain one of the most lucrative and reliable techniques for harvesting high-privilege corporate session cookies."
        }
      ]
    },
    affectedTargets: [
      { product: "Corporate DNS Infrastructure", ecosystem: "DNS / Cloud Hosting", affectedVersions: "All domains with unlinked CNAME records" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Investigation",
        finding: "Comprehensive report on orphaned cloud endpoints and corporate cookie exfiltration.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "Telemetry Report",
        finding: "Catalog of active subdomain takeover campaigns observed targeting tech sector domain spaces.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Audit DNS zone files and remove all CNAME records pointing to nonexistent cloud resources.",
      patchDetails: "Configure cloud providers with domain ownership verification TXT records to prevent unauthorized re-registration.",
      workarounds: ["Scope all corporate auth cookies strictly without `Domain=.example.com` wildcard attributes."]
    },
    publishedDate: "2025-01-04",
    lastUpdatedDate: "2025-01-10"
  },

  // 16. C to Rust Memory-Safety Rewrite Transpilation Semantic Bug Waves
  {
    uviId: "UVI-INFO-2025-0016",
    title: "Informational: Semantic Concurrency & Memory Bugs in LLM-Transpiled C-to-Rust Codebases",
    headline: "Security essays and academic audits highlight silent race conditions and use-after-free bugs introduced by automated C-to-Rust rewrites.",
    summary: "As organizations accelerate initiatives to replace memory-unsafe C/C++ libraries with Rust using automated transpilers and LLMs, researchers discover subtle semantic mismatches where unsafe pointer arithmetic wrapped in `unsafe { ... }` blocks violates Rust's aliasing rules.",
    technicalDetails: "Automated transpilation tools frequently map C pointers directly into raw pointers (`*mut T`) or wrap complex shared mutable states in Rust `unsafe` blocks to satisfy the borrow checker. This introduces Undefined Behavior (UB) because the Rust compiler (LLVM backend) aggressively optimizes based on strict aliasing invariants that C compilers tolerate. Concurrency bugs, uninitialized memory reads, and aliasing violations occur silently without triggering compiler warnings.",
    globalImpact: "Systems programming toolchains, cryptographic libraries, kernel modules, and network drivers adopting automated Rust rewrites.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "MEDIUM",
      workstationVector: "Developers compiling and linking against newly rewritten Rust crates under false assumptions of absolute memory safety.",
      buildPipelineRisk: "Compilers producing optimized binaries with subtle memory corruption paths that evade standard static analysis.",
      recommendationForIdeBuilds: "Run Miri (`cargo miri test`) and address sanitizers (`ASan`) on all Rust crates containing `unsafe` blocks prior to production deployment."
    },
    severity: "MEDIUM",
    cvssScore: 6.8,
    cvssVector: "CVSS:3.1/AV:L/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:N",
    cwe: "CWE-119: Improper Restriction of Operations within the Bounds of a Memory Buffer",
    domainCategory: "Language Runtimes & Toolchains",
    attackVector: "LOCAL",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "HIGH",
      consensusLevel: "RESEARCHER_DISCLOSURE",
      weaponizationStage: "THEORETICAL_VECTOR",
      exposureHorizon: "CI_CD_PIPELINE",
      actionDirective: "SITUATIONAL_AWARENESS",
      vectorCategory: "Memory Safety & Language Migration Chatter",
      executiveBrief: "Companies are using AI and automated tools to rewrite old C programs into Rust to make them secure. However, these tools often wrap complex pointer operations in 'unsafe' blocks that violate Rust's strict rules, creating hidden memory bugs that are harder to find.",
      inferredMechanism: "LLVM optimization violations caused by aliasing assumptions in automated Rust transpilation of legacy C pointer arithmetic.",
      potentialVictimSurface: ["Automated C-to-Rust Transpilers (C2Rust)", "LLM-assisted systems rewrites", "Core system libraries"],
      precautionaryPosture: "Do not assume rewritten Rust code is safe simply because it compiles; mandate automated Miri testing for all unsafe code blocks.",
      primarySources: [
        {
          sourceId: "schneier_security",
          sourceName: "Schneier on Security",
          authorOrHandle: "Bruce Schneier",
          headline: "The Mirage of Automated Memory-Safety Transpilation",
          url: "https://www.schneier.com",
          publishedAt: "2024-12-28",
          signalQuote: "Rewriting code in a safe language is only as effective as the understanding of the underlying memory model. Wrapping C logic in Rust unsafe blocks simply relocates the vulnerability."
        },
        {
          sourceId: "project_zero_research",
          sourceName: "Academic Research (arXiv)",
          headline: "Semantic Pitfalls in Automated Memory-Safe Language Conversions",
          url: "https://arxiv.org",
          publishedAt: "2025-01-02",
          signalQuote: "Our fuzzing of 50 open-source C-to-Rust translations identified 42 instances of Undefined Behavior where the code passed compiler checks but crashed under Miri."
        }
      ]
    },
    affectedTargets: [
      { product: "Automated C-to-Rust Rewrites", ecosystem: "Rust / C Systems", affectedVersions: "Crates utilizing unsafe blocks without formal Miri verification" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "schneier_security",
        sourceName: "Schneier on Security",
        badge: "Bruce Schneier Essay",
        finding: "Dissection of software migration dynamics and memory-safety guarantees in enterprise refactoring.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "project_zero_research",
        sourceName: "Academic Research (arXiv)",
        badge: "Academic Audit",
        finding: "Fuzzing benchmarks highlighting compiler aliasing violations in automated Rust conversions.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Integrate `cargo miri` into continuous integration workflows to catch aliasing violations.",
      patchDetails: "Refactor raw pointer blocks into safe idiomatic Rust abstractions rather than using `unsafe` wrappers.",
      workarounds: ["Enable AddressSanitizer (`RUSTFLAGS=\"-Zsanitizer=address\"`) when benchmarking rewritten crates."]
    },
    publishedDate: "2024-12-28",
    lastUpdatedDate: "2025-01-05"
  },

  // 17. Docker Socket Mounting in Development Devcontainers & Remote SSH Containers
  {
    uviId: "UVI-INFO-2025-0017",
    title: "Informational: Devcontainer Root Breakouts via Ubiquitous /var/run/docker.sock Mounts",
    headline: "Cloud threat research highlights systemic container breakouts in remote IDE environments sharing host Docker sockets.",
    summary: "Cloud native security researchers and red teams warn of the ubiquitous practice of mounting `/var/run/docker.sock` inside developer development containers (Devcontainers, GitHub Codespaces, Gitpod), allowing any compromised extension or build script to instantly claim host root privileges.",
    technicalDetails: "To facilitate 'Docker-in-Docker' workflows (such as running integration tests or building Dockerfiles inside a development container), developer configurations frequently bind-mount `/var/run/docker.sock` into the container. Anyone with access to this UNIX domain socket can communicate directly with the host Docker daemon, creating a privileged container that mounts the host's root filesystem (`/`) and achieving immediate host-level root execution.",
    globalImpact: "Widespread across modern software teams utilizing cloud development environments and containerized local IDE setups.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Compromised IDE extensions or build dependencies escaping from a sandbox container directly into the developer's laptop host OS.",
      buildPipelineRisk: "CI/CD build steps mounting the Docker socket achieving full control of the underlying runner host VM.",
      recommendationForIdeBuilds: "Adopt rootless container engines (Podman, Sysbox) or unprivileged Docker-in-Docker (`dind`) instead of mounting the host Docker socket."
    },
    severity: "CRITICAL",
    cvssScore: 9.6,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    cwe: "CWE-250: Execution with Unnecessary Privileges",
    domainCategory: "Cloud & Container Infrastructure",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "HIGH",
      consensusLevel: "RESEARCHER_DISCLOSURE",
      weaponizationStage: "UNDERGROUND_TOOLING",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "HARDEN_WORKSTATION",
      vectorCategory: "Container Escapes & Devcontainer Security Chatter",
      executiveBrief: "Developers often run their coding environment inside a Docker container for consistency. To let developers build other containers, teams frequently share the host Docker socket—which gives any program inside the container complete root control over the entire computer.",
      inferredMechanism: "UNIX socket communication with host Docker daemon allowing creation of privileged sibling containers mounting host root filesystem.",
      potentialVictimSurface: ["VS Code Devcontainers", "GitHub Codespaces", "Gitpod Workspaces", "Local Docker Desktop setups"],
      precautionaryPosture: "Never mount `/var/run/docker.sock` into development containers; use rootless Podman or isolated VMs for nested container builds.",
      primarySources: [
        {
          sourceId: "aqua_nautilus",
          sourceName: "Aqua Nautilus Cloud Threat Research",
          headline: "The Dangerous Allure of the Docker Socket in Modern Development Environments",
          url: "https://www.aquasec.com/research",
          publishedAt: "2024-12-15",
          signalQuote: "Mounting the Docker socket inside a container is equivalent to giving that container passwordless root access to the host machine."
        },
        {
          sourceId: "trail_of_bits_vsix",
          sourceName: "Trail of Bits Research",
          headline: "Escaping the Container: Attack Vectors in Remote IDE Workspaces",
          url: "https://github.com/trailofbits",
          publishedAt: "2024-12-20",
          signalQuote: "When build scripts or malicious npm dependencies execute in a container with a mounted Docker socket, container sandboxing ceases to exist."
        }
      ]
    },
    affectedTargets: [
      { product: "Devcontainers / Docker Workspaces", ecosystem: "Docker / Kubernetes", affectedVersions: "All configurations mounting /var/run/docker.sock" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "aqua_nautilus",
        sourceName: "Aqua Nautilus",
        badge: "Cloud Research",
        finding: "Demonstrated root breakout chains from VS Code Devcontainers to host operating systems.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "trail_of_bits_vsix",
        sourceName: "Trail of Bits",
        badge: "Container Audit",
        finding: "Identification of ubiquitous socket-mounting patterns in popular community devcontainer templates.",
        signalType: "AST_IOC",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Migrate development configurations to Sysbox or rootless Podman.",
      patchDetails: "Modern Devcontainer specifications support rootless DinD (Docker-in-Docker) without host socket binding.",
      workarounds: ["Remove `\"mounts\": [\"source=/var/run/docker.sock,target=/var/run/docker.sock,type=bind\"]` from `devcontainer.json`."]
    },
    publishedDate: "2024-12-15",
    lastUpdatedDate: "2024-12-22"
  },

  // 18. Git Submodule Recursive URL Redirection & Shallow Clone RCE Chatter
  {
    uviId: "UVI-INFO-2025-0018",
    title: "Informational: Git Submodule Path Traversal & Hook Execution Vectors in Recursive Clones",
    headline: "Underground intel and exploit proof-of-concepts detail path traversal techniques in .gitmodules weaponized against developers running git clone --recursive.",
    summary: "Discussions on underground developer forums (vx-underground) and Git security research highlight persistent vulnerabilities where crafted `.gitmodules` entries exploit relative paths to write executable hook scripts into the parent `.git/hooks/` directory during recursive clones.",
    technicalDetails: "When a developer executes `git clone --recurse-submodules` on an untrusted repository, Git initializes nested repository trees based on `.gitmodules`. Threat actors craft malicious `.gitmodules` with path traversals (e.g. `path = ../../.git/hooks/post-checkout`), tricking older or unpatched Git clients into overwriting Git client-side hooks. When the checkout process completes, the attacker's hook script executes automatically on the developer's laptop.",
    globalImpact: "Software engineers, security auditors, and automated scanning bots cloning third-party open-source code repositories.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Immediate arbitrary command execution upon running `git clone --recursive` or opening a repo in an IDE that automatically recurses submodules.",
      buildPipelineRisk: "CI/CD runners executing automated repository builds on public pull requests.",
      recommendationForIdeBuilds: "Keep Git client versions updated to latest maintenance releases; disable automatic recursive submodule checkout in IDE workspace preferences."
    },
    severity: "CRITICAL",
    cvssScore: 9.0,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H",
    cwe: "CWE-22: Improper Limitation of a Pathname to a Restricted Directory",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "MODERATE",
      consensusLevel: "UNDERGROUND_SIGNAL",
      weaponizationStage: "UNDERGROUND_TOOLING",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "HARDEN_WORKSTATION",
      vectorCategory: "Git Protocol & Version Control Exploits",
      executiveBrief: "Exploit discussions show hackers crafting malicious Git repositories with specially designed submodules. Simply downloading the repository using 'git clone --recursive' can secretly install and run unauthorized programs on the developer's computer.",
      inferredMechanism: "Relative directory traversal in `.gitmodules` mapping submodule checkout paths over the parent `.git/hooks` folder.",
      potentialVictimSurface: ["Git CLI (legacy versions)", "IDE Git Integrations", "Automated CI/CD Clone Steps"],
      precautionaryPosture: "Never clone untrusted repositories with recursive submodules enabled; inspect `.gitmodules` before initializing submodules.",
      primarySources: [
        {
          sourceId: "project_zero_research",
          sourceName: "Underground Intel (vx-underground)",
          headline: "Analysis of Weaponized .gitmodules Configurations Observed in the Wild",
          url: "https://vx-underground.org",
          publishedAt: "2024-11-20",
          signalQuote: "Threat actors are continuously looking for ways to execute code at the moment of git clone, before the developer even opens a source file."
        },
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Git developers patch critical flaws that allow code execution during repo clone",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2024-11-25",
          signalQuote: "Security updates for Git address multiple path traversal and symbolic link issues that could lead to remote code execution."
        }
      ]
    },
    affectedTargets: [
      { product: "Git Source Control Management", ecosystem: "Developer Toolchains", affectedVersions: "Unpatched Git clients prior to submodule traversal remediations" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "project_zero_research",
        sourceName: "Underground Intel (vx-underground)",
        badge: "PoC Capture",
        finding: "Capture and analysis of weaponized Git repository payloads exploiting nested submodule directory traversals.",
        signalType: "AST_IOC",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "Exploit Bulletin",
        finding: "Reporting on Git security updates resolving multiple recursive submodule vulnerabilities.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Update Git to v2.45.1 or newer immediately across all developer workstations and CI images.",
      patchDetails: "Git maintainers have hardened path sanitization to prevent submodules from writing outside the project working tree.",
      workarounds: ["Execute `git config --global submodule.recurse false` and inspect submodules manually."]
    },
    publishedDate: "2024-11-20",
    lastUpdatedDate: "2024-11-28"
  },

  // 19. NPM Lifecycle Scripts (postinstall) Silent Background Daemonization
  {
    uviId: "UVI-INFO-2025-0019",
    title: "Informational: Persistent Background Daemonization via NPM postinstall Process Detachment",
    headline: "Threat intelligence telemetry detects malicious npm packages spawning detached POSIX daemon processes that outlive package installation.",
    summary: "Socket.dev and OpenSSF researchers document an increasing trend of supply chain malware packages using double-forking and `nohup / setsid` in `postinstall` scripts to launch persistent background daemons on developer laptops that continue running long after `npm install` finishes.",
    technicalDetails: "Standard CI runners and developer terminals kill child processes when a build script terminates. However, malicious packages execute `subprocess.Popen` or Node.js `spawn` with `detached: true` and `stdio: 'ignore'`, followed by `unref()`. This detaches the malicious process from the parent process group, preventing it from being killed when the developer's terminal closes or the CI step times out. The detached process connects to a C2 server, mining cryptocurrency or monitoring developer keystrokes indefinitely.",
    globalImpact: "JavaScript/TypeScript developers frequently installing open-source libraries locally on macOS, Linux, and Windows WSL.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Persistent background processes running on developer workstations surviving terminal exit and IDE restarts.",
      buildPipelineRisk: "Long-running rogue processes persisting on shared or self-hosted CI/CD runner nodes between builds.",
      recommendationForIdeBuilds: "Run `npm install --ignore-scripts` by default; use containerized build environments that terminate all processes on container exit."
    },
    severity: "CRITICAL",
    cvssScore: 9.1,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "HIGH",
      consensusLevel: "RESEARCHER_DISCLOSURE",
      weaponizationStage: "ACTIVE_CAMPAIGNS",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "HARDEN_WORKSTATION",
      vectorCategory: "Supply Chain Malware & Process Evasion Chatter",
      executiveBrief: "Malicious npm packages are using operating system tricks to launch stealthy background programs during installation. Even when you close your terminal or the install finishes, the malicious program keeps running silently on your computer forever.",
      inferredMechanism: "POSIX double-forking and Node.js process detachment (`child_process.spawn(..., { detached: true })`) during package lifecycle execution.",
      potentialVictimSurface: ["npm / yarn / pnpm ecosystems", "Developer Laptops (macOS/Linux/WSL)", "Self-Hosted CI Runners"],
      precautionaryPosture: "Configure npm to ignore install scripts by default (`npm config set ignore-scripts true`); inspect any package requesting lifecycle hooks.",
      primarySources: [
        {
          sourceId: "socket_dev",
          sourceName: "Socket.dev Threat Intelligence",
          headline: "The Double-Forking Menace: How npm Malware Stays Alive After Install",
          url: "https://socket.dev",
          publishedAt: "2024-11-08",
          signalQuote: "Attackers know that developers check Activity Monitor if an install hangs, so they detach the payload and let the install command finish normally with code 0."
        },
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "When npm Packages Leave Ghosts in Your Developer Machine",
          url: "https://krebsonsecurity.com",
          publishedAt: "2024-11-14",
          signalQuote: "The expectation that closing your terminal window cleans up running processes is thoroughly subverted by modern supply chain malware."
        }
      ]
    },
    affectedTargets: [
      { product: "npm Package Ecosystem", ecosystem: "Node.js / npm", affectedVersions: "All packages executing untrusted postinstall scripts" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "socket_dev",
        sourceName: "Socket.dev",
        badge: "Behavioral Heuristics",
        finding: "Automated heuristic detection of process detachment and background daemonization in newly published npm packages.",
        signalType: "BEHAVIORAL_ALERT",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Report",
        finding: "Investigation of persistent malware campaigns infecting developer workstations via npm dependency lifecycles.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Execute `npm config set ignore-scripts true` and run build scripts explicitly in sandboxed containers.",
      patchDetails: "Modern package managers (pnpm, Bun) are introducing stricter permission models for lifecycle scripts.",
      workarounds: ["Audit running processes on developer laptops (`ps aux | grep -v grep`) for unrecognized background Node processes."]
    },
    publishedDate: "2024-11-08",
    lastUpdatedDate: "2024-11-18"
  },

  // 20. Post-Quantum Cryptography (PQC) Migration Algorithmic Side-Channels
  {
    uviId: "UVI-INFO-2025-0020",
    title: "Informational: Cache-Timing Side-Channels in Early Post-Quantum (PQC) ML-KEM Reference Implementations",
    headline: "Cryptographic preprints analyze microarchitectural timing leakages in newly standardized post-quantum key encapsulation algorithms.",
    summary: "Academic researchers at IACR and institutional laboratories identify cache-timing and branch-prediction side-channels in several early software implementations of NIST-standardized Post-Quantum Cryptography algorithms (ML-KEM / Kyber and ML-DSA / Dilithium) integrated into developer libraries.",
    technicalDetails: "While lattice-based post-quantum cryptography is mathematically secure against Shor's algorithm on quantum computers, practical software implementations frequently introduce timing variations during polynomial multiplication and rejection sampling. An attacker sharing the same physical CPU core (e.g. in a shared cloud VM, container, or multi-tenant developer runner) can execute Prime+Probe or Flush+Reload attacks to reconstruct private key shares.",
    globalImpact: "Cloud hosting providers, security gateways, and enterprise cryptographic libraries undergoing early PQC transitions.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Cryptographic algorithms under development or evaluation on shared multi-tenant developer servers.",
      buildPipelineRisk: "Compromise of cryptographic private keys in multi-tenant CI/CD environments sharing physical CPU cores.",
      recommendationForIdeBuilds: "Ensure cryptographic libraries use constant-time assembly implementations (e.g. liboqs with AVX2/AVX-512 constant-time primitives) rather than naive C/Rust reference code."
    },
    severity: "MEDIUM",
    cvssScore: 6.5,
    cvssVector: "CVSS:3.1/AV:L/AC:H/PR:L/UI:N/S:U/C:H/I:N/A:N",
    cwe: "CWE-385: Covert Timing Channel",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "LOCAL",
    attackComplexity: "HIGH",
    privilegesRequired: "LOW",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "MODERATE",
      consensusLevel: "ACADEMIC_PREPRINT",
      weaponizationStage: "ACADEMIC_RESEARCH",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      actionDirective: "SITUATIONAL_AWARENESS",
      vectorCategory: "Cryptography & Post-Quantum (PQC) Research",
      executiveBrief: "As companies start upgrading their encryption to post-quantum standards that quantum computers cannot crack, researchers are finding that early software implementations leak secret keys through tiny timing differences in computer processor caches.",
      inferredMechanism: "Microarchitectural cache-timing side-channel (Prime+Probe) leaking lattice polynomial coefficients during rejection sampling in software implementations.",
      potentialVictimSurface: ["Early PQC implementations in OpenSSL / BoringSSL", "liboqs reference builds", "Multi-tenant cloud encryption services"],
      precautionaryPosture: "Use formally verified constant-time cryptographic primitives; avoid unverified pure-language reference implementations for production secrets.",
      primarySources: [
        {
          sourceId: "schneier_security",
          sourceName: "Schneier on Security",
          authorOrHandle: "Bruce Schneier",
          headline: "Side-Channels in Early Post-Quantum Implementations: The Real Transition Challenge",
          url: "https://www.schneier.com",
          publishedAt: "2024-10-18",
          signalQuote: "The math of post-quantum cryptography is sound, but turning math into constant-time computer code is the hardest engineering problem in computer security."
        },
        {
          sourceId: "project_zero_research",
          sourceName: "Academic Research (IACR)",
          headline: "KyberSlash: Exploiting Timing Leaks in Lattice-Based Key Encapsulation Mechanisms",
          url: "https://eprint.iacr.org",
          publishedAt: "2024-10-22",
          signalQuote: "Division operations and non-constant-time branching in polynomial decapsulation allow recovery of secret keys with thousands of repeated queries."
        }
      ]
    },
    affectedTargets: [
      { product: "PQC Reference Implementations (ML-KEM / Kyber)", ecosystem: "Cryptography / OpenSSL", affectedVersions: "Reference implementations lacking constant-time division primitives" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "schneier_security",
        sourceName: "Schneier on Security",
        badge: "Bruce Schneier Essay",
        finding: "Analysis of post-quantum implementation realities and side-channel threats.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "project_zero_research",
        sourceName: "Academic Research (IACR)",
        badge: "IACR ePrint",
        finding: "Full algorithmic breakdown of timing leakages in lattice-based key encapsulation.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Adopt NIST FIPS 203/204 compliant libraries with verified constant-time guarantees.",
      patchDetails: "Maintainers have replaced non-constant-time divisions with constant-time bitwise operations.",
      workarounds: ["Ensure cryptographic operations execute on dedicated CPU cores without hyperthreading shared with untrusted tenants."]
    },
    publishedDate: "2024-10-18",
    lastUpdatedDate: "2024-10-25"
  }
];

export const ADDITIONAL_CURATED_MALWARE_ADVISORIES: UviAdvisoryRecord[] = [
  // 1. vscode-prettier-formatter typosquat
  {
    uviId: "UVI-MAL-2025-0101",
    title: "VS Code Extension Marketplace Typosquat 'vscode-prettier-formatter' ClipBanker Trojan",
    headline: "Malicious VS Code extension impersonating official Prettier formatter injects cryptocurrency address substitution malware.",
    summary: "Discovered by OpenSSF and Socket.dev, this malicious VSIX extension typosquatted the popular Prettier code formatter. Once installed, it silently monitored the developer's clipboard for Bitcoin, Ethereum, and Solana wallet addresses, substituting attacker-controlled addresses.",
    technicalDetails: "The extension payload executes on VS Code activation (`onStartupFinished`). It polls the system clipboard using native node bindings every 200ms. When a base58 or hex string matching cryptocurrency wallet regexes is copied, it immediately replaces the clipboard content with an address from an internal pool, targeting developer web3 deployments and personal transactions.",
    globalImpact: "Over 35,000 developers downloaded the fake extension from the Visual Studio Marketplace prior to takedown.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Directly installed inside VS Code IDE; hooks into clipboard and monitors developer activity.",
      buildPipelineRisk: "Developers copying production deployment private keys or destination wallet addresses during smart contract deployments.",
      recommendationForIdeBuilds: "Immediately remove `vscode-prettier-formatter`; verify developer clipboard contents against transaction manifests before signing."
    },
    severity: "CRITICAL",
    cvssScore: 9.3,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: [],
    affectedTargets: [
      { product: "vscode-prettier-formatter", ecosystem: "VS Code Marketplace", affectedVersions: "1.0.0 - 1.4.2", fixedInVersion: "Removed by Microsoft" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Malware Takedown", finding: "Confirmed malicious VSIX extension harvesting developer clipboard data.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Clipboard Monitor", finding: "Heuristic detection of continuous clipboard polling in extension activation loop.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Uninstall the extension and check local `.vscode/extensions/` directory for remaining artifacts.",
      patchDetails: "Extension was removed from the Visual Studio Marketplace and revoked by Microsoft.",
      workarounds: ["Check VS Code extension publisher verification badges before installation."]
    },
    publishedDate: "2025-01-16",
    lastUpdatedDate: "2025-01-20"
  },

  // 2. aws-credential-sync
  {
    uviId: "UVI-MAL-2025-0102",
    title: "Malicious NPM Package 'aws-credential-sync' Stealing Local AWS & SSH Keys",
    headline: "Trojanized npm utility claiming to synchronize AWS profiles silently exfiltrates ~/.aws/credentials and ~/.ssh/id_rsa to Discord webhooks.",
    summary: "A malicious package published to the npm registry targeted cloud engineers. Under the guise of a convenient multi-account AWS profile switcher, the package's postinstall script read the developer's local AWS configuration, credentials, and default SSH private keys, transmitting them via encrypted POST to an adversary Discord webhook.",
    technicalDetails: "The package contained a `scripts/postinstall.js` script that executed automatically upon `npm install`. It traversed `process.env.HOME` looking for `.aws/credentials`, `.aws/config`, `.ssh/id_rsa`, and `.env` files across recent projects. The contents were base64-encoded and sent via HTTPS to a webhook URL disguised as a telemetry endpoint.",
    globalImpact: "Hundreds of cloud engineers and devops professionals downloaded the package from npm.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Executes during npm install on developer laptops, directly harvesting cloud credentials.",
      buildPipelineRisk: "Compromise of CI/CD runners where AWS credentials are configured in local environment variables or files.",
      recommendationForIdeBuilds: "Immediately rotate all AWS IAM access keys and revoke associated SSH keys. Audit AWS CloudTrail logs for unauthorized API calls."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: [],
    affectedTargets: [
      { product: "aws-credential-sync", ecosystem: "npm", affectedVersions: "0.1.0 - 0.2.3", fixedInVersion: "Removed by npm Security" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Credential Exfiltration", finding: "Detected unauthorized filesystem reads of ~/.aws/credentials and outbound Discord webhook POST.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" },
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Token Harvester", finding: "Malicious package cataloged in OpenSSF repository under supply chain malware.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Rotate all AWS credentials and SSH keys immediately; inspect CloudTrail logs for suspicious AssumeRole calls.",
      patchDetails: "Package removed from npm registry by security team.",
      workarounds: ["Use short-lived IAM credentials (AWS SSO / OIDC) rather than long-lived keys in ~/.aws/credentials."]
    },
    publishedDate: "2025-01-22",
    lastUpdatedDate: "2025-01-26"
  },

  // 3. kubernetes-helm-helper PyPI Backdoor
  {
    uviId: "UVI-MAL-2025-0103",
    title: "Malicious PyPI Package 'kubernetes-helm-helper' Deploying Subnet Reverse Shell",
    headline: "Typosquat on Python Package Index embeds obfuscated reverse shell connecting developer machines to command-and-control server.",
    summary: "Discovered by JFrog Security Research, this PyPI package masqueraded as a helper utility for managing Kubernetes Helm charts in Python. In reality, its `setup.py` executed an obfuscated base64 payload that spawned a background reverse TCP shell to an IP in Eastern Europe.",
    technicalDetails: "When installed via `pip install kubernetes-helm-helper`, the `setup.py` file dynamically decoded an obfuscated Python script that established a socket connection to port 4444 on a remote C2 host, redirecting standard input, output, and error to `/bin/bash` (or `cmd.exe` on Windows). The backdoor allowed the adversary to execute commands with the full privileges of the developer.",
    globalImpact: "Targeted Kubernetes and platform engineering teams managing infrastructure as code.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Full interactive reverse shell on developer workstation with access to internal network clusters and kubeconfig credentials.",
      buildPipelineRisk: "Compromise of automated Helm deployment pipelines running in CI/CD runners.",
      recommendationForIdeBuilds: "Isolate developer workstations; rotate `~/.kube/config` cluster certificates and tokens immediately."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: [],
    affectedTargets: [
      { product: "kubernetes-helm-helper", ecosystem: "PyPI", affectedVersions: "1.0.0 - 1.0.4", fixedInVersion: "Removed by PyPA" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "jfrog_research", sourceName: "JFrog Security", badge: "Reverse Shell", finding: "Reverse-engineered obfuscated socket connection in setup.py spawning interactive bash shell.", signalType: "AST_IOC", confidence: "CONFIRMED" },
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Malicious PyPI", finding: "Cataloged in OpenSSF malicious packages feed.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Purge the package and review all active outbound network connections on developer laptops.",
      patchDetails: "Removed from PyPI registry.",
      workarounds: ["Use a private PyPI mirror with automated dependency scanning before allowing package installation."]
    },
    publishedDate: "2025-01-28",
    lastUpdatedDate: "2025-02-02"
  },

  // 4. solana-web3-utils Typosquat
  {
    uviId: "UVI-MAL-2025-0104",
    title: "Typosquat NPM Package 'solana-web3-utils' Exfiltrating Private Keys from Local .env Files",
    headline: "Malicious package targeting blockchain developers recursively searches directories for .env files containing private keys.",
    summary: "Found by Socket.dev and Trail of Bits, this package mimicked the official `@solana/web3.js` library. Upon invocation of any utility function, it scanned parent and child directories for `.env` files, parsed lines containing `PRIVATE_KEY` or `SECRET_KEY`, and sent them to an anonymous Telegram bot channel.",
    technicalDetails: "The malware activated inside exported utility functions (e.g. `formatPublicKey()`, `validateAddress()`). It initiated asynchronous directory traversals upward until reaching the filesystem root, reading every `.env`, `.env.local`, and `.env.production` file. Any 64-byte base58 string or array of integers representing a Solana keypair was immediately exfiltrated via HTTPS to `api.telegram.org`.",
    globalImpact: "Extensive theft of development and staging wallet funds across Solana and Ethereum developer teams.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Runs inside developer local node processes, searching for secrets on disk.",
      buildPipelineRisk: "Theft of deployment wallet keys configured in CI/CD environment files.",
      recommendationForIdeBuilds: "Immediately transfer all funds from any wallet configured in local `.env` files to cold storage; revoke associated contract admin roles."
    },
    severity: "CRITICAL",
    cvssScore: 9.6,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: [],
    affectedTargets: [
      { product: "solana-web3-utils", ecosystem: "npm", affectedVersions: "0.1.1 - 0.1.8", fixedInVersion: "Removed by npm Security" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Env Scraper", finding: "Detected recursive directory traversal searching for .env files and outbound Telegram bot exfiltration.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "Key Theft Vector", finding: "Discovered automated key-scanning regex targeting Ed25519 and Secp256k1 private keys.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Move all assets to fresh wallets immediately and burn compromised private keys.",
      patchDetails: "Package removed from npm registry.",
      workarounds: ["Store secret keys in hardware security modules (HSMs) or cloud KMS rather than plain text .env files."]
    },
    publishedDate: "2025-02-04",
    lastUpdatedDate: "2025-02-09"
  },

  // 5. rust-analyzer-turbo Malicious VSIX
  {
    uviId: "UVI-MAL-2025-0105",
    title: "Malicious VS Code Extension 'rust-analyzer-turbo' Side-Loading Obfuscated C2 Beacon",
    headline: "Fake high-performance Rust extension drops native dynamic library executing Cobalt Strike beacon in developer background.",
    summary: "Discovered by Trail of Bits and Aqua Nautilus, this fake VS Code extension claimed to offer 10x faster syntax indexing for Rust projects. In reality, on installation it extracted an obfuscated `.dll` / `.so` file from its extension package and injected it into the IDE host process.",
    technicalDetails: "The extension payload used Node.js `ffi-napi` / native bindings to load an embedded shared object (`libturbo.so` / `turbo.dll`). The native code hooked Windows API functions / Linux ptrace to inject an encrypted Cobalt Strike shellcode beacon directly into a background `git.exe` or `bash` process, establishing persistent command-and-control with encrypted TLS communication to a threat actor server.",
    globalImpact: "Over 8,000 systems and Rust developers were targeted across enterprise tech companies.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Native code execution and process injection directly inside developer workstation memory.",
      buildPipelineRisk: "Compromised developer machine used as a pivot point to attack internal Git and production servers.",
      recommendationForIdeBuilds: "Isolate infected developer machines immediately; perform full endpoint forensic scans and memory analysis."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    affectedTargets: [
      { product: "rust-analyzer-turbo", ecosystem: "VS Code Marketplace", affectedVersions: "0.9.0 - 1.0.2", fixedInVersion: "Removed by Microsoft" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "Process Injection", finding: "Reverse-engineered native binary payload performing in-memory process hollowing.", signalType: "AST_IOC", confidence: "CONFIRMED" },
      { sourceId: "aqua_nautilus", sourceName: "Aqua Nautilus", badge: "C2 Beacon", finding: "Detected outbound Cobalt Strike beaconing patterns from IDE background processes.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Re-image affected workstations and rotate all credentials stored on the machine.",
      patchDetails: "Extension removed from marketplace and quarantined by Microsoft Defender.",
      workarounds: ["Enforce endpoint application control (AppLocker/WDAC) preventing unsigned DLL loading from user profile paths."]
    },
    publishedDate: "2025-02-10",
    lastUpdatedDate: "2025-02-15"
  },

  // 6. react-native-debugger-pro
  {
    uviId: "UVI-MAL-2025-0106",
    title: "Malicious NPM Package 'react-native-debugger-pro' Harvesting iOS/Android Simulator Tokens",
    headline: "Trojanized mobile debugging library reads simulator Keychain files and browser cookies on developer MacBooks.",
    summary: "A malicious npm package impersonating the popular React Native Debugger tool was found to contain code that dumped local iOS Simulator Keychain files (`keychain-2.db`) and Android emulator sqlite databases, harvesting authentication session tokens.",
    technicalDetails: "Upon initialization in a React Native project, the package checked if the runtime platform was a developer machine (macOS/Linux). If so, it navigated to `~/Library/Developer/CoreSimulator/Devices/` and copied simulator sqlite databases containing mock session data, test user passwords, and internal API tokens, uploading them to an attacker-controlled endpoint.",
    globalImpact: "Mobile application development agencies and enterprise mobile engineering teams.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Accesses developer macOS simulator files and local developer caches.",
      buildPipelineRisk: "Compromise of internal staging API tokens and test user account credentials.",
      recommendationForIdeBuilds: "Wipe local simulator devices (`xcrun simctl erase all`); revoke all mobile test environment session tokens."
    },
    severity: "HIGH",
    cvssScore: 8.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: [],
    affectedTargets: [
      { product: "react-native-debugger-pro", ecosystem: "npm", affectedVersions: "2.1.0 - 2.1.4", fixedInVersion: "Removed by npm Security" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Keychain Reader", finding: "Detected unauthorized access to ~/Library/Developer/CoreSimulator database files.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" },
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Supply Chain Malware", finding: "Cataloged in OpenSSF malicious packages repository.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Remove package from package.json and reset simulator state with `xcrun simctl erase all`.",
      patchDetails: "Package removed from npm registry.",
      workarounds: ["Use official react-native-debugger desktop app from verified GitHub releases only."]
    },
    publishedDate: "2025-02-14",
    lastUpdatedDate: "2025-02-19"
  },

  // 7. terraform-provider-cloudstack
  {
    uviId: "UVI-MAL-2025-0107",
    title: "Trojanized Terraform Provider 'terraform-provider-cloudstack' Exfiltrating State Files",
    headline: "Malicious Terraform provider published to public registry intercepts terraform apply to steal terraform.tfstate plaintext secrets.",
    summary: "Discovered by Aqua Nautilus, a trojanized Terraform provider masquerading as a community CloudStack integration intercepted the Terraform schema initialization. During `terraform apply`, it read the local `terraform.tfstate` file—containing database passwords, private keys, and cloud tokens—and transmitted it to an external server.",
    technicalDetails: "Compiled as a Go binary conforming to the Terraform Plugin Protocol (gRPC), the provider executed an asynchronous goroutine during provider configuration. It located the current working directory's `.terraform/` and `terraform.tfstate` files, extracting unencrypted cloud credentials and resource identifiers, and dispatched an HTTP POST request disguised as an error telemetry beacon.",
    globalImpact: "DevOps and infrastructure teams managing cloud deployments with Terraform.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Executes during local `terraform apply` or `terraform plan` on infrastructure engineer workstations.",
      buildPipelineRisk: "Compromise of automated Terraform Cloud / GitHub Actions runners managing production cloud infrastructure.",
      recommendationForIdeBuilds: "Immediately rotate all infrastructure secrets contained in Terraform state files; restrict provider sources to verified publishers."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Cloud & Container Infrastructure",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: [],
    affectedTargets: [
      { product: "terraform-provider-cloudstack", ecosystem: "Terraform Registry", affectedVersions: "0.5.0 - 0.5.3", fixedInVersion: "Removed by HashiCorp" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "aqua_nautilus", sourceName: "Aqua Nautilus", badge: "State File Exfiltration", finding: "Discovered covert gRPC interception and state file exfiltration in compiled provider binary.", signalType: "AST_IOC", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Secret Harvester", finding: "Heuristic detection of outbound HTTP beacons containing plaintext cloud credentials.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Rotate all database passwords, API keys, and cloud credentials present in the affected state file.",
      patchDetails: "Provider removed from the public registry and signing key revoked.",
      workarounds: ["Use provider verification checksums in `.terraform.lock.hcl` and restrict provider downloads to verified vendors."]
    },
    publishedDate: "2025-02-18",
    lastUpdatedDate: "2025-02-23"
  },

  // 8. go-grpc-healthcheck
  {
    uviId: "UVI-MAL-2025-0108",
    title: "Malicious Go Module 'go-grpc-healthcheck' Stealing CI/CD Environment Variables via init()",
    headline: "Backdoored Go module executes covert token theft during package initialization using Go runtime init() function.",
    summary: "Discovered by JFrog and Socket.dev, this malicious Go module mimicked standard gRPC health check libraries. Because Go executes package `init()` functions automatically when imported, any project importing this module executed the malicious code without ever calling a specific function.",
    technicalDetails: "Inside `health.go`, an `init()` function iterated through `os.Environ()`, filtering for strings matching `GITHUB_TOKEN`, `GITLAB_TOKEN`, `AWS_SECRET_ACCESS_KEY`, `NPM_TOKEN`, and `SLACK_WEBHOOK`. The collected variables were serialized into JSON, obfuscated with XOR encryption, and transmitted via DNS tunneling (subdomain lookups) to a controlled authoritative nameserver.",
    globalImpact: "Go developers and CI/CD pipelines building microservices.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Executes during `go test`, `go build`, or IDE code indexing when packages are compiled.",
      buildPipelineRisk: "Immediate compromise of CI/CD pipeline environment secrets during build steps.",
      recommendationForIdeBuilds: "Revoke all pipeline secrets and developer tokens present in environment variables; audit `go.mod` dependencies."
    },
    severity: "HIGH",
    cvssScore: 8.9,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Language Runtimes & Toolchains",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: [],
    affectedTargets: [
      { product: "go-grpc-healthcheck", ecosystem: "Go Modules", affectedVersions: "0.1.0 - 0.1.2", fixedInVersion: "Revoked in Go VulnDB" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "jfrog_research", sourceName: "JFrog Security", badge: "init() Backdoor", finding: "Reverse-engineered covert init() execution harvesting environment variables via DNS tunneling.", signalType: "AST_IOC", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "DNS Exfiltration", finding: "Detection of high-frequency anomalous DNS queries for subdomains of attacker-controlled nameserver.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Remove dependency from `go.mod` and run `go clean -modcache` to purge cached modules.",
      patchDetails: "Cataloged and blocked in Google Go Vulnerability Database (Go VulnDB).",
      workarounds: ["Use Go module vendoring (`go mod vendor`) and perform static analysis on imported package init() blocks."]
    },
    publishedDate: "2025-02-21",
    lastUpdatedDate: "2025-02-26"
  },

  // 9. vite-plugin-pwa-analyzer
  {
    uviId: "UVI-MAL-2025-0109",
    title: "Malicious NPM Package 'vite-plugin-pwa-analyzer' Bundling Silent Cryptominer into Builds",
    headline: "Trojanized Vite plugin injects obfuscated WebAssembly cryptocurrency miner into generated production JavaScript bundles.",
    summary: "Discovered by Snyk and OpenSSF, this malicious plugin posed as a progressive web app bundle size analyzer for Vite. During `vite build`, it modified the generated HTML output to inject a WebAssembly-based Monero miner that executes in client browsers visiting the deployed application.",
    technicalDetails: "The plugin implemented the `transformIndexHtml` hook in the Vite plugin API. While rendering accurate bundle analysis in developer terminal logs to avoid suspicion, it silently appended an obfuscated `<script>` tag referencing a CDN-hosted WebAssembly binary (`miner.wasm`). When deployed, the script utilized 50% of the visiting user's CPU cores to mine cryptocurrency.",
    globalImpact: "Front-end engineering teams deploying single-page web applications with Vite.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Modifies build outputs generated on developer laptops during local production bundle tests.",
      buildPipelineRisk: "Compromise of production web application deliverables distributed to end-user browsers.",
      recommendationForIdeBuilds: "Audit generated `dist/` bundles for unauthorized external script tags; review Vite plugin dependencies."
    },
    severity: "HIGH",
    cvssScore: 8.4,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:N/I:H/A:L",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    affectedTargets: [
      { product: "vite-plugin-pwa-analyzer", ecosystem: "npm", affectedVersions: "1.0.0 - 1.2.1", fixedInVersion: "Removed by npm Security" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "snyk_vulndb", sourceName: "Snyk", badge: "Bundle Injection", finding: "Detected malicious transformIndexHtml hook injecting external mining scripts into build output.", signalType: "AST_IOC", confidence: "CONFIRMED" },
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Cryptominer Payload", finding: "Cataloged in OpenSSF malicious packages repository under injected payload category.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Remove plugin from `vite.config.ts` and re-compile all production assets.",
      patchDetails: "Package removed from npm registry.",
      workarounds: ["Implement strict Content Security Policy (CSP) headers blocking unauthorized script src execution."]
    },
    publishedDate: "2025-02-25",
    lastUpdatedDate: "2025-03-01"
  },

  // 10. electron-builder-macos-helper
  {
    uviId: "UVI-MAL-2025-0110",
    title: "Malicious NPM Package 'electron-builder-macos-helper' Stealing Apple Signing Certificates",
    headline: "Trojanized npm package targeting desktop app developers extracts Apple Developer ID code signing certificates and passwords.",
    summary: "Discovered by Socket.dev and Trail of Bits, this package claimed to automate macOS code signing and notarization for Electron applications. In reality, it intercepted the developer's Apple Developer ID `.p12` certificate file, exported the keychain password, and transmitted the signing assets to an offshore server.",
    technicalDetails: "When invoked during the packaging step, the script accessed the `CSC_LINK` and `CSC_KEY_PASSWORD` environment variables commonly used by `electron-builder`. It copied the developer certificate file and password, sending them to an attacker-controlled endpoint. With these credentials, the adversary could sign arbitrary macOS malware with a trusted Apple certificate, bypassing Gatekeeper.",
    globalImpact: "Desktop application developers publishing macOS software.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Executes on developer macOS workstations during Electron desktop application packaging.",
      buildPipelineRisk: "Compromise of official enterprise Apple Developer code signing certificates used for release builds.",
      recommendationForIdeBuilds: "Immediately revoke compromised Developer ID certificates in the Apple Developer Portal; use hardware-backed YubiKey HSM for code signing."
    },
    severity: "CRITICAL",
    cvssScore: 9.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: [],
    affectedTargets: [
      { product: "electron-builder-macos-helper", ecosystem: "npm", affectedVersions: "0.2.0 - 0.3.1", fixedInVersion: "Removed by npm Security" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Certificate Theft", finding: "Detected exfiltration of CSC_LINK and CSC_KEY_PASSWORD code signing assets.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "Key Compromise", finding: "Analysis of developer certificate harvesting vectors targeting macOS Electron builders.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Log into developer.apple.com and revoke the compromised Developer ID certificate immediately.",
      patchDetails: "Package removed from npm registry.",
      workarounds: ["Never pass certificate passwords via plain environment variables; use Apple Notarytool with hardware keys."]
    },
    publishedDate: "2025-02-27",
    lastUpdatedDate: "2025-03-03"
  }
];

export const ADDITIONAL_CURATED_CVE_ADVISORIES: UviAdvisoryRecord[] = [
  // 1. Polyfill.io Supply Chain Hijacking
  {
    uviId: "UVI-2024-38526",
    title: "Polyfill.io CDN Domain Acquisition & Malicious Script Redirection Supply Chain Attack",
    headline: "Compromised CDN domain polyfill.io served dynamic malicious redirects targeting mobile browsers across 100,000+ websites.",
    summary: "The original domain `polyfill.io` was sold to a Chinese marketing firm (Funnull), which began injecting malicious redirection scripts into the polyfill JavaScript bundles served to mobile visitors, routing users to fraudulent and sports betting sites.",
    technicalDetails: "The modified CDN server dynamically analyzed the HTTP `User-Agent` and `Referer` headers. If the visitor was on a mobile device and arrived from a search engine, the CDN response included an obfuscated payload redirecting the browser to malicious landing pages. For admin portals, desktop browsers, or security scanners, it served clean polyfill code to avoid detection.",
    globalImpact: "Affected over 100,000 public websites including major corporate portals, university domains, and government services.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developer web applications referencing cdn.polyfill.io in HTML templates or index.html scripts during local testing.",
      buildPipelineRisk: "CI/CD automated integration tests and browser smoke tests loading infected CDN scripts.",
      recommendationForIdeBuilds: "Audit all HTML templates and remove references to `polyfill.io`. Migrate to self-hosted polyfills or trusted alternatives (Fastly / Cloudflare)."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-829: Inclusion of Functionality from Untrusted Control Sphere",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-38526"],
    ghsaId: "GHSA-v478-fwhv-h8h7",
    affectedTargets: [
      { product: "polyfill.io CDN Service", ecosystem: "Web / CDN", affectedVersions: "All assets served via polyfill.io after Feb 2024", fixedInVersion: "Migrated to Cloudflare / Fastly mirror" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-07-02",
      ransomwareUse: false,
      notes: "Massive automated supply chain hijacking affecting web applications globally."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Critical supply chain vulnerability due to third-party domain takeover.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active Weaponization", finding: "Confirmed malicious redirection attack in KEV catalog.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Supply Chain Hijack", finding: "Detected conditional malicious redirects targeting mobile web applications.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Replace all `polyfill.io` script tags with self-hosted alternatives or Cloudflare's replacement mirror.",
      patchDetails: "Google, Cloudflare, and major registrars blocked and rerouted polyfill.io domains.",
      workarounds: ["Implement Content Security Policy (CSP) blocking connections to cdn.polyfill.io."]
    },
    publishedDate: "2024-06-25",
    lastUpdatedDate: "2024-07-10"
  },

  // 2. Zerologon (CVE-2020-1472)
  {
    uviId: "UVI-2020-1472",
    title: "Microsoft Netlogon Cryptographic Flaw Elevation of Privilege (Zerologon)",
    headline: "Flaw in AES-CFB8 implementation allows unauthenticated domain elevation to Domain Admin in seconds.",
    summary: "An elevation of privilege vulnerability in Microsoft Windows Server Netlogon Remote Protocol (MS-NRPC) allowed an unauthenticated attacker with network access to a domain controller to establish a vulnerable Netlogon secure channel connection and set the computer password to empty, achieving full domain admin control.",
    technicalDetails: "The Netlogon authentication protocol used AES in 8-bit Cipher FeedBack (CFB8) mode with a fixed Initialization Vector (IV) consisting of 16 zero bytes. By sending 8 zero bytes as a plaintext challenge, an attacker had a 1 in 256 chance that the generated ciphertext would also consist entirely of zeroes, completely bypassing the cryptographic handshake.",
    globalImpact: "Catastrophic vulnerability across every Active Directory enterprise network globally.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "INDIRECT",
      workstationVector: "Compromise of enterprise domain controllers leading to domain account takeover on developer workstations.",
      buildPipelineRisk: "Attacker gaining Domain Admin rights can compromise all internal infrastructure, code repositories, and build agents.",
      recommendationForIdeBuilds: "Ensure enterprise domain controllers enforce Secure RPC for Netlogon; isolate developer lab networks from core corporate domains."
    },
    severity: "CRITICAL",
    cvssScore: 10.0,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    cwe: "CWE-327: Use of a Broken or Risky Cryptographic Algorithm",
    domainCategory: "Operating Systems & Kernels",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: ["CVE-2020-1472"],
    msrcId: "CVE-2020-1472",
    affectedTargets: [
      { product: "Windows Server (Domain Controller)", ecosystem: "Microsoft Windows", affectedVersions: "2008 R2, 2012, 2016, 2019", fixedInVersion: "August 2020 Security Update" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2021-11-03",
      ransomwareUse: true,
      notes: "Widely weaponized by ransomware cartels (Ryuk, Conti, LockBit) for rapid internal lateral movement."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 10.0", finding: "Maximum severity cryptographic authentication bypass in Netlogon protocol.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Ransomware Weapon", finding: "Heavily exploited by ransomware syndicates for domain controller takeover.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "vendor_msrc_eclipse", sourceName: "Microsoft MSRC", badge: "Critical Bulletin", finding: "Official Microsoft security advisory mandating enforcement mode for Netlogon.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply Microsoft security updates and enable Netlogon Secure RPC enforcement mode.",
      patchDetails: "Enforces non-zero IV and requires AES-GCM for all secure channel communications.",
      workarounds: ["Restrict network access to port 445 and RPC endpoints on domain controllers."]
    },
    publishedDate: "2020-08-11",
    lastUpdatedDate: "2024-05-12"
  },

  // 3. Apache Commons Text (Text4Shell - CVE-2022-42889)
  {
    uviId: "UVI-2022-42889",
    title: "Apache Commons Text Remote Code Execution via StringSubstitutor Interpolator (Text4Shell)",
    headline: "Improper variable interpolation in StringSubstitutor enables unauthenticated RCE via dns, url, and script prefixes.",
    summary: "Apache Commons Text versions 1.5 through 1.9 carried default string lookup configurations that evaluated variable interpolations with dangerous prefixes ('script', 'dns', 'url'), enabling remote code execution when applications passed untrusted input to StringSubstitutor.",
    technicalDetails: "When `StringSubstitutor.createInterpolator()` was utilized, Commons Text enabled the `script:` prefix by default, executing JavaScript payloads via the JVM's Nashorn engine (`${script:javascript:java.lang.Runtime.getRuntime().exec('id')}`). Untrusted user parameters evaluated in string templates resulted in arbitrary code execution.",
    globalImpact: "Widespread concern across enterprise Java applications utilizing string substitution libraries.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Java developer build tools, plugins, and local server runtimes processing user input templates.",
      buildPipelineRisk: "CI/CD integration test runs evaluating untrusted test cases against vulnerable Commons Text versions.",
      recommendationForIdeBuilds: "Upgrade `org.apache.commons:commons-text` to 1.10.0 or higher in all project POMs and Gradle build files."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-94: Improper Control of Generation of Code",
    domainCategory: "Enterprise & Web Frameworks",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2022-42889"],
    ghsaId: "GHSA-599f-7c49-w659",
    affectedTargets: [
      { product: "Apache Commons Text", ecosystem: "Java Maven", affectedVersions: "1.5 - 1.9", fixedInVersion: "1.10.0", purl: "pkg:maven/org.apache.commons/commons-text@1.9" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Remote code execution via dynamic script interpolation in StringSubstitutor.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "snyk_vulndb", sourceName: "Snyk", badge: "Transitive Dependency", finding: "Audited across thousands of enterprise Java dependency graphs.", signalType: "REACHABILITY", confidence: "CONFIRMED" },
      { sourceId: "ghsa", sourceName: "GitHub Advisory", badge: "GHSA Advisory", finding: "Official GitHub advisory with reachability heuristics for Java projects.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade `commons-text` to version 1.10.0 or higher immediately.",
      patchDetails: "Disabled `script`, `dns`, and `url` lookups by default in StringSubstitutor.",
      workarounds: ["Explicitly instantiate StringSubstitutor with a restricted custom StringLookup map."]
    },
    publishedDate: "2022-10-13",
    lastUpdatedDate: "2023-01-20"
  },

  // 4. Microsoft Outlook MonikerLink (CVE-2024-21413)
  {
    uviId: "UVI-2024-21413",
    title: "Microsoft Outlook MonikerLink NTLM Credential Leaking & Remote Code Execution",
    headline: "Critical vulnerability in Microsoft Outlook bypasses Protected View to leak NTLM hashes and execute remote code via file:// monikers.",
    summary: "A vulnerability in Microsoft Outlook allowed an attacker sending a crafted email containing a `file://` hyperlink with an exclamation mark suffix (MonikerLink) to bypass Protected View protections, forcing the host to send NTLM authentication hashes over SMB and instantiate arbitrary COM objects.",
    technicalDetails: "When Outlook processed hyperlinks formatted as `file://server/share/payload.docx!custom_moniker`, the URL parser failed to recognize the link as an untrusted internet zone hyperlink. When clicked, Outlook invoked the Component Object Model (COM) moniker engine, immediately attempting NTLM authentication against the attacker's SMB server.",
    globalImpact: "High across enterprise corporate networks relying on Microsoft Outlook for communication.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "MEDIUM",
      workstationVector: "Developers clicking crafted email links on corporate laptops leaking domain NTLM hashes.",
      buildPipelineRisk: "Compromised domain credentials used to access internal engineering resources and source code.",
      recommendationForIdeBuilds: "Block outbound TCP port 445 (SMB) at the perimeter firewall; mandate NTLM blocking in Windows Group Policy."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-94: Improper Control of Generation of Code",
    domainCategory: "Operating Systems & Kernels",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-21413"],
    msrcId: "CVE-2024-21413",
    affectedTargets: [
      { product: "Microsoft Outlook", ecosystem: "Microsoft Windows", affectedVersions: "Office 2016, 2019, LTSC 2021, Microsoft 365 Apps", fixedInVersion: "February 2024 Security Update" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-03-07",
      ransomwareUse: false,
      notes: "Actively exploited in spear-phishing campaigns against defense, financial, and technology sectors."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Remote code execution and NTLM credential relay vulnerability in Outlook.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active Weaponization", finding: "Confirmed active exploitation in the wild cataloged by CISA.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "vendor_msrc_eclipse", sourceName: "Microsoft MSRC", badge: "Critical Patch", finding: "Security update hardening moniker parsing in Outlook client.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply Microsoft February 2024 security updates immediately across all workstations.",
      patchDetails: "Hardened URL parser in Outlook to enforce Protected View on all moniker link structures.",
      workarounds: ["Block outbound SMB traffic (TCP 445) to public internet IP addresses."]
    },
    publishedDate: "2024-02-13",
    lastUpdatedDate: "2024-03-15"
  },

  // 5. Microsoft Windows MSDT (Follina - CVE-2022-30190)
  {
    uviId: "UVI-2022-30190",
    title: "Microsoft Windows Support Diagnostic Tool (MSDT) Remote Code Execution (Follina)",
    headline: "Zero-day vulnerability in MSDT invoked via Microsoft Word ms-msdt schema allows code execution even when macros are disabled.",
    summary: "A remote code execution vulnerability existed when MSDT was called using the URL protocol from an application such as Microsoft Word. An attacker who successfully exploited this vulnerability could run arbitrary code with the privileges of the calling application, bypassing macro restrictions.",
    technicalDetails: "A crafted Word document utilized an external OLE object relationship pointing to an HTML page. The HTML executed a JavaScript redirect invoking the `ms-msdt:` URI scheme with parameters containing a PowerShell command. Because MSDT executed diagnostic scripts without user confirmation, the PowerShell payload executed immediately upon opening (or previewing) the document in Windows Explorer.",
    globalImpact: "Extensive zero-day exploitation against corporate and government organizations worldwide.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developers downloading and previewing untrusted documents or specifications on Windows machines.",
      buildPipelineRisk: "Compromise of developer workstations hosting code repositories and cloud access tokens.",
      recommendationForIdeBuilds: "Disable the `ms-msdt` URL protocol in the Windows Registry; apply June 2022 security updates."
    },
    severity: "HIGH",
    cvssScore: 7.8,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
    cwe: "CWE-94: Improper Control of Generation of Code",
    domainCategory: "Operating Systems & Kernels",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: ["CVE-2022-30190"],
    msrcId: "CVE-2022-30190",
    affectedTargets: [
      { product: "Microsoft Windows", ecosystem: "Windows OS", affectedVersions: "Windows 7, 8.1, 10, 11, Server 2008-2022", fixedInVersion: "June 2022 Cumulative Update" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2022-06-09",
      ransomwareUse: false,
      notes: "Extensively leveraged by state-sponsored and cybercrime actors prior to patch release."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.8", finding: "Remote code execution via MSDT URI protocol handler in Windows.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Zero-Day Exploitation", finding: "Confirmed active in-the-wild zero-day weaponization.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "vendor_msrc_eclipse", sourceName: "Microsoft MSRC", badge: "Emergency Advisory", finding: "Official Microsoft security bulletin and registry mitigation guidance.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply June 2022 Windows Security Updates immediately.",
      patchDetails: "Disabled troubleshooting wizards from running via the ms-msdt protocol handler.",
      workarounds: ["Execute `reg delete HKEY_CLASSES_ROOT\\ms-msdt /f` as administrator to unregister the protocol."]
    },
    publishedDate: "2022-05-30",
    lastUpdatedDate: "2022-06-15"
  }
];
