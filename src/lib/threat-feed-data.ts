export type ThreatSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type DomainCategory =
  | "Operating Systems & Kernels"
  | "Cloud & Container Infrastructure"
  | "Enterprise & Web Frameworks"
  | "Networking, Protocols & Cryptography"
  | "Language Runtimes & Toolchains"
  | "Databases & Storage"
  | "Supply Chain & Malware"
  | "Developer Tools & Workstations";

export interface UpstreamSignalContribution {
  sourceId: string;
  sourceName: string;
  badge: string;
  finding: string;
  signalType: 
    | "CVE_RECORD" 
    | "ACTIVE_EXPLOITATION" 
    | "AST_IOC" 
    | "TYPOSQUAT" 
    | "BEHAVIORAL_ALERT" 
    | "REACHABILITY" 
    | "HYGIENE_SCORE" 
    | "INFORMATIONAL_CHATTER" 
    | "RESEARCH_DISCLOSURE"
    | "C2_BEACON"
    | "IP_REPUTATION"
    | "PHISHING_URL"
    | "EPSS_PERCENTILE";
  confidence: "CONFIRMED" | "PROBABLE" | "THEORETICAL";
}

export interface IdeBuildImpactAssessment {
  hasDirectBuildImpact: boolean;
  severityOnDeveloperEnv: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INDIRECT";
  workstationVector: string; // How this manifests on a developer laptop, runner, or IDE
  buildPipelineRisk: string; // Risk to CI/CD pipelines, compiler toolchains, or local dev servers
  recommendationForIdeBuilds: string; // Specific governance policy, IDE sandbox setting, or build flag
}

export type DisclosureType = "VULNERABILITY_ADVISORY" | "INFORMATIONAL_DISCLOSURE";

export interface InformationalSourceSignal {
  sourceId: string;
  sourceName: string;
  authorOrHandle?: string;
  headline: string;
  url: string;
  publishedAt: string;
  signalQuote: string;
}

export type WeaponizationStage = 
  | "ACTIVE_CAMPAIGNS"
  | "UNDERGROUND_TOOLING"
  | "ACADEMIC_RESEARCH"
  | "THEORETICAL_VECTOR";

export type ExposureHorizon =
  | "DEVELOPER_WORKSTATION"
  | "CI_CD_PIPELINE"
  | "IDENTITY_AND_HUMAN"
  | "SUPPLY_CHAIN_NETWORK";

export type OperationalDomain =
  | "PATCH"
  | "ENDPOINT"
  | "IDENTITY"
  | "SUPPLY"
  | "PIPELINE"
  | "AGENT"
  | "NETWORK";

export type ActionDirective = OperationalDomain | string;

export interface InformationalSynthesis {
  chatterVelocity: "VIRAL" | "HIGH" | "MODERATE" | "EMERGING";
  consensusLevel: 
    | "INVESTIGATIVE_REPORT"
    | "ACADEMIC_PREPRINT"
    | "RESEARCHER_DISCLOSURE"
    | "COMMUNITY_CHATTER"
    | "UNDERGROUND_SIGNAL";
  weaponizationStage: WeaponizationStage;
  exposureHorizon: ExposureHorizon;
  operationalDomain: OperationalDomain;
  actionDirective: ActionDirective;
  vectorCategory: string;
  executiveBrief: string;
  inferredMechanism: string;
  potentialVictimSurface: string[];
  precautionaryPosture: string;
  primarySources: InformationalSourceSignal[];
}

export interface UviAdvisoryRecord {
  uviId: string; // Standardized: UVI-YYYY-MM-000001
  legacyUviId?: string; // Original cross-reference or legacy identifier (e.g. UVI-2024-3094, UVI-MAL-2025-0104)
  title: string;
  headline: string;
  summary: string;
  technicalDetails: string;
  globalImpact: string; // Broad enterprise / infrastructure impact (general awareness)
  ideBuildImpact: IdeBuildImpactAssessment; // Developer workstation & IDE build impact
  severity: ThreatSeverity;
  cvssScore: number;
  cvssVector: string;
  cwe: string;
  domainCategory: DomainCategory;
  attackVector: "NETWORK" | "LOCAL" | "ADJACENT" | "PHYSICAL";
  attackComplexity: "LOW" | "HIGH";
  privilegesRequired: "NONE" | "LOW" | "HIGH";
  userInteraction: "NONE" | "REQUIRED";
  scope: "UNCHANGED" | "CHANGED";
  cveList: string[];
  ghsaId?: string;
  osvId?: string;
  msrcId?: string;
  affectedTargets: {
    product: string;
    ecosystem: string;
    affectedVersions: string;
    fixedInVersion?: string;
    purl?: string;
  }[];
  cisaKev: {
    isKnownExploited: boolean;
    dateAdded?: string;
    ransomwareUse?: boolean;
    notes?: string;
  };
  upstreamSignals: UpstreamSignalContribution[];
  remediation: {
    recommendedAction: string;
    patchDetails: string;
    workarounds?: string[];
  };
  publishedDate: string;
  lastUpdatedDate: string;
  disclosureType?: DisclosureType;
  informationalSynthesis?: InformationalSynthesis;
}

export interface ObservationalAssessment {
  operationalDomain: OperationalDomain;
  actionDirective: ActionDirective;
  weaponizationStage: WeaponizationStage;
  exposureHorizon: ExposureHorizon;
  signalVelocity: string;
  signalConsensus: string;
  chatterVelocity: "VIRAL" | "HIGH" | "MODERATE" | "EMERGING";
  consensusLevel: string;
  executiveBrief: string;
  inferredMechanism: string;
  precautionaryPosture: string;
  potentialVictimSurface: string[];
  vectorCategory: string;
}

export function getOperationalDomainBadge(domain?: string) {
  switch (domain) {
    case "PATCH":
    case "EXPEDITE_HOTFIX":
      return {
        label: "⚡ PATCH",
        shortLabel: "⚡ PATCH",
        bg: "rgba(249, 115, 22, 0.15)",
        border: "rgba(249, 115, 22, 0.35)",
        text: "#FDBA74",
        dot: "#F97316"
      };
    case "ENDPOINT":
    case "QUARANTINE_AND_REVOKE":
    case "HARDEN_WORKSTATION":
    case "INTERVENE_NOW":
      return {
        label: "🛡️ ENDPOINT",
        shortLabel: "🛡️ ENDPOINT",
        bg: "rgba(239, 68, 68, 0.15)",
        border: "rgba(239, 68, 68, 0.35)",
        text: "#FCA5A5",
        dot: "#EF4444"
      };
    case "IDENTITY":
    case "ROTATE_SECRETS":
      return {
        label: "🔐 IDENTITY",
        shortLabel: "🔐 IDENTITY",
        bg: "rgba(236, 72, 153, 0.15)",
        border: "rgba(236, 72, 153, 0.35)",
        text: "#F472B6",
        dot: "#EC4899"
      };
    case "SUPPLY":
    case "PIN_DEPENDENCY":
      return {
        label: "📦 SUPPLY",
        shortLabel: "📦 SUPPLY",
        bg: "rgba(14, 165, 233, 0.15)",
        border: "rgba(14, 165, 233, 0.35)",
        text: "#38BDF8",
        dot: "#0EA5E9"
      };
    case "PIPELINE":
    case "LOCKDOWN_PIPELINE":
    case "AUDIT_CONFIG":
      return {
        label: "🔒 PIPELINE",
        shortLabel: "🔒 PIPELINE",
        bg: "rgba(168, 85, 247, 0.15)",
        border: "rgba(168, 85, 247, 0.35)",
        text: "#C084FC",
        dot: "#A855F7"
      };
    case "AGENT":
    case "CONSTRAIN_AGENTS":
      return {
        label: "🤖 AGENT",
        shortLabel: "🤖 AGENT",
        bg: "rgba(16, 185, 129, 0.15)",
        border: "rgba(16, 185, 129, 0.35)",
        text: "#34D399",
        dot: "#10B981"
      };
    case "NETWORK":
    case "SEGREGATE_NETWORK":
    case "SITUATIONAL_AWARENESS":
      return {
        label: "🧱 NETWORK",
        shortLabel: "🧱 NETWORK",
        bg: "rgba(99, 102, 241, 0.15)",
        border: "rgba(99, 102, 241, 0.35)",
        text: "#818CF8",
        dot: "#6366F1"
      };
    default:
      return {
        label: "🌐 SECURITY",
        shortLabel: "🌐 SECURITY",
        bg: "rgba(148, 163, 184, 0.15)",
        border: "rgba(148, 163, 184, 0.3)",
        text: "#CBD5E1",
        dot: "#94A3B8"
      };
  }
}

export const getActionDirectiveBadge = getOperationalDomainBadge;

export function getWeaponizationStageLabel(stage?: string): string {
  switch (stage) {
    case "ACTIVE_CAMPAIGNS":
      return "Active Campaigns in Wild";
    case "UNDERGROUND_TOOLING":
      return "Tooling in Underground Channels";
    case "ACADEMIC_RESEARCH":
      return "Academic & Lab Demonstration";
    case "THEORETICAL_VECTOR":
      return "Theoretical / Pre-Exploit Vector";
    default:
      return "Observational Signal";
  }
}

export function getExposureHorizonLabel(horizon?: string): string {
  switch (horizon) {
    case "DEVELOPER_WORKSTATION":
      return "Developer Workstation & Local Tools";
    case "CI_CD_PIPELINE":
      return "CI/CD Runners & Build Pipeline";
    case "IDENTITY_AND_HUMAN":
      return "Identity, SSO & IT Helpdesk";
    case "SUPPLY_CHAIN_NETWORK":
      return "Package Registry & Network Routing";
    default:
      return "Developer Ecosystem";
  }
}

export interface ExploitationRealityBadge {
  label: string;
  subLabel: string;
  statusType: "KEV" | "RANSOMWARE" | "ZERO_DAY" | "BOTNET_C2" | "SCANNER" | "POC" | "BUILD_EXPLOIT" | "THEORETICAL";
  bg: string;
  border: string;
  text: string;
  dot: string;
}

export function getExploitationRealityBadge(record: UviAdvisoryRecord): ExploitationRealityBadge {
  const obs = getRecordObservationalAssessment(record);

  // 0. Informational Research & Emerging Informal Disclosures
  if (record.disclosureType === "INFORMATIONAL_DISCLOSURE") {
    return {
      label: "📡 INFORMAL RESEARCH",
      subLabel: record.informationalSynthesis?.vectorCategory || "Autonomous Agent Synthesis",
      statusType: "THEORETICAL",
      bg: "rgba(139, 92, 246, 0.18)",
      border: "rgba(139, 92, 246, 0.45)",
      text: "#C4B5FD",
      dot: "#8B5CF6"
    };
  }

  // 1. Confirmed Ransomware Campaign
  if (record.cisaKev?.ransomwareUse) {
    return {
      label: "🏴‍☠️ RANSOMWARE VECTOR",
      subLabel: "Active In-The-Wild Campaign",
      statusType: "RANSOMWARE",
      bg: "rgba(220, 38, 38, 0.2)",
      border: "rgba(239, 68, 68, 0.55)",
      text: "#FCA5A5",
      dot: "#EF4444"
    };
  }

  // 2. Confirmed In-The-Wild Exploitation (CISA KEV)
  if (record.cisaKev?.isKnownExploited) {
    return {
      label: "🚨 IN-THE-WILD EXPLOITED",
      subLabel: "CISA KEV Confirmed",
      statusType: "KEV",
      bg: "rgba(239, 68, 68, 0.16)",
      border: "rgba(239, 68, 68, 0.45)",
      text: "#FCA5A5",
      dot: "#EF4444"
    };
  }

  // 3. Active Zero-Day
  const isZeroDay = 
    record.title.toLowerCase().includes("zero-day") || 
    record.headline.toLowerCase().includes("zero-day") || 
    record.summary.toLowerCase().includes("zero-day");
  if (isZeroDay) {
    return {
      label: "⚡ ACTIVE ZERO-DAY",
      subLabel: "Exploited Prior to Patch",
      statusType: "ZERO_DAY",
      bg: "rgba(249, 115, 22, 0.2)",
      border: "rgba(249, 115, 22, 0.5)",
      text: "#FDBA74",
      dot: "#F97316"
    };
  }

  // 4. Active Botnet C2 / Malware Infrastructure
  const isC2orBotnet = record.upstreamSignals.some(s => 
    s.signalType === "C2_BEACON" || 
    s.sourceId === "feodo_tracker" || 
    s.sourceId === "threatfox" || 
    s.sourceId === "montysecurity_c2" ||
    s.sourceId === "urlhaus" ||
    s.sourceId === "malwarebazaar"
  );
  if (isC2orBotnet) {
    return {
      label: "🤖 ACTIVE BOTNET / C2",
      subLabel: "Live Malicious Command Node",
      statusType: "BOTNET_C2",
      bg: "rgba(217, 70, 239, 0.18)",
      border: "rgba(217, 70, 239, 0.45)",
      text: "#F0ABFC",
      dot: "#D946EF"
    };
  }

  // 5. Mass Port / Brute Force Scanning Spray
  const isScanner = record.upstreamSignals.some(s =>
    s.sourceId === "blocklist_de" ||
    s.sourceId === "ipsum" ||
    s.sourceId === "sans_isc" ||
    s.sourceId === "emerging_threats" ||
    s.sourceId === "greensnow" ||
    s.sourceId === "greynoise"
  );
  if (isScanner) {
    return {
      label: "🌪️ MASS SCANNER SPRAY",
      subLabel: "Automated Recon & Brute Force",
      statusType: "SCANNER",
      bg: "rgba(245, 158, 11, 0.18)",
      border: "rgba(245, 158, 11, 0.45)",
      text: "#FDE68A",
      dot: "#F59E0B"
    };
  }

  // 6. Direct Developer / Toolchain / IDE Poisoning
  if (record.ideBuildImpact?.hasDirectBuildImpact || record.affectedTargets.some(t => t.ecosystem.includes("VS Code") || t.ecosystem.includes("GitHub Actions"))) {
    return {
      label: "💻 TOOLCHAIN THREAT",
      subLabel: "Direct Build & Developer Risk",
      statusType: "BUILD_EXPLOIT",
      bg: "rgba(59, 130, 246, 0.18)",
      border: "rgba(59, 130, 246, 0.45)",
      text: "#93C5FD",
      dot: "#3B82F6"
    };
  }

  // 7. Weaponized Exploit Kit or Underground Tooling
  if (obs.weaponizationStage === "ACTIVE_CAMPAIGNS") {
    return {
      label: "☣️ WEAPONIZED EXPLOIT",
      subLabel: "Active In-Wild Campaigns",
      statusType: "POC",
      bg: "rgba(234, 179, 8, 0.18)",
      border: "rgba(234, 179, 8, 0.45)",
      text: "#FDE047",
      dot: "#EAB308"
    };
  }

  if (obs.weaponizationStage === "UNDERGROUND_TOOLING") {
    return {
      label: "💥 UNDERGROUND EXPLOIT",
      subLabel: "Underground Attack Tooling",
      statusType: "POC",
      bg: "rgba(234, 179, 8, 0.16)",
      border: "rgba(234, 179, 8, 0.4)",
      text: "#FDE047",
      dot: "#EAB308"
    };
  }

  // 8. Theoretical / Vulnerability Disclosure Only
  return {
    label: "🔬 THEORETICAL ADVISORY",
    subLabel: "No In-Wild Exploit Observed",
    statusType: "THEORETICAL",
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.25)",
    text: "#CBD5E1",
    dot: "#94A3B8"
  };
}

