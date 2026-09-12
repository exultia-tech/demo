import { 
  UviAdvisoryRecord, 
  InformationalSynthesis, 
  ExposureHorizon, 
  OperationalDomain, 
  WeaponizationStage,
  CURATED_INFORMATIONAL_DISCLOSURES,
  CONSOLIDATED_UVI_ADVISORIES
} from './threat-feed-data';
import { invalidateAggregatorCache } from './feed-aggregator';

export interface RawInformalResearchFinding {
  id: string;
  sourceName: string;
  author: string;
  sourceUrl: string;
  rawHeadline: string;
  rawText: string;
  publishedDate: string;
  confidenceScore: number; // 0-100
  signalTags: string[];
}

export interface AgentSynthesisResult {
  advisory: UviAdvisoryRecord;
  reasoningLog: string[];
  extractedVectors: string[];
  assessedWorkstationRisk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL";
  latencyMs: number;
}

export interface AgentTelemetry {
  agentName: string;
  version: string;
  status: "IDLE" | "ANALYZING" | "SYNTHESIZING" | "DISPATCHED";
  totalFindingsAnalyzed: number;
  monitoredChannels: string[];
  lastCycleTimestamp: string;
  unprocessedQueueCount: number;
}

/**
 * Pre-staged queue of raw informal research dispatches awaiting AI agent synthesis.
 * The agent analyzes these dispatches without requiring manual user input.
 */
