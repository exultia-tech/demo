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
      telemetryUrl = ''
    } = body;

    const buildId = `build-${Date.now()}`;
    const safeBrand = (brandName || 'SecureIDE Studio').replace(/[^a-zA-Z0-9\-_ ]/g, '').trim();
    const safeLocale = (locale || 'en').replace(/[^a-zA-Z0-9\-_]/g, '').toLowerCase().trim();
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;
    const workflowFile = process.env.GITHUB_WORKFLOW || 'build-ide.yml';

    // -----------------------------------------------------------------------
    // MODE A: MULTI-OS CLOUD ENGINE DISPATCH (If credentials configured)
    // -----------------------------------------------------------------------
    if (githubToken && githubOwner && githubRepo) {
      const dispatchUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/actions/workflows/${workflowFile}/dispatches`;

      const response = await fetch(dispatchUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${githubToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            tier: tier.toUpperCase(),
            target_os: targetOs.toLowerCase(),
            engine: engine.toLowerCase(),
            brand_name: safeBrand,
            locale: safeLocale,
            registry_url: registryUrl,
            extensions: extensions,
            telemetry_url: telemetryUrl,
            build_id: buildId
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloud engine dispatch failed (${response.status}): ${errorText}`);
      }

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`>>> [SECURE IDE] Dispatching build to Multi-OS Cloud Engine...\n`));
          controller.enqueue(encoder.encode(`>>> [CLOUD] Architecture Target: ${targetOs.toUpperCase()} | Engine: ${engine} | Locale: ${safeLocale.toUpperCase()}\n`));
          controller.enqueue(encoder.encode(`>>> [CLOUD] Build ID: ${buildId}\n`));
          controller.enqueue(encoder.encode(`>>> [STATUS] Isolated cloud sandbox provisioned and executing...\n`));
          controller.enqueue(encoder.encode(`>>> [METADATA] {"buildId":"${buildId}","mode":"cloud_engine","locale":"${safeLocale}"}\n`));
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
        controller.enqueue(encoder.encode(`>>> [LOCAL ASSEMBLY ENGINE] Initializing build pipeline (${targetOs.toUpperCase()} / ${safeLocale.toUpperCase()})...\n`));
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
                distDir,
                brandName: safeBrand,
                tier: tier.toUpperCase(),
                engine,
                targetOs,
                outputPath: sbomOut
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
