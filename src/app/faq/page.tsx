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
  category: "skepticism" | "product" | "deployment" | "pricing";
  question: string;
  shortSummary: string;
  answer: string[];
}

interface OutlineSection {
  id: string;
  number: string;
  title: string;
  description: string;
  category: "skepticism" | "product" | "deployment" | "pricing";
}

const OUTLINE_SECTIONS: OutlineSection[] = [
  {
    id: "skepticism",
    number: "1.0",
    title: "Skepticism & Operational Safety",
    description: "Direct answers to technical doubts, memory integrity, telemetry boundaries, and reproducible verification.",
    category: "skepticism"
  },
  {
    id: "product",
    number: "2.0",
    title: "Product & Architecture",
    description: "Deep dive into the 7 defense engines, non-destructive CANARY BAS probes, and isolated chaos environments.",
    category: "product"
  },
  {
    id: "deployment",
    number: "3.0",
    title: "Deployment & Air-Gap Operations",
    description: "Air-gapped data diodes, supported Linux distributions, container runtimes, and 14ms atomic rollback mechanics.",
    category: "deployment"
  },
  {
    id: "pricing",
    number: "4.0",
    title: "Pricing, Licensing & Sovereign Tiers",
    description: "Transparent pricing breakdown: Community ($0 forever), Professional ($100/mo), and Enterprise ($500/mo).",
    category: "pricing"
  }
];

