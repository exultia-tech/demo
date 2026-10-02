import { NextResponse } from 'next/server';
import { MOCK_EXAM_DB } from '@/lib/axiom-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countStr = searchParams.get('count');
  let count = MOCK_EXAM_DB.length;
  if (countStr && !isNaN(Number(countStr))) {
    count = Number(countStr);
  }

  // Shuffle and slice on the server
  const shuffled = [...MOCK_EXAM_DB];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const result = shuffled.slice(0, Math.min(Math.max(1, count), MOCK_EXAM_DB.length));

  return NextResponse.json(result);
}
