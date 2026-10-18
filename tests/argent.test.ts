import { describe, it, expect } from 'vitest';
import { GET as getFeed } from '@/app/api/argent/feed/route';
import { GET as getStats } from '@/app/api/argent/stats/route';
import { GET as getSources } from '@/app/api/argent/sources/route';
import { 
  getArgentBundles, 
  getArgentStats, 
  ARGENT_PUBLIC_FEED_SOURCES, 
  ARGENT_PATCH_BUNDLES,
  generateArgentBashScript 
} from '@/lib/argent-feed';

describe('Argent Public OS Distribution Patch Feed Aggregator', () => {
  it('loads authoritative public distro feed catalog', () => {
    expect(ARGENT_PUBLIC_FEED_SOURCES.length).toBeGreaterThanOrEqual(8);
    const distros = ARGENT_PUBLIC_FEED_SOURCES.map(s => s.os);
    expect(distros).toContain('ubuntu');
    expect(distros).toContain('debian');
    expect(distros).toContain('rocky');
    expect(distros).toContain('rhel');
    expect(distros).toContain('alpine');
    expect(distros).toContain('suse');
    expect(distros).toContain('arch');
  });

  it('aggregates curated vendor patch bundles across major Linux distributions', () => {
    expect(ARGENT_PATCH_BUNDLES.length).toBeGreaterThanOrEqual(8);
    const rockyBundle = ARGENT_PATCH_BUNDLES.find(b => b.bundleId === 'RLSA-2024:4312');
    expect(rockyBundle).toBeDefined();
    expect(rockyBundle?.packages[0].name).toBe('openssh');
    expect(rockyBundle?.commands.nativeUpgrade).toContain('dnf upgrade');

    const ubuntuBundle = ARGENT_PATCH_BUNDLES.find(b => b.bundleId === 'USN-6856-1');
    expect(ubuntuBundle).toBeDefined();
    expect(ubuntuBundle?.commands.nativeUpgrade).toContain('apt-get install');
  });

  it('filters vendor patch bundles by operating system correctly', () => {
    const ubuntuOnly = getArgentBundles({ os: 'ubuntu' });
    expect(ubuntuOnly.bundles.length).toBeGreaterThan(0);
    expect(ubuntuOnly.bundles.every(b => b.os === 'ubuntu')).toBe(true);

    const rockyOnly = getArgentBundles({ os: 'rocky' });
    expect(rockyOnly.bundles.length).toBeGreaterThan(0);
    expect(rockyOnly.bundles.every(b => b.os === 'rocky' || b.os === 'rhel')).toBe(true);
  });

  it('filters by vendor severity and query keywords', () => {
    const criticalOnly = getArgentBundles({ severity: 'critical' });
    expect(criticalOnly.bundles.every(b => b.vendorSeverity === 'CRITICAL')).toBe(true);

    const searchSsh = getArgentBundles({ query: 'openssh' });
    expect(searchSsh.bundles.length).toBeGreaterThanOrEqual(4);
    expect(searchSsh.bundles.some(b => b.os === 'ubuntu')).toBe(true);
    expect(searchSsh.bundles.some(b => b.os === 'rocky')).toBe(true);
  });

  it('generates executable bash orchestrator script', () => {
    const bundles = ARGENT_PATCH_BUNDLES.slice(0, 2);
    const script = generateArgentBashScript(bundles);
    expect(script).toContain('#!/bin/bash');
    expect(script).toContain('OS_DETECT');
    expect(script).toContain(bundles[0].commands.nativeUpgrade);
  });

  it('API route GET /api/argent/feed returns structured JSON', async () => {
    const req = new Request('http://localhost:3000/api/argent/feed?os=rocky');
    const res = await getFeed(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.total).toBeGreaterThan(0);
    expect(json.bundles[0].os).toBe('rocky');
  });

  it('API route GET /api/argent/feed?format=bash returns shellscript payload', async () => {
    const req = new Request('http://localhost:3000/api/argent/feed?os=ubuntu&format=bash');
    const res = await getFeed(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/x-shellscript');

    const text = await res.text();
    expect(text).toContain('#!/bin/bash');
    expect(text).toContain('apt-get');
  });

  it('API route GET /api/argent/feed?format=kinetic returns kinetic-compatible feed', async () => {
    const req = new Request('http://localhost:3000/api/argent/feed?format=kinetic');
    const res = await getFeed(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.feedVersion).toBe('2.0.0-argent');
    expect(json.patches.length).toBeGreaterThan(0);
    expect(json.patches[0].remediationTier.tier2_packageUpgrade).toBeDefined();
  });

  it('API route GET /api/argent/stats returns macro metrics', async () => {
    const res = await getStats();
    expect(res.status).toBe(200);

    const stats = await res.json();
    expect(stats.totalBundles).toBeGreaterThan(0);
    expect(stats.activeFeedSourcesCount).toBeGreaterThanOrEqual(8);
    expect(stats.byOs.ubuntu).toBeGreaterThan(0);
    expect(stats.byOs.rocky).toBeGreaterThan(0);
  });

  it('API route GET /api/argent/sources returns public distro feeds directory', async () => {
    const res = await getSources();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.totalSources).toBeGreaterThanOrEqual(8);
    expect(body.sources[0].officialFeedUrl).toBeDefined();
  });
});