const FAQ_DATA: FaqItem[] = [
  // ── 1.0 SKEPTICISM & OPERATIONAL SAFETY ──────────────────────────────────────
  {
    id: "vaporware-proof",
    category: "skepticism",
    question: "This looks like vaporware bullshit, how can I prove this actually works?",
    shortSummary: "Don't take our word for it. Test live interactive simulators in the Wiki and run our reproducible quick-start guides right now.",
    answer: [
      "We completely understand your skepticism. The cybersecurity market is saturated with marketing buzzwords, pitch decks, and vaporware. That is why we built reproducible proof directly into the platform so you can verify our claims in 60 seconds with zero sales gatekeeping:",
      "1. Interactive Simulators on the Research Wiki: Visit the Exultia Research Wiki (/wiki?tab=simulator) right now. Every single one of the 7 defense engines includes an interactive, in-browser lab simulator. You can execute simulated in-memory hotpatching with real-time disassembly trampolines (Praxis), trigger non-destructive BAS exploitability probes (Valkyrie), query live filtered threat telemetry across 110+ registries (Vantage), and spin up chaos attack vectors (Eris).",
      "2. Executable Quick-Start Guides: In the Research Wiki (/wiki?tab=quickstart), every product features copy-pasteable CLI commands. You can download the compiled standalone binary via `curl -fsSL https://exultia.tech/api/kinetic/download?platform=linux -o praxis` and run `praxis test`. It executes a real synthetic mutation on your system, takes a pre-image SHA-256 snapshot, and verifies an atomic rollback in under 14ms.",
      "3. Free Community Sovereign Tier ($0 Forever): You do not need to sign a contract, talk to a salesperson, or provide a credit card. Deploy the free tier on 1 host node, pull CIS Benchmark Level 2 containers from PureOS, and query the real-time CISA KEV feed from Vantage.",
      "4. Cryptographic Attestations: Every mitigation payload and container image is signed with Cosign SLSA Level 3 provenance keys that you can inspect and verify independently using open-source tooling."
    ]
  },
  {
    id: "memory-safety",
    category: "skepticism",
    question: "Is in-memory hotpatching actually safe, or will it corrupt running kernel and process memory?",
    shortSummary: "Praxis uses deterministic trampoline redirection with atomic snapshots and 14ms failsafe rollbacks.",
    answer: [
      "Praxis does not execute arbitrary runtime memory overwrites or unsafe byte patching. Every hotpatch follows a strict 4-step deterministic verification pipeline before injection:",
      "1. Static Disassembly Verification: The Kinetic engine inspects process binary offsets and verifies symbol integrity against known compiler fingerprints.",
      "2. Hermetic Trampoline Hooks: Patches are synthesized as micro-trampolines targeting solely the vulnerable logic (such as input sanitizers or query string decoders) without altering surrounding business logic.",
      "3. Pre-Flight Atomic Snapshotting: Prior to memory injection, an atomic snapshot of the process state and memory registers is committed to `/var/lib/kinetic/snapshots/`.",
      "4. Automated Health Watchdog: If the patched process encounters any signal faults (e.g. SIGSEGV or SIGABRT), the host watchdog automatically executes an atomic rollback in under 14 milliseconds, restoring baseline state with zero residual corruption."
    ]
  },
  {
    id: "rebranded-wrapper",
    category: "skepticism",
    question: "Is Exultia just a rebranded wrapper around open-source tools like Trivy, Suricata, or ClamAV?",
    shortSummary: "No. The closed-loop kinetic hotpatch compiler, BAS prober, and chaos range are 100% proprietary systems.",
    answer: [
      "No. While Vantage aggregates public vulnerability feeds (such as NIST NVD, CISA KEV, and Linux vendor errata) alongside private feeds, the entire kinetic defense and remediation execution engine is custom proprietary systems code:",
      "• Praxis Hotpatch Engine: Synthesizes in-memory trampolines, Ansible canary plays, and hardware firewall ACLs directly. No open-source scanner can hotpatch live process memory.",
      "• Valkyrie BAS: Injects non-destructive, HMAC-signed canary handshakes to mathematically prove exploitability before remediation.",
      "• Eris Chaos Lab: Programmatically spins up isolated 5-container Docker ranges with automated 10-minute auto-destruct watchdog timers.",
      "• PureIDE: Air-gapped developer compiler with kernel-level network egress gating and automated CycloneDX SBOM cosigning.",
      "Open-source scanners only alert you to problems; Exultia is a closed-loop platform that autonomously remediates them in sub-second time."
    ]
  },
  {
    id: "suspicious-pricing",
    category: "skepticism",
    question: "Isn't $100/mo suspiciously cheap for a platform claiming to replace multi-thousand-dollar enterprise suites?",
    shortSummary: "Modern systems engineering eliminates the massive sales overhead and cloud ingestion bloat of legacy vendors.",
    answer: [
      "Traditional cybersecurity giants (CrowdStrike, Palo Alto, Snyk, Splunk) spend between 60% and 75% of their total revenue on enterprise sales commissions, executive overhead, and expensive multi-gigabyte cloud ingestion pipelines.",
      "Exultia was engineered from day one on lean, modern systems principles:",
      "1. Compiled Native Binaries: Lightweight Rust/Go/Python daemons consume less than 35MB of RAM per host with near-zero CPU footprint.",
      "2. Zero Telemetry Cloud Costs: Because customer source code and telemetry are never streamed to our cloud, we don't pay millions in AWS/GCP storage costs and don't pass those markups to you.",
      "3. Unified Architecture: By unifying all 7 tools into a single codebase, we eliminate the engineering friction of maintaining 7 separate product companies.",
      "You are paying for pure security engineering and vulnerability intelligence—not sales conferences and vendor golf trips."
    ]
  },
  {
    id: "trust-new-platform",
    category: "skepticism",
    question: "Why should we trust Exultia in production over established 20-year-old enterprise security vendors?",
    shortSummary: "Legacy vendors have a broken record of catastrophic fleet crashes and 30-day patch delays.",
    answer: [
      "Established legacy vendors rely on an antiquated, high-risk security paradigm:",
      "• The Broken Cycle: Legacy tools detect a zero-day, alert your team, and leave you exposed for 14 to 45 days while waiting for an upstream vendor patch.",
      "• Catastrophic Outage Risk: Legacy kernel-level sensor updates pushed globally without local sandbox verification have caused historic, multi-billion-dollar IT outages.",
      "• Cryptographic Integrity: Exultia operates under SLSA Level 3 provenance with signed SHA-256 HMAC attestations for every patch applied.",
      "• Local Verification: Every hotpatch can be verified locally on a dry-run host or staged canary fleet before broad deployment. If anything goes wrong, a single command restores the original binary in 14 milliseconds."
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
      "If any unexpected behavior occurs, `sudo kinetic rollback --cve=...` restores the original binary in 14ms."
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

  // ── 2.0 PRODUCT & ARCHITECTURE ──────────────────────────────────────────────
  {
    id: "closed-loop-explained",
    category: "product",
    question: "What is the closed-loop defense model, and how do the 7 engines interact?",
    shortSummary: "Continuous detection, adversary emulation, non-destructive pentesting, and in-memory hotpatching in <200ms.",
    answer: [
      "Traditional cybersecurity separates vulnerability management into fragmented steps: a scanner finds an issue, a security analyst reviews it, a penetration tester validates it, and DevOps schedules a patch weeks later.",
      "Exultia automates this entire lifecycle into a machine-speed OODA (Observe-Orient-Decide-Act) closed loop:",
      "1. Vantage (Detect): Ingests zero-day advisories from 110+ registries (CISA KEV, NIST, Linux errata).",
      "2. Eris (Emulate): Spins up an ephemeral container range replicating the exact adversary vulnerability conditions.",
      "3. Valkyrie (Verify): Injects a safe non-destructive canary probe to mathematically prove exploitability.",
      "4. Praxis (Remediate): Compiles and injects an in-memory bytecode hotpatch in <40ms, snapshotting state for 14ms rollback.",
      "5. Foundations: PureIDE, PureOS, and Axiom provide air-gapped workstations, pre-hardened container images, and certified workforce training."
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
    question: "What makes PureIDE fundamentally different from standard developer environments like VS Code?",
    shortSummary: "PureIDE enforces kernel-level network egress sandboxing, air-gap cosigning, and automated CycloneDX SBOMs.",
    answer: [
      "Modern IDEs and code editors stream extensive telemetry, source code snippets, and telemetry prompts to third-party cloud servers. Furthermore, standard compilers make unrestricted outbound network calls during build steps, leaving them vulnerable to supply-chain attacks (such as the XZ Utils backdoor).",
      "PureIDE solves this at the workstation layer:",
      "• Air-Gapped Workstations: Zero telemetry is collected or transmitted. Completely functional in fully offline environments.",
      "• Egress Sandboxing: Build tasks are executed inside restricted cgroups where unauthorized network egress is blocked at the kernel boundary.",
      "• Cryptographic Attestation: Automatically generates CycloneDX SBOMs and signs built binaries with Cosign SLSA Level 3 attestations."
    ]
  },

  // ── 3.0 DEPLOYMENT & AIR-GAP OPERATIONS ─────────────────────────────────────
  {
    id: "airgap-support",
    category: "deployment",
    question: "Can Exultia run in completely air-gapped, classified, or SCIF data center environments?",
    shortSummary: "Yes. All daemons, container ranges, and patch compilers run completely self-contained and offline.",
    answer: [
      "Yes. Exultia was designed from inception for sovereign, air-gapped, and defense-grade environments:",
      "• Self-Contained Binaries: The Kinetic daemon, Praxis hotpatch synthesizer, and Valkyrie prober require no continuous connection to Exultia cloud servers.",
      "• Data Diode Sync: Advisory definitions and patch packages can be exported into offline `.bundle` files and imported across secure data diodes.",
      "• Cosign Signature Verification: Offline bundles include cryptographic Cosign signatures that are validated locally against your organization's public key before deployment."
    ]
  },
  {
    id: "supported-os",
    category: "deployment",
    question: "Which operating systems, distributions, and container environments are supported?",
    shortSummary: "Ubuntu, Debian, RHEL, AlmaLinux, Rocky, Alpine Linux, Docker, containerd, and Kubernetes.",
    answer: [
      "Exultia supports all major modern enterprise Linux distributions and container platforms:",
      "• Distributions: Ubuntu (20.04, 22.04, 24.04 LTS), Debian (11, 12), RHEL / Rocky Linux / AlmaLinux (8, 9), Alpine Linux (3.18+), and Arch Linux.",
      "• Architectures: Full support for both x86_64 (AMD64) and aarch64 (ARM64 / AWS Graviton).",
      "• Container Platforms: Docker Engine, containerd, CRI-O, and Kubernetes (EKS, GKE, AKS, and bare-metal Talos/k3s/RKE2).",
      "• PureOS Containers: Minimal, CIS-benchmarked distroless container images available for immediate drop-in replacement across Node.js, Go, Python, and Rust runtimes."
    ]
  },
  {
    id: "rollback-mechanics",
    category: "deployment",
    question: "How does the sub-second deterministic rollback command actually work on a live host?",
    shortSummary: "Pre-flight memory snapshots allow instant unlinking of trampoline hooks in under 14 milliseconds.",
    answer: [
      "When Praxis hotpatches a running process or service, it commits an atomic memory snapshot and filesystem delta before modifying any active instructions.",
      "To execute a rollback:",
      "1. Execute `sudo kinetic rollback --latest` (or target a specific CVE, e.g. `sudo kinetic rollback --cve=CVE-2024-4577`).",
      "2. The Kinetic kernel driver immediately unlinks the memory trampoline hook, restoring the original function pointer offsets.",
      "3. Pre-flight file permissions and binary hashes are verified against the snapshot manifest.",
      "4. The entire reversal completes in approximately 14 milliseconds with zero daemon restarts and zero dropped client connections."
    ]
  },

  // ── 4.0 PRICING, LICENSING & SOVEREIGN TIERS ─────────────────────────────────
  {
    id: "single-subscription",
    category: "pricing",
    question: "Do I really get full access to all 7 platform engines with a single $100/mo subscription?",
    shortSummary: "Yes. An active Professional Operator subscription unlocks all 7 defense engines with zero add-on fees.",
    answer: [
      "Yes. Unlike legacy vendors that charge separate licensing fees for threat feeds, vulnerability scanners, pentest tools, container registries, and training simulators, Exultia provides the entire ecosystem under one unified platform subscription.",
      "Your $100/mo ($1,200/year) Professional Operator subscription includes:",
      "• Unlimited Praxis in-memory hotpatching and atomic rollbacks",
      "• Full Vantage threat intelligence across 110+ authoritative registries",
      "• Private Eris chaos sandbox testing ranges",
      "• Valkyrie on-demand breach & attack simulation prober",
      "• PureIDE air-gap compiler and PureOS CIS-hardened container images",
      "• Axiom certification exam simulator with verifiable SHA-256 certs",
      "There are no per-engine add-ons, no hidden data ingestion fees, and no surprise overages."
    ]
  },
  {
    id: "free-community",
    category: "pricing",
    question: "What is included in the free Community Sovereign plan?",
    shortSummary: "The Community plan is free forever for security researchers, students, and open-source developers.",
    answer: [
      "The Community Sovereign tier ($0 forever) provides core defense capabilities for individual practitioners:",
      "• Full public Vantage threat feed access (aggregating NIST NVD, CISA KEV, and open CVE feeds)",
      "• Pre-built community distroless container base images from PureOS",
      "• Basic Valkyrie non-destructive canary probes",
      "• Free cybersecurity certification question bank practice modules via Axiom",
      "No credit card is required to create a community account and start exploring the platform."
    ]
  },
  {
    id: "enterprise-features",
    category: "pricing",
    question: "What extra capabilities are included in the Enterprise Fleet plan ($500/mo)?",
    shortSummary: "Multi-cluster orchestration, custom patch authoring, SCORM/LTI LMS APIs, and 24/7 priority SLA.",
    answer: [
      "The Enterprise Fleet tier ($500/mo or custom annual invoicing) is engineered for multi-team organizations, universities, and mission-critical infrastructure:",
      "• Multi-Node Cluster Orchestration: Centrally orchestrate hotpatching across hundreds of Kubernetes nodes and server clusters.",
      "• Custom Hotpatch Authoring: Author and audit proprietary trampoline patches for internal, proprietary enterprise binaries.",
      "• Institutional LMS Integration: SCORM and LTI 1.3 deep-linking API for embedding Axiom certification exams into university and corporate LMS systems.",
      "• Private Cosign Audit Keys: Cryptographically sign patch manifests using your organization's private HSM / KMS keys.",
      "• Dedicated 24/7 SLA: Direct escalation access to senior systems security engineers with guaranteed response SLAs."
    ]
  }
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "vaporware-proof": true,
    "memory-safety": true,
    "rebranded-wrapper": true,
    "closed-loop-explained": true,
    "airgap-support": true,
    "single-subscription": true
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
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem 6rem 1.5rem" }}>
      
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header style={{ marginBottom: "3rem" }}>
        
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "8px", 
          background: "rgba(255, 255, 255, 0.04)", 
          border: "1px solid rgba(255, 255, 255, 0.12)", 
          padding: "5px 14px", 
          borderRadius: "6px", 
          marginBottom: "1.25rem",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.8rem",
          color: "#94A3B8"
        }}>
          <ListTree size={14} color="#00E5FF" />
          <span>DOCUMENTATION &bull; REFERENCE OUTLINE</span>
        </div>

        <h1 style={{ 
          fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
          fontSize: "clamp(2.2rem, 4vw, 3.2rem)", 
          fontWeight: 900, 
          color: "#FFFFFF", 
          letterSpacing: "-0.02em", 
          marginBottom: "1rem",
          lineHeight: 1.15
        }}>
          Frequently Asked Questions
        </h1>

        <p style={{ color: "#94A3B8", fontSize: "1.05rem", maxWidth: "760px", margin: "0 0 2rem 0", lineHeight: 1.6 }}>
          Comprehensive outline covering architectural safety, autonomous hotpatching, zero-telemetry boundaries, air-gap operations, and platform subscriptions.
        </p>

        {/* Search Bar & Expand/Collapse Toolbar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          background: "rgba(15, 23, 42, 0.6)",
          padding: "1rem 1.25rem",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search size={16} color="#64748B" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search outline (e.g., 'hotpatch', 'vaporware', 'airgap', 'pricing')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 42px",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "0.9rem",
                fontFamily: "var(--font-mono, monospace)",
                outline: "none"
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "4px"
                }}
              >
                &times;
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem", fontFamily: "var(--font-mono, monospace)" }}>
            <button
              onClick={expandAll}
              style={{
                background: "transparent",
                border: "none",
                color: "#00E5FF",
                cursor: "pointer",
                fontWeight: 700,
                padding: "4px 8px"
              }}
            >
              Expand All
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
                padding: "4px 8px"
              }}
            >
              Collapse All
            </button>
          </div>
        </div>

      </header>

      {/* ── TABLE OF CONTENTS OUTLINE DIRECTORY ─────────────────────────────── */}
      {!searchQuery && (
        <nav 
          aria-label="FAQ Outline Directory"
          style={{
            background: "rgba(10, 15, 26, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            marginBottom: "3.5rem"
          }}
        >
          <div style={{
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono, monospace)",
            fontWeight: 800,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem"
          }}>
            OUTLINE DIRECTORY
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "0.75rem"
          }}>
            {OUTLINE_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#section-${sec.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "6px",
                  textDecoration: "none",
                  transition: "all 0.15s ease"
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  color: "#00E5FF"
                }}>
                  {sec.number}
                </span>
                <span style={{
                  color: "#E2E8F0",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {sec.title}
                </span>
              </a>
            ))}
          </div>
        </nav>
      )}

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
                        style={{
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
            Access the 7 interactive browser simulators on the Research Wiki or review reproducible CLI quick-start guides with instant 14ms rollback.
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
            <span>Platform Plans ($100/mo)</span>
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
        <Link href="/products/pure-ide" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          PureIDE
        </Link>
        <span style={{ color: "#334155" }}>&bull;</span>
        <Link href="/app/pureos" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          PureOS
        </Link>
        <span style={{ color: "#334155" }}>&bull;</span>
        <Link href="/app/axiom" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
          Axiom
        </Link>
      </div>

    </div>
  );
}
