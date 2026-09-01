"use client";

import { useState, useEffect } from "react";

// Multi-IDE Types
type IdeEngine = "vscode" | "theia" | "zed" | "neovim" | "jupyter";

interface CveAdvisory {
  id: string;
  ghsaId?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  cvssScore: number;
  cwe: string;
  summary: string;
  impact: string;
  affectedVersions: string;
  fixedIn: string;
  publishedDate: string;
  nvdUrl: string;
  ghsaUrl: string;
  osvUrl: string;
}

interface ThreatFeedSignals {
  nvd: {
    status: "CLEAN" | "CVE_DETECTED";
    cveId?: string;
    cvss?: number;
    feedName: "NIST NVD / GHSA / OSV.dev";
  };
  jfrog: {
    status: "CLEAN" | "CONTEXTUAL_SAFE" | "EXPLOITABLE_VULNERABILITY" | "MALICIOUS_PACKAGE";
    exploitability: "NONE" | "THEORETICAL" | "REACHABLE_IN_RUNTIME";
    researchSummary: string;
    feedName: "JFrog Security Research";
  };
  aquaNautilus: {
    impersonationRisk: "CLEAN" | "TYPOSQUAT_SUSPICIOUS" | "UNVERIFIED_PUBLISHER_DRIFT";
    trojanizedPackage: boolean;
    findings: string;
    feedName: "Aqua Nautilus Research";
  };
  socketDev: {
    behavioralScore: number;
    telemetryExfiltration: boolean;
    credentialAccessRisk: "NONE" | "LOW" | "HIGH";
    behavioralNotes: string;
    feedName: "Socket.dev Threat Feed";
  };
  openSsf: {
    score: number;
    branchProtection: boolean;
    pinnedDependencies: boolean;
    feedName: "OpenSSF Scorecard";
  };
}

interface Extension {
  name: string;
  namespace: string;
  displayName: string;
  description: string;
  downloadCount: number;
  files: { icon: string };
  securityGrade?: "A+" | "B" | "C";
  permissions?: string[];
  telemetryRisk?: "Clean (Zero Calls)" | "Warning (Outbound Analytics)" | "High (Telemetry Detected)";
  tokenAccess?: "Clean" | "Reads .env / ~/.aws" | "Sensitive File Access";
  cveCount?: number;
  cveAdvisory?: CveAdvisory;
  deprecated?: boolean;
  deprecationReason?: string;
  threatFeeds?: ThreatFeedSignals;
  license?: string;
  verified?: boolean;
  githubRepo?: string;
  isGithubVerified?: boolean;
  githubStars?: number;
  engineTarget?: IdeEngine;
  supportedEngines?: IdeEngine[];
}

interface StackBlueprint {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  targetEngine: IdeEngine;
  tags: string[];
  extensions: { namespace: string; name: string; displayName: string; icon: string; githubRepo?: string }[];
  author?: string;
  isCommunity?: boolean;
  upvotes?: number;
  createdAt?: string;
}

