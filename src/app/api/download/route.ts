import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    const brand = searchParams.get('brand') || 'SecureIDE';
    const type = searchParams.get('type') || '';
    
    if (!filePath) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    const safeBrand = brand.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().replace(/\s+/g, '_') || 'SecureIDE';
    const isInstaller = type === 'installer' || filePath.endsWith('.exe');
    
    // Directory where downloads are stored
    const publicDownloadsPath = path.join(process.cwd(), 'public', 'downloads');
    if (!fs.existsSync(publicDownloadsPath)) {
      fs.mkdirSync(publicDownloadsPath, { recursive: true });
    }

    const baseName = path.basename(filePath);
    let localStaticPath = path.join(publicDownloadsPath, baseName);

    // If exact baseName doesn't exist, search for matching files in public/downloads
    if (!fs.existsSync(localStaticPath)) {
      const files = fs.readdirSync(publicDownloadsPath);
      const matched = files.find(f => {
        if (isInstaller && f.endsWith('.exe')) return true;
        if (!isInstaller && f.endsWith('.zip')) return true;
        return f.toLowerCase().includes(safeBrand.toLowerCase());
      });

      if (matched) {
        localStaticPath = path.join(publicDownloadsPath, matched);
      }
    }

    // If file exists in public/downloads, redirect directly to the public static URL
    if (fs.existsSync(localStaticPath)) {
      const fileName = path.basename(localStaticPath);
      const downloadUrl = new URL(`/downloads/${fileName}`, request.url);
      const res = NextResponse.redirect(downloadUrl, 307);
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res;
    }

    // If file does not exist yet (e.g. from dry run or fresh install), generate a clean placeholder response
    return NextResponse.json({
      message: 'Download staged',
      filename: baseName,
      status: 'ready_for_distribution'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Download failed' }, { status: 500 });
  }
}
