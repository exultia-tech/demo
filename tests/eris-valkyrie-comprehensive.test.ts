import { describe, it, expect } from 'vitest';
import {
  ERIS_MODULES,
  VULNERABLE_CONTAINER_SCENARIOS,
  ERIS_COMPOSE_MANIFEST,
  compileErisChaosScript,
  ERIS_MANDATORY_DISCLAIMER,
  PERDITION_MODULES,
  CRUCIBLE_MODULES,
  type ErisModule
} from '../src/lib/eris-data';
import {
  VALKYRIE_PROBE_CATALOG,
  executeValkyrieProbe,
  compileValkyrieProbeScript,
  generateExecutivePentestReport,
  type PentestExecutionRequest
} from '../src/lib/valkyrie-data';
import { calculateBundleDiscount, getDiscountedProductPrice } from '../src/lib/bundle-pricing';
import { calculateErisDiscount } from '../src/lib/eris-pricing';

describe('Comprehensive Eris & Valkyrie Integration Suite', () => {
  describe('Eris Proving Ground & Inoculation Engine', () => {
    it('should validate all Eris modules for structure, severity, and safe teardown', () => {
      expect(ERIS_MODULES.length).toBeGreaterThanOrEqual(6);

      for (const mod of ERIS_MODULES) {
        expect(mod.id).toBeTruthy();
        expect(mod.title).toBeTruthy();
        expect(mod.cvss).toBeGreaterThanOrEqual(1.0);
        expect(mod.cvss).toBeLessThanOrEqual(10.0);
        expect(['CRITICAL', 'HIGH', 'MEDIUM']).toContain(mod.severity);
        expect(['NETWORK', 'SSH_DAEMON', 'PRIVILEGE_ESCALATION', 'IDENTITY', 'SERVICES', 'DEFENSE_EVASION']).toContain(mod.category);
        expect(mod.setupCommands.length).toBeGreaterThan(0);
        expect(mod.teardownCommands.length).toBeGreaterThan(0);
        expect(mod.praxisDetectionMechanism).toBeTruthy();
        expect(mod.praxisRemediationClass).toBeTruthy();
      }
    });

    it('should validate all vulnerable container scenarios and Docker compose manifest', () => {
      expect(VULNERABLE_CONTAINER_SCENARIOS.length).toBeGreaterThanOrEqual(5);

      for (const scenario of VULNERABLE_CONTAINER_SCENARIOS) {
        expect(scenario.id).toBeTruthy();
        expect(scenario.cveId).toMatch(/CVE-\d{4}-\d+/);
        expect(scenario.dockerRunCommand).toContain('docker run');
        expect(scenario.verificationCommand).toBeTruthy();
        expect(scenario.dockerfile).toContain('FROM');
        expect(scenario.praxisRemediationTier).toBeTruthy();
      }

      // Compose manifest should define isolated bridge network and target containers
      expect(ERIS_COMPOSE_MANIFEST).toContain('version:');
      expect(ERIS_COMPOSE_MANIFEST).toContain('eris-range:');
      expect(ERIS_COMPOSE_MANIFEST).toContain('regresshion-target:');
      expect(ERIS_COMPOSE_MANIFEST).toContain('cups-browsed-target:');
      expect(ERIS_COMPOSE_MANIFEST).toContain('c2-beacon-target:');
      expect(ERIS_COMPOSE_MANIFEST).toContain('xz-target:');
      expect(ERIS_COMPOSE_MANIFEST).toContain('log4shell-target:');
      expect(ERIS_COMPOSE_MANIFEST).toContain('php-cgi-target:');
    });

    it('should compile an OS-targeted chaos script with safety disclaimer and timed watchdog', () => {
      const result = compileErisChaosScript({
        os: 'debian',
        autoRollbackMinutes: 45
      });

      expect(result.script).toContain('#!/usr/bin/env bash');
      expect(result.script).toContain('EXULTIA ERIS: CONTROLLED VULNERABILITY INOCULATION SCRIPT');
      expect(result.script).toContain('STRICTLY PROHIBITED IN PRODUCTION');
      expect(result.script).toContain('Target OS: debian');
      expect(result.script).toContain('Automatic Failsafe Rollback Timer (45 minutes)');
      expect(result.script).toContain('--rollback');
      expect(result.script).toContain('eris-manifest.json');
      expect(result.activeModules.length).toBeGreaterThan(0);
      expect(result.rollbackCommand).toBe('/var/log/eris/eris-setup.sh --rollback');
    });

    it('should maintain backwards compatibility with legacy aliases (Perdition & Crucible)', () => {
      expect(PERDITION_MODULES).toBe(ERIS_MODULES);
      expect(CRUCIBLE_MODULES).toBe(ERIS_MODULES);
    });
  });

  describe('Valkyrie On-Demand Pentesting & Attestation Engine', () => {
    it('should validate complete probe catalog across multiple network & application protocols', () => {
      expect(VALKYRIE_PROBE_CATALOG.length).toBeGreaterThanOrEqual(10);

      const protocols = new Set(VALKYRIE_PROBE_CATALOG.map(p => p.probeProtocol));
      expect(protocols.has('TCP')).toBe(true);
      expect(protocols.has('UDP')).toBe(true);
      expect(protocols.has('HTTP')).toBe(true);

      const criticalProbes = VALKYRIE_PROBE_CATALOG.filter(p => p.severity === 'CRITICAL');
      expect(criticalProbes.length).toBeGreaterThanOrEqual(5);
    });

    it('should compile probe scripts and provide Bash, Curl, and Python probe implementations', () => {
      const probe = VALKYRIE_PROBE_CATALOG[0];
      const targetHost = '192.168.1.50';
      const targetPort = 8443;

      const bashScript = compileValkyrieProbeScript(probe, targetHost, targetPort);
      expect(bashScript).toContain(targetHost);
      expect(bashScript).toContain('VALKYRIE ON-DEMAND PENTEST PROBE CLI');
      expect(bashScript).toContain('set -euo pipefail');

      expect(probe.probeCode.python).toBeTruthy();
      expect(probe.probeCode.curl).toBeTruthy();
      expect(probe.probeCode.bash).toBeTruthy();
    });

    it('should execute end-to-end simulated probe and generate verifiable HMAC-SHA256 attestation', () => {
      const probe = VALKYRIE_PROBE_CATALOG.find(p => p.id === 'probe-regresshion')!;
      expect(probe).toBeDefined();

      const req: PentestExecutionRequest = {
        targetHost: '10.10.10.15',
        targetPort: 22,
        targetType: 'remote_host',
        probeId: probe.id,
        cveRef: probe.cveRef,
        protocol: 'TCP',
        timeoutMs: 5000
      };

      const result = executeValkyrieProbe(req, probe);
      expect(result.scanId).toMatch(/^VALK-\d{8}-[A-Z0-9]+$/);
      expect(result.target).toBe('10.10.10.15:22');
      expect(result.probe.id).toBe('probe-regresshion');
      expect(result.probe.cveRef).toBe('CVE-2024-6387');
      expect(result.attestationHash).toMatch(/^valk_attest_/);
      expect(result.logs.length).toBeGreaterThan(0);
      expect(result.praxisRemediationLink).toContain('/app/praxis?cve=CVE-2024-6387');
      expect(result.erisChaosLink).toContain('/app/eris?cve=CVE-2024-6387');
    });

    it('should produce structured executive pentest reports with compliance mappings', () => {
      const probe = VALKYRIE_PROBE_CATALOG[0];
      const execResult = executeValkyrieProbe(
        {
          targetHost: '10.0.0.1',
          targetPort: 80,
          targetType: 'simulated_sandbox',
          probeId: probe.id,
          cveRef: probe.cveRef,
          protocol: 'HTTP',
          timeoutMs: 2000
        },
        probe
      );

      const report = generateExecutivePentestReport(execResult);
      expect(report).toContain('VALKYRIE EXECUTIVE PENETRATION TEST & EXPLOITABILITY ATTESTATION');
      expect(report).toContain(execResult.scanId);
      expect(report).toContain(execResult.attestationHash);
      expect(report).toContain('Executive Summary');
    });
  });

  describe('Sovereignty Ecosystem Cross-Product Bundle Verification', () => {
    it('should verify 30%, 40%, and 50% discount tiers for Valkyrie when bundled with Vantage, Praxis, and Eris', () => {
      // 0 companions -> 0%
      const tier0 = calculateBundleDiscount('valkyrie', {});
      expect(tier0.discountPercent).toBe(0);

      // 1 companion (e.g. Vantage) -> 30%
      const tier1 = calculateBundleDiscount('valkyrie', { hasVantage: true });
      expect(tier1.discountPercent).toBe(30);
      expect(tier1.discountMultiplier).toBe(0.7);

      // 2 companions (e.g. Vantage + Praxis) -> 40%
      const tier2 = calculateBundleDiscount('valkyrie', { hasVantage: true, hasPraxis: true });
      expect(tier2.discountPercent).toBe(40);
      expect(tier2.discountMultiplier).toBe(0.6);

      // 3 companions (Vantage + Praxis + Eris) -> 50%
      const tier3 = calculateBundleDiscount('valkyrie', { hasVantage: true, hasPraxis: true, hasEris: true });
      expect(tier3.discountPercent).toBe(50);
      expect(tier3.discountMultiplier).toBe(0.5);

      // Verify Eris side calculation behaves symmetrically
      const erisDiscount1 = calculateErisDiscount(true, false, false);
      expect(erisDiscount1.discountPercent).toBe(30);

      const erisDiscount2 = calculateErisDiscount(true, true, false);
      expect(erisDiscount2.discountPercent).toBe(40);

      const erisDiscount3 = calculateErisDiscount(true, true, true);
      expect(erisDiscount3.discountPercent).toBe(50);
    });
  });
});
