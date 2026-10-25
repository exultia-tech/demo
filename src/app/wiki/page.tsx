"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon,
  ErisIcon,
  ValkyrieIcon
} from "@/components/BrandIcons";
import ProductSimulators from "@/components/research/ProductSimulators";
import { 
  Search, 
  Terminal, 
  BookOpen, 
  Code2, 
  Copy, 
  Check, 
  ExternalLink, 
  Shield, 
  Sparkles, 
  Layers, 
  Cpu, 
  Download, 
  RefreshCw, 
  ArrowRight,
  Key,
  Database,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  summary: string;
  authRequired: boolean;
  queryParams?: { name: string; type: string; required: boolean; description: string; example: string }[];
  requestBody?: { description: string; schema: any };
  responses: { status: number; description: string; example: any }[];
  curlExample: string;
}

interface ProductWiki {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  accentColor: string;
  specDoc: string;
  quickStart: {
    title: string;
    description: string;
    steps: {
      label: string;
      command?: string;
      codeLang?: string;
      details?: string;
    }[];
  };
  productDetails: {
    overview: string;
    architectureTitle: string;
    architecturePoints: string[];
    capabilities: { title: string; desc: string }[];
    specifications: { label: string; value: string }[];
  };
  apiEndpoints: ApiEndpoint[];
}

