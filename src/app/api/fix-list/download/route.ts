import { NextRequest, NextResponse } from 'next/server';
import { scriptStore } from '@/lib/fix-list-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  const scriptData = scriptStore.get(id);

  if (!scriptData) {
    return new NextResponse('Script not found or already executed.', { status: 404 });
  }

  // Delete from memory to ensure one-time transmission
  scriptStore.delete(id);

  const headers: Record<string, string> = {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-store'
  };

  if (scriptData.filenamePattern) {
    // Basic sanitization of filename
    const safeFilename = scriptData.filenamePattern.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    headers['Content-Disposition'] = `attachment; filename="${safeFilename}"`;
  }

  return new NextResponse(scriptData.script, {
    headers
  });
}
