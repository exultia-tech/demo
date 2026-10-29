"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  HelpCircle,
  Hash,
  ListTree
} from "lucide-react";

interface FaqItem {
  id: string;
  category: "skepticism" | "product" | "deployment" | "pricing" | "ciso-reality";
  question: string;
  shortSummary: string;
  answer: string[];
}

interface OutlineSection {
  id: string;
  number: string;
  title: string;
  description: string;
  category: "skepticism" | "product" | "deployment" | "pricing" | "ciso-reality";
}

const OUTLINE_SECTIONS: OutlineSection[] = [
  {
    id: "ciso-reality",
    number: "1.0",
    title: "Autonomous Daemon Remediation vs. Alert Fatigue",
    description: "Why autonomous in-memory hotpatching replaces manual triage tickets, how the portable daemon eliminates alert fatigue, and why real-time remediation stops zero-days before change advisory boards can convene.",
    category: "ciso-reality"
  },
  {
    id: "skepticism",
    number: "2.0",
    title: "Skepticism & Operational Safety",
    description: "Direct answers to technical doubts, memory integrity, telemetry boundaries, and reproducible verification.",
    category: "skepticism"
  },
  {
    id: "product",
    number: "3.0",
    title: "Product & Architecture: The Two Core Pillars",
    description: "The Threat Feed (Vantage UVI), the 60-second autonomous self-healing Linux daemon, pre-baked offline catalog, and supporting developer tools.",
    category: "product"
  },
  {
    id: "deployment",
    number: "4.0",
    title: "Deployment & Linux Architecture",
    description: "Pre-baked offline threat catalogs (24k+ advisories), portable Linux daemon, air-gapped data diodes, and deterministic rollback.",
    category: "deployment"
  },
  {
    id: "pricing",
    number: "5.0",
    title: "Pricing, Licensing & Sovereign Tiers",
    description: "Transparent 2-tier model: Community Sovereign ($0 forever) and Enterprise Fleet ($25/node or $500/mo flat cap for 25 hosts).",
    category: "pricing"
  }
];

