import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get('runId');
    const buildId = searchParams.get('buildId');

    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubOwner || !githubRepo) {
      return NextResponse.json({
        mode: 'local',
        status: 'completed',
        message: 'Local assembly engine active.'
      });
    }

    if (runId) {
      const response = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/actions/runs/${runId}`, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${githubToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
        }
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch run details' }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({
        mode: 'github_actions',
        status: data.status, // queued, in_progress, completed
        conclusion: data.conclusion, // success, failure, neutral, cancelled, timed_out
        htmlUrl: data.html_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        runNumber: data.run_number
      });
    }

    // If querying by workflow runs list
    const runsResponse = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/actions/runs?per_page=5`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      }
    });

    if (!runsResponse.ok) {
      return NextResponse.json({ error: 'Failed to list workflow runs' }, { status: runsResponse.status });
    }

    const runsData = await runsResponse.json();
    return NextResponse.json({
      mode: 'github_actions',
      latestRuns: (runsData.workflow_runs || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        conclusion: r.conclusion,
        htmlUrl: r.html_url,
        createdAt: r.created_at
      }))
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
