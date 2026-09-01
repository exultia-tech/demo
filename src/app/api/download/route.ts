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

    const safeBrand = brand.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().replace(/\s+/g, '_') || 'SecureIDE';
    const isInstaller = type === 'installer' || requestedPath.endsWith('.exe');

    const publicDownloadsPath = path.join(process.cwd(), 'public', 'downloads');
    if (!fs.existsSync(publicDownloadsPath)) {
      fs.mkdirSync(publicDownloadsPath, { recursive: true });
    }

    let localFilePath = '';

    // 1. Check if the exact requested release artifact exists on disk
    if (requestedPath) {
      const baseName = path.basename(requestedPath);
      if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
        localFilePath = requestedPath;
      } else if (baseName && fs.existsSync(path.join(publicDownloadsPath, baseName))) {
        localFilePath = path.join(publicDownloadsPath, baseName);
      } else if (baseName && fs.existsSync(path.join(publicDownloadsPath, 'builds', baseName))) {
        localFilePath = path.join(publicDownloadsPath, 'builds', baseName);
      }
    }

    // 2. If not pre-compiled, assemble customized distribution on-the-fly
    if (!localFilePath || !fs.existsSync(localFilePath) || fs.statSync(localFilePath).size < 100000) {
      if (extensions) {
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
    }

    // 3. Scan public/downloads for real compiled distributions (> 10MB)
    if (!localFilePath || !fs.existsSync(localFilePath) || fs.statSync(localFilePath).size < 100000) {
      const allFiles = fs.readdirSync(publicDownloadsPath).filter(f => !f.startsWith('.'));
      
      if (isInstaller) {
        const exeMatch = allFiles.find(f => f.endsWith('.exe') && fs.statSync(path.join(publicDownloadsPath, f)).size > 1000000);
        if (exeMatch) localFilePath = path.join(publicDownloadsPath, exeMatch);
      } else {
        const zipMatch = allFiles.find(f => (f.endsWith('.zip') || f.endsWith('.tar.gz')) && !f.includes('github-enterprise') && fs.statSync(path.join(publicDownloadsPath, f)).size > 10000000);
        if (zipMatch) localFilePath = path.join(publicDownloadsPath, zipMatch);
      }

      if (!localFilePath) {
        const fallback = allFiles.find(f => (f.endsWith('.zip') || f.endsWith('.exe')) && fs.statSync(path.join(publicDownloadsPath, f)).size > 10000000);
        if (fallback) localFilePath = path.join(publicDownloadsPath, fallback);
      }
    }

    // 4. If still not found, assemble default base with dynamic bundler
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      localFilePath = await assembleCustomDistribution({
        brandName: brand,
        engine,
        tier,
        extensions: 'dbaeumer.vscode-eslint,esbenp.prettier-vscode,redhat.vscode-yaml,tamasfe.even-better-toml',
        targetOs: 'windows'
      });
    }

    // 5. Stream the binary file directly to client with attachment headers
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

    return NextResponse.json({ error: 'Release artifact could not be assembled.' }, { status: 404 });

  } catch (error: any) {
    console.error('Download route error:', error);
    return NextResponse.json({ error: error.message || 'Download failed' }, { status: 500 });
  }
}