const FAQ_DATA: FaqItem[] = [
  // ── 1.0 AUTONOMOUS DAEMON REMEDIATION VS. ALERT FATIGUE ───────────────────────────
  {
    id: "daemon-vs-alert-forwarding",
    category: "ciso-reality",
    question: "Why deploy an autonomous in-memory daemon instead of an alerting platform that notifies our SOC team?",
    shortSummary: "Because alerting an on-call engineer at 3:14 AM does not patch a socket. The Exultia daemon applies verified in-memory trampolines in under 350ms.",
    answer: [
      "Traditional security tools excel at one thing: creating work for people who are already overwhelmed. When an advisory drops, the typical workflow is an automated scanner filing a ticket, an analyst assigning it to an infrastructure engineer, and an emergency meeting scheduled for Tuesday.",
      "The Exultia daemon does not forward alerts or request meetings. It validates whether the vulnerable binary is actually executing, inspects whether listening sockets are bound, tests the patch in an ephemeral microVM sandbox, and applies an in-memory trampoline in <350ms with zero dropped connections.",
      "The vulnerability is neutralized before an engineer's phone can even buzz on their nightstand—eliminating nocturnal fire drills while executive leadership is still busy coordinating commercial real estate to move the entire cybersecurity division down the street from the CISO's house."
    ]
  },
  {
    id: "why-engineers-prefer-daemons",
    category: "ciso-reality",
    question: "Why do systems and DevOps engineers prefer resident daemons over traditional vulnerability dashboards?",
    shortSummary: "Because solving problems at the machine level destroys alert fatigue and prevents 7:00 AM emergency triage calls.",
    answer: [
      "Vulnerability dashboards generate endless homework. Engineers spend dozens of hours every month explaining why a 'Critical 10.0' CVSS score in an unused test utility on an internal build server does not constitute an operational emergency.",
      "The Exultia daemon operates on ground truth: it only intervenes when vulnerable code paths are actively mapped in memory or bound to listening interfaces. If an issue is real, it fixes it atomically and leaves an Ed25519-signed receipt.",
      "DevOps engineers get their weekends back, while security officers get mathematical proof of remediation instead of unread PDF attachments."
    ]
  },
  {
    id: "exultia-vs-vulnerability-scanners",
    category: "ciso-reality",
    question: "What is the fundamental difference between an enterprise vulnerability scanner and the Exultia daemon?",
    shortSummary: "A scanner charges six figures to tell you your infrastructure is exposed. Exultia's resident daemon neutralizes the threat in under 60 seconds.",
    answer: [
      "An enterprise vulnerability scanner crawls your subnets, flags thousands of packages based purely on static package version strings, generates a 120-page spreadsheet, and leaves your servers completely exposed while you read it.",
      "Exultia combines the Vantage threat intelligence stream with a resident host daemon. It doesn't generate spreadsheets—it isolates the threat, verifies ABI compatibility, injects surgical in-memory trampolines, and maintains system availability.",
      "One is an alarm clock that rings indefinitely during a fire; the other is an automated fire suppression system."
    ]
  },
  {
    id: "daemon-and-package-managers",
    category: "ciso-reality",
    question: "How does the daemon hotpatch running processes without conflicting with system package managers (apt, dnf, apk)?",
    shortSummary: "In-memory trampolines patch running processes instantly. Upstream distro packages can be upgraded whenever your normal schedule allows.",
    answer: [
      "Traditional package updates overwrite binaries on disk, requiring process restarts or full host reboots. If OpenSSH or glibc has a critical zero-day, upgrading via apt or dnf drops active sessions or forces a restart.",
      "The Exultia daemon leaves disk packages untouched while applying non-destructive in-memory trampolines to running executables in <350ms. Zero active TCP sockets or child processes are terminated.",
      "When your scheduled maintenance window arrives weeks later, your standard apt, dnf, or apk command applies the vendor package cleanly—and the Exultia daemon transparently unhooks its memory trampoline upon verifying the updated binary hash."
    ]
  },
  {
    id: "soc-team-evolution",
    category: "ciso-reality",
    question: "What happens to manual alert triage workflows when the daemon handles tier-1 patching?",
    shortSummary: "Security teams shift from human alert-routers to proactive architecture, threat modeling, and adversary emulation.",
    answer: [
      "When an autonomous daemon handles rapid detection, sandbox validation, and live in-memory remediation in 60 seconds, engineers no longer need to copy CVE identifiers from security consoles into bug trackers.",
      "This eliminates the tedious triage loop and allows security teams to focus on high-impact initiatives: architectural threat modeling, zero-trust network policies, and active purple-team emulation.",
      "Human expertise is too valuable to spend copying and pasting version numbers between dashboards."
    ]
  },
  {
    id: "siem-dashboard-integration",
    category: "ciso-reality",
    question: "Can the Exultia daemon stream events to our existing SIEM and observability pipelines?",
    shortSummary: "Yes. Exultia exports structured Syslog, STIX 2.1 JSON, and Webhook payloads to Splunk, Elastic, Datadog, and Sentinel.",
    answer: [
      "Yes. The resident daemon emits real-time structured telemetry over Syslog, STIX 2.1 JSON, or encrypted webhooks.",
      "The key difference is the nature of the events: legacy agents emit 'Warning: vulnerability detected, action required,' whereas Exultia emits 'Notice: CVE-2024-6387 detected in sshd; in-memory trampoline verified and active; 0 sockets dropped; cryptographic verification ID: #9f82a1.' Security teams receive closed-loop verification logs rather than open action items."
    ]
  },
  {
    id: "compliance-checklist-theater",
    category: "ciso-reality",
    question: "How does the autonomous daemon satisfy SOC 2, ISO 27001, and Change Advisory Board requirements?",
    shortSummary: "By generating cryptographic, immutable Ed25519-signed remediation receipts for every hotpatch and state change.",
    answer: [
      "Traditional audit compliance relies on subjective spreadsheets, annual policy attestations, and hoping tickets were closed on time.",
      "Exultia provides cryptographic proof. Every self-healing intervention produces an Ed25519-signed receipt detailing pre-patch binary SHA-256 hashes, in-memory patch memory ranges, microVM sandbox results, and atomic rollback checkpoint IDs.",
      "When auditors or Change Advisory Boards review patch compliance, they receive mathematically verifiable proof that vulnerabilities were neutralized without human delay or configuration drift."
    ]
  },
  {
    id: "tooling-sprawl",
    category: "ciso-reality",
    question: "Why do so many enterprise security initiatives fail to reduce actual incident rates despite dozens of installed agents?",
    shortSummary: "Agent sprawl creates telemetry noise and CPU overhead without providing execution-level remediation.",
    answer: [
      "Most enterprise security tools are observation agents: they inspect memory or sniff packets, send telemetry to a SaaS cloud, and trigger an alert when an anomaly occurs. When twenty different agents do this simultaneously, server CPU spikes, logs overflow, and engineers experience alert blindness.",
      "Exultia was designed under a sovereign engineering philosophy: zero telemetry, zero mandatory cloud dependencies, and active local remediation. The daemon doesn't just watch code fail; it repairs execution flow in memory and keeps services online."
    ]
  },

  // ── 2.0 SKEPTICISM & OPERATIONAL SAFETY ──────────────────────────────────────
  {
    id: "vaporware-proof",
    category: "skepticism",
    question: "This looks like vaporware bullshit, how can I prove this actually works?",
    shortSummary: "Don't take our word for it. Test live interactive simulators in the Wiki and run our reproducible quick-start guides right now.",
    answer: [
      "We completely understand your skepticism. The cybersecurity market is saturated with marketing buzzwords, pitch decks, and vaporware. That is why we built reproducible proof directly into the platform so you can verify our claims directly with zero sales gatekeeping:",
      "1. Interactive Simulators on the Research Wiki: Visit the Exultia Research Wiki (/wiki?tab=simulator) right now. Every single one of the 7 defense engines includes an interactive, in-browser lab simulator. You can execute simulated in-memory hotpatching with real-time disassembly trampolines (Praxis), trigger non-destructive BAS exploitability probes (Valkyrie), query live filtered threat telemetry across 110+ registries (Vantage), and spin up chaos attack vectors (Eris).",
      "2. Executable Quick-Start Guides: In the Research Wiki (/wiki?tab=quickstart), every product features copy-pasteable CLI commands. You can download the compiled standalone binary via `curl -fsSL https://exultia.tech/api/kinetic/download?platform=linux -o praxis` and run `praxis test`. It executes a real synthetic mutation on your system, takes a pre-image SHA-256 snapshot, and verifies a deterministic atomic rollback.",
      "3. Free Community Sovereign Tier ($0 Forever): You do not need to sign a contract, talk to a salesperson, or provide a credit card. Deploy the free tier on 1 host node, pull CIS Benchmark Level 2 containers from PureOS, and query the real-time CISA KEV feed from Vantage.",
      "4. Cryptographic Attestations: Every mitigation payload and container image is signed with Cosign SLSA Level 3 provenance keys that you can inspect and verify independently using open-source tooling."
    ]
  },
  {
    id: "memory-safety",
    category: "skepticism",
    question: "Is in-memory hotpatching actually safe, or will it corrupt running kernel and process memory?",
    shortSummary: "Praxis uses deterministic trampoline redirection with atomic snapshots and immediate failsafe rollbacks.",
    answer: [
      "Praxis does not execute arbitrary runtime memory overwrites or unsafe byte patching. Every hotpatch follows a strict 4-step deterministic verification pipeline before injection:",
      "1. Static Disassembly Verification: The Kinetic engine inspects process binary offsets and verifies symbol integrity against known compiler fingerprints.",
      "2. Hermetic Trampoline Hooks: Patches are synthesized as micro-trampolines targeting solely the vulnerable logic (such as input sanitizers or query string decoders) without altering surrounding business logic.",
      "3. Pre-Flight Atomic Snapshotting: Prior to memory injection, an atomic snapshot of the process state and memory registers is committed to `/var/lib/kinetic/snapshots/`.",
      "4. Automated Health Watchdog: If the patched process encounters any signal faults (e.g. SIGSEGV or SIGABRT), the host watchdog automatically executes an atomic rollback, restoring baseline state with zero residual corruption."
    ]
  },
  {
    id: "rebranded-wrapper",
    category: "skepticism",
    question: "Is Exultia just a wrapper around generic open-source scanning tools?",
    shortSummary: "No. The closed-loop kinetic hotpatch compiler, BAS prober, and chaos range are custom-built systems engines.",
    answer: [
      "No. While Vantage aggregates public vulnerability feeds (such as NIST NVD, CISA KEV, and Linux vendor errata) alongside private feeds, the entire kinetic defense and remediation execution engine is custom proprietary systems code:",
      "• Praxis Hotpatch Engine: Synthesizes in-memory trampolines, Ansible canary plays, and hardware firewall ACLs directly. Vulnerability scanners merely report issues; Praxis actively remediates them.",
      "• Valkyrie BAS: Injects non-destructive, HMAC-signed canary handshakes to mathematically prove exploitability before remediation.",
      "• Eris Chaos Lab: Programmatically spins up isolated 5-container Docker ranges with automated 10-minute auto-destruct watchdog timers.",
      "• PureIDE: Air-gapped developer compiler with kernel-level network egress gating and automated CycloneDX SBOM cosigning.",
      "Open-source scanners only alert you to problems; Exultia is a closed-loop platform that automates live remediation and verification."
    ]
  },
  {
    id: "suspicious-pricing",
    category: "skepticism",
    question: "Why is Exultia's pricing so transparent and radically lower than legacy multi-thousand-dollar enterprise suites?",
    shortSummary: "Modern systems engineering eliminates the massive sales overhead and cloud ingestion bloat of legacy vendors.",
    answer: [
      "Traditional enterprise cybersecurity suites typically carry significant overhead from multi-tiered sales structures, enterprise commission plans, and centralized cloud ingestion architectures where customers pay high markups on storage and compute.",
      "Exultia was engineered from day one on lean, modern systems principles:",
      "1. Compiled Native Binaries: Lightweight native daemons engineered for minimal memory and CPU footprints compared to heavy Java or Electron agent runtimes.",
      "2. Zero Telemetry Cloud Costs: Because customer source code and internal operational data are never stored in our cloud, we avoid heavy multi-tenant cloud infrastructure costs and don't pass those markups to you.",
      "3. Unified Architecture: By unifying our tools into a cohesive native stack (Vantage, Praxis, Daedelus, and Axiom), we eliminate the engineering friction of maintaining fragmented product silos.",
      "You are paying directly for security engineering and vulnerability intelligence—not bloated sales overhead and vendor markups."
    ]
  },
  {
    id: "trust-new-platform",
    category: "skepticism",
    question: "Why should we trust Exultia in production over established 20-year-old enterprise security vendors?",
    shortSummary: "Exultia emphasizes local staging, cryptographic verification, and deterministic rollback over opaque global updates.",
    answer: [
      "Established legacy vendors often rely on an antiquated, high-risk security paradigm:",
      "• The Remediation Gap: Conventional monitoring detects a vulnerability and alerts your team, but leaves you exposed while waiting weeks for upstream vendor patches.",
      "• Centralized Agent Risk: Global auto-updating kernel agents introduce systemic risk across production infrastructure when updates are not staged and verified locally.",
      "• Cryptographic Integrity: Exultia operates under SLSA Level 3 provenance with signed SHA-256 HMAC attestations for every patch applied.",
      "• Local Verification: Every hotpatch can be verified locally on a dry-run host or staged canary fleet before broad deployment. If anything goes wrong, a single command restores the original binary immediately."
    ]
  },
  {
    id: "custom-logic-breakage",
    category: "skepticism",
    question: "What if a hotpatch breaks our custom proprietary application logic?",
    shortSummary: "Patches target vulnerable system entry points and argument decoders, not application business logic.",
    answer: [
      "Praxis hotpatches are surgical. They target the specific exploit trigger condition—such as sanitizing unescaped query arguments (e.g. CVE-2024-4577 in PHP-CGI) or enforcing authentication timeouts (e.g. CVE-2024-6387 in OpenSSH). They do not alter your internal business rules, database queries, or proprietary application logic.",
      "In addition, enterprise workflows support staged canary rollouts:",
      "• Stage patches across 10% of worker nodes first.",
      "• Monitor latency and HTTP status code distribution.",
      "• Commit fleet-wide only after automated verification confirms 100% application stability.",
      "If any unexpected behavior occurs, `sudo kinetic rollback --cve=...` restores the original binary immediately."
    ]
  },
  {
    id: "zero-telemetry-pull",
    category: "skepticism",
    question: "You claim 'Zero Telemetry'. How can you keep vulnerability feeds current without phoning home?",
    shortSummary: "Hosts use unidirectional static pulls via HTTPS; no private customer data ever leaves your network.",
    answer: [
      "Exultia operates on a strict Unidirectional Pull Architecture:",
      "1. Static Signed Distribution: Exultia compiles and cryptographically signs threat intelligence advisories into static JSON manifests distributed over high-speed public CDNs.",
      "2. Local Host Poll: Your daemon checks for signed updates via standard outbound HTTPS requests, identical to downloading package metadata with `apt update` or `dnf check-update`.",
      "3. Zero Exfiltration: No host identifiers, IP addresses, proprietary source code, internal network topology, or operational logs are ever sent back to Exultia.",
      "In air-gapped environments, the feed can be synchronized via internal mirrors or file transfers across data diodes with offline Cosign signature verification."
    ]
  },
  {
    id: "will-this-randomly-reboot",
    category: "skepticism",
    question: "Will this randomly reboot my production server?",
    shortSummary: "Never. The daemon is architecturally forbidden from invoking reboot or shutdown syscalls; restarts are strictly deferred to your maintenance windows.",
    answer: [
      "No. Exultia's resident daemon is architecturally forbidden from invoking `reboot`, `systemctl reboot`, `init 6`, or `shutdown` under any circumstance.",
      "• Live In-Memory Mitigations: Tier 1 hotpatches, eBPF filters, and kernel sysctls apply immediately in memory without restarting daemons or dropping TCP connections.",
      "• Package Upgrades: When a Tier 2 package update replaces binaries or libraries (e.g. glibc or kernel modules), the daemon touches standard notification flags (`/var/run/reboot-required` on Debian/Ubuntu or `needs-restarting -r` on RHEL) and logs telemetry to Prometheus.",
      "• Operator Controlled Maintenance: Actual node restarts remain 100% under your control, executed during scheduled maintenance windows or orchestrated by your cluster drain controllers (such as kured or Cluster Autoscaler)."
    ]
  },
  {
    id: "network-drop-mid-update",
    category: "skepticism",
    question: "If the network drops mid-update, is my machine bricked?",
    shortSummary: "No. Updates use two-phase transactional staging; payloads are cryptographically verified in an isolated cache before any mutation begins.",
    answer: [
      "No. Exultia operates on a strict two-phase transactional commit model:",
      "1. Download & Verify in Staging: Patch payloads and package archives are downloaded into an isolated staging buffer (`/var/cache/exultia/staging/`). They are fully validated against SLSA Level 3 Cosign Ed25519 signatures and SHA-256 pre-hashes BEFORE any system state changes occur.",
      "2. Zero-Impact Interruption: If your WAN drops at 99%, the staging payload is invalidated and discarded. The running system remains completely untouched.",
      "3. Transactional Package Safety: For OS packages, standard package manager transaction journals (`dpkg --configure -a` or `rpm/dnf` transaction rollbacks) prevent half-installed or broken states.",
      "4. Offline Fallback: The daemon has 24,388 advisories stored locally in SQLite, so offline hosts continue operating normally."
    ]
  },
  {
    id: "how-do-i-know-vulnerability-gone",
    category: "skepticism",
    question: "How do I know the vulnerability is actually gone?",
    shortSummary: "Closed-loop verification: active loopback probing, process memory inspection, and signed OpenVEX attestation receipts.",
    answer: [
      "Unlike passive scanners that only inspect file version numbers, Exultia provides active closed-loop verification:",
      "1. Dynamic Runtime Inspection: The daemon inspects active listening sockets (`ss -tulpn`), verified inode versions, process memory mappings, and live sysctl parameters to confirm that the vulnerable code path is no longer reachable.",
      "2. Synthetic Canary Probes (Valkyrie): For network daemons, an internal loopback probe transmits a safe, non-destructive synthetic test vector matching the CVE exploit signature. If the service sanitizes or rejects the vector cleanly rather than exhibiting vulnerable behavior, remediation is cryptographically confirmed.",
      "3. Cryptographic Attestation Receipts: Every successful remediation generates an Ed25519-signed verification receipt in `/var/log/exultia/attestations/` containing before/after SHA-256 checksums, kernel details, and OpenVEX `fixed` status for your compliance auditors."
    ]
  },

  // ── 2.0 PRODUCT & ARCHITECTURE: THE TWO CORE PILLARS ───────────────────────
  {
    id: "two-core-pillars",
    category: "product",
    question: "What does Exultia actually do, and what are its Two Core Pillars?",
    shortSummary: "Exultia is structured around two clear pillars: The Threat Feed (here is what's broken in the world) and The Remediator (here is what checks and fixes it).",
    answer: [
      "Instead of confusing teams with dozens of fragmented vendor tools and acronyms, Exultia solves infrastructure security through two unified, non-fragmented pillars:",
      "1. Pillar 01 • The Threat Feed (Vantage UVI): Continuously aggregates, normalizes, and cryptographically signs vulnerability intelligence across 110+ authoritative registries (24,388 global advisories + 12,993 CISA KEV records). Supports live STIX 2.1 / TAXII 2.1 and comes pre-baked as an offline catalog for zero-internet patching.",
      "2. Pillar 02 • The Self-Healing Remediator: A 60-second autonomous daemon for Linux. It continuously audits listening sockets, detects kernel sysctl drift, injects surgical in-memory trampolines with zero dropped TCP connections, snapshots system state, and rolls back if health checks fail.",
      "Other specialized tools—such as Daedelus (air-gapped workstations, distroless containers, and zero-CVE packages), Eris chaos ranges, Valkyrie BAS verification, and Axiom certification simulator—are organized into our Developer Ecosystem & Supporting Tools section for teams with full-lifecycle edge needs."
    ]
  },
  {
    id: "why-portable-daemon",
    category: "product",
    question: "Why did Exultia choose a portable daemon instead of forcing users to install a custom Linux distribution?",
    shortSummary: "Don't wipe your machines or migrate distributions. A portable daemon gives existing Linux fleets 60s self-healing immediately.",
    answer: [
      "Corporate environments already run hundreds of thousands of battle-tested Linux servers across bare metal, virtual machines, and cloud instances.",
      "Forcing an enterprise to re-image their entire bare-metal fleet or migrate distributions just to get threat remediation is an operational nightmare that takes years of Change Advisory Board meetings.",
      "By engineering Exultia as a portable, statically-compiled native daemon, any existing Linux machine becomes autonomously self-healing in 60 seconds with a single curl command or offline tarball extraction:",
      "• Zero OS Re-imaging: Works seamlessly on top of your existing package manager, kernel, and systemd service manager.",
      "• Pre-Baked Offline Intelligence: Includes the complete 24,388 UVI advisory database directly inside the archive—ready to patch Day Zero without an internet connection.",
      "• Universal Linux Support: Runs as a native systemd service with eBPF observability and cgroups sandbox isolation on both x86_64 and aarch64.",
      "In short: deploy the remediator directly onto your existing Linux infrastructure and make it self-healing in 60 seconds."
    ]
  },
  {
    id: "exultia-linux-explained",
    category: "product",
    question: "What is Exultia and how does its 60-second self-healing runtime operate?",
    shortSummary: "An autonomous Linux remediation runtime with systemd integration, eBPF telemetry, STIX 2.1 dual ingestion, and atomic rollbacks.",
    answer: [
      "Exultia is an autonomous threat remediation runtime built for Linux that leverages in-memory livepatching and atomic state checkpoints for deterministic self-healing:",
      "1. Linux Foundation & Runtime: Statically compiled native daemon with zero runtime dependencies. Operates seamlessly under systemd or container entrypoints, utilizing eBPF for real-time socket and kernel event observability.",
      "2. STIX 2.1 / TAXII 2.1 Dual Ingestion: Subscribes to two distinct channels: Vantage Upstream (primary signed system updates and global threat intel) and Corporate Local (supplemental client SIEM IoCs and network blacklists with client-local UUID tagging).",
      "3. Automated Sandbox Verification: When deep system patches arrive, Exultia clones configuration state to an isolated systemd sandbox, runs unit tests and canary verification probes, and executes live enforcement with a 120-second watchdog timer fallback.",
      "4. Corporate Integration & Stability Override: Built-in conflict resolution guarantees corporate feeds cannot break OS stability or blacklist critical update endpoints, while restricting corporate modifications strictly to network filters (nftables/iptables) and user services.",
      "5. Sovereign & Free: The Exultia Community Edition is free forever under the Sovereign Community license with zero external telemetry, no vendor lock-in, and complete air-gap readiness."
    ]
  },
  {
    id: "closed-loop-explained",
    category: "product",
    question: "How does the 60-second autonomous remediation loop operate?",
    shortSummary: "Continuous detection, active socket correlation, non-destructive verification, in-memory hotpatching, and snapshot rollbacks.",
    answer: [
      "Traditional cybersecurity separates vulnerability management into fragmented steps: a scanner finds an issue, an analyst logs a Jira ticket, a penetration tester validates it weeks later, and DevOps schedules a maintenance window.",
      "Exultia replaces this delay with an autonomous 60-second machine-speed loop:",
      "1. Ingest (<5s): Daemon checks the signed UVI threat feed (local pre-baked catalog or authenticated STIX 2.1 / TAXII 2.1 upstream).",
      "2. Correlate (<10s): Immediately correlates all 24,388 advisories against active TCP/UDP listening sockets, loaded kernel modules, and installed package binaries.",
      "3. Verify (<15s): Validates exploitability non-destructively using Valkyrie HMAC canary handshakes without weaponized payloads.",
      "4. Hotpatch (<25s): Injects surgical in-memory bytecode trampolines or reapplies hardened kernel sysctls with zero dropped TCP connections and zero service restarts.",
      "5. Protect & Watchdog (<60s): Creates an atomic rollback state checkpoint on Linux, arming a 120-second watchdog timer."
    ]
  },
  {
    id: "validate-misconfigurations",
    category: "product",
    question: "How can I test and validate that the Vantage daemon actually fixes new issues and misconfigurations?",
    shortSummary: "Intentionally drift a kernel sysctl or misconfigure a parameter; within 60 seconds Vantage detects the drift, restores baseline, and commits an audit log.",
    answer: [
      "You do not have to wait for an external attacker to verify Exultia in action. You can test and validate the autonomous loop right now in three simple steps:",
      "1. Intentionally Drift a Sysctl: Run `sudo sysctl net.ipv4.ip_forward=1` on your Linux host.",
      "2. Observe the Background Daemon: Within 60 seconds, the resident Vantage daemon detects the configuration drift against its baseline threat policies.",
      "3. Automated Self-Healing: The daemon automatically restores the secure baseline (`net.ipv4.ip_forward=0`), commits an atomic rollback snapshot, and writes an audit entry to `/var/log/exultia/remediation.log`.",
      "4. Manual Terminal Execution: If you don't want to wait for the 60-second cycle, you can run `vantage fix` or `vantage check` in your terminal at any time for an immediate sweep."
    ]
  },
  {
    id: "check-entire-uvi-catalog",
    category: "product",
    question: "Does Vantage check the entire UVI threat feed, or only recent CVEs from 2023 and 2024?",
    shortSummary: "Vantage correlates against all 24,388 advisories dating back to historical disclosures; the UI defaults to active sockets to prevent alert fatigue.",
    answer: [
      "Vantage checks the complete Unified Vulnerability Intelligence (UVI) feed, not just recent 2023 or 2024 disclosures.",
      "The database encompasses 24,388 comprehensive vulnerability advisories spanning historical disclosures through today's zero-days, combined with 12,993 CISA Known Exploited Vulnerabilities (KEV) records.",
      "Why did you see mostly recent CVEs in the interactive dashboard? By default, the UI view applies a filter that highlights vulnerabilities correlating with active listening sockets and running services on the local host to prevent alert fatigue. Running `vantage scan --all` or executing the background audit checks your entire package tree against the complete 24k+ catalog."
    ]
  },
  {
    id: "valkyrie-canary",
    category: "product",
    question: "How does Valkyrie prove exploitability without risking system downtime or denial of service?",
    shortSummary: "Valkyrie uses safe canary handshakes containing signed HMAC tokens rather than weaponized payloads.",
    answer: [
      "Traditional penetration tests fire weaponized exploits that risk buffer overflows, thread deadlocks, or unintended kernel panics.",
      "Valkyrie takes a completely different, non-destructive approach called Canary BAS (Breach & Attack Simulation):",
      "• Safe Handshakes: Valkyrie tests whether the target service accepts and processes the specific trigger condition without delivering harmful shellcode.",
      "• Cryptographic Proof: The probe injects a unique HMAC-SHA256 token. If the service returns the designated protocol response, exploitability is mathematically confirmed.",
      "• Zero Disruption: Probes run safely against active production clusters with zero service interruption and generate an immutable attestation token proving vulnerability existence."
    ]
  },
  {
    id: "eris-chaos-range",
    category: "product",
    question: "How does Eris safely emulate live exploits without risk of host escape or lateral movement?",
    shortSummary: "Ephemeral multi-container Docker Compose ranges with dropped Linux capabilities and 10m watchdog timers.",
    answer: [
      "Eris allows security teams to intentionally inoculate their environments by simulating real attacks inside tightly confined sandboxes:",
      "• Complete Kernel Isolation: Eris containers run with dropped root capabilities (`CAP_SYS_ADMIN` disabled), unprivileged user namespaces, and read-only root filesystems.",
      "• Network Air-Gapping: Sandboxes run on isolated virtual bridge interfaces with no route to your production networks or external gateways.",
      "• 10-Minute Auto-Kill Watchdog: An independent host watchdog timer forcibly terminates, unlinks, and purges all ephemeral containers after 10 minutes, preventing orphaned ranges or resource starvation."
    ]
  },
  {
    id: "pureide-airgap",
    category: "product",
    question: "What makes PureIDE fundamentally different from standard developer environments?",
    shortSummary: "PureIDE enforces kernel-level network egress sandboxing, air-gap cosigning, and automated CycloneDX SBOMs.",
    answer: [
      "Many modern development environments and editor plugins default to cloud telemetry and external integrations. Furthermore, standard compilers often make unrestricted outbound network calls during build steps, leaving workstations exposed to supply-chain vulnerabilities.",
      "PureIDE solves this at the workstation layer:",
      "• Air-Gapped Workstations: Zero telemetry is collected or transmitted. Completely functional in fully offline environments.",
      "• Egress Sandboxing: Build tasks are executed inside restricted cgroups where unauthorized network egress is blocked at the kernel boundary.",
      "• Cryptographic Attestation: Automatically generates CycloneDX SBOMs and signs built binaries with Cosign SLSA Level 3 attestations."
    ]
  },
  {
    id: "praxis-legacy-unix-posix",
    category: "product",
    question: "What is Praxis, and how does it support legacy Unix systems that need strict POSIX compliance?",
    shortSummary: "Praxis generates zero-dependency POSIX shell remediations and hardware ACLs for vintage systems. If you're still running the Unix system that managed Jurassic Park (1993), we've got you covered.",
    answer: [
      "While the Exultia daemon is the flagship autonomous remediation engine for modern Linux, many enterprise infrastructure backbones still rely on vintage, battle-hardened Unix systems—IBM AIX, Oracle Solaris, HP-UX, older BSDs, and minimal POSIX embedded boards where systemd and eBPF simply don't exist.",
      "Praxis was engineered specifically for these environments:",
      "• Pure POSIX Compliance: Emits self-contained, zero-dependency /bin/sh hardening scripts that execute cleanly under legacy Bourne shell, KornShell (ksh88/ksh93), and standard POSIX runtimes without requiring modern Python, Perl, or glibc.",
      "• Zero-Downtime Tier 1 Hotpatching: Generates surgical kernel sysctl overrides, drop-in config patches, and memory safety guards that apply without restarting critical production daemons.",
      "• Agentless Hardware Firewall ACLs: For systems too ancient or delicate to touch directly, Praxis compiles real-time network mitigation access-lists for Cisco IOS, Palo Alto EDL, Fortinet, and Juniper edge firewalls.",
      "• Jurassic Park (1993) Certified: If you happen to still be running Silicon Graphics IRIX on an SGI Crimson to operate your park's electric fences (\"It's a UNIX system! I know this!\"), Praxis ensures your legacy infrastructure stays fortified against modern threat vectors without breaking your 30-year uptime."
    ]
  },
  {
    id: "backported-security-fixes",
    category: "product",
    question: "How do you handle backported security fixes?",
    shortSummary: "Distribution-aware tracking: we correlate upstream CVEs with Debian Security Tracker, Ubuntu USN, and Red Hat RHSA build strings.",
    answer: [
      "Enterprise Linux distributions (Ubuntu, Debian, RHEL, Rocky, Alma, SUSE) rarely bump major version numbers when patching vulnerabilities. Instead, they backport security fixes into the existing package release string (e.g. `1.18.0-0ubuntu1.4` fixes a CVE that affects upstream `1.18.0`).",
      "Exultia handles backports natively through distribution-specific intelligence feeds:",
      "1. Upstream & Distro Correlation: Vantage continuously ingests and cross-references official Debian Security Trackers, Ubuntu USN (Ubuntu Security Notices), Red Hat RHSA/RHBA errata, and vendor OVAL definitions.",
      "2. Release Epoch & Revision Parsing: The daemon evaluates the exact distro release epoch, debian/ubuntu revision string, and package changelogs (`apt-cache changelog` or `rpm -q --changelog`).",
      "3. Accurate Status Assessment: If a package contains the backported patch, Vantage marks it `RESOLVED_BY_BACKPORT` and excludes it from remediation. It never attempts unnecessary or conflicting package replacements on vendor-maintained branches."
    ]
  },
  {
    id: "broken-vendor-patch-killswitch",
    category: "product",
    question: "If Canonical or RedHat ships a broken patch, how quickly can you stop it?",
    shortSummary: "Minutes. Global quarantine broadcasts propagate over our priority feed, instantly triggering admission blocks or autonomous downgrades.",
    answer: [
      "If an upstream OS maintainer or open-source registry releases a broken patch, regression, or backdoored package (such as the `xz-utils` backdoor CVE-2024-3094), Exultia provides instant mitigation:",
      "1. Global Quarantine Broadcast: Exultia publishes a signed `QUARANTINE_REVOCATION` directive to the global Vantage threat feed within minutes of discovery.",
      "2. Fleet-Wide Admission Halt: Connected daemons poll the feed and block admission or installation of that package immediately across all hosts.",
      "3. Autonomous Canary Rollback / Downgrade: If a canary host has already installed the buggy package, the daemon detects the quarantine notice and executes a clean downgrade (`apt-get install --allow-downgrades package=previous_version` or `dnf downgrade`) or unlinks the hotpatch.",
      "4. Local Operator Quarantine: Operators can also trigger local immediate halts anytime with `sudo kinetic quarantine add <package-name-or-cve>`."
    ]
  },

  // ── 3.0 DEPLOYMENT & UNIVERSAL PIPELINE ─────────────────────────────────────
  {
    id: "prebaked-offline-catalog",
    category: "deployment",
    question: "Does the OS image come with the full UVI feed pre-downloaded for offline patching?",
    shortSummary: "Yes. All 24,388 advisories and 12,993 CISA KEV records are pre-baked into the image—you can patch against the entire catalog before connecting to the internet.",
    answer: [
      "Yes. Both the Exultia OS installation media (ISO and QCOW2) and the Universal Linux pipeline archive come pre-loaded with the entire Unified Vulnerability Intelligence (UVI) catalog.",
      "• Day-Zero Air-Gap Patching: You can boot a bare-metal machine or VM in a classified facility or air-gapped data center, run `vantage fix` (or let the resident daemon run), and remediate thousands of known vulnerabilities before ever connecting an Ethernet cable or Wi-Fi antenna.",
      "• Zero Post-Install Internet Stall: Standard operating systems leave your system exposed while requiring huge package metadata downloads (`apt update`, `dnf update`, or `pkg update`) immediately after boot. Exultia ships with 100% of threat definitions, patch recipes, and kernel baseline rules pre-compiled in `/var/db/vantage/catalog/`.",
      "• Cryptographic Integrity: Every advisory is signed with Cosign SLSA Level 3 provenance keys that can be verified completely offline against Exultia's public key."
    ]
  },
  {
    id: "universal-linux-pipeline",
    category: "deployment",
    question: "Can I install the Exultia remediation pipeline on my existing Linux servers?",
    shortSummary: "Yes. The portable binary installs on Linux via a single curl command or offline tarball with zero kernel re-compiles or re-imaging.",
    answer: [
      "Yes! Exultia is engineered specifically for organizations running existing Linux server fleets across cloud, on-premises, and edge:",
      "• Portable Single-Binary Engine: Statically compiled native executable (`exultia`) with zero external runtime dependencies.",
      "• Native Service Integration: Ships with a production systemd service unit and watchdog timer for automatic supervisor management.",
      "• One-Command Install: `curl -fsSL https://get.exultia.org | sudo sh` installs the binary, registers the systemd service, and starts the 60-second autonomous remediation loop.",
      "• Air-Gapped Tarball: Download `exultia-linux-amd64.tar.gz` (58.4 MB), transfer it across your data diode, and unpack it to get the daemon and all 24,388 pre-baked UVI advisories immediately.",
      "• Zero Infrastructure Disruption: Performs threat detection, listening socket correlation, and automated in-memory/sysctl remediation on your existing Linux servers without reformatting or reinstalling."
    ]
  },
  {
    id: "tier1-tier2-deployment",
    category: "deployment",
    question: "Do I need to rebuild Linux, or can I deploy Exultia as a package or Kubernetes DaemonSet?",
    shortSummary: "No kernel rebuilding needed. Deploy via Tier 1 (portable daemon, APT/DNF/APK packages, systemd) or Tier 2 (Kubernetes Helm chart and DaemonSet).",
    answer: [
      "You do not need to rebuild Linux or replace your operating system. Rebuilding a custom distribution introduces massive operational drag, hardware driver maintenance, and compliance hurdles. Instead, Exultia ships through two streamlined deployment tiers that drop cleanly into your existing architecture:",
      "• Tier 1: Standalone Linux Hosts & VMs (Portable Daemon & Native Packages):",
      "  - One-Line Installer: `curl -sSL https://exultia.tech/install.sh | sudo sh` installs the signed, statically linked binary to `/usr/local/bin/exultia`.",
      "  - Native Package Managers: Managed repositories for Debian/Ubuntu (`apt install exultia-remediator`) and RHEL/Fedora/Rocky (`dnf install exultia-remediator`).",
      "  - Supervisor Integration: Pre-configured systemd service with a 120-second watchdog supervisor for automatic fault recovery.",
      "• Tier 2: Kubernetes Clusters (Helm Chart & DaemonSet):",
      "  - Helm 3: `helm install exultia-remediator exultia/exultia-node-shield --namespace kube-system` rolls out automated node defense cluster-wide.",
      "  - Zero-Helm Manifest: `kubectl apply -f https://exultia.tech/k8s/exultia-daemonset.yaml` for direct declarative deployment.",
      "  - Cluster Observability: Includes eBPF host/container socket monitoring, cluster-wide canary verification, and Prometheus telemetry metrics on `:9100/metrics`.",
      "• Turnkey Appliance (Secondary): For bare-metal hypervisors (QEMU/KVM/Proxmox), pre-built minimal QCOW2 and ISO images are also provided."
    ]
  },
  {
    id: "airgap-support",
    category: "deployment",
    question: "Can Exultia run in completely air-gapped, classified, or SCIF data center environments?",
    shortSummary: "Yes. All daemons, container ranges, and patch compilers run completely self-contained and offline.",
    answer: [
      "Yes. Exultia was designed from inception for sovereign, air-gapped, and defense-grade environments:",
      "• Self-Contained Binaries: The Vantage resident daemon, in-memory patch compiler, and Valkyrie prober require no continuous connection to external servers.",
      "• Pre-Baked Intelligence: Includes 24,388 advisories and 12,993 CISA KEV records directly on the local filesystem.",
      "• Data Diode Sync: When updates are needed, delta catalogs can be exported into offline signed `.bundle` packages and imported across secure data diodes.",
      "• Cosign Signature Verification: Offline bundles include cryptographic Cosign signatures that are validated locally against your organization's public key before deployment."
    ]
  },
  {
    id: "supported-os",
    category: "deployment",
    question: "Which operating systems, architectures, and container environments are supported?",
    shortSummary: "Linux (x86_64 and aarch64), bare-metal servers, virtual machines, cloud instances, Docker, and Kubernetes.",
    answer: [
      "Exultia is designed to run seamlessly across all Linux environments:",
      "• Linux Operating Systems: Full compatibility with modern Linux kernels (5.4+) across all server environments—cloud instances, on-premises bare metal, and virtual machines.",
      "• Architectures: Full native support for both x86_64 (AMD64) and aarch64 (ARM64 / AWS Graviton).",
      "• Container Platforms: Docker Engine, containerd, CRI-O, and Kubernetes (EKS, GKE, AKS, and bare-metal Talos/k3s/RKE2).",
      "• Hardened Container Recipes: Pre-hardened, CIS-benchmarked distroless container images available for immediate drop-in replacement across Node.js, Go, Python, and Rust runtimes."
    ]
  },
  {
    id: "rollback-mechanics",
    category: "deployment",
    question: "How does the deterministic rollback mechanism work on Linux?",
    shortSummary: "Atomic configuration state checkpoints and dynamic memory trampoline unlinking with zero dropped TCP connections.",
    answer: [
      "Exultia provides deterministic, non-destructive rollback mechanics designed natively for Linux systems:",
      "• In-Memory Trampoline Unlinking: When an in-memory hotpatch is applied, Exultia registers an atomic memory restore descriptor. Running `sudo exultia rollback --cve=CVE-2024-4577` immediately unlinks the hook and restores original execution flow with zero dropped connections.",
      "• State Snapshot Restores: Prior to mutating kernel sysctls or system configuration files, the daemon commits a cryptographic pre-image checkpoint in `/var/lib/exultia/snapshots/`. If health checks fail or an operator triggers a rollback, baseline state is restored in under 15ms.",
      "• Watchdog Safety Loop: Every remediation action arms a hardware and systemd watchdog timer. If post-remediation canary tests fail to ping the supervisor within 120 seconds, the daemon automatically reverts to the previous safe checkpoint.",
      "This guarantees zero-data-loss rollback without human guesswork or service downtime."
    ]
  },
  {
    id: "apt-yum-lock-held",
    category: "deployment",
    question: "What happens if another process is holding the apt/yum lock?",
    shortSummary: "Non-blocking detection: we never force-kill package locks; we yield with exponential backoff or apply Tier 1 in-memory hotpatches directly.",
    answer: [
      "The resident daemon treats package manager lockfiles (`/var/lib/dpkg/lock-frontend`, `/var/lib/apt/lists/lock`, or `/var/run/yum.pid`) with strict non-destructive deference:",
      "1. Non-Blocking Inspection: Before attempting any Tier 2 package operations, the daemon checks lock status via non-blocking `fcntl` file locks. It never issues `kill -9` against running package managers or deletes active `.lock` files.",
      "2. State Deferral & Jittered Backoff: If an administrator or unattended-upgrades holds the lock, the daemon emits status `DEFERRED_LOCK_BUSY`, logs the active holding PID to journald, and enters a randomized 30s–120s backoff.",
      "3. Lock-Free Tier 1 Execution: Crucially, Tier 1 mitigations (in-memory hotpatches, eBPF socket filters, and kernel sysctls) bypass APT and YUM entirely, securing vulnerable network daemons instantly even if the host's package manager is locked or stalled."
    ]
  },
  {
    id: "blast-radius-everywhere",
    category: "deployment",
    question: "Does this blast the update everywhere all at once?",
    shortSummary: "Never. Automated progressive multi-ring canary deployments enforce soak windows and automated rollbacks on error.",
    answer: [
      "No. Fleet-wide simultaneous updates ('big bang deployments') are an anti-pattern that violates basic infrastructure resilience. Exultia uses multi-ring progressive canary rollouts by default:",
      "• Ring 0 (Canary - 2% to 10%): Initial patch rollout is isolated to designated canary hosts. The daemon monitors service availability, HTTP error rates, and systemd journal anomalies across a 15-minute verification gate.",
      "• Ring 1 (Staging / Cautious - 25%): After Ring 0 confirms stability, the patch advances to staging nodes with a 2-hour soak period.",
      "• Ring 2 (Broad Fleet - 65% to 75%): Full rollout proceeds across the rest of the fleet only when Rings 0 and 1 pass all automated checks with zero regressions.",
      "• Automated Abort & Rollback: If canary health checks detect latency spikes or process crashes, the rollout aborts immediately and the canary hosts automatically restore their pre-remediation checkpoints."
    ]
  },
  {
    id: "configure-ring-testing-client",
    category: "deployment",
    question: "How does the customer configure ring testing from the client?",
    shortSummary: "Declarative configuration in /etc/exultia/kinetic.toml, CLI commands (kinetic ring), or Kubernetes node labels in Helm.",
    answer: [
      "Ring membership and progressive deployment stages are fully configurable from the local host, automation scripts, or Kubernetes manifests:",
      "1. Local Configuration File (`/etc/exultia/kinetic.toml`):",
      "  ```toml",
      "  [rollout]",
      "  ring = 0  # 0=Canary, 1=Staging (2h soak), 2=Broad Fleet",
      "  auto_promote = true",
      "  health_check_command = \"/usr/local/bin/app-health-check.sh\"",
      "  health_check_timeout_seconds = 60",
      "  max_journal_error_rate = 5",
      "  ```",
      "2. Client CLI Commands:",
      "  • Assign node ring: `sudo kinetic config set rollout.ring 0`",
      "  • Inspect ring status: `sudo kinetic ring status`",
      "  • Promote manually: `sudo kinetic ring promote --cve=UVI-2024-4577`",
      "3. Kubernetes Helm DaemonSet Deployment:",
      "  • Target rings dynamically via node labels: `helm install exultia exultia/exultia-node-shield --set rollout.ring=canary --set nodeSelector.\"exultia.org/ring\"=canary`",
      "4. Custom Health Check Validation: Before any canary node self-promotes to the next ring, it runs your configured validation script to ensure business logic remains 100% operational."
    ]
  },
  {
    id: "feed-sync-watchdog",
    category: "deployment",
    question: "How do we know if your vulnerability feed stops syncing?",
    shortSummary: "Prometheus metrics on :9100/metrics, journald alerts, and seamless fallback to the local pre-baked catalog.",
    answer: [
      "Exultia provides multiple redundant observability mechanisms to alert your team if threat feed synchronization fails:",
      "1. Prometheus Metrics: The daemon exports telemetry at `:9100/metrics` (or `:9090`), including `exultia_feed_last_sync_timestamp_seconds`, `exultia_feed_sync_status (1=OK, 0=FAIL)`, and `exultia_feed_records_total`.",
      "2. Standard Prometheus Alert Rule:",
      "  ```yaml",
      "  - alert: ExultiaFeedSyncStalled",
      "    expr: time() - exultia_feed_last_sync_timestamp_seconds > 7200",
      "    for: 15m",
      "    labels: { severity: warning }",
      "    annotations: { summary: 'Host has not synced threat feed in over 2 hours' }",
      "  ```",
      "3. Systemd Journal Logging: Sync failures emit structured warnings (`[WARN] UVI Feed sync failed: connection refused`) ingestible by Datadog, Splunk, or Vector.",
      "4. Zero Downtime Fallback: If your network or upstream CDN is unreachable, the daemon continues defending against its local SQLite database of 24,388 advisories without interruption."
    ]
  },

  // ── 5.0 PRICING, LICENSING & SOVEREIGN TIERS ─────────────────────────────────
  {
    id: "single-subscription",
    category: "pricing",
    question: "How does Exultia pricing work? What are the two tiers?",
    shortSummary: "A clean 2-tier architecture: Community Sovereign ($0 forever) and Enterprise Fleet ($25/node or $500/mo flat for 25 hosts).",
    answer: [
      "We eliminated fragmented, multi-tiered add-on pricing in favor of a straightforward 2-tier model designed for developers and enterprise platform engineers:",
      "1. Community Sovereign ($0 forever): Designed for individuals, researchers, and homelabs. Includes the full autonomous Linux self-healing daemon, pre-baked 24,388 offline CVE database, local in-memory hotpatching, sub-100ms atomic rollbacks, and zero outbound telemetry.",
      "2. Enterprise Fleet: Engineered for production clusters, Kubernetes fleets, and institutional compliance. Includes continuous 24/7 Vantage Priority Feed streaming, live Praxis hotpatch streaming, central multi-ring progressive canary rollouts, Cosign SLSA-3 attestation receipts, and SIEM webhooks (Splunk/Sentinel).",
      "Pricing for Enterprise Fleet is transparent and capped:",
      "• Sub-25 Hosts: $25 / node / month ($20 / node / mo billed annually)",
      "• 25-Host Fleet Cap: Flat rate of $500 / month ($6,000 billed annually, or $600/mo billed monthly) covering all 25 nodes",
      "• 25+ Scale Fleets: Base $500/mo flat cap + $15 / additional node / month ($12 / node / mo billed annually)",
      "There are no per-engine add-ons, no hidden data ingestion taxes, and no proprietary lock-in."
    ]
  },
  {
    id: "license-management",
    category: "pricing",
    question: "How does Enterprise License Management work, and what is your zero-lockout architecture?",
    shortSummary: "Offline-first Ed25519 cryptographic token at /etc/exultia/license.key with a strict zero-lockout architecture. Zero phone-home DRM, zero production halts, and 30-day soft grace periods.",
    answer: [
      "Exultia Enterprise License Management is engineered on offline-first cryptographic integrity and a strict zero-lockout architecture—zero phone-home DRM, zero production halts, and zero telemetry exfiltration:",
      "1. Offline Ed25519 Token (Cryptographic Keyfile): Lives at `/etc/exultia/license.key`. Verified entirely offline by the daemon binary using an embedded root public key in <1ms. Works in air-gapped SCIF enclaves with zero cloud dependencies and zero phone-home DRM.",
      "2. K8s & Systemd Ready (Helm Secrets & Systemd): Inject directly into Kubernetes via standard secrets (`exultia-license`) or `--set licenseKey=...` in our official Helm chart, or roll out to Linux hosts via Ansible, Puppet, Terraform, or Cloud-Init.",
      "3. Privacy-Preserving Hash (Anonymized Machine-ID): Node identity is computed as `HMAC-SHA256(machine-id, salt)`. Exultia never collects internal hostnames, private IPs, environment variables, or container payloads.",
      "4. Never-Brick Policy (Autoscale Grace Period): Autoscaling spikes (e.g. 32 nodes on a 25-node plan) or credit card renewals never disable defense or halt daemons. A 30-day soft grace period ensures 100% operational uptime while billing true-ups happen calmly. Lapsed licenses gracefully fall back to Community Sovereign mode where local UVI catalog and local hotpatching remain operational; live priority feed streaming pauses. Nothing ever crashes, bricks, or locks your servers."
    ]
  },
  {
    id: "free-community",
    category: "pricing",
    question: "What is included in the free Community Sovereign plan?",
    shortSummary: "The Community plan is free forever for security researchers, students, and open-source developers.",
    answer: [
      "The Community Sovereign tier ($0 forever) provides core defense capabilities for individual practitioners:",
      "• Exultia Portable Linux Remediator: Full autonomous self-healing daemon with systemd watchdog and 60-second remediation loop",
      "• Full offline air-gapped catalog containing 24,388 pre-baked UVI vulnerability advisories",
      "• Full public Vantage threat feed access (24,388 advisories + 12,993 CISA KEV records)",
      "• Pre-baked offline catalog for zero-internet patching out of the box",
      "• Free cybersecurity certification question bank practice modules via Axiom",
      "No credit card is required to create a community account and start exploring the platform."
    ]
  },
  {
    id: "enterprise-features",
    category: "pricing",
    question: "What extra capabilities are included in the Enterprise Fleet plan ($500/mo base)?",
    shortSummary: "Multi-cluster progressive canaries, live patch streaming, Cosign SLSA-3 receipts, SCORM/LTI LMS APIs, and priority escalation.",
    answer: [
      "The Enterprise Fleet tier ($500/mo flat for 25 hosts, or $25/node) is engineered for production clusters, universities, and mission-critical infrastructure:",
      "• Central Progressive Canary Rollouts: Phased ring progression (Ring 0 canary -> Ring 1 staging -> Full fleet) with automated rollback triggers.",
      "• Continuous 24/7 Vantage Priority Feed: Continuous live zero-day ingestion with sub-350ms autonomous hotpatch streaming.",
      "• Kubernetes DaemonSet & Helm: Enterprise packaging with automated secret mounting and node health metrics.",
      "• Institutional LMS Integration: SCORM and LTI 1.3 deep-linking API for embedding Axiom certification exams into corporate LMS systems.",
      "• Cosign SLSA Level 3 Signatures: Cryptographically sign patch manifests using your organization's private HSM / KMS keys.",
      "• Priority Engineering Escalation: Direct escalation access to senior systems security engineers for architecture and incident response."
    ]
  },
  {
    id: "sales-demo",
    category: "pricing",
    question: "Do I have to do a sales demo, steak dinner, or talk to an SDR to upgrade to Enterprise?",
    shortSummary: "Never. Scaling up requires zero 'no-obligation' steak dinners and zero booth pitches from hot blonde girls at InfoSec conventions. Pay what you want—enterprise unlocks automatically at $500/mo.",
    answer: [
      "No. Exultia does not have a bloated enterprise sales department, and we will never invite you to a 90-minute 'no-obligation' steak dinner to qualify your Q4 security budget over a lukewarm filet mignon at Ruth's Chris.",
      "Zero aggressive badge-scanning or elevator pitches from that InfoSec convention hottie hired to extract your corporate email so their SDR team can stalk your LinkedIn for six months.",
      "Our model is simple: pay what you feel like paying. If you run a homelab or small team, run the full autonomous daemon for free or pay per-node. The moment your allocation crosses 25 nodes (or $500/mo), the server automatically activates your full Enterprise Fleet entitlements via your Ed25519 token in milliseconds.",
      "If you want to evaluate the software: find the most technical person you know, send them a link to our wiki, and tell them to follow the instructions and report their results back to you."
    ]
  },
  {
    id: "downtime-liability",
    category: "pricing",
    question: "If your automation breaks my custom application, who pays for the downtime?",
    shortSummary: "Standard enterprise software terms apply; our architecture prevents downtime upfront via canary rings and instant rollbacks.",
    answer: [
      "Consistent with standard enterprise software and infrastructure practices (identical to terms from Canonical, Red Hat, Microsoft, or AWS), Exultia provides software under standard commercial terms without open-ended financial liability for consequential third-party application downtime.",
      "However, Exultia's architecture is engineered from the ground up to prevent application downtime before it can ever manifest:",
      "1. Non-Destructive Tier 1 Hotpatching: Praxis in-memory trampolines and sysctl guards specifically patch vulnerable entry-point decoders and kernel buffers without touching your proprietary business rules or internal databases.",
      "2. Ring 0 Canary Isolation: Updates are gated behind canary rings (2%–10% of hosts), ensuring any edge-case incompatibilities are caught on non-critical nodes without impacting broad production traffic.",
      "3. Sub-15ms Pre-Image Rollback: Every mutation creates an atomic snapshot in `/var/lib/exultia/snapshots/`. If canary health checks detect latency spikes or errors, the daemon automatically reverts state within 15 milliseconds.",
      "4. Hardware & Systemd Watchdogs: 120-second supervisor watchdogs guarantee autonomous rollback if an application health check fails to ping healthy status."
    ]
  },
  {
    id: "remediation-timeframe-sla",
    category: "pricing",
    question: "Do you guarantee remediation within a certain timeframe (SLA)?",
    shortSummary: "We guarantee 99.9% uptime for our Vantage Threat Feed and streaming API; we do not make reckless response-time claims before patches are formally verified.",
    answer: [
      "Exultia provides a strictly audited 99.9% availability SLA for the Vantage Threat Feed API, real-time priority distribution network, and STIX/TAXII endpoints.",
      "We deliberately do not offer reckless, unprovable '1-hour zero-day patch' marketing SLAs. Legitimate, non-destructive vulnerability remediation requires formal verification, binary safety auditing, and ABI regression testing across target distributions. Rushing unverified binary modifications into customer production kernels creates severe systemic risk.",
      "Instead, hotpatches and verified package advisories are streamed continuously to your fleet the millisecond they clear our automated verification matrix, typically within hours of public disclosure."
    ]
  },
  {
    id: "whitelabel-pipeline",
    category: "pricing",
    question: "Can I whitelabel the remediation pipeline?",
    shortSummary: "For a limited time only, you can make a one-time purchase of my entire company and call it whatever you want.",
    answer: [
      "Sure; for a limited time only, you can make a one-time purchase of my entire company and call it whatever you want."
    ]
  }
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "two-core-pillars": true,
    "why-portable-daemon": true,
    "praxis-legacy-unix-posix": true,
    "closed-loop-explained": true,
    "validate-misconfigurations": true,
    "prebaked-offline-catalog": true,
    "universal-linux-pipeline": true,
    "tier1-tier2-deployment": true,
    "daemon-vs-alert-forwarding": true,
    "why-engineers-prefer-daemons": true,
    "daemon-and-package-managers": true,
    "vaporware-proof": true,
    "memory-safety": true,
    "single-subscription": true,
    "sales-demo": true,
    "whitelabel-pipeline": true
  });

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    FAQ_DATA.forEach((item) => {
      allExpanded[item.id] = true;
    });
    setExpandedItems(allExpanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  // Grouped questions by outline section
  const sectionsWithItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return OUTLINE_SECTIONS.map((sec) => {
      const items = FAQ_DATA.filter((item) => item.category === sec.category);
      const filtered = items.filter((item) => {
        if (!query) return true;
        return (
          item.question.toLowerCase().includes(query) ||
          item.shortSummary.toLowerCase().includes(query) ||
          item.answer.some((line) => line.toLowerCase().includes(query))
        );
      });

      return {
        ...sec,
        totalItems: items.length,
        items: filtered
      };
    });
  }, [searchQuery]);

  const totalVisibleCount = useMemo(() => {
    return sectionsWithItems.reduce((acc, sec) => acc + sec.items.length, 0);
  }, [sectionsWithItems]);

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#F8FAFC" }}>
      
      {/* ── COMPACT TOP HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(10, 15, 26, 0.8)",
        backdropFilter: "blur(12px)",
        padding: "1.75rem 1.5rem"
      }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "rgba(255, 255, 255, 0.04)", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            padding: "4px 12px", 
            borderRadius: "6px", 
            marginBottom: "0.75rem",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.75rem",
            color: "#94A3B8"
          }}>
            <ListTree size={13} color="#00E5FF" />
            <span>DOCUMENTATION &bull; REFERENCE OUTLINE</span>
          </div>

          <h1 style={{ 
            fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
            fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", 
            fontWeight: 900, 
            color: "#FFFFFF", 
            letterSpacing: "-0.02em", 
            margin: 0,
            lineHeight: 1.2
          }}>
            Frequently Asked Questions
          </h1>

          <p style={{ color: "#94A3B8", fontSize: "0.95rem", maxWidth: "850px", margin: "0.4rem 0 0 0", lineHeight: 1.5 }}>
            Comprehensive technical outline covering architectural safety, autonomous hotpatching, zero-telemetry boundaries, air-gap operations, and platform subscriptions.
          </p>
        </div>
      </div>

      {/* ── MAIN TWO-COLUMN LAYOUT: TOC SIDEBAR + CONTENT AREA ─────────────────── */}
      <div style={{
        maxWidth: "1600px",
        margin: "1.5rem auto",
        padding: "0 1.5rem 6rem 1.5rem",
        display: "flex",
        gap: "1.75rem",
        alignItems: "flex-start",
        flexDirection: "row",
        position: "relative"
      }}>
        {/* LEFTHAND TABLE OF CONTENTS SIDEBAR */}
        <aside style={{
          width: "320px",
          minWidth: "300px",
          flexShrink: 0,
          position: "sticky",
          top: "80px",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          background: "rgba(10, 15, 26, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "1.25rem",
          backdropFilter: "blur(12px)"
        }}>
          {/* SEARCH INPUT */}
          <div style={{ position: "relative", width: "100%" }}>
            <Search size={15} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search FAQ outline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 32px 9px 36px",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "0.85rem",
                fontFamily: "var(--font-mono, monospace)",
                outline: "none"
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "2px"
                }}
              >
                &times;
              </button>
            )}
          </div>

          {/* TOOLBAR CONTROLS */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: "0.78rem",
            fontFamily: "var(--font-mono, monospace)"
          }}>
            <span style={{ color: "#64748B" }}>
              {totalVisibleCount} {totalVisibleCount === 1 ? "entry" : "entries"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={expandAll}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#00E5FF",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.76rem",
                  padding: 0
                }}
              >
                Expand
              </button>
              <span style={{ color: "#334155" }}>&bull;</span>
              <button
                onClick={collapseAll}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.76rem",
                  padding: 0
                }}
              >
                Collapse
              </button>
            </div>
          </div>

          {/* TABLE OF CONTENTS OUTLINE */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}>
              Table of Contents
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {sectionsWithItems.map((sec) => (
                <div key={sec.id} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <a
                    href={`#section-${sec.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "6px",
                      textDecoration: "none",
                      color: "#E2E8F0",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <span style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        color: "#00E5FF",
                        flexShrink: 0
                      }}>
                        {sec.number}
                      </span>
                      <span style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {sec.title}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.7rem",
                      color: "#64748B",
                      background: "rgba(255, 255, 255, 0.05)",
                      padding: "1px 6px",
                      borderRadius: "4px"
                    }}>
                      {sec.items.length}
                    </span>
                  </a>

                  {/* Sub-item question list */}
                  {sec.items.length > 0 && (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginLeft: "14px",
                      paddingLeft: "8px",
                      borderLeft: "2px solid rgba(0, 229, 255, 0.2)",
                      marginTop: "2px",
                      marginBottom: "4px"
                    }}>
                      {sec.items.map((faq, itemIdx) => {
                        const qNum = `${sec.number.split(".")[0]}.${itemIdx + 1}`;
                        const isItemExpanded = !!expandedItems[faq.id];
                        return (
                          <button
                            key={faq.id}
                            onClick={() => {
                              setExpandedItems(prev => ({ ...prev, [faq.id]: true }));
                              const el = document.getElementById(`faq-${faq.id}`);
                              if (el) {
                                el.scrollIntoView({ behavior: "smooth", block: "center" });
                              }
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "4px 6px",
                              background: isItemExpanded ? "rgba(0, 229, 255, 0.08)" : "transparent",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              textAlign: "left",
                              width: "100%",
                              color: isItemExpanded ? "#FFFFFF" : "#94A3B8",
                              fontSize: "0.75rem",
                              transition: "all 0.12s ease"
                            }}
                          >
                            <span style={{
                              fontFamily: "var(--font-mono, monospace)",
                              fontSize: "0.7rem",
                              color: isItemExpanded ? "#00E5FF" : "#64748B",
                              flexShrink: 0
                            }}>
                              {qNum}
                            </span>
                            <span style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              flex: 1
                            }}>
                              {faq.question}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LINKS SECTION */}
          <div style={{
            marginTop: "auto",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}>
            <div style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.25rem"
            }}>
              Quick Reference
            </div>
            <Link
              href="/wiki"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 10px",
                borderRadius: "6px",
                fontSize: "0.78rem",
                color: "#94A3B8",
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                transition: "all 0.15s ease"
              }}
            >
              <span>Research Wiki &amp; Labs</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/account/subscription"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 10px",
                borderRadius: "6px",
                fontSize: "0.78rem",
                color: "#94A3B8",
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                transition: "all 0.15s ease"
              }}
            >
              <span>Platform Plans & Licensing</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ────────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>

      {/* ── OUTLINE SECTIONS ────────────────────────────────────────────────── */}
      {totalVisibleCount === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "rgba(15, 23, 42, 0.5)",
          borderRadius: "16px",
          border: "1px dashed rgba(255, 255, 255, 0.15)"
        }}>
          <HelpCircle size={40} color="#64748B" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            No matching questions found
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            We couldn't find any questions matching "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery("")}
            style={{
              background: "rgba(0, 229, 255, 0.15)",
              border: "1px solid #00E5FF",
              color: "#FFFFFF",
              padding: "8px 18px",
              borderRadius: "8px",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
          {sectionsWithItems.map((section) => {
            if (section.items.length === 0) return null;

            return (
              <section 
                key={section.id} 
                id={`section-${section.id}`}
                style={{ scrollMarginTop: "90px" }}
              >
                {/* Outline Section Heading */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-baseline",
                  gap: "12px",
                  paddingBottom: "0.75rem",
                  marginBottom: "1.25rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.12)"
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    color: "#00E5FF"
                  }}>
                    {section.number}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
                      fontSize: "1.45rem",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      margin: "0 0 4px 0",
                      letterSpacing: "-0.01em"
                    }}>
                      {section.title}
                    </h2>
                    <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.4 }}>
                      {section.description}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.75rem",
                    color: "#64748B",
                    whiteSpace: "nowrap"
                  }}>
                    {section.items.length} {section.items.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                {/* Section Question Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {section.items.map((faq, itemIndex) => {
                    const isExpanded = !!expandedItems[faq.id];
                    const questionNumber = `${section.number.split(".")[0]}.${itemIndex + 1}`;

                    return (
                      <article
                        key={faq.id}
                        id={`faq-${faq.id}`}
                        style={{
                          scrollMarginTop: "90px",
                          background: isExpanded ? "rgba(15, 23, 42, 0.75)" : "rgba(10, 15, 26, 0.5)",
                          border: isExpanded ? "1px solid rgba(0, 229, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                          borderRadius: "10px",
                          overflow: "hidden",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {/* Question Header Button */}
                        <button
                          onClick={() => toggleItem(faq.id)}
                          aria-expanded={isExpanded}
                          style={{
                            width: "100%",
                            padding: "1.1rem 1.25rem",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "1rem",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1 }}>
                            <span style={{
                              fontFamily: "var(--font-mono, monospace)",
                              fontSize: "0.85rem",
                              fontWeight: 800,
                              color: isExpanded ? "#00E5FF" : "#64748B",
                              paddingTop: "2px"
                            }}>
                              {questionNumber}
                            </span>
                            <div style={{ flex: 1 }}>
                              <h3 style={{
                                fontSize: "1.02rem",
                                fontWeight: 700,
                                color: isExpanded ? "#FFFFFF" : "#E2E8F0",
                                margin: "0 0 4px 0",
                                lineHeight: 1.4
                              }}>
                                {faq.question}
                              </h3>
                              {!isExpanded && (
                                <p style={{ color: "#94A3B8", fontSize: "0.84rem", margin: 0, lineHeight: 1.45 }}>
                                  {faq.shortSummary}
                                </p>
                              )}
                            </div>
                          </div>

                          <div style={{
                            padding: "4px",
                            color: isExpanded ? "#00E5FF" : "#64748B",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "2px"
                          }}>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </button>

                        {/* Answer Expanded Body */}
                        {isExpanded && (
                          <div style={{
                            padding: "0 1.25rem 1.25rem 2.75rem",
                            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                            marginTop: "0.25rem",
                            paddingTop: "1rem"
                          }}>
                            <div style={{ 
                              display: "flex", 
                              flexDirection: "column", 
                              gap: "0.75rem", 
                              color: "#CBD5E1", 
                              fontSize: "0.92rem", 
                              lineHeight: 1.65 
                            }}>
                              {faq.answer.map((para, pIdx) => (
                                <p key={pIdx} style={{ margin: 0 }}>
                                  {para}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
        </main>
      </div>

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 1.5rem 6rem 1.5rem" }}>
      {/* ── FOOTER CALLOUT ──────────────────────────────────────────────────── */}
      <footer style={{
        marginTop: "5rem",
        background: "rgba(15, 23, 42, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "14px",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem"
      }}>
        <div style={{ flex: 1, minWidth: "280px" }}>
          <h3 style={{
            fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
            fontSize: "1.2rem",
            fontWeight: 800,
            color: "#FFFFFF",
            margin: "0 0 0.5rem 0"
          }}>
            Verify the architecture in real time
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
            Access the 7 interactive browser simulators on the Research Wiki or review reproducible CLI quick-start guides with deterministic atomic rollback.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/wiki?tab=simulator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)",
              color: "#030608",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 800,
              fontSize: "0.85rem",
              padding: "10px 18px",
              borderRadius: "6px",
              textDecoration: "none"
            }}
          >
            <span>Wiki Simulators</span>
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/account/subscription"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 700,
              fontSize: "0.85rem",
              padding: "10px 16px",
              borderRadius: "6px",
              textDecoration: "none"
            }}
          >
            <span>Platform Plans & Licensing</span>
          </Link>
        </div>
      </footer>

      {/* ── PERSISTENT DOCK ──────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginTop: "3rem"
      }}>
        <span style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)", marginRight: "4px" }}>
          SYSTEM DIRECTORY:
        </span>
        <Link href="/wiki" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          Research Wiki
        </Link>
        <span style={{ color: "#334155" }}>&bull;</span>
        <Link href="/app/uvi" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          Vantage
        </Link>
        <span style={{ color: "#334155" }}>&bull;</span>
        <Link href="/app/praxis" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          Praxis
        </Link>
        <span style={{ color: "#334155" }}>&bull;</span>
        <Link href="/app/eris" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          Eris
        </Link>
        <span style={{ color: "#334155" }}>&bull;</span>
        <Link href="/app/valkyrie" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          Valkyrie
        </Link>
        <span style={{ color: "#334155" }}>&bull;</span>
        <Link href="/products/daedelus" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          Daedelus
        </Link>
        <span style={{ color: "#334155" }}>&bull;</span>
        <Link href="/app/axiom" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          Axiom
        </Link>
      </div>

      </div>
    </div>
  );
}
