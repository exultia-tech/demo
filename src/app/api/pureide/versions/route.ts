import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface VersionChannel {
  id: "latest" | "preview" | "previous" | "custom";
  name: string;
  tag: string;
  badge: string;
  badgeColor: string;
  description: string;
}

export type IdeEngine = "vscode" | "theia" | "zed" | "neovim" | "jupyter";

// Default fallback channels if upstream APIs are unreachable or rate-limited
const FALLBACK_CHANNELS: Record<IdeEngine, VersionChannel[]> = {
  vscode: [
    { id: "latest", name: "Latest Stable", tag: "1.136.0", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official latest stable release (v1.136.0). Electron & Chromium patched." },
    { id: "preview", name: "Insiders / Preview", tag: "insiders", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Pre-release preview build with upcoming upstream features." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "1.135.0", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Proven previous stable milestone (v1.135.0) for enterprise stability." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify a custom Git release tag or commit SHA." }
  ],
  theia: [
    { id: "latest", name: "Latest Stable", tag: "1.54.0", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official Eclipse Theia latest release." },
    { id: "preview", name: "Next / Preview", tag: "next", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Bleeding-edge upstream next-gen branch." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "1.53.0", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Previous LTS enterprise release." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify custom release tag." }
  ],
  zed: [
    { id: "latest", name: "Latest Stable", tag: "v0.155.0", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official Zed Rust latest release." },
    { id: "preview", name: "Zed Preview", tag: "preview", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Zed preview channel with rapid experimental features." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "v0.154.0", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Previous verified stable Zed release." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify custom release tag." }
  ],
  neovim: [
    { id: "latest", name: "Latest Stable", tag: "v0.10.4", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official Neovim release." },
    { id: "preview", name: "Nightly / Preview", tag: "nightly", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Bleeding-edge master nightly build." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "v0.10.3", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Previous stable release." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify custom release tag." }
  ],
  jupyter: [
    { id: "latest", name: "Latest Stable", tag: "v4.3.5", badge: "✓ Recommended", badgeColor: "#34D399", description: "Official JupyterLab stable release." },
    { id: "preview", name: "JupyterLab Preview", tag: "v4.4.0a1", badge: "⚡ Preview", badgeColor: "#FBBF24", description: "Pre-release alpha channel." },
    { id: "previous", name: "Previous Stable (Last Stable)", tag: "v4.3.4", badge: "🛡️ Enterprise N-1", badgeColor: "#60A5FA", description: "Previous verified enterprise release." },
    { id: "custom", name: "Custom Version (Git Tag)", tag: "custom", badge: "Custom", badgeColor: "#A78BFA", description: "Specify custom release tag." }
  ]
};

// In-memory server cache with 2-hour TTL
let cacheTimestamp = 0;
let cachedChannels: Record<IdeEngine, VersionChannel[]> | null = null;
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

async function fetchJson(url: string, headers: Record<string, string> = {}) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'PureIDE-Engine-VersionResolver',
        'Accept': 'application/vnd.github.v3+json, application/json',
        ...headers
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const now = Date.now();
  if (cachedChannels && (now - cacheTimestamp < CACHE_TTL_MS)) {
    return NextResponse.json({
      success: true,
      source: "cache",
      updatedAt: new Date(cacheTimestamp).toISOString(),
      channels: cachedChannels
    }, {
      headers: {
        'Cache-Control': 'public, max-age=7200, stale-while-revalidate=86400'
      }
    });
  }

  const channels: Record<IdeEngine, VersionChannel[]> = JSON.parse(JSON.stringify(FALLBACK_CHANNELS));

  try {
    // 1. VS Code / VSCodium Releases
    const vscodiumData = await fetchJson('https://api.github.com/repos/VSCodium/vscodium/releases?per_page=5');
    if (Array.isArray(vscodiumData) && vscodiumData.length >= 2) {
      const latestTag = vscodiumData[0].tag_name.replace(/^v/, '');
      const prevTag = vscodiumData[1].tag_name.replace(/^v/, '');
      channels.vscode[0].tag = latestTag;
      channels.vscode[0].description = `Official latest stable release (v${latestTag}). Electron & Chromium patched.`;
      channels.vscode[2].tag = prevTag;
      channels.vscode[2].description = `Proven previous stable milestone (v${prevTag}) for enterprise stability.`;
    }

    // 2. Zed Releases
    const zedData = await fetchJson('https://api.github.com/repos/zed-industries/zed/releases?per_page=3');
    if (Array.isArray(zedData) && zedData.length >= 2) {
      channels.zed[0].tag = zedData[0].tag_name;
      channels.zed[2].tag = zedData[1].tag_name;
    }

    // 3. Neovim Releases
    const neovimData = await fetchJson('https://api.github.com/repos/neovim/neovim/releases?per_page=3');
    if (Array.isArray(neovimData) && neovimData.length >= 2) {
      channels.neovim[0].tag = neovimData[0].tag_name;
      channels.neovim[2].tag = neovimData[1].tag_name;
    }

    // Update memory cache
    cachedChannels = channels;
    cacheTimestamp = now;

    return NextResponse.json({
      success: true,
      source: "live_upstream",
      updatedAt: new Date(now).toISOString(),
      channels
    }, {
      headers: {
        'Cache-Control': 'public, max-age=7200, stale-while-revalidate=86400'
      }
    });
  } catch (err) {
    console.error('Upstream version check failed, serving defaults:', err);
    return NextResponse.json({
      success: true,
      source: "fallback",
      updatedAt: new Date(now).toISOString(),
      channels: FALLBACK_CHANNELS
    });
  }
}
