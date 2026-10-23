"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon 
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
  FileText,
  Key,
  Database,
  Play,
  RotateCcw
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
          details: "Runs synthetic mutation, pre-image SHA-256 snapshotting, and verifies sub-second rollback (<50ms)."
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
        { label: "Local Rollback Benchmark", value: "Sub-100ms atomic restore (typical)" },
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
  }
];

export default function ResearchWikiPage() {
  const [activeProductId, setActiveProductId] = useState<string>("vantage");
  const [activeTab, setActiveTab] = useState<"simulator" | "details" | "quickstart" | "api" | "all-apis">("simulator");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

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

  return (
    <div style={{ minHeight: "100vh", background: "var(--background-dark, #07090E)", color: "#E2E8F0" }}>
      {/* HERO BANNER */}
      <div style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        background: "radial-gradient(ellipse at top, rgba(14, 21, 37, 0.9) 0%, rgba(7, 9, 14, 0.98) 100%)",
        padding: "3.5rem 1.5rem 2.5rem 1.5rem"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem", flexWrap: "wrap" }}>
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
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "0.02em",
            marginBottom: "0.75rem"
          }}>
            EXULTIA RESEARCH WIKI
          </h1>
          <p style={{
            fontSize: "1.05rem",
            color: "#94A3B8",
            maxWidth: "850px",
            lineHeight: 1.6,
            marginBottom: "1.75rem"
          }}>
            Unified systems engineering hub: test live compilers, threat feeds, zero-downtime hotfix rollbacks, forensic redaction engines, and explore architectural specifications and enterprise REST API schemas.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "1.75rem",
            textAlign: "left"
          }}>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "10px 14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Core Systems</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--accent-primary, #00E5FF)" }}>8 Products</div>
            </div>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "10px 14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Testing Rigs</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#C084FC" }}>8 Live Simulators</div>
            </div>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "10px 14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Deterministic Rollback</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#34D399" }}>Sub-50ms Local</div>
            </div>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "10px 14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Compliance Baseline</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#FDE047" }}>100% Zero-Trust</div>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div style={{ maxWidth: "680px", position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
            <input
              type="text"
              placeholder="Search specifications, simulators, API endpoints (e.g. rollback, sandbox, /api/patches/feed)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontSize: "0.92rem",
                fontFamily: "var(--font-mono, monospace)",
                outline: "none",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
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
                  color: "#64748B",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS OVERLAY (IF QUERY ENTERED) */}
      {searchQuery.trim() !== "" && (
        <div style={{ maxWidth: "1280px", margin: "1.5rem auto", padding: "0 1.5rem" }}>
          <div style={{
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(0, 229, 255, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>
              Search Results for "{searchQuery}" ({filteredApis.length} API endpoints found)
            </h3>
            {filteredApis.length === 0 ? (
              <div style={{ color: "#94A3B8", fontSize: "0.9rem" }}>No matching API endpoints found. Try searching for "feed", "download", "exam", or "stats".</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredApis.map(({ product, endpoint }, i) => (
                  <div key={i} style={{
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "4px",
                        background: endpoint.method === "GET" ? "rgba(6, 182, 212, 0.2)" : "rgba(16, 185, 129, 0.2)",
                        color: endpoint.method === "GET" ? "#22D3EE" : "#34D399"
                      }}>
                        {endpoint.method}
                      </span>
                      <code style={{ color: "#FFFFFF", fontSize: "0.9rem" }}>{endpoint.path}</code>
                      <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>({product.name})</span>
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
                        padding: "5px 12px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
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
        </div>
      )}

      {/* MAIN WIKI INTERFACE */}
      <div style={{ maxWidth: "1280px", margin: "2rem auto", padding: "0 1.5rem" }}>
        {/* PRODUCT SELECTION BAR */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "10px",
          marginBottom: "2rem"
        }}>
          {WIKI_PRODUCTS.map(p => {
            const isSelected = p.id === activeProductId;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProductId(p.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: isSelected 
                    ? `1px solid ${p.accentColor}` 
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  background: isSelected 
                    ? `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.4) 100%)` 
                    : "rgba(15, 23, 42, 0.5)",
                  boxShadow: isSelected ? `0 0 16px ${p.accentColor}33` : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: isSelected ? "#FFFFFF" : "#CBD5E1",
                    fontFamily: "var(--font-display, sans-serif)"
                  }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748B" }}>Wiki & Docs</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE PRODUCT HEADER */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "14px",
          padding: "1.75rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${activeProduct.accentColor}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {activeProduct.icon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  margin: 0
                }}>
                  {activeProduct.name}
                </h2>
                <span style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono, monospace)",
                  background: `${activeProduct.accentColor}22`,
                  color: activeProduct.accentColor,
                  border: `1px solid ${activeProduct.accentColor}55`,
                  padding: "2px 7px",
                  borderRadius: "4px",
                  fontWeight: 700
                }}>
                  ENTERPRISE
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", margin: "4px 0 0 0" }}>
                {activeProduct.tagline}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono, monospace)",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#94A3B8"
              }}
            >
              <FileText size={14} color="var(--accent-primary, #00E5FF)" />
              <span>Specification: {activeProduct.specDoc}</span>
            </span>
          </div>
        </div>

        {/* SUB-TABS (SIMULATOR, ARCHITECTURE, QUICKSTART, API REFERENCE) */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "1.75rem",
          gap: "8px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => setActiveTab("simulator")}
            style={{
              padding: "10px 18px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "simulator" ? `2px solid ${activeProduct.accentColor}` : "2px solid transparent",
              color: activeTab === "simulator" ? "#FFFFFF" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Sparkles size={16} color={activeTab === "simulator" ? activeProduct.accentColor : "#94A3B8"} />
            Interactive Lab Simulator
          </button>

          <button
            onClick={() => setActiveTab("details")}
            style={{
              padding: "10px 18px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "details" ? `2px solid ${activeProduct.accentColor}` : "2px solid transparent",
              color: activeTab === "details" ? "#FFFFFF" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <BookOpen size={16} color={activeTab === "details" ? activeProduct.accentColor : "#94A3B8"} />
            Architecture &amp; Specs
          </button>

          <button
            onClick={() => setActiveTab("quickstart")}
            style={{
              padding: "10px 18px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "quickstart" ? `2px solid ${activeProduct.accentColor}` : "2px solid transparent",
              color: activeTab === "quickstart" ? "#FFFFFF" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Terminal size={16} color={activeTab === "quickstart" ? activeProduct.accentColor : "#94A3B8"} />
            Quick-Start Guide
          </button>

          <button
            onClick={() => setActiveTab("api")}
            style={{
              padding: "10px 18px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "api" ? `2px solid ${activeProduct.accentColor}` : "2px solid transparent",
              color: activeTab === "api" ? "#FFFFFF" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Code2 size={16} color={activeTab === "api" ? activeProduct.accentColor : "#94A3B8"} />
            API &amp; cURL Reference ({activeProduct.apiEndpoints.length})
          </button>
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
      </div>
    </div>
  );
}
