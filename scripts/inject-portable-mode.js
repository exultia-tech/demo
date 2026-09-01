const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('>>> [PORTABLE INJECTION] Preparing 100% isolated portable VS Code package...');

const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
const zipFile = path.join(downloadsDir, 'SecureIDE_Studio-windows-ENTERPRISE-build-1788215181655.zip');
const tempDir = path.join(downloadsDir, 'portable_staging');

if (!fs.existsSync(zipFile)) {
  console.error('Source zip file not found:', zipFile);
  process.exit(1);
}

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

console.log('1. Extracting 450MB release archive...');
execSync(`tar -xf "${zipFile}" -C "${tempDir}"`);

console.log('2. Provisioning native Portable Mode data directories...');
const dataDir = path.join(tempDir, 'data');
const userDataDir = path.join(dataDir, 'user-data');
const extsDir = path.join(dataDir, 'extensions');

fs.mkdirSync(userDataDir, { recursive: true });
fs.mkdirSync(extsDir, { recursive: true });

console.log('3. Injecting isolated User Settings in data/user-data/User/settings.json...');
const userSettingsDir = path.join(userDataDir, 'User');
fs.mkdirSync(userSettingsDir, { recursive: true });

const isolatedSettings = {
  "telemetry.telemetryLevel": "off",
  "telemetry.enableCrashReporter": false,
  "telemetry.enableTelemetry": false,
  "update.mode": "none",
  "extensions.autoUpdate": false,
  "security.workspace.trust.enabled": true,
  "workbench.colorCustomizations": {
    "titleBar.activeBackground": "#1e293b",
    "titleBar.activeForeground": "#ffffff",
    "activityBar.background": "#0f172a"
  }
};
fs.writeFileSync(path.join(userSettingsDir, 'settings.json'), JSON.stringify(isolatedSettings, null, 2));

console.log('4. Creating zero-conflict launch scripts...');
// Root batch script that explicitly enforces the isolated portable directories
const launchCmd = `@echo off\r\necho Starting Isolated Portable SecureIDE Studio...\r\nstart "" "%~dp0Code.exe" --user-data-dir "%~dp0data\\user-data" --extensions-dir "%~dp0data\\extensions" %*\r\n`;
fs.writeFileSync(path.join(tempDir, 'Launch-SecureIDE.cmd'), launchCmd);

const launchSh = `#!/bin/bash\nDIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"\n"$DIR/Code" --user-data-dir "$DIR/data/user-data" --extensions-dir "$DIR/data/extensions" "$@"\n`;
fs.writeFileSync(path.join(tempDir, 'launch-secureide.sh'), launchSh);

console.log('5. Re-compressing into final distribution archive...');
fs.unlinkSync(zipFile);
execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipFile}' -Force"`);

console.log('6. Cleaning up staging temp...');
fs.rmSync(tempDir, { recursive: true, force: true });

const finalStat = fs.statSync(zipFile);
console.log(`✓ [SUCCESS] Repackaged Portable ZIP: ${zipFile} (${(finalStat.size / 1024 / 1024).toFixed(2)} MB)`);
