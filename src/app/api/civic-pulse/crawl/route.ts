import { NextRequest, NextResponse } from 'next/server';
import { crawlMunicipalEndpoint } from '@/lib/civic-pulse/liveCrawler';
import { SearchQueryParams } from '@/lib/civic-pulse/agentEngine';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in or create a free account to execute live crawler agents.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const params: SearchQueryParams = {
      city: body.city || '',
      state: body.state || '',
      query: body.query || '',
      documentType: body.documentType || 'all',
      customPortalUrl: body.customPortalUrl || body.url || ''
    };

    if (!params.customPortalUrl) {
      return NextResponse.json(
        { error: 'No customPortalUrl provided in request.' },
        { status: 400 }
      );
    }

    const result = await crawlMunicipalEndpoint(params);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error in /api/civic-pulse/crawl:', err);
    return NextResponse.json(
      {
        success: false,
        city: 'Unknown',
        state: 'US',
        records: [],
        steps: [
          {
            step: 'Crawling Live Municipal Endpoint',
            status: 'warning',
            detail: `Server-side crawler failed: ${err.message || 'Internal error'}`
          }
        ],
        requiresHumanEscalation: true,
        escalationReason: `Encountered unexpected parsing error: ${err.message || 'Internal crawler exception'}. Dispatched to Exultia Civic Desk researcher.`
      },
      { status: 500 }
    );
  }
}
