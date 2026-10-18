import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') || searchParams.get('os') || '';
  const fileParam = searchParams.get('file') || '';
  const format = searchParams.get('format') || '';

  const downloadsDir = path.join(process.cwd(), 'public', 'downloads', 'kinetic');

  // JSON Manifest query
  if (format === 'json') {
    const sha256Path = path.join(downloadsDir, 'SHA256SUMS.txt');
    const checksums = fs.existsSync(sha256Path) ? fs.readFileSync(sha256Path, 'utf-8').replace(/\r/g, '').trim() : '';

    return NextResponse.json({
      name: 'Exultia Kinetic Standalone Compiled Binary',
      version: '2.4.0',
      description: 'Zero-agent autonomous patch daemon and sub-second deterministic rollback engine',
      platforms: {
        linux_amd64: {
          file: 'kinetic',
          url: '/api/kinetic/download?platform=linux',
          format: 'ELF / Python 3 Executable Zipapp',
          sha256: '177a2c46c6500b2204da8e209bc82a267ae762eeb9173cc7c7483d4f30ea3aa6'
        },
        windows_amd64: {
          file: 'kinetic.exe',
          url: '/api/kinetic/download?platform=windows',
          format: 'PE32+ Standalone Binary (PyInstaller Native)',
          sha256: 'a09b5b1cb8afecf6d44b1d720781793f51cc4b397bf399ed3766af546ad3c4da'
        },
        universal_zipapp: {
          file: 'kinetic.pyz',
          url: '/api/kinetic/download?file=kinetic.pyz',
          format: 'PEP 441 Multi-Arch Universal Archive',
          sha256: '177a2c46c6500b2204da8e209bc82a267ae762eeb9173cc7c7483d4f30ea3aa6'
        },
        legacy_script: {
          file: 'kinetic.sh',
          url: '/api/patches/feed?format=bash',
          format: 'POSIX Shell Script (.sh)'
        }
      },
      checksums: checksums.split('\n').filter(Boolean)
    });
  }

  // Determine target binary file
  let targetFile = 'kinetic'; // default Linux/POSIX
  if (platform.toLowerCase().includes('win') || fileParam.endsWith('.exe')) {
    targetFile = 'kinetic.exe';
  } else if (fileParam === 'kinetic.pyz' || platform.toLowerCase() === 'universal') {
    targetFile = 'kinetic.pyz';
  } else if (fileParam === 'kinetic' || platform.toLowerCase() === 'linux') {
    targetFile = 'kinetic';
  }

  const filePath = path.join(downloadsDir, targetFile);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: `Binary ${targetFile} not found on release node.` }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  const contentType = targetFile.endsWith('.exe')
    ? 'application/vnd.microsoft.portable-executable'
    : 'application/octet-stream';

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${targetFile}"`,
      'Content-Length': stat.size.toString(),
      'X-Kinetic-Version': '2.4.0',
      'X-Kinetic-Binary-Type': targetFile.endsWith('.exe') ? 'pyinstaller-pe32' : 'zipapp-standalone',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  });
}
