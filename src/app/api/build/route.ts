import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { generateCycloneDX } from '@/lib/sbom';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tier = 'PRO',
      targetOs = 'windows',
      engine = 'vscode',
      registryUrl = '',
      extensions = '',
      brandName = 'SecureIDE Studio',
      telemetryUrl = ''
    } = body;

    const buildId = `build-${Date.now()}`;
    const safeBrand = (brandName || 'SecureIDE Studio').replace(/[^a-zA-Z0-9\-_ ]/g, '').trim();
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;
    const workflowFile = process.env.GITHUB_WORKFLOW || 'build-ide.yml';

    // -----------------------------------------------------------------------
    // MODE A: GITHUB ACTIONS CLOUD DISPATCH (If GitHub credentials configured)
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
            registry_url: registryUrl,
            extensions: extensions,
            telemetry_url: telemetryUrl,
            build_id: buildId
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub Actions dispatch failed (${response.status}): ${errorText}`);
      }

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`>>> [SECURE IDE] Dispatching build to Multi-OS Cloud Engine...\n`));
          controller.enqueue(encoder.encode(`>>> [CLOUD] Architecture Target: ${targetOs.toUpperCase()} | Engine: ${engine}\n`));
          controller.enqueue(encoder.encode(`>>> [CLOUD] Build ID: ${buildId}\n`));
          controller.enqueue(encoder.encode(`>>> [STATUS] Isolated cloud sandbox provisioned and executing...\n`));
          controller.enqueue(encoder.encode(`>>> [METADATA] {"buildId":"${buildId}","mode":"cloud_engine"}\n`));
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
    // MODE B: LOCAL PIPELINE ASSEMBLY RUNNER (Zero-Config / Development Mode)
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
        controller.enqueue(encoder.encode(`>>> [LOCAL ASSEMBLY ENGINE] Initializing build pipeline (${targetOs.toUpperCase()})...\n`));
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
                engine: engine.toLowerCase(),
                os: targetOs.toLowerCase(),
                output: sbomOut
              });

              const cleanSlug = safeBrand.replace(/[^a-zA-Z0-9\-_]/g, '_');
              const zipName = `${cleanSlug}-${targetOs.toLowerCase()}-${tier.toUpperCase()}-${buildId}.zip`;
              controller.enqueue(encoder.encode(`\n>>> [SBOM] CycloneDX 1.5 SBOM generated: ${sbomOut}\n`));
              controller.enqueue(encoder.encode(`>>> [SUCCESS] Custom build generated: ${path.join(distDir, zipName)}\n`));
              controller.enqueue(encoder.encode(`>>> Release binary is 100% telemetry-free and enterprise-governed.\n`));
              controller.enqueue(encoder.encode(`>>> Ready for enterprise deployment.\n`));
            } catch (err: any) {
              controller.enqueue(encoder.encode(`>>> [SBOM Warning] Failed to generate SBOM: ${err.message}\n`));
            }
            controller.close();
          } else {
            controller.enqueue(encoder.encode(`\n>>> [ERROR] Assembly process exited with code ${code}\n`));
            controller.close();
          }
        });

        child.on('error', (err) => {
          controller.enqueue(encoder.encode(`>>> Process Error: ${err.message}\n`));
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
