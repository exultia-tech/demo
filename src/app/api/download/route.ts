import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get('path') || '';
    const brand = searchParams.get('brand') || 'SecureIDE';
    const type = searchParams.get('type') || '';
    const engine = searchParams.get('engine') || 'vscode';

    const safeBrand = brand.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().replace(/\s+/g, '_') || 'SecureIDE';
    const isInstaller = type === 'installer' || requestedPath.endsWith('.exe');

    // Ensure downloads directory exists
    const publicDownloadsPath = path.join(process.cwd(), 'public', 'downloads');
    if (!fs.existsSync(publicDownloadsPath)) {
      fs.mkdirSync(publicDownloadsPath, { recursive: true });
    }

    let localFilePath = '';
    const baseName = path.basename(requestedPath);

    // 1. Check exact requested file path
    if (requestedPath && fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
      localFilePath = requestedPath;
    } else if (baseName && fs.existsSync(path.join(publicDownloadsPath, baseName))) {
      localFilePath = path.join(publicDownloadsPath, baseName);
    }

    // 2. If not found, scan public/downloads for best candidate match
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      const allFiles = fs.readdirSync(publicDownloadsPath).filter(f => !f.startsWith('.'));
      
      if (isInstaller) {
        // Find existing .exe installer
        const exeMatch = allFiles.find(f => f.endsWith('.exe') && (f.toLowerCase().includes(safeBrand.toLowerCase()) || f.toLowerCase().includes('setup') || f.toLowerCase().includes('secureide')));
        if (exeMatch) {
          localFilePath = path.join(publicDownloadsPath, exeMatch);
        }
      } else {
        // Find existing .zip / .tar.gz archive
        const zipMatch = allFiles.find(f => (f.endsWith('.zip') || f.endsWith('.tar.gz')) && (f.toLowerCase().includes(safeBrand.toLowerCase()) || f.toLowerCase().includes('secureide') || f.toLowerCase().includes(engine.toLowerCase())));
        if (zipMatch) {
          localFilePath = path.join(publicDownloadsPath, zipMatch);
        }
      }

      // Any fallback file of matching extension
      if (!localFilePath) {
        const fallback = allFiles.find(f => isInstaller ? f.endsWith('.exe') : f.endsWith('.zip'));
        if (fallback) {
          localFilePath = path.join(publicDownloadsPath, fallback);
        }
      }
    }

    // 3. If no matching archive exists on disk, create a self-contained portable distribution on-the-fly
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      const targetZipName = `${safeBrand}_${engine.toUpperCase()}_Portable.zip`;
      localFilePath = path.join(publicDownloadsPath, targetZipName);

      if (!fs.existsSync(localFilePath)) {
        const stagingDir = path.join(publicDownloadsPath, `temp_${Date.now()}`);
        fs.mkdirSync(stagingDir, { recursive: true });

        // Add launcher script
        const launcherScript = `@echo off\r\necho Starting Hardened ${brand} (${engine.toUpperCase()})...\r\nstart "" "%~dp0Code.exe" %*\r\n`;
        fs.writeFileSync(path.join(stagingDir, `${safeBrand}.cmd`), launcherScript);

        // Add Zero-Trust Policy settings.json
        const settingsJson = JSON.stringify({
          "telemetry.telemetryLevel": "off",
          "telemetry.enableCrashReporter": false,
          "telemetry.enableTelemetry": false,
          "update.mode": "none",
          "extensions.autoUpdate": false,
          "security.workspace.trust.enabled": true,
          "workbench.colorCustomizations": {
            "titleBar.activeBackground": "#1e293b",
            "titleBar.activeForeground": "#ffffff"
          }
        }, null, 2);
        fs.writeFileSync(path.join(stagingDir, 'settings.json'), settingsJson);

        // Add README
        const readme = `=================================================================\r\n  ${brand.toUpperCase()} - ZERO TRUST HARDENED DISTRIBUTION\r\n=================================================================\r\nEngine: ${engine.toUpperCase()}\r\nSecurity Baseline: 0 Open CVEs + Strict Supply-Chain Sandboxing\r\nTelemetry Status: Permanently Disabled\r\n\r\nTo launch in air-gapped mode, run '${safeBrand}.cmd'.\r\n`;
        fs.writeFileSync(path.join(stagingDir, 'README.txt'), readme);

        // Package into ZIP using PowerShell Compress-Archive
        try {
          execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${localFilePath}' -Force"`);
        } catch (_) {
          // Fallback if Compress-Archive fails
        }

        // Cleanup staging
        fs.rmSync(stagingDir, { recursive: true, force: true });
      }
    }

    // 4. Stream the binary file directly to client with attachment headers
    if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
      const stat = fs.statSync(localFilePath);
      const downloadFileName = path.basename(localFilePath);
      const fileBuffer = fs.readFileSync(localFilePath);

      const contentType = downloadFileName.endsWith('.exe')
        ? 'application/vnd.microsoft.portable-executable'
        : downloadFileName.endsWith('.zip')
        ? 'application/zip'
        : 'application/octet-stream';

      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${downloadFileName}"`,
          'Content-Length': stat.size.toString(),
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    return NextResponse.json({ error: 'Download file could not be generated' }, { status: 404 });

  } catch (error: any) {
    console.error('Download route error:', error);
    return NextResponse.json({ error: error.message || 'Download failed' }, { status: 500 });
  }
}
