// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { groupBlocklistAdvisories, standardizeUviAdvisories } from '@/lib/feed-aggregator';
import { UviAdvisoryRecord } from '@/lib/threat-feed-data';

function makeMockAdvisory(overrides: Partial<UviAdvisoryRecord>): UviAdvisoryRecord {
  return {
    uviId: 'UVI-MOCK-1',
    title: 'Mock Advisory',
    headline: 'Mock Headline',
    summary: 'Mock Summary',
    technicalDetails: 'Mock Details',
    globalImpact: 'Mock Impact',
    ideBuildImpact: {
      hasDirectBuildImpact: false,
      severityOnDeveloperEnv: 'LOW',
      workstationVector: 'None',
      buildPipelineRisk: 'None',
      recommendationForIdeBuilds: 'None'
    },
    severity: 'HIGH',
    cvssScore: 7.5,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L',
    cwe: 'CWE-307',
    domainCategory: 'Networking, Protocols & Cryptography',
    attackVector: 'NETWORK',
    attackComplexity: 'LOW',
    privilegesRequired: 'NONE',
    userInteraction: 'NONE',
    scope: 'UNCHANGED',
    cveList: [],
    affectedTargets: [
      { product: '192.0.2.1', ecosystem: 'Internet / Network', affectedVersions: 'Score: 5', fixedInVersion: 'Drop' }
    ],
    upstreamSignals: [
      {
        sourceId: 'cve_org',
        sourceName: 'CVE.org',
        badge: 'CVE Vulnerability',
        finding: 'Vulnerability disclosure',
        signalType: 'CVE_RECORD',
        confidence: 'CONFIRMED'
      }
    ],
    remediation: {
      recommendedAction: 'Drop traffic',
      patchDetails: 'Block IP',
      workarounds: ['Rate limit']
    },
    cisaKev: {
      isKnownExploited: false
    },
    publishedDate: '2026-10-29',
    lastUpdatedDate: '2026-10-29',
    ...overrides
  };
}

