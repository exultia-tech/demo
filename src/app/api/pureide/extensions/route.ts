import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface FallbackExt {
  name: string;
  namespace: string;
  displayName: string;
  description: string;
  downloadCount: number;
  files: { icon?: string };
  verified: boolean;
  version: string;
}

const FALLBACK_EXTENSIONS: FallbackExt[] = [
  {
    name: "python",
    namespace: "ms-python",
    displayName: "Python",
    description: "IntelliSense (Pylance), Linting, Debugging, code navigation, code formatting, and refactoring.",
    downloadCount: 135000000,
    files: { icon: "https://ms-python.gallerycdn.vsassets.io/extensions/ms-python/python/2024.12.0/1722442221614/Microsoft.VisualStudio.Services.Icons.Default" },
    verified: true,
    version: "2024.12.0"
  },
  {
    name: "vscode-pylance",
    namespace: "ms-python",
    displayName: "Pylance",
    description: "High-performance language support for Python, featuring fast type checking, auto-imports, and semantic highlighting.",
    downloadCount: 88000000,
    files: { icon: "https://ms-python.gallerycdn.vsassets.io/extensions/ms-python/vscode-pylance/2024.8.1/1722883391745/Microsoft.VisualStudio.Services.Icons.Default" },
    verified: true,
    version: "2024.8.1"
  },
  {
    name: "rust-analyzer",
    namespace: "rust-lang",
    displayName: "rust-analyzer",
    description: "Official Rust language server support for semantic syntax highlighting, completions, and cargo diagnostics.",
    downloadCount: 38000000,
    files: { icon: "https://open-vsx.org/api/rust-lang/rust-analyzer/0.3.2200/file/icon.png" },
    verified: true,
    version: "0.3.2200"
  },
  {
    name: "Go",
    namespace: "golang",
    displayName: "Go",
    description: "Rich Go language support for Visual Studio Code, Theia, and Zed powered by gopls.",
    downloadCount: 34000000,
    files: { icon: "https://open-vsx.org/api/golang/Go/0.58.0/file/go-logo-blue.png" },
    verified: true,
    version: "0.58.0"
  },
  {
    name: "vscode-docker",
    namespace: "ms-azuretools",
    displayName: "Docker",
    description: "Easily build, manage, and deploy containerized applications with Docker and Podman.",
    downloadCount: 39000000,
    files: { icon: "https://ms-azuretools.gallerycdn.vsassets.io/extensions/ms-azuretools/vscode-docker/1.29.1/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
    verified: true,
    version: "1.29.1"
  },
  {
    name: "vscode-clangd",
    namespace: "llvm-vs-code-extensions",
    displayName: "clangd (C/C++)",
    description: "C/C++ language intelligence via Clangd: code completion, compile_commands.json integration, and rename.",
    downloadCount: 22000000,
    files: { icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png" },
    verified: true,
    version: "0.1.28"
  },
  {
    name: "vscode-lldb",
    namespace: "vadimcn",
    displayName: "CodeLLDB",
    description: "Native debugger for C++, Rust, and other compiled languages based on LLDB.",
    downloadCount: 18000000,
    files: { icon: "https://open-vsx.org/api/vadimcn/vscode-lldb/1.10.0/file/icon.png" },
    verified: true,
    version: "1.10.0"
  },
  {
    name: "vscode-eslint",
    namespace: "dbaeumer",
    displayName: "ESLint",
    description: "Integrates ESLint JavaScript and TypeScript linter into your editor with auto-fix on save.",
    downloadCount: 32000000,
    files: { icon: "https://open-vsx.org/api/dbaeumer/vscode-eslint/3.0.10/file/icon.png" },
    verified: true,
    version: "3.0.10"
  },
  {
    name: "prettier-vscode",
    namespace: "esbenp",
    displayName: "Prettier - Code Formatter",
    description: "Code formatter using Prettier supporting JavaScript, TypeScript, CSS, HTML, JSON, and Markdown.",
    downloadCount: 45000000,
    files: { icon: "https://open-vsx.org/api/esbenp/prettier-vscode/11.0.0/file/icon.png" },
    verified: true,
    version: "11.0.0"
  },
  {
    name: "vscode-yaml",
    namespace: "redhat",
    displayName: "YAML",
    description: "Comprehensive YAML language support with built-in Kubernetes and JSON schema validation.",
    downloadCount: 28000000,
    files: { icon: "https://open-vsx.org/api/redhat/vscode-yaml/1.15.0/file/icon.png" },
    verified: true,
    version: "1.15.0"
  },
  {
    name: "even-better-toml",
    namespace: "tamasfe",
    displayName: "Even Better TOML",
    description: "Fully featured TOML support with syntax highlighting, schema validation, and Cargo.toml support.",
    downloadCount: 14000000,
    files: { icon: "https://open-vsx.org/api/Shopify/ruby-lsp/0.10.6/file/icon.png" },
    verified: true,
    version: "0.19.2"
  },
  {
    name: "copilot",
    namespace: "GitHub",
    displayName: "GitHub Copilot",
    description: "Your AI pair programmer — generates code suggestions and unit tests directly in your editor.",
    downloadCount: 19850000,
    files: { icon: "https://raw.githubusercontent.com/github/copilot-docs/main/images/copilot-logo.png" },
    verified: true,
    version: "1.150.0"
  },
  {
    name: "remote-ssh",
    namespace: "ms-vscode-remote",
    displayName: "Remote - SSH",
    description: "Open any folder on a remote machine using SSH and develop with full language intelligence.",
    downloadCount: 48000000,
    files: { icon: "https://ms-vscode-remote.gallerycdn.vsassets.io/extensions/ms-vscode-remote/remote-ssh/0.113.1/1719947833908/Microsoft.VisualStudio.Services.Icons.Default" },
    verified: true,
    version: "0.113.1"
  },
  {
    name: "jupyter",
    namespace: "ms-toolsai",
    displayName: "Jupyter",
    description: "Jupyter notebook support, interactive programming, and computing in your workspace.",
    downloadCount: 65000000,
    files: { icon: "https://ms-toolsai.gallerycdn.vsassets.io/extensions/ms-toolsai/jupyter/2024.11.0/file/icon.png" },
    verified: true,
    version: "2024.11.0"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const sortBy = searchParams.get("sortBy") || "downloadCount";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const size = Math.min(parseInt(searchParams.get("size") || "50", 10), 100);

  const sortParam = `sortBy=${encodeURIComponent(sortBy)}&sortOrder=${encodeURIComponent(sortOrder)}`;
  const openVsxUrl = query.trim()
    ? `https://open-vsx.org/api/-/search?query=${encodeURIComponent(query.trim())}&${sortParam}&offset=${offset}&size=${size}`
    : `https://open-vsx.org/api/-/search?${sortParam}&offset=${offset}&size=${size}`;

  try {
    const res = await fetch(openVsxUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Daedelus-Extension-Feed/2.4.0",
      },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const raw = Array.isArray(data.extensions) ? data.extensions : [];
      const total = typeof data.totalSize === "number" ? data.totalSize : typeof data.total === "number" ? data.total : raw.length;

      // Ensure every extension has a safe files object
      const safeExtensions = raw.map((ext: any) => ({
        ...ext,
        files: ext.files && typeof ext.files === "object" ? ext.files : { icon: ext.icon || undefined },
      }));

      return NextResponse.json({
        total,
        extensions: safeExtensions,
        source: "open-vsx",
      });
    }
  } catch (err) {
    console.warn("[Extension Feed Proxy] OpenVSX upstream request failed or timed out:", err);
  }

  // Fallback: return filtered curated baseline
  const qLower = query.toLowerCase().trim();
  const filtered = qLower
    ? FALLBACK_EXTENSIONS.filter(
        (e) =>
          e.name.toLowerCase().includes(qLower) ||
          e.displayName.toLowerCase().includes(qLower) ||
          e.namespace.toLowerCase().includes(qLower) ||
          e.description.toLowerCase().includes(qLower)
      )
    : FALLBACK_EXTENSIONS;

  const sliced = filtered.slice(offset, offset + size);

  return NextResponse.json({
    total: filtered.length,
    extensions: sliced,
    source: "curated-fallback",
  });
}
