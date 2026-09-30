import { NextResponse } from 'next/server';
import { ctiResearchAgent, RawInformalResearchFinding } from '@/lib/informational-research-agent';

export const dynamic = 'force-dynamic';

export async function GET() {
  const telemetry = ctiResearchAgent.getTelemetry();
  const synthesized = ctiResearchAgent.getSynthesizedAdvisories();

  return NextResponse.json({
    status: 'success',
    telemetry,
    synthesizedCount: synthesized.length,
    recentSynthesized: synthesized.slice(0, 10)
  });
}

export async function POST(request: Request) {
  try {
    let customFinding: RawInformalResearchFinding | undefined = undefined;

    // Optional custom JSON body if someone passes informal content
    try {
      const body = await request.json();
      if (body && body.rawText && body.rawHeadline) {
        customFinding = {
          id: `EXT-DISP-${Date.now()}`,
          sourceName: body.sourceName || 'External Informal Finding',
          author: body.author || 'Anonymous CTI Contributor',
          sourceUrl: body.sourceUrl || 'https://infosec.exchange',
          rawHeadline: body.rawHeadline,
          rawText: body.rawText,
          publishedDate: body.publishedDate || new Date().toISOString().split('T')[0],
          confidenceScore: body.confidenceScore || 92,
          signalTags: body.signalTags || ['Informal Finding', 'Workstation Exposure']
        };
      }
    } catch {
      // Empty body is fine for autonomous trigger without user input
    }

    // Run the cycle autonomously without requiring user intervention
    const synthesisResult = ctiResearchAgent.runAutonomousCycle(customFinding);
    const updatedTelemetry = ctiResearchAgent.getTelemetry();

    return NextResponse.json({
      status: 'success',
      message: 'Autonomous CTI research agent synthesized informal finding into Vantage advisory.',
      result: synthesisResult,
      telemetry: updatedTelemetry
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error?.message || 'Failed to execute autonomous research cycle'
    }, { status: 500 });
  }
}