describe('Vantage Blocklist Daily Grouping Engine', () => {
  it('should consolidate multiple IP blocklist entries on the same day into one UVI identifier', () => {
    const raw: UviAdvisoryRecord[] = [
      makeMockAdvisory({
        uviId: 'UVI-IPSUM-192.0.2.1',
        title: 'IPsum Malicious Host: 192.0.2.1',
        publishedDate: '2026-10-29',
        affectedTargets: [{ product: '192.0.2.1', ecosystem: 'IPsum', affectedVersions: 'Score 5', fixedInVersion: 'Drop' }],
        upstreamSignals: [{ sourceId: 'ipsum', sourceName: 'IPsum', badge: 'IP Blocklist', finding: '192.0.2.1', signalType: 'IP_REPUTATION', confidence: 'CONFIRMED' }]
      }),
      makeMockAdvisory({
        uviId: 'UVI-IPSUM-192.0.2.2',
        title: 'IPsum Malicious Host: 192.0.2.2',
        publishedDate: '2026-10-29',
        affectedTargets: [{ product: '192.0.2.2', ecosystem: 'IPsum', affectedVersions: 'Score 7', fixedInVersion: 'Drop' }],
        upstreamSignals: [{ sourceId: 'ipsum', sourceName: 'IPsum', badge: 'IP Blocklist', finding: '192.0.2.2', signalType: 'IP_REPUTATION', confidence: 'CONFIRMED' }]
      }),
      makeMockAdvisory({
        uviId: 'UVI-BLK-198.51.100.1',
        title: 'Blocklist.de SSH Attacker: 198.51.100.1',
        publishedDate: '2026-10-29',
        affectedTargets: [{ product: '198.51.100.1', ecosystem: 'Blocklist.de', affectedVersions: 'Failures: 42', fixedInVersion: 'Drop' }],
        upstreamSignals: [{ sourceId: 'blocklist_de', sourceName: 'Blocklist.de', badge: 'SSH Brute-Force', finding: '198.51.100.1', signalType: 'IP_REPUTATION', confidence: 'CONFIRMED' }]
      }),
      makeMockAdvisory({
        uviId: 'UVI-ET-203.0.113.5',
        title: 'Emerging Threats Compromised Host: 203.0.113.5',
        publishedDate: '2026-10-29',
        affectedTargets: [{ product: '203.0.113.5', ecosystem: 'Emerging Threats', affectedVersions: 'Compromised C2', fixedInVersion: 'Drop' }],
        upstreamSignals: [{ sourceId: 'emerging_threats', sourceName: 'ET Open', badge: 'Compromised IP', finding: '203.0.113.5', signalType: 'IP_REPUTATION', confidence: 'CONFIRMED' }]
      })
    ];

    const grouped = groupBlocklistAdvisories(raw);
    expect(grouped.length).toBe(1);

    const digest = grouped[0];
    expect(digest.uviId).toBe('UVI-IP-BLOCKLIST-2026-10-29');
    expect(digest.title).toContain('Perimeter IP Blocklist');
    expect(digest.affectedTargets.length).toBe(4);
    expect(digest.affectedTargets.map(t => t.product)).toContain('192.0.2.1');
    expect(digest.affectedTargets.map(t => t.product)).toContain('192.0.2.2');
    expect(digest.affectedTargets.map(t => t.product)).toContain('198.51.100.1');
    expect(digest.affectedTargets.map(t => t.product)).toContain('203.0.113.5');

    // Upstream signals must contain all 3 feeds
    const signalSources = digest.upstreamSignals.map(s => s.sourceId);
    expect(signalSources).toContain('ipsum');
    expect(signalSources).toContain('blocklist_de');
    expect(signalSources).toContain('emerging_threats');
  });

  it('should consolidate multiple Phishing blocklist entries on the same day into one UVI identifier', () => {
    const raw: UviAdvisoryRecord[] = [
      makeMockAdvisory({
        uviId: 'UVI-PHISH-1-secure-login-example.com',
        title: 'OpenPhish: Zero-Day Phishing Portal (secure-login-example.com)',
        publishedDate: '2026-10-29',
        domainCategory: 'Enterprise & Web Frameworks',
        affectedTargets: [{ product: 'secure-login-example.com', ecosystem: 'Web Phishing', affectedVersions: 'Active Portal', fixedInVersion: 'Sinkhole' }],
        upstreamSignals: [{ sourceId: 'openphish', sourceName: 'OpenPhish', badge: 'Zero-Day Phish', finding: 'https://secure-login-example.com/login', signalType: 'PHISHING_URL', confidence: 'CONFIRMED' }]
      }),
      makeMockAdvisory({
        uviId: 'UVI-PHISH-2-account-verify-corp.com',
        title: 'OpenPhish: Zero-Day Phishing Portal (account-verify-corp.com)',
        publishedDate: '2026-10-29',
        domainCategory: 'Enterprise & Web Frameworks',
        affectedTargets: [{ product: 'account-verify-corp.com', ecosystem: 'Web Phishing', affectedVersions: 'Active Portal', fixedInVersion: 'Sinkhole' }],
        upstreamSignals: [{ sourceId: 'openphish', sourceName: 'OpenPhish', badge: 'Zero-Day Phish', finding: 'https://account-verify-corp.com/oauth', signalType: 'PHISHING_URL', confidence: 'CONFIRMED' }]
      })
    ];

    const grouped = groupBlocklistAdvisories(raw);
    expect(grouped.length).toBe(1);

    const digest = grouped[0];
    expect(digest.uviId).toBe('UVI-PHISH-BLOCKLIST-2026-10-29');
    expect(digest.title).toContain('Zero-Day Phishing');
    expect(digest.severity).toBe('CRITICAL');
    expect(digest.affectedTargets.length).toBe(2);
    expect(digest.upstreamSignals[0].sourceId).toBe('openphish');
  });

  it('should separate blocklist entries across different days into distinct daily digests', () => {
    const raw: UviAdvisoryRecord[] = [
      makeMockAdvisory({
        uviId: 'UVI-IPSUM-1.1.1.1',
        title: 'IPsum 1.1.1.1',
        publishedDate: '2026-10-28',
        affectedTargets: [{ product: '1.1.1.1', ecosystem: 'IP', affectedVersions: '5', fixedInVersion: 'Drop' }]
      }),
      makeMockAdvisory({
        uviId: 'UVI-IPSUM-1.1.1.2',
        title: 'IPsum 1.1.1.2',
        publishedDate: '2026-10-28',
        affectedTargets: [{ product: '1.1.1.2', ecosystem: 'IP', affectedVersions: '6', fixedInVersion: 'Drop' }]
      }),
      makeMockAdvisory({
        uviId: 'UVI-IPSUM-2.2.2.1',
        title: 'IPsum 2.2.2.1',
        publishedDate: '2026-10-29',
        affectedTargets: [{ product: '2.2.2.1', ecosystem: 'IP', affectedVersions: '8', fixedInVersion: 'Drop' }]
      })
    ];

    const grouped = groupBlocklistAdvisories(raw);
    expect(grouped.length).toBe(2);

    const ids = grouped.map(g => g.uviId);
    expect(ids).toContain('UVI-IP-BLOCKLIST-2026-10-28');
    expect(ids).toContain('UVI-IP-BLOCKLIST-2026-10-29');
  });

  it('should preserve standard CVE and non-blocklist malware advisories without modification', () => {
    const cveRecord = makeMockAdvisory({
      uviId: 'UVI-2026-10-00000001',
      title: 'Critical Remote Code Execution in Apache Server',
      cveList: ['CVE-2026-4444'],
      domainCategory: 'Operating Systems & Kernels',
      publishedDate: '2026-10-29'
    });

    const ipRecord1 = makeMockAdvisory({
      uviId: 'UVI-IPSUM-3.3.3.1',
      publishedDate: '2026-10-29',
      affectedTargets: [{ product: '3.3.3.1', ecosystem: 'IP', affectedVersions: '4', fixedInVersion: 'Drop' }]
    });

    const ipRecord2 = makeMockAdvisory({
      uviId: 'UVI-IPSUM-3.3.3.2',
      publishedDate: '2026-10-29',
      affectedTargets: [{ product: '3.3.3.2', ecosystem: 'IP', affectedVersions: '9', fixedInVersion: 'Drop' }]
    });

    const grouped = groupBlocklistAdvisories([cveRecord, ipRecord1, ipRecord2]);
    expect(grouped.length).toBe(2); // 1 CVE + 1 grouped IP blocklist digest

    const foundCve = grouped.find(r => r.cveList.includes('CVE-2026-4444'));
    expect(foundCve).toBeDefined();
    expect(foundCve?.title).toBe('Critical Remote Code Execution in Apache Server');

    const foundDigest = grouped.find(r => r.uviId.includes('IP-BLOCKLIST'));
    expect(foundDigest).toBeDefined();
    expect(foundDigest?.affectedTargets.length).toBe(2);
  });

  it('should standardize properly through standardizeUviAdvisories with legacy ID preserved', () => {
    const ipRecords = [
      makeMockAdvisory({ uviId: 'UVI-IPSUM-4.4.4.1', publishedDate: '2026-10-29' }),
      makeMockAdvisory({ uviId: 'UVI-IPSUM-4.4.4.2', publishedDate: '2026-10-29' })
    ];

    const standardized = standardizeUviAdvisories(ipRecords);
    expect(standardized.length).toBe(1);
    expect(standardized[0].uviId).toMatch(/^UVI-2026-10-\d{8}$/);
    expect(standardized[0].legacyUviId).toBe('UVI-IP-BLOCKLIST-2026-10-29');
  });
});
