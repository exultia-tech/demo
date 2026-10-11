import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buildId = searchParams.get('buildId') || '';
    const requestedPath = searchParams.get('path') || '';
    const type = searchParams.get('type') || '';

    // Strictly sanitize file name to avoid directory traversal and dynamic root tracing
    const rawFileName = path.basename(requestedPath || '');
    const safeFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, '');

    const isInstaller = type === 'installer' || safeFileName.endsWith('.exe') || requestedPath.endsWith('.exe');

    // Statically anchor to public/downloads directory
    const publicDownloadsDir = path.join(process.cwd(), 'public', 'downloads');
    const buildsDir = path.join(process.cwd(), 'public', 'downloads', 'builds');

    let localFilePath = '';

    // 1. If specific file requested, look strictly inside public/downloads or public/downloads/builds
    if (safeFileName) {
      const candidate1 = path.join(publicDownloadsDir, safeFileName);
      const candidate2 = path.join(buildsDir, safeFileName);

      if (fs.existsSync(candidate1)) {
        localFilePath = candidate1;
      } else if (fs.existsSync(candidate2)) {
        localFilePath = candidate2;
      }
    }

    // 2. If buildId provided, match against downloaded builds in publicDownloadsDir
    if (!localFilePath && buildId && fs.existsSync(publicDownloadsDir)) {
      const allFiles = fs.readdirSync(publicDownloadsDir).filter(f => !f.startsWith('.'));
      if (isInstaller) {
        const exeMatch = allFiles.find(f => f.endsWith('.exe') && f.includes(buildId));
        if (exeMatch) localFilePath = path.join(publicDownloadsDir, exeMatch);
      }
      if (!localFilePath) {
        const zipMatch = allFiles.find(f => f.endsWith('.zip') && f.includes(buildId));
        if (zipMatch) localFilePath = path.join(publicDownloadsDir, zipMatch);
      }
    }

    // 3. Stream file if found locally
    if (localFilePath && fs.existsSync(localFilePath)) {
      const stat = fs.statSync(localFilePath);
      if (stat.isFile() && stat.size > 1000) {
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
    }

    // 4. In cloud production environments, redirect to official GitHub release
    const githubReleaseFallback = 'https://github.com/wstrika/secure-ide/releases/latest';
    return NextResponse.redirect(githubReleaseFallback);

  } catch (error: any) {
    console.error('Download route error:', error);
    return NextResponse.json({ error: error.message || 'Download failed' }, { status: 500 });
  }
}
