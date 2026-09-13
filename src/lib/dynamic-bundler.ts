import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export interface BundleOptions {
  brandName?: string;
  engine?: string;
  tier?: string;
  extensions?: string; // comma-separated list: "ms-python.python,golang.go,..."
  targetOs?: string;
  buildId?: string;
  theme?: string;
}

export async function assembleCustomDistribution(options: BundleOptions): Promise<string> {
  const {
    brandName = 'PureIDE Studio',
    engine = 'vscode',
    tier = 'TEAM',
    extensions = '',
    targetOs = 'windows'
  } = options;

  const safeBrand = (brandName || 'PureIDE').replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().replace(/\s+/g, '_') || 'PureIDE';
  const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
  const buildsDir = path.join(downloadsDir, 'builds');
  const extCacheDir = path.join(downloadsDir, 'extensions_cache');

  if (!fs.existsSync(buildsDir)) fs.mkdirSync(buildsDir, { recursive: true });
  if (!fs.existsSync(extCacheDir)) fs.mkdirSync(extCacheDir, { recursive: true });

  const extList = extensions
    .split(',')
    .map(e => e.trim())
    .filter(e => e.length > 0);

  // Compute a deterministic cache key based on configuration
  const configHash = Buffer.from(`${safeBrand}_${engine}_${tier}_${extList.sort().join('_')}`).toString('hex').slice(0, 12);
  const targetZipName = `${safeBrand}_${engine.toUpperCase()}_${configHash}.zip`;
  const targetZipPath = path.join(buildsDir, targetZipName);

  // If identical distribution already assembled, return it immediately
  if (fs.existsSync(targetZipPath) && fs.statSync(targetZipPath).size > 10000000) {
    return targetZipPath;
  }

  // Ensure base vscodium-base.zip exists
  const baseZipPath = path.join(downloadsDir, 'vscodium-base.zip');
  if (!fs.existsSync(baseZipPath)) {
    const dlUrl = 'https://github.com/VSCodium/vscodium/releases/download/1.126.04524/VSCodium-win32-x64-1.126.04524.zip';
    const res = await fetch(dlUrl, { headers: { 'User-Agent': 'SecureIDE-Engine' } });
    if (!res.ok) throw new Error(`Failed to download base binary template from ${dlUrl}`);
    const buf = await res.arrayBuffer();
    fs.writeFileSync(baseZipPath, Buffer.from(buf));
  }

  const stagingDir = path.join(downloadsDir, `staging_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
  fs.mkdirSync(stagingDir, { recursive: true });

  try {
    // 1. Extract clean base runtime
    execSync(`powershell -NoProfile -Command "tar -xf '${baseZipPath.replace(/\\/g, '/')}' -C '${stagingDir.replace(/\\/g, '/')}'"`);

    // 2. Harden product.json (Neutralize Marketplace & Outbound Telemetry)
    const productJsonPath = path.join(stagingDir, 'resources', 'app', 'product.json');
    if (fs.existsSync(productJsonPath)) {
      const product = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));
      product.nameShort = safeBrand.replace(/_/g, ' ');
      product.nameLong = `${safeBrand.replace(/_/g, ' ')} Workstation`;
      product.applicationName = safeBrand.toLowerCase().replace(/_/g, '-');
      product.win32AppUserModelId = `${safeBrand}.Studio`;
      product.win32MutexName = `${safeBrand.toLowerCase()}_singleton`;
      product.dataFolderName = `.${safeBrand.toLowerCase()}`;
      product.updateUrl = "";

      // Completely neutralize marketplace
      product.extensionsGallery = {
        serviceUrl: "",
        itemUrl: "",
        resourceUrlTemplate: "",
        controlUrl: "",
        recommendationsUrl: ""
      };

      // Eradicate telemetry
      product.telemetryOptIn = false;
      product.enableTelemetry = false;
      product.sendCrashReports = false;
      product.enableCrashReporter = false;
      product.telemetryEndpoint = "";

      fs.writeFileSync(productJsonPath, JSON.stringify(product, null, 2), 'utf8');
    }

    // Executable aliases
    const vscodiumExe = path.join(stagingDir, 'VSCodium.exe');
    const codeExe = path.join(stagingDir, 'Code.exe');
    const brandExe = path.join(stagingDir, `${safeBrand}.exe`);
    if (fs.existsSync(vscodiumExe)) {
      fs.copyFileSync(vscodiumExe, codeExe);
      fs.copyFileSync(vscodiumExe, brandExe);
    }

    // 3. Provision Portable Mode Directories
    const dataDir = path.join(stagingDir, 'data');
    const userDataDir = path.join(dataDir, 'user-data');
    const extsDir = path.join(dataDir, 'extensions');
    fs.mkdirSync(userDataDir, { recursive: true });
    fs.mkdirSync(extsDir, { recursive: true });

    // 4. Download and bundle each selected extension
    for (const extStr of extList) {
      const parts = extStr.split('.');
      if (parts.length < 2) continue;
      const ns = parts[0];
      const name = parts[1];

      try {
        let vsixFile = '';
        // Check if cached locally
        const cachedMatches = fs.readdirSync(extCacheDir).filter(f => f.startsWith(`${ns}.${name}`) && f.endsWith('.vsix'));
        if (cachedMatches.length > 0) {
          vsixFile = path.join(extCacheDir, cachedMatches[0]);
        } else {
          // Fetch from OpenVSX
          const metaRes = await fetch(`https://open-vsx.org/api/${ns}/${name}`);
          if (metaRes.ok) {
            const meta = await metaRes.json();
            const dlUrl = meta.files?.download;
            const version = meta.version || '1.0.0';
            if (dlUrl) {
              const vsixRes = await fetch(dlUrl);
              if (vsixRes.ok) {
                const vsixBuf = await vsixRes.arrayBuffer();
                vsixFile = path.join(extCacheDir, `${ns}.${name}-${version}.vsix`);
                fs.writeFileSync(vsixFile, Buffer.from(vsixBuf));
              }
            }
          }
        }

        if (vsixFile && fs.existsSync(vsixFile)) {
          const vsixLeaf = path.basename(vsixFile, '.vsix');
          const extDest = path.join(extsDir, vsixLeaf);
          fs.mkdirSync(extDest, { recursive: true });
          execSync(`tar -xf "${vsixFile}" -C "${extDest}" --strip-components=1`);

          // Prune deep stub/typeshed directories that cause MAX_PATH (>260 char) issues
          // on Windows extraction. Type stubs are not needed at runtime.
          const deepPrunePaths = [
            path.join(extDest, 'python_files', 'lib', 'jedilsp', 'jedi', 'third_party'),
            path.join(extDest, 'extension', 'python_files', 'lib', 'jedilsp', 'jedi', 'third_party'),
            path.join(extDest, 'bundled', 'stubs'),
          ];
          for (const prunePath of deepPrunePaths) {
            if (fs.existsSync(prunePath)) {
              fs.rmSync(prunePath, { recursive: true, force: true });
              console.log(`[BUNDLER TRIM] Pruned deep stubs: ${prunePath}`);
            }
          }
        }
      } catch (err: any) {
        console.warn(`[BUNDLER NOTICE] Extension bundling skipped for ${extStr}:`, err.message);
      }
    }

    // Always include built-in multi-host ssh workspace extension
    const localMultiSshSrc = path.join(process.cwd(), '..', 'vscode-multi-ssh');
    if (fs.existsSync(localMultiSshSrc)) {
      const multiSshDest = path.join(extsDir, 'secureide.vscode-multi-ssh-1.0.0');
      fs.mkdirSync(multiSshDest, { recursive: true });
      try {
        execSync(`powershell -NoProfile -Command "Copy-Item -Path '${localMultiSshSrc.replace(/\\/g, '/')}\\*' -Destination '${multiSshDest.replace(/\\/g, '/')}' -Recurse -Force -Exclude 'node_modules','.git'"`);
      } catch (_) {}
    }

    // 5. Inject Zero-Trust Policy Settings & Direct Launcher
    const userSettingsDir = path.join(userDataDir, 'User');
    fs.mkdirSync(userSettingsDir, { recursive: true });

    const finalSettings = {
      "telemetry.telemetryLevel": "off",
      "telemetry.enableCrashReporter": false,
      "telemetry.enableTelemetry": false,
      "update.mode": "none",
      "update.showReleaseNotes": false,
      "extensions.autoUpdate": false,
      "extensions.autoCheckUpdates": false,
      "extensions.ignoreRecommendations": true,
      "extensions.closeExtensionHostOnCrash": true,
      "extensions.webEndpoint": "",
      "workbench.enableExperiments": false,
      "workbench.settings.enableNaturalLanguageSearch": false,
      "security.workspace.trust.enabled": true,
      "security.workspace.trust.startupPrompt": "always",
      "security.workspace.trust.emptyWindow": false,
      "workbench.colorTheme": "Default Dark Modern",
      "workbench.colorCustomizations": {
        "titleBar.activeBackground": "#0f172a",
        "titleBar.activeForeground": "#38bdf8",
        "activityBar.background": "#020617",
        "activityBar.foreground": "#38bdf8",
        "statusBar.background": "#0f172a",
        "statusBar.foreground": "#94a3b8",
        "statusBarItem.remoteBackground": "#0284c7"
      }
    };
    fs.writeFileSync(path.join(userSettingsDir, 'settings.json'), JSON.stringify(finalSettings, null, 2), 'utf8');

    // Root launcher
    const rootCmd = `@echo off\r\necho Launching Hardened Portable ${safeBrand.replace(/_/g, ' ')}...\r\nstart "" "%~dp0Code.exe" --user-data-dir "%~dp0data\\user-data" --extensions-dir "%~dp0data\\extensions" %*\r\n`;
    fs.writeFileSync(path.join(stagingDir, `Launch-${safeBrand}.cmd`), rootCmd);
    fs.writeFileSync(path.join(stagingDir, `Launch-SecureIDE.cmd`), rootCmd);

    // 6. Package into long-path-safe ZIP using .NET ZipFile
    // (tar -a -cf creates zip but Windows Explorer can't handle paths >260 chars)
    if (fs.existsSync(targetZipPath)) fs.unlinkSync(targetZipPath);
    const psZipScript = [
      `Add-Type -Assembly System.IO.Compression`,
      `Add-Type -Assembly System.IO.Compression.FileSystem`,
      `[System.IO.Compression.ZipFile]::CreateFromDirectory(`,
      `  '${stagingDir.replace(/'/g, "''")}',`,
      `  '${targetZipPath.replace(/'/g, "''")}',`,
      `  [System.IO.Compression.CompressionLevel]::Optimal,`,
      `  $false`,
      `)`,
    ].join('\n');
    execSync(`powershell -NoProfile -Command "${psZipScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}"`);

    return targetZipPath;
  } finally {
    if (fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
  }
}