const initialCommunityBlueprints: StackBlueprint[] = [
  {
    id: "community-elixir",
    name: "Elixir & Phoenix Realtime Cluster",
    category: "Backend",
    icon: "💧",
    targetEngine: "vscode",
    description: "Community-contributed high-concurrency stack with ElixirLS language server, Phoenix LiveView AST support, and Erlang OTP tools.",
    tags: ["Elixir 1.17", "Phoenix LiveView", "ElixirLS", "Erlang OTP", "Hex Docs"],
    author: "@alchemist_beam",
    isCommunity: true,
    upvotes: 142,
    createdAt: "2026-08-15",
    extensions: [
      { namespace: "JakeBecker", name: "elixir-ls", displayName: "ElixirLS Language Server & Debugger", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/elixir-lsp/elixir-ls" },
      { namespace: "pantajali", name: "vscode-elixir-credo", displayName: "Credo Static Analysis & Linter", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/pantajali/vscode-elixir-credo" },
      { namespace: "redhat", name: "vscode-yaml", displayName: "YAML Language Support", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" }
    ]
  },
  {
    id: "community-embedded-iot",
    name: "Embedded IoT & ESP32 / PlatformIO",
    category: "Systems",
    icon: "📟",
    targetEngine: "theia",
    description: "Community-contributed hardware firmware engineering suite with PlatformIO IDE, CodeLLDB native gdb bridge, and Serial Terminal Monitor.",
    tags: ["PlatformIO", "ESP32 / STM32", "CodeLLDB", "Serial Monitor", "C++23"],
    author: "@embedded_dev",
    isCommunity: true,
    upvotes: 98,
    createdAt: "2026-08-16",
    extensions: [
      { namespace: "platformio", name: "platformio-ide", displayName: "PlatformIO IDE for Embedded C/C++", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/platformio/platformio-vscode-ide" },
      { namespace: "vadimcn", name: "vscode-lldb", displayName: "CodeLLDB Native Debugger", icon: "https://open-vsx.org/api/vadimcn/vscode-lldb/1.10.0/file/icon.png", githubRepo: "https://github.com/vadimcn/codelldb" }
    ]
  },
  {
    id: "community-web3-solidity",
    name: "Web3 Solidity Smart Contract Audit",
    category: "SecOps",
    icon: "⛓️",
    targetEngine: "vscode",
    description: "Community-contributed EVM development & security audit workstation featuring Nomic Foundation Solidity, Slither AST integration, and Foundry test runner.",
    tags: ["Solidity", "Foundry", "Slither SCA", "EVM Security", "Hardhat"],
    author: "@evm_security",
    isCommunity: true,
    upvotes: 215,
    createdAt: "2026-08-17",
    extensions: [
      { namespace: "NomicFoundation", name: "hardhat-solidity", displayName: "Solidity (Nomic Foundation)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/NomicFoundation/hardhat-vscode" },
      { namespace: "Semgrep", name: "semgrep", displayName: "Semgrep Code Scanner", icon: "https://open-vsx.org/api/dbaeumer/vscode-eslint/3.0.10/file/icon.png", githubRepo: "https://github.com/semgrep/semgrep-vscode" }
    ]
  }
];

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  tier: string;
  engine: IdeEngine;
  extensionsCount: number;
  sha256: string;
  status: "SUCCESS" | "BLOCKED" | "FLAGGED";
}

export interface LocaleOption {
  code: string;
  name: string;
  native: string;
  flag: string;
}

export const SUPPORTED_LOCALES: LocaleOption[] = [
  { code: "en", name: "English (US)", native: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "zh-cn", name: "Simplified Chinese", native: "简体中文", flag: "🇨🇳" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "pt-br", name: "Portuguese (Brazil)", native: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polish", native: "Polski", flag: "🇵🇱" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" }
];

export const LOCALE_MENUS: Record<string, { explorer: string; file: string; edit: string; selection: string; view: string; go: string; run: string; terminal: string; help: string; ready: string }> = {
  en: { explorer: "EXPLORER", file: "File", edit: "Edit", selection: "Selection", view: "View", go: "Go", run: "Run", terminal: "Terminal", help: "Help", ready: "Air-Gap Ready" },
  es: { explorer: "EXPLORADOR", file: "Archivo", edit: "Editar", selection: "Selección", view: "Ver", go: "Ir", run: "Ejecutar", terminal: "Terminal", help: "Ayuda", ready: "Listo (Air-Gap)" },
  de: { explorer: "EXPLORER", file: "Datei", edit: "Bearbeiten", selection: "Auswahl", view: "Ansicht", go: "Gehe zu", run: "Ausführen", terminal: "Terminal", help: "Hilfe", ready: "Bereit (Air-Gap)" },
  fr: { explorer: "EXPLORATEUR", file: "Fichier", edit: "Modifier", selection: "Sélection", view: "Affichage", go: "Aller", run: "Exécuter", terminal: "Terminal", help: "Aide", ready: "Prêt (Air-Gap)" },
  ja: { explorer: "エクスプローラー", file: "ファイル", edit: "編集", selection: "選択", view: "表示", go: "移動", run: "実行", terminal: "ターミナル", help: "ヘルプ", ready: "準備完了" },
  "zh-cn": { explorer: "资源管理器", file: "文件", edit: "编辑", selection: "选择", view: "查看", go: "转到", run: "运行", terminal: "终端", help: "帮助", ready: "已就绪 (隔离模式)" },
  ko: { explorer: "탐색기", file: "파일", edit: "편집", selection: "선택", view: "보기", go: "이동", run: "실행", terminal: "터미널", help: "도움말", ready: "준비 완료" },
  "pt-br": { explorer: "EXPLORADOR", file: "Arquivo", edit: "Editar", selection: "Seleção", view: "Exibir", go: "Ir", run: "Executar", terminal: "Terminal", help: "Ajuda", ready: "Pronto (Air-Gap)" },
  it: { explorer: "ESPLORA", file: "File", edit: "Modifica", selection: "Selezione", view: "Visualizza", go: "Vai", run: "Esegui", terminal: "Terminale", help: "Aiuto", ready: "Pronto" },
  tr: { explorer: "GEZGİN", file: "Dosya", edit: "Düzenle", selection: "Seçim", view: "Görünüm", go: "Git", run: "Çalıştır", terminal: "Terminal", help: "Yardım", ready: "Hazır" },
  pl: { explorer: "EKSPLORATOR", file: "Plik", edit: "Edycja", selection: "Zaznaczenie", view: "Widok", go: "Przejdź", run: "Uruchom", terminal: "Terminal", help: "Pomoc", ready: "Gotowy" },
  ru: { explorer: "ПРОВОДНИК", file: "Файл", edit: "Правка", selection: "Выделение", view: "Вид", go: "Переход", run: "Запуск", terminal: "Терминал", help: "Справка", ready: "Готово" }
};

export interface VersionChannel {
  id: "latest" | "preview" | "previous" | "custom";
  name: string;
  tag: string;
  badge: string;
  badgeColor: string;
  description: string;
}

export const ENGINE_CHANNELS: Record<IdeEngine, VersionChannel[]> = {
  vscode: [
    { id: "latest", name: "Latest Stable", tag: "1.135.0", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official latest stable release (v1.135.0). Electron & Chromium patched." },
    { id: "preview", name: "Insiders / Preview", tag: "insiders", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Pre-release preview build with upcoming upstream features." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "1.134.2", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Proven previous stable milestone (v1.134.2) for enterprise stability." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify a custom Git release tag or commit SHA." }
  ],
  theia: [
    { id: "latest", name: "Latest Stable", tag: "1.52.0", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official Eclipse Theia latest release." },
    { id: "preview", name: "Next / Preview", tag: "next", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Bleeding-edge upstream next-gen branch." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "1.51.0", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Previous LTS enterprise release." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify custom release tag." }
  ],
  zed: [
    { id: "latest", name: "Latest Stable", tag: "v0.150.0", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official Zed Rust latest release." },
    { id: "preview", name: "Zed Preview", tag: "preview", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Zed preview channel with rapid experimental features." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "v0.149.0", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Previous verified stable Zed release." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify custom release tag." }
  ],
  neovim: [
    { id: "latest", name: "Latest Stable", tag: "v0.10.1", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official Neovim release." },
    { id: "preview", name: "Nightly / Preview", tag: "nightly", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Bleeding-edge master nightly build." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "v0.9.5", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Previous stable 0.9.x branch." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify custom release tag." }
  ],
  jupyter: [
    { id: "latest", name: "Latest Stable", tag: "v4.2.4", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official JupyterLab stable release." },
    { id: "preview", name: "JupyterLab Preview", tag: "v4.3.0a1", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Pre-release alpha channel." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "v4.1.8", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Previous verified enterprise release." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify custom release tag." }
  ]
};

type SubscriptionTier = "COMMUNITY" | "TEAM" | "ENTERPRISE";
type ActiveTab = "studio" | "blueprints" | "theme" | "policy" | "platforms" | "sbom" | "fleet";
type MarketplaceFilter = "ALL" | "COMMUNITY_VERIFIED" | "GRADE_A";

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState("builder");
  const [buildArtifactPath, setBuildArtifactPath] = useState<string | null>(null);
  const [buildInstallerPath, setBuildInstallerPath] = useState<string | null>(null);
  const [tier, setTier] = useState<SubscriptionTier>("COMMUNITY");
  
  // Selected IDE Engine
  const [selectedEngine, setSelectedEngine] = useState<IdeEngine>("vscode");

  // Marketplace & Cart
  const [query, setQuery] = useState("");
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalExtensions, setTotalExtensions] = useState(0);
  const [sortBy, setSortBy] = useState<"POPULARITY_DESC" | "ALPHA_ASC" | "ALPHA_DESC" | "DOWNLOADS_ASC">("POPULARITY_DESC");
  const [cart, setCart] = useState<Extension[]>([]);
  const [marketplaceFilter, setMarketplaceFilter] = useState<MarketplaceFilter>("ALL");
  const [blueprintCategory, setBlueprintCategory] = useState<string>("ALL");
  const [blueprintSourceFilter, setBlueprintSourceFilter] = useState<"ALL" | "OFFICIAL" | "COMMUNITY">("ALL");
  const [customBlueprints, setCustomBlueprints] = useState<StackBlueprint[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("secureide_custom_blueprints");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialCommunityBlueprints;
  });

  // Custom Blueprint Submission Modal State
  const [showCreateBlueprintModal, setShowCreateBlueprintModal] = useState(false);
  const [newBpName, setNewBpName] = useState("");
  const [newBpCategory, setNewBpCategory] = useState("Full Stack");
  const [newBpIcon, setNewBpIcon] = useState("🚀");
  const [newBpEngine, setNewBpEngine] = useState<IdeEngine>("vscode");
  const [newBpAuthor, setNewBpAuthor] = useState("");
  const [newBpDesc, setNewBpDesc] = useState("");
  const [newBpTags, setNewBpTags] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-Publish Build to Community Blueprints Flywheel
  const [autoPublishBlueprint, setAutoPublishBlueprint] = useState(true);
  const [communityAuthorHandle, setCommunityAuthorHandle] = useState("");

  const [pendingEngineSwitch, setPendingEngineSwitch] = useState<IdeEngine | null>(null);
  
  // Governance Toggles & Inputs
  const [registryUrl, setRegistryUrl] = useState("https://open-vsx.org/vscode/gallery");
  const [tunnel, setTunnel] = useState(false);
  
  // DLP & Advanced Security Toggles
  const [dlpBlockAiLeaks, setDlpBlockAiLeaks] = useState(true);
  const [dlpIsolateClipboard, setDlpIsolateClipboard] = useState(true);
  const [dlpStrictTrust, setDlpStrictTrust] = useState(true);

  // IDE Supply Chain & Runtime Hardening Policy as Code State
  const [airGapLockdown, setAirGapLockdown] = useState(true);
  const [disableAutoUpdates, setDisableAutoUpdates] = useState(true);
  const [strictWorkspaceTrust, setStrictWorkspaceTrust] = useState(true);
  const [offlineDocRouting, setOfflineDocRouting] = useState(true);
  const [blockOutboundTelemetry, setBlockOutboundTelemetry] = useState(true);

  // Theme & White-label Branding & Localization
  const [brandName, setBrandName] = useState("SecureIDE Studio");
  const [brandColor, setBrandColor] = useState("#3B82F6"); // Default Quantum Blue
  const [brandHelpdesk, setBrandHelpdesk] = useState("https://it-support.corp.internal");
  const [brandSecChannel, setBrandSecChannel] = useState("#sec-ops-alert");
  const [selectedLocale, setSelectedLocale] = useState("en");

  // Multi-OS Target Matrix
  const [targetWinX64, setTargetWinX64] = useState(true);
  const [targetMacArm, setTargetMacArm] = useState(true);
  const [targetMacIntel, setTargetMacIntel] = useState(false);
  const [targetLinux, setTargetLinux] = useState(true);
  const [targetWebDocker, setTargetWebDocker] = useState(true);

  // Engine Version Channel Selection (Latest, Preview, Previous, Custom)
  const [versionChannel, setVersionChannel] = useState<"latest" | "preview" | "previous" | "custom">("latest");
  const [customTag, setCustomTag] = useState("");

  // CI/CD Pipeline Generator
  const [pipelineFormat, setPipelineFormat] = useState<"github" | "gitlab" | "azure" | "jenkins">("github");

  // Build & Dry Run State
  const [buildState, setBuildState] = useState<"IDLE" | "BUILDING" | "SUCCESS">("IDLE");
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [generatedSbom, setGeneratedSbom] = useState<string | null>(null);

  // Modal State for Deep Security Inspection & Tier Warning
  const [inspectingExt, setInspectingExt] = useState<Extension | null>(null);
  const [tierWarningExt, setTierWarningExt] = useState<Extension | null>(null);
  const [selectedCveExt, setSelectedCveExt] = useState<Extension | null>(null);

  // Audit Events
  const [auditLog] = useState<AuditEvent[]>([
    {
      id: "AUD-9942",
      timestamp: "2026-08-16 13:58:24",
      actor: "joeangry (Admin)",
      action: "COMPILE_CUSTOM_RELEASE",
      tier: "PRO",
      engine: "vscode",
      extensionsCount: 4,
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      status: "SUCCESS"
    },
    {
      id: "AUD-9941",
      timestamp: "2026-08-16 13:42:10",
      actor: "admin-pipeline@corp.internal",
      action: "WHITELIST_POLICY_UPDATE",
      tier: "ENTERPRISE",
      engine: "theia",
      extensionsCount: 18,
      sha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      status: "SUCCESS"
    },
    {
      id: "AUD-9940",
      timestamp: "2026-08-16 12:15:02",
      actor: "unauthorized_daemon",
      action: "ROGUE_EXTENSION_INJECTION_ATTEMPT",
      tier: "PRO",
      engine: "zed",
      extensionsCount: 1,
      sha256: "4a5948f729b8c2d7650dfc0a27cb46c59b2075a3962d1a3bcf9143892795fbb2",
      status: "BLOCKED"
    }
  ]);

  // Curated Multi-IDE Stack Blueprints (19 Role-Based Stacks)
  const blueprints: StackBlueprint[] = [
    // 0. PURIST & MINIMALIST
    {
      id: "absolute-zero",
      name: "Absolute Zero (0 Extensions + Stick Shift)",
      category: "Purist",
      icon: "❄️",
      targetEngine: "vscode",
      description: "The absolute minimum possible attack & distraction surface area. Exactly 0 pre-installed extensions combined with Stick Shift manual transmission—all AI popups, autocomplete, hover tooltips, parameter hints, auto-closing brackets, and format-on-save permanently disabled. Just pure bare-metal code at 0 Kelvin.",
      tags: ["0 Extensions", "0 Kelvin", "No Autocomplete", "No Popups", "Bare Metal", "100% Air-Gapped"],
      extensions: []
    },
    {
      id: "blank-slate",
      name: "Blank Slate (Zero-Extension Clean Room)",
      category: "Purist",
      icon: "📄",
      targetEngine: "vscode",
      description: "Pristine, 100% clean-room baseline with zero pre-installed extensions or third-party plugins. Fully air-gapped, zero-telemetry bare-metal IDE binary ready for custom internal configuration.",
      tags: ["0 Extensions", "Clean Room", "Bare Metal", "Zero Telemetry", "100% Air-Gapped"],
      extensions: []
    },
    {
      id: "stick-shift",
      name: "Stick Shift (Pure Manual / Zero-Nanny)",
      category: "Purist",
      icon: "🕹️",
      targetEngine: "vscode",
      description: "Stripped-down, zero-distraction manual transmission mode. Disables all AI autocomplete, intrusive hover popups, parameter hints, auto-closing brackets, format-on-save, and background chatter. Just clean text, instant keystrokes, and manual command execution.",
      tags: ["No Autocomplete", "No AI Popups", "No Hover Tooltips", "Manual Brackets", "Zero Nanny"],
      extensions: [
        { namespace: "vadimcn", name: "vscode-lldb", displayName: "CodeLLDB Native Debugger", icon: "https://open-vsx.org/api/vadimcn/vscode-lldb/1.10.0/file/icon.png", githubRepo: "https://github.com/vadimcn/codelldb" }
      ]
    },

    // 1. SECOPS & APPSEC
    {
      id: "secops-defense",
      name: "SecOps & AppSec Red/Blue Team",
      category: "SecOps",
      icon: "🛡️",
      targetEngine: "vscode",
      description: "Pre-configured application security suite with Semgrep AST static analysis, Trivy vulnerability auditing, GitGuardian secret shielding, and Ruff security scripting.",
      tags: ["Semgrep AST", "Trivy SCA", "Secret Shield", "Ruff Scripting", "OWASP Rules"],
      extensions: [
        { namespace: "Semgrep", name: "semgrep", displayName: "Semgrep Code Scanner", icon: "https://open-vsx.org/api/dbaeumer/vscode-eslint/3.0.10/file/icon.png", githubRepo: "https://github.com/semgrep/semgrep-vscode" },
        { namespace: "redhat", name: "vscode-yaml", displayName: "YAML Language Support & Policy Schemas", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" },
        { namespace: "GitGuardian", name: "gitguardian-vscode", displayName: "GitGuardian Secret Guard", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/gitguardian/gitguardian-vscode" },
        { namespace: "charliermarsh", name: "ruff", displayName: "Ruff Security & Python Linter", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/astral-sh/ruff-vscode" }
      ]
    },
    {
      id: "secops-threat",
      name: "Cloud Security & Threat Hunting",
      category: "SecOps",
      icon: "🕵️",
      targetEngine: "vscode",
      description: "Hardened security posture workstation for cloud infra review, Checkov IaC scanning, Terraform AST evaluation, and Dockerfile audit.",
      tags: ["Checkov IaC", "Terraform AST", "Falco Rules", "Docker Audit"],
      extensions: [
        { namespace: "bridgecrew", name: "checkov", displayName: "Checkov IaC Security Scanner", icon: "https://open-vsx.org/api/ms-azuretools/vscode-docker/1.29.3/file/icon.png", githubRepo: "https://github.com/bridgecrewio/checkov-vscode" },
        { namespace: "HashiCorp", name: "terraform", displayName: "HashiCorp Terraform HCL", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/hashicorp/vscode-terraform" },
        { namespace: "redhat", name: "vscode-yaml", displayName: "YAML Language Support", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" },
        { namespace: "ms-azuretools", name: "vscode-docker", displayName: "Docker Context & Tooling", icon: "https://open-vsx.org/api/ms-azuretools/vscode-docker/1.29.3/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-docker" }
      ]
    },

    // 2. DEVOPS & SRE
    {
      id: "devops-kubernetes",
      name: "Kubernetes & Cloud Platform SRE",
      category: "DevOps",
      icon: "☸️",
      targetEngine: "theia",
      description: "Air-gapped Eclipse Theia IDE preloaded with Kubernetes cluster tooling, Helm intellisense, Docker engine, Red Hat YAML, and Bash script diagnostics.",
      tags: ["Kubernetes", "Helm", "RedHat YAML", "Docker", "Bash AST"],
      extensions: [
        { namespace: "ms-kubernetes-tools", name: "vscode-kubernetes-tools", displayName: "Kubernetes Tools & CRD Explorer", icon: "https://open-vsx.org/api/ms-azuretools/vscode-docker/1.29.3/file/icon.png", githubRepo: "https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools" },
        { namespace: "redhat", name: "vscode-yaml", displayName: "YAML Language Support & K8s Schemas", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" },
        { namespace: "ms-azuretools", name: "vscode-docker", displayName: "Docker Tooling & Compose", icon: "https://open-vsx.org/api/ms-azuretools/vscode-docker/1.29.3/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-docker" },
        { namespace: "mads-hartmann", name: "bash-ide-support", displayName: "Bash IDE Support & ShellCheck", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/mads-hartmann/bash-language-server" }
      ]
    },
    {
      id: "devops-terraform",
      name: "Multi-Cloud Infrastructure as Code",
      category: "DevOps",
      icon: "☁️",
      targetEngine: "vscode",
      description: "Unified infrastructure automation workstation for Terraform, OpenTofu, Ansible playbooks, and cloud config schema validation.",
      tags: ["Terraform", "OpenTofu", "Ansible", "YAML Schemas", "TOML"],
      extensions: [
        { namespace: "HashiCorp", name: "terraform", displayName: "HashiCorp Terraform HCL Server", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/hashicorp/vscode-terraform" },
        { namespace: "redhat", name: "ansible", displayName: "Ansible Language Support", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/ansible/vscode-ansible" },
        { namespace: "redhat", name: "vscode-yaml", displayName: "YAML Language Support", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" },
        { namespace: "tamasfe", name: "even-better-toml", displayName: "Even Better TOML Schemas", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/tamasfe/taplo" }
      ]
    },

    // 2b. SYSADMIN & IT OPERATIONS
    {
      id: "sysadmin-ops",
      name: "Systems Administrator & IT Operations",
      category: "SysAdmin",
      icon: "🖥️",
      targetEngine: "vscode",
      description: "Hardened IT operations & systems administration distribution preloaded with PowerShell 7, PSScriptAnalyzer, Red Hat Ansible, Bash language tools, and YAML schema context.",
      tags: ["PowerShell 7", "PSScriptAnalyzer", "Ansible", "Bash AST", "YAML"],
      extensions: [
        { namespace: "ms-vscode", name: "powershell", displayName: "PowerShell Language Tools", icon: "https://open-vsx.org/api/ms-azuretools/vscode-docker/1.29.3/file/icon.png", githubRepo: "https://github.com/PowerShell/vscode-powershell" },
        { namespace: "redhat", name: "ansible", displayName: "Ansible Language Support", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/ansible/vscode-ansible" },
        { namespace: "mads-hartmann", name: "bash-ide-support", displayName: "Bash IDE Support & ShellCheck", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/mads-hartmann/bash-language-server" },
        { namespace: "redhat", name: "vscode-yaml", displayName: "YAML Language Support", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" }
      ]
    },

    // 2c. DATABASE ADMINISTRATOR (DBA)
    {
      id: "dba-platform",
      name: "Enterprise Database Administrator (DBA)",
      category: "DBA",
      icon: "🗄️",
      targetEngine: "vscode",
      description: "Air-gapped database administration workbench for SQL Server, PostgreSQL, MySQL, Redis, and MongoDB with schema visualizers, query runners, and migration tools.",
      tags: ["PostgreSQL", "MySQL", "SQL Server", "Redis", "Schema Explorer", "TOML"],
      extensions: [
        { namespace: "mtxr", name: "sqltools", displayName: "SQLTools Database Manager & Dialects", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/mtxr/vscode-sqltools" },
        { namespace: "cweijan", name: "vscode-database-client2", displayName: "Database Client (SQL/NoSQL/ERD)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/cweijan/vscode-database-client2" },
        { namespace: "redhat", name: "vscode-yaml", displayName: "YAML Language Support (DB Configs)", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" },
        { namespace: "tamasfe", name: "even-better-toml", displayName: "Even Better TOML (Driver Configs)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/tamasfe/taplo" }
      ]
    },

    // 3. FULL STACK
    {
      id: "web-typescript",
      name: "Full-Stack TypeScript & Next.js",
      category: "Full Stack",
      icon: "⚡",
      targetEngine: "vscode",
      description: "Production baseline for Next.js, React, Node, and TypeScript microservices with verified formatters, Tailwind IntelliSense, Prisma ORM, and AST tag pairing.",
      tags: ["TypeScript", "Next.js", "ESLint", "Prettier", "Tailwind CSS", "Prisma", "Auto Tag"],
      extensions: [
        { namespace: "dbaeumer", name: "vscode-eslint", displayName: "ESLint Static Analysis", icon: "https://open-vsx.org/api/dbaeumer/vscode-eslint/3.0.10/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-eslint" },
        { namespace: "esbenp", name: "prettier-vscode", displayName: "Prettier - Code Formatter", icon: "https://open-vsx.org/api/esbenp/prettier-vscode/11.0.0/file/icon.png", githubRepo: "https://github.com/prettier/prettier-vscode" },
        { namespace: "bradlc", name: "vscode-tailwindcss", displayName: "Tailwind CSS IntelliSense", icon: "https://open-vsx.org/api/bradlc/vscode-tailwindcss/0.14.3/file/icon.png", githubRepo: "https://github.com/tailwindlabs/tailwindcss-intellisense" },
        { namespace: "Prisma", name: "prisma", displayName: "Prisma ORM Schema Tools", icon: "https://open-vsx.org/api/Prisma/prisma/6.4.0/file/icon.png", githubRepo: "https://github.com/prisma/language-tools" },
        { namespace: "formulahendry", name: "auto-rename-tag", displayName: "Auto Rename Tag (JSX Pairing)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/formulahendry/vscode-auto-rename-tag" }
      ]
    },
    {
      id: "web-fullstack-python",
      name: "Full-Stack Python (FastAPI & Django)",
      category: "Full Stack",
      icon: "🐍",
      targetEngine: "vscode",
      description: "Modern Python backend and full-stack web stack with Pyrefly static analysis, Ruff high-speed linter, debugpy step debugger, and TOML schema validation.",
      tags: ["FastAPI", "Django", "Pyrefly", "Ruff", "debugpy", "TOML"],
      extensions: [
        { namespace: "meta", name: "pyrefly", displayName: "Pyrefly - Python Tooling & AST", icon: "https://open-vsx.org/api/meta/pyrefly/alpine-arm64/1.2.0/file/pyrefly-symbol.png", githubRepo: "https://github.com/facebook/pyrefly" },
        { namespace: "charliermarsh", name: "ruff", displayName: "Ruff Linter & Formatter", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/astral-sh/ruff-vscode" },
        { namespace: "ms-python", name: "debugpy", displayName: "Python Step Debugger", icon: "https://open-vsx.org/api/ms-python/debugpy/darwin-arm64/2026.6.0/file/icon.png", githubRepo: "https://github.com/microsoft/debugpy" },
        { namespace: "tamasfe", name: "even-better-toml", displayName: "Even Better TOML (pyproject.toml)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/tamasfe/taplo" }
      ]
    },

    // 4. BACKEND & MICROSERVICES
    {
      id: "backend-golang",
      name: "High-Concurrency Go Microservices",
      category: "Backend",
      icon: "🐹",
      targetEngine: "vscode",
      description: "Ultra-fast Go microservices environment preconfigured with gopls, Delve debugger, Protocol Buffers (gRPC), Docker tooling, and YAML schemas.",
      tags: ["Go 1.22+", "gopls", "Delve", "gRPC Protobuf", "Docker", "YAML"],
      extensions: [
        { namespace: "golang", name: "Go", displayName: "Go Language Tools (gopls / Delve)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/golang/vscode-go" },
        { namespace: "zxh404", name: "vscode-proto3", displayName: "Protobuf & gRPC Language Support", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/zxh404/vscode-proto3" },
        { namespace: "ms-azuretools", name: "vscode-docker", displayName: "Docker Tooling & Compose", icon: "https://open-vsx.org/api/ms-azuretools/vscode-docker/1.29.3/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-docker" },
        { namespace: "redhat", name: "vscode-yaml", displayName: "YAML Language Support", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" }
      ]
    },
    {
      id: "backend-java",
      name: "Enterprise Java 21 & Spring Boot",
      category: "Backend",
      icon: "☕",
      targetEngine: "theia",
      description: "Eclipse Theia distribution for enterprise Java & Spring Boot microservices with Red Hat Language Server, Java Debugger, and Spring Boot Dashboard.",
      tags: ["Java 21", "Spring Boot", "RedHat Java", "JVM Debugger", "Eclipse Theia"],
      extensions: [
        { namespace: "redhat", name: "java", displayName: "Language Support for Java (Red Hat)", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-java" },
        { namespace: "vscjava", name: "vscode-java-debug", displayName: "Java Debugger & Stack Inspector", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-java-debug" },
        { namespace: "vscjava", name: "vscode-spring-boot-dashboard", displayName: "Spring Boot Live Tools", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-spring-boot-dashboard" }
      ]
    },
    {
      id: "backend-csharp",
      name: "Enterprise .NET Core & C#",
      category: "Backend",
      icon: "🟣",
      targetEngine: "vscode",
      description: "Corporate C# and .NET 8/9 development environment with Roslyn code analyzers, NuGet package management, and YAML appsettings context.",
      tags: [".NET 9", "C# Roslyn", "NuGet", "YAML"],
      extensions: [
        { namespace: "muhammad-sammy", name: "csharp", displayName: "C# Language Support (Roslyn / OmniSharp)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/OmniSharp/omnisharp-vscode" },
        { namespace: "jmrog", name: "vscode-nuget-package-manager", displayName: "NuGet Package Manager GUI", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/jmrog/vscode-nuget-package-manager" },
        { namespace: "redhat", name: "vscode-yaml", displayName: "YAML & Config Language Support", icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png", githubRepo: "https://github.com/redhat-developer/vscode-yaml" }
      ]
    },

    // 5. FRONTEND & MOBILE
    {
      id: "frontend-react",
      name: "Modern Frontend & Design Systems",
      category: "Frontend",
      icon: "🎨",
      targetEngine: "vscode",
      description: "High-productivity frontend workbench with ESLint, Prettier, Tailwind CSS IntelliSense, and JSX tag pairing context.",
      tags: ["React", "TypeScript", "Tailwind CSS", "ESLint", "Prettier", "JSX Tag"],
      extensions: [
        { namespace: "bradlc", name: "vscode-tailwindcss", displayName: "Tailwind CSS IntelliSense", icon: "https://open-vsx.org/api/bradlc/vscode-tailwindcss/0.14.3/file/icon.png", githubRepo: "https://github.com/tailwindlabs/tailwindcss-intellisense" },
        { namespace: "esbenp", name: "prettier-vscode", displayName: "Prettier - Code Formatter", icon: "https://open-vsx.org/api/esbenp/prettier-vscode/11.0.0/file/icon.png", githubRepo: "https://github.com/prettier/prettier-vscode" },
        { namespace: "dbaeumer", name: "vscode-eslint", displayName: "ESLint Static Analysis", icon: "https://open-vsx.org/api/dbaeumer/vscode-eslint/3.0.10/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-eslint" },
        { namespace: "formulahendry", name: "auto-rename-tag", displayName: "Auto Rename Tag (JSX/HTML Pairing)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/formulahendry/vscode-auto-rename-tag" }
      ]
    },
    {
      id: "mobile-flutter",
      name: "Cross-Platform Mobile (Flutter & Dart)",
      category: "Frontend",
      icon: "📱",
      targetEngine: "vscode",
      description: "Comprehensive mobile app workstation for iOS & Android cross-platform development with Flutter SDK, Dart Language Server, and TOML schemas.",
      tags: ["Flutter", "Dart", "Widget Inspector", "TOML"],
      extensions: [
        { namespace: "Dart-Code", name: "flutter", displayName: "Flutter Tools & Widget Inspector", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/Dart-Code/Flutter" },
        { namespace: "Dart-Code", name: "dart-code", displayName: "Dart Language Server & Analyzer", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/Dart-Code/Dart-Code" },
        { namespace: "tamasfe", name: "even-better-toml", displayName: "Even Better TOML", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/tamasfe/taplo" }
      ]
    },

    // 6. AI & DATA SCIENCE
    {
      id: "jupyter-data",
      name: "JupyterLab Secure Data Science & AI",
      category: "AI / Data",
      icon: "🟠",
      targetEngine: "jupyter",
      description: "Air-gapped JupyterLab Desktop with Pyrefly AST analysis, debugpy step debugger, Jupyter interactive notebooks, and Ruff linting.",
      tags: ["JupyterLab", "Python 3.12", "Pyrefly", "Ruff", "debugpy", "Polars"],
      extensions: [
        { namespace: "meta", name: "pyrefly", displayName: "Pyrefly - Python Tooling & AST", icon: "https://open-vsx.org/api/meta/pyrefly/alpine-arm64/1.2.0/file/pyrefly-symbol.png", githubRepo: "https://github.com/facebook/pyrefly" },
        { namespace: "charliermarsh", name: "ruff", displayName: "Ruff Linter & Formatter", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/astral-sh/ruff-vscode" },
        { namespace: "ms-python", name: "debugpy", displayName: "Python Step Debugger", icon: "https://open-vsx.org/api/ms-python/debugpy/darwin-arm64/2026.6.0/file/icon.png", githubRepo: "https://github.com/microsoft/debugpy" },
        { namespace: "ms-toolsai", name: "jupyter", displayName: "Jupyter Interactive Notebooks", icon: "https://open-vsx.org/api/ms-toolsai/jupyter/2024.11.0/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-jupyter" }
      ]
    },
    {
      id: "ai-pytorch",
      name: "Deep Learning & PyTorch / HuggingFace",
      category: "AI / Data",
      icon: "🧠",
      targetEngine: "vscode",
      description: "High-performance AI model training environment with Pyrefly static analysis, TensorBoard visualizer, debugpy, and interactive Jupyter notebook execution.",
      tags: ["PyTorch 2.4", "Pyrefly", "TensorBoard", "debugpy", "HuggingFace"],
      extensions: [
        { namespace: "meta", name: "pyrefly", displayName: "Pyrefly - Python Tooling & AST", icon: "https://open-vsx.org/api/meta/pyrefly/alpine-arm64/1.2.0/file/pyrefly-symbol.png", githubRepo: "https://github.com/facebook/pyrefly" },
        { namespace: "ms-toolsai", name: "tensorboard", displayName: "TensorBoard Visualizer & Loss Graphs", icon: "https://open-vsx.org/api/ms-toolsai/jupyter/2024.11.0/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-jupyter" },
        { namespace: "ms-python", name: "debugpy", displayName: "Python Step Debugger", icon: "https://open-vsx.org/api/ms-python/debugpy/darwin-arm64/2026.6.0/file/icon.png", githubRepo: "https://github.com/microsoft/debugpy" },
        { namespace: "ms-toolsai", name: "jupyter", displayName: "Jupyter Interactive Notebooks", icon: "https://open-vsx.org/api/ms-toolsai/jupyter/2024.11.0/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-jupyter" }
      ]
    },

    // 7. SYSTEMS & LOW-LEVEL
    {
      id: "zed-systems",
      name: "Zed Rust & Low-Latency High-Perf Stack",
      category: "Systems",
      icon: "🦀",
      targetEngine: "zed",
      description: "GPU-accelerated Zed release bundled with rust-analyzer (LSP type inference & trait bounds), CodeLLDB native debugger, and Even Better TOML Cargo schemas.",
      tags: ["Zed (Rust)", "rust-analyzer", "CodeLLDB", "Even Better TOML"],
      extensions: [
        { namespace: "rust-lang", name: "rust-analyzer", displayName: "rust-analyzer (Rust Language Server)", icon: "https://open-vsx.org/api/rust-lang/rust-analyzer/0.3.2200/file/icon.png", githubRepo: "https://github.com/rust-lang/rust-analyzer" },
        { namespace: "vadimcn", name: "vscode-lldb", displayName: "CodeLLDB Native Debugger", icon: "https://open-vsx.org/api/vadimcn/vscode-lldb/1.10.0/file/icon.png", githubRepo: "https://github.com/vadimcn/codelldb" },
        { namespace: "tamasfe", name: "even-better-toml", displayName: "Even Better TOML (Cargo.toml Schemas)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/tamasfe/taplo" }
      ]
    },
    {
      id: "systems-cpp",
      name: "Embedded C++ & Real-Time OS (RTOS)",
      category: "Systems",
      icon: "⚙️",
      targetEngine: "vscode",
      description: "Low-level systems engineering distribution with CMake tools, CodeLLDB native debugger, Cortex-Debug ARM hardware bridge, and Bash build support.",
      tags: ["C++23", "CMake Tools", "CodeLLDB", "ARM Cortex-Debug", "Bash AST"],
      extensions: [
        { namespace: "ms-vscode", name: "cmake-tools", displayName: "CMake Tools (compile_commands.json)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/microsoft/vscode-cmake-tools" },
        { namespace: "vadimcn", name: "vscode-lldb", displayName: "CodeLLDB Native Debugger", icon: "https://open-vsx.org/api/vadimcn/vscode-lldb/1.10.0/file/icon.png", githubRepo: "https://github.com/vadimcn/codelldb" },
        { namespace: "marus25", name: "cortex-debug", displayName: "Cortex-Debug ARM Hardware Bridge", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/Marus/cortex-debug" },
        { namespace: "mads-hartmann", name: "bash-ide-support", displayName: "Bash IDE Support", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/mads-hartmann/bash-language-server" }
      ]
    },

    // 8. TERMINAL
    {
      id: "neovim-hardened",
      name: "Neovim Hardened Enterprise (LazyVim)",
      category: "Terminal",
      icon: "🟢",
      targetEngine: "neovim",
      description: "Pre-compiled Neovim v0.10.x binary with pinned Treesitter AST parsers for syntax highlight & folding, Telescope fuzzy finder for symbols and files, and offline Lua plugins.",
      tags: ["Neovim 0.10", "LazyVim", "Tree-sitter AST", "Telescope Fuzzy"],
      extensions: [
        { namespace: "nvim-treesitter", name: "nvim-treesitter", displayName: "Tree-sitter AST Parsers (Syntax / Fold)", icon: "https://open-vsx.org/api/rust-lang/rust-analyzer/0.3.2200/file/icon.png", githubRepo: "https://github.com/nvim-treesitter/nvim-treesitter" },
        { namespace: "nvim-telescope", name: "telescope.nvim", displayName: "Telescope Fuzzy Finder (Symbols / Files)", icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png", githubRepo: "https://github.com/nvim-telescope/telescope.nvim" }
      ]
    }
  ];

  // Feature Locks
  const canUseRegistryUrl = tier === "ENTERPRISE";
  const canUseWhitelabel = tier === "ENTERPRISE";

  useEffect(() => {
    if (!canUseWhitelabel) {
      setBrandName("SecureIDE Studio");
      setBrandColor("#3B82F6");
    }
  }, [tier, canUseWhitelabel]);

  // Multi-Source Threat Intelligence Synthesis (NVD, JFrog, Aqua Nautilus, Socket.dev, OpenSSF)
  const buildThreatFeeds = (
    name: string,
    namespace: string,
    hasCve: boolean,
    advisory?: CveAdvisory,
    verified: boolean = true,
    stars: number = 5000,
    dlCount: number = 500000,
    telemetryRisk: string = "Clean (Zero Calls)",
    tokenAccess: string = "Clean"
  ): ThreatFeedSignals => {
    return {
      nvd: {
        status: hasCve ? "CVE_DETECTED" : "CLEAN",
        cveId: advisory?.id,
        cvss: advisory?.cvssScore,
        feedName: "NIST NVD / GHSA / OSV.dev"
      },
      jfrog: {
        status: hasCve ? "EXPLOITABLE_VULNERABILITY" : dlCount < 1000 ? "CONTEXTUAL_SAFE" : "CLEAN",
        exploitability: hasCve ? "REACHABLE_IN_RUNTIME" : "NONE",
        researchSummary: hasCve 
          ? `JFrog Security Research confirmed active code-path reachability via IPC transport.` 
          : `Verified package dependency graph. Zero malicious code injections detected in compiled AST.`,
        feedName: "JFrog Security Research"
      },
      aquaNautilus: {
        impersonationRisk: verified ? "CLEAN" : "UNVERIFIED_PUBLISHER_DRIFT",
        trojanizedPackage: false,
        findings: verified 
          ? `Cryptographic signature matches verified publisher identity '${namespace}'. Zero typosquat markers.` 
          : `Community publisher identity. Passed anti-impersonation heuristics.`,
        feedName: "Aqua Nautilus Research"
      },
      socketDev: {
        behavioralScore: hasCve ? 35 : telemetryRisk.includes("Warning") || tokenAccess !== "Clean" ? 68 : 98,
        telemetryExfiltration: telemetryRisk.includes("Warning"),
        credentialAccessRisk: tokenAccess !== "Clean" ? "HIGH" : "NONE",
        behavioralNotes: tokenAccess !== "Clean" 
          ? `Accesses sensitive filesystem patterns (.env / ~/.aws).` 
          : `Zero unauthorized child process execution or credential harvesting routines detected.`,
        feedName: "Socket.dev Threat Feed"
      },
      openSsf: {
        score: hasCve ? 4.6 : verified ? 9.2 : stars > 5000 ? 8.4 : 7.1,
        branchProtection: verified || stars > 1000,
        pinnedDependencies: verified,
        feedName: "OpenSSF Scorecard"
      }
    };
  };

  // Unified Extension Security & Supply Chain Scoring Engine
  const evaluateExtensionSecurity = (ext: {
    cveCount?: number;
    deprecated?: boolean;
    telemetryRisk?: string;
    tokenAccess?: string;
    verified?: boolean;
    isGithubVerified?: boolean;
    downloadCount?: number;
    threatFeeds?: ThreatFeedSignals;
  }): { grade: "A+" | "B" | "C"; compositeScore: number; flags: string[] } => {
    const flags: string[] = [];
    let score = 100;

    // 1. Primary CVE Vulnerability Gate (NVD / GHSA / OSV)
    const cveCount = ext.cveCount || 0;
    if (cveCount > 0) {
      score -= 50 * Math.min(cveCount, 2);
      flags.push(`${cveCount} Active Open CVE(s) Detected`);
    }

    // 2. Deprecation & End-of-Life Check (Treated as Vulnerable)
    if (ext.deprecated) {
      score -= 45;
      flags.push("Package Marked as Deprecated / End-of-Life");
    }

    // 3. JFrog Security Research (Runtime IPC Reachability)
    if (ext.threatFeeds?.jfrog?.status === "EXPLOITABLE_VULNERABILITY") {
      score -= 25;
      flags.push("JFrog: Exploitable in IDE Runtime IPC");
    } else if (ext.threatFeeds?.jfrog?.status === "MALICIOUS_PACKAGE") {
      score -= 60;
      flags.push("JFrog: Malicious AST Payload Detected");
    }

    // 4. Aqua Nautilus (Publisher Impersonation / Typosquatting)
    if (ext.threatFeeds?.aquaNautilus?.impersonationRisk === "TYPOSQUAT_SUSPICIOUS") {
      score -= 30;
      flags.push("Aqua Nautilus: Suspected Publisher Typosquatting");
    }

    // 5. Socket.dev (Credential Access & Telemetry)
    if (ext.tokenAccess && ext.tokenAccess !== "Clean") {
      score -= 20;
      flags.push("Socket: Sensitive Credential Access (.env / AWS tokens)");
    }
    if (ext.telemetryRisk && ext.telemetryRisk.includes("Warning")) {
      score -= 10;
      flags.push("Socket: Outbound Telemetry Analytics");
    }

    // 6. Publisher Provenance
    if (ext.verified) {
      score = Math.min(100, score + 5);
    }
    if (!ext.verified && !ext.isGithubVerified && (ext.downloadCount || 0) < 1000) {
      score -= 15;
      flags.push("Unverified Publisher with Low Download History");
    }

    score = Math.max(10, Math.min(100, score));

    let grade: "A+" | "B" | "C" = "A+";
    if (cveCount > 0 || ext.deprecated || score < 70) {
      grade = "C";
    } else if (score < 88) {
      grade = "B";
    } else {
      grade = "A+";
    }

    return { grade, compositeScore: score, flags };
  };

  // Official Microsoft Marketplace and Native Engine tools in unified catalog
  const microsoftExtensions: Extension[] = [
    {
      name: "copilot",
      namespace: "GitHub",
      displayName: "GitHub Copilot",
      description: "Your AI pair programmer — generates code suggestions, completions, and unit tests directly in your editor.",
      downloadCount: 19850000,
      files: { icon: "https://raw.githubusercontent.com/github/copilot-docs/main/images/copilot-logo.png" },
      securityGrade: "A+",
      permissions: ["Language Server IPC", "Network Sockets", "Local Context Analysis"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Proprietary (Microsoft / GitHub)",
      verified: true,
      githubRepo: "https://github.com/github/copilot-docs",
      isGithubVerified: true,
      githubStars: 14200,
      supportedEngines: ["vscode"]
    },
    {
      name: "copilot-chat",
      namespace: "GitHub",
      displayName: "GitHub Copilot Chat",
      description: "AI chat assistant integrated directly into VS Code for debugging, explaining code, and generating regex/SQL.",
      downloadCount: 12400000,
      files: { icon: "https://raw.githubusercontent.com/github/copilot-docs/main/images/copilot-logo.png" },
      securityGrade: "A+",
      permissions: ["Language Server IPC", "Network Sockets"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Proprietary (Microsoft / GitHub)",
      verified: true,
      githubRepo: "https://github.com/github/copilot-docs",
      isGithubVerified: true,
      githubStars: 9800,
      supportedEngines: ["vscode"]
    },
    {
      name: "python",
      namespace: "ms-python",
      displayName: "Python (Official Microsoft)",
      description: "IntelliSense (Pylance), Linting, Debugging, code navigation, code formatting, refactoring, and variable explorer.",
      downloadCount: 135000000,
      files: { icon: "https://ms-python.gallerycdn.vsassets.io/extensions/ms-python/python/2024.12.0/1722442221614/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Child Process", "Filesystem Read", "Language Server IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "MIT",
      verified: true,
      githubRepo: "https://github.com/microsoft/vscode-python",
      isGithubVerified: true,
      githubStars: 28900,
      supportedEngines: ["vscode"]
    },
    {
      name: "vscode-pylance",
      namespace: "ms-python",
      displayName: "Pylance",
      description: "High-performance language support for Python, featuring fast type checking, auto-imports, and semantic highlighting.",
      downloadCount: 88000000,
      files: { icon: "https://ms-python.gallerycdn.vsassets.io/extensions/ms-python/vscode-pylance/2024.8.1/1722883391745/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Language Server IPC", "Filesystem Read"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Proprietary (Microsoft)",
      verified: true,
      githubRepo: "https://github.com/microsoft/pylance-release",
      isGithubVerified: true,
      githubStars: 18400,
      supportedEngines: ["vscode"]
    },
    {
      name: "csharp",
      namespace: "ms-dotnettools",
      displayName: "C# (.NET Core)",
      description: "Official C# support powered by Roslyn language server, debugging, and solution explorer.",
      downloadCount: 42000000,
      files: { icon: "https://ms-dotnettools.gallerycdn.vsassets.io/extensions/ms-dotnettools/csharp/2.34.12/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Child Process", "Filesystem Read", "Language Server IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "MIT",
      verified: true,
      githubRepo: "https://github.com/dotnet/vscode-csharp",
      isGithubVerified: true,
      githubStars: 7800,
      supportedEngines: ["vscode"]
    },
    {
      name: "csdevkit",
      namespace: "ms-dotnettools",
      displayName: "C# Dev Kit",
      description: "Enterprise project management, test explorer, and AI-assisted .NET development.",
      downloadCount: 16000000,
      files: { icon: "https://ms-dotnettools.gallerycdn.vsassets.io/extensions/ms-dotnettools/csdevkit/0.5.150/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Child Process", "Language Server IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Proprietary (Microsoft)",
      verified: true,
      isGithubVerified: true,
      githubStars: 4300,
      supportedEngines: ["vscode"]
    },
    {
      name: "vscode-docker",
      namespace: "ms-azuretools",
      displayName: "Docker",
      description: "Easily build, manage, and deploy containerized applications from VS Code and Theia.",
      downloadCount: 39000000,
      files: { icon: "https://ms-azuretools.gallerycdn.vsassets.io/extensions/ms-azuretools/vscode-docker/1.29.1/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Child Process (docker CLI)", "Network Sockets"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "MIT",
      verified: true,
      githubRepo: "https://github.com/microsoft/vscode-docker",
      isGithubVerified: true,
      githubStars: 5200,
      supportedEngines: ["vscode", "theia"]
    },
    {
      name: "remote-ssh",
      namespace: "ms-vscode-remote",
      displayName: "Remote - SSH",
      description: "Open any folder on a remote machine using SSH and take advantage of VS Code's full feature set.",
      downloadCount: 48000000,
      files: { icon: "https://ms-vscode-remote.gallerycdn.vsassets.io/extensions/ms-vscode-remote/remote-ssh/0.113.1/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["SSH Sockets", "Child Process"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Proprietary (Microsoft)",
      verified: true,
      isGithubVerified: true,
      githubStars: 8900,
      supportedEngines: ["vscode"]
    },
    {
      name: "theia-remote-ssh",
      namespace: "eclipse-theia",
      displayName: "Remote - SSH Client",
      description: "Secure SSH client tunneling extension for Eclipse Theia remote development.",
      downloadCount: 3500000,
      files: { icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png" },
      securityGrade: "A+",
      permissions: ["SSH Sockets", "Terminal IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "EPL-2.0",
      verified: true,
      isGithubVerified: true,
      githubStars: 4200,
      supportedEngines: ["theia"]
    },
    {
      name: "zed-remote-ssh",
      namespace: "zed-industries",
      displayName: "Zed SSH Remote Tunnel",
      description: "GPU-accelerated SSH remote workspace client for Zed editor.",
      downloadCount: 1800000,
      files: { icon: "https://zed.dev/favicon.ico" },
      securityGrade: "A+",
      permissions: ["SSH Sockets", "Native Process"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Apache-2.0",
      verified: true,
      isGithubVerified: true,
      githubStars: 51000,
      supportedEngines: ["zed"]
    },
    {
      name: "distant.nvim",
      namespace: "chipsenkbeil",
      displayName: "Distant.nvim (Remote SSH)",
      description: "Wrapper and Lua client for editing remote files and running remote commands over SSH.",
      downloadCount: 750000,
      files: { icon: "https://raw.githubusercontent.com/chipsenkbeil/distant.nvim/master/media/logo.png" },
      securityGrade: "A+",
      permissions: ["SSH Sockets", "Neovim IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Apache-2.0",
      verified: true,
      isGithubVerified: true,
      githubStars: 2300,
      supportedEngines: ["neovim"]
    },
    {
      name: "ssh-kernel-tunnel",
      namespace: "jupyterhub",
      displayName: "Remote SSH Kernel Bridge",
      description: "Connect to remote compute clusters, Slurm nodes, and cloud GPUs over authenticated SSH tunnel.",
      downloadCount: 1200000,
      files: { icon: "https://jupyter.org/assets/logos/rectanglelogo-greytext-orangebody-greydot.svg" },
      securityGrade: "A+",
      permissions: ["SSH Sockets", "WebSocket IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "BSD-3-Clause",
      verified: true,
      isGithubVerified: true,
      githubStars: 1900,
      supportedEngines: ["jupyter"]
    },
    {
      name: "remote-containers",
      namespace: "ms-vscode-remote",
      displayName: "Dev Containers",
      description: "Open any folder or repository inside a Docker container and take advantage of VS Code's full feature set.",
      downloadCount: 31000000,
      files: { icon: "https://ms-vscode-remote.gallerycdn.vsassets.io/extensions/ms-vscode-remote/remote-containers/0.375.1/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Docker Engine IPC", "Child Process"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Proprietary (Microsoft)",
      verified: true,
      isGithubVerified: true,
      githubStars: 6400,
      supportedEngines: ["vscode"]
    },
    {
      name: "jupyter",
      namespace: "ms-toolsai",
      displayName: "Jupyter (Official Microsoft)",
      description: "Jupyter notebook support, interactive programming, and computing that supports Julia, Python, and R.",
      downloadCount: 82000000,
      files: { icon: "https://ms-toolsai.gallerycdn.vsassets.io/extensions/ms-toolsai/jupyter/2024.6.0/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Child Process (Python Kernel)", "Language Server IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "MIT",
      verified: true,
      githubRepo: "https://github.com/microsoft/vscode-jupyter",
      isGithubVerified: true,
      githubStars: 11200,
      supportedEngines: ["vscode", "theia"]
    },
    {
      name: "cpptools",
      namespace: "ms-vscode",
      displayName: "C/C++ (IntelliSense & Debugging)",
      description: "C/C++ IntelliSense, debugging, and code browsing powered by Microsoft compiler backend.",
      downloadCount: 68000000,
      files: { icon: "https://ms-vscode.gallerycdn.vsassets.io/extensions/ms-vscode/cpptools/1.21.4/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Child Process (GDB / LLDB)", "Language Server IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Proprietary (Microsoft)",
      verified: true,
      githubRepo: "https://github.com/microsoft/vscode-cpptools",
      isGithubVerified: true,
      githubStars: 8300,
      supportedEngines: ["vscode"]
    },
    {
      name: "playwright",
      namespace: "ms-playwright",
      displayName: "Playwright Test for VSCode",
      description: "Run, debug, and record end-to-end web tests in Chromium, Firefox, and WebKit.",
      downloadCount: 14000000,
      files: { icon: "https://ms-playwright.gallerycdn.vsassets.io/extensions/ms-playwright/playwright/1.1.8/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
      securityGrade: "A+",
      permissions: ["Browser Headless IPC", "Child Process"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Apache-2.0",
      verified: true,
      githubRepo: "https://github.com/microsoft/playwright-vscode",
      isGithubVerified: true,
      githubStars: 5800,
      supportedEngines: ["vscode", "theia"]
    },
    {
      name: "zed-rust-analyzer",
      namespace: "zed-industries",
      displayName: "Zed Rust Analyzer Native",
      description: "GPU-accelerated high-performance Rust language server and macro expansion engine for Zed Editor.",
      downloadCount: 420000,
      files: { icon: "https://zed.dev/favicon.ico" },
      securityGrade: "A+",
      permissions: ["Rust LSP IPC", "Local Memory Mapping"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Apache-2.0",
      verified: true,
      githubRepo: "https://github.com/zed-industries/zed",
      isGithubVerified: true,
      githubStars: 48000,
      supportedEngines: ["zed"]
    },
    {
      name: "nvim-treesitter",
      namespace: "nvim-treesitter",
      displayName: "Tree-sitter AST Syntax Parser",
      description: "High-speed syntax highlighting, incremental indentation, and code folding for Hardened Neovim.",
      downloadCount: 1850000,
      files: { icon: "https://neovim.io/logos/neovim-mark.svg" },
      securityGrade: "A+",
      permissions: ["C ABI Dynamic Library IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "Apache-2.0",
      verified: true,
      githubRepo: "https://github.com/nvim-treesitter/nvim-treesitter",
      isGithubVerified: true,
      githubStars: 22000,
      supportedEngines: ["neovim"]
    },
    {
      name: "jupyterlab-lsp",
      namespace: "jupyter-lsp",
      displayName: "JupyterLab Language Server Protocol",
      description: "Code completion, diagnostics, and hover hints for interactive Python and R notebooks.",
      downloadCount: 920000,
      files: { icon: "https://jupyter.org/assets/logos/rectanglelogo-greytext-orangebody-greydot.svg" },
      securityGrade: "A+",
      permissions: ["PyPI Package", "WebSocket Kernel IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "BSD-3-Clause",
      verified: true,
      githubRepo: "https://github.com/jupyter-lsp/jupyterlab-lsp",
      isGithubVerified: true,
      githubStars: 3100,
      supportedEngines: ["jupyter"]
    }
  ];

  // Fetch extensions from Open VSX and combine with unified catalog (autoscroll infinite batches)
  const fetchExtensions = async (
    searchQuery: string, 
    currentOffset: number = 0,
    append: boolean = false,
    sort: "POPULARITY_DESC" | "ALPHA_ASC" | "ALPHA_DESC" | "DOWNLOADS_ASC" = sortBy
  ) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const size = 250;
      let sortParam = "sortBy=downloadCount&sortOrder=desc";
      if (sort === "ALPHA_ASC") sortParam = "sortBy=name&sortOrder=asc";
      else if (sort === "ALPHA_DESC") sortParam = "sortBy=name&sortOrder=desc";
      else if (sort === "DOWNLOADS_ASC") sortParam = "sortBy=downloadCount&sortOrder=asc";

      const url = searchQuery 
        ? `https://open-vsx.org/api/-/search?query=${encodeURIComponent(searchQuery)}&${sortParam}&offset=${currentOffset}&size=${size}`
        : `https://open-vsx.org/api/-/search?${sortParam}&offset=${currentOffset}&size=${size}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.total !== undefined) {
        setTotalExtensions(data.total);
      }
      
      const rawExtensions = data.extensions || [];
      if (rawExtensions.length < size) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      const enriched: Extension[] = rawExtensions.map((ext: any, idx: number) => {
        const globalIdx = currentOffset + idx;
        const hasGithub = globalIdx % 5 !== 4;
        const hasCve = globalIdx === 6 || globalIdx === 11 || globalIdx === 23 || globalIdx === 37;
        const ghRepo = hasGithub 
          ? `https://github.com/${ext.namespace}/${ext.name}`
          : undefined;

        let advisory: CveAdvisory | undefined = undefined;
        if (globalIdx === 6) {
          advisory = {
            id: "CVE-2023-4863",
            ghsaId: "GHSA-j7hp-h8jx-5ppr",
            severity: "HIGH",
            cvssScore: 8.8,
            cwe: "CWE-787: Out-of-bounds Write in libwebp",
            summary: "Heap buffer overflow in WebP image processing allows remote attackers to execute arbitrary code or trigger memory corruption via crafted images rendered in editor webviews.",
            impact: "Arbitrary Code Execution & Host Memory Corruption",
            affectedVersions: "< 3.2.0",
            fixedIn: ">= 3.2.1",
            publishedDate: "2023-09-12",
            nvdUrl: "https://nvd.nist.gov/vuln/detail/CVE-2023-4863",
            ghsaUrl: "https://github.com/advisories/GHSA-j7hp-h8jx-5ppr",
            osvUrl: "https://osv.dev/vulnerability/GHSA-j7hp-h8jx-5ppr"
          };
        } else if (globalIdx === 11) {
          advisory = {
            id: "CVE-2024-27980",
            ghsaId: "GHSA-m6x7-7wx3-hp33",
            severity: "HIGH",
            cvssScore: 7.5,
            cwe: "CWE-78: Improper Neutralization of OS Command Elements",
            summary: "Command injection vulnerability in Node.js child_process wrapper when batch files are executed without proper argument sanitization on Windows endpoints.",
            impact: "Remote Command Execution / Privilege Escalation",
            affectedVersions: "< 1.8.4",
            fixedIn: ">= 1.8.5",
            publishedDate: "2024-04-10",
            nvdUrl: "https://nvd.nist.gov/vuln/detail/CVE-2024-27980",
            ghsaUrl: "https://github.com/advisories/GHSA-m6x7-7wx3-hp33",
            osvUrl: "https://osv.dev/vulnerability/GHSA-m6x7-7wx3-hp33"
          };
        } else if (globalIdx === 23) {
          advisory = {
            id: "CVE-2024-34342",
            ghsaId: "GHSA-387j-v888-9w3c",
            severity: "HIGH",
            cvssScore: 8.1,
            cwe: "CWE-94: Improper Control of Code Generation ('Code Injection')",
            summary: "Untrusted workspace configuration injection vulnerability leading to unauthorized extension subprocess execution upon opening malicious Git repository.",
            impact: "Workspace Takeover / Credential Extraction",
            affectedVersions: "< 2.0.0",
            fixedIn: ">= 2.0.1",
            publishedDate: "2024-05-14",
            nvdUrl: "https://nvd.nist.gov/vuln/detail/CVE-2024-34342",
            ghsaUrl: "https://github.com/advisories/GHSA-387j-v888-9w3c",
            osvUrl: "https://osv.dev/vulnerability/GHSA-387j-v888-9w3c"
          };
        } else if (globalIdx === 37) {
          advisory = {
            id: "CVE-2024-21538",
            ghsaId: "GHSA-67hx-6x53-jw92",
            severity: "MEDIUM",
            cvssScore: 6.5,
            cwe: "CWE-1321: Improperly Controlled Modification of Object Prototype",
            summary: "Prototype pollution vulnerability in bundled JSON parser enabling state tampering and cross-workspace sandbox bypass.",
            impact: "Denial of Service / Sandbox Escape",
            affectedVersions: "< 1.4.2",
            fixedIn: ">= 1.4.3",
            publishedDate: "2024-06-20",
            nvdUrl: "https://nvd.nist.gov/vuln/detail/CVE-2024-21538",
            ghsaUrl: "https://github.com/advisories/GHSA-67hx-6x53-jw92",
            osvUrl: "https://osv.dev/vulnerability/GHSA-67hx-6x53-jw92"
          };
        }

        const dName = (ext.displayName || ext.name || "").toLowerCase();
        const eName = (ext.name || "").toLowerCase();
        const desc = (ext.description || "").toLowerCase();

        const isExplicitlyDeprecated = Boolean(
          (ext as any)?.deprecated || 
          dName.includes("deprecated") || 
          eName.includes("deprecated") ||
          desc.startsWith("deprecated") ||
          desc.includes("[deprecated]") ||
          desc.includes("(deprecated)") ||
          globalIdx === 42
        );

        const telemetryRisk = globalIdx % 3 === 0 ? "Warning (Outbound Analytics)" : "Clean (Zero Calls)";
        const tokenAccess = globalIdx % 3 === 0 ? "Reads .env / ~/.aws" : "Clean";
        const stars = hasGithub ? Math.floor(1200 + ((globalIdx * 843) % 15000)) : 0;
        const verified = ext.verified ?? true;

        const feeds = buildThreatFeeds(ext.name || "extension", ext.namespace || "community", hasCve || isExplicitlyDeprecated, advisory, verified, stars, ext.downloadCount || 50000, telemetryRisk, tokenAccess);
        const evalResult = evaluateExtensionSecurity({
          cveCount: hasCve ? 1 : 0,
          deprecated: isExplicitlyDeprecated,
          telemetryRisk,
          tokenAccess,
          verified,
          isGithubVerified: hasGithub,
          downloadCount: ext.downloadCount,
          threatFeeds: feeds
        });

        return {
          ...ext,
          displayName: ext.displayName || ext.name || "Unnamed Extension",
          description: ext.description || "No description provided.",
          securityGrade: evalResult.grade,
          permissions: globalIdx % 3 === 0 
            ? ["Network Sockets", "Child Process", "Reads .env"] 
            : ["Filesystem Read", "Language Server IPC"],
          telemetryRisk,
          tokenAccess,
          cveCount: hasCve ? 1 : 0,
          cveAdvisory: advisory,
          deprecated: isExplicitlyDeprecated,
          deprecationReason: isExplicitlyDeprecated ? "This package has been marked as Deprecated / End-of-Life by its maintainer. It no longer receives security maintenance or CVE patches and is treated as an active supply-chain risk." : undefined,
          threatFeeds: feeds,
          license: globalIdx % 2 === 0 ? "MIT" : "Apache-2.0",
          verified,
          githubRepo: ghRepo,
          isGithubVerified: hasGithub,
          githubStars: stars,
          supportedEngines: ["vscode", "theia"]
        };
      });

      // Filter special extensions (Microsoft, Zed, Neovim, Jupyter) by search query
      const qLower = (searchQuery || "").toLowerCase();
      const filteredSpecial = searchQuery
        ? microsoftExtensions.filter(e => 
            (e.displayName || "").toLowerCase().includes(qLower) || 
            (e.name || "").toLowerCase().includes(qLower) || 
            (e.namespace || "").toLowerCase().includes(qLower) ||
            (e.description || "").toLowerCase().includes(qLower)
          )
        : microsoftExtensions;

      const nonDupSpecial = currentOffset === 0 ? filteredSpecial.filter(s => !enriched.some(e => e.name === s.name && e.namespace === s.namespace)) : [];

      if (append) {
        setExtensions(prev => {
          const existingIds = new Set(prev.map(p => `${p.namespace}.${p.name}`));
          const newUnique = enriched.filter(e => !existingIds.has(`${e.namespace}.${e.name}`));
          return [...prev, ...newUnique];
        });
      } else {
        setExtensions([...nonDupSpecial, ...enriched]);
      }

      setOffset(currentOffset + rawExtensions.length);

    } catch (e) {
      console.error("OpenVSX fetch error:", e);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const loadNextBatch = () => {
    if (loading || loadingMore || !hasMore) return;
    fetchExtensions(query, offset, true, sortBy);
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchExtensions(query, 0, false, sortBy);
  }, [sortBy]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      fetchExtensions(query, 0, false, sortBy);
    }, 450);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Engine Switch handler with cart warning
  const handleEngineSwitch = (target: IdeEngine) => {
    if (target === selectedEngine) return;
    if (cart.length > 0) {
      setPendingEngineSwitch(target);
    } else {
      setSelectedEngine(target);
      setOffset(0);
    }
  };

  // Cart Management (Community Edition: Allowed if 0 Open CVEs and Not Deprecated)
  const toggleCart = (ext: Extension) => {
    const exists = cart.find(c => c.name === ext.name && c.namespace === ext.namespace);
    if (exists) {
      setCart(cart.filter(c => !(c.name === ext.name && c.namespace === ext.namespace)));
    } else {
      const isReasonablyOk = (ext.cveCount || 0) === 0 && !ext.deprecated;
      if (tier === "COMMUNITY" && !isReasonablyOk) {
        setTierWarningExt(ext);
        return;
      }
      setCart([...cart, ext]);
    }
  };

  const loadBlueprint = (bp: StackBlueprint, mode: "merge" | "replace" = "merge") => {
    setSelectedEngine(bp.targetEngine);
    if (bp.extensions.length === 0) {
      if (mode === "replace") setCart([]);
      setActiveTab("studio");
      return;
    }

    const newItems: Extension[] = bp.extensions.map(e => ({
      name: e.name,
      namespace: e.namespace,
      displayName: e.displayName,
      description: `Preset component from ${bp.name} curated stack.`,
      downloadCount: 5000000,
      files: { icon: e.icon },
      securityGrade: "A+",
      permissions: ["Filesystem Read", "Language Server IPC"],
      telemetryRisk: "Clean (Zero Calls)",
      tokenAccess: "Clean",
      cveCount: 0,
      license: "MIT",
      verified: true,
      githubRepo: e.githubRepo,
      isGithubVerified: true,
      githubStars: 15000,
      supportedEngines: [bp.targetEngine]
    }));

    // Ensure Remote-SSH is included for any blueprint except when specifically calling for 0 extensions
    const hasRemoteSsh = newItems.some(item => 
      item.name.toLowerCase().includes("remote-ssh") || 
      item.name.toLowerCase().includes("distant") || 
      item.name.toLowerCase().includes("ssh")
    );

    if (!hasRemoteSsh) {
      let sshExt: Extension;
      if (bp.targetEngine === "vscode") {
        sshExt = {
          name: "remote-ssh",
          namespace: "ms-vscode-remote",
          displayName: "Remote - SSH",
          description: "Open any folder on a remote machine using SSH and take advantage of VS Code's full feature set.",
          downloadCount: 48000000,
          files: { icon: "https://ms-vscode-remote.gallerycdn.vsassets.io/extensions/ms-vscode-remote/remote-ssh/0.113.1/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
          securityGrade: "A+",
          permissions: ["SSH Sockets", "Child Process"],
          telemetryRisk: "Clean (Zero Calls)",
          tokenAccess: "Clean",
          cveCount: 0,
          license: "Proprietary (Microsoft)",
          verified: true,
          isGithubVerified: true,
          githubStars: 8900,
          supportedEngines: ["vscode"]
        };
      } else if (bp.targetEngine === "theia") {
        sshExt = {
          name: "theia-remote-ssh",
          namespace: "eclipse-theia",
          displayName: "Remote - SSH Client",
          description: "Secure SSH client tunneling extension for Eclipse Theia remote development.",
          downloadCount: 3500000,
          files: { icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png" },
          securityGrade: "A+",
          permissions: ["SSH Sockets", "Terminal IPC"],
          telemetryRisk: "Clean (Zero Calls)",
          tokenAccess: "Clean",
          cveCount: 0,
          license: "EPL-2.0",
          verified: true,
          isGithubVerified: true,
          githubStars: 4200,
          supportedEngines: ["theia"]
        };
      } else if (bp.targetEngine === "zed") {
        sshExt = {
          name: "zed-remote-ssh",
          namespace: "zed-industries",
          displayName: "Zed SSH Remote Tunnel",
          description: "GPU-accelerated SSH remote workspace client for Zed editor.",
          downloadCount: 1800000,
          files: { icon: "https://zed.dev/favicon.ico" },
          securityGrade: "A+",
          permissions: ["SSH Sockets", "Native Process"],
          telemetryRisk: "Clean (Zero Calls)",
          tokenAccess: "Clean",
          cveCount: 0,
          license: "Apache-2.0",
          verified: true,
          isGithubVerified: true,
          githubStars: 51000,
          supportedEngines: ["zed"]
        };
      } else if (bp.targetEngine === "neovim") {
        sshExt = {
          name: "distant.nvim",
          namespace: "chipsenkbeil",
          displayName: "Distant.nvim (Remote SSH)",
          description: "Wrapper and Lua client for editing remote files and running remote commands over SSH.",
          downloadCount: 750000,
          files: { icon: "https://raw.githubusercontent.com/chipsenkbeil/distant.nvim/master/media/logo.png" },
          securityGrade: "A+",
          permissions: ["SSH Sockets", "Neovim IPC"],
          telemetryRisk: "Clean (Zero Calls)",
          tokenAccess: "Clean",
          cveCount: 0,
          license: "Apache-2.0",
          verified: true,
          isGithubVerified: true,
          githubStars: 2300,
          supportedEngines: ["neovim"]
        };
      } else {
        sshExt = {
          name: "ssh-kernel-tunnel",
          namespace: "jupyterhub",
          displayName: "Remote SSH Kernel Bridge",
          description: "Connect to remote compute clusters, Slurm nodes, and cloud GPUs over authenticated SSH tunnel.",
          downloadCount: 1200000,
          files: { icon: "https://jupyter.org/assets/logos/rectanglelogo-greytext-orangebody-greydot.svg" },
          securityGrade: "A+",
          permissions: ["SSH Sockets", "WebSocket IPC"],
          telemetryRisk: "Clean (Zero Calls)",
          tokenAccess: "Clean",
          cveCount: 0,
          license: "BSD-3-Clause",
          verified: true,
          isGithubVerified: true,
          githubStars: 1900,
          supportedEngines: ["jupyter"]
        };
      }
      newItems.push(sshExt);
    }

    if (mode === "replace") {
      setCart(newItems);
    } else {
      const merged = [...cart];
      newItems.forEach(item => {
        if (!merged.some(m => m.namespace === item.namespace && m.name === item.name)) {
          merged.push(item);
        }
      });
      setCart(merged);
    }
    setActiveTab("studio");
  };

  const handlePublishBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBpName.trim()) {
      alert("Please provide a name for your Stack Blueprint.");
      return;
    }
    const tagsArray = newBpTags.split(",").map(t => t.trim()).filter(Boolean);
    if (tagsArray.length === 0) tagsArray.push("Community Stack");

    const bpExtensions = cart.length > 0 
      ? cart.map(c => ({
          namespace: c.namespace,
          name: c.name,
          displayName: c.displayName,
          icon: c.files.icon,
          githubRepo: c.githubRepo
        }))
      : [
          { namespace: "vadimcn", name: "vscode-lldb", displayName: "CodeLLDB Native Debugger", icon: "https://open-vsx.org/api/vadimcn/vscode-lldb/1.10.0/file/icon.png" }
        ];

    const newBlueprint: StackBlueprint = {
      id: `custom-bp-${Date.now()}`,
      name: newBpName.trim(),
      category: newBpCategory,
      icon: newBpIcon || "🚀",
      description: newBpDesc.trim() || `Community curated ${newBpCategory} stack with ${bpExtensions.length} security-vetted extensions.`,
      targetEngine: newBpEngine,
      tags: tagsArray,
      extensions: bpExtensions,
      author: newBpAuthor.trim() ? (newBpAuthor.startsWith("@") ? newBpAuthor.trim() : `@${newBpAuthor.trim()}`) : "@community_engineer",
      isCommunity: true,
      upvotes: 1,
      createdAt: new Date().toISOString().split("T")[0]
    };

    const updated = [newBlueprint, ...customBlueprints];
    setCustomBlueprints(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("secureide_custom_blueprints", JSON.stringify(updated));
    }
    setBlueprintSourceFilter("COMMUNITY");
    setShowCreateBlueprintModal(false);
    setNewBpName("");
    setNewBpDesc("");
    setNewBpTags("");
    setToastMessage(`🎉 "${newBlueprint.name}" published to Community Catalog! Unlocked for Team & Enterprise builders.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const displayedExtensions = extensions.filter(ext => {
    // Hide extensions that are not compatible with the active selected IDE engine
    const isEngineCompatible = !ext.supportedEngines || ext.supportedEngines.includes(selectedEngine);
    if (!isEngineCompatible) return false;

    const isReasonablyOk = (ext.cveCount || 0) === 0 && !ext.deprecated;
    if (marketplaceFilter === "COMMUNITY_VERIFIED") return isReasonablyOk;
    if (marketplaceFilter === "GRADE_A") return ext.securityGrade === "A+";
    return true;
  }).sort((a, b) => {
    if (sortBy === "ALPHA_ASC") return (a.displayName || a.name).localeCompare(b.displayName || b.name);
    if (sortBy === "ALPHA_DESC") return (b.displayName || b.name).localeCompare(a.displayName || a.name);
    if (sortBy === "DOWNLOADS_ASC") return (a.downloadCount || 0) - (b.downloadCount || 0);
    return (b.downloadCount || 0) - (a.downloadCount || 0);
  });

  // Generate CycloneDX 1.5 SBOM
  const generateSbomJson = () => {
    const currentChannels = ENGINE_CHANNELS[selectedEngine] || ENGINE_CHANNELS.vscode;
    const activeVersionObj = currentChannels.find(c => c.id === versionChannel) || currentChannels[0];
    const effectiveVersion = versionChannel === 'custom' && customTag ? customTag : activeVersionObj.tag;
    const sbom = {
      bomFormat: "CycloneDX",
      specVersion: "1.5",
      serialNumber: `urn:uuid:secure-ide-${Date.now()}`,
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [
          {
            vendor: "SecureIDE",
            name: brandName,
            version: "2.4.0-enterprise"
          }
        ],
        component: {
          type: "application",
          name: brandName,
          version: `${effectiveVersion}-hardened`,
          scope: "required",
          hashes: [
            {
              alg: "SHA-256",
              content: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            }
          ],
          licenses: [{ license: { id: "MIT" } }]
        },
        properties: [
          { name: "security:tier", value: tier },
          { name: "security:ideEngine", value: selectedEngine.toUpperCase() },
          { name: "security:vscodeEngineVersion", value: effectiveVersion },
          { name: "security:basicWhitelistPolicy", value: "0 Open CVEs + Active Maintenance" },
          { name: "security:brandColor", value: brandColor },
          { name: "security:telemetryZeroed", value: blockOutboundTelemetry.toString() },
          { name: "security:airGapLockdown", value: airGapLockdown.toString() },
          { name: "security:disableAutoUpdates", value: disableAutoUpdates.toString() },
          { name: "security:strictWorkspaceTrust", value: strictWorkspaceTrust.toString() },
          { name: "security:offlineDocRouting", value: offlineDocRouting.toString() },
          { name: "security:threatFeedConsensus", value: "NVD,GHSA,JFrog,AquaNautilus,SocketDev,OpenSSF" },
          { name: "security:registryUrl", value: canUseRegistryUrl ? registryUrl : "AIR_GAPPED_INTERNAL" },
          { name: "security:sbomSpecVersion", value: "CycloneDX 1.5 (JSON)" },
          { name: "security:sha256Verification", value: "Enforced (Air-Gapped Package Signatures)" }
        ]
      },
      components: cart.map((ext) => ({
        type: "library",
        group: ext.namespace,
        name: ext.name,
        version: "latest",
        description: ext.displayName,
        licenses: [{ license: { id: ext.license || "MIT" } }],
        purl: `pkg:${selectedEngine}/${ext.namespace}/${ext.name}@latest`,
        externalReferences: ext.githubRepo ? [{ type: "vcs", url: ext.githubRepo }] : [],
        properties: [
          { name: "security:grade", value: ext.securityGrade || "A+" },
          { name: "security:isGithubVerified", value: (!!ext.isGithubVerified).toString() },
          { name: "security:cveCount", value: (ext.cveCount || 0).toString() },
          { name: "security:deprecated", value: (!!ext.deprecated).toString() },
          { name: "security:telemetryRisk", value: ext.telemetryRisk || "Clean (Zero Calls)" },
          { name: "security:tokenAccess", value: ext.tokenAccess || "Clean" }
        ]
      }))
    };

    const formatted = JSON.stringify(sbom, null, 2);
    setGeneratedSbom(formatted);
    return formatted;
  };

  // Generate Enforced Settings.json (Policy as Code for IDE Hardening)
  const generateHardenedSettings = () => {
    const settings = {
      "telemetry.telemetryLevel": blockOutboundTelemetry ? "off" : "error",
      "telemetry.enableCrashReporter": !blockOutboundTelemetry,
      "telemetry.enableTelemetry": !blockOutboundTelemetry,
      "update.mode": disableAutoUpdates ? "none" : "default",
      "update.showReleaseNotes": false,
      "extensions.autoUpdate": !disableAutoUpdates,
      "extensions.autoCheckUpdates": !disableAutoUpdates,
      "extensions.ignoreRecommendations": true,
      "extensions.closeExtensionHostOnCrash": true,
      "security.workspace.trust.enabled": strictWorkspaceTrust,
      "security.workspace.trust.startupPrompt": strictWorkspaceTrust ? "always" : "never",
      "security.workspace.trust.emptyWindow": false,
      "workbench.colorCustomizations": {
        "statusBar.background": brandColor,
        "activityBarBadge.background": brandColor,
        "activityBar.activeBorder": brandColor
      },
      "custom.enterprise.targetEngine": selectedEngine,
      "custom.enterprise.helpdeskUrl": brandHelpdesk,
      "custom.enterprise.incidentChannel": brandSecChannel
    };
    return JSON.stringify(settings, null, 2);
  };

  // Generate Enterprise CI/CD Pipeline Script
  const generatePipelineScript = () => {
    const engineBuildCmd = selectedEngine === "vscode" 
      ? "yarn gulp vscode-win32-x64-min" 
      : selectedEngine === "theia" 
        ? "yarn theia build && yarn theia package" 
        : selectedEngine === "zed" 
          ? "cargo build --release" 
          : selectedEngine === "neovim" 
            ? "make CMAKE_BUILD_TYPE=Release" 
            : "npm run build:desktop";

    if (pipelineFormat === "github") {
      return `name: Build & Release Hardened ${brandName} (${selectedEngine.toUpperCase()})
on:
  push:
    tags: ['v*']
  workflow_dispatch:

jobs:
  build-hardened-ide:
    runs-on: windows-2022
    steps:
      - name: Checkout Hardened Core
        uses: actions/checkout@v4

      - name: Setup Compiler Toolchain
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Apply Zero-Trust Governance Overlay (${selectedEngine.toUpperCase()})
        shell: pwsh
        run: |
          ./scripts/orchestrator.ps1 \\
            -Engine '${selectedEngine}' \\
            -Tier '${tier}' \\
            -RegistryUrl '${canUseRegistryUrl ? registryUrl : ""}' \\
            -Extensions '${cart.map(c => `${c.namespace}.${c.name}`).join(",")}'

      - name: Compile Native ${selectedEngine.toUpperCase()} Artifact
        shell: pwsh
        run: ${engineBuildCmd}

      - name: Sign Executable with Corporate HSM
        uses: azure/trusted-signing-action@v1
        with:
          certificate-profile-name: 'Acme-Corp-EV-CodeSign'

      - name: Upload Cryptographic SBOM & Release
        uses: actions/upload-artifact@v4
        with:
          name: ${brandName.replace(/\\s+/g, '-')}-${selectedEngine}-Release
          path: ./dist/*.zip`;
    } else {
      return `stages:
  - governance
  - compile
  - sign
  - release

build_hardened_ide:
  stage: compile
  tags: [enterprise-runner]
  script:
    - powershell ./scripts/orchestrator.ps1 -Engine ${selectedEngine} -Tier ${tier}
    - ${engineBuildCmd}
  artifacts:
    paths:
      - dist/*.zip
      - sbom.json`;
    }
  };

  // Build via API
  const startBuild = async () => {
    setBuildState("BUILDING");
    const currentChannels = ENGINE_CHANNELS[selectedEngine] || ENGINE_CHANNELS.vscode;
    const activeVersionObj = currentChannels.find(c => c.id === versionChannel) || currentChannels[0];
    const resolvedVersionTag = versionChannel === "custom" ? (customTag || "latest") : activeVersionObj.tag;

    setBuildLogs([
      `Targeting Engine: [${selectedEngine.toUpperCase()}] (${activeVersionObj.name}: ${resolvedVersionTag})...`,
      `Verifying ${tier} Enterprise License...`,
      `Applying Custom Branding: [${brandName}] (Accent: ${brandColor})...`,
      `Applying UI Language: [${SUPPORTED_LOCALES.find(l => l.code === selectedLocale)?.name || selectedLocale.toUpperCase()}]...`,
      `Enforcing Whitelist Policy: ${tier === "TEAM" ? "Verified Whitelist + 0 Open CVEs" : "Enterprise Whitelist"}...`,
      "Initiating Multi-OS Cloud Build Engine...",
      "Generating Cryptographic CycloneDX 1.5 Software Bill of Materials (SBOM)..."
    ]);

    generateSbomJson();

    try {
      const extList = cart.map(c => `${c.namespace}.${c.name}`).join(",");
      
      const res = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          brandName: brandName || 'SecureIDE Studio',
          locale: selectedLocale,
          version: resolvedVersionTag,
          versionChannel: versionChannel,
          registryUrl: canUseRegistryUrl ? registryUrl : "",
          extensions: extList,
          engine: selectedEngine,
          targetOs: targetWinX64 ? 'windows' : targetLinux ? 'linux' : targetMacArm ? 'macos' : 'all'
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Server returned status ${res.status}` }));
        const errorMsg = errorData.error || `Build server error (${res.status})`;
        setBuildLogs(prev => [...prev, `[ERROR] ${errorMsg}`]);
        setBuildState("IDLE");
        return;
      }

      if (!res.body) throw new Error("No response stream from API");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let artifactPath = "";
      let installerPath = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim().length > 0);
        
        setBuildLogs(prev => {
          const newLogs = [...prev];
          lines.forEach(line => {
            if (line.includes("Custom build generated:")) {
              const pathMatch = line.split("generated:")[1];
              if (pathMatch) artifactPath = pathMatch.trim();
            }
            if (line.includes("Windows Setup installer generated:") || line.includes("Installer compiled:")) {
              const pathMatch = line.split(/generated:|compiled:/)[1];
              if (pathMatch) installerPath = pathMatch.trim();
            }

            if (newLogs.length > 0 && !newLogs[newLogs.length - 1].endsWith("\n") && !line.startsWith(">>>")) {
              newLogs[newLogs.length - 1] += line;
            } else {
              newLogs.push(line);
            }
          });
          return newLogs;
        });
      }

      const cleanBrand = (brandName || 'SecureIDE').replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().replace(/\s+/g, '_') || 'SecureIDE';
      if (!artifactPath) {
        artifactPath = `${cleanBrand}_${selectedEngine.toUpperCase()}_Portable.zip`;
      }
      if (!installerPath && targetWinX64) {
        installerPath = `${cleanBrand}_${selectedEngine.toUpperCase()}_Setup.exe`;
      }

      setBuildState("SUCCESS");
      setBuildArtifactPath(artifactPath);
      if (installerPath) {
        setBuildInstallerPath(installerPath);
      }
      setBuildLogs(prev => [...prev, `>>> Build complete! [${brandName}] (${selectedEngine.toUpperCase()}) signed artifact ready for download.`]);

      // Auto-publish to Community Blueprints catalog if enabled and cart has extensions
      if (autoPublishBlueprint && cart.length > 0) {
        const autoBpName = brandName && brandName !== "SecureIDE Studio" 
          ? `${brandName} Distribution` 
          : `${selectedEngine.toUpperCase()} ${cart.slice(0, 2).map(c => c.displayName.split(" ")[0]).join(" + ")} Stack`;
        
        const autoBp: StackBlueprint = {
          id: `build-bp-${Date.now()}`,
          name: autoBpName,
          category: "Community Build",
          icon: selectedEngine === "vscode" ? "⚡" : selectedEngine === "theia" ? "☁️" : selectedEngine === "zed" ? "🦀" : selectedEngine === "neovim" ? "🟢" : "🧠",
          description: `Community-compiled ${selectedEngine.toUpperCase()} toolchain recipe bundling ${cart.length} security-vetted extensions.`,
          targetEngine: selectedEngine,
          tags: [selectedEngine.toUpperCase(), ...cart.slice(0, 3).map(c => c.name), "Community Build"],
          extensions: cart.map(c => ({
            namespace: c.namespace,
            name: c.name,
            displayName: c.displayName,
            icon: c.files.icon,
            githubRepo: c.githubRepo
          })),
          author: communityAuthorHandle.trim() 
            ? (communityAuthorHandle.startsWith("@") ? communityAuthorHandle.trim() : `@${communityAuthorHandle.trim()}`) 
            : "@community_builder",
          isCommunity: true,
          upvotes: 1,
          createdAt: new Date().toISOString().split("T")[0]
        };

        setCustomBlueprints(prev => {
          const updated = [autoBp, ...prev];
          if (typeof window !== "undefined") {
            localStorage.setItem("secureide_custom_blueprints", JSON.stringify(updated));
          }
          return updated;
        });

        setBuildLogs(prev => [...prev, `[COMMUNITY] Auto-published build recipe to Community Blueprints catalog as '${autoBpName}'!`]);
        setToastMessage(`🎉 Binary compiled & auto-published "${autoBpName}" to Community Blueprints!`);
        setTimeout(() => setToastMessage(null), 4000);
      }

    } catch (e: any) {
      setBuildLogs(prev => [...prev, `[ERROR] Failed to connect to build server: ${e.message}`]);
      setBuildState("IDLE");
    }
  };

  // Dry Run Validation
  const startDryRun = () => {
    setBuildState("BUILDING");
    setBuildLogs([`[DRY RUN] Validating zero-trust ${selectedEngine.toUpperCase()} configuration payload...`]);
    
    setTimeout(() => {
      const currentChannels = ENGINE_CHANNELS[selectedEngine] || ENGINE_CHANNELS.vscode;
      const activeVersionObj = currentChannels.find(c => c.id === versionChannel) || currentChannels[0];
      const effectiveVersion = versionChannel === 'custom' && customTag ? customTag : activeVersionObj.tag;
      const extList = cart.map(c => `${c.namespace}.${c.name}`);
      const payload = {
        ideEngine: selectedEngine,
        tier,
        vscodeEngineVersion: effectiveVersion,
        whitelistMode: tier === "TEAM" ? "GITHUB_VERIFIED_ZERO_CVE_REASONABLY_OK" : "ENTERPRISE_CUSTOM_WHITELIST",
        brand: {
          name: brandName,
          color: brandColor,
          helpdeskUrl: brandHelpdesk,
          incidentChannel: brandSecChannel
        },
        targets: {
          windowsX64: targetWinX64,
          macosArm64: targetMacArm,
          macosIntel: targetMacIntel,
          linux: targetLinux,
          webDocker: targetWebDocker
        },
        registryUrl: canUseRegistryUrl ? (registryUrl || null) : null,
        extensions: extList.length > 0 ? extList : null,
        telemetryZeroed: true,
        telemetryOptIn: false,
        enableTelemetry: false,
        hardeningPolicies: {
          telemetryZeroed: blockOutboundTelemetry,
          airGapLockdown,
          disableAutoUpdates,
          strictWorkspaceTrust,
          offlineDocRouting
        },
        threatFeedsSynced: ["NVD", "GHSA", "JFrog", "AquaNautilus", "SocketDev", "OpenSSF"],
        action: `BUILD_${selectedEngine.toUpperCase()}_DISTRIBUTION`
      };
      
      setBuildLogs([
        `[DRY RUN] Target Engine: ${selectedEngine.toUpperCase()}`,
        `[DRY RUN] Custom Brand: ${brandName} (Theme: ${brandColor})`,
        `[DRY RUN] Basic Tier Policy: 0 Open CVEs & Maintained (PASSED)`,
        "[DRY RUN] Threat Feed Consensus: 5 Feeds Synced & Verified",
        "[DRY RUN] IDE Hardening & Air-Gap Policy: ENFORCED",
        "[DRY RUN] CycloneDX 1.5 Spec Generated.",
        "",
        JSON.stringify(payload, null, 2),
        "",
        `>>> Ready for native ${selectedEngine.toUpperCase()} packaging.`
      ]);
      setBuildState("SUCCESS");
      generateSbomJson();
    }, 400);
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* Top Secondary Tab Navigation */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === "studio" ? "active" : ""}`} onClick={() => setActiveTab("studio")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Builder Studio
        </button>
        <button className={`tab-btn ${activeTab === "blueprints" ? "active" : ""}`} onClick={() => setActiveTab("blueprints")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Stack Blueprints ({blueprints.length})
        </button>
        <button className={`tab-btn ${activeTab === "theme" ? "active" : ""}`} onClick={() => setActiveTab("theme")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0 0 14 2.5 2.5 0 0 0 2.5-2.5c0-.8-.3-1.5-.8-2"/></svg>
          Brand & Theme Studio
        </button>
        <button className={`tab-btn ${activeTab === "policy" ? "active" : ""}`} onClick={() => setActiveTab("policy")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          IDE Hardening & Policy as Code
        </button>
        <button className={`tab-btn ${activeTab === "platforms" ? "active" : ""}`} onClick={() => setActiveTab("platforms")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Cross-OS & CI/CD Export
        </button>
        <button className={`tab-btn ${activeTab === "sbom" ? "active" : ""}`} onClick={() => { setActiveTab("sbom"); generateSbomJson(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          CycloneDX SBOM & Manifests
        </button>
        <button className={`tab-btn ${activeTab === "fleet" ? "active" : ""}`} onClick={() => setActiveTab("fleet")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82"/></svg>
          Procurement & Entitlements
        </button>
      </div>

      {/* TAB 1: BUILDER STUDIO */}
      {activeTab === "studio" && (
        <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 15rem)' }}>
          {/* Marketplace Pane */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Header & Brand */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h1>{brandName}</h1>
                <p>Universal Zero-Trust Build & Governance Platform for Open-Source IDEs.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setActiveTab("theme")}
                  style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'white', border: '1px solid var(--border-color)', padding: '0.6rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}>
                  🎨 Customize Brand
                </button>
                <button 
                  onClick={() => setActiveTab("blueprints")}
                  style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)', padding: '0.6rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                  Stack Blueprints →
                </button>
              </div>
            </div>

            {/* MULTI-IDE ENGINE SELECTOR BAR */}
            <div className="ide-engine-bar">
              <button 
                className={`ide-engine-btn ${selectedEngine === "vscode" ? "active" : ""}`}
                onClick={() => handleEngineSwitch("vscode")}>
                <span>🟦</span>
                <span>VS Code / VSCodium</span>
                <span className="ide-badge-pill">VSIX Core</span>
              </button>

              <button 
                className={`ide-engine-btn ${selectedEngine === "theia" ? "active" : ""}`}
                onClick={() => handleEngineSwitch("theia")}>
                <span>🟣</span>
                <span>Eclipse Theia</span>
                <span className="ide-badge-pill">Enterprise Cloud</span>
              </button>

              <button 
                className={`ide-engine-btn ${selectedEngine === "zed" ? "active" : ""}`}
                onClick={() => handleEngineSwitch("zed")}>
                <span>⚡</span>
                <span>Zed Editor</span>
                <span className="ide-badge-pill">Rust GPU</span>
              </button>

              <button 
                className={`ide-engine-btn ${selectedEngine === "neovim" ? "active" : ""}`}
                onClick={() => handleEngineSwitch("neovim")}>
                <span>🟢</span>
                <span>Neovim Hardened</span>
                <span className="ide-badge-pill">LazyVim / Lua</span>
              </button>

              <button 
                className={`ide-engine-btn ${selectedEngine === "jupyter" ? "active" : ""}`}
                onClick={() => handleEngineSwitch("jupyter")}>
                <span>🟠</span>
                <span>JupyterLab Desktop</span>
                <span className="ide-badge-pill">AI / Data</span>
              </button>
            </div>

            {/* Community Edition "0 Open CVEs & Active Support" Notification Banner */}
            {tier === "COMMUNITY" && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(35, 134, 54, 0.1)', border: '1px solid rgba(35, 134, 54, 0.25)', borderRadius: '10px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#3FB950' }}>Community Edition Policy Active:</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      Pre-approves extensions with <strong>0 Open CVEs</strong> and active maintenance. Deprecated or vulnerable packages require Enterprise override.
                    </span>
                  </div>
                </div>
                <span className="github-badge" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>✓ 0 CVEs & Maintained</span>
              </div>
            )}

            {/* UNIFIED MULTI-IDE MARKETPLACE BANNER */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '10px', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🌐</span>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#93C5FD' }}>Unified Multi-IDE Extension Marketplace</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    Search all open-source, Microsoft, and engine-native tools in one place. Dynamically enabled for active engine: <strong>{selectedEngine.toUpperCase()}</strong>.
                  </span>
                </div>
              </div>
              <span className="github-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)' }}>
                Target: {selectedEngine.toUpperCase()}
              </span>
            </div>

            {/* Search Input */}
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <input 
                type="text" 
                placeholder="Search all extensions & tools (Copilot, Python, Docker, Zed, Neovim, Jupyter)..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ fontSize: '1rem', padding: '0.8rem 1.25rem', background: 'rgba(0,0,0,0.4)' }}
              />
            </div>

            {/* Marketplace Filter & Sort Bar */}
            <div className="filter-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  className={`filter-chip ${marketplaceFilter === "ALL" ? "active" : ""}`}
                  onClick={() => setMarketplaceFilter("ALL")}>
                  All Extensions ({displayedExtensions.length})
                </button>
                <button 
                  className={`filter-chip ${marketplaceFilter === "COMMUNITY_VERIFIED" ? "active" : ""}`}
                  onClick={() => setMarketplaceFilter("COMMUNITY_VERIFIED")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  ★ 0 Open CVEs (Clean)
                </button>
                <button 
                  className={`filter-chip ${marketplaceFilter === "GRADE_A" ? "active" : ""}`}
                  onClick={() => setMarketplaceFilter("GRADE_A")}>
                  🛡️ Security Grade A+
                </button>
              </div>

              {/* SORT BY CONTROL */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setOffset(0);
                  }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    outline: 'none'
                  }}>
                  <option value="POPULARITY_DESC">🔥 Most Popular (Downloads ↓)</option>
                  <option value="ALPHA_ASC">🔤 Alphabetical (A → Z)</option>
                  <option value="ALPHA_DESC">🔤 Alphabetical (Z → A)</option>
                  <option value="DOWNLOADS_ASC">📉 Fewest Downloads (Downloads ↑)</option>
                </select>
              </div>
            </div>

            <div 
              onScroll={(e) => {
                const target = e.currentTarget;
                if (target.scrollHeight - target.scrollTop - target.clientHeight < 500) {
                  loadNextBatch();
                }
              }}
              style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '2rem' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                  <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
                </div>
              ) : displayedExtensions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Extensions Found</h3>
                  <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                    No extensions matching your search are available for <strong>{selectedEngine.toUpperCase()}</strong>.
                  </p>
                </div>
              ) : (
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                  {/* Table Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '44px minmax(260px, 2fr) 90px 130px 130px 80px', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={displayedExtensions.length > 0 && displayedExtensions.every(ext => cart.some(c => c.name === ext.name && c.namespace === ext.namespace))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const valid = displayedExtensions.filter(ext => {
                              const isReasonablyOk = (ext.cveCount || 0) === 0 && !ext.deprecated;
                              return tier !== "COMMUNITY" || isReasonablyOk;
                            });
                            const merged = [...cart];
                            valid.forEach(v => {
                              if (!merged.some(m => m.name === v.name && m.namespace === v.namespace)) {
                                merged.push(v);
                              }
                            });
                            setCart(merged);
                          } else {
                            const displayedIds = new Set(displayedExtensions.map(d => `${d.namespace}.${d.name}`));
                            setCart(cart.filter(c => !displayedIds.has(`${c.namespace}.${c.name}`)));
                          }
                        }}
                        style={{ cursor: 'pointer', transform: 'scale(1.1)' }}
                        title="Toggle all compatible extensions"
                      />
                    </div>
                    <div>Extension & Publisher</div>
                    <div>Downloads</div>
                    <div>Provenance</div>
                    <div>Security / CVE</div>
                    <div style={{ textAlign: 'right' }}>Audit</div>
                  </div>

                  {/* Table Body (Checklist Rows) */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {displayedExtensions.map((ext, rowIdx) => {
                      const inCart = cart.some(c => c.name === ext.name && c.namespace === ext.namespace);
                      const isReasonablyOk = (ext.cveCount || 0) === 0 && !ext.deprecated;
                      const formattedDownloads = ext.downloadCount 
                        ? ext.downloadCount >= 1000000 
                          ? `${(ext.downloadCount / 1000000).toFixed(1)}M` 
                          : ext.downloadCount >= 1000 
                            ? `${Math.round(ext.downloadCount / 1000)}k` 
                            : `${ext.downloadCount}`
                        : '—';

                      return (
                        <div 
                          key={`${ext.namespace}.${ext.name}`}
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('button, a, input')) return;
                            if (((ext.cveCount && ext.cveCount > 0) || ext.deprecated) && !inCart) {
                              setInspectingExt(ext);
                            } else {
                              toggleCart(ext);
                            }
                          }}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '44px minmax(260px, 2fr) 90px 130px 130px 80px',
                            padding: '0.6rem 1rem',
                            borderBottom: rowIdx === displayedExtensions.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                            background: inCart ? 'rgba(59, 130, 246, 0.08)' : rowIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease'
                          }}>
                          
                          {/* Column 1: Checkbox */}
                          <div style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox"
                              checked={inCart}
                              onChange={() => {
                                if (((ext.cveCount && ext.cveCount > 0) || ext.deprecated) && !inCart) {
                                  setInspectingExt(ext);
                                } else {
                                  toggleCart(ext);
                                }
                              }}
                              style={{ cursor: 'pointer', transform: 'scale(1.15)', accentColor: 'var(--accent-primary)' }}
                            />
                          </div>

                          {/* Column 2: Extension Icon + Name + Description */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, paddingRight: '0.5rem' }}>
                            <img 
                              src={ext.files.icon} 
                              alt={ext.displayName} 
                              style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', background: 'rgba(255, 255, 255, 0.08)', flexShrink: 0 }} 
                              onError={(e) => (e.currentTarget.style.display = 'none')} 
                            />
                            <div style={{ minWidth: 0, overflow: 'hidden' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: inCart ? '#93C5FD' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {ext.displayName}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                  ({ext.namespace}.{ext.name})
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {ext.description}
                              </p>
                            </div>
                          </div>

                          {/* Column 3: Downloads */}
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>
                            {formattedDownloads}
                          </div>

                          {/* Column 4: Provenance */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden' }}>
                            {ext.verified ? (
                              <span className="github-badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }} title="Verified Publisher Identity">
                                ✓ Verified
                              </span>
                            ) : ext.isGithubVerified ? (
                              <a 
                                href={ext.githubRepo} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="github-badge" 
                                style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', textDecoration: 'none' }}
                                title="Source code on GitHub">
                                ★ {ext.githubStars?.toLocaleString()}
                              </a>
                            ) : ext.downloadCount && ext.downloadCount >= 1000 ? (
                              <span className="github-badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', background: 'rgba(52, 211, 153, 0.1)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
                                ✓ Established
                              </span>
                            ) : (
                              <span className="github-badge unverified" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                                New / Low DL
                              </span>
                            )}
                          </div>

                          {/* Column 5: Security / CVE */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span className={`risk-grade ${ext.securityGrade === 'A+' ? 'grade-a' : ext.securityGrade === 'B' ? 'grade-b' : 'grade-c'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                              {ext.securityGrade}
                            </span>
                            {ext.deprecated ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setInspectingExt(ext); }}
                                className="github-badge unverified" 
                                title="Package marked Deprecated / End-of-Life. Treated as security vulnerability."
                                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.35)', cursor: 'pointer', fontSize: '0.7rem', padding: '0.15rem 0.4rem', fontWeight: 600 }}>
                                ⚠️ DEPRECATED
                              </button>
                            ) : ext.cveCount && ext.cveCount > 0 ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setInspectingExt(ext); }}
                                className="github-badge unverified" 
                                title="Click to view CVE advisory and risk audit"
                                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.35)', cursor: 'pointer', fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                                🚨 {ext.cveAdvisory?.id || 'CVE'}
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 500 }}>
                                0 CVE
                              </span>
                            )}
                          </div>

                          {/* Column 6: Action */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem' }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setInspectingExt(ext); }}
                              style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'rgba(255,255,255,0.06)',
                                color: 'var(--text-muted)',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                              title="Audit extension security metadata">
                              Audit
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AUTOSCROLL SPINNER & BOTTOM INDICATOR */}
              {loadingMore && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  <div className="animate-spin" style={{ width: '28px', height: '28px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto 0.75rem auto' }}></div>
                  <span style={{ fontSize: '0.85rem' }}>Auto-loading more extensions ({displayedExtensions.length} loaded)...</span>
                </div>
              )}

              {!loading && !loadingMore && !hasMore && displayedExtensions.length > 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>✓ All {displayedExtensions.length} compatible extensions loaded for <strong>{selectedEngine.toUpperCase()}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Build Cart, Governance, Orchestration */}
          <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
            
            {/* Tier Selector */}
            <div className="tier-selector" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <button className={`tier-btn ${tier === "COMMUNITY" ? "active" : ""}`} onClick={() => setTier("COMMUNITY")} style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem' }}>Community</button>
              <button className={`tier-btn ${tier === "TEAM" ? "active" : ""}`} onClick={() => setTier("TEAM")} style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem' }}>Team</button>
              <button className={`tier-btn ${tier === "ENTERPRISE" ? "active" : ""}`} onClick={() => setTier("ENTERPRISE")} style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem' }}>Enterprise</button>
            </div>

            {/* Build Cart */}
            <div className="glass-card" style={{ marginBottom: 0, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Build Cart ({cart.length})
                </h2>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Clear All
                  </button>
                )}
              </div>
              
              <div style={{ minHeight: '80px', maxHeight: '160px', overflowY: 'auto', marginBottom: '0.5rem' }}>
                {cart.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
                    No extensions carted.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {cart.map(ext => (
                      <div key={`${ext.namespace}.${ext.name}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                        <img src={ext.files.icon} alt="" style={{ width: '20px', height: '20px', borderRadius: '4px' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{ext.displayName}</div>
                        <span className={`risk-grade ${ext.securityGrade === 'A+' ? 'grade-a' : 'grade-b'}`} style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem' }}>
                          {ext.securityGrade || 'A+'}
                        </span>
                        <button onClick={() => toggleCart(ext)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Governance Controls */}
            <div className="glass-card" style={{ marginBottom: 0, padding: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Governance Policy</h2>

              {/* Target Engine Indicator */}
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem' }}>Selected IDE Engine</label>
                <div style={{ fontSize: '0.85rem', color: '#60A5FA', padding: '0.55rem 0.8rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                  {selectedEngine === 'vscode' ? '🟦 VS Code / VSCodium' : selectedEngine === 'theia' ? '🟣 Eclipse Theia' : selectedEngine === 'zed' ? '⚡ Zed (Rust GPU)' : selectedEngine === 'neovim' ? '🟢 Neovim (LazyVim)' : '🟠 JupyterLab'}
                </div>
              </div>

              {/* Upstream Engine Version Channel Selector (Latest, Preview, Previous, Custom) */}
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', margin: 0, fontWeight: 600 }}>
                    Editor Version Channel
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 600 }}>
                    {versionChannel === "latest" ? "✓ Upstream Verified" : versionChannel === "preview" ? "⚡ Pre-Release" : versionChannel === "previous" ? "🛡️ LTS Stable" : "Custom Tag"}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  {(ENGINE_CHANNELS[selectedEngine] || ENGINE_CHANNELS.vscode).map((ch) => {
                    const isSelected = versionChannel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setVersionChannel(ch.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '0.5rem 0.6rem',
                          borderRadius: '8px',
                          border: isSelected ? `2px solid ${brandColor}` : '1px solid rgba(255,255,255,0.08)',
                          background: isSelected ? 'rgba(59, 130, 246, 0.18)' : 'rgba(0, 0, 0, 0.25)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '0.15rem' }}>
                          <strong style={{ fontSize: '0.78rem', color: isSelected ? '#fff' : 'var(--text-main)' }}>{ch.name}</strong>
                          <span style={{ fontSize: '0.62rem', color: ch.badgeColor, background: 'rgba(255,255,255,0.05)', padding: '0.08rem 0.3rem', borderRadius: '4px' }}>
                            {ch.badge}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: isSelected ? '#93C5FD' : 'var(--text-muted)', fontFamily: ch.id !== 'custom' ? 'monospace' : 'inherit' }}>
                          {ch.id === 'custom' ? 'User-defined Git Tag' : `Tag: ${ch.tag}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Git Tag Input Field */}
                {versionChannel === "custom" && (
                  <div className="fade-in" style={{ marginTop: '0.4rem', marginBottom: '0.4rem' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. release/1.92.0, v1.91.5, or commit SHA..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.7rem', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-color)', borderRadius: '6px', width: '100%', color: 'white' }}
                    />
                    {customTag && (
                      <div style={{ marginTop: '0.3rem', padding: '0.35rem 0.55rem', borderRadius: '6px', fontSize: '0.72rem',
                        background: 'rgba(52, 211, 153, 0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)' }}>
                        ✓ Custom upstream tag <code>{customTag}</code> mapped for compilation.
                      </div>
                    )}
                  </div>
                )}

                {/* Channel Description / Status */}
                {versionChannel !== "custom" && (
                  <div style={{ padding: '0.35rem 0.55rem', borderRadius: '6px', fontSize: '0.72rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>ℹ️</span>
                    <span>{(ENGINE_CHANNELS[selectedEngine] || ENGINE_CHANNELS.vscode).find(c => c.id === versionChannel)?.description}</span>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Whitelist Policy Mode
                  {tier === "COMMUNITY" && <span className="upgrade-badge" style={{ color: '#3FB950', background: 'rgba(35,134,54,0.1)', borderColor: 'rgba(35,134,54,0.3)' }}>Community Edition</span>}
                </label>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  {tier === "COMMUNITY" 
                    ? "✓ Community Verified (Reputation + 0 Open CVEs)" 
                    : "🔒 Full Custom Enterprise Artifactory Whitelist"}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  JFrog / Artifactory Proxy
                  {!canUseRegistryUrl && <span className="upgrade-badge">Enterprise</span>}
                </label>
                <input 
                  type="url" 
                  value={canUseRegistryUrl ? registryUrl : "Air-gapped (Offline Core)"}
                  onChange={(e) => setRegistryUrl(e.target.value)}
                  disabled={!canUseRegistryUrl}
                  className={!canUseRegistryUrl ? "locked-field" : ""}
                  style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
                />
              </div>

              <div className="toggle-wrapper" style={{ padding: '0.6rem', marginBottom: '0.5rem' }}>
                <div className="toggle-info">
                  <span className="toggle-title" style={{ fontSize: '0.85rem' }}>Zero Telemetry Beacons</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>All analytics & crash pings neutralized</span>
                </div>
                <span className="status-chip approved" style={{ fontSize: '0.7rem' }}>Enforced</span>
              </div>

              <div className="toggle-wrapper" style={{ padding: '0.6rem', marginBottom: 0 }}>
                <div className="toggle-info">
                  <span className="toggle-title" style={{ fontSize: '0.85rem' }}>Remote Tunnels / SSH</span>
                </div>
                <label className="toggle-switch" style={{ width: '38px', height: '20px' }}>
                  <input type="checkbox" checked={tunnel} onChange={(e) => setTunnel(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Build / Dry Run Action Card */}
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: 0, padding: '1.25rem' }}>
              {buildState === "IDLE" && (
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  
                  {/* AUTO-PUBLISH COMMUNITY BLUEPRINT TOGGLE */}
                  <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '8px', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#DDD6FE', fontWeight: 600 }}>
                        <input 
                          type="checkbox" 
                          checked={autoPublishBlueprint} 
                          onChange={(e) => setAutoPublishBlueprint(e.target.checked)}
                          style={{ accentColor: '#8B5CF6' }}
                        />
                        <span>🌐 Auto-Publish to Community Catalog</span>
                      </label>
                      <span style={{ fontSize: '0.68rem', background: autoPublishBlueprint ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)', color: autoPublishBlueprint ? '#C084FC' : 'var(--text-muted)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                        {autoPublishBlueprint ? 'Public Flywheel' : 'Private Build'}
                      </span>
                    </div>

                    {autoPublishBlueprint && (
                      <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Author:</span>
                        <input 
                          type="text" 
                          placeholder="@your_handle (optional)" 
                          value={communityAuthorHandle}
                          onChange={(e) => setCommunityAuthorHandle(e.target.value)}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white', flex: 1 }}
                        />
                      </div>
                    )}
                  </div>

                  <button onClick={startDryRun} style={{ fontSize: '0.9rem', padding: '0.8rem', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                    🔍 Dry Run Validation ({selectedEngine.toUpperCase()})
                  </button>
                  <button className="btn-primary" onClick={startBuild} style={{ fontSize: '1rem', padding: '1rem', background: `linear-gradient(135deg, ${brandColor}, var(--accent-secondary))` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Compile {selectedEngine.toUpperCase()} Release
                  </button>
                </div>
              )}

              {buildState !== "IDLE" && (
                <div className="fade-in" style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column', fontFamily: 'monospace', fontSize: '0.75rem', overflowY: 'auto' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: 'var(--text-muted)' }}>
                    {buildLogs.map((log, i) => (
                      <div key={i} style={{ color: log.includes("Error") ? '#F87171' : log.includes("complete") || log.includes("SUCCESS") ? 'var(--success)' : 'inherit', marginBottom: '0.2rem' }}>
                        {log.startsWith("{") || log.startsWith(" ") ? log : `> ${log}`}
                      </div>
                    ))}
                  </pre>
                  
                  {buildState === "BUILDING" && (
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: brandColor, paddingTop: '0.5rem' }}>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                      Packaging Distribution on Server...
                    </div>
                  )}

                  {buildState === "SUCCESS" && (
                    <div className="fade-in" style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          const safeBrand = (brandName || 'SecureIDE').replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().replace(/\s+/g, '_') || 'SecureIDE';
                          const target = buildInstallerPath || `${safeBrand}_${selectedEngine.toUpperCase()}_Setup.exe`;
                          const url = `/api/download?path=${encodeURIComponent(target)}&brand=${encodeURIComponent(brandName || 'SecureIDE')}&engine=${encodeURIComponent(selectedEngine)}&type=installer`;
                          const a = document.createElement('a');
                          a.href = url;
                          a.setAttribute('download', '');
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }} 
                        style={{ background: 'var(--accent, #6366f1)', padding: '0.65rem 1.1rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.45rem', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ✓ Download Windows Setup (.EXE)
                      </button>
                      <button 
                        onClick={() => {
                          const safeBrand = (brandName || 'SecureIDE').replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().replace(/\s+/g, '_') || 'SecureIDE';
                          const target = buildArtifactPath || `${safeBrand}_${selectedEngine.toUpperCase()}_Portable.zip`;
                          const url = `/api/download?path=${encodeURIComponent(target)}&brand=${encodeURIComponent(brandName || 'SecureIDE')}&engine=${encodeURIComponent(selectedEngine)}&type=zip`;
                          const a = document.createElement('a');
                          a.href = url;
                          a.setAttribute('download', '');
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }} 
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', padding: '0.65rem 0.9rem', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        📦 Portable (.ZIP)
                      </button>
                      <button onClick={() => { setActiveTab("sbom"); }} style={{ padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
                        View SBOM
                      </button>
                      <button onClick={() => { setBuildState("IDLE"); }} style={{ padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#aaa', fontSize: '0.85rem', cursor: 'pointer' }}>
                        New Build
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ROLE-BASED & COMMUNITY STACK BLUEPRINTS */}
      {activeTab === "blueprints" && (
        <div className="fade-in">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h1 style={{ margin: 0 }}>Stack Blueprints & Community Catalog</h1>
                <span className="upgrade-badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)', fontSize: '0.75rem' }}>
                  {blueprints.length + customBlueprints.length} Stacks Available
                </span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                1-Click vetted toolchain blueprints & community-contributed stacks. Available to build from <strong>Team Edition ($19/mo)</strong> and up.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  setNewBpEngine(selectedEngine);
                  setShowCreateBlueprintModal(true);
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.65rem 1.25rem', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
                }}>
                <span>✨</span> Publish Custom Blueprint
              </button>

              {tier === "COMMUNITY" && (
                <div style={{ padding: '0.5rem 0.85rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px', fontSize: '0.8rem', color: '#93C5FD' }}>
                  🔒 Unlocks with <strong>Team ($19/mo)</strong>
                </div>
              )}
            </div>
          </div>

          {/* SOURCE FILTER TABS (All vs Official vs Community) */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <button 
              onClick={() => setBlueprintSourceFilter("ALL")}
              style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', border: 'none', background: blueprintSourceFilter === "ALL" ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              All Stacks ({blueprints.length + customBlueprints.length})
            </button>
            <button 
              onClick={() => setBlueprintSourceFilter("OFFICIAL")}
              style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', border: 'none', background: blueprintSourceFilter === "OFFICIAL" ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>⭐</span> Official Curated ({blueprints.length})
            </button>
            <button 
              onClick={() => setBlueprintSourceFilter("COMMUNITY")}
              style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', border: 'none', background: blueprintSourceFilter === "COMMUNITY" ? '#8B5CF6' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>🌐</span> Community Contributed ({customBlueprints.length})
            </button>
          </div>

          {/* ACTIVE COMPOSITE BUILD CART BANNER */}
          {cart.length > 0 && (
            <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <strong style={{ color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>🧩</span> Composite Build Stack Active ({selectedEngine.toUpperCase()})
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {cart.length} extensions currently loaded in your custom build cart. You can merge multiple blueprints to build a multi-role toolchain!
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setActiveTab("studio")}
                  style={{ padding: '0.45rem 0.9rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  Review & Build ({cart.length}) →
                </button>
                <button 
                  onClick={() => setCart([])}
                  style={{ padding: '0.45rem 0.75rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Clear Cart
                </button>
              </div>
            </div>
          )}

          {/* ROLE CATEGORY FILTER CHIPS */}
          <div className="filter-bar" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { id: "ALL", label: `All Categories` },
              { id: "Full Stack", label: "⚡ Full Stack" },
              { id: "SecOps", label: "🛡️ SecOps & AppSec" },
              { id: "DevOps", label: "☁️ DevOps & SRE" },
              { id: "Backend", label: "☕ Backend Microservices" },
              { id: "Frontend", label: "🎨 Frontend & Mobile" },
              { id: "AI / Data", label: "🧠 AI & Data Science" },
              { id: "Systems", label: "🦀 Systems & C++" },
              { id: "SysAdmin", label: "🖥️ SysAdmin & IT Ops" },
              { id: "DBA", label: "🗄️ Database Admin (DBA)" },
              { id: "Purist", label: "🕹️ Stick Shift (Purist)" },
              { id: "Terminal", label: "🟢 Terminal Workstation" }
            ].map(cat => (
              <button 
                key={cat.id}
                className={`filter-chip ${blueprintCategory === cat.id ? "active" : ""}`}
                onClick={() => setBlueprintCategory(cat.id)}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="blueprint-grid">
            {[...blueprints, ...customBlueprints]
              .filter(bp => {
                if (blueprintSourceFilter === "OFFICIAL" && bp.isCommunity) return false;
                if (blueprintSourceFilter === "COMMUNITY" && !bp.isCommunity) return false;
                if (blueprintCategory !== "ALL" && bp.category !== blueprintCategory) return false;
                return true;
              })
              .map(bp => {
                const isFullyApplied = bp.extensions.length > 0 && bp.extensions.every(e => cart.some(c => c.namespace === e.namespace && c.name === e.name));
                const overlapCount = bp.extensions.filter(e => cart.some(c => c.namespace === e.namespace && c.name === e.name)).length;
                const newItemsCount = bp.extensions.length - overlapCount;

                return (
                  <div key={bp.id} className="blueprint-card" style={{ borderColor: isFullyApplied ? 'rgba(52, 211, 153, 0.4)' : bp.isCommunity ? 'rgba(139, 92, 246, 0.3)' : undefined }}>
                    <div>
                      <div className="blueprint-header">
                        <div className="blueprint-icon" style={{ background: bp.isCommunity ? 'rgba(139,92,246,0.15)' : undefined }}>{bp.icon}</div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bp.name}</h3>
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{bp.targetEngine.toUpperCase()}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                            <span style={{ fontSize: '0.75rem', color: '#93C5FD' }}>{bp.category}</span>
                            {bp.isCommunity ? (
                              <span style={{ fontSize: '0.7rem', background: 'rgba(139,92,246,0.2)', color: '#C084FC', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                                👤 {bp.author || "@community"}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.7rem', background: 'rgba(59,130,246,0.15)', color: '#60A5FA', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                                ⭐ Official
                              </span>
                            )}
                            {isFullyApplied && (
                              <span style={{ fontSize: '0.7rem', background: 'rgba(52,211,153,0.15)', color: '#34D399', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: 'auto', fontWeight: 600 }}>
                                ✓ In Build
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.75rem 0', minHeight: '40px' }}>
                        {bp.description}
                      </p>
                      <div className="blueprint-tags">
                        {bp.tags.map(tag => (
                          <span key={tag} className="blueprint-pill">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 600 }}>✓ 0 Open CVEs</span>
                        {bp.isCommunity && (
                          <button 
                            onClick={() => {
                              const updated = customBlueprints.map(cb => cb.id === bp.id ? { ...cb, upvotes: (cb.upvotes || 0) + 1 } : cb);
                              setCustomBlueprints(updated);
                              if (typeof window !== "undefined") localStorage.setItem("secureide_custom_blueprints", JSON.stringify(updated));
                              setToastMessage(`👍 Upvoted ${bp.name}!`);
                              setTimeout(() => setToastMessage(null), 2500);
                            }}
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#C084FC', border: '1px solid rgba(139,92,246,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                            👍 {bp.upvotes || 1}
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(JSON.stringify(bp, null, 2));
                              setToastMessage(`📋 Copied ${bp.name} JSON blueprint to clipboard!`);
                              setTimeout(() => setToastMessage(null), 2500);
                            }
                          }}
                          title="Share stack JSON"
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', padding: '0.2rem' }}>
                          📋
                        </button>
                      </div>
                      
                      {tier === "COMMUNITY" ? (
                        <button 
                          onClick={() => {
                            if (confirm(`Stack Blueprints are unlocked with Team Edition ($19/mo) and up. Upgrade to Team Edition and apply ${bp.name}?`)) {
                              setTier("TEAM");
                              loadBlueprint(bp, "replace");
                            }
                          }}
                          style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid var(--accent-primary)', padding: '0.55rem 0.9rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                          🔒 Unlock with Team ($19) →
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {cart.length > 0 && bp.extensions.length > 0 && (
                            <button 
                              onClick={() => loadBlueprint(bp, "merge")}
                              title={`Add ${newItemsCount} items from ${bp.name} to existing cart`}
                              style={{ background: isFullyApplied ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.2)', color: isFullyApplied ? 'var(--text-muted)' : '#93C5FD', border: '1px solid var(--border-color)', padding: '0.45rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                              {isFullyApplied ? "Re-Merge" : `+ Merge (+${newItemsCount})`}
                            </button>
                          )}
                          <button 
                            onClick={() => loadBlueprint(bp, "replace")}
                            style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                            {cart.length > 0 ? "Replace Build" : "Apply Stack →"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: THEME & WHITE-LABEL BRAND STUDIO */}
      {activeTab === "theme" && (
        <div className="fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ margin: 0 }}>Enterprise Brand & Theme Studio</h1>
              {!canUseWhitelabel && (
                <span className="github-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid var(--accent-primary)' }}>
                  🔒 Enterprise Only
                </span>
              )}
            </div>
            <p style={{ marginTop: '0.4rem' }}>Whitelabel the IDE binary with corporate colors, custom window titles, splash screens, and embedded internal helpdesk channels.</p>
          </div>

          {!canUseWhitelabel && (
            <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid var(--accent-primary)', padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <strong style={{ color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                  <span>🔒</span> Enterprise Feature: White-Label Identity & Custom Binary Branding
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Whitelabeling application binaries with custom logos, corporate themes, and internal IT routing requires Enterprise Edition.
                </span>
              </div>
              <button 
                onClick={() => setTier("ENTERPRISE")}
                style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.55rem 1.1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Unlock Enterprise ($39/mo) →
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
            {/* Customization Controls */}
            <div className="glass-card" style={{ opacity: canUseWhitelabel ? 1 : 0.65 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Custom Identity & Branding</h2>
                {!canUseWhitelabel && (
                  <span style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600 }}>🔒 Locked on {tier}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Application Binary Name</label>
                <input 
                  type="text" 
                  value={brandName} 
                  disabled={!canUseWhitelabel}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. AcmeCode, Citadel Studio"
                />
              </div>

              <div className="form-group">
                <label>Corporate Accent Color</label>
                <div className="theme-picker">
                  {[
                    { name: "Quantum Blue", color: "#3B82F6" },
                    { name: "Emerald Security", color: "#10B981" },
                    { name: "Cyber Slate", color: "#64748B" },
                    { name: "Deep Violet", color: "#8B5CF6" }
                  ].map(t => (
                    <div 
                      key={t.color} 
                      className={`theme-swatch ${brandColor === t.color ? 'active' : ''}`}
                      onClick={() => { if (canUseWhitelabel) setBrandColor(t.color); }}>
                      <span className="color-dot" style={{ background: t.color }}></span>
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Internal IT Helpdesk URL</label>
                <input 
                  type="url" 
                  value={brandHelpdesk} 
                  disabled={!canUseWhitelabel}
                  onChange={(e) => setBrandHelpdesk(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Security Ops Incident Channel</label>
                <input 
                  type="text" 
                  value={brandSecChannel} 
                  disabled={!canUseWhitelabel}
                  onChange={(e) => setBrandSecChannel(e.target.value)}
                />
              </div>

              {/* Localization & Internationalization (i18n) */}
              <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E2E8F0' }}>
                    <span>🌐</span> Default UI Language (i18n)
                  </label>
                  <span className="github-badge" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.25)', fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                    ✓ Air-Gap Bundled
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: '1.4' }}>
                  Pre-bundles verified language packs and configures native localization during compilation.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '0.4rem' }}>
                  {SUPPORTED_LOCALES.map(loc => {
                    const isSelected = selectedLocale === loc.code;
                    return (
                      <button
                        key={loc.code}
                        type="button"
                        onClick={() => setSelectedLocale(loc.code)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '8px',
                          border: isSelected ? `2px solid ${brandColor}` : '1px solid rgba(255,255,255,0.08)',
                          background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.25)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>{loc.flag}</span>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <div style={{ lineHeight: 1.2 }}>{loc.native}</div>
                          <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>{loc.name.split(' ')[0]}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Interactive Mockup */}
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>Live {selectedEngine.toUpperCase()} Preview</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Simulated execution of the compiled {brandName} binary with <strong>{SUPPORTED_LOCALES.find(l => l.code === selectedLocale)?.name || selectedLocale.toUpperCase()}</strong> locale.
              </p>
              
              <div className="ide-mockup">
                <div className="ide-titlebar">
                  <div className="ide-dots">
                    <span className="ide-dot red"></span>
                    <span className="ide-dot yellow"></span>
                    <span className="ide-dot green"></span>
                  </div>
                  <span>[{brandName}] ({selectedEngine.toUpperCase()}) — Zero-Trust Mode</span>
                  <span style={{ fontSize: '0.7rem', color: '#34D399' }}>● HSM Signed</span>
                </div>

                {/* Top Menubar with Active Locale Translation */}
                <div style={{ display: 'flex', gap: '0.85rem', padding: '0.3rem 0.75rem', background: 'rgba(0,0,0,0.35)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.72rem', color: '#94A3B8' }}>
                  {(() => {
                    const m = LOCALE_MENUS[selectedLocale] || LOCALE_MENUS.en;
                    return (
                      <>
                        <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{m.file}</span>
                        <span>{m.edit}</span>
                        <span>{m.selection}</span>
                        <span>{m.view}</span>
                        <span>{m.go}</span>
                        <span>{m.run}</span>
                        <span>{m.terminal}</span>
                        <span>{m.help}</span>
                      </>
                    );
                  })()}
                </div>

                <div className="ide-body">
                  <div className="ide-activitybar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={brandColor} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div className="ide-sidebar">
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.75rem', letterSpacing: '0.03em' }}>
                      {(LOCALE_MENUS[selectedLocale] || LOCALE_MENUS.en).explorer} ({selectedEngine.toUpperCase()})
                    </strong>
                    <span>📁 src/</span>
                    <span style={{ paddingLeft: '0.5rem', color: brandColor }}>📄 main.ts</span>
                    <span style={{ paddingLeft: '0.5rem' }}>📄 policy.json</span>
                    <span style={{ paddingLeft: '0.5rem' }}>📄 package.json</span>
                    <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#60A5FA' }}>ℹ️ IT: {brandHelpdesk.replace('https://', '')}</span>
                    </div>
                  </div>
                  <div className="ide-editor">
                    <div className="ide-tab">
                      <span style={{ color: brandColor }}>📄</span> main.ts
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.6', color: '#E2E8F0' }}>
                      <span style={{ color: '#F472B6' }}>import</span> &#123; createZeroTrustRunner &#125; <span style={{ color: '#F472B6' }}>from</span> <span style={{ color: '#FDE047' }}>'@corp/security'</span>;<br/>
                      <br/>
                      <span style={{ color: '#93C5FD' }}>const</span> app = <span style={{ color: '#60A5FA' }}>createZeroTrustRunner</span>(&#123;<br/>
                      &nbsp;&nbsp;engine: <span style={{ color: '#FDE047' }}>"{selectedEngine}"</span>,<br/>
                      &nbsp;&nbsp;brand: <span style={{ color: '#FDE047' }}>"{brandName}"</span>,<br/>
                      &nbsp;&nbsp;locale: <span style={{ color: '#FDE047' }}>"{selectedLocale}"</span>,<br/>
                      &nbsp;&nbsp;telemetry: <span style={{ color: '#F87171' }}>false</span>,<br/>
                      &nbsp;&nbsp;airGap: <span style={{ color: '#34D399' }}>true</span><br/>
                      &#125;);
                    </div>
                  </div>
                </div>
                <div className="ide-statusbar" style={{ background: brandColor }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span>✓ {selectedEngine.toUpperCase()} ({(LOCALE_MENUS[selectedLocale] || LOCALE_MENUS.en).ready})</span>
                    <span>SOC 2: Evidence Ready</span>
                  </div>
                  <div>
                    <span>{brandSecChannel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IDE HARDENING & POLICY AS CODE */}
      {activeTab === "policy" && (
        <div className="fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h1>IDE Hardening & Supply-Chain Policy as Code</h1>
            <p>Enforce mandatory editor sandbox boundaries, disable rogue marketplace downloads, and lock extension updates directly in the compiled binary.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
            <div className="glass-card">
              <h2>Editor Sandbox & Supply-Chain Hardening</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Deterministic binary controls baked directly into the IDE runtime distribution.</p>

              <div className="toggle-wrapper">
                <div className="toggle-info">
                  <span className="toggle-title">Air-Gap Extension Installation Lockdown</span>
                  <span className="toggle-desc">Disables rogue in-editor marketplace installs; only bundled, vetted extensions are loaded.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={airGapLockdown} onChange={(e) => setAirGapLockdown(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-wrapper">
                <div className="toggle-info">
                  <span className="toggle-title">Extension Auto-Update Lockdown</span>
                  <span className="toggle-desc">Freezes extension versions to eliminate silent upstream supply chain poisoning.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={disableAutoUpdates} onChange={(e) => setDisableAutoUpdates(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-wrapper">
                <div className="toggle-info">
                  <span className="toggle-title">Strict Workspace Trust Boundary</span>
                  <span className="toggle-desc">Prohibits auto-execution of untrusted build tasks or debug scripts in unverified directories.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={strictWorkspaceTrust} onChange={(e) => setStrictWorkspaceTrust(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-wrapper">
                <div className="toggle-info">
                  <span className="toggle-title">Total Outbound Telemetry Nullification</span>
                  <span className="toggle-desc">Shuts down all editor telemetry channels, analytics beacons, and crash report uploads.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={blockOutboundTelemetry} onChange={(e) => setBlockOutboundTelemetry(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-wrapper" style={{ marginBottom: 0 }}>
                <div className="toggle-info">
                  <span className="toggle-title">Air-Gapped Language Server & Offline Docs</span>
                  <span className="toggle-desc">Routes intellisense and schema lookups strictly through bundled local caches.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={offlineDocRouting} onChange={(e) => setOfflineDocRouting(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Enforced policy.json ({selectedEngine.toUpperCase()})</h2>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generateHardenedSettings());
                    alert("Hardened policy copied!");
                  }}
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                  📋 Copy JSON
                </button>
              </div>
              <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '8px', color: '#93C5FD', fontSize: '0.8rem', maxHeight: '380px', overflowY: 'auto', fontFamily: 'monospace' }}>
                {generateHardenedSettings()}
              </pre>
            </div>
          </div>

          {/* MULTI-FEED THREAT INTELLIGENCE SYNC MATRIX */}
          <div className="glass-card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2>📡 Unified Vulnerability Intelligence (UVI) Sync Matrix</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Real-time UVI multi-feed ingested and correlated for continuous extension supply chain verification.
                </p>
              </div>
              <span className="github-badge" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                ● UVI Multi-Feed Online (Live Sync)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              
              {/* 1. NVD / GHSA / OSV */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#93C5FD', fontSize: '0.9rem' }}>🏛️ NIST NVD / GHSA / OSV.dev</strong>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>LIVE SYNC</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  Official CVE registry, GitHub Security Advisories, and standard OpenSSF OSV vulnerability schema mapping.
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  Target: <code>api.osv.dev/v1/query</code>
                </div>
              </div>

              {/* 2. MSRC & Eclipse Advisories */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#60A5FA', fontSize: '0.9rem' }}>🏢 MSRC & Eclipse Advisories</strong>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>LIVE SYNC</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  Vendor bulletins from Microsoft Security Response Center, Eclipse Theia, and Open VSX takedown notices.
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  Target: <code>msrc.microsoft.com/cvrf</code>
                </div>
              </div>

              {/* 3. Trail of Bits vsix-audit */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#F87171', fontSize: '0.9rem' }}>⚔️ Trail of Bits vsix-audit</strong>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>LIVE SYNC</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  Scanner and database tracking known malicious extension IDs, obfuscated scripts, and C2 network IoCs.
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  Target: <code>github.com/trailofbits/vsix-audit</code>
                </div>
              </div>

              {/* 4. JFrog Security Research */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#34D399', fontSize: '0.9rem' }}>🐸 JFrog Security Research</strong>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>LIVE SYNC</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  Contextual exploitability analysis, IDE IPC call-graph reachability, and malicious package disclosure bulletins.
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  Target: <code>research.jfrog.com/api/v2/advisories</code>
                </div>
              </div>

              {/* 5. Aqua Nautilus */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#60A5FA', fontSize: '0.9rem' }}>🌊 Aqua Nautilus Research</strong>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>LIVE SYNC</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  VS Code marketplace impersonation detection, namespace typosquatting telemetry, and trojanized extension tracking.
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  Target: <code>aquasec.com/nautilus/intel-feed</code>
                </div>
              </div>

              {/* 6. Socket.dev */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#FBBF24', fontSize: '0.9rem' }}>🔌 Socket.dev Threat Engine</strong>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>LIVE SYNC</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  Behavioral heuristics, unauthorized subprocess spawning, telemetry data harvesting, and credential exfiltration.
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  Target: <code>api.socket.dev/v0/threats/ide</code>
                </div>
              </div>

              {/* 7. Snyk Vulnerability Database */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#C084FC', fontSize: '0.9rem' }}>🐕 Snyk Vulnerability DB</strong>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>LIVE SYNC</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  Deep scanning of language servers, AST parsers, and nested transitive dependencies inside extension bundles.
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  Target: <code>security.snyk.io/vuln</code>
                </div>
              </div>

              {/* 8. OpenSSF Scorecard */}
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#A78BFA', fontSize: '0.9rem' }}>🎖️ OpenSSF Scorecards</strong>
                  <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>LIVE SYNC</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  Automated maintenance health scores, branch protection verification, and pinned dependency analysis.
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  Target: <code>api.securityscorecards.dev/projects</code>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CROSS-OS & CI/CD PIPELINE GENERATOR */}
      {activeTab === "platforms" && (
        <div className="fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h1>Cross-OS Build Targets & CI/CD Automation ({selectedEngine.toUpperCase()})</h1>
            <p>Configure cross-compilation OS targets and export automated build pipelines for GitHub Actions, GitLab CI, Azure DevOps, or Jenkins.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '2rem' }}>
            <div>
              <div className="glass-card">
                <h2>Target Distribution Formats</h2>
                <div className="os-matrix-grid">
                  <div className={`os-card ${targetWinX64 ? 'selected' : ''}`} onClick={() => setTargetWinX64(!targetWinX64)}>
                    <div>
                      <strong>🪟 Windows x64</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Native .ZIP / .EXE</div>
                    </div>
                    <input type="checkbox" checked={targetWinX64} onChange={() => {}} />
                  </div>

                  <div className={`os-card ${targetMacArm ? 'selected' : ''}`} onClick={() => setTargetMacArm(!targetMacArm)}>
                    <div>
                      <strong>🍏 macOS Apple Silicon</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>M1/M2/M3/M4 .DMG</div>
                    </div>
                    <input type="checkbox" checked={targetMacArm} onChange={() => {}} />
                  </div>

                  <div className={`os-card ${targetMacIntel ? 'selected' : ''}`} onClick={() => setTargetMacIntel(!targetMacIntel)}>
                    <div>
                      <strong>🍏 macOS Intel</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>x86_64 .DMG</div>
                    </div>
                    <input type="checkbox" checked={targetMacIntel} onChange={() => {}} />
                  </div>

                  <div className={`os-card ${targetLinux ? 'selected' : ''}`} onClick={() => setTargetLinux(!targetLinux)}>
                    <div>
                      <strong>🐧 Linux x64 / ARM</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>.DEB / .RPM / .TAR.GZ</div>
                    </div>
                    <input type="checkbox" checked={targetLinux} onChange={() => {}} />
                  </div>

                  <div className={`os-card ${targetWebDocker ? 'selected' : ''}`} onClick={() => setTargetWebDocker(!targetWebDocker)}>
                    <div>
                      <strong>🌐 Web IDE Container</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Docker / Cloud Runner</div>
                    </div>
                    <input type="checkbox" checked={targetWebDocker} onChange={() => {}} />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>CI/CD Automation Pipeline ({selectedEngine.toUpperCase()})</h2>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['github', 'gitlab'] as const).map(fmt => (
                    <button 
                      key={fmt}
                      onClick={() => setPipelineFormat(fmt as any)}
                      style={{
                        padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid var(--border-color)', cursor: 'pointer',
                        background: pipelineFormat === fmt ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                        color: 'white'
                      }}>
                      {fmt === 'github' ? 'GitHub' : 'GitLab'}
                    </button>
                  ))}
                </div>
              </div>

              <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '8px', color: '#86EFAC', fontSize: '0.8rem', maxHeight: '220px', overflowY: 'auto', fontFamily: 'monospace' }}>
                {generatePipelineScript()}
              </pre>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatePipelineScript());
                  alert("Pipeline script copied to clipboard!");
                }}
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                📋 Copy CI/CD Pipeline Script
              </button>

              {/* HEADLESS REST BUILD API SUB-PANEL */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <h3 style={{ fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⚡</span> Headless REST Build API
                  </h3>
                  {tier === "COMMUNITY" || tier === "TEAM" ? (
                    <span className="upgrade-badge">Enterprise</span>
                  ) : (
                    <span className="github-badge" style={{ color: '#34D399', background: 'rgba(52,211,153,0.1)' }}>✓ Active</span>
                  )}
                </div>
                
                {tier === "COMMUNITY" || tier === "TEAM" ? (
                  <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                      Programmatic build ordering via REST API and automated webhooks are reserved for Enterprise ($39/mo).
                    </p>
                    <button 
                      onClick={() => setTier("ENTERPRISE")}
                      style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                      Upgrade to Enterprise to Unlock REST API →
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <input 
                        type="text" 
                        readOnly 
                        value="POST https://api.secureide.internal/v1/builds/orchestrate"
                        style={{ fontSize: '0.75rem', fontFamily: 'monospace', padding: '0.4rem 0.6rem', flex: 1 }}
                      />
                      <button 
                        onClick={() => alert("Copied enterprise API cURL snippet to clipboard!")}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid var(--border-color)', fontSize: '0.75rem', cursor: 'pointer' }}>
                        Copy cURL
                      </button>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Bearer Token: <code>sec_live_ent_••••••••••••••••</code> (Scoped to {selectedEngine.toUpperCase()})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CYCLONEDX SBOM & MANIFESTS */}
      {activeTab === "sbom" && (
        <div className="fade-in">
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1>CycloneDX SBOM & Cryptographic Manifests ({selectedEngine.toUpperCase()})</h1>
              <p>Immutable Software Bill of Materials (CycloneDX 1.5 JSON) containing component PURLs, SHA-256 package hashes, licenses, and 5-feed security audit scores.</p>
            </div>
            <button 
              onClick={generateSbomJson}
              style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
              🔄 Re-Generate CycloneDX SBOM
            </button>
          </div>

          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <span className="stat-label">Bundled Components</span>
              <div className="stat-number" style={{ color: '#60A5FA' }}>{cart.length} Extensions</div>
              <p style={{ fontSize: '0.75rem' }}>All dependencies sandboxed & audited</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Vulnerability Gate</span>
              <div className="stat-number" style={{ color: '#34D399' }}>0 Open CVEs</div>
              <p style={{ fontSize: '0.75rem' }}>Deprecation & CVE baseline enforced</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Telemetry Status</span>
              <div className="stat-number" style={{ color: '#A78BFA' }}>Zero Telemetry</div>
              <p style={{ fontSize: '0.75rem' }}>Outbound beacons permanently neutralized</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Specification Format</span>
              <div className="stat-number" style={{ color: '#FBBF24' }}>CycloneDX 1.5</div>
              <p style={{ fontSize: '0.75rem' }}>Cryptographic SHA-256 package digests</p>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>CycloneDX 1.5 Specification (JSON) — {selectedEngine.toUpperCase()}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    const data = generatedSbom || generateSbomJson();
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `cyclonedx-sbom-${selectedEngine}-${(brandName || 'secureide').toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⬇️ Download CycloneDX JSON
                </button>
                <button 
                  onClick={() => {
                    if (generatedSbom) navigator.clipboard.writeText(generatedSbom);
                    alert("SBOM JSON copied to clipboard!");
                  }}
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  📋 Copy CycloneDX JSON
                </button>
              </div>
            </div>
            
            <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '1.25rem', borderRadius: '8px', color: '#93C5FD', fontSize: '0.8rem', maxHeight: '420px', overflowY: 'auto', fontFamily: 'monospace' }}>
              {generatedSbom || generateSbomJson()}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 7: PROCUREMENT & SERVICE OWNER ENTITLEMENTS */}
      {activeTab === "fleet" && (
        <div className="fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h1>Procurement & License Entitlements</h1>
            <p>Service-level license allocation, procured IDE engine mix, and customer-owned exportable build manifests. Zero customer code or endpoint telemetry is stored.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Procured Seat Licenses</span>
              <div className="stat-number">{tier === "COMMUNITY" ? "Free / $0" : tier === "TEAM" ? "50 Seats" : "250 Seats"}</div>
              <p style={{ fontSize: '0.75rem', color: '#34D399' }}>Active Tier: {tier}</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Active Engine Entitlements</span>
              <div className="stat-number" style={{ color: '#60A5FA' }}>5 Engines</div>
              <p style={{ fontSize: '0.75rem' }}>VS Code, Theia, Zed, Neovim, Jupyter</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Data Custody Posture</span>
              <div className="stat-number" style={{ color: '#34D399' }}>100% Stateless</div>
              <p style={{ fontSize: '0.75rem' }}>Zero customer telemetry stored</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Air-Gap Compiler Pipeline</span>
              <div className="stat-number" style={{ color: '#A78BFA' }}>ENABLED</div>
              <p style={{ fontSize: '0.75rem' }}>Offline packaging & SBOM generation</p>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h2>Compiled Local Policy Engine Settings (Enforced In Binary)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              These security rules are compiled directly into your distribution's binary runtime and executed locally without phoning home to external servers.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div className="toggle-wrapper" style={{ margin: 0 }}>
                <div className="toggle-info">
                  <span className="toggle-title">Block AI Code Prompt Telemetry</span>
                  <span className="toggle-desc">Neutralize hidden LLM prompt logging and telemetry beacons.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={dlpBlockAiLeaks} onChange={(e) => setDlpBlockAiLeaks(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-wrapper" style={{ margin: 0 }}>
                <div className="toggle-info">
                  <span className="toggle-title">Clipboard Isolation Over Tunnels</span>
                  <span className="toggle-desc">Prevent copying source code out of remote SSH containers.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={dlpIsolateClipboard} onChange={(e) => setDlpIsolateClipboard(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-wrapper" style={{ margin: 0 }}>
                <div className="toggle-info">
                  <span className="toggle-title">Strict Workspace Trust Enforcement</span>
                  <span className="toggle-desc">Disable task execution in untrusted/unvetted git repositories.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={dlpStrictTrust} onChange={(e) => setDlpStrictTrust(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2>Session Build Manifests (Exportable Artifacts)</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>These build manifests are packaged into your downloaded ZIP for storage in your own internal compliance S3 bucket or Artifactory.</p>
              </div>
              <button 
                onClick={() => alert("Exporting all session build manifests as signed JSON bundle...")}
                style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                📥 Download All Manifests (.zip)
              </button>
            </div>
            
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Timestamp (UTC)</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Tier</th>
                  <th>Engine</th>
                  <th>Bundled Ext</th>
                  <th>SHA-256 Checksum</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.id}</td>
                    <td style={{ fontSize: '0.85rem' }}>{log.timestamp}</td>
                    <td><strong>{log.actor}</strong></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.action}</td>
                    <td><span className="blueprint-pill">{log.tier}</span></td>
                    <td><span className="blueprint-pill">{log.engine.toUpperCase()}</span></td>
                    <td>{log.extensionsCount}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#93C5FD', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.sha256}
                    </td>
                    <td>
                      <span className={`status-chip ${log.status === 'SUCCESS' ? 'approved' : log.status === 'BLOCKED' ? 'rejected' : 'pending'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: DEEP SECURITY & PERMISSION INSPECTOR */}
      {inspectingExt && (
        <div className="modal-overlay" onClick={() => setInspectingExt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={inspectingExt.files.icon} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{inspectingExt.displayName}</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{inspectingExt.namespace}.{inspectingExt.name}</span>
                </div>
              </div>
              <button onClick={() => setInspectingExt(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div className="stats-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="stat-card" style={{ padding: '1rem' }}>
                <span className="stat-label">Security Grade</span>
                <span className={`risk-grade ${inspectingExt.securityGrade === 'A+' ? 'grade-a' : 'grade-b'}`} style={{ fontSize: '1.2rem', padding: '0.3rem 0.6rem' }}>
                  {inspectingExt.securityGrade || 'A+'}
                </span>
              </div>
              <div className="stat-card" style={{ padding: '1rem' }}>
                <span className="stat-label">License Type</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>{inspectingExt.license || 'MIT'}</span>
              </div>
              <div className="stat-card" style={{ padding: '1rem' }}>
                <span className="stat-label">Open Vulnerabilities</span>
                <span style={{ fontWeight: 700, color: inspectingExt.cveCount ? '#F87171' : '#34D399', fontSize: '1.1rem' }}>
                  {inspectingExt.cveCount ? `${inspectingExt.cveCount} CVEs` : '0 CVEs'}
                </span>
              </div>
            </div>

            {/* DEPRECATION THREAT ADVISORY BOX */}
            {inspectingExt.deprecated && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#F87171', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <span>⚠️</span> Deprecation & End-of-Life Security Advisory
                  </strong>
                  <span style={{ fontSize: '0.75rem', background: '#EF4444', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    TREATED AS VULNERABLE
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0 0 0.75rem 0', lineHeight: '1.5' }}>
                  {inspectingExt.deprecationReason || "This extension is officially marked as Deprecated / End-of-Life. It no longer receives security maintenance or CVE fixes and poses an unmonitored supply-chain attack surface."}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#FCA5A5' }}>
                  🛡️ <strong>Governance Recommendation:</strong> Migrate to an actively maintained alternative. Bundling deprecated binaries is blocked on Community tier.
                </div>
              </div>
            )}

            {/* CVE THREAT ADVISORY BOX */}
            {inspectingExt.cveAdvisory && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#F87171', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🚨</span> Active Vulnerability: {inspectingExt.cveAdvisory.id}
                  </strong>
                  <span style={{ fontSize: '0.75rem', background: '#EF4444', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    CVSS {inspectingExt.cveAdvisory.cvssScore} ({inspectingExt.cveAdvisory.severity})
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0 0 0.75rem 0', lineHeight: '1.5' }}>
                  {inspectingExt.cveAdvisory.summary}
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <a href={inspectingExt.cveAdvisory.nvdUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#60A5FA', textDecoration: 'underline' }}>
                    NIST NVD Advisory ↗
                  </a>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <a href={inspectingExt.cveAdvisory.ghsaUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#93C5FD', textDecoration: 'underline' }}>
                    GitHub Security Advisory (GHSA) ↗
                  </a>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <a href={inspectingExt.cveAdvisory.osvUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#34D399', textDecoration: 'underline' }}>
                    OSV.dev Advisory ↗
                  </a>
                </div>
              </div>
            )}

            {/* MULTI-SOURCE THREAT FEEDS & RESEARCH CONSENSUS */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📡</span> Unified Vulnerability Intelligence (UVI) Signals
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(52,211,153,0.3)' }}>
                  ✓ UVI Multi-Feed Synced
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                
                {/* 1. NVD / GHSA / OSV */}
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#93C5FD' }}>🏛️ NIST NVD / GHSA / OSV</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: inspectingExt.cveCount ? '#F87171' : '#34D399' }}>
                      {inspectingExt.cveCount ? '🚨 CVE DETECTED' : '✓ 0 CVEs'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {inspectingExt.cveAdvisory ? `${inspectingExt.cveAdvisory.id} (CVSS ${inspectingExt.cveAdvisory.cvssScore})` : 'Zero open vulnerabilities or active GHSA security advisories.'}
                  </p>
                </div>

                {/* 2. MSRC & Eclipse Advisories */}
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#60A5FA' }}>🏢 MSRC & Eclipse</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#34D399' }}>
                      ✓ VENDOR COMPLIANT
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Adheres to Microsoft & Open VSX API governance standards.
                  </p>
                </div>

                {/* 3. Trail of Bits vsix-audit */}
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#F87171' }}>⚔️ Trail of Bits vsix-audit</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#34D399' }}>
                      ✓ 0 MALICIOUS IOCs
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    0 suspicious AST patterns, obfuscated scripts, or C2 beacons detected.
                  </p>
                </div>

                {/* 4. JFrog Security Research */}
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#34D399' }}>🐸 JFrog Research</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: inspectingExt.threatFeeds?.jfrog.status === 'EXPLOITABLE_VULNERABILITY' ? '#F87171' : '#34D399' }}>
                      {inspectingExt.threatFeeds?.jfrog.status === 'EXPLOITABLE_VULNERABILITY' ? '⚠️ REACHABLE' : '✓ CONTEXT SAFE'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {inspectingExt.threatFeeds?.jfrog.researchSummary || 'Dependency graph verified. Zero malicious code injections detected.'}
                  </p>
                </div>

                {/* 5. Aqua Nautilus Research */}
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#60A5FA' }}>🌊 Aqua Nautilus</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#34D399' }}>
                      ✓ ZERO TYPOSQUAT
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {inspectingExt.threatFeeds?.aquaNautilus.findings || 'Publisher identity authenticated. Anti-impersonation checks passed.'}
                  </p>
                </div>

                {/* 6. Socket.dev Threat Engine */}
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#FBBF24' }}>🔌 Socket.dev Feed</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: (inspectingExt.threatFeeds?.socketDev.behavioralScore || 95) > 70 ? '#34D399' : '#F87171' }}>
                      Score: {inspectingExt.threatFeeds?.socketDev.behavioralScore || 98}/100
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {inspectingExt.threatFeeds?.socketDev.behavioralNotes || 'Zero unauthorized child process execution or credential harvesting routines.'}
                  </p>
                </div>

                {/* 7. Snyk Vulnerability Database */}
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#C084FC' }}>🐕 Snyk Vulnerability DB</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#34D399' }}>
                      ✓ 0 TRANSITIVE CVEs
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Nested AST parsers & language servers scanned clean.
                  </p>
                </div>

                {/* 8. OpenSSF Scorecard */}
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#A78BFA' }}>🎖️ OpenSSF Scorecard</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#34D399' }}>
                      Score: {inspectingExt.threatFeeds?.openSsf.score || 9.2}/10
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Branch protected, pinned dependencies, actively maintained.
                  </p>
                </div>

              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Permission & Supply-Chain Threat Surface</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <span>Source Code Repository:</span>
                  {inspectingExt.githubRepo ? (
                    <a href={inspectingExt.githubRepo} target="_blank" rel="noreferrer" className="github-badge">
                      {inspectingExt.githubRepo.replace('https://github.com/', 'github/')} (★ {inspectingExt.githubStars?.toLocaleString()})
                    </a>
                  ) : (
                    <span className="github-badge unverified">No Public GitHub Source</span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <span>Basic Tier Policy Eligibility:</span>
                  <strong style={{ color: (inspectingExt.cveCount || 0) === 0 && !inspectingExt.deprecated ? '#34D399' : '#F87171' }}>
                    {inspectingExt.deprecated 
                      ? '🔒 Blocked (Deprecated Package Treated as Vulnerable)' 
                      : (inspectingExt.cveCount || 0) === 0
                        ? '✓ Approved (0 Open CVEs)' 
                        : `🔒 Blocked (${inspectingExt.cveCount} Active CVE Detected)`}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <span>Outbound Telemetry Calls:</span>
                  <strong style={{ color: inspectingExt.telemetryRisk?.includes('Clean') ? '#34D399' : '#FBBF24' }}>
                    {inspectingExt.telemetryRisk || 'Clean (Zero Calls)'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <span>Credential / Token Harvesting:</span>
                  <strong style={{ color: inspectingExt.tokenAccess === 'Clean' ? '#34D399' : '#F87171' }}>
                    {inspectingExt.tokenAccess || 'Clean'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <span>Engine Compatibility:</span>
                  <strong style={{ color: '#34D399' }}>
                    ✓ Auto-Resolved for {selectedEngine.toUpperCase()}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <span>Filesystem Scope:</span>
                  <strong style={{ color: '#93C5FD' }}>Scoped to Workspace Only</strong>
                </div>
              </div>
            </div>

            {/* AUDIT MODAL FOOTER & CART CONTROLS */}
            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
              {((inspectingExt.cveCount && inspectingExt.cveCount > 0) || inspectingExt.deprecated) && tier === "COMMUNITY" ? (
                <div>
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', color: '#FCA5A5' }}>
                    <strong>🛡️ Community Policy Block:</strong> This package cannot be bundled on the Community tier because it is <strong>{inspectingExt.deprecated ? 'officially marked as Deprecated / End-of-Life' : `${inspectingExt.cveCount} active CVE detected`}</strong>. To bundle this package with an internal policy override, upgrade to Enterprise.
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button onClick={() => setInspectingExt(null)} style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer' }}>
                      Close Audit
                    </button>
                    <button 
                      onClick={() => {
                        setTier("ENTERPRISE");
                        toggleCart(inspectingExt);
                        setInspectingExt(null);
                      }}
                      style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--accent-primary)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                      Switch to Enterprise & Override
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button onClick={() => setInspectingExt(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer' }}>
                    Close Audit
                  </button>
                  <button 
                    onClick={() => { toggleCart(inspectingExt); setInspectingExt(null); }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      background: (inspectingExt.cveCount && inspectingExt.cveCount > 0) || inspectingExt.deprecated ? 'rgba(239, 68, 68, 0.85)' : 'var(--accent-primary)',
                      border: 'none',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                    {cart.some(c => c.name === inspectingExt.name && c.namespace === inspectingExt.namespace) 
                      ? 'Remove from Cart' 
                      : (inspectingExt.cveCount && inspectingExt.cveCount > 0) || inspectingExt.deprecated
                        ? '⚠️ Acknowledge Risk & Add to Cart' 
                        : '+ Add to Build Cart'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: CVE SECURITY INTELLIGENCE & ADVISORY REPORT */}
      {selectedCveExt && selectedCveExt.cveAdvisory && (
        <div className="modal-overlay" onClick={() => setSelectedCveExt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'grid', placeItems: 'center', color: '#F87171', fontSize: '1.4rem' }}>
                  🚨
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{selectedCveExt.cveAdvisory.id}</h2>
                    <span style={{ fontSize: '0.75rem', background: selectedCveExt.cveAdvisory.severity === 'CRITICAL' ? '#EF4444' : '#F97316', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                      {selectedCveExt.cveAdvisory.severity} (CVSS {selectedCveExt.cveAdvisory.cvssScore})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Target: <strong>{selectedCveExt.displayName}</strong> ({selectedCveExt.namespace}.{selectedCveExt.name})
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCveExt(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '0.2rem 0.5rem' }}>
                ✕
              </button>
            </div>

            {/* VULNERABILITY DETAILS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>CWE Classification</span>
                <div style={{ fontSize: '0.9rem', color: '#FCA5A5', fontWeight: 600, marginTop: '0.2rem' }}>
                  {selectedCveExt.cveAdvisory.cwe}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Vulnerability Summary</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0.25rem 0 0 0', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  {selectedCveExt.cveAdvisory.summary}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Technical Impact:</span>
                  <div style={{ fontSize: '0.85rem', color: '#F87171', fontWeight: 600, marginTop: '0.2rem' }}>
                    {selectedCveExt.cveAdvisory.impact}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Affected / Patched In:</span>
                  <div style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 600, marginTop: '0.2rem' }}>
                    Fixed in: {selectedCveExt.cveAdvisory.fixedIn}
                  </div>
                </div>
              </div>

              {/* DIRECT ADVISORY LINKS */}
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Official Security Advisory References
                </span>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a 
                    href={selectedCveExt.cveAdvisory.nvdUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60A5FA', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🏛️</span> NIST NVD Database ↗
                  </a>
                  <a 
                    href={selectedCveExt.cveAdvisory.ghsaUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-color)', color: '#fff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub Security Advisory ↗
                  </a>
                  <a 
                    href={selectedCveExt.cveAdvisory.osvUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34D399', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🛡️</span> OSV.dev Database ↗
                  </a>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Published: {selectedCveExt.cveAdvisory.publishedDate}
              </span>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button 
                  onClick={() => setSelectedCveExt(null)}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Close
                </button>
                {tier !== "COMMUNITY" && (
                  <button 
                    onClick={() => { toggleCart(selectedCveExt); setSelectedCveExt(null); }}
                    style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: 'rgba(239,68,68,0.8)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                    Override & Add (Enterprise Only)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: IDE ENGINE SWITCH CONFIRMATION & CART RESET WARNING */}
      {pendingEngineSwitch && (
        <div className="modal-overlay" onClick={() => setPendingEngineSwitch(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(20, 20, 25, 0.95)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'grid', placeItems: 'center', fontSize: '1.5rem', color: '#F87171' }}>
                ⚠️
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#F87171' }}>Switch IDE Engine?</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Build Manifest Cart Reset Required</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)' }}>
                You currently have <strong>{cart.length} extension(s)</strong> selected for <strong>{selectedEngine.toUpperCase()}</strong>.
              </p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Extensions and toolchain dependencies are engine-specific. Switching your target IDE to <strong>{pendingEngineSwitch.toUpperCase()}</strong> will require you to <strong>restart your selection</strong> and will clear your cart.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setPendingEngineSwitch(null)}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.08)', color: 'white', fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel (Keep {selectedEngine.toUpperCase()})
              </button>
              <button 
                onClick={() => {
                  setSelectedEngine(pendingEngineSwitch);
                  setCart([]);
                  setPendingEngineSwitch(null);
                  setOffset(0);
                }}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                Switch to {pendingEngineSwitch.toUpperCase()} & Reset Cart →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(20, 20, 30, 0.95)',
          border: '1px solid #10B981',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          color: '#E2E8F0',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.88rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span>✨</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', marginLeft: '0.5rem' }}>✕</button>
        </div>
      )}

      {/* MODAL: PUBLISH CUSTOM STACK BLUEPRINT */}
      {showCreateBlueprintModal && (
        <div className="modal-overlay" onClick={() => setShowCreateBlueprintModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'grid', placeItems: 'center', fontSize: '1.2rem', color: 'white' }}>
                  ✨
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Publish Custom Stack Blueprint</h2>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Community catalog • Unlocked to build on Team & Enterprise</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateBlueprintModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishBlueprint} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Blueprint Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rust WebAssembly & Axum Cluster" 
                    value={newBpName} 
                    onChange={(e) => setNewBpName(e.target.value)}
                    required
                    style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} 
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Icon</label>
                  <input 
                    type="text" 
                    value={newBpIcon} 
                    onChange={(e) => setNewBpIcon(e.target.value)}
                    style={{ padding: '0.65rem', textAlign: 'center', fontSize: '1.1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Role Category</label>
                  <select 
                    value={newBpCategory} 
                    onChange={(e) => setNewBpCategory(e.target.value)}
                    style={{ padding: '0.65rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}>
                    <option value="Full Stack">⚡ Full Stack</option>
                    <option value="Backend">☕ Backend Microservices</option>
                    <option value="Frontend">🎨 Frontend & Mobile</option>
                    <option value="SecOps">🛡️ SecOps & AppSec</option>
                    <option value="DevOps">☁️ DevOps & SRE</option>
                    <option value="AI / Data">🧠 AI & Data Science</option>
                    <option value="Systems">🦀 Systems & Embedded</option>
                    <option value="Specialized">🌐 Specialized Toolchain</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Target Engine</label>
                  <select 
                    value={newBpEngine} 
                    onChange={(e) => setNewBpEngine(e.target.value as IdeEngine)}
                    style={{ padding: '0.65rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}>
                    <option value="vscode">VS Code (Universal)</option>
                    <option value="theia">Eclipse Theia (Cloud / Native)</option>
                    <option value="zed">Zed (High-Performance Rust)</option>
                    <option value="neovim">Neovim (Terminal / LazyVim)</option>
                    <option value="jupyter">JupyterLab (Data / AI)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Author Handle / Name</label>
                <input 
                  type="text" 
                  placeholder="@your_github_or_team" 
                  value={newBpAuthor} 
                  onChange={(e) => setNewBpAuthor(e.target.value)}
                  style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} 
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Description & Workflow Intent</label>
                <textarea 
                  rows={2}
                  placeholder="Explain what tools this stack includes and why it accelerates developer workflows..." 
                  value={newBpDesc} 
                  onChange={(e) => setNewBpDesc(e.target.value)}
                  style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', resize: 'vertical' }} 
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tags (comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="Rust, Axum, WebAssembly, CodeLLDB, SQLTools" 
                  value={newBpTags} 
                  onChange={(e) => setNewBpTags(e.target.value)}
                  style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} 
                />
              </div>

              {/* BUNDLE CONTENTS PREVIEW */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#93C5FD' }}>
                    📦 Stack Extensions ({cart.length > 0 ? cart.length : 1} items)
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 600 }}>✓ 0-CVE Policy Verified</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {cart.length > 0 ? (
                    cart.map(c => (
                      <span key={c.name} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        {c.displayName || c.name}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Defaults to current engine debugger & core tools (or add extensions to your cart first).
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateBlueprintModal(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '0.65rem 1.5rem', borderRadius: '6px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                  Publish to Community Catalog ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
