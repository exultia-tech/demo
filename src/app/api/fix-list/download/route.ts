import { NextRequest, NextResponse } from 'next/server';
import { scriptStore } from '@/lib/fix-list-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  const script = scriptStore.get(id);

  if (!script) {
    return new NextResponse('Script not found or already executed.', { status: 404 });
  }

  // Delete from memory to ensure one-time transmission
  scriptStore.delete(id);

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store'
    }
  });
}