const WIKI_PRODUCTS: ProductWiki[] = [
  {
    id: "vantage",
    name: "Vantage",
    tagline: "Universal Threat Feed Aggregating 110+ Global Vulnerability Registries",
    icon: <VantageIcon size={36} />,
    accentColor: "#A855F7",
    specDoc: "vantage.md",
    quickStart: {
      title: "Querying Threat Intelligence",
      description: "Access high-throughput vulnerability telemetry, CISA KEV synchronization, and CVSS v3.1 scoring in real time.",
      steps: [
        {
          label: "1. Query Global Ingestion Statistics",
          command: "curl -s \"https://exultia.tech/api/threat-feed/stats\" | jq .",
          codeLang: "bash",
          details: "Inspect real-time vulnerability volume, severity counts, and registry status."
        },
        {
          label: "2. Ingest Filtered Vulnerabilities (Python)",
          command: "import urllib.request, json\nurl = 'https://exultia.tech/api/threat-feed/sync?min_cvss=9.0&cisa_kev_only=true'\nwith urllib.request.urlopen(url) as r:\n    data = json.loads(r.read().decode())\n    print(f\"Ingested {len(data['advisories'])} critical items.\")",
          codeLang: "python",
          details: "High-speed JSON stream for SIEM, SOAR, and custom threat pipelines."
        },
        {
          label: "3. Consult AI Virtual CISO",
          command: "curl -X POST \"https://exultia.tech/api/threat-feed/virtual-ciso\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"query\": \"Summarize active attack vectors in Linux kernels this month\"}'",
          codeLang: "bash",
          details: "Natural-language threat impact analysis tailored to your specific infrastructure."
        }
      ]
    },
    productDetails: {
      overview: "Vantage is an ultra-fast threat normalization hub that ingests, deduplicates, and annotates vulnerabilities across sovereign databases (CISA KEV, NVD) and vendor security feeds.",
      architectureTitle: "Global Threat Aggregation Engine",
      architecturePoints: [
        "110+ Upstream Sources: CISA KEV, NIST NVD, GitHub Advisory Database, Debian, Red Hat, Ubuntu, Alpine, Arch.",
        "Sub-20ms In-Memory Cache: Fast queries even under massive enterprise query volumes.",
        "Automated Alias Harmonization: Unifies disparate vendor bulletin IDs with canonical CVE numbers.",
        "Direct Praxis Integration: Seamlessly pipes verified remediations directly into the Praxis autonomous hotfix stream."
      ],
      capabilities: [
        { title: "Real-Time KEV Tracking", desc: "Prioritizes vulnerabilities actively weaponized in the wild." },
        { title: "CVSS v3.1 Telemetry", desc: "Full breakdown of Attack Vector (AV), Privileges Required (PR), and Scope (S)." },
        { title: "Virtual CISO Copilot", desc: "Generates executive risk summaries and mitigation directives." }
      ],
      specifications: [
        { label: "Active Threat Database Size", value: "10,895+ verified advisories" },
        { label: "Feed Refresh Interval", value: "Real-time webhook + 15-minute polling fallback" },
        { label: "Data Format", value: "REST JSON / Streaming SSE" }
      ]
    },
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/threat-feed/stats",
        summary: "Macro-level threat statistics, severity breakdowns, and registry health",
        authRequired: false,
        responses: [
          {
            status: 200,
            description: "Global threat statistics",
            example: {
              totalAdvisories: 10895,
              cisaKevCount: 6814,
              severityDistribution: { critical: 7166, high: 3723, medium: 6, low: 0 },
              lastSyncedAt: "2026-10-18T12:00:00.000Z",
              healthyRegistries: 110
            }
          }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/threat-feed/stats"'
      },
      {
        method: "GET",
        path: "/api/threat-feed/sync",
        summary: "Batch synchronize normalized CVE/UVI threat records",
        authRequired: false,
        queryParams: [
          { name: "min_cvss", type: "number", required: false, description: "Filter by minimum CVSS score (0.0 - 10.0)", example: "9.0" },
          { name: "cisa_kev_only", type: "boolean", required: false, description: "Only return CISA KEV entries", example: "true" },
          { name: "distro", type: "string", required: false, description: "Filter by target distribution", example: "rocky" },
          { name: "limit", type: "integer", required: false, description: "Max advisories to return (max: 2000)", example: "500" }
        ],
        responses: [
          {
            status: 200,
            description: "Filtered threat records",
            example: {
              count: 100,
              advisories: [
                { id: "UVI-2024-3094", cveId: "CVE-2024-3094", cvss: 10.0, severity: "CRITICAL", cisaKev: true }
              ]
            }
          }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/threat-feed/sync?min_cvss=9.0&cisa_kev_only=true"'
      },
      {
        method: "POST",
        path: "/api/threat-feed/virtual-ciso",
        summary: "AI-driven advisory consultation and executive risk briefing",
        authRequired: false,
        requestBody: {
          description: "Natural-language query with optional organizational context",
          schema: { query: "string", organizationContext: "string (optional)" }
        },
        responses: [
          {
            status: 200,
            description: "Risk assessment and tactical directive",
            example: {
              status: "success",
              analysis: "Immediate mitigation required on exposed SSH daemons. Deploy Praxis hotfix.",
              riskRating: "CRITICAL",
              recommendedAction: "APPLY_PRAXIS_HOTFIX"
            }
          }
        ],
        curlExample: 'curl -X POST "https://exultia.tech/api/threat-feed/virtual-ciso" -H "Content-Type: application/json" -d \'{"query": "Assess risk of CVE-2024-3094"}\''
      }
    ]
  },
  {
    id: "axiom",
    name: "Axiom",
    tagline: "Cybersecurity Exam Simulator, Adaptive Question Bank & Enterprise LMS Feed",
    icon: <AxiomIcon size={36} glow={false} />,
    accentColor: "#F43F5E",
    specDoc: "axiom.md",
    quickStart: {
      title: "Interactive Certification Simulations",
      description: "Prepare security teams for CISSP, Security+, CISM, CEH, OSCP, and AWS Security with psychometric scoring and LMS integrations.",
      steps: [
        {
          label: "1. Fetch Practice Exam Syllabus",
          command: "curl -s \"https://exultia.tech/api/axiom/exam?exam=cissp&count=10\" | jq .",
          codeLang: "bash",
          details: "Retrieves randomized, domain-weighted certification questions."
        },
        {
          label: "2. Grade Responses & Calculate Domain Performance",
          command: "curl -X POST \"https://exultia.tech/api/axiom/exam\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"examId\": \"cissp\", \"candidateId\": \"usr_88\", \"responses\": [{\"questionId\": \"Q-01\", \"selectedChoice\": \"B\"}]}'",
          codeLang: "bash",
          details: "Evaluates score percentage, passing threshold, and domain breakdown."
        },
        {
          label: "3. Export Question Catalog for Institutional LMS",
          command: "curl -s \"https://exultia.tech/api/axiom/export?exam=security_plus&format=json\" -o secplus.json",
          codeLang: "bash",
          details: "SCORM / Canvas / Moodle compliant question bank export."
        }
      ]
    },
    productDetails: {
      overview: "Axiom is an enterprise certification engine providing deep diagnostic question pools, psychometric scoring, and institutional reporting for cybersecurity professionals.",
      architectureTitle: "Certification Coverage & Architecture",
      architecturePoints: [
        "Curricula: CISSP (ISC)², CompTIA Security+, CISM (ISACA), CEH (EC-Council), OSCP (OffSec), AWS Certified Security.",
        "Adaptive Difficulty: Dynamically tunes scenario complexity based on candidate accuracy trends.",
        "Verifiable Certificates: Cryptographically signed completion tokens for HR and compliance audits.",
        "LMS Integration Feed: REST and SCORM compliant export pipes directly into enterprise LMS."
      ],
      capabilities: [
        { title: "Domain Diagnostics", desc: "Pinpoints exact syllabus domains needing remediation." },
        { title: "Scenario Simulation", desc: "Realistic multi-stage technical incident scenarios." },
        { title: "Psychometric Evaluation", desc: "Weighted scoring calibrated to actual certification exams." }
      ],
      specifications: [
        { label: "Question Pool Size", value: "5,000+ peer-reviewed scenario questions" },
        { label: "Passing Threshold", value: "Configurable (70% standard)" },
        { label: "Export Formats", value: "JSON, CSV, SCORM 1.2" }
      ]
    },
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/axiom/exam",
        summary: "Retrieve certification questions and curriculum syllabus",
        authRequired: false,
        queryParams: [
          { name: "exam", type: "string", required: true, description: "Exam identifier: 'cissp', 'security_plus', 'cism', 'ceh', 'oscp', 'aws_security'", example: "cissp" },
          { name: "count", type: "integer", required: false, description: "Number of questions to generate (default: 25)", example: "15" },
          { name: "domain", type: "string", required: false, description: "Filter by syllabus domain", example: "cryptography" }
        ],
        responses: [
          {
            status: 200,
            description: "Generated exam question set",
            example: {
              status: "success",
              exam: "cissp",
              totalQuestions: 15,
              questions: [
                {
                  id: "Q-CISSP-101",
                  domain: "Security Architecture",
                  prompt: "Which cryptographic algorithm provides equivalent security with smaller key sizes?",
                  choices: [
                    { id: "A", text: "RSA 2048-bit" },
                    { id: "B", text: "ECC 256-bit" }
                  ]
                }
              ]
            }
          }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/axiom/exam?exam=cissp&count=10"'
      },
      {
        method: "POST",
        path: "/api/axiom/exam",
        summary: "Grade candidate responses and generate domain diagnosis",
        authRequired: false,
        requestBody: {
          description: "Candidate submission answers",
          schema: { examId: "string", candidateId: "string", responses: [{ questionId: "string", selectedChoice: "string" }] }
        },
        responses: [
          {
            status: 200,
            description: "Psychometric grading report",
            example: {
              status: "completed",
              scorePercentage: 92.5,
              passed: true,
              domainBreakdown: { "Security Architecture": { correct: 5, total: 5, percentage: 100.0 } },
              completionToken: "AXIOM-CERT-2026-78A"
            }
          }
        ],
        curlExample: 'curl -X POST "https://exultia.tech/api/axiom/exam" -H "Content-Type: application/json" -d \'{"examId":"cissp","candidateId":"u1","responses":[]}\''
      },
      {
        method: "GET",
        path: "/api/axiom/export",
        summary: "Export question banks and curriculum catalogues in JSON or CSV",
        authRequired: false,
        queryParams: [
          { name: "exam", type: "string", required: true, description: "Target exam identifier", example: "cissp" },
          { name: "format", type: "string", required: false, description: "'json' or 'csv'", example: "json" }
        ],
        responses: [
          { status: 200, description: "Export catalog", example: { exam: "cissp", totalQuestions: 1200 } }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/axiom/export?exam=cissp&format=json"'
      }
    ]
  },

  {
    id: "praxis",
    name: "Praxis",
    tagline: "Autonomous Zero-Downtime Hotpatching, Canary Stream & Hardware ACL Compiler",
    icon: <PraxisIcon size={36} />,
    accentColor: "#F59E0B",
    specDoc: "praxis.md",
    quickStart: {
      title: "Autonomous Fleet Hotpatching in 60 Seconds",
      description: "Praxis transforms threat intelligence into automated operational response with Tier 1 live-memory hotfixes and hardware firewall ACLs.",
      steps: [
        {
          label: "1. Download Multi-Arch Standalone Binary (Linux / POSIX)",
          command: "curl -fsSL https://exultia.tech/api/kinetic/download?platform=linux -o /usr/local/bin/praxis\nchmod +x /usr/local/bin/praxis",
          codeLang: "bash",
          details: "Self-contained universal executable with zero external runtime dependencies."
        },
        {
          label: "2. Execute Self-Contained Validation Gate",
          command: "praxis test",
          codeLang: "bash",
          details: "Runs synthetic mutation, pre-image SHA-256 snapshotting, and verifies 14ms atomic rollback."
        },
        {
          label: "3. Apply Active Critical Hotfixes (Zero Reboot)",
          command: "praxis apply --severity critical",
          codeLang: "bash",
          details: "Applies sysctl kernel runtime parameters, sshd drop-ins, and verifies system integrity."
        },
        {
          label: "4. Generate Serialized 10% Canary Playbook",
          command: "curl -X POST \"https://exultia.tech/api/praxis/generate\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"cveId\": \"CVE-2024-3094\", \"targetPlatform\": \"rocky\", \"canaryPercentage\": 10}' \\\n  | jq -r .playbookYaml > mitigate_xz.yml",
          codeLang: "bash",
          details: "Generates production-ready Ansible playbook with rolling canary controls."
        }
      ]
    },
    productDetails: {
      overview: "Praxis eliminates emergency maintenance windows and costly infrastructure reboots by applying cryptographic Tier 1 hotfixes to active memory and runtime daemons, combined with hardware firewall ACL generation.",
      architectureTitle: "Autonomous Remediation & Hotpatching Engine",
      architecturePoints: [
        "Tier 1 Hot-Mitigations: Dynamic kernel sysctl, drop-in configs, systemctl reloads, and iptables filters with guaranteed zero downtime.",
        "Tier 2 Atomic Package Upgrades: Distro-native package manager commands (APT, DNF, APK) for scheduled permanent reconciliation.",
        "Hardware Firewall ACLs: Compiles real-time blocklists for Cisco IOS, Palo Alto EDL, Fortinet, and Juniper SRX.",
        "Deterministic Pre-Image Engine: Automatically snapshots mutated files in ~/.praxis/snapshots with SHA-256 integrity verification."
      ],
      capabilities: [
        { title: "Sub-Second Rollback", desc: "Instantly reverts system state if canary health probes detect latency or error spikes." },
        { title: "SLSA Level 3 Provenance", desc: "Every mitigation payload is cryptographically signed using Cosign keyless OIDC." },
        { title: "Hardware Firewall Integration", desc: "Generates production ACL rules for enterprise edge devices." }
      ],
      specifications: [
        { label: "Supported Operating Systems", value: "Ubuntu, Debian, Rocky Linux, RHEL, Alpine, FreeBSD, AIX, Solaris" },
        { label: "Local Rollback Benchmark", value: "14ms atomic restore via /var/lib/kinetic/snapshots/" },
        { label: "Automation Engines", value: "Ansible, AWX, Terraform, Shell, Systemd" }
      ]
    },
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/patches/feed",
        summary: "Stream authenticated machine-executable zero-downtime hotfixes",
        authRequired: false,
        queryParams: [
          { name: "severity", type: "string", required: false, description: "Filter by severity (critical, high, medium)", example: "critical" },
          { name: "distro", type: "string", required: false, description: "Filter by distro (ubuntu, rocky, alpine, debian)", example: "ubuntu" },
          { name: "format", type: "string", required: false, description: "Output format: 'json' or 'bash'", example: "json" }
        ],
        responses: [
          {
            status: 200,
            description: "Active hotfix stream items",
            example: { count: 3, items: [{ cveId: "CVE-2024-6387", affectedPackage: "openssh-server", cvssScore: 9.8, zeroDowntime: true }] }
          }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/patches/feed?severity=critical&format=json"'
      },
      {
        method: "POST",
        path: "/api/praxis/generate",
        summary: "Synthesize verified Ansible automation playbook or single-use script",
        authRequired: false,
        requestBody: {
          description: "Target advisory and canary serialization parameters",
          schema: { cveId: "string", targetPlatform: "string", canaryPercentage: 10 }
        },
        responses: [
          { status: 200, description: "Synthesized Ansible playbook", example: { status: "success", playbookYaml: "---\n- hosts: all\n..." } }
        ],
        curlExample: 'curl -X POST "https://exultia.tech/api/praxis/generate" -H "Content-Type: application/json" -d \'{"cveId":"CVE-2024-3094","targetPlatform":"rocky"}\''
      },
      {
        method: "GET",
        path: "/api/kinetic/download",
        summary: "Download standalone multi-architecture compiled binary",
        authRequired: false,
        queryParams: [
          { name: "platform", type: "string", required: false, description: "Target platform ('linux', 'windows', 'universal')", example: "linux" }
        ],
        responses: [
          {
            status: 200,
            description: "JSON release manifest with cryptographic SHA256 hashes",
            example: { name: "Praxis Standalone Compiled Binary", version: "2.4.0" }
          }
        ],
        curlExample: 'curl -fsSL "https://exultia.tech/api/kinetic/download?platform=linux" -o praxis'
      }
    ]
  },
  {
    id: "pureide",
    name: "PureIDE",
    tagline: "Zero-Trust Hermetic Developer Workstation & Certified Toolchain Builder",
    icon: <PureIdeIcon size={36} />,
    accentColor: "#3B82F6",
    specDoc: "pureide.md",
    quickStart: {
      title: "Hermetic Builds & Toolchain Verification",
      description: "Run reproducible compilations in an isolated, zero-egress sandbox with certified compilers.",
      steps: [
        {
          label: "1. Inspect Hermetic Toolchain Versions",
          command: "curl -s \"https://exultia.tech/api/pureide/versions\" | jq .",
          codeLang: "bash",
          details: "Verifies GCC, Clang, Rustc, and Go certified compiler versions."
        },
        {
          label: "2. Trigger Local Hermetic Build Gate",
          command: "pureide build --hermetic --verify-slsa",
          codeLang: "bash",
          details: "Executes air-gapped bit-for-bit reproducible compilation."
        }
      ]
    },
    productDetails: {
      overview: "PureIDE guarantees software supply-chain integrity through hermetic compilation sandboxes, zero external telemetry leakage, and bit-for-bit reproducible artifact builds.",
      architectureTitle: "Hermetic Sandbox Architecture",
      architecturePoints: [
        "Zero-Egress Policy: Network interfaces are isolated during build phases to prevent dependency poisoning.",
        "Reproducible Compilers: Certified builds of GCC 14, Clang 18, Rust 1.81, and Go 1.23.",
        "NIST SP 800-218 (SSDF) Compliance: End-to-end provenance generation with in-toto attestations."
      ],
      capabilities: [
        { title: "Hermetic Compilation", desc: "Builds produce bit-identical binaries across disparate build nodes." },
        { title: "Zero Telemetry Leaks", desc: "Zero outbound network connections during active coding sessions." },
        { title: "Supply Chain Attestation", desc: "In-toto and Cosign attestations generated automatically." }
      ],
      specifications: [
        { label: "Supported Languages", value: "C/C++, Rust, Go, Python, TypeScript" },
        { label: "Compliance Benchmark", value: "NIST SP 800-218 (SSDF) & SLSA Level 3" }
      ]
    },
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/pureide/versions",
        summary: "Retrieve certified hermetic toolchain versions",
        authRequired: false,
        responses: [
          {
            status: 200,
            description: "Active compiler versions",
            example: { ideVersion: "3.1.0-pure", toolchains: { gcc: "14.2.0", clang: "18.1.8", rustc: "1.81.0", golang: "1.23.2" } }
          }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/pureide/versions"'
      }
    ]
  },
  {
    id: "pureos",
    name: "PureOS",
    tagline: "Zero-Trust CIS-Hardened Container OS & Immutable Base Distro",
    icon: <PureOsIcon size={36} />,
    accentColor: "#10B981",
    specDoc: "pureos.md",
    quickStart: {
      title: "Hardened Container Deployment in 60 Seconds",
      description: "Pull and verify minimal attack surface base images cryptographically signed with Cosign keyless signatures.",
      steps: [
        {
          label: "1. Pull Hardened PureOS Base Container",
          command: "docker pull registry.exultia.tech/pureos/base:2026.1-hardened",
          codeLang: "bash",
          details: "Distroless, stripped-down base image with zero shell, zero package manager vulnerabilities."
        },
        {
          label: "2. Verify Cosign Cryptographic Signature",
          command: "cosign verify --key https://exultia.tech/keys/cosign.pub registry.exultia.tech/pureos/base:2026.1-hardened",
          codeLang: "bash",
          details: "Validates SLSA Level 3 provenance and build transparency log."
        }
      ]
    },
    productDetails: {
      overview: "PureOS provides pre-hardened container base images and immutable OS distributions built to satisfy CIS Benchmark Level 2, DISA STIG, and US Federal zero-trust guidelines.",
      architectureTitle: "Immutable Zero-Trust OS Architecture",
      architecturePoints: [
        "CIS Benchmark Level 2: Pre-configured kernel sysctl, noexec mounts, and strict seccomp/AppArmor profiles.",
        "Zero Attack Surface: Stripped of unused binaries, package managers, and debugging shells in production targets.",
        "Automated Advisory Synchronization: Base images recompiled automatically when Vantage flags upstream kernel vulnerabilities."
      ],
      capabilities: [
        { title: "Immutable Root Filesystem", desc: "Read-only container root prevents runtime binary tampering." },
        { title: "Cryptographic Provenance", desc: "Every layer is signed with Cosign and attested with SLSA Level 3." },
        { title: "Universal Orchestration", desc: "Native compatibility with Kubernetes, Docker, Nomad, and Podman." }
      ],
      specifications: [
        { label: "Base Footprint", value: "< 12 MB compressed" },
        { label: "Compliance Benchmark", value: "CIS Benchmark Level 2 & DISA STIG" },
        { label: "Registry Endpoint", value: "registry.exultia.tech/pureos" }
      ]
    },
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/pureos/images",
        summary: "List verified hardened container images, tag manifests, and Cosign digests",
        authRequired: false,
        responses: [
          {
            status: 200,
            description: "Hardened images catalog",
            example: {
              images: [
                { name: "pureos/base", tag: "2026.1-hardened", sizeMb: 11.4, cisLevel: 2, cveCount: 0 }
              ]
            }
          }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/pureos/images"'
      }
    ]
  },
  {
    id: "eris",
    name: "Eris",
    tagline: "Adversary Emulation, Intentional Vulnerability Proving Ground & Chaos Inoculation Lab",
    icon: <ErisIcon size={36} glow={false} />,
    accentColor: "#F59E0B",
    specDoc: "eris.md",
    quickStart: {
      title: "Simulating Real-World Attack Vectors & Stress Testing",
      description: "Generate self-contained reproducible bash/curl attack payloads with automated timed failsafe rollbacks.",
      steps: [
        {
          label: "1. Query Eris Inoculation Catalog",
          command: "curl -s \"https://exultia.tech/api/eris/inoculate\" | jq .",
          codeLang: "bash",
          details: "Inspect active CVE chaos scenarios (SSH RegreSSHion, XZ Backdoor, CUPS RCE, Log4Shell)."
        },
        {
          label: "2. Compile Safe Verification Script",
          command: "curl -X POST \"https://exultia.tech/api/eris/generate\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"cveId\": \"CVE-2024-6387\", \"intensity\": \"moderate\", \"failsafeMinutes\": 30}' \\\n  | jq -r .scriptContent > test_cve.sh",
          codeLang: "bash",
          details: "Generates idempotent, non-destructive test script with built-in rollback."
        },
        {
          label: "3. Run Isolated Docker Compose Attack Range",
          command: "docker compose -f range/docker-compose.yml up -d",
          codeLang: "bash",
          details: "Spins up 5-container attack simulation range for SOC/SIEM alert verification."
        }
      ]
    },
    productDetails: {
      overview: "Named after the goddess of chaos and strife, Eris safely introduces deterministic real-world vulnerability scenarios into isolated test ranges to verify endpoint defenses, SIEM alerts, and Praxis autonomous remediation routines.",
      architectureTitle: "Deterministic Chaos & Inoculation Engine",
      architecturePoints: [
        "7+ Canonical CVE Scenarios: SSH RegreSSHion (CVE-2024-6387), XZ Utils Backdoor (CVE-2024-3094), CUPS Remote Code Execution (CVE-2024-47176), Log4Shell (CVE-2021-44228), and more.",
        "Guaranteed Reversibility: Every chaos inoculation script compiles with a cryptographically paired rollback routine and configurable failsafe auto-revert timer.",
        "Multi-Container Docker Range: Ephemeral 5-container topology spanning target hosts, canary proxies, and mock C2 logging nodes.",
        "Praxis Closed-Loop Bridge: Seamlessly trigger Praxis hotpatching to verify real-time mitigation against active attack vectors."
      ],
      capabilities: [
        { title: "Failsafe Timed Auto-Rollback", desc: "Automated cron/systemd watchdog reverts mutations after test window (10m, 30m, 60m)." },
        { title: "Raw Bash & Container Payloads", desc: "Download self-contained shell scripts or run in isolated Docker Compose attack ranges." },
        { title: "Vantage Live Sync", desc: "Inoculation vectors stay synchronized with the latest Vantage KEV and high-severity feeds." }
      ],
      specifications: [
        { label: "Chaos Scenarios", value: "7+ active CVE modules & multi-container compose ranges" },
        { label: "Rollback Guarantee", value: "100% deterministic SHA-256 pre-image snapshots" },
        { label: "Platform Availability", value: "Included in Unified Platform ($100/mo Pro, $500/mo Enterprise)" }
      ]
    },
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/eris/inoculate",
        summary: "Catalog of all registered intentional vulnerability inoculation modules",
        authRequired: false,
        responses: [
          {
            status: 200,
            description: "Active inoculation vectors",
            example: { count: 7, modules: [{ cveId: "CVE-2024-6387", name: "RegreSSHion Ingress Race Condition", severity: "CRITICAL" }] }
          }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/eris/inoculate"'
      },
      {
        method: "POST",
        path: "/api/eris/generate",
        summary: "Synthesize executable bash inoculation payload with failsafe rollback timer",
        authRequired: false,
        requestBody: {
          description: "Target CVE ID and rollback configuration",
          schema: { cveId: "string", intensity: "string", failsafeMinutes: 30 }
        },
        responses: [
          {
            status: 200,
            description: "Generated verification script",
            example: { status: "success", scriptContent: "#!/usr/bin/env bash\n# Eris Inoculator..." }
          }
        ],
        curlExample: 'curl -X POST "https://exultia.tech/api/eris/generate" -H "Content-Type: application/json" -d \'{"cveId":"CVE-2024-6387","intensity":"moderate"}\''
      }
    ]
  },
  {
    id: "valkyrie",
    name: "Valkyrie",
    tagline: "On-Demand Breach & Attack Simulation, Vantage CVE Probes & Exploitability Verification",
    icon: <ValkyrieIcon size={36} glow={false} />,
    accentColor: "#06B6D4",
    specDoc: "valkyrie.md",
    quickStart: {
      title: "On-Demand Penetration Testing in 60 Seconds",
      description: "Trigger non-destructive BAS pentest probes mapped directly to Vantage CVE advisories, generating cryptographic attestation signatures and instant Praxis hotpatch recommendations.",
      steps: [
        {
          label: "1. List Active Pentest Vectors",
          command: "curl -s \"https://exultia.tech/api/valkyrie/probe\" | jq .",
          codeLang: "bash",
          details: "Inspect available attack vector modules (SSH handshake, HTTP header injection, TLS weak ciphers)."
        },
        {
          label: "2. Execute On-Demand Host Probe",
          command: "curl -X POST \"https://exultia.tech/api/valkyrie/probe\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"vectorId\": \"VALK-SSH-01\", \"targetUrl\": \"https://localhost:22\", \"intensity\": \"safe\"}'",
          codeLang: "bash",
          details: "Runs safe non-destructive verification check against specified endpoint."
        },
        {
          label: "3. Export Cryptographic Attestation Token",
          command: "curl -s \"https://exultia.tech/api/valkyrie/attestation?scanId=VALK-20261024-A1B2C3\" | jq .",
          codeLang: "bash",
          details: "Produces signed SHA-256 pentest attestation record for compliance audits."
        }
      ]
    },
    productDetails: {
      overview: "Valkyrie is an enterprise on-demand breach and attack simulation (BAS) module that verifies whether vulnerabilities detected in your Vantage threat feed are truly exploitable in your active network and workload environments.",
      architectureTitle: "Exploitability Verification & Attestation Architecture",
      architecturePoints: [
        "Safe Canary Probes: Non-destructive banner, protocol handshake, and fuzzing checks that verify exploit paths without causing service downtime.",
        "Direct Vantage Correlation: Binds target CVE intelligence directly to real-time endpoint attack surface telemetry.",
        "Bi-Directional Praxis Bridge: One click generates verified Praxis hotpatches to seal verified exploitable vectors.",
        "Eris Attack Reproduction: Instant bridge to spin up isolated Eris chaos test containers replicating the exact vulnerable state."
      ],
      capabilities: [
        { title: "On-Demand Pentest Engine", desc: "Perform immediate targeted security scans against specific CVEs across hosts, containers, and web endpoints." },
        { title: "Cryptographic Attestation", desc: "Every scan outputs a SHA-256 signed attestation token for audit readiness (SOC 2, ISO 27001)." },
        { title: "Unified Platform Member", desc: "Included in the $100/mo Pro and $500/mo Enterprise unified subscriptions alongside Vantage, Praxis, and Eris." }
      ],
      specifications: [
        { label: "Supported Attack Vectors", value: "SSH, HTTP/REST, TLS/SSL, DNS, Docker Socket, Kubernetes API" },
        { label: "Attestation Algorithm", value: "HMAC-SHA256 with timestamped cryptographic nonce" },
        { label: "Platform Availability", value: "Included in Unified Platform ($100/mo Pro, $500/mo Enterprise)" }
      ]
    },
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/valkyrie/probe",
        summary: "Query available pentest vectors and recent verification scan records",
        authRequired: false,
        responses: [
          {
            status: 200,
            description: "Vectors catalog and scan history",
            example: { count: 5, vectors: [{ id: "VALK-SSH-01", name: "SSH Insecure Banner & Protocol Handshake", severity: "HIGH" }] }
          }
        ],
        curlExample: 'curl -s "https://exultia.tech/api/valkyrie/probe"'
      },
      {
        method: "POST",
        path: "/api/valkyrie/probe",
        summary: "Execute simulated breach and attack verification scan against a target endpoint",
        authRequired: false,
        requestBody: {
          description: "Target probe vector and endpoint configuration",
          schema: { vectorId: "string", targetUrl: "string", intensity: "safe" }
        },
        responses: [
          {
            status: 200,
            description: "Verification scan results",
            example: { status: "success", scanId: "VALK-20261024-A1B2C3", targetUrl: "https://localhost:22", result: "PASSED_HARDENED" }
          }
        ],
        curlExample: 'curl -X POST "https://exultia.tech/api/valkyrie/probe" -H "Content-Type: application/json" -d \'{"vectorId":"VALK-SSH-01","targetUrl":"https://localhost:22","intensity":"safe"}\''
      }
    ]
  }
];

