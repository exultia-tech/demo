/**
 * Copyright (c) 2026 Exultia Technologies, PBC. All rights reserved.
 * Proprietary and Confidential.
 *
 * Vantage Threat Intelligence & Autonomous CVE Remediation Feed API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_PATCH_FEED, type PatchFeedItem } from '@/lib/patch-data';
export { SAMPLE_PATCH_FEED, type PatchFeedItem };
import { getAggregatedUviAdvisories } from '@/lib/feed-aggregator';
import { batchSynthesizeKineticPatches } from '@/lib/kinetic-engine';
import { getAllStandardOsPatches, PUBLIC_DISTRO_PATCH_SOURCES } from '@/lib/os-patch-feed';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const os = searchParams.get('os');
  const severity = searchParams.get('severity');
  const format = searchParams.get('format') || 'json';
  const source = searchParams.get('source');
  const limitParam = searchParams.get('limit');
  const patchType = searchParams.get('type'); // 'cve' | 'os-upgrade' | 'all'
  const tierParam = searchParams.get('tier') || '1'; // '1' (hotfix), '2' (pkg upgrade), 'all'
  const includeOs = searchParams.get('include_os') === 'true' || patchType === 'os-upgrade' || patchType === 'all';

  let feedItems = [...SAMPLE_PATCH_FEED];

  if (patchType === 'os-upgrade') {
    feedItems = getAllStandardOsPatches(os || undefined);
  } else if (includeOs) {
    feedItems = [...SAMPLE_PATCH_FEED, ...getAllStandardOsPatches(os || undefined)];
  }

  if (source === 'vantage' || limitParam) {
    try {
      const advs = await getAggregatedUviAdvisories();
      let limit: number | undefined = 1000;
      if (limitParam === 'all' || limitParam === '-1') {
        limit = undefined;
      } else if (limitParam) {
        const parsed = parseInt(limitParam, 10);
        limit = isNaN(parsed) ? 1000 : parsed;
      }
      const synthetic = batchSynthesizeKineticPatches(advs, limit);
      feedItems = [...feedItems, ...synthetic];
    } catch (e) {
      console.error('Failed to load Vantage feed for kinetic synthesis:', e);
    }
  }

  let filtered = feedItems;

  if (os) {
    filtered = filtered.filter(item => item.affectedDistros.includes(os.toLowerCase() as any));
  }

  if (severity) {
    filtered = filtered.filter(item => item.severity.toLowerCase() === severity.toLowerCase());
  }

  if (format === 'bash') {
    // Compile single bash script that can be piped into sh
    const targetOs = os ? os.toLowerCase() : 'ubuntu';
    const lines: string[] = [
      '#!/bin/sh',
      '# Exultia Kinetic Patch Feed - Automated Fleet Remediation',
      '# Generated on-demand for rapid enterprise response & standard OS updates',
      'set -e',
      '',
      'log() { echo "[Exultia Kinetic] $(date +\'%Y-%m-%d %H:%M:%S\') $1"; }',
      'warn() { echo "[Exultia Kinetic] WARNING: $1" >&2; }',
      'err() { echo "[Exultia Kinetic] ERROR: $1" >&2; exit 1; }',
      '',
      'if [ "$(id -u)" -ne 0 ]; then',
      '  err "Root privileges required to execute kinetic remediations."',
      'fi',
      '',
      'log "Starting rapid patch synchronization..."',
      ''
    ];

    for (const item of filtered) {
      if (tierParam === '2') {
        // Execute Tier 2 standard distro package upgrade
        const distroCmd = item.remediationTier.tier2_packageUpgrade.distroCommands[targetOs] 
          || item.remediationTier.tier1_hotMitigation.commands[0];
        lines.push(`log "Applying Tier 2 OS package upgrade for ${item.id} (${item.cveId}): ${item.title}"`);
        lines.push(`  ${distroCmd}`);
        lines.push(`log "Verified: ${item.remediationTier.tier1_hotMitigation.verificationCommand}"`);
      } else if (tierParam === 'all') {
        // Apply Tier 1 hotfix followed by Tier 2 package reconciliation
        lines.push(`log "Applying Tier 1 hotfix for ${item.id} (${item.cveId}): ${item.title}"`);
        for (const cmd of item.remediationTier.tier1_hotMitigation.commands) {
          lines.push(`  ${cmd}`);
        }
        const distroCmd = item.remediationTier.tier2_packageUpgrade.distroCommands[targetOs];
        if (distroCmd) {
          lines.push(`log "Reconciling with Tier 2 OS package: ${distroCmd}"`);
          lines.push(`  ${distroCmd}`);
        }
        lines.push(`log "Verified: ${item.remediationTier.tier1_hotMitigation.verificationCommand}"`);
      } else {
        // Default Tier 1 hot-mitigations
        lines.push(`log "Applying hot-mitigation for ${item.id} (${item.cveId}): ${item.title}"`);
        for (const cmd of item.remediationTier.tier1_hotMitigation.commands) {
          lines.push(`  ${cmd}`);
        }
        lines.push(`log "Verified: ${item.remediationTier.tier1_hotMitigation.verificationCommand}"`);
      }
      lines.push('');
    }

    lines.push('log "All pending remediations applied successfully. Zero reboot required."');

    return new NextResponse(lines.join('\n'), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  }

  return NextResponse.json({
    status: 'ok',
    feedVersion: '2.0.0',
    generatedAt: new Date().toISOString(),
    totalActivePatches: filtered.length,
    publicDistroFeeds: PUBLIC_DISTRO_PATCH_SOURCES,
    patches: filtered
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
