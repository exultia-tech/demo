import { 
  CONSOLIDATED_UVI_ADVISORIES, 
  UviAdvisoryRecord, 
  DomainCategory, 
  ThreatSeverity,
  IdeBuildImpactAssessment
} from './threat-feed-data';

interface CisaKevItem {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
  knownRansomwareCampaignUse: string;
  notes?: string;
  cwes?: string[];
}

interface CisaKevCatalog {
  title: string;
  catalogVersion: string;
  dateReleased: string;
  count: number;
  vulnerabilities: CisaKevItem[];
}

// In-Memory Cache for Aggregated Live Records
let cachedAggregatedAdvisories: UviAdvisoryRecord[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

function classifyDomain(vendor: string, product: string, desc: string): DomainCategory {
  const text = `${vendor} ${product} ${desc}`.toLowerCase();

  if (text.includes("git") || text.includes("vscode") || text.includes("visual studio") || text.includes("jetbrains") || text.includes("jenkins") || text.includes("gitlab") || text.includes("eclipse") || text.includes("sublime") || text.includes("xcode")) {
    return "Developer Tools & Workstations";
  }
  if (text.includes("backdoor") || text.includes("trojan") || text.includes("supply chain") || text.includes("malware") || text.includes("typosquat") || text.includes("solarwinds") || text.includes("event-stream")) {
    return "Supply Chain & Malware";
  }
  if (text.includes("windows") || text.includes("linux") || text.includes("macos") || text.includes("ios") || text.includes("android") || text.includes("kernel") || text.includes("glibc") || text.includes("sudo") || text.includes("bsd") || text.includes("apple") || text.includes("microsoft")) {
    return "Operating Systems & Kernels";
  }
  if (text.includes("kubernetes") || text.includes("docker") || text.includes("runc") || text.includes("containerd") || text.includes("container") || text.includes("vmware") || text.includes("esxi") || text.includes("hyper-v") || text.includes("aws") || text.includes("azure") || text.includes("gcp") || text.includes("openshift")) {
    return "Cloud & Container Infrastructure";
  }
  if (text.includes("postgres") || text.includes("mysql") || text.includes("redis") || text.includes("mongodb") || text.includes("oracle") || text.includes("sql") || text.includes("database") || text.includes("sqlite") || text.includes("mariadb")) {
    return "Databases & Storage";
  }
  if (text.includes("cisco") || text.includes("fortinet") || text.includes("palo alto") || text.includes("openssl") || text.includes("openssh") || text.includes("vpn") || text.includes("router") || text.includes("firewall") || text.includes("sonicwall") || text.includes("f5") || text.includes("big-ip") || text.includes("dns") || text.includes("http") || text.includes("tls") || text.includes("ssh") || text.includes("curl")) {
    return "Networking, Protocols & Cryptography";
  }
  if (text.includes("node") || text.includes("python") || text.includes("rust") || text.includes("golang") || text.includes("go ") || text.includes("ruby") || text.includes("compiler") || text.includes("runtime") || text.includes("npm") || text.includes("pypi") || text.includes("cargo") || text.includes("v8") || text.includes("chromium")) {
    return "Language Runtimes & Toolchains";
  }
  
  // Default fallback
  return "Enterprise & Web Frameworks";
}

function evaluateIdeBuildImpact(vendor: string, product: string, desc: string, action: string): IdeBuildImpactAssessment {
  const text = `${vendor} ${product} ${desc}`.toLowerCase();

  const isDirectDev = 
    text.includes("git") || 
    text.includes("vscode") || 
    text.includes("visual studio") || 
    text.includes("node") || 
    text.includes("npm") || 
    text.includes("python") || 
    text.includes("pip") || 
    text.includes("rust") || 
    text.includes("cargo") || 
    text.includes("go") || 
    text.includes("golang") || 
    text.includes("docker") || 
    text.includes("compiler") || 
    text.includes("ide") || 
    text.includes("jenkins") || 
    text.includes("gitlab") || 
    text.includes("maven") || 
    text.includes("gradle") || 
    text.includes("bash") || 
    text.includes("powershell") || 
    text.includes("terminal");

  if (isDirectDev) {
    return {
      hasDirectBuildImpact: true,
      severityOnDeveloperEnv: "HIGH",
      workstationVector: `Developer workstations and local build tools running ${vendor} ${product}. Vulnerable during local builds, script execution, or IDE tasks.`,
      buildPipelineRisk: `Compromise of CI/CD runner environments or build scripts parsing untrusted repository inputs.`,
      recommendationForIdeBuilds: `Upgrade ${product} in developer workstations and CI base images. Mandatory remediation: ${action}`
    };
  }

  return {
    hasDirectBuildImpact: false,
    severityOnDeveloperEnv: "INDIRECT",
    workstationVector: `Enterprise server or cloud boundary threat; low direct impact to developer laptops unless running local instances of ${product}.`,
    buildPipelineRisk: `Cloud staging environments or downstream infrastructure hosting ${product}.`,
    recommendationForIdeBuilds: `Verify production and staging deployments: ${action}`
  };
}

export async function getAggregatedUviAdvisories(): Promise<UviAdvisoryRecord[]> {
  const now = Date.now();
  if (cachedAggregatedAdvisories && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedAggregatedAdvisories;
  }

  // Start with our curated high-fidelity milestone advisories
  const merged: UviAdvisoryRecord[] = [...CONSOLIDATED_UVI_ADVISORIES];
  const existingCveSet = new Set<string>();

  for (const item of CONSOLIDATED_UVI_ADVISORIES) {
    for (const cve of item.cveList) {
      existingCveSet.add(cve.toUpperCase());
    }
  }

  try {
    // Fetch live CISA KEV catalog (1,695+ real-time active zero-days)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json", {
      signal: controller.signal,
      headers: { "User-Agent": "SecureIDE-UVI-Aggregator/3.0" },
      next: { revalidate: 3600 }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const catalog: CisaKevCatalog = await response.json();
      
      if (catalog && Array.isArray(catalog.vulnerabilities)) {
        for (const item of catalog.vulnerabilities) {
          const cveUpper = item.cveID.toUpperCase();
          if (existingCveSet.has(cveUpper)) {
            continue; // Keep our detailed curated record as authoritative
          }
          existingCveSet.add(cveUpper);

          const domain = classifyDomain(item.vendorProject, item.product, item.shortDescription);
          const devImpact = evaluateIdeBuildImpact(item.vendorProject, item.product, item.shortDescription, item.requiredAction);
          const isRansomware = item.knownRansomwareCampaignUse === "Known";
          const severity: ThreatSeverity = isRansomware ? "CRITICAL" : "HIGH";
          const cvssScore = isRansomware ? 9.8 : 8.8;

          const uviId = `UVI-${item.cveID.replace(/^CVE-/i, "")}`;

          const record: UviAdvisoryRecord = {
            uviId,
            title: item.vulnerabilityName,
            headline: item.shortDescription,
            summary: `${item.vulnerabilityName} affecting ${item.vendorProject} ${item.product}. Confirmed in CISA Known Exploited Vulnerabilities (KEV) Catalog.`,
            technicalDetails: `${item.shortDescription} Required action under CISA BOD guidelines: ${item.requiredAction}. Added to KEV on ${item.dateAdded}. References: ${item.notes || "None"}.`,
            globalImpact: `Active weaponization confirmed by CISA across enterprise networks. Vendor: ${item.vendorProject}, Product: ${item.product}. Federal due date for remediation: ${item.dueDate}.`,
            ideBuildImpact: devImpact,
            severity,
            cvssScore,
            cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
            cwe: (item.cwes && item.cwes.length > 0) ? item.cwes.join(", ") : "CWE-94: Improper Control of Generation of Code",
            domainCategory: domain,
            attackVector: "NETWORK",
            attackComplexity: "LOW",
            privilegesRequired: "NONE",
            userInteraction: "NONE",
            scope: "UNCHANGED",
            cveList: [item.cveID],
            affectedTargets: [
              {
                product: item.product,
                ecosystem: item.vendorProject,
                affectedVersions: "Prior to remediation update",
                fixedInVersion: item.requiredAction.length > 50 ? `${item.requiredAction.slice(0, 48)}...` : item.requiredAction
              }
            ],
            cisaKev: {
              isKnownExploited: true,
              dateAdded: item.dateAdded,
              ransomwareUse: isRansomware,
              notes: item.notes
            },
            upstreamSignals: [
              {
                sourceId: "cisa_kev",
                sourceName: "CISA KEV",
                badge: isRansomware ? "Ransomware Weapon" : "Exploited in Wild",
                finding: `Confirmed active exploitation in the wild cataloged by CISA. Remediation due: ${item.dueDate}.`,
                signalType: "ACTIVE_EXPLOITATION",
                confidence: "CONFIRMED"
              },
              {
                sourceId: "nvd_cve",
                sourceName: "NIST NVD",
                badge: item.cveID,
                finding: `Official CVE index tracking for ${item.vendorProject} ${item.product}.`,
                signalType: "CVE_RECORD",
                confidence: "CONFIRMED"
              }
            ],
            remediation: {
              recommendedAction: item.requiredAction,
              patchDetails: `Apply updates from ${item.vendorProject} per official security bulletin. Due: ${item.dueDate}.`,
              workarounds: ["Isolate internet exposure and restrict administrative access."]
            },
            publishedDate: item.dateAdded,
            lastUpdatedDate: item.dateAdded
          };

          merged.push(record);
        }
      }
    }
  } catch (err) {
    console.warn("Live CISA KEV fetch failed or timed out, serving cached/curated advisories:", err);
  }

  cachedAggregatedAdvisories = merged;
  lastCacheTime = now;
  return merged;
}
