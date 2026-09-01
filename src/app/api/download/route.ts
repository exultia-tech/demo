import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    // 2. Scan public/downloads for real compiled distributions (> 100KB)
    if (!localFilePath || !fs.existsSync(localFilePath) || fs.statSync(localFilePath).size < 100000) {
      const allFiles = fs.readdirSync(publicDownloadsPath).filter(f => !f.startsWith('.'));
      
      if (isInstaller) {
        // Find real .exe installer
        const exeMatch = allFiles.find(f => f.endsWith('.exe') && fs.statSync(path.join(publicDownloadsPath, f)).size > 1000000);
        if (exeMatch) {
          localFilePath = path.join(publicDownloadsPath, exeMatch);
        }
      } else {
        // Find real .zip distribution archive (> 10MB)
        const zipMatch = allFiles.find(f => (f.endsWith('.zip') || f.endsWith('.tar.gz')) && !f.includes('github-enterprise') && fs.statSync(path.join(publicDownloadsPath, f)).size > 10000000);
        if (zipMatch) {
          localFilePath = path.join(publicDownloadsPath, zipMatch);
        }
      }

      // Fallback to any real large archive
      if (!localFilePath) {
        const fallback = allFiles.find(f => (f.endsWith('.zip') || f.endsWith('.exe')) && fs.statSync(path.join(publicDownloadsPath, f)).size > 10000000);
        if (fallback) {
          localFilePath = path.join(publicDownloadsPath, fallback);
        }
      }
    }

    // 3. If no local binary exists, dynamically fetch the latest compiled cloud release artifact from GitHub Actions
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      const token = process.env.GITHUB_TOKEN;
      const owner = process.env.GITHUB_OWNER || 'wstrika';
      const repo = process.env.GITHUB_REPO || 'secure-ide';

      if (token) {
        try {
          const runsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?status=completed&conclusion=success&per_page=5`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github+json',
              'User-Agent': 'SecureIDE-Web'
            }
          });
          const runsData = await runsRes.json();
          const latestRun = runsData.workflow_runs?.[0];

          if (latestRun) {
            const artifactsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs/${latestRun.id}/artifacts`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'SecureIDE-Web'
              }
            });
            const artifactsData = await artifactsRes.json();
            const targetArtifact = artifactsData.artifacts?.[0];

            if (targetArtifact) {
              const downloadRes = await fetch(targetArtifact.archive_download_url, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/vnd.github+json',
                  'User-Agent': 'SecureIDE-Web'
                }
              });

              if (downloadRes.ok) {
                const arrayBuf = await downloadRes.arrayBuffer();
                const downloadedZipPath = path.join(publicDownloadsPath, `${targetArtifact.name}.zip`);
                fs.writeFileSync(downloadedZipPath, Buffer.from(arrayBuf));
                localFilePath = downloadedZipPath;
              }
            }
          }
        } catch (e) {
          console.error('GitHub Actions artifact fetch error:', e);
        }
      }
    }

    // 4. Stream the binary file directly to client with attachment headers
    if (localFilePath && fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
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

    return NextResponse.json({ error: 'Release artifact not ready yet. Please trigger a build or wait for GitHub Actions completion.' }, { status: 404 });

  } catch (error: any) {
    console.error('Download route error:', error);
    return NextResponse.json({ error: error.message || 'Download failed' }, { status: 500 });
  }
}
