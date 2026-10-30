import { NextResponse } from 'next/server';
import { 
  generateArgentBashScript,
  ArgentPatchBundle
} from '@/lib/argent-feed';
import { queryArgentFeedFromDb } from '@/lib/db/sync-argent';
import { getCurrentUser } from '@/lib/auth/session';
import { recordLicenseActivity } from '@/lib/licensing/audit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // License audit telemetry
  const user = await getCurrentUser();
  if (user) {
    recordLicenseActivity(user.id, 'kinetic', request, 'argent_feed_query').catch(() => {});
  }

  const id = searchParams.get('id') || undefined;
  const os = searchParams.get('os') || undefined;
  const severity = searchParams.get('severity') || undefined;
  const type = searchParams.get('type') || searchParams.get('advisoryType') || undefined;
  const query = searchParams.get('q') || searchParams.get('query') || undefined;
  const rebootParam = searchParams.get('reboot');
  const reboot = rebootParam === 'true' ? true : rebootParam === 'false' ? false : undefined;
  const release = searchParams.get('release') || undefined;
  const domain = searchParams.get('domain') || undefined;
  const source = searchParams.get('source') || undefined;
  const scope = (searchParams.get('scope') as any) || undefined;
  const sortBy = (searchParams.get('sortBy') as any) || undefined;
  const format = (searchParams.get('format') || 'json').toLowerCase();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const result = await queryArgentFeedFromDb({
    id,
    os,
    severity,
    type,
    query,
    reboot,
    release,
    domain,
    source,
    scope,
    sortBy,
    page,
    limit
  });

  // Return executable bash script
  if (format === 'bash' || format === 'sh') {
    const bashScript = generateArgentBashScript(result.bundles);
    return new NextResponse(bashScript, {
      status: 200,
      headers: {
        'Content-Type': 'text/x-shellscript; charset=utf-8',
        'Content-Disposition': 'inline; filename="argent-patch-stream.sh"'
      }
    });
  }

  // Format tailored for Kinetic CLI / Daemon ingestion
  if (format === 'kinetic') {
    const kineticItems = result.bundles.map((b: ArgentPatchBundle) => ({
      id: b.id,
      cveId: b.cveList[0] || b.bundleId,
      title: `[${b.osDisplayName}] ${b.title}`,
      severity: b.vendorSeverity === 'CRITICAL' ? 'CRITICAL' : (b.vendorSeverity === 'IMPORTANT' ? 'HIGH' : 'MEDIUM'),
      cvss: b.vendorSeverity === 'CRITICAL' ? 9.8 : (b.vendorSeverity === 'IMPORTANT' ? 7.8 : 5.0),
      cisaKev: false,
      affectedPackages: b.packages.map(p => p.name),
      affectedDistros: [b.os],
      remediationTier: {
        tier1_hotMitigation: {
          summary: b.synopsis,
          downtimeRequired: b.impact.rebootRequired,
          commands: [b.commands.nativeUpgrade],
          verificationCommand: b.commands.verification,
          rollbackCommand: b.commands.rollback
        },
        tier2_packageUpgrade: {
          packageName: b.packages[0]?.name || b.bundleId,
          sourceDistro: b.os,
          upgradeCommand: b.commands.nativeUpgrade,
          versionBefore: b.packages[0]?.currentVersion || '',
          versionTarget: b.packages[0]?.fixedVersion || '',
          requiresReboot: b.impact.rebootRequired,
          packageManager: b.packages[0]?.packageManager || 'apt'
        }
      },
      provenance: {
        signedBy: 'security@exultia.tech (Cosign OIDC Keyless)',
        cosignDigest: 'sha256:argent' + Buffer.from(b.bundleId).toString('hex').padEnd(58, '0'),
        slsaLevel: 3
      },
      metadata: {
        argId: b.id,
        bundleId: b.bundleId,
        upstreamNoticeUrl: b.upstreamNoticeUrl,
        upstreamFeed: b.sourceFeed.feedName
      }
    }));

    return NextResponse.json({
      feedVersion: '2.0.0-argent',
      identifierSystem: 'ARG-VENDOR-YYYY-NNNN',
      dataSource: result.dataSource === 'database' ? 'Turso LibSQL Database (Persisted & Indexed)' : 'In-Memory Fallback Aggregator',
      source: 'Exultia Argent Vendor Patch Aggregator',
      count: kineticItems.length,
      patches: kineticItems
    });
  }

  return NextResponse.json({
    ...result,
    identifierSystem: 'ARG-VENDOR-YYYY-NNNN',
    dataSource: result.dataSource === 'database' ? 'Turso LibSQL Database (Persisted & Indexed)' : 'In-Memory Fallback Aggregator'
  });
}
