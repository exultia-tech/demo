import { NextRequest, NextResponse } from 'next/server';
import { scriptStore } from '@/lib/praxis-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  const scriptData = await scriptStore.get(id);

  if (!scriptData) {
    return new NextResponse('Script not found.', { status: 404 });
  }



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
