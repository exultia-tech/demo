import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { assembleCustomDistribution } from '@/lib/dynamic-bundler';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get('path') || '';
    const brand = searchParams.get('brand') || 'SecureIDE Studio';
    const type = searchParams.get('type') || '';
    const engine = searchParams.get('engine') || 'vscode';
    const tier = searchParams.get('tier') || 'TEAM';
    const extensions = searchParams.get('extensions') || '';

    const isInstaller = type === 'installer' || requestedPath.endsWith('.exe');
    const publicDownloadsPath = path.join(process.cwd(), 'public', 'downloads');
    const buildsPath = path.join(publicDownloadsPath, 'builds');

    if (!fs.existsSync(publicDownloadsPath)) fs.mkdirSync(publicDownloadsPath, { recursive: true });
    if (!fs.existsSync(buildsPath)) fs.mkdirSync(buildsPath, { recursive: true });

    let localFilePath = '';

    // 1. Check exact requested release artifact path
    if (requestedPath) {
      const baseName = path.basename(requestedPath);
      const candidates = [
        requestedPath,
        path.join(process.cwd(), requestedPath),
        path.join(publicDownloadsPath, baseName),
        path.join(buildsPath, baseName)
      ];

      for (const candidate of candidates) {
        if (candidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile() && fs.statSync(candidate).size > 100000) {
          localFilePath = candidate;
          break;
        }
      }
    }

    // 2. Scan public/downloads for any freshly compiled distribution
    if (!localFilePath) {
      const allFiles = fs.readdirSync(publicDownloadsPath).filter(f => !f.startsWith('.'));
      
      if (isInstaller) {
        const exeMatch = allFiles.find(f => f.endsWith('.exe') && fs.statSync(path.join(publicDownloadsPath, f)).size > 1000000);
        if (exeMatch) localFilePath = path.join(publicDownloadsPath, exeMatch);
      }

      if (!localFilePath) {
        // Look for recent compiled zip
        const zipMatches = allFiles
          .filter(f => f.endsWith('.zip') && !f.includes('vscodium-base') && fs.statSync(path.join(publicDownloadsPath, f)).size > 10000000)
          .map(f => ({ name: f, time: fs.statSync(path.join(publicDownloadsPath, f)).mtimeMs }))
          .sort((a, b) => b.time - a.time);

        if (zipMatches.length > 0) {
          localFilePath = path.join(publicDownloadsPath, zipMatches[0].name);
        }
      }
    }

    // 3. If still not found, assemble customized distribution on-the-fly
    if (!localFilePath || !fs.existsSync(localFilePath) || fs.statSync(localFilePath).size < 100000) {
      try {
        localFilePath = await assembleCustomDistribution({
          brandName: brand,
          engine,
          tier,
          extensions,
          targetOs: 'windows'
        });
      } catch (err: any) {
        console.error('Dynamic bundler error:', err);
      }
    }

    // 4. Fallback: check builds folder
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      const buildFiles = fs.readdirSync(buildsPath).filter(f => f.endsWith('.zip') && fs.statSync(path.join(buildsPath, f)).size > 10000000);
      if (buildFiles.length > 0) {
        localFilePath = path.join(buildsPath, buildFiles[0]);
      }
    }

    // 5. Stream the binary file directly with proper attachment headers
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

    return NextResponse.json({ error: 'Release artifact not ready yet. Please wait for build completion.' }, { status: 404 });

  } catch (error: any) {
    console.error('Download route error:', error);
    return NextResponse.json({ error: error.message || 'Download failed' }, { status: 500 });
  }
}
