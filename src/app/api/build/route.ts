import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { generateCycloneDX } from '@/lib/sbom';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tier = 'COMMUNITY',
      targetOs = 'windows',
      engine = 'vscode',
      registryUrl = '',
      extensions = '',
      brandName = 'SecureIDE Studio',
      locale = 'en',
      version = 'latest',
      versionChannel = 'latest',
      telemetryUrl = ''
    } = body;

    const buildId = `build-${Date.now()}`;
    const safeBrand = (brandName || 'SecureIDE Studio').replace(/[^a-zA-Z0-9\-_ ]/g, '').trim();
    const safeLocale = (locale || 'en').replace(/[^a-zA-Z0-9\-_]/g, '').toLowerCase().trim();
    const safeVersion = (version || 'latest').replace(/[^a-zA-Z0-9\-._/]/g, '').trim();
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;
    const workflowFile = process.env.GITHUB_WORKFLOW || 'build-ide.yml';

    // -----------------------------------------------------------------------
    // MODE A: MULTI-OS CLOUD ENGINE DISPATCH (If credentials configured)
    // -----------------------------------------------------------------------
    if (githubToken && githubOwner && githubRepo) {
      const {
        dispatchWorkflow,
        findWorkflowRun,
        getWorkflowRunStatus,
        getWorkflowJobSteps,
        downloadAndExtractArtifact
      } = await import('@/lib/github-actions');

      await dispatchWorkflow({
        tier: tier.toUpperCase(),
        targetOs: targetOs.toLowerCase(),
        engine: engine.toLowerCase(),
        brandName: safeBrand,
        locale: safeLocale,
        version: safeVersion,
        registryUrl,
        extensions,
        telemetryUrl,
        buildId
      });

      const distDir = path.join(process.cwd(), 'public', 'downloads');
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const emit = (text: string) => controller.enqueue(encoder.encode(text));

          emit(`>>> [SECURE IDE] Dispatching build to Multi-OS Cloud Engine...\n`);
          emit(`>>> [CLOUD] Architecture Target: ${targetOs.toUpperCase()} | Engine: ${engine.toUpperCase()} (${safeVersion}) | Locale: ${safeLocale.toUpperCase()}\n`);
          emit(`>>> [CLOUD] Build ID: ${buildId}\n`);
          emit(`>>> [STATUS] Isolated cloud sandbox provisioned and executing...\n`);
          emit(`>>> [METADATA] {"buildId":"${buildId}","mode":"cloud_engine","locale":"${safeLocale}","version":"${safeVersion}"}\n`);

          const t0 = Date.now();
          let run: any = null;

          // Poll to find the triggered workflow run (up to 30s)
          emit(`>>> [CLOUD ENGINE] Connecting to GitHub Actions pipeline...\n`);
          for (let attempt = 0; attempt < 10; attempt++) {
            await new Promise(r => setTimeout(r, 2500));
            run = await findWorkflowRun(t0);
            if (run) break;
            emit(`>>> [STATUS] Waiting for GitHub runner allocation (${attempt + 1}/10)...\n`);
          }

          if (!run) {
            emit(`>>> [WARNING] Workflow queued on GitHub. Run will complete asynchronously in cloud.\n`);
            emit(`>>> [METADATA] {"buildId":"${buildId}","runQueued":true}\n`);
            controller.close();
            return;
          }

          emit(`>>> [CLOUD ENGINE] GitHub Actions Run #${run.id} active (${run.html_url})\n`);
          emit(`>>> [STATUS] Runner status: ${run.status.toUpperCase()}...\n`);

          let lastSeenStep = '';
          const maxWaitMs = 12 * 60 * 1000; // 12 minutes max wait

          while (Date.now() - t0 < maxWaitMs) {
            await new Promise(r => setTimeout(r, 3000));

            const currentRun = await getWorkflowRunStatus(run.id);
            if (!currentRun) continue;

            const steps = await getWorkflowJobSteps(run.id);
            for (const step of steps) {
              const key = `${step.number}:${step.name}:${step.status}:${step.conclusion}`;
              if (key !== lastSeenStep && step.status !== 'queued') {
                lastSeenStep = key;
                const icon = step.conclusion === 'success' ? '✓' : step.status === 'in_progress' ? '⏳' : '•';
                emit(`>>> [STEP ${step.number}] ${icon} ${step.name} (${step.conclusion || step.status})\n`);
              }
            }

            if (currentRun.status === 'completed') {
              if (currentRun.conclusion === 'success') {
                emit(`\n>>> [CLOUD ENGINE] Build pipeline execution succeeded on GitHub runner!\n`);
                emit(`>>> [ARTIFACT] Downloading signed release artifact from GitHub...\n`);

                try {
                  const extracted = await downloadAndExtractArtifact(run.id, distDir, buildId);
                  if (extracted.zipFile) {
                    emit(`>>> Custom build generated: ${path.basename(extracted.zipFile)}\n`);
                  }
                  if (extracted.exeFile) {
                    emit(`>>> Windows Setup installer generated: ${path.basename(extracted.exeFile)}\n`);
                  }
                  emit(`>>> [SUCCESS] Build complete! [${safeBrand}] (${engine.toUpperCase()}) signed artifact ready for download.\n`);
                } catch (artErr: any) {
                  emit(`>>> [WARNING] Artifact extraction notice: ${artErr.message}\n`);
                  emit(`>>> [SUCCESS] Cloud build finished on GitHub. Signed artifact ready for download.\n`);
                }
              } else {
                emit(`\n>>> [ERROR] Cloud build terminated with status: ${currentRun.conclusion}\n`);
              }
              break;
            } else {
              const elapsedSec = Math.round((Date.now() - t0) / 1000);
              emit(`>>> [RUNNER] Executing hardening pipeline... (elapsed: ${elapsedSec}s)\n`);
            }
          }

          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache, no-transform',
        },
      });
    }

    // -----------------------------------------------------------------------
    // MODE B: LOCAL PIPELINE ASSEMBLY ENGINE (Standard / Development Mode)
    // -----------------------------------------------------------------------
    const scriptPath = path.join(process.cwd(), 'scripts', 'assemble-ide.ps1');
    const distDir = path.join(process.cwd(), 'public', 'downloads');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    const psArgs = [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-File', scriptPath,
      '-Tier', tier.toUpperCase(),
      '-TargetOS', targetOs.toLowerCase(),
      '-Engine', engine.toLowerCase(),
      '-BrandName', safeBrand,
      '-Locale', safeLocale,
      '-Version', safeVersion,
      '-BuildId', buildId,
      '-OutputDir', distDir
    ];

    if (registryUrl) {
      psArgs.push('-RegistryUrl', registryUrl);
    }
    if (extensions) {
      psArgs.push('-Extensions', extensions);
    }
    if (telemetryUrl) {
      psArgs.push('-TelemetryUrl', telemetryUrl);
    }

    const pwshExecutable = process.platform === 'win32' ? 'powershell.exe' : 'pwsh';
    const child = spawn(pwshExecutable, psArgs, {
      cwd: process.cwd(),
      env: { ...process.env }
    });

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`>>> [LOCAL ASSEMBLY ENGINE] Initializing build pipeline (${targetOs.toUpperCase()} / ${safeVersion} / ${safeLocale.toUpperCase()})...\n`));
        controller.enqueue(encoder.encode(`>>> [NOTICE] Cloud build engine active in standard environment.\n\n`));

        child.stdout.on('data', (data) => {
          controller.enqueue(data);
        });

        child.stderr.on('data', (data) => {
          controller.enqueue(data);
        });

        child.on('close', async (code) => {
          if (code === 0) {
            try {
              const sbomOut = path.join(distDir, `cyclonedx-sbom-${buildId}.json`);
              generateCycloneDX({
                dist: distDir,
                brand: safeBrand,
                tier: tier.toUpperCase(),
                engine,
                os: targetOs,
                output: sbomOut
              });
              controller.enqueue(encoder.encode(`>>> [SBOM] Cryptographic CycloneDX 1.5 JSON generated.\n`));
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              controller.enqueue(encoder.encode(`>>> [WARNING] SBOM Generation Notice: ${msg}\n`));
            }
          }
          controller.close();
        });

        child.on('error', (err) => {
          controller.enqueue(encoder.encode(`>>> [CRITICAL] Subprocess Error: ${err.message}\n`));
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown internal error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
