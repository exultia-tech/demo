import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const DEFAULT_GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const DEFAULT_GITHUB_OWNER = process.env.GITHUB_OWNER || 'wstrika';
const DEFAULT_GITHUB_REPO = process.env.GITHUB_REPO || 'secure-ide';
const DEFAULT_GITHUB_WORKFLOW = process.env.GITHUB_WORKFLOW || 'build-ide.yml';

export interface WorkflowDispatchParams {
  tier: string;
  targetOs: string;
  engine: string;
  brandName: string;
  locale: string;
  version: string;
  registryUrl?: string;
  extensions?: string;
  telemetryUrl?: string;
  buildId: string;
  owner?: string;
  repo?: string;
  workflowFile?: string;
  token?: string;
  ref?: string;
}

export interface WorkflowRunInfo {
  id: number;
  status: 'queued' | 'in_progress' | 'completed' | string;
  conclusion: 'success' | 'failure' | 'cancelled' | 'timed_out' | string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
}

export interface JobStepInfo {
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'skipped' | null;
  number: number;
}

export interface RepoContext {
  owner?: string;
  repo?: string;
  token?: string;
}

export function getHeaders(customToken?: string) {
  const token = customToken || DEFAULT_GITHUB_TOKEN;
  return {
    'Accept': 'application/vnd.github+json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'SecureIDE-Web-Orchestrator'
  };
}

/**
 * Dispatches a workflow_dispatch event to GitHub Actions (supports user linked repo or default repo).
 */
export async function dispatchWorkflow(params: WorkflowDispatchParams): Promise<void> {
  const owner = params.owner || DEFAULT_GITHUB_OWNER;
  const repo = params.repo || DEFAULT_GITHUB_REPO;
  const workflow = params.workflowFile || DEFAULT_GITHUB_WORKFLOW;
  const ref = params.ref || 'main';

  const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`;

  const res = await fetch(dispatchUrl, {
    method: 'POST',
    headers: {
      ...getHeaders(params.token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref,
      inputs: {
        tier: params.tier.toUpperCase(),
        target_os: params.targetOs.toLowerCase(),
        engine: params.engine.toLowerCase(),
        brand_name: params.brandName,
        locale: params.locale,
        version: params.version,
        registry_url: params.registryUrl || '',
        extensions: params.extensions || '',
        telemetry_url: params.telemetryUrl || '',
        build_id: params.buildId
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub workflow dispatch failed (${res.status}): ${errText}`);
  }
}

/**
 * Finds the workflow run that was triggered for the workflow by scanning recent runs.
 */
