import { describe, it, expect } from 'vitest';
import {
  VALKYRIE_PROBE_CATALOG,
  executeValkyrieProbe,
  compileValkyrieProbeScript,
  generateExecutivePentestReport,
  type PentestExecutionRequest
} from '../src/lib/valkyrie-data';

describe('Valkyrie On-Demand Pentest & BAS Suite', () => {
  it('should load probe catalog with critical Vantage CVEs', () => {
    expect(VALKYRIE_PROBE_CATALOG.length).toBeGreaterThanOrEqual(10);

    const cveRefs = VALKYRIE_PROBE_CATALOG.map(p => p.cveRef);
    expect(cveRefs).toContain('CVE-2024-6387'); // RegreSSHion
    expect(cveRefs).toContain('CVE-2024-3094'); // XZ Backdoor
    expect(cveRefs).toContain('CVE-2021-44228'); // Log4Shell
    expect(cveRefs).toContain('CVE-2024-47176'); // CUPS
    expect(cveRefs).toContain('CVE-2024-21626'); // Leaky Vessels runc
  });

  it('should validate probe vector properties', () => {
    for (const probe of VALKYRIE_PROBE_CATALOG) {
      expect(probe.id).toBeTruthy();
      expect(probe.name).toBeTruthy();
      expect(probe.cvss).toBeGreaterThan(0);
      expect(probe.defaultPort).toBeGreaterThan(0);
      expect(['TCP', 'UDP', 'HTTP', 'HTTPS']).toContain(probe.probeProtocol);
      expect(probe.safePayloadDescription).toBeTruthy();
      expect(probe.remediationSummary).toBeTruthy();
      expect(probe.probeCode.bash).toBeTruthy();
      expect(probe.probeCode.curl).toBeTruthy();
    }
  });

  it('should execute a safe simulated pentest probe and return structured findings', () => {
    const probe = VALKYRIE_PROBE_CATALOG.find(p => p.cveRef === 'CVE-2024-6387')!;
    const req: PentestExecutionRequest = {
      targetHost: '10.0.0.50',
      targetPort: 22,
      targetType: 'simulated_sandbox',
      probeId: probe.id,
      cveRef: probe.cveRef,
      protocol: 'TCP',
      timeoutMs: 4000
    };

    const result = executeValkyrieProbe(req, probe);
    expect(result).toBeDefined();
    expect(result.scanId).toMatch(/^VALK-\d{8}-[A-Z0-9]+$/);
    expect(result.confidencePercent).toBeGreaterThanOrEqual(90);
    expect(result.logs.length).toBeGreaterThan(3);
    expect(result.attestationHash).toMatch(/^valk_attest_/);
    expect(result.praxisRemediationLink).toContain('cve=CVE-2024-6387');
    expect(result.erisChaosLink).toContain('cve=CVE-2024-6387');
  });

  it('should recognize Praxis defended targets and report DEFENDED status', () => {
    const probe = VALKYRIE_PROBE_CATALOG.find(p => p.cveRef === 'CVE-2021-44228')!;
    const req: PentestExecutionRequest = {
      targetHost: 'praxis-defended.internal',
      targetPort: 8080,
      targetType: 'remote_host',
      probeId: probe.id,
      cveRef: probe.cveRef,
      protocol: 'HTTP',
      timeoutMs: 4000
    };

    const result = executeValkyrieProbe(req, probe);
    expect(result.status).toBe('DEFENDED');
    expect(result.detectedBanner).toContain('Praxis');
  });

  it('should compile an executable self-contained CLI script', () => {
    const probe = VALKYRIE_PROBE_CATALOG.find(p => p.cveRef === 'CVE-2024-47176')!;
    const script = compileValkyrieProbeScript(probe, '192.168.1.100', 631);

    expect(script).toContain('#!/usr/bin/env bash');
    expect(script).toContain('TARGET_HOST="192.168.1.100"');
    expect(script).toContain('TARGET_PORT="631"');
    expect(script).toContain('CVE-2024-47176');
  });

  it('should generate an executive penetration test markdown report', () => {
    const probe = VALKYRIE_PROBE_CATALOG[0];
    const req: PentestExecutionRequest = {
      targetHost: 'prod-api.corp',
      targetPort: probe.defaultPort,
      targetType: 'remote_host',
      probeId: probe.id,
      cveRef: probe.cveRef,
      protocol: probe.probeProtocol,
      timeoutMs: 4000
    };

    const result = executeValkyrieProbe(req, probe);
    const report = generateExecutivePentestReport(result);

    expect(report).toContain('VALKYRIE EXECUTIVE PENETRATION TEST & EXPLOITABILITY ATTESTATION');
    expect(report).toContain(result.scanId);
    expect(report).toContain(result.attestationHash);
    expect(report).toContain('Praxis Virtual Hotpatch:');
    expect(report).toContain('Eris Chaos Lab Verification:');
  });
});