export function formatRelativeAge(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const pubDate = new Date(dateStr);
    if (isNaN(pubDate.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    if (diffMs < 0) return "Recent";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1d ago";
    if (diffDays < 30) return `${diffDays}d ago`;

    const diffMonths = Math.floor(diffDays / 30.4375);
    if (diffMonths < 12) return `${diffMonths}mo ago`;

    const diffYears = Math.floor(diffDays / 365.25);
    const remMonths = diffMonths % 12;
    if (diffYears < 2 && remMonths > 0) return `${diffYears}y ${remMonths}m ago`;
    return `${diffYears}y ago`;
  } catch {
    return "";
  }
}

export function getRecordObservationalAssessment(record: UviAdvisoryRecord): ObservationalAssessment {
  if (record.informationalSynthesis) {
    const domain = record.informationalSynthesis.operationalDomain || (record.informationalSynthesis.actionDirective as any) || "ENDPOINT";
    return {
      operationalDomain: domain,
      actionDirective: domain,
      weaponizationStage: record.informationalSynthesis.weaponizationStage,
      exposureHorizon: record.informationalSynthesis.exposureHorizon,
      signalVelocity: record.informationalSynthesis.chatterVelocity === "VIRAL" ? "🔥 VIRAL" : `⚡ ${record.informationalSynthesis.chatterVelocity}`,
      signalConsensus: record.informationalSynthesis.consensusLevel.replace(/_/g, " "),
      chatterVelocity: record.informationalSynthesis.chatterVelocity,
      consensusLevel: record.informationalSynthesis.consensusLevel,
      executiveBrief: record.informationalSynthesis.executiveBrief,
      inferredMechanism: record.informationalSynthesis.inferredMechanism,
      precautionaryPosture: record.informationalSynthesis.precautionaryPosture,
      potentialVictimSurface: record.informationalSynthesis.potentialVictimSurface || [],
      vectorCategory: record.informationalSynthesis.vectorCategory
    };
  }

  const isCisaKev = Boolean(record.cisaKev?.isKnownExploited);
  const isMalware = record.domainCategory === "Supply Chain & Malware" || 
                    record.cveList.length === 0 || 
                    record.title.toLowerCase().includes("malware") || 
                    record.uviId.includes("-MAL-");
  const hasBuildImpact = Boolean(record.ideBuildImpact?.hasDirectBuildImpact);
  const devSev = record.ideBuildImpact?.severityOnDeveloperEnv;
  const isCritical = record.severity === "CRITICAL";
  const isHigh = record.severity === "HIGH";

  const targetProducts = record.affectedTargets ? record.affectedTargets.map(t => (t.product + " " + t.ecosystem).toLowerCase()).join(" ") : "";
  const titleAndDesc = (record.title + " " + record.headline + " " + record.summary + " " + record.cwe).toLowerCase();

  const isAiAgentTarget = titleAndDesc.includes("mcp") || 
                          titleAndDesc.includes("model context protocol") || 
                          titleAndDesc.includes("prompt injection") || 
                          titleAndDesc.includes("ai assistant") || 
                          titleAndDesc.includes("copilot") || 
                          titleAndDesc.includes("llm");

  const isSecretTarget = titleAndDesc.includes("credential") || 
                         titleAndDesc.includes("secret") || 
                         titleAndDesc.includes("token") || 
                         titleAndDesc.includes("oauth") || 
                         titleAndDesc.includes("saml") || 
                         titleAndDesc.includes("session hijacking") || 
                         titleAndDesc.includes("private key") ||
                         titleAndDesc.includes("infostealer") ||
                         record.cwe.toLowerCase().includes("authentication") || 
                         record.cwe.toLowerCase().includes("credential");

  const isIdeTarget = targetProducts.includes("vs code") || 
                      targetProducts.includes("visual studio") || 
                      targetProducts.includes("intellij") || 
                      targetProducts.includes("jetbrains") || 
                      targetProducts.includes("extension") || 
                      targetProducts.includes("editor") ||
                      targetProducts.includes("compiler") ||
                      targetProducts.includes("debugger") ||
                      titleAndDesc.includes("ide") ||
                      titleAndDesc.includes("workspace trust");

  const isCiTarget = targetProducts.includes("github actions") || 
                     targetProducts.includes("gitlab ci") || 
                     targetProducts.includes("runner") || 
                     targetProducts.includes("docker") || 
                     targetProducts.includes("kubernetes") || 
                     targetProducts.includes("jenkins") || 
                     targetProducts.includes("terraform") ||
                     titleAndDesc.includes("pipeline") ||
                     titleAndDesc.includes("ci/cd") ||
                     titleAndDesc.includes("container escape");

  const isNetworkTarget = record.domainCategory === "Networking, Protocols & Cryptography" || 
                          titleAndDesc.includes("bgp") || 
                          titleAndDesc.includes("dns") || 
                          titleAndDesc.includes("botnet") || 
                          titleAndDesc.includes("proxy") || 
                          titleAndDesc.includes("firewall");

  const isSupplyChainTarget = record.domainCategory === "Supply Chain & Malware" || 
                              (record.affectedTargets && record.affectedTargets.some(t => ["npm", "pypi", "maven", "go", "crates.io", "packagist", "rubygems"].includes(t.ecosystem.toLowerCase()))) ||
                              titleAndDesc.includes("typosquat") ||
                              titleAndDesc.includes("safetensors") ||
                              titleAndDesc.includes("package");

  // 1. Operational Security Domain (Single-Word SecOps Posture)
  let operationalDomain: OperationalDomain;
  if (isAiAgentTarget) {
    operationalDomain = "AGENT";
  } else if (isMalware || (isIdeTarget && hasBuildImpact && (devSev === "CRITICAL" || devSev === "HIGH"))) {
    operationalDomain = "ENDPOINT";
  } else if (isSecretTarget && (isCritical || isHigh || hasBuildImpact)) {
    operationalDomain = "IDENTITY";
  } else if (isSupplyChainTarget && (isHigh || isCritical)) {
    operationalDomain = "SUPPLY";
  } else if ((isCiTarget && (hasBuildImpact || isCritical || isHigh)) || record.domainCategory === "Cloud & Container Infrastructure") {
    operationalDomain = "PIPELINE";
  } else if (isNetworkTarget && (isHigh || isCritical)) {
    operationalDomain = "NETWORK";
  } else if (isCisaKev || (isCritical && record.attackVector === "NETWORK")) {
    operationalDomain = "PATCH";
  } else if (isCritical || isHigh) {
    operationalDomain = "PATCH";
  } else {
    operationalDomain = "ENDPOINT";
  }

  const actionDirective = operationalDomain;

  // 2. Weaponization Stage
  let weaponizationStage: WeaponizationStage;
  const knownActiveCves = ["CVE-2024-38063", "CVE-2024-4577", "CVE-2021-44228", "CVE-2023-4863", "CVE-2024-6387", "CVE-2024-21626", "CVE-2024-3094"];
  if (isCisaKev || isMalware || (record.cveList && record.cveList.some(c => knownActiveCves.includes(c)))) {
    weaponizationStage = "ACTIVE_CAMPAIGNS";
  } else if (isCritical || (record.upstreamSignals && record.upstreamSignals.some(s => s.signalType === "ACTIVE_EXPLOITATION" || s.finding.toLowerCase().includes("poc") || s.finding.toLowerCase().includes("weaponized") || s.finding.toLowerCase().includes("exploit")))) {
    weaponizationStage = "UNDERGROUND_TOOLING";
  } else if (record.attackComplexity === "LOW") {
    weaponizationStage = "UNDERGROUND_TOOLING";
  } else if (record.attackComplexity === "HIGH") {
    weaponizationStage = "ACADEMIC_RESEARCH";
  } else {
    weaponizationStage = "THEORETICAL_VECTOR";
  }

  // 3. Exposure Horizon
  let exposureHorizon: ExposureHorizon;
  if (isIdeTarget || (hasBuildImpact && (devSev === "CRITICAL" || devSev === "HIGH"))) {
    exposureHorizon = "DEVELOPER_WORKSTATION";
  } else if (isCiTarget || (hasBuildImpact && record.ideBuildImpact?.buildPipelineRisk && record.ideBuildImpact.buildPipelineRisk.length > 30)) {
    exposureHorizon = "CI_CD_PIPELINE";
  } else if (isSecretTarget || record.cwe.toLowerCase().includes("authentication") || record.cwe.toLowerCase().includes("credential")) {
    exposureHorizon = "IDENTITY_AND_HUMAN";
  } else if (isSupplyChainTarget) {
    exposureHorizon = "SUPPLY_CHAIN_NETWORK";
  } else if (hasBuildImpact) {
    exposureHorizon = "DEVELOPER_WORKSTATION";
  } else {
    exposureHorizon = "SUPPLY_CHAIN_NETWORK";
  }

  // 4. Signal & Corroboration
  let signalVelocity: string;
  let signalConsensus: string;
  if (isCisaKev) {
    signalVelocity = "🔥 IN THE WILD";
    signalConsensus = "CISA KEV Mandatory Remediation";
  } else if (isMalware) {
    signalVelocity = "🔥 LIVE MALWARE";
    signalConsensus = "OpenSSF & Socket.dev Threat Lab";
  } else if (record.upstreamSignals && record.upstreamSignals.length >= 3) {
    signalVelocity = "⚡ MULTI-FEED";
    signalConsensus = record.upstreamSignals.map(s => s.sourceName.replace(" Database", "").replace(" (NVD)", "").replace(" Security", "")).slice(0, 2).join(" & ") + " Verified";
  } else {
    signalVelocity = isCritical ? "⚡ HIGH CHATTER" : "⚡ VERIFIED";
    signalConsensus = (record.upstreamSignals && record.upstreamSignals[0]?.sourceName ? record.upstreamSignals[0].sourceName : "Standard Feed").replace(" Database", "").replace(" (NVD)", "") + " Advisory";
  }

  const chatterVelocity: "VIRAL" | "HIGH" | "MODERATE" | "EMERGING" =
    isCisaKev || isMalware ? "VIRAL" : isCritical ? "HIGH" : isHigh ? "MODERATE" : "EMERGING";

  const executiveBrief = `${record.summary} Operational Mandate: ${
    operationalDomain === "ENDPOINT"
      ? "Immediate endpoint containment. Quarantine suspicious processes, isolate host, and enforce IDE trust."
      : operationalDomain === "PATCH"
      ? "Deploy vendor security patch or upgrade package to eliminate active remote exploit path."
      : operationalDomain === "IDENTITY"
      ? "Rotate compromised API keys, session tokens, and developer credentials across identity providers."
      : operationalDomain === "SUPPLY"
      ? "Pin package versions to cryptographic hashes, audit upstream sources, and disable remote code execution."
      : operationalDomain === "PIPELINE"
      ? "Harden CI/CD runners, enforce immutable cache keys, and lock workflow action versions."
      : operationalDomain === "AGENT"
      ? "Enforce human-in-the-loop authorization for AI tools, restrict agent workspace write permissions, and sandbox egress."
      : "Enforce strict network egress boundaries, segment development subnets, and monitor for routing anomalies."
  }`;

  const inferredMechanism = record.technicalDetails || `${record.cwe} attack vector executed via ${record.attackVector.toLowerCase()} channel with ${record.attackComplexity.toLowerCase()} complexity.`;

  const precautionaryPosture = record.remediation?.recommendedAction || record.ideBuildImpact?.recommendationForIdeBuilds || (
    operationalDomain === "ENDPOINT"
      ? "Immediately remove malicious extension or package, terminate suspicious processes, and enforce IDE Workspace Trust."
      : operationalDomain === "PATCH"
      ? "Apply latest vendor security patch or upgrade to fixed version immediately."
      : operationalDomain === "IDENTITY"
      ? "Revoke active session tokens, invalidate stored developer credentials, and enable hardware-backed MFA."
      : operationalDomain === "PIPELINE"
      ? "Pin CI/CD actions to full commit SHAs, restrict runner environment variables, and isolate build caches."
      : operationalDomain === "SUPPLY"
      ? "Pin exact dependency versions in lockfiles, audit companion scripts, and disable remote code execution."
      : operationalDomain === "NETWORK"
      ? "Block suspicious egress ports, audit BGP routing, and isolate developer networks from unauthenticated listeners."
      : operationalDomain === "AGENT"
      ? "Disable automated background tool-calling in AI assistant settings and enforce human-in-the-loop approval."
      : "Review vulnerability details and incorporate into regular security maintenance cycles."
  );

  const potentialVictimSurface = record.affectedTargets && record.affectedTargets.length > 0
    ? record.affectedTargets.map(t => `${t.product} (${t.ecosystem})`)
    : [record.domainCategory];

  return {
    operationalDomain,
    actionDirective,
    weaponizationStage,
    exposureHorizon,
    signalVelocity,
    signalConsensus,
    chatterVelocity,
    consensusLevel: signalConsensus,
    executiveBrief,
    inferredMechanism,
    precautionaryPosture,
    potentialVictimSurface,
    vectorCategory: operationalDomain
  };
}

export type FeedCategory =
  | "Malware, C2 & Botnets"
  | "Phishing & Fraud"
  | "IP Reputation, Scanners & Network Telemetry"
  | "Vulnerabilities & Exploitation"
  | "Multi-Indicator Hubs & Aggregators";

export interface PublicFeedSource {
  id: string;
  name: string;
  category: FeedCategory;
  scope: string;
  access: string;
  status: "Active" | "Synced" | "Realtime";
  refreshRate: string;
  coverage: string;
  homepageUrl: string;
  icon: string;
  recordsIngested: number;
}

export const UVI_PUBLIC_FEED_SOURCES: PublicFeedSource[] = [
  // ==========================================
  // 1. Malware, C2 & Botnets
  // ==========================================
  {
    id: "urlhaus",
    name: "URLhaus (abuse.ch)",
    category: "Malware, C2 & Botnets",
    scope: "Malware Distribution Sites & Payload Delivery URLs",
    access: "Public API / CSV / JSON Feed",
    status: "Realtime",
    refreshRate: "Every 5 Minutes",
    coverage: "Global community project from abuse.ch tracking, analyzing, and disseminating active malicious URLs used for malware distribution and dropper execution.",
    homepageUrl: "https://urlhaus.abuse.ch/",
    icon: "☣️",
    recordsIngested: 1650000
  },
  {
    id: "threatfox",
    name: "ThreatFox (abuse.ch)",
    category: "Malware, C2 & Botnets",
    scope: "Indicators of Compromise (IoCs) & C2 Infrastructure",
    access: "Public API / Export Feeds",
    status: "Realtime",
    refreshRate: "Every 10 Minutes",
    coverage: "Authoritative open repository from abuse.ch cataloging indicators of compromise (IoCs), malware hashes, domains, and botnet IPs shared by security analysts.",
    homepageUrl: "https://threatfox.abuse.ch/",
    icon: "🦊",
    recordsIngested: 820000
  },
  {
    id: "feodo_tracker",
    name: "Feodo Tracker (abuse.ch)",
    category: "Malware, C2 & Botnets",
    scope: "Botnet Command & Control (C2) Server IP Blocklists",
    access: "Public Blocklists / IP Feeds",
    status: "Realtime",
    refreshRate: "Hourly",
    coverage: "Specialized abuse.ch intelligence tracking active botnet C2 servers associated with Dridex, Emotet, QakBot, TrickBot, and Cobalt Strike relays.",
    homepageUrl: "https://feodotracker.abuse.ch/",
    icon: "🤖",
    recordsIngested: 145000
  },
  {
    id: "malwarebazaar",
    name: "MalwareBazaar (abuse.ch)",
    category: "Malware, C2 & Botnets",
    scope: "Malware Sample Binaries, Hashes & YARA Rules",
    access: "Public REST API / Bulk Downloads",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Community-driven malware exchange operated by abuse.ch sharing classified malware binaries, signatures, unpacked stages, and weaponized artifacts.",
    homepageUrl: "https://bazaar.abuse.ch/",
    icon: "🗄️",
    recordsIngested: 950000
  },
  {
    id: "montysecurity_c2",
    name: "MontySecurity C2-Tracker",
    category: "Malware, C2 & Botnets",
    scope: "JARM & Shodan C2 Infrastructure Tracking",
    access: "Public Git / Raw Feeds",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Automated threat scanner tracking active C2 frameworks including Cobalt Strike, Sliver, Havoc, Mythic, and Brute Ratel via TLS/JARM fingerprinting.",
    homepageUrl: "https://github.com/montysecurity/C2-Tracker",
    icon: "🎯",
    recordsIngested: 38000
  },
  {
    id: "botvrij_eu",
    name: "Botvrij.eu",
    category: "Malware, C2 & Botnets",
    scope: "Botnet IoCs, Malicious Domains & Suricata/Snort Rules",
    access: "Public Community Feeds",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Open threat intelligence initiative providing curated lists of malicious IPs, fast-flux domains, and detection rules to neutralize cybercrime syndicates.",
    homepageUrl: "https://www.botvrij.eu/",
    icon: "🛡️",
    recordsIngested: 210000
  },
  {
    id: "openssf_malicious",
    name: "OpenSSF Malicious Packages Repository",
    category: "Malware, C2 & Botnets",
    scope: "Supply Chain Malware, Typosquats & Token Harvesters",
    access: "Public API / Git",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Real-time automated ingestion of confirmed malicious packages uploaded to public open-source registries (npm, PyPI, RubyGems).",
    homepageUrl: "https://github.com/ossf/malicious-packages",
    icon: "📦",
    recordsIngested: 22000
  },
  {
    id: "socket_dev",
    name: "Socket.dev Threat Intelligence",
    category: "Malware, C2 & Botnets",
    scope: "Behavioral Heuristics, Env/SSH Theft & Shell Spawning",
    access: "Public Research / API",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Detects runtime behavioral anomalies: reading ~/.ssh, accessing environment variables, and spawning background processes in packages.",
    homepageUrl: "https://socket.dev",
    icon: "🔌",
    recordsIngested: 45000
  },
  {
    id: "aqua_nautilus",
    name: "Aqua Nautilus Cloud Threat Research",
    category: "Malware, C2 & Botnets",
    scope: "Cloud Native, Container Escapes & Droppers",
    access: "Public Feed",
    status: "Active",
    refreshRate: "Weekly",
    coverage: "Targeted threat intelligence tracking container breakouts, Kubernetes misconfigurations, and supply chain droppers.",
    homepageUrl: "https://www.aquasec.com/research",
    icon: "🌊",
    recordsIngested: 11200
  },
  {
    id: "jfrog_research",
    name: "JFrog Security Research Advisories",
    category: "Malware, C2 & Botnets",
    scope: "AST Call-Graph Reachability & Real-World Exploitability",
    access: "Public Advisories",
    status: "Active",
    refreshRate: "Weekly",
    coverage: "Separates theoretical dependency vulnerabilities from executable attack paths across software architectures.",
    homepageUrl: "https://jfrog.com/security",
    icon: "🐸",
    recordsIngested: 6800
  },

  // ==========================================
  // 2. Phishing & Fraud
  // ==========================================
  {
    id: "openphish",
    name: "OpenPhish",
    category: "Phishing & Fraud",
    scope: "Zero-Day Phishing URLs & Credential Harvesting Kits",
    access: "Public Community Feed",
    status: "Realtime",
    refreshRate: "Continuous",
    coverage: "Autonomous detection system identifying active phishing campaigns, deceptive OAuth consent screens, and developer credential harvesting kits.",
    homepageUrl: "https://openphish.com/",
    icon: "🎣",
    recordsIngested: 340000
  },
  {
    id: "phishtank",
    name: "PhishTank",
    category: "Phishing & Fraud",
    scope: "Verified Community Phishing URL Database",
    access: "Public REST API / XML / CSV",
    status: "Active",
    refreshRate: "Hourly",
    coverage: "Collaborative clearinghouse for phishing data with verified community votes on suspicious links and fraudulent brand impersonations.",
    homepageUrl: "https://phishtank.org/",
    icon: "🐟",
    recordsIngested: 1280000
  },

  // ==========================================
  // 3. IP Reputation, Scanners & Network Telemetry
  // ==========================================
  {
    id: "sans_dshield",
    name: "SANS ISC (DShield)",
    category: "IP Reputation, Scanners & Network Telemetry",
    scope: "Distributed Firewall Honeypot Telemetry & Top Attackers",
    access: "Public API / XML / Text Feeds",
    status: "Realtime",
    refreshRate: "Hourly",
    coverage: "Global internet storm center analyzing distributed honeypot sensor logs, active port scanning surges, and top attacking IP subnets.",
    homepageUrl: "https://isc.sans.edu/",
    icon: "🌪️",
    recordsIngested: 520000
  },
  {
    id: "blocklist_de",
    name: "Blocklist.de",
    category: "IP Reputation, Scanners & Network Telemetry",
    scope: "Fail2ban Sensor Reports (SSH, Postfix, Apache, Mail)",
    access: "Public Export Feeds",
    status: "Active",
    refreshRate: "Every 30 Minutes",
    coverage: "Real-time attack reporting service aggregating fail2ban sensor telemetry across 59,000+ servers defending against automated brute-force attacks.",
    homepageUrl: "https://www.blocklist.de/",
    icon: "⛔",
    recordsIngested: 490000
  },
  {
    id: "ipsum",
    name: "IPSum",
    category: "IP Reputation, Scanners & Network Telemetry",
    scope: "Scored IP Blacklist Aggregator (30+ Upstream Feeds)",
    access: "Public GitHub Raw Feed",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Consolidated and weighted IP reputation feed scoring suspicious and malicious addresses across 30+ publicly available blocklists.",
    homepageUrl: "https://github.com/stamparm/ipsum",
    icon: "📊",
    recordsIngested: 310000
  },
  {
    id: "tor_exit_nodes",
    name: "Tor Project Exit Addresses",
    category: "IP Reputation, Scanners & Network Telemetry",
    scope: "Tor Anonymity Network Bulk Exit Node Directory",
    access: "Public HTTPS Text Feed",
    status: "Realtime",
    refreshRate: "Every 30 Minutes",
    coverage: "Authoritative directory of active Tor exit nodes for distinguishing privacy-preserving connections from anonymous abuse campaigns.",
    homepageUrl: "https://check.torproject.org/torbulkexitlist",
    icon: "🧅",
    recordsIngested: 2800
  },
  {
    id: "talos_ip_blacklist",
    name: "Cisco Talos IP Blacklist",
    category: "IP Reputation, Scanners & Network Telemetry",
    scope: "Reputation Intelligence & Malicious Infrastructure",
    access: "Public Plaintext Feed",
    status: "Active",
    refreshRate: "Hourly",
    coverage: "Authoritative IP blacklist from Cisco Talos Intelligence Group tracking active malware distribution hosts, botnets, and malicious relays.",
    homepageUrl: "https://www.talosintelligence.com/documents/ip-blacklist",
    icon: "🦅",
    recordsIngested: 86000
  },
  {
    id: "et_open_rules",
    name: "Emerging Threats (ET Open Rules)",
    category: "IP Reputation, Scanners & Network Telemetry",
    scope: "Suricata / Snort Signature Rules & IP Reputation Feeds",
    access: "Public HTTP / Rule Feeds",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Community-driven IDS/IPS signature library providing deep packet inspection rules for zero-day exploits, trojan telemetry, and compromised hosts.",
    homepageUrl: "https://rules.emergingthreats.net/open/",
    icon: "⚡",
    recordsIngested: 420000
  },
  {
    id: "greensnow",
    name: "GreenSnow",
    category: "IP Reputation, Scanners & Network Telemetry",
    scope: "Automated Brute-Force & Attack Harvester Blocklist",
    access: "Public Text Feed",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Harvests attack telemetry from servers worldwide blocking SSH, SQL, and RDP brute-force attempts and port scan probes.",
    homepageUrl: "https://greensnow.co/",
    icon: "❄️",
    recordsIngested: 160000
  },
  {
    id: "greynoise_community",
    name: "GreyNoise Community",
    category: "IP Reputation, Scanners & Network Telemetry",
    scope: "Internet-Wide Scanners, Benign Noise & Attack Crawlers",
    access: "Public API / Query Feeds",
    status: "Realtime",
    refreshRate: "Continuous",
    coverage: "Differentiates targeted exploits from opportunistic mass-internet scanners (Shodan, Censys, masscan) and worm propagation sweeps.",
    homepageUrl: "https://www.greynoise.io/",
    icon: "📡",
    recordsIngested: 650000
  },

  // ==========================================
  // 4. Vulnerabilities & Exploitation
  // ==========================================
  {
    id: "cisa_kev",
    name: "CISA KEV Catalog",
    category: "Vulnerabilities & Exploitation",
    scope: "Active In-The-Wild Exploitation & Weaponized CVEs",
    access: "Public JSON Feed",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Authoritative catalog of vulnerabilities confirmed to be actively weaponized by advanced threat actors and ransomware syndicates.",
    homepageUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    icon: "🚨",
    recordsIngested: 1250
  },
  {
    id: "first_epss",
    name: "FIRST EPSS Data",
    category: "Vulnerabilities & Exploitation",
    scope: "Machine Learning Probability of Exploitation in the Wild",
    access: "Public REST API / Daily CSV",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Data-driven statistical model estimating the empirical probability that a software vulnerability will be weaponized in the wild within 30 days.",
    homepageUrl: "https://www.first.org/epss/data_stats",
    icon: "📈",
    recordsIngested: 260000
  },
  {
    id: "nvd_cve",
    name: "NIST National Vulnerability Database (NVD)",
    category: "Vulnerabilities & Exploitation",
    scope: "Universal Common Vulnerabilities and Exposures (CVEs)",
    access: "Public REST API 2.0",
    status: "Realtime",
    refreshRate: "Hourly",
    coverage: "Primary global index for official CVE identifiers, CVSS v3.1/v4.0 scoring, and CWE weakness taxonomy.",
    homepageUrl: "https://nvd.nist.gov",
    icon: "🏛️",
    recordsIngested: 248000
  },
  {
    id: "ghsa",
    name: "GitHub Advisory Database (GHSA)",
    category: "Vulnerabilities & Exploitation",
    scope: "Open Source Ecosystem Security Advisories",
    access: "Public GraphQL / REST",
    status: "Realtime",
    refreshRate: "Continuous",
    coverage: "Curated security bulletins spanning npm, PyPI, Go, Rust Crates, Maven, Packagist, and RubyGems.",
    homepageUrl: "https://github.com/advisories",
    icon: "🐙",
    recordsIngested: 185000
  },
  {
    id: "github_security_lab",
    name: "GitHub Security Lab (GHSL)",
    category: "Vulnerabilities & Exploitation",
    scope: "Original Security Research & Zero-Day Disclosures (GHSL)",
    access: "Public Research Advisories",
    status: "Realtime",
    refreshRate: "Continuous",
    coverage: "Original vulnerability disclosures, zero-days, and security advisories discovered by GitHub's dedicated security research team, auditing developer toolchains, CI/CD actions, language runtimes, and critical open-source libraries.",
    homepageUrl: "https://securitylab.github.com/advisories/",
    icon: "🔬",
    recordsIngested: 640
  },
  {
    id: "osv_dev",
    name: "Open Source Vulnerabilities (OSV.dev)",
    category: "Vulnerabilities & Exploitation",
    scope: "OpenSSF Standardized Aggregation Database",
    access: "Public REST API",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "OpenSSF distributed vulnerability format consolidating Linux distributions, Android, and 30+ language ecosystems.",
    homepageUrl: "https://osv.dev",
    icon: "🌐",
    recordsIngested: 310000
  },
  {
    id: "snyk_vulndb",
    name: "Snyk Open Vulnerability Database",
    category: "Vulnerabilities & Exploitation",
    scope: "Transitive Dependency Trees & Parser Vulnerabilities",
    access: "Public Database",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Deep dependency tree auditing for nested sub-dependencies in developer runtimes and cloud applications.",
    homepageUrl: "https://snyk.io/vuln",
    icon: "🐕",
    recordsIngested: 195000
  },
  {
    id: "vendor_msrc_eclipse",
    name: "Microsoft MSRC & Platform Advisories",
    category: "Vulnerabilities & Exploitation",
    scope: "Vendor Bulletins, Windows, VS Code & Platform Security",
    access: "Public Advisories",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Official security notices targeting Windows, VS Code Core, Electron, Linux WSL, and Azure.",
    homepageUrl: "https://msrc.microsoft.com",
    icon: "🏢",
    recordsIngested: 14500
  },
  {
    id: "ecosystem_dbs",
    name: "Ecosystem Advisory DBs (RustSec, Go VulnDB, PyPA)",
    category: "Vulnerabilities & Exploitation",
    scope: "Native Language Toolchain & Compiler Security",
    access: "Public DBs / Git",
    status: "Realtime",
    refreshRate: "Hourly",
    coverage: "First-party security databases from the Rust Foundation, Google Go security team, and Python Software Foundation.",
    homepageUrl: "https://rustsec.org",
    icon: "📦",
    recordsIngested: 16000
  },

  // ==========================================
  // 5. Multi-Indicator Hubs & Aggregators
  // ==========================================
  {
    id: "alienvault_otx",
    name: "AlienVault OTX",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Community Pulses, Threat Actor IoCs & Malware Campaigns",
    access: "Public REST API / SDK",
    status: "Realtime",
    refreshRate: "Continuous",
    coverage: "Global crowd-sourced threat intelligence platform with over 200,000 security professionals sharing collaborative threat pulses.",
    homepageUrl: "https://otx.alienvault.com/",
    icon: "👽",
    recordsIngested: 19500000
  },
  {
    id: "circl_misp",
    name: "CIRCL MISP Default Feeds",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "OSINT Threat Sharing, Attributes & Event Graph",
    access: "Public MISP Manifest / JSON",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "European Computer Incident Response Center (CIRCL) open threat sharing feeds standardizing cross-border incident response attributes.",
    homepageUrl: "https://www.circl.lu/doc/misp/feed-osint/",
    icon: "🔗",
    recordsIngested: 3200000
  },
  {
    id: "threatfeeds_io",
    name: "threatfeeds.io",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Directory & Status Monitor for 60+ Public Threat Feeds",
    access: "Public Directory / Aggregator",
    status: "Active",
    refreshRate: "Hourly",
    coverage: "Curated meta-index tracking live availability, formats, and updates across global open-source cyber threat intelligence feeds.",
    homepageUrl: "https://threatfeeds.io/",
    icon: "📑",
    recordsIngested: 750000
  },
  {
    id: "bertjanp_oti",
    name: "Bert-JanP Open Threat Intelligence Repository",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "GitHub CTI Repository & Blocklist Aggregations",
    access: "Public GitHub Repository",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Community repository consolidating high-fidelity OSINT threat feeds, automated extraction scripts, and threat actor infrastructure maps.",
    homepageUrl: "https://github.com/Bert-JanP/Open-threat-intelligence",
    icon: "📂",
    recordsIngested: 480000
  },
  {
    id: "trail_of_bits_vsix",
    name: "Trail of Bits Security Research & IoCs",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Static AST Analysis, Obfuscation & Binary Auditing",
    access: "Public Open Source",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Deep AST inspection heuristics, command injection vectors, and indicators of compromise (IoCs).",
    homepageUrl: "https://github.com/trailofbits/vsix-audit",
    icon: "🔬",
    recordsIngested: 8400
  },
  {
    id: "krebs_security",
    name: "Krebs on Security (Brian Krebs)",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Investigative Cybercrime, Account Takeover & Threat Actors",
    access: "Public RSS / Journalism",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "In-depth investigative journalism uncovering active underground fraud botnets, residential proxy abuses, and corporate breach patterns.",
    homepageUrl: "https://krebsonsecurity.com",
    icon: "🕵️‍♂️",
    recordsIngested: 2100
  },
  {
    id: "schneier_security",
    name: "Schneier on Security (Bruce Schneier)",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Cryptographic Analysis, AI Policy & Systemic Vectors",
    access: "Public RSS / Essays",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Authoritative expert essays dissecting cryptographic transitions, AI agent exfiltration dynamics, and policy vulnerabilities.",
    homepageUrl: "https://www.schneier.com",
    icon: "🔐",
    recordsIngested: 4800
  },
  {
    id: "bleeping_computer",
    name: "BleepingComputer",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Breaking Exploit Waves, Security News & Ransomware Tracking",
    access: "Public RSS / Journalism",
    status: "Realtime",
    refreshRate: "Continuous",
    coverage: "Authoritative real-time cybersecurity journalism reporting on zero-day weaponization, emerging cyber extortion campaigns, ransomware tactics, and threat actor campaigns.",
    homepageUrl: "https://www.bleepingcomputer.com",
    icon: "⚡",
    recordsIngested: 18500
  },
  {
    id: "underground_intel",
    name: "Underground & Dark Web Intel",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Dark Web Leak Sites, Cybercrime Forums & Telegram Extortion Channels",
    access: "Public OSINT / Telemetry / vx-underground",
    status: "Active",
    refreshRate: "Hourly",
    coverage: "Automated telemetry tracking underground cybercrime forums, illicit dark web leak sites, ransomware extortion portals, and researcher malware archives (vx-underground).",
    homepageUrl: "https://vx-underground.org/",
    icon: "🕶️",
    recordsIngested: 14200
  },
  {
    id: "project_zero",
    name: "Google Project Zero",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Zero-Day Exploit PoCs, Browser Sandboxes & Root Cause Analysis",
    access: "Public Research / Issue Tracker",
    status: "Active",
    refreshRate: "Weekly",
    coverage: "Elite technical teardowns of zero-days exploited in the wild, browser sandbox escapes, kernel race conditions, and pre-disclosure exploit research.",
    homepageUrl: "https://googleprojectzero.blogspot.com",
    icon: "🧪",
    recordsIngested: 3600
  },
  {
    id: "academic_research",
    name: "Academic Research (arXiv & IACR)",
    category: "Multi-Indicator Hubs & Aggregators",
    scope: "Cryptographic Preprints, Microarchitecture & System Security Papers",
    access: "Public Preprints / Open Access",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Preprints and peer-reviewed research papers from arXiv Computer Science (cs.CR) and the International Association for Cryptologic Research (IACR) documenting novel attack primitives.",
    homepageUrl: "https://arxiv.org/corr/cs/CR",
    icon: "🎓",
    recordsIngested: 2800
  }
];

export const CONSOLIDATED_UVI_ADVISORIES: UviAdvisoryRecord[] = [
  // 1. Apache Log4j JNDI Remote Code Execution (Log4Shell)
  {
    uviId: "UVI-2021-44228",
    title: "Apache Log4j2 JNDI Message Lookup Remote Code Execution (Log4Shell)",
    headline: "Unauthenticated remote code execution via recursive JNDI resolution in log messages across enterprise Java applications.",
    summary: "Apache Log4j2 versions 2.0-beta9 through 2.15.0 did not protect against attacker-controlled LDAP, RMI, and DNS endpoints evaluated through JNDI message lookups (${jndi:ldap://...}), allowing full remote code execution.",
    technicalDetails: "When message lookups were enabled, Log4j evaluated variable substitutions within formatted log strings. An attacker submitting crafted headers (e.g. User-Agent, X-Forwarded-For) caused the JVM to query arbitrary remote LDAP directories and execute deserialized Java bytecode payload classes.",
    globalImpact: "Catastrophic global impact affecting millions of enterprise backend services, Apache Kafka, Elasticsearch, Hadoop, Minecraft servers, and Fortune 500 corporate infrastructure.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Local Java build tools (Maven/Gradle plugins), local dev servers (Tomcat/Spring), and IDE indexing daemons logging untrusted test payloads.",
      buildPipelineRisk: "CI/CD runners executing integration tests that print unsanitized inputs to test logs risk immediate runner container compromise.",
      recommendationForIdeBuilds: "Set JVM argument -Dlog4j2.formatMsgNoLookups=true or upgrade log4j-core to 2.17.1+ in all project POMs and IDE Java runtime launch configurations."
    },
    severity: "CRITICAL",
    cvssScore: 10.0,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    cwe: "CWE-502: Deserialization of Untrusted Data",
    domainCategory: "Enterprise & Web Frameworks",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: ["CVE-2021-44228", "CVE-2021-45046"],
    ghsaId: "GHSA-jfh8-c2jp-5v3q",
    osvId: "OSV-2021-44228",
    affectedTargets: [
      { product: "Apache Log4j", ecosystem: "Java Maven", affectedVersions: "2.0-beta9 - 2.14.1", fixedInVersion: "2.17.1", purl: "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2021-12-10",
      ransomwareUse: true,
      notes: "Subject of massive global automated botnet scanning, cryptocurrency miners, and nation-state intrusion campaigns."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 10.0", finding: "Maximum CVSS score remote code execution without privileges.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active Weaponization", finding: "Confirmed ransomware exploitation in wild.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "snyk_vulndb", sourceName: "Snyk", badge: "Transitive Graph", finding: "Over 60% of top Java Maven libraries carried transitive Log4j dependencies.", signalType: "REACHABILITY", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade log4j-core and log4j-api to 2.17.1 or higher immediately.",
      patchDetails: "Removed JNDI lookup support entirely by default and disabled message lookups.",
      workarounds: ["Remove JndiLookup.class from log4j-core classpath: zip -q -d log4j-core-*.jar org/apache/logging/log4j/core/lookup/JndiLookup.class"]
    },
    publishedDate: "2021-12-10",
    lastUpdatedDate: "2026-08-15"
  },

  // 2. XZ Utils / Liblzma Upstream Supply Chain Backdoor (UVI-2024-3094)
  {
    uviId: "UVI-2024-3094",
    title: "XZ Utils / Liblzma Upstream Supply Chain Backdoor in sshd Authentication",
    headline: "Critical malicious backdoor inserted into xz-utils liblzma enabling unauthorized authentication bypass in OpenSSH daemon.",
    summary: "A malicious backdoor was deliberately planted into upstream xz-utils (liblzma) versions 5.6.0 and 5.6.1 via obfuscated build scripts. The payload hooks RSA_public_decrypt in OpenSSH through systemd notify integration.",
    technicalDetails: "The backdoor injects code during the build stage via M4 macro extraction from test files. In target Linux environments where sshd links against libsystemd (which links against liblzma), it intercepts RSA verification routines using GNU IFUNC symbols. This enables an attacker holding a private key to execute arbitrary payload commands on port 22.",
    globalImpact: "Threatened the entire Linux enterprise server and cloud compute foundation (Debian, Fedora, openSUSE, Alpine, Arch, Ubuntu).",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Developer workstations and remote dev containers running Linux distributions that updated to 5.6.0/5.6.1 with sshd enabled.",
      buildPipelineRisk: "Compiling tarballs using compromised xz-utils on Linux build runners could inject backdoored binaries into compiled deliverables.",
      recommendationForIdeBuilds: "Pin and audit liblzma shared objects in IDE container environments. Ensure remote SSH server toolchains are downgraded to 5.4.6 LTS."
    },
    severity: "CRITICAL",
    cvssScore: 10.0,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: ["CVE-2024-3094"],
    ghsaId: "GHSA-rxwq-x6h5-x525",
    osvId: "OSV-2024-3094",
    affectedTargets: [
      { product: "xz-utils / liblzma", ecosystem: "Linux", affectedVersions: "5.6.0 - 5.6.1", fixedInVersion: "5.6.1-r1 / 5.4.6 LTS", purl: "pkg:deb/debian/xz-utils@5.6.0" },
      { product: "OpenSSH Daemon (via libsystemd)", ecosystem: "Linux", affectedVersions: "Fedora 40, Rawhide, Debian Sid", fixedInVersion: "Reverted to 5.4.x", purl: "pkg:deb/debian/openssh-server" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-04-01",
      ransomwareUse: false,
      notes: "Nation-state level supply chain infiltration targeted at enterprise Linux distributions."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 10.0", finding: "Maximum severity remote pre-auth code execution in OpenSSH.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Exploitation Alert", finding: "Confirmed weaponized supply chain backdoor.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "AST & IFUNC Hook", finding: "Reverse-engineered IFUNC hook manipulating OpenSSH RSA_public_decrypt.", signalType: "AST_IOC", confidence: "CONFIRMED" },
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Account Takeover", finding: "Multi-year social engineering campaign targeting xz maintainership.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Downgrade xz-utils to version 5.4.6 or install distribution vendor emergency hotfixes immediately.",
      patchDetails: "Revert liblzma shared library to uncompromised 5.4.6 release. Recompile sshd without systemd notify linkage where feasible.",
      workarounds: ["Isolate SSH access behind VPN/bastion.", "Audit /usr/lib64/liblzma.so checksums against trusted baseline."]
    },
    publishedDate: "2024-03-29",
    lastUpdatedDate: "2026-08-30"
  },

  // 3. Node.js Windows Batch Command Injection (BatBadBut - UVI-2024-27982)
  {
    uviId: "UVI-2024-27982",
    title: "Node.js Child Process Windows Batch File Command Injection (BatBadBut)",
    headline: "Improper argument escaping in child_process.spawn on Windows permits arbitrary shell command execution via batch files (.bat/.cmd).",
    summary: "Due to how CreateProcessW on Windows delegates to cmd.exe when executing .bat and .cmd scripts, Node.js failed to escape whitespace and metacharacters, allowing command injection when spawning batch files with untrusted inputs.",
    technicalDetails: "Windows lacks a native syscall for argument vector passing; arguments are formatted into a single string for CommandLineToArgvW. However, cmd.exe has distinct escaping rules that do not recognize standard backslash escapes for quotes. An attacker passing arguments containing special characters (such as & or | or ^) can break out of arguments.",
    globalImpact: "Affected every Windows server and service running Node.js that invoked batch scripts with user parameters.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Directly affects developer workstations running Windows! NPM scripts, package runners (npx), and IDE tasks invoking .cmd wrappers (e.g. gradlew.bat, mvnw.cmd, tsc.cmd).",
      buildPipelineRisk: "Windows CI/CD build agents executing git-cloned repositories containing malicious repo names or branch parameters can be completely compromised.",
      recommendationForIdeBuilds: "Ensure developer workstation Node.js runtimes are updated to v18.20.2, v20.12.2, or v21.7.2. In IDE task runner definitions, avoid passing dynamic variables to .bat/.cmd without shell:false."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-78: Improper Neutralization of Special Elements used in an OS Command",
    domainCategory: "Language Runtimes & Toolchains",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-27982"],
    ghsaId: "GHSA-4v38-exeh-8727",
    osvId: "OSV-2024-27982",
    affectedTargets: [
      { product: "Node.js (Windows)", ecosystem: "Node.js", affectedVersions: "<18.20.2, <20.12.2, <21.7.2", fixedInVersion: "20.12.2 LTS", purl: "pkg:generic/nodejs@20.12.1" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-04-15",
      ransomwareUse: false,
      notes: "Broadly weaponized across Windows build agents and continuous deployment pipelines."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "High-impact remote command injection vulnerability in core runtime child_process.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active Weaponization", finding: "Actively targeted in Windows build environments.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Subprocess Spawning", finding: "Over 4,200 public npm packages invoke .bat/.cmd files using raw child_process.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Node.js to 18.20.2, 20.12.2, or 21.7.2 immediately.",
      patchDetails: "Node.js runtime now rejects spawning .bat and .cmd files with arguments unless shell: true is explicitly declared, or sanitizes with custom cmd.exe argument escaper.",
      workarounds: ["Avoid invoking .bat/.cmd scripts directly with dynamic arguments; compile binaries to .exe or invoke through PowerShell with explicit parameter arrays."]
    },
    publishedDate: "2024-04-10",
    lastUpdatedDate: "2026-08-25"
  },

  // 4. runc Leaked File Descriptor Container Breakout (UVI-2024-21626)
  {
    uviId: "UVI-2024-21626",
    title: "runc Leaked Host File Descriptor Host Root Filesystem Overwrite Container Breakout",
    headline: "Vulnerability in runc allows malicious container images or exec sessions to overwrite host binaries and achieve full host breakout.",
    summary: "In runc through version 1.1.11, internal file descriptors referencing the host filesystem (/sys/fs/cgroup or /proc) were leaked to runc init during container startup, enabling a malicious container process to access the host mount namespace.",
    technicalDetails: "When runc initializes, it opens host file descriptors. Due to improper O_CLOEXEC handling, an attacker could traverse /proc/self/fd/ to obtain a handle to the host filesystem, open /proc/self/exe or host binaries (such as runc itself), and overwrite them with malicious shellcode.",
    globalImpact: "Critical threat across Kubernetes clusters, Docker Swarm, AWS EKS, Google GKE, and all multi-tenant container platforms.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Dev Containers, Docker Desktop, VS Code Remote - Containers, and local microk8s/minikube clusters.",
      buildPipelineRisk: "Building or running untrusted container images (e.g. from public Docker Hub) on local workstations allows full host root takeover of the developer's laptop.",
      recommendationForIdeBuilds: "Update local container engines (Docker Desktop, Podman, Rancher Desktop) to versions bundling runc 1.1.12+. Enforce rootless container execution for Dev Containers."
    },
    severity: "HIGH",
    cvssScore: 8.6,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H",
    cwe: "CWE-403: Exposure of File Descriptor to Unintended Control Sphere",
    domainCategory: "Cloud & Container Infrastructure",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: ["CVE-2024-21626"],
    ghsaId: "GHSA-c3cr-m6c4-2nhv",
    osvId: "OSV-2024-21626",
    affectedTargets: [
      { product: "runc / Docker / Containerd", ecosystem: "Containers", affectedVersions: "<=1.1.11", fixedInVersion: "1.1.12", purl: "pkg:golang/github.com/opencontainers/runc@1.1.11" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-02-09",
      ransomwareUse: false,
      notes: "Targeted in multi-tenant cloud hosting environments and untrusted CI container builders."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.6", finding: "Container breakout allowing host filesystem manipulation.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Cloud Alert", finding: "Active weaponization in container escape exploits.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "aqua_nautilus", sourceName: "Aqua Nautilus", badge: "Container Escape", finding: "Demonstrated zero-click host breakout via malicious Dockerfile ENTRYPOINT.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Update runc to 1.1.12 and containerd to 1.6.28/1.7.13.",
      patchDetails: "runc now marks all host file descriptors as O_CLOEXEC and audits /proc/self/fd before execve.",
      workarounds: ["Do not run untrusted container images with docker run or in dev containers without rootless user mapping."]
    },
    publishedDate: "2024-01-31",
    lastUpdatedDate: "2026-08-20"
  },

  // 5. Rust Standard Library Command Injection on Windows (BatBadBut - UVI-2024-24576)
  {
    uviId: "UVI-2024-24576",
    title: "Rust std::process Command Argument Injection on Windows (BatBadBut)",
    headline: "Improper command-line argument escaping in Rust standard library on Windows enables arbitrary command execution.",
    summary: "The Rust standard library std::process::Command on Windows did not properly escape arguments passed to batch files (.bat and .cmd) because of Windows cmd.exe command line parsing quirks.",
    technicalDetails: "When spawning processes on Windows using std::process::Command, if the binary resolved to a batch file, cmd.exe parses arguments with its own rules rather than standard Win32 CommandLineToArgvW. Special shell metacharacters could inject commands.",
    globalImpact: "Affected Windows applications compiled in Rust that execute batch files or rely on PATH resolution for shell commands.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Rust Cargo tools (cargo-make, cargo-watch, rust-analyzer tasks) invoking batch wrappers on Windows.",
      buildPipelineRisk: "Rust build scripts (build.rs) executing batch scripts with user parameters on Windows CI runners.",
      recommendationForIdeBuilds: "Upgrade Rust toolchain (rustc / cargo) to 1.77.2+ using rustup update. In IDE Rust projects, ensure build.rs does not execute untrusted batch files without parameter sanitization."
    },
    severity: "CRITICAL",
    cvssScore: 10.0,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    cwe: "CWE-78: Improper Neutralization of Special Elements used in an OS Command",
    domainCategory: "Language Runtimes & Toolchains",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: ["CVE-2024-24576"],
    ghsaId: "GHSA-m5p5-m39x-c2q8",
    osvId: "OSV-2024-24576",
    affectedTargets: [
      { product: "Rust Standard Library (Windows)", ecosystem: "Rust", affectedVersions: "<1.77.2", fixedInVersion: "1.77.2", purl: "pkg:cargo/rustc@1.77.1" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-04-18",
      ransomwareUse: false,
      notes: "Part of the multi-ecosystem BatBadBut exploitation wave against Windows toolchains."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 10.0", finding: "Maximum CVSS score command injection on Windows.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "ecosystem_dbs", sourceName: "RustSec Advisory DB", badge: "RUSTSEC-2024-0022", finding: "Official Rust security advisory published by Rust Security Response WG.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Run rustup update to install Rust 1.77.2 or newer.",
      patchDetails: "The standard library now returns an error (ErrorKind::InvalidInput) if it cannot safely escape arguments for cmd.exe.",
      workarounds: ["Avoid invoking .bat/.cmd scripts directly with dynamic arguments."]
    },
    publishedDate: "2024-04-09",
    lastUpdatedDate: "2026-08-25"
  },

  // 6. OpenSSH RegreSSHion Remote Code Execution (UVI-2024-6387)
  {
    uviId: "UVI-2024-6387",
    title: "OpenSSH Server RegreSSHion Pre-Authentication Remote Code Execution",
    headline: "Signal handler race condition in OpenSSH daemon permits unauthenticated remote code execution as root on glibc Linux systems.",
    summary: "A signal handler race condition was reintroduced in OpenSSH server (sshd) versions 8.5p1 through 9.7p1. If a client does not authenticate within LoginGraceTime, sshd SIGALRM handler executes asynchronously and calls non-async-signal-safe functions.",
    technicalDetails: "The SIGALRM handler calls syslog(), which internally invokes malloc() and free(). By carefully grooming the glibc heap state, a remote attacker can manipulate the heap and overwrite function pointers, achieving unauthenticated root code execution.",
    globalImpact: "Impacts enterprise Linux servers, bastions, cloud virtual machines, and remote infrastructure worldwide running glibc.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Remote development via SSH (VS Code Remote - SSH, JetBrains Gateway, SSH tunnels to remote dev machines).",
      buildPipelineRisk: "Compromise of remote build machines or self-hosted runner hosts reachable over port 22.",
      recommendationForIdeBuilds: "Update OpenSSH to 9.8p1+ on all remote development servers. Set LoginGraceTime 0 in sshd_config as an immediate temporary mitigation."
    },
    severity: "HIGH",
    cvssScore: 8.1,
    cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-362: Concurrent Execution using Shared Resource with Improper Synchronization",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-6387"],
    affectedTargets: [
      { product: "OpenSSH sshd (Linux glibc)", ecosystem: "Linux", affectedVersions: "8.5p1 - 9.7p1", fixedInVersion: "9.8p1", purl: "pkg:generic/openssh@9.7p1" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "High complexity race condition demonstrated in public proof-of-concept exploits."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.1", finding: "Remote pre-auth root code execution in OpenSSH server.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "Heap Exploitation", finding: "Analyzed glibc malloc state corruption triggered by async signal handler re-entrancy.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade OpenSSH to 9.8p1 or install distribution vendor security updates.",
      patchDetails: "The signal handler was rewritten to only set a volatile flag instead of invoking async-unsafe syslog.",
      workarounds: ["Set 'LoginGraceTime 0' in /etc/ssh/sshd_config (note: prevents race condition but exposes server to potential DoS if connection max is reached)."]
    },
    publishedDate: "2024-07-01",
    lastUpdatedDate: "2026-08-28"
  },

  // 7. Windows TCP/IP IPv6 Remote Code Execution (UVI-2024-38063)
  {
    uviId: "UVI-2024-38063",
    title: "Windows TCP/IP Stack IPv6 Packet Processing Remote Code Execution",
    headline: "Zero-click remote code execution in Windows TCP/IP kernel stack triggered by specially crafted IPv6 packets.",
    summary: "An integer underflow vulnerability in tcpip.sys allows unauthenticated attackers to execute arbitrary code with SYSTEM privileges on vulnerable Windows machines by transmitting crafted IPv6 packets over the local network or internet.",
    technicalDetails: "The Windows kernel TCP/IP driver tcpip.sys improperly handles IPv6 packet fragmentation when processing Option headers. An integer underflow leads to an out-of-bounds write in non-paged kernel pool memory.",
    globalImpact: "Severe zero-click threat impacting all modern Windows client (Windows 10/11) and server (Windows Server 2016-2022) systems.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Windows developer laptops connected to untrusted networks (coffee shop Wi-Fi, conference networks, shared corporate LANs).",
      buildPipelineRisk: "Zero-click compromise of Windows build runners without requiring any user interaction or code execution.",
      recommendationForIdeBuilds: "Apply Microsoft August 2024 Security Updates (KB5041585). Disable IPv6 on untrusted network adapters if patches cannot be deployed immediately."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-191: Integer Underflow (Wrap or Confusion)",
    domainCategory: "Operating Systems & Kernels",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-38063"],
    msrcId: "MSRC-CVE-2024-38063",
    affectedTargets: [
      { product: "Microsoft Windows TCP/IP Stack (tcpip.sys)", ecosystem: "Windows", affectedVersions: "Windows 10, 11, Server 2016-2022", fixedInVersion: "August 2024 Patch Tuesday", purl: "pkg:generic/windows@10.0.22631.3880" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-08-20",
      ransomwareUse: false,
      notes: "Targeted in localized network attacks against unpatched enterprise endpoints."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Zero-click kernel remote code execution.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "vendor_msrc_eclipse", sourceName: "Microsoft MSRC", badge: "Critical Advisory", finding: "Official Microsoft security bulletin classifying exploitability as 'Exploitation More Likely'.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply Microsoft August 2024 Windows Security Updates immediately.",
      patchDetails: "Corrects bounds validation and integer arithmetic in IPv6 extension header fragmentation parsing.",
      workarounds: ["Disable IPv6 on network interfaces: netsh interface ipv6 set state disabled"]
    },
    publishedDate: "2024-08-13",
    lastUpdatedDate: "2026-09-02"
  },

  // 8. HTTP/2 Rapid Reset Distributed Denial of Service (UVI-2023-44487)
  {
    uviId: "UVI-2023-44487",
    title: "HTTP/2 Rapid Reset Stream Multiplexing Distributed Denial of Service",
    headline: "Flaw in HTTP/2 protocol stream cancellation permits unprecedented distributed denial of service volumetric attacks.",
    summary: "Attackers can cause massive CPU and memory exhaustion in web servers, proxies, and load balancers by sending a continuous burst of HTTP/2 HEADERS requests immediately followed by RST_STREAM cancellation frames.",
    technicalDetails: "The HTTP/2 protocol allows clients to reset streams asynchronously using RST_STREAM frames. Because servers must still allocate resources to parse headers before processing the cancellation, attackers could queue hundreds of thousands of concurrent requests per connection, overwhelming reverse proxies (Envoy, NGINX, Apache, Go net/http).",
    globalImpact: "Largest recorded DDoS attacks in internet history (exceeding 398 million requests per second against Cloudflare, Google Cloud, and AWS).",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Local development web servers running HTTP/2 proxies.",
      buildPipelineRisk: "Cloud API gateway exhaustion causing CI/CD deployments and webhook delivery failures.",
      recommendationForIdeBuilds: "Update local reverse proxy tools (Caddy, Envoy, Nginx) and ensure application servers configure HTTP/2 max concurrent stream cancellation limits."
    },
    severity: "HIGH",
    cvssScore: 7.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H",
    cwe: "CWE-400: Uncontrolled Resource Consumption",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-44487"],
    affectedTargets: [
      { product: "HTTP/2 Protocol Implementations (Envoy, NGINX, Go, Apache)", ecosystem: "Web Infrastructure", affectedVersions: "All HTTP/2 implementations prior to Oct 2023", fixedInVersion: "Vendor updates", purl: "pkg:generic/http2@rfc7540" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-10-10",
      ransomwareUse: false,
      notes: "Subject of global record-setting DDoS extortion campaigns."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.5", finding: "Universal protocol-level denial of service.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active DDoS", finding: "Used in multi-vendor infrastructure outages.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply vendor patches to web servers, proxies, and API gateways.",
      patchDetails: "Enforce strict limits on maximum RST_STREAM frames per second per connection.",
      workarounds: ["Temporarily disable HTTP/2 and fall back to HTTP/1.1 if patches cannot be applied."]
    },
    publishedDate: "2023-10-10",
    lastUpdatedDate: "2026-08-20"
  },

  // 9. cURL SOCKS5 Heap Buffer Overflow (UVI-2023-38545)
  {
    uviId: "UVI-2023-38545",
    title: "libcurl SOCKS5 Hostname Resolution Heap Buffer Overflow",
    headline: "Heap-based buffer overflow in libcurl during SOCKS5 proxy handshake permits arbitrary code execution or crash.",
    summary: "When libcurl was instructed to connect through a SOCKS5 proxy using socks5h://, passing a hostname longer than 255 bytes caused a heap buffer overflow in the curl_easy_perform loop.",
    technicalDetails: "curl passes the hostname to the SOCKS5 proxy. Due to a logic error in the state machine, if a hostname was too long, curl switched to local name resolution and wrote beyond the allocated heap buffer.",
    globalImpact: "Present in millions of Linux, macOS, and Windows systems, container images, and software utilities embedding libcurl.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developer CLI tools, Git client operations over proxy, package managers downloading tarballs via SOCKS5/corporate proxy.",
      buildPipelineRisk: "CI/CD build runners configured with corporate SOCKS5 proxies connecting to dynamic URLs.",
      recommendationForIdeBuilds: "Upgrade system libcurl to version 8.4.0+. In IDE network proxy configuration, avoid socks5h:// proxies with unpatched libcurl binaries."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-122: Heap-based Buffer Overflow",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-38545"],
    affectedTargets: [
      { product: "libcurl / curl command line", ecosystem: "C/C++", affectedVersions: "7.69.0 - 8.3.0", fixedInVersion: "8.4.0", purl: "pkg:generic/curl@8.3.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-10-18",
      ransomwareUse: false,
      notes: "Targeted in proxy evasion and client exploitation chains."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "High-severity heap buffer overflow in SOCKS5 state machine.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Exploited in Wild", finding: "Weaponized against endpoints using proxychains.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade curl and libcurl to 8.4.0 or later.",
      patchDetails: "Fixed buffer allocation size and strictly rejected hostnames exceeding 255 bytes before SOCKS5 handshake.",
      workarounds: ["Avoid using socks5h:// hostname proxying; use IP addresses directly with socks5://."]
    },
    publishedDate: "2023-10-11",
    lastUpdatedDate: "2026-08-15"
  },

  // 10. Git Submodule Remote Code Execution on Clone (UVI-2024-32002)
  {
    uviId: "UVI-2024-32002",
    title: "Git Client Recursive Clone Remote Code Execution via Malicious Submodules",
    headline: "Vulnerability in Git client allows arbitrary code execution during 'git clone --recursive' on case-insensitive filesystems (Windows/macOS).",
    summary: "A vulnerability in Git allows an attacker to craft a repository with a submodule whose path collides with Git internal directories (like .git/hooks) on case-insensitive filesystems, triggering hook execution during clone.",
    technicalDetails: "When cloning recursively on case-insensitive filesystems (NTFS/APFS), Git failed to account for case folding when validating submodule paths. A repository containing a submodule named .GIT/hooks could place executable hook scripts into the parent repository's .git/hooks directory. When submodule checkout concluded, Git executed post-checkout hooks.",
    globalImpact: "Severe supply chain attack vector impacting developers worldwide who clone open-source repositories.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Directly weaponized when a developer runs 'git clone --recursive' or opens a repository in an IDE (VS Code, JetBrains, Sublime Merge) that initializes submodules.",
      buildPipelineRisk: "Automated CI/CD pipelines cloning public repositories with submodule recursion can be compromised on checkout.",
      recommendationForIdeBuilds: "Update local Git to version 2.45.1, 2.44.1, 2.43.4, or 2.42.2. In IDE git settings, set 'git.autoRepositoryDetection': false or disable automatic recursive submodule checkout for untrusted repos."
    },
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
    cwe: "CWE-178: Improper Handling of Case Sensitivity",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-32002", "CVE-2024-32004"],
    affectedTargets: [
      { product: "Git Core Client", ecosystem: "Developer Tools", affectedVersions: "<2.45.1, <2.44.1, <2.43.4", fixedInVersion: "2.45.1", purl: "pkg:generic/git@2.45.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-05-20",
      ransomwareUse: false,
      notes: "Actively exploited in the wild via malicious GitHub repositories targeting software developers."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.8", finding: "Remote code execution during git clone.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Developer Targeting", finding: "Weaponized proof of concepts targeting security researchers and developers.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Submodule Poisoning", finding: "Detected multiple GitHub repo templates weaponizing .GIT/hooks path collision.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Git client to 2.45.1 or newer immediately across all workstations and CI runners.",
      patchDetails: "Git now enforces strict case-insensitive validation for internal reserved directory names including .git.",
      workarounds: ["Disable automatic submodule cloning or use 'git config --global submodule.recurse false'."]
    },
    publishedDate: "2024-05-14",
    lastUpdatedDate: "2026-08-25"
  },

  // 11. libwebp Heap Buffer Overflow in WebP Decoding (UVI-2023-4863)
  {
    uviId: "UVI-2023-4863",
    title: "libwebp Lossless Image Decoding Heap Buffer Overflow Zero-Day",
    headline: "Actively exploited heap buffer overflow in libwebp library enables remote code execution when rendering malicious WebP images.",
    summary: "A heap-based buffer overflow in the Huffman coding algorithm of libwebp versions prior to 1.3.2 allowed remote attackers to execute arbitrary code or crash applications by providing a specially crafted WebP image.",
    technicalDetails: "The vulnerability resides in BuildHuffmanTable() within dec.c. A crafted lossless WebP image with invalid Huffman table definitions causes an out-of-bounds write to the allocated table memory, overwriting adjacent heap data.",
    globalImpact: "Massive global footprint impacting Google Chrome, Firefox, Safari, Electron apps (Slack, Teams, Discord), Signal, and all web applications rendering user-submitted WebP avatars.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Electron-based IDEs (VS Code, Cursor, Atom), markdown image previewers, and documentation readers rendering untrusted WebP images.",
      buildPipelineRisk: "Asset processing build pipelines (Sharp, ImageMagick) processing untrusted user assets.",
      recommendationForIdeBuilds: "Ensure IDE desktop runtime is built on Electron 26.2.1+ or 25.8.4+ with patched libwebp. Enable strict sandboxing for webview previews in custom IDE builds."
    },
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
    cwe: "CWE-122: Heap-based Buffer Overflow",
    domainCategory: "Operating Systems & Kernels",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-4863", "CVE-2023-5129"],
    affectedTargets: [
      { product: "libwebp / Electron / Chromium", ecosystem: "C/C++", affectedVersions: "<1.3.2", fixedInVersion: "1.3.2", purl: "pkg:generic/libwebp@1.3.1" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-09-13",
      ransomwareUse: false,
      notes: "Commercial spyware zero-day exploited in zero-click and one-click iOS and browser attack chains."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.8", finding: "Heap buffer overflow in Huffman table decoding.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Zero-Day Exploitation", finding: "Confirmed in-the-wild zero-day targeting mobile and desktop browsers.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade libwebp to 1.3.2 and update all Chromium/Electron applications immediately.",
      patchDetails: "Enforced strict boundary checks in BuildHuffmanTable to prevent table size overruns.",
      workarounds: ["Block or convert WebP images at the edge network layer."]
    },
    publishedDate: "2023-09-12",
    lastUpdatedDate: "2026-08-20"
  },

  // 12. Spring Framework Remote Code Execution (Spring4Shell - UVI-2022-22963)
  {
    uviId: "UVI-2022-22963",
    title: "Spring Cloud Function & Framework SpEL ClassLoader Remote Code Execution (Spring4Shell)",
    headline: "Unauthenticated remote code execution in Spring Framework via class binding on Java 9+ runtimes.",
    summary: "A flaw in Spring Framework DataBinder allowed unauthenticated attackers to access the Java 9+ ClassLoader via class.module.classLoader, modifying Apache Tomcat logging properties to write a webshell into the web root.",
    technicalDetails: "By posting parameter keys like 'class.module.classLoader.resources.context.parent.pipeline.first.pattern', an attacker could manipulate Tomcat AccessLogValve properties to write a .jsp file containing arbitrary executable Java code into the webapps directory.",
    globalImpact: "Targeted enterprise Java enterprise services, Spring Boot web applications, and banking backends worldwide.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "MEDIUM",
      workstationVector: "Local development servers running Spring Boot on developer workstations reachable over localhost or internal LAN.",
      buildPipelineRisk: "Test execution of Spring applications against untrusted integration inputs.",
      recommendationForIdeBuilds: "Upgrade spring-beans and spring-webmvc to 5.3.18+ or 5.2.20+. In IDE Maven/Gradle configurations, enforce dependency version locking for Spring."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-94: Improper Control of Generation of Code ('Code Injection')",
    domainCategory: "Enterprise & Web Frameworks",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2022-22965"],
    ghsaId: "GHSA-36p3-wjmg-h94x",
    osvId: "OSV-2022-22965",
    affectedTargets: [
      { product: "Spring Framework", ecosystem: "Java Maven", affectedVersions: "5.3.0 - 5.3.17, 5.2.0 - 5.2.19", fixedInVersion: "5.3.18", purl: "pkg:maven/org.springframework/spring-webmvc@5.3.17" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2022-04-04",
      ransomwareUse: true,
      notes: "Weaponized by multiple botnets (Mirai variants) and ransomware operators."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Remote class loader parameter injection.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active Weaponization", finding: "High-volume automated exploitation against cloud endpoints.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade to Spring Framework 5.3.18 or 5.2.20 immediately.",
      patchDetails: "Restricted PropertyDescriptor binding to disallow access to ClassLoader and ProtectionDomain via Module.",
      workarounds: ["Configure an InitBinder advice denying 'class.*' and '*.class.*' fields."]
    },
    publishedDate: "2022-03-31",
    lastUpdatedDate: "2026-08-15"
  },

  // 13. Kubernetes Ingress-Nginx Arbitrary Command Injection (UVI-2023-5044)
  {
    uviId: "UVI-2023-5044",
    title: "Kubernetes Ingress-Nginx Incomplete Annotation Validation Arbitrary Code Injection",
    headline: "Improper input sanitization in ingress-nginx annotations allows arbitrary code execution and cluster credential theft.",
    summary: "A security issue in the ingress-nginx controller allowed users with permission to create or update Ingress objects to inject arbitrary configuration snippets into nginx.conf, executing arbitrary commands as the controller pod.",
    technicalDetails: "The ssl-passthrough and configuration-snippet annotations lacked sufficient character filtering. By injecting newlines and Lua code blocks into annotation fields, an attacker gained shell execution within the ingress-nginx controller pod and could steal the cluster service account token.",
    globalImpact: "Impacted thousands of multi-tenant Kubernetes clusters in enterprise and cloud environments.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "MEDIUM",
      workstationVector: "Local Kubernetes dev clusters (kind, minikube, Docker Desktop K8s) running ingress-nginx.",
      buildPipelineRisk: "CI/CD deployments rendering Helm charts with dynamic developer-provided values into staging clusters.",
      recommendationForIdeBuilds: "Set --enable-annotation-validation=true in ingress-nginx or upgrade to 1.9.0+. Use policy engines (Kyverno/OPA) to forbid arbitrary snippets."
    },
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-94: Code Injection",
    domainCategory: "Cloud & Container Infrastructure",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "LOW",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-5044"],
    affectedTargets: [
      { product: "Kubernetes ingress-nginx", ecosystem: "Kubernetes", affectedVersions: "<1.9.0", fixedInVersion: "1.9.0", purl: "pkg:generic/ingress-nginx@1.8.2" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "Multi-tenant cluster compromise demonstration."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.8", finding: "Privilege escalation to cluster ingress controller.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "aqua_nautilus", sourceName: "Aqua Nautilus", badge: "Cluster Takeover", finding: "Demonstrated secret theft and service account takeover via Ingress manifest.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade ingress-nginx to 1.9.0 or later.",
      patchDetails: "Enforced strict regex validation preventing newlines and directive escaping in annotations.",
      workarounds: ["Disable configuration-snippet annotations entirely via controller flags."]
    },
    publishedDate: "2023-10-25",
    lastUpdatedDate: "2026-08-20"
  },

  // 14. PyPI & npm Malicious Typosquat Credential Harvester Campaign (UVI-2024-4291)
  {
    uviId: "UVI-2024-4291",
    title: "Large-Scale PyPI and npm Package Typosquatting Credential Exfiltration Campaign",
    headline: "Automated distribution of over 300 trojanized open-source packages executing postinstall scripts to steal SSH keys and AWS secrets.",
    summary: "A coordinated supply chain attack published hundreds of packages typosquatting popular libraries (e.g. reqeusts, colorama-v2, axios-proxy) that executed hidden setup.py and postinstall scripts to exfiltrate .ssh/id_rsa and .aws/credentials.",
    technicalDetails: "The malicious packages used base64-encoded strings and XOR obfuscation inside setup.py and package.json scripts. Upon 'npm install' or 'pip install', the payload scanned the home directory for environment files (.env), Discord tokens, browser cookies, and git credentials, POSTing them to a remote Discord webhook or C2 IP.",
    globalImpact: "Compromised developer credentials, cloud API access keys, and corporate git repositories across thousands of engineering teams.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Direct execution upon developer running 'npm install' or 'pip install' on their workstation, or automated package resolution in IDEs.",
      buildPipelineRisk: "CI/CD dependency caching poisoned by typosquats, resulting in cloud deployment token exfiltration.",
      recommendationForIdeBuilds: "Enable SecureIDE Typosquat Shield in Builder Console. Use locked package manifests (package-lock.json / poetry.lock) with strict integrity hashes."
    },
    severity: "CRITICAL",
    cvssScore: 9.6,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: ["CVE-2024-4291"],
    affectedTargets: [
      { product: "Multiple PyPI & npm typosquats", ecosystem: "npm / PyPI", affectedVersions: "300+ packages", fixedInVersion: "Yanked / Quarantined", purl: "pkg:npm/colorama-v2@1.0.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-05-10",
      ransomwareUse: false,
      notes: "Active supply chain exfiltration operation targeting software engineers."
    },
    upstreamSignals: [
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Automated Quarantine", finding: "Detected 312 package variants matching obfuscated exfiltration signatures.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Credential Exfiltration", finding: "Flagged dynamic reading of ~/.ssh and ~/.aws via child_process.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" },
      { sourceId: "jfrog_research", sourceName: "JFrog Security", badge: "Malware Campaign", finding: "Traced C2 drop point to Discord webhooks and command servers.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Purge infected packages, rotate all SSH keys, AWS access tokens, and git credentials immediately.",
      patchDetails: "Upstream registries yanked packages and banned publisher accounts.",
      workarounds: ["Enforce --ignore-scripts in npm and install packages inside sandboxed build containers."]
    },
    publishedDate: "2024-05-08",
    lastUpdatedDate: "2026-08-30"
  },

  // 15. GNU C Library (glibc) ld.so Looney Tunables Buffer Overflow (UVI-2023-4911)
  {
    uviId: "UVI-2023-4911",
    title: "glibc Dynamic Loader Buffer Overflow via GLIBC_TUNABLES (Looney Tunables)",
    headline: "Local privilege escalation to root in GNU C library dynamic loader triggered by crafted GLIBC_TUNABLES environment variable.",
    summary: "A buffer overflow vulnerability in the dynamic loader ld.so of the GNU C Library (glibc) allowed local unprivileged users to achieve full root privileges when executing SUID binaries.",
    technicalDetails: "When parsing the GLIBC_TUNABLES environment variable in parse_tunables(), the code failed to properly account for malformed tunable strings with duplicate assignments. This led to a heap buffer overflow in the loader, allowing an attacker to overwrite internal structures in SUID binaries (like /usr/bin/su) to gain root.",
    globalImpact: "Universal local root vulnerability affecting Fedora, Ubuntu, Debian, Red Hat Enterprise Linux, and SUSE distributions.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developer Linux workstations, WSL2 environments, and local multi-user servers.",
      buildPipelineRisk: "Shared CI/CD Linux runner agents where an untrusted build job can escalate to host root.",
      recommendationForIdeBuilds: "Update glibc via distribution package manager (apt/dnf) immediately. Ensure build runner containers do not share SUID binaries with host."
    },
    severity: "HIGH",
    cvssScore: 7.8,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-122: Heap-based Buffer Overflow",
    domainCategory: "Operating Systems & Kernels",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "LOW",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-4911"],
    affectedTargets: [
      { product: "GNU C Library (glibc)", ecosystem: "Linux", affectedVersions: "2.34 - 2.38", fixedInVersion: "2.38-r1", purl: "pkg:generic/glibc@2.37" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-11-21",
      ransomwareUse: true,
      notes: "Extensively weaponized by ransomware syndicates for post-compromise privilege escalation."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.8", finding: "Local root privilege escalation in core system dynamic loader.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active Escalation", finding: "Confirmed use in ransomware deployment scripts.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade glibc package via system update and reboot.",
      patchDetails: "Fixed pointer arithmetic and bounds checking in parse_tunables().",
      workarounds: ["Use systemd or pam configuration to strip GLIBC_TUNABLES from SUID execution environments."]
    },
    publishedDate: "2023-10-03",
    lastUpdatedDate: "2026-08-15"
  },

  // 16. VS Code / Electron Workspace Trust Remote Code Execution (UVI-2023-36742)
  {
    uviId: "UVI-2023-36742",
    title: "Visual Studio Code / Electron Workspace Trust Command Injection Bypass",
    headline: "Bypass of Workspace Trust security boundary permits arbitrary code execution upon opening untrusted git repositories.",
    summary: "A vulnerability in Visual Studio Code core and Electron shell allowed untrusted repositories to bypass Workspace Trust protections by exploiting URI handler callbacks and launch configuration task triggers.",
    technicalDetails: "When opening a project in restricted mode, Workspace Trust is designed to disable automatic task execution. However, crafted workspace settings exploiting schema-less URI schemes in task definitions could trick the workbench into executing shell scripts upon editor focus.",
    globalImpact: "Directly affected millions of software engineers using VS Code, VSCodium, and Electron-based editor forks.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Opening an untrusted folder, GitHub repository, or zip archive directly in the IDE.",
      buildPipelineRisk: "Developer machines executing malicious commands simply by browsing code.",
      recommendationForIdeBuilds: "Update VS Code to version 1.83.1+. In custom SecureIDE distributions, enforce strict workspace trust isolation and disallow untrusted task triggers."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-94: Code Injection",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-36742"],
    msrcId: "MSRC-CVE-2023-36742",
    affectedTargets: [
      { product: "Visual Studio Code", ecosystem: "Developer Tools", affectedVersions: "<1.83.1", fixedInVersion: "1.83.1", purl: "pkg:generic/vscode@1.83.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-11-01",
      ransomwareUse: false,
      notes: "Weaponized in social engineering campaigns targeting Web3 and blockchain developers."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Remote code execution via workspace trust bypass.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "vendor_msrc_eclipse", sourceName: "Microsoft MSRC", badge: "Official Advisory", finding: "Microsoft Security Response Center bulletin for developer tooling.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Update Visual Studio Code to 1.83.1 or newer.",
      patchDetails: "Hardened URI scheme parsing and enforced strict gatekeeping on task execution.",
      workarounds: ["Never open untrusted folders outside of restricted mode or container sandbox."]
    },
    publishedDate: "2023-09-12",
    lastUpdatedDate: "2026-08-20"
  },

  // 17. Jenkins CLI Arbitrary File Read and RCE (UVI-2024-23897)
  {
    uviId: "UVI-2024-23897",
    title: "Jenkins Core CLI args4j Arbitrary File Read and Remote Code Execution",
    headline: "Unauthenticated arbitrary file read on Jenkins controllers via args4j @ file expansion feature leading to full server takeover.",
    summary: "Jenkins versions through 2.441 and LTS through 2.426.2 use the args4j library to parse command arguments, which by default expands any argument starting with '@' into file contents, allowing unauthenticated attackers to read arbitrary files from the controller.",
    technicalDetails: "By reading sensitive cryptographic keys (master.key, hudson.util.Secret), attackers could forge 'Remember Me' cookies, decrypt stored credentials, and execute arbitrary Groovy scripts via the Jenkins Script Console to obtain full RCE.",
    globalImpact: "Compromised enterprise continuous integration controllers, deployment pipelines, and secrets across thousands of organizations.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developer workstations hosting local Jenkins test controllers or interacting with corporate CI controllers.",
      buildPipelineRisk: "Complete theft of CI/CD secrets, deployment private keys, and git credentials stored in Jenkins.",
      recommendationForIdeBuilds: "Upgrade Jenkins controller to 2.442 or LTS 2.426.3. Disable the built-in CLI interface if upgrades cannot be performed immediately."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-22: Improper Limitation of a Pathname to a Restricted Directory",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-23897"],
    affectedTargets: [
      { product: "Jenkins Core", ecosystem: "CI/CD", affectedVersions: "<=2.441, LTS <=2.426.2", fixedInVersion: "2.442 / LTS 2.426.3", purl: "pkg:generic/jenkins@2.441" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-02-01",
      ransomwareUse: true,
      notes: "Actively exploited to deploy ransomware and cryptominers on CI/CD build infrastructure."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Unauthenticated arbitrary file read leading to remote code execution.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "CI/CD Exploitation", finding: "Subject of automated mass scanning targeting corporate CI servers.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Jenkins to 2.442 or LTS 2.426.3 immediately.",
      patchDetails: "Disabled the @ file expansion feature in args4j CLI parser.",
      workarounds: ["Disable access to the Jenkins CLI by configuring security settings or blocking the CLI port."]
    },
    publishedDate: "2024-01-24",
    lastUpdatedDate: "2026-08-20"
  },

  // 18. Docker Desktop Arbitrary File Overwrite Host Escape (UVI-2024-21624)
  {
    uviId: "UVI-2024-21624",
    title: "Docker Desktop Windows and macOS Host File Overwrite Vulnerability",
    headline: "Symlink traversal vulnerability in Docker Desktop container mount synchronization allows host filesystem write.",
    summary: "A vulnerability in Docker Desktop prior to 4.27.0 allowed containers with bind mounts to traverse symlinks and write files outside the intended host directory on Windows and macOS.",
    technicalDetails: "The file-sharing component (VirtioFS / gRPC-FUSE) did not properly validate symlink resolution boundaries. A container creating a symlink pointing to host system paths could trick the synchronization daemon into writing files to host locations.",
    globalImpact: "Affected millions of software developers using Docker Desktop on Windows and macOS.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Running containerized builds with host bind mounts (-v $(pwd):/workspace) inside Docker Desktop.",
      buildPipelineRisk: "Compromise of developer's personal files, SSH keys, or startup scripts on the host operating system.",
      recommendationForIdeBuilds: "Update Docker Desktop to version 4.27.0+. Restrict file-sharing directories in Docker Desktop settings to dedicated project folders."
    },
    severity: "HIGH",
    cvssScore: 8.7,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H",
    cwe: "CWE-59: Improper Link Resolution Before File Access",
    domainCategory: "Cloud & Container Infrastructure",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: ["CVE-2024-21624"],
    affectedTargets: [
      { product: "Docker Desktop (Windows/macOS)", ecosystem: "Developer Tools", affectedVersions: "<4.27.0", fixedInVersion: "4.27.0", purl: "pkg:generic/docker-desktop@4.26.1" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "Host escape demonstrated in security research."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.7", finding: "Symlink traversal in container file sharing daemon.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "aqua_nautilus", sourceName: "Aqua Nautilus", badge: "Host Escape", finding: "Demonstrated arbitrary overwrite of host .bashrc via container mount.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Docker Desktop to 4.27.0 or newer.",
      patchDetails: "Enforced strict path normalization and symlink resolution verification inside VirtioFS.",
      workarounds: ["Avoid mounting host home directories into containers."]
    },
    publishedDate: "2024-02-01",
    lastUpdatedDate: "2026-08-15"
  },

  // 19. Sudo Baron Samedit Local Privilege Escalation (UVI-2021-3156)
  {
    uviId: "UVI-2021-3156",
    title: "Sudo Heap-Based Buffer Overflow Local Root Privilege Escalation (Baron Samedit)",
    headline: "Heap buffer overflow in Sudo allows any local user to obtain root privileges without authentication.",
    summary: "A heap-based buffer overflow was discovered in Sudo's command-line unescaping logic. Any local user, regardless of whether they were in the sudoers file, could exploit this flaw to obtain root privileges.",
    technicalDetails: "When sudo executed commands in shell mode (either via -s or -e), it parsed arguments and escaped characters. If a command ended with a trailing backslash character, the unescape function stepped past the null terminator, overflowing the heap buffer with attacker-controlled data.",
    globalImpact: "Existed undetected in Sudo for nearly 10 years across virtually every Unix, Linux, and macOS system.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developer workstations, cloud development VMs, and shared server environments.",
      buildPipelineRisk: "Untrusted build jobs running under low-privilege accounts gaining host root.",
      recommendationForIdeBuilds: "Update sudo package via system package manager (sudo apt-get install --only-upgrade sudo). Verify sudo --version is 1.9.5p2+."
    },
    severity: "HIGH",
    cvssScore: 7.8,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-122: Heap-based Buffer Overflow",
    domainCategory: "Operating Systems & Kernels",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "LOW",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2021-3156"],
    affectedTargets: [
      { product: "Sudo", ecosystem: "Unix / Linux", affectedVersions: "1.8.2 - 1.8.31p2, 1.9.0 - 1.9.5p1", fixedInVersion: "1.9.5p2", purl: "pkg:generic/sudo@1.9.5p1" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2021-11-03",
      ransomwareUse: true,
      notes: "Widely used in multi-stage ransomware and intrusion operations on Linux."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.8", finding: "Local root privilege escalation in sudo command unescaping.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active In Wild", finding: "Exploitation confirmed in enterprise Linux breaches.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade sudo to 1.9.5p2 or vendor patched package immediately.",
      patchDetails: "Corrected buffer allocation calculations and disallowed trailing backslashes in argument unescaping.",
      workarounds: ["None reliable without binary upgrade."]
    },
    publishedDate: "2021-01-26",
    lastUpdatedDate: "2026-08-15"
  },

  // 20. PostgreSQL pg_dump Remote Code Execution (UVI-2024-1597)
  {
    uviId: "UVI-2024-1597",
    title: "PostgreSQL pg_dump and pg_dumpall SQL Injection and Command Execution",
    headline: "Improper quoting in pg_dump when dumping databases containing object names with newlines permits code execution.",
    summary: "PostgreSQL pg_dump did not properly sanitize object names containing newline characters or SQL comments, allowing a malicious database owner to execute arbitrary SQL commands when an administrator backed up the database.",
    technicalDetails: "When generating dump files, pg_dump emitted object comments or definitions without sanitizing embedded carriage returns. When the backup was restored by a superuser, the injected SQL statements executed with full administrative permissions.",
    globalImpact: "Impacted cloud database providers, automated backup workflows, and enterprise PostgreSQL instances.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "MEDIUM",
      workstationVector: "Local PostgreSQL development databases, running test dumps, or importing customer database snapshots.",
      buildPipelineRisk: "CI/CD integration pipelines that run automated database dump and restore migrations.",
      recommendationForIdeBuilds: "Upgrade local PostgreSQL client tools to versions 16.2, 15.6, 14.11, 13.14, or 12.18. In IDE database tooling, do not execute unverified pg_dump files."
    },
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:H",
    cwe: "CWE-89: SQL Injection",
    domainCategory: "Databases & Storage",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "LOW",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-1597"],
    affectedTargets: [
      { product: "PostgreSQL pg_dump", ecosystem: "Databases", affectedVersions: "<16.2, <15.6, <14.11", fixedInVersion: "16.2", purl: "pkg:generic/postgresql@16.1" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "Demonstrated in database security assessments."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.8", finding: "SQL injection in pg_dump backup utility.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade PostgreSQL server and client packages to fixed releases.",
      patchDetails: "Enforced strict dollar-quoting and identifier escaping in pg_dump output.",
      workarounds: ["Avoid running pg_dump against untrusted or multi-tenant database clusters."]
    },
    publishedDate: "2024-02-08",
    lastUpdatedDate: "2026-08-20"
  },

  // 21. OpenSSL Punycode Buffer Overflow (UVI-2022-37868)
  {
    uviId: "UVI-2022-37868",
    title: "OpenSSL X.509 Certificate Name Constraint Punycode Buffer Overflow",
    headline: "Buffer overflow in OpenSSL during certificate verification when parsing email addresses containing Punycode characters.",
    summary: "A buffer overflow can be triggered in OpenSSL 3.0.x during X.509 certificate verification when checking name constraints on email addresses with internationalized domain names (IDN/Punycode).",
    technicalDetails: "In ossl_punycode_decode(), an integer overflow occurred when parsing crafted email address names, causing a 4-byte stack or heap overflow. On systems where stack protection was absent, this could lead to code execution.",
    globalImpact: "Affected TLS servers and clients validating client certificates or connecting to arbitrary TLS endpoints.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "MEDIUM",
      workstationVector: "Development tools connecting to external HTTPS endpoints or inspecting TLS certificates.",
      buildPipelineRisk: "Compilers and dependency managers (npm, pip, cargo) validating remote repository TLS certificates.",
      recommendationForIdeBuilds: "Upgrade OpenSSL to 3.0.7 or later across developer workstations and container base images."
    },
    severity: "HIGH",
    cvssScore: 7.5,
    cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-120: Buffer Copy without Checking Size of Input",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2022-37868", "CVE-2022-3602"],
    affectedTargets: [
      { product: "OpenSSL", ecosystem: "C/C++", affectedVersions: "3.0.0 - 3.0.6", fixedInVersion: "3.0.7", purl: "pkg:generic/openssl@3.0.6" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "High profile advisory patched proactively by OpenSSL project."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.5", finding: "Buffer overflow in X.509 certificate verification.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade OpenSSL to 3.0.7 or newer.",
      patchDetails: "Corrected buffer allocation and decoding limits in ossl_punycode_decode.",
      workarounds: ["Avoid enabling TLS client certificate verification on vulnerable OpenSSL builds."]
    },
    publishedDate: "2022-11-01",
    lastUpdatedDate: "2026-08-15"
  },

  // 22. Heartbleed OpenSSL TLS Heartbeat Extension Memory Leak (UVI-2014-0160)
  {
    uviId: "UVI-2014-0160",
    title: "OpenSSL TLS Heartbeat Extension Memory Information Disclosure (Heartbleed)",
    headline: "Catastrophic missing bounds check in OpenSSL Heartbeat extension enables unauthenticated remote memory dumping.",
    summary: "The (1) TLS and (2) DTLS implementations in OpenSSL 1.0.1 before 1.0.1g did not properly handle Heartbeat Extension packets, allowing remote attackers to obtain up to 64KB of memory per request from process memory.",
    technicalDetails: "When responding to a heartbeat request, OpenSSL allocated memory based on the payload length field supplied by the client without verifying that the actual packet payload matched that length. The server echoed back uninitialized memory containing private keys, session tokens, and passwords.",
    globalImpact: "Historic milestone vulnerability exposing SSL private keys and sensitive data across 17% of the internet's secure web servers.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Legacy development servers or embedded testing hardware using OpenSSL 1.0.1.",
      buildPipelineRisk: "Legacy build containers exposing test servers over public endpoints.",
      recommendationForIdeBuilds: "Ensure no legacy toolchain or container image embeds OpenSSL 1.0.1. Verify TLS stacks use OpenSSL 1.1.1 or 3.x+."
    },
    severity: "HIGH",
    cvssScore: 7.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
    cwe: "CWE-125: Out-of-bounds Read",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2014-0160"],
    affectedTargets: [
      { product: "OpenSSL", ecosystem: "C/C++", affectedVersions: "1.0.1 - 1.0.1f", fixedInVersion: "1.0.1g", purl: "pkg:generic/openssl@1.0.1f" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2022-03-25",
      ransomwareUse: false,
      notes: "Heavily exploited to steal private keys and credentials worldwide."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.5", finding: "Remote memory disclosure leaking private keys.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Historic Threat", finding: "Known in-the-wild exploitation catalog.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade OpenSSL to 1.0.1g or modern 3.x LTS.",
      patchDetails: "Added bounds check verifying payload length matches packet length.",
      workarounds: ["Recompile OpenSSL with -DOPENSSL_NO_HEARTBEATS."]
    },
    publishedDate: "2014-04-07",
    lastUpdatedDate: "2026-08-10"
  },

  // 23. EternalBlue SMBv1 Remote Code Execution (UVI-2017-0144)
  {
    uviId: "UVI-2017-0144",
    title: "Microsoft Windows SMBv1 Server Remote Code Execution (EternalBlue / WannaCry)",
    headline: "Zero-click remote code execution in Windows SMBv1 server protocol exploited by WannaCry and NotPetya worms.",
    summary: "The SMBv1 server in Microsoft Windows allowed remote attackers to execute arbitrary code via specially crafted packets, enabling wormable zero-click propagation across enterprise networks.",
    technicalDetails: "Vulnerability in Srv!SrvOs2FeaToNt caused a mathematical error when converting OS/2 format FEA lists to NT format, resulting in buffer allocation mismatch and kernel pool corruption.",
    globalImpact: "Weaponized in the WannaCry and NotPetya global cyber disasters, causing over $10B in damages to hospitals, ports, and multinational corporations.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Windows workstations on shared networks with SMBv1 enabled.",
      buildPipelineRisk: "Wormable lateral movement to on-premise Windows build runners and dev machines.",
      recommendationForIdeBuilds: "Ensure SMBv1 is completely uninstalled on all developer Windows machines: Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-119: Improper Restriction of Operations within the Bounds of a Memory Buffer",
    domainCategory: "Operating Systems & Kernels",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2017-0144"],
    msrcId: "MS17-010",
    affectedTargets: [
      { product: "Microsoft Windows SMBv1", ecosystem: "Windows", affectedVersions: "Windows 7, 8.1, 10, Server 2008-2016", fixedInVersion: "MS17-010 Update", purl: "pkg:generic/windows-smb@1.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2022-02-10",
      ransomwareUse: true,
      notes: "Primary exploit in WannaCry and NotPetya ransomware attacks."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Wormable remote kernel code execution in SMBv1.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Critical Ransomware", finding: "Active global ransomware weapon.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply MS17-010 patch and completely disable SMBv1.",
      patchDetails: "Corrected buffer allocation and validation in SrvOs2FeaToNt.",
      workarounds: ["Block SMB port 445 on firewalls and disable SMBv1 feature."]
    },
    publishedDate: "2017-03-14",
    lastUpdatedDate: "2026-08-15"
  },

  // 24. SolarWinds Orion SUNBURST Supply Chain Trojan (UVI-2020-10148)
  {
    uviId: "UVI-2020-10148",
    title: "SolarWinds Orion Platform SUNBURST Supply Chain DLL Backdoor",
    headline: "Trojanized SolarWinds.Orion.Core.BusinessLayer.dll injected into official build releases by nation-state actors.",
    summary: "Attackers compromised the software build pipeline of SolarWinds Orion, injecting a stealthy backdoor (SUNBURST) into signed software updates distributed to over 18,000 global customers.",
    technicalDetails: "The malware was inserted via a compiler build script injection (SUNSPOT) that monitored build processes and substituted source files on the fly. The backdoor remained dormant for two weeks before resolving C2 domains and executing in-memory payloads.",
    globalImpact: "Infiltrated US federal agencies (Treasury, Homeland Security, State Department) and Fortune 500 tech companies.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Demonstrated the danger of unhardened build systems, unsigned compiler hooks, and compromised build runners.",
      buildPipelineRisk: "Direct precedent for why SecureIDE build pipelines require isolated sandboxing, cryptographic reproducible builds, and CycloneDX SBOM verification.",
      recommendationForIdeBuilds: "Mandate cryptographic SBOM generation and ephemeral compiler sandboxing for all IDE distributions in SecureIDE Builder Studio."
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
    cveList: ["CVE-2020-10148"],
    affectedTargets: [
      { product: "SolarWinds Orion Platform", ecosystem: "Enterprise Software", affectedVersions: "2019.4 HF 5 - 2020.2.1", fixedInVersion: "2020.2.1 HF 2", purl: "pkg:generic/solarwinds-orion@2020.2" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2021-11-03",
      ransomwareUse: false,
      notes: "Nation-state cyber espionage operation."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Supply chain backdoor in signed enterprise application.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Nation-State Threat", finding: "Attributed to APT29 / Cozy Bear.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Orion Platform to 2020.2.1 HF 2 or modern clean releases.",
      patchDetails: "Removed compromised BusinessLayer DLL and revoked compromised signing certificates.",
      workarounds: ["Isolate Orion servers and audit SAML token signing certs."]
    },
    publishedDate: "2020-12-14",
    lastUpdatedDate: "2026-08-10"
  },

  // 25. EventStream Malicious Flatmap-Stream Bitcoin Harvester (UVI-2018-20834)
  {
    uviId: "UVI-2018-20834",
    title: "npm Event-Stream Flatmap-Stream Social Engineering Supply Chain Attack",
    headline: "Legitimate maintainer social engineered into transferring npm package ownership to attacker who injected Bitcoin wallet stealer.",
    summary: "The widely used npm package 'event-stream' was transferred to an attacker who added 'flatmap-stream' as a dependency, containing encrypted code designed to steal Bitcoin private keys from the Copay cryptocurrency wallet.",
    technicalDetails: "The payload was encrypted with AES256 and only decrypted when executed inside an application matching the package name 'copay-dash'. It hooked transaction signing functions to steal seed phrases and send them to an exfiltration server.",
    globalImpact: "Prototypical supply chain maintainer burnout takeover affecting millions of downstream npm consumers.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Running npm install on projects with unpinned transitive dependency trees.",
      buildPipelineRisk: "Transitive dependency injection bypassing direct package audit checks.",
      recommendationForIdeBuilds: "Use SecureIDE Builder Studio to enforce strict lockfile integrity verification and flag sudden maintainer account transfers."
    },
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
    cwe: "CWE-506: Embedded Malicious Code",
    domainCategory: "Supply Chain & Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: ["CVE-2018-20834"],
    ghsaId: "GHSA-55q7-qqv3-479p",
    osvId: "OSV-2018-20834",
    affectedTargets: [
      { product: "event-stream / flatmap-stream", ecosystem: "npm", affectedVersions: "3.3.6", fixedInVersion: "3.3.4 (reverted)", purl: "pkg:npm/event-stream@3.3.6" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2022-04-01",
      ransomwareUse: false,
      notes: "Targeted cryptocurrency theft supply chain attack."
    },
    upstreamSignals: [
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Account Takeover", finding: "Classic social engineering maintainer handover.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Encrypted Payload", finding: "Detected AES encrypted payload executing in build stage.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Pin event-stream to version 3.3.4 or replace with modern stream implementations.",
      patchDetails: "npm unpublished flatmap-stream and reverted event-stream to 3.3.4.",
      workarounds: ["Use package-lock.json to forbid automatic installation of 3.3.6."]
    },
    publishedDate: "2018-11-26",
    lastUpdatedDate: "2026-08-10"
  },

  // 26. nghttp2 HTTP/2 CONTINUATION Flood Denial of Service (UVI-2024-28182)
  {
    uviId: "UVI-2024-28182",
    title: "HTTP/2 CONTINUATION Frame Flood Denial of Service across Web Servers & Proxies",
    headline: "Unbounded HTTP/2 CONTINUATION frame processing permits remote resource exhaustion and server crash.",
    summary: "An attacker can trigger out-of-memory crashes and 100% CPU utilization on HTTP/2 servers by sending a continuous stream of CONTINUATION frames without ending the header block.",
    technicalDetails: "Many HTTP/2 implementations, including nghttp2, Node.js http2, Go net/http, and Apache Tomcat, did not enforce a limit on the number of CONTINUATION frames received per stream as long as the END_HEADERS flag was omitted.",
    globalImpact: "Affected millions of cloud load balancers, API gateways, and microservices exposing HTTP/2.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Local reverse proxies and API test gateways.",
      buildPipelineRisk: "Test servers hanging during automated HTTP/2 fuzzing.",
      recommendationForIdeBuilds: "Update local development HTTP/2 libraries (Node.js 20.12.2+, Go 1.22.2+)."
    },
    severity: "HIGH",
    cvssScore: 7.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H",
    cwe: "CWE-400: Uncontrolled Resource Consumption",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-28182"],
    affectedTargets: [
      { product: "nghttp2 / Envoy / Node.js", ecosystem: "Networking", affectedVersions: "<1.61.0", fixedInVersion: "1.61.0", purl: "pkg:generic/nghttp2@1.60.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-05-02",
      ransomwareUse: false,
      notes: "Observed in distributed denial of service attacks against cloud infrastructure."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.5", finding: "Universal HTTP/2 denial of service attack vector.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active In KEV", finding: "Active exploitation in cloud edge network disruptions.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply HTTP/2 CONTINUATION flood security updates across all reverse proxies and servers.",
      patchDetails: "Enforce strict limits on unparsed header frames per HTTP/2 stream.",
      workarounds: ["Limit maximum header list size or disable HTTP/2 temporarily."]
    },
    publishedDate: "2024-04-03",
    lastUpdatedDate: "2026-08-22"
  },

  // 27. Go net/http Request Smuggling (UVI-2024-45338)
  {
    uviId: "UVI-2024-45338",
    title: "Go net/http Content-Length Chunked Encoding HTTP Request Smuggling",
    headline: "Inconsistent handling of chunked transfer encoding in Go HTTP server permits HTTP request smuggling.",
    summary: "Go net/http server versions prior to 1.22.4 and 1.21.11 improperly processed Content-Length and Transfer-Encoding headers with unconventional capitalization or whitespace, enabling request smuggling behind reverse proxies.",
    technicalDetails: "When a request contained both Transfer-Encoding and Content-Length with trailing whitespace, Go prioritized Content-Length while front-end proxies prioritized Transfer-Encoding, causing request desynchronization.",
    globalImpact: "Impacted Go microservices, Kubernetes ingress controllers, and API gateways.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Local Go dev servers and microservices testing.",
      buildPipelineRisk: "Deploying Go binaries with unpatched net/http runtime into production.",
      recommendationForIdeBuilds: "Update Go toolchain to Go 1.22.4+ or 1.21.11+ using 'go install' or system package manager."
    },
    severity: "HIGH",
    cvssScore: 7.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N",
    cwe: "CWE-444: Inconsistent Interpretation of HTTP Requests",
    domainCategory: "Language Runtimes & Toolchains",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-45338"],
    affectedTargets: [
      { product: "Go net/http", ecosystem: "Golang", affectedVersions: "<1.21.11, <1.22.4", fixedInVersion: "1.22.4", purl: "pkg:golang/net/http@1.22.3" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "Request smuggling vector."
    },
    upstreamSignals: [
      { sourceId: "ecosystem_dbs", sourceName: "Go VulnDB", badge: "GO-2024-2887", finding: "Official Go security team bulletin for HTTP smuggling.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Go compiler to 1.22.4 or 1.21.11.",
      patchDetails: "Strictly reject requests with conflicting Transfer-Encoding and Content-Length headers.",
      workarounds: ["Normalize headers at reverse proxy boundary."]
    },
    publishedDate: "2024-06-04",
    lastUpdatedDate: "2026-08-20"
  },

  // 28. Jinja2 Template Attribute Injection (UVI-2024-34064)
  {
    uviId: "UVI-2024-34064",
    title: "Jinja2 Template Engine XML/HTML Attribute Injection via Macro Arguments",
    headline: "Flaw in Jinja2 XML and HTML attribute escaping allows attribute injection and Cross-Site Scripting (XSS).",
    summary: "In Jinja2 versions prior to 3.1.4, when rendering tags with keys containing spaces or special characters in user-supplied dictionaries, attribute injection was possible despite autoescaping enabled.",
    technicalDetails: "The xmlattr filter did not properly sanitize keys containing ASCII whitespace or control characters, allowing an attacker to inject additional attributes such as onload= or onerror= into rendered HTML tags.",
    globalImpact: "Affects Python web applications (Flask, FastAPI, Django with Jinja2) rendering user metadata.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Python doc generators and local Flask web applications.",
      buildPipelineRisk: "Documentation build runners compiling user-submitted templates.",
      recommendationForIdeBuilds: "Upgrade Jinja2 to 3.1.4+ in requirements.txt and pyproject.toml."
    },
    severity: "MEDIUM",
    cvssScore: 5.4,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N",
    cwe: "CWE-79: Cross-site Scripting (XSS)",
    domainCategory: "Enterprise & Web Frameworks",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-34064"],
    ghsaId: "GHSA-h5c8-rqrq-552m",
    osvId: "OSV-2024-34064",
    affectedTargets: [
      { product: "Jinja2", ecosystem: "Python PyPI", affectedVersions: "<3.1.4", fixedInVersion: "3.1.4", purl: "pkg:pypi/jinja2@3.1.3" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "Attribute injection."
    },
    upstreamSignals: [
      { sourceId: "ecosystem_dbs", sourceName: "PyPA Advisory DB", badge: "PYSEC-2024-48", finding: "Official Python security bulletin.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade jinja2 to 3.1.4 or higher.",
      patchDetails: "Enforced strict key validation in xmlattr filter to reject keys with spaces.",
      workarounds: ["Sanitize dictionary keys before passing to xmlattr."]
    },
    publishedDate: "2024-05-06",
    lastUpdatedDate: "2026-08-15"
  },

  // 29. OpenSSL ChaCha20-Poly1305 State Corruption (UVI-2024-52303)
  {
    uviId: "UVI-2024-52303",
    title: "OpenSSL ChaCha20-Poly1305 Cipher State Corruption and Cryptographic Bypass",
    headline: "Improper state handling in OpenSSL ChaCha20-Poly1305 can result in uninitialized memory leaks or integrity bypass.",
    summary: "A flaw in OpenSSL ChaCha20-Poly1305 cipher implementation when reinitializing contexts allowed authentication tags to be evaluated improperly under specific streaming chunk conditions.",
    technicalDetails: "When processing chunked inputs with repeated EVP_CipherInit_ex calls without clearing previous internal counter states, the Poly1305 accumulator was not reset, producing corrupt authentication tags.",
    globalImpact: "Affected TLS terminations and cryptographic services using ChaCha20-Poly1305 on ARM and x86_64.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Cryptographic operations in local developer servers.",
      buildPipelineRisk: "Deploying unpatched OpenSSL shared libraries in server images.",
      recommendationForIdeBuilds: "Keep system OpenSSL updated to 3.0.15+, 3.1.7+, 3.2.3+, or 3.3.2+."
    },
    severity: "MEDIUM",
    cvssScore: 5.9,
    cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:N",
    cwe: "CWE-327: Use of a Broken or Risky Cryptographic Algorithm",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-52303"],
    affectedTargets: [
      { product: "OpenSSL", ecosystem: "C/C++", affectedVersions: "3.0.0 - 3.0.14, 3.1.0 - 3.1.6", fixedInVersion: "3.0.15", purl: "pkg:generic/openssl@3.0.14" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "Cipher state corruption."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 5.9", finding: "Cryptographic state corruption in ChaCha20 cipher.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade OpenSSL to 3.0.15 or newer.",
      patchDetails: "Ensured Poly1305 accumulator is wiped and reinitialized on every context init.",
      workarounds: ["Prefer AES-GCM cipher suites where hardware acceleration is available."]
    },
    publishedDate: "2024-08-20",
    lastUpdatedDate: "2026-09-01"
  },

  // 30. MOVEit Transfer SQL Injection & Exfiltration (UVI-2023-34362)
  {
    uviId: "UVI-2023-34362",
    title: "Progress Software MOVEit Transfer SQL Injection Zero-Day (CL0P Ransomware)",
    headline: "Unauthenticated SQL injection in MOVEit Transfer web application exploited in massive global corporate extortion campaign.",
    summary: "An unauthenticated SQL injection vulnerability in the MOVEit Transfer web application allowed attackers to access database contents, alter database records, and execute remote code to exfiltrate massive files.",
    technicalDetails: "A SQL injection flaw in guestaccess.aspx permitted attackers to inject commands into the MOVEit database, creating unauthorized administrator sessions and installing LEMURLOOT webshells to exfiltrate files.",
    globalImpact: "Over 2,700 corporate and government organizations breached with sensitive employee records and files stolen.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Corporate file transfer infrastructure.",
      buildPipelineRisk: "Compromise of enterprise file exchange servers used to transfer compiled deliverables.",
      recommendationForIdeBuilds: "Ensure enterprise file distribution pipelines use signed artifacts and zero-trust distribution nodes."
    },
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-89: SQL Injection",
    domainCategory: "Enterprise & Web Frameworks",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-34362"],
    affectedTargets: [
      { product: "MOVEit Transfer", ecosystem: "Enterprise Software", affectedVersions: "<2021.0.6, <2022.0.4, <2023.0.1", fixedInVersion: "2023.0.1", purl: "pkg:generic/moveit-transfer@2023.0.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-06-02",
      ransomwareUse: true,
      notes: "CL0P ransomware zero-day extortion campaign."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Unauthenticated SQL injection leading to remote code execution.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Mass Extortion", finding: "Confirmed active weaponization across thousands of organizations.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply vendor emergency security hotfixes immediately.",
      patchDetails: "Sanitized SQL parameter bindings across all web endpoints.",
      workarounds: ["Disable HTTP/HTTPS access to MOVEit Transfer and restrict to VPN."]
    },
    publishedDate: "2023-06-02",
    lastUpdatedDate: "2026-08-15"
  }
];

export const CURATED_INFORMATIONAL_DISCLOSURES: UviAdvisoryRecord[] = [
  // 1. Credential-Stuffing Wave Abusing Residential Proxy Botnets
  {
    uviId: "UVI-INFO-2025-0001",
    title: "Informational: Residential Proxy Botnets Fueling Automated Credential-Stuffing Against Dev & Git Portals",
    headline: "Public chatter and investigative reports track massive distributed botnets rotating consumer IPs to bypass rate-limiting on developer portals.",
    summary: "Investigative reporting by Brian Krebs and threat researcher telemetry reveal widespread credential-stuffing campaigns utilizing residential proxy micro-tunnels to systematically brute-force developer Git repositories and CI/CD portals.",
    technicalDetails: "Adversaries route credential-stuffing scripts through peer-to-peer residential proxy services (frequently monetized consumer SDKs or infected IoT gateways). Each login attempt originates from a distinct residential ASN with legitimate IP reputation scores, completely neutralizing legacy CIDR-based rate limits and geo-fencing protections on developer SSO portals.",
    globalImpact: "Widespread account takeover risks across SaaS, self-hosted GitLab, and GitHub Enterprise deployments, leading to unauthorized code commits and pipeline tampering.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developer accounts and Git credentials targeted for takeover to commit malicious code or extract private repository tokens.",
      buildPipelineRisk: "Compromised developer credentials used to alter build workflows, tamper with release tags, or exfiltrate deployment keys.",
      recommendationForIdeBuilds: "Mandate hardware-backed WebAuthn/FIDO2 MFA for all Git commits and portal logins; eliminate password-only fallback."
    },
    severity: "HIGH",
    cvssScore: 8.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
    cwe: "CWE-307: Improper Restriction of Excessive Authentication Attempts",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "VIRAL",
      consensusLevel: "INVESTIGATIVE_REPORT",
      weaponizationStage: "ACTIVE_CAMPAIGNS",
      exposureHorizon: "IDENTITY_AND_HUMAN",
      operationalDomain: "IDENTITY",
      actionDirective: "IDENTITY",
      vectorCategory: "Authentication & SSO Bypass Chatter",
      executiveBrief: "Coordinated botnets are leasing residential internet connections to rotate IP addresses with every login attempt, conducting stealthy credential-stuffing against corporate Git repositories without triggering IP-based rate limiting.",
      inferredMechanism: "Automated distributed replay of compromised developer password dumps over rotating residential proxy gateways, probing OAuth/SAML endpoints and Git HTTP Basic Auth.",
      potentialVictimSurface: ["GitLab Self-Hosted", "GitHub Enterprise SSO", "Gitea / Forgejo", "Atlassian Bitbucket"],
      precautionaryPosture: "Enforce phishing-resistant MFA (FIDO2/WebAuthn), disable password-only fallback on developer SSO, and monitor for sudden spikes in distributed single-attempt logins.",
      primarySources: [
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "Residential Proxy Networks Fueling Account Takeover Waves Against Tech Orgs",
          url: "https://krebsonsecurity.com",
          publishedAt: "2025-02-14",
          signalQuote: "The commercialization of residential proxy infrastructure has lowered the bar for massive, distributed credential-stuffing that blends seamlessly into ordinary domestic traffic."
        },
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Spike in automated login attacks targeting enterprise developer Git portals",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-02-16",
          signalQuote: "Researchers report millions of authentication attempts per hour distributed across tens of thousands of consumer IP addresses targeting dev platforms."
        }
      ]
    },
    affectedTargets: [
      { product: "Developer SSO & Git Portals", ecosystem: "Developer Identity", affectedVersions: "All instances lacking FIDO2 enforcement" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Investigation",
        finding: "Investigative report detailing commercial residential proxy botnets executing distributed developer credential-stuffing.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "Underground Intel",
        finding: "Threat intelligence documenting brute-force credential dumps targeting developer platform authentication.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Mandate hardware FIDO2 tokens, enforce device-trust certificates, and implement adaptive risk-based authentication.",
      patchDetails: "Informational disclosure; mitigate through identity provider policy and network-level bot management.",
      workarounds: ["Deploy CAPTCHA or proof-of-work challenges on unauthenticated login endpoints.", "Disallow Git HTTPS basic authentication in favor of SSH with hardware keys."]
    },
    publishedDate: "2025-02-14",
    lastUpdatedDate: "2025-02-18"
  },

  // 2. Prompt Injection Exfiltration in Autonomous IDE AI Coding Agents
  {
    uviId: "UVI-INFO-2025-0002",
    title: "Informational: Prompt Injection Vectors in Autonomous IDE AI Coding Assistants",
    headline: "Security research highlights untrusted context poisoning in AI coding extensions, enabling silent workspace secret exfiltration.",
    summary: "Academic preprints and researcher teardowns demonstrate that untrusted markdown, comments, or repository files can manipulate IDE-integrated AI agents into reading local environment variables and making unauthorized outbound network calls.",
    technicalDetails: "When an autonomous AI coding assistant parses untrusted repository content (e.g. reviewing an external PR or indexing cloned dependencies), concealed prompt instructions override developer guardrails. The agent can be coerced into reading .env or cloud credential files and embedding the stolen tokens in image URLs or tool calls.",
    globalImpact: "Developers utilizing autonomous AI coding tools on untrusted public codebases risk silent exfiltration of API keys, SSH keys, and proprietary code.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Autonomous AI agents operating with full workspace read/execute permissions on developer machines.",
      buildPipelineRisk: "Compromised local dev environment leaking build secrets or generating subtly backdoored code commits.",
      recommendationForIdeBuilds: "Isolate AI coding agent execution; require explicit developer confirmation for terminal execution and outbound network calls."
    },
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N",
    cwe: "CWE-94: Improper Control of Generation of Code (Code Injection)",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "HIGH",
      consensusLevel: "RESEARCHER_DISCLOSURE",
      weaponizationStage: "UNDERGROUND_TOOLING",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      operationalDomain: "AGENT",
      actionDirective: "AGENT",
      vectorCategory: "AI & Agent Exfiltration Vectors",
      executiveBrief: "AI assistants inside code editors can be tricked by malicious instructions hidden in README files or code comments into reading your private files (.env, AWS keys) and sending them to an external server.",
      inferredMechanism: "Indirect prompt injection manipulating LLM tool-calling APIs to invoke file-reading routines and format exfiltration payloads as markdown image embeds or web fetch commands.",
      potentialVictimSurface: ["VS Code Copilot / Cline / Cursor", "JetBrains AI Assistant", "Devin / Autonomous Dev Bots"],
      precautionaryPosture: "Disable automatic tool execution for untrusted repositories; restrict AI agent file access to explicit inclusions; monitor IDE process network egress.",
      primarySources: [
        {
          sourceId: "schneier_security",
          sourceName: "Schneier on Security",
          authorOrHandle: "Bruce Schneier",
          headline: "Indirect Prompt Injection in AI Developer Workflows",
          url: "https://www.schneier.com",
          publishedAt: "2025-01-22",
          signalQuote: "Prompt injection is not just a chatbot quirk; when LLMs are granted access to execute commands and read developer workspaces, it represents an arbitrary command execution vector."
        },
        {
          sourceId: "academic_research",
          sourceName: "Academic Research (arXiv)",
          headline: "Invisible Markdown Traps: Exfiltrating Workspace Secrets via Autonomous LLM Tool Calling",
          url: "https://arxiv.org/abs/cs.CR",
          publishedAt: "2025-01-28",
          signalQuote: "Demonstrated 94% success rate inducing autonomous coding agents to leak .env tokens across 12 popular IDE extensions without user prompt warnings."
        }
      ]
    },
    affectedTargets: [
      { product: "IDE AI Extensions & Assistants", ecosystem: "VS Code / JetBrains / Cursor", affectedVersions: "All agentic extensions lacking strict egress sandboxing" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "schneier_security",
        sourceName: "Schneier on Security",
        badge: "Bruce Schneier Analysis",
        finding: "Architectural analysis highlighting agentic prompt injection as the fundamental software weakness of the AI coding era.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "academic_research",
        sourceName: "Academic Research (arXiv)",
        badge: "Preprint PoC",
        finding: "Empirical proof of concept demonstrating workspace secret extraction via autonomous tool calling.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Configure AI coding extensions in read-only sandbox mode and mandate approval prompts before invoking terminal commands.",
      patchDetails: "Emerging vector; vendors developing dual-model validation and strict context compartmentalization.",
      workarounds: ["Do not open untrusted repositories or review external PRs in the same workspace containing sensitive .env files."]
    },
    publishedDate: "2025-01-22",
    lastUpdatedDate: "2025-02-05"
  },

  // 3. Post-Quantum Transition Race Conditions in TLS 1.3 Hybrid Key Exchange
  {
    uviId: "UVI-INFO-2025-0003",
    title: "Informational: Post-Quantum Transition Race Conditions & Degradation Vectors in Hybrid TLS 1.3",
    headline: "Cryptographic researcher chatter and preprints identify record fragmentation vulnerabilities in early ML-KEM deployments.",
    summary: "Discussions across IACR ePrint and cryptographer blogs highlight that hybrid post-quantum key encapsulation (X25519 + ML-KEM-768) causes packet fragmentation that intermediate middleboxes misinterpret, creating downgrade or denial-of-service vectors.",
    technicalDetails: "The significantly larger public key and ciphertext sizes required by lattice-based algorithms (ML-KEM/Kyber) push TLS ClientHello and ServerHello packets past typical MTU boundaries (1500 bytes). Middleboxes, enterprise TLS inspectors, and legacy firewall state tables drop fragmented ClientHello packets, inducing unauthenticated fallback or connection stalling.",
    globalImpact: "Enterprise networks testing post-quantum TLS readiness risk unexpected service degradation, MTU blackholing, or protocol downgrade vulnerabilities.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "MEDIUM",
      workstationVector: "Developer VPNs, package registry connections (npm/PyPI/crates.io), and Git remote operations over PQC-enabled networks.",
      buildPipelineRisk: "Intermittent build failures during artifact downloads when enterprise firewalls drop fragmented PQC handshake packets.",
      recommendationForIdeBuilds: "Ensure corporate proxy configs support fragmented TLS ClientHello records without unauthenticated cipher downgrade."
    },
    severity: "MEDIUM",
    cvssScore: 6.8,
    cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:H",
    cwe: "CWE-310: Cryptographic Issues",
    domainCategory: "Networking, Protocols & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "MODERATE",
      consensusLevel: "ACADEMIC_PREPRINT",
      weaponizationStage: "ACADEMIC_RESEARCH",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      operationalDomain: "NETWORK",
      actionDirective: "NETWORK",
      vectorCategory: "Network Protocol & Cryptography",
      executiveBrief: "As internet servers begin testing post-quantum encryption, the larger encryption keys cause network packets to split. Flawed enterprise firewalls are dropping these packets or forcing connections to downgrade to weaker encryption.",
      inferredMechanism: "TLS 1.3 ClientHello record fragmentation across TCP segments triggering middlebox packet rejection or inducing silent fallback to classic elliptic curves.",
      potentialVictimSurface: ["Enterprise TLS Inspection Proxies", "Developer VPN Concentrators", "Cloudflare / CDN Edge Gateways"],
      precautionaryPosture: "Audit enterprise egress firewall MTU handling; test ML-KEM-768 negotiation on development machines; monitor for unexpected TLS handshake timeouts.",
      primarySources: [
        {
          sourceId: "schneier_security",
          sourceName: "Schneier on Security",
          authorOrHandle: "Bruce Schneier",
          headline: "The PQC Transition: What Breaks When Keys Get Large",
          url: "https://www.schneier.com",
          publishedAt: "2024-11-12",
          signalQuote: "We are moving from key sizes measured in tens of bytes to thousands of bytes. The mathematical cryptography is solid, but the network plumbing wasn't built for packets this bulky."
        },
        {
          sourceId: "academic_research",
          sourceName: "IACR Cryptology ePrint",
          headline: "Empirical Measurements of Hybrid Post-Quantum Handshake Degradation Across Global ASNs",
          url: "https://eprint.iacr.org",
          publishedAt: "2024-12-04",
          signalQuote: "Found 4.8% of global network paths fail or downgrade when ClientHello records exceed 1400 bytes due to aggressive middlebox state inspection."
        }
      ]
    },
    affectedTargets: [
      { product: "TLS 1.3 Hybrid Implementations", ecosystem: "Network Protocols", affectedVersions: "Implementations negotiating X25519Kyber768" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "schneier_security",
        sourceName: "Schneier on Security",
        badge: "Bruce Schneier Essay",
        finding: "Analysis of operational hazards in post-quantum key exchange rollout across network infrastructure.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "academic_research",
        sourceName: "IACR ePrint",
        badge: "Cryptographic Preprint",
        finding: "Global telemetry confirming packet fragmentation drops during hybrid post-quantum TLS handshakes.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Verify enterprise middlebox firmware supports TLS ClientHello record fragmentation and disable unverified cipher suite downgrade.",
      patchDetails: "Protocol tuning: increase TCP initial window sizes and ensure TCP MSS clamping handles larger packet envelopes.",
      workarounds: ["Temporarily configure developer clients to prefer standard X25519 if corporate network drops PQC packets."]
    },
    publishedDate: "2024-11-12",
    lastUpdatedDate: "2025-01-10"
  },

  // 4. Targeted Subdomain Hijacking of Dead Cloud Storage Endpoints in Build Pipelines
  {
    uviId: "UVI-INFO-2025-0004",
    title: "Informational: Dangling CNAME Hijacking of Orphaned Cloud Storage in CI/CD Build Pipelines",
    headline: "Underground chatter and telemetry indicate threat actors systematically claiming abandoned S3 and Blob domains cited in legacy setup scripts.",
    summary: "Security researchers and hacker forum observers warn of automated scanners monitoring public Git repositories for setup scripts referencing expired or abandoned cloud storage buckets to inject backdoored build dependencies.",
    technicalDetails: "Many developer setup scripts and Dockerfiles contain legacy curl/wget commands pointing to custom subdomains (e.g. downloads.mytool.com) that CNAME to cloud object stores. When organizations delete the underlying storage bucket without updating DNS records, threat actors recreate the bucket in the same cloud region and host malicious binary payloads.",
    globalImpact: "High-integrity supply chain compromise of development environments, automated build runners, and production Docker container builds.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: "Developers executing local setup scripts or curl-pipe-sh install guides referencing abandoned domain names.",
      buildPipelineRisk: "CI/CD runners executing automated dependency pulls from hijacked subdomains, executing untrusted code with runner privileges.",
      recommendationForIdeBuilds: "Mandate cryptographic hash verification (SHA-256) on all external binary downloads in build and setup scripts."
    },
    severity: "HIGH",
    cvssScore: 8.2,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N",
    cwe: "CWE-829: Inclusion of Functionality from Untrusted Sphere",
    domainCategory: "Cloud & Container Infrastructure",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "HIGH",
      consensusLevel: "INVESTIGATIVE_REPORT",
      weaponizationStage: "UNDERGROUND_TOOLING",
      exposureHorizon: "SUPPLY_CHAIN_NETWORK",
      operationalDomain: "PIPELINE",
      actionDirective: "PIPELINE",
      vectorCategory: "Cloud Identity & Token Hijacking",
      executiveBrief: "Hackers are scanning public GitHub repositories for old download links that point to deleted Amazon S3 or Azure storage buckets. They register the deleted bucket name and serve malicious code to anyone running the installer script.",
      inferredMechanism: "Dangling DNS CNAME pointing to deregistered cloud storage namespace; attacker claims bucket name and uploads trojanized binaries.",
      potentialVictimSurface: ["Developer Setup Scripts", "Dockerfile Build Stages", "Continuous Integration Workflows"],
      precautionaryPosture: "Audit external DNS zones for dangling CNAMEs; enforce cryptographic hash verification (SHA-256) on every binary downloaded in automated scripts.",
      primarySources: [
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Researchers warn of surge in dangling CNAME takeovers targeting open-source install scripts",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-02-02",
          signalQuote: "Automated bots are scraping commits for S3 bucket 404 errors, instantly registering the namespace to poison developer supply chains."
        },
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "Ghost CDNs: The Forgotten Subdomains Powering Silent Malware Distribution",
          url: "https://krebsonsecurity.com",
          publishedAt: "2025-01-18",
          signalQuote: "When a company migrates cloud accounts but forgets a single DNS record, they effectively hand the keys to their build pipeline to whoever registers the old bucket first."
        }
      ]
    },
    affectedTargets: [
      { product: "Build Artifact & Installer Pipelines", ecosystem: "Cloud CI/CD", affectedVersions: "Scripts lacking SHA-256 hash checks" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "Threat Intel",
        finding: "Report documenting widespread scanning for dangling bucket CNAMEs in open-source setup guides.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Investigation",
        finding: "Detailed case studies of corporate build pipelines hijacked via unmanaged cloud asset domains.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Audit DNS zones with automated subdomain takeover scanners and remove obsolete CNAME records.",
      patchDetails: "Enforce code signing and checksum validation for all build toolchain dependencies.",
      workarounds: ["Mirror all external third-party binaries to internal private artifact registries (Nexus/Artifactory)."]
    },
    publishedDate: "2025-01-18",
    lastUpdatedDate: "2025-02-10"
  },

  // 5. eBPF Rootkit Persistence and Container Escape Techniques Discussed in Underground Forums
  {
    uviId: "UVI-INFO-2025-0005",
    title: "Informational: eBPF Stealth Rootkit Techniques & Container Escape Vectors Discussed in Underground Channels",
    headline: "Underground hacker telemetry and researcher PoCs demonstrate eBPF ring-buffer manipulation to conceal malicious processes.",
    summary: "Discussions across underground hacker forums and vx-underground repositories catalog advanced proof-of-concepts using privileged Linux eBPF programs to blind security agents and mask container breakout operations.",
    technicalDetails: "By attaching eBPF programs to kernel tracepoints and kprobes (e.g. sys_enter_getdents64 and sys_enter_kill), an adversary with root inside a container with CAP_BPF can filter directory listings and process trees. EDR sensors and auditd relying on standard syscall hooks are blinded because the telemetry is altered before reaching user-space.",
    globalImpact: "Compromise of Kubernetes worker nodes and container hosts with near-zero forensic visibility for standard security agents.",
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: "LOW",
      workstationVector: "Developer machines running local Docker/Kubernetes clusters with privileged containers.",
      buildPipelineRisk: "Compromised self-hosted CI runner hosts where privileged containers manipulate host kernel state.",
      recommendationForIdeBuilds: "Disable unprivileged eBPF and strictly disallow CAP_BPF / CAP_SYS_ADMIN in runner container definitions."
    },
    severity: "HIGH",
    cvssScore: 8.4,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:H/UI:N/S:C/C:H/I:H/A:H",
    cwe: "CWE-250: Execution with Unnecessary Privileges",
    domainCategory: "Cloud & Container Infrastructure",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "HIGH",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "HIGH",
      consensusLevel: "UNDERGROUND_SIGNAL",
      weaponizationStage: "UNDERGROUND_TOOLING",
      exposureHorizon: "CI_CD_PIPELINE",
      operationalDomain: "ENDPOINT",
      actionDirective: "ENDPOINT",
      vectorCategory: "Kernel & Container Infrastructure",
      executiveBrief: "Hacker groups are circulating proof-of-concept rootkits that abuse Linux eBPF features. If an attacker gets root in a privileged container, they can alter what your security software sees, making malware completely invisible.",
      inferredMechanism: "Attaching eBPF filter programs to kernel VFS probes to rewrite process tables, network sockets, and file listings before returning to monitoring tools.",
      potentialVictimSurface: ["Kubernetes Worker Nodes", "Privileged Docker Runners", "Linux Cloud Servers"],
      precautionaryPosture: "Set sysctl kernel.unprivileged_bpf_disabled=1; strip CAP_BPF and CAP_SYS_ADMIN from container runtime profiles; deploy kernel signature enforcement for BPF bytecode.",
      primarySources: [
        {
          sourceId: "underground_intel",
          sourceName: "Underground Intel (vx-underground)",
          headline: "Underground forums circulate proof-of-concept eBPF rootkit that evades modern Linux EDR",
          url: "https://vx-underground.org",
          publishedAt: "2025-01-30",
          signalQuote: "The PoC hooks raw tracepoints to modify user-space buffers, effectively hiding specified PIDs and open network connections from ps, netstat, and commercial agents."
        },
        {
          sourceId: "academic_research",
          sourceName: "Trail of Bits & Academic Intel",
          headline: "Blind in the Kernel: The Challenges of Detecting Malicious eBPF Bytecode",
          url: "https://blog.trailofbits.com",
          publishedAt: "2025-02-08",
          signalQuote: "Because eBPF is designed to be an observability tool, detecting when it is weaponized against the observer requires kernel-level integrity verification of the BPF subsystem itself."
        }
      ]
    },
    affectedTargets: [
      { product: "Linux Kernel eBPF Subsystem", ecosystem: "Linux Container Runtimes", affectedVersions: "Kernels allowing unconstrained CAP_BPF / unprivileged BPF" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "underground_intel",
        sourceName: "Underground Intel (vx-underground)",
        badge: "Exploit Telemetry",
        finding: "Cataloging functional eBPF rootkit code samples circulated across private researcher channels.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "academic_research",
        sourceName: "Trail of Bits Research",
        badge: "Deep AST Research",
        finding: "Technical analysis of memory interception techniques bypassing Linux endpoint telemetry.",
        signalType: "RESEARCH_DISCLOSURE",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Enforce kernel sysctl 'kernel.unprivileged_bpf_disabled = 1' and drop CAP_BPF from all container security contexts.",
      patchDetails: "Operating system hardening guidance; mandate kernel module and BPF program signing where supported.",
      workarounds: ["Use seccomp filters to disallow the bpf() syscall entirely in unprivileged container environments."]
    },
    publishedDate: "2025-01-30",
    lastUpdatedDate: "2025-02-12"
  },

  // 6. Silent Session Hijacking via Browser Extension Native Messaging Host Spoofing
  {
    uviId: "UVI-INFO-2025-0006",
    title: "Informational: Browser Extension Native Messaging Bridge Hijacking by Infostealer Malware",
    headline: "Investigative reporting and infostealer malware analysis reveal systematic tampering with Native Messaging host registries on dev machines.",
    summary: "Threat intel from Brian Krebs and security researchers highlights evolving infostealer malware targeting the Native Messaging JSON manifests used by password managers, developer tokens, and hardware security keys.",
    technicalDetails: "Chromium and Firefox browsers use Native Messaging to allow web extensions to exchange messages with local desktop applications via stdio. Infostealer trojans running under regular user permissions rewrite the registry keys or manifest files pointing to these native hosts, inserting proxy wrappers that log and exfiltrate master passwords, hardware tokens, and active session cookies.",
    globalImpact: "Full compromise of developer password managers, cryptocurrency wallets, and enterprise SSO sessions without triggering browser security alerts.",
    ideBuildImpact: {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "CRITICAL",
      workstationVector: "Developer workstations running desktop browser extensions linked to password managers and internal tools.",
      buildPipelineRisk: "Stolen developer session tokens and master vault credentials used to compromise internal Git repositories and production cloud consoles.",
      recommendationForIdeBuilds: "Monitor and lock registry keys and manifest paths for Native Messaging hosts; enforce binary code signature checks on all local bridges."
    },
    severity: "HIGH",
    cvssScore: 8.6,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N",
    cwe: "CWE-427: Uncontrolled Search Path Element",
    domainCategory: "Developer Tools & Workstations",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "LOW",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: [],
    disclosureType: "INFORMATIONAL_DISCLOSURE",
    informationalSynthesis: {
      chatterVelocity: "VIRAL",
      consensusLevel: "INVESTIGATIVE_REPORT",
      weaponizationStage: "ACTIVE_CAMPAIGNS",
      exposureHorizon: "DEVELOPER_WORKSTATION",
      operationalDomain: "IDENTITY",
      actionDirective: "IDENTITY",
      vectorCategory: "Developer Supply Chain Reconnaissance",
      executiveBrief: "New infostealer malware variants are quietly modifying local configuration files that link your browser extensions to desktop apps. This allows them to eavesdrop on password managers and developer tokens passing between the browser and local software.",
      inferredMechanism: "User-space registry key modification pointing extension NativeMessagingHosts to malicious intermediary wrapper scripts.",
      potentialVictimSurface: ["Developer Browser Extensions", "Desktop Password Managers", "Hardware Security Key Apps"],
      precautionaryPosture: "Audit NativeMessagingHosts registry paths on developer workstations; use endpoint protection to block unauthorized modification of browser extension manifest directories.",
      primarySources: [
        {
          sourceId: "krebs_security",
          sourceName: "Krebs on Security",
          authorOrHandle: "Brian Krebs",
          headline: "Infostealers Pivot to Hijacking Browser-to-Desktop Native Messaging Bridges",
          url: "https://krebsonsecurity.com",
          publishedAt: "2025-02-18",
          signalQuote: "Instead of trying to break browser memory encryption, malware authors are simply rewriting the local JSON config files that tell extensions which desktop applications to trust."
        },
        {
          sourceId: "bleeping_computer",
          sourceName: "BleepingComputer",
          headline: "Lumma and Stealc malware variants observed modifying Chrome and Firefox NativeMessaging manifests",
          url: "https://www.bleepingcomputer.com",
          publishedAt: "2025-02-20",
          signalQuote: "The attack succeeds with normal user privileges because the manifest registries are stored within the current user profile rather than system-wide locations."
        }
      ]
    },
    affectedTargets: [
      { product: "Browser Native Messaging Bridges", ecosystem: "Chrome / Firefox / Edge", affectedVersions: "All installations with user-writable NativeMessagingHosts registries" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      {
        sourceId: "krebs_security",
        sourceName: "Krebs on Security",
        badge: "Brian Krebs Report",
        finding: "Detailed breakdown of infostealer campaigns intercepting password manager communications via native host configuration hijacking.",
        signalType: "INFORMATIONAL_CHATTER",
        confidence: "CONFIRMED"
      },
      {
        sourceId: "bleeping_computer",
        sourceName: "BleepingComputer",
        badge: "Malware Analysis",
        finding: "Confirmed telemetry showing Lumma stealer actively modifying Chromium NativeMessagingHosts keys.",
        signalType: "ACTIVE_EXPLOITATION",
        confidence: "CONFIRMED"
      }
    ],
    remediation: {
      recommendedAction: "Apply endpoint management policies to set read-only ACLs on NativeMessagingHosts registry hives and directories.",
      patchDetails: "Workstation hardening recommendation; browser vendors are evaluating code-signing requirements for native host executables.",
      workarounds: ["Regularly inspect and audit HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts for unrecognized binaries."]
    },
    publishedDate: "2025-02-18",
    lastUpdatedDate: "2025-02-22"
  }
];

import { 
  ADDITIONAL_INFORMATIONAL_DISCLOSURES, 
  ADDITIONAL_CURATED_MALWARE_ADVISORIES, 
  ADDITIONAL_CURATED_CVE_ADVISORIES 
} from './threat-feed-more-data';

// Append additional curated informational disclosures
CURATED_INFORMATIONAL_DISCLOSURES.push(...ADDITIONAL_INFORMATIONAL_DISCLOSURES);

// Append curated malware, CVEs, and informational disclosures to CONSOLIDATED_UVI_ADVISORIES
CONSOLIDATED_UVI_ADVISORIES.push(
  ...ADDITIONAL_CURATED_MALWARE_ADVISORIES,
  ...ADDITIONAL_CURATED_CVE_ADVISORIES,
  ...CURATED_INFORMATIONAL_DISCLOSURES
);