export async function findWorkflowRun(
  sinceMs: number = Date.now() - 60000,
  opts?: RepoContext
): Promise<WorkflowRunInfo | null> {
  const owner = opts?.owner || DEFAULT_GITHUB_OWNER;
  const repo = opts?.repo || DEFAULT_GITHUB_REPO;
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs?event=workflow_dispatch&per_page=5`;
  
  const res = await fetch(url, { headers: getHeaders(opts?.token) });
  if (!res.ok) return null;

  const data = await res.json();
  const runs: WorkflowRunInfo[] = data.workflow_runs || [];

  for (const run of runs) {
    const runCreated = new Date(run.created_at).getTime();
    if (runCreated >= sinceMs - 30000) {
      return run;
    }
  }

  return runs.length > 0 ? runs[0] : null;
}

/**
 * Gets the current status of a specific workflow run.
 */
export async function getWorkflowRunStatus(runId: number, opts?: RepoContext): Promise<WorkflowRunInfo | null> {
  const owner = opts?.owner || DEFAULT_GITHUB_OWNER;
  const repo = opts?.repo || DEFAULT_GITHUB_REPO;
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}`;
  const res = await fetch(url, { headers: getHeaders(opts?.token) });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Gets the active or completed job steps for a workflow run.
 */
export async function getWorkflowJobSteps(runId: number, opts?: RepoContext): Promise<JobStepInfo[]> {
  const owner = opts?.owner || DEFAULT_GITHUB_OWNER;
  const repo = opts?.repo || DEFAULT_GITHUB_REPO;
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs`;
  const res = await fetch(url, { headers: getHeaders(opts?.token) });
  if (!res.ok) return [];

  const data = await res.json();
  const jobs = data.jobs || [];
  if (jobs.length === 0) return [];

  const steps: JobStepInfo[] = [];
  for (const step of jobs[0].steps || []) {
    steps.push({
      name: step.name,
      status: step.status,
      conclusion: step.conclusion,
      number: step.number
    });
  }
  return steps;
}

/**
 * Downloads the artifact from GitHub Actions and extracts the inner distribution files to outputDir.
 */
export async function downloadAndExtractArtifact(
  runId: number,
  outputDir: string = path.join(process.cwd(), 'public', 'downloads'),
  buildIdHint?: string,
  opts?: RepoContext
): Promise<{ zipFile?: string; exeFile?: string; sbomFile?: string }> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const owner = opts?.owner || DEFAULT_GITHUB_OWNER;
  const repo = opts?.repo || DEFAULT_GITHUB_REPO;

  // 1. Get artifacts for this workflow run
  const artifactsUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`;
  const res = await fetch(artifactsUrl, { headers: getHeaders(opts?.token) });
  if (!res.ok) {
    throw new Error(`Failed to list artifacts for run ${runId} (${res.status})`);
  }

  const data = await res.json();
  const artifacts = data.artifacts || [];
  if (artifacts.length === 0) {
    throw new Error(`No artifacts found for workflow run ${runId}`);
  }

  // Find the artifact (match buildIdHint if provided, else use the first one)
  let targetArtifact = artifacts[0];
  if (buildIdHint) {
    const matched = artifacts.find((a: any) => a.name.includes(buildIdHint));
    if (matched) targetArtifact = matched;
  }

  const artifactId = targetArtifact.id;
  const tempZipPath = path.join(outputDir, `temp_artifact_${artifactId}_${Date.now()}.zip`);

  try {
    // 2. Download artifact archive stream
    const downloadUrl = `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifactId}/zip`;
    const dlRes = await fetch(downloadUrl, {
      headers: getHeaders(opts?.token)
    });

    if (!dlRes.ok) {
      throw new Error(`Failed to download artifact ${artifactId} (${dlRes.status})`);
    }

    const fileStream = fs.createWriteStream(tempZipPath);
    // @ts-ignore - Readable.fromWeb handles web streams in Node 18+
    await pipeline(Readable.fromWeb(dlRes.body as any), fileStream);

    // 3. Inspect artifact archive entries using tar
    const filesList = execSync(`tar -tf "${tempZipPath}"`, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 })
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    let extractedZip = '';
    let extractedExe = '';
    let extractedSbom = '';

    // Extract distribution .zip
    const zipEntry = filesList.find(f => f.endsWith('.zip') && !f.includes('temp_artifact'));
    if (zipEntry) {
      execSync(`tar -xf "${tempZipPath}" -C "${outputDir}" "${zipEntry}"`);
      extractedZip = path.join(outputDir, zipEntry);
    }

    // Extract installer .exe if present
    const exeEntry = filesList.find(f => f.endsWith('.exe'));
    if (exeEntry) {
      execSync(`tar -xf "${tempZipPath}" -C "${outputDir}" "${exeEntry}"`);
      extractedExe = path.join(outputDir, exeEntry);
    }

    // Extract cyclonedx-sbom.json if present
    const sbomEntry = filesList.find(f => f.endsWith('cyclonedx-sbom.json'));
    if (sbomEntry) {
      execSync(`tar -xf "${tempZipPath}" -C "${outputDir}" "${sbomEntry}"`);
      extractedSbom = path.join(outputDir, sbomEntry);
    }

    return {
      zipFile: extractedZip || undefined,
      exeFile: extractedExe || undefined,
      sbomFile: extractedSbom || undefined
    };

  } finally {
    // Clean up temporary artifact zip
    if (fs.existsSync(tempZipPath)) {
      try {
        fs.unlinkSync(tempZipPath);
      } catch {}
    }
  }
}

/**
 * Finds the latest successful workflow run and its extracted artifact.
 * Used by /api/download when no specific buildId is provided or artifact is missing.
 */
export async function getOrFetchLatestArtifact(
  outputDir: string = path.join(process.cwd(), 'public', 'downloads')
): Promise<{ zipFile?: string; exeFile?: string }> {
  const url = `https://api.github.com/repos/${DEFAULT_GITHUB_OWNER}/${DEFAULT_GITHUB_REPO}/actions/runs?event=workflow_dispatch&status=success&per_page=1`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) return {};

  const data = await res.json();
  const runs = data.workflow_runs || [];
  if (runs.length === 0) return {};

  const latestRun = runs[0];
  const runId = latestRun.id;

  // Check if we already have files extracted for this run's artifact
  const artifactsUrl = `https://api.github.com/repos/${DEFAULT_GITHUB_OWNER}/${DEFAULT_GITHUB_REPO}/actions/runs/${runId}/artifacts`;
  const artRes = await fetch(artifactsUrl, { headers: getHeaders() });
  if (!artRes.ok) return {};

  const artData = await artRes.json();
  const artifacts = artData.artifacts || [];
  if (artifacts.length === 0) return {};

  const artifactName = artifacts[0].name; // e.g. "SecureIDE Studio-windows-COMMUNITY-build-1788567746702"
  
  // Check if matching zip already in outputDir
  const existingFiles = fs.readdirSync(outputDir);
  const matchedZip = existingFiles.find(f => f.endsWith('.zip') && (f.includes(artifactName.replace(/\s+/g, '_')) || artifactName.includes(f.replace('.zip', ''))));
  const matchedExe = existingFiles.find(f => f.endsWith('.exe') && (f.includes(artifactName.replace(/\s+/g, '_')) || artifactName.includes(f.replace('.exe', ''))));

  if (matchedZip) {
    return {
      zipFile: path.join(outputDir, matchedZip),
      exeFile: matchedExe ? path.join(outputDir, matchedExe) : undefined
    };
  }

  // Otherwise download and extract it
  return await downloadAndExtractArtifact(runId, outputDir);
}
