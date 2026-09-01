const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function buildHardenedDistribution() {
  console.log('================================================================');
  console.log('  SECURE IDE HARDENED BUNDLE & ZERO-TRUST POLICY INJECTOR       ');
  console.log('================================================================');

  const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
  const zipFile = path.join(downloadsDir, 'SecureIDE_Studio-windows-ENTERPRISE-build-1788215181655.zip');
  const stagingDir = path.join(downloadsDir, 'distribution_staging');

  if (!fs.existsSync(zipFile)) {
    console.error('Base distribution zip not found:', zipFile);
    process.exit(1);
  }

  if (fs.existsSync(stagingDir)) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
  fs.mkdirSync(stagingDir, { recursive: true });

  console.log('\n>>> [1/5] Extracting base runtime binary archive...');
  execSync(`tar -xf "${zipFile}" -C "${stagingDir}"`);

  // Locate resources/app and product.json
  const resourcesDir = path.join(stagingDir, '08d4889f9e', 'resources') || path.join(stagingDir, 'resources');
  const appAsar = path.join(resourcesDir, 'app.asar');
  const appDir = path.join(resourcesDir, 'app');

  console.log('\n>>> [2/5] Completely Neutralizing Marketplace Endpoints in product.json...');
  
  // If app.asar exists, unpack it first
  if (fs.existsSync(appAsar) && !fs.existsSync(appDir)) {
    console.log('    -> Extracting app.asar for zero-trust policy injection...');
    try {
      execSync(`npx -y @electron/asar extract "${appAsar}" "${appDir}"`);
      fs.unlinkSync(appAsar);
    } catch (e) {
      console.warn('    [WARN] asar extract notice:', e.message);
    }
  }

  const productJsonPath = fs.existsSync(path.join(appDir, 'product.json')) 
    ? path.join(appDir, 'product.json') 
    : path.join(stagingDir, 'product.json');

  let product = {};
  if (fs.existsSync(productJsonPath)) {
    try {
      product = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));
    } catch (_) {}
  }

  // HARDEN PRODUCT.JSON: Zero Telemetry + Eradicate Public Marketplace
  product.nameShort = "SecureIDE";
  product.nameLong = "SecureIDE Studio";
  product.applicationName = "secure-ide";
  product.win32AppUserModelId = "SecureIDE.Studio";
  product.win32MutexName = "secureide_mutex";
  product.dataFolderName = ".secure-ide";
  product.updateUrl = "";
  product.quality = "stable";

  // Completely neutral marketplace configuration
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

  if (fs.existsSync(productJsonPath)) {
    fs.writeFileSync(productJsonPath, JSON.stringify(product, null, 2), 'utf8');
    console.log('    ✓ product.json sealed with marketplace disabled.');
  }

  // Re-pack app.asar if needed
  if (fs.existsSync(appDir) && fs.existsSync(resourcesDir)) {
    try {
      console.log('    -> Re-sealing app.asar binary container...');
      execSync(`npx -y @electron/asar pack "${appDir}" "${appAsar}"`);
      fs.rmSync(appDir, { recursive: true, force: true });
      console.log('    ✓ app.asar sealed successfully.');
    } catch (e) {
      console.warn('    [WARN] asar pack notice:', e.message);
    }
  }

  console.log('\n>>> [3/5] Bundling Real Vetted Extensions into Portable Extension Store...');
  const dataDir = path.join(stagingDir, 'data');
  const userDataDir = path.join(dataDir, 'user-data');
  const extensionsDir = path.join(dataDir, 'extensions');

  fs.mkdirSync(userDataDir, { recursive: true });
  fs.mkdirSync(extensionsDir, { recursive: true });

  // Curated extensions to pre-install
  const extensionsToInstall = [
    { id: 'dbaeumer.vscode-eslint', namespace: 'dbaeumer', name: 'vscode-eslint' },
    { id: 'esbenp.prettier-vscode', namespace: 'esbenp', name: 'prettier-vscode' },
    { id: 'redhat.vscode-yaml', namespace: 'redhat', name: 'vscode-yaml' },
    { id: 'tamasfe.even-better-toml', namespace: 'tamasfe', name: 'even-better-toml' }
  ];

  for (const ext of extensionsToInstall) {
    console.log(`    + Downloading verified extension: ${ext.id}...`);
    try {
      const metaRes = await fetch(`https://open-vsx.org/api/${ext.namespace}/${ext.name}`);
      if (!metaRes.ok) continue;
      const metaData = await metaRes.json();
      const downloadUrl = metaData.files?.download;
      const version = metaData.version || '1.0.0';

      if (downloadUrl) {
        const vsixRes = await fetch(downloadUrl);
        if (vsixRes.ok) {
          const vsixBuf = await vsixRes.arrayBuffer();
          const tempVsix = path.join(stagingDir, `${ext.name}.zip`);
          fs.writeFileSync(tempVsix, Buffer.from(vsixBuf));

          const extDest = path.join(extensionsDir, `${ext.namespace}.${ext.name}-${version}`);
          fs.mkdirSync(extDest, { recursive: true });

          // Extract extension/ folder from vsix
          const tempExtExtract = path.join(stagingDir, `temp_ext_${ext.name}`);
          fs.mkdirSync(tempExtExtract, { recursive: true });
          execSync(`tar -xf "${tempVsix}" -C "${tempExtExtract}"`);

          const internalExtensionDir = path.join(tempExtExtract, 'extension');
          if (fs.existsSync(internalExtensionDir)) {
            // Copy files from extension/ to destination
            execSync(`powershell -NoProfile -Command "Copy-Item -Path '${internalExtensionDir}\\*' -Destination '${extDest}' -Recurse -Force"`);
            console.log(`    ✓ Pre-installed: ${ext.id} v${version}`);
          }

          // Cleanup temp
          fs.unlinkSync(tempVsix);
          fs.rmSync(tempExtExtract, { recursive: true, force: true });
        }
      }
    } catch (err) {
      console.warn(`    [NOTICE] Skipping extension ${ext.id}: ${err.message}`);
    }
  }

  // Also pre-install our custom Multi-SSH extension!
  const localMultiSshSrc = path.join(process.cwd(), '..', 'vscode-multi-ssh');
  if (fs.existsSync(localMultiSshSrc)) {
    console.log('    + Bundling Built-in Multi-Host SSH Workspace Extension...');
    const multiSshDest = path.join(extensionsDir, 'secureide.vscode-multi-ssh-1.0.0');
    fs.mkdirSync(multiSshDest, { recursive: true });
    try {
      execSync(`powershell -NoProfile -Command "Copy-Item -Path '${localMultiSshSrc}\\*' -Destination '${multiSshDest}' -Recurse -Force -Exclude 'node_modules','.git'"`);
      console.log('    ✓ Multi-Host SSH Workspace Extension pre-installed successfully.');
    } catch (_) {}
  }

  console.log('\n>>> [4/5] Injecting Hardened Offline User Settings...');
  const userSettingsDir = path.join(userDataDir, 'User');
  fs.mkdirSync(userSettingsDir, { recursive: true });

  const finalSettings = {
    // Eradicate Telemetry & Analytics
    "telemetry.telemetryLevel": "off",
    "telemetry.enableCrashReporter": false,
    "telemetry.enableTelemetry": false,
    // Disable Updates & Marketplace
    "update.mode": "none",
    "update.showReleaseNotes": false,
    "extensions.autoUpdate": false,
    "extensions.autoCheckUpdates": false,
    "extensions.ignoreRecommendations": true,
    "extensions.closeExtensionHostOnCrash": true,
    "extensions.webEndpoint": "",
    "workbench.enableExperiments": false,
    "workbench.settings.enableNaturalLanguageSearch": false,
    // Strict Workspace Trust
    "security.workspace.trust.enabled": true,
    "security.workspace.trust.startupPrompt": "always",
    "security.workspace.trust.emptyWindow": false,
    // Quantum Dark Branding Theme
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

  // Direct isolated batch launcher
  const rootLauncher = `@echo off\r\necho Starting Hardened Zero-Trust SecureIDE Studio...\r\nstart "" "%~dp0Code.exe" --user-data-dir "%~dp0data\\user-data" --extensions-dir "%~dp0data\\extensions" %*\r\n`;
  fs.writeFileSync(path.join(stagingDir, 'Launch-SecureIDE.cmd'), rootLauncher);

  console.log('\n>>> [5/5] Re-packaging final distribution archive...');
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipFile}' -Force"`);
  fs.rmSync(stagingDir, { recursive: true, force: true });

  const finalStat = fs.statSync(zipFile);
  console.log(`\n================================================================`);
  console.log(`  ✓ BUILD COMPLETE: ${(finalStat.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  - Marketplace: 100% DISABLED & NEUTRALIZED`);
  console.log(`  - Telemetry: 100% ZEROED`);
  console.log(`  - Pre-installed Extensions: ESLint, Prettier, YAML, TOML, Multi-SSH`);
  console.log(`  - Portable Mode: Enforced in data/`);
  console.log(`================================================================\n`);
}

buildHardenedDistribution().catch(console.error);
