import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      const isHtml = request.headers.get('accept')?.includes('text/html');
      if (isHtml) {
        return NextResponse.redirect(new URL('/login?error=auth_required&redirect=/app/pureide', request.url));
      }
      return NextResponse.json({ error: 'Authentication required to download builds. Please sign in.' }, { status: 401 });
    }

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
    const debug = searchParams.get('debug') === '1' || searchParams.get('debug') === 'true';

    // 4. In cloud production environments, check Vercel Blob for the compiled artifact
    let blobListError: string | null = null;
    let foundBlobs: any[] = [];
    let matches: any[] = [];

    try {
      const { list } = require('@vercel/blob');
      // Fetch up to 100 recent blobs to do a resilient, case-insensitive match
      const baseNameWithoutExt = safeFileName.replace(/\.(exe|zip|tar\.gz|dmg)$/i, '').toLowerCase();
      const res = await list({ limit: 100 });
      foundBlobs = res?.blobs || [];
      
      if (foundBlobs.length > 0) {
        // Tier 1: Match the base name (ignoring Vercel Blob's random hash suffix)
        matches = foundBlobs.filter((b: any) => {
          const blobName = path.basename(b.pathname).replace(/\.(exe|zip|tar\.gz|dmg)$/i, '').toLowerCase();
          return blobName.startsWith(baseNameWithoutExt) || baseNameWithoutExt.startsWith(blobName);
        });

        // Tier 2: Match by brand and engine keywords
        if (matches.length === 0) {
          const engineKey = (searchParams.get('engine') || '').toLowerCase();
          const brandKey = safeFileName.split('_')[0]?.toLowerCase() || '';
          matches = foundBlobs.filter((b: any) => {
            const blobName = path.basename(b.pathname).toLowerCase();
            return (brandKey && blobName.includes(brandKey)) || (engineKey && blobName.includes(engineKey));
          });
        }

        // Tier 3: If still no match but recent builds exist within last 2 hours, use newest artifact
        if (matches.length === 0) {
          const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
          const recentBlobs = foundBlobs.filter((b: any) => new Date(b.uploadedAt).getTime() > twoHoursAgo);
          if (recentBlobs.length > 0) {
            matches = recentBlobs;
          }
        }

        if (matches.length > 0) {
          matches.sort((a: any, b: any) => {
            // Prioritize matching the requested file type (.exe vs .zip)
            if (isInstaller) {
              const aExe = a.pathname.endsWith('.exe') ? 1 : 0;
              const bExe = b.pathname.endsWith('.exe') ? 1 : 0;
              if (aExe !== bExe) return bExe - aExe;
            }
            return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
          });

          if (!debug) {
            return NextResponse.redirect(matches[0].url);
          }
        }
      }
    } catch (blobErr: any) {
      blobListError = blobErr?.message || String(blobErr);
      console.warn("Vercel Blob check failed or unconfigured:", blobErr);
    }

    if (debug) {
      return NextResponse.json({
        safeFileName,
        baseNameWithoutExt: safeFileName.replace(/\.(exe|zip|tar\.gz|dmg)$/i, '').toLowerCase(),
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        blobListError,
        totalBlobsInStore: foundBlobs.length,
        blobs: foundBlobs.map((b: any) => ({ pathname: b.pathname, url: b.url, uploadedAt: b.uploadedAt })),
        matches: matches.map((b: any) => ({ pathname: b.pathname, url: b.url, uploadedAt: b.uploadedAt })),
        localFilePath,
        fallbackTarget: 'https://github.com/wstrika/secure-ide/releases/latest'
      });
    }

    // 5. If not found in local OR blob, redirect to official GitHub release fallback
    const githubReleaseFallback = 'https://github.com/wstrika/secure-ide/releases/latest';
    return NextResponse.redirect(githubReleaseFallback);

  } catch (error: any) {
    console.error('Download route error:', error);
    return NextResponse.json({ error: error.message || 'Download failed' }, { status: 500 });
  }
}
