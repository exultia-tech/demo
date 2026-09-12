import { NextResponse } from 'next/server';
import { getAggregatedUviAdvisories } from '@/lib/feed-aggregator';
import { generateVirtualCisoBriefing, answerVirtualCisoQuestion } from '@/lib/virtual-ciso-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id')?.trim();

  if (!id) {
    return NextResponse.json({ error: 'Missing required advisory id parameter.' }, { status: 400 });
  }

  const all = await getAggregatedUviAdvisories();
  const found = all.find(a => 
    a.uviId.toLowerCase() === id.toLowerCase() || 
    (a.legacyUviId && a.legacyUviId.toLowerCase() === id.toLowerCase()) ||
    a.cveList.some(c => c.toLowerCase() === id.toLowerCase())
  );

  if (!found) {
    return NextResponse.json({ error: `Advisory with id "${id}" not found.` }, { status: 404 });
  }

  const briefing = generateVirtualCisoBriefing(found);
  return NextResponse.json({
    advisoryId: found.uviId,
    title: found.title,
    severity: found.severity,
    cvssScore: found.cvssScore,
    briefing
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, advisory, question } = body;

    let targetAdvisory = advisory;
    if (!targetAdvisory && id) {
      const all = await getAggregatedUviAdvisories();
      targetAdvisory = all.find(a => 
        a.uviId.toLowerCase() === id.toLowerCase() || 
        (a.legacyUviId && a.legacyUviId.toLowerCase() === id.toLowerCase()) ||
        a.cveList.some(c => c.toLowerCase() === id.toLowerCase())
      );
    }

    if (!targetAdvisory) {
      return NextResponse.json({ error: 'Advisory not provided or found.' }, { status: 400 });
    }

    const briefing = generateVirtualCisoBriefing(targetAdvisory);

    let answer: string | undefined = undefined;
    if (question && typeof question === 'string') {
      answer = answerVirtualCisoQuestion(targetAdvisory, question);
    }

    return NextResponse.json({
      advisoryId: targetAdvisory.uviId,
      briefing,
      answer
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
