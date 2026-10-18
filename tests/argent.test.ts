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
  it('loads authoritative public distro feed catalog across 25+ distributions', () => {
    expect(ARGENT_PUBLIC_FEED_SOURCES.length).toBeGreaterThanOrEqual(25);
    const distros = ARGENT_PUBLIC_FEED_SOURCES.map(s => s.os);
    expect(distros).toContain('ubuntu');
    expect(distros).toContain('debian');
    expect(distros).toContain('rocky');
    expect(distros).toContain('rhel');
    expect(distros).toContain('almalinux');
    expect(distros).toContain('oracle-linux');
    expect(distros).toContain('suse');
    expect(distros).toContain('alpine');
    expect(distros).toContain('arch');
    expect(distros).toContain('fedora');
    expect(distros).toContain('amazon-linux');
    expect(distros).toContain('kernel');
    expect(distros).toContain('gentoo');
    expect(distros).toContain('freebsd');
    expect(distros).toContain('openbsd');
    expect(distros).toContain('netbsd');
    expect(distros).toContain('wolfi');
    expect(distros).toContain('nixos');
    expect(distros).toContain('void');
    expect(distros).toContain('photon');
    expect(distros).toContain('flatcar');
    expect(distros).toContain('talos');
    expect(distros).toContain('openwrt');
    expect(distros).toContain('openeuler');
    expect(distros).toContain('cloudlinux');
    expect(distros).toContain('kali');
    expect(distros).toContain('azure-linux');
  });

  it('aggregates pure regular vendor updates across bug fixes, enhancements, and maintenance point releases', () => {
    expect(ARGENT_PATCH_BUNDLES.length).toBeGreaterThanOrEqual(30);

    // Strictly NO weakness enumeration noise
    expect(ARGENT_PATCH_BUNDLES.every(b => b.cveList.length === 0)).toBe(true);
    expect(ARGENT_PATCH_BUNDLES.every(b => ['BUGFIX', 'ENHANCEMENT', 'MAINTENANCE', 'GENERAL'].includes(b.advisoryType))).toBe(true);

    // Bug Fix Advisory (RLBA)
    const rockyBugfix = ARGENT_PATCH_BUNDLES.find(b => b.bundleId === 'RLBA-2024:3910');
    expect(rockyBugfix).toBeDefined();
    expect(rockyBugfix?.advisoryType).toBe('BUGFIX');
    expect(rockyBugfix?.title).toContain('NVMe');

    // glibc optimization bugfix (RHBA)
    const rhelGlibc = ARGENT_PATCH_BUNDLES.find(b => b.bundleId === 'RHBA-2024:4120');
    expect(rhelGlibc).toBeDefined();
    expect(rhelGlibc?.advisoryType).toBe('BUGFIX');
    expect(rhelGlibc?.packages[0].name).toBe('glibc');

    // FreeBSD Errata Notice (FreeBSD-EN)
    const freebsdEN = ARGENT_PATCH_BUNDLES.find(b => b.bundleId === 'FreeBSD-EN-24:08.zfs');
    expect(freebsdEN).toBeDefined();
    expect(freebsdEN?.advisoryType).toBe('BUGFIX');
    expect(freebsdEN?.operationalDomain).toBe('STORAGE');

    // Enhancement Advisory
    const amazonEnhancement = ARGENT_PATCH_BUNDLES.find(b => b.bundleId === 'ALAS-BA-2024-0231');
    expect(amazonEnhancement).toBeDefined();
    expect(amazonEnhancement?.advisoryType).toBe('ENHANCEMENT');

    // Maintenance Point Release
    const flatcarMaintenance = ARGENT_PATCH_BUNDLES.find(b => b.bundleId === 'FLATCAR-UPD-2024-3815');
    expect(flatcarMaintenance).toBeDefined();
    expect(flatcarMaintenance?.advisoryType).toBe('MAINTENANCE');
  });

  it('filters vendor patch bundles by operating system correctly', () => {
    const ubuntuOnly = getArgentBundles({ os: 'ubuntu' });
    expect(ubuntuOnly.bundles.length).toBeGreaterThan(0);
    expect(ubuntuOnly.bundles.every(b => b.os === 'ubuntu')).toBe(true);

    const rockyOnly = getArgentBundles({ os: 'rocky' });
    expect(rockyOnly.bundles.length).toBeGreaterThan(0);
    expect(rockyOnly.bundles.every(b => b.os === 'rocky' || b.os === 'rhel')).toBe(true);
  });

  it('filters by advisory stream type (bugfix vs enhancement vs maintenance vs general)', () => {
    const bugfixOnly = getArgentBundles({ type: 'bugfix' });
    expect(bugfixOnly.bundles.length).toBeGreaterThan(0);
    expect(bugfixOnly.bundles.every(b => b.advisoryType === 'BUGFIX')).toBe(true);

    const enhancementOnly = getArgentBundles({ type: 'enhancement' });
    expect(enhancementOnly.bundles.length).toBeGreaterThan(0);
    expect(enhancementOnly.bundles.every(b => b.advisoryType === 'ENHANCEMENT')).toBe(true);

    const maintenanceOnly = getArgentBundles({ type: 'maintenance' });
    expect(maintenanceOnly.bundles.length).toBeGreaterThan(0);
    expect(maintenanceOnly.bundles.every(b => b.advisoryType === 'MAINTENANCE')).toBe(true);

    const generalOnly = getArgentBundles({ type: 'general' });
    expect(generalOnly.bundles.length).toBeGreaterThan(0);
    expect(generalOnly.bundles.every(b => b.advisoryType === 'GENERAL')).toBe(true);
  });

  it('filters by vendor severity and query keywords', () => {
    const importantOnly = getArgentBundles({ severity: 'important' });
    expect(importantOnly.bundles.every(b => b.vendorSeverity === 'IMPORTANT')).toBe(true);

    const searchKernel = getArgentBundles({ query: 'kernel' });
    expect(searchKernel.bundles.length).toBeGreaterThanOrEqual(2);
    expect(searchKernel.bundles.some(b => b.os === 'rocky')).toBe(true);
    expect(searchKernel.bundles.some(b => b.os === 'kernel')).toBe(true);
  });

  it('generates executable bash orchestrator script', () => {
    const bundles = ARGENT_PATCH_BUNDLES.slice(0, 3);
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

  it('API route GET /api/argent/feed?type=bugfix returns bugfix stream', async () => {
    const req = new Request('http://localhost:3000/api/argent/feed?type=bugfix');
    const res = await getFeed(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.total).toBeGreaterThan(0);
    expect(json.bundles.every((b: any) => b.advisoryType === 'BUGFIX')).toBe(true);
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

  it('API route GET /api/argent/stats returns macro metrics including advisory streams', async () => {
    const res = await getStats();
    expect(res.status).toBe(200);

    const stats = await res.json();
    expect(stats.totalBundles).toBeGreaterThanOrEqual(30);
    expect(stats.activeFeedSourcesCount).toBeGreaterThanOrEqual(25);
    expect(stats.bugfixCount).toBeGreaterThan(0);
    expect(stats.enhancementCount).toBeGreaterThan(0);
    expect(stats.maintenanceCount).toBeGreaterThan(0);
    expect(stats.generalCount).toBeGreaterThan(0);
    expect(stats.byOs.ubuntu).toBeGreaterThan(0);
    expect(stats.byOs.rocky).toBeGreaterThan(0);
    expect(stats.byOs.freebsd).toBeGreaterThan(0);
  });

  it('API route GET /api/argent/sources returns public distro feeds directory', async () => {
    const res = await getSources();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.totalSources).toBeGreaterThanOrEqual(25);
    expect(body.sources[0].officialFeedUrl).toBeDefined();
  });
});