const PRODUCT_SUBTITLES: Record<string, string> = {
  vantage: "Threat Ingestion & Feed",
  praxis: "Autonomous Hotpatch & Rollback",
  eris: "Chaos Inoculation Testing",
  valkyrie: "Binary Hardening & Defense",
  pureide: "Dual-Kernel Web IDE",
  pureos: "Isolated MicroVM Host OS",
  axiom: "Forensic Redaction Engine"
};

export default function ResearchWikiPage() {
  const [activeProductId, setActiveProductId] = useState<string>("vantage");
  const [activeTab, setActiveTab] = useState<"simulator" | "details" | "quickstart" | "api" | "all-apis">("simulator");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const productParam = params.get("product");
      const tabParam = params.get("tab");
      if (productParam && WIKI_PRODUCTS.some(p => p.id === productParam.toLowerCase())) {
        setActiveProductId(productParam.toLowerCase());
      }
      if (tabParam && ["simulator", "details", "quickstart", "api", "all-apis"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const activeProduct = useMemo(() => {
    return WIKI_PRODUCTS.find(p => p.id === activeProductId) || WIKI_PRODUCTS[0];
  }, [activeProductId]);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  // Filtered API endpoints when search query is entered
  const filteredApis = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const matches: { product: ProductWiki; endpoint: ApiEndpoint }[] = [];
    WIKI_PRODUCTS.forEach(prod => {
      prod.apiEndpoints.forEach(ep => {
        if (
          ep.path.toLowerCase().includes(q) ||
          ep.summary.toLowerCase().includes(q) ||
          prod.name.toLowerCase().includes(q)
        ) {
          matches.push({ product: prod, endpoint: ep });
        }
      });
    });
    return matches;
  }, [searchQuery]);

  const displayedProducts = useMemo(() => {
    if (!searchQuery.trim()) return WIKI_PRODUCTS;
    const q = searchQuery.toLowerCase();
    const matched = WIKI_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.tagline.toLowerCase().includes(q) ||
      (PRODUCT_SUBTITLES[p.id] && PRODUCT_SUBTITLES[p.id].toLowerCase().includes(q))
    );
    return matched.length > 0 ? matched : WIKI_PRODUCTS;
  }, [searchQuery]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background-dark, #07090E)", color: "#E2E8F0" }}>
      {/* COMPACT TOP HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        background: "radial-gradient(ellipse at top, rgba(14, 21, 37, 0.9) 0%, rgba(7, 9, 14, 0.98) 100%)",
        padding: "2rem 1.5rem"
      }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.75rem",
                background: "rgba(0, 229, 255, 0.12)",
                color: "var(--accent-primary, #00E5FF)",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}>
                RESEARCH WIKI • LIVE LABS &amp; ARCHITECTURE
              </span>
              <span style={{ fontSize: "0.8rem", color: "#64748B" }}>•</span>
              <span style={{
                fontSize: "0.8rem",
                color: "#94A3B8",
                fontFamily: "var(--font-mono, monospace)"
              }}>
                Interactive Engineering Reference v2.6
              </span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
              margin: 0
            }}>
              EXULTIA RESEARCH WIKI
            </h1>
            <p style={{
              fontSize: "0.95rem",
              color: "#94A3B8",
              maxWidth: "850px",
              lineHeight: 1.5,
              marginTop: "0.4rem",
              marginBottom: 0
            }}>
              Unified systems engineering hub: test live compilers, threat feeds, zero-downtime hotfix rollbacks, forensic redaction engines, and explore architectural specifications and enterprise REST API schemas.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: LEFTHAND SIDEBAR + CONTENT AREA */}
      <div style={{
        maxWidth: "1600px",
        margin: "1.5rem auto",
        padding: "0 1.5rem",
        display: "flex",
        gap: "1.5rem",
        alignItems: "flex-start",
        position: "relative"
      }}>
        {/* LEFTHAND SIDEBAR */}
        <aside style={{
          width: isSidebarCollapsed ? "58px" : "310px",
          minWidth: isSidebarCollapsed ? "58px" : "310px",
          maxWidth: isSidebarCollapsed ? "58px" : "310px",
          position: "sticky",
          top: "1rem",
          maxHeight: "calc(100vh - 2rem)",
          background: "rgba(13, 19, 33, 0.85)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.2s, max-width 0.2s",
          overflowY: isSidebarCollapsed ? "hidden" : "auto",
          padding: isSidebarCollapsed ? "0.75rem 0.35rem" : "1.25rem 1rem",
          zIndex: 20
        }}>
          {isSidebarCollapsed ? (
            /* Collapsed Rail View */
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              height: "100%"
            }}>
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(0, 229, 255, 0.12)",
                  border: "1px solid rgba(0, 229, 255, 0.3)",
                  color: "var(--accent-primary, #00E5FF)",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
                title="Expand Wiki Sidebar"
              >
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => {
                  setIsSidebarCollapsed(false);
                }}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#94A3B8",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer"
                }}
                title="Search Engines & APIs"
              >
                <Search size={16} />
              </button>

              <div style={{ width: "24px", height: "1px", background: "rgba(255, 255, 255, 0.1)", margin: "4px 0" }} />

              {WIKI_PRODUCTS.map(p => {
                const isSelected = p.id === activeProductId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveProductId(p.id)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: isSelected ? `${p.accentColor}25` : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? `1px solid ${p.accentColor}` : "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: isSelected ? `0 0 10px ${p.accentColor}44` : "none",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                    title={`${p.name} - ${PRODUCT_SUBTITLES[p.id] || "Wiki"}`}
                  >
                    <div style={{ transform: "scale(0.85)" }}>{p.icon}</div>
                  </button>
                );
              })}

              <div style={{ width: "24px", height: "1px", background: "rgba(255, 255, 255, 0.1)", margin: "4px 0", marginTop: "auto" }} />

              <Link
                href="/faq"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  color: "#34D399",
                  display: "grid",
                  placeItems: "center",
                  textDecoration: "none"
                }}
                title="Technical FAQ"
              >
                <BookOpen size={16} />
              </Link>
            </div>
          ) : (
            /* Expanded Full Sidebar */
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }}>
              {/* Sidebar Header with Collapse */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 800,
                  color: "var(--accent-primary, #00E5FF)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase"
                }}>
                  WIKI NAVIGATOR
                </span>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    width: "26px",
                    height: "26px",
                    display: "grid",
                    placeItems: "center",
                    color: "#94A3B8",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  title="Collapse Sidebar"
                >
                  <ChevronLeft size={14} />
                </button>
              </div>

              {/* SEARCH INPUT */}
              <div style={{ position: "relative" }}>
                <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                <input
                  type="text"
                  placeholder="Search engines & APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 30px 9px 32px",
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "0.82rem",
                    fontFamily: "var(--font-mono, monospace)",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#94A3B8",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      padding: "2px 4px"
                    }}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* SECTION: ENGINES & MODULES */}
              <div>
                <div style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span>Engines &amp; Modules</span>
                  <span style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "#94A3B8",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    fontSize: "0.68rem"
                  }}>
                    {displayedProducts.length}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {displayedProducts.map(p => {
                    const isSelected = p.id === activeProductId;
                    return (
                      <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <button
                          onClick={() => {
                            setActiveProductId(p.id);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 10px",
                            borderRadius: "8px",
                            border: isSelected 
                              ? `1px solid ${p.accentColor}` 
                              : "1px solid rgba(255, 255, 255, 0.06)",
                            background: isSelected 
                              ? `linear-gradient(135deg, ${p.accentColor}20 0%, rgba(15, 23, 42, 0.85) 100%)` 
                              : "rgba(15, 23, 42, 0.4)",
                            boxShadow: isSelected ? `0 0 12px ${p.accentColor}25` : "none",
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <div style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            background: isSelected ? `${p.accentColor}30` : "rgba(255, 255, 255, 0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                          }}>
                            <div style={{ transform: "scale(0.8)" }}>{p.icon}</div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: "0.88rem",
                              fontWeight: 700,
                              color: isSelected ? "#FFFFFF" : "#CBD5E1",
                              fontFamily: "var(--font-display, sans-serif)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between"
                            }}>
                              <span>{p.name}</span>
                              {isSelected && (
                                <span style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  background: p.accentColor,
                                  boxShadow: `0 0 6px ${p.accentColor}`
                                }} />
                              )}
                            </div>
                            <div style={{
                              fontSize: "0.7rem",
                              color: isSelected ? "#94A3B8" : "#64748B",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}>
                              {PRODUCT_SUBTITLES[p.id] || "Wiki & Simulator"}
                            </div>
                          </div>
                        </button>

                        {isSelected && (
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                            marginLeft: "16px",
                            paddingLeft: "10px",
                            borderLeft: `2px solid ${p.accentColor}44`,
                            marginTop: "2px",
                            marginBottom: "6px"
                          }}>
                            {[
                              { id: "simulator" as const, label: "Lab Simulator", icon: Sparkles },
                              { id: "details" as const, label: "Architecture & Specs", icon: BookOpen },
                              { id: "quickstart" as const, label: "Quick-Start Guide", icon: Terminal },
                              { id: "api" as const, label: `API Reference (${p.apiEndpoints.length})`, icon: Code2 }
                            ].map(sub => {
                              const isSubActive = activeTab === sub.id;
                              const SubIcon = sub.icon;
                              return (
                                <button
                                  key={sub.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveProductId(p.id);
                                    setActiveTab(sub.id);
                                  }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "5px 8px",
                                    borderRadius: "6px",
                                    fontSize: "0.76rem",
                                    fontWeight: isSubActive ? 700 : 500,
                                    color: isSubActive ? "#FFFFFF" : "#94A3B8",
                                    background: isSubActive ? `${p.accentColor}25` : "transparent",
                                    border: isSubActive ? `1px solid ${p.accentColor}55` : "1px solid transparent",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    width: "100%",
                                    transition: "all 0.12s ease"
                                  }}
                                >
                                  <SubIcon size={13} color={isSubActive ? p.accentColor : "#64748B"} />
                                  <span style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                  }}>
                                    {sub.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                  href="/faq"
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
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <BookOpen size={13} color="#34D399" />
                    <span>Technical FAQ</span>
                  </span>
                  <ArrowRight size={12} color="#64748B" />
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
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Shield size={13} color="#38BDF8" />
                    <span>Platform Plans ($100)</span>
                  </span>
                  <ArrowRight size={12} color="#64748B" />
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* SEARCH RESULTS OVERLAY (IF QUERY ENTERED) */}
          {searchQuery.trim() !== "" && (
            <div style={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(0, 229, 255, 0.3)",
              borderRadius: "12px",
              padding: "1.25rem",
              marginBottom: "1.5rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  Search Results for "{searchQuery}" ({filteredApis.length} API endpoints found)
                </h3>
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94A3B8",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Clear Search
                </button>
              </div>
              {filteredApis.length === 0 ? (
                <div style={{ color: "#94A3B8", fontSize: "0.85rem" }}>No matching API endpoints found. Try searching for "feed", "download", "exam", or "stats".</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filteredApis.map(({ product, endpoint }, i) => (
                    <div key={i} style={{
                      padding: "10px 12px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      flexWrap: "wrap"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: "4px",
                          background: endpoint.method === "GET" ? "rgba(6, 182, 212, 0.2)" : "rgba(16, 185, 129, 0.2)",
                          color: endpoint.method === "GET" ? "#22D3EE" : "#34D399"
                        }}>
                          {endpoint.method}
                        </span>
                        <code style={{ color: "#FFFFFF", fontSize: "0.85rem" }}>{endpoint.path}</code>
                        <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>({product.name})</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveProductId(product.id);
                          setActiveTab("api");
                          setSearchQuery("");
                        }}
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#FFFFFF",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          cursor: "pointer"
                        }}
                      >
                        View in Wiki →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SLIM BREADCRUMB BAR */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.88rem",
            color: "#94A3B8",
            marginBottom: "1.25rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
          }}>
            <span style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "var(--font-display, sans-serif)" }}>
              {activeProduct.name}
            </span>
            <span style={{ color: "#64748B" }}>/</span>
            <span style={{ color: activeProduct.accentColor, fontWeight: 600 }}>
              {activeTab === "simulator" ? "Interactive Lab Simulator" :
               activeTab === "details" ? "Architecture & Specs" :
               activeTab === "quickstart" ? "Quick-Start Guide" :
               `API & cURL Reference (${activeProduct.apiEndpoints.length})`}
            </span>
          </div>

        {/* TAB 0: INTERACTIVE LAB SIMULATOR */}
        {activeTab === "simulator" && (
          <ProductSimulators productId={activeProduct.id} accentColor={activeProduct.accentColor} />
        )}

        {/* TAB 1: QUICK-START GUIDE */}
        {activeTab === "quickstart" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{
              background: "rgba(15, 23, 42, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1.5rem"
            }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem" }}>
                {activeProduct.quickStart.title}
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {activeProduct.quickStart.description}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {activeProduct.quickStart.steps.map((step, idx) => (
                  <div key={idx} style={{
                    background: "rgba(10, 15, 26, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "10px",
                    padding: "1.25rem"
                  }}>
                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#F8FAFC", marginBottom: "0.5rem" }}>
                      {step.label}
                    </div>
                    {step.details && (
                      <div style={{ fontSize: "0.82rem", color: "#64748B", marginBottom: "0.75rem" }}>
                        {step.details}
                      </div>
                    )}
                    {step.command && (
                      <div style={{ position: "relative" }}>
                        <pre style={{
                          background: "#05070B",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "8px",
                          padding: "12px 14px",
                          overflowX: "auto",
                          color: "#38BDF8",
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.85rem",
                          lineHeight: 1.5,
                          margin: 0
                        }}>
                          <code>{step.command}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(step.command!, `step-${idx}`)}
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "8px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            color: "#FFFFFF",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          {copiedText === `step-${idx}` ? (
                            <>
                              <Check size={12} color="#10B981" />
                              <span style={{ color: "#10B981" }}>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXTENSIVE PRODUCT DETAILS */}
        {activeTab === "details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{
              background: "rgba(15, 23, 42, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1.5rem"
            }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem" }}>
                Product Overview
              </h3>
              <p style={{ color: "#CBD5E1", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                {activeProduct.productDetails.overview}
              </p>

              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: activeProduct.accentColor, marginBottom: "0.75rem" }}>
                {activeProduct.productDetails.architectureTitle}
              </h4>
              <ul style={{ margin: "0 0 1.5rem 1.25rem", padding: 0, color: "#94A3B8", lineHeight: 1.7 }}>
                {activeProduct.productDetails.architecturePoints.map((pt, i) => (
                  <li key={i} style={{ marginBottom: "6px" }}>{pt}</li>
                ))}
              </ul>

              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>
                Key Technical Capabilities
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {activeProduct.productDetails.capabilities.map((cap, i) => (
                  <div key={i} style={{
                    padding: "14px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "8px"
                  }}>
                    <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.95rem", marginBottom: "4px" }}>
                      {cap.title}
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                      {cap.desc}
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.75rem" }}>
                Operational Specifications & SLAs
              </h4>
              <div style={{
                background: "#080C14",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                overflow: "hidden"
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <tbody>
                    {activeProduct.productDetails.specifications.map((spec, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <td style={{ padding: "10px 14px", color: "#94A3B8", width: "35%", fontWeight: 600 }}>
                          {spec.label}
                        </td>
                        <td style={{ padding: "10px 14px", color: "#F8FAFC", fontFamily: "var(--font-mono, monospace)" }}>
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETE API DOCUMENTATION */}
        {activeTab === "api" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {activeProduct.apiEndpoints.map((ep, i) => (
              <div key={i} style={{
                background: "rgba(15, 23, 42, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden"
              }}>
                {/* ENDPOINT HEADER */}
                <div style={{
                  padding: "1rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: ep.method === "GET" ? "rgba(6, 182, 212, 0.2)" : "rgba(16, 185, 129, 0.2)",
                      color: ep.method === "GET" ? "#22D3EE" : "#34D399",
                      border: ep.method === "GET" ? "1px solid rgba(6, 182, 212, 0.4)" : "1px solid rgba(16, 185, 129, 0.4)"
                    }}>
                      {ep.method}
                    </span>
                    <code style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#FFFFFF"
                    }}>
                      {ep.path}
                    </code>
                    {ep.authRequired ? (
                      <span style={{
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-mono, monospace)",
                        background: "rgba(234, 179, 8, 0.15)",
                        color: "#EAB308",
                        border: "1px solid rgba(234, 179, 8, 0.3)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <Key size={10} /> Auth Required
                      </span>
                    ) : (
                      <span style={{
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-mono, monospace)",
                        background: "rgba(148, 163, 184, 0.1)",
                        color: "#94A3B8",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        padding: "2px 6px",
                        borderRadius: "4px"
                      }}>
                        Public / Community
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => copyToClipboard(ep.curlExample, `curl-${i}`)}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    {copiedText === `curl-${i}` ? (
                      <>
                        <Check size={12} color="#10B981" />
                        <span style={{ color: "#10B981" }}>cURL Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy cURL</span>
                      </>
                    )}
                  </button>
                </div>

                {/* ENDPOINT BODY */}
                <div style={{ padding: "1.25rem" }}>
                  <p style={{ color: "#CBD5E1", fontSize: "0.92rem", marginBottom: "1rem", lineHeight: 1.5 }}>
                    {ep.summary}
                  </p>

                  {/* QUERY PARAMETERS TABLE */}
                  {ep.queryParams && ep.queryParams.length > 0 && (
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
                        QUERY PARAMETERS
                      </div>
                      <div style={{ background: "#05070A", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "8px", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                          <thead>
                            <tr style={{ background: "rgba(255, 255, 255, 0.03)", textAlign: "left", color: "#64748B" }}>
                              <th style={{ padding: "8px 12px" }}>Parameter</th>
                              <th style={{ padding: "8px 12px" }}>Type</th>
                              <th style={{ padding: "8px 12px" }}>Required</th>
                              <th style={{ padding: "8px 12px" }}>Description</th>
                              <th style={{ padding: "8px 12px" }}>Example</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ep.queryParams.map((param, pIdx) => (
                              <tr key={pIdx} style={{ borderTop: "1px solid rgba(255, 255, 255, 0.04)" }}>
                                <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono, monospace)", color: "#38BDF8", fontWeight: 600 }}>
                                  {param.name}
                                </td>
                                <td style={{ padding: "8px 12px", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                                  {param.type}
                                </td>
                                <td style={{ padding: "8px 12px" }}>
                                  {param.required ? (
                                    <span style={{ color: "#F43F5E", fontWeight: 700 }}>Yes</span>
                                  ) : (
                                    <span style={{ color: "#64748B" }}>No</span>
                                  )}
                                </td>
                                <td style={{ padding: "8px 12px", color: "#CBD5E1" }}>
                                  {param.description}
                                </td>
                                <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono, monospace)", color: "#A855F7" }}>
                                  {param.example}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* REQUEST BODY SCHEMA (IF PRESENT) */}
                  {ep.requestBody && (
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
                        REQUEST BODY (JSON)
                      </div>
                      <pre style={{
                        background: "#05070B",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "#F8FAFC",
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.82rem",
                        overflowX: "auto",
                        margin: 0
                      }}>
                        <code>{JSON.stringify(ep.requestBody.schema, null, 2)}</code>
                      </pre>
                    </div>
                  )}

                  {/* SAMPLE RESPONSE PAYLOAD */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94A3B8" }}>SAMPLE RESPONSE</span>
                      <span style={{
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-mono, monospace)",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#34D399",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        fontWeight: 700
                      }}>
                        {ep.responses[0].status} OK
                      </span>
                    </div>
                    <pre style={{
                      background: "#05070B",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      color: "#94A3B8",
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.82rem",
                      overflowX: "auto",
                      margin: 0,
                      maxHeight: "260px"
                    }}>
                      <code>{JSON.stringify(ep.responses[0].example, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  </div>
);
}