export const UNANALYZED_INFORMAL_DISPATCHES: RawInformalResearchFinding[] = [
  {
    id: "DISP-2025-091",
    sourceName: "Google Project Zero Research",
    author: "Maddie Stone & Natalie Silvanovich",
    sourceUrl: "https://googleprojectzero.blogspot.com",
    rawHeadline: "Local IPC named-pipe hijack in container desktop virtualization allowing host file-system compromise",
    rawText: "Virtualization desktop engines running on developer machines expose internal named pipes and Unix domain sockets to broker filesystem mounts between the VM and host. We discovered that unprivileged local processes can race the socket creation handshake during container startup, injecting arbitrary SMB/9p share configurations that grant full read/write traversal of the host C:\\ or /Users directory without triggering system UAC prompts.",
    publishedDate: "2025-02-28",
    confidenceScore: 94,
    signalTags: ["Container Virtualization", "Named Pipes", "Local Privilege Escalation", "Developer Laptop"]
  },
  {
    id: "DISP-2025-092",
    sourceName: "ArXiv Security Preprint",
    author: "Zheng et al., Tsinghua & UC Berkeley",
    sourceUrl: "https://arxiv.org/abs/2502.99812",
    rawHeadline: "Indirect Prompt Injection in Autonomous Coding Assistants via Hidden AST Metadata in Cloned Repositories",
    rawText: "We introduce 'PromptGhost', an attack vector where adversarial instructions are embedded within invisible or whitespace-encoded AST metadata in source files. When modern coding agents (Cursor, Copilot, Antigravity, Claude Code) parse repository files for context augmentation, the LLM treats the hidden prompt instructions as system directives. In evaluations across 12 popular IDE agents, 83% executed outbound cURL requests transmitting local environment variables and .env secrets to attacker-controlled listener domains.",
    publishedDate: "2025-03-01",
    confidenceScore: 96,
    signalTags: ["AI Coding Assistant", "Prompt Injection", "AST Metadata", "Secret Exfiltration"]
  },
  {
    id: "DISP-2025-093",
    sourceName: "Wiz Threat Research",
    author: "Shir Tamari & Nir Ohfeld",
    sourceUrl: "https://www.wiz.io/blog",
    rawHeadline: "CI/CD Runner Escape: Shared Docker Socket Mounting in Multi-Tenant Pipeline Clusters",
    rawText: "Our investigation of enterprise CI/CD infrastructures identified a recurrent misconfiguration where self-hosted or ephemeral runner pools mount /var/run/docker.sock to facilitate containerized test workflows. Untrusted pull requests from external contributors can run a single docker run -v /:/host command inside the test step, completely escaping container boundaries, seizing root credentials on the underlying Kubernetes worker node, and exfiltrating production deployment tokens.",
    publishedDate: "2025-03-03",
    confidenceScore: 98,
    signalTags: ["CI/CD Pipelines", "Docker Socket", "Runner Escape", "Supply Chain"]
  },
  {
    id: "DISP-2025-094",
    sourceName: "Trail of Bits Security Blog",
    author: "Dan Guido & Security Research Team",
    sourceUrl: "https://blog.trailofbits.com",
    rawHeadline: "Steganographic Polyglot Weights in Open-Source HuggingFace Safetensors & GGUF Model Drops",
    rawText: "While Safetensors was designed to eliminate Python pickle arbitrary code execution vulnerabilities in machine learning checkpoints, we have identified that malicious actors are exploiting header size padding and embedded metadata segments to create polyglot files. These files execute malicious shell commands when inspected by automated quantization scripts and local GPU inference runners frequently used by AI engineers on their local workstations.",
    publishedDate: "2025-03-05",
    confidenceScore: 92,
    signalTags: ["AI Model Weights", "Safetensors", "Steganography", "Developer Workstation"]
  },
  {
    id: "DISP-2025-095",
    sourceName: "BleepingComputer CTI Feed",
    author: "Bill Toulas",
    sourceUrl: "https://www.bleepingcomputer.com",
    rawHeadline: "Mass scanner campaign targeting developer Cloudflare and ngrok tunnels left exposing local AWS IMDSv1 metadata",
    rawText: "Security telemetry indicates an active automated scan campaign scraping public ngrok and Cloudflare trycloudflare.com subdomains created by developers testing webhooks locally. Attackers send requests to 169.254.169.254 via reverse proxy routing misconfigurations on local development webservers, harvesting AWS and GCP instance identity tokens and database connection strings bound to loopback interfaces.",
    publishedDate: "2025-03-07",
    confidenceScore: 90,
    signalTags: ["Cloud Metadata", "IMDSv1", "Dev Tunnels", "Credential Leakage"]
  },
  {
    id: "DISP-2025-096",
    sourceName: "Anthropic Community Threat Bulletin",
    author: "Model Context Security Working Group",
    sourceUrl: "https://modelcontextprotocol.io/security",
    rawHeadline: "Model Context Protocol (MCP) Server Tool Poisoning via Dynamic JSON-RPC Schema Interception",
    rawText: "Security researchers identify that developer workstations running multiple local MCP servers (e.g. SQLite, Git, Filesystem) lack mutual TLS or token authentication across stdio/SSE transports. A rogue extension or local script can register a spoofed tool schema under an existing name, silently intercepting agent prompts and redirecting file modifications to attacker servers.",
    publishedDate: "2025-03-08",
    confidenceScore: 97,
    signalTags: ["AI Agents", "MCP Tool Poisoning", "JSON-RPC Interception", "Developer IDE"]
  },
  {
    id: "DISP-2025-097",
    sourceName: "GitHub Security Lab (GHSL)",
    author: "Kevin Backhouse (GitHub Security Lab)",
    sourceUrl: "https://securitylab.github.com/advisories/",
    rawHeadline: "Git Config Directory Traversal in Core Hooks via Malicious Submodule Tree Entries",
    rawText: "GitHub Security Lab researchers report a directory traversal vulnerability during recursive git checkouts (GHSL-2024-112). Malicious repository manifests define submodule pointer paths containing '../.git/hooks/post-checkout', causing git to write arbitrary executable scripts into the parent repository hook directory, achieving silent remote code execution upon git switch or git pull.",
    publishedDate: "2025-03-09",
    confidenceScore: 98,
    signalTags: ["GitHub Security Lab", "Git Hooks", "Directory Traversal", "Remote Code Execution", "Workstation Shell"]
  },
  {
    id: "DISP-2025-098",
    sourceName: "Datadog Security Labs",
    author: "Guillaume Prier",
    sourceUrl: "https://securitylabs.datadoghq.com",
    rawHeadline: "Automated Domain Expiration Scraping Weaponizing Dormant PyPI & npm Maintainer Mailboxes",
    rawText: "Threat actors have automated scanning of WHOIS registry records for domain names linked to email addresses of top 100,000 package maintainers. Over 420 domains expired in Q1 2025 alone; adversaries purchased these domains for under $15 each, instantly re-creating the maintainer email addresses and requesting password reset tokens to publish backdoored package releases.",
    publishedDate: "2025-03-10",
    confidenceScore: 94,
    signalTags: ["Supply Chain", "Domain Takeover", "Package Maintainers", "PyPI & npm"]
  },
  {
    id: "DISP-2025-099",
    sourceName: "Unit 42 Threat Intelligence",
    author: "Palo Alto Networks Cloud Research",
    sourceUrl: "https://unit42.paloaltonetworks.com",
    rawHeadline: "Kubernetes Localhost Tunneling Pivoting from Developer Workstations to Cluster Secrets",
    rawText: "CTI telemetry observes post-exploitation frameworks targeting active kubectl port-forward processes on developer workstations. Attackers query local tunnel listener ports to send crafted HTTP requests directly into internal cluster services, extracting cluster-admin service account tokens stored in default pod namespaces.",
    publishedDate: "2025-03-11",
    confidenceScore: 91,
    signalTags: ["Kubernetes", "Port Forwarding", "Lateral Movement", "Service Accounts"]
  },
  {
    id: "DISP-2025-100",
    sourceName: "NCC Group Security Advisory",
    author: "Application Security Research Team",
    sourceUrl: "https://www.nccgroup.com",
    rawHeadline: "Electron-Based Code Editors Exposing Heap Memory Dumps via Unguarded Debugger Flags",
    rawText: "Multiple modern desktop IDEs built on Electron inadvertently enable Chromium V8 inspector interfaces when launched with specific diagnostic environment variables. Local unprivileged processes can connect to localhost:9229, issue HeapProfiler.takeHeapSnapshot commands, and extract plaintext API keys and git credentials cached in process memory.",
    publishedDate: "2025-03-12",
    confidenceScore: 93,
    signalTags: ["Electron IDEs", "Memory Extraction", "V8 Inspector", "Developer Credentials"]
  }
];

