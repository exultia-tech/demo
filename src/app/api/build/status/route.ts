import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  findWorkflowRun,
  getWorkflowRunStatus,
  getWorkflowJobSteps,
  downloadAndExtractArtifact,
  WorkflowRunInfo
} from '@/lib/github-actions';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const buildId = searchParams.get('buildId') || '';
    const runIdParam = searchParams.get('runId') || '';

    const publicDownloadsPath = path.join(process.cwd(), 'public', 'downloads');

    // 1. Check if artifacts for this buildId already exist locally
    if (buildId) {
      const allFiles = fs.existsSync(publicDownloadsPath) ? fs.readdirSync(publicDownloadsPath) : [];
      const localZip = allFiles.find(f => f.endsWith('.zip') && f.includes(buildId));
      const localExe = allFiles.find(f => f.endsWith('.exe') && f.includes(buildId));

      if (localZip) {
        return NextResponse.json({
          status: 'completed',
          conclusion: 'success',
          artifactReady: true,
          zipFile: localZip,
          exeFile: localExe || null,
          steps: [{ name: 'Build and Package Artifacts', status: 'completed', conclusion: 'success', number: 1 }]
        });
      }
    }

    // 2. Query GitHub Actions run status
    let run: WorkflowRunInfo | null = null;
    if (runIdParam) {
      run = await getWorkflowRunStatus(parseInt(runIdParam, 10));
    } else {
      run = await findWorkflowRun();
    }

    if (!run) {
      return NextResponse.json({
        status: 'queued',
        conclusion: null,
        artifactReady: false,
        steps: []
      });
    }

    const steps = await getWorkflowJobSteps(run.id);

    // 3. If run succeeded, ensure artifact is downloaded & extracted
    let zipFile: string | undefined;
    let exeFile: string | undefined;
    let artifactReady = false;

    if (run.conclusion === 'success') {
      try {
        const result = await downloadAndExtractArtifact(run.id, publicDownloadsPath, buildId);
        zipFile = result.zipFile ? path.basename(result.zipFile) : undefined;
        exeFile = result.exeFile ? path.basename(result.exeFile) : undefined;
        artifactReady = !!(zipFile || exeFile);
      } catch (err: any) {
        console.error('Artifact extraction error in status endpoint:', err);
      }
    }

    return NextResponse.json({
      runId: run.id,
      status: run.status,
      conclusion: run.conclusion,
      artifactReady,
      zipFile: zipFile || null,
      exeFile: exeFile || null,
      steps
    });

  } catch (error: any) {
    console.error('Build status API error:', error);
    return NextResponse.json({ error: error.message || 'Status check failed' }, { status: 500 });
  }
}
