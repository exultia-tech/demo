import { NextRequest, NextResponse } from 'next/server';
import { AiSupportEngine, type SupportChatMessage } from '@/lib/ai-support-engine';

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch (parseErr) {
    return NextResponse.json(
      { error: 'Invalid JSON request body.' },
      { status: 400 }
    );
  }

  try {
    const message = body?.message;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Inquiry message string is required.' },
        { status: 400 }
      );
    }

    const history: SupportChatMessage[] = Array.isArray(body?.history) ? body.history : [];
    const productContext: string | undefined = typeof body?.productContext === 'string' ? body.productContext : undefined;

    const result = AiSupportEngine.processQuery(message, history, productContext);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('AI Support Agent error:', error);
    return NextResponse.json(
      { error: 'Internal support agent processing error.' },
      { status: 500 }
    );
  }
}