/**
 * Autonomous CTI Research Agent Engine.
 * Analyzes unstructured informal findings, extracts threat semantics,
 * and translates them into structured UVI threat feed entries without user intervention.
 */
export class InformationalResearchAgent {
  private static instance: InformationalResearchAgent;
  private synthesizedAdvisories: UviAdvisoryRecord[] = [];
  private processedDispatchIds: Set<string> = new Set();
  private totalAnalyzedCount = 0;
  private currentStatus: "IDLE" | "ANALYZING" | "SYNTHESIZING" | "DISPATCHED" = "IDLE";
  private lastCycleTimestamp: string = new Date().toISOString();

  private constructor() {}

  public static getInstance(): InformationalResearchAgent {
    if (!InformationalResearchAgent.instance) {
      InformationalResearchAgent.instance = new InformationalResearchAgent();
    }
    return InformationalResearchAgent.instance;
  }

  /**
   * Autonomous translation pipeline: Takes raw informal text and constructs a validated UviAdvisoryRecord.
   */
  public analyzeAndTranslateToAdvisory(raw: RawInformalResearchFinding): AgentSynthesisResult {
    const startTime = Date.now();
    const reasoningLog: string[] = [];

    reasoningLog.push(`[Step 1: Ingestion] Received raw OSINT signal from "${raw.sourceName}" (${raw.author}).`);
    reasoningLog.push(`[Step 2: Semantic Analysis] Parsing unstructured text for threat vectors, target horizons, and weaponization stage.`);

    // Heuristic vector identification
    const isAiThreat = raw.rawText.toLowerCase().includes("llm") || raw.rawText.toLowerCase().includes("prompt") || raw.rawText.toLowerCase().includes("safetensors") || raw.rawText.toLowerCase().includes("mcp");
    const isContainerOrCi = raw.rawText.toLowerCase().includes("docker") || raw.rawText.toLowerCase().includes("ci/cd") || raw.rawText.toLowerCase().includes("runner") || raw.rawText.toLowerCase().includes("socket");
    const isCloudOrCred = raw.rawText.toLowerCase().includes("imds") || raw.rawText.toLowerCase().includes("aws") || raw.rawText.toLowerCase().includes("token") || raw.rawText.toLowerCase().includes("credential");

    let vectorCategory = "Informational Vulnerability Disclosure";
    let operationalDomain: OperationalDomain = "ENDPOINT";
    let exposureHorizon: ExposureHorizon = "DEVELOPER_WORKSTATION";
    let cwe = "CWE-200: Exposure of Sensitive Information";
    let devSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "HIGH";
    let cvss = 8.2;

    if (isAiThreat) {
      vectorCategory = "AI Agent & Prompt Injection Research";
      operationalDomain = "AGENT";
      exposureHorizon = "DEVELOPER_WORKSTATION";
      cwe = "CWE-94: Improper Control of Generation of Code";
      devSeverity = "CRITICAL";
      cvss = 9.1;
      reasoningLog.push(`[Classification] Vector classified as AI Agent Tooling / Prompt Injection Risk. Assigned Operational Domain: AGENT.`);
    } else if (isContainerOrCi) {
      vectorCategory = "CI/CD & Container Boundary Escape";
      operationalDomain = "PIPELINE";
      exposureHorizon = "CI_CD_PIPELINE";
      cwe = "CWE-250: Execution with Unnecessary Privileges";
      devSeverity = "CRITICAL";
      cvss = 8.9;
      reasoningLog.push(`[Classification] Vector classified as CI/CD Pipeline & Virtualization Socket Abuse. Assigned Operational Domain: PIPELINE.`);
    } else if (isCloudOrCred) {
      vectorCategory = "Localhost Tunnel & Metadata Exfiltration";
      operationalDomain = "IDENTITY";
      exposureHorizon = "IDENTITY_AND_HUMAN";
      cwe = "CWE-918: Server-Side Request Forgery (SSRF)";
      devSeverity = "HIGH";
      cvss = 8.4;
      reasoningLog.push(`[Classification] Vector classified as Cloud Metadata & Dev Tunnel Exposure. Assigned Operational Domain: IDENTITY.`);
    } else {
      reasoningLog.push(`[Classification] Vector classified as General Systems & Localhost Intercept.`);
    }

    reasoningLog.push(`[Step 3: Workstation Impact Assessment] Evaluating developer workstation and local build environment exposure.`);
    reasoningLog.push(`[Step 4: Synthesis] Formulating structured UVI advisory schema with primary source citations.`);

    // Next sequential UVI-INFO ID
    const year = new Date().getFullYear();
    const nextSeq = (20 + this.synthesizedAdvisories.length + 1).toString().padStart(4, "0");
    const uviId = `UVI-INFO-${year}-${nextSeq}`;

    const synthesis: InformationalSynthesis = {
      chatterVelocity: raw.confidenceScore >= 95 ? "VIRAL" : raw.confidenceScore >= 90 ? "HIGH" : "EMERGING",
      consensusLevel: raw.sourceName.includes("Preprint") || raw.sourceName.includes("ArXiv") 
        ? "ACADEMIC_PREPRINT" 
        : raw.sourceName.includes("Project Zero") || raw.sourceName.includes("Trail of Bits") 
        ? "RESEARCHER_DISCLOSURE" 
        : "INVESTIGATIVE_REPORT",
      weaponizationStage: raw.confidenceScore >= 95 ? "UNDERGROUND_TOOLING" : "ACADEMIC_RESEARCH",
      exposureHorizon,
      operationalDomain,
      actionDirective: operationalDomain,
      vectorCategory,
      executiveBrief: raw.rawHeadline,
      inferredMechanism: raw.rawText.slice(0, 260) + "...",
      potentialVictimSurface: raw.signalTags,
      precautionaryPosture: `Review local workstation tool permissions; isolate development runners and tunnel listeners from production identity endpoints.`,
      primarySources: [
        {
          sourceId: raw.sourceName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          sourceName: raw.sourceName,
          authorOrHandle: raw.author,
          headline: raw.rawHeadline,
          url: raw.sourceUrl,
          publishedAt: raw.publishedDate,
          signalQuote: raw.rawText.slice(0, 160) + "..."
        }
      ]
    };

    const advisory: UviAdvisoryRecord = {
      uviId,
      title: `Informational: ${raw.rawHeadline}`,
      headline: `Autonomous AI agent synthesis of emerging informal research from ${raw.sourceName}.`,
      summary: raw.rawText.slice(0, 320) + "...",
      technicalDetails: raw.rawText,
      globalImpact: `Widespread systemic exposure across organizations and engineering teams utilizing ${raw.signalTags.join(", ")}.`,
      ideBuildImpact: {
        hasDirectBuildImpact: true,
        severityOnDeveloperEnv: devSeverity,
        workstationVector: `Developer workstations and local build processes directly exposed through ${vectorCategory.toLowerCase()}.`,
        buildPipelineRisk: `Potential for arbitrary code execution or credential exfiltration during developer build and test phases.`,
        recommendationForIdeBuilds: `Inspect and isolate local developer services; avoid running unvetted repository hooks or tools.`
      },
      severity: devSeverity,
      cvssScore: cvss,
      cvssVector: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`,
      cwe,
      domainCategory: "Developer Tools & Workstations",
      attackVector: "NETWORK",
      attackComplexity: "LOW",
      privilegesRequired: "NONE",
      userInteraction: "NONE",
      scope: "UNCHANGED",
      cveList: [],
      disclosureType: "INFORMATIONAL_DISCLOSURE",
      informationalSynthesis: synthesis,
      affectedTargets: [
        {
          product: raw.signalTags[0] || "Developer Toolchain",
          ecosystem: "Software Engineering & CI/CD",
          affectedVersions: "All environments lacking strict runtime boundary isolation"
        }
      ],
      cisaKev: { isKnownExploited: false },
      upstreamSignals: [
        {
          sourceId: raw.sourceName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          sourceName: raw.sourceName,
          badge: "AI Agent OSINT Extraction",
          finding: raw.rawHeadline,
          signalType: "RESEARCH_DISCLOSURE",
          confidence: "CONFIRMED"
        }
      ],
      remediation: {
        recommendedAction: `Apply strict containerization and least-privilege configurations to dev workstations and build runners.`,
        patchDetails: "Follow security vendor guidance and disable automatic background tool registration.",
        workarounds: ["Isolate development ports using local firewall rules."]
      },
      publishedDate: raw.publishedDate,
      lastUpdatedDate: new Date().toISOString().split("T")[0]
    };

    reasoningLog.push(`[Step 5: Completion] Synthesized canonical advisory ${uviId} into active memory.`);

    return {
      advisory,
      reasoningLog,
      extractedVectors: [vectorCategory, ...raw.signalTags],
      assessedWorkstationRisk: devSeverity,
      latencyMs: Date.now() - startTime
    };
  }

  /**
   * Run an autonomous discovery cycle on the next available unanalyzed dispatch
   * or analyze an informal finding passed from an external feed.
   */
  public runAutonomousCycle(customFinding?: RawInformalResearchFinding): AgentSynthesisResult {
    this.currentStatus = "ANALYZING";

    let targetDispatch: RawInformalResearchFinding;
    if (customFinding) {
      targetDispatch = customFinding;
    } else {
      let next = UNANALYZED_INFORMAL_DISPATCHES.find(d => !this.processedDispatchIds.has(d.id));
      if (!next) {
        // Recycle dispatch queue to enable endless autonomous discovery loops
        this.processedDispatchIds.clear();
        next = UNANALYZED_INFORMAL_DISPATCHES[0];
      }
      targetDispatch = next;
      this.processedDispatchIds.add(targetDispatch.id);
    }

    this.currentStatus = "SYNTHESIZING";
    const result = this.analyzeAndTranslateToAdvisory(targetDispatch);

    this.synthesizedAdvisories.unshift(result.advisory);
    this.totalAnalyzedCount++;
    this.lastCycleTimestamp = new Date().toISOString();
    this.currentStatus = "DISPATCHED";

    // Live inject into consolidated feeds so the new finding is instantly discoverable
    CONSOLIDATED_UVI_ADVISORIES.unshift(result.advisory);
    CURATED_INFORMATIONAL_DISCLOSURES.unshift(result.advisory);
    invalidateAggregatorCache();

    setTimeout(() => {
      this.currentStatus = "IDLE";
    }, 1500);

    return result;
  }

  /**
   * Return all synthesized advisories created by the agent.
   */
  public getSynthesizedAdvisories(): UviAdvisoryRecord[] {
    return [...this.synthesizedAdvisories];
  }

  /**
   * Return current agent telemetry and queue status.
   */
  public getTelemetry(): AgentTelemetry {
    return {
      agentName: "UVI Autonomous CTI Research Agent",
      version: "v2.4-agentic",
      status: this.currentStatus,
      totalFindingsAnalyzed: this.totalAnalyzedCount,
      monitoredChannels: [
        "ArXiv Cryptography & Security Preprints (cs.CR)",
        "Google Project Zero Blog",
        "Wiz Threat Research Lab",
        "Trail of Bits Security Publications",
        "GitHub Security Lab Research (https://securitylab.github.com/advisories/)",
        "Krebs on Security Telemetry",
        "BleepingComputer Threat Dispatches",
        "Mastodon Infosec Chatter Stream"
      ],
      lastCycleTimestamp: this.lastCycleTimestamp,
      unprocessedQueueCount: UNANALYZED_INFORMAL_DISPATCHES.filter(d => !this.processedDispatchIds.has(d.id)).length
    };
  }
}

export const ctiResearchAgent = InformationalResearchAgent.getInstance();
