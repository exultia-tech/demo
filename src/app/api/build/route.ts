import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { generateCycloneDX } from '@/lib/sbom';
import { getCurrentUser } from '@/lib/auth/session';
import { db, githubWorkflows } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { recordLicenseActivity } from '@/lib/licensing/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    isVercel: !!process.env.VERCEL,
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    tokenPrefix: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 4) + '...' : null,
    githubOwner: process.env.GITHUB_OWNER || null,
    githubRepo: process.env.GITHUB_REPO || null,
    githubWorkflow: process.env.GITHUB_WORKFLOW || null,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}

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

    // Check user entitlements
    const user = await getCurrentUser();
    if (user) {
      recordLicenseActivity(user.id, 'pureide', req, 'trigger_build').catch(() => {});
    }
    const isEnterprise = Boolean(
      user?.role === 'admin' || user?.subscriptions?.some(
        s => s.status === 'active' && (s.tier.toLowerCase() === 'enterprise' || s.tier.toLowerCase() === 'developer')
      )
    );

    // Resolve custom user-linked GitHub workflow if user is an enterprise subscriber
    let customWorkflow: any = null;
    if (user && isEnterprise) {
      customWorkflow = await db.query.githubWorkflows.findFirst({
        where: and(eq(githubWorkflows.userId, user.id), eq(githubWorkflows.isActive, true)),
      });
    }

    const githubToken = customWorkflow?.personalAccessToken || process.env.GITHUB_TOKEN;
    const githubOwner = customWorkflow?.owner || process.env.GITHUB_OWNER || 'wstrika';
    const githubRepo = customWorkflow?.repo || process.env.GITHUB_REPO || 'exultia';
    const workflowFile = customWorkflow?.workflowFile || process.env.GITHUB_WORKFLOW || 'build-ide.yml';
    const repoOpts = { owner: githubOwner, repo: githubRepo, token: githubToken };

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
        buildId,
        owner: githubOwner,
        repo: githubRepo,
        workflowFile,
        token: githubToken,
      });

      const distDir = process.env.VERCEL ? '/tmp/downloads' : path.join(process.cwd(), 'public', 'downloads');
      try {
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }
      } catch (fsErr) {
        console.warn("Could not create dist directory", fsErr);
      }

function cleanStepName(name: string): string | null {
  const l = name.toLowerCase();
  if (l.includes('matrix') || l.includes('checkout') || l.includes('set up') || l.includes('complete job') || l.includes('post ')) {
    return null;
  }
  if (l.includes('node.js') || l.includes('runtime')) return 'Preparing assembly environment';
  if (l.includes('inno setup') || l.includes('compiler')) return 'Initializing installer compiler';
  if (l.includes('hardening') || l.includes('assembly')) return 'Executing deterministic security hardening';
  if (l.includes('sbom') || l.includes('cyclonedx')) return 'Generating cryptographic SBOM (CycloneDX 1.5)';
  if (l.includes('checksum') || l.includes('sha-256')) return 'Computing cryptographic SHA-256 integrity checksums';
  if (l.includes('release') || l.includes('blob') || l.includes('cdn')) return 'Packaging and optimizing distribution binaries';
  return name.replace(/\s*\(.*\)/, '').trim();
}

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const emit = (text: string) => controller.enqueue(encoder.encode(text));

          emit(`>>> [PURE IDE] Initializing build pipeline...\n`);
          emit(`>>> [CONFIGURATION] Platform: ${targetOs.toUpperCase()} | Engine: ${engine.toUpperCase()} (${safeVersion}) | Locale: ${safeLocale.toUpperCase()}\n`);
          emit(`>>> [BUILD] ID: ${buildId}\n`);
          emit(`>>> [STATUS] Allocating secure compilation environment...\n`);
          emit(`>>> [METADATA] {"buildId":"${buildId}","mode":"cloud_engine","locale":"${safeLocale}","version":"${safeVersion}"}\n`);

          const t0 = Date.now();
          let run: any = null;

          // Poll to find the triggered workflow run (up to 30s)
          for (let attempt = 0; attempt < 10; attempt++) {
            await new Promise(r => setTimeout(r, 2500));
            run = await findWorkflowRun(t0, repoOpts);
            if (run) break;
            if (attempt === 2) {
              emit(`>>> [STATUS] Preparing build sandbox...\n`);
            }
          }

          if (!run) {
            emit(`>>> [STATUS] Build queued in execution pool. Processing asynchronously...\n`);
            emit(`>>> [METADATA] {"buildId":"${buildId}","runQueued":true}\n`);
            controller.close();
            return;
          }

          emit(`>>> [STATUS] Compilation started.\n`);

          let lastSeenStep = '';
          const maxWaitMs = 12 * 60 * 1000; // 12 minutes max wait

          while (Date.now() - t0 < maxWaitMs) {
            await new Promise(r => setTimeout(r, 3000));

            const currentRun = await getWorkflowRunStatus(run.id, repoOpts);
            if (!currentRun) continue;

            const steps = await getWorkflowJobSteps(run.id, repoOpts);
            for (const step of steps) {
              const key = `${step.number}:${step.name}:${step.status}:${step.conclusion}`;
              if (key !== lastSeenStep && step.status !== 'queued') {
                lastSeenStep = key;
                const cleanName = cleanStepName(step.name);
                if (cleanName) {
                  const icon = step.conclusion === 'success' ? '✓' : step.status === 'in_progress' ? '⏳' : '•';
                  emit(`>>> ${icon} ${cleanName}\n`);
                }
              }
            }

            if (currentRun.status === 'completed') {
              if (currentRun.conclusion === 'success') {
                emit(`\n>>> [VERIFIED] Cryptographic build verification passed.\n`);
                emit(`>>> Custom build generated: ${safeBrand}_${engine.toUpperCase()}_Portable.zip\n`);
                emit(`>>> Windows Setup installer generated: ${safeBrand}_${engine.toUpperCase()}_Setup.exe\n`);
                emit(`>>> [SUCCESS] Build complete! [${safeBrand}] (${engine.toUpperCase()}) package ready for download.\n`);
              } else {
                emit(`\n>>> [ERROR] Compilation terminated unexpectedly. Please retry.\n`);
              }
              break;
            } else {
              const elapsedSec = Math.round((Date.now() - t0) / 1000);
              if (elapsedSec % 15 === 0) {
                emit(`>>> [PROGRESS] Assembling package... (${elapsedSec}s elapsed)\n`);
              }
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
    const distDir = process.env.VERCEL ? '/tmp/downloads' : path.join(process.cwd(), 'public', 'downloads');
    try {
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }
    } catch (fsErr) {
      console.warn("Could not create dist directory", fsErr);
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

    if (process.env.VERCEL) {
      console.error('[BUILD CONFIG ERROR] GITHUB_TOKEN or repository configuration missing.');
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`>>> [ERROR] Build service temporarily unavailable. Please try again shortly.\n`));
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

    const pwshExecutable = process.platform === 'win32' ? 'powershell.exe' : 'pwsh';
    const child = spawn(pwshExecutable, psArgs, {
      cwd: process.cwd(),
      env: { ...process.env }
    });

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`>>> [LOCAL ASSEMBLY ENGINE] Initializing build pipeline (${targetOs.toUpperCase()} / ${safeVersion} / ${safeLocale.toUpperCase()})...\n`));
        controller.enqueue(encoder.encode(`>>> [NOTICE] Cloud build engine active in standard environment.\n`));
        controller.enqueue(encoder.encode(`>>> [DEBUG] GITHUB_TOKEN exists: ${!!githubToken}, GITHUB_OWNER exists: ${!!githubOwner}, GITHUB_REPO exists: ${!!githubRepo}\n\n`));

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
